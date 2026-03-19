const mongoose = require("mongoose");

const statusEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["ordered", "preparing", "out_for_delivery", "delivered"],
      required: true,
    },
    note: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodpartner",
      required: true,
    },
    foodName: { type: String, required: true },
    partnerName: { type: String, required: true },
    pricing: {
      itemTotal: { type: Number, required: true },
      platformCharge: { type: Number, required: true },
      deliveryCharge: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
    },
    deliveryAddress: { type: String, default: "" },
    payment: {
      razorpayOrderId: { type: String, required: true },
      razorpayPaymentId: { type: String, required: true },
      razorpaySignature: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["ordered", "preparing", "out_for_delivery", "delivered"],
      default: "ordered",
    },
    statusHistory: {
      type: [statusEntrySchema],
      default: [{ status: "ordered", note: "Payment verified" }],
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
