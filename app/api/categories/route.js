// app/api/categories/route.js

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Category from "@/models/category";

// ✅ Create a new category
export async function POST(req) {
  try {
    await DbConnect();
    const body = await req.json();
    const category = await Category.create(body);
    return NextResponse.json({success:true, data:category}, { status: 201 });
  } catch (error) {
    return NextResponse.json({success:false, error: error.message }, { status: 500 });
  }
}

// ✅ Get all categories
export async function GET() {
  try {
    await DbConnect();
    const categories = await Category.find();
    return NextResponse.json({success:true, data:categories});
  } catch (error) {
    return NextResponse.json({success:false, error: error.message }, { status: 500 });
  }
}

