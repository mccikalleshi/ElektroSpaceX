const router = require("express").Router();

const {
  addCart,
  updateCart,
  getUserCart,
  deleteUserCart,
  getAllCarts,
} = require("../controllers/cartController");
const { protect, restrictTo } = require("../controllers/authController");

//Add a product to the cart
router.patch("/", protect, restrictTo("admin", "user"), addCart);

//Update the cart items
router.put("/:id", protect, restrictTo("admin", "user"), updateCart);

//Delete an item from the cart
router.delete("/:id", protect, restrictTo("admin", "user"), deleteUserCart);

//Get a specific user cart
router.get("/find/:id", protect, restrictTo("admin", "user"), getUserCart);

//Get all users carts (only admin can access this)
router.get("/", protect, restrictTo("admin"), getAllCarts);

module.exports = router;
