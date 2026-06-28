const jwt = require("jsonwebtoken");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const configuredAdmin = () => ({
  name: "O'Soul Admin",
  username: (process.env.ADMIN_USERNAME || "admin").toLowerCase(),
  role: "superadmin"
});

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: "Username and password are required" });

  const admin = configuredAdmin();
  const configuredPassword = process.env.ADMIN_PASSWORD || "password123";
  if (username.toLowerCase().trim() !== admin.username || password !== configuredPassword) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { username: admin.username, role: admin.role },
    process.env.JWT_SECRET || "change-this-development-secret",
    { expiresIn: "7d" }
  );
  return res.cookie("adminToken", token, cookieOptions()).json({ success: true, data: admin });
};

exports.me = (req, res) => res.json({ success: true, data: req.admin });

exports.logout = (_req, res) => {
  res.clearCookie("adminToken", { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true, message: "Logged out" });
};
