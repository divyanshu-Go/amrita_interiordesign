// next-sitemap.config.js
import DbConnect from "./lib/Db/DbConnect.js";
import mongoose from "mongoose";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://www.interio97.in",
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // ── Pages Google should NEVER index ──────────────────────────────────────
  // Admin, auth, account, checkout — none of these should appear in search.
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

  // ── Dynamic routes from DB (products, categories, applications) ──────────
  // next-sitemap cannot auto-discover DB-driven routes — we must fetch them.
  additionalPaths: async (config) => {
    const paths = [];

    try {
      await DbConnect();

      // ── Products ──
      const Product = mongoose.models.Product ||
        (await import("./models/product.js")).default;

      const products = await Product.find({}, "slug updatedAt").lean();
      for (const p of products) {
        if (!p.slug) continue;
        paths.push({
          loc: `/product/${p.slug}`,
          lastmod: p.updatedAt
            ? new Date(p.updatedAt).toISOString()
            : new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.8,
        });
      }

      // ── Categories ──
      const Category = mongoose.models.Category ||
        (await import("./models/category.js")).default;

      const categories = await Category.find({}, "slug updatedAt").lean();
      for (const c of categories) {
        if (!c.slug) continue;
        paths.push({
          loc: `/category/${c.slug}`,
          lastmod: c.updatedAt
            ? new Date(c.updatedAt).toISOString()
            : new Date().toISOString(),
          changefreq: "daily",
          priority: 0.9,
        });
      }

      // ── Applications ──
      const Application = mongoose.models.Application ||
        (await import("./models/application.js")).default;

      const applications = await Application.find({}, "slug updatedAt").lean();
      for (const a of applications) {
        if (!a.slug) continue;
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

  // ── robots.txt rules ─────────────────────────────────────────────────────
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
    additionalSitemaps: [
      "https://www.interio97.in/sitemap.xml",
    ],
  },
};

export default config;