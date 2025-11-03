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
      return NextResponse.json({ message: "If an account exists, a reset email will be sent." });
    }

    await DbConnect();

     console.log("[forgot-password] handler called");

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      // generate token
      const rawToken = createRawToken(32);
      const hashed = hashToken(rawToken);  
      const expiresAt = new Date(Date.now() + RESET_MINUTES * 60 * 1000);

      // Optionally: invalidate previous reset tokens for this user
      await Token.updateMany({ userId: user._id, type: "reset", used: false }, { used: true }).catch(() => {});

      // Save hashed token
      const tokenDoc = await Token.create({
        userId: user._id,
        token: hashed,
        type: "reset",
        expiresAt,
        used: false,
      });



      // Send email (fire and forget)
      try {
        await sendResetPasswordEmail(user, rawToken);
      } catch (err) {
        console.error("Error sending reset email:", err);
        // do not fail the whole request — still return neutral message
      }
    }

    // Neutral response
    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." }, { status: 200 });
  }
}
