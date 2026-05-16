import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { getHomepageContent } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/healthcheck").get((req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/homepage").get(getHomepageContent);

export default router;
