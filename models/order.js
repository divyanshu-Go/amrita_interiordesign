// models/order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Snapshot of product at order time
    productSnapshot: {
      name: String,
      sku: String,
      image: String,
      category: [mongoose.Schema.Types.ObjectId],
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    sellBy: {
      type: String,
      enum: ["piece", "box", "roll"],
      required: true,
    },

    pricingSnapshot: {
      unitPrice: Number,
      discountApplied: Number,
      finalUnitPrice: Number,
      lineTotal: Number,
    },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    roleSnapshot: {
      type: String,
      enum: ["user", "enterprise", "admin"],
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    addressSnapshot: {
      type: addressSnapshotSchema,
      required: true,
    },

    totals: {
      subtotal: Number,
      discount: Number,
      grandTotal: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "PREPAID"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "not_required"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "created",
        "payment_pending",
        "processing",
        "shipped",
        "delivered",
        "payment_failed",
        "cancelled",
      ],
      default: "created",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
