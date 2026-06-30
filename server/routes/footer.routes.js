const router = require("express").Router();
const footerController = require("../controllers/footer.controller");
const requireAdmin = require("../middlewares/admin-auth.middleware");

router.get("/", footerController.getFooter);
router.put("/", requireAdmin, footerController.updateFooter);

module.exports = router;
