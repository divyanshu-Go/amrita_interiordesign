"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";

import Cart from "@/models/cart";
import Product from "@/models/product";
import Address from "@/models/address";
import Order from "@/models/order";

import { resolvePrice } from "@/lib/pricing/resolvePrice";
import { generateOrderNumber } from "@/lib/utils/generateOrderNumber";


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





export async function createOrder({ addressId, paymentMethod }) {
  if (!addressId) {
    throw new Error("Address is required");
  }

  if (!["COD", "PREPAID"].includes(paymentMethod)) {
    throw new Error("Invalid payment method");
  }
  
  const user = await getAuthenticatedUser();
  await DbConnect();

  // 1️⃣ Fetch cart
  const cart = await Cart.findOne({ userId: user._id });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2️⃣ Fetch address (ownership enforced)
  const address = await Address.findOne({
    _id: addressId,
    userId: user._id,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // 3️⃣ Fetch products
  const productIds = cart.items.map((i) => i.productId);
  const products = await Product.find({
    _id: { $in: productIds },
  });

  const productMap = new Map(
    products.map((p) => [p._id.toString(), p])
  );

  let orderItems = [];
  let subtotal = 0;

  // 4️⃣ Validate + price each cart item
  for (const item of cart.items) {
    const product = productMap.get(item.productId.toString());

    if (!product) {
      throw new Error("Product no longer exists");
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}`
      );
    }

    const pricing = resolvePrice({
      product,
      role: user.role,
      quantity: item.quantity,
    });

    subtotal += pricing.lineTotal;

    orderItems.push({
      productId: product._id,
      productSnapshot: {
        name: product.name,
        sku: product.sku,
        image: product.images?.[0] || null,
        category: product.category,
      },
      quantity: item.quantity,
      sellBy: item.sellBy,
      pricingSnapshot: pricing,
    });
  }

  // 5️⃣ Create order
  const order = await Order.create({
    userId: user._id,
    roleSnapshot: user.role,
    orderNumber: generateOrderNumber(),
    items: orderItems,
    addressSnapshot: {
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    },
    totals: {
      subtotal,
      discount: 0, // already baked into pricing
      grandTotal: subtotal,
    },
    paymentMethod,
    paymentStatus:
      paymentMethod === "COD" ? "not_required" : "pending",
    orderStatus:
      paymentMethod === "COD"
        ? "processing"
        : "payment_pending",
  });

  // 6️⃣ Deduct stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: -item.quantity } }
    );
  }

  // 7️⃣ Clear cart
  await Cart.deleteOne({ userId: user._id });

  return {
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    paymentMethod: order.paymentMethod,
  };
}

