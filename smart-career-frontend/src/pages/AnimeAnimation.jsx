import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Animator', salary: '₹2-15 LPA', description: 'Creates frame-by-frame or computer animation for various media.', category: 'Anime & Animation', score: 84, skillsRequired: ['Animation Software', 'Timing', 'Movement', 'Creativity'], roadmap: ['Animation Basics', 'Software Training', 'Portfolio Build', 'Studio Work', 'Specialization'], demandLevel: 'High', salaryRange: '₹2-15 LPA' },
  { title: '3D Artist', salary: '₹3-18 LPA', description: 'Creates 3D models and visual effects for animation and games.', category: 'Anime & Animation', score: 87, skillsRequired: ['3D Modeling', '3D Software', 'Visual Effects', 'Texturing'], roadmap: ['3D Software', 'Modeling Skills', 'Effects Training', 'Portfolio', 'Advanced Projects'], demandLevel: 'High', salaryRange: '₹3-18 LPA' },
  { title: 'Character Designer', salary: '₹3-12 LPA', description: 'Designs characters for animation, games, and other visual media.', category: 'Anime & Animation', score: 85, skillsRequired: ['Character Design', 'Drawing', 'Anatomy', 'Design Software'], roadmap: ['Artistic Training', 'Character Concepts', 'Portfolio Dev', 'Client Work', 'Specialization'], demandLevel: 'Medium', salaryRange: '₹3-12 LPA' },
  { title: 'Storyboard Artist', salary: '₹2-10 LPA', description: 'Creates visual storyboards for animation, film, and commercials.', category: 'Anime & Animation', score: 83, skillsRequired: ['Visual Communication', 'Drawing', 'Composition', 'Narrative'], roadmap: ['Drawing Skills', 'Visual Storytelling', 'Software Learning', 'Project Portfolio', 'Studio Work'], demandLevel: 'Medium', salaryRange: '₹2-10 LPA' },
  { title: 'VFX Artist', salary: '₹3-20 LPA', description: 'Creates visual effects for movies, TV, and digital media.', category: 'Anime & Animation', score: 88, skillsRequired: ['VFX Software', 'Effects Design', 'Motion Graphics', 'Compositing'], roadmap: ['VFX Basics', 'Software Training', 'Effects Portfolio', 'Complex Projects', 'Specialization'], demandLevel: 'High', salaryRange: '₹3-20 LPA' },
  { title: 'Animation Director', salary: '₹4-25 LPA', description: 'Directs animation projects and teams in creative direction.', category: 'Anime & Animation', score: 89, skillsRequired: ['Animation Mastery', 'Leadership', 'Vision', 'Project Management'], roadmap: ['Animation Experience', 'Leadership Training', 'Team Management', 'Direction', 'Senior Roles'], demandLevel: 'High', salaryRange: '₹4-25 LPA' },
];

export default function AnimeAnimation() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Anime & Animation</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎬</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Anime & Animation</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Bring stories to life</p>
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
