// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";

// const Navbar = () => {
//   const [visible, setVisible] = useState(true); // Состояние для видимости
//   const [lastScrollY, setLastScrollY] = useState(0); // Последняя позиция прокрутки

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > lastScrollY) {
//         setVisible(false); // Скроллинг вниз, скрыть панель
//       } else {
//         setVisible(true); // Скроллинг вверх, показать панель
//       }
//       setLastScrollY(window.scrollY); // Обновить позицию прокрутки
//     };

//     window.addEventListener("scroll", handleScroll); // Добавить слушатель события прокрутки

//     return () => {
//       window.removeEventListener("scroll", handleScroll); // Удалить слушатель при размонтировании компонента
//     };
//   }, [lastScrollY]); // Зависящий от позиции прокрутки

//   return (
//     <nav
//       className={`navflnavigat ${visible ? "navbar-visible" : "navbar-hidden"}`}
//     >
//       <ul className="ulflex">
//         <li>
//           <Link to="/">
//             <span
//               style={{ fontSize: "25px" }}
//               class="material-symbols-outlined"
//             >
//               home
//             </span>
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/about">
//             <span
//               style={{ fontSize: "25px" }}
//               class="material-symbols-outlined"
//             >
//               page_info
//             </span>
//             About
//           </Link>
//         </li>
//         <li>
//           <Link to="/contact">
//             <span
//               style={{ fontSize: "25px" }}
//               className="material-symbols-outlined"
//             >
//               emoji_people
//             </span>
//             Contacts
//           </Link>
//         </li>
//         <li>
//           <Link to="/profile">
//             <span
//               style={{ fontSize: "25px" }}
//               class="material-symbols-outlined"
//             >
//               account_circle
//             </span>
//             Profile
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  return (
    <div
      className={`navigation ${visible ? "navbar-visible" : "navbar-hidden"}`}
    >
      <ul className="listWrap">
        <li
          style={{ paddingLeft: "5px" }}
          className={`list ${activeItem === 0 ? "active" : ""}`}
          onClick={() => handleItemClick(0)}
        >
          <Link to="/">
            <i className="icon">
              <span
                style={{ fontSize: "25px" }}
                class="material-symbols-outlined"
              >
                home
              </span>
            </i>
            <span className="text">Home</span>
          </Link>
        </li>
        <li
          className={`list ${activeItem === 1 ? "active" : ""}`}
          onClick={() => handleItemClick(1)}
        >
          <Link to="/about">
            <i className="icon">
              <span
                style={{ fontSize: "25px" }}
                class="material-symbols-outlined"
              >
                page_info
              </span>
            </i>
            <span className="text">About</span>
          </Link>
        </li>
        <li
          className={`list ${activeItem === 2 ? "active" : ""}`}
          onClick={() => handleItemClick(2)}
        >
          <Link to="/profile">
            <i className="icon">
              <span
                style={{ fontSize: "25px" }}
                class="material-symbols-outlined"
              >
                account_circle
              </span>
            </i>
            <span className="text">Profile</span>
          </Link>
        </li>
        <li
          className={`list ${activeItem === 3 ? "active" : ""}`}
          onClick={() => handleItemClick(3)}
        >
          <Link to="/contact">
            <i className="icon">
              <span
                style={{ fontSize: "25px" }}
                className="material-symbols-outlined"
              >
                emoji_people
              </span>
            </i>
            <span className="text">Contacts</span>
          </Link>
        </li>
        <li className="indicator"></li>
      </ul>
    </div>
  );
};

export default Navbar;
