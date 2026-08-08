import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, savePersonalDetails } from '../services/api';
import { getAuthSession, saveAuthSession } from '../services/authSession';
import { getUserProfile, saveUserProfile } from '../services/userProfile';

function ProfileInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: 'Male',
  });
  const [personalDetails, setPersonalDetails] = useState({
    date_of_birth: '',
    phone_number: '',
    city: '',
    user_id: null,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const session = getAuthSession();

    if (!session.email) {
      setProfile(getUserProfile());
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await getProfile(session.email);
        if (!isMounted) return;

        const user = response?.user || {};
        const details = response?.personal_details || {};

        setProfile({
          fullName: user.full_name || session.fullName || '',
          email: user.email || session.email || '',
          age: user.age || getUserProfile().age || '',
          gender: user.gender || details.gender || getUserProfile().gender || 'Male',
        });
        setPersonalDetails({
          date_of_birth: details.date_of_birth || '',
          phone_number: details.phone_number || '',
          city: details.city || '',
          user_id: user.id || session.userId || null,
        });
      } catch {
        if (!isMounted) return;

        setProfile(getUserProfile());
        
        // Fallback: load personal details and education details from local storage
        try {
          const rawPersonal = localStorage.getItem('careerPersonalDetails');
          if (rawPersonal) {
            const parsed = JSON.parse(rawPersonal);
            setPersonalDetails({
              date_of_birth: parsed.date_of_birth || parsed.dob || '',
              phone_number: parsed.phone_number || parsed.phone || '',
              city: parsed.city || '',
              user_id: session.userId || null,
            });
          }
        } catch {}

        // No education details fallback needed after removing the education details screen.
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    try {
      const updatedUser = await updateProfile({
        user_id: personalDetails.user_id,
        full_name: profile.fullName,
        email: profile.email,
        age: profile.age,
        gender: profile.gender,
      });

      const updatedProfile = saveUserProfile({
        ...profile,
        fullName: updatedUser.user?.full_name || profile.fullName,
        email: updatedUser.user?.email || profile.email,
        age: updatedUser.user?.age || profile.age,
        gender: updatedUser.user?.gender || profile.gender,
      });

      saveAuthSession({
        userId: updatedUser.user?.id ?? personalDetails.user_id,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email,
      });

      if (personalDetails.user_id) {
        await savePersonalDetails({
          user_id: personalDetails.user_id,
          email: updatedProfile.email,
          date_of_birth: personalDetails.date_of_birth,
          phone_number: personalDetails.phone_number,
          city: personalDetails.city,
        });
      }

      setSuccessMessage('Profile saved successfully.');
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 800);
    } catch (err) {
      setError(err.message || 'Could not save profile changes');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    fontSize: 15,
    outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)',
          color: '#ffffff',
          padding: '32px 20px 28px',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <button
          onClick={() => navigate(-1)}
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
        <div>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>View and edit your profile details</p>
          <h1 style={{ margin: '12px 0 0', fontSize: 32, fontWeight: 700 }}>Profile Information</h1>
        </div>
      </div>

      <div style={{ padding: '28px 20px 40px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 18px 64px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div style={{ margin: '0 0 12px', fontWeight: 800, fontSize: 18, borderBottom: '2px solid #f3f4f6', paddingBottom: 6 }}>Basic Profile</div>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Full Name</span>
            <input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="Enter your full name"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Email Address</span>
            <input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Age</span>
            <input
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              placeholder="Enter your age"
              style={inputStyle}
            />
          </label>

          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 10, fontWeight: 700 }}>Gender</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Male', 'Female', 'Other'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: option })}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 16,
                    border: profile.gender === option ? '2px solid #4f46e5' : '1px solid #d1d5db',
                    background: profile.gender === option ? '#eef2ff' : '#ffffff',
                    color: '#111827',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ margin: '24px 0 12px', fontWeight: 800, fontSize: 18, borderBottom: '2px solid #f3f4f6', paddingBottom: 6 }}>Personal Details</div>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Date of Birth</span>
            <input
              type="date"
              value={personalDetails.date_of_birth}
              onChange={(e) => setPersonalDetails({ ...personalDetails, date_of_birth: e.target.value })}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Phone Number</span>
            <input
              value={personalDetails.phone_number}
              onChange={(e) => setPersonalDetails({ ...personalDetails, phone_number: e.target.value })}
              placeholder="Enter your phone number"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>City</span>
            <input
              value={personalDetails.city}
              onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })}
              placeholder="Enter your city"
              style={inputStyle}
            />
          </label>

          {error ? (
            <p style={{ margin: '0 0 16px', color: '#b91c1c', fontSize: 14, textAlign: 'center' }}>{error}</p>
          ) : null}

          {successMessage ? (
            <p style={{ margin: '0 0 16px', color: '#166534', fontSize: 14, textAlign: 'center' }}>{successMessage}</p>
          ) : null}

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '16px 0',
              border: 'none',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 12,
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
