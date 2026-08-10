// models/product.js

import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name:  { type: String, required: true },
    slug:  { type: String, unique: true, required: true },
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

    color:     [String],
    thickness: Number,
    size:      String,

    colorVariant: {
      type: Schema.Types.ObjectId,
      ref: "ColorVariant",
      default: null,
      index: true,
    },
    patternVariant: {
      type: Schema.Types.ObjectId,
      ref: "PatternVariant",
      default: null,
      index: true,
    },

    tags:       [String],
    isFeatured: { type: Boolean, default: false },
    isPopular:  { type: Boolean, default: false, index: true },

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

    subType: {
      type: String,
      enum: ["self-adhesive", "non-adhesive"],
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ colorVariant: 1, patternVariant: 1 });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);