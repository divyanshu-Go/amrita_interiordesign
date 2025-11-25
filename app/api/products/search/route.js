import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";
import Category from "@/models/category";

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

    const searchPattern = new RegExp(query.trim(), "i");

    // 🔥 Step 1 — Find categories matching search
    const matchingCategories = await Category.find(
      { name: searchPattern },
      { _id: 1 }
    );

    const categoryIds = matchingCategories.map((c) => c._id);

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
        categoryIds.length > 0 ? { category: { $in: categoryIds } } : null,
      ].filter(Boolean),
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
