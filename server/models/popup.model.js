const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Popup", popupSchema);
