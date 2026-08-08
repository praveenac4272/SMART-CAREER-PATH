import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveCareersBulk } from '../services/savedCareers';

const QUESTION_TO_SKILLS = {
  q1: { q1: 1 },
  q2: { q2: 1 },
  q3: { q3: 1 },
  q4: { q4: 1 },
  q5: { q5: 1 },
  q6: { q6: 1 },
  q7: { q7: 1 },
  q8: { q8: 1 },
  q9: { q9: 1 },
  q10: { q10: 1 },
};

const CAREER_CATEGORY_PROFILES = {
  'IT & Technology': { q1: 5, q8: 5, q6: 4, q10: 2, q3: 2, q5: 1, q7: 0, q2: 1, q4: 1, q9: 1 },
  'Business & Commerce': { q3: 5, q10: 4, q1: 2, q8: 2, q4: 2, q6: 1, q2: 2, q5: 1, q7: 0, q9: 1 },
  'Entrepreneurship': { q10: 5, q3: 5, q8: 3, q1: 2, q6: 2, q2: 1, q4: 1, q5: 1, q7: 0, q9: 1 },
  'Influencer & Content Creation': { q6: 5, q5: 4, q3: 2, q10: 2, q8: 1, q1: 1, q7: 1, q2: 1, q4: 0, q9: 0 },
  'Arts & Creativity': { q5: 5, q6: 3, q7: 1, q3: 1, q10: 1, q1: 1, q8: 1, q2: 1, q4: 0, q9: 0 },
  'Anime & Animation': { q5: 5, q6: 3, q8: 3, q1: 2, q7: 1, q10: 1, q3: 1, q2: 1, q4: 0, q9: 0 },
  'Gaming & Esports': { q8: 5, q1: 3, q6: 3, q10: 2, q5: 2, q3: 1, q7: 1, q2: 1, q4: 0, q9: 0 },
  'Acting & Entertainment': { q7: 5, q5: 3, q6: 2, q3: 2, q10: 1, q2: 1, q8: 1, q1: 1, q4: 0, q9: 0 },
  'Music Careers': { q7: 5, q5: 4, q6: 2, q3: 1, q10: 1, q1: 1, q8: 1, q2: 1, q4: 0, q9: 0 },
  'Law Careers': { q4: 5, q3: 3, q1: 2, q10: 1, q2: 1, q6: 1, q5: 1, q8: 1, q7: 0, q9: 0 },
  'Government & Railway': { q3: 5, q4: 4, q1: 2, q2: 2, q10: 1, q8: 1, q5: 1, q6: 1, q7: 0, q9: 1 },
  'Healthcare': { q2: 5, q1: 2, q9: 2, q3: 1, q8: 1, q5: 1, q6: 1, q10: 1, q4: 1, q7: 0 },
  'Agriculture': { q9: 5, q1: 2, q3: 2, q10: 2, q2: 1, q8: 1, q6: 1, q5: 1, q4: 0, q7: 0 },
};

const CAREER_CATEGORY_CAREERS = {
  'IT & Technology': ['Software Engineer', 'AI/ML Engineer', 'Data Scientist', 'Full Stack Developer', 'DevOps Engineer', 'Cybersecurity Analyst', 'UI/UX Designer'],
  'Business & Commerce': ['Chartered Accountant', 'MBA Graduate', 'Investment Banker', 'Financial Analyst', 'Marketing Manager', 'Business Consultant', 'Company Secretary'],
  'Entrepreneurship': ['Startup Founder', 'Tech Entrepreneur', 'Small Business Owner', 'E-commerce Owner', 'Franchise Owner', 'Consultant'],
  'Influencer & Content Creation': ['YouTuber', 'Instagram Influencer', 'Content Creator', 'Social Media Manager', 'Podcast Host', 'Vlogger'],
  'Arts & Creativity': ['Graphic Designer', 'Illustrator', 'Digital Artist', 'Fine Artist', 'Art Director', 'Tattoo Artist'],
  'Anime & Animation': ['Animator', '3D Artist', 'Character Designer', 'Storyboard Artist', 'VFX Artist', 'Animation Director'],
  'Gaming & Esports': ['Esports Player', 'Game Streamer', 'Gaming Coach', 'Game Developer', 'Gaming Content Creator', 'Esports Commentator'],
  'Acting & Entertainment': ['Film Actor', 'Theater Artist', 'Voice Actor', 'TV Serial Actor', 'Stand-up Comedian'],
  'Music Careers': ['Playback Singer', 'Music Producer', 'Music Composer', 'DJ / Music Artist', 'Music Teacher', 'Sound Engineer'],
  'Law Careers': ['Lawyer', 'Corporate Lawyer', 'Judge', 'Legal Advisor', 'Public Prosecutor', 'Legal Analyst'],
  'Government & Railway': ['IAS Officer', 'IPS Officer', 'Railway Officer', 'Bank PO', 'SSC CGL', 'Forest Officer', 'Govt. Teacher'],
  'Healthcare': ['Doctor', 'Nurse', 'Physiotherapist', 'Pharmacist', 'Medical Lab Technician', 'Radiologist', 'Dentist'],
  'Agriculture': ['Agricultural Scientist', 'Agri-Business Manager', 'Horticulturist', 'Food Technologist', 'Agricultural Engineer', 'Organic Farmer'],
};

