// src/components/SellerFlow/Step2.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Step2 = () => {
  const [price, setPrice] = useState(localStorage.getItem("orderPrice") || "");
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("orderPrice", price);
    navigate("/seller/step3");
  };

  return (
    <div>
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Цена"
      />
      <button onClick={handleNext}>Дальше</button>
    </div>
  );
};

export default Step2;
