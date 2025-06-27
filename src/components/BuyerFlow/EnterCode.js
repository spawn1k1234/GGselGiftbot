// src/components/BuyerFlow/EnterCode.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database, ref, get, set } from "../../firebase";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const snapshot = await get(ref(database, `orders/${code}`));
    if (snapshot.exists()) {
      await set(ref(database, `orders/${code}/status`), "connected");
      localStorage.setItem("orderCode", code);
      navigate("/buyer/order-view");
    } else {
      setError("Неверный код");
    }
  };

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Введите код"
      />
      <button onClick={handleSubmit}>Подключиться</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EnterCode;
