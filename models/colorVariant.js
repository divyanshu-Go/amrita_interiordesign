// models/colorVariant.js
import mongoose, { Schema } from "mongoose";

const ColorVariantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    hexCode: { type: String, trim: true }, // e.g. "#5B4234"
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.ColorVariant ||
  mongoose.model("ColorVariant", ColorVariantSchema);
