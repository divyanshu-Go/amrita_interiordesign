import Link from "next/link";
import { getAllCategories } from "@/lib/fetchers/categories";
import CategoryCard from "@/components/admin/CategoryCard";
import CategoryList from "@/components/admin/CategoryList";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage product categories ({categories.length} total)</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first category</p>
          <Link
            href="/admin/categories/new"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Create Category
          </Link>
        </div>
      ) : (
        <CategoryList initialCategories={categories} />
      )}
    </div>
  );
}