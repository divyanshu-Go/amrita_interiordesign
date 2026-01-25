"use client";

import { useEffect, useState } from "react";
import {
  updateCartItem,
  removeFromCart,
} from "@/lib/actions/cart";

export default function CartSection() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    setLoading(true);
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = await res.json();
    setCart(data.cart);
    setLoading(false);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="space-y-6">
      {cart.items.map((item) => (
        <div
          key={item.product._id}
          className="flex justify-between items-center border p-4 rounded"
        >
          <div>
            <h3 className="font-medium">{item.product.name}</h3>
            <p className="text-sm text-gray-500">
              ₹{item.pricing.unitPrice} × {item.quantity}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={async (e) => {
                await updateCartItem(
                  item.product._id,
                  Number(e.target.value)
                );
                fetchCart();
              }}
              className="w-16 border px-2 py-1 rounded"
            />

            <span className="font-medium">
              ₹{item.pricing.lineTotal}
            </span>

            <button
              onClick={async () => {
                await removeFromCart(item.product._id);
                fetchCart();
              }}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-6">
        <div className="text-lg font-medium">
          Subtotal: ₹{cart.subtotal}
        </div>

        <button
          onClick={onCheckout}
          className="bg-orange-600 text-white px-6 py-2 rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
