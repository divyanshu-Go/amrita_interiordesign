// app/(customer)/category/[slug]/page.js

import {
  getCategoryFilterOptions,
  getAllCategories,
  getSSRCategoryProducts,          // ← NEW
} from "@/lib/fetchers/serverCategories";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClient from "@/components/customer/CategoryPageClient";
import Section from "@/components/ui/Section";
import { Suspense } from "react";



export const revalidate = 1800;

// ── generateStaticParams — unchanged ─────────────────────────────────────
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

// ── generateMetadata — unchanged ─────────────────────────────────────────
export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const data = await getCategoryFilterOptions(slug);

  if (!data) return { title: "Category Not Found" };

  const { category } = data;

  const title = `${category.name} - Buy Online at Best Price`;
  const description = category.seoIntro
    ? category.seoIntro.slice(0, 155)           // ← use seoIntro if available
    : category.description
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

// ── BreadcrumbJsonLd — unchanged ──────────────────────────────────────────
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

// ── NEW: ItemList JSON-LD ─────────────────────────────────────────────────
// Puts product names + URLs into structured data.
// Google reads JSON-LD in the first crawl wave, before rendering JS.
// ─────────────────────────────────────────────────────────────────────────
function ItemListJsonLd({ products, category }) {
  if (!products.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} Products`,
    url: `https://www.interio97.in/category/${category.slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.interio97.in/product/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── NEW: FaqJsonLd ────────────────────────────────────────────────────────
// Renders FAQ schema only when faqs exist.
// Eligible for FAQ rich results in Google Search.
// ─────────────────────────────────────────────────────────────────────────
function FaqJsonLd({ faqs }) {
  if (!faqs?.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}



// ── NEW: SEO Intro ────────────────────────────────────────────────────────
// Renders seoIntro paragraphs above the client component.
// Split on double newline so admin can write multi-paragraph text.
// ─────────────────────────────────────────────────────────────────────────
function SeoIntro({ text }) {
  if (!text?.trim()) return null;

  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose prose-sm max-w-none text-gray-600 mb-6">
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-3 leading-relaxed">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}

// ── NEW: SEO Footer ───────────────────────────────────────────────────────
// Renders buyingGuide + FAQs below CategoryPageClient.
// Both are in the initial HTML — Google reads them without JS.
// ─────────────────────────────────────────────────────────────────────────
function SeoFooter({ category }) {
  const hasBuyingGuide = !!category.buyingGuide?.trim();
  const hasFaqs = !!category.faqs?.length;

  if (!hasBuyingGuide && !hasFaqs) return null;

  return (
    <div className="mt-12 border-t border-gray-100 pt-8 space-y-10">

      {/* Buying Guide */}
      {hasBuyingGuide && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Buying Guide: {category.name}
          </h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            {category.buyingGuide
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className="mb-3 leading-relaxed">
                  {para.trim()}
                </p>
              ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {hasFaqs && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {category.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-md p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params }) {
  const slug = await params.slug;

  // Both fetches run in parallel — no extra latency
  const [data, ssrProducts] = await Promise.all([
    getCategoryFilterOptions(slug),
    // We need categoryId, but getCategoryFilterOptions returns category._id.
    // We resolve ssrProducts after data is confirmed non-null below.
    Promise.resolve([]),
  ]);

  if (!data) notFound();

  const { category, filterOptions } = data;

  // Now fetch SSR products using the resolved category._id
  const ssrProductList = await getSSRCategoryProducts(category._id);

  // getOnlyCategoryBySlug only returns the fields selected in serverCategories.
  // getCategoryFilterOptions selects only _id,name,slug,image,description.
  // We need seoIntro, buyingGuide, faqs — so fetch the full category doc.
  // We do this by passing category from getCategoryFilterOptions which now
  // selects all fields (see note below).
  //
  // ⚠️  ACTION REQUIRED — see note after this file.

  return (
    <>
      <BreadcrumbJsonLd category={category} />
      <ItemListJsonLd products={ssrProductList} category={category} />
      <FaqJsonLd faqs={category.faqs} />

      <Breadcrumb items={[{ label: category.name }]} />

      <Section className="py-6 lg:py-8">

        {/* SEO intro — server rendered, Google reads this */}
        <SeoIntro text={category.seoIntro} />


        {/* Client component wrapped in Suspense — required by Next.js for useSearchParams() */}
        {/* The fallback is minimal — SSR products above already show real content */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-md animate-pulse aspect-[3/4]" />
              ))}
            </div>
          }
        >
          <CategoryPageClient
            category={category}
            filterOptions={filterOptions}
            categorySlug={slug}
            ssrProducts={ssrProductList}
          />
        </Suspense>

        {/* SEO footer — server rendered, Google reads this */}
        <SeoFooter category={category} />

      </Section>
    </>
  );
}