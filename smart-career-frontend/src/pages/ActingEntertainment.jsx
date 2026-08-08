import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  {
    title: 'Film Actor',
    salary: '₹5L-10Cr (varies)',
    description: 'Film actors perform roles in movies, bringing characters to life on the big screen.',
    category: 'Acting & Entertainment',
    score: 94,
    skillsRequired: ['Acting Skills', 'Emotional Expression', 'Dialogue Delivery', 'Stage Presence', 'Creativity'],
    roadmap: ['Acting Training/Workshops', 'Theater Experience', 'Film Auditions', 'Small Roles', 'Lead Roles'],
    salaryRange: '₹5L-10Cr (varies)',
    demandLevel: 'High',
  },
  {
    title: 'Theater Artist',
    salary: '₹2-8 LPA',
    description: 'Theater artists perform in stage plays and live productions for audiences.',
    category: 'Acting & Entertainment',
    score: 88,
    skillsRequired: ['Acting', 'Stage Presence', 'Voice Control', 'Improvisation', 'Collaboration'],
    roadmap: ['Drama Classes', 'Theater Training', 'Local Theater Groups', 'Professional Productions', 'Lead Roles'],
    salaryRange: '₹2-8 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Voice Actor',
    salary: '₹3-12 LPA',
    description: 'Voice actors provide voices for animation, dubbed content, audiobooks, and commercials.',
    category: 'Acting & Entertainment',
    score: 86,
    skillsRequired: ['Voice Control', 'Acting', 'Multiple Accents', 'Audio Editing', 'Character Creation'],
    roadmap: ['Voice Training', 'Diction Classes', 'Demo Reel Creation', 'Portfolio Building', 'Industry Auditions'],
    salaryRange: '₹3-12 LPA',
    demandLevel: 'High',
  },
  {
    title: 'TV Serial Actor',
    salary: '₹5-50L (per show)',
    description: 'TV actors perform lead and supporting roles in television series and dramas.',
    category: 'Acting & Entertainment',
    score: 90,
    skillsRequired: ['Acting', 'Continuous Performance', 'Character Consistency', 'Dialogue Delivery', 'Adaptability'],
    roadmap: ['Acting Training', 'Theater/Film Background', 'Audition Process', 'TV Show Casting', 'Long-term Roles'],
    salaryRange: '₹5-50L (per show)',
    demandLevel: 'High',
  },
  {
    title: 'Stand-up Comedian',
    salary: '₹3-20 LPA',
    description: 'Stand-up comedians perform comedy acts on stage, creating humor and entertaining audiences.',
    category: 'Acting & Entertainment',
    score: 85,
    skillsRequired: ['Comedy Writing', 'Timing', 'Improvisation', 'Public Speaking', 'Audience Engagement'],
    roadmap: ['Comedy Writing', 'Open Mics', 'Small Shows', 'Build Audience', 'Tours & Specials'],
    salaryRange: '₹3-20 LPA',
    demandLevel: 'Medium',
  },
];

export default function ActingEntertainment() {
  const navigate = useNavigate();
  
  const headerGradient = 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Acting & Entertainment</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎭</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Acting & Entertainment</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Entertain and inspire millions</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#ec4899', fontWeight: 700, fontSize: 18 }}>→</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/non-traditional-domains')} style={{ width: '100%', padding: 14, borderRadius: 12, background: headerGradient, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Back to Domains</button>
        </div>
      </main>
    </div>
  );
}
