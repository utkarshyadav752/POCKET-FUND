import React, { useState, useEffect } from 'react';
import { AppState, RequestItem, ChildAccount } from '../types';
import { generateAIResponse } from '../aiEngine';

interface ModalsProps {
  state: AppState;
  activeChild: ChildAccount;
  showPilotModal: boolean;
  setShowPilotModal: (show: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  loginInitialRole?: 'parent' | 'student';
  loginInitialEmail?: string;
  showActionModal: boolean;
  setShowActionModal: (show: boolean) => void;
  actionType: 'allowance' | 'request' | 'expense' | 'rule' | 'goal' | 'edit';
  actionTargetChildId?: string;
  showAddChildModal: boolean;
  setShowAddChildModal: (show: boolean) => void;
  showUpiModal: boolean;
  setShowUpiModal: (show: boolean) => void;
  payingRequest: RequestItem | null;
  showTeenQrModal: boolean;
  setShowTeenQrModal: (show: boolean) => void;
  showSiteAiModal: boolean;
  setShowSiteAiModal: (show: boolean) => void;
  onLogin: (role: 'parent' | 'teen', childId?: string) => void;
  onAuthenticate: (role: 'parent' | 'student', email: string, password: string) => { success: boolean; error?: string };
  onSaveAction: (type: string, name: string, value: number, childId?: string) => void;
  onAddChild: (name: string, age: number, allowance: number, avatar: string, email?: string, password?: string) => void;
  onCompleteUpi: (amount: number, reqId?: string) => void;
  onConfirmTeenPay: (amount: number, merchant: string) => void;
  showToast: (msg: string) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  state,
  activeChild,
  showPilotModal,
  setShowPilotModal,
  showLoginModal,
  setShowLoginModal,
  loginInitialRole = 'parent',
  loginInitialEmail,
  showActionModal,
  setShowActionModal,
  actionType,
  actionTargetChildId,
  showAddChildModal,
  setShowAddChildModal,
  showUpiModal,
  setShowUpiModal,
  payingRequest,
  showTeenQrModal,
  setShowTeenQrModal,
  showSiteAiModal,
  setShowSiteAiModal,
  onLogin,
  onAuthenticate,
  onSaveAction,
  onAddChild,
  onCompleteUpi,
  onConfirmTeenPay,
  showToast,
}) => {
  // Pilot Modal state
  const [pilotEmail, setPilotEmail] = useState('');
  const [pilotFamily, setPilotFamily] = useState('Parent / guardian');
  const [pilotError, setPilotError] = useState(false);

  // Login Modal state
  const [loginRole, setLoginRole] = useState<'parent' | 'student'>('parent');
  const [loginEmail, setLoginEmail] = useState(state.parent.email);
  const [loginPassword, setLoginPassword] = useState(state.parent.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync login role & initial email when modal opens
  useEffect(() => {
    if (showLoginModal) {
      setLoginRole(loginInitialRole);
      setLoginError(null);
      if (loginInitialRole === 'parent') {
        setLoginEmail(loginInitialEmail || state.parent.email);
        setLoginPassword(state.parent.password);
      } else {
        const found = loginInitialEmail
          ? state.children.find((c) => c.email.toLowerCase() === loginInitialEmail.toLowerCase())
          : state.children[0];
        const student = found || state.children[0];
        if (student) {
          setLoginEmail(student.email);
          setLoginPassword(student.password);
        }
      }
    }
  }, [showLoginModal, loginInitialRole, loginInitialEmail, state.parent, state.children]);

  // Add Child Modal state
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('14');
  const [newChildAllowance, setNewChildAllowance] = useState('1500');
  const [newChildAvatar, setNewChildAvatar] = useState('🧑');
  const [newChildEmail, setNewChildEmail] = useState('');
  const [newChildPassword, setNewChildPassword] = useState('');

  // Action Modal state
  const [actionName, setActionName] = useState('');
  const [actionValue, setActionValue] = useState<string>('');

  // UPI Modal state
  const [upiMode, setUpiMode] = useState<'qr' | 'id' | 'phone'>('qr');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [upiPhone, setUpiPhone] = useState('9876543210');
  const [upiStatus, setUpiStatus] = useState('');

  // Teen QR Modal state
  const [qrAmount, setQrAmount] = useState('');
  const [qrMerchant, setQrMerchant] = useState('Campus Canteen');

  // Site AI Modal state
  const [siteAiQuestion, setSiteAiQuestion] = useState('');
  const [siteAiResponse, setSiteAiResponse] = useState(
    'Ask any question about multiple child allowances, financial literacy, or parenting guardrails!'
  );
  const [siteAiTyping, setSiteAiTyping] = useState(false);

  // Handle Pilot Submit
  const handlePilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilotEmail || !pilotEmail.includes('@')) {
      setPilotError(true);
      return;
    }
    setPilotError(false);
    setShowPilotModal(false);
    showToast(`Pilot access reserved for ${pilotFamily}. Welcome pack sent to ${pilotEmail}!`);
    setPilotEmail('');
  };

  // Handle Login Submit with strict role boundaries
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanEmail.includes('@') || cleanPass.length < 3) {
      setLoginError('Please enter a valid Gmail address and password.');
      return;
    }

    if (loginRole === 'parent') {
      const isStudentEmail = state.children.some((c) => c.email.toLowerCase() === cleanEmail);
      if (isStudentEmail) {
        setLoginError('Access Denied: Student accounts cannot access the Parent Console. Please switch to Student Sign In.');
        return;
      }
    } else {
      if (cleanEmail === state.parent.email.toLowerCase()) {
        setLoginError('Parent account detected. Please switch to Parent Sign In to access the Parent Console.');
        return;
      }
    }

    const result = onAuthenticate(loginRole, cleanEmail, cleanPass);
    if (result.success) {
      setLoginError(null);
      setShowLoginModal(false);
    } else {
      setLoginError(result.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  // Switch Login Role
  const handleRoleSelect = (role: 'parent' | 'student') => {
    setLoginRole(role);
    setLoginError(null);
    if (role === 'parent') {
      setLoginEmail(state.parent.email);
      setLoginPassword(state.parent.password);
    } else {
      const defaultStudent = state.children[0];
      setLoginEmail(defaultStudent ? defaultStudent.email : 'aarav.sharma@gmail.com');
      setLoginPassword(defaultStudent ? defaultStudent.password : 'aarav@2026');
    }
  };

  // Quick fill student credentials
  const handleSelectStudentCreds = (child: ChildAccount) => {
    setLoginRole('student');
    setLoginEmail(child.email);
    setLoginPassword(child.password);
    setLoginError(null);
  };

  // Handle Add Child Submit
  const handleAddChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) {
      showToast('Please enter child’s name.');
      return;
    }
    const cleanName = newChildName.trim();
    const age = Number(newChildAge) || 14;
    const allowance = Number(newChildAllowance) || 1500;
    const emailToUse = newChildEmail.trim() || `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}.sharma@gmail.com`;
    const passwordToUse = newChildPassword.trim() || `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@2026`;

    onAddChild(cleanName, age, allowance, newChildAvatar, emailToUse, passwordToUse);
    setShowAddChildModal(false);
    setNewChildName('');
    setNewChildEmail('');
    setNewChildPassword('');
  };

  // Handle Action Submit
  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(actionValue);
    if (!val || val <= 0) {
      showToast('Please enter a valid amount.');
      return;
    }
    onSaveAction(actionType, actionName, val, actionTargetChildId);
    setShowActionModal(false);
    setActionName('');
    setActionValue('');
  };

  // Handle UPI Complete
  const handleProcessUpi = () => {
    if (upiMode === 'id' && !upiId.includes('@')) {
      setUpiStatus('Please enter a valid UPI ID (e.g. name@bank)');
      return;
    }
    if (upiMode === 'phone' && upiPhone.replace(/\D/g, '').length < 10) {
      setUpiStatus('Please enter a valid 10-digit mobile number');
      return;
    }

    setUpiStatus('Processing UPI transfer...');
    setTimeout(() => {
      setUpiStatus('');
      setShowUpiModal(false);
      const amount = payingRequest ? payingRequest.amount : 350;
      onCompleteUpi(amount, payingRequest ? payingRequest.id : undefined);
    }, 450);
  };

  // Handle Teen QR Payment Submit
  const handleTeenQrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(qrAmount);
    if (!amt || amt <= 0) {
      showToast('Please enter a valid payment amount.');
      return;
    }
    if (amt > activeChild.balance) {
      showToast(`Insufficient balance. ${activeChild.name} has ₹${activeChild.balance} available.`);
      return;
    }
    setShowTeenQrModal(false);
    onConfirmTeenPay(amt, qrMerchant || 'Merchant');
    setQrAmount('');
  };

  // Handle Site AI Ask
  const handleAskSiteAi = (qText?: string) => {
    const q = qText || siteAiQuestion;
    if (!q.trim()) return;
    setSiteAiTyping(true);
    setTimeout(() => {
      const resp = generateAIResponse('site', q, activeChild, state.children);
      setSiteAiResponse(resp);
      setSiteAiTyping(false);
      setSiteAiQuestion('');
    }, 300);
  };

  // Action modal config
  const actionConfigs = {
    allowance: {
      title: 'Update Allowance',
      desc: 'Set recurring monthly allowance for child.',
      nameLabel: 'Allowance Cycle Label',
      namePlaceholder: 'Monthly baseline allowance',
      valLabel: 'Monthly Amount (₹)',
      defaultVal: '2000',
    },
    request: {
      title: 'Request Money Top-up',
      desc: 'Submit a funds request to your parent with purpose.',
      nameLabel: 'What is this for?',
      namePlaceholder: 'School supplies, books, outings...',
      valLabel: 'Amount needed (₹)',
      defaultVal: '350',
    },
    expense: {
      title: 'Log an Expense',
      desc: 'Record a purchase to keep your spending up to date.',
      nameLabel: 'Merchant or description',
      namePlaceholder: 'Campus canteen, book store...',
      valLabel: 'Amount spent (₹)',
      defaultVal: '120',
    },
    rule: {
      title: 'Add Category Rule',
      desc: 'Establish a spending limit for a specific category.',
      nameLabel: 'Category Name',
      namePlaceholder: 'Gaming, Books, Sports...',
      valLabel: 'Monthly Limit (₹)',
      defaultVal: '500',
    },
    goal: {
      title: 'Create Savings Goal',
      desc: 'Set a target to motivate disciplined saving.',
      nameLabel: 'Goal Name',
      namePlaceholder: 'Bicycle, Headphones, Art kit...',
      valLabel: 'Target Amount (₹)',
      defaultVal: '1500',
    },
    edit: {
      title: 'Update Request',
      desc: 'Modify requested amount or description.',
      nameLabel: 'Item Description',
      namePlaceholder: 'Notebooks and materials',
      valLabel: 'Updated Amount (₹)',
      defaultVal: '350',
    },
  };

  const currentAction = actionConfigs[actionType] || actionConfigs.allowance;

  return (
    <>
      {/* Pilot Early Access Modal */}
      <div className={`modalback ${showPilotModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <button className="close" onClick={() => setShowPilotModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">EARLY ACCESS</div>
          <h3>Join the Family Pilot</h3>
          <p>
            Experience parent-guided allowances with multi-child controls.
          </p>

          <form onSubmit={handlePilotSubmit}>
            <label className="field">
              <span>PARENT / GUARDIAN EMAIL</span>
              <input
                type="email"
                placeholder="name@domain.com"
                value={pilotEmail}
                onChange={(e) => setPilotEmail(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>HOW MANY CHILDREN ARE YOU ENROLLING?</span>
              <select value={pilotFamily} onChange={(e) => setPilotFamily(e.target.value)}>
                <option value="1 Child (Ages 12-17)">1 Child (Ages 12-17)</option>
                <option value="2 Children (Ages 12-17)">2 Children (Ages 12-17)</option>
                <option value="3+ Children (Ages 12-17)">3+ Children (Ages 12-17)</option>
              </select>
            </label>

            {pilotError && (
              <div className="error" style={{ display: 'block', marginBottom: '10px' }}>
                Please enter a valid email address.
              </div>
            )}

            <button type="submit" className="btn wide-btn" style={{ marginTop: '12px' }}>
              Request Pilot Invite
            </button>
          </form>
        </div>
      </div>

      {/* Login Demo Modal */}
      <div className={`modalback ${showLoginModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal" style={{ maxWidth: '500px' }}>
          <button className="close" onClick={() => setShowLoginModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">
            {loginRole === 'parent' ? 'PARENT PORTAL AUTHENTICATION' : 'STUDENT COMPANION AUTHENTICATION'}
          </div>
          <h3>{loginRole === 'parent' ? 'Parent Console Sign In' : 'Student Space Sign In'}</h3>
          <p style={{ color: '#8daec7', fontSize: '0.82rem', margin: '4px 0 14px' }}>
            {loginRole === 'parent'
              ? 'Parent supervisor access. Manage all family accounts, approve 1-tap UPI requests, and configure category caps.'
              : 'Individual student companion access. View your personal balance, savings targets, and daily streak.'}
          </p>

          <div className="role-select" style={{ marginBottom: '14px' }}>
            <button
              type="button"
              className={`role-choice ${loginRole === 'parent' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('parent')}
            >
              👩 Parent Sign In
            </button>
            <button
              type="button"
              className={`role-choice ${loginRole === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              🧑 Student Sign In
            </button>
          </div>

          {/* Role Boundary Notice */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: loginRole === 'parent' ? 'rgba(45, 212, 191, 0.08)' : 'rgba(56, 189, 248, 0.08)',
              border: `1px solid ${loginRole === 'parent' ? 'rgba(45, 212, 191, 0.25)' : 'rgba(56, 189, 248, 0.25)'}`,
              fontSize: '0.72rem',
              marginBottom: '14px',
              color: loginRole === 'parent' ? '#2dd4bf' : '#38bdf8',
            }}
          >
            {loginRole === 'parent'
              ? '🔒 Strict isolation: Student credentials cannot sign in to the Parent Console.'
              : '🔒 Strict isolation: Students access only their personal wallet and cannot view the Parent Console.'}
          </div>

          {/* Quick Demo Helpers */}
          <div className="quick-cred-banner">
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#799ab2', letterSpacing: '0.04em' }}>
              {loginRole === 'parent' ? 'PREFILL DEMO PARENT ACCOUNT:' : 'SELECT DEMO STUDENT ACCOUNT:'}
            </div>
            <div className="quick-cred-list">
              {loginRole === 'parent' ? (
                <button
                  type="button"
                  className={`quick-cred-btn ${loginEmail === state.parent.email ? 'active' : ''}`}
                  onClick={() => {
                    setLoginEmail(state.parent.email);
                    setLoginPassword(state.parent.password);
                    setLoginError(null);
                  }}
                >
                  <span>👩</span>
                  <span>{state.parent.name}</span>
                  <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>({state.parent.email})</span>
                </button>
              ) : (
                state.children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    className={`quick-cred-btn ${loginEmail === child.email ? 'active' : ''}`}
                    onClick={() => handleSelectStudentCreds(child)}
                  >
                    <span>{child.avatar}</span>
                    <span>{child.name} ({child.age}y)</span>
                    <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>({child.email})</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <label className="field">
              <span>{loginRole === 'parent' ? 'PARENT GMAIL ADDRESS' : 'STUDENT GMAIL ADDRESS'}</span>
              <input
                type="email"
                placeholder={loginRole === 'parent' ? 'priya.sharma@gmail.com' : 'aarav.sharma@gmail.com'}
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setLoginError(null);
                }}
                required
              />
            </label>

            <label className="field">
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>PASSWORD</span>
                <span style={{ fontSize: '0.68rem', color: '#799ab2' }}>
                  {loginRole === 'parent' ? 'Demo: parent@2026' : 'Demo: [child]@2026'}
                </span>
              </span>
              <div className="input-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError(null);
                  }}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </label>

            {loginError && (
              <div className="error" style={{ display: 'block', marginBottom: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                ⚠️ {loginError}
              </div>
            )}

            <button type="submit" className="btn wide-btn" style={{ marginTop: '8px' }}>
              Sign In to {loginRole === 'parent' ? 'Parent Console' : 'Student Space'} →
            </button>
          </form>
        </div>
      </div>

      {/* Add Child Profile Modal */}
      <div className={`modalback ${showAddChildModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal" style={{ maxWidth: '520px' }}>
          <button className="close" onClick={() => setShowAddChildModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">ENROLL CHILD</div>
          <h3>Add a Child Account</h3>
          <p>Create a dedicated companion account with a distinct student Gmail and login password.</p>

          <form onSubmit={handleAddChildSubmit}>
            <label className="field">
              <span>CHILD'S FULL NAME</span>
              <input
                type="text"
                placeholder="e.g. Kavya, Kabir, Rhea..."
                value={newChildName}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewChildName(val);
                  if (val.trim()) {
                    const slug = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                    setNewChildEmail(`${slug}.sharma@gmail.com`);
                    setNewChildPassword(`${slug}@2026`);
                  }
                }}
                required
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label className="field">
                <span>AGE</span>
                <select value={newChildAge} onChange={(e) => setNewChildAge(e.target.value)}>
                  <option value="11">11 years</option>
                  <option value="12">12 years</option>
                  <option value="13">13 years</option>
                  <option value="14">14 years</option>
                  <option value="15">15 years</option>
                  <option value="16">16 years</option>
                  <option value="17">17 years</option>
                </select>
              </label>

              <label className="field">
                <span>AVATAR</span>
                <select value={newChildAvatar} onChange={(e) => setNewChildAvatar(e.target.value)}>
                  <option value="🧑">🧑 Boy</option>
                  <option value="👧">👧 Girl</option>
                  <option value="👦">👦 Younger</option>
                  <option value="🧒">🧒 Teen</option>
                  <option value="🎨">🎨 Creative</option>
                  <option value="⚽">⚽ Sporty</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>MONTHLY ALLOWANCE (₹)</span>
              <input
                type="number"
                placeholder="1500"
                value={newChildAllowance}
                onChange={(e) => setNewChildAllowance(e.target.value)}
                required
              />
            </label>

            {/* Separate student Gmail and password fields */}
            <div style={{ borderTop: '1px solid #163e63', paddingTop: '12px', marginTop: '6px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#2dd4bf', marginBottom: '8px' }}>
                🔐 STUDENT LOGIN CREDENTIALS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label className="field">
                  <span>STUDENT GMAIL</span>
                  <input
                    type="email"
                    placeholder="child.sharma@gmail.com"
                    value={newChildEmail}
                    onChange={(e) => setNewChildEmail(e.target.value)}
                    required
                  />
                </label>

                <label className="field">
                  <span>STUDENT PASSWORD</span>
                  <input
                    type="text"
                    placeholder="e.g. pass@2026"
                    value={newChildPassword}
                    onChange={(e) => setNewChildPassword(e.target.value)}
                    required
                  />
                </label>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#799ab2', margin: '4px 0 0' }}>
                The child will use this Gmail and password to log in to their student companion view.
              </p>
            </div>

            <button type="submit" className="btn wide-btn" style={{ marginTop: '16px' }}>
              Enroll Child & Create Account
            </button>
          </form>
        </div>
      </div>

      {/* Universal Action Modal */}
      <div className={`modalback ${showActionModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <button className="close" onClick={() => setShowActionModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">QUICK ACTION</div>
          <h3>{currentAction.title}</h3>
          <p>{currentAction.desc}</p>

          <form onSubmit={handleActionSubmit}>
            <label className="field">
              <span>{currentAction.nameLabel}</span>
              <input
                type="text"
                placeholder={currentAction.namePlaceholder}
                value={actionName}
                onChange={(e) => setActionName(e.target.value)}
              />
            </label>

            <label className="field">
              <span>{currentAction.valLabel}</span>
              <input
                type="number"
                placeholder={currentAction.defaultVal}
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn wide-btn" style={{ marginTop: '12px' }}>
              Confirm & Save
            </button>
          </form>
        </div>
      </div>

      {/* UPI Payment Flow Modal */}
      <div className={`modalback ${showUpiModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <button className="close" onClick={() => setShowUpiModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">UPI CHECKOUT</div>
          <h3>Approve Allowance Payment</h3>
          <p>
            {payingRequest
              ? `Releasing ₹${payingRequest.amount} to ${payingRequest.who} for "${payingRequest.title}".`
              : 'Direct UPI top-up to child companion wallet.'}
          </p>

          <div className="upi-options">
            <button
              type="button"
              className={upiMode === 'qr' ? 'active' : ''}
              onClick={() => setUpiMode('qr')}
            >
              Scan QR
            </button>
            <button
              type="button"
              className={upiMode === 'id' ? 'active' : ''}
              onClick={() => setUpiMode('id')}
            >
              UPI ID / VPA
            </button>
            <button
              type="button"
              className={upiMode === 'phone' ? 'active' : ''}
              onClick={() => setUpiMode('phone')}
            >
              Mobile #
            </button>
          </div>

          {upiMode === 'qr' && (
            <div style={{ textAlign: 'center' }}>
              <div className="qr-demo" />
              <div style={{ fontSize: '0.72rem', color: '#799ab2', margin: '6px 0 14px' }}>
                Scan with any UPI app (GPay, PhonePe, Paytm, BHIM)
              </div>
            </div>
          )}

          {upiMode === 'id' && (
            <label className="field">
              <span>PARENT UPI ID</span>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@bank"
              />
            </label>
          )}

          {upiMode === 'phone' && (
            <label className="field">
              <span>REGISTERED MOBILE NUMBER</span>
              <input
                type="tel"
                value={upiPhone}
                onChange={(e) => setUpiPhone(e.target.value)}
                placeholder="10 digit number"
              />
            </label>
          )}

          {upiStatus && (
            <div className="upi-status" style={{ textAlign: 'center', marginBottom: '8px' }}>
              {upiStatus}
            </div>
          )}

          <button
            type="button"
            className="btn wide-btn"
            onClick={handleProcessUpi}
            style={{ marginTop: '8px' }}
          >
            Complete UPI Payment (₹{payingRequest ? payingRequest.amount : 350})
          </button>
        </div>
      </div>

      {/* Teen QR Scanner Modal */}
      <div className={`modalback ${showTeenQrModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <button className="close" onClick={() => setShowTeenQrModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">POCKET FUND SCANNER</div>
          <h3>Scan Merchant QR</h3>
          <p>Point camera at vendor QR code to pay within approved daily limits.</p>

          <div
            style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              margin: '15px auto',
              borderRadius: '16px',
              background: '#04101b',
              border: '2px solid #2dd4bf',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: '#2dd4bf',
                boxShadow: '0 0 10px #2dd4bf',
                animation: 'scanMove 2.4s infinite ease-in-out',
              }}
            />
            <span style={{ fontSize: '3rem', opacity: 0.2 }}>📷</span>
          </div>

          <form onSubmit={handleTeenQrSubmit}>
            <label className="field">
              <span>MERCHANT NAME</span>
              <input
                type="text"
                value={qrMerchant}
                onChange={(e) => setQrMerchant(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>AMOUNT TO PAY (₹)</span>
              <input
                type="number"
                placeholder="e.g. 50"
                value={qrAmount}
                onChange={(e) => setQrAmount(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn wide-btn" style={{ marginTop: '8px' }}>
              Confirm Payment
            </button>
          </form>
        </div>
      </div>

      {/* Site AI Assistant Floating Modal */}
      <div className={`modalback ${showSiteAiModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal" style={{ width: 'min(520px, 100%)' }}>
          <button className="close" onClick={() => setShowSiteAiModal(false)} aria-label="Close modal">
            ✕
          </button>
          <div className="eyebrow">AI COMPANION</div>
          <h3>Pocket Fund Financial AI</h3>
          <p>Get immediate answers on parenting guardrails, multi-child allowances, and teen spending habits.</p>

          <div className="ai-chips">
            <button className="ai-chip" onClick={() => handleAskSiteAi('How do multiple children accounts work?')}>
              Multiple children accounts
            </button>
            <button className="ai-chip" onClick={() => handleAskSiteAi('How do UPI approvals work?')}>
              UPI approvals
            </button>
            <button className="ai-chip" onClick={() => handleAskSiteAi('Are teenager payments safe?')}>
              Payment safety
            </button>
          </div>

          <div className="ai-result" style={{ minHeight: '65px', fontSize: '0.8rem' }}>
            {siteAiTyping ? '✦ Pocket Fund AI is processing...' : siteAiResponse}
          </div>

          <div className="ai-input">
            <input
              type="text"
              placeholder="Ask any question about allowances, kids, or guardrails..."
              value={siteAiQuestion}
              onChange={(e) => setSiteAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskSiteAi()}
            />
            <button className="btn small" onClick={() => handleAskSiteAi()}>
              Ask
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
