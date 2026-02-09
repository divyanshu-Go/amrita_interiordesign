"use client";

import { Info, Truck, Gift } from "lucide-react";

export default function OrderCheckoutSummary({ cart }) {
  const { items, totals } = cart;
  const savingsAmount = totals.totalDiscount || 0;
  const savingsPercent =
    totals.totalOriginalPrice > 0
      ? Math.round((savingsAmount / totals.totalOriginalPrice) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
        <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
        <p className="text-xs text-gray-600 mt-1">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Items List */}
      <div className="px-6 py-4 border-b border-gray-200 max-h-64 overflow-y-auto space-y-3">
        {items.map((item) => (
          <div key={item.product._id} className="flex justify-between text-sm">
            <span className="text-gray-600 flex-1">
              {item.product.name}
              <span className="text-gray-400"> ×{item.quantity}</span>
            </span>
            <span className="font-medium text-gray-900">
              ₹{item.pricing.lineFinalTotal.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="px-6 py-4 space-y-3 border-b border-gray-200">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ₹{totals.totalOriginalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Discount */}
        {savingsAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">
              Discount ({savingsPercent}%)
            </span>
            <span className="font-semibold text-green-600">
              -₹{savingsAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Delivery Charge */}
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Truck size={14} />
            Delivery
          </div>
          <span className="font-medium text-gray-900">
            ₹{totals.deliveryCharge.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-orange-600">
            ₹{totals.grandTotal.toLocaleString("en-IN")}
          </span>
        </div>
        {savingsAmount > 0 && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Gift size={14} />
            You save ₹{savingsAmount.toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
        <div className="flex gap-2 text-xs text-blue-700">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Order Information</p>
            <ul className="space-y-0.5">
              <li>✓ Order number will be generated after placement</li>
              <li>✓ Track your order in real-time</li>
              <li>✓ 100% secure payment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="px-6 py-3 flex items-center justify-center gap-2 text-xs text-gray-600 border-t border-gray-200">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
        </svg>
        Secure checkout with SSL encryption
      </div>
    </div>
  );
}