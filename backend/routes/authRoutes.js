const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // adjust path/filename if different

const {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  googleAuth,
  sendChangePasswordOtp,
  changePasswordWithOtp,
} = authController;

// Public (logged-out) auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword); // body now requires: email, otp, password
router.post("/google", googleAuth);

// Authenticated (logged-in) routes - used by the Settings "Change Password" modal
router.post("/send-change-password-otp", authMiddleware, sendChangePasswordOtp);
router.put("/change-password", authMiddleware, changePasswordWithOtp);

module.exports = router;