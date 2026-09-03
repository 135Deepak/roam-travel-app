import { useState } from "react";
import { sendMessageToAI } from "../services/aiApi";

const suggestions = [
  "Plan a 3-day trip to Paris",
  "What should I see in Tokyo?",
  "Best places for food in Rome",
  "Plan a relaxing Bali vacation",
];

function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text:
        "Hi! I'm Roam AI. Tell me where you're going, how long you're staying, and what you enjoy. I'll help you plan your trip.",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  async function sendMessage(messageText = input) {
    const text = messageText.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToAI(text);

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: reply,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text:
          "Sorry, I couldn't connect to the AI service. Please check that the Roam AI server is running.",
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    sendMessage();
  }

  return (
    <section
      className="assistant-page"
      id="assistant"
    >
      <div className="assistant-container">
        <div className="assistant-header">
          <p className="eyebrow">ROAM AI</p>

          <h1>
            Your personal travel assistant
          </h1>

          <p>
            Ask about destinations, itineraries,
            food, attractions, activities and more.
          </p>
        </div>

        <div className="assistant-card">
          <div className="chat-header">
            <div className="assistant-avatar">
              ✈
            </div>

            <div>
              <h3>Roam AI</h3>
              <span>Travel assistant</span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.role === "user"
                    ? "message-user"
                    : "message-assistant"
                }`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="message message-assistant">
                Roam AI is thinking...
              </div>
            )}
          </div>

          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() =>
                  sendMessage(suggestion)
                }
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="chat-input-area"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask Roam AI anything about travel..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Assistant;