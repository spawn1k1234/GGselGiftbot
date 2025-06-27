// import React, { useState, useEffect } from "react";
// import { Route, Routes, useNavigate } from "react-router-dom"; // Убираем BrowserRouter, он уже есть в index.js
// import Navbar from "./components/Navbar";
// import Home from "./components/Home";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import Profile from "./components/Profile";

// const App = () => {
//   const [userData, setUserData] = useState(null);
//   const [isFirstVisit, setIsFirstVisit] = useState(true);

//   useEffect(() => {
//     // const hasVisited = localStorage.getItem("hasVisited");
//     // if (hasVisited) {
//     //   setIsFirstVisit(false);
//     // }

//     // Загружаем данные пользователя
//     if (window.Telegram && window.Telegram.WebApp) {
//       const user = window.Telegram.WebApp.initDataUnsafe;
//       const data = {
//         username: user?.user?.username || "GGselGift",
//         userId: user?.user?.id || "Неизвестно",
//         phoneNumber: user?.user?.phone_number || "Неизвестно",
//         avatar:
//           user?.user?.photo_url ||
//           "https://play-lh.googleusercontent.com/6qypk6ZxEJJ6rDPTAumSB1-Y7CjFzC54vmYzOsAdplmp8QKPk1kzScJyXSmau2aaWQ",
//       };
//       setUserData(data);
//     }
//   }, []);

//   const navigate = useNavigate();

//   // Функция для обработки нажатия кнопки "Присоединиться"
//   const handleJoinClick = () => {
//     localStorage.setItem("hasVisited", "true"); // Сохраняем, что пользователь зашел
//     setIsFirstVisit(false); // Останавливаем показ вступительной страницы
//     navigate("/"); // Перенаправляем на главную страницу
//   };

//   if (!userData) {
//     return <div>Загрузка...</div>;
//   }

//   return (
//     <>
//       {isFirstVisit && (
//         <Routes>
//           <Route
//             path="/"
//             element={<Profile userData={userData} onJoin={handleJoinClick} />}
//           />
//         </Routes>
//       )}

//       {!isFirstVisit && (
//         <>
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home userData={userData} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route
//               path="/profile"
//               element={<Profile userData={userData} onJoin={handleJoinClick} />}
//             />
//           </Routes>
//         </>
//       )}
//     </>
//   );
// };

// export default App;
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import UserAuth from "./components/UserAuth/UserAuth";
import AnimatedBackgroundMainlog from "./components/AnimatedBackgroundMainlog/AnimatedBackgroundMainlog";

// 👇 Добавь эти импорты
import Step1 from "./components/SellerFlow/Step1";
import Step2 from "./components/SellerFlow/Step2";
import Step3 from "./components/SellerFlow/Step3";
import OrderCreated from "./components/SellerFlow/OrderCreated";
import EnterCode from "./components/BuyerFlow/EnterCode";
import OrderView from "./components/BuyerFlow/OrderView";

import "./App.css";

const App = () => {
  const [userData, setUserData] = useState({
    username: "Неизвестно",
    userId: "Неизвестно",
    phoneNumber: "Неизвестно",
    avatar: "https://example.com/default-avatar.jpg",
  });
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  console.log("userData in App:", userData);

  return (
    <>
      {isFirstVisit ? (
        <Routes>
          <Route
            path="/"
            element={
              <UserAuth
                setUserData={setUserData}
                setIsFirstVisit={setIsFirstVisit}
              />
            }
          />
        </Routes>
      ) : (
        <>
          <AnimatedBackgroundMainlog />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home userData={userData} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile userData={userData} />} />
            <Route path="/seller/step1" element={<Step1 />} />
            <Route path="/seller/step2" element={<Step2 />} />
            <Route path="/seller/step3" element={<Step3 />} />
            <Route path="/seller/order-created" element={<OrderCreated />} />
            <Route path="/buyer/enter-code" element={<EnterCode />} />
            <Route path="/buyer/order-view" element={<OrderView />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
