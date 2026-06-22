"use client";

import { useAccount } from "../AccountDataProvider";
import CartItemCard from "@/components/customer/cart/CartItemCard";
import CartLoader from "@/components/customer/cart/CartLoader";
import CartSummary from "@/components/customer/cart/CartSummary";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { recalcTotalsFromItems } from "@/lib/pricing/cartPricing";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartView() {
  const { cart, setCart, user, loading } = useAccount();

  async function handleQuantityChange(productId, newQty) {
    const updatedItems = cart.items.map((i) =>
      i.product._id.toString() === productId
        ? {
            ...i,
            quantity: newQty,
            pricing: {
              ...i.pricing,
              lineOriginalTotal: i.pricing.unitOriginalPrice * newQty,
              lineFinalTotal:    i.pricing.unitFinalPrice    * newQty,
            },
          }
        : i
    );
    const previous = cart;
    setCart({ ...cart, items: updatedItems, totals: recalcTotalsFromItems(updatedItems) });
    try {
      await updateCartItem(productId, newQty);
    } catch (err) {
      setCart(previous);
      throw err;
    }
  }

  async function handleRemove(productId) {
    const updatedItems = cart.items.filter((i) => i.product._id.toString() !== productId);
    const previous = cart;
    setCart({ ...cart, items: updatedItems, totals: recalcTotalsFromItems(updatedItems) });
    try {
      await removeFromCart(productId);
    } catch (err) {
      setCart(previous);
      throw err;
    }
  }

  if (loading.cart || !cart) {
    return <CartLoader />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-dashed border-gray-800 p-12 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-gray-900 font-semibold mb-1 text-base">Your cart is empty</h3>
        <p className="text-gray-500 text-sm mb-6">
          Looks like you haven't added any items yet. Start shopping to fill your cart!
        </p>
        <Link
          href="/category/all"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
          <ShoppingCart size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
          <p className="text-xs text-gray-500 mt-1">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItemCard
              key={item.product._id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <CartSummary totals={cart.totals} userRole={user?.role} />
        </div>
      </div>
    </div>
  );
}