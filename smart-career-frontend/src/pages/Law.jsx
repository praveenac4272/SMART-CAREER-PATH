import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'Lawyer / Advocate', salary: '₹3-20+ LPA', description: 'Provides legal advice and represents clients in courts and legal proceedings.', category: 'Law Careers', score: 86, skillsRequired: ['Legal Knowledge', 'Argumentation', 'Research', 'Client Relations'], roadmap: ['Law Degree (LLB)', 'Bar Council Registration', 'Junior Advocate', 'Practice Building', 'Senior Advocate'], demandLevel: 'Medium', salaryRange: '₹3-20+ LPA' },
  { title: 'Corporate Lawyer', salary: '₹8-30 LPA', description: 'Handles legal matters for corporations including contracts and compliance.', category: 'Law Careers', score: 88, skillsRequired: ['Corporate Law', 'Contracts', 'Compliance', 'Negotiation'], roadmap: ['Law Degree', 'Legal Training', 'Corporate Practice', 'Senior Counsel', 'GC/Partner'], demandLevel: 'High', salaryRange: '₹8-30 LPA' },
  { title: 'Judge', salary: '₹50,000-2L PM', description: 'Presides over court proceedings and delivers justice through judicial decisions.', category: 'Law Careers', score: 89, skillsRequired: ['Legal Expertise', 'Judgment', 'Impartiality', 'Communication'], roadmap: ['Law Degree', 'Bar Council', 'Advocate Practice', 'Civil Service Exam', 'Judicial Service'], demandLevel: 'Low', salaryRange: '₹50,000-2L PM' },
  { title: 'Legal Advisor', salary: '₹5-15 LPA', description: 'Provides legal consultation to organizations and individuals.', category: 'Law Careers', score: 84, skillsRequired: ['Legal Knowledge', 'Advisement', 'Research', 'Risk Assessment'], roadmap: ['Law Degree', 'Legal Practice', 'Specialization', 'Senior Advisor', 'Partner'], demandLevel: 'Medium', salaryRange: '₹5-15 LPA' },
  { title: 'Public Prosecutor', salary: '₹30,000-80,000 PM', description: 'Prosecutes criminal cases on behalf of the state.', category: 'Law Careers', score: 85, skillsRequired: ['Criminal Law', 'Case Preparation', 'Argumentation', 'Ethical Practice'], roadmap: ['Law Degree', 'Bar Council', 'Civil Service Exam', 'Public Prosecution', 'Senior Prosecution'], demandLevel: 'Low', salaryRange: '₹30,000-80,000 PM' },
  { title: 'Legal Analyst', salary: '₹4-12 LPA', description: 'Conducts legal research and analysis for law firms and organizations.', category: 'Law Careers', score: 82, skillsRequired: ['Legal Research', 'Analysis', 'Writing', 'Case Law Knowledge'], roadmap: ['Law Background', 'Research Training', 'Legal Writing', 'Specialization', 'Senior Analyst'], demandLevel: 'Medium', salaryRange: '₹4-12 LPA' },
];

export default function Law() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(90deg,#0f172a,#111827)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Law Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚖️</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Law Careers</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Fight for justice and rights</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#111827', fontWeight: 700, fontSize: 18 }}>→</div>
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
