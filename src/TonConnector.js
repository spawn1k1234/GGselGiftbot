import React, { useEffect, useState } from "react";
import {
  useTonConnectUI,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";
import { database, ref, set, update, get, onValue } from "./firebase";

const TonConnector = () => {
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const wallet = useTonWallet();
  const [coins, setCoins] = useState(0);
  const [amount] = useState(10); // фиксируем покупку 10 монет
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [transactions, setTransactions] = useState([]);

  const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const userId = telegramUser?.id ? `telegram_${telegramUser.id}` : null;

  // 💵 10 монет = 5 центов ≈ 0.04 TON
  const tonAmount = 0.01;
  const nanoAmount = Math.floor(tonAmount * 1e9).toString();
  const RECIPIENT_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";

  // 🔄 Инициализация пользователя и загрузка данных
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(database, `users/${userId}`);
    get(userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        set(userRef, {
          telegramId: telegramUser?.id || "",
          walletAddress: walletAddress || "",
          coins: 0,
          transactions: {},
        });
        setCoins(0);
      } else {
        const data = snapshot.val();
        setCoins(data.coins || 0);
      }
    });

    const txRef = ref(database, `users/${userId}/transactions`);
    const unsubscribe = onValue(txRef, (snapshot) => {
      const txData = snapshot.val();
      if (txData) {
        const txList = Object.entries(txData)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter((tx) => tx.status === "completed")
          .sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(txList);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // 🔁 Обновляем walletAddress
  useEffect(() => {
    if (!userId || !walletAddress) return;
    const userRef = ref(database, `users/${userId}`);
    update(userRef, { walletAddress });
  }, [walletAddress]);

  const handleConnectWallet = async () => {
    try {
      setConnectionError("");
      await tonConnectUI.connectWallet();
    } catch (error) {
      console.error("Connect error:", error);
      setConnectionError("Не удалось подключить кошелек TON");
    }
  };

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
        messages: [{ address: RECIPIENT_ADDRESS, amount: nanoAmount }],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      if (!result?.boc) throw new Error("Не получен хеш транзакции");

      const newCoins = coins + amount;
      const timestamp = Date.now();

      await update(ref(database, `users/${userId}`), {
        coins: newCoins,
      });
      setCoins(newCoins);
      setTxStatus(`Успешно! ${amount} монет зачислено.`);

      await set(ref(database, `users/${userId}/transactions/${timestamp}`), {
        amount,
        tonAmount,
        status: "completed",
        txHash: result.boc,
        timestamp,
      });
    } catch (error) {
      console.error("TX error:", error);

      const msg = error.message || "";
      let errorMessage = "Ошибка транзакции";

      if (msg.includes("Payload"))
        errorMessage = "Некорректные параметры платежа";
      else if (msg.includes("User rejected"))
        errorMessage = "Вы отменили транзакцию";
      else if (msg.includes("insufficient"))
        errorMessage = "Недостаточно средств";
      else if (msg.includes("Request to the wallet contains errors"))
        errorMessage = "Ошибка в реквизитах транзакции";

      setTxStatus(errorMessage);
      setConnectionError(errorMessage);

      await set(ref(database, `users/${userId}/transactions/${Date.now()}`), {
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

  const spendOneCoin = async () => {
    if (coins <= 0) return alert("Недостаточно монет");

    const newCoins = coins - 1;
    const timestamp = Date.now();

    await update(ref(database, `users/${userId}`), { coins: newCoins });
    setCoins(newCoins);

    // Записываем транзакцию в историю
    await set(ref(database, `users/${userId}/transactions/${timestamp}`), {
      amount: -1,
      tonAmount: -0.004, // Стоимость одной монеты
      status: "spent",
      timestamp,
    });
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
            Telegram ID: {telegramUser?.id}
            <br />
            Кошелек: {walletAddress?.slice(0, 6)}…{walletAddress?.slice(-4)}
          </p>
          <p>Монеты: {coins}</p>

          <h3>Купить 10 монет</h3>
          <p>Стоимость: {tonAmount.toFixed(3)} TON (~5¢)</p>
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

          <button
            onClick={spendOneCoin}
            style={{
              padding: 10,
              marginTop: 10,
              width: "100%",
              background: "#ff9800",
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

          {transactions.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <h3>История покупок</h3>
              <ul style={{ padding: 0, listStyle: "none" }}>
                {transactions.map((tx) => (
                  <li
                    key={tx.id}
                    style={{
                      borderBottom: "1px solid #ccc",
                      padding: "10px 0",
                    }}
                  >
                    <strong>{tx.amount} монет</strong> за{" "}
                    {tx.tonAmount.toFixed(3)} TON
                    <br />
                    <small>
                      {new Date(tx.timestamp).toLocaleString("ru-RU")}
                    </small>
                  </li>
                ))}
              </ul>
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
