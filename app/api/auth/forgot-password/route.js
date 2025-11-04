// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import Token from "@/models/token";
import { createRawToken, hashToken } from "@/lib/auth/resetToken";
import { sendResetPasswordEmail } from "@/lib/email/sendEmail";

const RESET_MINUTES = Number(process.env.RESET_TOKEN_EXPIRY_MINUTES || 60);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await DbConnect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // ❌ user doesn’t exist
      return NextResponse.json(
        { error: "This email is not registered. Please sign up first." },
        { status: 404 }
      );
    }

    // ✅ user exists → generate reset token
    const rawToken = createRawToken(32);
    const hashed = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_MINUTES * 60 * 1000);

    // Invalidate old tokens
    await Token.updateMany({ userId: user._id, type: "reset", used: false }, { used: true });

    // Save new token
    await Token.create({
      userId: user._id,
      token: hashed,
      type: "reset",
      expiresAt,
      used: false,
    });

    // Send reset link (best effort)
    try {
      await sendResetPasswordEmail(user, rawToken);
    } catch (err) {
      console.error("Error sending reset email:", err);
    }

    return NextResponse.json({
      message: "A password reset link has been sent to your email.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