const CAREER_DESCRIPTIONS = {
  'Software Engineer': 'Designs and develops software applications.',
  'AI/ML Engineer': 'Builds artificial intelligence and machine learning solutions.',
  'Data Scientist': 'Analyzes data and builds predictive models.',
  'Full Stack Developer': 'Builds frontend and backend web applications.',
  'Cybersecurity Analyst': 'Protects systems from cyber threats.',
  'UI/UX Designer': 'Designs intuitive digital experiences and interfaces.',
  'DevOps Engineer': 'Automates deployment and keeps software delivery reliable.',
  'UX Researcher': 'Studies users to improve product design and usability.',
  'Esports Player': 'Competes in gaming tournaments.',
  'Game Streamer': 'Streams gameplay online.',
  'Game Developer': 'Designs and develops video games.',
  'Gaming Coach': 'Trains players and teams to improve competitive performance.',
  'Gaming Content Creator': 'Creates gaming videos and community content.',
  'Esports Commentator': 'Provides live commentary for gaming events.',
  'Startup Founder': 'Builds and manages startup companies.',
  'Tech Entrepreneur': 'Creates technology businesses.',
  'Small Business Owner': 'Runs and grows an independent business.',
  'E-commerce Owner': 'Operates an online retail business.',
  'Franchise Owner': 'Manages a business under an established brand.',
  'Consultant': 'Advises clients on business and growth strategy.',
  'Film Actor': 'Performs leading and supporting roles in movies.',
  'Theater Artist': 'Performs in stage plays and live productions.',
  'Voice Actor': 'Provides voices for animation and games.',
  'TV Serial Actor': 'Acts in television serials.',
  'Stand-up Comedian': 'Performs comedy before live audiences.',
  'Graphic Designer': 'Creates visual designs.',
  'Illustrator': 'Creates drawings and illustrations.',
  'Digital Artist': 'Produces digital artwork.',
  'Animator': 'Creates animated content.',
  'Character Designer': 'Creates animated characters.',
  'Storyboard Artist': 'Plans scenes and visual sequences for animation.',
  '3D Artist': 'Creates three-dimensional digital assets.',
  'VFX Artist': 'Builds visual effects for media and film.',
  'Animation Director': 'Leads animation projects and creative teams.',
  'Content Creator': 'Creates and publishes digital content.',
  'Social Media Manager': 'Manages brand presence on social platforms.',
  'YouTuber': 'Produces video content for online audiences.',
  'Instagram Influencer': 'Builds audience engagement through social content.',
  'Vlogger': 'Creates video blogs and personal content.',
  'Podcast Host': 'Hosts audio shows and interviews.',
};

const DOMAIN_DISPLAY_NAMES = {
  'IT & Technology': 'IT & Technology Careers',
  'Gaming & Esports': 'Gaming & Esports',
  'Entrepreneurship': 'Entrepreneurship',
  'Arts & Creativity': 'Arts & Creativity',
  'Anime & Animation': 'Anime & Animation',
  'Acting & Entertainment': 'Acting & Entertainment',
  'Influencer & Content Creation': 'Content Creation',
  'Business & Commerce': 'Business & Commerce',
  'Law Careers': 'Law Careers',
  'Government & Railway': 'Government & Railway',
  'Healthcare': 'Healthcare',
  'Agriculture': 'Agriculture',
  'Music Careers': 'Music Careers',
};

