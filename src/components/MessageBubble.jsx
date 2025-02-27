import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  getComplexityColor,
  getComplexityLabel,
} from "../utils/thinkingLevels";

const MessageBubble = ({ message }) => {
  const [showThinking, setShowThinking] = useState(false);
  const isAssistant = message.role === "assistant";

  // Get complexity from the message itself
  const showComplexity = isAssistant && message.complexityScore !== undefined;

  // Get complexity info if available
  const complexityScore = showComplexity ? message.complexityScore : null;
  const complexityLabel = showComplexity
    ? getComplexityLabel(complexityScore)
    : null;
  const complexityColor = showComplexity
    ? getComplexityColor(complexityScore)
    : null;

  return (
    <div className={`message-bubble ${isAssistant ? "assistant" : "user"}`}>
      <div className="message-header">
        <div className="message-sender">{isAssistant ? "Claude" : "You"}</div>

        {isAssistant && message.thinking && (
          <button
            className="thinking-toggle"
            onClick={() => setShowThinking(!showThinking)}
          >
            {showThinking ? "Hide Thinking" : "Show Thinking"}
          </button>
        )}
      </div>

      {/* Complexity section - moved to be full width */}
      {showComplexity && (
        <div
          className="complexity-section"
          style={{ marginTop: "4px", marginBottom: "8px" }}
        >
          <div
            className="complexity-bar bg-gray-200 rounded-full overflow-hidden relative"
            style={{
              height: "8px",
              backgroundColor: "#d1f1f1",
              width: "100%",
              cursor: "help",
            }}
            title={`Complexity ${complexityScore}: ${complexityLabel}`}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${complexityScore}%`,
                backgroundColor: complexityColor,
                height: "100%",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Rest of component remains the same */}
      {isAssistant && showThinking && message.thinking && (
        <div className="thinking-content">
          <div className="thinking-label">Claude's Thinking Process:</div>
          <div className="thinking-box">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.thinking}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div className="message-content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageBubble;
