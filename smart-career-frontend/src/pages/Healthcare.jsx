import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  {
    title: 'Doctor (MBBS)',
    salary: '₹8-25 LPA',
    description: 'Medical doctors diagnose and treat diseases, perform surgeries, and provide healthcare to patients.',
    category: 'Healthcare',
    score: 92,
    skillsRequired: ['Medical Knowledge', 'Communication', 'Patient Care', 'Diagnosis', 'Problem Solving'],
    roadmap: ['Complete 10+2 with Science', 'NEET Exam Preparation', 'MBBS (5.5 years)', 'Internship & Residency', 'Medical Practice'],
    salaryRange: '₹8-25 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Nurse',
    salary: '₹3-8 LPA',
    description: 'Nurses provide direct patient care, administer medications, and assist doctors in healthcare delivery.',
    category: 'Healthcare',
    score: 85,
    skillsRequired: ['Patient Care', 'Communication', 'Medical Knowledge', 'Attention to Detail', 'Teamwork'],
    roadmap: ['Complete 10+2', 'Nursing Diploma/Degree', 'Internship', 'Licensure Exam', 'Hospital Employment'],
    salaryRange: '₹3-8 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Physiotherapist',
    salary: '₹4-10 LPA',
    description: 'Physiotherapists help patients recover from injuries and improve mobility through physical therapy.',
    category: 'Healthcare',
    score: 88,
    skillsRequired: ['Anatomy Knowledge', 'Patient Care', 'Physical Therapy', 'Communication', 'Empathy'],
    roadmap: ['Complete 10+2 with Science', 'BPT Degree (4.5 years)', 'Internship', 'Practice License', 'Clinical Practice'],
    salaryRange: '₹4-10 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Pharmacist',
    salary: '₹3-7 LPA',
    description: 'Pharmacists dispense medications, advise on drug usage, and ensure medication safety.',
    category: 'Healthcare',
    score: 80,
    skillsRequired: ['Pharmaceutical Knowledge', 'Communication', 'Attention to Detail', 'Patient Care', 'Chemistry'],
    roadmap: ['Complete 10+2 with Science', 'B.Pharmacy (4 years)', 'Pharmacy Council Registration', 'Work Experience', 'Clinical Practice'],
    salaryRange: '₹3-7 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Medical Lab Technician',
    salary: '₹2.5-6 LPA',
    description: 'Lab technicians perform diagnostic tests and analyze samples to support medical diagnosis.',
    category: 'Healthcare',
    score: 75,
    skillsRequired: ['Laboratory Procedures', 'Precision', 'Sample Analysis', 'Medical Knowledge', 'Safety Protocols'],
    roadmap: ['Complete 10+2 with Science', 'MLT Diploma/Degree (2-3 years)', 'Laboratory Training', 'Certification', 'Lab Employment'],
    salaryRange: '₹2.5-6 LPA',
    demandLevel: 'Medium',
  },
  {
    title: 'Radiologist',
    salary: '₹10-30 LPA',
    description: 'Radiologists interpret medical imaging tests and diagnose diseases using X-rays, CT scans, and MRI.',
    category: 'Healthcare',
    score: 90,
    skillsRequired: ['Medical Imaging', 'Diagnosis', 'Medical Knowledge', 'Technical Skills', 'Attention to Detail'],
    roadmap: ['Complete 10+2 with Science', 'MBBS (5.5 years)', 'Radiology Specialization (3 years)', 'License & Certification', 'Hospital Practice'],
    salaryRange: '₹10-30 LPA',
    demandLevel: 'High',
  },
  {
    title: 'Dentist',
    salary: '₹5-15 LPA',
    description: 'Dentists diagnose and treat dental problems, perform procedures, and maintain oral health.',
    category: 'Healthcare',
    score: 87,
    skillsRequired: ['Dental Knowledge', 'Manual Dexterity', 'Patient Care', 'Communication', 'Problem Solving'],
    roadmap: ['Complete 10+2 with Science', 'BDS Degree (4 years)', 'Internship', 'Dental License', 'Dental Practice'],
    salaryRange: '₹5-15 LPA',
    demandLevel: 'High',
  },
];

export default function Healthcare() {
  const navigate = useNavigate();

  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#4b6bf6,#8a3fe8)', color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Healthcare Careers</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(90deg,#ff4d4f,#ff7a45)', color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Healthcare Careers</h3>
          <p style={{ marginTop: 8 }}>Make a difference in people's lives</p>
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
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(90deg,#8a3fe8,#d946ef)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
        </div>
      </main>
    </div>
  );
}
