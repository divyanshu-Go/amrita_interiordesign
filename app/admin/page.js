// app/admin/page.js
import Link from "next/link";
import { FolderOpen, Package, CheckCircle, XCircle, Plus, TrendingUp } from "lucide-react";
import { getAdminDashboardData } from "@/lib/fetchers/adminDashboard";

export default async function AdminDashboard() {
  const {
    totalCategories,
    totalProducts,
    inStock,
    lowStock,
    recentCategories,
  } = await getAdminDashboardData();

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      icon: FolderOpen,
      link: "/admin/categories",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      link: "/admin/products",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "In Stock",
      value: inStock,
      icon: CheckCircle,
      link: "/admin/products",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: TrendingUp,
      link: "/admin/products",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.link}>
              <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-lg">
                <Plus className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Add New Category</p>
                <p className="text-xs text-gray-600">Create a product category</p>
              </div>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-lg">
                <Package className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Add New Product</p>
                <p className="text-xs text-gray-600">Add to your inventory</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Recent Categories</h2>
          <div className="space-y-2">
            {recentCategories.map((category) => (
              <Link
                key={category._id}
                href={`/admin/categories/${category.slug}`}
                className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="text-gray-400 text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="text-sm font-bold text-orange-900">Low Stock Alert</h3>
              <p className="text-xs text-orange-700 mt-0.5">
                {lowStock} product(s) are running low on stock. Consider restocking soon.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="ml-auto bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}