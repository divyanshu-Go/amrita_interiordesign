"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import ProductCardGrid from "./ProductCardGrid";

export default function CategoryPageClient({ products, userRole }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filters, sortBy) => {
    let result = [...products];

    // Apply price filter
    result = result.filter(p => {
      const price = userRole === "enterprise" 
        ? (p.enterpriseDiscountPrice || p.enterprisePrice)
        : (p.retailDiscountPrice || p.retailPrice);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter(p => filters.colors.includes(p.color));
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter(p => filters.sizes.includes(p.size));
    }

    // Apply thickness filter
    if (filters.thicknesses.length > 0) {
      result = result.filter(p => filters.thicknesses.includes(p.thickness));
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Apply stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }
    // Material
if (filters.materials?.length > 0) {
  result = result.filter(p =>
    p.material?.some(m => filters.materials.includes(m))
  );
}

// Pattern
if (filters.patterns?.length > 0) {
  result = result.filter(p =>
    p.pattern?.some(m => filters.patterns.includes(m))
  );
}

// Finish
if (filters.finishes?.length > 0) {
  result = result.filter(p =>
    p.finish?.some(f => filters.finishes.includes(f))
  );
}

// Application
if (filters.applications?.length > 0) {
  result = result.filter(p =>
    p.application?.some(a => filters.applications.includes(a))
  );
}



    // Apply sorting
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
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(result);
  };

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
        {/* Sidebar - Hidden on mobile by default */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar products={products} onFilterChange={handleFilterChange} />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of {products.length} products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCardGrid
                  key={product._id}
                  product={product}
                  userRole={userRole}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}