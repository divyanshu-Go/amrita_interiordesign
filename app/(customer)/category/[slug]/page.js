import { getCategoryBySlug } from "@/lib/fetchers/categories";
import { getUserProfile } from "@/lib/api/api";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClient from "@/components/customer/CategoryPageClient";

export default async function CategoryPage({ params }) {
  const data = await getCategoryBySlug(params.slug);
  const user = await getUserProfile();

  if (!data) {
    notFound();
  }

  const { category, products } = data;
  const userRole = user?.role || "user";

  return (
    <div className="bg-gray-50 min-h-screen ">
      <Breadcrumb
        items={[
          { label: category[0]?.name }
        ]}
      />

      {/* Category Header */}
      <section className="bg-white border-b b">
        <div className="max-w-7xl mx-auto px-4 py-6 b">
          <div className="flex items-start gap-8 b">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-32 h-32 object-cover rounded-lg shadow-lg block"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 max-w-3xl">
                  {category.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>{products.length} Products Available</span>
                {userRole === "enterprise" && (
                  <span className="text-orange-600 font-medium">
                    • Enterprise Pricing Active
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl b mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products in this category yet
            </h3>
            <p className="text-gray-600">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <CategoryPageClient products={products} userRole={userRole} />
        )}
      </section>
    </div>
  );
}