const HomepageSection = require("../models/homepage.model");

exports.getHomepageData = async (_req, res, next) => {
  try {
    const sections = await HomepageSection.find({ isActive: true });
    res.json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};

exports.updateHomepageSection = async (req, res, next) => {
  try {
    const { sectionName, content } = req.body;
    if (!sectionName) {
      return res.status(400).json({ success: false, message: "sectionName is required" });
    }

    const section = await HomepageSection.findOneAndUpdate(
      { sectionName },
      { content },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: section, message: "Homepage section updated successfully" });
  } catch (error) {
    next(error);
  }
};
