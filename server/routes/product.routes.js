const router = require("express").Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");
const requireAdmin = require("../middlewares/admin-auth.middleware");

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);
router.post("/", requireAdmin, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
  { name: "blackImages", maxCount: 5 },
  { name: "oliveImages", maxCount: 5 }
]), productController.createProduct);
router.put("/:id", requireAdmin, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
  { name: "blackImages", maxCount: 5 },
  { name: "oliveImages", maxCount: 5 }
]), productController.updateProduct);
router.delete("/:id", requireAdmin, productController.deleteProduct);

module.exports = router;
