const router = require("express").Router();
const paymentController = require("../controllers/payment.controller");
const requireUser = require("../middlewares/user-auth.middleware");

router.post("/order", requireUser, paymentController.createOrder);
router.post("/verify", requireUser, paymentController.verifyPayment);
router.post("/track", paymentController.trackOrder);

module.exports = router;
