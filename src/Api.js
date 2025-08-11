export async function fetchQuestions() {
  const res = await fetch("http://localhost:3100/api/v1/personality/questions");
  return res.json();
}

export async function submitAnswers(answers) {
  const res = await fetch("http://localhost:3100/api/v1/personality/answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return res.json();
}
