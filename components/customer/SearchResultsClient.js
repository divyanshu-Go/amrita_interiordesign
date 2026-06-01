// components/customer/SearchResultsClient.js
"use client";
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// Aligned with the new FilterSidebar controlled-component API.
//
// OLD API (broken after FilterSidebar rewrite):
//   <FilterSidebar products={products} onFilterChange={(filters, sortBy) => ...} userRole={userRole} />
//   — FilterSidebar managed its own state internally
//   — onFilterChange received (filters, sortBy) as two separate args
//   — filters/sort reset on page reload (no URL persistence)
//
// NEW API (matches the rewritten FilterSidebar):
//   <FilterSidebar
//     filterOptions={filterOptions}   ← derived from all search result products
//     currentFilters={currentFilters} ← read from URL
//     priceRange={priceRange}         ← min/max across all results
//     onFilterChange={fn}             ← receives one newFilters object, writes to URL
//   />
//
// ── WHY URL STATE FOR SEARCH ──────────────────────────────────────────────
// The search query is already in the URL (?q=tiles). Putting filters there
// too means: reload = same state, shareable URLs, no mismatch.
//
// ── WHY CLIENT-SIDE FILTERING HERE (not a separate API) ──────────────────
// Search results are already fully fetched server-side by the page component.
// Unlike category pages (which can have 10k+ products), search results are
// bounded by the search query. Client-side filtering of the result set is
// appropriate here — we're not filtering a whole collection.
//
// filterOptions are DERIVED from the full result set (all products), NOT from
// the currently-filtered products. This means filter options never disappear
// when you select a filter — same UX as the category page.
// ─────────────────────────────────────────────────────────────────────────

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import FilterSidebar from "./FilterSidebar";
import ProductCardGrid from "./ProductCardGrid";

// ── URL helpers (same pattern as CategoryPageClient) ──────────────────────

function readFiltersFromURL(searchParams, priceRange) {
  return {
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice"))
      : priceRange.min,
    maxPrice: searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice"))
      : priceRange.max,
    colors: searchParams.get("colors")?.split(",").filter(Boolean) ?? [],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) ?? [],
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) ?? [],
    thicknesses: searchParams.get("thicknesses")?.split(",").filter(Boolean) ?? [],
    materials: searchParams.get("materials")?.split(",").filter(Boolean) ?? [],
    patterns: searchParams.get("patterns")?.split(",").filter(Boolean) ?? [],
    finishes: searchParams.get("finishes")?.split(",").filter(Boolean) ?? [],
    applications: searchParams.get("applications")?.split(",").filter(Boolean) ?? [],
    inStock: searchParams.get("inStock") === "true",
  };
}

function buildSearchParams(q, filters, priceRange) {
  const params = new URLSearchParams();

  // Always preserve the search query
  if (q) params.set("q", q);

  if (filters.sortBy && filters.sortBy !== "newest")
    params.set("sortBy", filters.sortBy);
  if (filters.minPrice !== undefined && filters.minPrice !== priceRange.min)
    params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== undefined && filters.maxPrice !== priceRange.max)
    params.set("maxPrice", filters.maxPrice);

  if (filters.colors?.length)       params.set("colors",       filters.colors.join(","));
  if (filters.brands?.length)       params.set("brands",       filters.brands.join(","));
  if (filters.sizes?.length)        params.set("sizes",        filters.sizes.join(","));
  if (filters.thicknesses?.length)  params.set("thicknesses",  filters.thicknesses.join(","));
  if (filters.materials?.length)    params.set("materials",    filters.materials.join(","));
  if (filters.patterns?.length)     params.set("patterns",     filters.patterns.join(","));
  if (filters.finishes?.length)     params.set("finishes",     filters.finishes.join(","));
  if (filters.applications?.length) params.set("applications", filters.applications.join(","));
  if (filters.inStock)              params.set("inStock",      "true");

  return params.toString();
}

