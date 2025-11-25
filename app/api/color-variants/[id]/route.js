import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import ColorVariant from "@/models/colorVariant";

export async function GET(req, { params }) {
  try {
    await DbConnect();
    const item = await ColorVariant.findById(params.id);
    if (!item)
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await DbConnect();
    const updates = await req.json();
    const updated = await ColorVariant.findByIdAndUpdate(params.id, updates, { new: true });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await DbConnect();

    // Remove variant reference from products
    await Product.updateMany(
      { colorVariant: params.id },
      { $set: { colorVariant: null } }
    );

    await ColorVariant.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
