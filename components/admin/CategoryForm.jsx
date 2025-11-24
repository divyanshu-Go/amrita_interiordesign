import mongoose, { Schema } from "mongoose";

/**
 * Product Schema - UPDATED VERSION
 * Represents each sellable item or variant.
 * Each variant (e.g., different color or size) is its own product document.
 * All variants of the same product family share the same `variantGroupId`.
 */

const ProductSchema = new Schema(
  {
    // 🏷️ Basic Info
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    sku: { type: String, unique: true },

    // 📦 Category Reference - NOW SUPPORTS MULTIPLE CATEGORIES
    category: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Category",
      required: true 
    }],
    // Note: Changed from single ObjectId to array of ObjectIds, but kept the name 'category'

    // 🧾 Description & Brand
    description: String,
    brand: String,

    // 🖼️ Media
    images: [String],

    // 💰 Pricing
    retailPrice: { type: Number, required: true },
    retailDiscountPrice: Number,
    enterprisePrice: { type: Number, required: true },
    enterpriseDiscountPrice: Number,
    stock: { type: Number, default: 0 },

    // 💵 NEW: Sell By & Per Sq Ft Pricing
    sellBy: { 
      type: String, 
      enum: ["Box", "Roll", "Piece"],
      default: "Piece"
    },
    showPerSqFtPrice: { 
      type: Boolean, 
      default: false 
    },
    perSqFtPrice: {
      type: Number,
      // MRP per square foot - shown prominently when showPerSqFtPrice is true
    },
    // Note: When showPerSqFtPrice is true:
    // - Display perSqFtPrice prominently (main price)
    // - Show retailPrice/enterprisePrice on right side (lighter/smaller)
    // When showPerSqFtPrice is false:
    // - Display retailPrice/enterprisePrice as main price (normal behavior)

    // 🎨 Attributes (for filters)
    color: String,
    thickness: Number,
    size: String,

    // 🆕 NEW ATTRIBUTES
    material: String, // e.g., "HDF", "Vinyl", "Laminate"
    pattern: String, // e.g., "Wood Grain", "Marble", "Geometric"
    finish: String, // e.g., "Matte", "Glossy", "Textured"
    coverageArea: String, // e.g., "2.5 sq m per box", "10 sq ft per roll"
    application: [String], // e.g., ["Bedroom", "Living Room", "Kitchen"]

    // 🔗 Variant Groups
    variantGroupId: { type: String, index: true },
    /**
     * All variants that belong to the same product family share this ID.
     * Example: Different colors of the same flooring product
     */

    // 🆕 Pattern Group ID - for pattern variants
    patternGroupId: { type: String, index: true },
    /**
     * Groups products by pattern variants
     * Example: Same material/color but different patterns
     * - "oak-wood-straight-grain"
     * - "oak-wood-herringbone"
     * Both will have patternGroupId: "OAK-WOOD-PATTERNS"
     */

    // 🏷️ Tags & Highlights
    tags: [String],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ material: 1 });
ProductSchema.index({ pattern: 1 });
ProductSchema.index({ finish: 1 });
ProductSchema.index({ application: 1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);