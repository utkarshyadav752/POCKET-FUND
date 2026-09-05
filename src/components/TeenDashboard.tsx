import React, { useState } from 'react';
import { ChildAccount } from '../types';
import { generateAIResponse } from '../aiEngine';

interface TeenDashboardProps {
  child: ChildAccount;
  onOpenAction: (type: 'allowance' | 'request' | 'expense' | 'rule' | 'goal' | 'edit') => void;
  onOpenQrScanner: () => void;
  onWalletPay: (amount: number, merchant: string) => void;
  onSaveTeenGoal: () => void;
  onCompleteChallenge: () => void;
  onSignOut: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  showToast: (msg: string) => void;
}

const TEEN_AI_INSIGHTS = [
  'You are doing great: saving a portion of your allowance puts you ahead of 85% of teens your age!',
  'Keep ₹100 aside from your canteen allowance this Friday to reach your goal 1 week earlier.',
  'Pause for 24 hours before buying non-essential gear: if you still want it tomorrow, review your budget first.',
  'Your tracking streak is awesome! Consistency is the real superpower behind building money habits.'
];

export const TeenDashboard: React.FC<TeenDashboardProps> = ({
  child,
  onOpenAction,
  onOpenQrScanner,
  onWalletPay,
  onSaveTeenGoal,
  onCompleteChallenge,
  onSignOut,
  isDarkTheme,
  onToggleTheme,
  showToast,
}) => {
  const [activeTeenView, setActiveTeenView] = useState<'money' | 'goals' | 'learning'>('money');
  const [teenAiResult, setTeenAiResult] = useState(
    `You’re doing well, ${child.name}! Saving consistently puts you ahead of a healthy habit target.`
  );
  const [teenAiIdx, setTeenAiIdx] = useState(0);
  const [teenAiQuestion, setTeenAiQuestion] = useState('');
  const [teenAiTyping, setTeenAiTyping] = useState(false);

  const primaryGoal = child.goals[0] || {
    id: 'g-default',
    name: 'Savings Goal',
    icon: '🎯',
    current: child.saved,
    target: 1500,
  };

  const goalPercent = Math.min(100, Math.round((primaryGoal.current / primaryGoal.target) * 100));
  const goalRemaining = Math.max(0, primaryGoal.target - primaryGoal.current);
  const weeksNeeded = Math.ceil(goalRemaining / 75) || 1;

  const handleNextTeenAi = () => {
    const nextIdx = (teenAiIdx + 1) % TEEN_AI_INSIGHTS.length;
    setTeenAiIdx(nextIdx);
    setTeenAiTyping(true);
    setTimeout(() => {
      setTeenAiResult(TEEN_AI_INSIGHTS[nextIdx]);
      setTeenAiTyping(false);
      showToast('Fresh money habit advice generated!');
    }, 250);
  };

  const handleAskTeenAi = (qText?: string) => {
    const q = qText || teenAiQuestion;
    if (!q.trim()) return;
    setTeenAiTyping(true);
    setTimeout(() => {
      const resp = generateAIResponse('teen', q, child);
      setTeenAiResult(resp);
      setTeenAiTyping(false);
      setTeenAiQuestion('');
      showToast('AI financial tip ready!');
    }, 280);
  };

  const views = {
    money: [`Hi, ${child.name} 👋`, 'Small choices today build confidence tomorrow.'],
    goals: ['Your goals', 'Turn what you want into a simple saving plan.'],
    learning: ['Learning & AI', 'Build skills one thoughtful decision at a time.'],
  };

  return (
    <main id="teen-demo-app" className="teen-demo-app" aria-label="Pocket Fund teen dashboard demo">
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="app-side">
          <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); onSignOut(); }}>
            <span className="logo">₹</span>Pocket Fund
          </a>
          <nav className="app-nav teen-nav">
            <button
              className={activeTeenView === 'money' ? 'active' : ''}
              onClick={() => setActiveTeenView('money')}
            >
              <span>▦</span>My money
            </button>
            <button
              className={activeTeenView === 'goals' ? 'active' : ''}
              onClick={() => setActiveTeenView('goals')}
            >
              <span>🎯</span>Goals
            </button>
            <button
              className={activeTeenView === 'learning' ? 'active' : ''}
              onClick={() => setActiveTeenView('learning')}
            >
              <span>💡</span>Learning & AI
            </button>
          </nav>

          <div className="app-user">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>{child.avatar}</span>
              <div>
                <b>{child.name}</b>
                <span className="muted" style={{ display: 'block', fontSize: '0.65rem' }}>
                  Student Account · Age {child.age}
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '6px',
                fontSize: '0.66rem',
                color: '#38bdf8',
                wordBreak: 'break-all',
              }}
            >
              📧 {child.email}
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
              Log Out / Switch Account
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <section className="app-main">
          <header className="app-top">
            <div>
              <div className="eyebrow">YOUR STUDENT SPACE</div>
              <h1 id="teen-title">{views[activeTeenView][0]}</h1>
              <p id="teen-subtitle">{views[activeTeenView][1]}</p>
            </div>
            <div className="app-profile">
              {/* NOTE: Switch to Parent account removed as requested */}
              <button className="theme-toggle" onClick={onToggleTheme}>
                {isDarkTheme ? '☼ Light mode' : '☾ Dark mode'}
              </button>
              <div className="app-avatar" title={`${child.name} (${child.age} yrs)`}>
                {child.avatar}
              </div>
            </div>
          </header>

          {/* View 1: My money */}
          {activeTeenView === 'money' && (
            <div className="app-view active teen-view" id="teen-money">
              <div className="app-grid">
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Balance card */}
                  <section className="app-card quote-card">
                    <span className="tag">AVAILABLE TO SPEND</span>
                    <blockquote id="teen-balance" style={{ fontSize: '2.2rem', margin: '10px 0' }}>
                      ₹{child.balance.toLocaleString('en-IN')}
                    </blockquote>
                    <footer>Next allowance · 5 September</footer>
                    <button
                      className="refresh-quote teen-request"
                      onClick={() => onOpenAction('request')}
                      style={{ marginTop: '12px' }}
                    >
                      Request money +
                    </button>
                  </section>

                  {/* Savings goal */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>Your savings goal</h3>
                      <span className="badge">{goalPercent}%</span>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <b style={{ fontSize: '0.9rem', color: '#dbeaf5' }}>
                        {primaryGoal.icon} {primaryGoal.name}
                      </b>
                      <div className="budgetbar" style={{ marginTop: '8px' }}>
                        <i id="teen-goal-bar" style={{ width: `${goalPercent}%`, background: '#2dd4bf' }} />
                      </div>
                      <p style={{ margin: '8px 0 0', fontSize: '0.74rem', color: '#799ab2' }}>
                        ₹{primaryGoal.current.toLocaleString('en-IN')} saved of ₹{primaryGoal.target.toLocaleString('en-IN')} goal.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                      <button
                        className="btn small"
                        id="teen-save-more"
                        onClick={onSaveTeenGoal}
                        title="Add ₹100 from available balance to savings goal"
                      >
                        + Add ₹100 to savings
                      </button>
                      <button
                        className="btn small secondary"
                        onClick={() => onOpenAction('goal')}
                      >
                        New goal
                      </button>
                    </div>
                  </section>

                  {/* Spending logger */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>Log an expense</h3>
                      <button
                        className="btn small secondary"
                        onClick={() => onOpenAction('expense')}
                      >
                        + Quick entry
                      </button>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#799ab2', margin: '8px 0 14px' }}>
                      Keep track of what you spend so you never wonder where your money went.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <button
                        className="btn small secondary"
                        onClick={() => onWalletPay(40, 'Campus Canteen')}
                      >
                        Canteen ₹40
                      </button>
                      <button
                        className="btn small secondary"
                        onClick={() => onWalletPay(25, 'City Metro')}
                      >
                        Metro ₹25
                      </button>
                      <button
                        className="btn small secondary"
                        onClick={() => onWalletPay(60, 'Stationery Shop')}
                      >
                        Books ₹60
                      </button>
                    </div>
                  </section>
                </div>

                {/* Right Column: Student Wallet & History */}
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Student Wallet with QR Scanner trigger */}
                  <section className="app-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>Student Wallet</h3>
                      <span className="badge">POCKET FUND PAY</span>
                    </div>

                    <p style={{ fontSize: '0.74rem', color: '#799ab2', margin: '8px 0 14px' }}>
                      Authorized merchant payments within your parent-guided daily limits.
                    </p>

                    <button
                      className="btn"
                      onClick={onOpenQrScanner}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '13px',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>📷</span> Scan any QR to Pay
                    </button>

                    {/* Quick merchant simulators */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#799ab2', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                        Quick Campus Pay
                      </div>
                      <div style={{ display: 'grid', gap: '7px' }}>
                        <div className="premium-item">
                          <div>
                            <b>Campus Café</b>
                            <div style={{ fontSize: '0.67rem', color: '#799ab2' }}>Snacks & drinks · ₹45</div>
                          </div>
                          <button className="btn small secondary" onClick={() => onWalletPay(45, 'Campus Café')}>
                            Pay ₹45
                          </button>
                        </div>
                        <div className="premium-item">
                          <div>
                            <b>School Stationery</b>
                            <div style={{ fontSize: '0.67rem', color: '#799ab2' }}>Notebooks · ₹80</div>
                          </div>
                          <button className="btn small secondary" onClick={() => onWalletPay(80, 'School Stationery')}>
                            Pay ₹80
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Transaction History */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#799ab2', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                        Recent Activity
                      </div>
                      {child.walletHistory.length === 0 ? (
                        <div className="empty" style={{ margin: 0 }}>No recent wallet payments logged.</div>
                      ) : (
                        <div style={{ display: 'grid', gap: '6px' }}>
                          {child.walletHistory.slice(0, 3).map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.72rem', color: '#2dd4bf', padding: '6px 8px', background: 'rgba(45, 212, 191, 0.08)', borderRadius: '6px' }}>
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Category Limits */}
                  <section className="app-card">
                    <h3 style={{ margin: '0 0 12px' }}>Your category budgets</h3>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem' }}>
                        <span>🍔 Food & snacks</span>
                        <b style={{ color: '#dbeaf5' }}>₹{child.foodSpent} / ₹{child.foodLimit}</b>
                      </div>
                      <div className="budgetbar">
                        <i style={{ width: `${Math.min(100, Math.round((child.foodSpent / child.foodLimit) * 100))}%`, background: '#2dd4bf' }} />
                      </div>
                    </div>

                    <div style={{ marginTop: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem' }}>
                        <span>🚌 Transport</span>
                        <b style={{ color: '#dbeaf5' }}>₹{child.transportSpent} / ₹{child.transportLimit}</b>
                      </div>
                      <div className="budgetbar">
                        <i style={{ width: `${Math.min(100, Math.round((child.transportSpent / child.transportLimit) * 100))}%`, background: '#38bdf8' }} />
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Goals */}
          {activeTeenView === 'goals' && (
            <div className="app-view active teen-view" id="teen-goals">
              <div className="app-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Your Goals & Savings Pacing</h3>
                    <p style={{ fontSize: '0.74rem', color: '#799ab2', margin: '4px 0 0' }}>
                      Plan ahead so you can buy what you truly care about without stress.
                    </p>
                  </div>
                  <button className="btn small" onClick={() => onOpenAction('goal')}>
                    + Add goal
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {child.goals.map((g) => {
                    const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                    const rem = Math.max(0, g.target - g.current);
                    return (
                      <div key={g.id} style={{ padding: '16px', background: '#0b243b', border: '1px solid #163d60', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>{g.icon}</span>
                          <span className="badge">{pct}%</span>
                        </div>
                        <b style={{ display: 'block', margin: '8px 0 4px', fontSize: '0.9rem', color: '#dbeaf5' }}>{g.name}</b>
                        <div style={{ fontSize: '0.72rem', color: '#799ab2' }}>
                          ₹{g.current.toLocaleString('en-IN')} of ₹{g.target.toLocaleString('en-IN')} (₹{rem} left)
                        </div>
                        <div className="budgetbar" style={{ marginTop: '10px' }}>
                          <i style={{ width: `${pct}%`, background: '#2dd4bf' }} />
                        </div>
                        <button
                          className="btn small secondary"
                          style={{ marginTop: '12px', width: '100%' }}
                          onClick={onSaveTeenGoal}
                        >
                          + Add ₹100 from balance
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '20px', padding: '14px', background: '#0a1f33', borderRadius: '10px', fontSize: '0.75rem', color: '#8faec4' }}>
                  💡 <b>Pacing tip:</b> Saving just ₹75 each week will reach your next milestone in approximately {weeksNeeded} weeks!
                </div>
              </div>
            </div>
          )}

          {/* View 3: Learning & AI */}
          {activeTeenView === 'learning' && (
            <div className="app-view active teen-view" id="teen-learning">
              <div className="view-grid">
                {/* Teen AI Coach */}
                <div className="app-card ai-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#dbeaf5' }}>Pocket Fund Teen Coach</h3>
                    <span className="tag" style={{ color: '#2dd4bf' }}>FOR {child.name.toUpperCase()}</span>
                  </div>
                  <p style={{ marginTop: '6px' }}>
                    Ask anything: how to save faster, handle peer pressure when eating out, or distinguish wants from needs.
                  </p>

                  <div className="ai-chips">
                    <button className="ai-chip" onClick={() => handleAskTeenAi('How do I save up for my goal faster?')}>
                      Save for goal faster
                    </button>
                    <button className="ai-chip" onClick={() => handleAskTeenAi('How to tell if something is a want or a need?')}>
                      Needs vs Wants test
                    </button>
                    <button className="ai-chip" onClick={() => handleAskTeenAi('Ways for teens to earn extra money')}>
                      Earn extra money
                    </button>
                  </div>

                  <div className="ai-result">
                    {teenAiTyping ? '✦ Thinking through a practical tip...' : teenAiResult}
                  </div>

                  <div className="ai-input">
                    <input
                      type="text"
                      placeholder="Ask Pocket Fund AI a money question..."
                      value={teenAiQuestion}
                      onChange={(e) => setTeenAiQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskTeenAi()}
                    />
                    <button className="btn small" onClick={() => handleAskTeenAi()}>
                      Ask
                    </button>
                  </div>
                </div>

                {/* Interactive Weekly Challenge */}
                <div className="app-card">
                  <h3 style={{ margin: '0 0 12px' }}>This week's habit challenge</h3>
                  <div className="insight-row">
                    <b>⚖️ The 24-Hour Rule</b>
                    <p style={{ margin: '6px 0 0', fontSize: '0.73rem', color: '#8faec4' }}>
                      Before buying any non-school item, pause for 24 hours and check if you still really need it.
                    </p>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    {child.challengeCompleted ? (
                      <div style={{ padding: '12px', background: 'rgba(45, 212, 191, 0.12)', border: '1px solid #2dd4bf', borderRadius: '10px', fontSize: '0.75rem', color: '#2dd4bf' }}>
                        ✓ Challenge completed! Badge unlocked: <b>Thoughtful Spender</b> ({child.streakDays}-day streak!)
                      </div>
                    ) : (
                      <button
                        className="btn small"
                        style={{ width: '100%' }}
                        onClick={onCompleteChallenge}
                      >
                        Mark Challenge Complete ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
