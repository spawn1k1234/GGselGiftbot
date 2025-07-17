// import React, { useState, useEffect } from "react";
// import { database, ref, get, update, set } from "../firebase";
// import "./Contact.css";

// const Roulette = ({ userId, coins, setCoins }) => {
//   const [betAmount, setBetAmount] = useState(0);
//   const [gameResult, setGameResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [txStatus, setTxStatus] = useState("");

//   useEffect(() => {
//     if (!userId) return;
//     const userRef = ref(database, `users/${userId}`);

//     // Получаем данные о монетах пользователя из Firebase
//     get(userRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setCoins(data.coins || 0); // Устанавливаем количество монет
//       }
//     });
//   }, [userId, setCoins]);

//   const spinRoulette = async () => {
//     if (betAmount <= 0 || betAmount > coins) {
//       setTxStatus("Некорректная сумма ставки.");
//       return;
//     }

//     setLoading(true);
//     setTxStatus("Игровая сессия началась...");

//     // Имитируем процесс игры
//     const randomResult = Math.random() < 0.5 ? "win" : "lose"; // 50% вероятность выигрыша

//     const newCoins =
//       randomResult === "win" ? coins + betAmount : coins - betAmount;
//     const timestamp = Date.now();

//     try {
//       // Обновляем количество монет
//       await update(ref(database, `users/${userId}`), { coins: newCoins });
//       setCoins(newCoins);

//       // Записываем транзакцию
//       await set(ref(database, `users/${userId}/transactions/${timestamp}`), {
//         amount: randomResult === "win" ? betAmount : -betAmount,
//         status: randomResult === "win" ? "won" : "lost",
//         timestamp,
//       });

//       setGameResult(randomResult);
//       setTxStatus(
//         `Вы ${
//           randomResult === "win" ? "выиграли" : "проиграли"
//         } ${betAmount} монет!`
//       );
//     } catch (error) {
//       console.error("Ошибка игры:", error);
//       setTxStatus("Произошла ошибка, попробуйте позже.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
//       <h2 className="titrul">Игра в Рулетку</h2>
//       <p className="cointsyou">Ваши монеты: {coins}</p>

//       <input
//         type="number"
//         value={betAmount}
//         onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value)))}
//         style={{ padding: 8, marginBottom: 20, width: "100%" }}
//         placeholder="Введите ставку"
//       />

//       <button
//         onClick={spinRoulette}
//         disabled={loading || betAmount <= 0 || betAmount > coins}
//         style={{
//           padding: 12,
//           width: "100%",
//           background: loading ? "#ccc" : "#1976d2",
//           color: "white",
//           border: "none",
//           borderRadius: 8,
//           cursor: "pointer",
//         }}
//       >
//         {loading ? "Игра идет..." : "Крутить рулетку"}
//       </button>

//       {txStatus && (
//         <div
//           style={{
//             marginTop: 20,
//             padding: 10,
//             background: txStatus.includes("выиграли") ? "#e8f5e9" : "#ffebee",
//             color: txStatus.includes("выиграли") ? "#2e7d32" : "#c62828",
//             borderRadius: 8,
//           }}
//         >
//           {txStatus}
//         </div>
//       )}

//       {gameResult && (
//         <div style={{ marginTop: 20 }}>
//           <h3 className="resulth1">Результат игры:</h3>
//           <p className="pclass_nam">
//             {gameResult === "win" ? "Вы выиграли!" : "Вы проиграли."}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Roulette;
import React, { useState, useEffect, useRef } from "react";
import { database, ref, get, update, set } from "../firebase";
import "./Contact.css";

