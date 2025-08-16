import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

const OCEAN_INFO = {
  O: {
    name: "Apertura a la experiencia",
    description:
      "Personas con alta apertura son creativas, curiosas y dispuestas a probar cosas nuevas.",
    animation: "/animations/openness.json",
  },
  C: {
    name: "Responsabilidad (Conciencia)",
    description:
      "Implica organización, disciplina y enfoque hacia las metas.",
    animation: "/animations/conscientiousness.json",
  },
  E: {
    name: "Extroversión",
    description:
      "Se refiere a la sociabilidad, energía y tendencia a buscar compañía.",
    animation: "/animations/extraversion.json",
  },
  A: {
    name: "Amabilidad",
    description:
      "Incluye altruismo, empatía y disposición para cooperar con otros.",
    animation: "/animations/agreeableness.json",
  },
  N: {
    name: "Neuroticismo",
    description:
      "Se relaciona con la estabilidad emocional y la tendencia a experimentar emociones negativas.",
    animation: "/animations/neuroticism.json",
  },
};

export default function OceanTest() {
  const [questions, setQuestions] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const dimensionsOrder = Object.keys(OCEAN_INFO);

  useEffect(() => {
    fetch("http://friendsapp.com:3100/api/v1/personality/questions") // tu endpoint real
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.reduce((acc, q) => {
          if (!acc[q.dimension]) acc[q.dimension] = [];
          acc[q.dimension].push(q);
          return acc;
        }, {});
        setQuestions(data);
        setGroupedQuestions(grouped);
      });
  }, []);

  const currentDimension = dimensionsOrder[currentDimensionIndex];
  const currentData = OCEAN_INFO[currentDimension];
  const currentQuestions = groupedQuestions[currentDimension] || [];

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentDimensionIndex < dimensionsOrder.length - 1) {
      setCurrentDimensionIndex((prev) => prev + 1);
    } else {
      console.log("Respuestas finales:", answers);
       const payload = {
      user_id: "user123", // Puedes reemplazarlo por el usuario real
      answers: Object.entries(answers).map(([id, score]) => ({
        question_id: parseInt(id),
        score: parseInt(score)
      }))
    };

    console.log(payload)

    fetch("http://friendsapp.com:3100/api/v1/personality/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .catch(err => console.error("Error enviando respuestas:", err));
    }
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
  
  const handlePrev = () => {
    if (currentDimensionIndex <= dimensionsOrder.length - 1) {
      setCurrentDimensionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
      {/* Animación */}
      {currentData.animation && (
        <div className="w-48 h-48">
          <Lottie animationData={require(`.${currentData.animation}`)} loop />
        </div>
      )}

      {/* Título y descripción */}
      <h2 className="text-2xl font-bold mb-2">{currentData.name}</h2>
      <p className="text-gray-700 mb-6 text-center">
        {currentData.description}
      </p>

      {/* Preguntas */}
      <div className="space-y-6 w-full">
        {currentQuestions.map((q) => (
          <div
            key={q.id}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <p className="mb-4">{q.text}</p>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((val) => {
                const colors = {
                  1: "bg-red-700",
                  2: "bg-red-500",
                  3: "bg-gray-400",
                  4: "bg-green-500",
                  5: "bg-green-700",
                };
                return (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`w-10 h-10 rounded-full ${colors[val]} ${
                      answers[q.id] === val
                        ? "ring-4 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        {/* Botón Anterior */}
        <button
          onClick={handlePrev}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        > Anterior categoría
        </button>
        {/* Botón siguiente */}
        <button
          onClick={handleNext}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {currentDimensionIndex < dimensionsOrder.length - 1
            ? "Siguiente categoría"
            : "Finalizar"}
        </button>
      </div>
    </div>
  );
}
