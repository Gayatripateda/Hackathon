import { useState } from "react";
import { sendPrompt } from "../services/aiApi.js";

function AiChat() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) {
      return;
    }

    setError("");
    setReply("");
    setIsLoading(true);

    try {
      setReply(await sendPrompt(trimmedPrompt));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The AI request failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="ai-chat" aria-labelledby="ai-chat-title">
      <h2 id="ai-chat-title">Ask AI</h2>
      <form className="ai-chat-form" onSubmit={handleSubmit}>
        <label htmlFor="ai-prompt">Your prompt</label>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          maxLength={4000}
          rows={4}
          required
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
      {error && (
        <p className="ai-chat-error" role="alert">
          {error}
        </p>
      )}
      {reply && (
        <p className="ai-chat-reply" aria-live="polite">
          {reply}
        </p>
      )}
    </section>
  );
}

export default AiChat;
