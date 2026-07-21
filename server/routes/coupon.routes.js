const router = require("express").Router();
const couponController = require("../controllers/coupon.controller");
const requireAdmin = require("../middlewares/admin-auth.middleware");
const requireUser = require("../middlewares/user-auth.middleware");

// Customer routes
router.post("/validate", requireUser, couponController.validateCoupon);

// Admin routes
router.post("/", requireAdmin, couponController.createCoupon);
router.get("/", requireAdmin, couponController.getCoupons);
router.get("/analytics", requireAdmin, couponController.getCouponAnalytics);
router.get("/usages", requireAdmin, couponController.getCouponUsageLogs);
router.put("/:id", requireAdmin, couponController.updateCoupon);
router.delete("/:id", requireAdmin, couponController.deleteCoupon);
router.patch("/:id/status", requireAdmin, couponController.toggleCouponStatus);

module.exports = router;
