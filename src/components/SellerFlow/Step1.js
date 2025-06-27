// src/components/SellerFlow/Step1.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Step.css";

const Step1 = () => {
  const [name, setName] = useState(localStorage.getItem("orderName") || "");
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("orderName", name);
    navigate("/seller/step2");
  };

  return (
    <div className="flstep">
      <input
        className="inputsstep"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название товара"
      />
      <button onClick={handleNext}>Дальше</button>
    </div>
  );
};

export default Step1;
