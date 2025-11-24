import { getProductBySlug } from "@/lib/fetchers/products";
import { getUserProfile } from "@/lib/api/api";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/customer/Breadcrumb";
import ProductPageClient from "@/components/customer/ProductPageClient";


// app/(customer)/product/[slug]/page.js
export default async function ProductPage({ params }) {
  const data = await getProductBySlug(params.slug);
  const user = await getUserProfile();

  if (!data) {
    notFound();
  }

  const { product, variants } = data;
  const userRole = user?.role || "user";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Breadcrumb
        items={[
          { 
            label: product.category?.name || "Products", 
            href: product.category ? `/category/${product.category.slug}` : "/products" 
          },
          { label: product.name },
        ]}
      />

      <ProductPageClient product={product} variants={variants} userRole={userRole} />
    </div>
  );
}