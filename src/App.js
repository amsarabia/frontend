import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import Home from "./components/Home";
import Test from "./components/Test";
import Results from "./components/Results";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  if (loadingUser) {
    return <p>Cargando...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
        <Route path="/test" element={<Test />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
