import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Импортируем BrowserRouter
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    {" "}
    {/* Оборачиваем в Router только здесь */}
    <App />
  </Router>
);
