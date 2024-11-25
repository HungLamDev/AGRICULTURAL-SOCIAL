import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Logo from "../images/logo_ngang.png";

const Login = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [typePass, setTypePass] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);
  const handleChangInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };
  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <img src={Logo} alt="logo" className="logo_login" />
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Tài Khoản</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="email"
            aria-describedby="emailHelp"
            onChange={handleChangInput}
            value={email}
          />
          <small id="emailHelp" className="form-text text-muted">
            Chúng tôi sẽ không chia sẽ với bất kỳ ai!
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Mật Khẩu</label>
          <div className="pass">
            <input
              type={typePass ? "text" : "password"}
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              onChange={handleChangInput}
              value={password}
            />
            <small onClick={() => setTypePass(!typePass)}>
              {typePass ? <FaRegEyeSlash /> : <FaRegEye />}
            </small>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-dark w-100"
          style={{ backgroundColor: "green", borderColor: "green" }}
          disabled={email && password ? false : true}
        >
          Đăng Nhập
        </button>
        <div className="my-2 p-2" style={{display: 'flex', justifyContent: 'space-between'}}>
          <div><Link to="/newpassword" style={{ textDecoration: "none" , color: 'blue'}}>Quên mật khẩu</Link></div>
          <div>
            Chưa có tài khoản? {' '}
          <Link
            to="/register"
            style={{ color: "crimson", textDecoration: "none" }}
          >
            Đăng ký
          </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
