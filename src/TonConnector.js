// import React, { useState } from "react";
// import {
//   useTonConnectUI,
//   useTonAddress,
//   useTonWallet,
// } from "@tonconnect/ui-react";
// import { database, ref, set } from "./firebase";

// const TonConnector = ({ userId }) => {
//   const [tonConnectUI] = useTonConnectUI();
//   const walletAddress = useTonAddress();
//   const wallet = useTonWallet();
//   const [coins, setCoins] = useState(0);
//   const [amount, setAmount] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [txStatus, setTxStatus] = useState("");
//   const [connectionError, setConnectionError] = useState("");

//   const RECIPIENT_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";
//   const tonAmount = amount * 0.004;
//   const nanoAmount = Math.floor(tonAmount * 1e9).toString();

//   const buyCoins = async () => {
//     if (!wallet) {
//       setConnectionError("Кошелек не подключен");
//       return;
//     }

//     setLoading(true);
//     setTxStatus("Подготовка транзакции...");

//     try {
//       const transaction = {
//         validUntil: Math.floor(Date.now() / 1000) + 300,
//         messages: [
//           {
//             address: RECIPIENT_ADDRESS,
//             amount: nanoAmount,
//             // Убираем payload, если вызывает ошибку:
//             // payload: encodePayload({...})
//           },
//         ],
//       };

//       console.log("Sending TX:", transaction);

//       const result = await tonConnectUI.sendTransaction(transaction);

//       if (!result?.boc) throw new Error("Не получен хеш транзакции");

//       const newCoins = coins + amount;
//       setCoins(newCoins);
//       setTxStatus(`Успешно! ${amount} монет зачислено.`);

//       // Сохраняем успешную транзакцию
//       const txRef = ref(database, `users/${userId}/transactions/${Date.now()}`);
//       await set(
//         txRef,
//         {
//           amount,
//           tonAmount,
//           status: "completed",
//           txHash: result.boc,
//           timestamp: Date.now(),
//         },
//         { merge: true }
//       );
//     } catch (error) {
//       console.error("TX error:", error);

//       let errorMessage = "Ошибка транзакции";
//       const msg = error.message || "";

//       if (msg.includes("Payload"))
//         errorMessage = "Некорректные параметры платежа";
//       else if (msg.includes("User rejected"))
//         errorMessage = "Вы отменили транзакцию";
//       else if (msg.includes("insufficient"))
//         errorMessage = "Недостаточно средств";
//       else if (msg.includes("Request to the wallet contains errors")) {
//         errorMessage = "Ошибка в реквизитах транзакции";
//       }

//       setTxStatus(errorMessage);
//       setConnectionError(errorMessage);

//       const txRef = ref(database, `users/${userId}/transactions/${Date.now()}`);
//       await set(
//         txRef,
//         {
//           amount,
//           tonAmount,
//           status: "failed",
//           error: errorMessage,
//           errorDetails: msg,
//           timestamp: Date.now(),
//         },
//         { merge: true }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConnectWallet = async () => {
//     try {
//       setConnectionError("");
//       await tonConnectUI.connectWallet();
//     } catch (error) {
//       console.error("Connect error:", error);
//       setConnectionError("Не удалось подключить кошелек TON");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
//       {connectionError && (
//         <div
//           style={{
//             padding: 15,
//             background: "#ffebee",
//             color: "#c62828",
//             borderRadius: 8,
//             marginBottom: 20,
//           }}
//         >
//           {connectionError}
//         </div>
//       )}

//       {wallet ? (
//         <>
//           <h2>TON Казино</h2>
//           <p>
//             Кошелек: {walletAddress?.slice(0, 6)}…{walletAddress?.slice(-4)}
//           </p>
//           <p>Монеты: {coins}</p>

//           <h3>Купить монеты</h3>
//           <input
//             type="number"
//             min="10"
//             value={amount}
//             onChange={(e) => setAmount(Math.max(10, Number(e.target.value)))}
//             style={{ width: "100%", padding: 10, margin: "10px 0" }}
//           />
//           <p>Стоимость: {tonAmount.toFixed(3)} TON</p>
//           <button
//             onClick={buyCoins}
//             disabled={loading}
//             style={{
//               padding: 12,
//               width: "100%",
//               background: loading ? "#ccc" : "#1976d2",
//               color: "white",
//               border: "none",
//               borderRadius: 8,
//               cursor: "pointer",
//             }}
//           >
//             {loading ? "Обработка..." : "Купить"}
//           </button>

//           {txStatus && (
//             <div
//               style={{
//                 marginTop: 20,
//                 padding: 10,
//                 background: txStatus.includes("Успешно")
//                   ? "#e8f5e9"
//                   : "#ffebee",
//                 color: txStatus.includes("Успешно") ? "#2e7d32" : "#c62828",
//                 borderRadius: 8,
//               }}
//             >
//               {txStatus}
//             </div>
//           )}
//         </>
//       ) : (
//         <button
//           onClick={handleConnectWallet}
//           style={{
//             padding: "15px 30px",
//             background: "#1976d2",
//             color: "white",
//             border: "none",
//             borderRadius: 8,
//             fontSize: 16,
//             cursor: "pointer",
//           }}
//         >
//           Подключить TON кошелек
//         </button>
//       )}
//     </div>
//   );
// };

