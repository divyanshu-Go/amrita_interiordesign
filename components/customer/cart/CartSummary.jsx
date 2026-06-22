// components/customer/cart/CartSummary.jsx
"use client";

import { useRouter } from "next/navigation";
import { Truck, Gift, ArrowRight, Info, ShoppingCart } from "lucide-react";

export default function CartSummary({ totals, userRole, isGuest = false }) {
  const router = useRouter();

  const mrp            = totals?.mrp            ?? 0;
  const discount       = totals?.discount       ?? 0;
  const subtotal       = totals?.subtotal       ?? 0;
  const deliveryCharge = totals?.deliveryCharge ?? 399;
  const grandTotal     = totals?.grandTotal     ?? 0;

  const savingsPercent = mrp > 0 ? Math.round((discount / mrp) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-200">
          <ShoppingCart size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Price Breakdown</h3>
          {userRole === "enterprise" && (
            <p className="text-xs text-orange-700 mt-0.5">Enterprise Pricing Applied</p>
          )}
        </div>
      </div>

      <div className="px-6 py-4 space-y-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Market Price</span>
          <span className="text-sm font-semibold text-gray-900">₹{mrp.toLocaleString("en-IN")}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600 font-medium">Discount ({savingsPercent}%)</span>
            <span className="text-sm font-semibold text-green-600">−₹{discount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Subtotal</span>
          <span className="text-sm font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Delivery</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {deliveryCharge === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryCharge.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-base font-bold text-gray-900">Grand Total</span>
          <span className="text-2xl font-bold text-orange-600">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
        {discount > 0 && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Gift size={14} />
            You're saving ₹{discount.toLocaleString("en-IN")} on this order
          </p>
        )}
      </div>

      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <div className="flex gap-3 text-sm">
          <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-blue-700">Estimated delivery in 3–5 business days</p>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <button
          onClick={() => router.push(isGuest ? "/login?redirect=/checkout" : "/checkout")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 group"
        >
          {isGuest ? "Login to Checkout" : "Proceed to Checkout"}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        {isGuest && (
          <p className="text-[11px] text-gray-400 text-center">
            Your cart items will be saved after login
          </p>
        )}
        <button
          onClick={() => router.push("/category/all")}
          className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
        </svg>
        Secure checkout with SSL encryption
      </div>
    </div>
  );
}