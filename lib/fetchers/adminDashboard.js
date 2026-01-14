import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";

export async function getAdminDashboardData() {
  await DbConnect();

  try {
    const [
      totalCategories,
      totalProducts,
      inStock,
      lowStock,
      recentCategories,
    ] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ stock: { $gt: 0 } }),
      Product.countDocuments({ stock: { $gt: 0, $lt: 10 } }),
      Category.find()
        .select("name slug image")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return {
      totalCategories,
      totalProducts,
      inStock,
      lowStock,
      recentCategories: JSON.parse(JSON.stringify(recentCategories)),
    };
  } catch (err) {
    console.error("Admin dashboard error:", err);
    return {
      totalCategories: 0,
      totalProducts: 0,
      inStock: 0,
      lowStock: 0,
      recentCategories: [],
    };
  }
}
