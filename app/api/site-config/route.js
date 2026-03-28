// app/api/site-config/route.js
//
// GET  — returns the site config document (consumed by getSiteConfig() via ISR fetch)
// PUT  — upserts the site config and revalidates the ISR cache tag

import { NextResponse }   from "next/server";
import { revalidateTag }  from "next/cache";
import DbConnect          from "@/lib/Db/DbConnect";
import SiteConfig         from "@/models/siteConfig";
import { DEFAULT_SITE_CONFIG } from "@/lib/fetchers/siteConfig";

// ── GET /api/site-config ──────────────────────────────────────────────────
export async function GET() {
  try {
    await DbConnect();

    const doc = await SiteConfig.findOne().lean();

    // Return defaults if no document exists yet so the site never breaks
    const config = doc ? JSON.parse(JSON.stringify(doc)) : DEFAULT_SITE_CONFIG;

    return NextResponse.json(config);
  } catch (err) {
    console.error("[site-config GET]", err);
    return NextResponse.json(DEFAULT_SITE_CONFIG, { status: 200 });
  }
}

// ── PUT /api/site-config ──────────────────────────────────────────────────
export async function PUT(req) {
  try {
    await DbConnect();

    const body = await req.json();

    // Strip any fields that aren't part of the schema (safety)
    const allowed = [
      "companyName", "tagline", "logoUrl",
      "email", "phone", "whatsapp", "address",
      "instagram", "linkedin", "twitter",
    ];

    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    // upsert:true  → creates the document if it doesn't exist yet
    // new:true     → returns the updated document
    const doc = await SiteConfig.findOneAndUpdate(
      {},           // match the single config document
      { $set: update },
      { upsert: true, new: true }
    ).lean();

    // Bust the ISR cache so Footer/ProductPage pick up changes within seconds
    revalidateTag("site-config");

    return NextResponse.json(JSON.parse(JSON.stringify(doc)));
  } catch (err) {
    console.error("[site-config PUT]", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}