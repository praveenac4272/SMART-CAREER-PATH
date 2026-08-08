import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../services/authSession';
import { getUserProfile } from '../services/userProfile';

function Profile() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const profile = getUserProfile();
    setUserName(profile.fullName || '');
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const profileItems = [
    { title: 'Profile Information', subtitle: 'Edit your details', icon: 'ℹ️' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)',
          color: '#ffffff',
          padding: '26px 20px 36px',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            border: 'none',
            background: 'rgba(255,255,255,0.16)',
            color: 'white',
            width: 42,
            height: 42,
            borderRadius: 14,
            cursor: 'pointer',
            fontSize: 18,
            marginBottom: 24,
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 36 }}>👤</span>
          </div>
          <div>
            <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>Account</p>
            <h1 style={{ margin: '8px 0 0', fontSize: 32, fontWeight: 700 }}>Profile</h1>
            {userName ? (
              <p style={{ margin: '6px 0 0', fontSize: 16, color: '#d1d5db' }}>{userName}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px 40px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 28,
            padding: 22,
            boxShadow: '0 18px 64px rgba(15, 23, 42, 0.08)',
          }}
        >
          {profileItems.map((item) => (
            <button
              key={item.title}
              onClick={() => {
                if (item.title === 'Profile Information') {
                  navigate('/profile-info');
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: 'none',
                background: 'transparent',
                padding: '18px 0',
                cursor: 'pointer',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 18,
                    background: '#eef2ff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 18,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{item.title}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b7280' }}>{item.subtitle}</p>
                </div>
              </div>
              <span style={{ fontSize: 18, color: '#9ca3af' }}>〉</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: 18,
              padding: '16px 0',
              borderRadius: 18,
              border: 'none',
              background: '#fef2f2',
              color: '#b91c1c',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
