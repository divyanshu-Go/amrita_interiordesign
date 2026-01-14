import { getProductBySlug } from "@/lib/fetchers/serverProducts";
import { getAllCategories } from "@/lib/fetchers/serverCategories";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllApplicationsServer } from "@/lib/serversideFetchers/applications";
import { getAllPatternVariantsServer } from "@/lib/serversideFetchers/patternVariants";
import { getAllColorVariantsServer } from "@/lib/serversideFetchers/colorVariants";

export default async function EditProductPage({ params }) {
  const data = await getProductBySlug(params.slug);
  const categories = await getAllCategories();
  const colorVariants = await getAllColorVariantsServer();
  const patternVariants = await getAllPatternVariantsServer();
  const applications = await getAllApplicationsServer();

  if (!data) {
    notFound();
  }

  const { product, variants } = data;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">
          Update product details and manage variants
        </p>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        colorVariants={colorVariants}
        patternVariants={patternVariants}
        applications={applications}
      />

      
    </div>
  );
}
