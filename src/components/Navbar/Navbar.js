import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navflnavigat">
      <ul className="ulflex">
        <li>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Главная
          </Link>
        </li>
        <li>
          <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>
            О нас
          </Link>
        </li>
        <li>
          <Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>
            Контакты
          </Link>
        </li>
        <li>
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
            Профиль
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
