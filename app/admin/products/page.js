// app/admin/products/page.js

import Link from "next/link";
import { getAllProducts } from "@/lib/fetchers/products";
import { getAllCategories } from "@/lib/fetchers/categories";
import ProductsTable from "@/components/admin/ProductsTable";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your inventory ({products.length} total)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-sm text-gray-600 mb-6">Get started by adding your first product</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      ) : (
        <ProductsTable products={products} categories={categories} />
      )}
    </div>
  );
}