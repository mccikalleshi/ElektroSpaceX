const mongoose = require("mongoose");
//Order collection schema
const orderschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    address: [
      {
        zipcode: { type: String, required: true },
        addresses: { type: String, required: true },
        city: { type: String, required: true },
        place: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderschema);
