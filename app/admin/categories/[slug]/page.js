// app/admin/categories/[slug]/page.js
import { getOnlyCategoryBySlug } from "@/lib/fetchers/serverCategories";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/admin/CategoryProducts";
import { Suspense } from "react";

export default async function EditCategoryPage({ params }) {
  const category = await getOnlyCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-2">
          Update category details
        </p>
      </div>

      <CategoryForm category={category} />

      <Suspense fallback={<ProductsSkeleton />}>
        <CategoryProducts categoryId={category._id} />
      </Suspense>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="mt-8 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-16 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
}