// app/(customer)/category/[slug]/page.jsx

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  getCategoryPageData,
} from "@/lib/serversideFetchers/categoryPage";
import Breadcrumb from "@/components/customer/Breadcrumb";
import NewFilterSidebar from "@/components/customer/NewFilterSidebar";
import NewProductGrid from "@/components/customer/NewProductGrid";
import NewPaginationLinks from "@/components/customer/NewPaginationLinks";
import Section from "@/components/ui/Section";

export const revalidate = 1800;

// TODO (SEO): generateStaticParams, generateMetadata, and JSON-LD



function SeoIntro({ text }) {
  if (!text?.trim()) return null;
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="prose prose-sm max-w-none text-gray-600 mb-6">
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-3 leading-relaxed">{para.trim()}</p>
      ))}
    </div>
  );
}

function SeoFooter({ category }) {
  const hasBuyingGuide = !!category.buyingGuide?.trim();
  const hasFaqs = !!category.faqs?.length;
  if (!hasBuyingGuide && !hasFaqs) return null;

  return (
    <div className="mt-12 border-t border-gray-100 pt-8 space-y-10">
      {hasBuyingGuide && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Buying Guide: {category.name}
          </h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            {category.buyingGuide.split(/\n\n+/).filter(Boolean).map((para, i) => (
              <p key={i} className="mb-3 leading-relaxed">{para.trim()}</p>
            ))}
          </div>
        </section>
      )}
      {hasFaqs && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {category.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-md p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const headersList = await headers();
  const userRole = headersList.get("x-user-role") || "user";
  const enterpriseStatus = headersList.get("x-user-enterprise-status") || "unverified";

  const data = await getCategoryPageData({ slug, searchParams: resolvedSearchParams, userRole });
  if (!data) notFound();

  const { category, filterOptions, products, pagination } = data;

  const priceRange =
    userRole === "enterprise" ? filterOptions.enterprisePriceRange : filterOptions.retailPriceRange;

  return (
    <>

      <Breadcrumb items={[{ label: category.name }]} />

      <Section className="py-6 lg:py-8">
        <SeoIntro text={category.seoIntro} />

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          <aside className="sm:col-span-4 md:col-span-3 col-span-12">
            <NewFilterSidebar filterOptions={filterOptions} priceRange={priceRange} />
          </aside>

          <main className="sm:col-span-8 md:col-span-9 col-span-12">
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
                  <h1 className="text-lg font-semibold text-gray-900">{category.name}</h1>
                  {category.description && (
                    <p className="text-xs text-gray-600 line-clamp-1">{category.description}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-gray-600">
                      {pagination.totalCount} Products
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
                </span>{" "}
                of <span className="font-semibold text-gray-700">{pagination.totalCount}</span> products
              </p>
            </div>

            <NewProductGrid products={products} userRole={userRole} enterpriseStatus={enterpriseStatus} />

            <NewPaginationLinks pagination={pagination} searchParams={resolvedSearchParams} />
          </main>
        </div>

        <SeoFooter category={category} />
      </Section>
    </>
  );
}