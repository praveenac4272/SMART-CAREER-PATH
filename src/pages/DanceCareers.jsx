import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Professional Dancer', salary: '₹2-10 LPA', description: 'Performs choreographed dances in various styles and genres.', category: 'Dance Careers', score: 85, skillsRequired: ['Dance Techniques', 'Rhythm', 'Physical Fitness', 'Choreography'], roadmap: ['Dance Training', 'Style Specialization', 'Performances', 'Freelance Dancing', 'Professional Engagements'], demandLevel: 'Medium', salaryRange: '₹2-10 LPA' },
  { title: 'Choreographer', salary: '₹3-15 LPA', description: 'Creates and designs dance movements and routines for performances.', category: 'Dance Careers', score: 88, skillsRequired: ['Dance Expertise', 'Choreography', 'Creativity', 'Leadership'], roadmap: ['Master Dance', 'Choreography Training', 'Create Routines', 'Direct Performances', 'Build Reputation'], demandLevel: 'High', salaryRange: '₹3-15 LPA' },
  { title: 'Dance Teacher', salary: '₹2-8 LPA', description: 'Teaches dance techniques and styles to students of all ages.', category: 'Dance Careers', score: 80, skillsRequired: ['Teaching Skills', 'Dance Mastery', 'Communication', 'Patience'], roadmap: ['Dance Education', 'Teaching Certification', 'Studio Setup', 'Build Student Base', 'Expand Programs'], demandLevel: 'Medium', salaryRange: '₹2-8 LPA' },
  { title: 'Dance Content Creator', salary: '₹3-12 LPA', description: 'Creates dance videos and content for social media platforms.', category: 'Dance Careers', score: 84, skillsRequired: ['Video Creation', 'Dance', 'Social Media', 'Editing'], roadmap: ['Dance Skills', 'Video Equipment', 'Content Creation', 'Build Audience', 'Monetization'], demandLevel: 'High', salaryRange: '₹3-12 LPA' },
  { title: 'Backup Dancer (Films)', salary: '₹10K-5L (per project)', description: 'Performs backup dance roles in film productions and music videos.', category: 'Dance Careers', score: 82, skillsRequired: ['Dance Skills', 'Film Understanding', 'Quick Learning', 'Flexibility'], roadmap: ['Professional Dancing', 'Film Training', 'Auditions', 'Film Work', 'Lead Roles'], demandLevel: 'Medium', salaryRange: '₹10K-5L (per project)' },
];

export default function DanceCareers() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Dance Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💃</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Dance Careers</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Express through movement</p>
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
