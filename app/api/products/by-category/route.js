// app/api/products/by-category/route.js
//
// ── PURPOSE ───────────────────────────────────────────────────────────────
// Single endpoint that handles ALL product fetching for category pages.
// Replaces client-side filtering entirely.
//
// Query params:
//   categorySlug  - required (use "all" for all products)
//   page          - default 1
//   limit         - default 24
//   sortBy        - newest | priceLowHigh | priceHighLow | nameAZ
//   userRole      - "enterprise" | "user" (affects which price field is used for sort/filter)
//   minPrice      - number
//   maxPrice      - number
//   colors        - comma-separated
//   brands        - comma-separated
//   sizes         - comma-separated
//   thicknesses   - comma-separated
//   materials     - comma-separated
//   patterns      - comma-separated
//   finishes      - comma-separated
//   applications  - comma-separated (slugs)
//   inStock       - "true"
// ─────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";
import Application from "@/models/application"; // adjust path if needed

// Fields returned to the client — same as before, keeps payload small
const PRODUCT_CARD_FIELDS =
  "name slug images brand isFeatured material application " +
  "retailPrice retailDiscountPrice stock color size thickness " +
  "enterprisePrice enterpriseDiscountPrice " +
  "sellBy showPerSqFtPrice perSqFtPriceRetail perSqFtPriceEnterprise createdAt";

function parseCSV(str) {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(request) {
  try {
    await DbConnect();

    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get("categorySlug");
    if (!categorySlug) {
      return NextResponse.json(
        { error: "categorySlug is required" },
        { status: 400 }
      );
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "24", 10))
    );
    const sortBy = searchParams.get("sortBy") || "newest";
    const userRole = searchParams.get("userRole") || "user";

    // ── Resolve category ──────────────────────────────────────────────────
    let categoryFilter = {};
    let categoryDoc = null;

    if (categorySlug !== "all") {
      categoryDoc = await Category.findOne({ slug: categorySlug })
        .select("_id name slug image description")
        .lean();
      if (!categoryDoc) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      categoryFilter = { category: categoryDoc._id };
    }

    // ── Build MongoDB filter ──────────────────────────────────────────────
    const mongoFilter = { ...categoryFilter };

    // Price — use the right price field based on userRole
    const priceField =
      userRole === "enterprise" ? "enterpriseDiscountPrice" : "retailDiscountPrice";
    const fallbackPriceField =
      userRole === "enterprise" ? "enterprisePrice" : "retailPrice";

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (minPrice !== null || maxPrice !== null) {
      // We use $expr to handle the "discountPrice OR fallback to basePrice" logic
      const min = minPrice !== null ? parseFloat(minPrice) : 0;
      const max = maxPrice !== null ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

      mongoFilter.$expr = {
        $and: [
          {
            $gte: [
              { $ifNull: [`$${priceField}`, `$${fallbackPriceField}`] },
              min,
            ],
          },
          {
            $lte: [
              { $ifNull: [`$${priceField}`, `$${fallbackPriceField}`] },
              max,
            ],
          },
        ],
      };
    }

    // Colors
    const colors = parseCSV(searchParams.get("colors"));
    if (colors.length) mongoFilter.color = { $in: colors };

    // Brands
    const brands = parseCSV(searchParams.get("brands"));
    if (brands.length) mongoFilter.brand = { $in: brands };

    // Sizes
    const sizes = parseCSV(searchParams.get("sizes"));
    if (sizes.length) mongoFilter.size = { $in: sizes };

    // Thicknesses (stored as Number)
    const thicknesses = parseCSV(searchParams.get("thicknesses")).map(Number);
    if (thicknesses.length) mongoFilter.thickness = { $in: thicknesses };

    // Materials (array field on product)
    const materials = parseCSV(searchParams.get("materials"));
    if (materials.length) mongoFilter.material = { $in: materials };

    // Patterns (array field on product)
    const patterns = parseCSV(searchParams.get("patterns"));
    if (patterns.length) mongoFilter.pattern = { $in: patterns };

    // Finishes (array field on product)
    const finishes = parseCSV(searchParams.get("finishes"));
    if (finishes.length) mongoFilter.finish = { $in: finishes };

    // Applications (stored as ObjectId refs; filter by slug → resolve to IDs)
    const applicationSlugs = parseCSV(searchParams.get("applications"));
    if (applicationSlugs.length) {
      const appDocs = await Application.find({ slug: { $in: applicationSlugs } })
        .select("_id")
        .lean();
      const appIds = appDocs.map((a) => a._id);
      mongoFilter.application = { $in: appIds };
    }

    // In-stock only
    if (searchParams.get("inStock") === "true") {
      mongoFilter.stock = { $gt: 0 };
    }

    // ── Sort ──────────────────────────────────────────────────────────────
    let sortStage = {};
    switch (sortBy) {
      case "priceLowHigh":
        sortStage = { [priceField]: 1, [fallbackPriceField]: 1 };
        break;
      case "priceHighLow":
        sortStage = { [priceField]: -1, [fallbackPriceField]: -1 };
        break;
      case "nameAZ":
        sortStage = { name: 1 };
        break;
      case "newest":
      default:
        sortStage = { createdAt: -1 };
        break;
    }

    // ── Query ─────────────────────────────────────────────────────────────
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(mongoFilter)
        .select(PRODUCT_CARD_FIELDS)
        .populate("application", "name slug") // populate so client can display labels
        .sort(sortStage)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(mongoFilter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      category: categoryDoc
        ? JSON.parse(JSON.stringify(categoryDoc))
        : {
            _id: "all",
            name: "All Products",
            slug: "all",
            image: null,
            description: "Browse all products across all categories.",
          },
    });
  } catch (err) {
    console.error("[by-category] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}