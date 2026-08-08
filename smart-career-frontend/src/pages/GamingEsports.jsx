import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  {
    title: 'Esports Player',
    salary: '₹2-50L+ (prizes)',
    description: 'Esports players compete in professional video game tournaments and earn through prizes and sponsorships.',
    category: 'Gaming & Esports',
    score: 91,
    skillsRequired: ['Gaming Skills', 'Strategy', 'Teamwork', 'Concentration', 'Quick Reflexes'],
    roadmap: ['Master Gaming Skills', 'Join Competitive Teams', 'Join Local Tournaments', 'National Tournaments', 'International Esports'],
    salaryRange: '₹2-50L+ (prizes)',
    demandLevel: 'High',
  },
  {
    title: 'Game Streamer',
    salary: '₹3-30 LPA',
    description: 'Game streamers broadcast their gameplay on platforms like Twitch and YouTube for audiences.',
    category: 'Gaming & Esports',
    score: 87,
    skillsRequired: ['Gaming', 'Entertainment', 'Technical Skills', 'Community Management', 'Content Creation'],
    roadmap: ['Setup Streaming Equipment', 'Learn Streaming Platforms', 'Build Audience', 'Grow Community', 'Sponsorship Deals'],
    salaryRange: '₹3-30 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Gaming Coach',
    salary: '₹2-10 LPA',
    description: 'Gaming coaches train players and teams to improve competitive gaming performance.',
    category: 'Gaming & Esports',
    score: 82,
    skillsRequired: ['Gaming Expertise', 'Coaching', 'Strategy Analysis', 'Communication', 'Leadership'],
    roadmap: ['Master Gaming', 'Coaching Certification', 'Start Coaching Individuals', 'Coach Teams', 'Professional Coaching'],
    salaryRange: '₹2-10 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Game Developer',
    salary: '₹5-20 LPA',
    description: 'Game developers design and create video games using programming and creative skills.',
    category: 'Gaming & Esports',
    score: 89,
    skillsRequired: ['Programming', 'Game Engine', '3D Graphics', 'Problem Solving', 'Creativity'],
    roadmap: ['Learn Programming', 'Game Engine Training', 'Create Small Games', 'Join Game Studios', 'Lead Game Development'],
    salaryRange: '₹5-20 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Gaming Content Creator',
    salary: '₹3-25 LPA',
    description: 'Content creators produce gaming videos, tutorials, and entertainment content.',
    category: 'Gaming & Esports',
    score: 85,
    skillsRequired: ['Video Editing', 'Gaming', 'Content Creation', 'Marketing', 'Entertainment'],
    roadmap: ['Create Gaming Videos', 'Build YouTube Channel', 'Grow Audience', 'Collaborate with Creators', 'Monetization'],
    salaryRange: '₹3-25 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Esports Commentator',
    salary: '₹3-12 LPA',
    description: 'Commentators provide live commentary for esports tournaments and streaming events.',
    category: 'Gaming & Esports',
    score: 80,
    skillsRequired: ['Gaming Knowledge', 'Commentary', 'Public Speaking', 'Crowd Engagement', 'Entertainment'],
    roadmap: ['Deep Gaming Knowledge', 'Public Speaking Training', 'Practice Commentary', 'Local Tournament Commentary', 'Professional Events'],
    salaryRange: '₹3-12 LPA',
    demandLevel: 'Medium',
  },
];

export default function GamingEsports() {
  const navigate = useNavigate();
  
  const headerGradient = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Gaming & Esports</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎮</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Gaming & Esports</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Play, compete, dominate</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: 18 }}>→</div>
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
