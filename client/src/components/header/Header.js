import React from "react";
import Menu from "./Menu";
import Search from "./Search";
import logo from "../../images/logo_ngang.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const theme = useSelector((state) => state.theme);

  return (
    <div className="header bg-light p-2">
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
        <Link
          className="logo"
          to="/"
          onClick={() => window.scrollTo({ top: 0 })}
        >
          <img
            src={logo}
            alt="logo"
            height={70}
            style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
          />
        </Link>
        <Search />
        <Menu />
      </nav>
    </div>
  );
};

export default Header;
