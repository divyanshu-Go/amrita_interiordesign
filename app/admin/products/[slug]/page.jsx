import { getProductBySlug } from "@/lib/fetchers/products";
import { getAllCategories } from "@/lib/fetchers/categories";
import { getAllColorVariants } from "@/lib/fetchers/colorVariants";
import { getAllPatternVariants } from "@/lib/fetchers/patternVariants";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditProductPage({ params }) {
  const data = await getProductBySlug(params.slug);
  const categories = await getAllCategories();
  const colorVariants = await getAllColorVariants();
  const patternVariants = await getAllPatternVariants();

  if (!data) {
    notFound();
  }

  const { product, variants } = data;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">
          Update product details and manage variants
        </p>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        colorVariants={colorVariants}
        patternVariants={patternVariants}
      />

      {variants && variants.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Variants ({variants.length})
          </h2>
          <p className="text-gray-600 mb-4">
            All variants in the same group:{" "}
            <span className="font-semibold text-orange-600">
              {product.variantGroupId}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variants.map((variant) => (
              <Link
                key={variant._id}
                href={`/admin/products/${variant.slug}`}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {variant.images && variant.images[0] ? (
                    <img
                      src={variant.images[0]}
                      alt={variant.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      📦
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-orange-600">
                      {variant.name}
                    </p>
                    <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                    <div className="flex gap-2 mt-1">
                      {variant.color && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {variant.color}
                        </span>
                      )}
                      {variant.size && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {variant.size}
                        </span>
                      )}
                      {variant.thickness && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {variant.thickness}mm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">
                    ₹{variant.retailDiscountPrice || variant.retailPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock: {variant.stock}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
