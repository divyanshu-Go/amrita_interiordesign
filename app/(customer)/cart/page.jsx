// app/(customer)/cart/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getGuestCart, removeFromGuestCart, updateGuestCartItem } from "@/lib/guestCart";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { resolveCartPricing } from "@/lib/pricing/cartPricing";
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DELIVERY_CHARGE = 399;
const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

// ── Guest totals — uses the same canonical field names as cartPricing.js ──
function buildGuestTotals(items) {
  let mrp = 0, subtotal = 0;
  for (const item of items) {
    mrp      += item.pricing.lineOriginalTotal;
    subtotal += item.pricing.lineFinalTotal;
  }
  return {
    mrp,
    discount:       mrp - subtotal,
    subtotal,
    deliveryCharge: DELIVERY_CHARGE,
    grandTotal:     subtotal + DELIVERY_CHARGE,
  };
}

export default function CartPage() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [items,    setItems]    = useState([]);
  const [totals,   setTotals]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null); // productId string while mutating

  useEffect(() => {
    if (authLoading) return;
    user ? loadUserCart() : loadGuestCart();
  }, [user, authLoading]);

  // ── Logged-in: use existing /api/cart unchanged ────────────────────────
  async function loadUserCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error();
      const { cart } = await res.json();
      setItems(cart?.items  ?? []);
      setTotals(cart?.totals ?? null);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  // ── Guest: localStorage → hydrate products → resolveCartPricing ────────
  async function loadGuestCart() {
    setLoading(true);
    try {
      const guestCart = getGuestCart();

      if (guestCart.items.length === 0) {
        setItems([]);
        setTotals({ mrp: 0, discount: 0, subtotal: 0, deliveryCharge: DELIVERY_CHARGE, grandTotal: DELIVERY_CHARGE });
        setLoading(false);
        return;
      }

      const ids = guestCart.items.map((i) => i.productId).join(",");
      const res = await fetch(`/api/products/by-ids?ids=${ids}`);
      const { products } = await res.json();

      // Build items in the shape resolveCartPricing expects
      const rawItems = guestCart.items
        .map((gItem) => {
          const product = products.find((p) => p._id.toString() === gItem.productId);
          if (!product) return null;
          return { product, quantity: gItem.quantity };
        })
        .filter(Boolean);

      // resolveCartPricing returns items with canonical pricing + totals
      const resolved = resolveCartPricing({ items: rawItems, role: userRole });

      // Sanitise product to only what the UI needs (mirrors /api/cart sanitisation)
      const sanitised = resolved.items.map((item) => ({
        product: {
          _id:    item.product._id,
          name:   item.product.name,
          slug:   item.product.slug,
          images: item.product.images,
          stock:  item.product.stock,
          sellBy: item.product.sellBy,
        },
        quantity: item.quantity,
        pricing:  item.pricing, // unitOriginalPrice, unitFinalPrice, lineFinalTotal, etc.
      }));

      setItems(sanitised);
      setTotals(resolved.totals);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  // ── Shared mutation helpers ────────────────────────────────────────────
  async function handleIncrement(item) {
    const pid = item.product._id.toString();
    if (item.quantity >= item.product.stock) return;
    setUpdating(pid);
    try {
      if (user) { await updateCartItem(pid, item.quantity + 1); await loadUserCart(); }
      else       { updateGuestCartItem(pid, item.quantity + 1); await loadGuestCart(); }
    } catch { toast.error("Failed to update"); }
    finally  { setUpdating(null); }
  }

  async function handleDecrement(item) {
    const pid = item.product._id.toString();
    setUpdating(pid);
    try {
      if (item.quantity <= 1) {
        if (user) await removeFromCart(pid); else removeFromGuestCart(pid);
      } else {
        if (user) await updateCartItem(pid, item.quantity - 1);
        else       updateGuestCartItem(pid, item.quantity - 1);
      }
      user ? await loadUserCart() : await loadGuestCart();
    } catch { toast.error("Failed to update"); }
    finally  { setUpdating(null); }
  }

  async function handleRemove(item) {
    const pid = item.product._id.toString();
    setUpdating(pid);
    try {
      if (user) { await removeFromCart(pid); await loadUserCart(); }
      else       { removeFromGuestCart(pid); await loadGuestCart(); }
    } catch { toast.error("Failed to remove"); }
    finally  { setUpdating(null); }
  }

  function handleCheckout() {
    if (!user) router.push("/login?redirect=/checkout");
    else        router.push("/checkout");
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingCart className="w-14 h-14 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">Your cart is empty</h2>
        <p className="text-sm text-gray-500 text-center">
          Browse our collection and add items to get started.
        </p>
        <Link
          href="/category/all"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                     text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // ── Cart ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100">
            <ShoppingCart size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-xs text-gray-500">
              {items.length} {items.length === 1 ? "item" : "items"}
              {!user && (
                <span className="ml-2 text-orange-500 font-medium">
                  ·{" "}
                  <Link href="/login" className="underline">
                    Log in
                  </Link>{" "}
                  to save your cart
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const pid        = item.product._id.toString();
              const isUpdating = updating === pid;
              const { pricing } = item;

              return (
                <div
                  key={pid}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
                >
                  {/* Image */}
                  <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={80} height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`}>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
                        {item.product.name}
                      </p>
                    </Link>

                    {/* Pricing — uses canonical field names from cartPricing.js */}
                    <div className="mt-1 space-y-0.5">
                      {pricing.discountPercent > 0 && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{fmt(pricing.unitOriginalPrice)} / {item.product.sellBy}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{fmt(pricing.unitFinalPrice)}
                        </span>
                        <span className="text-xs text-gray-400">/ {item.product.sellBy}</span>
                        {pricing.discountPercent > 0 && (
                          <span className="text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded">
                            {pricing.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center text-gray-600
                                     hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900">
                          {isUpdating
                            ? <Loader2 className="w-3 h-3 animate-spin inline text-orange-500" />
                            : item.quantity
                          }
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          disabled={isUpdating || item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center text-gray-600
                                     hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{fmt(pricing.lineFinalTotal)}
                        </p>
                        {pricing.discountPercent > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹{fmt(pricing.lineOriginalTotal)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item)}
                    disabled={isUpdating}
                    className="flex-shrink-0 self-start p-1.5 text-gray-400
                               hover:text-red-500 transition-colors disabled:opacity-40"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Summary ── */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>MRP total</span>
                  <span>₹{fmt(totals?.mrp)}</span>
                </div>
                {totals?.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>−₹{fmt(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{fmt(totals?.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-orange-500">₹{fmt(totals?.deliveryCharge)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{fmt(totals?.grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2
                           bg-orange-500 hover:bg-orange-600 active:scale-[0.98]
                           text-white font-semibold py-3 rounded-lg
                           transition-all duration-150 text-sm mt-2"
              >
                {user ? "Proceed to Checkout" : "Login to Checkout"}
                <ArrowRight size={15} />
              </button>

              {!user && (
                <p className="text-[11px] text-gray-400 text-center">
                  Your cart items will be saved after login
                </p>
              )}

              <Link
                href="/category/all"
                className="block text-center text-xs text-orange-500 hover:underline mt-1"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}