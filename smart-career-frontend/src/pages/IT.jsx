import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Software Engineer', salary: '₹6-25 LPA', description: 'Designs, develops, and maintains software applications and systems.', category: 'IT & Technology', score: 90, skillsRequired: ['Programming', 'Problem Solving', 'System Design', 'Database Management'], roadmap: ['Foundation Learning', 'Language Mastery', 'Framework Training', 'Project Work', 'Senior Developer'], demandLevel: 'High', salaryRange: '₹6-25 LPA' },
  { title: 'Data Scientist', salary: '₹8-30 LPA', description: 'Analyzes data and builds machine learning models for insights and predictions.', category: 'IT & Technology', score: 89, skillsRequired: ['Python/R', 'Statistics', 'Machine Learning', 'Data Analysis'], roadmap: ['Data Fundamentals', 'ML Algorithms', 'Advanced Analytics', 'Real Projects', 'Specialization'], demandLevel: 'High', salaryRange: '₹8-30 LPA' },
  { title: 'AI/ML Engineer', salary: '₹10-35 LPA', description: 'Develops and implements artificial intelligence and machine learning solutions.', category: 'IT & Technology', score: 92, skillsRequired: ['Deep Learning', 'Neural Networks', 'TensorFlow', 'Algorithm Design'], roadmap: ['AI Basics', 'Deep Learning', 'Advanced Models', 'Production Deployment', 'Research'], demandLevel: 'High', salaryRange: '₹10-35 LPA' },
  { title: 'Full Stack Developer', salary: '₹5-20 LPA', description: 'Develops both frontend and backend components of web applications.', category: 'IT & Technology', score: 88, skillsRequired: ['Frontend Tech', 'Backend Tech', 'Database', 'APIs'], roadmap: ['Frontend Basics', 'Backend Mastery', 'Database Design', 'Full Integration', 'Framework Expertise'], demandLevel: 'High', salaryRange: '₹5-20 LPA' },
  { title: 'DevOps Engineer', salary: '₹7-22 LPA', description: 'Manages infrastructure, automation, and deployment processes for applications.', category: 'IT & Technology', score: 87, skillsRequired: ['Cloud Platforms', 'Containerization', 'CI/CD', 'Infrastructure'], roadmap: ['Linux Mastery', 'Docker/Kubernetes', 'Cloud Services', 'Automation', 'Advanced Infra'], demandLevel: 'High', salaryRange: '₹7-22 LPA' },
  { title: 'Cybersecurity Analyst', salary: '₹6-18 LPA', description: 'Protects systems and networks from security threats and vulnerabilities.', category: 'IT & Technology', score: 86, skillsRequired: ['Network Security', 'Penetration Testing', 'Cryptography', 'Threat Analysis'], roadmap: ['Security Basics', 'Certifications', 'Penetration Testing', 'Incident Response', 'Security Architecture'], demandLevel: 'High', salaryRange: '₹6-18 LPA' },
  { title: 'UI/UX Designer', salary: '₹4-15 LPA', description: 'Designs user interfaces and experiences for software applications.', category: 'IT & Technology', score: 84, skillsRequired: ['Design Tools', 'User Research', 'Wireframing', 'Prototyping'], roadmap: ['Design Basics', 'Tool Mastery', 'User Testing', 'Portfolio Build', 'Senior Designer'], demandLevel: 'High', salaryRange: '₹4-15 LPA' },
];

export default function IT() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(90deg,#4b6bf6,#8a3fe8)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>IT & Technology Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💻</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>IT & Technology</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Build the future with technology</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#4b6bf6', fontWeight: 700, fontSize: 18 }}>→</div>
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
