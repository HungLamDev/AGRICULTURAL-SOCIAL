import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { register } from "../redux/actions/authAction";
import Logo from "../images/logo_ngang.png";

const Register = () => {
  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialState = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "Nam",
  };
  const [userData, setUserData] = useState(initialState);
  const { fullname, username, email, password, cf_password } = userData;

  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  useEffect(() => {
    if (auth.token) navigate("/");
  }, [auth.token, navigate]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userData));
  };
  return (
    <div className="auth_page">
      <form onSubmit={handleSubmit}>
        <img src={Logo} alt="logo" className="logo_login" />

        <div className="form-group">
          <label htmlFor="fullname">Full name</label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            onChange={handleChangeInput}
            value={fullname}
            style={{ background: `${alert.fullname ? "#DDDDDD" : ""}` }}
          />
          <small className=" text-danger">
            {alert.fullname ? alert.fullname : ""}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            onChange={handleChangeInput}
            value={username.toLowerCase().replace(/ /g, "")}
            style={{ background: `${alert.username ? "#DDDDDD" : ""}` }}
          />
          <small className=" text-danger">
            {alert.username ? alert.username : ""}
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Tài Khoản</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="email"
            aria-describedby="emailHelp"
            onChange={handleChangeInput}
            value={email}
            style={{ background: `${alert.email ? "#DDDDDD" : ""}` }}
          />
          <small className=" text-danger">
            {alert.email ? alert.email : ""}
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
              onChange={handleChangeInput}
              value={password}
              style={{ background: `${alert.password ? "#DDDDDD" : ""}` }}
            />
            <small onClick={() => setTypePass(!typePass)}>
              {typePass ? <FaRegEyeSlash /> : <FaRegEye />}
            </small>
          </div>
          <small className=" text-danger ">
            {alert.password ? alert.password : ""}
          </small>
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
              style={{ background: `${alert.cf_password ? "#DDDDDD" : ""}` }}
            />
            <small onClick={() => setTypeCfPass(!typeCfPass)}>
              {typeCfPass ? <FaRegEyeSlash /> : <FaRegEye />}
            </small>
          </div>
          <small className="form-text text-bg-danger text-100">
            {alert.cf_password ? alert.cf_password : ""}
          </small>
        </div>

        <div className="row justify-content-between mx-0 mb-1">
          <div className="col-auto">
            <label htmlFor="nam">
              Nam:{" "}
              <input
                type="radio"
                id="nam"
                name="gender"
                value="nam"
                defaultChecked
                onChange={handleChangeInput}
              />
            </label>
          </div>
          <div className="col-auto">
            <label htmlFor="nu">
              Nữ:{" "}
              <input
                type="radio"
                id="nu"
                name="gender"
                value="nu"
                onChange={handleChangeInput}
              />
            </label>
          </div>
          <div className="col-auto">
            <label htmlFor="khac">
              Khác:{" "}
              <input
                type="radio"
                id="khac"
                name="gender"
                value="khac"
                onChange={handleChangeInput}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100"
          style={{ backgroundColor: "red", borderColor: "red" }}
        >
          Đăng Ký
        </button>

        <p className="my-2 text-center">
          Bạn đã có tài khoản?{" "}
          <Link to="/" style={{ color: "crimson", textDecoration: "none" }}>
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
