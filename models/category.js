// models/category.js
import mongoose, { Schema } from "mongoose";

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    image: String,
    isTrending: { type: Boolean, default: false },
    trendingTagline: { type: String, default: "" },

    // ── SEO fields ──────────────────────────────────────────────────────
    // seoIntro: rendered server-side above the product grid.
    // Google reads this. Keep it 100-200 words, mention Delhi NCR + product type.
    seoIntro: { type: String, default: "" },

    // buyingGuide: rendered server-side in the SEO footer below the grid.
    // Targets informational queries ("how to choose PVC panels", etc.)
    buyingGuide: { type: String, default: "" },

    // faqs: rendered as both visible HTML and FAQ JSON-LD schema.
    // 5-7 Q&As per category, targeting Delhi NCR long-tail keywords.
    faqs: { type: [FaqSchema], default: [] },
    // ────────────────────────────────────────────────────────────────────
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);