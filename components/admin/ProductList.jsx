// components/admin/ProductList.jsx
"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";

export default function ProductList({ initialProducts, categories }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
  !selectedCategory ||
  (Array.isArray(product.category) &&
    product.category.some((c) => c._id === selectedCategory));


    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.stock > 0) ||
      (stockFilter === "outOfStock" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Products</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search products..."
            />
          </div>
        </div>

        {(searchQuery || selectedCategory || stockFilter !== "all") && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {initialProducts.length} products
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setStockFilter("all");
              }}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}