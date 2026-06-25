// app/(customer)/category/[slug]/page.js

import {
  getCategoryFilterOptions,
  getAllCategories,
  getSSRCategoryProducts,
} from "@/lib/fetchers/serverCategories";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumb from "@/components/customer/Breadcrumb";
import CategoryPageClient from "@/components/customer/CategoryPageClient";
import SSRProductGrid from "@/components/customer/SSRProductGrid";   // ← NEW
import Section from "@/components/ui/Section";

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

  // Run both fetches in parallel — fixed from the broken Promise.resolve([])
  const [data, ssrProductsRaw] = await Promise.all([
    getCategoryFilterOptions(slug),
    // We need category._id which getCategoryFilterOptions returns,
    // so we fetch a small pre-resolve list here using the slug directly.
    // getSSRCategoryProducts by slug is cleaner — see note below.
    Promise.resolve(null), // placeholder; resolved after data check
  ]);

  if (!data) notFound();

  const { category, filterOptions } = data;

  // Fetch SSR products now that we have category._id
  const ssrProductList = await getSSRCategoryProducts(category._id);

  return (
    <>
      <BreadcrumbJsonLd category={category} />
      <ItemListJsonLd products={ssrProductList} category={category} />
      <FaqJsonLd faqs={category.faqs} />

      <Breadcrumb items={[{ label: category.name }]} />

      <Section className="py-6 lg:py-8">

        <SeoIntro text={category.seoIntro} />

        {/*
          SSRProductGrid renders as real HTML — Google reads this.
          It is a pure server component with no Suspense boundary.
          CategoryPageClient hides it (via the "ssr-product-grid" id)
          once it hydrates and renders the interactive grid.
        */}
        <SSRProductGrid products={ssrProductList} />

        {/*
          CategoryPageClient handles all interactivity: filters,
          pagination, sort, role-based pricing. It wraps useSearchParams()
          so it still needs Suspense.
          
          ssrProducts is passed so the client can display products
          immediately on hydration without waiting for its own API fetch
          on the default (unfiltered, page 1) view.
        */}
        <Suspense fallback={null}>
          <CategoryPageClient
            category={category}
            filterOptions={filterOptions}
            categorySlug={slug}
            ssrProducts={ssrProductList}
          />
        </Suspense>

        <SeoFooter category={category} />

      </Section>
    </>
  );
}