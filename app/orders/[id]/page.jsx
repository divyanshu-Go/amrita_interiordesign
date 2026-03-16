// app/(customer)/orders/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader, Package, MapPin, CreditCard, Truck,
  CheckCircle, Clock, ArrowLeft, Tag, Phone, Printer,
} from "lucide-react";

const fmt = (n) =>
  (n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const ORDER_STATUS_STYLE = {
  created:         "bg-gray-100 text-gray-700",
  payment_pending: "bg-amber-100 text-amber-800",
  processing:      "bg-blue-100 text-blue-800",
  shipped:         "bg-violet-100 text-violet-800",
  delivered:       "bg-green-100 text-green-800",
  payment_failed:  "bg-red-100 text-red-800",
  cancelled:       "bg-gray-100 text-gray-600",
};

const PAYMENT_ICON = {
  pending:      Clock,
  paid:         CheckCircle,
  failed:       Package,
  not_required: CheckCircle,
};

export default function OrderDetailsPage() {
  const router  = useRouter();
  const params  = useParams();
  const orderId = params.id;

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.status === 401) { router.push("/login"); return; }
        if (!res.ok) throw new Error("Failed to load order");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    if (orderId) loadOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-7 w-7 text-orange-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading order…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-14 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <h2 className="text-base font-bold text-gray-900 mb-1">Order Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">{error || "We couldn't find this order"}</p>
            <button
              onClick={() => router.push("/account?tab=orders")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { mrp, discount, subtotal, deliveryCharge, grandTotal } = order.totals;
  const PaymentIcon = PAYMENT_ICON[order.paymentStatus] || Clock;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Orders
        </button>

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              #{order.orderNumber} &nbsp;·&nbsp;{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>

          {/* Status + Invoice */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${ORDER_STATUS_STYLE[order.orderStatus]}`}>
              {order.orderStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            <button
              onClick={() => router.push(`/orders/${orderId}/invoice`)}
              className="flex items-center gap-1.5 border border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer size={13} /> Invoice
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 mb-5 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Items</p>
            <p className="text-lg font-bold text-gray-900">{order.items.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Grand Total</p>
            <p className="text-lg font-bold text-orange-600">₹{fmt(grandTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Payment</p>
            <div className="flex items-center gap-1.5">
              <PaymentIcon size={14} className="text-gray-500" />
              <p className="text-sm font-semibold text-gray-800">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
              </p>
            </div>
            {order.paymentStatus !== "not_required" && (
              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                {order.paymentStatus.replace(/_/g, " ")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left col ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Items Ordered</p>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, i) => {
                  const p          = item.pricingSnapshot;
                  const hasDiscount = p.discountPercent > 0;
                  return (
                    <div key={i} className="flex gap-4 px-5 py-4">
                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {item.productSnapshot.image ? (
                          <img
                            src={item.productSnapshot.image}
                            alt={item.productSnapshot.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={18} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">
                          {item.productSnapshot.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">SKU: {item.productSnapshot.sku}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900">₹{fmt(p.unitFinalPrice)}</span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">₹{fmt(p.unitOriginalPrice)}</span>
                          )}
                          <span className="text-xs text-gray-400">/ {item.sellBy}</span>
                          <span className="text-xs text-gray-500">× {item.quantity}</span>
                          {hasDiscount && (
                            <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                              <Tag size={9} /> {p.discountPercent}% off
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">₹{fmt(p.lineFinalTotal)}</p>
                        {hasDiscount && (
                          <>
                            <p className="text-xs text-gray-400 line-through mt-0.5">₹{fmt(p.lineOriginalTotal)}</p>
                            <p className="text-xs text-green-600 font-semibold mt-0.5">−₹{fmt(p.discountPerUnit * item.quantity)}</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Price Breakdown</p>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Market Price <span className="text-xs text-gray-400">(before discounts)</span></span>
                  <span className="font-medium text-gray-900">₹{fmt(mrp)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Tag size={13} /> Discount
                    </span>
                    <span className="font-semibold text-green-600">−₹{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-dashed border-gray-200 pt-2.5">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Truck size={13} className="text-gray-400" /> Delivery
                  </span>
                  <span className="font-medium text-gray-900">
                    {deliveryCharge === 0
                      ? <span className="text-green-600 font-semibold">FREE</span>
                      : `₹${fmt(deliveryCharge)}`}
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-orange-600">₹{fmt(grandTotal)}</span>
                    {discount > 0 && (
                      <p className="text-xs text-green-600 font-semibold mt-0.5">You saved ₹{fmt(discount)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right col ── */}
          <div className="space-y-5">

            {/* Delivery address */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                <p className="text-sm font-bold text-gray-900">Delivery Address</p>
              </div>
              <div className="px-5 py-4 space-y-1">
                <p className="text-sm font-semibold text-gray-900">{order.addressSnapshot.name}</p>
                <p className="text-sm text-gray-500">{order.addressSnapshot.addressLine1}</p>
                {order.addressSnapshot.addressLine2 && (
                  <p className="text-sm text-gray-500">{order.addressSnapshot.addressLine2}</p>
                )}
                <p className="text-sm text-gray-500">
                  {order.addressSnapshot.city}, {order.addressSnapshot.state} – {order.addressSnapshot.pincode}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 pt-1">
                  <Phone size={13} className="text-gray-400" /> {order.addressSnapshot.phone}
                </p>
              </div>
            </div>

            {/* Payment details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <CreditCard size={14} className="text-green-500" />
                <p className="text-sm font-bold text-gray-900">Payment</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Method</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {order.paymentStatus.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">Timeline</p>
              </div>
              <div className="px-5 py-4 space-y-4">
                <TimelineStep
                  icon={CheckCircle}
                  color="text-green-500"
                  label="Order Placed"
                  sub={new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                  active
                />
                {order.orderStatus !== "created" && (
                  <TimelineStep
                    icon={Clock}
                    color="text-blue-500"
                    label="Processing"
                    sub="Your order is being prepared"
                    active={["processing","shipped","delivered"].includes(order.orderStatus)}
                  />
                )}
                {["shipped","delivered"].includes(order.orderStatus) && (
                  <TimelineStep
                    icon={Truck}
                    color="text-violet-500"
                    label="Shipped"
                    sub="Est. 3–5 business days"
                    active
                  />
                )}
                {order.orderStatus === "delivered" && (
                  <TimelineStep
                    icon={CheckCircle}
                    color="text-green-500"
                    label="Delivered"
                    sub="Thank you for your purchase!"
                    active
                  />
                )}
                {order.orderStatus === "cancelled" && (
                  <TimelineStep
                    icon={Package}
                    color="text-red-400"
                    label="Cancelled"
                    sub="This order was cancelled"
                    active
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ icon: Icon, color, label, sub, active }) {
  return (
    <div className={`flex gap-3 ${active ? "" : "opacity-40"}`}>
      <Icon size={16} className={`${color} flex-shrink-0 mt-0.5`} />
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}