// models/categoryDefaults.js
import mongoose, { Schema } from "mongoose";

const CategoryDefaultsSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      unique: true, // one defaults doc per category
    },

    // Non-variable defaults — same shape as Product's non-variable fields
    brand: { type: String, default: "" },
    description: { type: String, default: "" },

    retailPrice: { type: Number, default: 0 },
    retailDiscountPrice: { type: Number, default: null },
    enterprisePrice: { type: Number, default: 0 },
    enterpriseDiscountPrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },

    thickness: { type: Number, default: null },
    size: { type: String, default: "" },

    sellBy: {
      type: String,
      enum: ["piece", "box", "roll"],
      default: "piece",
    },
    showPerSqFtPrice: { type: Boolean, default: false },
    perSqFtPriceRetail: { type: Number, default: null },
    perSqFtPriceEnterprise: { type: Number, default: null },

    material: { type: [String], default: [] },
    finish: { type: [String], default: [] },
    coverageArea: { type: String, default: "" },
    pattern: { type: [String], default: [] },

    application: [{ type: Schema.Types.ObjectId, ref: "Application" }],

    subType: {
      type: String,
      enum: ["self-adhesive", "non-adhesive", null],
      default: null,
    },

    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.CategoryDefaults ||
  mongoose.model("CategoryDefaults", CategoryDefaultsSchema);