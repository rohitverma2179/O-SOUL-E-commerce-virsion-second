const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0,
    default: null
  },
  minOrder: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  totalUsageLimit: {
    type: Number,
    default: null
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  isUnlimited: {
    type: Boolean,
    default: false
  },
  firstOrderOnly: {
    type: Boolean,
    default: false
  },
  appliesTo: {
    type: String,
    enum: ["all", "products", "categories"],
    default: "all"
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  applicableCategories: [{
    type: String,
    trim: true
  }],
  customerRestriction: {
    type: String,
    enum: ["all", "specific", "new"],
    default: "all"
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  freeShipping: {
    type: Boolean,
    default: false
  },
  usedCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: "Admin"
  }
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
