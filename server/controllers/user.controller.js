const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");
const { sendVerificationEmail } = require("../utils/send-email");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  status: user.isEmailVerified ? user.status : "pending",
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin
});

const generateVerificationCode = () => crypto.randomInt(100000, 1000000).toString();
const hashVerificationCode = (code) => crypto.createHash("sha256").update(code).digest("hex");
const setVerificationCode = (user, code) => {
  user.verificationCodeHash = hashVerificationCode(code);
  user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
};

const setSession = (res, user) => {
  const token = jwt.sign({ id: user._id, type: "user" }, process.env.JWT_SECRET || "change-this-development-secret", { expiresIn: "7d" });
  res.cookie("userToken", token, cookieOptions());
};

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail }).select("+verificationCodeHash +verificationCodeExpiresAt");
    if (user?.isEmailVerified) return res.status(409).json({ success: false, message: "An account with this email already exists" });

    const code = generateVerificationCode();
    if (user) {
      user.fullName = fullName.trim();
      user.password = password;
    } else {
      user = new User({ fullName: fullName.trim(), email: normalizedEmail, password, isEmailVerified: false });
    }
    user.isEmailVerified = false;
    setVerificationCode(user, code);
    await user.save();
    await sendVerificationEmail({ email: user.email, name: user.fullName, code });
    res.status(201).json({ success: true, data: { user: publicUser(user), unverified: true }, message: "Verification code sent to your email" });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    if (user.status !== "active") return res.status(403).json({ success: false, message: "This account is inactive" });
    if (!user.isEmailVerified) return res.status(403).json({ success: false, message: "Verify your email before logging in", data: { unverified: true, email: user.email } });

    user.lastLogin = new Date();
    await user.save({ validateModifiedOnly: true });
    setSession(res, user);
    res.json({ success: true, data: { user: publicUser(user) }, message: "Login successful" });
  } catch (error) { next(error); }
};

exports.me = (req, res) => res.json({ success: true, data: publicUser(req.user) });

exports.logout = (_req, res) => {
  res.clearCookie("userToken", { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true, message: "Logged out" });
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !/^\d{6}$/.test(String(code))) return res.status(400).json({ success: false, message: "A valid email and 6-digit code are required" });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+verificationCodeHash +verificationCodeExpiresAt");
    if (!user) return res.status(404).json({ success: false, message: "Account not found" });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: "Email is already verified" });
    if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) return res.status(400).json({ success: false, message: "Verification code expired. Request a new code" });
    if (hashVerificationCode(String(code)) !== user.verificationCodeHash) return res.status(400).json({ success: false, message: "Incorrect verification code" });

    user.isEmailVerified = true;
    user.verificationCodeHash = null;
    user.verificationCodeExpiresAt = null;
    user.lastLogin = new Date();
    await user.save();
    setSession(res, user);
    res.json({ success: true, data: { user: publicUser(user) }, message: "Email verified successfully" });
  } catch (error) { next(error); }
};

exports.resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase().trim() }).select("+verificationCodeHash +verificationCodeExpiresAt");
    if (!user) return res.status(404).json({ success: false, message: "Account not found" });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: "Email is already verified" });

    const code = generateVerificationCode();
    setVerificationCode(user, code);
    await user.save();
    await sendVerificationEmail({ email: user.email, name: user.fullName, code });
    res.json({ success: true, message: "A new verification code was sent" });
  } catch (error) { next(error); }
};

exports.getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users.map(publicUser) });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) { next(error); }
};
