// app/admin/products/new/page.js

import ProductForm from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/serversideFetchers/categories";
import { getAllApplicationsServer } from "@/lib/serversideFetchers/applications";
import { getAllColorVariantsServer } from "@/lib/serversideFetchers/colorVariants";
import { getAllPatternVariantsServer } from "@/lib/serversideFetchers/patternVariants";

export default async function NewProductPage() {
  const [categories, colorVariants, patternVariants, applications] =
    await Promise.all([
      getAllCategories(),
      getAllColorVariantsServer(),
      getAllPatternVariantsServer(),
      getAllApplicationsServer(),
    ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">
          Add a new product to your inventory
        </p>
      </div>

      <ProductForm
        categories={categories}
        colorVariants={colorVariants}
        patternVariants={patternVariants}
        applications={applications}
      />
    </div>
  );
}
