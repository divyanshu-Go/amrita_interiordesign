import mongoose, { Schema } from "mongoose";

/**
 * Product Schema
 * Represents each sellable item or variant.
 * Each variant (e.g., different color or size) is its own product document.
 * All variants of the same product family share the same `variantGroupId`.
 */

const ProductSchema = new Schema(
  {
    // 🏷️ Basic Info
    name: { type: String, required: true }, // e.g., "HDF RealWood Floor - Oak Brown"
    slug: { type: String, unique: true, required: true }, // URL identifier, e.g. "realwood-oak-brown-8mm"
    sku: { type: String, unique: true }, // Stock Keeping Unit (unique inventory code)

    // 📦 Category Reference
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // e.g., "Wooden Flooring"

    // 🧾 Description & Brand
    description: String,
    brand: String,

    // 🖼️ Media
    images: [String], // Array of image URLs

    // 💰 Pricing
    retailPrice: { type: Number, required: true },
    retailDiscountPrice: Number, // Optional discounted price
    enterprisePrice: { type: Number, required: true },
    enterpriseDiscountPrice: Number, // Optional discounted price
    stock: { type: Number, default: 0 }, // Available stock count

    // 🎨 Attributes (for filters)
    color: String, // e.g., "Brown", "Grey"
    thickness: Number, // e.g., 8 (in mm)
    size: String, // e.g., "48x8 inch" or "1217x196 mm"

    // 🔗 Variant Group
    variantGroupId: { type: String, index: true }, 
    /**
     * All variants that belong to the same product family share this ID.
     * Example:
     * - "realwood-oak-brown-8mm"
     * - "realwood-oak-grey-8mm"
     * Both will have variantGroupId: "RW12345"
     * 
     * This allows fetching all variants on a product page easily:
     * Product.find({ variantGroupId: currentProduct.variantGroupId })
     */

    // 🏷️ Tags & Highlights
    tags: [String], // Used for filters, search keywords (e.g., "laminate", "AC4 grade")
    isFeatured: { type: Boolean, default: false }, // For homepage or promotions
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
