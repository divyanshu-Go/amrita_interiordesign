// next-sitemap.config.js
//
// ── WHAT CHANGED & WHY ───────────────────────────────────────────────────
//
// PROBLEM: On 02/04/2026 Google read the sitemap and found ~61 URLs,
// many of which were test/dev entries (category/cache, product/testprop,
// product/divyanshuhsa, etc). Google flagged the sitemap as low-quality
// and stopped crawling real category and product pages entirely.
//
// FIXES APPLIED:
//
// 1. SLUG GUARD — any slug containing "test", "cache", "divyanshu",
//    or other dev patterns is excluded from the sitemap at generation time.
//    Even if a test document reappears in the DB during development,
//    it will never pollute the live sitemap again.
//
// 2. REMOVED CIRCULAR additionalSitemaps — robotsTxtOptions was pointing
//    to sitemap.xml inside sitemap.xml itself. Removed.
//
// 3. DYNAMIC lastmod FOR HOMEPAGE — was hardcoded to March 2026.
//    Now always uses the current build timestamp.
//
// 4. ADDED changefreq/priority COMMENTS — so future devs understand
//    why each route type has its priority value.
// ─────────────────────────────────────────────────────────────────────────

import DbConnect from "./lib/Db/DbConnect.js";
import mongoose from "mongoose";

// ── Slug guard ────────────────────────────────────────────────────────────
// Any slug matching one of these patterns is EXCLUDED from the sitemap.
// Pattern: partial string match (slug.includes(pattern)).
// Add more patterns here if you ever add new dev/test naming conventions.
const DEV_SLUG_PATTERNS = [
  "test",       // testprop, testtt, test0, testingprice, etc.
  "cache",      // category/cache
  "divyanshu",  // divyanshuhsa, /category/divyanshu
  "addingtest",
  "allpricest",
  "finaladd",
  "ddsx",
  "pvcsl",      // pvcSl01 — dev SKU test
];

function isDevSlug(slug) {
  if (!slug) return true; // no slug = exclude
  const lower = slug.toLowerCase();
  return DEV_SLUG_PATTERNS.some((pattern) => lower.includes(pattern));
}
// ─────────────────────────────────────────────────────────────────────────

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://www.interio97.in",
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // ── Pages Google should NEVER index ──────────────────────────────────────
  exclude: [
    "/admin",
    "/admin/*",
    "/login",
    "/login/*",
    "/signup",
    "/signup/*",
    "/forgot-password",
    "/reset-password",
    "/account",
    "/account/*",
    "/checkout",
    "/checkout/*",
    "/pay/*",
    "/orders/*",
    "/api/*",
  ],

  // ── Dynamic routes from DB ────────────────────────────────────────────────
  additionalPaths: async (config) => {
    const paths = [];

    try {
      await DbConnect();

      // ── Categories ────────────────────────────────────────────────────────
      // Priority 0.9 — these are the most important pages for organic ranking.
      // changefreq "daily" — product inventory changes frequently.
      const Category =
        mongoose.models.Category ||
        (await import("./models/category.js")).default;

      const categories = await Category.find({}, "slug updatedAt").lean();
      for (const c of categories) {
        if (!c.slug) continue;
        if (isDevSlug(c.slug)) continue; // ← GUARD: skip test categories

        paths.push({
          loc: `/category/${c.slug}`,
          lastmod: c.updatedAt
            ? new Date(c.updatedAt).toISOString()
            : new Date().toISOString(),
          changefreq: "daily",
          priority: 0.9,
        });
      }

      // ── Products ──────────────────────────────────────────────────────────
      // Priority 0.8 — important but secondary to category pages.
      // changefreq "weekly" — product details change less often than inventory.
      const Product =
        mongoose.models.Product ||
        (await import("./models/product.js")).default;

      const products = await Product.find({}, "slug updatedAt").lean();
      for (const p of products) {
        if (!p.slug) continue;
        if (isDevSlug(p.slug)) continue; // ← GUARD: skip test products

        paths.push({
          loc: `/product/${p.slug}`,
          lastmod: p.updatedAt
            ? new Date(p.updatedAt).toISOString()
            : new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.8,
        });
      }

      // ── Applications ──────────────────────────────────────────────────────
      // Priority 0.7 — supporting pages (bathroom, bedroom, kitchen use cases).
      const Application =
        mongoose.models.Application ||
        (await import("./models/application.js")).default;

      const applications = await Application.find({}, "slug updatedAt").lean();
      for (const a of applications) {
        if (!a.slug) continue;
        if (isDevSlug(a.slug)) continue;

        paths.push({
          loc: `/applications/${a.slug}`,
          lastmod: a.updatedAt
            ? new Date(a.updatedAt).toISOString()
            : new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.7,
        });
      }
    } catch (err) {
      console.error("[next-sitemap] DB fetch error:", err.message);
    }

    return paths;
  },

  // ── robots.txt rules ──────────────────────────────────────────────────────
  // NOTE: additionalSitemaps is intentionally REMOVED.
  // The old config listed sitemap.xml inside sitemap.xml itself (circular).
  // next-sitemap already adds the sitemap URL to robots.txt automatically —
  // no need to add it manually here.
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/account",
          "/checkout",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/pay/",
          "/orders/",
        ],
      },
    ],
  },
};

export default config;