import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { saveAuthSession, clearAuthSession } from "../services/authSession";
import { saveUserProfile } from "../services/userProfile";
import {
  getAgeError,
  getConfirmPasswordError,
  getEmailError,
  getNameError,
  getPhoneError,
  getRequiredError,
} from "../services/validation";

const initialValues = {
  fullName: "",
  age: "",
  email: "",
  gender: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function validateSignUpField(name, value, values) {
  if (name === 'fullName') return getNameError(value);
  if (name === 'age') return getAgeError(value);
  if (name === 'email') return getEmailError(value);
  if (name === 'gender') return getRequiredError(value, 'Gender');
  if (name === 'phone') return getPhoneError(value);
  if (name === 'password') return getRequiredError(value, 'Password');
  if (name === 'confirmPassword') return getConfirmPasswordError(values.password, value);
  return '';
}

function validateSignUpForm(values) {
  return {
    fullName: getNameError(values.fullName),
    age: getAgeError(values.age),
    email: getEmailError(values.email),
    gender: getRequiredError(values.gender, 'Gender'),
    phone: getPhoneError(values.phone),
    password: getRequiredError(values.password, 'Password'),
    confirmPassword: getConfirmPasswordError(values.password, values.confirmPassword),
  };
}

function SignUp() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => {
      const nextValues = { ...currentValues, [name]: value };

      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: validateSignUpField(name, value, nextValues),
      }));

      if (name === 'password' && currentValues.confirmPassword) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          confirmPassword: getConfirmPasswordError(value, currentValues.confirmPassword),
        }));
      }

      return nextValues;
    });

    setError('');
    setSuccessMessage('');
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    const nextErrors = validateSignUpForm(values);
    setErrors(nextErrors);
    setError('');

    if (Object.values(nextErrors).some(Boolean)) {
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setSuccessMessage('Validation passed. Creating account...');

      const response = await registerUser({
        full_name: values.fullName,
        age: values.age,
        email: values.email,
        gender: values.gender,
        phone_number: values.phone,
        password: values.password,
        confirm_password: values.confirmPassword,
      });

      clearAuthSession();

      saveAuthSession({
        userId: response.user?.id ?? null,
        studentId: response.user?.id ?? null,
        email: response.user?.email || values.email,
        fullName: response.user?.full_name || values.fullName,
        age: response.user?.age || values.age,
        phone: response.user?.phone_number || values.phone,
      });

      saveUserProfile({
        fullName: response.user?.full_name || values.fullName,
        email: response.user?.email || values.email,
        age: response.user?.age || values.age,
        phone: response.user?.phone_number || values.phone,
      });

      navigate('/personal-details');
    } catch (err) {
      setSuccessMessage('');
      setError(err.message || 'Registration failed');
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
    marginTop: 8,
    fontSize: 14,
    minHeight: 18,
  };

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

      <div
        style={{
          padding: "40px 28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "white",
            borderRadius: "32px",
            padding: "36px 28px",
            boxShadow: "0 35px 80px rgba(15, 23, 42, 0.08)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            Create Account
          </h2>
          <p
            style={{
              marginTop: 12,
              marginBottom: 28,
              color: "#6b7280",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            Start your career planning journey
          </p>

          <form onSubmit={handleCreateAccount} style={{ display: "grid", gap: "18px" }} noValidate>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Full Name
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>👤</span>
                <input
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={inputStyle}
                  autoComplete="name"
                />
              </div>
              <div style={errorStyle}>{errors.fullName}</div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, color: "#374151", marginBottom: 8 }}>
                Age
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", borderRadius: 16, padding: "14px 16px", border: "1px solid #e6e7ea" }}>
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🎂</span>
                <input
                  name="age"
                  value={values.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  style={inputStyle}
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
              <div style={errorStyle}>{errors.age}</div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Gender
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>⚧</span>
                <select
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    fontSize: 16,
                    background: "transparent",
                    color: values.gender ? "#111827" : "#6b7280",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div style={errorStyle}>{errors.gender}</div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Phone Number
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>📞</span>
                <input
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  style={inputStyle}
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>
              <div style={errorStyle}>{errors.phone}</div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>✉️</span>
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
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🔒</span>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  style={inputStyle}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label={showPassword ? 'hide-password' : 'show-password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Confirm Password
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f8fafc",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid #e6e7ea",
                }}
              >
                <span style={{ fontSize: 18, color: "#9ca3af" }}>🔒</span>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={inputStyle}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label={showConfirmPassword ? 'hide-confirm-password' : 'show-confirm-password'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div style={errorStyle}>{errors.confirmPassword}</div>
            </div>

          {error ? (
            <p style={{ color: '#b91c1c', marginTop: '18px', marginBottom: 0, fontSize: 14, textAlign: 'center' }}>
              {error}
            </p>
          ) : null}

          {successMessage ? (
            <p style={{ color: '#166534', marginTop: 12, marginBottom: 0, fontSize: 14, textAlign: 'center' }}>
              {successMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "14px 20px",
              marginTop: "24px",
              borderRadius: 16,
              border: "none",
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 60%, #d946ef 100%)",
              cursor: "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginTop: "20px",
              fontSize: "15px",
            }}
          >
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: "none",
                border: "none",
                color: "#7c3aed",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  </div>
  );
}

export default SignUp;