const SlotRoulette = ({ userId, coins, setCoins }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [gameResult, setGameResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [winAmount, setWinAmount] = useState(0);

  const slots = [
    { value: 0, multiplier: 0, color: "#FF5252" },
    { value: 0.5, multiplier: 0.5, color: "#FFD740" },
    { value: 1, multiplier: 1, color: "#69F0AE" },
    { value: 2, multiplier: 2, color: "#40C4FF" },
    { value: 3, multiplier: 3, color: "#E040FB" },
    { value: 5, multiplier: 5, color: "#FF9800" },
    { value: 10, multiplier: 10, color: "#4CAF50" },
    { value: 0, multiplier: 0, color: "#FF5252" },
    { value: 0.5, multiplier: 0.5, color: "#FFD740" },
    { value: 1, multiplier: 1, color: "#69F0AE" },
  ];

  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const spinDuration = 3000; // 3 секунды анимация

  useEffect(() => {
    if (!userId) return;
    const userRef = ref(database, `users/${userId}`);

    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCoins(data.coins || 0);
      }
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [userId, setCoins]);

  const getWeightedResult = () => {
    // Вероятности для каждого слота (чем выше множитель, тем меньше вероятность)
    const weights = {
      0: 30, // 30% вероятность
      0.5: 25, // 25% вероятность
      1: 20, // 20% вероятность
      2: 12, // 12% вероятность
      3: 8, // 8% вероятность
      5: 4, // 4% вероятность
      10: 1, // 1% вероятность
    };

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (const [value, weight] of Object.entries(weights)) {
      if (random < weight) {
        return parseFloat(value);
      }
      random -= weight;
    }

    return 0; // fallback
  };

  const spinRoulette = async () => {
    if (betAmount <= 0 || betAmount > coins) {
      setTxStatus("Некорректная сумма ставки.");
      return;
    }

    setLoading(true);
    setSpinning(true);
    setTxStatus("Крутим рулетку...");
    setGameResult(null);

    // Получаем "взвешенный" результат
    const resultMultiplier = getWeightedResult();
    const resultIndex = slots.findIndex(
      (slot) => slot.multiplier === resultMultiplier
    );

    // Анимация прокрутки
    const startPosition = currentPosition;
    const targetPosition = resultIndex * 100; // 100px ширина каждого слота
    const totalSlots = slots.length;

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing функция для замедления в конце
      const easing = (t) => t * t * t;
      const easedProgress = easing(progress);

      // Количество "виртуальных" прокрученных слотов
      const virtualSlots = 20 + easedProgress * totalSlots * 2;

      // Текущая позиция с замедлением в конце
      const current =
        startPosition +
        virtualSlots * 100 +
        easedProgress * (targetPosition - startPosition);

      setCurrentPosition(current % (totalSlots * 100));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        finishSpin(resultMultiplier);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const finishSpin = async (multiplier) => {
    setSpinning(false);

    const win = Math.floor(betAmount * multiplier);
    setWinAmount(win);
    const isWin = win > 0;

    const newCoins = coins + (isWin ? win : -betAmount);
    const timestamp = Date.now();

    try {
      await update(ref(database, `users/${userId}`), { coins: newCoins });
      setCoins(newCoins);

      await set(ref(database, `users/${userId}/transactions/${timestamp}`), {
        amount: isWin ? win : -betAmount,
        status: isWin ? "won" : "lost",
        timestamp,
      });

      setGameResult(isWin ? "win" : "lose");
      setTxStatus(
        isWin
          ? `Вы выиграли ${win} монет (x${multiplier})!`
          : `Вы проиграли ${betAmount} монет. Попробуйте еще!`
      );

      // Если почти выиграли (но множитель маленький)
      if (multiplier > 0 && multiplier < 1) {
        setTimeout(() => {
          setTxStatus(
            (prev) =>
              prev + " Почти получилось! Следующая попытка может быть удачнее!"
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Ошибка игры:", error);
      setTxStatus("Произошла ошибка, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2 className="titrul">Слот-Рулетка</h2>
      <p className="cointsyou">Ваши монеты: {coins}</p>

      <div
        style={{
          position: "relative",
          height: 100,
          margin: "40px 0",
          overflow: "hidden",
          border: "2px solid #333",
          borderRadius: 10,
        }}
      >
        {/* Полоска с квадратами */}
        <div
          ref={containerRef}
          style={{
            display: "flex",
            position: "absolute",
            left: `calc(50% - 50px - ${currentPosition}px)`,
            height: "100%",
            transition: spinning ? "none" : "left 0.5s ease-out",
          }}
        >
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                width: 100,
                height: "100%",
                background: slot.color,
                border: "1px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              x{slot.multiplier}
            </div>
          ))}
          {/* Дублируем для бесконечной прокрутки */}
          {slots.map((slot, index) => (
            <div
              key={`dup-${index}`}
              style={{
                width: 100,
                height: "100%",
                background: slot.color,
                border: "1px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              x{slot.multiplier}
            </div>
          ))}
        </div>

        {/* Стрелка */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: 0,
            height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "30px solid #ff0000",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Сумма ставки:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) =>
            setBetAmount(Math.max(1, parseInt(e.target.value) || 1))
          }
          style={{ padding: 8, width: "100%" }}
          disabled={spinning}
          min="1"
          step="1"
        />
      </div>

      <button
        onClick={spinRoulette}
        disabled={loading || spinning || betAmount <= 0 || betAmount > coins}
        style={{
          padding: 12,
          width: "100%",
          background: spinning ? "#ccc" : "#1976d2",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {spinning ? "Крутим..." : `Крутить (ставка: ${betAmount} монет)`}
      </button>

      {txStatus && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: gameResult === "win" ? "#e8f5e9" : "#ffebee",
            color: gameResult === "win" ? "#2e7d32" : "#c62828",
            borderRadius: 8,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {txStatus}
        </div>
      )}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <h4>Возможные выигрыши:</h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[...new Set(slots.map((slot) => slot.multiplier))].map((mult, i) => (
            <div
              key={i}
              style={{
                margin: 5,
                padding: "5px 10px",
                background: slots.find((s) => s.multiplier === mult).color,
                borderRadius: 5,
                fontWeight: "bold",
              }}
            >
              x{mult} = {betAmount * mult} монет
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotRoulette;
