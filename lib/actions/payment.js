// app/(customer)/checkout/page.jsx
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

  if (!authCookie) {
    throw new Error("Not authenticated");
  }

  const payload = await verifyToken(authCookie.value);
  if (!payload) {
    throw new Error("Invalid token");
  }

  return payload.user;
}



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



export async function initiatePayment(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  await DbConnect();

  const user = await getAuthenticatedUser();

  // 1️⃣ Fetch order (ownership enforced)
  const order = await Order.findOne({
    _id: orderId,
    userId: user._id,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentMethod !== "PREPAID") {
    throw new Error("Payment not required for this order");
  }

  if (order.paymentStatus === "paid") {
    throw new Error("Order already paid");
  }

  // 2️⃣ Ensure no payment already exists
  const existingPayment = await Payment.findOne({
    orderId: order._id,
  });

  if (existingPayment) {
    throw new Error("Payment already initiated for this order");
  }


  // 3️⃣ Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totals.grandTotal * 100), // paise
    currency: "INR",
    receipt: order.orderNumber,
  });

  // 4️⃣ Create Payment record
  const payment = await Payment.create({
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    status: "created",
  });

  // 5️⃣ Return details needed by frontend
  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    orderNumber: order.orderNumber,
  };
}
