import { getAdminProductsByCategoryId } from "@/lib/serversideFetchers/categoryProducts";
import Link from "next/link";

export default async function CategoryProducts({ categoryId }) {
  const products = await getAdminProductsByCategoryId(categoryId);

  if (!products.length) return null;

  return (
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
              {product.images?.[0] ? (
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
                <p className="text-sm text-gray-600">
                  SKU: {product.sku || "—"}
                </p>
              </div>
            </div>

            <Link
              href={`/admin/products/${product.slug}`}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Edit →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
