// app/api/color-variants/[id]/products/route.js
import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

export async function GET(req, { params }) {
  try {
    await DbConnect();
    const { id } = params; // colorVariant value

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Color variant ID is required" },
        { status: 400 }
      );
    }

    const products = await Product.find({ colorVariant: id });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
