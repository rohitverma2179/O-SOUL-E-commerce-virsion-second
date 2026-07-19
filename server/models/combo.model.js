const mongoose = require("mongoose");

const comboVariantSchema = new mongoose.Schema({
  size: { type: String, trim: true },
  color: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 }
}, { _id: false });

const comboItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  variants: { type: [comboVariantSchema], default: [] }
}, { _id: false });

const comboSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  headline: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  originalPrice: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, required: true, min: 0, max: 100, default: 0 },
  valueLine: { type: String, trim: true },
  images: [{ type: String, required: true }],
  items: { type: [comboItemSchema], default: [] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  inStock: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true } });

comboSchema.virtual("savings").get(function getSavings() {
  return Math.max(0, this.originalPrice - this.discountedPrice);
});

module.exports = mongoose.model("Combo", comboSchema);
