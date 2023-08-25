const Order = require("../models/Order");
const crypto = require("crypto-js");
const catchAsync = require("../utils/catchAsync");

const createOrder = catchAsync(async (req, res, next) => {
  const newOrder = new Order(req.body);

  const added_order = await newOrder.save();
  res.status(200).json(added_order);
});

const updateOrder = catchAsync(async (req, res, next) => {
  const updated_order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updated_order);
});

const deleteOrder = catchAsync(async (req, res, next) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json("Order is deleted");
});

const getUserOrders = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const find_order = await Order.find({ userId: req.params.id });
  //console.log(find_cart);
  res.status(200).json(find_order);
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const all_orders = await Order.find()
    .populate({ path: "userId", select: "-__v -createdAt -updatedAt" }).populate({path:'product.productId' , select:'-_id -__v -createdAt -updatedAt'})
    .sort({ createdAt: -1 });
  res.status(200).json(all_orders);
});

const calculateIncome = catchAsync(async (req, res, next) => {
  const productId = req.query.productId;
  const date = new Date();
  const last_month = new Date(date.setMonth(date.getMonth() - 1));
  const previous_month = new Date(date.setMonth(last_month.getMonth() - 1));

  const income = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: previous_month },
      },
    },
    { $project: { month: { $month: "$createdAt" }, sales: "$total" } },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);

  res.status(200).json(income);
});

module.exports = {
  calculateIncome,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
};
