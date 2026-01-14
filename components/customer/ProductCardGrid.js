// components/customer/ProductCardGrid.js
"use client"
import Link from "next/link";

export default function ProductCardGrid({ product, userRole }) {
  const isEnterprise = userRole === "enterprise";

  // -----------------------------
  // 🔥 SAME PRICE LOGIC AS PRODUCT PAGE
  // -----------------------------

  // Pick enterprise or retail values
  const discounted = isEnterprise
    ? product.enterpriseDiscountPrice
    : product.retailDiscountPrice;

  const original = isEnterprise ? product.enterprisePrice : product.retailPrice;

  const perSqFt = isEnterprise
    ? product.perSqFtPriceEnterprise
    : product.perSqFtPriceRetail;

  // Check if discount exists
  const hasDiscount = discounted && discounted < original;

  // Final structured values
  let primaryPrice;
  let secondaryPrice = null;

  // CASE A — show price per SqFt
  if (product.showPerSqFtPrice) {
    primaryPrice = perSqFt;

    secondaryPrice = {
      discounted: discounted || original,
      original: hasDiscount ? original : null,
      discountPercent: hasDiscount
        ? Math.round(((original - discounted) / original) * 100)
        : 0,
      savings: hasDiscount ? original - discounted : 0,
    };
  }

  // CASE B — normal price
  else {
    primaryPrice = discounted || original;

    secondaryPrice = hasDiscount
      ? {
          original,
          discountPercent: Math.round(
            ((original - discounted) / original) * 100
          ),
          savings: original - discounted,
        }
      : null;
  }

  const sellBy = product.sellBy ?? "unit";

  const mainImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link href={`/product/${product.slug}`} className="block min-w-44">
      <article className="group bg-white rounded-md border border-gray-200 hover:shadow-sm 
      transition-shadow duration-250 overflow-hidden flex flex-col">
        {/* Image: wider aspect to make card shorter */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden flex-shrink-0">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="
                w-full h-full 
                object-contain 
                p-2 
                group-hover:scale-[1.03] 
                transition-transform duration-400
              "
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-3 py-2 flex flex-col flex-grow ">
          {/* Brand */}
          {product.brand && (
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide truncate mb-1">
              {product.brand}
            </p>
          )}

          {/* Title — 2 lines max */}
          <h3 className="text-[12px] font-medium text-gray-900 line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* PRICE BLOCK */}
          <div className="mt-auto">
            {/* TOP ROW — Primary left, Discounted + Original right */}
            <div className="flex justify-between items-start gap-2">
              {/* LEFT SIDE */}
              <div className="flex flex-col leading-tight">
                {/* PRIMARY PRICE */}
                <span className="text-[13px] font-semibold text-gray-900">
                  ₹{Number(primaryPrice).toLocaleString("en-IN")}
                  {product.showPerSqFtPrice ? (
                    <span className="text-[10px] text-gray-500"> / SqFt</span>
                  ) : (
                    <span className="text-[10px] text-gray-500">
                      {" "}
                      / {sellBy}
                    </span>
                  )}
                </span>

                {/* SAVINGS */}
                {secondaryPrice?.savings > 0 && (
                  <span className="text-[10px] px-2 py-1 bg-green-200 text-green-700 font-semibold rounded-xs mt-0.5">
                    Save ₹
                    {Number(secondaryPrice.savings).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col items-end leading-tight">
                {/* Discounted (only in perSqFt mode) */}
                {product.showPerSqFtPrice && (
                  <span className="text-[12px] text-gray-900 font-medium">
                    ₹{Number(secondaryPrice.discounted).toLocaleString("en-IN")}{" "}
                    / {sellBy}
                  </span>
                )}

                {/* Original Price */}
                {secondaryPrice?.original && (
                  <span className="text-[10px] text-gray-400 line-through">
                    ₹{Number(secondaryPrice.original).toLocaleString("en-IN")}
                    {!product.showPerSqFtPrice && ` / ${sellBy}`}
                  </span>
                )}
              </div>
            </div>

            {/* DISCOUNT BADGE BELOW */}
            {secondaryPrice?.discountPercent > 0 && (
              <div className="mt-1 w-fit ml-auto bg-green-600 text-white rounded-sm px-2 py-[2px] text-[10px] font-semibold">
                {secondaryPrice.discountPercent}% OFF
              </div>
            )}

            {/* ENTERPRISE LABEL */}
            {isEnterprise && (
              <p className="text-[10px] text-orange-600 font-medium mt-1">
                Enterprise Price
              </p>
            )}
          </div>

          {/* Enterprise tag (if any) */}
          {isEnterprise && (
            <p className="text-[11px] text-orange-600 font-medium mt-2">
              Enterprise Price
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
