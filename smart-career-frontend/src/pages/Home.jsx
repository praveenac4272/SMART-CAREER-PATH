import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Status Bar Time removed to match Dashboard */}

      {/* Battery Icon */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '24px',
          height: '12px',
          border: '1.5px solid white',
          borderRadius: '2px',
          backgroundColor: 'white',
        }}
      />

      {/* Sparkle Icon */}
      <div
        style={{
          position: 'absolute',
          top: '280px',
          right: '40px',
          fontSize: '32px',
        }}
      >
        ✨
      </div>

      {/* Arrow Icon Container */}
      <div
        style={{
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '28px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '40px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 45L15 30M30 45L45 30M30 45V15"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Heading */}
      <h1
        style={{
          fontSize: '56px',
          fontWeight: '700',
          color: 'white',
          margin: '0 0 10px 0',
          textAlign: 'center',
          letterSpacing: '-1px',
        }}
      >
        Career Planner
      </h1>

      {/* Subheading */}
      <h2
        style={{
          fontSize: '22px',
          fontWeight: '400',
          color: 'rgba(255, 255, 255, 0.9)',
          margin: '0 0 30px 0',
          textAlign: 'center',
          letterSpacing: '0.5px',
        }}
      >
        AI-Powered Career Guidance
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          maxWidth: '320px',
          margin: '0 0 50px 0',
          lineHeight: '1.6',
          fontWeight: '300',
        }}
      >
        Discover your perfect career path with personalized AI recommendations
      </p>

      {/* Get Started Button */}
      <button
        onClick={() => navigate('/login')}
        style={{
          width: '100%',
          maxWidth: '280px',
          padding: '18px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#a855f7',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          marginBottom: '16px',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
        }}
      >
        Get Started
      </button>

      {/* Create Account Button */}
      <button
        onClick={() => navigate('/register')}
        style={{
          width: '100%',
          maxWidth: '280px',
          padding: '18px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Create Account
      </button>

      {/* Version */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          fontWeight: '400',
          letterSpacing: '0.5px',
        }}
      >
        Version 1.0.0
      </div>
    </div>
  );
}

export default Home;