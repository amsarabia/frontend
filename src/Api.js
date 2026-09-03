export async function fetchQuestions() {
  const res = await fetch("http://friendsapp.com:3100/api/v1/personality/questions");
  return res.json();
}

export async function fetchProfile(userId) {
  const res = await fetch(`http://friendsapp.com:3100/api/v1/personality/profile/${userId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

export async function submitAnswers(answers) {
  const res = await fetch("http://friendsapp.com:3100/api/v1/personality/answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return res.json();
}
