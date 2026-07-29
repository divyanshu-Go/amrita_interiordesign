// app/(customer)/product/[slug]/page.js

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/serversideFetchers/products";
import { getRelatedByCategory, getRelatedByCollection } from "@/lib/serversideFetchers/relatedProducts";
import { getSiteConfig } from "@/lib/fetchers/siteConfig";
import { resolvePrice } from "@/lib/pricing/resolvePrice";

import Breadcrumb from "@/components/customer/Breadcrumb";
import ProductImageGallery from "@/components/ProductPage/ProductImageGallery";
import ProductPriceBox from "@/components/ProductPage/ProductPriceBox";
import VariantRow from "@/components/ProductPage/VariantRow";
import ProductDetails from "@/components/ProductPage/ProductDetails";
import TrustBadges from "@/components/ProductPage/TrustBadges";
import CartButton from "@/components/ProductPage/CartButton";
import { ShareButton, ContactButtons } from "@/components/ProductPage/ProductActions";
import RelatedProductsRow from "@/components/ProductPage/RelatedProductsRow";

export const revalidate = 1800;

// TODO (SEO): generateStaticParams, generateMetadata, and JSON-LD
// (Product/Category/Breadcrumb/FAQ) were removed temporarily during
// SSR refactor. Rebuild these before launch — needed for Google
// indexing, rich results, and social share previews.
//
// generateStaticParams: use a LIGHTWEIGHT slug-only fetch (not
// getAllProducts/getAllCategories — those over-fetch full docs).


// ── Page ────────────────────────────────────────────────────────────────────
export default async function ProductPage({ params }) {
  const { slug } = await params;

  // Same pattern as the category page: read the role middleware already
  // decoded from the JWT, instead of re-fetching auth client-side.
  const headersList = await headers();
  const userRole = headersList.get("x-user-role") || "user";
  const isEnterprise = userRole === "enterprise";

  const [data, siteConfig] = await Promise.all([
    getProductBySlug(slug),
    getSiteConfig(),
  ]);

  if (!data) notFound();

  const { product, colorVariants, patternVariants } = data;
  const price = resolvePrice(product, isEnterprise);

  const productId = product._id.toString();
  const colorVariantIds = product.colorVariant ? [String(product.colorVariant._id || product.colorVariant)] : [];
  const patternVariantIds = product.patternVariant ? [String(product.patternVariant._id || product.patternVariant)] : [];
  const categoryId = product.category?.[0] ? String(product.category[0]._id || product.category[0]) : null;

  const [relatedCollection, relatedCategory] = await Promise.all([
    getRelatedByCollection({ productId, colorVariantIds, patternVariantIds, limit: 8 }),
    getRelatedByCategory({ categoryId, productId, limit: 12 }),
  ]);

  const collectionIds = new Set(relatedCollection.map((p) => p._id.toString()));
  const categoryFiltered = relatedCategory.filter((p) => !collectionIds.has(p._id.toString()));

  return (
    <>

      <div className="bg-gray-50 min-h-screen">
        <div className="w-full">
          <Breadcrumb
            items={[
              {
                label: product.category[0]?.name || "Products",
                href: product.category[0] ? `/category/${product.category[0]?.slug}` : "/products",
              },
              { label: product.name },
            ]}
          />
        </div>

        <main className="w-full mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8">
            {/* LEFT — image gallery (client: carousel state) */}
            <div className="w-full flex justify-center">
              <ProductImageGallery images={product.images} productName={product.name} />
            </div>

            {/* RIGHT — product info (server-rendered, visible in initial HTML) */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-2">
                {product.brand && (
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                    {product.brand}
                  </p>
                )}
                <ShareButton />
              </div>

              <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                {product.name}
              </h1>

              <ProductPriceBox price={price} isEnterprise={isEnterprise} />

              {colorVariants?.length > 0 && (
                <VariantRow label="Color" variants={colorVariants} nameKey="color" currentSlug={product.slug} />
              )}

              {patternVariants?.length > 0 && (
                <VariantRow label="Pattern" variants={patternVariants} nameKey="pattern" currentSlug={product.slug} />
              )}

              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-semibold px-2 py-1 rounded-lg w-fit">
                  ⭐ Featured
                </span>
              )}

              <div className="flex flex-col gap-3 py-4">
                <CartButton productId={product._id.toString()} stock={product.stock} sellBy={product.sellBy} />
                <ContactButtons product={product} phone={siteConfig.phone} whatsapp={siteConfig.whatsapp} />
              </div>
            </div>
          </div>

          <ProductDetails product={product} />
          <TrustBadges />

          <div className="mt-12 space-y-12">
            <RelatedProductsRow title="Similar Designs & Variants" products={relatedCollection} />
            <RelatedProductsRow title="More from this Category" products={categoryFiltered} />
          </div>
        </main>
      </div>
    </>
  );
}