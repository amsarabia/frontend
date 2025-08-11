import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return (
      <div>
        <p>No hay resultados disponibles.</p>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Resultados del Test</h2>
      <p>{state.result.message}</p>
      <button onClick={() => navigate("/")}>Volver al inicio</button>
    </div>
  );
}
