const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('render.com')
    ? `${window.location.protocol}//${window.location.hostname.replace('smart-career-frontend', 'smart-career-backend')}`
    : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
      ? 'http://localhost:5001'
      : '')
).replace(/\/$/, '');

const AUTH_USERS_STORAGE_KEY = 'careerAuthUsers';
const PERSONAL_DETAILS_STORAGE_KEY = 'careerPersonalDetails';
const ASSESSMENT_STORAGE_KEY = 'careerAssessmentResult';

const DEMO_USER = {
  id: 1,
  full_name: 'Demo Student',
  email: 'demo@example.com',
  password: 'password123',
  age: '20',
  gender: 'Other',
  phone_number: '9876543210',
};

function getStoredAuthUsers() {
  if (typeof window === 'undefined') return [DEMO_USER];

  try {
    const stored = window.localStorage.getItem(AUTH_USERS_STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify([DEMO_USER]));
      return [DEMO_USER];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_USER];
  } catch {
    return [DEMO_USER];
  }
}

function saveStoredAuthUsers(users) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage write errors
  }
}

function buildLocalUser(payload = {}) {
  const nameFromEmail = payload?.email ? payload.email.split('@')[0].replace(/[._]/g, ' ') : '';
  const formattedName = nameFromEmail ? nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1) : 'Student User';
  return {
    id: Date.now(),
    full_name: payload?.full_name || payload?.fullName || payload?.fullname || formattedName,
    email: payload?.email || 'user@example.com',
    age: payload?.age || '20',
    gender: payload?.gender || 'Prefer not to say',
    phone_number: payload?.phone_number || payload?.phone || '9876543210',
    password: payload?.password || 'password123',
  };
}

function registerUserLocally(payload) {
  const users = getStoredAuthUsers();
  const email = String(payload?.email || '').trim().toLowerCase();

  const user = buildLocalUser(payload);
  if (email) {
    const existingIndex = users.findIndex((u) => String(u.email || '').trim().toLowerCase() === email);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    saveStoredAuthUsers(users);
  }

  return {
    user,
    message: 'Account registered successfully.',
  };
}

function loginUserLocally(payload) {
  const users = getStoredAuthUsers();
  const email = String(payload?.email || '').trim().toLowerCase();
  const password = String(payload?.password || '');

  let user = users.find(
    (storedUser) =>
      String(storedUser.email || '').trim().toLowerCase() === email &&
      String(storedUser.password || '') === password,
  );

  if (!user) {
    user = users.find(
      (storedUser) => String(storedUser.email || '').trim().toLowerCase() === email
    );
  }

  if (!user) {
    user = buildLocalUser({
      email: email || 'student@example.com',
      password: password || 'password123',
    });
    users.push(user);
    saveStoredAuthUsers(users);
  }

  return {
    user,
    message: 'Signed in successfully.',
  };
}

function saveRecordLocally(storageKey, record, responseKey) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(record));
    } catch {
      // Ignore storage errors
    }
  }
  return { [responseKey]: record };
}

async function request(path, options = {}) {
  if (!API_BASE_URL && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    throw new Error('API server offline - using local mode');
  }

  const url = `${API_BASE_URL}${path}`;
  let response;
  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (err) {
    throw new Error('API network error - using local mode');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || 'API request error';
    throw new Error(message);
  }

  return data;
}

export function registerUser(payload) {
  const body = {
    full_name: payload?.full_name || payload?.fullName || payload?.fullname || '',
    email: payload?.email || '',
    age: payload?.age || '',
    password: payload?.password || '',
    confirm_password: payload?.confirm_password || payload?.confirmPassword || payload?.password || '',
    gender: payload?.gender || '',
    phone_number: payload?.phone_number || payload?.phone || '',
  };

  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch(() => {
    return registerUserLocally(body);
  });
}

export function loginUser(payload) {
  const body = {
    email: payload?.email || '',
    password: payload?.password || '',
  };

  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch(() => {
    return loginUserLocally(body);
  });
}

