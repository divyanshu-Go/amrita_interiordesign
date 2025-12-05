// components/customer/FilterSidebar.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import FilterAccordionItem from "./FilterAccordionItem";

export default function FilterSidebar({ products, onFilterChange, userRole = "user" }) {
  // 🎯 Calculate ACTUAL min/max prices based on products and user role
  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 100000 };
    }

    const prices = products.map(p => {
      if (userRole === "enterprise") {
        return p.enterpriseDiscountPrice || p.enterprisePrice || 0;
      }
      return p.retailDiscountPrice || p.retailPrice || 0;
    }).filter(price => price > 0);

    if (prices.length === 0) {
      return { min: 0, max: 100000 };
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // Round to nearest 100 for cleaner values
    return {
      min: Math.floor(min / 100) * 100,
      max: Math.ceil(max / 100) * 100
    };
  }, [products, userRole]);

  const [filters, setFilters] = useState({
    priceRange: [priceRange.min, priceRange.max],
    colors: [],
    sizes: [],
    thicknesses: [],
    brands: [],
    materials: [],
    patterns: [],
    finishes: [],
    applications: [],
    inStockOnly: false,
  });

  const [sortBy, setSortBy] = useState("newest");

  // Update price range when products or userRole changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [priceRange.min, priceRange.max]
    }));
  }, [priceRange.min, priceRange.max]);

  // Extract unique values from products
  const uniqueColors = useMemo(() => 
    [...new Set(products.map(p => p.color).filter(Boolean))].sort(),
    [products]
  );
  
  const uniqueSizes = useMemo(() => 
    [...new Set(products.map(p => p.size).filter(Boolean))].sort(),
    [products]
  );
  
  const uniqueThicknesses = useMemo(() => 
    [...new Set(products.map(p => p.thickness).filter(Boolean))].sort((a, b) => a - b),
    [products]
  );
  
  const uniqueBrands = useMemo(() => 
    [...new Set(products.map(p => p.brand).filter(Boolean))].sort(),
    [products]
  );
  
  const uniqueMaterials = useMemo(() => 
    [...new Set(products.flatMap(p => p.material || []))].sort(),
    [products]
  );
  
  const uniquePatterns = useMemo(() => 
    [...new Set(products.flatMap(p => p.pattern || []))].sort(),
    [products]
  );
  
  const uniqueFinishes = useMemo(() => 
    [...new Set(products.flatMap(p => p.finish || []))].sort(),
    [products]
  );
  
  const uniqueApplications = useMemo(() => 
    [...new Set(products.flatMap(p => (p.application || []).map(app => app.slug)))].sort(),
    [products]
  );

  useEffect(() => {
    onFilterChange(filters, sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({ 
      ...prev, 
      priceRange: [priceRange.min, value] 
    }));
  };

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [priceRange.min, priceRange.max],
      colors: [],
      sizes: [],
      thicknesses: [],
      brands: [],
      materials: [],
      patterns: [],
      finishes: [],
      applications: [],
      inStockOnly: false,
    });
    setSortBy("newest");
  };

  const activeFilterCount =
    filters.colors.length +
    filters.sizes.length +
    filters.thicknesses.length +
    filters.brands.length +
    filters.materials.length +
    filters.patterns.length +
    filters.finishes.length +
    filters.applications.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[1] < priceRange.max ? 1 : 0);

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            Filters
          </h3>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-sm text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded-md hover:bg-gray-50 transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-100"
                aria-label={`Clear ${activeFilterCount} filters`}
                title="Clear filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="sr-only">Clear</span>
                <span className="text-xs font-medium">Clear</span>
                <span className="ml-1 inline-block bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-xs">
                  {activeFilterCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Filter Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-13rem)] px-4 py-3">
        <div className="space-y-2">
          {/* Sort By */}
          <FilterAccordionItem title="Sort By" defaultOpen={true}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 py-2 text-xs border border-gray-200 rounded-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </FilterAccordionItem>

          {/* Price Range */}
          <FilterAccordionItem title="Price Range" defaultOpen={true}>
            <div className="space-y-2">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="100"
                value={filters.priceRange[1]}
                onChange={handlePriceChange}
                className="w-full h-1.5 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-orange-500"
                style={{
                  background: `linear-gradient(to right, #f97316 0%, #f97316 ${((filters.priceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e7eb ${((filters.priceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">₹{priceRange.min.toLocaleString('en-IN')}</span>
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-xs">₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
                <span className="text-gray-500">₹{priceRange.max.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </FilterAccordionItem>

          {/* Material */}
          {uniqueMaterials.length > 0 && (
            <FilterAccordionItem title="Material">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueMaterials.map(mat => (
                  <label key={mat} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(mat)}
                      onChange={() => handleCheckboxChange('materials', mat)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {mat}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Pattern */}
          {uniquePatterns.length > 0 && (
            <FilterAccordionItem title="Pattern">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniquePatterns.map(pat => (
                  <label key={pat} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.patterns.includes(pat)}
                      onChange={() => handleCheckboxChange('patterns', pat)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {pat}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Finish */}
          {uniqueFinishes.length > 0 && (
            <FilterAccordionItem title="Finish">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueFinishes.map(fin => (
                  <label key={fin} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.finishes.includes(fin)}
                      onChange={() => handleCheckboxChange('finishes', fin)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {fin}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Application */}
          {uniqueApplications.length > 0 && (
            <FilterAccordionItem title="Application">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueApplications.map(app => (
                  <label key={app} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.applications.includes(app)}
                      onChange={() => handleCheckboxChange('applications', app)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors capitalize">
                      {app.replace(/-/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Colors */}
          {uniqueColors.length > 0 && (
            <FilterAccordionItem title="Color">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueColors.map(color => (
                  <label key={color} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      onChange={() => handleCheckboxChange('colors', color)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors capitalize">
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* In Stock */}
          <FilterAccordionItem title="Availability">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors font-medium">
                In Stock Only
              </span>
            </label>
          </FilterAccordionItem>

          {/* Sizes */}
          {uniqueSizes.length > 0 && (
            <FilterAccordionItem title="Size">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueSizes.map(size => (
                  <label key={size} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleCheckboxChange('sizes', size)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Thickness */}
          {uniqueThicknesses.length > 0 && (
            <FilterAccordionItem title="Thickness">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueThicknesses.map(thickness => (
                  <label key={thickness} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.thicknesses.includes(thickness)}
                      onChange={() => handleCheckboxChange('thicknesses', thickness)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {thickness}mm
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Brands */}
          {uniqueBrands.length > 0 && (
            <FilterAccordionItem title="Brand">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {uniqueBrands.map(brand => (
                  <label key={brand} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleCheckboxChange('brands', brand)}
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}
        </div>
      </div>
    </div>
  );
}
