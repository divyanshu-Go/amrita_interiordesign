"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Download,
} from "lucide-react";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load order");
        }

        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Loader className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-3" />
            <p className="text-gray-500">Loading order details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="bg-white rounded-lg shadow p-12 text-center border border-dashed border-gray-300">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find this order"}
            </p>
            <button
              onClick={() => router.push("/account?tab=orders")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    created: "bg-gray-100 text-gray-800",
    payment_pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    payment_failed: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const paymentStatusIcons = {
    pending: Clock,
    paid: CheckCircle,
    failed: Package,
    not_required: CheckCircle,
  };

  const PaymentStatusIcon = paymentStatusIcons[order.paymentStatus] || Clock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-6 border-b border-orange-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-sm text-gray-600">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-orange-600 px-4 py-2 rounded-lg font-medium transition-colors border border-orange-200">
                <Download size={18} />
                Invoice
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Order Status</p>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[order.orderStatus]
                }`}
              >
                {order.orderStatus.replace(/_/g, " ").toUpperCase()}
              </span>
              {order.paymentStatus !== "not_required" && (
                <div className="flex items-center gap-2">
                  <PaymentStatusIcon size={18} className="text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Payment: {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {order.items.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{order.totals.grandTotal.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-purple-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Items
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.productSnapshot.image ? (
                        <img
                          src={item.productSnapshot.image}
                          alt={item.productSnapshot.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {item.productSnapshot.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        SKU: {item.productSnapshot.sku}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{item.pricingSnapshot.unitFinalPrice.toLocaleString(
                          "en-IN"
                        )}{" "}
                        × {item.quantity} {item.sellBy}
                      </p>
                      {item.pricingSnapshot.discountPercent > 0 && (
                        <p className="text-xs text-green-600 font-semibold mt-1">
                          {item.pricingSnapshot.discountPercent}% OFF
                        </p>
                      )}
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹
                        {item.pricingSnapshot.lineFinalTotal.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Pricing Breakdown
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{order.totals.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Discount</span>
                  <span className="font-semibold text-green-600">
                    -₹{order.totals.discount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Grand Total
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    ₹{order.totals.grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Address & Payment */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {order.addressSnapshot.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.addressSnapshot.addressLine1}
                  </p>
                  {order.addressSnapshot.addressLine2 && (
                    <p className="text-sm text-gray-600">
                      {order.addressSnapshot.addressLine2}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {order.addressSnapshot.city},{" "}
                    {order.addressSnapshot.state} –{" "}
                    {order.addressSnapshot.pincode}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-3">
                    <span>📞</span>
                    {order.addressSnapshot.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Details
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                  <p className="font-semibold text-gray-900">
                    {order.paymentStatus.replace(/_/g, " ").toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Timeline
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Order Placed
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {order.orderStatus !== "created" && (
                    <div className="flex gap-4">
                      <Clock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Processing
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          In Progress
                        </p>
                      </div>
                    </div>
                  )}

                  {(order.orderStatus === "shipped" ||
                    order.orderStatus === "delivered") && (
                    <div className="flex gap-4">
                      <Truck size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          On the Way
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Est. 3-5 business days
                        </p>
                      </div>
                    </div>
                  )}

                  {order.orderStatus === "delivered" && (
                    <div className="flex gap-4">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          Delivered
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Thank you for your purchase!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}