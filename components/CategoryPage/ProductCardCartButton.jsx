// components/CategoryPage/ProductCardCartButton.jsx

"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import { addToCart } from "@/lib/actions/cart";
import { getGuestCart, addToGuestCart } from "@/lib/guestCart";

export default function ProductCardCartButton({ productId, sellBy = "piece" }) {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState("checking"); // "checking" | "idle" | "adding" | "in_cart"

  // ── On mount / auth resolution: verify if product exists in cart ──────────
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      let cancelled = false;
      async function checkServerCart() {
        try {
          const res = await fetch("/api/cart");
          if (!res.ok) {
            if (!cancelled) setState("idle");
            return;
          }
          const { cart } = await res.json();
          const existing = cart?.items?.some(
            (i) => i.product?._id?.toString() === productId?.toString()
          );
          if (!cancelled) {
            setState(existing ? "in_cart" : "idle");
          }
        } catch {
          if (!cancelled) setState("idle");
        }
      }
      checkServerCart();
      return () => {
        cancelled = true;
      };
    } else {
      // Guest check against localStorage
      const guestCart = getGuestCart();
      const existing = guestCart.items.some(
        (i) => i.productId?.toString() === productId?.toString()
      );
      setState(existing ? "in_cart" : "idle");
    }
  }, [productId, user, authLoading]);

  // ── Add to Cart Action Handler ─────────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevents triggers on parent layout elements

    if (state !== "idle") return;
    setState("adding");

    try {
      if (user) {
        await addToCart(productId, 1);
      } else {
        addToGuestCart(productId, 1, sellBy);
      }
      setState("in_cart");
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
      setState("idle");
    }
  }

  // ── Skeleton Loader (Prevents layout shifting during checks) ────────────
  if (authLoading || state === "checking") {
    return (
      <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse mt-2" />
    );
  }

  // ── Already in Cart (ADDED State) ──────────────────────────────────────
  if (state === "in_cart") {
    return (
      <button
        disabled
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="w-full mt-2 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold text-xs bg-green-50 text-green-700 border border-green-200 cursor-default"
      >
        <Check className="w-3.5 h-3.5" />
        <span>ADDED</span>
      </button>
    );
  }

  // ── Add to Cart / Adding State ─────────────────────────────────────────
  return (
    <button
      onClick={handleAdd}
      disabled={state === "adding"}
      className="w-full mt-2 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold text-xs bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed"
    >
      {state === "adding" ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Adding…</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}