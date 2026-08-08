import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, saveUserProfile } from '../services/userProfile';
import { loginUser } from '../services/api';
import { saveAuthSession, clearAuthSession } from '../services/authSession';
import { getEmailError, getRequiredError } from '../services/validation';

const initialValues = {
  email: '',
  password: '',
};

function validateLoginField(name, value) {
  if (name === 'email') {
    return getEmailError(value);
  }

  if (name === 'password') {
    return getRequiredError(value, 'Password');
  }

  return '';
}

function validateLoginForm(values) {
  return {
    email: getEmailError(values.email),
    password: getRequiredError(values.password, 'Password'),
  };
}

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateLoginField(name, value),
    }));

    setError('');
    setSuccessMessage('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    setError('');

    if (Object.values(nextErrors).some(Boolean)) {
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('Validation passed. Signing in...');

    try {
      const response = await loginUser({ email: values.email, password: values.password });
      const user = response?.user || response;
      const existingProfile = getUserProfile();
      const resolvedFullName = user.full_name || user.fullName || existingProfile.fullName || '';

      clearAuthSession();

      saveAuthSession({
        userId: user.id ?? null,
        email: user.email || values.email,
        fullName: resolvedFullName,
      });

      saveUserProfile({
        ...existingProfile,
        email: user.email || values.email,
        fullName: resolvedFullName,
      });

      navigate('/dashboard');
    } catch (err) {
      setSuccessMessage('');
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: 16,
    background: 'transparent',
    width: '100%',
  };

  const errorStyle = {
    color: '#b91c1c',
    marginBottom: 12,
    fontSize: 14,
    minHeight: 18,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f8fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
          padding: '16px 20px',
          paddingTop: '28px',
          color: 'white',
          borderRadius: '0 0 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '6px',
            }}
            aria-label="back"
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            Career Planner
          </h1>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: '26px',
              height: '14px',
              border: '1.5px solid white',
              borderRadius: '3px',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 28px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '34px', fontWeight: 800, color: '#0f172a' }}>
          Welcome Back!
        </h2>
        <p style={{ marginTop: 12, marginBottom: 28, color: '#6b7280', fontSize: '16px' }}>
          Sign in to continue your career journey
        </p>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 520 }} noValidate>
          <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 8 }}>
            Email
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #e6e7ea', marginBottom: 18 }}>
            <span style={{ fontSize: 18, color: '#9ca3af' }}>✉️</span>
            <input
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={inputStyle}
              autoComplete="email"
            />
          </div>
          <div style={errorStyle}>{errors.email}</div>

          <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 8 }}>
            Password
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #e6e7ea', marginBottom: 12 }}>
            <span style={{ fontSize: 18, color: '#9ca3af' }}>🔒</span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={inputStyle}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }}
              aria-label={showPassword ? 'hide-password' : 'show-password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div style={errorStyle}>{errors.password}</div>

          <div style={{ marginBottom: 18 }}>
            <button type="button" onClick={() => navigate('/forgot')} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', padding: 0 }}>
              Forgot Password?
            </button>
          </div>

          {error ? (
            <p style={{ color: '#b91c1c', marginBottom: 12, fontSize: 14 }}>
              {error}
            </p>
          ) : null}

          {successMessage ? (
            <p style={{ color: '#166534', marginBottom: 12, fontSize: 14 }}>
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              border: 'none',
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 60%)',
              cursor: 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 18 }}>
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;