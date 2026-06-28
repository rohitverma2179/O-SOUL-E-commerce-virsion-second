const router = require("express").Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");
const requireAdmin = require("../middlewares/admin-auth.middleware");

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);
router.post("/", requireAdmin, upload.single("image"), productController.createProduct);
router.delete("/:id", requireAdmin, productController.deleteProduct);

module.exports = router;
