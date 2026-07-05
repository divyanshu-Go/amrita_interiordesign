// components/admin/QuickAddClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import QuickAddProductForm from "./QuickAddProductForm";

export default function QuickAddClient({
  categories,
  colorVariants,
  patternVariants,
  applications,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!selectedCategory) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 text-left border border-gray-200 hover:border-orange-400 cursor-pointer"
          >
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 mb-3">
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setSelectedCategory(null)}
        className="text-sm text-gray-600 hover:text-orange-600 mb-4 font-medium cursor-pointer"
      >
        ← Change category
      </button>

      <QuickAddProductForm
        key={selectedCategory._id}
        category={selectedCategory}
        colorVariants={colorVariants}
        patternVariants={patternVariants}
        applications={applications}
      />
    </div>
  );
}