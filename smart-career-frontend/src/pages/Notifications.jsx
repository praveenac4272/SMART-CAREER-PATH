import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthSession } from '../services/authSession';
import { sendTrendingCareerNotification, getUserNotifications } from '../services/api';

function Notifications() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('AI/ML Engineer & Cyber Security Analyst');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const trendingCareers = [
    'AI/ML Engineer & Cyber Security Analyst',
    'Data Scientist & Full Stack Developer',
    'Doctor (MBBS) & Medical Specialist',
    'Chartered Accountant & Investment Banker',
    'Commercial Pilot & Aerospace Engineer',
    'IAS & Defence Officer'
  ];

  useEffect(() => {
    const session = getAuthSession();
    const userEmail = session.email || 'user@example.com';
    setEmail(userEmail);

    if (userEmail) {
      loadNotifications(userEmail);
    }
  }, []);

  const loadNotifications = async (userEmail) => {
    try {
      const res = await getUserNotifications(userEmail);
      if (res?.success && Array.isArray(res?.notifications)) {
        setNotifications(res.notifications);
      }
    } catch {
      setNotifications([]);
    }
  };

  const handleSendTrendingNotification = async () => {
    if (!email) {
      setStatusMessage('Please sign in or enter an email address.');
      return;
    }

    setIsSending(true);
    setStatusMessage('');

    try {
      const res = await sendTrendingCareerNotification(email, selectedCareer);
      if (res?.success) {
        setStatusMessage(`📧 Notification email sent to ${email} for trending career: ${selectedCareer}`);
        loadNotifications(email);
      } else {
        setStatusMessage(res?.message || 'Failed to send email notification.');
      }
    } catch (err) {
      setStatusMessage(err.message || 'Error sending notification.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)',
          color: '#ffffff',
          padding: '26px 20px 32px',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <button
          onClick={() => navigate('/profile')}
          style={{
            border: 'none',
            background: 'rgba(255,255,255,0.16)',
            color: 'white',
            width: 42,
            height: 42,
            borderRadius: 14,
            cursor: 'pointer',
            fontSize: 18,
            marginBottom: 20,
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 36 }}>🔔</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Notifications & Alerts</h1>
            <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: 14 }}>
              Email notifications for trending careers ({email})
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
        {/* Send Trending Career Notification Box */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
            marginBottom: 24,
          }}
        >
          <h3 style={{ margin: '0 0 10px', fontSize: 18, color: '#0f172a' }}>
            🔥 Send Trending Career Alert to Email
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#64748b' }}>
            Select a trending career and send an instant update notification email directly to <strong>{email}</strong>.
          </p>

          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
            Select Trending Career Domain
          </label>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              marginBottom: 16,
              outline: 'none',
              background: 'white',
            }}
          >
            {trendingCareers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {statusMessage && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: statusMessage.includes('📧') ? '#f0fdf4' : '#fef2f2',
                color: statusMessage.includes('📧') ? '#166534' : '#991b1b',
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              {statusMessage}
            </div>
          )}

          <button
            onClick={handleSendTrendingNotification}
            disabled={isSending}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              opacity: isSending ? 0.7 : 1,
            }}
          >
            {isSending ? 'Dispatching Email Notification...' : '🚀 Send Email Alert Now'}
          </button>
        </div>

        {/* Sent Notifications History */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#0f172a' }}>
            📬 Notification History
          </h3>

          {notifications.length > 0 ? (
            <div style={{ display: 'grid', gap: 14 }}>
              {notifications.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ fontSize: 15, color: '#1e293b' }}>{item.subject}</strong>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>
                      {new Date(item.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#475569', whiteSpace: 'pre-line' }}>
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 14 }}>
              No email notifications sent yet. Click above to send your first trending career email alert!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
