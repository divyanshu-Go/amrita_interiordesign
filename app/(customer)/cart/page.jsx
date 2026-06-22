"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getGuestCart, removeFromGuestCart, updateGuestCartItem } from "@/lib/guestCart";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { resolveCartPricing, recalcTotalsFromItems } from "@/lib/pricing/cartPricing";
import CartItemCard from "@/components/customer/cart/CartItemCard";
import CartLoader from "@/components/customer/cart/CartLoader";
import CartSummary from "@/components/customer/cart/CartSummary";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const { user, userRole, loading: authLoading } = useAuth();

  const [items, setItems]     = useState([]);
  const [totals, setTotals]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    user ? loadUserCart() : loadGuestCart();
  }, [user, authLoading]);

  // ── Logged-in: existing /api/cart, unchanged ────────────────────────────
  async function loadUserCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error();
      const { cart } = await res.json();
      setItems(cart?.items ?? []);
      setTotals(cart?.totals ?? null);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  // ── Guest: localStorage → hydrate products → resolveCartPricing ────────
  // (runs once on page load, NOT on every quantity click anymore)
  async function loadGuestCart() {
    setLoading(true);
    try {
      const guestCart = getGuestCart();
      if (guestCart.items.length === 0) {
        setItems([]);
        setTotals(recalcTotalsFromItems([]));
        return;
      }

      const ids = guestCart.items.map((i) => i.productId).join(",");
      const res = await fetch(`/api/products/by-ids?ids=${ids}`);
      const { products } = await res.json();

      const rawItems = guestCart.items
        .map((gItem) => {
          const product = products.find((p) => p._id.toString() === gItem.productId);
          return product ? { product, quantity: gItem.quantity } : null;
        })
        .filter(Boolean);

      const resolved = resolveCartPricing({ items: rawItems, role: userRole });
      setItems(resolved.items);
      setTotals(resolved.totals);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  // ── Optimistic mutations — local recalc first, persist in background,
  //    NO full reload/refetch on every click ──────────────────────────────
  async function handleQuantityChange(productId, newQty) {
    const updatedItems = items.map((i) =>
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
    const previousItems = items;
    setItems(updatedItems);
    setTotals(recalcTotalsFromItems(updatedItems));
    try {
      if (user) await updateCartItem(productId, newQty);
      else       updateGuestCartItem(productId, newQty);
    } catch (err) {
      setItems(previousItems);
      setTotals(recalcTotalsFromItems(previousItems));
      throw err;
    }
  }

  async function handleRemove(productId) {
    const updatedItems = items.filter((i) => i.product._id.toString() !== productId);
    const previousItems = items;
    setItems(updatedItems);
    setTotals(recalcTotalsFromItems(updatedItems));
    try {
      if (user) await removeFromCart(productId);
      else       removeFromGuestCart(productId);
    } catch (err) {
      setItems(previousItems);
      setTotals(recalcTotalsFromItems(previousItems));
      throw err;
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CartLoader />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center max-w-md">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
            <ShoppingCart size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-xs text-gray-500 mt-1">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
              {!user && (
                <span className="ml-2 text-orange-500 font-medium">
                  · <Link href="/login" className="underline">Log in</Link> to save your cart
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.product._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <CartSummary totals={totals} userRole={userRole} isGuest={!user} />
          </div>
        </div>
      </div>
    </div>
  );
}