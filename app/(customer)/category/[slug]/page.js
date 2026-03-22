// app/(customer)/category/[slug]/page.js
import { getCategoryBySlug, getAllCategories } from "@/lib/fetchers/serverCategories";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClient from "@/components/customer/CategoryPageClient";

export const revalidate = 1800;

// ── generateStaticParams ──────────────────────────────────────────────────
// Same reason as product page — pre-builds all category pages at deploy time
// so Google gets instant static HTML instead of a slow on-demand render.
// ─────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    // NOTE: you need to export getAllCategories from serverCategories.js
    // It should return all categories with at least { slug } field.
    // See comment at bottom of this file if that function doesn't exist yet.
    const categories = await getAllCategories();
    return categories
      .filter((c) => c.slug)
      .map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

// ── generateMetadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const data = await getCategoryBySlug(slug);

  if (!data) {
    return { title: "Category Not Found" };
  }

  const { category, products } = data;

  const title = `${category.name} - Buy Online at Best Price`;

  const description = category.description
    ? category.description.slice(0, 155)
    : `Shop ${category.name} online at Interio97. ${products.length}+ products available with fast delivery across Delhi NCR.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      `buy ${category.name} online`,
      `${category.name} price India`,
      `${category.name} Delhi NCR`,
      "interior design materials",
      "Interio97",
    ].join(", "),
    openGraph: {
      title,
      description,
      url: `https://www.interio97.in/category/${category.slug}`,
      images: category.image
        ? [{ url: category.image, alt: category.name }]
        : [],
    },
    alternates: {
      canonical: `https://www.interio97.in/category/${category.slug}`,
    },
  };
}

// ── BreadcrumbList JSON-LD ────────────────────────────────────────────────
function BreadcrumbJsonLd({ category }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.interio97.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `https://www.interio97.in/category/${category.slug}`,
      },
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
export default async function CategoryPage({ params }) {
  const slug = await params.slug;
  const data = await getCategoryBySlug(slug);

  if (!data) notFound();

  const { category, products } = data;

  const headerContent = (
    <section
      key={`category-header-${category.slug || category._id}`}
      className="bg-white border border-gray-100 rounded-md p-4 mb-4"
    >
      <div className="flex items-center gap-4">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}                   // ← added alt text (was missing)
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
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {/* Structured data — read by Google, invisible to users */}
      <BreadcrumbJsonLd category={category} />

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
          <CategoryPageClient
            products={products}
            headerContent={headerContent}
          />
        )}
      </section>
    </>
  );
}

/*
 * ── ACTION REQUIRED ───────────────────────────────────────────────────────
 * generateStaticParams above calls getAllCategories() from serverCategories.js
 * If that function doesn't exist yet, add this to lib/fetchers/serverCategories.js:
 *
 * export async function getAllCategories() {
 *   await DbConnect();
 *   try {
 *     const categories = await Category.find({}, "slug name").lean();
 *     return JSON.parse(JSON.stringify(categories));
 *   } catch {
 *     return [];
 *   }
 * }
 * ─────────────────────────────────────────────────────────────────────────
 */