// app/(customer)/search/page.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// 1. Added noindex metadata — search result pages (e.g. /search?q=tiles)
//    should NEVER be indexed by Google. Every unique search query creates
//    a unique URL. Without noindex, Google could index thousands of these
//    thin, duplicate-content pages and tank your domain quality score.
//
// 2. Fixed async searchParams — Next.js 15 made searchParams async.
//    Accessing searchParams.q directly (sync) causes a warning and may
//    behave incorrectly in some edge cases. Awaiting it is correct.
//
// 3. Architecture note: products are fetched SERVER-SIDE ✓ (already correct)
//    Google crawls /search?q=tiles and sees actual product HTML — good.
//    SearchResultsPageClient handles filtering/sorting client-side after
//    the initial SSR pass — this is the right pattern.
// ─────────────────────────────────────────────────────────────────────────

import { searchProducts } from "@/lib/serversideFetchers/search";
import Breadcrumb                  from "@/components/customer/Breadcrumb";
import SearchResultsPageClient     from "@/components/customer/SearchResultsClient";

// ── Noindex — search pages must never rank in Google ─────────────────────
export const metadata = {
  title:  "Search Products | Interio97",
  robots: {
    index:  false,   // do not index this page
    follow: true,    // still follow links on it
  },
};


export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  // Next.js 15: searchParams is async — must be awaited
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query.length >= 2 ? await searchProducts(query) : [];

  const headerContent = (
    <section
      key={`search-header-${query}`}
      className="bg-white border border-gray-100 rounded-md p-4 mb-4"
    >
      <h1 className="text-lg font-semibold text-gray-900">
        Search Results for:{" "}
        <span className="text-orange-600">"{query}"</span>
      </h1>
      <p className="text-xs text-gray-600 mt-1">
        {products.length} product{products.length !== 1 && "s"} found
      </p>
      {query.length < 2 && (
        <div className="mt-2">
          <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-gray-600 text-xs">
            Type at least 2 characters to search
          </span>
        </div>
      )}
    </section>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb items={[{ label: "Search Results" }]} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResultsPageClient
          query={query}
          products={products}
          headerContent={headerContent}
        />
      </section>
    </div>
  );
}