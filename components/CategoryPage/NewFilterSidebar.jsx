// components/customer/NewFilterSidebar.jsx
//
// ── WHY THIS IS THE ONLY CLIENT COMPONENT ────────────────────────────────
// Everything here is either (a) reading the URL, or (b) writing a new URL
// when the user interacts with a filter. There is no product fetching —
// changing the URL triggers a normal Next.js navigation, and the page
// (a Server Component) re-renders with fresh data. This component never
// touches product data directly.
//
// ── WHY ONE CONFIG ARRAY INSTEAD OF EIGHT JSX BLOCKS ─────────────────────
// Every checkbox-style filter (color, brand, material, pattern, finish,
// application, size, thickness) behaves identically: show a list of
// checkable options, toggle one on click, write the resulting array to
// the URL. The only differences between them are which field they read
// from filterOptions/currentFilters, and how to turn a raw value into a
// human label. FILTER_FIELDS below is the single place that describes
// those differences. Adding a new filterable field means adding one line
// to that array — not writing a new JSX block.
// ─────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

// ── Config: every checkbox-style filter field, in display order ──────────
// `key` must match both the filterOptions field name and the URL param
// name. `label` is the accordion title. `optionLabel` turns one raw
// option value into display text — most fields show it as-is; a couple
// need light formatting (thickness gets "mm", applications are objects).
const FILTER_FIELDS = [
  { key: "materials", label: "Material" },
  { key: "patterns", label: "Pattern" },
  { key: "finishes", label: "Finish" },
  { key: "applications", label: "Application" }, // options are { name, slug }
  { key: "colors", label: "Color" },
  { key: "sizes", label: "Size" },
  { key: "thicknesses", label: "Thickness", optionLabel: (v) => `${v}mm` },
  { key: "brands", label: "Brand" },
];

// Turns one raw option (a string, a number, or a { name, slug } object)
// into a stable { value, label } pair for rendering + URL storage.
function normalizeOption(rawOption, optionLabel) {
  if (rawOption && typeof rawOption === "object") {
    return { value: rawOption.slug, label: rawOption.name };
  }
  const label = optionLabel ? optionLabel(rawOption) : String(rawOption);
  return { value: String(rawOption), label };
}

// ── URL <-> filters ────────────────────────────────────────────────────────

function readFiltersFromURL(searchParams, priceRange) {
  const filters = {
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice"))
      : priceRange.min,
    maxPrice: searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice"))
      : priceRange.max,
    inStock: searchParams.get("inStock") === "true",
  };

  for (const field of FILTER_FIELDS) {
    filters[field.key] = searchParams.get(field.key)?.split(",").filter(Boolean) || [];
  }

  return filters;
}

function buildQueryString(filters, priceRange) {
  const params = new URLSearchParams();

  if (filters.sortBy && filters.sortBy !== "newest") params.set("sortBy", filters.sortBy);
  if (filters.minPrice !== priceRange.min) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== priceRange.max) params.set("maxPrice", filters.maxPrice);
  if (filters.inStock) params.set("inStock", "true");

  for (const field of FILTER_FIELDS) {
    const values = filters[field.key];
    if (values?.length) params.set(field.key, values.join(","));
  }

  // Deliberately never sets "page" — any filter change starts over at page 1.
  return params.toString();
}

function countActiveFilters(filters, priceRange) {
  const arrayCount = FILTER_FIELDS.reduce(
    (sum, field) => sum + (filters[field.key]?.length || 0),
    0
  );
  return (
    arrayCount +
    (filters.inStock ? 1 : 0) +
    (filters.minPrice !== priceRange.min ? 1 : 0) +
    (filters.maxPrice !== priceRange.max ? 1 : 0)
  );
}

// ── Small presentational pieces ─────────────────────────────────────────────

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between py-2 text-left hover:text-orange-600 transition-colors"
      >
        <span className="font-medium text-xs text-gray-900">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

