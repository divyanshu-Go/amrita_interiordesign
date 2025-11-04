import Link from "next/link";
import { getAllCategories } from "@/lib/fetchers/categories";
import { getAllProducts } from "@/lib/fetchers/products";

export default async function AdminDashboard() {
  const categories = await getAllCategories();
  const products = await getAllProducts();

  const stats = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: "📁",
      link: "/admin/categories",
      color: "bg-orange-500",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: "📦",
      link: "/admin/products",
      color: "bg-blue-500",
    },
    {
      title: "In Stock",
      value: products.filter((p) => p.stock > 0).length,
      icon: "✅",
      link: "/admin/products",
      color: "bg-green-500",
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => p.stock === 0).length,
      icon: "❌",
      link: "/admin/products",
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-full text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-semibold text-gray-900">Add New Category</p>
                <p className="text-sm text-gray-600">Create a new product category</p>
              </div>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-600">Add a product to your inventory</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Categories</h2>
          <div className="space-y-3">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category._id}
                href={`/admin/categories/${category.slug}`}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      📁
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}