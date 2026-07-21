const Coupon = require("../models/coupon.model");
const CouponUsage = require("../models/couponUsage.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

// Helper to validate and calculate discount
const validateCouponInternal = async ({ code, userId, items }) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (coupon.status !== "active") {
    throw new Error("Coupon is inactive");
  }

  const now = new Date();
  if (now < new Date(coupon.startDate)) {
    throw new Error("Coupon is not active yet");
  }
  if (now > new Date(coupon.expiryDate)) {
    throw new Error("Coupon has expired");
  }

  // Calculate cart subtotal
  let subtotal = 0;
  const productIds = items.map(item => item.id || item.productId || item._id);
  const products = await Product.find({ _id: { $in: productIds } });
  
  // Calculate subtotal from products to be secure
  for (const item of items) {
    const dbProd = products.find(p => p._id.toString() === (item.id || item.productId || item._id).toString());
    const price = dbProd ? dbProd.price : item.price;
    subtotal += Number(price) * item.quantity;
  }

  if (subtotal < coupon.minOrder) {
    throw new Error(`Minimum order amount of ₹${coupon.minOrder} is required for this coupon`);
  }

  // Check total usage limit
  if (!coupon.isUnlimited && coupon.totalUsageLimit !== null && coupon.usedCount >= coupon.totalUsageLimit) {
    throw new Error("Coupon usage limit has been reached");
  }

  // Check per-user limit
  if (userId) {
    const userUsageCount = await CouponUsage.countDocuments({ couponId: coupon._id, userId });
    if (userUsageCount >= coupon.perUserLimit) {
      throw new Error(`You have already used this coupon ${coupon.perUserLimit} time(s)`);
    }

    // Check first order only / new customers restriction
    if (coupon.firstOrderOnly || coupon.customerRestriction === "new") {
      const paidOrdersCount = await Order.countDocuments({ user: userId, status: "paid" });
      if (paidOrdersCount > 0) {
        throw new Error("This coupon is only valid for your first order");
      }
    }

    // Check allowed users list if restricted
    if (coupon.customerRestriction === "specific") {
      const isAllowed = coupon.allowedUsers.some(id => id.toString() === userId.toString());
      if (!isAllowed) {
        throw new Error("This coupon is not valid for your account");
      }
    }
  }

  // Determine eligible items and subtotal
  let eligibleSubtotal = 0;
  if (coupon.appliesTo === "all") {
    eligibleSubtotal = subtotal;
  } else if (coupon.appliesTo === "products") {
    const applicableIds = coupon.applicableProducts.map(id => id.toString());
    for (const item of items) {
      const idStr = (item.id || item.productId || item._id).toString();
      if (applicableIds.includes(idStr)) {
        const dbProd = products.find(p => p._id.toString() === idStr);
        const price = dbProd ? dbProd.price : item.price;
        eligibleSubtotal += Number(price) * item.quantity;
      }
    }
    if (eligibleSubtotal === 0) {
      throw new Error("This coupon is not applicable to any items in your cart");
    }
  } else if (coupon.appliesTo === "categories") {
    const applicableCats = coupon.applicableCategories.map(c => c.toLowerCase().trim());
    for (const item of items) {
      const idStr = (item.id || item.productId || item._id).toString();
      const dbProd = products.find(p => p._id.toString() === idStr);
      if (dbProd && applicableCats.includes(dbProd.category.toLowerCase().trim())) {
        eligibleSubtotal += Number(dbProd.price) * item.quantity;
      }
    }
    if (eligibleSubtotal === 0) {
      throw new Error("This coupon is not applicable to items in these categories");
    }
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === "flat") {
    discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
  } else if (coupon.discountType === "percentage") {
    discountAmount = (eligibleSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount !== null && coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  }

  // Round discount to 2 decimals
  discountAmount = Math.round(discountAmount * 100) / 100;

  return {
    coupon,
    discountAmount,
    freeShipping: coupon.freeShipping,
    subtotal
  };
};

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, items } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!code || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Code and items are required" });
    }

    const result = await validateCouponInternal({ code, userId, items });
    
    return res.json({
      success: true,
      data: {
        code: result.coupon.code,
        name: result.coupon.name,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
        discountAmount: result.discountAmount,
        freeShipping: result.freeShipping,
        subtotal: result.subtotal
      }
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Admin handlers
exports.createCoupon = async (req, res, next) => {
  try {
    const couponData = req.body;
    if (couponData.code) {
      couponData.code = couponData.code.toUpperCase().trim();
    }
    const exists = await Coupon.findOne({ code: couponData.code });
    if (exists) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = new Coupon(couponData);
    await coupon.save();

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
      const exists = await Coupon.findOne({ code: updateData.code, _id: { $ne: id } });
      if (exists) {
        return res.status(400).json({ success: false, message: "Coupon code already exists" });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    // Delete usage logs
    await CouponUsage.deleteMany({ couponId: id });

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.toggleCouponStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const coupon = await Coupon.findByIdAndUpdate(id, { status }, { new: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

exports.getCouponAnalytics = async (req, res, next) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ status: "active", expiryDate: { $gte: new Date() } });
    const expiredCoupons = await Coupon.countDocuments({ expiryDate: { $lt: new Date() } });

    // Aggregate values
    const usages = await CouponUsage.find();
    const totalDiscountGiven = usages.reduce((sum, u) => sum + u.discountAmount, 0);
    const totalOrders = usages.length;

    // Top used coupon
    const topCouponAgg = await CouponUsage.aggregate([
      { $group: { _id: "$couponId", count: { $sum: 1 }, totalDiscount: { $sum: "$discountAmount" } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let mostUsedCoupon = "N/A";
    if (topCouponAgg.length > 0) {
      const topCoupon = await Coupon.findById(topCouponAgg[0]._id);
      if (topCoupon) {
        mostUsedCoupon = `${topCoupon.code} (${topCouponAgg[0].count} uses)`;
      }
    }

    // Revenue generated from orders using coupons
    const orderIds = usages.map(u => u.orderId);
    const orders = await Order.find({ _id: { $in: orderIds }, status: "paid" });
    const revenueGenerated = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalDiscountGiven,
        mostUsedCoupon,
        totalOrdersViaCoupon: totalOrders,
        revenueGenerated
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCouponUsageLogs = async (req, res, next) => {
  try {
    const logs = await CouponUsage.find()
      .populate("couponId", "code name discountType discountValue")
      .populate("userId", "fullName email")
      .populate("orderId", "razorpayOrderId totalAmount")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

// Export validation helper for use in payments controller
exports.validateCouponInternal = validateCouponInternal;
