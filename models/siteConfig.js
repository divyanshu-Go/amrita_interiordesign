// models/siteConfig.js
//
// Single-document model — the entire site config lives in ONE document.
// We always upsert it (findOneAndUpdate with upsert:true), never insert multiple.
// Same pattern as your inspiredCarousel model.

import mongoose, { Schema } from "mongoose";

const SiteConfigSchema = new Schema(
  {
    // ── Brand ─────────────────────────────────────────────────────────────
    companyName: { type: String, default: "Amrita" },
    tagline:     { type: String, default: "Interior & Design" },
    logoUrl:     { type: String, default: "" },

    // ── Contact info (used in Footer + ProductPageClient) ─────────────────
    email:   { type: String, default: "" },
    phone:   { type: String, default: "" },   // call button on product page
    whatsapp:{ type: String, default: "" },   // WhatsApp button on product page
    address: { type: String, default: "" },

    // ── Social links (used in Footer) ─────────────────────────────────────
    instagram: { type: String, default: "" },
    linkedin:  { type: String, default: "" },
    twitter:   { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig ||
  mongoose.model("SiteConfig", SiteConfigSchema);