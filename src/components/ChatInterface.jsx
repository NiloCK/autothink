import { useState, useRef, useEffect } from "react";
import { useAnthropicChat } from "../hooks/useAnthropicChat";
import MessageBubble from "./MessageBubble";
import ThinkingScoreBar from "./ThinkingScoreBar";
import ThinkingIndicator from "./ThinkingIndicator";

const ChatInterface = ({ apiKey, onResetApiKey }) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, isLoading, complexityScore, thinkingBudget } =
    useAnthropicChat(apiKey);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with AutoThink Claude</h2>
        <button className="reset-button" onClick={onResetApiKey}>
          Change API Key
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Start a conversation with Claude!</p>
            <p className="suggestion">
              Try asking a question to see how AutoThink adjusts thinking based
              on complexity.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}

        {isLoading && <ThinkingIndicator complexityScore={complexityScore} />}

        <div ref={messagesEndRef} />
      </div>

      {complexityScore !== null && !isLoading && (
        <ThinkingScoreBar
          score={complexityScore}
          thinkingBudget={thinkingBudget}
        />
      )}

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
