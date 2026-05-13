// components/customer/CategoryPageClient.js
//
// ── ARCHITECTURE ──────────────────────────────────────────────────────────
// URL is the single source of truth. All filter/sort/page state lives in
// URL search params. This means:
//   • Page reload restores exact state
//   • Browser back/forward works correctly
//   • Shareable URLs with applied filters
//   • No mismatch between UI and displayed products
//
// Data flow:
//   1. Read URL params → pass to FilterSidebar (controls UI state)
//   2. Fetch products from /api/products/by-category with those params
//   3. FilterSidebar changes → updateURL() → triggers re-fetch
//   4. Pagination changes → updateURL() → triggers re-fetch
// ─────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import FilterSidebar from "./FilterSidebar";
import ProductCardGrid from "./ProductCardGrid";
import Pagination from "../ui/Pagination";

const PRODUCTS_PER_PAGE = 24;

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Read all current filter values from URL search params.
 * Returns a normalized filter object the sidebar and API call both use.
 */
function readFiltersFromURL(searchParams, priceRange) {
  return {
    page: parseInt(searchParams.get("page") || "1", 10),
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice"))
      : priceRange.min,
    maxPrice: searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice"))
      : priceRange.max,
    colors: searchParams.get("colors")
      ? searchParams.get("colors").split(",").filter(Boolean)
      : [],
    brands: searchParams.get("brands")
      ? searchParams.get("brands").split(",").filter(Boolean)
      : [],
    sizes: searchParams.get("sizes")
      ? searchParams.get("sizes").split(",").filter(Boolean)
      : [],
    thicknesses: searchParams.get("thicknesses")
      ? searchParams.get("thicknesses").split(",").filter(Boolean)
      : [],
    materials: searchParams.get("materials")
      ? searchParams.get("materials").split(",").filter(Boolean)
      : [],
    patterns: searchParams.get("patterns")
      ? searchParams.get("patterns").split(",").filter(Boolean)
      : [],
    finishes: searchParams.get("finishes")
      ? searchParams.get("finishes").split(",").filter(Boolean)
      : [],
    applications: searchParams.get("applications")
      ? searchParams.get("applications").split(",").filter(Boolean)
      : [],
    inStock: searchParams.get("inStock") === "true",
  };
}

/**
 * Build a URL search params string from a filter object.
 * Omits defaults so URLs stay clean.
 */
function buildSearchParams(filters, priceRange) {
  const params = new URLSearchParams();

  if (filters.page && filters.page > 1) params.set("page", filters.page);
  if (filters.sortBy && filters.sortBy !== "newest")
    params.set("sortBy", filters.sortBy);

  // Only include price if it differs from the category default range
  if (filters.minPrice !== undefined && filters.minPrice !== priceRange.min)
    params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== undefined && filters.maxPrice !== priceRange.max)
    params.set("maxPrice", filters.maxPrice);

  if (filters.colors?.length) params.set("colors", filters.colors.join(","));
  if (filters.brands?.length) params.set("brands", filters.brands.join(","));
  if (filters.sizes?.length) params.set("sizes", filters.sizes.join(","));
  if (filters.thicknesses?.length)
    params.set("thicknesses", filters.thicknesses.join(","));
  if (filters.materials?.length)
    params.set("materials", filters.materials.join(","));
  if (filters.patterns?.length)
    params.set("patterns", filters.patterns.join(","));
  if (filters.finishes?.length)
    params.set("finishes", filters.finishes.join(","));
  if (filters.applications?.length)
    params.set("applications", filters.applications.join(","));
  if (filters.inStock) params.set("inStock", "true");

  return params.toString();
}

// ── Component ─────────────────────────────────────────────────────────────

// Safe fallback shape — every array field defaults to [] so no .length crash
// can ever happen even if the server returns a partial filterOptions object.
const EMPTY_FILTER_OPTIONS = {
  colors: [],
  brands: [],
  sizes: [],
  thicknesses: [],
  materials: [],
  patterns: [],
  finishes: [],
  applications: [],
  retailPriceRange: { min: 0, max: 100000 },
  enterprisePriceRange: { min: 0, max: 100000 },
};

