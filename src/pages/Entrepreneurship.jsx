import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Startup Founder', salary: '₹2-100+ LPA', description: 'Launches and runs innovative startup companies with new ideas.', category: 'Entrepreneurship', score: 89, skillsRequired: ['Idea Generation', 'Business Strategy', 'Leadership', 'Problem Solving'], roadmap: ['Ideation', 'Business Plan', 'Funding', 'MVP Launch', 'Scaling'], demandLevel: 'High', salaryRange: '₹2-100+ LPA' },
  { title: 'Tech Entrepreneur', salary: '₹3-50+ LPA', description: 'Builds technology-based businesses with innovative solutions.', category: 'Entrepreneurship', score: 87, skillsRequired: ['Tech Knowledge', 'Business Acumen', 'Innovation', 'Leadership'], roadmap: ['Tech Expertise', 'Market Research', 'Product Dev', 'Investment', 'Growth'], demandLevel: 'High', salaryRange: '₹3-50+ LPA' },
  { title: 'Small Business Owner', salary: '₹1-25 LPA', description: 'Operates independent businesses in various industries locally.', category: 'Entrepreneurship', score: 83, skillsRequired: ['Business Management', 'Customer Service', 'Finance', 'Marketing'], roadmap: ['Business Planning', 'Registration', 'Setup', 'Operations', 'Expansion'], demandLevel: 'Medium', salaryRange: '₹1-25 LPA' },
  { title: 'E-commerce Owner', salary: '₹2-30 LPA', description: 'Operates online stores selling products to customers worldwide.', category: 'Entrepreneurship', score: 85, skillsRequired: ['Digital Marketing', 'Supply Chain', 'Customer Service', 'Analytics'], roadmap: ['Platform Selection', 'Product Sourcing', 'Store Setup', 'Marketing', 'Growth'], demandLevel: 'High', salaryRange: '₹2-30 LPA' },
  { title: 'Franchise Owner', salary: '₹5-50 LPA', description: 'Operates franchise businesses with established brand support.', category: 'Entrepreneurship', score: 82, skillsRequired: ['Business Management', 'Capital Investment', 'Customer Relations', 'Operations'], roadmap: ['Choose Franchise', 'Investment', 'Training', 'Operations', 'Multi-unit Growth'], demandLevel: 'Medium', salaryRange: '₹5-50 LPA' },
  { title: 'Business Consultant', salary: '₹5-40 LPA', description: 'Advises businesses on strategy, growth, and operations.', category: 'Entrepreneurship', score: 86, skillsRequired: ['Business Strategy', 'Analysis', 'Communication', 'Industry Knowledge'], roadmap: ['Business Expertise', 'Consulting Training', 'Client Base', 'Specialization', 'Firm Growth'], demandLevel: 'Medium', salaryRange: '₹5-40 LPA' },
];

export default function Entrepreneurship() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Entrepreneurship</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Entrepreneurship</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Build your own empire</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 18 }}>→</div>
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
