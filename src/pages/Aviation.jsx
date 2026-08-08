import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Commercial Pilot', salary: '₹1.5-5 Cr (Career)', description: 'Operates commercial aircraft transporting passengers and cargo.', category: 'Aviation', score: 89, skillsRequired: ['Flight Training', 'Navigation', 'Safety', 'Decision Making'], roadmap: ['12th Pass', 'Pilot Training', 'License', 'Commercial Hours', 'Captain'], demandLevel: 'Low', salaryRange: '₹1.5-5 Cr (Career)' },
  { title: 'Aircraft Engineer', salary: '₹6-15 LPA', description: 'Designs, maintains, and repairs aircraft systems and components.', category: 'Aviation', score: 87, skillsRequired: ['Aeronautical Engineering', 'Maintenance', 'Problem Solving', 'Technical'], roadmap: ['B.Tech Aerospace', 'Aircraft Maintenance', 'Certifications', 'Design', 'Senior Engineer'], demandLevel: 'Medium', salaryRange: '₹6-15 LPA' },
  { title: 'Air Traffic Controller', salary: '₹8-20 LPA', description: 'Manages aircraft movements and ensures safety in airspace.', category: 'Aviation', score: 88, skillsRequired: ['Air Navigation', 'Communication', 'Quick Decision', 'Stress Management'], roadmap: ['12+2/Graduate', 'ATC Training', 'Certification', 'Airport Assignment', 'Senior Controller'], demandLevel: 'Low', salaryRange: '₹8-20 LPA' },
  { title: 'Flight Attendant', salary: '₹3-8 LPA', description: 'Provides passenger services and ensures safety during flights.', category: 'Aviation', score: 82, skillsRequired: ['Customer Service', 'Safety', 'Communication', 'Adaptability'], roadmap: ['12th Pass', 'Flight Training', 'Airline Selection', 'Flight Duty', 'Senior Crew'], demandLevel: 'Medium', salaryRange: '₹3-8 LPA' },
  { title: 'Airport Manager', salary: '₹7-18 LPA', description: 'Oversees airport operations and manages staff and facilities.', category: 'Aviation', score: 86, skillsRequired: ['Airport Management', 'Leadership', 'Operations', 'Customer Service'], roadmap: ['Bachelor Degree', 'Airport Training', 'Operations Role', 'Management', 'Senior Manager'], demandLevel: 'Low', salaryRange: '₹7-18 LPA' },
  { title: 'Aviation Safety Officer', salary: '₹5-12 LPA', description: 'Ensures aviation safety standards and compliance regulations.', category: 'Aviation', score: 84, skillsRequired: ['Safety Knowledge', 'Compliance', 'Audit', 'Documentation'], roadmap: ['Aviation Background', 'Safety Training', 'Audit Skills', 'Compliance Role', 'Senior Officer'], demandLevel: 'Low', salaryRange: '₹5-12 LPA' },
];

export default function Aviation() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(90deg,#0ea5e9,#2563eb)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Aviation Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✈️</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Aviation</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Reach for the skies</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#0ea5e9', fontWeight: 700, fontSize: 18 }}>→</div>
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
