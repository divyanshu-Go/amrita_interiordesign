// app/api/category-defaults/[categoryId]/route.js
import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import CategoryDefaults from "@/models/categoryDefaults";

export async function GET(req, { params }) {
  try {
    await DbConnect();
    const { categoryId } = params;

    const defaults = await CategoryDefaults.findOne({ category: categoryId }).lean();

    // No defaults saved yet for this category — return null, form will use schema fallbacks
    return NextResponse.json({ success: true, data: defaults || null });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await DbConnect();
    const { categoryId } = params;
    const body = await req.json();

    const defaults = await CategoryDefaults.findOneAndUpdate(
      { category: categoryId },
      { ...body, category: categoryId },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: defaults });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}