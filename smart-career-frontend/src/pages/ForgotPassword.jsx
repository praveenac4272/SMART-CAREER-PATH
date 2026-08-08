import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)",
          padding: "16px 20px",
          paddingTop: "28px",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "6px",
            }}
            aria-label="back"
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
            Career Planner
          </h1>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: "26px",
              height: "14px",
              border: "1.5px solid white",
              borderRadius: "3px",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "40px 24px", flex: 1, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "540px",
            background: "white",
            borderRadius: "32px",
            padding: "34px 28px",
            boxShadow: "0 35px 80px rgba(15, 23, 42, 0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white",
                fontSize: 28,
                marginBottom: 12,
              }}
            >
              ✈️
            </div>

            <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#0f172a" }}>
              Forgot Password?
            </h2>
            <p style={{ marginTop: 8, color: "#6b7280", fontSize: 16 }}>
              Don't worry! Enter your email and we'll send you a reset link
            </p>
          </div>

          <div style={{ textAlign: "left", marginTop: 12 }}>
            <label style={{ display: "block", fontSize: 14, color: "#374151", marginBottom: 8 }}>Email Address</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", borderRadius: 16, padding: "14px 16px", border: "1px solid #e6e7ea" }}>
              <span style={{ fontSize: 18, color: "#9ca3af" }}>✉️</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ border: "none", outline: "none", flex: 1, fontSize: 16, background: "transparent" }}
              />
            </div>

            <button
              onClick={() => alert('Reset link sent (mock)')}
              style={{ width: "100%", padding: "14px 20px", marginTop: 20, borderRadius: 16, border: "none", color: "white", fontSize: 18, fontWeight: 600, background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 60%)", cursor: "pointer" }}
            >
              Send Reset Link
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, cursor: "pointer", padding: 0, marginTop: 20 }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
