const mongoose = require("mongoose");

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String, required: true, unique: true },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageSection", homepageSectionSchema);
