import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import auth from "../services/authService";
import LogoDark from "./EmployerData/img/logo.png";

const user = auth.getCurrentUser();

const Header = () => {
  return (
    <div className="Header">
      <div className="Header1">
        <a href={(user && "/Employer/Home") || (!user && "/login")}>
          <img src={LogoDark} alt="logo" />
        </a>
      </div>
      <div className="Header-right">
        {user && (
          <NavLink to="/logout" className="logout">
            Logout
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
