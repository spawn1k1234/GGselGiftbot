import React, { useState, useEffect } from "react";
import { database, ref, get, update, set } from "../firebase"; // Убедись, что путь правильный!

const rewards = [0, 2, 5, 10, 20, 25];

const Roulette = ({ userId }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [coins, setCoins] = useState(0);

  // Получаем данные о монетах пользователя
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(database, `users/${userId}`);

    // Получаем данные пользователя из Firebase
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCoins(data.coins || 0);
      } else {
        console.log("Пользователь не найден в базе данных.");
      }
    });

    // Слушаем изменения монет
    const coinsRef = ref(database, `users/${userId}/coins`);
    const unsubscribe = onValue(coinsRef, (snapshot) => {
      const coinsData = snapshot.val();
      if (coinsData !== null) {
        setCoins(coinsData);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Функция для кручения рулетки
  const spinRoulette = async () => {
    if (spinning || coins < 2) {
      alert("Недостаточно монет или рулетка уже крутится");
      return;
    }

    setSpinning(true);
    setResult(null);

    const prize = rewards[Math.floor(Math.random() * rewards.length)];

    setTimeout(async () => {
      const newCoins = coins - 2 + prize;
      const timestamp = Date.now();

      // Обновляем монеты пользователя в Firebase
      await update(ref(database, `users/${userId}`), {
        coins: newCoins,
      });

      // Записываем транзакцию
      await set(ref(database, `users/${userId}/transactions/${timestamp}`), {
        amount: prize - 2,
        type: "roulette",
        result: prize,
        cost: 2,
        timestamp,
      });

      setCoins(newCoins);
      setResult(prize);
      setSpinning(false);
    }, 2500);
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>🎰 Рулетка</h2>
      <p>Монеты: {coins}</p>

      <button
        onClick={spinRoulette}
        disabled={spinning || coins < 2}
        style={{
          padding: 15,
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 18,
          cursor: spinning ? "not-allowed" : "pointer",
        }}
      >
        {spinning ? "Крутится..." : "Крутить за 2 монеты"}
      </button>

      {result !== null && (
        <div style={{ marginTop: 20 }}>
          <h3>Результат: {result} монет</h3>
          {result === 0 ? (
            <p style={{ color: "#c62828" }}>Увы, ничего не выиграли 😞</p>
          ) : (
            <p style={{ color: "#2e7d32" }}>Поздравляем! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Roulette;
