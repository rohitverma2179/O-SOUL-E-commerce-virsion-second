const jwt = require("jsonwebtoken");

const requireAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ success: false, message: "Admin login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "change-this-development-secret");
    const configuredUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
    if (decoded.username !== configuredUsername) {
      return res.status(401).json({ success: false, message: "Admin session is invalid" });
    }

    req.admin = { name: "O'Soul Admin", username: decoded.username, role: decoded.role };
    next();
  } catch (_error) {
    res.status(401).json({ success: false, message: "Admin session is invalid or expired" });
  }
};

module.exports = requireAdmin;
