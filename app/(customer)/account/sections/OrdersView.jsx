"use client";

import { useAccount } from "../AccountDataProvider";
import { useState } from "react";

function StatusBadge({ status, type }) {
  const map = {
    order: {
      processing: "bg-blue-100 text-blue-700",
      payment_failed: "bg-red-100 text-red-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-700",
      created: "bg-gray-100 text-gray-700",
      payment_pending: "bg-yellow-100 text-yellow-700",
    },
    payment: {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      not_required: "bg-gray-100 text-gray-700",
    },
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded ${
        map[type][status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function OrdersView() {
  const {
    orders,
    orderDetails,
    loadOrderDetail,
    loading,
  } = useAccount();

  const [expandedId, setExpandedId] = useState(null);

  if (loading.orders || !orders) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading orders…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-600">
        You haven’t placed any orders yet.
      </div>
    );
  }

  async function toggleOrder(orderId) {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(orderId);
    await loadOrderDetail(orderId);
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const detail = orderDetails[order._id];

        return (
          <div
            key={order._id}
            className="bg-white border rounded"
          >
            {/* Summary */}
            <button
              onClick={() => toggleOrder(order._id)}
              className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div>
                <p className="text-sm font-medium">
                  Order #{order.orderNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="font-semibold">
                  ₹{order.totals.grandTotal}
                </span>

                <StatusBadge
                  type="order"
                  status={order.orderStatus}
                />
                <StatusBadge
                  type="payment"
                  status={order.paymentStatus}
                />
              </div>
            </button>

            {/* Detail */}
            {expandedId === order._id && (
              <div className="border-t p-4 space-y-4">
                {!detail ? (
                  <p className="text-sm text-gray-500">
                    Loading order details…
                  </p>
                ) : (
                  <>
                    {/* Items */}
                    <div className="space-y-2">
                      {detail.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.productSnapshot.name} ×{" "}
                            {item.quantity}
                          </span>
                          <span>
                            ₹{item.pricingSnapshot.lineTotal}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Address */}
                    <div className="border-t pt-3 text-sm">
                      <p className="font-medium mb-1">
                        Shipping Address
                      </p>
                      <p>{detail.addressSnapshot.name}</p>
                      <p className="text-gray-600">
                        {detail.addressSnapshot.addressLine1},{" "}
                        {detail.addressSnapshot.city},{" "}
                        {detail.addressSnapshot.state} –{" "}
                        {detail.addressSnapshot.pincode}
                      </p>
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-3 flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>
                        ₹{detail.totals.grandTotal}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
