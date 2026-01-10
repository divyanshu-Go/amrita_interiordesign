// app/(customer)/category/[slug]/test/page.js
import { getCategoryBySlug } from "@/lib/fetchers/serverCategories";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClientTest from "@/components/customer/CategoryPageClientTest";
import CategoryPageClient from "@/components/customer/CategoryPageClient";

// Regenerate this page every 60 seconds (ISR)
export const revalidate = 3000;

export default async function CategoryPage({ params }) {
  const data = await getCategoryBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { category, products } = data;

  // Build a user-agnostic headerContent (no userRole-dependent UI here)
  const headerContent = (
    <section
      key={`category-header-${category.slug || category._id}`}
      className="bg-white border border-gray-100 rounded-md p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        {category.image && (
          <img
            src={category.image}
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

          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-gray-600">
              {products.length} Products
            </span>

            {/* Enterprise badge removed from server header; client will show it if applicable */}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Breadcrumb items={[{ label: category?.name }]} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products in this category yet
            </h3>
            <p className="text-gray-600">Check back soon for new arrivals!</p>
          </div>
        ) : (
          // Note: we pass products and a defaultUserRole of "user".
          // The client component will fetch the real user profile and update UI.
          <CategoryPageClient
            products={products}
            headerContent={headerContent}
          />
        )}
      </section>
    </>
  );
}
