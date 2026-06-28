const Product = require("../models/product.model");
const fs = require("fs/promises");
const path = require("path");

const splitList = (value = "") => String(value).split(",").map((item) => item.trim()).filter(Boolean);
const imageUrl = (req, file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
const removeUpload = async (url) => {
  const filename = path.basename(new URL(url).pathname);
  await fs.unlink(path.join(__dirname, "..", "uploads", filename)).catch(() => {});
};

exports.getProducts = async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Product image is required" });
    const stock = Number(req.body.stock);
    if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ success: false, message: "Stock must be a non-negative whole number" });

    const baseSlug = String(req.body.slug || req.body.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let slug = baseSlug;
    let suffix = 2;
    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const product = await Product.create({
      ...req.body,
      slug,
      image: imageUrl(req, req.file),
      colors: splitList(req.body.colors),
      sizes: splitList(req.body.sizes),
      tags: splitList(req.body.tags),
      stock,
      inStock: stock > 0,
      onSale: false
    });
    res.status(201).json({ success: true, data: product, message: "Product created" });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    await removeUpload(product.image);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) { next(error); }
};
