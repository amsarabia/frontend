import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el token de la URL (query param)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      // Si no hay token, mandamos al login
      navigate("/login");
      return;
    }

    // Guardar token en localStorage
    localStorage.setItem("token", token);

    // Llamar al backend para obtener info del usuario
    fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al obtener datos de usuario");
        }
        return res.json();
      })
      .then(user => {
        // Guardar usuario en localStorage
        localStorage.setItem("user", JSON.stringify(user));
        // Ir a la página principal
        navigate("/");
      })
      .catch(err => {
        console.error("Error:", err);
        navigate("/login");
      });
  }, [navigate]);

  return <p>Procesando inicio de sesión...</p>;
}

export default AuthCallback;
