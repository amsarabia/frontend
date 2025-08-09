import React from "react";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bienvenido {user ? user.name : "Invitado"}!</h1>
      {user && <img src={user.picture} alt="Foto de perfil" />}
    </div>
  );
}

export default Home;
