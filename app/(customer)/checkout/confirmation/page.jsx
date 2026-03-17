// checkout/confirmation/page.jsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CheckCircle, Package, ArrowRight, Copy,
  Truck, CreditCard, MapPin, Clock,
} from "lucide-react";

const fmt = (n) =>
  (n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });



import { Suspense } from "react";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your order…</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}





function ConfirmationContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();

  const orderId     = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const status      = searchParams.get("status"); // "pending" for prepaid

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    if (!orderId) { router.replace("/"); return; }

    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPrepaidPending = status === "pending" && order?.paymentMethod === "PREPAID";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your order…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* ── Success / Pending header ─────────────────────────────────── */}
        <div className={`rounded-2xl p-8 text-center text-white shadow-lg ${
          isPrepaidPending
            ? "bg-gradient-to-br from-amber-400 to-orange-500"
            : "bg-gradient-to-br from-green-500 to-emerald-600"
        }`}>
          {isPrepaidPending ? (
            <Clock className="mx-auto h-14 w-14 mb-3 opacity-90" />
          ) : (
            <CheckCircle className="mx-auto h-14 w-14 mb-3" />
          )}
          <h1 className="text-2xl font-bold mb-1">
            {isPrepaidPending ? "Payment Confirming…" : "Order Confirmed!"}
          </h1>
          <p className="text-sm opacity-85">
            {isPrepaidPending
              ? "We're waiting for payment confirmation. Your order will be processed shortly."
              : "Your order has been placed and is being prepared."}
          </p>
        </div>

        {/* ── Order number ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Order Number</p>
            <p className="text-lg font-bold text-gray-900 tracking-wide">{orderNumber}</p>
          </div>
          <button
            onClick={copyOrderNumber}
            className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-700 font-semibold border border-orange-200 hover:border-orange-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Copy size={13} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* ── Product summary ───────────────────────────────────────────── */}
        {order?.items?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">
                Items Ordered <span className="text-gray-400 font-normal">({order.items.length})</span>
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    {item.productSnapshot?.image ? (
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
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {item.productSnapshot?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty {item.quantity} × {item.sellBy}
                    </p>
                  </div>
                  {/* Line total */}
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    ₹{fmt(item.pricingSnapshot?.lineFinalTotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            {order.totals && (
              <div className="bg-gray-50 px-5 py-4 space-y-2 border-t border-gray-100">
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Discount saved</span>
                    <span className="font-semibold">−₹{fmt(order.totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Truck size={11} /> Delivery</span>
                  <span>{order.totals.deliveryCharge === 0 ? "FREE" : `₹${fmt(order.totals.deliveryCharge)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total Paid</span>
                  <span className="text-orange-600">₹{fmt(order.totals.grandTotal)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Delivery + Payment info ───────────────────────────────────── */}
        {order && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-blue-500" />
                <p className="text-xs font-bold text-gray-700">Delivering to</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">{order.addressSnapshot?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {order.addressSnapshot?.city}, {order.addressSnapshot?.state}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CreditCard size={13} className="text-green-500" />
                <p className="text-xs font-bold text-gray-700">Payment</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.paymentStatus === "paid"         && "✓ Payment confirmed"}
                {order.paymentStatus === "pending"      && "⏳ Awaiting confirmation"}
                {order.paymentStatus === "not_required" && "Pay on delivery"}
              </p>
            </div>
          </div>
        )}

        {/* ── What's next timeline ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-sm font-bold text-gray-900 mb-4">What happens next?</p>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, color: "text-green-500", label: "Order confirmed",         sub: "You'll receive a confirmation email shortly" },
              { icon: Package,     color: "text-blue-500",  label: "Preparing your order",    sub: "Our team is getting your items ready" },
              { icon: Truck,       color: "text-violet-500",label: "Out for delivery",         sub: "Expected in 3–5 business days" },
            ].map(({ icon: Icon, color, label, sub }, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Icon size={16} className={`${color} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="space-y-2 pb-8">
          <button
            onClick={() => router.push(`/orders/${orderId}`)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group"
          >
            View Full Order Details
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => router.push("/account?tab=orders")}
            className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            My Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full text-orange-500 hover:text-orange-700 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}