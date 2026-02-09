"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, Package, ArrowRight, Copy } from "lucide-react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Redirect if no order ID
    if (!orderId || !orderNumber) {
      router.push("/products");
    }
  }, [orderId, orderNumber, router]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderId || !orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-white animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Order Confirmed!
            </h1>
            <p className="text-green-100">
              Your order has been placed successfully
            </p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8 space-y-6">
            {/* Order Number */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">
                  {orderNumber}
                </p>
                <button
                  onClick={copyOrderNumber}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* What's Next */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                What's Next?
              </h2>
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Confirmation Email
                    </p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email with order details shortly
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order Processing
                    </p>
                    <p className="text-sm text-gray-600">
                      We'll start preparing your order immediately
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Delivery
                    </p>
                    <p className="text-sm text-gray-600">
                      Expected delivery in 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tip:</span> Save your order number to track your delivery. You can also access order details from your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <button
                onClick={() => router.push(`/orders/${orderId}`)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 group"
              >
                View Order Details
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push("/account?tab=orders")}
                className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Go to My Orders
              </button>

              <button
                onClick={() => router.push("/products")}
                className="w-full text-blue-600 py-2.5 rounded-lg font-medium hover:text-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Package size={18} />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm font-medium text-gray-900">Secure</p>
            <p className="text-xs text-gray-600">SSL encrypted</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-medium text-gray-900">Fast</p>
            <p className="text-xs text-gray-600">Quick processing</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl mb-2">📞</div>
            <p className="text-sm font-medium text-gray-900">Support</p>
            <p className="text-xs text-gray-600">24/7 available</p>
          </div>
        </div>
      </div>
    </div>
  );
}