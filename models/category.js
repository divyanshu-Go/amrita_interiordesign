// models/category
import mongoose, { Schema } from "mongoose";

/**
 * Category Schema
 * Represents a product category like "Wooden Flooring", "Tiles", "Wallpaper", etc.
 * Each category will have its own page: /wooden-flooring
 */
const CategorySchema = new Schema(
  {
    name: { type: String, required: true }, // Display name
    slug: { type: String, unique: true, required: true }, // Used in URL (e.g., /wooden-flooring)
    description: String, // Optional category description
    image: String, // Banner or thumbnail for category
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
