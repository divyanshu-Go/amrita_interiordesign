// app/api/auth/validate-reset-token/route.js
import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Token from "@/models/token";
import User from "@/models/user";
import { hashToken } from "@/lib/auth/resetToken";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email") || null;
    if (!token) return NextResponse.json({ valid: false, reason: "no-token" });

    await DbConnect();
    const hashed = hashToken(token);

    const tokenDoc = await Token.findOne({
      token: hashed,
      type: "reset",
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) return NextResponse.json({ valid: false, reason: "invalid-or-expired" });

    if (email) {
      const user = await User.findById(tokenDoc.userId);
      if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ valid: false, reason: "email-mismatch" });
      }
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error("validate-reset-token error:", err);
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}
