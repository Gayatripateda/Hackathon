const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function sendPrompt(prompt) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("The backend returned an invalid response.", {
        cause: error,
      });
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(data.detail || "The AI request failed.");
  }
  if (typeof data.reply !== "string") {
    throw new Error("The backend response did not contain a reply.");
  }

  return data.reply;
}
