import React, { useState } from 'react';
import { AppState, RequestItem, ChildAccount } from '../types';
import { generateAIResponse } from '../aiEngine';

interface ParentDashboardProps {
  state: AppState;
  activeChild: ChildAccount;
  onSelectChild: (childId: string) => void;
  onOpenAddChild: () => void;
  onOpenAction: (type: 'allowance' | 'request' | 'expense' | 'rule' | 'goal' | 'edit', childId?: string) => void;
  onPayRequest: (req: RequestItem) => void;
  onDeclineRequest: (id: string) => void;
  onSignOut: () => void;
  onResetDemo: () => void;
  showToast: (msg: string) => void;
}

const QUOTES = [
  ['A budget is telling your money where to go instead of wondering where it went.', '— John C. Maxwell'],
  ['Do not save what is left after spending; spend what is left after saving.', '— Warren Buffett'],
  ['Small daily improvements are the key to staggering long-term results.', '— Unknown'],
  ['Financial freedom is available to those who learn about it and work for it.', '— Robert Kiyosaki'],
  ['The habit of saving is itself an education; it fosters every virtue.', '— T. T. Munger']
];

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  state,
  activeChild,
  onSelectChild,
  onOpenAddChild,
  onOpenAction,
  onPayRequest,
  onDeclineRequest,
  onSignOut,
  onResetDemo,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'insights' | 'family' | 'settings'>('overview');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [requestFilter, setRequestFilter] = useState<'all' | string>('all');
  const [aiResult, setAiResult] = useState(
    `${activeChild.name} has saved consistently. Consider moving ₹100 from food to their primary savings goal this week.`
  );
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  const [toggles, setToggles] = useState({
    purpose: true,
    alert: true,
    weekend: false,
    alerts: true,
    twoFa: true,
    report: true,
    challenge: false,
  });

  const handleToggle = (key: keyof typeof toggles, label: string) => {
    setToggles((prev) => {
      const next = !prev[key];
      showToast(`${label} ${next ? 'enabled' : 'disabled'}.`);
      return { ...prev, [key]: next };
    });
  };

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handleAskAi = (questionText?: string) => {
    const q = questionText || aiQuestion;
    if (!q.trim()) return;
    setAiTyping(true);
    setTimeout(() => {
      const resp = generateAIResponse('parent', q, activeChild, state.children);
      setAiResult(resp);
      setAiTyping(false);
      setAiQuestion('');
      showToast(`AI coaching advice ready for ${activeChild.name}.`);
    }, 280);
  };

  // Collect all requests from all children
  const allRequests = state.children.flatMap((c) => c.requests);
  const displayedRequests =
    requestFilter === 'all'
      ? allRequests
      : allRequests.filter((r) => r.childId === requestFilter);

  // Active child metrics
  const spentPercent = Math.min(100, Math.round((activeChild.spent / activeChild.allowance) * 100));
  const primaryGoal = activeChild.goals[0] || { name: 'Savings Goal', icon: '🎯', current: activeChild.saved, target: 1000 };
  const goalPercent = Math.min(100, Math.round((primaryGoal.current / primaryGoal.target) * 100));

  // Category limits for active child
  const foodPercent = Math.min(100, Math.round((activeChild.foodSpent / activeChild.foodLimit) * 100));
  const transportPercent = Math.min(100, Math.round((activeChild.transportSpent / activeChild.transportLimit) * 100));

  const handleDownloadReport = () => {
    const childrenSummaries = state.children
      .map(
        (c) => `
• Child Name        : ${c.name} (Age ${c.age})
• Monthly Allowance : ₹${c.allowance.toLocaleString('en-IN')}
• Total Spent       : ₹${c.spent.toLocaleString('en-IN')} (${Math.round((c.spent / c.allowance) * 100)}%)
• Total Saved       : ₹${c.saved.toLocaleString('en-IN')}
• Available Balance : ₹${c.balance.toLocaleString('en-IN')}
• Habit Streak      : ${c.streakDays} days
• Main Goal         : ${c.goals[0]?.name || 'Savings'} (₹${c.goals[0]?.current || c.saved} / ₹${c.goals[0]?.target || 1000})
`
      )
      .join('-----------------------------------------------------');

    const content = `=====================================================
POCKET FUND — MULTI-CHILD FAMILY REPORT (SEPTEMBER 2026)
Parent / Guardian: Priya Sharma
Total Children   : ${state.children.length}
=====================================================

1. CHILDREN ACCOUNT SUMMARIES
-----------------------------------------------------
${childrenSummaries}
=====================================================

2. AI FAMILY COACH OBSERVATION
-----------------------------------------------------
${aiResult}

=====================================================
Pocket Fund — Money skills start here.
Parent-authorized companion profiles enabled through authorised partners.
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pocket-fund-family-report-${activeChild.name.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`Full family report downloaded for ${state.children.length} children.`);
  };

  return (
    <main id="parent-demo-app" className="demo-app" aria-label="Pocket Fund parent dashboard demo">
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="app-side">
          <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); onSignOut(); }}>
            <span className="logo">₹</span>Pocket Fund
          </a>

          <nav className="app-nav">
            <button
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              <span>▦</span>Overview
            </button>
            <button
              className={activeTab === 'requests' ? 'active' : ''}
              onClick={() => setActiveTab('requests')}
            >
              <span>📩</span>Requests ({allRequests.length})
            </button>
            <button
              className={activeTab === 'insights' ? 'active' : ''}
              onClick={() => setActiveTab('insights')}
            >
              <span>💡</span>Insights & AI
            </button>
            <button
              className={activeTab === 'family' ? 'active' : ''}
              onClick={() => setActiveTab('family')}
            >
              <span>👥</span>Family profile ({state.children.length})
            </button>
            <button
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <span>⚙️</span>Settings
            </button>
          </nav>

          <div className="app-user">
            <b>Priya Sharma</b>
            <span className="muted">Parent · Guardian</span>
            <div style={{ marginTop: '8px', fontSize: '0.68rem', color: '#799ab2' }}>
              {state.children.length} Children enrolled
            </div>
            <button
              onClick={onSignOut}
              className="btn small secondary"
              style={{
                width: '100%',
                marginTop: '10px',
                fontSize: '0.7rem',
                padding: '6px',
              }}
            >
              Back to Website Top ↑
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <section className="app-main">
          {/* Top Bar with Child Switching & Profile */}
          <header className="app-top">
            <div>
              <div className="eyebrow">PARENT COMMAND CENTER</div>
              <h1>Family Dashboard</h1>
              <p>Guiding financial habits with real-time guardrails and collaborative goal pacing.</p>
            </div>
            <div className="app-profile">
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#2dd4bf',
                  background: 'rgba(45, 212, 191, 0.1)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span>🛡️</span> PARENT CONSOLE
              </span>
              <div className="app-avatar" title="Priya Sharma (Parent)">👩</div>
            </div>
          </header>

          {/* Child Selector Tabs Bar */}
          <div className="child-selector-bar">
            <span style={{ fontSize: '0.72rem', color: '#799ab2', fontWeight: 700, marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Child:
            </span>
            {state.children.map((c) => (
              <button
                key={c.id}
                className={`child-pill ${c.id === activeChild.id ? 'active' : ''}`}
                onClick={() => {
                  onSelectChild(c.id);
                  showToast(`Switched view to ${c.name} (${c.age} yrs).`);
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{c.avatar}</span>
                <span>{c.name}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({c.age}y)</span>
              </button>
            ))}
            <button className="add-child-btn" onClick={onOpenAddChild} title="Enroll another child profile">
              + Add Child
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="app-view active">
              <div className="app-grid">
                {/* Left Column */}
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Active Child Metric Row */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ margin: 0 }}>
                        {activeChild.avatar} {activeChild.name}’s Monthly Allowance
                      </h3>
                      <button
                        className="btn small secondary"
                        style={{ fontSize: '0.68rem', padding: '5px 9px' }}
                        onClick={() => onOpenAction('allowance', activeChild.id)}
                      >
                        Adjust ₹
                      </button>
                    </div>

                    <div className="metric-row">
                      <div className="metric">
                        <small>ALLOWANCE</small>
                        <b>₹{activeChild.allowance.toLocaleString('en-IN')}</b>
                        <span className="up">Fixed monthly</span>
                      </div>
                      <div className="metric">
                        <small>SPENT ({spentPercent}%)</small>
                        <b>₹{activeChild.spent.toLocaleString('en-IN')}</b>
                        <span className="muted">₹{activeChild.balance.toLocaleString('en-IN')} left</span>
                      </div>
                      <div className="metric">
                        <small>SAVED</small>
                        <b>₹{activeChild.saved.toLocaleString('en-IN')}</b>
                        <span className="up">{activeChild.streakDays}d streak</span>
                      </div>
                    </div>
                  </section>

                  {/* Rotatable Daily Financial Wisdom */}
                  <section className="app-card quote-card">
                    <span className="tag">DAILY MONEY NOTE</span>
                    <blockquote>"{QUOTES[quoteIndex][0]}"</blockquote>
                    <footer>{QUOTES[quoteIndex][1]}</footer>
                    <button className="refresh-quote" onClick={handleNextQuote} style={{ marginTop: '12px' }}>
                      Next reflection ↻
                    </button>
                  </section>

                  {/* Spending & Budget Rules for active child */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>Category Rules for {activeChild.name}</h3>
                      <span className="tag">ACTIVE GUARDRAILS</span>
                    </div>

                    {/* Food & Dining */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                        <span>🍔 Food & snacks</span>
                        <b style={{ color: '#dbeaf5' }}>
                          ₹{activeChild.foodSpent} / ₹{activeChild.foodLimit} ({foodPercent}%)
                        </b>
                      </div>
                      <div className="budgetbar">
                        <i style={{ width: `${foodPercent}%`, background: foodPercent > 80 ? '#f59e0b' : '#2dd4bf' }} />
                      </div>
                    </div>

                    {/* Transport / Study */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                        <span>🚌 Transport & school</span>
                        <b style={{ color: '#dbeaf5' }}>
                          ₹{activeChild.transportSpent} / ₹{activeChild.transportLimit} ({transportPercent}%)
                        </b>
                      </div>
                      <div className="budgetbar">
                        <i style={{ width: `${transportPercent}%`, background: transportPercent > 80 ? '#f59e0b' : '#38bdf8' }} />
                      </div>
                    </div>

                    {/* Dynamic Extra Budgets */}
                    {activeChild.budgets.map((b) => {
                      const bPct = Math.min(100, Math.round((b.spent / b.limit) * 100));
                      return (
                        <div key={b.id} style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                            <span>{b.icon || '🏷️'} {b.name}</span>
                            <b style={{ color: '#dbeaf5' }}>₹{b.spent} / ₹{b.limit} ({bPct}%)</b>
                          </div>
                          <div className="budgetbar">
                            <i style={{ width: `${bPct}%`, background: '#a78bfa' }} />
                          </div>
                        </div>
                      );
                    })}

                    <button className="add-rule" onClick={() => onOpenAction('rule', activeChild.id)}>
                      + Add a spending rule for {activeChild.name}
                    </button>
                  </section>
                </div>

                {/* Right Column */}
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Pending Allowance Requests */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0 }}>Pending Requests</h3>
                      <span className="tag" style={{ color: allRequests.length > 0 ? '#f59e0b' : '#2dd4bf' }}>
                        {allRequests.length} PENDING
                      </span>
                    </div>

                    <div className="request-list">
                      {allRequests.length === 0 ? (
                        <div className="empty-state">No pending requests right now. All caught up!</div>
                      ) : (
                        allRequests.map((req) => (
                          <div key={req.id} className="request-item">
                            <div className="request-icon">{req.icon}</div>
                            <div>
                              <b>{req.title}</b>
                              <small>
                                <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{req.who}</span> · ₹{req.amount} · {req.desc}
                              </small>
                            </div>
                            <div className="app-actions">
                              <button
                                className="approve-demo"
                                onClick={() => onPayRequest(req)}
                                title="Approve and fund via UPI"
                              >
                                Approve UPI
                              </button>
                              <button
                                className="decline-demo"
                                onClick={() => onDeclineRequest(req.id)}
                                title="Decline request"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Active Child Savings Goal */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>{activeChild.name}’s Savings Goal</h3>
                      <button
                        className="btn small secondary"
                        style={{ fontSize: '0.65rem', padding: '4px 8px' }}
                        onClick={() => onOpenAction('goal', activeChild.id)}
                      >
                        + New Goal
                      </button>
                    </div>

                    <div style={{ marginTop: '14px', padding: '14px', background: '#0b233a', border: '1px solid #173b5d', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.4rem' }}>{primaryGoal.icon}</span>
                          <div>
                            <b style={{ color: '#dbeaf5', fontSize: '0.85rem' }}>{primaryGoal.name}</b>
                            <div style={{ fontSize: '0.68rem', color: '#7e9db3' }}>
                              ₹{primaryGoal.current.toLocaleString('en-IN')} of ₹{primaryGoal.target.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                        <span className="tag" style={{ color: '#2dd4bf' }}>{goalPercent}%</span>
                      </div>
                      <div className="budgetbar" style={{ marginTop: '10px' }}>
                        <i style={{ width: `${goalPercent}%`, background: '#2dd4bf' }} />
                      </div>
                    </div>
                  </section>

                  {/* AI Quick Insight Box */}
                  <section className="app-card ai-card">
                    <span className="tag" style={{ color: '#2dd4bf' }}>✦ POCKET FUND AI COACH</span>
                    <p style={{ marginTop: '6px' }}>{aiResult}</p>
                    <button
                      className="btn small secondary"
                      style={{ marginTop: '10px', fontSize: '0.7rem' }}
                      onClick={() => setActiveTab('insights')}
                    >
                      Open Full AI Coach →
                    </button>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Requests */}
          {activeTab === 'requests' && (
            <div className="app-view active">
              <div className="app-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Allowance & Expense Requests</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#799ab2' }}>
                      Review purchases requiring parent review and release funds with UPI.
                    </p>
                  </div>

                  {/* Filter by child */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className={`btn small ${requestFilter === 'all' ? '' : 'secondary'}`}
                      onClick={() => setRequestFilter('all')}
                    >
                      All Children ({allRequests.length})
                    </button>
                    {state.children.map((c) => (
                      <button
                        key={c.id}
                        className={`btn small ${requestFilter === c.id ? '' : 'secondary'}`}
                        onClick={() => setRequestFilter(c.id)}
                      >
                        {c.name} ({c.requests.length})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="request-list">
                  {displayedRequests.length === 0 ? (
                    <div className="empty-state">No requests under this filter. Everything is up to date!</div>
                  ) : (
                    displayedRequests.map((req) => (
                      <div key={req.id} className="request-item" style={{ padding: '14px 0' }}>
                        <div className="request-icon">{req.icon}</div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <b>{req.title}</b>
                            <span className="badge">{req.who}</span>
                          </div>
                          <small>
                            Requested {req.when} · ₹{req.amount} · Purpose: {req.desc}
                          </small>
                        </div>
                        <div className="app-actions">
                          <button className="approve-demo" onClick={() => onPayRequest(req)}>
                            Approve UPI
                          </button>
                          <button className="decline-demo" onClick={() => onDeclineRequest(req.id)}>
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Insights & AI */}
          {activeTab === 'insights' && (
            <div className="app-view active">
              <div className="view-grid">
                {/* AI Conversation Space */}
                <div className="app-card ai-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#dbeaf5' }}>Pocket Fund Family AI Coach</h3>
                    <span className="tag" style={{ color: '#2dd4bf' }}>FOCUSED ON {activeChild.name.toUpperCase()}</span>
                  </div>
                  <p style={{ marginTop: '8px' }}>
                    Ask anything about allowance models, teen impulse spending, or compare habits across your children.
                  </p>

                  <div className="ai-chips">
                    <button className="ai-chip" onClick={() => handleAskAi(`Audit ${activeChild.name}'s spending habits`)}>
                      Audit {activeChild.name}’s spending
                    </button>
                    <button className="ai-chip" onClick={() => handleAskAi(`How to speed up ${activeChild.name}'s savings goal?`)}>
                      Goal acceleration
                    </button>
                    <button className="ai-chip" onClick={() => handleAskAi('Compare spending across all my children')}>
                      Compare all children
                    </button>
                    <button className="ai-chip" onClick={() => handleAskAi('Chores vs allowance best practices')}>
                      Chores framework
                    </button>
                  </div>

                  <div className="ai-result">
                    {aiTyping ? '✦ Pocket Fund AI is formulating personalized guidance...' : aiResult}
                  </div>

                  <div className="ai-input">
                    <input
                      type="text"
                      placeholder={`Ask a question about ${activeChild.name} or family finances...`}
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                    />
                    <button className="btn small" onClick={() => handleAskAi()}>
                      Ask AI
                    </button>
                  </div>
                </div>

                {/* Report Generation */}
                <div className="app-card">
                  <h3 style={{ margin: 0 }}>Monthly Family Statement</h3>
                  <p style={{ fontSize: '0.74rem', color: '#799ab2', marginTop: '6px' }}>
                    A transparent summary of allowances, saved funds, and guardrail limits for all {state.children.length} children.
                  </p>

                  <div style={{ margin: '14px 0', padding: '12px', background: '#0b243b', borderRadius: '10px', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Total Enrolled Children</span>
                      <b style={{ color: '#dbeaf5' }}>{state.children.length}</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>Total Family Allowance</span>
                      <b style={{ color: '#2dd4bf' }}>
                        ₹{state.children.reduce((acc, c) => acc + c.allowance, 0).toLocaleString('en-IN')}
                      </b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Saved Across Children</span>
                      <b style={{ color: '#38bdf8' }}>
                        ₹{state.children.reduce((acc, c) => acc + c.saved, 0).toLocaleString('en-IN')}
                      </b>
                    </div>
                  </div>

                  <div className="report-actions">
                    <button className="btn small" onClick={handleDownloadReport} style={{ flex: 1 }}>
                      Download .txt Report
                    </button>
                    <button
                      className="btn small secondary"
                      onClick={() => showToast('Report emailed to Priya Sharma.')}
                      style={{ flex: 1 }}
                    >
                      Email Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Family Profile (Multiple Children Accounts) */}
          {activeTab === 'family' && (
            <div className="app-view active">
              {/* Parent Profile Card */}
              <div className="app-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="profile-card">
                    <div className="big-avatar">👩</div>
                    <div>
                      <h3 style={{ margin: 0 }}>Priya Sharma</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                        <span className="badge">PRIMARY GUARDIAN</span>
                        <span style={{ fontSize: '0.68rem', color: '#2dd4bf' }}>✓ Verified Parent Account</span>
                      </div>
                    </div>
                  </div>
                  <button className="add-child-btn" onClick={onOpenAddChild} style={{ padding: '8px 14px' }}>
                    + Enroll Child Profile
                  </button>
                </div>
              </div>

              {/* Children Profiles Grid */}
              <h3 style={{ margin: '0 0 14px', fontSize: '1rem', color: '#dbeaf5' }}>
                Children Accounts ({state.children.length})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {state.children.map((c) => {
                  const isSelected = c.id === activeChild.id;
                  const cSpentPct = Math.min(100, Math.round((c.spent / c.allowance) * 100));
                  return (
                    <div
                      key={c.id}
                      className="app-card"
                      style={{
                        border: isSelected ? '1px solid #2dd4bf' : '1px solid #143756',
                        background: isSelected ? '#0b2842' : '#081d30',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div className="big-avatar" style={{ fontSize: '1.6rem' }}>{c.avatar}</div>
                          <div>
                            <b style={{ fontSize: '0.95rem', color: '#dbeaf5' }}>{c.name}</b>
                            <div style={{ fontSize: '0.68rem', color: '#799ab2' }}>Age {c.age} · Companion Wallet</div>
                          </div>
                        </div>
                        {isSelected && <span className="badge">CURRENT</span>}
                      </div>

                      <div style={{ margin: '14px 0', padding: '10px', background: '#081b2d', borderRadius: '8px', fontSize: '0.72rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>Allowance:</span>
                          <b style={{ color: '#dbeaf5' }}>₹{c.allowance.toLocaleString('en-IN')}/mo</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>Spent so far:</span>
                          <b style={{ color: '#94a3b8' }}>₹{c.spent} ({cSpentPct}%)</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Available:</span>
                          <b style={{ color: '#2dd4bf' }}>₹{c.balance.toLocaleString('en-IN')}</b>
                        </div>
                      </div>

                      {/* Child Student Login Credentials */}
                      <div
                        style={{
                          margin: '10px 0',
                          padding: '10px 12px',
                          background: '#051423',
                          borderRadius: '8px',
                          border: '1px solid #143b5e',
                          fontSize: '0.72rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px',
                          }}
                        >
                          <span style={{ color: '#799ab2', fontWeight: 600, fontSize: '0.66rem', letterSpacing: '0.04em' }}>
                            STUDENT COMPANION LOGIN
                          </span>
                          <span style={{ fontSize: '0.66rem', color: '#2dd4bf' }}>Separate Account</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#799ab2' }}>Gmail:</span>
                          <b style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{c.email}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#799ab2' }}>Password:</span>
                          <b style={{ color: '#dbeaf5', fontFamily: 'monospace' }}>{c.password}</b>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className={`btn small ${isSelected ? '' : 'secondary'}`}
                          style={{ flex: 2 }}
                          onClick={() => {
                            onSelectChild(c.id);
                            setActiveTab('overview');
                            showToast(`Now managing ${c.name}’s account.`);
                          }}
                        >
                          {isSelected ? '✓ Currently Managing' : 'Select Account'}
                        </button>
                        <button
                          className="btn small secondary"
                          style={{ flex: 1 }}
                          onClick={() => onOpenAction('allowance', c.id)}
                          title="Adjust allowance and limits"
                        >
                          Adjust ₹
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 5: Settings */}
          {activeTab === 'settings' && (
            <div className="app-view active">
              <div className="app-card">
                <h3 style={{ margin: '0 0 16px' }}>Safety Controls & Guardrails</h3>

                <div className="switch-row">
                  <div>
                    <b>Require purchase category note</b>
                    <div style={{ fontSize: '0.7rem', color: '#799ab2' }}>
                      Teens must specify a category before completing a wallet transaction.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={toggles.purpose}
                    onChange={() => handleToggle('purpose', 'Category requirement')}
                  />
                </div>

                <div className="switch-row">
                  <div>
                    <b>Instant parent notification on spending</b>
                    <div style={{ fontSize: '0.7rem', color: '#799ab2' }}>
                      Receive SMS and WhatsApp alerts whenever a child pays a merchant.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={toggles.alert}
                    onChange={() => handleToggle('alert', 'Spending alerts')}
                  />
                </div>

                <div className="switch-row">
                  <div>
                    <b>Weekend outing limit lock</b>
                    <div style={{ fontSize: '0.7rem', color: '#799ab2' }}>
                      Canteen and dining payments capped at ₹150 on Saturdays & Sundays.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={toggles.weekend}
                    onChange={() => handleToggle('weekend', 'Weekend limit lock')}
                  />
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #143756' }}>
                  <button className="btn small secondary" onClick={onResetDemo}>
                    Reset Demo State to Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
