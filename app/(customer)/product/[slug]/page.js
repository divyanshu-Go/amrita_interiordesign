// app/(customer)/product/[slug]/page.js
import { getProductBySlug, getAllProducts } from "@/lib/fetchers/serverProducts";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import ProductPageClient from "@/components/customer/ProductPageClient";
import {
  getRelatedByCategory,
  getRelatedByCollection,
} from "@/lib/fetchers/relatedProducts";
import RelatedProductsRow from "@/components/customer/RelatedProductsRow";

export const revalidate = 1800;

// ── generateStaticParams ──────────────────────────────────────────────────
// WHY: Without this, Next.js renders every product page on-demand when
// Google first crawls it. The crawler waits, sometimes times out, and the
// page gets marked "crawled — not indexed".
//
// With this: all product pages are pre-built at deploy time as static HTML.
// Google gets instant HTML with no JS needed. Fastest possible crawl + index.
// ISR (revalidate=1800) keeps them fresh every 30 min.
// ─────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ── generateMetadata ──────────────────────────────────────────────────────
// WHY: Every product page was showing the same generic title and description.
// Google treats that as duplicate/thin content and won't rank any of them.
//
// Now each product gets a unique, keyword-rich title and description built
// from its actual data: name, brand, material, category, price.
// This is what appears in Google search results.
// ─────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const data = await getProductBySlug(slug);

  if (!data) {
    return { title: "Product Not Found" };
  }

  const { product } = data;

  const categoryName = product.category?.[0]?.name || "Interior Materials";
  const brand = product.brand || "Interio97";
  const material = product.material?.length
    ? product.material.join(", ")
    : null;

  // Title: "Wooden Oak Flooring - Beige | Brand | Interio97"
  // Kept under 60 chars for Google to display it without truncation
  const title = [product.name, brand].filter(Boolean).join(" - ");

  // Description: natural sentence using product fields.
  // 140–160 chars is the sweet spot for Google snippets.
  const descParts = [
    `Buy ${product.name}`,
    categoryName ? `in ${categoryName}` : null,
    material ? `— made of ${material}` : null,
    product.retailPrice
      ? `Starting at ₹${product.retailDiscountPrice || product.retailPrice}`
      : null,
    "Shop now at Interio97 with fast delivery across Delhi NCR.",
  ].filter(Boolean);

  const description = descParts.join(". ").slice(0, 160);

  const imageUrl = product.images?.[0] || null;

  return {
    title,
    description,
    keywords: [
      product.name,
      categoryName,
      brand,
      ...(product.material || []),
      ...(product.tags || []),
      "interior design Delhi",
      "buy flooring online India",
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title,
      description,
      url: `https://www.interio97.in/product/${product.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: "website",
    },
    alternates: {
      canonical: `https://www.interio97.in/product/${product.slug}`,
    },
  };
}

// ── JSON-LD Structured Data ───────────────────────────────────────────────
// WHY: This is the code that makes Google show rich results — price, rating,
// availability shown directly in search results (not just a blue link).
// Without this, interio97.in will never get rich snippets.
// It's invisible to users but Google reads it directly from the HTML.
// ─────────────────────────────────────────────────────────────────────────
function ProductJsonLd({ product }) {
  const price = product.retailDiscountPrice || product.retailPrice;
  const categoryName = product.category?.[0]?.name || "Interior Materials";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} — premium ${categoryName}`,
    sku: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || "Interio97",
    },
    image: product.images || [],
    offers: {
      "@type": "Offer",
      url: `https://www.interio97.in/product/${product.slug}`,
      priceCurrency: "INR",
      price: price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Interio97",
      },
    },
    ...(product.material?.length && {
      material: product.material.join(", "),
    }),
    ...(product.category?.[0]?.name && {
      category: product.category[0].name,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── BreadcrumbList JSON-LD ────────────────────────────────────────────────
function BreadcrumbJsonLd({ product }) {
  const categoryName = product.category?.[0]?.name || "Products";
  const categorySlug = product.category?.[0]?.slug;

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
      ...(categorySlug
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: `https://www.interio97.in/category/${categorySlug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `https://www.interio97.in/product/${product.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: product.name,
              item: `https://www.interio97.in/product/${product.slug}`,
            },
          ]),
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
export default async function ProductPage({ params }) {
  const slug = await params.slug;
  const data = await getProductBySlug(slug);

  if (!data) notFound();

  const { product, variants, colorVariants, patternVariants } = data;

  const productId = product._id.toString();

  const colorVariantIds = product.colorVariant
    ? [String(product.colorVariant._id || product.colorVariant)]
    : [];

  const patternVariantIds = product.patternVariant
    ? [String(product.patternVariant._id || product.patternVariant)]
    : [];

  const categoryId = product.category?.[0]
    ? String(product.category[0]._id || product.category[0])
    : null;

  const [relatedCollection, relatedCategory] = await Promise.all([
    getRelatedByCollection({ productId, colorVariantIds, patternVariantIds, limit: 8 }),
    getRelatedByCategory({ categoryId, productId, limit: 12 }),
  ]);

  const collectionIds = new Set(relatedCollection.map((p) => p._id.toString()));
  const categoryFiltered = relatedCategory.filter(
    (p) => !collectionIds.has(p._id.toString())
  );

  return (
    <>
      {/* Structured data injected into <head> by Next.js */}
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />

      <div className="bg-gray-50 min-h-screen py-2.5">
        <Breadcrumb
          items={[
            {
              label: product.category[0]?.name || "Products",
              href: product.category[0]
                ? `/category/${product.category[0]?.slug}`
                : "/products",
            },
            { label: product.name },
          ]}
        />

        <ProductPageClient
          product={product}
          variants={variants}
          colorVariants={colorVariants}
          patternVariants={patternVariants}
        />

        <RelatedProductsRow
          title="Similar Designs & Variants"
          products={relatedCollection}
        />

        <RelatedProductsRow
          title="More from this Category"
          products={categoryFiltered}
        />
      </div>
    </>
  );
}