import mongoose, { Schema } from "mongoose";
import Category from "./category.js";
import ColorVariant from "./colorVariant.js";
import PatternVariant from "./patternVariant.js";
/**
 * Product Schema
 * Represents each sellable item or variant.
 */

const ProductSchema = new Schema(
  {
    // 🏷️ Basic Info
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    sku: { type: String, unique: true },

    // 📦 Category (keep as-is)
    category: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true }
    ],

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

    // 🎨 Existing Attributes
    color: String,
    thickness: Number,
    size: String,

    // 🔗 Variant Group
    variantGroupId: { type: String, index: true },
    // 🆕 NEW FIELDS REQUESTED (variants)
    // -----------------------------------------------------
    colorVariant: {
      type: Schema.Types.ObjectId,
      ref: "ColorVariant",
      default: null,
    },
    patternVariant: {
      type: Schema.Types.ObjectId,
      ref: "PatternVariant",
      default: null,
    },

    // 🏷️ Tags
    tags: [String],
    isFeatured: { type: Boolean, default: false },

    // -----------------------------------------------------
    // 🆕 NEW FIELDS REQUESTED
    // -----------------------------------------------------

    // 1. Sell unit
    sellBy: {
      type: String,
      enum: ["piece", "box", "roll"],
      default: "piece",
    },

    // 2. Whether to show Per Sq Ft Price
    showPerSqFtPrice: { type: Boolean, default: false },

    // 3. Per Sq Ft Price (manual value)
    perSqFtPrice: { type: Number, default: null },

    material: [String],     // array of strings
    pattern: [String],      // array of strings
    finish: [String],       // array of strings
    application: [String],  // already array – keep same


    // 7. Coverage Area
    coverageArea: String,

  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
