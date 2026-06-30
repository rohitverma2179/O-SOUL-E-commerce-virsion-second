const router = require("express").Router();
const userController = require("../controllers/user.controller");
const requireUser = require("../middlewares/user-auth.middleware");
const cartController = require("../controllers/cart.controller");
const homepageController = require("../controllers/homepage.controller");

router.get("/homepage", homepageController.getHomepageData);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/verify-email", userController.verifyEmail);
router.post("/resend-otp", userController.resendVerificationCode);
router.get("/me", requireUser, userController.me);
router.get("/cart", requireUser, cartController.getCart);
router.put("/cart", requireUser, cartController.saveCart);

// User-owned resources (Orders, Addresses, Wishlist)
router.get("/orders", requireUser, userController.getOrders);

router.get("/addresses", requireUser, userController.getAddresses);
router.post("/addresses", requireUser, userController.addAddress);
router.put("/addresses/:id", requireUser, userController.updateAddress);
router.delete("/addresses/:id", requireUser, userController.deleteAddress);

router.get("/wishlist", requireUser, userController.getWishlist);
router.post("/wishlist/toggle", requireUser, userController.toggleWishlist);

module.exports = router;
