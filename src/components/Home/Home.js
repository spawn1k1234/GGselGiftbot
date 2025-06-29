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
          <h1 className="conteinerlogotitl">
            GGselGift{" "}
            <span className="spanggiftuser">- {userData.username}</span>
          </h1>
        </div>

        {/* <h2>Выберите роль:</h2>
        <button onClick={() => navigate("/seller/step1")}>Я продавец</button>
        <button onClick={() => navigate("/buyer/enter-code")}>
          Я покупатель
        </button> */}
      </div>
      <div className="contbakdrtit">
        <h1 className="h1greit">
          Добро пожаловать, {userData.username}
          <br></br>в <span className="span_h1greit">GGselGift</span> — ваш
          надежный помощник в продаже NFT-подарков!
        </h1>
      </div>
      <div class="slider">
        <div class="slide-track">
          <a href="#">
            <img
              src="https://images.icon-icons.com/3261/PNG/512/steam_logo_icon_206670.png"
              alt="Image 1"
            />
            Steam
          </a>
          <a href="#">
            <img
              src="https://cdn-icons-png.freepik.com/512/7/7719.png"
              alt="Image 2"
            />
            GGselGift
          </a>
          <a href="#">
            <img
              src="https://zefirka.club/uploads/posts/2023-01/1673605353_6-zefirka-club-p-ikonka-telegramma-chernaya-7.png"
              alt="Image 3"
            />
            Telegram
          </a>
          <a href="#">
            <img
              src="https://icons.veryicon.com/png/o/commerce-shopping/poly-budget-icon-library/gift-111.png"
              alt="Image 4"
            />
            GiftTON
          </a>
          <a href="#">
            <img
              src="https://images.icon-icons.com/2428/PNG/512/epic_games_black_logo_icon_147139.png"
              alt="Image 5"
            />
            EpicGames
          </a>

          <a href="#">
            <img
              src="https://images.icon-icons.com/3261/PNG/512/steam_logo_icon_206670.png"
              alt="Image 1"
            />
            Steam
          </a>
          <a href="#">
            <img
              src="https://cdn-icons-png.freepik.com/512/7/7719.png"
              alt="Image 2"
            />
            GGselGift
          </a>
          <a href="#">
            <img
              src="https://zefirka.club/uploads/posts/2023-01/1673605353_6-zefirka-club-p-ikonka-telegramma-chernaya-7.png"
              alt="Image 3"
            />
            Telegram
          </a>
          <a href="#">
            <img
              src="https://icons.veryicon.com/png/o/commerce-shopping/poly-budget-icon-library/gift-111.png"
              alt="Image 4"
            />
            GiftTON
          </a>
          <a href="#">
            <img
              src="https://images.icon-icons.com/2428/PNG/512/epic_games_black_logo_icon_147139.png"
              alt="Image 5"
            />
            EpicGames
          </a>
        </div>
      </div>
      <div className="flexscontthear">
        <div className="etxdiv"></div>
        <div className="etxdiv"></div>
        <div className="etxdiv"></div>
        <div className="etxdiv"></div>
        <div className="etxdiv"></div>
        {/* <div className="etxdiv"></div> */}
      </div>
      {/* <img
        className="imgmain"
        src="https://c-p.rmcdn1.net/5bf7ef2ff5d18d046b6e678d/2810850/upload-ddd270af-e36a-425b-88d1-485a0b515133.gif"
      ></img> */}
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
