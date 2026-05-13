// lib/fetchers/serverCategories.js
//
// ── WHAT CHANGED ──────────────────────────────────────────────────────────
// Added getCategoryFilterOptions() — fetches ONLY the data needed to
// populate the filter sidebar (unique colors, brands, price range, etc.)
// without fetching full product documents.
//
// The category page server component now:
//   1. Calls getCategoryFilterOptions() → used to render the sidebar
//   2. Does NOT pre-fetch products (API route handles that on client)
//
// This keeps the initial page load fast while still allowing full SSR
// of the filter sidebar options (so Google sees them).
// ─────────────────────────────────────────────────────────────────────────

import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";
import Application from "@/models/application"; // adjust import path if needed

const PRODUCT_CARD_FIELDS =
  "name slug images brand isFeatured material application " +
  "retailPrice retailDiscountPrice " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise";

export async function getAllCategories() {
  await DbConnect();
  try {
    const data = await Category.find()
      .select("name slug image description isTrending trendingTagline")
      .lean();
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  await DbConnect();
  try {
    if (slug === "all") {
      const products = await Product.find()
        .select(PRODUCT_CARD_FIELDS)
        .lean();
      return {
        category: {
          _id: "all",
          name: "All Products",
          slug: "all",
          image: null,
          description: "Browse all products across all categories.",
        },
        products: JSON.parse(JSON.stringify(products)),
      };
    }

    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;

    const products = await Product.find({ category: category._id })
      .select(PRODUCT_CARD_FIELDS)
      .lean();

    return JSON.parse(JSON.stringify({ category, products }));
  } catch (err) {
    console.error("Error fetching category:", err);
    return null;
  }
}

// ── NEW: getCategoryFilterOptions ─────────────────────────────────────────
// Returns only the data needed to build the filter sidebar.
// Uses MongoDB aggregation to get distinct values in a single query
// instead of fetching all product documents.
//
// Returns:
//   { category, filterOptions: { colors, brands, sizes, thicknesses,
//     materials, patterns, finishes, applications, priceRange } }
// ─────────────────────────────────────────────────────────────────────────
export async function getCategoryFilterOptions(slug) {
  await DbConnect();
  try {
    let categoryDoc = null;
    let matchStage = {};

    if (slug === "all") {
      categoryDoc = {
        _id: "all",
        name: "All Products",
        slug: "all",
        image: null,
        description: "Browse all products across all categories.",
      };
    } else {
      categoryDoc = await Category.findOne({ slug })
        .select("_id name slug image description")
        .lean();
      if (!categoryDoc) return null;
      matchStage = { category: categoryDoc._id };
    }

    // Single aggregation pipeline to get all distinct filter values
    // and min/max prices in one round-trip to MongoDB.
    const [agg] = await Product.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          colors: { $addToSet: "$color" },
          brands: { $addToSet: "$brand" },
          sizes: { $addToSet: "$size" },
          thicknesses: { $addToSet: "$thickness" },
          materials: { $push: "$material" },
          patterns: { $push: "$pattern" },
          finishes: { $push: "$finish" },
          applicationIds: { $push: "$application" },
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

    if (!agg) {
      return {
        category: JSON.parse(JSON.stringify(categoryDoc)),
        filterOptions: {
          colors: [],
          brands: [],
          sizes: [],
          thicknesses: [],
          materials: [],
          patterns: [],
          finishes: [],
          applications: [],
          retailPriceRange: { min: 0, max: 100000 },
          enterprisePriceRange: { min: 0, max: 100000 },
        },
      };
    }

    // Flatten and deduplicate array fields.
    // Guard with `|| []` — $addToSet/$push can return undefined if all
    // documents in the category have null for that field.
    const flatUniq = (arr) =>
      [...new Set((arr || []).flat().filter(Boolean))].sort();

    // Resolve application ObjectIds → { name, slug } objects.
    // applicationIds is an array-of-arrays (one entry per product); flatten it.
    const allAppIds = [
      ...new Set(
        (agg.applicationIds || [])
          .flat()
          .filter(Boolean)
          .map((id) => id.toString())
      ),
    ];

    let applications = [];
    if (allAppIds.length) {
      try {
        const appDocs = await Application.find({ _id: { $in: allAppIds } })
          .select("name slug")
          .lean();
        applications = appDocs
          .filter((a) => a.slug)
          .sort((a, b) => a.name.localeCompare(b.name));
      } catch (appErr) {
        // If the Application model import fails or the collection is missing,
        // degrade gracefully — show no application filters rather than crash.
        console.warn("[getCategoryFilterOptions] Could not fetch applications:", appErr.message);
        applications = [];
      }
    }

    const roundDown = (n) => Math.floor((n ?? 0) / 100) * 100;
    const roundUp = (n) => Math.ceil((n ?? 100000) / 100) * 100;

    const filterOptions = {
      colors: flatUniq(agg.colors),
      brands: flatUniq(agg.brands),
      sizes: flatUniq(agg.sizes),
      // thicknesses are Numbers — use || [] guard, then filter/sort numerically
      thicknesses: [...new Set((agg.thicknesses || []).filter(Boolean))].sort(
        (a, b) => a - b
      ),
      materials: flatUniq(agg.materials),
      patterns: flatUniq(agg.patterns),
      finishes: flatUniq(agg.finishes),
      applications: JSON.parse(JSON.stringify(applications)),
      // Both price ranges so the client can pick based on userRole
      retailPriceRange: {
        min: roundDown(
          Math.min(agg.minRetailPrice ?? Infinity, agg.minRetailBase ?? Infinity)
        ),
        max: roundUp(
          Math.max(agg.maxRetailPrice ?? 0, agg.maxRetailBase ?? 0)
        ),
      },
      enterprisePriceRange: {
        min: roundDown(
          Math.min(
            agg.minEnterprisePrice ?? Infinity,
            agg.minEnterpriseBase ?? Infinity
          )
        ),
        max: roundUp(
          Math.max(agg.maxEnterprisePrice ?? 0, agg.maxEnterpriseBase ?? 0)
        ),
      },
    };

    return {
      category: JSON.parse(JSON.stringify(categoryDoc)),
      filterOptions,
    };
  } catch (err) {
    console.error("Error fetching category filter options:", err);
    return null;
  }
}

export async function getTrendingCategories(limit = 10) {
  await DbConnect();
  try {
    const data = await Category.find({ isTrending: true })
      .select("name slug image trendingTagline")
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.error("Error fetching trending categories:", err);
    return [];
  }
}

export async function getOnlyCategoryBySlug(slug) {
  await DbConnect();
  try {
    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;
    return JSON.parse(JSON.stringify(category));
  } catch (err) {
    console.error("Error fetching admin category:", err);
    return null;
  }
}