export default function CategoryPageClient({
  category,
  filterOptions: rawFilterOptions,
  categorySlug,
}) {
  // Merge with safe defaults — any missing/undefined field falls back to []
  const filterOptions = { ...EMPTY_FILTER_OPTIONS, ...rawFilterOptions };

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userRole, loading: authLoading } = useAuth();

  // Pick price range based on user role.
  // Falls back through the chain to a hardcoded safe default.
  const priceRange =
    (userRole === "enterprise"
      ? filterOptions.enterprisePriceRange
      : filterOptions.retailPriceRange) ??
    filterOptions.retailPriceRange ??
    { min: 0, max: 100000 };

  // ── Products state ────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Mobile sidebar ────────────────────────────────────────────────────
  const [showFilters, setShowFilters] = useState(false);

  // Prevent concurrent fetches with AbortController
  const abortRef = useRef(null);

  // ── Fetch products when URL params or userRole change ─────────────────
  const fetchProducts = useCallback(async () => {
    if (authLoading) return; // wait until we know the role

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchLoading(true);
    setFetchError(null);

    try {
      const filters = readFiltersFromURL(searchParams, priceRange);

      const apiParams = new URLSearchParams({
        categorySlug,
        page: filters.page,
        limit: PRODUCTS_PER_PAGE,
        sortBy: filters.sortBy,
        userRole: userRole || "user",
      });

      if (filters.minPrice !== priceRange.min)
        apiParams.set("minPrice", filters.minPrice);
      if (filters.maxPrice !== priceRange.max)
        apiParams.set("maxPrice", filters.maxPrice);

      if (filters.colors.length)
        apiParams.set("colors", filters.colors.join(","));
      if (filters.brands.length)
        apiParams.set("brands", filters.brands.join(","));
      if (filters.sizes.length) apiParams.set("sizes", filters.sizes.join(","));
      if (filters.thicknesses.length)
        apiParams.set("thicknesses", filters.thicknesses.join(","));
      if (filters.materials.length)
        apiParams.set("materials", filters.materials.join(","));
      if (filters.patterns.length)
        apiParams.set("patterns", filters.patterns.join(","));
      if (filters.finishes.length)
        apiParams.set("finishes", filters.finishes.join(","));
      if (filters.applications.length)
        apiParams.set("applications", filters.applications.join(","));
      if (filters.inStock) apiParams.set("inStock", "true");

      const res = await fetch(`/api/products/by-category?${apiParams}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      if (err.name === "AbortError") return; // intentionally cancelled
      console.error("[CategoryPageClient] fetch error:", err);
      setFetchError("Failed to load products. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  }, [searchParams, userRole, authLoading, categorySlug, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── URL update helpers ────────────────────────────────────────────────

  /**
   * Called by FilterSidebar when any filter or sort changes.
   * Resets to page 1 on filter change.
   */
  const handleFilterChange = useCallback(
    (newFilters) => {
      const qs = buildSearchParams({ ...newFilters, page: 1 }, priceRange);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, priceRange]
  );

  /**
   * Called by Pagination when the user navigates pages.
   * Preserves all existing filters.
   */
  const handlePageChange = useCallback(
    (newPage) => {
      const current = readFiltersFromURL(searchParams, priceRange);
      const qs = buildSearchParams({ ...current, page: newPage }, priceRange);
      router.push(`${pathname}?${qs}`, { scroll: true });
    },
    [router, pathname, searchParams, priceRange]
  );

  // ── Derived state ─────────────────────────────────────────────────────
  const currentFilters = readFiltersFromURL(searchParams, priceRange);

  const activeFilterCount = [
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

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">

      {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
      <aside className="sm:col-span-4 md:col-span-3 col-span-12">
        {/* Mobile toggle */}
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

        <div
          className={`${showFilters ? "block" : "hidden"} sm:block sm:sticky sm:top-24`}
        >
          <FilterSidebar
            filterOptions={filterOptions}
            currentFilters={currentFilters}
            priceRange={priceRange}
            onFilterChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* ── RIGHT SIDE ──────────────────────────────────────────────────── */}
      <main className="sm:col-span-8 md:col-span-9 col-span-12">

        {/* Category header */}
        <section className="bg-white border border-gray-100 rounded-md p-4 mb-4">
          <div className="flex items-center gap-4">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-14 h-14 object-cover rounded-md shadow-sm ring-1 ring-gray-200"
              />
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xs text-gray-600 line-clamp-1">
                  {category.description}
                </p>
              )}
              {pagination && (
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-gray-600">
                    {pagination.totalCount} Products
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results count */}
        {!fetchLoading && pagination && (
          <div className="mb-4 mt-2">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalCount
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {pagination.totalCount}
              </span>{" "}
              products
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {fetchLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-md animate-pulse aspect-[3/4]"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!fetchLoading && fetchError && (
          <div className="bg-white rounded-md border border-red-200 p-12 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 text-sm mb-4">{fetchError}</p>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!fetchLoading && !fetchError && products.length === 0 && (
          <div className="bg-white rounded-md border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        )}

        {/* Product grid */}
        {!fetchLoading && !fetchError && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {products.map((product, index) => (
                <ProductCardGrid
                  key={product._id || product.slug || index}
                  product={product}
                  userRole={userRole}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}