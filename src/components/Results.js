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
    <div class="flex flex-col items-center p-6 max-w-3xl mx-auto">
      <h2>Resultados del Test</h2>
      <p>{state.result.message}</p>
      <button onClick={() => navigate("/")}>Volver al inicio</button>
    </div>
  );
}
