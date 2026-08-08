import { useNavigate } from "react-router-dom";

function NonTraditionalDomains() {
  const navigate = useNavigate();

  const items = [
    { icon: "🎭", label: "Acting & Entertainment", path: "/domain/acting-entertainment" },
    { icon: "👗", label: "Fashion & Modeling", path: "/domain/fashion-modeling" },
    { icon: "🎵", label: "Music", path: "/domain/music" },
    { icon: "💃", label: "Dance", path: "/domain/dance" },
    { icon: "🎨", label: "Arts & Creativity", path: "/domain/arts-creativity" },
    { icon: "🎮", label: "Gaming & Esports", path: "/domain/gaming-esports" },
    { icon: "📱", label: "Influencer & Content", path: "/domain/influencer-content" },
    { icon: "🚀", label: "Entrepreneurship", path: "/domain/entrepreneurship" },
    { icon: "🎬", label: "Anime & Animation", path: "/domain/anime-animation" },
  ];

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

      <div style={{ padding: "28px 20px", flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", textAlign: "center", margin: "10px 0 6px" }}>
            Non-Traditional Domains
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 20 }}>
            Explore creative and emerging careers
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {items.map((it) => (
              <div
                key={it.label}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: 18,
                  minHeight: 110,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
                onClick={() => navigate(it.path)}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{it.icon}</div>
                <div style={{ fontWeight: 700, color: "#0f172a", textAlign: "center" }}>{it.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NonTraditionalDomains;
