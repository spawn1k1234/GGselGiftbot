// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// // Ваши данные для подключения к Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCH9CeUn88EELoBpGpdKITMYXKA8GAVa7U",
//   authDomain: "tongarant.firebaseapp.com",
//   projectId: "tongarant",
//   storageBucket: "tongarant.appspot.com",
//   messagingSenderId: "645663892446",
//   appId: "1:645663892446:web:eb0b1647787c0bdc9ff34f",
//   measurementId: "G-N1Q2PG0K2D",
// };

// // Инициализация Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Экспортируем db, doc и getDoc для использования в других файлах
// export { db, doc, getDoc };
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCH9CeUn88EELoBpGpdKITMYXKA8GAVa7U",
  authDomain: "tongarant.firebaseapp.com",
  databaseURL: "https://tongarant-default-rtdb.firebaseio.com",
  projectId: "tongarant",
  storageBucket: "tongarant.appspot.com",
  messagingSenderId: "*******",
  appId: "1:*******:web:********",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, get, onValue };
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, onValue } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyCH9CeUn88EELoBpGpdKITMYXKA8GAVa7U", // замени на свой
//   authDomain: "tongarant.firebaseapp.com",
//   databaseURL: "https://tongarant-default-rtdb.firebaseio.com",
//   projectId: "tongarant",
//   storageBucket: "tongarant.appspot.com",
//   messagingSenderId: "*******",
//   appId: "1:*******:web:********",
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export { database, ref, set, get, onValue };
