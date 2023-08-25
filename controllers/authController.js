const AppError = require("../utils/appError");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const User = require("../models/User");
const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// User register
const userRegister = catchAsync(async (req, res, next) => {
  //Get the user register details and save it on the database
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
  });

  const userDetail = await newUser.save();

  res.status(201).json(userDetail);
});

//User login
const userLogin = catchAsync(async (req, res, next) => {
  // Find the user from database
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide correct credentials"), 400);
  }
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password"), 401);
  }

  createSendToken(user, 200, req, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookie.jwt) token = req.cookie.jwt;
  // console.warn(token);
  if (!token)
    return next(new AppError("You are not logged in! Please login in!"), 401);

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
  const newUser = await User.findById(decoded.id);

  if (!newUser)
    return next(
      new AppError(`The user belonging to the token doesn't exist`),
      401
    );

  if (newUser.changedPasswordAfter(decoded.iat))
    return next(new AppError("User recently changed the password! "), 401);

  req.user = newUser;

  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError(`You don't have permission to do this`, 401));
    return next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError("There is no user with this email address"), 404);
  console.log(user.print());
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Enter your new password to: ${resetURL}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset (valid for 10 min)",
      message,
    });
    res.status(200).json({ message: "Token sent to mail" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error send the email. Try again later!", 500)
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or expired!", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError("Your current password is wrong", 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});

module.exports = {
  userLogin,
  userRegister,
  restrictTo,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
};
