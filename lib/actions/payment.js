// lib/actions/payment.js
"use server";

import { cookies } from "next/headers";
import Razorpay from "razorpay";

import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";

import Order from "@/models/order";
import Payment from "@/models/payment";

async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth_token");
  if (!authCookie) throw new Error("Not authenticated");

  const payload = await verifyToken(authCookie.value);
  if (!payload) throw new Error("Invalid token");

  return payload.user;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function initiatePayment(orderId) {
  if (!orderId) throw new Error("Order ID is required");

  await DbConnect();
  const user = await getAuthenticatedUser();

  // 1. Fetch order (ownership enforced)
  const order = await Order.findOne({ _id: orderId, userId: user._id });
  if (!order) throw new Error("Order not found");
  if (order.paymentMethod !== "PREPAID") throw new Error("Payment not required for this order");
  if (order.paymentStatus === "paid") throw new Error("Order already paid");

  // 2. FIX: Reuse existing payment instead of throwing.
  //    This handles page refresh / popup close + retry gracefully.
  const existingPayment = await Payment.findOne({ orderId: order._id });
  if (existingPayment && existingPayment.status !== "failed") {
    return {
      razorpayOrderId: existingPayment.razorpayOrderId,
      amount:          existingPayment.amount,
      currency:        existingPayment.currency,
      orderNumber:     order.orderNumber,
    };
  }

  // 3. Create a fresh Razorpay order (also handles retry after failure)
  const razorpayOrder = await razorpay.orders.create({
    amount:   Math.round(order.totals.grandTotal * 100), // paise
    currency: "INR",
    receipt:  order.orderNumber,
  });

  // 4. Upsert payment record (replace failed one, or create new)
  const payment = await Payment.findOneAndUpdate(
    { orderId: order._id },
    {
      razorpayOrderId:   razorpayOrder.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      amount:            razorpayOrder.amount,
      currency:          razorpayOrder.currency,
      status:            "created",
      failureReason:     null,
    },
    { upsert: true, new: true }
  );

  return {
    razorpayOrderId: razorpayOrder.id,
    amount:          razorpayOrder.amount,
    currency:        razorpayOrder.currency,
    orderNumber:     order.orderNumber,
  };
}