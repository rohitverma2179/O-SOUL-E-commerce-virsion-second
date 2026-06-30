const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema(
  {
    tagline: {
      type: String,
      default: "No More Adjusting.",
    },
    quote: {
      type: String,
      default: "If it makes you adjust, it failed.",
    },
    instagramUrl: {
      type: String,
      default: "https://instagram.com/osoul.in",
    },
    copyrightText: {
      type: String,
      default: "© 2026 O'Soul. All rights reserved.",
    },
    copyrightSubtext: {
      type: String,
      default: "Everyday comfort that still looks clean.",
    },
    trustLabel1: {
      type: String,
      default: "Secure Razorpay checkout",
    },
    trustLabel2: {
      type: String,
      default: "Easy exchange support",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterSettings", footerSchema);
