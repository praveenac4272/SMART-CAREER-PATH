import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Playback Singer', salary: '₹5L-50L (per song)', description: 'Playback singers provide vocals for movies and albums.', category: 'Music Careers', score: 90, skillsRequired: ['Singing', 'Voice Control', 'Music Theory', 'Emotional Expression'], roadmap: ['Vocal Training', 'Music Theory', 'Recording Studio Work', 'Song Auctions', 'Playback Contracts'], demandLevel: 'High' },
  { title: 'Music Producer', salary: '₹4-20 LPA', description: 'Music producers create, arrange, and oversee music production for artists.', category: 'Music Careers', score: 88, skillsRequired: ['Music Production', 'Audio Engineering', 'Mixing & Mastering', 'Creative Direction'], roadmap: ['Production Training', 'Equipment Setup', 'Work with Artists', 'Build Portfolio', 'Establish Studio'], demandLevel: 'High' },
  { title: 'Music Composer', salary: '₹5-30 LPA', description: 'Composers create original music for films, games, and albums.', category: 'Music Careers', score: 89, skillsRequired: ['Music Composition', 'Orchestration', 'Music Theory', 'Creativity'], roadmap: ['Music Education', 'Composition Training', 'Build Portfolio', 'Film/Game Pitches', 'Licensing Deals'], demandLevel: 'High' },
  { title: 'DJ / Music Artist', salary: '₹3-15 LPA', description: 'DJs mix and perform music at events, clubs, and festivals.', category: 'Music Careers', score: 85, skillsRequired: ['DJing', 'Music Selection', 'Equipment', 'Entertainment', 'Sound System'], roadmap: ['DJ Training', 'Equipment Learning', 'Local Events', 'Clubs/Venues', 'Festival Bookings'], demandLevel: 'Medium' },
  { title: 'Music Teacher', salary: '₹2-8 LPA', description: 'Music teachers provide instruction in vocals or instruments.', category: 'Music Careers', score: 80, skillsRequired: ['Musical Skill', 'Teaching', 'Communication', 'Patience'], roadmap: ['Music Certification', 'Performance Experience', 'Teaching Training', 'Student Base', 'Music School Position'], demandLevel: 'Medium' },
  { title: 'Sound Engineer', salary: '₹3-12 LPA', description: 'Sound engineers handle audio recording, mixing, and live sound management.', category: 'Music Careers', score: 83, skillsRequired: ['Audio Engineering', 'Equipment Knowledge', 'Problem Solving', 'Technical Skills'], roadmap: ['Audio Engineering Course', 'Studio Training', 'Recording Experience', 'Live Sound Work', 'Senior Engineer'], demandLevel: 'High' },
];

export default function MusicCareers() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Music Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Music Careers</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Create melodies that move souls</p>
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
