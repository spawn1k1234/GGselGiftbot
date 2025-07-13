// import React from "react";

// const Contact = () => {
//   return (
//     <div style={{ padding: "50px", textAlign: "center" }}>
//       <h1>Контакты</h1>
//       <p>Свяжитесь с нами через email: contact@yourapp.com</p>
//     </div>
//   );
// };

// export default Contact;
import React, { useState, useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import TonConnector from "../TonConnector";

const Contact = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("casinoUserId");
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("casinoUserId", id);
    }
    setUserId(id);
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://g-gsel-giftbot.vercel.app/tonconnect-manifest.json">
      <div style={{ padding: "20px" }}>
        <h1>TON Casino</h1>
        {userId && <TonConnector userId={userId} />}
      </div>
    </TonConnectUIProvider>
  );
};
export default Contact;
