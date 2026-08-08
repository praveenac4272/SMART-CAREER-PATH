import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedCareers, removeSavedCareer } from '../services/savedCareers';

function SavedCareers() {
  const navigate = useNavigate();
  const [savedCareers, setSavedCareers] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getSavedCareers();
      setSavedCareers(data);
    }
    load();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 20,
        background: '#f8fafc',
        color: '#111827',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: 'none',
            background: '#ffffff',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          ←
        </button>
        <div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Saved Careers</p>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Your saved career matches</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {savedCareers.length === 0 ? (
          <div
            style={{
              padding: 32,
              borderRadius: 24,
              background: '#ffffff',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: 16, color: '#4b5563' }}>
              No careers saved yet.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                marginTop: 16,
                background: '#8b5cf6',
                color: '#ffffff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: 16,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Explore careers
            </button>
          </div>
        ) : (
          savedCareers.map((career) => (
            <div
              key={career.title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 22,
                borderRadius: 24,
                background: '#ffffff',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{career.title}</p>
                <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{career.salary}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 14, color: '#8b5cf6', fontWeight: 700 }}>Saved</p>
                  <p style={{ margin: '6px 0 0', fontSize: 14, color: '#9ca3af' }}>{career.match} match</p>
                </div>
                <button
                  onClick={async () => {
                    const updated = await removeSavedCareer(career.title);
                    setSavedCareers(updated);
                  }}
                  style={{
                    background: '#fee2e2',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ef4444',
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  title="Remove saved career"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedCareers;
