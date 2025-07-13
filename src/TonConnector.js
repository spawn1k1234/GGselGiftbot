// import React, { useState, useEffect } from "react";
// import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
// import { database, ref, set } from "./firebase";

// const TonConnector = ({ userId }) => {
//   const [tonConnectUI] = useTonConnectUI();
//   const walletAddress = useTonAddress();
//   const [coins, setCoins] = useState(0);
//   const [amount, setAmount] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [txStatus, setTxStatus] = useState("");

//   useEffect(() => {
//     if (userId && walletAddress) {
//       const userRef = ref(database, `users/${userId}`);
//       set(
//         userRef,
//         {
//           walletAddress,
//           lastActive: Date.now(),
//         },
//         { merge: true }
//       );
//     }
//   }, [userId, walletAddress]);

//   const buyCoins = async () => {
//     if (!walletAddress) {
//       alert("Сначала подключите кошелек!");
//       return;
//     }

//     setLoading(true);
//     setTxStatus("Обработка транзакции...");

//     try {
//       const tonAmount = (amount * 0.004).toFixed(3);

//       await tonConnectUI.sendTransaction({
//         validUntil: Math.floor(Date.now() / 1000) + 300,
//         messages: [
//           {
//             address: "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7",
//             amount: (tonAmount * 1000000000).toString(),
//             payload: JSON.stringify({ userId, amount }),
//           },
//         ],
//       });

//       const newCoins = coins + amount;
//       setCoins(newCoins);

//       const userRef = ref(database, `users/${userId}`);
//       await set(
//         userRef,
//         {
//           coins: newCoins,
//           lastPurchase: Date.now(),
//         },
//         { merge: true }
//       );

//       setTxStatus(`Успешно! ${amount} монет зачислено.`);
//     } catch (error) {
//       console.error("Ошибка транзакции:", error);
//       setTxStatus("Ошибка транзакции");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "500px", margin: "0 auto" }}>
//       {walletAddress ? (
//         <div>
//           <p>
//             Кошелек: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
//           </p>
//           <p>Ваши монеты: {coins}</p>

//           <div style={{ margin: "20px 0" }}>
//             <h3>Купить монеты</h3>
//             <input
//               type="number"
//               min="10"
//               value={amount}
//               onChange={(e) => setAmount(Number(e.target.value))}
//               style={{ padding: "8px", marginRight: "10px" }}
//             />
//             <button
//               onClick={buyCoins}
//               disabled={loading}
//               style={{
//                 padding: "10px 20px",
//                 background: "#0088cc",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//               }}
//             >
//               {loading ? "Отправка..." : "Купить"}
//             </button>
//             <p>Стоимость: {(amount * 0.004).toFixed(3)} TON</p>
//           </div>

//           {txStatus && (
//             <p
//               style={{ color: txStatus.includes("Успешно") ? "green" : "red" }}
//             >
//               {txStatus}
//             </p>
//           )}
//         </div>
//       ) : (
//         <button
//           onClick={() => tonConnectUI.connectWallet()}
//           style={{
//             padding: "15px 30px",
//             background: "#0088cc",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             fontSize: "16px",
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
import { database, ref, set } from "./firebase";

