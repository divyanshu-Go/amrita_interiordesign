// components/customer/CategoryPageClient.js
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import FilterSidebar from "./FilterSidebar";
import ProductCardGrid from "./ProductCardGrid";
import Pagination from "../ui/Pagination";
import MarbleSheetSubTypeSelector from "./MarbleSheetSubTypeSelector"; // ← NEW

const PRODUCTS_PER_PAGE = 24;

// ── Helpers ───────────────────────────────────────────────────────────────

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
    subType: searchParams.get("subType") || "", // ← NEW
  };
}

function buildSearchParams(filters, priceRange) {
  const params = new URLSearchParams();

  if (filters.page && filters.page > 1) params.set("page", filters.page);
  if (filters.sortBy && filters.sortBy !== "newest")
    params.set("sortBy", filters.sortBy);

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
  if (filters.subType) params.set("subType", filters.subType); // ← NEW

  return params.toString();
}

// ── Component ─────────────────────────────────────────────────────────────

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
  ssrProducts = [],          // ← NEW
}) {
  const filterOptions = { ...EMPTY_FILTER_OPTIONS, ...rawFilterOptions };

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userRole, loading: authLoading } = useAuth();

  const priceRange =
    (userRole === "enterprise"
      ? filterOptions.enterprisePriceRange
      : filterOptions.retailPriceRange) ??
    filterOptions.retailPriceRange ??
    { min: 0, max: 100000 };

  const [products, setProducts] = useState(ssrProducts);
  const [pagination, setPagination] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(ssrProducts.length === 0);
  const [fetchError, setFetchError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const abortRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    if (authLoading) return;

    // If SSR already provided products and this is the initial load
    // (page 1, no filters active), skip the fetch to avoid a flash.
    const filters = readFiltersFromURL(searchParams, priceRange);
    const isDefaultState =
      filters.page === 1 &&
      filters.sortBy === "newest" &&
      filters.colors.length === 0 &&
      filters.brands.length === 0 &&
      filters.sizes.length === 0 &&
      filters.thicknesses.length === 0 &&
      filters.materials.length === 0 &&
      filters.patterns.length === 0 &&
      filters.finishes.length === 0 &&
      filters.applications.length === 0 &&
      !filters.inStock &&
      !filters.subType;

    if (ssrProducts.length > 0 && isDefaultState) {
      // Keep products visible, suppress skeleton, but continue the fetch below.
      // setFetchLoading stays false so skeleton never shows.
    } else {
      setFetchLoading(true);
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

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
      if (filters.subType) apiParams.set("subType", filters.subType); // ← NEW

      const res = await fetch(`/api/products/by-category?${apiParams}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("[CategoryPageClient] fetch error:", err);
      setFetchError("Failed to load products. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  }, [searchParams, userRole, authLoading, categorySlug, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      const qs = buildSearchParams({ ...newFilters, page: 1 }, priceRange);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, priceRange]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      const current = readFiltersFromURL(searchParams, priceRange);
      const qs = buildSearchParams({ ...current, page: newPage }, priceRange);
      router.push(`${pathname}?${qs}`, { scroll: true });
    },
    [router, pathname, searchParams, priceRange]
  );

  // ← NEW: subType selector handler — resets to page 1, preserves all other filters
  const handleSubTypeChange = useCallback(
    (value) => {
      const current = readFiltersFromURL(searchParams, priceRange);
      const qs = buildSearchParams({ ...current, subType: value, page: 1 }, priceRange);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams, priceRange]
  );

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">

      {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
      <aside className="sm:col-span-4 md:col-span-3 col-span-12">
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

        {/* ← NEW: Sub-type selector — only renders for marble-sheet */}
        {categorySlug === "marble-sheet" && (
          <MarbleSheetSubTypeSelector
            currentSubType={currentFilters.subType}
            onSelect={handleSubTypeChange}
          />
        )}

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
                className="bg-gray-100 rounded-md animate-pulse aspect-3/4"
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