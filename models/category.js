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
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    startingPrice: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    trendingTagline: { type: String, default: "" },

    // SEO Fields
    seoIntro: { type: String, default: "" },
    buyingGuide: { type: String, default: "" },
    faqs: { type: [FaqSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);