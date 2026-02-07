import { useState } from "react";
import { apiCall } from "../../src/api/client";
import AuthModal from "../components/AuthModal";

export function meta() {
  return [
    { title: "FILLIN_APP_TITLE" },
    { name: "description", content: "FILLIN_APP_DESCRIPTION" },
  ];
}

export default function Home() {
  const [pingResult, setPingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  async function handlePing() {
    setLoading(true);
    setError(null);
    setPingResult(null);
    try {
      const data = await apiCall("ping");
      setPingResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>FILLIN_APP_NAME</h1>
        <p style={{ fontSize: "1.25rem", color: "#666", marginTop: "1rem" }}>
          FILLIN_APP_TAGLINE
        </p>
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={() => setShowAuth(true)}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "none",
              background: "#4F46E5",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={handlePing}
            disabled={loading}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
              color: "#333",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Pinging..." : "Ping Backend"}
          </button>
        </div>
        {pingResult && (
          <p style={{ marginTop: "1rem", color: "#16a34a" }}>
            {pingResult.status} — service: {pingResult.service}
          </p>
        )}
        {error && (
          <p style={{ marginTop: "1rem", color: "#dc2626" }}>
            Error: {error}
          </p>
        )}
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
