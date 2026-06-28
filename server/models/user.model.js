const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["user"], default: "user" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isEmailVerified: { type: Boolean, default: true },
  verificationCodeHash: { type: String, select: false, default: null },
  verificationCodeExpiresAt: { type: Date, select: false, default: null },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
