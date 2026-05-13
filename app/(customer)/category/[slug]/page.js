// app/(customer)/category/[slug]/page.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// BEFORE: fetched ALL products server-side, passed to client for filtering.
//         Client-side filtering meant filters couldn't persist on reload,
//         URL wasn't the source of truth, and it couldn't scale.
//
// AFTER:
//   • Server fetches ONLY filter sidebar options (getCategoryFilterOptions)
//     via a fast aggregation — one MongoDB round-trip, no full documents
//   • Products are fetched client-side via /api/products/by-category
//     with all filters/sort/page as URL params
//   • URL is the single source of truth for all state
//   • Reloading the page restores exact state
// ─────────────────────────────────────────────────────────────────────────

import { getCategoryFilterOptions, getAllCategories } from "@/lib/fetchers/serverCategories";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClient from "@/components/customer/CategoryPageClient";
import Section from "@/components/ui/Section";

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories
      .filter((c) => c.slug)
      .map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const data = await getCategoryFilterOptions(slug);

  if (!data) {
    return { title: "Category Not Found" };
  }

  const { category } = data;

  const title = `${category.name} - Buy Online at Best Price`;
  const description = category.description
    ? category.description.slice(0, 155)
    : `Shop ${category.name} online at Interio97. Fast delivery across Delhi NCR.`;

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

export default async function CategoryPage({ params }) {
  const slug = await params.slug;
  const data = await getCategoryFilterOptions(slug);

  if (!data) notFound();

  const { category, filterOptions } = data;

  return (
    <>
      <BreadcrumbJsonLd category={category} />
      <Breadcrumb items={[{ label: category.name }]} />

      <Section className="py-6 lg:py-8">
        <CategoryPageClient
          category={category}
          filterOptions={filterOptions}
          categorySlug={slug}
        />
      </Section>
    </>
  );
}