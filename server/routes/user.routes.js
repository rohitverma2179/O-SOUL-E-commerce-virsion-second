const router = require("express").Router();
const userController = require("../controllers/user.controller");
const requireUser = require("../middlewares/user-auth.middleware");
const cartController = require("../controllers/cart.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/verify-email", userController.verifyEmail);
router.post("/resend-otp", userController.resendVerificationCode);
router.get("/me", requireUser, userController.me);
router.get("/cart", requireUser, cartController.getCart);
router.put("/cart", requireUser, cartController.saveCart);

module.exports = router;
