const Cart = require("../models/Cart");

const crypto = require("crypto-js");
const catchAsync = require("../utils/catchAsync");

//Add a product to the cart
const addCart = catchAsync(async (req, res, next) => {
  const newCart = new Cart(req.body);

  const added_product = await newCart.save();
  res.status(200).json(added_product);
});

//Update the cart items
const updateCart = catchAsync(async (req, res, next) => {
  const updated_cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updated_cart);
});

//Get a specific user cart
const getUserCart = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const find_cart = await Cart.findOne({ userId: req.params.id });
  //console.log(find_cart);
  res.status(200).json(find_cart);
});

//Delete an item from the cart
const deleteUserCart = catchAsync(async (req, res, next) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json("Cart is deleted");
});

//Get all users carts (only admi can access this)
const getAllCarts = catchAsync(async (req, res, next) => {
  const all_carts = await Cart.find().sort({ createdAt: -1 });
  res.status(200).json(all_carts);
});

module.exports = {
  addCart,
  updateCart,
  getUserCart,
  deleteUserCart,
  getAllCarts,
};
