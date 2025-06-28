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
        <div className="conteinerlogo">
          <img
            className="logoimg"
            src="https://gglead.net/skin/ggleadv2/ru/images/tild3736-3036-4766-b163-333533623537__favicon_4.ico"
          ></img>
          <h1 className="conteinerlogotitl">GGselGift</h1>
        </div>

        {/* <h2>Выберите роль:</h2>
        <button onClick={() => navigate("/seller/step1")}>Я продавец</button>
        <button onClick={() => navigate("/buyer/enter-code")}>
          Я покупатель
        </button> */}
      </div>
      <div className="contbakdrtit">
        <h1 className="h1greit">
          Добро пожаловать, {userData.username} в{" "}
          <span className="span_h1greit">GGselGift</span> — ваш надежный
          помощник в продаже NFT-подарков!
        </h1>
      </div>

      <div className="contbakdrtitptit">
        <p className="ptit">
          <span className="span_h1greit">GGselGift</span> — это безопасная и
          удобная платформа, созданная специально для продажи NFT-подарков.
          <br />
          <div className="slidecontbakdrtitptit"></div>
          Мы выступаем гарантом сделки между продавцом и покупателем,
          <br />
          обеспечивая обе стороны защитой, прозрачностью и простотой
          взаимодействия.
        </p>
      </div>
    </div>
  );
};

export default Home;
