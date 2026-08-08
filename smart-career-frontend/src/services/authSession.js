const AUTH_SESSION_KEY = 'careerAuthSession';

const defaultSession = {
  userId: null,
  studentId: null,
  email: '',
  fullName: '',
  age: '',
  phone: '',
};

export function getAuthSession() {
  if (typeof window === 'undefined') return defaultSession;

  try {
    const stored = window.localStorage.getItem(AUTH_SESSION_KEY);
    return stored ? { ...defaultSession, ...JSON.parse(stored) } : defaultSession;
  } catch {
    return defaultSession;
  }
}

export function saveAuthSession(session) {
  const updated = { ...getAuthSession(), ...session };
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.localStorage.removeItem('careerAssessmentResult');
  window.localStorage.removeItem('assessmentAnswers');
}
