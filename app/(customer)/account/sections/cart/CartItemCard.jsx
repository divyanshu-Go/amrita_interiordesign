"use client";

import { useAccount } from "../../AccountDataProvider";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import QuantityControl from "./QuantityControl";
import { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";

export default function CartItemCard({ item }) {
  const { setCart } = useAccount();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const { product, quantity, pricing } = item;

  async function changeQuantity(newQty) {
    if (newQty < 1) return;

    setUpdating(true);
    setError(null);

    // Optimistic UI update
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.product._id === product._id
          ? { ...i, quantity: newQty }
          : i
      ),
      totals: prev.totals, // Keep totals in sync
    }));

    try {
      await updateCartItem(product._id, newQty);
    } catch (err) {
      setError(err.message || "Failed to update quantity");
      // Revert on error
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity }
            : i
        ),
      }));
    } finally {
      setUpdating(false);
    }
  }

  async function removeItem() {
    if (!confirm("Remove this item from your cart?")) return;

    setIsRemoving(true);
    setError(null);

    try {
      await removeFromCart(product._id);
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (i) => i.product._id !== product._id
        ),
      }));
    } catch (err) {
      setError(err.message || "Failed to remove item");
      setIsRemoving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex gap-3 items-start">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart size={24} />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Name & SKU */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {product.name}
            </h3>
            {product.slug && (
              <p className="text-xs text-gray-500">SKU: {product.slug}</p>
            )}
          </div>

          {/* Unit Type */}
          <p className="text-xs text-gray-500 mb-3">
            Per {product.sellBy}
          </p>

          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{pricing.unitFinalPrice.toLocaleString("en-IN")}
              </span>
              {pricing.discountPercent > 0 && (
                <>
                  <span className="text-sm line-through text-gray-500">
                    ₹{pricing.unitOriginalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {pricing.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quantity Control & Remove */}
          <div className="flex items-center gap-4">
            <QuantityControl
              quantity={quantity}
              onChange={changeQuantity}
              disabled={updating}
            />

            <button
              onClick={removeItem}
              disabled={isRemoving || updating}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>

        {/* Line Total */}
        <div className="text-right flex flex-col items-end justify-center min-w-fit">
          <p className="text-xs text-gray-500 mb-2">Line Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{pricing.lineFinalTotal.toLocaleString("en-IN")}
          </p>
          {pricing.discountPercent > 0 && (
            <p className="text-xs text-green-600 mt-1">
              Save ₹{(pricing.lineOriginalTotal - pricing.lineFinalTotal).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}