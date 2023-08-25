const router = require("express").Router();

const {
  calculateIncome,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, restrictTo } = require("../controllers/authController");

//Create an order
router.post("/", protect, createOrder);

//Update an order (only admin can access this)
router.patch("/:id", protect, restrictTo("admin"), updateOrder);

//Delete an order (only admin can access this)
router.delete("/:id", protect, restrictTo("admin"), deleteOrder);

//Get user orders
router.get("/find/:id", protect, restrictTo("admin", "user"), getUserOrders);

//Get all orders (only admin can access this)
router.get("/", protect, restrictTo("admin"), getAllOrders);

//Calculate the monthly income (only admin can access this)
router.get("/income", protect, restrictTo("admin"), calculateIncome);

module.exports = router;
