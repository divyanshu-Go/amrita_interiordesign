//  app/api/products/[slug]/route.js

import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import Product from "@/models/product";

// ✅ GET Single Product + Variants
export async function GET(req, { params }) {
  try {
    await DbConnect();
    const { slug } = params;
    const product = await Product.findOne({ slug }).populate("category");

    if (!product)
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    let variants = [];
    if (product.variantGroupId) {
      variants = await Product.find({
        variantGroupId: product.variantGroupId,
        _id: { $ne: product._id },
      });
    }
    // fetch all products with same colorVariant
let colorVariants = [];
if (product.colorVariant) {
  colorVariants = await Product.find({
    colorVariant: product.colorVariant,
    _id: { $ne: product._id },
  });
}
// fetch all products with same patternVariant
let patternVariants = [];
if (product.patternVariant) {
  patternVariants = await Product.find({
    patternVariant: product.patternVariant,
    _id: { $ne: product._id },
  });
}



    return NextResponse.json({ success: true, data: { product, variants, colorVariants, patternVariants } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE Product
export async function PUT(req, { params }) {
  try {
    await DbConnect();
    const { slug } = params;
    const updates = await req.json();

    const product = await Product.findOneAndUpdate({ slug }, updates, { new: true });
    if (!product)
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ DELETE Product
export async function DELETE(req, { params }) {
  try {
    await DbConnect();
    const { slug } = params;

    const product = await Product.findOneAndDelete({ slug });
    if (!product)
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
