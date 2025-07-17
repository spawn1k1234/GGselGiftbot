import React, { useState, useEffect } from "react";
import { database, ref, get, update, set } from "../firebase";

const Roulette = ({ userId, coins, setCoins }) => {
  const [betAmount, setBetAmount] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (!userId) return;
    const userRef = ref(database, `users/${userId}`);

    // Получаем данные о монетах пользователя из Firebase
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCoins(data.coins || 0); // Устанавливаем количество монет
      }
    });
  }, [userId, setCoins]);

  const spinRoulette = async () => {
    if (betAmount <= 0 || betAmount > coins) {
      setTxStatus("Некорректная сумма ставки.");
      return;
    }

    setLoading(true);
    setTxStatus("Игровая сессия началась...");

    // Имитируем процесс игры
    const randomResult = Math.random() < 0.5 ? "win" : "lose"; // 50% вероятность выигрыша

    const newCoins =
      randomResult === "win" ? coins + betAmount : coins - betAmount;
    const timestamp = Date.now();

    try {
      // Обновляем количество монет
      await update(ref(database, `users/${userId}`), { coins: newCoins });
      setCoins(newCoins);

      // Записываем транзакцию
      await set(ref(database, `users/${userId}/transactions/${timestamp}`), {
        amount: randomResult === "win" ? betAmount : -betAmount,
        status: randomResult === "win" ? "won" : "lost",
        timestamp,
      });

      setGameResult(randomResult);
      setTxStatus(
        `Вы ${
          randomResult === "win" ? "выиграли" : "проиграли"
        } ${betAmount} монет!`
      );
    } catch (error) {
      console.error("Ошибка игры:", error);
      setTxStatus("Произошла ошибка, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h2>Игра в Рулетку</h2>
      <p>Ваши монеты: {coins}</p>

      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value)))}
        style={{ padding: 8, marginBottom: 20, width: "100%" }}
        placeholder="Введите ставку"
      />

      <button
        onClick={spinRoulette}
        disabled={loading || betAmount <= 0 || betAmount > coins}
        style={{
          padding: 12,
          width: "100%",
          background: loading ? "#ccc" : "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Игра идет..." : "Крутить рулетку"}
      </button>

      {txStatus && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: txStatus.includes("выиграли") ? "#e8f5e9" : "#ffebee",
            color: txStatus.includes("выиграли") ? "#2e7d32" : "#c62828",
            borderRadius: 8,
          }}
        >
          {txStatus}
        </div>
      )}

      {gameResult && (
        <div style={{ marginTop: 20 }}>
          <h3>Результат игры:</h3>
          <p>{gameResult === "win" ? "Вы выиграли!" : "Вы проиграли."}</p>
        </div>
      )}
    </div>
  );
};

export default Roulette;
