import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Agricultural Scientist', salary: '₹5-12 LPA', description: 'Conducts research and develops improved farming techniques and crops.', category: 'Agriculture', score: 85, skillsRequired: ['Agricultural Science', 'Research', 'Experimentation', 'Data Analysis'], roadmap: ['B.Sc Agriculture', 'M.Sc Agriculture', 'Research Work', 'Innovation', 'Senior Scientist'], demandLevel: 'Medium', salaryRange: '₹5-12 LPA' },
  { title: 'Agri-Business Manager', salary: '₹6-18 LPA', description: 'Manages agricultural business operations including production and sales.', category: 'Agriculture', score: 84, skillsRequired: ['Business Management', 'Agriculture Knowledge', 'Marketing', 'Finance'], roadmap: ['Agricultural Background', 'Business Training', 'Operations', 'Management', 'Senior Manager'], demandLevel: 'Medium', salaryRange: '₹6-18 LPA' },
  { title: 'Horticulturist', salary: '₹4-10 LPA', description: 'Cultivates fruits, vegetables, flowers using specialized techniques.', category: 'Agriculture', score: 83, skillsRequired: ['Horticulture', 'Crop Management', 'Soil Science', 'Pest Management'], roadmap: ['B.Sc Horticulture', 'Field Training', 'Crop Specialization', 'Farm Management', 'Senior Horticulturist'], demandLevel: 'Medium', salaryRange: '₹4-10 LPA' },
  { title: 'Food Technologist', salary: '₹4-12 LPA', description: 'Develops and improves food production and processing techniques.', category: 'Agriculture', score: 84, skillsRequired: ['Food Science', 'Technology', 'Quality Control', 'Food Safety'], roadmap: ['B.Tech Food Tech', 'Production Training', 'Quality Management', 'Innovation', 'Senior Technologist'], demandLevel: 'Medium', salaryRange: '₹4-12 LPA' },
  { title: 'Agricultural Engineer', salary: '₹5-15 LPA', description: 'Designs and develops agricultural machinery and irrigation systems.', category: 'Agriculture', score: 86, skillsRequired: ['Agricultural Engineering', 'Mechanics', 'Design', 'Problem Solving'], roadmap: ['B.Tech Agriculture Eng', 'Machine Design', 'Field Testing', 'Product Development', 'Senior Engineer'], demandLevel: 'Medium', salaryRange: '₹5-15 LPA' },
  { title: 'Organic Farmer', salary: '₹3-10 LPA', description: 'Practices sustainable organic farming without chemicals.', category: 'Agriculture', score: 81, skillsRequired: ['Organic Farming', 'Soil Management', 'Crop Rotation', 'Sustainability'], roadmap: ['Farming Education', 'Organic Certification', 'Field Practice', 'Market Development', 'Expansion'], demandLevel: 'Low', salaryRange: '₹3-10 LPA' },
];

export default function Agriculture() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(90deg,#16a34a,#10b981)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Agriculture Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌾</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Agriculture</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Grow the future sustainably</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: 18 }}>→</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: headerGradient, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
