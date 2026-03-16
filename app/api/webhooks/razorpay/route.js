// app/api/webhooks/razorpay/route.js
import crypto from "crypto";
import { NextResponse } from "next/server";

import DbConnect from "@/lib/Db/DbConnect";
import Order from "@/models/order";
import Payment from "@/models/payment";

// CRITICAL FIX: Tell Next.js NOT to parse the body.
// Razorpay signs the raw bytes — if Next.js pre-parses it,
// the HMAC will never match and every webhook call returns 400.
export const config = {
  api: { bodyParser: false },
};

function verifySignature(rawBody, signature) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    // FIX: Read as ArrayBuffer then convert — preserves exact bytes Razorpay signed
    const rawBuffer = await req.arrayBuffer();
    const rawBody   = Buffer.from(rawBuffer).toString("utf-8");
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    if (!verifySignature(rawBody, signature)) {
      console.error("[Webhook] Signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log("[Webhook] Event received:", event.event);

    await DbConnect();

    if (event.event === "payment.captured") {
      await handlePaymentCaptured(event.payload.payment.entity);
    }

    if (event.event === "payment.failed") {
      await handlePaymentFailed(event.payload.payment.entity);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handlePaymentCaptured(paymentEntity) {
  const payment = await Payment.findOne({
    razorpayOrderId: paymentEntity.order_id,
  });

  if (!payment) {
    console.warn("[Webhook] Payment record not found for:", paymentEntity.order_id);
    return;
  }

  // Idempotency: skip if already processed
  if (payment.status === "paid") return;

  payment.status            = "paid";
  payment.razorpayPaymentId = paymentEntity.id;
  await payment.save();

  await Order.updateOne(
    { _id: payment.orderId },
    { paymentStatus: "paid", orderStatus: "processing" }
  );

  console.log("[Webhook] Order marked as paid:", payment.orderId);
}

async function handlePaymentFailed(paymentEntity) {
  const payment = await Payment.findOne({
    razorpayOrderId: paymentEntity.order_id,
  });

  if (!payment) {
    console.warn("[Webhook] Payment record not found for:", paymentEntity.order_id);
    return;
  }

  payment.status            = "failed";
  payment.razorpayPaymentId = paymentEntity.id;
  payment.failureReason     = paymentEntity.error_description || "Payment failed";
  await payment.save();

  await Order.updateOne(
    { _id: payment.orderId },
    { paymentStatus: "failed", orderStatus: "payment_failed" }
  );

  console.log("[Webhook] Order marked as failed:", payment.orderId);
}