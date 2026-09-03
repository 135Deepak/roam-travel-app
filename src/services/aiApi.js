const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function sendMessageToAI(message) {
  const response = await fetch(AI_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "AI request failed"
    );
  }

  return data.reply;
}