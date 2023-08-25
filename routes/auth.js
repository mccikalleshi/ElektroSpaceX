const router = require("express").Router();
const crypto = require("crypto-js");

const {
  userRegister,
  userLogin,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require("../controllers/authController");
const { route } = require("./cart");

router.route("/register").post(userRegister);
router.post("/login", userLogin);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updatePassword);

module.exports = router;
