import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react"; // <-- Agregado

import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import Home from "./components/Home";
import Test from "./components/Test";
import Results from "./components/Results";

const theme = {
  primaryColor: 'blue',
  secondaryColor: 'gray',
  // Otros valores de tema personalizados...
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login?error=session_expired";
      return;
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  if (loadingUser) {
    return <p>Cargando...</p>;
  }

  return (
    <ThemeProvider value={theme}> {/* <-- Envuelve toda tu app aquí */}
      <Router>
        <Routes>
          <Route path="/" element={user ? <Home setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
          <Route path="/test" element={<Test />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
