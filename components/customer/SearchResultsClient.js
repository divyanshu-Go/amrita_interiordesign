// components/customer/SearchResultsPageClient.js
"use client";

import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductCardGrid from "./ProductCardGrid";
import { SlidersHorizontal, X } from "lucide-react";

export default function SearchResultsPageClient({ products, userRole, query,headerContent }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filters, sortBy) => {
    let result = [...products];

    const getPrice = (p) =>
      userRole === "enterprise"
        ? p.enterpriseDiscountPrice || p.enterprisePrice
        : p.retailDiscountPrice || p.retailPrice;

    // Price filter
    result = result.filter((p) => {
      const price = getPrice(p);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Colors
    if (filters.colors.length)
      result = result.filter((p) => filters.colors.includes(p.color));

    // Sizes
    if (filters.sizes.length)
      result = result.filter((p) => filters.sizes.includes(p.size));

    // Thickness
    if (filters.thicknesses.length)
      result = result.filter((p) => filters.thicknesses.includes(p.thickness));

    // Brands
    if (filters.brands.length)
      result = result.filter((p) => filters.brands.includes(p.brand));

    // Materials
    if (filters.materials.length)
      result = result.filter((p) =>
        p.material?.some((m) => filters.materials.includes(m))
      );

    // Pattern
    if (filters.patterns.length)
      result = result.filter((p) =>
        p.pattern?.some((m) => filters.patterns.includes(m))
      );

    // Finish
    if (filters.finishes.length)
      result = result.filter((p) =>
        p.finish?.some((f) => filters.finishes.includes(f))
      );

    // Applications
    if (filters.applications.length)
      result = result.filter((p) =>
        p.application?.some((a) => filters.applications.includes(a.slug))
      );

    // Stock
    if (filters.inStockOnly) result = result.filter((p) => p.stock > 0);

    // Sort
    result.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);

      switch (sortBy) {
        case "priceLowHigh":
          return priceA - priceB;
        case "priceHighLow":
          return priceB - priceA;
        case "nameAZ":
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(result);
  };

  // ---- EMPTY STATES ----
  if (!query) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Start Your Search
        </h3>
        <p className="text-gray-600">Use the search bar to find products</p>
      </div>
    );
  }

  if (query.length < 2) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">⌨️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Keep Typing...
        </h3>
        <p className="text-gray-600">Enter at least 2 characters to search</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-600 mb-6">No products match "{query}"</p>
        <p className="text-sm text-gray-500">
          Try different keywords or adjust filters
        </p>
      </div>
    );
  }

  // ---- MAIN LAYOUT ----
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
      {/* SIDEBAR */}
      <aside className="sm:col-span-4 md:col-span-3 col-span-12">
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-md
          px-4 py-3 text-sm font-semibold text-gray-700 hover:border-orange-300 transition-all duration-200 shadow-sm"
          >
            {showFilters ? (
              <>
                <X className="w-4 h-4" /> Hide Filters
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-4 h-4" /> Filters (
                {filteredProducts.length})
              </>
            )}
          </button>
        </div>

        <div
          className={`${
            showFilters ? "block" : "hidden"
          } sm:block sm:sticky sm:top-24`}
        >
          <FilterSidebar
            products={products}
            onFilterChange={handleFilterChange}
            userRole={userRole}
          />
        </div>
      </aside>

      {/* RIGHT SIDE (HEADER + PRODUCTS) */}
      <main className="sm:col-span-8 md:col-span-9 col-span-12">
        {/* --- Injected Search Header (same as category) --- */}
        {headerContent}

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{products.length}</span>{" "}
          results
        </p>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-md border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products match your filters
            </h3>
            <p className="text-gray-600">Try removing some filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <ProductCardGrid
                key={product._id}
                product={product}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
