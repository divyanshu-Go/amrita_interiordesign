// models/product.js
//
// ── WHAT CHANGED & WHY ────────────────────────────────────────────────────
// Added compound and single-field indexes on the most queried fields.
//
// BEFORE — missing indexes caused full collection scans on:
//   • Product.find({ isPopular: true })        → getPopularProducts()
//   • Product.find({ category: id })           → getCategoryBySlug() — CRITICAL
//   • Product.find({ colorVariant: id })       → getRelatedByCollection()
//   • Product.find({ patternVariant: id })     → getRelatedByCollection()
//   • Category.find({ isTrending: true })      → getTrendingCategories()
//
// A full collection scan means MongoDB reads EVERY document to find matches.
// With 1,000 products: fine. With 10,000: slow. With 100,000: broken.
// Indexes make these queries O(log n) instead of O(n).
//
// WHY THIS MATTERS FOR SEO:
//   With ISR (revalidate=1800), pages rebuild every 30 min.
//   A slow build = Vercel times out = stale pages served to Google.
//   Fast queries = fast builds = Google always gets fresh content.
// ─────────────────────────────────────────────────────────────────────────

import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name:  { type: String, required: true },
    slug:  { type: String, unique: true, required: true }, // auto-indexed by unique:true
    sku:   { type: String, unique: true },

    category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],

    description: String,
    brand:       String,
    images:      [String],

    retailPrice:              { type: Number, required: true },
    retailDiscountPrice:      Number,
    enterprisePrice:          { type: Number, required: true },
    enterpriseDiscountPrice:  Number,
    stock:                    { type: Number, default: 0 },

    color:     String,
    thickness: Number,
    size:      String,

    variantGroupId: { type: String, index: true }, // already indexed ✓

    colorVariant: {
      type: Schema.Types.ObjectId,
      ref: "ColorVariant",
      default: null,
      index: true, // ← ADDED: getRelatedByCollection() queries this
    },
    patternVariant: {
      type: Schema.Types.ObjectId,
      ref: "PatternVariant",
      default: null,
      index: true, // ← ADDED: getRelatedByCollection() queries this
    },

    tags:       [String],
    isFeatured: { type: Boolean, default: false },
    isPopular:  { type: Boolean, default: false, index: true }, // ← ADDED: getPopularProducts()

    sellBy: {
      type:    String,
      enum:    ["piece", "box", "roll"],
      default: "piece",
    },

    showPerSqFtPrice:       { type: Boolean, default: false },
    perSqFtPriceRetail:     { type: Number, default: null },
    perSqFtPriceEnterprise: { type: Number, default: null },

    material:    [String],
    pattern:     [String],
    finish:      [String],

    application: [{ type: Schema.Types.ObjectId, ref: "Application" }],

    coverageArea: String,
  },
  { timestamps: true }
);

// ── Compound index for category page queries ──────────────────────────────
// getCategoryBySlug() does: Product.find({ category: id })
// This is the most common query on the site — every category page triggers it.
// A dedicated index makes it fast regardless of collection size.
ProductSchema.index({ category: 1 });

// ── Compound index for related products queries ───────────────────────────
// getRelatedByCollection() queries colorVariant OR patternVariant.
// Single-field indexes on each (added above inline) cover these.
// This compound index additionally speeds up queries that filter by
// both fields simultaneously if you add that in future.
ProductSchema.index({ colorVariant: 1, patternVariant: 1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);