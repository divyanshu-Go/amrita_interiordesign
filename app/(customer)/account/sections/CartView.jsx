"use client";

import { useAccount } from "../AccountDataProvider";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartView() {
  const router = useRouter();
  const { cart, setCart, loading } = useAccount();
  const [updatingId, setUpdatingId] = useState(null);

  if (loading.cart || !cart) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-500">
        Loading cart…
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-white border rounded p-6 text-sm text-gray-600">
        Your cart is empty.
      </div>
    );
  }

  async function handleQuantityChange(productId, quantity) {
    try {
      setUpdatingId(productId);
      await updateCartItem(productId, quantity);

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        ),
      }));
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

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) => item.product._id !== productId
        ),
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Items */}
      <div className="space-y-4">
        {cart.items.map(({ product, quantity, pricing }) => (
          <div
            key={product._id}
            className="bg-white border rounded p-4 flex gap-4"
          >
            {/* Image */}
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">{product.name}</p>

              <p className="text-xs text-gray-600">
                ₹{pricing.finalUnitPrice} / {product.sellBy}
              </p>

              <div className="flex items-center gap-3">
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

                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={updatingId === product._id}
                  className="text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Line total */}
            <div className="text-sm font-semibold">
              ₹{pricing.lineTotal}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border rounded p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-lg font-semibold">
            ₹{cart.subtotal}
          </p>
        </div>

        <button
          onClick={() => router.push("/checkout")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
