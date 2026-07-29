// components/customer/NewFilterSidebar.jsx
//
// ── WHY THIS IS THE ONLY CLIENT COMPONENT ────────────────────────────────
// Everything here is either (a) reading the URL, which only the browser's
// router can do reactively, or (b) writing a new URL when the user
// interacts with a filter. There is no product fetching here — changing
// the URL triggers a normal Next.js navigation, and the Server Component
// page re-renders with the new searchParams. This component never touches
// product data directly.
//
// The actual filter UI (checkboxes, price slider, accordion) lives in
// FilterSidebar.jsx, unchanged — it was already a correct, stateless,
// controlled component. This file only adds URL read/write around it.
// ─────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

function readFiltersFromURL(searchParams, priceRange) {
  return {
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice"))
      : priceRange.min,
    maxPrice: searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice"))
      : priceRange.max,
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    thicknesses: searchParams.get("thicknesses")?.split(",").filter(Boolean) || [],
    materials: searchParams.get("materials")?.split(",").filter(Boolean) || [],
    patterns: searchParams.get("patterns")?.split(",").filter(Boolean) || [],
    finishes: searchParams.get("finishes")?.split(",").filter(Boolean) || [],
    applications: searchParams.get("applications")?.split(",").filter(Boolean) || [],
    inStock: searchParams.get("inStock") === "true",
  };
}

function buildQueryString(filters, priceRange) {
  const params = new URLSearchParams();

  // Changing any filter resets pagination back to page 1 — a filter
  // change means "start over", not "stay on page 5 of a new result set".
  if (filters.sortBy && filters.sortBy !== "newest") params.set("sortBy", filters.sortBy);
  if (filters.minPrice !== priceRange.min) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== priceRange.max) params.set("maxPrice", filters.maxPrice);
  if (filters.colors?.length) params.set("colors", filters.colors.join(","));
  if (filters.brands?.length) params.set("brands", filters.brands.join(","));
  if (filters.sizes?.length) params.set("sizes", filters.sizes.join(","));
  if (filters.thicknesses?.length) params.set("thicknesses", filters.thicknesses.join(","));
  if (filters.materials?.length) params.set("materials", filters.materials.join(","));
  if (filters.patterns?.length) params.set("patterns", filters.patterns.join(","));
  if (filters.finishes?.length) params.set("finishes", filters.finishes.join(","));
  if (filters.applications?.length) params.set("applications", filters.applications.join(","));
  if (filters.inStock) params.set("inStock", "true");

  return params.toString();
}

export default function NewFilterSidebar({ filterOptions, priceRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const currentFilters = readFiltersFromURL(searchParams, priceRange);

  const handleFilterChange = useCallback(
    (newFilters) => {
      const qs = buildQueryString(newFilters, priceRange);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, priceRange]
  );

  const activeFilterCount =
    [
      currentFilters.colors,
      currentFilters.brands,
      currentFilters.sizes,
      currentFilters.thicknesses,
      currentFilters.materials,
      currentFilters.patterns,
      currentFilters.finishes,
      currentFilters.applications,
    ].reduce((sum, arr) => sum + arr.length, 0) +
    (currentFilters.inStock ? 1 : 0) +
    (currentFilters.maxPrice !== priceRange.max ? 1 : 0) +
    (currentFilters.minPrice !== priceRange.min ? 1 : 0);

  return (
    <>
      {/* Mobile toggle — pure UI state, not URL/data related */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-md
            px-4 py-3 text-sm font-semibold text-gray-700 hover:border-orange-300 transition-all duration-200 shadow-sm"
        >
          {showFilters ? (
            <>
              <X className="w-4 h-4" /> Hide Filters
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      <div className={`${showFilters ? "block" : "hidden"} sm:block sm:sticky sm:top-24`}>
        <FilterSidebar
          filterOptions={filterOptions}
          currentFilters={currentFilters}
          priceRange={priceRange}
          onFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
}