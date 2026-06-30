const Popup = require("../models/popup.model");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

/**
 * Gets the single active homepage popup configuration.
 * Creates a default document if none exists yet.
 */
exports.getPopup = async (_req, res, next) => {
  try {
    let popup = await Popup.findOne();
    if (!popup) {
      popup = await Popup.create({
        isActive: false,
        title: "Welcome to O'Soul",
        description: "Check out our latest collection!",
        imageUrl: "",
        link: "/shop",
        buttonText: "Shop Now",
      });
    }
    res.json({ success: true, data: popup });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the homepage popup configuration.
 * Uploads a new banner image to Cloudinary if provided.
 */
exports.updatePopup = async (req, res, next) => {
  try {
    let popup = await Popup.findOne();
    if (!popup) {
      popup = new Popup();
    }

    const { isActive, title, description, link, buttonText } = req.body;

    if (isActive !== undefined) {
      popup.isActive = isActive === "true" || isActive === true;
    }
    if (title !== undefined) popup.title = title;
    if (description !== undefined) popup.description = description;
    if (link !== undefined) popup.link = link;
    if (buttonText !== undefined) popup.buttonText = buttonText;

    if (req.file) {
      // Validate 3MB file size limit
      if (req.file.size > 3 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: "Image size must be less than 3MB" });
      }

      // Delete the previous image from Cloudinary if it exists
      if (popup.imageUrl) {
        await deleteFromCloudinary(popup.imageUrl);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer, "osou/popup");
      popup.imageUrl = uploadResult.secure_url;
    }

    await popup.save();
    res.json({ success: true, data: popup, message: "Popup settings updated successfully" });
  } catch (error) {
    next(error);
  }
};
