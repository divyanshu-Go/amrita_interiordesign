// app/(customer)/applications/[slug]/page.js
import { getUserProfile } from "@/lib/api/api";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClient from "@/components/customer/CategoryPageClient";
import { getApplicationBySlug } from "@/lib/fetchers/applicationProducts";

export default async function ApplicationPage({ params }) {
  const data = await getApplicationBySlug(params.slug);
  // const user = await getUserProfile();

  if (!data) {
    notFound();
  }

  const { application, products } = data;
  // const userRole = user?.role || "user";

  const headerContent = (
    <section
      key={`application-header-${application.slug || application._id}`}
      className="bg-white border border-gray-100 rounded-md p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        {application.image && (
          <img
            src={application.image}
            className="w-14 h-14 object-contain rounded-sx shadow-sm ring-1 ring-gray-200"
          />
        )}

        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">
            {application.name}
          </h1>

          {application.desc && (
            <p className="text-xs text-gray-600 line-clamp-1">
              {application.desc}
            </p>
          )}

          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-gray-600">
              {products.length} Products
            </span>

            {/* {userRole === "enterprise" && (
              <span className="px-2 py-0.5 rounded-xs bg-orange-50 text-orange-600">
                Enterprise Pricing
              </span>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <Breadcrumb items={[{ label: application?.name }]} />

      {/* Page Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products for this application yet
            </h3>
            <p className="text-gray-600">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <CategoryPageClient
            products={products}
            headerContent={headerContent}
          />
        )}
      </section>
    </>
  );
}
