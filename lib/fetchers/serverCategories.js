// lib/fetchers/serverCategories.js
//


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
