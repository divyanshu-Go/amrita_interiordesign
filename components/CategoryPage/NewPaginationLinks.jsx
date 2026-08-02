// components/customer/NewPaginationLinks.jsx
//
// ── WHY THIS IS A SERVER COMPONENT ──────────────────────────────────────
// These are real <Link> elements pointing at real, crawlable URLs — not
// buttons with onClick handlers. Googlebot (and any crawler) can follow
// these links directly without executing JavaScript, which is what makes
// every page of every filtered view independently indexable. There is no
// reason for this to run in the browser.
// ─────────────────────────────────────────────────────────────────────────

import Link from "next/link";

// Builds "?colors=white&sortBy=priceLowHigh&page=3" — keeps every existing
// param, only overrides "page". searchParams here is the plain object
// Next.js gives Server Components (not URLSearchParams).
function buildPageHref(searchParams, page) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams || {})) {
    if (key === "page") continue; // we set this explicitly below
    if (value) params.set(key, value);
  }

  if (page > 1) params.set("page", page);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default function NewPaginationLinks({ pagination, searchParams }) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  // Keep the page list short: current page, 2 neighbors either side,
  // plus first/last. Simple, no fancy ellipsis-collapsing logic needed
  // for most category sizes — easy to extend later if a category ever
  // has 50+ pages.
  const pagesToShow = new Set(
    [1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages)
  );
  const sortedPages = [...pagesToShow].sort((a, b) => a - b);

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {page > 1 && (
        <Link
          href={buildPageHref(searchParams, page - 1)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          Previous
        </Link>
      )}

      {sortedPages.map((p, i) => {
        // Insert "…" when there's a gap between consecutive shown pages
        const prev = sortedPages[i - 1];
        const showGap = prev && p - prev > 1;

        return (
          <span key={p} className="flex items-center gap-2">
            {showGap && <span className="text-gray-400 px-1">…</span>}
            <Link
              href={buildPageHref(searchParams, p)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                p === page
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Link>
          </span>
        );
      })}

      {page < totalPages && (
        <Link
          href={buildPageHref(searchParams, page + 1)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          Next
        </Link>
      )}
    </nav>
  );
}