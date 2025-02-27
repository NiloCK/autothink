import { useState } from "react";

/**
 * Component for collecting the user's Anthropic API key
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Function to call with the API key when form is submitted
 */
const ApiKeyInput = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }

    // Simple format validation - Anthropic keys typically start with 'sk-ant-'
    if (!apiKey.trim().startsWith("sk-ant-")) {
      setError('API key should start with "sk-ant-"');
      return;
    }

    // Clear any previous errors
    setError("");
    setIsSubmitting(true);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      try {
        // Submit the API key to parent component
        onSubmit(apiKey.trim());
      } catch (err) {
        setError("An error occurred. Please try again.");
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="api-form-container">
      <h2 className="api-form-title">Welcome to AutoThink</h2>

      <p className="mb-4 text-center text-gray-600">
        AutoThink automatically adjusts Claude's thinking depth based on
        question complexity.
      </p>

      <form className="api-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="api-key" className="form-label">
            Anthropic API Key
          </label>
          <input
            id="api-key"
            type="password"
            className={`form-input ${error ? "error" : ""}`}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            disabled={isSubmitting}
            aria-describedby="api-key-note"
          />
          {error && <div className="error-message">{error}</div>}
          <p id="api-key-note" className="api-note mt-2">
            This app communicates directly with Anthropic's API.
            <br />
            Your API key is stored locally in your browser and never sent to our
            servers.
          </p>
        </div>

        <div className="security-warning p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm mb-4">
          <p className="font-medium mb-1">Security Note:</p>
          <p>
            This is a proof of concept application. In production apps, API keys
            should never be stored in the browser. For this demo, your key is
            only stored in your browser's localStorage and only used to
            communicate directly with Anthropic.
          </p>
        </div>

        <button
          type="submit"
          className="submit-button flex justify-center items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner mr-2"></span>
              Connecting...
            </>
          ) : (
            "Connect to Claude"
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an API key? Get one from{" "}
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 underline"
          >
            Anthropic's Console
          </a>
        </p>
      </form>
    </div>
  );
};

export default ApiKeyInput;
