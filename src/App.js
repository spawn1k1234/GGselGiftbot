// import React, { useState } from "react";
// import { Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar/Navbar";
// import Home from "./components/Home/Home";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import Profile from "./components/Profile";
// import UserAuth from "./components/UserAuth/UserAuth";
// import AnimatedBackgroundMainlog from "./components/AnimatedBackgroundMainlog/AnimatedBackgroundMainlog";

// // 👇 Добавь эти импорты
// import Step1 from "./components/SellerFlow/Step1";
// import Step2 from "./components/SellerFlow/Step2";
// import Step3 from "./components/SellerFlow/Step3";
// import OrderCreated from "./components/SellerFlow/OrderCreated";
// import EnterCode from "./components/BuyerFlow/EnterCode";
// import OrderView from "./components/BuyerFlow/OrderView";
// import Intro from "./components/Intro/Intro";

// import "./App.css";

// const App = () => {
//   const [userData, setUserData] = useState({
//     username: "Неизвестно",
//     userId: "Неизвестно",
//     phoneNumber: "Неизвестно",
//     avatar: "https://example.com/default-avatar.jpg",
//   });
//   const [isFirstVisit, setIsFirstVisit] = useState(true);
//   const [showIntro, setShowIntro] = useState(true);
//   const handleIntroFinish = () => {
//     setShowIntro(false);
//   };

//   console.log("userData in App:", userData);

//   return (
//     <>
//       {showIntro ? (
//         <Intro onFinish={handleIntroFinish} />
//       ) : isFirstVisit ? (
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <UserAuth
//                 setUserData={setUserData}
//                 setIsFirstVisit={setIsFirstVisit}
//               />
//             }
//           />
//         </Routes>
//       ) : (
//         <>
//           <AnimatedBackgroundMainlog />
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home userData={userData} />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/profile" element={<Profile userData={userData} />} />
//             <Route path="/seller/step1" element={<Step1 />} />
//             <Route path="/seller/step2" element={<Step2 />} />
//             <Route path="/seller/step3" element={<Step3 />} />
//             <Route path="/seller/order-created" element={<OrderCreated />} />
//             <Route path="/buyer/enter-code" element={<EnterCode />} />
//             <Route path="/buyer/order-view" element={<OrderView />} />
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
