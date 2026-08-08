import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/intro-1', { replace: true });
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.28), transparent 42%), linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #7c3aed 100%)',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          padding: '48px 28px',
          borderRadius: '32px',
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div
          style={{
            width: '110px',
            height: '110px',
            margin: '0 auto 24px',
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <span style={{ fontSize: '48px' }}>✨</span>
        </div>

        <h1 style={{ margin: 0, fontSize: '34px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Smart Career Path
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: '16px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
          Discover personalized career guidance, skill matching, and domain recommendations.
        </p>

        <div
          style={{
            marginTop: '28px',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '999px',
              background: 'white',
              animation: 'splashPulse 1s ease-in-out infinite',
            }}
          />
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.7)',
              animation: 'splashPulse 1s ease-in-out infinite 0.2s',
            }}
          />
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.45)',
              animation: 'splashPulse 1s ease-in-out infinite 0.4s',
            }}
          />
        </div>

        <style>{`
          @keyframes splashPulse {
            0%, 100% { transform: translateY(0); opacity: 0.55; }
            50% { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default SplashScreen;