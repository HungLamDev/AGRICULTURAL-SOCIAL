import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes"; 
import Logo from "../images/logo_ngang.png";

const NewPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch(); 

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!email || !validator.isEmail(email)) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Vui lòng nhập email hợp lệ." },
      });
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/sendOtp-Newpassword", { email });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "OTP đã được gửi đến email của bạn." },
      });
      setStep(2); // Move to Step 2
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: error.response?.data?.msg || "Có lỗi xảy ra khi gửi OTP.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!otp || otp.length < 6) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Vui lòng nhập mã OTP hợp lệ." },
      });
    }
    if (!newPassword || newPassword.length < 6) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Mật khẩu mới phải có ít nhất 6 ký tự." },
      });
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/reset-password", {
        email,
        otp,
        newPassword,
      });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Mật khẩu của bạn đã được cập nhật thành công." },
      });
      setStep(1); // Reset back to Step 1
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: error.response?.data?.msg || "OTP không hợp lệ hoặc đã hết hạn.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-password-container">
      <img src={Logo} alt="logo" className="logo_login" />

      {loading && <p>Đang xử lý...</p>}

      {step === 1 && (
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendOtp} disabled={loading}>
            Gửi OTP
          </button>
          <div className="pt-2 text-center">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="pt-2" style={{ textDecoration: "none" }}>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label>OTP:</label>
          <input
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <label>Mật khẩu mới:</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button onClick={handleResetPassword} disabled={loading}>
            Đặt lại mật khẩu
          </button>
        </div>
      )}
    </div>
  );
};

export default NewPassword;
