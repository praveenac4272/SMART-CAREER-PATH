import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthSession } from '../services/authSession';
import { submitSupportTicket } from '../services/api';

function HelpSupport() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Career Selection Help');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    setName(session.fullName || 'User');
    setEmail(session.email || 'user@example.com');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setFeedback('Please write your message or question.');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await submitSupportTicket({ name, email, subject, message });
      if (res?.success) {
        setFeedback(res?.message || `Thank you ${name}! Support ticket created successfully.`);
        setMessage('');
      } else {
        setFeedback(res?.message || 'Error submitting support ticket.');
      }
    } catch (err) {
      setFeedback(err.message || 'Error connecting to support service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How do I choose the best state for my career colleges?',
      a: 'Navigate to any Career Details page, select a state from the "Find Colleges" dropdown menu, and view top genuine government and private institutions along with fee details.',
    },
    {
      q: 'How do email notifications for trending careers work?',
      a: 'Go to Profile -> Notifications, choose a trending domain, and click "Send Email Alert Now". An instant update email will be dispatched to your registered email address.',
    },
    {
      q: 'Can I take the Career Assessment multiple times?',
      a: 'Yes! You can retake the assessment anytime from the Dashboard to recalculate your primary domain recommendations.',
    },
    {
      q: 'Is the backend SQLite database updated?',
      a: 'Yes, our backend SQLite database is loaded with over 11,100 verified college entries across 16 domains and 111 careers.',
    },
  ];

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
          <span style={{ fontSize: 36 }}>❓</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Help & Support</h1>
            <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: 14 }}>
              We are here to assist you with your career decisions
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px 40px', maxWidth: 680, margin: '0 auto' }}>
        {/* Contact Support Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
            marginBottom: 24,
          }}
        >
          <h3 style={{ margin: '0 0 14px', fontSize: 18, color: '#0f172a' }}>
            💬 Contact Customer Support
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Your Registered Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    outline: 'none',
                    background: 'white',
                  }}
                >
                  <option value="Career Selection Help">Career Selection Help</option>
                  <option value="State & College Retrieval Question">State & College Retrieval Question</option>
                  <option value="Email & Notification Issue">Email & Notification Issue</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Message / Inquiry
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            {feedback && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: feedback.includes('Thank') || feedback.includes('received') ? '#f0fdf4' : '#fef2f2',
                  color: feedback.includes('Thank') || feedback.includes('received') ? '#166534' : '#991b1b',
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
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
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* FAQs */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#0f172a' }}>
            💡 Frequently Asked Questions
          </h3>

          <div style={{ display: 'grid', gap: 16 }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <h4 style={{ margin: '0 0 6px', fontSize: 15, color: '#1e293b' }}>
                  {faq.q}
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: '1.5' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
