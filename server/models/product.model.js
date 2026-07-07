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
  backImage: { type: String },
  stock: { type: Number, required: true, min: 0, default: 0 },
  inStock: { type: Boolean, default: true },
  onSale: { type: Boolean, default: false },
  tileClass: { type: String, default: "tile-olive" },
  originalPrice: { type: Number, min: 0 },
  weight: { type: Number, default: 500 },
  length: { type: Number, default: 10 },
  width: { type: Number, default: 10 },
  height: { type: Number, default: 10 },
  variants: [
    {
      size: { type: String, trim: true },
      color: { type: String, trim: true },
      stock: { type: Number, default: 0, min: 0 }
    }
  ],
  rating: { type: Number, default: 5, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
