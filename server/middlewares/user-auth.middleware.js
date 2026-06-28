const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const requireUser = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;
    if (!token) return res.status(401).json({ success: false, message: "Login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change-this-development-secret");
    const user = await User.findById(decoded.id);
    if (!user || user.status !== "active") return res.status(401).json({ success: false, message: "User session is invalid" });
    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ success: false, message: "Session is invalid or expired" });
  }
};

module.exports = requireUser;