// One generic checkbox group — used for every field in FILTER_FIELDS.
// No per-field variant of this exists anywhere else in the file.
function CheckboxGroup({ options, optionLabel, selectedValues, onToggle }) {
  return (
    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
      {options.map((rawOption) => {
        const { value, label } = normalizeOption(rawOption, optionLabel);
        const checked = selectedValues.includes(value);
        return (
          <label key={value} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(value)}
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
}

function PriceRangeSlider({ minPrice, maxPrice, priceRange, onChange }) {
  const span = priceRange.max - priceRange.min || 1;
  const minPct = ((minPrice - priceRange.min) / span) * 100;
  const maxPct = ((maxPrice - priceRange.min) / span) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-4 flex items-center">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-orange-400 rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={100}
          value={minPrice}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (val < maxPrice) onChange({ minPrice: val });
          }}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-orange-500 [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
        />
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={100}
          value={maxPrice}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (val > minPrice) onChange({ maxPrice: val });
          }}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-orange-500"
        />
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-xs">
          ₹{minPrice.toLocaleString("en-IN")}
        </span>
        <span className="text-gray-400">–</span>
        <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-xs">
          ₹{maxPrice.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function NewFilterSidebar({ filterOptions, priceRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const currentFilters = readFiltersFromURL(searchParams, priceRange);

  const applyFilters = useCallback(
    (partialUpdate) => {
      const nextFilters = { ...currentFilters, ...partialUpdate };
      const qs = buildQueryString(nextFilters, priceRange);
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [currentFilters, priceRange, router, pathname]
  );

  const toggleFieldValue = useCallback(
    (fieldKey, value) => {
      const current = currentFilters[fieldKey] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      applyFilters({ [fieldKey]: next });
    },
    [currentFilters, applyFilters]
  );

  const handleClear = useCallback(() => {
    const cleared = { sortBy: "newest", minPrice: priceRange.min, maxPrice: priceRange.max, inStock: false };
    for (const field of FILTER_FIELDS) cleared[field.key] = [];
    router.push(pathname);
  }, [pathname, router, priceRange]);

  const activeCount = countActiveFilters(currentFilters, priceRange);

  return (
    <>
      {/* Mobile toggle — pure UI state, unrelated to filters/URL */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-md px-4 py-3 text-sm font-semibold text-gray-700 hover:border-orange-300 transition-all duration-200 shadow-sm"
        >
          {showFilters ? (
            <>
              <X className="w-4 h-4" /> Hide Filters
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeCount > 0 && (
                <span className="ml-1 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                  {activeCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      <div className={`${showFilters ? "block" : "hidden"} sm:block sm:sticky sm:top-24`}>
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

              <AccordionItem title="Sort By" defaultOpen>
                <select
                  value={currentFilters.sortBy}
                  onChange={(e) => applyFilters({ sortBy: e.target.value })}
                  className="w-full px-2 py-2 text-xs border border-gray-200 rounded-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A to Z</option>
                </select>
              </AccordionItem>

              <AccordionItem title="Price Range" defaultOpen>
                <PriceRangeSlider
                  minPrice={currentFilters.minPrice}
                  maxPrice={currentFilters.maxPrice}
                  priceRange={priceRange}
                  onChange={applyFilters}
                />
              </AccordionItem>

              {/* One generic loop replaces eight hand-written blocks.
                  Adding a new filterable field is one line in FILTER_FIELDS
                  above — nothing changes here. */}
              {FILTER_FIELDS.map((field) => {
                const options = filterOptions?.[field.key];
                if (!options?.length) return null;

                return (
                  <AccordionItem key={field.key} title={field.label}>
                    <CheckboxGroup
                      options={options}
                      optionLabel={field.optionLabel}
                      selectedValues={currentFilters[field.key] || []}
                      onToggle={(value) => toggleFieldValue(field.key, value)}
                    />
                  </AccordionItem>
                );
              })}

              <AccordionItem title="Availability">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentFilters.inStock}
                    onChange={(e) => applyFilters({ inStock: e.target.checked })}
                    className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="ml-2 text-xs text-gray-700 group-hover:text-orange-600 transition-colors font-medium">
                    In Stock Only
                  </span>
                </label>
              </AccordionItem>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}