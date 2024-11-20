const nodemailer = require("nodemailer");
const validator = require("validator");

let otpStore = {}; 
let otpExpiry = {}; 

exports.sendOtp = async (req, res) => {
  const { email } = req.body; 

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Email không hợp lệ!" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); 
  const expiryTime = Date.now() + 5 * 60 * 1000; 

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL, 
    to: email, 
    subject: "Mã OTP của bạn",
    text: `Mã OTP của bạn là: ${otp}. Nó sẽ hết hạn sau 5 phút.`,
  };

  try {
    await transporter.sendMail(mailOptions); 
    otpStore[email] = otp; 
    otpExpiry[email] = expiryTime; 
    console.log("Stored OTP: ", otpStore[email]);
      console.log("OTP Entered: ", otp);
      console.log("OTP Expiry: ", otpExpiry[email]);
      console.log("Current Time: ", Date.now());

    return res.status(200).json({ msg: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Gửi OTP thất bại:", error);
    return res.status(500).json({ msg: "Gửi OTP thất bại" });
  }
};


// Xác thực OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body; 
  console.log(otpStore[email]);
  console.log(otp);
  
  if (!otpStore[email] || otpStore[email] !== otp) {
    return res.status(400).json({ msg: "OTP không hợp lệ hoặc đã hết hạn!" });
  }

  if (Date.now() > otpExpiry[email]) {
    delete otpStore[email]; 
    delete otpExpiry[email];
    return res.status(400).json({ msg: "OTP đã hết hạn!" });
  }

  delete otpStore[email];
  delete otpExpiry[email];

  return res.status(200).json({ msg: "Xác thực OTP thành công!" });
};
