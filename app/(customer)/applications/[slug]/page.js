// app/(customer)/applications/[slug]/page.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// Added generateMetadata, generateStaticParams, and BreadcrumbList JSON-LD.
// Same pattern as category/[slug]/page.js — application pages are real
// indexable content (e.g. "Flooring for Living Room", "Kitchen Wall Tiles")
// and can rank for application-specific searches.
// Also added alt attribute to application image (was missing — accessibility
// and SEO issue: Google Images can't understand imageless alt text).
// ─────────────────────────────────────────────────────────────────────────

import { notFound }                 from "next/navigation";
import Breadcrumb                   from "@/components/customer/Breadcrumb";
import CategoryPageClient           from "@/components/customer/CategoryPageClient";
import { getApplicationBySlug, getAllApplications } from "@/lib/fetchers/applicationProducts";

export const revalidate = 3600;

// ── generateStaticParams ──────────────────────────────────────────────────
// Pre-builds all application pages at deploy time as static HTML.
// NOTE: requires getAllApplications() to be exported from applicationProducts.js
// See comment at bottom of this file if it doesn't exist yet.
export async function generateStaticParams() {
  try {
    const applications = await getAllApplications();
    return applications.filter((a) => a.slug).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

// ── generateMetadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const data = await getApplicationBySlug(slug);

  if (!data) return { title: "Application Not Found" };

  const { application, products } = data;

  const title = `${application.name} Products - Buy Online | Interio97`;
  const description =
    application.desc
      ? application.desc.slice(0, 155)
      : `Shop ${application.name} interior design products at Interio97. ${products.length}+ options with fast delivery across Delhi NCR.`;

  return {
    title,
    description,
    keywords: [
      application.name,
      `${application.name} products`,
      `buy ${application.name} materials online`,
      `${application.name} interior Delhi NCR`,
      "Interio97",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://www.interio97.in/applications/${application.slug}`,
      images: application.image
        ? [{ url: application.image, alt: application.name }]
        : [],
    },
    alternates: {
      canonical: `https://www.interio97.in/applications/${application.slug}`,
    },
  };
}

// ── BreadcrumbList JSON-LD ────────────────────────────────────────────────
function BreadcrumbJsonLd({ application }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",
        item: "https://www.interio97.in" },
      { "@type": "ListItem", position: 2, name: application.name,
        item: `https://www.interio97.in/applications/${application.slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── Page Component ────────────────────────────────────────────────────────
export default async function ApplicationPage({ params }) {
  const slug = await params.slug;
  const data = await getApplicationBySlug(slug);

  if (!data) notFound();

  const { application, products } = data;

  const headerContent = (
    <section
      key={`application-header-${application.slug || application._id}`}
      className="bg-white border border-gray-100 rounded-md p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        {application.image && (
          <img
            src={application.image}
            alt={application.name}           // ← FIXED: was missing alt
            width={56}
            height={56}
            className="w-14 h-14 object-contain rounded-sm shadow-sm ring-1 ring-gray-200"
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
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <BreadcrumbJsonLd application={application} />
      <Breadcrumb items={[{ label: application?.name }]} />
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
          <CategoryPageClient products={products} headerContent={headerContent} />
        )}
      </section>
    </>
  );
}

/*
 * ── ACTION REQUIRED ───────────────────────────────────────────────────────
 * generateStaticParams calls getAllApplications() from applicationProducts.js
 * Add this export if it doesn't exist:
 *
 * export async function getAllApplications() {
 *   await DbConnect();
 *   try {
 *     const apps = await Application.find({}, "slug name").lean();
 *     return JSON.parse(JSON.stringify(apps));
 *   } catch {
 *     return [];
 *   }
 * }
 * ─────────────────────────────────────────────────────────────────────────
 */