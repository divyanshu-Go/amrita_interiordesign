// models/patternVariant.js
import mongoose, { Schema } from "mongoose";

const PatternVariantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    hexCode: { type: String, trim: true }, // optional color hint for pattern
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.PatternVariant ||
  mongoose.model("PatternVariant", PatternVariantSchema);
