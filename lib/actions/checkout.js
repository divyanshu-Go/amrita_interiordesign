// lib/actions/checkout.js

// ── Full updated createOrder for reference ────────────────────────────────────
"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";

import Cart from "@/models/cart";
import Product from "@/models/product";
import Address from "@/models/address";
import Order from "@/models/order";

import { resolveCartPricing }       from "@/lib/pricing/cartPricing";
import { generateOrderNumber }      from "@/lib/utils/generateOrderNumber";
import { sendMail }                 from "@/lib/email/mailer";
import { orderConfirmationEmail }   from "@/lib/email/templates/orderConfirmation";

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const authCookie  = cookieStore.get("auth_token");
  if (!authCookie) throw new Error("Not authenticated");

  const payload = await verifyToken(authCookie.value);
  if (!payload)  throw new Error("Invalid token");

  return payload.user; // must include: _id, role, email
}

export async function createOrder({ addressId, paymentMethod }) {
  if (!addressId) throw new Error("Address is required");
  if (!["COD", "PREPAID"].includes(paymentMethod))
    throw new Error("Invalid payment method");

  const user = await getAuthenticatedUser();
  await DbConnect();

  // 1. Fetch cart
  const cart = await Cart.findOne({ userId: user._id });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // 2. Fetch address
  const address = await Address.findOne({ _id: addressId, userId: user._id });
  if (!address) throw new Error("Address not found");

  // 3. Fetch products
  const products   = await Product.find({ _id: { $in: cart.items.map((i) => i.productId) } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  // 4. Validate stock + build pricing input
  const pricingItems = cart.items.map((item) => {
    const product = productMap.get(item.productId.toString());
    if (!product) throw new Error("Product no longer exists");
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
    return { product, quantity: item.quantity };
  });

  // 5. Resolve pricing server-side
  const pricingRole  = user.role === "enterprise" ? "enterprise" : "user";
  const resolvedCart = resolveCartPricing({ items: pricingItems, role: pricingRole });

  // 6. Snapshot order items
  const orderItems = resolvedCart.items.map((item) => ({
    productId: item.product._id,
    productSnapshot: {
      name:     item.product.name,
      sku:      item.product.sku,
      image:    item.product.images?.[0] || null,
      category: item.product.category,
    },
    quantity: item.quantity,
    sellBy:   item.product.sellBy,
    pricingSnapshot: {
      unitOriginalPrice: item.pricing.unitOriginalPrice,
      unitFinalPrice:    item.pricing.unitFinalPrice,
      discountPerUnit:   item.pricing.discountPerUnit,
      discountPercent:   item.pricing.discountPercent,
      lineOriginalTotal: item.pricing.lineOriginalTotal,
      lineFinalTotal:    item.pricing.lineFinalTotal,
    },
  }));

  // 7. Create order
  const { mrp, discount, subtotal, deliveryCharge, grandTotal } = resolvedCart.totals;

  const order = await Order.create({
    userId:       user._id,
    roleSnapshot: user.role,
    orderNumber:  generateOrderNumber(),
    items:        orderItems,
    addressSnapshot: {
      name:         address.name,
      phone:        address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city:         address.city,
      state:        address.state,
      pincode:      address.pincode,
      country:      address.country,
    },
    totals: { mrp, discount, subtotal, deliveryCharge, grandTotal },
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "not_required" : "pending",
    orderStatus:   paymentMethod === "COD" ? "processing"   : "payment_pending",
  });

  // 8. Deduct stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: -item.quantity } }
    );
  }

  // 9. Clear cart
  await Cart.deleteOne({ userId: user._id });

  // 10. Send confirmation email for COD orders immediately.
  //     For PREPAID, the webhook triggers this after payment.captured.
  if (paymentMethod === "COD" && user.email) {
    try {
      const emailPayload = orderConfirmationEmail({
        order: { ...order.toObject(), _id: order._id.toString() },
        userEmail: user.email,
      });
      sendMail(emailPayload); // non-blocking
    } catch (err) {
      console.error("[Email] COD confirmation failed:", err);
    }
  }

  return {
    orderId:       order._id.toString(),
    orderNumber:   order.orderNumber,
    paymentMethod: order.paymentMethod,
  };
}