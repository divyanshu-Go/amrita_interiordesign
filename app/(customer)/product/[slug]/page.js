// app/(customer)/product/[slug]/page.js

import { getProductBySlug } from "@/lib/fetchers/serverProducts";
import { getUserProfile } from "@/lib/api/api";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import ProductPageClient from "@/components/customer/ProductPageClient";
import {
  getRelatedByCategory,
  getRelatedByCollection,
} from "@/lib/fetchers/relatedProducts";
import RelatedProductsRow from "@/components/customer/RelatedProductsRow";

// app/(customer)/product/[slug]/page.js
export default async function ProductPage({ params }) {
  const slug = await params.slug;
  const data = await getProductBySlug(slug);
  // const user = await getUserProfile();

  if (!data) {
    notFound();
  }

  const { product, variants, colorVariants, patternVariants } = data;

  // 1️⃣ Extract safe string IDs
  const productId = product._id.toString();

  // Color variant ID (populated OR unpopulated)
  const colorVariantIds = product.colorVariant
    ? [String(product.colorVariant._id || product.colorVariant)]
    : [];

  // Pattern variant ID
  const patternVariantIds = product.patternVariant
    ? [String(product.patternVariant._id || product.patternVariant)]
    : [];

  // Category ID (supports populated OR unpopulated)
  const categoryId = product.category?.[0]
    ? String(product.category[0]._id || product.category[0])
    : null;

  // 2️⃣ Fetch related products in parallel
  const [relatedCollection, relatedCategory] = await Promise.all([
    getRelatedByCollection({
      productId,
      colorVariantIds,
      patternVariantIds,
      limit: 8,
    }),
    getRelatedByCategory({
      categoryId,
      productId,
      limit: 12,
    }),
  ]);




  // 3️⃣ Remove duplicates between collection and category items
  const collectionIds = new Set(relatedCollection.map((p) => p._id.toString()));

  const categoryFiltered = relatedCategory.filter(
    (p) => !collectionIds.has(p._id.toString())
  );

  return (
    <div className="bg-gray-50 min-h-screen ">
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

      {/* ───────────────────────────────────────────────
          STEP 2: PLACEHOLDER — Step 3 Component Coming Next
         ─────────────────────────────────────────────── */}
      <RelatedProductsRow
        title="Similar Designs & Variants"
        products={relatedCollection}
      />

      <RelatedProductsRow
        title="More from this Category"
        products={categoryFiltered}
      />
    </div>
  );
}
