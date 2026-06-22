// components/customer/CartButton.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Minus, Plus, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthProvider";
import { addToCart, updateCartItem, removeFromCart } from "@/lib/actions/cart";
import {
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
} from "@/lib/guestCart";

export default function CartButton({ productId, stock, sellBy = "piece" }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [state, setState] = useState("checking");
  const [qty, setQty] = useState(0);
  const [qtyBump, setQtyBump] = useState(false);

  // ── On mount: read cart state from correct source ──────────────────────
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      // Logged-in: check server cart
      let cancelled = false;
      async function checkServerCart() {
        try {
          const res = await fetch("/api/cart");
          if (!res.ok) { if (!cancelled) setState("idle"); return; }
          const { cart } = await res.json();
          const existing = cart?.items?.find(
            (i) => i.product?._id?.toString() === productId?.toString()
          );
          if (!cancelled) {
            if (existing) { setQty(existing.quantity); setState("stepper"); }
            else setState("idle");
          }
        } catch {
          if (!cancelled) setState("idle");
        }
      }
      checkServerCart();
      return () => { cancelled = true; };
    } else {
      // Guest: check localStorage instantly — no fetch needed
      const guestCart = getGuestCart();
      const existing = guestCart.items.find((i) => i.productId === productId);
      if (existing) { setQty(existing.quantity); setState("stepper"); }
      else setState("idle");
    }
  }, [productId, user, authLoading]);

  const triggerBump = useCallback(() => {
    setQtyBump(true);
    setTimeout(() => setQtyBump(false), 300);
  }, []);

  // ── Add to cart — works for everyone ──────────────────────────────────
  async function handleAdd() {
    if (state !== "idle") return;
    setState("adding");

    try {
      if (user) {
        await addToCart(productId, 1);
      } else {
        addToGuestCart(productId, 1, sellBy);
      }
      setState("added");
      setQty(1);
      setTimeout(() => setState("stepper"), 900);
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
      setState("idle");
    }
  }

  // ── Increment ──────────────────────────────────────────────────────────
  async function handleIncrement() {
    if (state === "updating" || qty >= stock) return;
    const next = qty + 1;
    setState("updating");
    setQty(next);
    triggerBump();
    try {
      if (user) {
        await updateCartItem(productId, next);
      } else {
        updateGuestCartItem(productId, next);
      }
    } catch (err) {
      setQty(qty);
      toast.error(err.message || "Failed to update cart");
    } finally {
      setState("stepper");
    }
  }

  // ── Decrement / remove ─────────────────────────────────────────────────
  async function handleDecrement() {
    if (state === "updating") return;
    setState("updating");

    if (qty <= 1) {
      try {
        if (user) {
          await removeFromCart(productId);
        } else {
          removeFromGuestCart(productId);
        }
        setQty(0);
        setState("idle");
      } catch (err) {
        toast.error(err.message || "Failed to remove from cart");
        setState("stepper");
      }
    } else {
      const next = qty - 1;
      setQty(next);
      triggerBump();
      try {
        if (user) {
          await updateCartItem(productId, next);
        } else {
          updateGuestCartItem(productId, next);
        }
      } catch (err) {
        setQty(qty);
        toast.error(err.message || "Failed to update cart");
      } finally {
        setState("stepper");
      }
    }
  }

  // ── Skeleton ───────────────────────────────────────────────────────────
  if (authLoading || state === "checking") {
    return <div className="w-full h-[42px] bg-gray-100 rounded-lg animate-pulse" />;
  }

  // ── Add / Adding / Added ───────────────────────────────────────────────
  if (state === "idle" || state === "adding" || state === "added") {
    return (
      <button
        onClick={handleAdd}
        disabled={state !== "idle"}
        className={`
          w-full flex items-center justify-center gap-2
          px-3 py-2.5 rounded-lg font-semibold text-sm
          transition-all duration-300
          ${state === "added"
            ? "bg-green-600 text-white scale-[0.98]"
            : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white"}
          ${state === "adding" ? "opacity-80 cursor-not-allowed" : ""}
        `}
      >
        {state === "adding" && <Loader2 className="w-4 h-4 animate-spin" />}
        {state === "added"  && <Check   className="w-4 h-4" />}
        {state === "idle"   && <ShoppingCart className="w-4 h-4" />}
        <span>
          {state === "adding" && "Adding…"}
          {state === "added"  && "Added to Cart"}
          {state === "idle"   && "Add to Cart"}
        </span>
      </button>
    );
  }

  // ── Stepper (50/50 grid) ───────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <div className="flex items-center border-2 border-orange-500 rounded-lg overflow-hidden">
        <button
          onClick={handleDecrement}
          disabled={state === "updating"}
          aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}
          className="flex items-center justify-center w-9 h-[38px]
                     text-orange-600 hover:bg-orange-50
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors flex-shrink-0"
        >
          <Minus size={15} strokeWidth={2.5} />
        </button>

        <span className={`
          flex-1 text-center text-sm font-bold text-gray-900 select-none
          transition-transform duration-200
          ${qtyBump ? "scale-125" : "scale-100"}
        `}>
          {state === "updating"
            ? <Loader2 className="w-3.5 h-3.5 animate-spin inline text-orange-500" />
            : qty
          }
        </span>

        <button
          onClick={handleIncrement}
          disabled={state === "updating" || qty >= stock}
          aria-label="Increase quantity"
          className="flex items-center justify-center w-9 h-[38px]
                     text-orange-600 hover:bg-orange-50
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors flex-shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      </div>

      <button
        onClick={() => router.push("/cart")}
        className="flex items-center justify-center gap-1.5
                   bg-gray-900 hover:bg-gray-700 active:scale-[0.98]
                   text-white text-xs font-semibold rounded-lg
                   transition-all duration-150 whitespace-nowrap h-[42px]"
      >
        <ShoppingCart size={13} />
        View Cart
      </button>
    </div>
  );
}