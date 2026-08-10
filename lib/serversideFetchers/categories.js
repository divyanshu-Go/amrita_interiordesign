// lib/serversideFetchers/categories.js
import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";

export async function getCategories() {
  await DbConnect();
  try {
    const data = await Category.find()
      .select("name slug image description startingPrice isTrending trendingTagline")
      .sort({ isTrending: -1, createdAt: -1 }) // trending ones first
      .lean();
    return JSON.parse(JSON.stringify(data));
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

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
    console.error("Error fetching category by slug:", err);
    return null;
  }
}