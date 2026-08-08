import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Graphic Designer', salary: '₹2-12 LPA', description: 'Designs visual content including logos, branding, and digital media.', category: 'Arts & Creativity', score: 86, skillsRequired: ['Design Software', 'Creativity', 'Color Theory', 'Typography'], roadmap: ['Design Fundamentals', 'Software Mastery', 'Portfolio Build', 'Freelance Projects', 'Agency Work'], demandLevel: 'High', salaryRange: '₹2-12 LPA' },
  { title: 'Illustrator', salary: '₹2-10 LPA', description: 'Creates custom illustrations for various media and publications.', category: 'Arts & Creativity', score: 84, skillsRequired: ['Drawing Skills', 'Digital Art', 'Style Development', 'Client Communication'], roadmap: ['Artistic Training', 'Medium Selection', 'Portfolio Creation', 'Client Base', 'Specialization'], demandLevel: 'Medium', salaryRange: '₹2-10 LPA' },
  { title: 'Digital Artist', salary: '₹3-15 LPA', description: 'Creates digital art and visual effects for entertainment and design industries.', category: 'Arts & Creativity', score: 87, skillsRequired: ['Digital Illustration', 'Animation', 'Software Proficiency', 'Concept Art'], roadmap: ['Art Education', 'Digital Tools', 'Effect Design', 'Portfolio', 'Professional Work'], demandLevel: 'High', salaryRange: '₹3-15 LPA' },
  { title: 'Fine Artist', salary: '₹1-8 LPA', description: 'Creates traditional or contemporary art pieces for galleries and collectors.', category: 'Arts & Creativity', score: 82, skillsRequired: ['Artistic Talent', 'Technique Mastery', 'Art History', 'Business Skills'], roadmap: ['Art Training', 'Technique Development', 'Gallery Exhibitions', 'Build Reputation', 'Art Sales'], demandLevel: 'Medium', salaryRange: '₹1-8 LPA' },
  { title: 'Art Director', salary: '₹5-18 LPA', description: 'Directs visual aspects of projects in advertising, film, and publishing.', category: 'Arts & Creativity', score: 89, skillsRequired: ['Leadership', 'Design Knowledge', 'Project Management', 'Vision'], roadmap: ['Design Background', 'Team Management', 'Project Leadership', 'Creative Direction', 'Senior Roles'], demandLevel: 'High', salaryRange: '₹5-18 LPA' },
  { title: 'Tattoo Artist', salary: '₹2-12 LPA', description: 'Designs and creates custom tattoos for clients.', category: 'Arts & Creativity', score: 81, skillsRequired: ['Artistic Skill', 'Hygiene Compliance', 'Design', 'Client Consultation'], roadmap: ['Apprenticeship', 'Skill Development', 'Own Studio', 'Build Clientele', 'Specialization'], demandLevel: 'Medium', salaryRange: '₹2-12 LPA' },
];

export default function ArtsCreativity() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(135deg, #ff8a5b 0%, #ff6b35 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Arts & Creativity</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎨</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Arts & Creativity</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Paint your imagination</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#ff6b35', fontWeight: 700, fontSize: 18 }}>→</div>
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
