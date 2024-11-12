import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";
import NotifyModal from "../NotifyModal";

const Menu = () => {
  const navLink = [
    { label: "Nổi bật", icon: "feed", path: "/news" },
    { label: "Trang chủ", icon: "home", path: "/home" },
    { label: "Chợ", icon: "shopping_bag", path: "/market" },
    { label: "Tin nhắn", icon: "send", path: "/message" },
  ];
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const notify = useSelector((state) => state.notifyUser);

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };
  return (
    <div className="menu">
      <ul
        className="navbar-nav flex-row"
        style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
      >
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
        <li
          className="nav-item dropdown align-items-center d-flex"
          style={{ padding: "0 15px" }}
        >
          <span
            className="nav-link position-relative"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <span
              className="material-icons p-0"
              style={{ color: notify.data.length > 0 ? "#004225" : "" }}
            >
              notifications
            </span>
            <span className="notify_length">{notify.data.length}</span>
          </span>
          <div
            className="dropdown-menu position-absolute dropdown-menu-end"
            aria-labelledby="navbarDropdown"
            style={{ transform: "translateX(60px)", zIndex: 10 }}
          >
            <NotifyModal />
          </div>
        </li>
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
            <Link className="dropdown-item" to={`/user/${auth.user._id}`}>
              Trang cá nhân
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
