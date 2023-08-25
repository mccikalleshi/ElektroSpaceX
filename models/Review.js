const mongoose = require("mongoose");

const reviewschema = new mongoose.Schema(
  {
    review: { type: String, required: [true, "Enter a review"] },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Enter a rating"],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

reviewschema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name surname",
  });
  next();
});

module.exports = mongoose.model("Review", reviewschema);
