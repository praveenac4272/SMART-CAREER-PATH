import { useNavigate } from "react-router-dom";

function ExploreDomains() {
  const navigate = useNavigate();

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
            Explore Career Domains
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 20 }}>
            Choose your path: traditional or non-traditional
          </p>

          <div style={{ display: "grid", gap: 20 }}>
            <div
              onClick={() => navigate('/traditional-domains')}
              style={{
                background: 'linear-gradient(135deg,#2563eb,#1e40af)',
                color: 'white',
                borderRadius: 18,
                padding: 24,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💼</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Traditional Domains</h3>
                    <p style={{ margin: '6px 0 0', opacity: 0.95 }}>Explore established career paths with proven success</p>
                  </div>
                </div>
                <div style={{ fontSize: 24 }}>→</div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Healthcare','IT','Business','Government','Aviation','Agriculture','Law'].map((tag)=> (
                  <div key={tag} style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 10px', borderRadius: 16, fontSize: 13 }}>{tag}</div>
                ))}
              </div>
            </div>

            <div
              onClick={() => navigate('/non-traditional-domains')}
              style={{
                background: 'linear-gradient(135deg,#d946ef,#ec4899)',
                color: 'white',
                borderRadius: 18,
                padding: 24,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Non-Traditional Domains</h3>
                    <p style={{ margin: '6px 0 0', opacity: 0.95 }}>Discover emerging and creative career opportunities</p>
                  </div>
                </div>
                <div style={{ fontSize: 24 }}>→</div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Acting','Fashion','Music','Gaming','Content Creation','Anime','Writing'].map((tag)=> (
                  <div key={tag} style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 10px', borderRadius: 16, fontSize: 13 }}>{tag}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExploreDomains;
