import { useNavigate } from "react-router-dom";

function Chatbot() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)", padding: "16px 20px", paddingTop: "28px", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to dashboard"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: "999px",
              width: 40,
              height: 40,
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Career Assistant</h1>
        </div>
      </div>

      <div style={{ padding: "24px 16px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" }}>
          <p style={{ margin: 0, color: "#4b5563" }}>This feature has been removed. You can return to the dashboard.</p>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;