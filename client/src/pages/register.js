import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { register, sendOtp, verifyOtp } from "../redux/actions/authAction";
import valid from "../utils/valid"; // Import the validation functions
import Logo from "../images/logo_ngang.png";

const Register = () => {
  const auth = useSelector((state) => state.auth);
  const alert = useSelector((state) => state.alert);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialState = {
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "Nam",
  };
  const [userData, setUserData] = useState(initialState);
  const { username, email, password, cf_password } = userData;

  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [errors, setErrors] = useState({});
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (auth.token) navigate("/"); // Redirect if the user is already authenticated
  }, [auth.token, navigate]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errMsg, errLength } = valid(userData);
    setErrors(errMsg);
    if (errLength > 0) return;

    if (!otpSent) {
      setOtpLoading(true);
      try {
        await dispatch(sendOtp(email)); // Gửi OTP
        setOtpSent(true);
        setOtpError(""); // Reset OTP error message
      } catch (error) {
        setOtpError("Gửi OTP thất bại. Vui lòng thử lại.");
        setOtpLoading(false);
        return;
      } finally {
        setOtpLoading(false);
      }
    }

    // Kiểm tra OTP và thực hiện đăng ký
    if (otp && otp.length === 6) {
      try {
        // Xác thực OTP
        const otpValid = await dispatch(verifyOtp(email, otp));
        if (otpValid) {
          dispatch(register({ ...userData, otp })); // Đăng ký tài khoản nếu OTP hợp lệ
          console.log("Đăng ký thành công với dữ liệu:", { ...userData, otp });
        } else {
          setOtpError("Mã OTP không đúng hoặc hết hạn! ");
        }
      } catch (error) {
        setOtpError("Xác thực OTP thất bại. Vui lòng thử lại.");
      }
    } else if (otpSent) {
      setOtpError("Mã OTP phải có 6 chữ số.");
    }
  };

  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <img src={Logo} alt="logo" className="logo_login" />

        <div className="form-group">
          <label htmlFor="username">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            onChange={handleChangeInput}
            value={username}
            style={{ background: `${errors.username ? "#DDDDDD" : ""}` }}
          />
          <small className="text-danger">{errors.username}</small>
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Tài Khoản</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="email"
            onChange={handleChangeInput}
            value={email}
            style={{
              background: `${errors.email || otpError ? "#FFEEEE" : ""}`,
            }}
          />
          <small className="text-danger">{errors.email}</small>
        </div>

        {otpSent && (
          <div className="form-group">
            <label htmlFor="otp">Mã OTP</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              name="otp"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
            <small className="text-danger">{otpError}</small>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Mật Khẩu</label>
          <div className="pass">
            <input
              type={typePass ? "text" : "password"}
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              onChange={handleChangeInput}
              value={password}
              style={{ background: `${errors.password ? "#DDDDDD" : ""}` }}
            />
            <small onClick={() => setTypePass(!typePass)}>
              {typePass ? <FaRegEyeSlash /> : <FaRegEye />}
            </small>
          </div>
          <small className="text-danger">{errors.password}</small>
        </div>

        <div className="form-group">
          <label htmlFor="cf_password">Xác Thực Mật Khẩu</label>
          <div className="pass">
            <input
              type={typeCfPass ? "text" : "password"}
              className="form-control"
              id="cf_password"
              name="cf_password"
              onChange={handleChangeInput}
              value={cf_password}
              style={{ background: `${errors.cf_password ? "#DDDDDD" : ""}` }}
            />
            <small onClick={() => setTypeCfPass(!typeCfPass)}>
              {typeCfPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </small>
          </div>
          <small className="text-danger">{errors.cf_password}</small>
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100"
          style={{ backgroundColor: "red", borderColor: "red" }}
          disabled={alert.loading || otpLoading}
        >
          {alert.loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        <div className="text-center text-muted pt-2">
          <div>
            Bạn đã có tài khoản?{" "}
            <Link to="/login" style={{ textDecoration: "none" }}>
              Đăng nhập ngay
            </Link>
          </div>

          {/* <div>Bạn đã có tài khoản? <Link to="/login" style={{ textDecoration: "none" }}>Đăng nhập ngay</Link></div> */}
        </div>
      </form>
    </div>
  );
};

export default Register;
