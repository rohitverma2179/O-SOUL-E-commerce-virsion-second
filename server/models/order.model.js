const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
      color: { type: String },
      image: { type: String }
    }
  ],
  shippingDetails: {
    email: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    country: { type: String, required: true, trim: true, default: "India" },
    address: { type: String, required: true, trim: true },
    apartment: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  trackingNumber: {
    type: String,
    default: ""
  },
  carrier: {
    type: String,
    default: ""
  },
  invoiceUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