// ── Derive filterOptions from the full product list ───────────────────────
// Called once on mount (products don't change mid-session for a search).
// Returns the same shape as getCategoryFilterOptions() so FilterSidebar
// receives an identical props contract whether it's on category or search.

function deriveFilterOptions(products, userRole) {
  if (!products || products.length === 0) {
    return {
      colors: [], brands: [], sizes: [], thicknesses: [],
      materials: [], patterns: [], finishes: [], applications: [],
      retailPriceRange:     { min: 0, max: 100000 },
      enterprisePriceRange: { min: 0, max: 100000 },
    };
  }

  const flatUniq = (arr) =>
    [...new Set(arr.flat().filter(Boolean))].sort();

  const uniq = (arr) =>
    [...new Set(arr.filter(Boolean))].sort();

  // Applications: stored as populated objects { _id, name, slug }
  const seenAppSlugs = new Set();
  const applications = [];
  for (const p of products) {
    for (const app of p.application || []) {
      if (app?.slug && !seenAppSlugs.has(app.slug)) {
        seenAppSlugs.add(app.slug);
        applications.push({ name: app.name, slug: app.slug });
      }
    }
  }
  applications.sort((a, b) => a.name.localeCompare(b.name));

  // Price bounds
  const retailPrices = products.map(
    (p) => p.retailDiscountPrice || p.retailPrice || 0
  ).filter(Boolean);
  const enterprisePrices = products.map(
    (p) => p.enterpriseDiscountPrice || p.enterprisePrice || 0
  ).filter(Boolean);

  const safeMin = (arr) =>
    arr.length ? Math.floor(Math.min(...arr) / 100) * 100 : 0;
  const safeMax = (arr) =>
    arr.length ? Math.ceil(Math.max(...arr)  / 100) * 100 : 100000;

  return {
    colors:       uniq(products.map((p) => p.color)),
    brands:       uniq(products.map((p) => p.brand)),
    sizes:        uniq(products.map((p) => p.size)),
    thicknesses:  [...new Set(products.map((p) => p.thickness).filter(Boolean))].sort((a, b) => a - b),
    materials:    flatUniq(products.map((p) => p.material || [])),
    patterns:     flatUniq(products.map((p) => p.pattern  || [])),
    finishes:     flatUniq(products.map((p) => p.finish   || [])),
    applications,
    retailPriceRange:     { min: safeMin(retailPrices),     max: safeMax(retailPrices)     },
    enterprisePriceRange: { min: safeMin(enterprisePrices), max: safeMax(enterprisePrices) },
  };
}

// ── Main component ────────────────────────────────────────────────────────

