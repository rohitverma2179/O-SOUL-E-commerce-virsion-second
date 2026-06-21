import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    verifyEmail, 
    googleLogin, 
    getCurrentUser,
    resendOTP
} from "../controllers/user.controller.js";
import { getHomepageContent } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/healthcheck").get((req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/verify-email").post(verifyEmail);
router.route("/google-login").post(googleLogin);
router.route("/resend-otp").post(resendOTP);
router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/homepage").get(getHomepageContent);

export default router;
