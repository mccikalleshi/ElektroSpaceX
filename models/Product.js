const mongoose = require("mongoose");
//Product collection schema
const productschema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    desc: { type: String, required: true, trim: true },
    photo: { type: String, required: true },
    photos: { type: [String] },
    isAvailable: { type: Boolean, default: true },
    price: { type: Number, required: true },
    discount_price: { type: Number },
    brand: { type: String, required: true },
    guarantee: { type: String, required: true },
    category: { type: [String], required: true },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productschema.set("toObject", { virtuals: true });
productschema.set("toJSON", { virtuals: true });

productschema.virtual("reviews", {
  ref: "Review",
  foreignField: "productId",
  localField: "_id",
});

module.exports = mongoose.model("Product", productschema);
