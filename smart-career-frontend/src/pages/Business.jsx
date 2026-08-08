import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Chartered Accountant (CA)', salary: '₹7-25 LPA', description: 'Provides accounting, auditing, and tax services to businesses and individuals.', category: 'Business & Commerce', score: 88, skillsRequired: ['Accounting', 'Auditing', 'Tax Knowledge', 'Compliance'], roadmap: ['Graduation', 'CA Foundation', 'Intermediate', 'Final', 'Practice'], demandLevel: 'High', salaryRange: '₹7-25 LPA' },
  { title: 'MBA Graduate', salary: '₹8-30 LPA', description: 'Business manager with MBA degree handling strategy, operations, and leadership.', category: 'Business & Commerce', score: 87, skillsRequired: ['Business Strategy', 'Leadership', 'Management', 'Finance'], roadmap: ['Bachelor Degree', 'Work Experience', 'MBA Program', 'Specialization', 'Leadership'], demandLevel: 'High', salaryRange: '₹8-30 LPA' },
  { title: 'Investment Banker', salary: '₹10-40 LPA', description: 'Advises on mergers, acquisitions, and capital raising for companies.', category: 'Business & Commerce', score: 89, skillsRequired: ['Finance Analysis', 'Deal Structuring', 'Business Valuation', 'Communication'], roadmap: ['Finance Background', 'Investment Banking Internship', 'Analyst Role', 'Senior Roles', 'Managing Director'], demandLevel: 'High', salaryRange: '₹10-40 LPA' },
  { title: 'Financial Analyst', salary: '₹5-15 LPA', description: 'Analyzes financial data and provides investment recommendations and reports.', category: 'Business & Commerce', score: 85, skillsRequired: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Market Research'], roadmap: ['Finance Education', 'Data Analysis', 'Financial Modeling', 'Investment Research', 'Senior Analyst'], demandLevel: 'Medium', salaryRange: '₹5-15 LPA' },
  { title: 'Marketing Manager', salary: '₹6-20 LPA', description: 'Plans and executes marketing strategies to promote products and services.', category: 'Business & Commerce', score: 84, skillsRequired: ['Marketing Strategy', 'Branding', 'Campaign Management', 'Analytics'], roadmap: ['Marketing Education', 'Entry Level Marketing', 'Brand Management', 'Campaign Leadership', 'Senior Manager'], demandLevel: 'High', salaryRange: '₹6-20 LPA' },
  { title: 'Business Consultant', salary: '₹8-25 LPA', description: 'Advises organizations on strategy, operations, and business improvement.', category: 'Business & Commerce', score: 86, skillsRequired: ['Business Analysis', 'Problem Solving', 'Communication', 'Industry Knowledge'], roadmap: ['Business Background', 'Consulting Skills', 'Junior Consultant', 'Senior Consultant', 'Principal'], demandLevel: 'Medium', salaryRange: '₹8-25 LPA' },
  { title: 'Company Secretary', salary: '₹5-12 LPA', description: 'Manages corporate governance, compliance, and legal matters for companies.', category: 'Business & Commerce', score: 82, skillsRequired: ['Compliance Knowledge', 'Legal Basics', 'Governance', 'Documentation'], roadmap: ['Graduation', 'CS Foundation', 'Intermediate', 'Final', 'CS Practice'], demandLevel: 'Medium', salaryRange: '₹5-12 LPA' },
];

export default function Business() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(90deg,#06b6d4,#10b981)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Business & Commerce</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💼</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Business & Commerce</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Lead businesses to success</p>
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
