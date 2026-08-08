import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  {
    title: 'Fashion Designer',
    salary: '₹3-15 LPA',
    description: 'Fashion designers create clothing and accessory designs for fashion brands and retailers.',
    category: 'Fashion & Modeling',
    score: 88,
    skillsRequired: ['Design Skills', 'Creativity', 'Sewing', 'Trend Awareness', 'Technical Drawing'],
    roadmap: ['Fashion Design Education', 'Portfolio Building', 'Internship', 'Junior Designer', 'Lead Designer'],
    salaryRange: '₹3-15 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Runway Model',
    salary: '₹2-20 LPA',
    description: 'Runway models showcase fashion designs on the catwalk during fashion shows and events.',
    category: 'Fashion & Modeling',
    score: 85,
    skillsRequired: ['Confidence', 'Posture', 'Runway Skills', 'Appearance', 'Professionalism'],
    roadmap: ['Model Portfolio', 'Modeling Agency', 'Test Shoots', 'Local Runway', 'Fashion Week Shows'],
    salaryRange: '₹2-20 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Fashion Stylist',
    salary: '₹3-12 LPA',
    description: 'Fashion stylists curate clothing and accessories for photo shoots, events, and personal styling.',
    category: 'Fashion & Modeling',
    score: 82,
    skillsRequired: ['Fashion Sense', 'Attention to Detail', 'Communication', 'Color Theory', 'Trend Knowledge'],
    roadmap: ['Fashion Knowledge', 'Styling Training', 'Portfolio Building', 'Client Work', 'Brand Collaborations'],
    salaryRange: '₹3-12 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Costume Designer',
    salary: '₹4-15 LPA',
    description: 'Costume designers create and design costumes for movies, theater, and events.',
    category: 'Fashion & Modeling',
    score: 86,
    skillsRequired: ['Design Skills', 'Sewing', 'Historical Knowledge', 'Creativity', 'Technical Skills'],
    roadmap: ['Design Education', 'Theater/Film Training', 'Portfolio Creation', 'Project Experience', 'Lead Designer'],
    salaryRange: '₹4-15 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Fashion Photographer',
    salary: '₹4-18 LPA',
    description: 'Fashion photographers capture professional photos for fashion brands and catalogs.',
    category: 'Fashion & Modeling',
    score: 84,
    skillsRequired: ['Photography', 'Lighting', 'Editing', 'Composition', 'Fashion Sense'],
    roadmap: ['Photography Skills', 'Fashion Photography Training', 'Portfolio Building', 'Commercial Shoots', 'Fashion Campaigns'],
    salaryRange: '₹4-18 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Textile Designer',
    salary: '₹3-10 LPA',
    description: 'Textile designers create patterns and designs for fabrics and textiles.',
    category: 'Fashion & Modeling',
    score: 81,
    skillsRequired: ['Design Skills', 'Pattern Making', 'CAD Software', 'Color Theory', 'Creativity'],
    roadmap: ['Design Education', 'Textile Technology', 'Pattern Software Training', 'Design Development', 'Creative Direction'],
    salaryRange: '₹3-10 LPA',
    demandLevel: 'Medium',
  },
];

export default function FashionModeling() {
  const navigate = useNavigate();
  
  const headerGradient = 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Fashion & Modeling</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👗</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Fashion & Modeling</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Define style and trends</p>
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
