import { useNavigate } from 'react-router-dom';

function IntroScreenOne() {
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
          'radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 40%), linear-gradient(135deg, #2563eb 0%, #7c3aed 52%, #ec4899 100%)',
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
          backdropFilter: 'blur(14px)',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.12em' }}>
          INTRO 01
        </div>
        <h1 style={{ margin: '14px 0 12px', fontSize: '30px', lineHeight: 1.15, color: 'white' }}>
          Discover career paths that fit your strengths
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.86)', fontSize: '16px', lineHeight: 1.7 }}>
          Smart Career Path helps you explore traditional and non-traditional domains based on your interests, education, and goals.
        </p>

        <div
          style={{
            marginTop: '26px',
            padding: '18px',
            borderRadius: '22px',
            background: 'rgba(255, 255, 255, 0.12)',
            display: 'grid',
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '22px' }}>🧭</span>
            <span style={{ color: 'white', fontWeight: 600 }}>Personalized guidance</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '22px' }}>📚</span>
            <span style={{ color: 'white', fontWeight: 600 }}>Skills and education match</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '22px' }}>
          <span style={{ width: '22px', height: '8px', borderRadius: '999px', background: 'white' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.45)' }} />
        </div>

        <button
          onClick={() => navigate('/intro-2')}
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
          Continue
        </button>
      </div>
    </div>
  );
}

export default IntroScreenOne;