import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveCareer, getSavedCareers } from '../services/savedCareers';
import { getCareerStates, getCareerCollegesByState } from '../services/api';

function CareerDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedTitles, setSavedTitles] = useState([]);

  const careerData = location.state?.career || {
    title: 'Career Not Found',
    description: 'Unable to load career details',
    category: 'General',
    score: 100,
    skillsRequired: [],
    roadmap: [],
    salaryRange: 'N/A',
    demandLevel: 'N/A',
  };

  useEffect(() => {
    async function loadSaved() {
      const saved = await getSavedCareers();
      setSavedTitles(saved.map((item) => item.title));
    }
    loadSaved();
  }, []);

  const handleBack = () => {
    if (location.state?.returnTo) {
      navigate(location.state.returnTo);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSave = async (career) => {
    const careerToSave = {
      title: career.title,
      salary: career.salaryRange,
      description: career.description,
      source: 'career-detail',
    };
    const updated = await saveCareer(careerToSave);
    setSavedTitles(updated.map((item) => item.title));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
          padding: '16px 20px',
          paddingTop: '40px',
          color: 'white',
          borderRadius: '0 0 24px 24px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Go back"
          >
            ←
          </button>
          <h1
            style={{
              margin: '0',
              fontSize: '24px',
              fontWeight: '600',
              flex: 1,
              textAlign: 'center',
            }}
          >
            Career Details
          </h1>
          <div style={{ width: '32px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: '700',
            }}
          >
            {careerData.title}
          </h2>
          <p style={{ margin: '0', fontSize: '16px', opacity: 0.9 }}>
            {careerData.category}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '700px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>
              {careerData.title}
            </h3>
            <span style={{ fontSize: '32px' }}>✨</span>
          </div>
          <p
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              opacity: 0.95,
              lineHeight: '1.5',
            }}
          >
            {careerData.description}
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <button
              onClick={() => handleSave(careerData)}
              style={{
                backgroundColor: savedTitles.includes(careerData.title) ? '#d946ef' : 'white',
                color: savedTitles.includes(careerData.title) ? 'white' : '#d946ef',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {savedTitles.includes(careerData.title) ? '★ Saved' : '☆ Save Career'}
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Demand Level
            </p>
            <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#d946ef' }}>
              {careerData.demandLevel}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Salary Range
            </p>
            <p style={{ margin: '0', fontSize: '22px', fontWeight: '700', color: '#059669' }}>
              {careerData.salaryRange}
            </p>
          </div>
        </div>

        <CareerContent career={careerData} />
      </div>
    </div>
  );
}

function CareerContent({ career }) {
  const [selectedState, setSelectedState] = useState('');
  const [dbColleges, setDbColleges] = useState([]);
  const [availableStates, setAvailableStates] = useState([
    "Delhi NCR", "Gujarat", "Karnataka", "Kerala", "Maharashtra",
    "Punjab", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
  ]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  useEffect(() => {
    if (!career?.title) {
      setSelectedState('');
      setDbColleges([]);
      return undefined;
    }

    let isCancelled = false;
    setIsLoadingStates(true);

    getCareerStates(career.title)
      .then((states) => {
        if (!isCancelled) {
          const list = Array.isArray(states) && states.length > 0 ? states : [
            "Delhi NCR", "Gujarat", "Karnataka", "Kerala", "Maharashtra",
            "Punjab", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
          ];
          setAvailableStates(list);
          setSelectedState((current) => (list.includes(current) ? current : ''));
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setAvailableStates([
            "Delhi NCR", "Gujarat", "Karnataka", "Kerala", "Maharashtra",
            "Punjab", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
          ]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingStates(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [career?.title]);

  useEffect(() => {
    if (!selectedState || !career?.title) {
      setDbColleges([]);
      return undefined;
    }

    let isCancelled = false;
    setIsLoadingColleges(true);

    console.log("Career Title:", career.title);
    console.log("Selected State:", selectedState);
    getCareerCollegesByState(career.title, selectedState)
      .then((data) => {
        if (!isCancelled) {
          console.log("API Response:", data);
          const colleges = (data || []).map((college) => ({
            name: college.college_name || college.name,
            location: college.location || selectedState,
            type: college.college_type || college.type || 'Government',
            speciality: college.speciality || 'Degree Course',
            fee: college.annual_fee || college.fee || '₹ 2.5 Lakhs/year',
          }));
          setDbColleges(colleges);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setDbColleges([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingColleges(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [career?.title, selectedState]);

  const careerInfo = getCareerInfo(career);
  const stateColleges = selectedState ? dbColleges : [];

  return (
    <>
      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>What They Do</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {careerInfo.whatTheyDo.map((item, index) => (
            <div key={index} style={{ background: 'white', borderRadius: 20, padding: '18px 20px', boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)' }}>
              <p style={{ margin: 0, fontSize: 15, color: '#334155' }}>• {item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Why Choose This Career</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {careerInfo.whyChoose.map((item, index) => (
            <div key={index} style={{ background: 'white', borderRadius: 20, padding: '18px 20px', boxShadow: '0 18px 36px rgba(15, 23, 42, 0.08)' }}>
              <p style={{ margin: 0, fontSize: 15, color: '#334155' }}>• {item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Education & Opportunities</h3>
        <div style={{ background: 'white', borderRadius: 24, padding: '24px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Primary Degree Required</div>
              <div style={{ color: '#475569' }}>{careerInfo.education.primaryDegree}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Typical Work Environments</div>
              <div style={{ color: '#475569' }}>{careerInfo.education.environments}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Core Skills</div>
              <div style={{ color: '#475569' }}>{careerInfo.education.coreSkills}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Tools to Master</div>
              <div style={{ color: '#475569' }}>{careerInfo.education.tools}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Valuable Certifications</div>
              <div style={{ color: '#475569' }}>{careerInfo.education.certifications}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Find Colleges</h3>
            <p style={{ margin: '8px 0 0', color: '#6b7280' }}>Choose an Indian state and view government/private colleges for this career</p>
          </div>
          <select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            style={{ padding: '12px 14px', borderRadius: 18, border: '1px solid #d1d5db', minWidth: 220, background: 'white', color: '#111827' }}
          >
            <option value="" disabled>
              Select a state first
            </option>
            {isLoadingStates ? (
              <option value="" disabled>
                Loading available states...
              </option>
            ) : availableStates.length > 0 ? (
              availableStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))
            ) : (
              <option value="" disabled>
                No college states available for this career yet
              </option>
            )}
          </select>
        </div>

        {selectedState ? (
          isLoadingColleges ? (
            <div style={{ background: 'white', borderRadius: 20, padding: '22px', textAlign: 'center', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
              <p style={{ margin: 0, color: '#475569' }}>Loading colleges from the database...</p>
            </div>
          ) : stateColleges.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {stateColleges.map((college, index) => (
                <div key={index} style={{ background: 'white', borderRadius: 22, padding: '18px 20px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{college.name}</h4>
                      <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14 }}>{college.location}, {selectedState}</p>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: 999, background: college.type === 'Government' ? '#ecfdf5' : '#eff6ff', color: college.type === 'Government' ? '#166534' : '#2563eb', fontWeight: 700, fontSize: 13 }}>
                      {college.type}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>Speciality:</span>
                      <span style={{ color: '#475569' }}>{college.speciality}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>Fee:</span>
                      <span style={{ color: '#475569' }}>{college.fee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: 20, padding: '22px', textAlign: 'center', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
              <p style={{ margin: 0, color: '#475569' }}>No college listings available for {selectedState} yet. Try another state.</p>
            </div>
          )
        ) : (
          <div style={{ background: 'white', borderRadius: 20, padding: '22px', textAlign: 'center', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)' }}>
            <p style={{ margin: 0, color: '#475569' }}>Please select a state to view college listings.</p>
          </div>
        )}
      </section>
    </>
  );
}

function getCareerInfo(career) {
  const title = String(career.title || 'Career');
  const category = String(career.category || '').toLowerCase();
  const normalizedTitle = title.toLowerCase();
  const group = getCareerGroup(normalizedTitle, category);

  return {
    whatTheyDo: getWhatTheyDo(title, group),
    whyChoose: getWhyChoose(title, group),
    education: getEducation(title, group),
    colleges: getCollegeDirectory(title, group),
  };
}

function getCareerGroup(title, category) {
  if (category.includes('healthcare') || /doctor|nurse|physiotherapist|pharmacist|radiologist|dentist|medical/.test(title)) {
    return 'healthcare';
  }
  if (category.includes('it') || category.includes('technology') || /engineer|developer|scientist|data|cybersecurity|ui\/ux|full stack|devops|ai\/?ml/.test(title)) {
    return 'technology';
  }
  if (category.includes('business') || category.includes('commerce') || /chartered accountant|mba|investment banker|financial analyst|marketing manager|business consultant|company secretary|entrepreneur|startup|franchise/.test(title)) {
    return 'business';
  }
  if (category.includes('government') || category.includes('railway') || /ias|ips|bank po|ssc cgl|railway|forest officer|govt\. teacher/.test(title)) {
    return 'government';
  }
  if (category.includes('law') || /lawyer|advocate|judge|legal advisor|public prosecutor|legal analyst/.test(title)) {
    return 'law';
  }
  if (category.includes('arts') || category.includes('creativity') || /graphic designer|illustrator|digital artist|fine artist|art director|tattoo artist/.test(title)) {
    return 'design';
  }
  if (category.includes('anime') || category.includes('animation') || /animator|3d artist|storyboard artist|vfx|character designer|animation director/.test(title)) {
    return 'animation';
  }
  if (category.includes('dance') || /dancer|choreographer|dance teacher|dance content creator|backup dancer/.test(title)) {
    return 'dance';
  }
  if (category.includes('music') || /singer|producer|composer|dj|music teacher|sound engineer/.test(title)) {
    return 'music';
  }
  if (category.includes('influencer') || category.includes('content') || /youtuber|instagram influencer|social media manager|podcast host|vlogger/.test(title)) {
    return 'influencer';
  }
  if (category.includes('entrepreneurship') || /founder|owner|entrepreneur/.test(title)) {
    return 'entrepreneurship';
  }
  if (category.includes('agriculture') || /agricultural|farmer|food technologist|horticulturist/.test(title)) {
    return 'agriculture';
  }
  if (category.includes('aviation') || /pilot|air traffic controller|flight attendant|airport manager|aviation safety officer|aircraft engineer/.test(title)) {
    return 'aviation';
  }
  if (category.includes('fashion') || category.includes('modeling') || /fashion designer|model|stylist|costume designer|photographer|textile designer/.test(title)) {
    return 'fashion';
  }
  if (category.includes('gaming') || category.includes('esports') || /esports|streamer|coach|game developer|gaming content creator|commentator/.test(title)) {
    return 'gaming';
  }
  if (category.includes('acting') || /actor|artist|comedian|voice actor|serial actor/.test(title)) {
    return 'acting';
  }
  return 'general';
}

function getWhatTheyDo(title, group) {
  const uniqueTitle = title.replace(/\b(MBBS|CA|MBA)\b/g, '').trim();
  const base = [
    `Define daily priorities and deliver results as a ${title}.`,
    `Apply specialized knowledge to solve real problems in ${title.toLowerCase()} work.`,
    `Collaborate with peers, mentors, and clients to refine outcomes.`,
    `Use workflow tools and judgment to maintain quality and efficiency.`,
    `Track progress and adapt to new challenges in the ${title} field.`,
  ];

  const variations = {
    healthcare: [
      `Examine patients, review symptoms, and choose the right treatment path.`,
      `Coordinate care with specialists, technicians, and health teams.`,
      `Stay current with medical advances and evidence-based practice.`,
      `Use clinical tools and diagnostics to support patient recovery.`,
      `Document health records and communicate tests clearly to patients.`,
    ],
    technology: [
      `Design, build, and test software or systems tailored to user needs.`,
      `Optimize performance, security, and scalability for complex products.`,
      `Write clean code while collaborating with product and QA teams.`,
      `Investigate technical issues and improve architecture over time.`,
      `Use data and feedback to evolve technical solutions.`,
    ],
    business: [
      `Analyze markets, finances, or customer behavior to improve performance.`,
      `Develop business plans, budgets, and strategic growth roadmaps.`,
      `Support leadership with clear insights and operational direction.`,
      `Manage client relationships, campaigns, or financial transactions.`,
      `Drive measurable outcomes for revenue, profitability, or brand value.`,
    ],
    government: [
      `Prepare for competitive exams and manage public service responsibilities.`,
      `Ensure policies are implemented and citizen services stay on track.`,
      `Coordinate with departments to solve community-level challenges.`,
      `Maintain discipline, ethics, and accountability in daily work.`,
      `Represent the government in legal, financial, or administrative settings.`,
    ],
    law: [
      `Research legal issues and prepare briefs, contracts, or court notes.`,
      `Represent clients or organizations in legal proceedings and negotiations.`,
      `Advise on compliance, risk, and the impact of new regulations.`,
      `Draft documents that protect rights and minimize liability.`,
      `Monitor case progress and support decision-making with evidence.`,
    ],
    design: [
      `Translate client briefs into visual concepts or product experiences.`,
      `Use design tools to create layouts, illustrations, and branding assets.`,
      `Test work with users and refine it through feedback cycles.`,
      `Collaborate with writers, marketers, and developers to deliver projects.`,
      `Build portfolios that show strong creative thinking and craft.`,
    ],
    animation: [
      `Sketch scenes, build animated assets, and sequence storytelling visuals.`,
      `Use animation software to bring motion and character to life.`,
      `Collaborate with writers, directors, and producers on projects.`,
      `Refine timing, effects, and transitions for audience impact.`,
      `Prepare work for games, films, advertising, and digital platforms.`,
    ],
    dance: [
      `Train regularly, rehearse choreography, and perform on stage or screen.`,
      `Create movement pieces that communicate emotion and story.`,
      `Teach students or lead creative teams for performances.`,
      `Use music, timing, and physical technique to deliver polished routines.`,
      `Network with producers, directors, and event organizers for work.`,
    ],
    music: [
      `Compose, arrange, or produce music using instruments and software.`,
      `Perform live, record tracks, or collaborate with artists and studios.`,
      `Mix and master audio to achieve professional sound quality.`,
      `Study music theory and develop a signature style.`,
      `Build an audience through shows, releases, or teaching.`,
    ],
    influencer: [
      `Create and publish digital stories tailored to target audiences.`,
      `Plan content calendars, brand partnerships, and distribution.`,
      `Track analytics and improve engagement with each post.`,
      `Work with sponsors, editors, and production teams for campaigns.`,
      `Grow a personal voice and community across platforms.`,
    ],
    entrepreneurship: [
      `Research customer needs and validate product-market fit.`,
      `Build a business model, secure funding, and manage operations.`,
      `Measure growth metrics and adjust strategy quickly.`,
      `Work with co-founders, mentors, and investors to scale.`,
      `Lead the launch of new products, services, or market entries.`,
    ],
    agriculture: [
      `Research soil conditions, crop cycles, and sustainable methods.`,
      `Develop improved cultivation plans and technology-driven farms.`,
      `Manage production, distribution, and food supply chains.`,
      `Advise farmers on best practices, certification, and quality control.`,
      `Use science to reduce risk and raise productivity on farms.`,
    ],
    aviation: [
      `Manage safe flight operations, communications, or logistics.`,
      `Inspect systems, coordinate teams, and support on-time departures.`,
      `Follow strict safety protocols for passengers and crew.`,
      `Navigate regulations, training, and operational planning.`,
      `Work with pilots, ground staff, and technical engineers daily.`,
    ],
    fashion: [
      `Create fashion concepts, collections, or styling plans.`,
      `Work with fabrics, trends, and visual branding for the runway.`,
      `Collaborate with models, photographers, and production teams.`,
      `Develop strong portfolios and fashion show presentations.`,
      `Source materials and craft compelling commercial designs.`,
    ],
    gaming: [
      `Build engaging game experiences or create high-impact content.`,
      `Practice performance, strategy, or development skills daily.`,
      `Work with teams, audiences, and technology for live or digital events.`,
      `Analyze performance metrics to grow your reach and reputation.`,
      `Stay current with gaming trends, tools, and community feedback.`,
    ],
    acting: [
      `Learn scripts, rehearse scenes, and perform with emotional range.`,
      `Develop character work and audition for film, TV, or stage roles.`,
      `Collaborate with directors, producers, and cast members.`,
      `Build a showreel and network with casting professionals.`,
      `Adapt performances to different genres and production settings.`,
    ],
    general: base,
  };

  return variations[group] || base;
}

function getWhyChoose(title, group) {
  const base = [
    `The ${title} field gives you a strong mix of skill, stability, and growth.`,
    `This career is well-suited for people who enjoy solving problems with expertise.`,
    `You can build meaningful work experience across industries and teams.`,
    `This path offers a range of specialist and senior roles over time.`,
    `It gives you the chance to develop a distinctive professional identity.`,
  ];

  const variations = {
    healthcare: [
      `Healthcare roles are always in demand, especially in hospitals and clinics.`,
      `You get to help people directly and make a measurable difference.`,
      `Medical careers offer strong specialization paths and long-term security.`,
      `Advanced clinical skills are valued in both urban and rural settings.`,
      `There are many paths—from patient care to research and public health.`,
    ],
    technology: [
      `Technology careers remain some of the fastest-growing and highest-paying roles.`,
      `You can work remotely, in startups, large firms, or freelancing teams.`,
      `The field offers constant innovation and a strong learning curve.`,
      `You can specialize in AI, cloud, security, or product engineering.`,
      `Technical experience opens doors globally and across industries.`,
    ],
    business: [
      `Business careers offer varied roles across finance, marketing, and leadership.`,
      `You can move from execution roles into senior strategy and consulting.`,
      `Strong business skills are valuable in every sector.`,
      `Many roles include clear advancement and attractive compensation.`,
      `This field is ideal if you enjoy data, decision-making, and teamwork.`,
    ],
    government: [
      `Government roles provide strong benefits, respect, and career stability.`,
      `Public service careers let you make a real impact on society.`,
      `There are competitive paths across administration, policing, and banking.`,
      `The examination-based entry makes preparation and progress clear.`,
      `Promotions are structured and often come with long-term security.`,
    ],
    law: [
      `Legal careers come with authority, intellectual challenge, and strong demand.`,
      `You can work in litigation, corporate law, policy, or advisory roles.`,
      `Experienced lawyers are highly valued in business and government.`,
      `You can build a prestigious practice or join top legal firms.`,
      `This field offers a powerful combination of research and advocacy.`,
    ],
    design: [
      `Design roles offer creative freedom with strong industry demand.`,
      `You can work in advertising, product, branding, or digital media.`,
      `Good design skills are essential to any team building user experiences.`,
      `The work is highly portfolio-driven, so every project builds your reputation.`,
      `You can choose between freelance work and stable studio roles.`,
    ],
    animation: [
      `Animation careers are great for storytellers who love technology.`,
      `You can work on films, games, advertising, and digital series.`,
      `The sector is growing fast with demand for skilled animators.`,
      `You can specialize in 2D, 3D, VFX, or character design.`,
      `This path is ideal for people who enjoy visual storytelling and art.`,
    ],
    dance: [
      `Dance careers are ideal for performers who love movement and storytelling.`,
      `You can move between performance, choreography, teaching, and content.`,
      `The industry values training, stage presence, and creativity.`,
      `There are opportunities in films, live events, and performance schools.`,
      `Your career can combine artistry with business and teaching roles.`,
    ],
    music: [
      `Music careers let you create, perform, and collaborate across media.`,
      `There are strong opportunities in recording, live events, and education.`,
      `Musical skill combined with production knowledge is highly marketable.`,
      `You can build a creative brand as a singer, producer, or composer.`,
      `The field supports both freelance work and institutional roles.`,
    ],
    influencer: [
      `Influencer careers build modern personal brands and digital audiences.`,
      `You can monetize creativity through partnerships, ads, and content.`,
      `This work rewards consistency, storytelling, and audience trust.`,
      `You can choose a niche and grow a loyal following.`,
      `Digital skills and personal voice are the assets that drive success.`,
    ],
    entrepreneurship: [
      `Entrepreneurship offers independence and the chance to build something new.`,
      `You can shape your own career and scale value over time.`,
      `This path is well-suited to problem solvers and leaders.`,
      `Successful founders can create lasting businesses and teams.`,
      `The experience is extremely valuable across every industry.`,
    ],
    agriculture: [
      `Agriculture careers are vital for food security and rural development.`,
      `You can work in research, farm management, agribusiness, or sustainability.`,
      `The sector is modernizing fast with agri-tech and precision farming.`,
      `This work combines science, environment, and practical leadership.`,
      `There is growing demand for experts who improve crop resilience and yield.`,
    ],
    aviation: [
      `Aviation careers let you work in travel, logistics, and air safety.`,
      `You can build a global career with strong demand for qualified staff.`,
      `The field values precision, training, and operational discipline.`,
      `There are pathways in flying, ground operations, maintenance, and management.`,
      `Aviation roles often come with structured career progression.`,
    ],
    fashion: [
      `Fashion careers combine creativity with trend awareness and business sense.`,
      `You can work in design, styling, photography, or retail.`,
      `This industry rewards strong taste, presentation, and networking.`,
      `Good fashion professionals build visible brands and portfolios.`,
      `You can move between commercial, editorial, and haute couture work.`,
    ],
    gaming: [
      `Gaming careers match technical skill with entertainment and community.`,
      `You can work as a developer, streamer, coach, or content creator.`,
      `The sector is growing fast with strong engagement from audiences.`,
      `There are opportunities in studios, tournaments, and online platforms.`,
      `Gaming roles reward consistency, creativity, and a strong personal brand.`,
    ],
    acting: [
      `Acting careers let you bring characters and stories to life.`,
      `You can work in film, theatre, television, or streaming content.`,
      `This field values performance skill, discipline, and presence.`,
      `A strong portfolio and auditions lead to progressively larger roles.`,
      `You can also diversify into voice acting, hosting, and creative direction.`,
    ],
    general: base,
  };

  return variations[group] || base;
}

function getEducation(title, group) {
  const lower = title.toLowerCase();
  if (/doctor|mbbs|medical|dentist|pharmacist|medical lab|radiologist|physiotherapist|nurse/.test(lower)) {
    return {
      primaryDegree: 'Medical or allied health degree (MBBS, BDS, B.Pharm, BPT, B.Sc Nursing, B.Sc MLT)',
      environments: 'Hospitals, clinics, laboratories, and specialized care centers.',
      coreSkills: 'Clinical judgment, patient communication, diagnostics, precision.',
      tools: 'Medical equipment, health record systems, diagnostic imaging, therapy tools.',
      certifications: 'Medical council license, nursing registration, pharmacy license, allied health certifications.',
    };
  }
  if (/software engineer|full stack|devops|cybersecurity|data scientist|ai|ml|computer|developer|it|technology/.test(lower)) {
    return {
      primaryDegree: 'B.Tech / B.E. / BCA / MCA / Computer Science / Information Technology',
      environments: 'Product teams, IT consultancies, startups, R&D labs, cloud operations.',
      coreSkills: 'Programming, systems design, data analysis, problem solving, collaboration.',
      tools: 'Code editors, Git, CI/CD platforms, cloud services, analytics frameworks.',
      certifications: 'AWS, Azure, Google Cloud, CISSP, data science certifications, DevOps certifications.',
    };
  }
  if (/chartered accountant|ca|financial analyst|investment banker|company secretary|mba|marketing manager|business consultant|business|commerce|entrepreneur|startup/.test(lower)) {
    return {
      primaryDegree: 'B.Com / BBA / BBM / MBA / CA / CS / Finance degree',
      environments: 'Corporate offices, consulting firms, banks, startups, financial services.',
      coreSkills: 'Financial analysis, strategy, communication, leadership, business acumen.',
      tools: 'Excel, analytics software, ERP systems, CRM tools, finance platforms.',
      certifications: 'CA, CFA, MBA, CS, digital marketing, business analytics, finance certifications.',
    };
  }
  if (/ias|ips|ssc cgl|railway|bank po|forest officer|govt\. teacher/.test(lower)) {
    return {
      primaryDegree: 'Graduation plus competitive exam preparation (UPSC, SSC, IBPS, RRB, state PSC)',
      environments: 'Government offices, courts, banks, police departments, railway stations.',
      coreSkills: 'General studies, reasoning, ethics, administration, communication.',
      tools: 'Study materials, exam simulators, legal resources, office productivity software.',
      certifications: 'Government service training, officer induction programs, specialized police or banking certifications.',
    };
  }
  if (/lawyer|advocate|judge|legal advisor|public prosecutor|legal analyst/.test(lower)) {
    return {
      primaryDegree: 'LLB / BA LLB / BBA LLB / LLM / Law degree',
      environments: 'Courts, law firms, corporate legal departments, government offices.',
      coreSkills: 'Legal research, writing, argumentation, negotiation, ethics.',
      tools: 'Legal databases, case management systems, drafting software.',
      certifications: 'Bar Council registration, mediation and arbitration certification, corporate law programs.',
    };
  }
  if (/graphic designer|illustrator|digital artist|fine artist|art director|tattoo artist|fashion designer|stylist|costume designer|photographer|textile designer/.test(lower)) {
    return {
      primaryDegree: 'B.Des / BA (Design) / Diploma in Fine Arts / Fashion / Multimedia / Visual Communication',
      environments: 'Agencies, studios, production houses, fashion houses, freelance projects.',
      coreSkills: 'Creativity, visual storytelling, typography, colour theory, composition.',
      tools: 'Adobe Creative Suite, design systems, drawing tablets, photography gear.',
      certifications: 'Design diplomas, fashion courses, visual arts workshops, UX/UI certifications.',
    };
  }
  if (/animator|3d artist|storyboard|vfx|character designer|animation director/.test(lower)) {
    return {
      primaryDegree: 'Diploma or degree in Animation, Multimedia, VFX, or Digital Arts',
      environments: 'Animation studios, film production houses, gaming companies, advertising agencies.',
      coreSkills: 'Storyboarding, animation software, timing, visual effects, collaboration.',
      tools: 'Maya, Blender, After Effects, Toon Boom, Cinema 4D, Adobe Creative Cloud.',
      certifications: 'Animation diplomas, VFX certificates, specialized software training.',
    };
  }
  if (/dancer|choreographer|dance teacher/.test(lower)) {
    return {
      primaryDegree: 'Diploma or degree in Dance, Performing Arts, or Choreography',
      environments: 'Studios, theatres, films, events, dance schools.',
      coreSkills: 'Technique, expression, rhythm, teaching, choreography.',
      tools: 'Practice studios, music systems, performance direction, choreography software.',
      certifications: 'Performing arts diplomas, dance academy certifications, choreography courses.',
    };
  }
  if (/singer|producer|composer|music teacher|sound engineer|dj/.test(lower)) {
    return {
      primaryDegree: 'Degree or diploma in Music, Performing Arts, Sound Engineering, or Production',
      environments: 'Studios, performance venues, broadcast media, education institutions.',
      coreSkills: 'Music theory, composition, production, performance, audio engineering.',
      tools: 'DAWs, microphones, instruments, mixing consoles, notation software.',
      certifications: 'Music diplomas, audio production certifications, performance training.',
    };
  }
  if (/youtuber|instagram influencer|content creator|social media manager|podcast host|vlogger/.test(lower)) {
    return {
      primaryDegree: 'Programs in digital media, journalism, communication, or marketing',
      environments: 'Digital platforms, media studios, marketing agencies, freelance workspaces.',
      coreSkills: 'Storytelling, editing, audience engagement, branding, analytics.',
      tools: 'Cameras, editing software, social media tools, audio equipment.',
      certifications: 'Digital marketing, social media management, content strategy programs.',
    };
  }
  if (/pilot|air traffic controller|flight attendant|airport manager|aviation safety officer|aircraft engineer/.test(lower)) {
    return {
      primaryDegree: 'Commercial pilot license, B.Sc Aviation, Aerospace Engineering, or Diploma in Aviation',
      environments: 'Airlines, airports, ground operations, aviation safety units.',
      coreSkills: 'Navigation, safety, communication, technical inspection, operations.',
      tools: 'Simulators, avionics systems, aircraft maintenance tools, safety equipment.',
      certifications: 'Pilot license, ATC certification, aviation maintenance license, safety training.',
    };
  }
  if (/agricultural scientist|agri-business manager|horticulturist|food technologist|agricultural engineer|organic farmer/.test(lower)) {
    return {
      primaryDegree: 'B.Sc Agriculture / Agricultural Engineering / Horticulture / Food Technology',
      environments: 'Farms, research institutes, agribusiness firms, food processing units.',
      coreSkills: 'Crop science, soil health, farm management, product development.',
      tools: 'Agronomy software, irrigation systems, lab equipment, machinery.',
      certifications: 'Agriculture diplomas, food safety certifications, organic farming credentials.',
    };
  }

  return {
    primaryDegree: 'Relevant diploma, undergraduate degree, or certification',
    environments: 'Professional workplaces, field settings, or creative studios based on the career.',
    coreSkills: 'Domain knowledge, communication, problem solving, and collaboration.',
    tools: 'Industry-specific tools and software for the chosen role.',
    certifications: 'Professional certifications or licenses related to the field.',
  };
}
const CAREER_COLLEGES = {};





function getCollegeDirectory(title) {
  return CAREER_COLLEGES[title] || COLLEGE_DIRECTORY;
}

const COLLEGE_DIRECTORY = {
  'Karnataka': [
    { name: 'IISc Bangalore', location: 'Bengaluru', type: 'Government' },
    { name: 'NIT Surathkal', location: 'Mangaluru', type: 'Government' },
    { name: 'RV College of Engineering', location: 'Bengaluru', type: 'Private' },
    { name: 'PES University', location: 'Bengaluru', type: 'Private' },
    { name: 'Manipal Institute of Technology', location: 'Manipal', type: 'Private' },
    { name: 'BMS College of Engineering', location: 'Bengaluru', type: 'Private' },
    { name: 'St. John’s Medical College', location: 'Bengaluru', type: 'Private' },
    { name: 'NIMHANS', location: 'Bengaluru', type: 'Government' },
    { name: 'Mount Carmel College', location: 'Bengaluru', type: 'Private' },
    { name: 'JSS Academy of Technical Education', location: 'Bengaluru', type: 'Private' },
  ],
  'Tamil Nadu': [
    { name: 'IIT Madras', location: 'Chennai', type: 'Government' },
    { name: 'Anna University', location: 'Chennai', type: 'Government' },
    { name: 'VIT Vellore', location: 'Vellore', type: 'Private' },
    { name: 'SRM Institute of Science and Technology', location: 'Chennai', type: 'Private' },
    { name: 'SASTRA University', location: 'Thanjavur', type: 'Private' },
    { name: 'PSG College of Technology', location: 'Coimbatore', type: 'Private' },
    { name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore', type: 'Private' },
    { name: 'Madras Medical College', location: 'Chennai', type: 'Government' },
    { name: 'Christian Medical College', location: 'Vellore', type: 'Private' },
    { name: 'Sathyabama Institute of Science and Technology', location: 'Chennai', type: 'Private' },
  ],
  'Maharashtra': [
    { name: 'IIT Bombay', location: 'Mumbai', type: 'Government' },
    { name: 'SPJIMR', location: 'Mumbai', type: 'Private' },
    { name: 'NMIMS', location: 'Mumbai', type: 'Private' },
    { name: 'VJTI', location: 'Mumbai', type: 'Government' },
    { name: 'KJ Somaiya College of Engineering', location: 'Mumbai', type: 'Private' },
    { name: 'Symbiosis International University', location: 'Pune', type: 'Private' },
    { name: 'COEP', location: 'Pune', type: 'Government' },
    { name: 'MIT Pune', location: 'Pune', type: 'Private' },
    { name: 'Tata Institute of Social Sciences', location: 'Mumbai', type: 'Government' },
    { name: 'Fergusson College', location: 'Pune', type: 'Private' },
  ],
  'Telangana': [
    { name: 'IIT Hyderabad', location: 'Hyderabad', type: 'Government' },
    { name: 'IIIT Hyderabad', location: 'Hyderabad', type: 'Government' },
    { name: 'JNTU Hyderabad', location: 'Hyderabad', type: 'Government' },
    { name: 'Osmania University', location: 'Hyderabad', type: 'Government' },
    { name: 'NALSAR University of Law', location: 'Hyderabad', type: 'Government' },
    { name: 'VNR VJIET', location: 'Hyderabad', type: 'Private' },
    { name: 'CBIT', location: 'Hyderabad', type: 'Government' },
    { name: 'BITS Pilani, Hyderabad Campus', location: 'Hyderabad', type: 'Private' },
    { name: 'GITAM University', location: 'Hyderabad', type: 'Private' },
    { name: 'Maulana Azad National Urdu University', location: 'Hyderabad', type: 'Government' },
  ],
  'Delhi': [
    { name: 'IIT Delhi', location: 'New Delhi', type: 'Government' },
    { name: 'IIM Ahmedabad', location: 'Ahmedabad', type: 'Government' },
    { name: 'Jamia Millia Islamia', location: 'New Delhi', type: 'Government' },
    { name: 'University of Delhi', location: 'New Delhi', type: 'Government' },
    { name: 'JNU', location: 'New Delhi', type: 'Government' },
    { name: 'NSUT', location: 'New Delhi', type: 'Government' },
    { name: 'NLU Delhi', location: 'New Delhi', type: 'Government' },
    { name: 'Lady Shri Ram College', location: 'New Delhi', type: 'Government' },
    { name: 'Ambedkar University Delhi', location: 'New Delhi', type: 'Government' },
    { name: 'Asian Academy of Film & Television', location: 'Noida', type: 'Private' },
  ],
  'West Bengal': [
    { name: 'IIT Kharagpur', location: 'Kharagpur', type: 'Government' },
    { name: 'Jadavpur University', location: 'Kolkata', type: 'Government' },
    { name: 'IIEST Shibpur', location: 'Howrah', type: 'Government' },
    { name: 'NID Kolkata', location: 'Kolkata', type: 'Government' },
    { name: 'Presidency University', location: 'Kolkata', type: 'Government' },
    { name: 'St. Xavier’s College', location: 'Kolkata', type: 'Private' },
    { name: 'Heritage Institute of Technology', location: 'Kolkata', type: 'Private' },
    { name: 'ISI Kolkata', location: 'Kolkata', type: 'Government' },
    { name: 'Techno India University', location: 'Kolkata', type: 'Private' },
    { name: 'Bengal Institute of Technology', location: 'Kolkata', type: 'Private' },
  ],
  'Andhra Pradesh': [
    { name: 'IIT Tirupati', location: 'Tirupati', type: 'Government' },
    { name: 'JNTU Kakinada', location: 'Kakinada', type: 'Government' },
    { name: 'Andhra University', location: 'Visakhapatnam', type: 'Government' },
    { name: 'SVU', location: 'Tirupati', type: 'Government' },
    { name: 'GITAM University', location: 'Visakhapatnam', type: 'Private' },
    { name: 'VIT-AP', location: 'Amaravati', type: 'Private' },
    { name: 'KL University', location: 'Vijayawada', type: 'Private' },
    { name: 'NIT Andhra', location: 'Tadepalligudem', type: 'Government' },
    { name: 'Sri Venkateswara University', location: 'Tirupati', type: 'Government' },
    { name: 'Amrita Vishwa Vidyapeetham', location: 'Amaravati', type: 'Private' },
  ],
  'Kerala': [
    { name: 'Amrita Vishwa Vidyapeetham', location: 'Kochi', type: 'Private' },
    { name: 'NIT Calicut', location: 'Calicut', type: 'Government' },
    { name: 'Cochin University of Science and Technology', location: 'Kochi', type: 'Government' },
    { name: 'MG University', location: 'Kottayam', type: 'Government' },
    { name: 'Kerala Agricultural University', location: 'Thrissur', type: 'Government' },
    { name: 'Government Medical College', location: 'Thiruvananthapuram', type: 'Government' },
    { name: 'T.K.M. College of Engineering', location: 'Kollam', type: 'Private' },
    { name: 'Maharaja’s College', location: 'Ernakulam', type: 'Government' },
    { name: 'Sree Chitra Tirunal Institute', location: 'Thiruvananthapuram', type: 'Government' },
    { name: 'Rajagiri College of Social Sciences', location: 'Kochi', type: 'Private' },
  ],
};

function getSpecialityForCareer(title, group, collegeName, index) {
  const common = title.replace(/\b(Engineer|Engineer\)|Developer|Specialist|Officer|Manager|Graduate|Artist|Teacher|Advisor|Consultant|Founder|Owner|Creator|Analyst|Doctor|Nurse|Designer|Director|Performer|Producer)\b/gi, '').trim();
  const core = common || title;
  const groupSpecialities = {
    healthcare: ['Clinical Care', 'Medical Research', 'Patient Management', 'Healthcare Diagnostics', 'Therapeutic Services'],
    technology: ['Software Development', 'AI & Data', 'Cybersecurity', 'Cloud Engineering', 'Product Engineering'],
    business: ['Business Strategy', 'Financial Planning', 'Marketing Management', 'Operations', 'Analytics'],
    government: ['Public Policy', 'Administration', 'Civil Services', 'Regulatory Affairs', 'Governance'],
    law: ['Corporate Law', 'Litigation', 'Legal Research', 'Compliance', 'Contracts'],
    design: ['Visual Design', 'Branding', 'Digital Art', 'UI/UX', 'Creative Direction'],
    animation: ['Character Animation', 'Visual Effects', 'Storyboarding', '3D Modelling', 'Motion Graphics'],
    dance: ['Performance Training', 'Choreography', 'Dance Education', 'Stage Production', 'Physical Conditioning'],
    music: ['Music Production', 'Sound Engineering', 'Performance', 'Composition', 'Audio Technology'],
    influencer: ['Digital Media', 'Content Strategy', 'Social Branding', 'Video Production', 'Audience Growth'],
    entrepreneurship: ['Startup Strategy', 'Innovation', 'Business Growth', 'Product Development', 'Scale-Up Management'],
    agriculture: ['Agricultural Science', 'Farm Management', 'Food Technology', 'Sustainable Farming', 'Crop Research'],
    aviation: ['Aviation Operations', 'Flight Training', 'Aircraft Systems', 'Airport Management', 'Safety Compliance'],
    fashion: ['Fashion Design', 'Textile Development', 'Styling', 'Retail Fashion', 'Creative Merchandising'],
    gaming: ['Game Design', 'Esports Performance', 'Streaming Content', 'Interactive Media', 'Game Development'],
    acting: ['Performance Skills', 'Character Development', 'Screen Acting', 'Theatre Arts', 'Voice Training'],
    general: ['Professional Skills', 'Industry Training', 'Career Development', 'Practical Expertise', 'Role Specialization'],
  };

  const options = groupSpecialities[group] || groupSpecialities.general;
  const speciality = options[index % options.length];
  return `${speciality} for ${title}`;
}

function getFeeForCollege(college, index) {
  const baseGov = ['₹20,000/year', '₹25,000/year', '₹35,000/year', '₹40,000/year', '₹50,000/year'];
  const basePriv = ['₹2.5 Lakhs/year', '₹3 Lakhs/year', '₹3.5 Lakhs/year', '₹4 Lakhs/year', '₹5 Lakhs/year'];
  return college.type === 'Government'
    ? baseGov[index % baseGov.length]
    : basePriv[index % basePriv.length];
}


export default CareerDetail;
