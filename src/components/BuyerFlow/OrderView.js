// src/components/BuyerFlow/OrderView.js
import React, { useEffect, useState } from "react";
import { database, ref, get, set } from "../../firebase";

const OrderView = () => {
  const code = localStorage.getItem("orderCode");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const snapshot = await get(ref(database, `orders/${code}`));
      if (snapshot.exists()) {
        setOrder(snapshot.val());
      }
    };
    fetchOrder();
  }, [code]);

  const markPaid = () => set(ref(database, `orders/${code}/status`), "paid");
  const markVerified = () =>
    set(ref(database, `orders/${code}/status`), "verified");

  if (!order) return <p>Загрузка...</p>;

  return (
    <div>
      <h3>{order.name}</h3>
      <p>Цена: {order.price}</p>
      <p>Адрес: {order.address}</p>
      <button onClick={markPaid}>Оплачено</button>
      <button onClick={markVerified}>Проверка была успешна</button>
    </div>
  );
};

export default OrderView;
