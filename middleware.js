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
//     Server components and API routes read these headers instead
//     of re-verifying the token on every request.
//
//  3. SEO PROTECTION
//     Adds X-Robots-Tag: noindex on pages that should never appear in
//     Google (admin, auth, account, checkout, orders, pay).
//
// EDGE RUNTIME: no Node.js APIs, no mongoose, no DB.
// JWT verification uses jose (edge-compatible).
//
// NOTE: this file no longer special-cases Next.js Server Actions
// (the old "next-action" header check). That check existed only to
// protect Server Actions running on protected routes (/account,
// /checkout, /pay/*, /orders/*) from being redirected mid-action. Since
// no Server Actions run on those routes, the check was unused complexity
// and has been removed. If you ever add a "use server" function to a
// page under those paths, revisit this — a redirect mid-action can break
// the action's response format.
// ─────────────────────────────────────────────────────────────────────────

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

  // 4. Forward decoded user to server components via request headers.
  // THIS is where x-user-role comes from — set here, once, per request,
  // right after JWT verification above. Pages just read it via headers(),
  // no re-verification needed.
  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set("x-user-id", user._id ?? "");
    requestHeaders.set("x-user-role", user.role ?? "user");
    requestHeaders.set("x-user-name", user.name ?? "");
    // Not added yet — uncomment once the JWT payload includes
    // enterpriseStatus (see project notes on NewProductCard.jsx):
    // requestHeaders.set("x-user-enterprise-status", user.enterpriseStatus ?? "unverified");
  } else {
    requestHeaders.delete("x-user-id");
    requestHeaders.delete("x-user-role");
    requestHeaders.delete("x-user-name");
    // requestHeaders.delete("x-user-enterprise-status");
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