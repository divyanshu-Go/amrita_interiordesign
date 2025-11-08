import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ProductCardGrid({ product, userRole }) {
  const isEnterprise = userRole === "enterprise";
  
  const displayPrice = isEnterprise
    ? product.enterpriseDiscountPrice || product.enterprisePrice
    : product.retailDiscountPrice || product.retailPrice;

  const originalPrice = isEnterprise
    ? product.enterprisePrice
    : product.retailPrice;

  const hasDiscount = isEnterprise
    ? product.enterpriseDiscountPrice && product.enterpriseDiscountPrice < product.enterprisePrice
    : product.retailDiscountPrice && product.retailDiscountPrice < product.retailPrice;

  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group bg-white rounded-lg border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Product Image - 3:4 aspect ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {mainImage ? (
            <>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1.5 rounded-full font-semibold text-xs">
                    Out of Stock
                  </span>
                </div>
              )}
              {hasDiscount && product.stock > 0 && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                  {discountPercentage}% OFF
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-5xl">📦</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-1.5">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Pricing - Strikethrough Style */}
          <div className="flex items-center gap-2 pt-1">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ₹{displayPrice?.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice?.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ₹{displayPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Additional Info Row */}
          <div className="flex items-center justify-between pt-1">
            {/* Attributes */}
            <div className="flex flex-wrap gap-1">
              {product.color && (
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {product.color}
                </span>
              )}
              {product.size && (
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {product.size}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            {product.stock > 0 && (
              <div className="flex items-center gap-0.5 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-xs font-medium">In Stock</span>
              </div>
            )}
          </div>

          {isEnterprise && (
            <p className="text-xs text-orange-600 font-medium pt-1">
              🏢 Enterprise Price
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}