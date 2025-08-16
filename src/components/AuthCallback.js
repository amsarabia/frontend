import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback({ setUser }) {  // Recibe setUser como prop
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    fetch("http://friendsapp.com:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener datos de usuario");
        return res.json();
      })
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);  // Actualiza el estado global del usuario aquí
        navigate("/");
      })
      .catch(err => {
        console.error("Error:", err);
        navigate("/login");
      });
  }, [navigate, setUser]);

  return <p>Procesando inicio de sesión...</p>;
}

export default AuthCallback;
