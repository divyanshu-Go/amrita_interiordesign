// app/admin/category-defaults/page.js
import CategoryDefaultsClient from "@/components/admin/CategoryDefaultsClient";
import { getAllCategories } from "@/lib/fetchers/serverCategories";
import { getAllApplicationsServer } from "@/lib/serversideFetchers/applications";


export default async function CategoryDefaultsPage() {
  const categories = await getAllCategories();
  const applications = await getAllApplicationsServer();


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Category Defaults</h1>
        <p className="text-gray-600 mt-2">
          Set default values used when quick-adding products for each category
        </p>
      </div>
      <CategoryDefaultsClient categories={categories} applications={applications} />
    </div>
  );
}