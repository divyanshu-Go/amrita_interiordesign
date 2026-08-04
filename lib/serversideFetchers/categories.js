import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";

export async function getPopularCategories(limit = 6) {
  await DbConnect();
  try {
    // 1. Group products by category ID and sort by total count
    const counts = await Product.aggregate([
      { $unwind: "$category" },
      { $group: { _id: "$category", productCount: { $sum: 1 } } },
      { $sort: { productCount: -1 } },
      { $limit: limit },
    ]);

    if (!counts.length) return [];

    const categoryIds = counts.map((c) => c._id);
    const categoryDocs = await Category.find({ _id: { $in: categoryIds } })
      .select("name slug image")
      .lean();

    const countMap = Object.fromEntries(
      counts.map((c) => [String(c._id), c.productCount])
    );

    // 2. Preserve aggregation order
    const orderedCategories = categoryIds
      .map((id) => categoryDocs.find((cat) => String(cat._id) === String(id)))
      .filter(Boolean)
      .map((cat) => ({
        ...cat,
        _id: String(cat._id),
        productCount: countMap[String(cat._id)] || 0,
      }));

    return JSON.parse(JSON.stringify(orderedCategories));
  } catch (err) {
    console.error("Error fetching popular categories:", err);
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