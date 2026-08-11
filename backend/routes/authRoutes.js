const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleAuth,
} = authController;

// Uncomment this line temporarily if the crash still happens after
// replacing authController.js - it will print exactly which of the six
// functions above is undefined.
// console.log("authController exports:", authController);

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/google", googleAuth);

module.exports = router;