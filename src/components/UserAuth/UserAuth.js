// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const UserAuth = ({ setUserData, setIsFirstVisit }) => {
//   const [loading, setLoading] = useState(true);
//   const [hasClickedJoin, setHasClickedJoin] = useState(false); // Для отслеживания клика
//   const [userData, setUserDataLocal] = useState(null); // Локальное состояние для данных пользователя
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Загружаем данные пользователя (например, из Telegram WebApp)
//     if (window.Telegram && window.Telegram.WebApp) {
//       const user = window.Telegram.WebApp.initDataUnsafe;
//       console.log("user data in UserAuth:", user); // Логируем данные пользователя для проверки

//       if (user && user.user) {
//         // Если пользователь есть, загружаем его данные
//         const data = {
//           username: user.user.username || "Неизвестно",
//           userId: user.user.id || "Неизвестно",
//           phoneNumber: user.user.phone_number || "Неизвестно",
//           avatar:
//             user.user.photo_url || "https://example.com/default-avatar.jpg",
//         };

//         setUserDataLocal(data); // Устанавливаем локальные данные пользователя
//         setUserData(data); // Устанавливаем данные в родительский компонент
//         console.log("setUserData called with:", data); // Логируем, когда данные установлены
//       } else {
//         console.log("Данные пользователя не найдены.");
//       }

//       setLoading(false); // Загрузка завершена
//     } else {
//       console.log("Telegram WebApp не найден.");
//       setLoading(false); // Если WebApp не доступен, считаем загрузку завершенной
//     }
//   }, [setIsFirstVisit, setUserData]);

//   const handleJoinClick = () => {
//     setHasClickedJoin(true); // Помечаем, что кнопка была нажата
//     setIsFirstVisit(false); // Останавливаем показ вступительной страницы
//     navigate("/"); // Перенаправляем на главную страницу
//   };

//   if (loading) {
//     return <div>Загрузка...</div>;
//   }

//   // Если данные загружены, отображаем их
//   if (userData) {
//     return (
//       <div style={{ padding: "50px", textAlign: "center" }}>
//         <h1>Профиль</h1>
//         <img
//           src={userData.avatar}
//           alt="Avatar"
//           style={{ width: "100px", height: "100px", borderRadius: "50%" }}
//         />
//         <p>
//           <strong>Никнейм:</strong> {userData.username}
//         </p>
//         <p>
//           <strong>Телефон:</strong> {userData.phoneNumber}
//         </p>
//         {/* Показываем кнопку только если она не была нажата */}
//         {!hasClickedJoin && (
//           <button
//             onClick={handleJoinClick}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#4CAF50",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//             }}
//           >
//             Присоединиться
//           </button>
//         )}
//       </div>
//     );
//   }

//   return null;
// };

// export default UserAuth;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import "./UserAuth.css";

const UserAuth = ({ setUserData, setIsFirstVisit }) => {
  const [loading, setLoading] = useState(true);
  const [hasClickedJoin, setHasClickedJoin] = useState(false); // Для отслеживания клика
  const [userData, setUserDataLocal] = useState({
    username: "GGselGift",
    userId: "Неизвестно",
    phoneNumber: "Номер телефона был скрыт",
    avatar:
      "https://play-lh.googleusercontent.com/6qypk6ZxEJJ6rDPTAumSB1-Y7CjFzC54vmYzOsAdplmp8QKPk1kzScJyXSmau2aaWQ",
  }); // Дефолтные данные
  const navigate = useNavigate();

  useEffect(() => {
    // Загружаем данные пользователя (например, из Telegram WebApp)
    const loadData = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe;
        console.log("user data in UserAuth:", user);

        // Если данные пользователя есть, то используем их
        if (user && user.user) {
          const data = {
            username: user.user.username || "GGselGift",
            userId: user.user.id || "Неизвестно",
            phoneNumber: user.user.phone_number || "Номер телефона был скрыт",
            avatar:
              user.user.photo_url ||
              "https://play-lh.googleusercontent.com/6qypk6ZxEJJ6rDPTAumSB1-Y7CjFzC54vmYzOsAdplmp8QKPk1kzScJyXSmau2aaWQ",
          };

          setUserDataLocal(data); // Устанавливаем локальные данные
          setUserData(data); // Устанавливаем данные в родительский компонент
        }
      } else {
        console.log("Telegram WebApp не найден.");
      }
      setLoading(false); // Завершаем загрузку, даже если данные не получены
    };

    loadData(); // Загружаем данные

    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsFirstVisit(false); // Если пользователь уже был, показываем основной контент
    }
  }, [setIsFirstVisit, setUserData]);

  const handleJoinClick = () => {
    setHasClickedJoin(true); // Помечаем, что кнопка была нажата
    setIsFirstVisit(false); // Останавливаем показ вступительной страницы
    localStorage.setItem("hasVisited", "true"); // Сохраняем, что пользователь зашел
    navigate("/"); // Перенаправляем на главную страницу
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <AnimatedBackground />
      <h1 className="titlesh1">Верификация аккаунта</h1>
      <p className="podtitlp">
        Пожалуйста, свяжите свои данные с сервисом для завершения процесса
        верификации.
      </p>
      <div className="imgflex">
        <img
          src={userData.avatar}
          alt="Avatar"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <div className="plusflex">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <img
          className="logo"
          src="https://play-lh.googleusercontent.com/6qypk6ZxEJJ6rDPTAumSB1-Y7CjFzC54vmYzOsAdplmp8QKPk1kzScJyXSmau2aaWQ"
        />
      </div>

      <p className="pdan">{userData.username}</p>
      <p className="pdan">{userData.phoneNumber}</p>
      {/* Показываем кнопку только если она не была нажата */}
      {!hasClickedJoin && (
        <button className="butonstiled" onClick={handleJoinClick}>
          Завершить верификацию
        </button>
      )}
      <div className="solid"></div>
      <footer>
        <p className="pfoot">© GGselGif, все права защищены.</p>
      </footer>
    </div>
  );
};

export default UserAuth;
