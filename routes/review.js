const {
  createReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = require("express").Router();

router.post("/", protect, restrictTo("user"), createReview);
router.get("/", getAllReviews);

module.exports = router;
