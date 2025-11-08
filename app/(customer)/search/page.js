import { searchProducts } from "@/lib/fetchers/search";
import { getAllCategories } from "@/lib/fetchers/categories";
import { getUserProfile } from "@/lib/api/api";
import Breadcrumb from "@/components/customer/Breadcrumb";
import SearchResultsClient from "@/components/customer/SearchResultsClient";

export default async function SearchPage({ searchParams }) {
  const query = await searchParams.q || "";
  const user = await getUserProfile();
  const userRole = user?.role || "user";

  // Only search if query has at least 2 characters
  const products = query.length >= 2 ? await searchProducts(query) : [];
  const categories = await getAllCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Search Results" }
        ]}
      />

      {/* Search Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query ? (
            <p className="text-lg text-gray-600">
              Showing results for: <span className="font-semibold text-orange-600">"{query}"</span>
            </p>
          ) : (
            <p className="text-lg text-gray-600">
              Enter a search query to find products
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>{products.length} Products Found</span>
            {userRole === "enterprise" && (
              <span className="text-orange-600 font-medium">
                • Enterprise Pricing Active
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Search
            </h3>
            <p className="text-gray-600">
              Use the search bar above to find products
            </p>
          </div>
        ) : query.length < 2 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⌨️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Keep Typing...
            </h3>
            <p className="text-gray-600">
              Enter at least 2 characters to search
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "<span className="font-semibold">{query}</span>"
            </p>
            <p className="text-sm text-gray-500">
              Try different keywords or browse our categories
            </p>
          </div>
        ) : (
          <SearchResultsClient 
            products={products} 
            userRole={userRole}
            query={query}
            categories={categories}
          />
        )}
      </section>
    </div>
  );
}