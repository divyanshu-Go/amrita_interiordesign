import crypto from "crypto";
import { NextResponse } from "next/server";

import DbConnect from "@/lib/Db/DbConnect";
import Order from "@/models/order";
import Payment from "@/models/payment";

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}


export async function POST(req) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text();

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    await DbConnect();

    // Handle successful payment
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      const payment = await Payment.findOne({
        razorpayOrderId: paymentEntity.order_id,
      });

      if (!payment) {
        return NextResponse.json({ success: true });
      }

      // Idempotency check
      if (payment.status === "paid") {
        return NextResponse.json({ success: true });
      }

      payment.status = "paid";
      payment.razorpayPaymentId = paymentEntity.id;
      await payment.save();

      await Order.updateOne(
        { _id: payment.orderId },
        {
          paymentStatus: "paid",
          orderStatus: "processing",
        }
      );
    }

    // Handle failed payment
    if (event.event === "payment.failed") {
      const paymentEntity = event.payload.payment.entity;

      const payment = await Payment.findOne({
        razorpayOrderId: paymentEntity.order_id,
      });

      if (!payment) {
        return NextResponse.json({ success: true });
      }

      payment.status = "failed";
      payment.razorpayPaymentId = paymentEntity.id;
      payment.failureReason =
        paymentEntity.error_description || "Payment failed";
      await payment.save();

      await Order.updateOne(
        { _id: payment.orderId },
        {
          paymentStatus: "failed",
          orderStatus: "payment_failed",
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
