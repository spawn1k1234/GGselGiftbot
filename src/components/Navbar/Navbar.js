import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [visible, setVisible] = useState(true); // Состояние для видимости
  const [lastScrollY, setLastScrollY] = useState(0); // Последняя позиция прокрутки

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false); // Скроллинг вниз, скрыть панель
      } else {
        setVisible(true); // Скроллинг вверх, показать панель
      }
      setLastScrollY(window.scrollY); // Обновить позицию прокрутки
    };

    window.addEventListener("scroll", handleScroll); // Добавить слушатель события прокрутки

    return () => {
      window.removeEventListener("scroll", handleScroll); // Удалить слушатель при размонтировании компонента
    };
  }, [lastScrollY]); // Зависящий от позиции прокрутки

  return (
    <nav
      className={`navflnavigat ${visible ? "navbar-visible" : "navbar-hidden"}`}
    >
      <ul className="ulflex">
        <li>
          <Link to="/">
            <span
              style={{ fontSize: "25px" }}
              class="material-symbols-outlined"
            >
              home
            </span>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about">
            <span
              style={{ fontSize: "25px" }}
              class="material-symbols-outlined"
            >
              page_info
            </span>
            About
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <span
              style={{ fontSize: "25px" }}
              className="material-symbols-outlined"
            >
              emoji_people
            </span>
            Contacts
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <span
              style={{ fontSize: "25px" }}
              class="material-symbols-outlined"
            >
              account_circle
            </span>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
