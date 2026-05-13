// components/customer/FilterSidebar.js
//
// ── KEY DESIGN DECISIONS ──────────────────────────────────────────────────
//
// 1. CONTROLLED COMPONENT — no internal filter state.
//    All values come from `currentFilters` (read from URL by the parent).
//    Changes are sent up via `onFilterChange`.
//    This eliminates state/URL mismatch entirely.
//
// 2. FILTER OPTIONS NEVER DISAPPEAR.
//    `filterOptions` comes from the server (getCategoryFilterOptions) and
//    represents ALL possible values for the category — not just the currently
//    visible products. So selecting "Red" doesn't remove "Blue" from the list.
//    This is the correct UX for an e-commerce sidebar.
//
// 3. PRICE RANGE: dual-thumb slider using two range inputs layered on top
//    of each other. Min/max both in URL; priceRange is the category's bounds.
// ─────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import FilterAccordionItem from "./FilterAccordionItem";

export default function FilterSidebar({
  filterOptions,     // { colors, brands, sizes, thicknesses, materials, patterns, finishes, applications }
  currentFilters,    // current values read from URL by parent
  priceRange,        // { min, max } — the category's absolute price bounds
  onFilterChange,    // (newFilters) => void — parent writes to URL
}) {
  // Explicit [] fallbacks — if any field is undefined (empty category,
  // partial aggregation result), the sidebar renders empty sections
  // rather than crashing on .length or .map().
  const {
    colors: allColors = [],
    brands: allBrands = [],
    sizes: allSizes = [],
    thicknesses: allThicknesses = [],
    materials: allMaterials = [],
    patterns: allPatterns = [],
    finishes: allFinishes = [],
    applications: allApplications = [],
  } = filterOptions ?? {};

  // ── Helpers ─────────────────────────────────────────────────────────────

  /** Toggle a single value in an array filter */
  const toggleArrayFilter = useCallback(
    (field, value) => {
      const current = currentFilters[field] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFilterChange({ ...currentFilters, [field]: next });
    },
    [currentFilters, onFilterChange]
  );

  /** Price slider handlers */
  const handleMinPrice = (e) => {
    const val = parseFloat(e.target.value);
    if (val >= currentFilters.maxPrice) return; // don't cross
    onFilterChange({ ...currentFilters, minPrice: val });
  };

  const handleMaxPrice = (e) => {
    const val = parseFloat(e.target.value);
    if (val <= currentFilters.minPrice) return; // don't cross
    onFilterChange({ ...currentFilters, maxPrice: val });
  };

  /** Sort change */
  const handleSortChange = (e) => {
    onFilterChange({ ...currentFilters, sortBy: e.target.value });
  };

  /** Clear all filters back to defaults */
  const handleClear = () => {
    onFilterChange({
      sortBy: "newest",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      colors: [],
      brands: [],
      sizes: [],
      thicknesses: [],
      materials: [],
      patterns: [],
      finishes: [],
      applications: [],
      inStock: false,
    });
  };

  // ── Active filter count (for badge) ────────────────────────────────────
  const activeCount =
    (currentFilters.colors?.length || 0) +
    (currentFilters.brands?.length || 0) +
    (currentFilters.sizes?.length || 0) +
    (currentFilters.thicknesses?.length || 0) +
    (currentFilters.materials?.length || 0) +
    (currentFilters.patterns?.length || 0) +
    (currentFilters.finishes?.length || 0) +
    (currentFilters.applications?.length || 0) +
    (currentFilters.inStock ? 1 : 0) +
    (currentFilters.maxPrice !== priceRange.max ? 1 : 0) +
    (currentFilters.minPrice !== priceRange.min ? 1 : 0);

  // ── Price slider visual progress ────────────────────────────────────────
  const range = priceRange.max - priceRange.min || 1;
  const minPct = ((currentFilters.minPrice - priceRange.min) / range) * 100;
  const maxPct = ((currentFilters.maxPrice - priceRange.min) / range) * 100;

  // ── Checkbox list helper ────────────────────────────────────────────────
  const CheckboxList = ({ items, field, labelFn = (v) => v }) => (
    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
      {items.map((item) => {
        const value = typeof item === "object" ? item.slug : item;
        const label =
          typeof item === "object" ? item.name : labelFn(item);
        const checked = (currentFilters[field] || []).includes(value);

        return (
          <label
            key={value}
            className="flex items-center cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggleArrayFilter(field, value)}
              className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
            />
            <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors capitalize">
              {label}
            </span>
          </label>
        );
      })}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            Filters
          </h3>

          {activeCount > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-sm text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded-md hover:bg-gray-50 transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-100"
              aria-label={`Clear ${activeCount} filters`}
            >
              <X className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Clear</span>
              <span className="ml-1 inline-block bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-xs">
                {activeCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto max-h-[calc(100vh-13rem)] px-4 py-3">
        <div className="space-y-2">

          {/* Sort By */}
          <FilterAccordionItem title="Sort By" defaultOpen={true}>
            <select
              value={currentFilters.sortBy || "newest"}
              onChange={handleSortChange}
              className="w-full px-2 py-2 text-xs border border-gray-200 rounded-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
            </select>
          </FilterAccordionItem>

          {/* Price Range — dual thumb */}
          <FilterAccordionItem title="Price Range" defaultOpen={true}>
            <div className="space-y-3">
              {/* Dual-range slider */}
              <div className="relative h-4 flex items-center">
                {/* Track background */}
                <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
                {/* Active range highlight */}
                <div
                  className="absolute h-1.5 bg-orange-400 rounded-full"
                  style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                />
                {/* Min thumb */}
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={100}
                  value={currentFilters.minPrice}
                  onChange={handleMinPrice}
                  className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-orange-500 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                />
                {/* Max thumb */}
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={100}
                  value={currentFilters.maxPrice}
                  onChange={handleMaxPrice}
                  className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-orange-500"
                />
              </div>

              {/* Min/max labels */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-xs">
                  ₹{currentFilters.minPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-gray-400">–</span>
                <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-xs">
                  ₹{currentFilters.maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </FilterAccordionItem>

          {/* Material */}
          {allMaterials.length > 0 && (
            <FilterAccordionItem title="Material">
              <CheckboxList items={allMaterials} field="materials" />
            </FilterAccordionItem>
          )}

          {/* Pattern */}
          {allPatterns.length > 0 && (
            <FilterAccordionItem title="Pattern">
              <CheckboxList items={allPatterns} field="patterns" />
            </FilterAccordionItem>
          )}

          {/* Finish */}
          {allFinishes.length > 0 && (
            <FilterAccordionItem title="Finish">
              <CheckboxList items={allFinishes} field="finishes" />
            </FilterAccordionItem>
          )}

          {/* Application */}
          {allApplications.length > 0 && (
            <FilterAccordionItem title="Application">
              <CheckboxList items={allApplications} field="applications" />
            </FilterAccordionItem>
          )}

          {/* Color */}
          {allColors.length > 0 && (
            <FilterAccordionItem title="Color">
              <CheckboxList items={allColors} field="colors" />
            </FilterAccordionItem>
          )}

          {/* Availability */}
          <FilterAccordionItem title="Availability">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={currentFilters.inStock || false}
                onChange={(e) =>
                  onFilterChange({
                    ...currentFilters,
                    inStock: e.target.checked,
                  })
                }
                className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors font-medium">
                In Stock Only
              </span>
            </label>
          </FilterAccordionItem>

          {/* Size */}
          {allSizes.length > 0 && (
            <FilterAccordionItem title="Size">
              <CheckboxList items={allSizes} field="sizes" />
            </FilterAccordionItem>
          )}

          {/* Thickness */}
          {allThicknesses.length > 0 && (
            <FilterAccordionItem title="Thickness">
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {allThicknesses.map((t) => (
                  <label
                    key={t}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={(currentFilters.thicknesses || []).includes(
                        String(t)
                      )}
                      onChange={() =>
                        toggleArrayFilter("thicknesses", String(t))
                      }
                      className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors">
                      {t}mm
                    </span>
                  </label>
                ))}
              </div>
            </FilterAccordionItem>
          )}

          {/* Brand */}
          {allBrands.length > 0 && (
            <FilterAccordionItem title="Brand">
              <CheckboxList items={allBrands} field="brands" />
            </FilterAccordionItem>
          )}

        </div>
      </div>
    </div>
  );
}