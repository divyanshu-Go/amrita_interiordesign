import { NextResponse } from "next/server";
import DbConnect from "@/lib/Db/DbConnect";
import ColorVariant from "@/models/colorVariant";

export async function GET() {
  try {
    await DbConnect();
    const list = await ColorVariant.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: list });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await DbConnect();
    const body = await req.json();
    const created = await ColorVariant.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
