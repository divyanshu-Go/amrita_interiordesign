import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  return NextResponse.next();
}
