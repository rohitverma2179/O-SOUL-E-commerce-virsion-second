const router = require("express").Router();
const popupController = require("../controllers/popup.controller");
const requireAdmin = require("../middlewares/admin-auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", popupController.getPopup);
router.put("/", requireAdmin, upload.single("image"), popupController.updatePopup);

module.exports = router;
