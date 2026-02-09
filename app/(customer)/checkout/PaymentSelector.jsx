"use client";

import { CreditCard, DollarSign } from "lucide-react";

export default function PaymentSelector({ value, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
        <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose how you'd like to pay for your order
        </p>
      </div>

      {/* Payment Options */}
      <div className="p-6 space-y-3">
        {/* Cash on Delivery */}
        <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
          value === "COD"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
        }`}>
          <div className="flex gap-4">
            <input
              type="radio"
              checked={value === "COD"}
              onChange={() => onChange("COD")}
              className="mt-1 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={20} className="text-green-600" />
                <p className="font-semibold text-gray-900">
                  Cash on Delivery
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Pay when your order arrives at your doorstep
              </p>
              <p className="text-xs text-green-600 font-medium mt-2">
                ✓ No extra charges
              </p>
            </div>
          </div>
        </label>

        {/* Online Payment */}
        <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
          value === "PREPAID"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
        }`}>
          <div className="flex gap-4">
            <input
              type="radio"
              checked={value === "PREPAID"}
              onChange={() => onChange("PREPAID")}
              className="mt-1 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={20} className="text-blue-600" />
                <p className="font-semibold text-gray-900">
                  Online Payment
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Pay securely using Razorpay (Cards, UPI, Wallets)
              </p>
              <p className="text-xs text-gray-500 font-medium mt-2">
                💳 Debit/Credit Card, UPI, Wallets supported
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">ℹ️ Security:</span> All payments are secure and encrypted. Your payment information is never shared.
        </p>
      </div>
    </div>
  );
}