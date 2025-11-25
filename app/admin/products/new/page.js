// app/admin/products/new/page.js

import ProductForm from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/fetchers/categories";
import { getAllColorVariants } from "@/lib/fetchers/colorVariants";
import { getAllPatternVariants } from "@/lib/fetchers/patternVariants";


export default async function NewProductPage() {
  const categories = await getAllCategories();
  const colorVariants = await getAllColorVariants();
  const patternVariants = await getAllPatternVariants();


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to your inventory</p>
      </div>

      <ProductForm categories={categories} colorVariants={colorVariants} patternVariants={patternVariants} />
    </div>
  );
}