export default function SearchResultsPageClient({ products, query, headerContent }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const { userRole } = useAuth();

  const [showFilters, setShowFilters] = useState(false);

  // Derive filter options from the full result set — memoized so it only
  // recomputes when products or userRole changes, not on every render.
  const filterOptions = useMemo(
    () => deriveFilterOptions(products, userRole),
    [products, userRole]
  );

  // Pick the correct price range for this user's role
  const priceRange =
    userRole === "enterprise"
      ? filterOptions.enterprisePriceRange
      : filterOptions.retailPriceRange;

  // Read current filter state from URL
  const currentFilters = readFiltersFromURL(searchParams, priceRange);

  // Write new filters to URL (preserves ?q=)
  const handleFilterChange = useCallback(
    (newFilters) => {
      const qs = buildSearchParams(query, newFilters, priceRange);
      router.push(`${pathname}?${qs}`, { scroll: false });
    },
    [router, pathname, query, priceRange]
  );

  // ── Apply filters client-side to the already-fetched search results ────
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const getPrice = (p) =>
      userRole === "enterprise"
        ? p.enterpriseDiscountPrice || p.enterprisePrice || 0
        : p.retailDiscountPrice     || p.retailPrice     || 0;

    let result = [...products];

    // Price
    result = result.filter((p) => {
      const price = getPrice(p);
      return price >= currentFilters.minPrice && price <= currentFilters.maxPrice;
    });

    // Simple scalar filters
    if (currentFilters.colors.length)
      result = result.filter((p) => currentFilters.colors.includes(p.color));
    if (currentFilters.brands.length)
      result = result.filter((p) => currentFilters.brands.includes(p.brand));
    if (currentFilters.sizes.length)
      result = result.filter((p) => currentFilters.sizes.includes(p.size));
    if (currentFilters.thicknesses.length)
      result = result.filter((p) =>
        currentFilters.thicknesses.includes(String(p.thickness))
      );

    // Array fields on product
    if (currentFilters.materials.length)
      result = result.filter((p) =>
        p.material?.some((m) => currentFilters.materials.includes(m))
      );
    if (currentFilters.patterns.length)
      result = result.filter((p) =>
        p.pattern?.some((m) => currentFilters.patterns.includes(m))
      );
    if (currentFilters.finishes.length)
      result = result.filter((p) =>
        p.finish?.some((f) => currentFilters.finishes.includes(f))
      );

    // Applications — filter by slug (populated objects)
    if (currentFilters.applications.length)
      result = result.filter((p) =>
        p.application?.some((a) => currentFilters.applications.includes(a?.slug))
      );

    // In stock
    if (currentFilters.inStock)
      result = result.filter((p) => p.stock > 0);

    // Sort
    result.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      switch (currentFilters.sortBy) {
        case "priceLowHigh": return priceA - priceB;
        case "priceHighLow": return priceB - priceA;
        case "nameAZ":       return a.name.localeCompare(b.name);
        default:             return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [products, currentFilters, userRole]);

  // ── Active filter count (for mobile badge) ────────────────────────────
  const activeFilterCount =
    (currentFilters.colors?.length      || 0) +
    (currentFilters.brands?.length      || 0) +
    (currentFilters.sizes?.length       || 0) +
    (currentFilters.thicknesses?.length || 0) +
    (currentFilters.materials?.length   || 0) +
    (currentFilters.patterns?.length    || 0) +
    (currentFilters.finishes?.length    || 0) +
    (currentFilters.applications?.length|| 0) +
    (currentFilters.inStock ? 1 : 0) +
    (currentFilters.maxPrice !== priceRange.max  ? 1 : 0) +
    (currentFilters.minPrice !== priceRange.min  ? 1 : 0);

  // ── Early returns for edge states ─────────────────────────────────────
  if (!query) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
        <p className="text-gray-600">Use the search bar to find products</p>
      </div>
    );
  }

  if (query.length < 2) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">⌨️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Keep Typing...</h3>
        <p className="text-gray-600">Enter at least 2 characters to search</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-md border border-gray-200 p-16 text-center">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600 mb-6">No products match "{query}"</p>
        <p className="text-sm text-gray-500">Try different keywords or adjust filters</p>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">

      {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
      <aside className="sm:col-span-4 md:col-span-3 col-span-12">
        {/* Mobile toggle */}
        <div className="sm:hidden mb-4 ">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-md
              px-4 py-3 text-sm font-semibold text-gray-700 hover:border-orange-300 transition-all duration-200 shadow-sm"
          >
            {showFilters ? (
              <><X className="w-4 h-4" /> Hide Filters</>
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
          {/* New FilterSidebar API — controlled component */}
          <FilterSidebar
            filterOptions={filterOptions}
            currentFilters={currentFilters}
            priceRange={priceRange}
            onFilterChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
      <main className="sm:col-span-8 md:col-span-9 col-span-12 ">
        {headerContent}

        <p className="text-sm text-gray-600 mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
          {" "}of{" "}
          <span className="font-semibold text-gray-700">{products.length}</span>{" "}
          results
        </p>

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
              <ProductCardGrid key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

    </div>
  );
}