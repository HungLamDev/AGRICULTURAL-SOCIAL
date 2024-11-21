// server/routes/otpRoutes.js
const express = require("express");
const { sendOtp, verifyOtp, resetPassword, sendOtpNewpassword } = require("../controllers/otpController");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/sendOtp-Newpassword", sendOtpNewpassword);

module.exports = router;