import Link from "next/link";

export default function ProductCardGrid({ product, userRole }) {
  const isEnterprise = userRole === "enterprise";
  
  // 🔥 NEW LOGIC: Override if per sq ft price should be shown
let displayPrice;

if (product.showPerSqFtPrice) {
  displayPrice = product.perSqFtPrice;
} else {
  displayPrice = isEnterprise
    ? (product.enterpriseDiscountPrice || product.enterprisePrice)
    : (product.retailDiscountPrice || product.retailPrice);
}


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
      <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Product Image - 3:4 aspect ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 flex-shrink-0">
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

        {/* Product Info - Fixed height sections */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Brand - Fixed height */}
          <div className="h-4 mb-1">
            {product.brand && (
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
                {product.brand}
              </p>
            )}
          </div>

          {/* Product Name - Fixed height with 2 lines */}
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug h-10 mb-2">
            {product.name}
          </h3>

          {/* Pricing - Pushed to bottom */}
          <div className="mt-auto">
           <div className="flex items-baseline gap-2">

  {/* 🔥 SHOW PER SQ FT PRICE AS PRIMARY */}
  {product.showPerSqFtPrice ? (
    <>
      <span className="text-lg font-bold text-gray-900">
        ₹{product.perSqFtPrice} / SqFt
      </span>

      {/* old price on right, lighter */}
      <span className="text-xs text-gray-400">
        ₹{originalPrice?.toLocaleString('en-IN')} / {product.sellBy}
      </span>
    </>
  ) : (
    // 🔥 OLD LOGIC FOR NORMAL PRICE
    <>
      {hasDiscount ? (
        <>
          <span className="text-lg font-bold text-gray-900">
            ₹{displayPrice?.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{originalPrice?.toLocaleString('en-IN')}
            
          </span>
        </>
      ) : (
        <span className="text-lg font-bold text-gray-900">
          ₹{displayPrice?.toLocaleString('en-IN')}
        </span>
      )}
    </>
  )}

</div>


            {isEnterprise && (
              <p className="text-xs text-orange-600 font-medium mt-1">
                🏢 Enterprise Price
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}