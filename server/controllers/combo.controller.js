const Combo = require("../models/combo.model");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

exports.getCombos = async (_req, res, next) => {
  try {
    const combos = await Combo.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: combos });
  } catch (error) { next(error); }
};

exports.createCombo = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: "At least one combo image is required" });

    // Server-side double validation for 3MB limit per image
    const oversized = req.files.some((file) => file.size > 8 * 1024 * 1024);
    if (oversized) {
      return res.status(400).json({ success: false, message: "Each combo image must be less than 3MB" });
    }

    let items = [];
    try { items = JSON.parse(req.body.items || "[]"); }
    catch { return res.status(400).json({ success: false, message: "Combo items must be valid JSON" }); }

    const originalPrice = Number(req.body.originalPrice);
    let discountedPrice = Number(req.body.discountedPrice);
    let discountPercent = Number(req.body.discountPercent);

    if (!Number.isFinite(discountedPrice) || discountedPrice <= 0) {
      discountedPrice = Math.round(originalPrice * (100 - (discountPercent || 0)) / 100);
    }
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      discountPercent = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
    }

    const stock = req.body.stock !== undefined ? Number(req.body.stock) : 0;
    const inStock = stock > 0;

    // Upload combo images in parallel to Cloudinary
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, "osou/combos"));
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((resObj) => resObj.secure_url);

    const combo = await Combo.create({
      ...req.body,
      originalPrice,
      discountedPrice,
      discountPercent,
      images: imageUrls,
      items,
      stock,
      inStock
    });
    res.status(201).json({ success: true, data: combo, message: "Combo created" });
  } catch (error) { next(error); }
};

exports.updateCombo = async (req, res, next) => {
  try {
    const combo = await Combo.findById(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: "Combo not found" });

    let items = [];
    if (req.body.items) {
      try { items = typeof req.body.items === "string" ? JSON.parse(req.body.items) : req.body.items; }
      catch { return res.status(400).json({ success: false, message: "Combo items must be valid JSON" }); }
    } else {
      items = combo.items;
    }

    const originalPrice = req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : combo.originalPrice;
    const discountedPrice = req.body.discountedPrice !== undefined ? Number(req.body.discountedPrice) : combo.discountedPrice;
    const discountPercent = req.body.discountPercent !== undefined ? Number(req.body.discountPercent) : combo.discountPercent;
    const stock = req.body.stock !== undefined ? Number(req.body.stock) : combo.stock;
    const inStock = stock > 0;
    const isActive = req.body.isActive !== undefined ? (req.body.isActive === "true" || req.body.isActive === true) : combo.isActive;

    let imageUrls = combo.images;
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (combo.images && combo.images.length > 0) {
        try { await Promise.all(combo.images.map((url) => deleteFromCloudinary(url))); }
        catch (delErr) { console.error("Cloudinary delete failed:", delErr.message); }
      }
      // Upload new ones
      const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, "osou/combos"));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((resObj) => resObj.secure_url);
    }

    combo.title = req.body.title || combo.title;
    combo.headline = req.body.headline || combo.headline;
    combo.description = req.body.description || combo.description;
    combo.originalPrice = originalPrice;
    combo.discountedPrice = discountedPrice;
    combo.discountPercent = discountPercent;
    combo.valueLine = req.body.valueLine !== undefined ? req.body.valueLine : combo.valueLine;
    combo.images = imageUrls;
    combo.items = items;
    combo.stock = stock;
    combo.inStock = inStock;
    combo.isActive = isActive;

    await combo.save();
    res.json({ success: true, data: combo, message: "Combo updated successfully" });
  } catch (error) { next(error); }
};

exports.deleteCombo = async (req, res, next) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: "Combo not found" });
    
    // Delete all combo images from Cloudinary in parallel (falls back gracefully for older local uploads)
    if (combo.images && combo.images.length > 0) {
      await Promise.all(combo.images.map((url) => deleteFromCloudinary(url)));
    }
    
    res.json({ success: true, message: "Combo deleted" });
  } catch (error) { next(error); }
};

