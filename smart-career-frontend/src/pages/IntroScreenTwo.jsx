import { useNavigate } from 'react-router-dom';

function IntroScreenTwo() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at bottom right, rgba(255,255,255,0.14), transparent 36%), linear-gradient(135deg, #2563eb 0%, #7c3aed 52%, #ec4899 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px 26px 28px',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.14)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: 'white',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.12em' }}>
          INTRO 02
        </div>
        <h1 style={{ margin: '14px 0 12px', fontSize: '30px', lineHeight: 1.15, color: 'white' }}>
          Get recommendations and build your profile
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: '16px', lineHeight: 1.7 }}>
          Complete your details to receive career suggestions, domain insights, and assessment-based recommendations.
        </p>

        <div
          style={{
            marginTop: '26px',
            display: 'grid',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <span style={{ fontSize: '22px' }}>🎯</span>
            <span style={{ fontWeight: 600 }}>Career assessment and recommendations</span>
          </div>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <span style={{ fontSize: '22px' }}>🚀</span>
            <span style={{ fontWeight: 600 }}>Fast access to explore domains</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '22px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.45)' }} />
          <span style={{ width: '22px', height: '8px', borderRadius: '999px', background: 'white' }} />
        </div>

        <button
          onClick={() => navigate('/home', { replace: true })}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '15px 18px',
            border: 'none',
            borderRadius: '16px',
            background: 'white',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            color: '#7c3aed',
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default IntroScreenTwo;