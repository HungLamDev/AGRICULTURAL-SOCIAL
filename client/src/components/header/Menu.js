import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";

const Menu = () => {
  const navLink = [
    { label: "Trang chủ", icon: "home", path: "/" },
    { label: "Tin nhắn", icon: "near_me", path: "/message" },
    { label: "Thảo luận", icon: "explore", path: "/discover" },
    { label: "Yêu thích", icon: "favorite", path: "/notify" },
  ];
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };
  return (
    <div className="menu">
      <ul className="navbar-nav flex-row">
        {navLink.map((link, index) => (
          <li className={`nav-item px-2  ${isActive(link.path)}`} key={index}>
            <Link className="nav-link" to={link.path}>
              <span
                className="material-icons"
                style={
                  isActive(link.path) ? { color: "gray" } : { color: "#66CC66" }
                }
              >
                {link.icon}
              </span>
            </Link>
          </li>
        ))}
        <li className="nav-item dropdown">
          <span
            className="nav-link dropdown-toggle pb-3"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} theme={theme} size="medium-avatar" />
          </span>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
              Thông tin cá nhân
            </Link>
            <label
              htmlFor="theme"
              className="dropdown-item"
              onClick={() =>
                dispatch({ type: GLOBALTYPES.THEME, payload: !theme })
              }
            >
              {theme ? "Chế độ sáng" : "Chế độ tối"}
            </label>
            <div className="dropdown-divider"></div>

            <Link
              className="dropdown-item"
              to="/"
              onClick={() => dispatch(logout())}
            >
              Đăng xuất
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
