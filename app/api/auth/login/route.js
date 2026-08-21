// app/api/auth/login/route.js

import { setAuthCookie } from "@/lib/auth/cookies";
import { verifyPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, role, guestItems } = await req.json();
    await DbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔹 Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔹 Check if selected login role matches user’s actual DB role
    const dbRole = user.role.startsWith("enterprise")
      ? "enterprise"
      : user.role;

    if (role !== dbRole) {
      return NextResponse.json(
        { error: `Invalid role selected for this account. Please log in as ${dbRole}.` },
        { status: 403 }
      );
    }

    // 🔹 Handle enterprise verification flow
    if (dbRole === "enterprise") {
      const status = user.enterpriseProfile?.status;

      if (status === "pending") {
        return NextResponse.json(
          {
            error:
              "Your enterprise account is pending admin verification. You’ll be notified once approved.",
          },
          { status: 403 }
        );
      }

      if (status === "rejected") {
        return NextResponse.json(
          {
            error:
              "Your enterprise registration was rejected. Please contact admin for clarification.",
          },
          { status: 403 }
        );
      }
    }

    // 🔹 Merge Guest Cart into DB Cart if guestItems exist
    if (Array.isArray(guestItems) && guestItems.length > 0) {
      try {
        const productIds = guestItems.map((i) => i.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(products.map((p) => [p._id.toString(), p]));

        const validItems = guestItems
          .map((gItem) => {
            const product = productMap.get(gItem.productId);
            if (!product || product.stock < 1) return null;
            return {
              productId: product._id,
              quantity: Math.min(gItem.quantity, product.stock),
              sellBy: product.sellBy,
            };
          })
          .filter(Boolean);

        if (validItems.length > 0) {
          await Cart.findOneAndUpdate(
            { userId: user._id },
            { $set: { items: validItems } },
            { upsert: true, new: true }
          );
        }
      } catch (cartErr) {
        console.error("Guest cart merge error during login:", cartErr);
        // Non-blocking: continue login even if merge fails
      }
    }

    // 🔹 Everything valid → generate session token
    const token = await generateToken(user);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: dbRole,
          enterpriseStatus:
            dbRole === "enterprise"
              ? user.enterpriseProfile?.status
              : undefined,
        },
      },
      { status: 200 }
    );

    response.cookies.set(setAuthCookie(token));
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}