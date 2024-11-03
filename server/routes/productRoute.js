const router = require("express").Router();
const auth = require("../middleware/auth");
const productController = require("../controllers/productController");

router.post("/market/", auth, productController.createProduct);

router.get("/market/", auth, productController.getProducts);

router.get("/market/:id", auth, productController.getProduct);

router.get(
  "/market/user_products/:id",
  auth,
  productController.getUserProducts
);

router.get("/market/s/category", auth, productController.categoriesSelect);

router.get("/market/s/search", auth, productController.searchProduct);

router.put("/market/:id", auth, productController.updateProduct);

router.delete("/market/:id", auth, productController.deleteProduct);

module.exports = router;
