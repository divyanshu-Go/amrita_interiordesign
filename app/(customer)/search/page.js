// app/(customer)/search/page.js

import { searchProducts } from "@/lib/fetchers/search";
import { getUserProfile } from "@/lib/api/api";
import Breadcrumb from "@/components/customer/Breadcrumb";
import SearchResultsPageClient from "@/components/customer/SearchResultsClient";

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q?.trim() || "";
  // const user = await getUserProfile();
  // const userRole = user?.role || "user";

  const products = query.length >= 2 ? await searchProducts(query) : [];

  // --- HEADER CONTENT (same format as Category Page) ---
  const headerContent = (
    <section
      key={`search-header-${query}`}
      className="bg-white border border-gray-100 rounded-md p-4 mb-4"
    >
      <h1 className="text-lg font-semibold text-gray-900">
        Search Results for: <span className="text-orange-600">"{query}"</span>
      </h1>

      <p className="text-xs text-gray-600 mt-1">
        {products.length} product{products.length !== 1 && "s"} found
      </p>

      <div className="mt-2 flex items-center gap-2 text-xs">
        

        {query.length < 2 && (
          <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-gray-600">
            Type at least 2 characters to search
          </span>
        )}
      </div>
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
