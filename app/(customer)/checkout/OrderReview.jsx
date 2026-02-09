"use client";

import { MapPin, Truck, CreditCard, DollarSign, Package } from "lucide-react";

export default function OrderReview({ cart, address, paymentMethod }) {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
            >
              {/* Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Package size={20} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 line-clamp-1">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-600">
                  ₹{item.pricing.unitFinalPrice.toLocaleString("en-IN")} ×{" "}
                  {item.quantity} {item.product.sellBy}
                </p>
                {item.pricing.discountPercent > 0 && (
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    {item.pricing.discountPercent}% OFF
                  </p>
                )}
              </div>

              {/* Line Total */}
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ₹{item.pricing.lineFinalTotal.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      {address && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">{address.name}</p>
              <p className="text-sm text-gray-600">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-sm text-gray-600">{address.addressLine2}</p>
              )}
              <p className="text-sm text-gray-600">
                {address?.city}, {address.state} – {address.pincode}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-3">
                <span>📞</span>
                {address.phone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
          <div className="flex items-center gap-2">
            {paymentMethod === "COD" ? (
              <DollarSign size={20} className="text-green-600" />
            ) : (
              <CreditCard size={20} className="text-blue-600" />
            )}
            <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
          </div>
        </div>

        <div className="p-6">
          {paymentMethod === "COD" ? (
            <div>
              <p className="font-semibold text-gray-900 mb-2">
                Cash on Delivery
              </p>
              <p className="text-sm text-gray-600">
                Pay when your order arrives at your doorstep
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-gray-900 mb-2">
                Online Payment
              </p>
              <p className="text-sm text-gray-600">
                You will be redirected to Razorpay to complete payment
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Truck size={20} className="text-blue-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Delivery Information</p>
            <ul className="text-blue-800 space-y-1 text-xs">
              <li>✓ Estimated delivery in 3-5 business days</li>
              <li>✓ Free delivery on orders above ₹5000</li>
              <li>✓ Track your order in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}