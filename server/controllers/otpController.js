const nodemailer = require("nodemailer");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

let otpStore = {};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Email không hợp lệ!" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email đã tồn tại!" });
    }
    const otp = crypto.randomBytes(3).toString("hex");
    const expiryTime = Date.now() + 5 * 60 * 1000;

    const { EMAIL, EMAIL_PASSWORD } = process.env;
    if (!EMAIL || !EMAIL_PASSWORD) {
      return res.status(500).json({ msg: "Thiếu thông tin cấu hình email." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Mã OTP của bạn",
      text: `Mã OTP của bạn là: ${otp}. Nó sẽ hết hạn sau 5 phút.`,
    };

    await transporter.sendMail(mailOptions);

    // Lưu OTP trong bộ nhớ
    otpStore[email] = { otp, expiryTime };
    console.log(otpStore[email]);

    return res.status(200).json({ msg: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Gửi OTP thất bại:", error);
    return res.status(500).json({ msg: "Có lỗi xảy ra khi gửi OTP." });
  }
};
exports.sendOtpNewpassword = async (req, res) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Email không hợp lệ!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email không tồn tại" });
    }
    const otp = crypto.randomBytes(3).toString("hex");
    const expiryTime = Date.now() + 5 * 60 * 1000;

    const { EMAIL, EMAIL_PASSWORD } = process.env;
    if (!EMAIL || !EMAIL_PASSWORD) {
      return res.status(500).json({ msg: "Thiếu thông tin cấu hình email." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Mã OTP của bạn",
      text: `Mã OTP của bạn là: ${otp}. Nó sẽ hết hạn sau 5 phút.`,
    };

    await transporter.sendMail(mailOptions);

    // Lưu OTP trong bộ nhớ
    otpStore[email] = { otp, expiryTime };
    console.log(otpStore[email]);

    return res.status(200).json({ msg: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Gửi OTP thất bại:", error);
    return res.status(500).json({ msg: "Có lỗi xảy ra khi gửi OTP." });
  }
};
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  console.log(email, "email là");
  console.log(otp, "otp là");

  const otpRecord = otpStore[email];
  console.log("giá trị otpStore[email]", otpStore[email]);
  console.log("giá trị otpRecord", otpRecord);

  if (!otpRecord) {
    return res.status(400).json({ msg: "OTP không tồn tại hoặc đã hết hạn!" });
  }

  // Kiểm tra xem OTP có đúng không
  if (otpRecord.otp !== otp) {
    return res.status(400).json({ msg: "Mã OTP không đúng!" });
  }

  if (Date.now() > otpRecord.expiryTime) {
    delete otpStore[email]; // Xóa OTP hết hạn
    return res.status(400).json({ msg: "OTP đã hết hạn!" });
  }

  delete otpStore[email];

  return res.status(200).json({ msg: "Xác thực OTP thành công!" });
};
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Kiểm tra email và OTP
    const otpRecord = otpStore[email];
    console.log("giá trị", otpRecord);

    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("New Password:", newPassword);

    if (!otpRecord) {
      return res
        .status(400)
        .json({ msg: "OTP không tồn tại hoặc đã hết hạn!" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ msg: "Mã OTP không đúng!" });
    }

    if (Date.now() > otpRecord.expiryTime) {
      delete otpStore[email]; // Xóa OTP hết hạn
      return res.status(400).json({ msg: "OTP đã hết hạn!" });
    }

    // Xóa OTP sau khi xác minh thành công
    delete otpStore[email];

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "Không tìm thấy người dùng!" });
    }

    return res
      .status(200)
      .json({ msg: "Mật khẩu của bạn đã được cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi trong resetPassword:", error);
    return res.status(500).json({ msg: "Có lỗi xảy ra khi đặt lại mật khẩu." });
  }
};