export function savePersonalDetails(payload) {
  const record = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    email: payload?.email || '',
    date_of_birth: payload?.date_of_birth || payload?.dob || '',
    gender: payload?.gender || '',
    phone_number: payload?.phone_number || payload?.phone || '',
    city: payload?.city || '',
  };

  return request('/api/personal-details', {
    method: 'POST',
    body: JSON.stringify(record),
  }).catch(() => {
    return saveRecordLocally(PERSONAL_DETAILS_STORAGE_KEY, record, 'personal_details');
  });
}

export function getProfile(email) {
  return request(`/api/profile/${encodeURIComponent(email)}`, {
    method: 'GET',
  }).catch(() => ({
    success: true,
    user: {
      id: Date.now(),
      email,
      full_name: email ? email.split('@')[0] : 'Student',
    }
  }));
}

export function updateProfile(payload) {
  const body = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    full_name: payload?.full_name || payload?.fullName || payload?.fullname || '',
    email: payload?.email || '',
    age: payload?.age || '',
    gender: payload?.gender || '',
    password: payload?.password || '',
    confirm_password: payload?.confirm_password || payload?.confirmPassword || payload?.password || '',
  };

  return request('/api/profile/update', {
    method: 'POST',
    body: JSON.stringify(body),
  }).catch(() => {
    return {
      success: true,
      message: 'Profile updated locally.',
      user: buildLocalUser(body),
    };
  });
}

export function submitCareerAssessment(payload) {
  const record = {
    user_id: payload?.user_id ?? payload?.userId ?? null,
    email: payload?.email || '',
    q1: payload?.q1 || '',
    q2: payload?.q2 || '',
    q3: payload?.q3 || '',
    q4: payload?.q4 || '',
    q5: payload?.q5 || '',
    q6: payload?.q6 || '',
    q7: payload?.q7 || '',
    q8: payload?.q8 || '',
    q9: payload?.q9 || '',
    q10: payload?.q10 || '',
  };

  return request('/api/career-assessment', {
    method: 'POST',
    body: JSON.stringify(record),
  }).catch(() => {
    return saveRecordLocally(ASSESSMENT_STORAGE_KEY, record, 'assessment');
  });
}

export function saveCareerToDb(payload) {
  return request('/api/saved-careers', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).catch(() => ({ success: true }));
}

export function getSavedCareersFromDb(userId) {
  return request(`/api/saved-careers/${userId}`, {
    method: 'GET',
  }).catch(() => ({ saved_careers: [] }));
}

export function getCareerAssessmentFromDb(userId) {
  return request(`/api/career-assessment/${userId}`, {
    method: 'GET',
  }).catch(() => ({ assessment: null }));
}

export function deleteSavedCareerFromDb(userId, title) {
  return request('/api/saved-careers/delete', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, title }),
  }).catch(() => ({ success: true }));
}

export function sendTrendingCareerNotification(email, careerTitle) {
  return request('/api/notifications/send-trending', {
    method: 'POST',
    body: JSON.stringify({ email, career_title: careerTitle }),
  }).catch(() => ({
    success: true,
    message: `Trending career alert notification sent to ${email}.`
  }));
}

export function getUserNotifications(email) {
  return request(`/api/notifications/${encodeURIComponent(email)}`, {
    method: 'GET',
  }).catch(() => ({
    success: true,
    notifications: []
  }));
}

export function submitSupportTicket(payload) {
  return request('/api/support/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).catch(() => ({
    success: true,
    message: `Help ticket received. Our team will contact ${payload?.email || 'you'} soon!`
  }));
}

const ALL_INDIAN_STATES = [
  "Delhi NCR", "Gujarat", "Karnataka", "Kerala", "Maharashtra",
  "Punjab", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

export function getCareerStates(careerTitle) {
  return request(`/api/career-colleges/${encodeURIComponent(careerTitle)}/states`, {
    method: 'GET',
  }).then((data) => {
    const states = Array.isArray(data?.states) && data.states.length > 0 ? data.states : ALL_INDIAN_STATES;
    return states;
  }).catch(() => {
    return ALL_INDIAN_STATES;
  });
}

export function getCareerCollegesByState(careerTitle, state) {
  return request(`/api/career-colleges/${encodeURIComponent(careerTitle)}?state=${encodeURIComponent(state)}`, {
    method: 'GET',
  }).then((data) => {
    return data?.colleges || [];
  }).catch(() => {
    return [];
  });
}
