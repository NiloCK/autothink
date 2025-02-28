import { useState, useEffect } from "react";
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
  const isStreaming = message.isStreaming === true;
  const hasThinking = isAssistant && (message.thinking || "").trim().length > 0;
  const isThinkingOnly =
    hasThinking && (message.content || "").trim().length === 0;

  // Auto-show thinking when it's streaming and there's no content yet
  useEffect(() => {
    if (isStreaming && isThinkingOnly && !showThinking) {
      setShowThinking(true);
    }
  }, [isStreaming, isThinkingOnly, showThinking]);

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
        <div className="message-sender">
          {isAssistant ? "Claude" : "You"}
          {isStreaming && (
            <span
              className="streaming-indicator"
              style={{ marginLeft: "8px", color: "#36a3a5" }}
            >
              {isThinkingOnly ? "thinking..." : "typing..."}
            </span>
          )}
        </div>

        {isAssistant && hasThinking && (
          <button
            className="thinking-toggle"
            onClick={() => setShowThinking(!showThinking)}
          >
            {showThinking ? (
              "Hide Thinking"
            ) : (
              <span style={{ display: "flex", alignItems: "center" }}>
                Show Thinking
                {isStreaming && !showThinking && (
                  <span
                    className="thinking-pulse"
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#36a3a5",
                      marginLeft: "6px",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                )}
              </span>
            )}
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

      {/* Thinking section - now shows even when streaming */}
      {isAssistant && showThinking && hasThinking && (
        <div className="thinking-content">
          <div className="thinking-label">
            Claude's Thinking Process:
            {isStreaming && (
              <span
                style={{
                  fontSize: "0.9em",
                  marginLeft: "8px",
                  color: "#36a3a5",
                }}
              >
                (streaming...)
              </span>
            )}
          </div>
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
            {isStreaming && (
              <div
                className="cursor-pulse"
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "16px",
                  backgroundColor: "#36a3a5",
                  marginLeft: "2px",
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Content may be empty while still thinking */}
      {(!isThinkingOnly || !isStreaming) && (
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
          {isStreaming && message.content && (
            <div
              className="cursor-pulse"
              style={{
                display: "inline-block",
                width: "10px",
                height: "16px",
                backgroundColor: "#36a3a5",
                marginLeft: "2px",
                animation: "blink 1s step-end infinite",
              }}
            />
          )}
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.4;
          }
        }

        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
