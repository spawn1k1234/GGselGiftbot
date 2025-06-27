import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ userData }) => {
  const navigate = useNavigate(); // 💡 добавлено!

  if (!userData || !userData.username) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div className="flexcontHome">
      <div className="divgreit">
        <h1 className="h1greit">Добро пожаловать, {userData.username}</h1>
        <h2>Выберите роль:</h2>
        <button onClick={() => navigate("/seller/step1")}>Я продавец</button>
        <button onClick={() => navigate("/buyer/enter-code")}>
          Я покупатель
        </button>
      </div>
    </div>
  );
};

export default Home;
