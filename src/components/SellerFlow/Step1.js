// // src/components/SellerFlow/Step1.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Step.css";

// const Step1 = () => {
//   const [name, setName] = useState(localStorage.getItem("orderName") || "");
//   const navigate = useNavigate();

//   const handleNext = () => {
//     localStorage.setItem("orderName", name);
//     navigate("/seller/step2");
//   };

//   return (
//     <div className="flstep">
//       <h1>Укажите имя NFT подарка для сравнения</h1>
//       <input
//         className="inputsstep"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Например, Durovs Cap, Eternal Rose"
//       />
//       <button onClick={handleNext}>Дальше</button>
//     </div>
//   );
// };

// export default Step1;
// src/components/SellerFlow/Step1.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Step.css";

// Список всех известных NFT подарков Telegram
const nftGifts = [
  "Durovs Cap",
  "Eternal Rose",
  "Golden Coin",
  "Love Potion",
  "Cyber Truck",
  "Diamond Crown",
  "Magic Lamp",
  "Pixel Pigeon",
  "Space Rocket",
  "Moon Ticket",
  "Crystal Heart",
  "Lucky Clover",
  "Fire Phoenix",
  "Neon Skull",
  "Star Medal",
  "Samurai Mask",
  "Golden Tiger",
  "Astronaut Cat",
  "Laser Eyes",
  "Infinite Loop",
];

const Step1 = () => {
  const [name, setName] = useState(localStorage.getItem("orderName") || "");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (value.length > 0) {
      const filtered = nftGifts.filter((gift) =>
        gift.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    setSuggestions([]);
  };

  const handleNext = () => {
    localStorage.setItem("orderName", name);
    navigate("/seller/step2");
  };

  return (
    <div className="flstep">
      <div className="flesbloks">
        <h1>Укажите имя NFT подарка для сравнения</h1>
        <input
          className="inputsstep"
          value={name}
          onChange={handleInputChange}
          placeholder="Например, Durovs Cap, Eternal Rose"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, idx) => (
              <li key={idx} onClick={() => handleSuggestionClick(s)}>
                {s}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleNext}>Дальше</button>
      </div>
    </div>
  );
};

export default Step1;
