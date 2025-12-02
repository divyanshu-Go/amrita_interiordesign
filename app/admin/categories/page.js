import Link from "next/link";
import { getAllCategories } from "@/lib/fetchers/categories";
import CategoriesTable from "@/components/admin/CategoriesTable";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage product categories ({categories.length} total)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Table */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
          <p className="text-sm text-gray-600 mb-6">Get started by creating your first category</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Category
          </Link>
        </div>
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  );
}