const Review = require("../models/Review");
const catchAsync = require("../utils/catchAsync");

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate({ path: "userId", select: "name surname" })
    .populate({ path: "productId", select: "name" });

  res.status(200).json(reviews);
});

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.productId) req.body.productId = req.params.productId;
  if (!req.body.userId) req.body.userId = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(200).json(newReview);
});

module.exports = { getAllReviews, createReview };
