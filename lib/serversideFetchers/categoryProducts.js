import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

/**
 * ADMIN-ONLY
 * Get products belonging to a category
 */
export async function getAdminProductsByCategoryId(categoryId) {
  await DbConnect();

  try {
    const products = await Product.find({ category: categoryId })
      .select("name slug sku images")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Error fetching admin category products:", err);
    return [];
  }
}