const TonConnector = ({ userId }) => {
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const wallet = useTonWallet();
  const [coins, setCoins] = useState(0);
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [balance, setBalance] = useState(null);

  // Валидный адрес получателя
  const RECIPIENT_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";

  // Инициализация подключения
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        if (wallet) {
          setConnectionError("");
          await checkBalance();
          return;
        }

        // Автоматическое восстановление соединения
        const connectionSource = {
          jsBridgeKey: "tonconnect",
        };

        await tonConnectUI.restoreConnection(connectionSource);

        if (!wallet) {
          const unsubscribe = tonConnectUI.onStatusChange((w) => {
            if (w) {
              setConnectionError("");
              checkBalance();
              unsubscribe();
            }
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Connection error:", error);
        handleConnectionError(error);
      }
    };

    initializeConnection();
  }, [wallet]);

  // Проверка баланса
  const checkBalance = async () => {
    try {
      if (!tonConnectUI) return;

      const b = await tonConnectUI.getBalance();
      setBalance(Number(b) / 1000000000); // Конвертация в TON
    } catch (error) {
      console.error("Balance check error:", error);
    }
  };

  // Обработка ошибок подключения
  const handleConnectionError = (error) => {
    let errorMessage = "Ошибка подключения к кошельку";

    if (error.message.includes("Connection refused")) {
      errorMessage = "Кошелек отклонил подключение";
    } else if (error.message.includes("Timeout")) {
      errorMessage = "Время ожидания истекло";
    }

    setConnectionError(errorMessage);
  };

  // Подключение кошелька
  const handleConnectWallet = async () => {
    try {
      setConnectionError("");
      setTxStatus("Открываем кошелек...");

      await tonConnectUI.connectWallet({
        jsBridgeKey: "tonconnect",
      });

      setTxStatus("");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      handleConnectionError(error);
    }
  };

  // Покупка монет
  const buyCoins = async () => {
    if (!wallet) {
      setConnectionError("Кошелек не подключен");
      return;
    }

    setLoading(true);
    setTxStatus("Подготовка транзакции...");

    try {
      const tonAmount = amount * 0.004;
      const nanoAmount = Math.floor(tonAmount * 1000000000).toString();

      const payload = {
        userId,
        amount,
        timestamp: Date.now(),
        comment: `Purchase ${amount} coins`,
        app: "TON Casino",
      };

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: RECIPIENT_ADDRESS,
            amount: nanoAmount,
            payload: btoa(JSON.stringify(payload)),
          },
        ],
      };

      // Исправленный блок с Promise.race
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 30000)
      );

      const result = await Promise.race([
        tonConnectUI.sendTransaction(transaction),
        timeoutPromise,
      ]);

      console.log("Transaction result:", result);

      const newCoins = coins + amount;
      setCoins(newCoins);
      setTxStatus(`Успешно! ${amount} монет зачислено.`);
      await checkBalance();

      const userRef = ref(database, `users/${userId}`);
      await set(
        userRef,
        {
          coins: newCoins,
          lastPurchase: Date.now(),
          transactions: {
            [Date.now()]: {
              amount,
              tonAmount,
              status: "completed",
              txHash: result.boc,
              timestamp: Date.now(),
            },
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Transaction error:", error);
      handleTransactionError(error);
    } finally {
      setLoading(false);
    }
  };
  // Обработка ошибок транзакции
  const handleTransactionError = (error) => {
    let errorMessage = "Ошибка транзакции";
    let errorDetails = error.message;

    if (error.message.includes("BadRequestError")) {
      errorMessage = "Некорректные параметры транзакции";
    } else if (error.message.includes("User rejected")) {
      errorMessage = "Вы отменили транзакцию";
    } else if (error.message.includes("Timeout")) {
      errorMessage = "Время ожидания истекло";
    } else if (error.message.includes("insufficient")) {
      errorMessage = "Недостаточно средств";
    }

    setTxStatus(errorMessage);
    setConnectionError(errorMessage);

    // Сохраняем ошибку
    const userRef = ref(database, `users/${userId}`);
    set(
      userRef,
      {
        transactions: {
          [Date.now()]: {
            amount,
            tonAmount: amount * 0.004,
            status: "failed",
            error: errorMessage,
            errorDetails: JSON.stringify({
              message: error.message,
              stack: error.stack,
              name: error.name,
            }),
          },
        },
      },
      { merge: true }
    );
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Блок ошибок */}
      {(connectionError || txStatus.includes("Ошибка")) && (
        <div
          style={{
            padding: "15px",
            background: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            marginBottom: "20px",
            borderLeft: "4px solid #ef5350",
          }}
        >
          <strong>{connectionError || txStatus}</strong>
          {connectionError.includes("подключ") && (
            <div style={{ marginTop: "10px" }}>
              <p>Попробуйте:</p>
              <ol style={{ paddingLeft: "20px", margin: "5px 0" }}>
                <li>Обновить страницу (F5)</li>
                <li>Установить Tonkeeper (tonkeeper.com)</li>
                <li>Проверить расширение кошелька</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Успешные статусы */}
      {txStatus && !txStatus.includes("Ошибка") && (
        <div
          style={{
            padding: "15px",
            background: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "8px",
            marginBottom: "20px",
            borderLeft: "4px solid #4caf50",
          }}
        >
          {txStatus}
        </div>
      )}

      {/* Основной интерфейс */}
      {wallet ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#1976d2",
            }}
          >
            TON Казино
          </h2>

          <div
            style={{
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong>Кошелек:</strong> {walletAddress.slice(0, 6)}...
              {walletAddress.slice(-4)}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Провайдер:</strong> {wallet.provider || "unknown"}
            </p>
            {balance !== null && (
              <p style={{ margin: "5px 0" }}>
                <strong>Баланс:</strong> {balance.toFixed(3)} TON
              </p>
            )}
            <p style={{ margin: "5px 0" }}>
              <strong>Ваши монеты:</strong> {coins}
            </p>
          </div>

          <div>
            <h3 style={{ marginBottom: "15px" }}>Купить монеты</h3>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Количество монет (мин. 10):
              </label>
              <input
                type="number"
                min="10"
                step="1"
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(10, Number(e.target.value)))
                }
                style={{
                  padding: "12px",
                  width: "100%",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div
              style={{
                background: "#e3f2fd",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "5px 0" }}>
                <strong>Стоимость:</strong> {(amount * 0.004).toFixed(3)} TON
              </p>
              {balance !== null && balance < amount * 0.004 && (
                <p
                  style={{
                    margin: "5px 0",
                    color: "#d32f2f",
                    fontWeight: "500",
                  }}
                >
                  ⚠️ Недостаточно средств на балансе
                </p>
              )}
            </div>

            <button
              onClick={buyCoins}
              disabled={
                loading || (balance !== null && balance < amount * 0.004)
              }
              style={{
                padding: "14px",
                width: "100%",
                background: loading
                  ? "#b0bec5"
                  : balance !== null && balance < amount * 0.004
                  ? "#e0e0e0"
                  : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", marginRight: "8px" }}>
                    🔄
                  </span>
                  Обработка...
                </>
              ) : (
                `Купить ${amount} монет за ${(amount * 0.004).toFixed(3)} TON`
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#1976d2",
            }}
          >
            Подключите TON кошелек
          </h2>

          <button
            onClick={handleConnectWallet}
            style={{
              padding: "14px 28px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "20px",
              transition: "background 0.3s",
              boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            }}
          >
            Подключить кошелек
          </button>

          <div
            style={{
              textAlign: "left",
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "20px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Инструкция:</h3>
            <ol
              style={{
                paddingLeft: "20px",
                margin: "12px 0",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                Установите Tonkeeper (tonkeeper.com) или другой TON кошелек
              </li>
              <li style={{ marginBottom: "8px" }}>
                Обновите страницу после установки
              </li>
              <li style={{ marginBottom: "8px" }}>
                Нажмите "Подключить кошелек"
              </li>
              <li>Выберите ваш кошелек в появившемся окне</li>
            </ol>

            <div style={{ marginTop: "15px" }}>
              <p style={{ margin: "8px 0" }}>
                <strong>Поддерживаемые кошельки:</strong>
              </p>
              <ul
                style={{
                  paddingLeft: "20px",
                  margin: "8px 0",
                }}
              >
                <li style={{ marginBottom: "6px" }}>Tonkeeper</li>
                <li style={{ marginBottom: "6px" }}>OpenMask</li>
                <li style={{ marginBottom: "6px" }}>MyTonWallet</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TonConnector;
