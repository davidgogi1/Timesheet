import React from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-content footer">
      Copyright © 2010-2022 Your Company S.L. All rights reserved
      <span className="footer-content-icons">
        <FaFacebookSquare /> <FaTwitterSquare /> <FaLinkedin />
      </span>
    </div>
  );
};

export default Footer;