function computeAssessmentResult(answers) {
  const skillScores = {
    logic: 0, data: 0, ui: 0, management: 0, documentation: 0,
    programming: 0, business: 0, communication: 0, cybersecurity: 0,
    collaboration: 0, creativity: 0, leadership: 0, technical: 0, security: 0
  };

  const optionScores = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };

  Object.entries(QUESTION_TO_SKILLS).forEach(([questionKey, weights]) => {
    const questionIndex = Number(questionKey.slice(1)) - 1;
    const answerIndex = answers[questionIndex];
    const score = answerIndex !== null && answerIndex !== undefined ? (optionScores[answerIndex] || 0) : 0;

    Object.entries(weights).forEach(([skill, weight]) => {
      skillScores[skill] = (skillScores[skill] || 0) + (score * weight);
    });
  });

  const categoryScores = {};
  Object.entries(CAREER_CATEGORY_PROFILES).forEach(([category, profile]) => {
    const totalWeight = Object.values(profile).reduce((a, b) => a + b, 0);
    const rawScore = Object.entries(profile).reduce((total, [skill, weight]) => {
      return total + (skillScores[skill] || 0) * weight;
    }, 0);
    categoryScores[category] = totalWeight > 0 ? ((rawScore / totalWeight) * 20) : 0;
  });

  const rankedCategories = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const topDomains = rankedCategories.slice(0, 3).map(([category]) => DOMAIN_DISPLAY_NAMES[category] || category);

  const recommendedCareers = [];
  const seenCareers = new Set();

  rankedCategories.slice(0, 3).forEach(([category]) => {
    const careers = CAREER_CATEGORY_CAREERS[category] || [];
    careers.forEach((careerName) => {
      if (seenCareers.has(careerName)) return;
      seenCareers.add(careerName);
      recommendedCareers.push({
        career: careerName,
        description: CAREER_DESCRIPTIONS[careerName] || 'Recommended based on your assessment.'
      });
    });
  });

  return {
    topDomains,
    recommendedCareers: recommendedCareers.slice(0, 10),
  };
}

export default function CareerRecommendation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const assessment = useMemo(() => {
    if (state && state.assessment) return state.assessment;
    try {
      const raw = localStorage.getItem('careerAssessmentResult');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {}
    return null;
  }, [state]);

  const answers = useMemo(() => {
    if (state && state.answers) return state.answers;
    try {
      const raw = localStorage.getItem('assessmentAnswers');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.answers || [];
      }
    } catch (error) {}
    return [];
  }, [state]);

  const attemptCount = useMemo(() => {
    return Number(localStorage.getItem('assessmentAttempts') || '0');
  }, []);

  const result = useMemo(() => {
    if (assessment) {
      const recs = assessment.recommendedCareers || assessment.recommended_careers || [];
      const domains = assessment.topDomains || assessment.top_domains || 
                      (assessment.primaryCareerPath ? [assessment.primaryCareerPath] : []);
      if (recs.length > 0) {
        return {
          topDomains: domains,
          recommendedCareers: recs.map(c => ({
            career: c.career || c.title || c,
            description: c.description || 'Recommended based on your assessment.'
          }))
        };
      }
    }
    return computeAssessmentResult(answers);
  }, [assessment, answers]);

  useEffect(() => {
    if (result.recommendedCareers.length === 0) return;

    const careersToSave = result.recommendedCareers.map((career, index) => ({
      title: career.career,
      salary: 'Suggested by assessment',
      match: `${Math.max(60, 100 - index * 5)}%`,
      description: career.description,
      source: 'assessment',
    }));

    saveCareersBulk(careersToSave);
  }, [result.recommendedCareers]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg,#4b6bf6,#8a3fe8)', color: 'white', padding: '14px 12px', display: 'flex', alignItems: 'center' }}>
        <button aria-label="back" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, marginRight: 12 }}>&larr;</button>
        <h2 style={{ margin: 0 }}>Assessment Result</h2>
      </header>

      <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Top Domains Identified</div>
            <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'grid', gap: 6 }}>
              {result.topDomains.map((domain, index) => (
                <li key={`${domain}-${index}`} style={{ color: '#111827', fontWeight: 600 }}>{domain}</li>
              ))}
            </ol>
          </section>

          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
            <div style={{ color: '#6b7280', fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>Recommended Careers</div>
            <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'grid', gap: 14 }}>
              {result.recommendedCareers.map((career, index) => (
                <li key={`${career.career}-${index}`} style={{ color: '#111827' }}>
                  <div style={{ fontWeight: 800 }}>{career.career}</div>
                  <div style={{ color: '#475569', marginTop: 4 }}>{career.description}</div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div style={{ display: 'grid', gap: 12, marginTop: 28 }}>
          <button onClick={() => navigate('/assessment')} style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#fff', color: '#8a3fe8', border: '1px solid #8a3fe8', fontWeight: 700 }}>Retake Assessment</button>
          <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(90deg,#8a3fe8,#d946ef)', color: 'white', border: 'none', fontWeight: 700 }}>Return to Home</button>
          {attemptCount > 0 ? (
            <p style={{ margin: 0, fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
              Assessment attempts: {attemptCount}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
