// api/auth/signup/route.js

import { setAuthCookie } from "@/lib/auth/cookies";
import { hashPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, businessName, gstNumber, phone, guestItems } = body;

    await DbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    let userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    };

    // Handle enterprise signup fields
    if (role === "enterprise") {
      if (!businessName) {
        return NextResponse.json(
          { error: "Business name is required for enterprise registration" },
          { status: 400 }
        );
      }

      userData.enterpriseProfile = {
        businessName,
        gstNumber: gstNumber || "",
        phone: phone || "",
        status: "pending",
      };
    }

    const user = await User.create(userData);

    // 🔹 Merge Guest Cart into DB Cart for regular user signups
    if (role !== "enterprise" && Array.isArray(guestItems) && guestItems.length > 0) {
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
        console.error("Guest cart merge error during signup:", cartErr);
        // Non-blocking: allow signup completion even if cart merge fails
      }
    }

    const token = await generateToken(user);

    const response = NextResponse.json(
      {
        message:
          role === "enterprise"
            ? "Enterprise registration submitted for verification."
            : "User created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          enterpriseStatus: user.enterpriseProfile?.status || "unverified",
        },
      },
      { status: 201 }
    );

    response.cookies.set(setAuthCookie(token));

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}