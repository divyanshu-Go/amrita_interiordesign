// models/user.js
import mongoose from "mongoose";

const enterpriseSubSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
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
  { _id: false } // prevents a separate ObjectId for the subdocument
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "user", "enterprise"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // enterprise-specific details stored when role === 'enterprise'
    enterpriseProfile: {
      type: enterpriseSubSchema,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;



