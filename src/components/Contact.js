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
import React, { useEffect, useState } from "react";
// Импорты должны идти на уровень выше (../)
import { database, ref, set, get } from "../firebase";
import TonConnector from "../TonConnector";

const Contact = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      // Проверяем/создаем ID пользователя
      let id = localStorage.getItem("casinoUserId");

      if (!id) {
        id = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("casinoUserId", id);
      }

      setUserId(id);

      // Инициализируем данные пользователя в Firebase
      const userRef = ref(database, `casinoord/${id}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await set(userRef, {
          createdAt: Date.now(),
          visits: 1,
          coins: 0,
          lastVisit: Date.now(),
        });
      } else {
        await set(
          userRef,
          {
            visits: (snapshot.val().visits || 0) + 1,
            lastVisit: Date.now(),
          },
          { merge: true }
        );
      }

      setLoading(false);
    };

    initializeUser();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#0088cc", marginBottom: "30px" }}>TON Casino</h1>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Your Account</h2>
        {userId && <TonConnector userId={userId} />}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>How it works:</h3>
        <ol style={{ textAlign: "left", maxWidth: "500px", margin: "0 auto" }}>
          <li>Connect your TON wallet</li>
          <li>Buy coins (minimum 10 coins for 0.04 TON)</li>
          <li>Use coins to play games (coming soon)</li>
        </ol>
      </div>
    </div>
  );
};

export default Contact;
