import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import Home from "./components/Home";

function App() {
  const user = localStorage.getItem("user");

  return (
    <Router>
      <Routes>
        {/* Ruta principal protegida */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        {/* Login público */}
        <Route path="/login" element={<Login />} />

        {/* Callback que recibe el token y guarda el usuario */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
