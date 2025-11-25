import { getProductBySlug } from "@/lib/fetchers/products";
import { getUserProfile } from "@/lib/api/api";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import ProductPageClient from "@/components/customer/ProductPageClient";
import colorVariant from "@/models/colorVariant";

// app/(customer)/product/[slug]/page.js
export default async function ProductPage({ params }) {
  const data = await getProductBySlug(params.slug);
  const user = await getUserProfile();

  if (!data) {
    notFound();
  }

  const { product, variants, colorVariants, patternVariants } = data;
  const userRole = user?.role || "user";

  return (
    <div className="bg-gray-50 min-h-screen">
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
        userRole={userRole}
      />
    </div>
  );
}
