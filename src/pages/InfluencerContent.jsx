import React from 'react';
import { useNavigate } from 'react-router-dom';

const careerDetails = [
  { title: 'YouTuber', salary: '₹1L-1Cr+ (varies)', description: 'Creates video content for YouTube with monetization and sponsorships.', category: 'Influencer & Content', score: 85, skillsRequired: ['Video Production', 'Content Strategy', 'Editing', 'Audience Engagement'], roadmap: ['Channel Creation', 'Content Planning', 'Consistent Upload', 'Build Audience', 'Monetization'], demandLevel: 'High', salaryRange: '₹1L-1Cr+ (varies)' },
  { title: 'Instagram Influencer', salary: '₹2-50L (per year)', description: 'Builds Instagram presence and monetizes through partnerships and promotions.', category: 'Influencer & Content', score: 83, skillsRequired: ['Photography', 'Social Media', 'Branding', 'Engagement'], roadmap: ['Profile Setup', 'Content Strategy', 'Audience Growth', 'Partnerships', 'Monetization'], demandLevel: 'High', salaryRange: '₹2-50L (per year)' },
  { title: 'Content Creator', salary: '₹3-30 LPA', description: 'Creates diverse content across multiple platforms for brands and audiences.', category: 'Influencer & Content', score: 84, skillsRequired: ['Content Writing', 'Video/Photo Production', 'Creativity', 'Trend Awareness'], roadmap: ['Content Skills', 'Platform Selection', 'Portfolio Build', 'Brand Partnerships', 'Full-time Work'], demandLevel: 'High', salaryRange: '₹3-30 LPA' },
  { title: 'Social Media Manager', salary: '₹3-12 LPA', description: 'Manages social media presence for brands and companies.', category: 'Influencer & Content', score: 81, skillsRequired: ['Social Media Strategy', 'Content Planning', 'Analytics', 'Communication'], roadmap: ['Social Media Training', 'Platform Mastery', 'Content Calendar', 'Client Management', 'Agency Work'], demandLevel: 'Medium', salaryRange: '₹3-12 LPA' },
  { title: 'Podcast Host', salary: '₹2-15 LPA', description: 'Creates and hosts podcast series on various topics and platforms.', category: 'Influencer & Content', score: 82, skillsRequired: ['Audio Production', 'Communication', 'Topic Expertise', 'Interviewing'], roadmap: ['Audio Setup', 'Content Planning', 'Consistent Schedule', 'Audience Growth', 'Sponsorships'], demandLevel: 'Medium', salaryRange: '₹2-15 LPA' },
  { title: 'Vlogger', salary: '₹3-25 LPA', description: 'Creates vlogs documenting life, travel, experiences, or specific interests.', category: 'Influencer & Content', score: 83, skillsRequired: ['Video Production', 'Storytelling', 'Editing', 'Consistency'], roadmap: ['Video Gear', 'Content Planning', 'Regular Uploads', 'Channel Growth', 'Brand Deals'], demandLevel: 'High', salaryRange: '₹3-25 LPA' },
];

export default function InfluencerContent() {
  const navigate = useNavigate();
  const headerGradient = 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)';
  
  const handleCareerClick = (career) => {
    navigate('/career-detail', { state: { career } });
  };
  
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: headerGradient, color: 'white', padding: 14, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Influencer & Content</h2>
      </header>
      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ background: headerGradient, color: 'white', padding: 20, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📱</div>
          <h3 style={{ margin: 0, marginBottom: 4 }}>Influencer & Content Creation</h3>
          <p style={{ marginTop: 8, margin: 0 }}>Build your digital empire</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {careerDetails.map((c, i) => (
            <div key={i} onClick={() => handleCareerClick(c)} style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e5e7eb' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.title}</div>
                <div style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>{c.salary}</div>
              </div>
              <div style={{ color: '#d946ef', fontWeight: 700, fontSize: 18 }}>→</div>
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
