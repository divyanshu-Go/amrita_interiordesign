// components/customer/ProductPriceBox.jsx
//
// Pure display component — no interactivity, no hooks.
// Deliberately NOT a Client Component: price is computed server-side in
// page.js (from the x-user-role request header, same as the category page)
// and passed in as a plain `price` object + `isEnterprise` flag.

import { fmtINR } from "@/lib/pricing/resolvePrice";

export default function ProductPriceBox({ price, isEnterprise }) {
  return (
    <div className="bg-orange-50 rounded-sm p-3.5 my-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xl font-bold text-gray-900">
            ₹{fmtINR(price.primaryPrice)}
            <span className="text-sm font-medium text-gray-500 ml-1">{price.primaryLabel}</span>
          </span>
          {price.savingsAmt > 0 && (
            <p className="text-[11px] text-green-600 font-semibold mt-0.5">
              Save ₹{fmtINR(price.savingsAmt)}
            </p>
          )}
        </div>

        {price.salePrice && (
          <div className="text-right">
            <span className="text-sm font-medium text-gray-700 block">
              ₹{fmtINR(price.salePrice)} {price.salePriceLabel}
            </span>
            {price.strikePrice && (
              <span className="text-xs text-gray-400 line-through block">
                ₹{fmtINR(price.strikePrice)} {price.salePriceLabel}
              </span>
            )}
          </div>
        )}

        {!price.salePrice && price.strikePrice && (
          <span className="text-xs text-gray-400 line-through self-start">
            ₹{fmtINR(price.strikePrice)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        {price.discountPct > 0 && (
          <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            {price.discountPct}% OFF
          </span>
        )}
        {isEnterprise && (
          <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
            Enterprise
          </span>
        )}
        <span className="text-[10px] text-gray-400">Incl. all taxes</span>
      </div>
    </div>
  );
}