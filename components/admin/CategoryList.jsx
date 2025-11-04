"use client";

import { useState } from "react";
import CategoryCard from "./CategoryCard";
import SearchBar from "./SearchBar";

export default function CategoryList({ initialCategories }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = initialCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search categories by name or slug..."
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}