// app/api/orders/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import Order from "@/models/order";

export async function GET(req) {
  try {
    const authCookie = req.cookies.get("auth_token");
    if (!authCookie)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyToken(authCookie.value);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await DbConnect();

    const orders = await Order.find({ userId: payload.user._id })
      .sort({ createdAt: -1 })
      .select(
        // existing fields
        "orderNumber totals orderStatus paymentStatus paymentMethod createdAt " +
        // added: just what the card needs — snapshot name + image, qty, sellBy, line total
        "items.productSnapshot.name items.productSnapshot.image items.quantity items.sellBy items.pricingSnapshot.lineFinalTotal " +
        // added: city for the delivery line on the card
        "addressSnapshot.city"
      )
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}