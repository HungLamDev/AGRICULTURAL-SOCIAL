import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import Menu from "./Menu";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../alert/Avatar";
const Header = () => {
  return (
    <div className="header">
      <nav className="navbar px-4 navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
        <Link className="navbar-brand text-uppercase " to="/">
          Khoa
        </Link>
        <Search />
        <Menu />
      </nav>
    </div>
  );
};

export default Header;
