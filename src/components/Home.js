import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ setUser  }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Llamar callback para actualizar estado en App
    setUser(null);

    // Redirigir a login
    navigate("/login");
  };

  return (
    <div>
      <h1>Bienvenido a Home</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Home;
