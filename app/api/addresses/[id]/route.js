// api/addresses/[id]/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import Address from "@/models/address";

export async function PUT(req, { params }) {
  try {
    const authCookie = req.cookies.get("auth_token");
    if (!authCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(authCookie.value);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await DbConnect();

    // If setting as default, unset old default
    if (body.isDefault === true) {
      await Address.updateMany(
        { userId: payload.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: params.id, userId: payload.user._id },
      body,
      { new: true }
    );

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Address update error:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const authCookie = req.cookies.get("auth_token");
    if (!authCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(authCookie.value);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await DbConnect();

    const address = await Address.findOneAndDelete({
      _id: params.id,
      userId: payload.user._id,
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
