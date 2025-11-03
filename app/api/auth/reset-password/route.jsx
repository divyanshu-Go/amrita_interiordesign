// app/api/auth/reset-password/route.js
import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Token from "@/models/token";
import User from "@/models/user";
import { hashToken } from "@/lib/auth/resetToken";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req) {
  try {
    const { token, email, newPassword } = await req.json();
    
    console.log("[VALIDATE] token param:", token);


    if (!token || !newPassword) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await DbConnect();

    const hashed = hashToken(token);

    console.log("[VALIDATE] hashed from param:", hashed);

    const tokenDoc = await Token.findOne({
      token: hashed,
      type: "reset",
      used: false,
      expiresAt: { $gt: new Date() },
    });

    console.log("[VALIDATE] token found:", !!tokenDoc, tokenDoc?.expiresAt);


    if (!tokenDoc) {
      return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
    }

    // Optional: verify email matches token's user (if email was provided)
    if (email) {
      const user = await User.findById(tokenDoc.userId);
      if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json({ error: "Email does not match token." }, { status: 400 });
      }
    }

    // update password
    const newHash = await hashPassword(newPassword);
    await User.updateOne({ _id: tokenDoc.userId }, { $set: { password: newHash } });

    // mark token used
    tokenDoc.used = true;
    await tokenDoc.save();

    // optional: invalidate sessions - if you have a Sessions model
    try {
      // import Session model if exists and delete sessions for user
      // const Session = (await import('@/models/Session')).default;
      // await Session.deleteMany({ userId: tokenDoc.userId });
    } catch (err) {
      // ignore if no session model present
    }

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
