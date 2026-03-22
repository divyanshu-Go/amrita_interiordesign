// middleware.js
//
// ── WHAT THIS DOES ────────────────────────────────────────────────────────
//
// Runs on EVERY request before the page renders (Vercel Edge Network).
// Three jobs:
//
//  1. ROUTE PROTECTION
//     • /admin/* → admin role only → else redirect to /login/admin
//     • /account, /checkout, /pay/*, /orders/* → logged in only → else /login
//     • /login, /signup → already logged in → redirect to /account
//
//  2. USER CONTEXT INJECTION
//     Decodes the JWT and forwards user info (id, role, name) as
//     request headers (x-user-id, x-user-role, x-user-name).
//     Server components and API routes can read these headers instead
//     of re-verifying the token on every request.
//
//  3. SEO PROTECTION
//     Adds X-Robots-Tag: noindex on pages that should never appear in
//     Google (admin, auth, account, checkout, orders, pay).
//     Safety net on top of sitemap excludes.
//
// EDGE RUNTIME: no Node.js APIs, no mongoose, no DB.
// JWT verification uses jose (edge-compatible, already in your deps).
//
// ─────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { jwtVerify }   from "jose";

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

  // 1. Decode JWT if present
  const tokenCookie = request.cookies.get(TOKEN_COOKIE);
  const user = tokenCookie?.value
    ? await verifyJWT(tokenCookie.value)
    : null;

  // 2. Admin gate
  if (ADMIN_REQUIRED.some((p) => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Auth gate (any logged-in user)
  const needsAuth =
    AUTH_REQUIRED.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/pay/") ||
    pathname.startsWith("/orders/");

  if (needsAuth && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Guest-only gate
  if (GUEST_ONLY.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // 5. Forward decoded user to server components via request headers
  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set("x-user-id",   user._id  ?? "");
    requestHeaders.set("x-user-role", user.role ?? "user");
    requestHeaders.set("x-user-name", user.name ?? "");
  } else {
    requestHeaders.delete("x-user-id");
    requestHeaders.delete("x-user-role");
    requestHeaders.delete("x-user-name");
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 6. SEO: noindex private pages
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