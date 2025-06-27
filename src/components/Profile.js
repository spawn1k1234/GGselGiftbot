import React from "react";

const Profile = ({ userData, onJoin }) => {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Профиль</h1>
      <img
        src={userData.avatar}
        alt="Avatar"
        style={{ width: "100px", height: "100px", borderRadius: "50%" }}
      />
      <p>
        <strong>Никнейм:</strong> {userData.username}
      </p>
      <p>
        <strong>Телефон:</strong> {userData.phoneNumber}
      </p>
      <button
        onClick={onJoin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Присоединиться
      </button>
    </div>
  );
};

export default Profile;
