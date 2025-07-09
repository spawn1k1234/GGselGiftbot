// components/Intro/Intro.js
import React, { useEffect, useState } from "react";
import "./Intro.css";

const Intro = ({ onFinish }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStage(1), 500), // Появление полосок
      setTimeout(() => setStage(2), 1500), // Формируется G
      setTimeout(() => setStage(3), 2500), // Приближение
      setTimeout(() => setStage(4), 3000), // GGsel
      setTimeout(() => setStage(5), 3800), // Затемнение
      setTimeout(() => onFinish(), 4500), // Уход
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div className={`intro-container ${stage >= 5 ? "fade-out" : ""}`}>
      <div className={`stripes ${stage >= 1 ? "active" : ""}`} />
      <div
        className={`letter-g ${stage >= 2 ? "visible" : ""} ${
          stage >= 3 ? "zoom" : ""
        }`}
      >
        G
      </div>
      <div className={`title ${stage >= 4 ? "show" : ""}`}>GGsel</div>
    </div>
  );
};

export default Intro;
