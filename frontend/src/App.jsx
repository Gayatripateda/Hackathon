import { useEffect, useState } from "react";
import AiChat from "./components/AiChat.jsx";
import OverviewDashboard from "./components/dashboard/OverviewDashboard.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import { Card } from "./components/ui/Card.jsx";
import { Icon } from "./components/ui/Icon.jsx";

const THEME_STORAGE_KEY = "hackathon-starter-kit-theme";
const STORAGE_ERROR_NAMES = ["SecurityError", "QuotaExceededError"];

function isStorageError(error) {
  return (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    STORAGE_ERROR_NAMES.includes(error.name)
  );
}

function getSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  } catch (error) {
    if (!isStorageError(error)) {
      throw error;
    }

    console.warn("Theme storage is unavailable; using dark theme.", error);
    return "dark";
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    if (!isStorageError(error)) {
      throw error;
    }

    console.warn("Theme preference could not be saved.", error);
  }
}

function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [status, setStatus] = useState("Loading");
  const [activeView, setActiveView] = useState("overview");
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setStatus("Connected");
      })
      .catch(() => {
        setMessage("Could not connect to Python backend.");
        setStatus("Disconnected");
      });
  }, []);

  return (
    <div className="app-root" data-theme={theme}>
      <AppShell
        activeView={activeView}
        backendStatus={status}
        onNavigate={setActiveView}
        onToggleTheme={() =>
          setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))
        }
        theme={theme}
      >
        {activeView === "overview" ? (
          <OverviewDashboard
            backendMessage={message}
            backendStatus={status}
            onOpenAi={() => setActiveView("ai")}
          />
        ) : (
          <section className="page-section">
            <header className="page-heading">
              <div>
                <p className="eyebrow">WORKSPACE / AI PLAYGROUND</p>
                <h1>AI Playground</h1>
                <p className="page-description">
                  Try the existing backend-powered AI chat integration.
                </p>
              </div>
              <span className="page-heading-icon">
                <Icon name="sparkles" />
              </span>
            </header>
            <Card className="ai-card">
              <AiChat />
            </Card>
          </section>
        )}
      </AppShell>
    </div>
  );
}

export default App;