// export default TonConnector;
import React, { useState, useEffect } from "react";
import {
  useTonConnectUI,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";
import { database, ref, set, get } from "./firebase"; // ✅ get добавлен

const TonConnector = ({ telegramUserId }) => {
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const wallet = useTonWallet();
  const [coins, setCoins] = useState(0);
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [connectionError, setConnectionError] = useState("");

  const RECIPIENT_ADDRESS = "UQAEbqdLmHY-gxbUG9eqeldLX8yQDjUDOo1R5NHYjlpIlGet";
  const tonAmount = amount * 0.002;
  const nanoAmount = Math.floor(tonAmount * 1e9).toString();

  // Загружаем данные пользователя по ID Telegram
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(database, `users/${telegramUserId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData?.coins) {
            setCoins(userData.coins);
          }
        } else {
          // Если данных нет, создаем нового пользователя с сохранением ID Telegram
          await set(userRef, {
            telegramUserId, // Сохраняем ID пользователя Telegram
            coins: 0,
            lastPurchase: Date.now(),
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке монет из Firebase:", error);
      }
    };

    if (telegramUserId) {
      fetchUserData();
    }
  }, [telegramUserId]);

  const buyCoins = async () => {
    if (!wallet) {
      setConnectionError("Кошелек не подключен");
      return;
    }

    setLoading(true);
    setTxStatus("Подготовка транзакции...");

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: RECIPIENT_ADDRESS,
            amount: nanoAmount,
          },
        ],
      };

      console.log("Sending TX:", transaction);

      const result = await tonConnectUI.sendTransaction(transaction);

      if (!result?.boc) throw new Error("Не получен хеш транзакции");

      const newCoins = coins + amount;
      setCoins(newCoins);
      setTxStatus(`Успешно! ${amount} монет зачислено.`);

      const userRef = ref(database, `users/${telegramUserId}`);
      await set(userRef, {
        coins: newCoins,
        lastPurchase: Date.now(),
      });

      const txRef = ref(
        database,
        `users/${telegramUserId}/transactions/${Date.now()}`
      );
      await set(txRef, {
        amount,
        tonAmount,
        status: "completed",
        txHash: result.boc,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("TX error:", error);

      let errorMessage = "Ошибка транзакции";
      const msg = error.message || "";

      if (msg.includes("Payload"))
        errorMessage = "Некорректные параметры платежа";
      else if (msg.includes("User rejected"))
        errorMessage = "Вы отменили транзакцию";
      else if (msg.includes("insufficient"))
        errorMessage = "Недостаточно средств";
      else if (msg.includes("Request to the wallet contains errors")) {
        errorMessage = "Ошибка в реквизитах транзакции";
      }

      setTxStatus(errorMessage);
      setConnectionError(errorMessage);

      const txRef = ref(
        database,
        `users/${telegramUserId}/transactions/${Date.now()}`
      );
      await set(txRef, {
        amount,
        tonAmount,
        status: "failed",
        error: errorMessage,
        errorDetails: msg,
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpendCoin = async () => {
    if (coins <= 0) {
      setTxStatus("Недостаточно монет для траты.");
      return;
    }

    const newCoins = coins - 1;
    setCoins(newCoins);
    setTxStatus(`1 монета потрачена. Баланс: ${newCoins} монет.`);

    const userRef = ref(database, `users/${telegramUserId}`);
    await set(userRef, {
      coins: newCoins,
      lastPurchase: Date.now(),
    });

    const txRef = ref(
      database,
      `users/${telegramUserId}/transactions/${Date.now()}`
    );
    await set(txRef, {
      amount: -1,
      tonAmount: 0,
      status: "spent",
      timestamp: Date.now(),
    });
  };

  const handleConnectWallet = async () => {
    try {
      setConnectionError("");
      await tonConnectUI.connectWallet();
    } catch (error) {
      console.error("Connect error:", error);
      setConnectionError("Не удалось подключить кошелек TON");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      {connectionError && (
        <div
          style={{
            padding: 15,
            background: "#ffebee",
            color: "#c62828",
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          {connectionError}
        </div>
      )}

      {wallet ? (
        <>
          <h2>TON Казино</h2>
          <p>
            Кошелек: {walletAddress?.slice(0, 6)}…{walletAddress?.slice(-4)}
          </p>
          <p>Монеты: {coins}</p>

          <h3>Купить монеты</h3>
          <input
            type="number"
            min="10"
            value={amount}
            onChange={(e) => setAmount(Math.max(10, Number(e.target.value)))}
            style={{ width: "100%", padding: 10, margin: "10px 0" }}
          />
          <p>Стоимость: {tonAmount.toFixed(3)} TON</p>
          <button
            onClick={buyCoins}
            disabled={loading}
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
            {loading ? "Обработка..." : "Купить"}
          </button>

          <h3>Потратить 1 монету</h3>
          <button
            onClick={handleSpendCoin}
            disabled={coins <= 0}
            style={{
              padding: 12,
              width: "100%",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Потратить 1 монету
          </button>

          {txStatus && (
            <div
              style={{
                marginTop: 20,
                padding: 10,
                background: txStatus.includes("Успешно")
                  ? "#e8f5e9"
                  : "#ffebee",
                color: txStatus.includes("Успешно") ? "#2e7d32" : "#c62828",
                borderRadius: 8,
              }}
            >
              {txStatus}
            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleConnectWallet}
          style={{
            padding: "15px 30px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Подключить TON кошелек
        </button>
      )}
    </div>
  );
};

export default TonConnector;
