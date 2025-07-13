import React, { useState, useEffect } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { database, ref, set } from "./firebase";

const TonConnector = ({ userId }) => {
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const [coins, setCoins] = useState(0);
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (userId && walletAddress) {
      const userRef = ref(database, `users/${userId}`);
      set(
        userRef,
        {
          walletAddress,
          lastActive: Date.now(),
        },
        { merge: true }
      );
    }
  }, [userId, walletAddress]);

  const buyCoins = async () => {
    if (!walletAddress) {
      alert("Сначала подключите кошелек!");
      return;
    }

    setLoading(true);
    setTxStatus("Обработка транзакции...");

    try {
      const tonAmount = (amount * 0.004).toFixed(3);

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7",
            amount: (tonAmount * 1000000000).toString(),
            payload: JSON.stringify({ userId, amount }),
          },
        ],
      });

      const newCoins = coins + amount;
      setCoins(newCoins);

      const userRef = ref(database, `users/${userId}`);
      await set(
        userRef,
        {
          coins: newCoins,
          lastPurchase: Date.now(),
        },
        { merge: true }
      );

      setTxStatus(`Успешно! ${amount} монет зачислено.`);
    } catch (error) {
      console.error("Ошибка транзакции:", error);
      setTxStatus("Ошибка транзакции");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      {walletAddress ? (
        <div>
          <p>
            Кошелек: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
          <p>Ваши монеты: {coins}</p>

          <div style={{ margin: "20px 0" }}>
            <h3>Купить монеты</h3>
            <input
              type="number"
              min="10"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ padding: "8px", marginRight: "10px" }}
            />
            <button
              onClick={buyCoins}
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: "#0088cc",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {loading ? "Отправка..." : "Купить"}
            </button>
            <p>Стоимость: {(amount * 0.004).toFixed(3)} TON</p>
          </div>

          {txStatus && (
            <p
              style={{ color: txStatus.includes("Успешно") ? "green" : "red" }}
            >
              {txStatus}
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={() => tonConnectUI.connectWallet()}
          style={{
            padding: "15px 30px",
            background: "#0088cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Подключить TON кошелек
        </button>
      )}
    </div>
  );
};

export default TonConnector;
