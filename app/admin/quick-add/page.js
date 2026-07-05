// app/admin/products/quick-add/page.js
import QuickAddClient from "@/components/admin/QuickAddClient";
import { getAllCategories } from "@/lib/fetchers/serverCategories";
import { getAllColorVariantsServer } from "@/lib/serversideFetchers/colorVariants";
import { getAllPatternVariantsServer } from "@/lib/serversideFetchers/patternVariants";
import { getAllApplicationsServer } from "@/lib/serversideFetchers/applications";

export default async function QuickAddPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Quick Add Product</h1>
        <p className="text-gray-600 mt-2">
          Pick a category, then add products one after another
        </p>
      </div>

      <QuickAddClient
        categories={categories}
        colorVariants={colorVariants}
        patternVariants={patternVariants}
        applications={applications}
      />
    </div>
  );
}