// components/customer/NewProductCard.jsx
//
// ── WHY THIS IS A SERVER COMPONENT ──────────────────────────────────────
// userRole and enterpriseStatus are resolved once, server-side, from
// trusted request headers (set by middleware after JWT verification) and
// passed down as plain props. There is nothing here that needs the
// browser — no state, no effects, no event handlers — so this renders
// fully in the initial HTML, correctly priced, for every visitor
// including Googlebot.
//
// ── PRICING LOGIC LIVES IN ONE PLACE ──────────────────────────────────────
// resolvePrice/fmtINR come from lib/pricing/resolvePrice.js — the same
// module the product detail page uses. Previously this component had its
// own inline copy of the same logic; that duplication is gone now, so
// listing pages and the detail page can never drift out of sync on how
// a price is computed.
//
// ── enterpriseStatus NOTE ────────────────────────────────────────────────
// Not yet forwarded by middleware (JWT doesn't carry it yet). Defaulting
// to "unverified" means every visitor safely sees retail pricing until
// that middleware change ships — matching old behavior for unverified
// enterprise accounts. Once middleware forwards x-user-enterprise-status,
// pass it in here and enterprise pricing turns on automatically.
// ─────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import Image from "next/image";
import { resolvePrice, fmtINR } from "@/lib/pricing/resolvePrice";

export default function NewProductCard({
  product,
  userRole = "user",
  enterpriseStatus = "unverified",
}) {
  const isEnterprise = userRole === "enterprise" && enterpriseStatus === "verified";
  const price = resolvePrice(product, isEnterprise);
  const mainImage = product.images?.[0] || null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block min-w-44 bg-white border border-gray-100 hover:border-orange-100 hover:shadow-md transition-all duration-200"
    >
      <article className="group rounded-sm overflow-hidden flex flex-col">

        {/* ── Image ── */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden shrink-0">
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
                ₹{fmtINR(price.primaryPrice)}
                <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                  {price.primaryLabel}
                </span>
              </span>

              {price.salePrice && (
                <span className="text-xs text-gray-700 font-medium">
                  ₹{fmtINR(price.salePrice)}
                  <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                    {price.salePriceLabel}
                  </span>
                </span>
              )}

              {price.strikePrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{fmtINR(price.strikePrice)}
                </span>
              )}
            </div>

            {price.savingsAmt > 0 && (
              <span className="inline-block text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                Save ₹{fmtINR(price.savingsAmt)}
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