const router = require("express").Router();
const User = require("../models/User");

const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//Update User details
const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email", "surname", "phone");
  // if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "success", user: updateUser });
});

//delete a user
const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { status: "inactive" });
  res.status(200).json("User is inactive");
});

//Get a user details (only admin can access this)
const getUser = catchAsync(async (req, res, next) => {
  const findUser = await User.findById(req.params.id);
  const { password, ...others } = findUser._doc;
  res.status(200).json(others);
});

//Get all user details (only admin can access this)
const getAllUsers = catchAsync(async (req, res, next) => {
  const findUser = await User.find();

  res.status(200).json(findUser);
});

//Get user stats (only admin can access this)
const getUserStats = catchAsync(async (req, res, next) => {
  const current_date = new Date();
  const last_year = new Date(
    current_date.setFullYear(current_date.getFullYear() - 1)
  );

  const data = await User.aggregate([
    {
      $match: { createdAt: { $gte: last_year } },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserStats,
  getMe,
};
