import React, { useEffect, useState } from "react";

function Test() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3100/api/v1/personality/questions")
      .then(res => res.json())
      .then(data => {
        // Si tu backend devuelve { data: [...] }
        setQuestions(data.data || data);
      })
      .catch(err => console.error("Error cargando preguntas:", err));
  }, []);

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      user_id: "user123", // Puedes reemplazarlo por el usuario real
      answers: Object.entries(answers).map(([id, score]) => ({
        question_id: parseInt(id),
        score: parseInt(score)
      }))
    };

    fetch("http://localhost:3100/api/v1/personality/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .catch(err => console.error("Error enviando respuestas:", err));
  };

  if (result) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Resultados del Test</h2>
        <p>{result.description}</p>
        <pre>{JSON.stringify(result.scores, null, 2)}</pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "15px" }}>
          <label>{q.text}</label>
          <select
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="1">Totalmente en desacuerdo</option>
            <option value="2">En desacuerdo</option>
            <option value="3">Neutral</option>
            <option value="4">De acuerdo</option>
            <option value="5">Totalmente de acuerdo</option>
          </select>
        </div>
      ))}
      <button type="submit">Enviar</button>
    </form>
  );
}

export default Test;
