"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteCategory } from "@/lib/fetchers/categories";
import { useRouter } from "next/navigation";

export default function CategoryCard({ category }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCategory(category.slug);
      router.refresh();
    } catch (error) {
      alert("Failed to delete category: " + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-48 object-cover"
        />
      )}
      {!category.image && (
        <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <span className="text-6xl">📁</span>
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
        <p className="text-gray-600 text-sm mb-1">Slug: {category.slug}</p>
        {category.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Link
            href={`/admin/categories/${category.slug}`}
            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center font-medium"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}