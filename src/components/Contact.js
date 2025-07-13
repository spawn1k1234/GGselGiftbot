// import React from "react";

// const Contact = () => {
//   return (
//     <div style={{ padding: "50px", textAlign: "center" }}>
//       <h1>Контакты</h1>
//       <p>Свяжитесь с нами через email: contact@yourapp.com</p>
//     </div>
//   );
// };

// export default Contact;
import React, { useState, useEffect } from "react";
import { database, ref, set, get, onValue } from "./firebase-config";

const WalletIntegration = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [stars, setStars] = useState(0);
  const [userId, setUserId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      setUserId(tg.initDataUnsafe.user?.id.toString());

      // Загружаем данные пользователя из Firebase
      if (tg.initDataUnsafe.user?.id) {
        const userRef = ref(database, "users/" + tg.initDataUnsafe.user.id);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserBalance(data.balance || 0);
            setStars(data.stars || 0);
          }
        });
      }
    }
  }, []);

  // Функция для создания платежа
  const createPayment = (amount) => {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe.user?.id;

    if (!userId) return;

    // Генерируем уникальный ID для платежа
    const paymentId = Date.now().toString();

    // Сохраняем информацию о платеже в Firebase
    const paymentRef = ref(database, `payments/${paymentId}`);
    set(paymentRef, {
      userId: userId,
      amount: amount,
      status: "pending",
      timestamp: Date.now(),
    });

    // Создаем URL для оплаты через Telegram Wallet
    const walletUrl = `https://t.me/wallet?startattach=UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7&amount=${
      amount * 1000000
    }&currency=TON&start_param=${paymentId}`;
    setPaymentUrl(walletUrl);

    // Открываем платежное окно
    tg.openInvoice(walletUrl, (status) => {
      if (status === "paid") {
        // Платеж успешен
        const starsToAdd = amount * 10; // 10 звездочек за 10 центов
        updateUserBalance(userId, starsToAdd);

        // Обновляем статус платежа
        set(paymentRef, {
          status: "completed",
          starsAdded: starsToAdd,
        });
      }
    });
  };

  // Обновление баланса пользователя
  const updateUserBalance = (userId, starsToAdd) => {
    const userRef = ref(database, "users/" + userId);
    get(userRef).then((snapshot) => {
      const currentData = snapshot.val() || { stars: 0 };
      const newStars = (currentData.stars || 0) + starsToAdd;

      set(userRef, {
        ...currentData,
        stars: newStars,
        lastUpdate: Date.now(),
      });

      setStars(newStars);
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Ваш кошелек</h2>
      <p>Ваш ID: {userId || "не определен"}</p>
      <p>Звездочек: {stars}</p>

      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => createPayment(10)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0088cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Купить 10 звездочек за 10 центов
        </button>
      </div>

      {paymentUrl && (
        <p style={{ marginTop: "20px" }}>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
            Открыть платеж в Telegram
          </a>
        </p>
      )}
    </div>
  );
};

export default WalletIntegration;
