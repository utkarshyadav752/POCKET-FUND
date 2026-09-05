import React, { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onOpenLogin: (role?: 'parent' | 'student') => void;
  onOpenPilot: () => void;
  onOpenSiteAi: () => void;
  showToast: (msg: string) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

interface AllowancePreset {
  age: number;
  metroAmount: number;
  tier2Amount: number;
  foodShare: number;
  transitShare: number;
  booksShare: number;
  savingsShare: number;
}

const ALLOWANCE_PRESETS: Record<number, AllowancePreset> = {
  12: { age: 12, metroAmount: 1000, tier2Amount: 800, foodShare: 35, transitShare: 15, booksShare: 25, savingsShare: 25 },
  13: { age: 13, metroAmount: 1200, tier2Amount: 950, foodShare: 35, transitShare: 20, booksShare: 20, savingsShare: 25 },
  14: { age: 14, metroAmount: 1500, tier2Amount: 1200, foodShare: 40, transitShare: 20, booksShare: 20, savingsShare: 20 },
  15: { age: 15, metroAmount: 1800, tier2Amount: 1400, foodShare: 40, transitShare: 25, booksShare: 15, savingsShare: 20 },
  16: { age: 16, metroAmount: 2000, tier2Amount: 1600, foodShare: 45, transitShare: 25, booksShare: 15, savingsShare: 15 },
  17: { age: 17, metroAmount: 2500, tier2Amount: 2000, foodShare: 45, transitShare: 25, booksShare: 15, savingsShare: 15 },
};

const FAQ_ITEMS = [
  {
    q: 'Does each child get their own separate login Gmail and password?',
    a: 'Yes! Every child receives their own unique Gmail login and independent password (e.g., student.name@gmail.com). When a child logs in on their phone or tablet, they access only their personal wallet, transactions, and savings goals—without access to siblings’ data or parent admin controls.',
  },
  {
    q: 'How does Pocket Fund handle UPI payments safely for teenagers?',
    a: 'Pocket Fund works through RBI-compliant Prepaid Payment Instrument (PPI) partner rails. Parents fund a designated companion wallet with strict daily limits. Minors cannot take credit, exceed limits, or connect directly to primary bank accounts without parent authorization.',
  },
  {
    q: 'Can I manage multiple children with different ages and rules?',
    a: 'Yes! Pocket Fund is built specifically for Indian families with 1, 2, or 3+ children. You can set a ₹1,000/month allowance with tight food restrictions for a 12-year-old, and ₹2,000/month with higher daily transit limits for a 16-year-old, all from one unified parent console.',
  },
  {
    q: 'Are merchant categories blocked for teen wallets?',
    a: 'Absolutely. All transactions are filtered through merchant category codes (MCC). High-risk or age-inappropriate merchants—including alcohol, betting, lottery, adult services, and unauthorized gaming tokens—are automatically declined at the network level.',
  },
  {
    q: 'What happens when a child runs out of money before the month ends?',
    a: 'This is the most powerful learning moment! The child can review their spending history to understand where their funds went, or submit a top-up request with an itemized explanation (e.g., school project materials) for parent approval via 1-tap UPI.',
  },
  {
    q: 'Is Pocket Fund a bank or a fintech platform?',
    a: 'Pocket Fund is a financial technology company partnering with licensed, RBI-regulated scheduled commercial banks and authorized PPI issuers to provide secure wallet and payment processing services.',
  },
  {
    q: 'How do I participate in the early access family pilot?',
    a: 'Click "Join the Pilot" on this website, enter your email and family details. We invite batches of 50 families each month to provide feedback, test companion features, and receive zero fees for life on their starter accounts.',
  },
  {
    q: 'How do I contact Customer Care or connect directly with the founders?',
    a: 'You can call Customer Support and connect directly to Lead Founder Utkarsh Yadav at +91 9554460651 (available 7 days a week, 8:00 AM – 10:00 PM IST). You can also reach our co-founding team via email: Utkarsh Yadav (utkarshyadav752@gmail.com), Madhulika Maurya (madhulikamaurya9@gmail.com), Sejal Sahu (sejalsahu0106@gmail.com), and Shameen Khan (shameenkhan964@gmail.com).',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenPilot,
  onOpenLogin,
  onOpenSiteAi,
  showToast,
  isDarkTheme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Allowance Calculator State
  const [calcAge, setCalcAge] = useState<number>(14);
  const [calcCityTier, setCalcCityTier] = useState<'metro' | 'tier2'>('metro');
  const [calcCommute, setCalcCommute] = useState<'metro_bus' | 'school_bus' | 'walk'>('metro_bus');

  const preset = ALLOWANCE_PRESETS[calcAge] || ALLOWANCE_PRESETS[14];
  let baseAmount = calcCityTier === 'metro' ? preset.metroAmount : preset.tier2Amount;
  if (calcCommute === 'metro_bus') baseAmount += 200;
  if (calcCommute === 'walk') baseAmount -= 150;

  const foodAmt = Math.round((baseAmount * preset.foodShare) / 100);
  const transitAmt = Math.round((baseAmount * preset.transitShare) / 100);
  const booksAmt = Math.round((baseAmount * preset.booksShare) / 100);
  const savingsAmt = baseAmount - foodAmt - transitAmt - booksAmt;

  const handleApplyCalcToDemo = () => {
    onOpenLogin('parent');
    showToast(`Sign in to Parent Console to configure ₹${baseAmount.toLocaleString('en-IN')} monthly allowance!`);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="website-root">
      {/* Top 24/7 Customer Care Helpline Ribbon */}
      <div
        className="support-announcement-bar"
        style={{
          background: 'linear-gradient(90deg, #051a2f 0%, #0d2e50 50%, #051a2f 100%)',
          borderBottom: '1px solid #16436c',
          padding: '8px 16px',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          position: 'relative',
          zIndex: 60,
        }}
      >
        <div
          className="wrap"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 600 }}>
              <span>📞</span> Customer Support &amp; Connect to Leader:
              <a
                href="tel:9554460651"
                style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 700, padding: '2px 8px', background: '#08253d', borderRadius: '4px' }}
                title="Call Customer Support & Connect to Leader"
              >
                +91 9554460651
              </a>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.74rem' }}>
              <span>✉️</span>
              <a
                href="mailto:utkarshyadav752@gmail.com"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                utkarshyadav752@gmail.com
              </a>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.74rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#799ab2' }}>Founder Desk (Utkarsh Yadav)</span>
            <a
              href="tel:9554460651"
              style={{
                background: '#10b981',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '4px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Call Lead Founder Utkarsh Yadav"
            >
              <span>📞</span> Call: 9554460651
            </a>
            <a
              href="mailto:utkarshyadav752@gmail.com?subject=Pocket%20Fund%20Support%20Inquiry"
              style={{
                background: '#0284c7',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>✉️</span> Email
            </a>
          </div>
        </div>
      </div>

      {/* Floating AI Advisor Trigger */}
      <button
        className="ai-floating-btn"
        id="open-site-ai"
        aria-label="Ask Pocket Fund AI"
        onClick={onOpenSiteAi}
      >
        <span>✦</span> Ask Pocket Fund AI
      </button>

      {/* Persistent Website Header */}
      <header className="site-header">
        <div className="wrap">
          <div className="site-nav">
            <a className="brand" href="#top" onClick={() => scrollToSection('top')}>
              <span className="logo">₹</span>Pocket Fund
            </a>

            <nav className={`navlinks nav-links-wrap ${mobileMenuOpen ? 'open' : ''}`}>
              <a href="#how" onClick={(e) => { e.preventDefault(); scrollToSection('how'); }}>Method</a>
              <a href="#multi-child" onClick={(e) => { e.preventDefault(); scrollToSection('multi-child'); }}>Multi-Child</a>
              <a href="#calculator" onClick={(e) => { e.preventDefault(); scrollToSection('calculator'); }}>Allowance Calculator</a>
              <a href="#platforms" onClick={(e) => { e.preventDefault(); scrollToSection('platforms'); }}>Platforms</a>
              <a href="#safety" onClick={(e) => { e.preventDefault(); scrollToSection('safety'); }}>Safety</a>
              <a href="#stories" onClick={(e) => { e.preventDefault(); scrollToSection('stories'); }}>Stories</a>
              <a href="#founders" onClick={(e) => { e.preventDefault(); scrollToSection('founders'); }} style={{ color: '#38bdf8', fontWeight: 600 }}>Founders</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  className="btn secondary small"
                  style={{ borderColor: '#2dd4bf', color: '#2dd4bf' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('parent');
                  }}
                >
                  Parent Sign In 👩
                </button>
                <button
                  className="btn secondary small"
                  style={{ borderColor: '#38bdf8', color: '#38bdf8' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('student');
                  }}
                >
                  Student Sign In 🧑
                </button>
                <button
                  className="btn small"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPilot();
                  }}
                >
                  Join Pilot
                </button>
              </div>
            </nav>

            <button
              className="hamburger"
              aria-label="Toggle navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="top">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">The Parent-Guided Allowance Platform</div>
              <h1>
                Money skills don't start at eighteen. <em>They start here.</em>
              </h1>
              <p>
                Pocket Fund helps Indian families practice planning, budgeting, and everyday decision-making
                together with real UPI guardrails, multi-child accounts, and age-appropriate companion wallets.
              </p>
              <div className="actions">
                <button className="btn" onClick={onOpenPilot}>
                  Join the Family Pilot
                </button>
                <button
                  className="btn secondary"
                  onClick={() => onOpenLogin('parent')}
                  title="Sign in to Parent Console"
                >
                  Parent Sign In 👩
                </button>
                <button
                  className="btn secondary"
                  onClick={() => onOpenLogin('student')}
                  title="Sign in to Student Space"
                >
                  Student Sign In 🧑
                </button>
              </div>
              <div className="trust-row">
                <div className="faces">
                  <div className="face">👩</div>
                  <div className="face">🧑</div>
                  <div className="face">👧</div>
                </div>
                <span>Designed for Indian families with teens aged 12–17 · 0% overdraft risk</span>
              </div>
            </div>

            <div className="visual" aria-hidden="true">
              <div className="orb"></div>
              <div className="orbit"></div>
              <div className="wallet"></div>
              <div className="coin one">₹</div>
              <div className="coin two">₹</div>
              <div className="coin three">₹</div>

              {/* Parent Feature Bubble */}
              <div className="mini-card parent">
                <span className="tag">PARENT DASHBOARD</span>
                <b>Scheduled Monthly Allowance</b>
                <span className="muted">Custom category limits & instant UPI approvals</span>
              </div>

              {/* Teen Feature Bubble */}
              <div className="mini-card teen">
                <span className="tag">STUDENT WALLET</span>
                <b>Companion Prepaid Wallet</b>
                <span className="muted">Zero overdraft · Goal saving habits</span>
                <div className="progressline">
                  <i style={{ width: '65%' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Comparison Section */}
      <section className="section problem">
        <div className="wrap">
          <div className="eyebrow">THE SHIFT</div>
          <h2>From random ad-hoc transfers to an actual routine.</h2>
          <div className="compare">
            <div className="flowbox before">
              <div className="flowtitle">Before Pocket Fund</div>
              <div className="steps">
                <span className="step">Ad-hoc UPI asks with zero visibility</span>
                <span className="step">No paper trail or categorized records</span>
                <span className="step">Awkward monthly money friction</span>
                <span className="step">Zero saving habit or delayed gratification</span>
              </div>
            </div>
            <div className="arrowbig">→</div>
            <div className="flowbox after">
              <div className="flowtitle">With Pocket Fund</div>
              <div className="steps">
                <span className="step">Predictable monthly allowance schedule</span>
                <span className="step">Shared visibility across parents & teens</span>
                <span className="step">Goal-based savings milestones</span>
                <span className="step">Hands-on practice before turning eighteen</span>
              </div>
            </div>
          </div>
          <div className="section-foot">
            BUILDING RESPONSIBILITY STEP-BY-STEP, NOT ALL AT ONCE.
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="section pillars" id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">The Method</div>
              <h2 style={{ margin: '15px 0 0' }}>Three pillars for real financial habits.</h2>
            </div>
            <p className="intro muted">
              Pocket Fund is built on behavioural science, helping teenagers develop confidence through
              experience and guidance rather than restrictive lectures.
            </p>
          </div>
          <div className="cards">
            <div className="pillar reveal">
              <div className="icon3d">🗓️</div>
              <h3>1. Plan</h3>
              <p>
                Set a predictable monthly allowance schedule. Transparent recurring dates reduce family friction and provide teens with an actual baseline budget.
              </p>
            </div>
            <div className="pillar reveal">
              <div className="icon3d">⚖️</div>
              <h3>2. Decide</h3>
              <p>
                Categorised spending gives teens genuine autonomy over daily choices, while parent-set category guardrails protect the family essentials.
              </p>
            </div>
            <div className="pillar reveal">
              <div className="icon3d">🌱</div>
              <h3>3. Learn</h3>
              <p>
                Visual goal pacing, weekly financial reflections, and bite-sized AI coaching turn every transaction into lasting financial literacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Child Family Hub Section */}
      <section className="section" id="multi-child" style={{ background: '#04101c' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Multi-Child Controls</div>
              <h2 style={{ margin: '15px 0 0' }}>One parent console. Custom rules per child.</h2>
            </div>
            <p className="intro muted">
              A 12-year-old and a 16-year-old need completely different financial boundaries. Pocket Fund makes it seamless to customize rules for each child.
            </p>
          </div>

          <div className="multichild-grid">
            {/* Tier 1: Junior Teen */}
            <div className="child-profile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🧒</span>
                <span className="badge">Ages 11–13</span>
              </div>
              <h3 style={{ margin: '12px 0 4px', color: '#dbeaf5' }}>Junior Starter Tier</h3>
              <div style={{ fontSize: '0.74rem', color: '#799ab2', marginBottom: '10px' }}>
                Typical Allowance: <b style={{ color: '#2dd4bf' }}>₹800 – ₹1,200/mo</b>
              </div>

              <div style={{ fontSize: '0.74rem', display: 'grid', gap: '6px', color: '#8faec4' }}>
                <div>• Strict daily canteen cap (₹100–₹150/day)</div>
                <div>• Automatic 1-tap parent approvals for non-routine costs</div>
                <div>• 100% merchant category restrictions (MCC)</div>
                <div>• Milestone savings matching to build saving habits</div>
              </div>

              <div style={{ marginTop: '14px', padding: '8px 10px', background: '#071d31', borderRadius: '8px', border: '1px solid #16436c', fontSize: '0.72rem' }}>
                <div style={{ color: '#799ab2', fontWeight: 600, fontSize: '0.66rem', letterSpacing: '0.04em', marginBottom: '2px' }}>
                  COMPANION PRIVACY & SAFETY
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                  🔒 Isolated Student Companion Space
                </div>
                <div style={{ color: '#799ab2', fontSize: '0.68rem', marginTop: '3px' }}>
                  Dedicated student login with zero sibling or parent credential access
                </div>
              </div>
            </div>

            {/* Tier 2: Middle Teen */}
            <div className="child-profile-card active-preview">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🧑</span>
                <span className="badge">Ages 14–15</span>
              </div>
              <h3 style={{ margin: '12px 0 4px', color: '#dbeaf5' }}>Middle Budgeting Tier</h3>
              <div style={{ fontSize: '0.74rem', color: '#799ab2', marginBottom: '10px' }}>
                Typical Allowance: <b style={{ color: '#2dd4bf' }}>₹1,500 – ₹1,800/mo</b>
              </div>

              <div style={{ fontSize: '0.74rem', display: 'grid', gap: '6px', color: '#8faec4' }}>
                <div>• Daily commute & lunch allowances (₹250–₹350/day)</div>
                <div>• Multi-week goal tracker for hobbies & study essentials</div>
                <div>• Transparent weekly summaries sent to Parent Console</div>
                <div>• Itemized emergency top-up request loop</div>
              </div>

              <div style={{ marginTop: '14px', padding: '8px 10px', background: '#071d31', borderRadius: '8px', border: '1px solid #16436c', fontSize: '0.72rem' }}>
                <div style={{ color: '#799ab2', fontWeight: 600, fontSize: '0.66rem', letterSpacing: '0.04em', marginBottom: '2px' }}>
                  COMPANION PRIVACY & SAFETY
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                  🔒 Isolated Student Companion Space
                </div>
                <div style={{ color: '#799ab2', fontSize: '0.68rem', marginTop: '3px' }}>
                  Autonomous daily budgeting with parent-set category boundaries
                </div>
              </div>
            </div>

            {/* Tier 3: Senior Teen */}
            <div className="child-profile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🎓</span>
                <span className="badge">Ages 16–17</span>
              </div>
              <h3 style={{ margin: '12px 0 4px', color: '#dbeaf5' }}>Senior Readiness Tier</h3>
              <div style={{ fontSize: '0.74rem', color: '#799ab2', marginBottom: '10px' }}>
                Typical Allowance: <b style={{ color: '#2dd4bf' }}>₹2,000 – ₹2,500/mo</b>
              </div>

              <div style={{ fontSize: '0.74rem', display: 'grid', gap: '6px', color: '#8faec4' }}>
                <div>• Monthly lump-sum allowance pacing before college</div>
                <div>• Quick scan-to-pay QR at cafeterias & transit kiosks</div>
                <div>• Financial literacy quizzes and habit streaks</div>
                <div>• Hands-on budgeting practice before turning eighteen</div>
              </div>

              <div style={{ marginTop: '14px', padding: '8px 10px', background: '#071d31', borderRadius: '8px', border: '1px solid #16436c', fontSize: '0.72rem' }}>
                <div style={{ color: '#799ab2', fontWeight: 600, fontSize: '0.66rem', letterSpacing: '0.04em', marginBottom: '2px' }}>
                  COMPANION PRIVACY & SAFETY
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                  🔒 Isolated Student Companion Space
                </div>
                <div style={{ color: '#799ab2', fontSize: '0.68rem', marginTop: '3px' }}>
                  Real-world money pacing with zero overdraft risk
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              className="btn secondary"
              style={{ borderColor: '#2dd4bf', color: '#2dd4bf' }}
              onClick={() => onOpenLogin('parent')}
            >
              Configure Custom Child Rules in Parent Console 👩 →
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Indian Allowance Calculator */}
      <section className="section" id="calculator">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Interactive Tool</div>
              <h2 style={{ margin: '15px 0 0' }}>Indian Teen Allowance Calculator</h2>
            </div>
            <p className="intro muted">
              Wondering how much allowance is appropriate? Use our data-backed calculator calibrated for Indian metro and Tier 2 cities.
            </p>
          </div>

          <div className="calc-card">
            <div className="calc-grid">
              {/* Controls */}
              <div>
                <label className="field">
                  <span>SELECT TEEN'S AGE</span>
                  <div className="age-chips">
                    {[12, 13, 14, 15, 16, 17].map((age) => (
                      <button
                        key={age}
                        type="button"
                        className={`age-chip ${calcAge === age ? 'active' : ''}`}
                        onClick={() => setCalcAge(age)}
                      >
                        {age} Years Old
                      </button>
                    ))}
                  </div>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <label className="field">
                    <span>CITY TIER</span>
                    <select
                      value={calcCityTier}
                      onChange={(e) => setCalcCityTier(e.target.value as 'metro' | 'tier2')}
                    >
                      <option value="metro">Tier 1 Metro (BLR, BOM, DEL)</option>
                      <option value="tier2">Tier 2 City (PUN, JAI, COK)</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>SCHOOL COMMUTE</span>
                    <select
                      value={calcCommute}
                      onChange={(e) => setCalcCommute(e.target.value as 'metro_bus' | 'school_bus' | 'walk')}
                    >
                      <option value="metro_bus">Public Metro / Bus</option>
                      <option value="school_bus">School Bus Provided</option>
                      <option value="walk">Walking / Cycling</option>
                    </select>
                  </label>
                </div>

                <div style={{ marginTop: '20px', padding: '14px', background: '#051423', borderRadius: '12px', fontSize: '0.74rem', color: '#799ab2' }}>
                  💡 <b>Pacing rule of thumb:</b> In urban India, an age-appropriate baseline provides sufficient funds for lunches and transit, plus exactly enough surplus to practice choosing between spending and saving for goals.
                </div>
              </div>

              {/* Dynamic Results */}
              <div className="calc-result-box">
                <span className="eyebrow">RECOMMENDED MONTHLY BASELINE</span>
                <div className="calc-big-val">₹{baseAmount.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.74rem', color: '#799ab2', marginBottom: '16px' }}>
                  Calibrated for a {calcAge}-year-old student in {calcCityTier === 'metro' ? 'Metro cities' : 'Tier-2 cities'}.
                </div>

                <div style={{ margin: '14px 0' }}>
                  <div className="breakdown-row">
                    <span>🍔 Canteen & Healthy Snacks ({preset.foodShare}%)</span>
                    <b style={{ color: '#dbeaf5' }}>₹{foodAmt.toLocaleString('en-IN')}</b>
                  </div>
                  <div className="breakdown-row">
                    <span>🚌 Daily Transit & Metro ({preset.transitShare}%)</span>
                    <b style={{ color: '#dbeaf5' }}>₹{transitAmt.toLocaleString('en-IN')}</b>
                  </div>
                  <div className="breakdown-row">
                    <span>📚 Books, Stationery & Projects ({preset.booksShare}%)</span>
                    <b style={{ color: '#dbeaf5' }}>₹{booksAmt.toLocaleString('en-IN')}</b>
                  </div>
                  <div className="breakdown-row">
                    <span>🎯 Goal Savings Target ({preset.savingsShare}%)</span>
                    <b style={{ color: '#2dd4bf' }}>₹{savingsAmt.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                <button
                  className="btn wide-btn"
                  style={{ marginTop: '14px' }}
                  onClick={handleApplyCalcToDemo}
                >
                  Configure ₹{baseAmount.toLocaleString('en-IN')} in Parent Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Live Product Sandbox Section */}
      {/* Two Dedicated Web Experiences Section (NOT embedded dashboards on main web surface) */}
      <section className="section" id="platforms">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Two Dedicated Web Portals</div>
              <h2 style={{ margin: '15px 0 0' }}>Separate web applications for parents & teens.</h2>
            </div>
            <p className="intro muted">
              Pocket Fund never mixes supervisory controls with teen spending. Parents manage rules and approvals in the Parent Console, while students track goals and pay securely in their own Companion Space.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '30px' }}>
            {/* Card 1: Parent Command Center */}
            <div
              style={{
                background: '#071b2d',
                border: '1px solid #163e66',
                borderRadius: '16px',
                padding: '30px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#2dd4bf',
                      background: 'rgba(45, 212, 191, 0.12)',
                      border: '1px solid rgba(45, 212, 191, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <span>🛡️</span> PARENT CONSOLE
                  </span>
                  <span style={{ fontSize: '1.4rem' }}>👩</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#dbeaf5', marginBottom: '10px' }}>
                  Parent Supervisory Portal
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#82a3bc', lineHeight: 1.6, marginBottom: '20px' }}>
                  A full-screen administrative command center built for mothers and fathers to guide financial development with total transparency.
                </p>

                <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#2dd4bf', fontWeight: 800 }}>✓</span>
                    <span>1-Tap UPI approvals for itemized teen requests</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#2dd4bf', fontWeight: 800 }}>✓</span>
                    <span>Age-tiered allowances & category budgets (Food, Transit, Books)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#2dd4bf', fontWeight: 800 }}>✓</span>
                    <span>Merchant-level safety lockouts (zero gambling, alcohol, adult)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#2dd4bf', fontWeight: 800 }}>✓</span>
                    <span>Multi-child oversight with independent age-tiered rules</span>
                  </div>
                </div>

                {/* Capability Snippet Card */}
                <div
                  style={{
                    background: '#041220',
                    border: '1px solid #133352',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '0.76rem',
                    color: '#94a3b8',
                    marginBottom: '22px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#799ab2', fontWeight: 600 }}>GUARDIAN CONTROL:</span>
                    <span style={{ color: '#2dd4bf', fontWeight: 700 }}>Full Supervisory Authority</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Key Features:</span>
                    <span style={{ color: '#2dd4bf', fontWeight: 700 }}>1-Tap UPI Approvals · MCC Merchant Locks</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <button
                  className="btn"
                  style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                  onClick={() => onOpenLogin('parent')}
                >
                  Sign In to Parent Console 👩 →
                </button>
              </div>
            </div>

            {/* Card 2: Student Companion Space */}
            <div
              style={{
                background: '#071b2d',
                border: '1px solid #163e66',
                borderRadius: '16px',
                padding: '30px 26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <span>🧑</span> STUDENT COMPANION SPACE
                  </span>
                  <span style={{ fontSize: '1.4rem' }}>🧑</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#dbeaf5', marginBottom: '10px' }}>
                  Student Personal Space
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#82a3bc', lineHeight: 1.6, marginBottom: '20px' }}>
                  An isolated personal wallet for teens. No access to siblings' balances or parent banking credentials.
                </p>

                <div style={{ display: 'grid', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span>
                    <span>Prepaid UPI wallet with strict daily budget boundaries</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span>
                    <span>Quick scan-to-pay QR scanner at school cafeterias & shops</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span>
                    <span>Goal milestone tracker with visual pacing</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#c7dbe8' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span>
                    <span>Interactive daily financial quiz & habit tracking streak</span>
                  </div>
                </div>

                {/* Capability Snippet Card */}
                <div
                  style={{
                    background: '#041220',
                    border: '1px solid #133352',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '0.76rem',
                    color: '#94a3b8',
                    marginBottom: '22px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#799ab2', fontWeight: 600 }}>STUDENT WALLET:</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>Independent Personal Space</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Daily Tools:</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>Prepaid UPI · Savings Milestones</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <button
                  className="btn secondary"
                  style={{ width: '100%', textAlign: 'center', borderColor: '#38bdf8', color: '#38bdf8', justifyContent: 'center' }}
                  onClick={() => onOpenLogin('student')}
                >
                  Sign In to Student Space 🧑 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Banking Rails Section */}
      <section className="section safety" id="safety">
        <div className="wrap">
          <div className="safety-grid">
            <div className="reveal">
              <div className="eyebrow">Safety & Trust</div>
              <h2 style={{ margin: '15px 0 0' }}>Built with rigorous banking boundaries.</h2>
              <p className="intro muted">
                Financial independence for teens requires uncompromising security. Pocket Fund is architected
                with explicit parental consent at every step.
              </p>
              <div className="security-grid">
                <div className="security">
                  <div>🛡️</div>
                  <b>Parent-Authorized Companion Accounts</b>
                  <p>Teens only access what parents fund. Zero credit cards, zero overdraft, zero surprise debts.</p>
                </div>
                <div className="security">
                  <div>🔒</div>
                  <b>Licensed RBI PPI Partner Rails</b>
                  <p>All wallet funds are stored in escrow with regulated, licensed Indian scheduled commercial banks.</p>
                </div>
                <div className="security">
                  <div>👁️</div>
                  <b>Full Family Transparency</b>
                  <p>Parents and teens share synchronized views of balances and expenses, eliminating guesswork.</p>
                </div>
                <div className="security">
                  <div>🚫</div>
                  <b>Automated Merchant MCC Blocking</b>
                  <p>Strict network blocks on alcohol, betting, gaming tokens, adult venues, and crypto merchants.</p>
                </div>
              </div>
              <p className="disclaimer">
                Pocket Fund is a financial technology platform, not a bank. Payment and wallet services are
                enabled through authorized RBI-regulated partner institutions.
              </p>
            </div>
            <div className="shield-zone reveal" aria-hidden="true">
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="shield">✓</div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Stories & Testimonials */}
      <section className="section" id="stories" style={{ background: '#04101c' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Real Family Stories</div>
              <h2 style={{ margin: '15px 0 0' }}>Loved by Indian parents and teenagers.</h2>
            </div>
            <p className="intro muted">
              Discover how families transformed awkward monthly money discussions into productive habit-building conversations.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="story-card">
              <p className="story-quote">
                "Before Pocket Fund, my 16-year-old was constantly pinging me on WhatsApp for random ₹200-₹300 UPI transfers. Now, he gets his monthly allowance on the 1st and knows exactly how to pace his metro and canteen budget. The constant friction is completely gone."
              </p>
              <div className="story-author">
                <span className="story-avatar">👩</span>
                <div>
                  <b style={{ color: '#dbeaf5' }}>Sunita Mehra</b>
                  <div style={{ fontSize: '0.72rem', color: '#799ab2' }}>Mother of two (16 & 14 yrs) · Bengaluru</div>
                </div>
              </div>
            </div>

            <div className="story-card">
              <p className="story-quote">
                "Having my own student wallet makes me feel trusted. When I wanted new noise-cancelling headphones for studying, I set up a savings goal on Pocket Fund. Moving ₹100 every week and watching the progress bar fill up felt so rewarding!"
              </p>
              <div className="story-author">
                <span className="story-avatar">🧑</span>
                <div>
                  <b style={{ color: '#dbeaf5' }}>Dev Malhotra</b>
                  <div style={{ fontSize: '0.72rem', color: '#799ab2' }}>Class 11 Student · Age 16</div>
                </div>
              </div>
            </div>

            <div className="story-card">
              <p className="story-quote">
                "Managing two children with different needs was always messy. My 12-year-old daughter only needs a small stationery allowance, while my older boy needs commute money. Pocket Fund allows me to set independent limits for both from one app in 2 minutes."
              </p>
              <div className="story-author">
                <span className="story-avatar">👨</span>
                <div>
                  <b style={{ color: '#dbeaf5' }}>Rajesh Iyer</b>
                  <div style={{ fontSize: '0.72rem', color: '#799ab2' }}>Father of two (12 & 15 yrs) · Mumbai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders & Leadership Section */}
      <section className="section" id="founders" style={{ background: '#051424', borderTop: '1px solid #0e2d4a', borderBottom: '1px solid #0e2d4a' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Leadership & Purpose</div>
              <h2 style={{ margin: '15px 0 0' }}>Meet the Founders of Pocket Fund</h2>
            </div>
            <p className="intro muted">
              Built by young innovators who understand the real pressures Indian students and parents face daily. 
              Guided by a commitment to build accessible, transparent financial literacy for the next generation.
            </p>
          </div>

          {/* Master Founder Quad Showcase Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, #091f34 0%, #061524 100%)',
              border: '1px solid #1a4975',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(56, 189, 248, 0.08)',
              marginBottom: '40px',
            }}
          >
            {/* Top Bar: Verification Badge & Quick Group Import */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '5px 14px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  ★ Verified Leadership Quad
                </span>
                <span style={{ color: '#799ab2', fontSize: '0.82rem' }}>Pocket Fund Technologies Private Limited</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <a
                  href="tel:9554460651"
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  title="Call Utkarsh Yadav - Connect to Leader & Customer Support"
                >
                  <span>📞</span> Connect to Leader: +91 9554460651
                </a>
                <a
                  href="mailto:utkarshyadav752@gmail.com?subject=Pocket%20Fund%20Leadership%20Inquiry"
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  title="Direct email link to founders"
                >
                  <span>✉️</span> Email Leadership Team
                </a>
              </div>
            </div>

            {/* Inspiring Motto: Dr. A.P.J. Abdul Kalam Studio Plaque */}
            <div
              style={{
                background: 'linear-gradient(135deg, #072037 0%, #0a2d4c 100%)',
                borderLeft: '4px solid #f59e0b',
                borderRadius: '0 12px 12px 0',
                padding: '14px 20px',
                marginBottom: '24px',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.2rem' }}>🎓</span>
                <div>
                  <p style={{ fontSize: '0.84rem', color: '#e2e8f0', fontStyle: 'italic', margin: '0 0 3px', lineHeight: 1.5 }}>
                    "A dream is not that which you see while sleeping, it is something that does not let you sleep."
                  </p>
                  <div style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 700 }}>
                    — Dr. A.P.J. Abdul Kalam <span style={{ color: '#799ab2', fontWeight: 400 }}>· Guiding motto in our Lucknow founders' lab</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Founding Team Executive Showcase Banner */}
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1.5px solid #1c5284',
                marginBottom: '28px',
                background: 'linear-gradient(135deg, #05192d 0%, #092846 50%, #05192d 100%)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                padding: '24px 28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      Executive Quad
                    </span>
                    <span style={{ color: '#93c5fd', fontSize: '0.78rem' }}>Lucknow Innovation Lab</span>
                  </div>
                  <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700 }}>
                    Pocket Fund Co-Founding Leadership Team
                  </h3>
                  <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '3px' }}>
                    Executive team guiding product architecture, youth financial literacy, bank-grade rails, and school pilot programs.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href="tel:9554460651"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    title="Connect to Leader: Utkarsh Yadav"
                  >
                    <span>📞</span> Connect to Leader: +91 9554460651
                  </a>
                  <a
                    href="mailto:utkarshyadav752@gmail.com?subject=Pocket%20Fund%20Founders%20Desk"
                    style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>✉️</span> Founders Email Desk
                  </a>
                </div>
              </div>

              {/* 4 Connected Avatars Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  background: '#040d16',
                  border: '1px solid #13395c',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                {/* Utkarsh */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)',
                      border: '2px solid #38bdf8',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    UY
                  </div>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>Utkarsh Yadav</div>
                    <div style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600 }}>Lead Founder &amp; Architect</div>
                  </div>
                </div>

                {/* Madhulika */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d9488 0%, #134e4a 100%)',
                      border: '2px solid #2dd4bf',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    MM
                  </div>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>Madhulika Maurya</div>
                    <div style={{ color: '#2dd4bf', fontSize: '0.72rem', fontWeight: 600 }}>Co-Founder &amp; Curriculum</div>
                  </div>
                </div>

                {/* Sejal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e11d48 0%, #881337 100%)',
                      border: '2px solid #f43f5e',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    SS
                  </div>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>Sejal Sahu</div>
                    <div style={{ color: '#f43f5e', fontSize: '0.72rem', fontWeight: 600 }}>Co-Founder &amp; Security</div>
                  </div>
                </div>

                {/* Shameen */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #9333ea 0%, #581c87 100%)',
                      border: '2px solid #c084fc',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    SK
                  </div>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.85rem' }}>Shameen Khan</div>
                    <div style={{ color: '#c084fc', fontSize: '0.72rem', fontWeight: 600 }}>Co-Founder &amp; Community</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Co-Founders Row Layout - Arranged in One Single Line */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                  🤝 Leadership Quad Profiles (All 4 Co-Founders)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.72rem' }}>
                <span>✉️ Direct executive email channels — all 4 co-founders respond via email</span>
              </div>
            </div>

            {/* The 4 Founders Arranged in ONE Single Horizontal Line */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))',
                gap: '18px',
                overflowX: 'auto',
                paddingBottom: '16px',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              
              {/* Founder 1: Utkarsh Yadav (Founder & Lead Architect) */}
              <div
                style={{
                  background: '#071d31',
                  border: '1.5px solid #1c5284',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '260px',
                }}
              >
                {/* Avatar Display */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px 20px',
                    background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.12) 0%, rgba(4, 13, 22, 0.6) 100%)',
                    borderRadius: '12px',
                    border: '1.5px solid #1c5284',
                    marginBottom: '14px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(2, 132, 199, 0.9)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Lead Founder
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '0.68rem',
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.15)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    💻 Systems
                  </span>

                  {/* Circular Avatar */}
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #082f49 100%)',
                      border: '3px solid #38bdf8',
                      boxShadow: '0 0 24px rgba(56, 189, 248, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      marginTop: '8px',
                      marginBottom: '8px',
                      position: 'relative',
                      userSelect: 'none',
                    }}
                  >
                    UY
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: '#071d31',
                        border: '2px solid #38bdf8',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        color: '#fbbf24',
                      }}
                      title="Verified Lead Founder"
                    >
                      ★
                    </span>
                  </div>

                  <div style={{ color: '#93c5fd', fontSize: '0.72rem', fontWeight: 600 }}>
                    Executive Leadership Avatar
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>Utkarsh Yadav</h3>
                    <span style={{ fontSize: '0.66rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 7px', borderRadius: '5px', fontWeight: 700 }}>
                      Product &amp; Systems
                    </span>
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
                    Founder &amp; Chief Architect
                  </div>
                  <p style={{ fontSize: '0.77rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px', flex: 1 }}>
                    Directs product architecture, multi-child parental controls, and RBI-partner payment frameworks.
                  </p>

                  {/* Contact Info - Customer Support & Connect to Leader */}
                  <div style={{ borderTop: '1px solid #13395c', paddingTop: '12px', fontSize: '0.74rem', display: 'grid', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#799ab2', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                        Customer Support &amp; Connect to Leader
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📞</span>
                        <a href="tel:9554460651" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>
                          +91 9554460651
                        </a>
                        <span style={{ fontSize: '0.66rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Active
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#799ab2', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                        Executive Email
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
                        <span>✉️</span>
                        <a href="mailto:utkarshyadav752@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
                          utkarshyadav752@gmail.com
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                      <a
                        href="tel:9554460651"
                        style={{
                          flex: 1,
                          minWidth: '105px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        📞 Call Leader
                      </a>
                      <a
                        href="mailto:utkarshyadav752@gmail.com?subject=Pocket%20Fund%20Product%20Inquiry"
                        style={{
                          flex: 1,
                          minWidth: '85px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        ✉️ Email
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('9554460651');
                          showToast('Copied +91 9554460651 to clipboard');
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                        title="Copy phone number"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder 2: Madhulika Maurya (Co-Founder & Curriculum Lead) */}
              <div
                style={{
                  background: '#071d31',
                  border: '1.5px solid #154167',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '260px',
                }}
              >
                {/* Avatar Display */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px 20px',
                    background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.12) 0%, rgba(4, 13, 22, 0.6) 100%)',
                    borderRadius: '12px',
                    border: '1.5px solid #134e4a',
                    marginBottom: '14px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(15, 118, 110, 0.9)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Co-Founder
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '0.68rem',
                      color: '#2dd4bf',
                      background: 'rgba(45, 212, 191, 0.15)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    📚 Curriculum
                  </span>

                  {/* Circular Avatar */}
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #042f2e 100%)',
                      border: '3px solid #2dd4bf',
                      boxShadow: '0 0 24px rgba(45, 212, 191, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      marginTop: '8px',
                      marginBottom: '8px',
                      position: 'relative',
                      userSelect: 'none',
                    }}
                  >
                    MM
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: '#071d31',
                        border: '2px solid #2dd4bf',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        color: '#2dd4bf',
                      }}
                      title="Verified Co-Founder"
                    >
                      ★
                    </span>
                  </div>

                  <div style={{ color: '#99f6e4', fontSize: '0.72rem', fontWeight: 600 }}>
                    Executive Leadership Avatar
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>Madhulika Maurya</h3>
                    <span style={{ fontSize: '0.66rem', color: '#2dd4bf', background: 'rgba(45, 212, 191, 0.15)', padding: '2px 7px', borderRadius: '5px', fontWeight: 700 }}>
                      Curriculum Lead
                    </span>
                  </div>
                  <div style={{ color: '#2dd4bf', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
                    Financial Habits &amp; Education
                  </div>
                  <p style={{ fontSize: '0.77rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px', flex: 1 }}>
                    Designs micro-learning modules, gamified savings targets, and interactive teen budgeting challenges.
                  </p>

                  {/* Contact Info - Email Only */}
                  <div style={{ borderTop: '1px solid #13395c', paddingTop: '12px', fontSize: '0.74rem', display: 'grid', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#799ab2', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                        Executive Email
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
                        <span>✉️</span>
                        <a href="mailto:madhulikamaurya9@gmail.com" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 600 }}>
                          madhulikamaurya9@gmail.com
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <a
                        href="mailto:madhulikamaurya9@gmail.com?subject=Pocket%20Fund%20Curriculum%20Inquiry"
                        style={{
                          flex: 1,
                          background: 'rgba(45, 212, 191, 0.15)',
                          color: '#2dd4bf',
                          border: '1px solid rgba(45, 212, 191, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        ✉️ Email Madhulika
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('madhulikamaurya9@gmail.com');
                          showToast('Copied madhulikamaurya9@gmail.com to clipboard');
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                        title="Copy email address"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder 3: Sejal Sahu (Co-Founder & Platform Security Lead) */}
              <div
                style={{
                  background: '#071d31',
                  border: '1.5px solid #154167',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '260px',
                }}
              >
                {/* Avatar Display */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px 20px',
                    background: 'radial-gradient(circle at center, rgba(244, 63, 94, 0.12) 0%, rgba(4, 13, 22, 0.6) 100%)',
                    borderRadius: '12px',
                    border: '1.5px solid #881337',
                    marginBottom: '14px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(190, 18, 60, 0.9)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Co-Founder
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '0.68rem',
                      color: '#f43f5e',
                      background: 'rgba(244, 63, 94, 0.15)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    🛡️ Security
                  </span>

                  {/* Circular Avatar */}
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e11d48 0%, #be123c 60%, #4c0519 100%)',
                      border: '3px solid #f43f5e',
                      boxShadow: '0 0 24px rgba(244, 63, 94, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      marginTop: '8px',
                      marginBottom: '8px',
                      position: 'relative',
                      userSelect: 'none',
                    }}
                  >
                    SS
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: '#071d31',
                        border: '2px solid #f43f5e',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        color: '#f43f5e',
                      }}
                      title="Verified Co-Founder"
                    >
                      ★
                    </span>
                  </div>

                  <div style={{ color: '#fecdd3', fontSize: '0.72rem', fontWeight: 600 }}>
                    Executive Leadership Avatar
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>Sejal Sahu</h3>
                    <span style={{ fontSize: '0.66rem', color: '#f43f5e', background: 'rgba(244, 63, 94, 0.15)', padding: '2px 7px', borderRadius: '5px', fontWeight: 700 }}>
                      Security Lead
                    </span>
                  </div>
                  <div style={{ color: '#f43f5e', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
                    Platform Rails &amp; Infrastructure
                  </div>
                  <p style={{ fontSize: '0.77rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px', flex: 1 }}>
                    Oversees automated merchant category code blocking (MCC), instant top-up loops, and session isolation.
                  </p>

                  {/* Contact Info - Email Only */}
                  <div style={{ borderTop: '1px solid #13395c', paddingTop: '12px', fontSize: '0.74rem', display: 'grid', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#799ab2', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                        Executive Email
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
                        <span>✉️</span>
                        <a href="mailto:sejalsahu0106@gmail.com" style={{ color: '#f43f5e', textDecoration: 'none', fontWeight: 600 }}>
                          sejalsahu0106@gmail.com
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <a
                        href="mailto:sejalsahu0106@gmail.com?subject=Pocket%20Fund%20Security%20Inquiry"
                        style={{
                          flex: 1,
                          background: 'rgba(244, 63, 94, 0.15)',
                          color: '#f43f5e',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        ✉️ Email Sejal
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('sejalsahu0106@gmail.com');
                          showToast('Copied sejalsahu0106@gmail.com to clipboard');
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                        title="Copy email address"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder 4: Shameen Khan (Co-Founder & Family Success Lead) */}
              <div
                style={{
                  background: '#071d31',
                  border: '1.5px solid #154167',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '260px',
                }}
              >
                {/* Avatar Display */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px 20px',
                    background: 'radial-gradient(circle at center, rgba(192, 132, 252, 0.12) 0%, rgba(4, 13, 22, 0.6) 100%)',
                    borderRadius: '12px',
                    border: '1.5px solid #581c87',
                    marginBottom: '14px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(126, 34, 206, 0.9)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Co-Founder
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '0.68rem',
                      color: '#c084fc',
                      background: 'rgba(192, 132, 252, 0.15)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    🤝 Community
                  </span>

                  {/* Circular Avatar */}
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 60%, #3b0764 100%)',
                      border: '3px solid #c084fc',
                      boxShadow: '0 0 24px rgba(192, 132, 252, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      marginTop: '8px',
                      marginBottom: '8px',
                      position: 'relative',
                      userSelect: 'none',
                    }}
                  >
                    SK
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: '#071d31',
                        border: '2px solid #c084fc',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        color: '#c084fc',
                      }}
                      title="Verified Co-Founder"
                    >
                      ★
                    </span>
                  </div>

                  <div style={{ color: '#e9d5ff', fontSize: '0.72rem', fontWeight: 600 }}>
                    Executive Leadership Avatar
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>Shameen Khan</h3>
                    <span style={{ fontSize: '0.66rem', color: '#c084fc', background: 'rgba(192, 132, 252, 0.15)', padding: '2px 7px', borderRadius: '5px', fontWeight: 700 }}>
                      Community Lead
                    </span>
                  </div>
                  <div style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
                    Family Success &amp; School Pilots
                  </div>
                  <p style={{ fontSize: '0.77rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px', flex: 1 }}>
                    Directed closed-beta validation and institutional pilot programs across diverse Indian school ecosystems, leading cohort-based UAT (User Acceptance Testing) and qualitative focus groups to optimize onboarding and user retention.
                  </p>

                  {/* Contact Info - Email Only */}
                  <div style={{ borderTop: '1px solid #13395c', paddingTop: '12px', fontSize: '0.74rem', display: 'grid', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#799ab2', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                        Executive Email
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', wordBreak: 'break-all' }}>
                        <span>✉️</span>
                        <a href="mailto:shameenkhan964@gmail.com" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 600 }}>
                          shameenkhan964@gmail.com
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <a
                        href="mailto:shameenkhan964@gmail.com?subject=Pocket%20Fund%20Community%20Inquiry"
                        style={{
                          flex: 1,
                          background: 'rgba(192, 132, 252, 0.15)',
                          color: '#c084fc',
                          border: '1px solid rgba(192, 132, 252, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          textAlign: 'center',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        ✉️ Email Shameen
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('shameenkhan964@gmail.com');
                          showToast('Copied shameenkhan964@gmail.com to clipboard');
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                        title="Copy email address"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>



          {/* Dedicated Customer Care & Email Desk Action Card */}
          <div
            style={{
              background: 'linear-gradient(90deg, #072642 0%, #0a355c 50%, #072642 100%)',
              border: '1px solid #205c93',
              borderRadius: '16px',
              padding: '24px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>🛡️</span> Customer Care &amp; Connect to Leader Desk
              </div>
              <h3 style={{ margin: '6px 0 4px', color: '#f8fafc', fontSize: '1.25rem' }}>
                Have questions about Pocket Fund? We are here to help.
              </h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
                Call our direct customer support helpline or speak with founder Utkarsh Yadav for pilot inquiries and family assistance.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="tel:9554460651"
                className="btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#10b981', borderColor: '#10b981', color: '#ffffff' }}
              >
                <span>📞</span> Call Support: 9554460651
              </a>
              <a
                href="mailto:utkarshyadav752@gmail.com"
                className="btn secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderColor: '#38bdf8', color: '#38bdf8' }}
              >
                <span>✉️</span> Email utkarshyadav752@gmail.com
              </a>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  navigator.clipboard.writeText('9554460651');
                  showToast('Copied +91 9554460651 to clipboard');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', borderColor: '#64748b', color: '#cbd5e1' }}
              >
                <span>📋</span> Copy Number
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Pilot Plans Section */}
      <section className="section" id="pricing">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Transparent Pricing</div>
              <h2 style={{ margin: '15px 0 0' }}>Simple plans for every family.</h2>
            </div>
            <p className="intro muted">
              Join our family pilot today and receive lifetime grandfathered access to our core platform.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Free Beta Pilot Tier */}
            <div className="pricing-card featured">
              <span className="pricing-badge">PILOT BETA · 100% FREE</span>
              <h3 style={{ margin: 0, color: '#dbeaf5' }}>Family Pilot Tier</h3>
              <p style={{ fontSize: '0.78rem', color: '#799ab2', marginTop: '6px' }}>
                Full parent console with multi-child companion accounts during our beta testing period.
              </p>
              <div className="pricing-price">
                ₹0 <span>/ month for pilot families</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Up to 4 child companion accounts</li>
                <li><span className="check">✓</span> Automated allowance scheduling</li>
                <li><span className="check">✓</span> Category limits (Food, Transit, Stationery)</li>
                <li><span className="check">✓</span> Instant UPI approval top-up loop</li>
                <li><span className="check">✓</span> Pocket Fund AI money habits advisor</li>
                <li><span className="check">✓</span> Downloadable family monthly statements</li>
              </ul>
              <button className="btn wide-btn" onClick={onOpenPilot}>
                Apply for Free Pilot
              </button>
            </div>

            {/* Family Pro Tier */}
            <div className="pricing-card">
              <h3 style={{ margin: 0, color: '#dbeaf5' }}>Family Pro (Coming Soon)</h3>
              <p style={{ fontSize: '0.78rem', color: '#799ab2', marginTop: '6px' }}>
                Advanced features including physical RuPay companion cards and family chore rewards.
              </p>
              <div className="pricing-price">
                ₹199 <span>/ month per family</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Everything in Family Pilot</li>
                <li><span className="check">✓</span> Physical contactless RuPay student cards</li>
                <li><span className="check">✓</span> Instant card freeze / unfreeze from parent phone</li>
                <li><span className="check">✓</span> Chore & milestone earning frameworks</li>
                <li><span className="check">✓</span> Parent savings matching bonus</li>
                <li><span className="check">✓</span> Priority 24/7 family concierge support</li>
              </ul>
              <button className="btn secondary wide-btn" onClick={onOpenPilot}>
                Join Pro Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Got Questions?</div>
              <h2 style={{ margin: '15px 0 0' }}>Frequently Asked Questions</h2>
            </div>
            <p className="intro muted">
              Everything parents want to know about safety, UPI, and managing student wallets.
            </p>
          </div>

          <div className="faq-grid">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="faq-card">
                  <button
                    className="faq-trigger"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="arrow" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </span>
                  </button>
                  {isOpen && <div className="faq-body">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="section cta">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Start Today</div>
          <h2>Ready to give your teens a lifelong head start?</h2>
          <p>
            Join our closed pilot today and help shape the way the next generation learns to manage money.
          </p>
          <div className="actions">
            <button className="btn" onClick={onOpenPilot}>
              Join the Family Pilot
            </button>
            <button
              className="btn secondary"
              onClick={() => scrollToSection('demo')}
            >
              Test Interactive Demo ↗
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive Website Footer */}
      <footer className="footer">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', paddingBottom: '30px', borderBottom: '1px solid #163a5a' }}>
            <div>
              <span className="brand">
                <span className="logo">₹</span>Pocket Fund
              </span>
              <p style={{ fontSize: '0.78rem', color: '#799ab2', marginTop: '10px', lineHeight: 1.6 }}>
                The parent-guided allowance platform and companion student wallet. Building confident money habits before eighteen.
              </p>
            </div>

            <div>
              <b style={{ color: '#dbeaf5', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product</b>
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px', fontSize: '0.8rem' }}>
                <a href="#how" onClick={(e) => { e.preventDefault(); scrollToSection('how'); }}>The 3 Pillars Method</a>
                <a href="#multi-child" onClick={(e) => { e.preventDefault(); scrollToSection('multi-child'); }}>Multi-Child Console</a>
                <a href="#calculator" onClick={(e) => { e.preventDefault(); scrollToSection('calculator'); }}>Allowance Calculator</a>
                <a href="#demo" onClick={(e) => { e.preventDefault(); scrollToSection('demo'); }}>Interactive Live Sandbox</a>
              </div>
            </div>

            <div>
              <b style={{ color: '#dbeaf5', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Safety & Trust</b>
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px', fontSize: '0.8rem' }}>
                <a href="#safety" onClick={(e) => { e.preventDefault(); scrollToSection('safety'); }}>RBI PPI Partner Rails</a>
                <a href="#safety" onClick={(e) => { e.preventDefault(); scrollToSection('safety'); }}>Merchant Category Blocks</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>Parental Consent Loop</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Zero Overdraft Guarantee</a>
              </div>
            </div>

            <div>
              <b style={{ color: '#dbeaf5', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company & Pilot</b>
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px', fontSize: '0.8rem' }}>
                <a href="#pilot" onClick={(e) => { e.preventDefault(); onOpenPilot(); }}>Join Beta Pilot</a>
                <a href="#founders" onClick={(e) => { e.preventDefault(); scrollToSection('founders'); }}>Meet the Founders</a>
                <a href="#stories" onClick={(e) => { e.preventDefault(); scrollToSection('stories'); }}>Family Testimonials</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>Common Questions</a>
                <button
                  onClick={onOpenSiteAi}
                  style={{ background: 'none', border: 'none', color: '#2dd4bf', padding: 0, textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
                >
                  ✦ Pocket Fund AI Advisor
                </button>
              </div>
            </div>

            <div>
              <b style={{ color: '#dbeaf5', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer Care Desk</b>
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px', fontSize: '0.8rem' }}>
                <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📞</span>
                  <span style={{ color: '#799ab2', fontSize: '0.74rem' }}>Helpline &amp; Leader:</span>
                  <a href="tel:9554460651" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 700 }}>+91 9554460651</a>
                </div>
                <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✉️</span>
                  <a href="mailto:utkarshyadav752@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', wordBreak: 'break-all', fontWeight: 600 }}>utkarshyadav752@gmail.com</a>
                </div>
                <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✉️</span>
                  <a href="mailto:madhulikamaurya9@gmail.com" style={{ color: '#2dd4bf', textDecoration: 'none', wordBreak: 'break-all' }}>madhulikamaurya9@gmail.com</a>
                </div>
                <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✉️</span>
                  <a href="mailto:sejalsahu0106@gmail.com" style={{ color: '#f43f5e', textDecoration: 'none', wordBreak: 'break-all' }}>sejalsahu0106@gmail.com</a>
                </div>
                <div style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✉️</span>
                  <a href="mailto:shameenkhan964@gmail.com" style={{ color: '#c084fc', textDecoration: 'none', wordBreak: 'break-all' }}>shameenkhan964@gmail.com</a>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '4px' }}>
                  Support: Mon–Sun (8:00 AM – 10:00 PM IST)
                </div>
              </div>
            </div>
          </div>

          <div className="footer-row" style={{ marginTop: '20px' }}>
            <span style={{ fontSize: '0.74rem', color: '#6888a0' }}>
              © 2026 Pocket Fund Technologies Private Limited. All rights reserved. Registered under Indian Companies Act.
            </span>
            <span style={{ fontSize: '0.74rem', color: '#6888a0' }}>
              Financial and payment services provided through authorized RBI-regulated banking partners.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
