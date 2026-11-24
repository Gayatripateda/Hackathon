import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [status, setStatus] = useState("Loading");

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
    <div style={{ fontFamily: "Arial", padding: "40px" }}>
      <h1>Hackathon Starter Kit 🚀</h1>

      <h2>Frontend: React</h2>
      <p>Status: Running</p>

      <h2>Backend: Python FastAPI</h2>
      <p>Status: {status}</p>

      <h3>Backend Response:</h3>
      <p>{message}</p>
    </div>
  );
}

export default App;