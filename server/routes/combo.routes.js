const router = require("express").Router();
const comboController = require("../controllers/combo.controller");
const upload = require("../middlewares/upload.middleware");
const requireAdmin = require("../middlewares/admin-auth.middleware");

router.get("/", comboController.getCombos);
router.post("/", requireAdmin, upload.array("images", 5), comboController.createCombo);
router.delete("/:id", requireAdmin, comboController.deleteCombo);

module.exports = router;
