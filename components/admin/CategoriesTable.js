"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/fetchers/categories";
import { Edit, Trash2, Search, FolderOpen, View, EyeIcon } from "lucide-react";
import Toast from "./Toast";

export default function CategoriesTable({ categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (category) => {
    if (!confirm(`Delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(category._id);
    try {
      await deleteCategory(category.slug);
      setToast({ message: "Category deleted successfully!", type: "success" });
      router.refresh();
    } catch (error) {
      setToast({ message: error.message || "Failed to delete", type: "error" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-12 text-center">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No categories found</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {category.description || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/category/${category.slug}`}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="View"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/categories/${category.slug}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={deleting === category._id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredCategories.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Showing {filteredCategories.length} of {categories.length} categories
            </p>
          </div>
        )}
      </div>
    </>
  );
}