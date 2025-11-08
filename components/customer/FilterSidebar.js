"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import FilterAccordionItem from "./FilterAccordionItem";

export default function FilterSidebar({ products, onFilterChange }) {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    colors: [],
    sizes: [],
    thicknesses: [],
    brands: [],
    inStockOnly: false,
  });

  const [sortBy, setSortBy] = useState("newest");

  // Extract unique values from products
  const uniqueColors = [...new Set(products.map(p => p.color).filter(Boolean))];
  const uniqueSizes = [...new Set(products.map(p => p.size).filter(Boolean))];
  const uniqueThicknesses = [...new Set(products.map(p => p.thickness).filter(Boolean))];
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  const maxPrice = Math.max(...products.map(p => p.retailPrice || 0), 100000);

  useEffect(() => {
    onFilterChange(filters, sortBy);
  }, [filters, sortBy]);

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({ ...prev, priceRange: [0, value] }));
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
      priceRange: [0, maxPrice],
      colors: [],
      sizes: [],
      thicknesses: [],
      brands: [],
      inStockOnly: false,
    });
    setSortBy("newest");
  };

  const activeFilterCount = 
    filters.colors.length + 
    filters.sizes.length + 
    filters.thicknesses.length + 
    filters.brands.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
      {/* Header */}
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

      <div className="space-y-0">
        {/* Sort By */}
        <FilterAccordionItem title="Sort By" defaultOpen={true}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="newest">Newest First</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="nameAZ">Name: A to Z</option>
          </select>
        </FilterAccordionItem>

        {/* Price Range */}
        <FilterAccordionItem title="Price Range" defaultOpen={true}>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="1000"
              value={filters.priceRange[1]}
              onChange={handlePriceChange}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>₹0</span>
              <span className="font-semibold text-orange-600">
                ₹{filters.priceRange[1].toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </FilterAccordionItem>

        {/* Colors */}
        {uniqueColors.length > 0 && (
          <FilterAccordionItem title="Color" defaultOpen={false}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueColors.map(color => (
                <label key={color} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => handleCheckboxChange('colors', color)}
                    className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-orange-600">{color}</span>
                </label>
              ))}
            </div>
          </FilterAccordionItem>
        )}

        {/* In Stock */}
        <FilterAccordionItem title="Availability" defaultOpen={false}>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
            />
            <span className="ml-2 text-sm text-gray-700 group-hover:text-orange-600">In Stock Only</span>
          </label>
        </FilterAccordionItem>

        {/* Sizes */}
        {uniqueSizes.length > 0 && (
          <FilterAccordionItem title="Size" defaultOpen={false}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueSizes.map(size => (
                <label key={size} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={() => handleCheckboxChange('sizes', size)}
                    className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-orange-600">{size}</span>
                </label>
              ))}
            </div>
          </FilterAccordionItem>
        )}

        {/* Thickness */}
        {uniqueThicknesses.length > 0 && (
          <FilterAccordionItem title="Thickness" defaultOpen={false}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueThicknesses.sort((a, b) => a - b).map(thickness => (
                <label key={thickness} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.thicknesses.includes(thickness)}
                    onChange={() => handleCheckboxChange('thicknesses', thickness)}
                    className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-orange-600">{thickness}mm</span>
                </label>
              ))}
            </div>
          </FilterAccordionItem>
        )}

        {/* Brands */}
        {uniqueBrands.length > 0 && (
          <FilterAccordionItem title="Brand" defaultOpen={false}>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uniqueBrands.map(brand => (
                <label key={brand} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleCheckboxChange('brands', brand)}
                    className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-1"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-orange-600">{brand}</span>
                </label>
              ))}
            </div>
          </FilterAccordionItem>
        )}
      </div>
    </div>
  );
}