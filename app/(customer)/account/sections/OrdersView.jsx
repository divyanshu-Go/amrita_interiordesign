"use client";

import { useAccount } from "../AccountDataProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Package,
  Calendar,
  ChevronRight,
  Filter,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import AccountLoader from "@/components/Loaders/AccountLoader";

function StatusBadge({ status, type }) {
  const orderStatusConfig = {
    created: { bg: "bg-gray-100", text: "text-gray-800", icon: Package },
    payment_pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
    },
    processing: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: Package,
    },
    shipped: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      icon: Truck,
    },
    delivered: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
    },
    payment_failed: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: AlertCircle,
    },
    cancelled: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: AlertCircle,
    },
  };

  const paymentStatusConfig = {
    paid: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    not_required: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Not Required",
    },
  };

  if (type === "payment") {
    const config = paymentStatusConfig[status];
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  }

  const config = orderStatusConfig[status];
  const Icon = config?.icon || Package;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${config?.bg} ${config?.text}`}
    >
      <Icon size={14} />
      {status.replace(/_/g, " ").charAt(0).toUpperCase() +
        status.replace(/_/g, " ").slice(1)}
    </span>
  );
}

export default function OrdersView() {
  const { orders, loading } = useAccount();
  const router = useRouter();
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");

  if (loading.orders || !orders) {
    return (
      <AccountLoader />
    );
  }

  // Filter orders
  let filteredOrders = orders;
  if (filterStatus !== "all") {
    filteredOrders = orders.filter(
      (order) => order.orderStatus === filterStatus
    );
  }

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "price-high") {
      return b.totals.grandTotal - a.totals.grandTotal;
    } else if (sortBy === "price-low") {
      return a.totals.grandTotal - b.totals.grandTotal;
    }
    return 0;
  });

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center border border-dashed border-gray-300">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-gray-900 font-semibold mb-1 text-lg">
          No orders yet
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <button
          onClick={() => router.push("/products")}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ShoppingBag size={16} />
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <p className="text-sm text-gray-500 mt-1">
          You have {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="created">Created</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="payment_failed">Payment Failed</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <ArrowUpDown size={16} className="inline mr-2" />
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* No Results */}
      {sortedOrders.length === 0 && filterStatus !== "all" && (
        <div className="bg-white rounded-lg shadow p-8 text-center border border-dashed border-gray-300">
          <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">
            No orders found with this status
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left: Order Number & Date */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={18} className="text-orange-500" />
                    <p className="text-lg font-bold text-gray-900">
                      Order #{order.orderNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Middle: Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    type="order"
                    status={order.orderStatus}
                  />
                  {order.paymentStatus !== "not_required" && (
                    <StatusBadge
                      type="payment"
                      status={order.paymentStatus}
                    />
                  )}
                </div>

                {/* Right: Price & Button */}
                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-orange-600">
                      ₹{order.totals.grandTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors p-1"
                  >
                    <span className="text-sm">View</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            {order.items && Array.isArray(order.items) && order.items.length > 0 && (
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">
                  Items ({order.items.length})
                </p>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium line-clamp-1">
                          {item.productSnapshot?.name || "Product name not available"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ×{item.quantity} {item.sellBy || "unit"}
                        </p>
                      </div>
                      <p className="text-gray-900 font-semibold whitespace-nowrap ml-2">
                        ₹
                        {item.pricingSnapshot?.lineFinalTotal
                          ? item.pricingSnapshot.lineFinalTotal.toLocaleString(
                              "en-IN"
                            )
                          : "0"}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                      +{order.items.length - 2} more {order.items.length - 2 === 1 ? "item" : "items"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Order Footer */}
            <div className="px-5 py-3 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Truck size={14} />
                <span>
                  {order.addressSnapshot?.city
                    ? `Delivery to ${order.addressSnapshot.city}`
                    : "Delivery details not available"}
                </span>
              </div>
              <button
                onClick={() => router.push(`/orders/${order._id}`)}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
              >
                View Details
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}