// lib/actions/mergeGuestCart.js
"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import Cart from "@/models/cart";
import Product from "@/models/product";

/**
 * @param {Array<{ productId: string, quantity: number, sellBy: string }>} guestItems
 */
export async function mergeGuestCart(guestItems) {

  console.log("[mergeGuestCart] ENTRY", guestItems);

  if (!guestItems || guestItems.length === 0) return { success: true };

  await DbConnect();

  // Next.js 14/15: cookies() must be awaited
  const cookieStore = await cookies();
  const authCookie  = cookieStore.get("auth_token");

  if (!authCookie) {
    console.error("[mergeGuestCart] No auth_token cookie found");
    throw new Error("Not authenticated");
  }

  const payload = await verifyToken(authCookie.value);
  if (!payload) {
    console.error("[mergeGuestCart] Token verification failed");
    throw new Error("Invalid token");
  }

  const userId = payload.user._id;

  const productIds = guestItems.map((i) => i.productId);
  const products   = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const validItems = guestItems
    .map((gItem) => {
      const product = productMap.get(gItem.productId);
      if (!product || product.stock < 1) return null;
      return {
        productId: product._id,
        quantity:  Math.min(gItem.quantity, product.stock),
        sellBy:    product.sellBy,
      };
    })
    .filter(Boolean);

  await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: validItems } },
    { upsert: true, new: true }
  );

  return { success: true, mergedCount: validItems.length };
}