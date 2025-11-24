//  app/api/products/route.js

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

// ✅ Create a new product
export async function POST(req) {
  try {
    await DbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({success:true, data:product}, { status: 201 });
  } catch (error) {
    return NextResponse.json({success:false, error: error.message }, { status: 500 });
  }
}

// ✅ Get all products (with filters)
export async function GET(req) {
  try {
    await DbConnect();
    const { searchParams } = new URL(req.url);

    const query = {};
    if (searchParams.get("category")) query.category = searchParams.get("category");
    if (searchParams.get("color")) query.color = searchParams.get("color");
    if (searchParams.get("size")) query.size = searchParams.get("size");
    if (searchParams.get("thickness")) query.Thickness = searchParams.get("thickness");
    // New Filters
    if (searchParams.get("material")) {query.material = searchParams.get("material")};
    if (searchParams.get("pattern")) {query.pattern = searchParams.get("pattern")};
    if (searchParams.get("finish")) {query.finish = searchParams.get("finish")};

    // Filter products if application includes given value
    if (searchParams.get("application")) {
      query.application = searchParams.get("application"); // simple "contains"
    }

    // Optional price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).populate("category");
    return NextResponse.json({success:true, data:products});
  } catch (error) {
    return NextResponse.json({success:false, error: error.message }, { status: 500 });
  }
}
