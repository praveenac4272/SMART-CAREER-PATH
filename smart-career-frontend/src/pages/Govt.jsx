import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'IAS Officer', salary: '₹56,100+ PM', description: 'Senior civil service officer managing administration and governance at state/national level.', category: 'Government & Railway', score: 90, skillsRequired: ['Leadership', 'Administration', 'Policy Making', 'Decision Making'], roadmap: ['Bachelor Degree', 'UPSC Preparation', 'UPSC Exam', 'Training Academy', 'Field Posting'], demandLevel: 'Low', salaryRange: '₹56,100+ PM' },
  { title: 'IPS Officer', salary: '₹56,100+ PM', description: 'Police service officer leading law enforcement and maintaining public order.', category: 'Government & Railway', score: 89, skillsRequired: ['Leadership', 'Law Enforcement', 'Crisis Management', 'Physical Fitness'], roadmap: ['Graduate Degree', 'UPSC Preparation', 'UPSC Exam', 'Police Academy', 'Field Operations'], demandLevel: 'Low', salaryRange: '₹56,100+ PM' },
  { title: 'Railway Officer', salary: '₹30,000-80,000 PM', description: 'Manages railway operations, maintenance, and passenger services.', category: 'Government & Railway', score: 85, skillsRequired: ['Engineering/Management', 'Operations', 'Maintenance', 'Safety'], roadmap: ['Engineering/Graduate', 'RRB Exam', 'Training', 'Station Assignment', 'Senior Roles'], demandLevel: 'Medium', salaryRange: '₹30,000-80,000 PM' },
  { title: 'Bank PO', salary: '₹30,000-50,000 PM', description: 'Public sector bank manager handling branch operations and customer services.', category: 'Government & Railway', score: 84, skillsRequired: ['Banking', 'Customer Service', 'Finance', 'Management'], roadmap: ['Graduate Degree', 'IBPS/SBI Exam', 'Probation', 'Branch Management', 'Senior Manager'], demandLevel: 'Medium', salaryRange: '₹30,000-50,000 PM' },
  { title: 'SSC CGL', salary: '₹25,000-60,000 PM', description: 'Various central government positions through Staff Selection Commission examination.', category: 'Government & Railway', score: 82, skillsRequired: ['General Knowledge', 'Aptitude', 'English', 'Mathematics'], roadmap: ['Higher Secondary', 'SSC Preparation', 'SSC Exam', 'Position Assignment', 'Career Growth'], demandLevel: 'Medium', salaryRange: '₹25,000-60,000 PM' },
  { title: 'Forest Officer', salary: '₹40,000-70,000 PM', description: 'Manages forests, wildlife, and environmental conservation for government.', category: 'Government & Railway', score: 86, skillsRequired: ['Forestry/Environment', 'Conservation', 'Field Work', 'Wildlife Management'], roadmap: ['Relevant Degree', 'Civil Service Exam', 'Training', 'Forest Posting', 'Senior Roles'], demandLevel: 'Low', salaryRange: '₹40,000-70,000 PM' },
  { title: 'Govt. Teacher', salary: '₹25,000-60,000 PM', description: 'Teaches in government schools providing quality education to students.', category: 'Government & Railway', score: 83, skillsRequired: ['Subject Knowledge', 'Teaching Skills', 'Patience', 'Communication'], roadmap: ['Bachelor + B.Ed', 'Teacher Exam', 'Training', 'School Assignment', 'Senior Teacher'], demandLevel: 'Medium', salaryRange: '₹25,000-60,000 PM' },
];

export default function Govt() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(90deg,#4b6bf6,#8a3fe8)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Government & Railway</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏛️</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Government & Railway</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Serve the nation with pride</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#6d28d9', fontWeight: 700, fontSize: 18 }}>→</div>
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
