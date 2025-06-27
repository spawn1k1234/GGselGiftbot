// src/components/SellerFlow/OrderCreated.js
import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "../../firebase";

const OrderCreated = () => {
  const code = localStorage.getItem("orderCode");
  const [statusText, setStatusText] = useState("Ожидайте...");

  useEffect(() => {
    const orderRef = ref(database, `orders/${code}`);
    const unsub = onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.status === "connected")
        setStatusText("Покупатель подключен. Ожидаем оплату.");
      else if (data?.status === "paid")
        setStatusText("Оплата прошла. Проверка счета...");
      else if (data?.status === "verified")
        setStatusText("Проверка успешна. Поздравляем!");
    });

    return () => unsub();
  }, [code]);

  return (
    <div>
      <h3>Ваш код заказа: {code}</h3>
      <p>{statusText}</p>
    </div>
  );
};

export default OrderCreated;
