// middleware.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE = "auth_token";

// Must be logged in (any role)
const AUTH_REQUIRED = ["/account", "/checkout"];

// Must be role === "admin"
const ADMIN_REQUIRED = ["/admin"];

// Logged-in users don't need these pages
const GUEST_ONLY = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// These paths get X-Robots-Tag: noindex
const NOINDEX_PREFIXES = [
  "/admin",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/account",
  "/checkout",
  "/pay",
  "/orders",
  "/api",
];

// ── JWT helper (edge-safe) ────────────────────────────────────────────────

async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload?.user ?? null;
  } catch {
    return null; // expired or invalid
  }
}

// ── Middleware ────────────────────────────────────────────────────────────

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const tokenCookie = request.cookies.get(TOKEN_COOKIE);
  const user = tokenCookie?.value ? await verifyJWT(tokenCookie.value) : null;

  // 1. Admin gate
  if (ADMIN_REQUIRED.some((p) => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. Auth gate (any logged-in user)
  const needsAuth =
    AUTH_REQUIRED.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/pay/") ||
    pathname.startsWith("/orders/");

  if (needsAuth && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Guest-only gate
  if (GUEST_ONLY.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // 4. Forward structured user to server components via single URI-encoded JSON header
  const requestHeaders = new Headers(request.headers);
  if (user) {
    const userPayload = {
      id: user.id || user._id || "",
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      enterpriseStatus: user.enterpriseStatus || "unverified",
    };

    requestHeaders.set("x-user", encodeURIComponent(JSON.stringify(userPayload)));
  } else {
    requestHeaders.delete("x-user");
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 5. SEO: noindex private pages
  if (NOINDEX_PREFIXES.some((p) => pathname.startsWith(p))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)).*)",
  ],
};