"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCardGrid from "./ProductCardGrid";

export default function SearchResultsClient({ products, userRole, query, categories }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 100000],
    colors: [],
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState("relevance");

  // Extract unique values
  const uniqueColors = [...new Set(products.map(p => p.color).filter(Boolean))];
  const maxPrice = Math.max(...products.map(p => p.retailPrice || 0), 100000);

  const applyFilters = () => {
    let result = [...products];

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category?._id === filters.category);
    }

    // Price filter
    result = result.filter(p => {
      const price = userRole === "enterprise" 
        ? (p.enterpriseDiscountPrice || p.enterprisePrice)
        : (p.retailDiscountPrice || p.retailPrice);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter(p => filters.colors.includes(p.color));
    }

    // Stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    result.sort((a, b) => {
      const priceA = userRole === "enterprise"
        ? (a.enterpriseDiscountPrice || a.enterprisePrice)
        : (a.retailDiscountPrice || a.retailPrice);
      const priceB = userRole === "enterprise"
        ? (b.enterpriseDiscountPrice || b.enterprisePrice)
        : (b.retailDiscountPrice || b.retailPrice);

      switch (sortBy) {
        case "priceLowHigh":
          return priceA - priceB;
        case "priceHighLow":
          return priceB - priceA;
        case "nameAZ":
          return a.name.localeCompare(b.name);
        case "relevance":
        default:
          const aExact = a.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          const bExact = b.name.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          return bExact - aExact;
      }
    });

    setFilteredProducts(result);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === "colors") {
        const currentColors = prev.colors;
        newFilters.colors = currentColors.includes(value)
          ? currentColors.filter(c => c !== value)
          : [...currentColors, value];
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      priceRange: [0, maxPrice],
      colors: [],
      inStockOnly: false,
    });
    setSortBy("relevance");
  };

  const activeFilterCount = 
    (filters.category ? 1 : 0) +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[1] < maxPrice ? 1 : 0);

  useState(() => {
    applyFilters();
  }, [filters, sortBy]);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {showFilters ? (
            <>
              <X className="w-4 h-4" />
              Hide Filters
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-4 h-4" />
              Show Filters
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Filter Sidebar - Hidden on mobile by default */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    applyFilters();
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A to Z</option>
                </select>
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => {
                      handleFilterChange("category", e.target.value);
                      applyFilters();
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Price Range
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    handleFilterChange("priceRange", [0, parseInt(e.target.value)]);
                    applyFilters();
                  }}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>₹0</span>
                  <span className="font-semibold text-orange-600">
                    ₹{filters.priceRange[1].toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* In Stock */}
              <div className="border-t pt-4">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => {
                      handleFilterChange("inStockOnly", e.target.checked);
                      applyFilters();
                    }}
                    className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900 group-hover:text-orange-600">
                    In Stock Only
                  </span>
                </label>
              </div>

              {/* Colors */}
              {uniqueColors.length > 0 && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Color
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uniqueColors.map(color => (
                      <label key={color} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={() => {
                            handleFilterChange("colors", color);
                            applyFilters();
                          }}
                          className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-orange-600">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of {products.length} results
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCardGrid
                key={product._id}
                product={product}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}