"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addToCart,
  updateCartItem,
  removeFromCart,
} from "@/lib/actions/cart";

export default function CartSection() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();

      setItems(data.cart.items || []);
      setSubtotal(data.cart.subtotal || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function handleQuantityChange(productId, quantity) {
    try {
      setUpdatingId(productId);
      await updateCartItem(productId, quantity);
      await fetchCart();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(productId) {
    try {
      setUpdatingId(productId);
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border rounded p-6">
        <p className="text-sm text-gray-500">Loading cart…</p>
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

  if (items.length === 0) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-600">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="space-y-4">
        {items.map(({ product, quantity, pricing }) => (
          <div
            key={product._id}
            className="bg-white border rounded p-4 flex gap-4"
          >
            {/* Image */}
            <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">{product.name}</p>

              <p className="text-sm text-gray-600">
                ₹{pricing.finalUnitPrice} × {quantity}
              </p>

              <div className="flex items-center gap-3">
                {/* Quantity */}
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  disabled={updatingId === product._id}
                  onChange={(e) =>
                    handleQuantityChange(
                      product._id,
                      Number(e.target.value)
                    )
                  }
                  className="w-16 border rounded px-2 py-1 text-sm"
                />

                {/* Remove */}
                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={updatingId === product._id}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Line total */}
            <div className="text-sm font-medium">
              ₹{pricing.lineTotal}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border rounded p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-lg font-semibold">₹{subtotal}</p>
        </div>

        <button
          onClick={() => router.push("/checkout")}
          className="bg-orange-500 text-white px-6 py-2 rounded text-sm"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
