const Product = require("../models/Product");
const crypto = require("crypto-js");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

//Create a new product (only admin can access this)
const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = new Product(req.body);

  const added_product = await newProduct.save();
  res.status(200).json(added_product);
});

//Update a product (only admin can access this)
const updateProduct = catchAsync(async (req, res, next) => {
  const updated_product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.status(200).json(updated_product);
});

//Delete a product (make it inactive)
const deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id, { status: "inactive" });
  res.status(200).json("Product is deleted");
});

//Get a specific product by id
const getProduct = catchAsync(async (req, res, next) => {
  const find_product = await Product.findById(req.params.id).populate({
    path: "reviews",
  });
  res.status(200).json(find_product);
});

//Get all products with queries
const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .paginate();
  const products = await features.query;

  res.status(200).json(products);
});

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
