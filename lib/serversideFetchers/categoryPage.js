// lib/serversideFetchers/categoryPage.js
//
// ── PURPOSE ───────────────────────────────────────────────────────────────
// Single entry point for everything a category page needs:
//   category info, filter sidebar options, the current page of products,
//   and pagination info — all in one server-side call, no API route.
//
// Call this directly from a Server Component:
//
//   const data = await getCategoryPageData({ slug, searchParams, userRole });
//   if (!data) notFound();
//
// Returns:
//   {
//     category,        // { _id, name, slug, image, description, seoIntro, buyingGuide, faqs }
//     filterOptions,    // { colors, brands, sizes, ... , retailPriceRange, enterprisePriceRange }
//     products,         // array of product docs for the CURRENT page/filters
//     pagination,       // { page, limit, totalCount, totalPages, hasNextPage, hasPrevPage }
//   }
//   or null if the category doesn't exist.
// ─────────────────────────────────────────────────────────────────────────

import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";
import Application from "@/models/application";

const PRODUCT_CARD_FIELDS =
  "name slug images brand isFeatured material application " +
  "retailPrice retailDiscountPrice enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise " +
  "color size thickness stock createdAt";

const PRODUCTS_PER_PAGE = 24;

function parseCSV(str) {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

const flatUniq = (arr) => [...new Set((arr || []).flat().filter(Boolean))].sort();

// ── 1. Resolve the category document ───────────────────────────────────────

async function resolveCategory(slug) {
  if (slug === "all") {
    return {
      _id: "all",
      name: "All Products",
      slug: "all",
      image: null,
      description: "Browse all products across all categories.",
    };
  }

  return await Category.findOne({ slug })
    .select("_id name slug image description seoIntro buyingGuide faqs")
    .lean();
  // no JSON.parse(JSON.stringify()) here anymore
}

// ── 2. Filter sidebar options — simplified: Mongo does all the dedup ───────
async function fetchFilterOptions(categoryId) {
  const matchStage = categoryId === "all" ? {} : { category: categoryId };

  const [agg] = await Product.aggregate([
    { $match: matchStage },
    // Flatten array fields BEFORE grouping so $addToSet produces clean 1D arrays
    { $unwind: { path: "$color", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$material", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$pattern", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$finish", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$application", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        colors: { $addToSet: "$color" },
        brands: { $addToSet: "$brand" },
        sizes: { $addToSet: "$size" },
        thicknesses: { $addToSet: "$thickness" },
        materials: { $addToSet: "$material" },
        patterns: { $addToSet: "$pattern" },
        finishes: { $addToSet: "$finish" },
        applicationIds: { $addToSet: "$application" },
        minRetailPrice: { $min: "$retailDiscountPrice" },
        maxRetailPrice: { $max: "$retailDiscountPrice" },
        minRetailBase: { $min: "$retailPrice" },
        maxRetailBase: { $max: "$retailPrice" },
        minEnterprisePrice: { $min: "$enterpriseDiscountPrice" },
        maxEnterprisePrice: { $max: "$enterpriseDiscountPrice" },
        minEnterpriseBase: { $min: "$enterprisePrice" },
        maxEnterpriseBase: { $max: "$enterprisePrice" },
      },
    },
  ]);

  const empty = {
    colors: [], brands: [], sizes: [], thicknesses: [],
    materials: [], patterns: [], finishes: [], applications: [],
    retailPriceRange: { min: 0, max: 100000 },
    enterprisePriceRange: { min: 0, max: 100000 },
  };

  if (!agg) return empty;

  const clean = (arr) =>
    (arr || [])
      .flat()
      .filter((x) => x !== null && x !== undefined && x !== "")
      .sort();

  let applications = [];
  const appIds = (agg.applicationIds || []).filter(Boolean);
  if (appIds.length) {
    try {
      const appDocs = await Application.find({ _id: { $in: appIds } })
        .select("name slug")
        .lean();
      applications = appDocs
        .filter((a) => a.slug)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.warn("[newCategoryFetcher] applications lookup failed:", err.message);
    }
  }

  const roundDown = (n) => Math.floor((n ?? 0) / 100) * 100;
  const roundUp = (n) => Math.ceil((n ?? 100000) / 100) * 100;

  return {
    colors: clean(agg.colors),
    brands: clean(agg.brands),
    sizes: clean(agg.sizes),
    thicknesses: (agg.thicknesses || []).filter(Boolean).sort((a, b) => a - b),
    materials: clean(agg.materials),
    patterns: clean(agg.patterns),
    finishes: clean(agg.finishes),
    applications,
    retailPriceRange: {
      min: roundDown(Math.min(agg.minRetailPrice ?? Infinity, agg.minRetailBase ?? Infinity)),
      max: roundUp(Math.max(agg.maxRetailPrice ?? 0, agg.maxRetailBase ?? 0)),
    },
    enterprisePriceRange: {
      min: roundDown(Math.min(agg.minEnterprisePrice ?? Infinity, agg.minEnterpriseBase ?? Infinity)),
      max: roundUp(Math.max(agg.maxEnterprisePrice ?? 0, agg.maxEnterpriseBase ?? 0)),
    },
  };
}

// ── 3. Filtered, sorted, paginated products for the CURRENT view ──────────

async function fetchProducts({ categoryId, searchParams, userRole }) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const limit = PRODUCTS_PER_PAGE;
  const sortBy = searchParams.sortBy || "newest";

  const filter = categoryId === "all" ? {} : { category: categoryId };

  // Price — same discount-or-fallback logic as before
  const priceField = userRole === "enterprise" ? "enterpriseDiscountPrice" : "retailDiscountPrice";
  const fallbackPriceField = userRole === "enterprise" ? "enterprisePrice" : "retailPrice";

  if (searchParams.minPrice || searchParams.maxPrice) {
    const min = searchParams.minPrice ? parseFloat(searchParams.minPrice) : 0;
    const max = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : Number.MAX_SAFE_INTEGER;

    filter.$expr = {
      $and: [
        { $gte: [{ $ifNull: [`$${priceField}`, `$${fallbackPriceField}`] }, min] },
        { $lte: [{ $ifNull: [`$${priceField}`, `$${fallbackPriceField}`] }, max] },
      ],
    };
  }

  const colors = parseCSV(searchParams.colors);
  if (colors.length) filter.color = { $in: colors };

  const brands = parseCSV(searchParams.brands);
  if (brands.length) filter.brand = { $in: brands };

  const sizes = parseCSV(searchParams.sizes);
  if (sizes.length) filter.size = { $in: sizes };

  const thicknesses = parseCSV(searchParams.thicknesses).map(Number);
  if (thicknesses.length) filter.thickness = { $in: thicknesses };

  const materials = parseCSV(searchParams.materials);
  if (materials.length) filter.material = { $in: materials };

  const patterns = parseCSV(searchParams.patterns);
  if (patterns.length) filter.pattern = { $in: patterns };

  const finishes = parseCSV(searchParams.finishes);
  if (finishes.length) filter.finish = { $in: finishes };

  const applicationSlugs = parseCSV(searchParams.applications);
  if (applicationSlugs.length) {
    const appDocs = await Application.find({ slug: { $in: applicationSlugs } }).select("_id").lean();
    filter.application = { $in: appDocs.map((a) => a._id) };
  }

  if (searchParams.inStock === "true") filter.stock = { $gt: 0 };
  if (searchParams.subType) filter.subType = searchParams.subType;

  let sort = { createdAt: -1 };
  if (sortBy === "priceLowHigh") sort = { [priceField]: 1, [fallbackPriceField]: 1 };
  if (sortBy === "priceHighLow") sort = { [priceField]: -1, [fallbackPriceField]: -1 };
  if (sortBy === "nameAZ") sort = { name: 1 };

  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .select(PRODUCT_CARD_FIELDS)
      .populate("application", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    products: JSON.parse(JSON.stringify(products)),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

// ── Public entry point ──────────────────────────────────────────────────────

export async function getCategoryPageData({ slug, searchParams = {}, userRole = "user" }) {
  await DbConnect();

  try {
    const category = await resolveCategory(slug);
    if (!category) return null;

    const [filterOptions, { products, pagination }] = await Promise.all([
      fetchFilterOptions(category._id),
      fetchProducts({ categoryId: category._id, searchParams, userRole }),
    ]);

    // Serialize ONCE, here, right before this data crosses into any
    // Client Component (NewFilterSidebar). Everything before this point
    // used real Mongo types (ObjectId) so queries/aggregations work correctly.
    return JSON.parse(JSON.stringify({ category, filterOptions, products, pagination }));
  } catch (err) {
    console.error("[getCategoryPageData] error:", err);
    return null;
  }
}


export async function getCategoryMeta(slug) {
  await DbConnect();
  try {
    const category = await resolveCategory(slug);
    return category ? JSON.parse(JSON.stringify(category)) : null;
  } catch (err) {
    console.error("[getCategoryMeta] error:", err);
    return null;
  }
}