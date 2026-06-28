const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ["Men", "Women", "Unisex"], required: true },
  type: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  bestFor: { type: String, default: "Everyday wear" },
  colors: [{ type: String, trim: true }],
  sizes: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true }],
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  inStock: { type: Boolean, default: true },
  onSale: { type: Boolean, default: false },
  tileClass: { type: String, default: "tile-olive" }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
