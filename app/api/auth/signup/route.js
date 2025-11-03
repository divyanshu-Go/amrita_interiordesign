// api/auth/signup/route.js
import { setAuthCookie } from "@/lib/auth/cookies";
import { hashPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, businessName, gstNumber, phone } = body;


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

    // if enterprise signup
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

    const token = await generateToken(user);

    const response = NextResponse.json(
      {
        message:
          role === "enterprise"
            ? "Enterprise registration submitted for verification."
            : "User created successfully.",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          status: user.enterpriseProfile?.status || null,
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
