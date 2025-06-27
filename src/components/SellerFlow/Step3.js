// src/components/SellerFlow/Step3.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database, ref, set } from "../../firebase";

const generateOrderCode = () => {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${letter}${digits}`;
};

const Step3 = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    const name = localStorage.getItem("orderName");
    const price = localStorage.getItem("orderPrice");
    const code = generateOrderCode();

    const orderRef = ref(database, `orders/${code}`);
    await set(orderRef, {
      name,
      price,
      address,
      status: "waiting",
    });

    localStorage.setItem("orderCode", code);
    navigate("/seller/order-created");
  };

  return (
    <div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Адрес"
      />
      <button onClick={handleCreate}>Создать заказ</button>
    </div>
  );
};

export default Step3;
