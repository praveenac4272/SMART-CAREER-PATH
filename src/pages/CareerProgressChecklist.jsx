import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import ProgressCard from '../components/ProgressCard';
import careerDomains from '../data/careerDomains.json';
import fullChecklists from '../data/careerProgressChecklists_full.json';

const STORAGE_KEY = 'careerProgressChecklistState_v2';

const GROUPS = {
  Traditional: [
    'IT & Technology',
    'Business & Commerce',
    'Healthcare',
    'Law Careers',
    'Government & Railway',
    'Agriculture',
  ],
  'Non-Traditional': [
    'Entrepreneurship',
    'Influencer & Content Creation',
    'Arts & Creativity',
    'Anime & Animation',
    'Gaming & Esports',
    'Acting & Entertainment',
    'Music Careers',
  ],
};

function normalizeId(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function hasKeyword(title, keywords) {
  const t = title.toLowerCase();
  return keywords.some((k) => t.includes(k));
}

function generateMilestones(title, domain) {
  const t = title.toLowerCase();
  const tasks = [];

  // Helper to push unique tasks
  function push(idSuffix, label, detail) {
    const id = `${normalizeId(title)}_${idSuffix}`;
    tasks.push({ id, label, detail });
  }

  // Common starter: clarify role and foundations
  push('understand_role', `Understand the role of a ${title}`, `Read role descriptions, common responsibilities and career outcomes for ${title}.`);

  // Degree / eligibility / entrance
  if (hasKeyword(t, ['doctor', 'neeti', 'mbbs', 'dentist', 'radiologist', 'physiotherapist', 'nurse'])) {
    push('qualification', 'Complete required professional degree', 'Enroll in MBBS/BSc Nursing or the relevant medical degree and complete clinical rotations.');
    push('entrance', 'Pass professional entrance exams', 'Prepare for and pass necessary entrance exams (e.g., NEET for MBBS) or licensing tests.');
    push('clinical', 'Gain clinical experience', 'Participate in internships, clinical postings, and supervised practice.');
    push('licence', 'Obtain professional license', 'Complete registration/licensing required to practice in your region.');
    push('specialise', 'Consider specialization', 'Explore residency, fellowships, or specialized certifications relevant to your interest.');
  } else if (hasKeyword(t, ['lawyer', 'judge', 'public prosecutor', 'legal'])) {
    push('degree', 'Complete law degree and eligibility', 'Finish LLB or a recognized law program and check local bar requirements.');
    push('entrance', 'Prepare for entrance and bar exams', 'Study for CLAT/state entrance and bar council examinations as applicable.');
    push('internship', 'Intern with law firms or courts', 'Gain practical exposure through internships, moot courts and client drafting practice.');
    push('bar', 'Enroll with Bar/Legal registration', 'Complete formal registration and begin supervised practice / apprenticeship.');
    push('practice', 'Build courtroom and drafting skills', 'Develop legal research, drafting, and oral advocacy through real cases and mentorship.');
  } else if (hasKeyword(t, ['ias', 'ips', 'bank po', 'ssc', 'railway', 'forest officer', 'govt'])) {
    push('current_affairs', 'Follow daily current affairs', 'Read newspapers, editorials and practice summaries for exam prep.');
    push('syllabus', 'Study the exam syllabus deeply', 'Cover preliminary and mains-level topics thoroughly and create notes.');
    push('practice_tests', 'Take timed mock tests', 'Regularly attempt mock papers and assess time management.');
    push('interview', 'Prepare for interviews', 'Work on personality, ethics, and mock interviews for the final stage.');
    push('consistency', 'Maintain a study schedule', 'Review progress weekly and adjust preparation plan.');
  } else if (hasKeyword(t, ['chartered', 'chartered accountant', 'ca'])) {
    push('fundamentals', 'Master accounting fundamentals', 'Study journal entries, ledgers and financial statements thoroughly.');
    push('tax', 'Learn taxation concepts', 'Understand direct and indirect taxes, return filing and compliance basics.');
    push('articleship', 'Complete articleship/internship', 'Work under a practicing CA to gain hands-on auditing and accounting experience.');
    push('exam_prep', 'Prepare for professional exams', 'Practice mock tests and past papers for CA examinations.');
    push('network', 'Build professional network', 'Connect with firms, mentors and peers for growth and guidance.');
  } else if (hasKeyword(t, ['software', 'engineer', 'developer', 'full stack', 'devops', 'ui/ux', 'cybersecurity', 'data', 'ai', 'ml'])) {
    push('foundation', 'Learn programming fundamentals', 'Choose a core language (Python/JavaScript) and get comfortable with syntax and libraries.');
    push('dsa', 'Practice data structures & algorithms', 'Solve problems regularly to prepare for technical interviews.');
    push('projects', 'Build and deploy projects', 'Create 3+ portfolio projects showcasing real-world features and deployments.');
    push('tools', 'Learn essential tools', 'Use Git, CI/CD, Docker, and relevant frameworks depending on role.');
    push('internship', 'Pursue internships or open-source', 'Gain collaborative experience through internships or contributing to OSS.');
    push('system', 'Study system design basics', 'Understand architecture, scaling and deployment for higher-level roles.');
    push('apply', 'Prepare for interviews and applications', 'Practice whiteboard problems and behavioral questions; tailor CVs.');
    push('first_job', 'Land your first role', 'Apply broadly, get feedback from interviews, and negotiate offers.');
  } else if (hasKeyword(t, ['data scientist', 'data'])) {
    push('stats', 'Master statistics & probability', 'Understand distributions, hypothesis testing, and basic inferential stats.');
    push('python', 'Master Python for data', 'Learn pandas, NumPy and data cleaning pipelines.');
    push('sql', 'Practice SQL and data extraction', 'Write complex joins, aggregations and window functions.');
    push('models', 'Learn ML models and evaluation', 'Train classifiers/regressors and evaluate with appropriate metrics.');
    push('portfolio', 'Build data projects and dashboards', 'Publish analyses and dashboards that tell clear business stories.');
  } else if (hasKeyword(t, ['graphic', 'designer', 'illustrator', 'digital artist', 'art director'])) {
    push('principles', 'Learn design fundamentals', 'Study color theory, typography, layout and composition.');
    push('tools', 'Master design tools', 'Practice Figma, Illustrator or Photoshop through daily exercises.');
    push('portfolio', 'Create a portfolio of finished pieces', 'Prepare case studies showing process and outcomes for each project.');
    push('feedback', 'Seek critiques and iterate', 'Share work in communities and refine based on feedback.');
    push('clients', 'Take real briefs', 'Work on small client or spec projects to gain practical context.');
  } else if (hasKeyword(t, ['animator', '3d', 'vfx', 'storyboard'])) {
    push('storyboard', 'Study storyboarding and timing', 'Plan scenes and motion to convey storytelling clearly.');
    push('software', 'Learn animation software', 'Practice Blender, After Effects or industry tools for your pipeline.');
    push('practice', 'Animate short shots', 'Produce short loops and refine timing and easing.');
    push('reel', 'Build a demo reel', 'Combine your strongest work into a short showreel for employers or festivals.');
  } else if (hasKeyword(t, ['film actor', 'actor', 'theater', 'voice actor'])) {
    push('training', 'Take acting and voice training', 'Attend workshops for voice, movement and improvisation.');
    push('reels', 'Create audition-ready reels', 'Record short scenes and monologues showcasing your range.');
    push('auditions', 'Prepare audition materials', 'Select monologues and practice cold readings and callbacks.');
    push('network', 'Network with casting directors', 'Attend auditions, workshops and industry meetups.');
  } else if (hasKeyword(t, ['esports', 'stream', 'gamer'])) {
    push('practice', 'Set structured practice sessions', 'Focus on mechanics, strategy and replay analysis.');
    push('team', 'Improve team communication', 'Work on roles, callouts, and coordinated strategies.');
    push('review', 'Review and analyze matches', 'Identify mistakes and implement corrective practice.');
    push('health', 'Maintain physical and mental fitness', 'Prioritize sleep, exercise and recovery for consistent performance.');
  } else {
    // Generic but tailored: skills, projects, internships, certifications, apply
    push('education', 'Complete relevant education or training', 'Finish a degree, diploma or bootcamp relevant to the career.');
    push('skills', 'Learn the core skills and tools', 'Master the practical tools and techniques used in the role.');
    push('projects', 'Build concrete projects', 'Create and publish projects that demonstrate domain ability.');
    push('experience', 'Gain hands-on experience', 'Find internships, part-time work, or freelance projects.');
    push('apply', 'Prepare for applications and interviews', 'Polish CV, prepare for technical and behavioral rounds.');
  }

  // Common finishing milestones (portfolio, certifications, placements)
  if (!tasks.find((t) => t.id.includes('portfolio'))) {
    push('portfolio', 'Build a portfolio or case studies', 'Showcase your best work with clear context and impact.');
  }
  if (!tasks.find((t) => t.id.includes('internship'))) {
    push('internship_alt', 'Seek internships or practical experience', 'Apply to internships or projects that demonstrate industry readiness.');
  }
  if (!tasks.find((t) => t.id.includes('apply'))) {
    push('apply_alt', 'Apply for roles and internships', 'Target suitable roles and tailor your applications each time.');
  }

  // Trim or expand to 10-15 items: if fewer, add learning and polish steps
  while (tasks.length < 10) {
    const idx = tasks.length + 1;
    push(`extra_${idx}`, `Refine skill ${idx}`, `Continuous practice and improvement on a specific sub-skill (#${idx}).`);
  }
  if (tasks.length > 15) tasks.length = 15;

  return tasks;
}

function displayStateLabel(state) {
  if (state === 2) return '✅ Completed';
  if (state === 1) return '🟡 In Progress';
  return '⬜ Not Started';
}

function CareerProgressChecklist() {
  const navigate = useNavigate();
  const [progressState, setProgressState] = useState({});
  const [group, setGroup] = useState('Traditional');
  const [domain, setDomain] = useState(GROUPS.Traditional[0]);
  const [career, setCareer] = useState((careerDomains[GROUPS.Traditional[0]] || [])[0] || '');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProgressState(JSON.parse(saved));
    } catch (e) {
      console.error('Load checklist state', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
    } catch (e) {
      console.error('Save checklist state', e);
    }
  }, [progressState]);

  const domainsForGroup = useMemo(() => GROUPS[group] || [], [group]);
  useEffect(() => {
    if (!domainsForGroup.includes(domain)) {
      setDomain(domainsForGroup[0] || '');
    }
  }, [group]);

  useEffect(() => {
    const careersList = careerDomains[domain] || [];
    if (!careersList.includes(career)) setCareer(careersList[0] || '');
  }, [domain]);

  const milestones = useMemo(() => {
    if (!career) return [];
    try {
      const found = (fullChecklists || []).find((c) => (c.title || '').toLowerCase() === (career || '').toLowerCase());
      if (found && Array.isArray(found.tasks) && found.tasks.length > 0) return found.tasks;
    } catch (e) {
      console.error('Load full checklist', e);
    }
    return generateMilestones(career, domain);
  }, [career, domain]);

  const getState = (careerTitle, taskId) => {
    return ((progressState[careerTitle] || {})[taskId] || 0);
  };

  const cycleState = (careerTitle, taskId) => {
    setProgressState((cur) => {
      const row = { ...(cur[careerTitle] || {}) };
      const current = row[taskId] || 0;
      const next = (current + 1) % 3;
      row[taskId] = next;
      return { ...cur, [careerTitle]: row };
    });
  };

  const resetCareer = (careerTitle) => {
    setProgressState((cur) => ({ ...cur, [careerTitle]: {} }));
  };

  const total = milestones.length;
  const completed = milestones.filter((m) => getState(career, m.id) === 2).length;
  const inProgress = milestones.filter((m) => getState(career, m.id) === 1).length;
  const percent = Math.round((completed / Math.max(1, total)) * 100);

  const currentStage = completed === total ? 'Completed' : inProgress > 0 ? 'In Progress' : 'Not Started';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)', padding: '18px 20px 24px', color: 'white', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '0' }}>←</button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Career Progress Checklist</h1>
          <div style={{ width: '24px' }} />
        </div>
        <p style={{ margin: 0, fontSize: '15px', opacity: 0.95, lineHeight: 1.6 }}>Select a domain and career to view a career-specific roadmap with milestone states.</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 40px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 180 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Group</label>
              <select value={group} onChange={(e) => setGroup(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                {Object.keys(GROUPS).map((g) => (<option key={g} value={g}>{g}</option>))}
              </select>
            </div>

            <div style={{ minWidth: 260 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Domain</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                {domainsForGroup.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>

            <div style={{ minWidth: 320, flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Career</label>
              <select value={career} onChange={(e) => setCareer(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                {(careerDomains[domain] || []).map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>

            <div>
              <button onClick={() => resetCareer(career)} style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', color: '#334155', fontWeight: 600 }}>Reset checklist</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 360px' }}>
          <div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20 }}>{career}</h2>
                  <div style={{ color: '#64748b', marginTop: 6 }}>{domain} • {displayStateLabel(currentStage === 'Completed' ? 2 : (inProgress > 0 ? 1 : 0)).replace(/ .*/, '')} • {percent}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, color: '#334155', fontWeight: 700 }}>{percent}%</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{completed} completed • {total - completed} remaining</div>
                </div>
              </div>

              <ProgressBar value={percent} color="#7c3aed" />

              <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
                {milestones.map((task, idx) => {
                  const state = getState(career, task.id);
                  const checked = state === 2;
                  const inProg = state === 1;
                  return (
                    <div key={task.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 12, backgroundColor: checked ? '#f0fdf4' : inProg ? '#fff7ed' : '#f8fafc', border: '1px solid #e6eaf2', cursor: 'pointer' }} onClick={() => cycleState(career, task.id)}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checked ? '#16a34a' : inProg ? '#f59e0b' : '#fff', color: checked ? 'white' : inProg ? 'white' : '#64748b', border: '1px solid #e2e8f0', fontSize: 16 }}>{checked ? '✓' : inProg ? '●' : '○'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{`${idx + 1}. ${task.label}`}</div>
                        <div style={{ marginTop: 6, color: '#64748b' }}>{task.detail}</div>
                      </div>
                      <div style={{ minWidth: 120, textAlign: 'right', color: '#475569', fontSize: 13 }}>{displayStateLabel(state)}</div>
                    </div>
                  );
                })}
              </div>

              {completed === total ? (
                <div style={{ marginTop: 18, padding: 18, borderRadius: 12, background: 'linear-gradient(90deg,#f0f9ff,#ecfeff)', textAlign: 'center' }}>
                  <div style={{ fontSize: 22 }}>🎉 Congratulations!</div>
                  <div style={{ marginTop: 8 }}>You have completed all milestones required to become a {career}.</div>
                </div>
              ) : null}
            </div>
          </div>

          <aside>
            <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>Quick Navigation</h4>
              {(careerDomains[domain] || []).slice(0, 8).map((c) => (
                <button key={c} onClick={() => setCareer(c)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: 'none', background: c === career ? '#eef2ff' : 'transparent', cursor: 'pointer', marginBottom: 6 }}>{c}</button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CareerProgressChecklist;
