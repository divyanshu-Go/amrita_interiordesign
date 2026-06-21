// app/api/products/by-ids/route.js
// Lightweight endpoint to hydrate guest cart product data.
// No auth required — only returns public product fields.

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json({ products: [] });
    }

    const idList = ids.split(",").filter(Boolean).slice(0, 50); // safety cap

    await DbConnect();

    const products = await Product.find(
      { _id: { $in: idList } },
      // Only the fields CartView needs — nothing sensitive
      {
        _id: 1,
        name: 1,
        slug: 1,
        images: 1,
        stock: 1,
        sellBy: 1,
        retailPrice: 1,
        retailDiscountPrice: 1,
        enterprisePrice: 1,
        enterpriseDiscountPrice: 1,
        showPerSqFtPrice: 1,
        perSqFtPriceRetail: 1,
        perSqFtPriceEnterprise: 1,
      }
    ).lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("by-ids error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}