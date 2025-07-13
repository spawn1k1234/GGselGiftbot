import React, { useState, useEffect } from "react";
// Правильные импорты:
// Импорт firebase из того же каталога
import { database, ref, set, onValue } from "./firebase";

const TonConnector = ({ userId }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [amountToBuy, setAmountToBuy] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");

  // Загрузка данных пользователя
  useEffect(() => {
    if (userId) {
      const userRef = ref(database, `casinoord/${userId}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWalletAddress(data.walletAddress || "");
          setCoins(data.coins || 0);
          setBalance(data.balance || 0);
        }
      });
    }
  }, [userId]);

  const connectWallet = async () => {
    try {
      if (window.ton && window.ton.isTonWallet) {
        const accounts = await window.ton.send("ton_requestAccounts");
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          updateUserData({ walletAddress: accounts[0] });
        }
      } else {
        alert("Please install TON Wallet extension!");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const updateUserData = (updates) => {
    const userRef = ref(database, `casinoord/${userId}`);
    set(
      userRef,
      {
        ...updates,
        lastUpdate: Date.now(),
      },
      { merge: true }
    );
  };

  const buyCoins = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    setTransactionStatus("Processing transaction...");

    try {
      const tonAmount = (amountToBuy * 0.004).toFixed(3); // 0.004 TON per coin
      const recipientAddress =
        "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";

      // Отправка транзакции
      await window.ton.send("ton_sendTransaction", [
        {
          to: recipientAddress,
          value: tonAmount * 1000000000, // в нанотонах
          data: JSON.stringify({ userId, amount: amountToBuy }),
        },
      ]);

      // Обновляем баланс пользователя
      const newCoins = coins + amountToBuy;
      setCoins(newCoins);
      updateUserData({ coins: newCoins });

      setTransactionStatus(
        `Success! ${amountToBuy} coins added to your account.`
      );
    } catch (error) {
      console.error("Transaction error:", error);
      setTransactionStatus("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      {walletAddress ? (
        <div>
          <p>
            <strong>Wallet:</strong> {walletAddress.slice(0, 6)}...
            {walletAddress.slice(-4)}
          </p>
          <p>
            <strong>Your Coins:</strong> {coins}
          </p>

          <div style={{ margin: "20px 0" }}>
            <h3>Buy More Coins</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="number"
                min="10"
                step="10"
                value={amountToBuy}
                onChange={(e) => setAmountToBuy(parseInt(e.target.value) || 10)}
                style={{ padding: "8px", width: "80px" }}
              />
              <span>coins (0.004 TON per coin)</span>
            </div>
            <p>Total: {(amountToBuy * 0.004).toFixed(3)} TON</p>
            <button
              onClick={buyCoins}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0088cc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              {isLoading ? "Processing..." : "Buy Coins"}
            </button>
          </div>

          {transactionStatus && (
            <p
              style={{
                color: transactionStatus.includes("Success") ? "green" : "red",
              }}
            >
              {transactionStatus}
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          style={{
            padding: "15px 30px",
            backgroundColor: "#0088cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "18px",
            margin: "20px 0",
          }}
        >
          Connect TON Wallet
        </button>
      )}
    </div>
  );
};

export default TonConnector;
