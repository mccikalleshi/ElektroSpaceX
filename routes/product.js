const router = require("express").Router();

const { protect, restrictTo } = require("../controllers/authController");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} = require("../controllers/productController");
const { createReview } = require("../controllers/reviewController");

//Create a new product (only admin can access this)
router.post("/", protect, restrictTo("admin"), createProduct);

//Update a product (only admin can access this)
router.patch("/:id", protect, restrictTo("admin"), updateProduct);

//Delete a product (make it inactive)
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

//Get a specific product by id
router.get("/find/:id", getProduct);

//Get all products with queries
router.get("/", getAllProducts);

router.post("/:productId/reviews", protect, restrictTo("user"), createReview);

module.exports = router;
