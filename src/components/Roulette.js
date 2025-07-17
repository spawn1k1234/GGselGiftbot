import React, { useState, useEffect } from "react";
import { database, ref, get, update, set } from "../firebase"; // Убедись, что путь правильный!

const rewards = [0, 2, 5, 10, 20, 25];

const Roulette = ({ userId }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [coins, setCoins] = useState(0);

  // Функция для получения монет из базы данных
  useEffect(() => {
    if (!userId) return; // Если нет userId, ничего не делать
    const fetchCoins = async () => {
      const userRef = ref(database, `users/${userId}`); // Получаем ссылку на пользователя
      const snapshot = await get(userRef); // Получаем данные пользователя из базы данных

      // Проверяем, существуют ли данные
      if (snapshot.exists()) {
        const data = snapshot.val(); // Если существуют, получаем их
        setCoins(data.coins || 0); // Устанавливаем монеты
      } else {
        console.error("Пользователь не найден в базе данных.");
      }
    };
    fetchCoins(); // Запускаем функцию
  }, [userId]); // Слушаем изменение userId

  // Функция для кручения рулетки
  const spinRoulette = async () => {
    if (spinning || coins < 2) {
      alert("Недостаточно монет или рулетка уже крутится");
      return;
    }

    setSpinning(true); // Устанавливаем статус крутящегося
    setResult(null); // Сбрасываем результат

    const prize = rewards[Math.floor(Math.random() * rewards.length)]; // Случайный приз

    setTimeout(async () => {
      const newCoins = coins - 2 + prize; // Обновляем количество монет
      const timestamp = Date.now(); // Берем текущий timestamp

      // Обновляем количество монет в базе данных
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

      setCoins(newCoins); // Обновляем состояние монет
      setResult(prize); // Обновляем результат
      setSpinning(false); // Устанавливаем статус "не крутится"
    }, 2500); // Задержка для эффекта кручения
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>🎰 Рулетка</h2>
      <p>Монеты: {coins}</p>

      <button
        onClick={spinRoulette} // При клике запускается рулетка
        disabled={spinning || coins < 2} // Если крутится или монет меньше 2 - кнопка не активна
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
