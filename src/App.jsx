import { useState, useEffect } from "react";
import ApiKeyInput from "./components/ApiKeyInput";
import ChatInterface from "./components/ChatInterface";
import { getApiKey, saveApiKey } from "./utils/localStorage";
import "./styles.css";

function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleApiKeySubmit = (key) => {
    saveApiKey(key);
    setApiKey(key);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AutoThink</h1>
        <p>
          Automatically adjust Claude's thinking based on question complexity
        </p>
      </header>

      {!apiKey ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : (
        <ChatInterface apiKey={apiKey} onResetApiKey={() => setApiKey("")} />
      )}

      <footer className="app-footer">
        <p>
          This is a proof of concept. Your API key is stored locally in your
          browser.
        </p>
      </footer>
    </div>
  );
}

export default App;
