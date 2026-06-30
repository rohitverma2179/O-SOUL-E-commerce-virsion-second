const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const requireAdmin = require("../middlewares/admin-auth.middleware");
const { getAllUsers, deleteUser } = require("../controllers/user.controller");
const homepageController = require("../controllers/homepage.controller");

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.get("/me", requireAdmin, adminController.me);
router.get("/users", requireAdmin, getAllUsers);
router.delete("/users/:id", requireAdmin, deleteUser);

router.post("/homepage/section", requireAdmin, homepageController.updateHomepageSection);

module.exports = router;
