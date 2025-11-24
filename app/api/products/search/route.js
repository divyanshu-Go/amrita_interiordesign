import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

/**
 * Search products by query
 * GET /api/products/search?q=query
 */
export async function GET(req) {
  try {
    await DbConnect();

    const { searchParams } = new URL(req.url);
    const query = await searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    // Create case-insensitive regex pattern
    const searchPattern = new RegExp(query.trim(), "i");

    // Search in multiple fields
    const products = await Product.find({
      $or: [
        { name: searchPattern },
        { description: searchPattern },
        { brand: searchPattern },
        { sku: searchPattern },
        { tags: searchPattern },

        // 🔥 NEW SEARCHABLE FIELDS
        { material: searchPattern },
        { pattern: searchPattern },
        { finish: searchPattern },
        { coverageArea: searchPattern },
        { application: searchPattern }, // array match supported by Mongo
      ],
    }).populate("category");

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
