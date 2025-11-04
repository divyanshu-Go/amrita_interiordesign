import { getCategoryBySlug } from "@/lib/fetchers/categories";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }) {
  const data = await getCategoryBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { category, products } = data;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-2">
          Update category details • {products.length} product(s) in this category
        </p>
      </div>

      <CategoryForm category={category} />

      {products.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Products in this category ({products.length})
          </h2>
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      📦
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                  </div>
                </div>
                <a
                  href={`/admin/products/${product.slug}`}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Edit →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}