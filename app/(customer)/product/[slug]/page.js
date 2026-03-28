// app/(customer)/product/[slug]/page.js
//
// Added: getSiteConfig() fetch to get phone/whatsapp dynamically.
// These are passed as props to ProductPageClient, replacing the hardcoded PHONE constant.
// All other logic is unchanged.

import { getProductBySlug, getAllProducts } from "@/lib/fetchers/serverProducts";
import { notFound }                         from "next/navigation";
import Breadcrumb                           from "@/components/customer/Breadcrumb";
import ProductPageClient                    from "@/components/customer/ProductPageClient";
import { getRelatedByCategory, getRelatedByCollection } from "@/lib/fetchers/relatedProducts";
import RelatedProductsRow                   from "@/components/customer/RelatedProductsRow";
import { getSiteConfig }                    from "@/lib/fetchers/siteConfig";

export const revalidate = 1800;

// ── generateStaticParams ──────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ── generateMetadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const slug = await params.slug;
  const data = await getProductBySlug(slug);

  if (!data) return { title: "Product Not Found" };

  const { product } = data;
  const categoryName = product.category?.[0]?.name || "Interior Materials";
  const brand        = product.brand || "Interio97";
  const material     = product.material?.length ? product.material.join(", ") : null;
  const title        = [product.name, brand].filter(Boolean).join(" - ");

  const descParts = [
    `Buy ${product.name}`,
    categoryName ? `in ${categoryName}` : null,
    material     ? `— made of ${material}` : null,
    product.retailPrice
      ? `Starting at ₹${product.retailDiscountPrice || product.retailPrice}`
      : null,
    "Shop now at Interio97 with fast delivery across Delhi NCR.",
  ].filter(Boolean);

  const description = descParts.join(". ").slice(0, 160);
  const imageUrl    = product.images?.[0] || null;

  return {
    title,
    description,
    keywords: [
      product.name, categoryName, brand,
      ...(product.material || []),
      ...(product.tags || []),
      "interior design Delhi",
      "buy flooring online India",
    ].filter(Boolean).join(", "),
    openGraph: {
      title,
      description,
      url:    `https://www.interio97.in/product/${product.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type:   "website",
    },
    alternates: {
      canonical: `https://www.interio97.in/product/${product.slug}`,
    },
  };
}

// ── JSON-LD: Product ──────────────────────────────────────────────────────
function ProductJsonLd({ product }) {
  const price        = product.retailDiscountPrice || product.retailPrice;
  const categoryName = product.category?.[0]?.name || "Interior Materials";

  const jsonLd = {
    "@context":   "https://schema.org",
    "@type":      "Product",
    name:         product.name,
    description:  product.description || `${product.name} — premium ${categoryName}`,
    sku:          product.sku || product.slug,
    brand:        { "@type": "Brand", name: product.brand || "Interio97" },
    image:        product.images || [],
    offers: {
      "@type":        "Offer",
      url:            `https://www.interio97.in/product/${product.slug}`,
      priceCurrency:  "INR",
      price,
      availability:   product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Interio97" },
    },
    ...(product.material?.length  && { material: product.material.join(", ") }),
    ...(product.category?.[0]?.name && { category: product.category[0].name }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── JSON-LD: Breadcrumb ───────────────────────────────────────────────────
function BreadcrumbJsonLd({ product }) {
  const categoryName = product.category?.[0]?.name || "Products";
  const categorySlug = product.category?.[0]?.slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.interio97.in" },
      ...(categorySlug
        ? [
            { "@type": "ListItem", position: 2, name: categoryName, item: `https://www.interio97.in/category/${categorySlug}` },
            { "@type": "ListItem", position: 3, name: product.name,  item: `https://www.interio97.in/product/${product.slug}` },
          ]
        : [
            { "@type": "ListItem", position: 2, name: product.name,  item: `https://www.interio97.in/product/${product.slug}` },
          ]
      ),
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

  // Fetch product data + site config in parallel for speed
  const [data, siteConfig] = await Promise.all([
    getProductBySlug(slug),
    getSiteConfig(),
  ]);

  if (!data) notFound();

  const { product, variants, colorVariants, patternVariants } = data;

  const productId       = product._id.toString();
  const colorVariantIds = product.colorVariant
    ? [String(product.colorVariant._id || product.colorVariant)] : [];
  const patternVariantIds = product.patternVariant
    ? [String(product.patternVariant._id || product.patternVariant)] : [];
  const categoryId = product.category?.[0]
    ? String(product.category[0]._id || product.category[0]) : null;

  const [relatedCollection, relatedCategory] = await Promise.all([
    getRelatedByCollection({ productId, colorVariantIds, patternVariantIds, limit: 8 }),
    getRelatedByCategory({ categoryId, productId, limit: 12 }),
  ]);

  const collectionIds    = new Set(relatedCollection.map((p) => p._id.toString()));
  const categoryFiltered = relatedCategory.filter((p) => !collectionIds.has(p._id.toString()));

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd product={product} />

      <div className="bg-gray-50 min-h-screen py-2.5">
        <Breadcrumb
          items={[
            {
              label: product.category[0]?.name || "Products",
              href:  product.category[0]
                ? `/category/${product.category[0]?.slug}`
                : "/products",
            },
            { label: product.name },
          ]}
        />

        {/* phone + whatsapp come from DB via ISR — no longer hardcoded */}
        <ProductPageClient
          product={product}
          variants={variants}
          colorVariants={colorVariants}
          patternVariants={patternVariants}
          phone={siteConfig.phone}
          whatsapp={siteConfig.whatsapp}
        />

        <RelatedProductsRow title="Similar Designs & Variants" products={relatedCollection} />
        <RelatedProductsRow title="More from this Category"    products={categoryFiltered} />
      </div>
    </>
  );
}