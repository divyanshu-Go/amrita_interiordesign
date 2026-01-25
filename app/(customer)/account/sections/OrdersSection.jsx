"use client";

import { useEffect, useState } from "react";

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrderDetail(orderId) {
    try {
      setDetailLoading(true);

      console.log("Fetching details for order:", orderId);
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order details");
      const data = await res.json();
      setOrderDetail(data.order);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  function toggleOrder(orderId) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderDetail(null);
      return;
    }

    setExpandedOrderId(orderId);
    fetchOrderDetail(orderId);
  }

  if (loading) {
    return (
      <div className="bg-white border rounded p-6">
        <p className="text-sm text-gray-500">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border rounded p-6">
        <p className="text-sm text-red-600">{error}</p>
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

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded"
        >
          {/* Order summary */}
          <button
            onClick={() => toggleOrder(order._id)}
            className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Order #{order.orderNumber}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="font-medium">
                ₹{order.totals.grandTotal}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  order.orderStatus === "processing"
                    ? "bg-blue-100 text-blue-700"
                    : order.orderStatus === "payment_failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.orderStatus.replace("_", " ")}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus.replace("_", " ")}
              </span>
            </div>
          </button>

          {/* Order detail */}
          {expandedOrderId === order._id && (
            <div className="border-t p-4 space-y-4">
              {detailLoading ? (
                <p className="text-sm text-gray-500">
                  Loading order details…
                </p>
              ) : (
                orderDetail && (
                  <>
                    {/* Items */}
                    <div className="space-y-2">
                      {orderDetail.items.map((item) => (
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
                      <p>{orderDetail.addressSnapshot.name}</p>
                      <p className="text-gray-600">
                        {orderDetail.addressSnapshot.addressLine1},{" "}
                        {orderDetail.addressSnapshot.city},{" "}
                        {orderDetail.addressSnapshot.state} –{" "}
                        {orderDetail.addressSnapshot.pincode}
                      </p>
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-3 flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>
                        ₹{orderDetail.totals.grandTotal}
                      </span>
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
