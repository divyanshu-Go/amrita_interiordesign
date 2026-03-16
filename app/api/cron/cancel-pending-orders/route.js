// app/api/cron/cancel-pending-orders/route.js
//
// Vercel cron hits this route on schedule (see vercel.json).
// Also callable manually with ?secret=CRON_SECRET for testing.
//
// What it does:
//   - Finds orders stuck in "payment_pending" for > CANCEL_AFTER_MINUTES
//   - Marks them cancelled + restores stock
//   - Marks linked Payment record as failed

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Order from "@/models/order";
import Payment from "@/models/payment";
import Product from "@/models/product";

const CANCEL_AFTER_MINUTES = 20; // cancel if payment not done within 20 min

export async function GET(req) {
  // Simple auth — Vercel cron sends Authorization header OR allow ?secret= for manual testing
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const querySecret = searchParams.get("secret");

  const isVercelCron    = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManualTrigger = querySecret === process.env.CRON_SECRET;

  if (!isVercelCron && !isManualTrigger) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await DbConnect();

  const cutoff = new Date(Date.now() - CANCEL_AFTER_MINUTES * 60 * 1000);

  // Find all stale payment_pending orders
  const staleOrders = await Order.find({
    orderStatus:   "payment_pending",
    paymentStatus: "pending",
    createdAt:     { $lt: cutoff },
  }).lean();

  if (staleOrders.length === 0) {
    return NextResponse.json({ cancelled: 0, message: "No stale orders found" });
  }

  let cancelledCount = 0;

  for (const order of staleOrders) {
    try {
      // 1. Cancel the order
      await Order.updateOne(
        { _id: order._id },
        { orderStatus: "cancelled", paymentStatus: "failed" }
      );

      // 2. Mark payment as failed
      await Payment.updateOne(
        { orderId: order._id },
        { status: "failed", failureReason: "Payment timeout — auto cancelled" }
      );

      // 3. Restore stock for each item
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } }
        );
      }

      cancelledCount++;
      console.log(`[Cron] Auto-cancelled order ${order.orderNumber}`);
    } catch (err) {
      console.error(`[Cron] Failed to cancel order ${order._id}:`, err);
    }
  }

  return NextResponse.json({
    cancelled: cancelledCount,
    message:   `Cancelled ${cancelledCount} stale order(s)`,
  });
}