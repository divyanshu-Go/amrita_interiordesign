// components/customer/ProductCardGrid.jsx
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
//
// BEFORE: "use client" at the top, but the component had:
//   • Zero state (no useState/useReducer)
//   • Zero effects (no useEffect)
//   • Zero event handlers
//   • It was purely: take props → return JSX
//   The "use client" was there by habit, not by need.
//   Since this component renders on EVERY product grid (homepage, category
//   page, search results), that unnecessary "use client" was ballooning
//   the JS bundle sent to every user's phone.
//
// THE PRICING PROBLEM:
//   userRole (retail vs enterprise) comes from AuthProvider which is
//   client-side. We cannot get it in a server component without a
//   cookie-reading helper. So ProductCardGrid DOES need to be client-side
//   to access useAuth() — but only for the price display logic.
//
// AFTER: "use client" stays, but now ProductCardGrid calls useAuth()
//   directly inside itself. This means:
//   • RelatedProductsRow no longer needs to be "use client" just to
//     thread userRole down as a prop
//   • Any server component can render <ProductCardGrid product={p} />
//     without knowing or caring about auth — the card handles it internally
//   • Clean separation: auth concern lives in the component that uses it
//
// ─────────────────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/providers/AuthProvider";

// ── Price resolution ──────────────────────────────────────────────────────
function resolvePrice(product, isEnterprise) {
  const original = isEnterprise ? product.enterprisePrice : product.retailPrice;
  const discounted = isEnterprise ? product.enterpriseDiscountPrice : product.retailDiscountPrice;
  const perSqFt = isEnterprise ? product.perSqFtPriceEnterprise : product.perSqFtPriceRetail;

  const hasDiscount = discounted && discounted < original;
  const sellBy = product.sellBy ?? "unit";

  if (product.showPerSqFtPrice) {
    return {
      primaryPrice: perSqFt,
      primaryLabel: "/ SqFt",
      strikePrice: hasDiscount ? original : null,
      salePrice: hasDiscount ? discounted : original,
      salePriceLabel: `/ ${sellBy}`,
      discountPct: hasDiscount ? Math.round(((original - discounted) / original) * 100) : 0,
      savingsAmt: hasDiscount ? original - discounted : 0,
    };
  }

  return {
    primaryPrice: discounted || original,
    primaryLabel: `/ ${sellBy}`,
    strikePrice: hasDiscount ? original : null,
    salePrice: null,
    salePriceLabel: null,
    discountPct: hasDiscount ? Math.round(((original - discounted) / original) * 100) : 0,
    savingsAmt: hasDiscount ? original - discounted : 0,
  };
}

const fmt = (n) => Number(n).toLocaleString("en-IN");

// ─────────────────────────────────────────────────────────────────────────

export default function ProductCardGrid({ product }) {
  // Auth is handled internally — no need to thread userRole from parent
  const { userRole, user } = useAuth();
  const isEnterprise = userRole === "enterprise" && user?.enterpriseStatus === "verified";
  const price = resolvePrice(product, isEnterprise);
  const mainImage = product.images?.[0] || null;
  
  return (
    <Link href={`/product/${product.slug}`} className="block min-w-44">
      <article className="group bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden flex-shrink-0">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
              className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          )}

          {price.discountPct > 0 && (
            <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              {price.discountPct}% OFF
            </span>
          )}
        </div>

        {/* ── Info ── */}
        <div className="px-3 py-2.5 flex flex-col flex-grow gap-1">
          {product.brand && (
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
              {product.brand}
            </p>
          )}

          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <div className="mt-auto pt-1 space-y-0.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">
                ₹{fmt(price.primaryPrice)}
                <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                  {price.primaryLabel}
                </span>
              </span>

              {price.salePrice && (
                <span className="text-xs text-gray-700 font-medium">
                  ₹{fmt(price.salePrice)}
                  <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                    {price.salePriceLabel}
                  </span>
                </span>
              )}

              {price.strikePrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{fmt(price.strikePrice)}
                </span>
              )}
            </div>

            {price.savingsAmt > 0 && (
              <span className="inline-block text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                Save ₹{fmt(price.savingsAmt)}
              </span>
            )}

            {isEnterprise && (
              <p className="text-[10px] text-orange-500 font-medium">
                Enterprise Price
              </p>
            )}
          </div>
        </div>

      </article>
    </Link>
  );
}