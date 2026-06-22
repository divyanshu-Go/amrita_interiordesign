// components/customer/cart/CartItemCard.jsx
"use client";

import { useState } from "react";
import { Trash2, AlertCircle, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QuantityControl from "./QuantityControl";

/**
 * Pure, presentational cart item card — works for BOTH guest and
 * logged-in carts. The caller owns cart state + persistence; this
 * component only renders and requests changes via callbacks.
 *
 * onQuantityChange(productId, newQty) and onRemove(productId):
 *  - caller updates local state optimistically, persists, and
 *    re-throws on failure so this component can show an inline error
 *    and the caller can roll back.
 */
export default function CartItemCard({ item, onQuantityChange, onRemove }) {
  const [updating, setUpdating]     = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError]           = useState(null);

  const { product, quantity, pricing } = item;
  const pid = product._id.toString();

  async function changeQuantity(newQty) {
    if (newQty < 1) return;
    if (product.stock != null && newQty > product.stock) {
      setError(`Only ${product.stock} in stock`);
      return;
    }
    setUpdating(true);
    setError(null);
    try {
      await onQuantityChange(pid, newQty);
    } catch (err) {
      setError(err?.message || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  }

  async function removeItem() {
    if (!confirm("Remove this item from your cart?")) return;
    setIsRemoving(true);
    setError(null);
    try {
      await onRemove(pid);
    } catch (err) {
      setError(err?.message || "Failed to remove item");
      setIsRemoving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="p-4 flex gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <Link href={`/product/${product.slug}`} target="_blank">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package size={20} />
              </div>
            )}
          </Link>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
          {product.slug && <p className="text-xs text-gray-400 mb-3">SKU: {product.slug}</p>}

          <div className="space-y-1 mb-4">
            {pricing.discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  ₹{pricing.unitOriginalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-400">{product.sellBy && `per ${product.sellBy}`}</span>
              </div>
            )}
            {pricing.discountPercent > 0 && (
              <span className="inline-block text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded">
                {pricing.discountPercent}% OFF
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-gray-900">
                ₹{pricing.unitFinalPrice.toLocaleString("en-IN")}
              </span>
              {product.sellBy && <span className="text-xs text-gray-500">per {product.sellBy}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <QuantityControl quantity={quantity} onChange={changeQuantity} disabled={updating || isRemoving} />
            <button
              onClick={removeItem}
              disabled={isRemoving || updating}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>

        <div className="text-right flex flex-col justify-center min-w-fit">
          <p className="text-xs text-gray-500 mb-1 font-medium">Line Total</p>
          <p className="text-lg font-bold text-gray-900">₹{pricing.lineFinalTotal.toLocaleString("en-IN")}</p>
          {pricing.discountPercent > 0 && (
            <>
              <p className="text-xs text-gray-400 line-through mt-0.5">
                ₹{pricing.lineOriginalTotal.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-green-600 font-semibold mt-0.5">
                Save ₹{(pricing.lineOriginalTotal - pricing.lineFinalTotal).toLocaleString("en-IN")}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}