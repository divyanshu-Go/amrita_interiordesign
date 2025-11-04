// app/api/categories/[slug]/route.js

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";
import Product from "@/models/product";

// ✅ GET Single Category + Products
export async function GET(req, { params }) {
  try {
    await DbConnect();
    const { slug } = params;
    const category = await Category.findOne({ slug });
    if (!category)
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });

    const products = await Product.find({ category: category._id });
    return NextResponse.json({ success: true, data: { category, products } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE Category
export async function PUT(req, { params }) {
  try {
    await DbConnect();
    const { slug } = params;
    const updates = await req.json();

    const category = await Category.findOneAndUpdate({ slug }, updates, { new: true });
    if (!category)
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Category updated", data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ DELETE Category
export async function DELETE(req, { params }) {
  try {
    await DbConnect();
    const { slug } = params;

    const category = await Category.findOneAndDelete({ slug });
    if (!category)
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

