import { Router } from "express";
import {
    getAllUsers,
    updateUserRole,
    getHomepageContent,
    updateHomepageSection,
    getDashboardStats
} from "../controllers/admin.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes here are protected and require admin role
router.use(verifyJWT, isAdmin);

router.route("/stats").get(getDashboardStats);
router.route("/users").get(getAllUsers);
router.route("/users/role").patch(updateUserRole);

router.route("/homepage/section").post(updateHomepageSection);

export default router;
