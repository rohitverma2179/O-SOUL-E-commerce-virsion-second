const Combo = require("../models/combo.model");
const fs = require("fs/promises");
const path = require("path");

const imageUrl = (req, file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
const removeUpload = async (url) => {
  const filename = path.basename(new URL(url).pathname);
  await fs.unlink(path.join(__dirname, "..", "uploads", filename)).catch(() => {});
};

exports.getCombos = async (_req, res, next) => {
  try {
    const combos = await Combo.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: combos });
  } catch (error) { next(error); }
};

exports.createCombo = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: "At least one combo image is required" });

    let items = [];
    try { items = JSON.parse(req.body.items || "[]"); }
    catch { return res.status(400).json({ success: false, message: "Combo items must be valid JSON" }); }

    const originalPrice = Number(req.body.originalPrice);
    const discountPercent = Number(req.body.discountPercent);
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) return res.status(400).json({ success: false, message: "Discount percentage must be between 0 and 100" });
    const discountedPrice = Math.round(originalPrice * (100 - discountPercent) / 100);

    const combo = await Combo.create({
      ...req.body,
      originalPrice,
      discountedPrice,
      discountPercent,
      images: req.files.map((file) => imageUrl(req, file)),
      items
    });
    res.status(201).json({ success: true, data: combo, message: "Combo created" });
  } catch (error) { next(error); }
};




exports.deleteCombo = async (req, res, next) => {
  try {
    const combo = await Combo.findByIdAndDelete(req.params.id);
    if (!combo) return res.status(404).json({ success: false, message: "Combo not found" });
    await Promise.all(combo.images.map(removeUpload));
    res.json({ success: true, message: "Combo deleted" });
  } catch (error) { next(error); }
};
