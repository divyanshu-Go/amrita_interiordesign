// lib/actions/cart.js
"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import Cart from "@/models/cart";
import Product from "@/models/product";

/**
 * Internal helper: authenticate user
 */
async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth_token");

  if (!authCookie) {
    throw new Error("Not authenticated");
  }

  const payload = await verifyToken(authCookie.value);
  if (!payload) {
    throw new Error("Invalid token");
  }

  return payload.user;
}




export async function addToCart(productId, quantity = 1) {
  await DbConnect();

  const user = await getAuthenticatedUser();

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ userId: user._id });

  if (!cart) {
    cart = await Cart.create({
      userId: user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;

    if (newQty > product.stock) {
      throw new Error("Insufficient stock");
    }

    existingItem.quantity = newQty;
  } else {
    cart.items.push({
      productId,
      quantity,
      sellBy: product.sellBy,
    });
  }

  await cart.save();

  return { success: true };
}




export async function updateCartItem(productId, quantity) {
  await DbConnect();

  const user = await getAuthenticatedUser();

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

  item.quantity = quantity;
  await cart.save();

  return { success: true };
}



export async function removeFromCart(productId) {
  await DbConnect();

  const user = await getAuthenticatedUser();

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();

  return { success: true };
}

