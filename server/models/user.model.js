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
  resetPasswordTokenHash: { type: String, select: false, default: null },
  resetPasswordExpiresAt: { type: Date, select: false, default: null },
  lastLogin: { type: Date, default: null },
  addresses: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      companyName: { type: String },
      country: { type: String, default: "India" },
      address: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
      addressType: { type: String, enum: ["billing", "shipping"], default: "shipping" },
      isDefault: { type: Boolean, default: false }
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
}, { timestamps: true });

userSchema.pre("save", async function hashPassword() {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
