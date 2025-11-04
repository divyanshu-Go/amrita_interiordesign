import Link from "next/link";
import { getAllProducts } from "@/lib/fetchers/products";
import { getAllCategories } from "@/lib/fetchers/categories";
import ProductList from "@/components/admin/ProductList";

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory ({products.length} total)</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first product</p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <ProductList initialProducts={products} categories={categories} />
      )}
    </div>
  );
}