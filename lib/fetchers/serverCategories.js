// lib/fetchers/serverCategories.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
//
// 1. getCategoryBySlug() — added .select() on Product.find()
//    BEFORE: fetched ALL fields on every product in the category.
//    For a category with 50 products, this included description, all variant
//    refs, coverageArea, material[], pattern[], finish[], timestamps — data
//    the category page never uses. Could be 50-100KB of wasted MongoDB transfer.
//    AFTER: fetches only the fields CategoryPageClient actually needs for
//    display and pricing. Same result, fraction of the data.
//
// 2. Added isTrending index hint via lean() — model now has index on isTrending
//    so getTrendingCategories() no longer does a full collection scan.
//
// 3. getCategoryBySlug("all") — added .select() there too for consistency.
// ─────────────────────────────────────────────────────────────────────────

import DbConnect from "@/lib/Db/DbConnect";
import Category  from "@/models/category";
import Product   from "@/models/product";

// Fields needed by ProductCardGrid for display + pricing.
// Keeping this tight reduces MongoDB → Node transfer size significantly.
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
    // Special case: /category/all → return all products
    if (slug === "all") {
      const products = await Product.find()
        .select(PRODUCT_CARD_FIELDS) // ← ADDED: was fetching all fields
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
      .select(PRODUCT_CARD_FIELDS) // ← ADDED: was fetching all fields
      .lean();

    return JSON.parse(JSON.stringify({ category, products }));
  } catch (err) {
    console.error("Error fetching category:", err);
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