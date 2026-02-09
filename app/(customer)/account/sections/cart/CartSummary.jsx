"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Truck,
  Gift,
  ArrowRight,
  Info,
} from "lucide-react";

export default function CartSummary({ totals, userRole }) {
  const router = useRouter();

  const savingsAmount = totals.totalDiscount || 0;
  const savingsPercent =
    totals.totalOriginalPrice > 0
      ? Math.round(
          (savingsAmount / totals.totalOriginalPrice) * 100
        )
      : 0;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
        <h3 className="text-lg font-bold text-gray-900">Price Breakdown</h3>
        {userRole === "enterprise" && (
          <p className="text-xs text-orange-700 mt-1">
            📊 Enterprise Pricing Applied
          </p>
        )}
      </div>

      {/* Price Details */}
      <div className="px-6 py-5 space-y-4 border-b border-gray-200">
        {/* Market Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Market Price</span>
          <span className="text-sm font-medium text-gray-900">
            ₹{totals.totalOriginalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Discount */}
        {savingsAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600 font-medium">
              Discount ({savingsPercent}%)
            </span>
            <span className="text-sm font-semibold text-green-600">
              -₹{savingsAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Delivery Charge */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Delivery Charge</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            ₹{totals.deliveryCharge.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="text-base font-semibold text-gray-900">
            Grand Total
          </span>
          <span className="text-2xl font-bold text-orange-600">
            ₹{totals.grandTotal.toLocaleString("en-IN")}
          </span>
        </div>
        {savingsAmount > 0 && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <Gift size={14} />
            You're saving ₹{savingsAmount.toLocaleString("en-IN")} on this order
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <div className="flex gap-3 text-sm">
          <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-blue-700">
            <p className="font-medium mb-1">Free delivery on orders above ₹5000</p>
            <p className="text-xs">Estimated delivery in 3-5 business days</p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 group"
        >
          Proceed to Checkout
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => router.push("/products")}
          className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </button>
      </div>

      {/* Trust Badge */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-600">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
        </svg>
        Secure checkout with SSL encryption
      </div>
    </div>
  );
}