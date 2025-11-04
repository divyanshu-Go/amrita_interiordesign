import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Category</h1>
        <p className="text-gray-600 mt-2">Add a new product category to your store</p>
      </div>

      <CategoryForm />
    </div>
  );
}