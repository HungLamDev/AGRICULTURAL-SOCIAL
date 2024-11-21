// server/routes/otpRoutes.js
const express = require("express");
const { sendOtp, verifyOtp, resetPassword } = require("../controllers/otpController");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
module.exports = router;