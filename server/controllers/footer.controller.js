const FooterSettings = require("../models/footer.model");

/**
 * Gets the footer settings configuration.
 * Creates a default document if none exists yet.
 */
exports.getFooter = async (_req, res, next) => {
  try {
    let footer = await FooterSettings.findOne();
    if (!footer) {
      footer = await FooterSettings.create({
        tagline: "No More Adjusting.",
        quote: "If it makes you adjust, it failed.",
        instagramUrl: "https://instagram.com/osoul.in",
        copyrightText: "© 2026 O'Soul. All rights reserved.",
        copyrightSubtext: "Everyday comfort that still looks clean.",
        trustLabel1: "Secure Razorpay checkout",
        trustLabel2: "Easy exchange support",
      });
    }
    res.json({ success: true, data: footer });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the footer settings configuration.
 */
exports.updateFooter = async (req, res, next) => {
  try {
    let footer = await FooterSettings.findOne();
    if (!footer) {
      footer = new FooterSettings();
    }

    const {
      tagline,
      quote,
      instagramUrl,
      copyrightText,
      copyrightSubtext,
      trustLabel1,
      trustLabel2,
    } = req.body;

    if (tagline !== undefined) footer.tagline = tagline;
    if (quote !== undefined) footer.quote = quote;
    if (instagramUrl !== undefined) footer.instagramUrl = instagramUrl;
    if (copyrightText !== undefined) footer.copyrightText = copyrightText;
    if (copyrightSubtext !== undefined) footer.copyrightSubtext = copyrightSubtext;
    if (trustLabel1 !== undefined) footer.trustLabel1 = trustLabel1;
    if (trustLabel2 !== undefined) footer.trustLabel2 = trustLabel2;

    await footer.save();
    res.json({ success: true, data: footer, message: "Footer settings updated successfully" });
  } catch (error) {
    next(error);
  }
};
