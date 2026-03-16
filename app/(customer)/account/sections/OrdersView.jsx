// account/sections/OrdersView.jsx
"use client";

import { useAccount } from "../AccountDataProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Package, Calendar, ChevronRight, Filter, ArrowUpDown,
  CheckCircle, Clock, Truck, AlertCircle, ShoppingBag, CreditCard,
} from "lucide-react";
import AccountLoader from "@/components/Loaders/AccountLoader";

// ── Status badge ──────────────────────────────────────────────────────────────
const ORDER_STATUS = {
  created:         { bg: "bg-gray-100",   text: "text-gray-700",   label: "Created",         icon: Package },
  payment_pending: { bg: "bg-amber-100",  text: "text-amber-800",  label: "Payment Pending",  icon: Clock },
  processing:      { bg: "bg-blue-100",   text: "text-blue-800",   label: "Processing",       icon: Package },
  shipped:         { bg: "bg-violet-100", text: "text-violet-800", label: "Shipped",          icon: Truck },
  delivered:       { bg: "bg-green-100",  text: "text-green-800",  label: "Delivered",        icon: CheckCircle },
  payment_failed:  { bg: "bg-red-100",    text: "text-red-800",    label: "Payment Failed",   icon: AlertCircle },
  cancelled:       { bg: "bg-gray-100",   text: "text-gray-600",   label: "Cancelled",        icon: AlertCircle },
};

const PAYMENT_STATUS = {
  paid:         { bg: "bg-green-100",  text: "text-green-800",  label: "Paid" },
  pending:      { bg: "bg-amber-100",  text: "text-amber-800",  label: "Unpaid" },
  failed:       { bg: "bg-red-100",    text: "text-red-800",    label: "Failed" },
  not_required: { bg: "bg-gray-100",   text: "text-gray-600",   label: "COD" },
};

function StatusBadge({ status, type }) {
  const cfg = type === "payment" ? PAYMENT_STATUS[status] : ORDER_STATUS[status];
  if (!cfg) return null;
  const Icon = type !== "payment" ? ORDER_STATUS[status]?.icon : CreditCard;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>
      {Icon && <Icon size={11} />}
      {cfg.label}
    </span>
  );
}

// ── Product image strip ───────────────────────────────────────────────────────
function ProductStrip({ items }) {
  const preview = items.slice(0, 3);
  const extra   = items.length - 3;

  return (
    <div className="flex items-center gap-2">
      {preview.map((item, i) => (
        <div
          key={i}
          className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0"
        >
          {item.productSnapshot?.image ? (
            <img
              src={item.productSnapshot.image}
              alt={item.productSnapshot.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={16} className="text-gray-400" />
            </div>
          )}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-12 h-12 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500">+{extra}</span>
        </div>
      )}
    </div>
  );
}

// ── Single order card ─────────────────────────────────────────────────────────
function OrderCard({ order, onClick }) {
  const firstItem  = order.items?.[0];
  const itemsCount = order.items?.length ?? 0;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Top stripe for payment_pending / payment_failed */}
      {(order.orderStatus === "payment_pending" || order.orderStatus === "payment_failed") && (
        <div className={`h-1 w-full ${order.orderStatus === "payment_pending" ? "bg-amber-400" : "bg-red-400"}`} />
      )}

      <div className="p-5">
        {/* Row 1 — order number + date + status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-bold text-gray-900">Order #{order.orderNumber}</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Calendar size={11} />
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            <StatusBadge type="order"    status={order.orderStatus} />
            <StatusBadge type="payment"  status={order.paymentStatus} />
          </div>
        </div>

        {/* Row 2 — product thumbnails + first product name */}
        <div className="flex items-center gap-3 mb-4">
          <ProductStrip items={order.items ?? []} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 line-clamp-1">
              {firstItem?.productSnapshot?.name ?? "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {itemsCount === 1
                ? `${firstItem?.quantity} × ${firstItem?.sellBy}`
                : `${itemsCount} items`}
            </p>
          </div>
        </div>

        {/* Row 3 — total + CTA */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Order Total</p>
            <p className="text-base font-bold text-orange-600">
              ₹{order.totals?.grandTotal?.toLocaleString("en-IN")}
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-orange-500 group-hover:text-orange-700 transition-colors">
            View Details <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function OrdersView() {
  const { orders, loading } = useAccount();
  const router = useRouter();
  const [sortBy,        setSortBy]        = useState("newest");
  const [filterStatus,  setFilterStatus]  = useState("all");

  if (loading.orders || !orders) return <AccountLoader />;

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.orderStatus === filterStatus);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest")     return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest")     return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "price-high") return b.totals.grandTotal - a.totals.grandTotal;
    if (sortBy === "price-low")  return a.totals.grandTotal - b.totals.grandTotal;
    return 0;
  });

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-14 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-gray-900 font-bold text-lg mb-1">No orders yet</h3>
        <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here.</p>
        <button
          onClick={() => router.push("/category/all")}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <ShoppingBag size={15} /> Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} {orders.length === 1 ? "order" : "orders"} placed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter size={14} className="text-gray-400 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="payment_failed">Payment Failed</option>
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <ArrowUpDown size={14} className="text-gray-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High → Low</option>
            <option value="price-low">Price: Low → High</option>
          </select>
        </div>
      </div>

      {/* Empty filter result */}
      {sorted.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">No orders match this filter</p>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onClick={() => router.push(`/orders/${order._id}`)}
          />
        ))}
      </div>
    </div>
  );
}