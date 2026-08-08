const PROFILE_STORAGE_KEY = 'userProfile';

const defaultProfile = {
  fullName: 'Rahul Kumar',
  email: 'rahul.kumar@example.com',
  age: '24',
  gender: 'Male',
};

export function getUserProfile() {
  if (typeof window === 'undefined') return defaultProfile;

  try {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProfile;
  } catch (err) {
    return defaultProfile;
  }
}

export function saveUserProfile(profile) {
  const updated = {
    ...defaultProfile,
    ...profile,
    fullName: profile?.fullName ?? profile?.full_name ?? defaultProfile.fullName,
    email: profile?.email ?? defaultProfile.email,
    age: profile?.age ?? defaultProfile.age,
    gender: profile?.gender ?? defaultProfile.gender,
  };

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
