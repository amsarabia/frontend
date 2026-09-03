import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProfile } from "../Api";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(state?.result || null);
  const [loading, setLoading] = useState(!state?.result);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (profile) return;

    let userId = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.user_id != null) userId = Number(payload.user_id);
      }
    } catch (e) {}

    if (userId == null || Number.isNaN(userId)) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user && user.id != null) userId = Number(user.id);
      } catch (e) {}
    }

    if (userId == null || Number.isNaN(userId)) {
      navigate("/login");
      return;
    }

    setLoading(true);
    fetchProfile(userId)
      .then((p) => {
        if (p) {
          setProfile(p);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(err.message || "Error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div>
        <p>Aún no has completado el test.</p>
        <button onClick={() => navigate("/test")}>Hacer el test</button>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error al cargar los resultados.</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
      <h2>Resultados del Test</h2>
      <div className="text-5xl font-extrabold tracking-widest my-4 px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg">
        {profile.mbti_proxy}
      </div>
      <p className="text-gray-800 mb-6 text-center">{profile.description}</p>
      <h3 className="text-xl font-semibold mb-2">Puntuaciones OCEAN</h3>
      <ul className="mb-6 w-full max-w-md">
        {Object.entries(profile.scores || {}).map(([k, v]) => (
          <li key={k} className="flex justify-between border-b border-gray-200 py-1">
            <span className="font-mono font-bold">{k}</span>
            <span>{Number(v).toFixed(1)}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/")}>Volver al inicio</button>
    </div>
  );
}
