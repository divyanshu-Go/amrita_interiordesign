// models/Enterprise.js
import mongoose from "mongoose";

const enterpriseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Enterprise = mongoose.models.Enterprise || mongoose.model("Enterprise", enterpriseSchema);
export default Enterprise;
