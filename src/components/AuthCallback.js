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
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login?error=session_expired");
          return null;
        }
        if (!res.ok) throw new Error("Error al obtener datos de usuario");
        return res.json();
      })
      .then(user => {
        if (!user) return;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
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
