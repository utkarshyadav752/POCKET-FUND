import React, { useState, useEffect, useCallback } from 'react';
import { AppState, ChildAccount, RequestItem, BudgetItem, SavingsGoal, ParentAccount, UserSession } from './types';
import { LandingPage } from './components/LandingPage';
import { ParentWebpage } from './components/ParentWebpage';
import { StudentWebpage } from './components/StudentWebpage';
import { Modals } from './components/Modals';

const INITIAL_PARENT: ParentAccount = {
  id: 'parent-1',
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  password: 'parent@2026',
  avatar: '👩',
};

const INITIAL_SESSION: UserSession = {
  isLoggedIn: false,
  role: 'parent',
  userId: 'parent-1',
  name: 'Priya Sharma',
  email: 'priya.sharma@gmail.com',
  avatar: '👩',
};

const INITIAL_CHILDREN: ChildAccount[] = [
  {
    id: 'child-1',
    name: 'Aarav',
    email: 'aarav.sharma@gmail.com',
    password: 'aarav@2026',
    age: 16,
    avatar: '🧑',
    allowance: 2000,
    spent: 1120,
    saved: 480,
    balance: 880,
    foodSpent: 280,
    foodLimit: 400,
    transportSpent: 120,
    transportLimit: 200,
    streakDays: 20,
    challengeCompleted: false,
    goals: [
      { id: 'g-1', name: 'New Headphones', icon: '🎧', current: 1050, target: 1500 },
      { id: 'g-2', name: 'Campus Fest Outing', icon: '🎟️', current: 300, target: 600 },
    ],
    budgets: [
      { id: 'b-1', name: 'Food & drinks', icon: '🍜', spent: 280, limit: 400 },
      { id: 'b-2', name: 'Transport', icon: '🚌', spent: 120, limit: 200 },
    ],
    requests: [
      {
        id: 'req-1',
        title: 'School supplies',
        amount: 350,
        who: 'Aarav',
        childId: 'child-1',
        when: 'Today',
        icon: '📚',
        desc: 'notebooks and geometry kit',
      },
      {
        id: 'req-2',
        title: 'Movie with friends',
        amount: 220,
        who: 'Aarav',
        childId: 'child-1',
        when: 'Tomorrow',
        icon: '🎬',
        desc: 'weekend science fiction screening',
      },
    ],
    walletHistory: ['✓ Paid ₹45 at Campus Café · 2 hours ago', '✓ Paid ₹25 for Metro · yesterday'],
  },
  {
    id: 'child-2',
    name: 'Ananya',
    email: 'ananya.sharma@gmail.com',
    password: 'ananya@2026',
    age: 14,
    avatar: '👧',
    allowance: 1500,
    spent: 650,
    saved: 350,
    balance: 850,
    foodSpent: 180,
    foodLimit: 300,
    transportSpent: 90,
    transportLimit: 150,
    streakDays: 14,
    challengeCompleted: true,
    goals: [
      { id: 'g-3', name: 'Art Sketchbook & Pastels', icon: '🎨', current: 650, target: 900 },
    ],
    budgets: [
      { id: 'b-3', name: 'Art & Books', icon: '📖', spent: 180, limit: 300 },
      { id: 'b-4', name: 'Snacks', icon: '🧃', spent: 90, limit: 150 },
    ],
    requests: [
      {
        id: 'req-3',
        title: 'Science project kit',
        amount: 290,
        who: 'Ananya',
        childId: 'child-2',
        when: 'Yesterday',
        icon: '🔬',
        desc: 'components for robotic arm model',
      },
    ],
    walletHistory: ['✓ Paid ₹60 at Stationery Shop · yesterday'],
  },
  {
    id: 'child-3',
    name: 'Rohan',
    email: 'rohan.sharma@gmail.com',
    password: 'rohan@2026',
    age: 12,
    avatar: '👦',
    allowance: 1000,
    spent: 320,
    saved: 280,
    balance: 680,
    foodSpent: 120,
    foodLimit: 200,
    transportSpent: 60,
    transportLimit: 100,
    streakDays: 8,
    challengeCompleted: false,
    goals: [
      { id: 'g-4', name: 'Badminton Racket', icon: '🏸', current: 400, target: 800 },
    ],
    budgets: [
      { id: 'b-5', name: 'Sports & Hobbies', icon: '⚽', spent: 120, limit: 200 },
    ],
    requests: [],
    walletHistory: ['✓ Paid ₹30 at Sports Academy · 3 days ago'],
  },
];

const INITIAL_STATE: AppState = {
  children: INITIAL_CHILDREN,
  activeChildId: 'child-1',
  parent: INITIAL_PARENT,
  session: INITIAL_SESSION,
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(INITIAL_STATE);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Modals state
  const [showPilotModal, setShowPilotModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginInitialRole, setLoginInitialRole] = useState<'parent' | 'student'>('parent');
  const [loginInitialEmail, setLoginInitialEmail] = useState<string | undefined>(undefined);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'allowance' | 'request' | 'expense' | 'rule' | 'goal' | 'edit'>('allowance');
  const [actionTargetChildId, setActionTargetChildId] = useState<string | undefined>(undefined);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [payingRequest, setPayingRequest] = useState<RequestItem | null>(null);
  const [showTeenQrModal, setShowTeenQrModal] = useState(false);
  const [showSiteAiModal, setShowSiteAiModal] = useState(false);

  const handleOpenLogin = (role: 'parent' | 'student' = 'parent', emailPrefill?: string) => {
    setLoginInitialRole(role);
    setLoginInitialEmail(emailPrefill);
    setShowLoginModal(true);
  };

  // Landing page preview request state
  const [landingRequestApproved, setLandingRequestApproved] = useState(false);
  const [landingRequestDeclined, setLandingRequestDeclined] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg: string, duration = 3200) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, duration);
  }, []);

  // Synchronize dark-theme class on body
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  // Check URL hash on initial mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#parent-dashboard' || hash === '#teen-dashboard' || hash === '#demo') {
      const demoEl = document.getElementById('demo');
      if (demoEl) {
        demoEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  // Active child helper
  const activeChild: ChildAccount =
    appState.children.find((c) => c.id === appState.activeChildId) || appState.children[0];

  // Select Child
  const handleSelectChild = (childId: string) => {
    setAppState((prev) => ({
      ...prev,
      activeChildId: childId,
    }));
  };

  // Add Child Profile
  const handleAddChild = (
    name: string,
    age: number,
    allowance: number,
    avatar: string,
    email?: string,
    password?: string
  ) => {
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const childEmail = email?.trim() || `${cleanSlug}.sharma@gmail.com`;
    const childPass = password?.trim() || `${cleanSlug}@2026`;
    const newId = 'child-' + Date.now();
    const newChild: ChildAccount = {
      id: newId,
      name,
      email: childEmail,
      password: childPass,
      age,
      avatar,
      allowance,
      spent: 0,
      saved: 0,
      balance: allowance,
      foodSpent: 0,
      foodLimit: Math.round(allowance * 0.3),
      transportSpent: 0,
      transportLimit: Math.round(allowance * 0.15),
      streakDays: 1,
      challengeCompleted: false,
      goals: [
        { id: 'g-' + Date.now(), name: 'First Savings Goal', icon: '🎯', current: 0, target: 1000 },
      ],
      budgets: [
        { id: 'b-' + Date.now(), name: 'Food & snacks', icon: '🍔', spent: 0, limit: Math.round(allowance * 0.3) },
      ],
      requests: [],
      walletHistory: [],
    };

    setAppState((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
      activeChildId: newId,
    }));
    showToast(`Enrolled ${name} (Age ${age}). Gmail: ${childEmail} · Password: ${childPass}`);
  };

  // Authentication handler for Parents & Students
  const handleAuthenticate = (
    role: 'parent' | 'student',
    emailInput: string,
    passwordInput: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (role === 'parent') {
      const isStudent = appState.children.some((c) => c.email.toLowerCase() === cleanEmail);
      if (isStudent) {
        return {
          success: false,
          error: 'Access Denied: Student accounts cannot access the Parent Console. Please use Student Sign In.',
        };
      }
      if (
        cleanEmail === appState.parent.email.toLowerCase() &&
        cleanPass === appState.parent.password
      ) {
        setAppState((prev) => ({
          ...prev,
          session: {
            isLoggedIn: true,
            role: 'parent',
            userId: prev.parent.id,
            name: prev.parent.name,
            email: prev.parent.email,
            avatar: prev.parent.avatar,
          },
        }));
        showToast(`Welcome back, ${appState.parent.name}! Parent console unlocked.`);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return { success: true };
      } else {
        return {
          success: false,
          error: `Invalid credentials for Parent. Demo: ${appState.parent.email} / ${appState.parent.password}`,
        };
      }
    } else {
      // Student login
      const matchedChild = appState.children.find(
        (c) => c.email.toLowerCase() === cleanEmail
      );
      if (!matchedChild) {
        return {
          success: false,
          error: `No student registered with ${emailInput}. Available: aarav.sharma@gmail.com, ananya.sharma@gmail.com, rohan.sharma@gmail.com`,
        };
      }
      if (matchedChild.password !== cleanPass) {
        return {
          success: false,
          error: `Incorrect password for ${matchedChild.name}. Demo password is: ${matchedChild.password}`,
        };
      }

      setAppState((prev) => ({
        ...prev,
        activeChildId: matchedChild.id,
        session: {
          isLoggedIn: true,
          role: 'student',
          userId: matchedChild.id,
          name: matchedChild.name,
          email: matchedChild.email,
          avatar: matchedChild.avatar,
        },
      }));
      showToast(`Welcome back, ${matchedChild.name}! Student wallet unlocked.`);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return { success: true };
    }
  };

  // Switch authenticated role or child
  const handleLogin = (role: 'parent' | 'teen', childId?: string) => {
    if (role === 'parent') {
      setAppState((prev) => ({
        ...prev,
        session: {
          isLoggedIn: true,
          role: 'parent',
          userId: prev.parent.id,
          name: prev.parent.name,
          email: prev.parent.email,
          avatar: prev.parent.avatar,
        },
      }));
      window.scrollTo({ top: 0, behavior: 'instant' });
      showToast(`Welcome to Parent Console, ${appState.parent.name}!`);
    } else {
      const targetChildId = childId || appState.activeChildId;
      const child = appState.children.find((c) => c.id === targetChildId) || appState.children[0];
      setAppState((prev) => ({
        ...prev,
        activeChildId: child.id,
        session: {
          isLoggedIn: true,
          role: 'student',
          userId: child.id,
          name: child.name,
          email: child.email,
          avatar: child.avatar,
        },
      }));
      window.scrollTo({ top: 0, behavior: 'instant' });
      showToast(`Welcome to ${child.name}’s Student Space!`);
    }
  };

  const handleSignOut = () => {
    setAppState((prev) => ({
      ...prev,
      session: {
        ...prev.session,
        isLoggedIn: false,
      },
    }));
    window.scrollTo({ top: 0, behavior: 'instant' });
    showToast('Signed out of Pocket Fund account.');
  };

  // Universal Action handling
  const handleOpenAction = (
    type: 'allowance' | 'request' | 'expense' | 'rule' | 'goal' | 'edit',
    childId?: string
  ) => {
    setActionType(type);
    setActionTargetChildId(childId || appState.activeChildId);
    setShowActionModal(true);
  };

  const handleSaveAction = (type: string, name: string, val: number, targetChildId?: string) => {
    const cId = targetChildId || appState.activeChildId;

    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        if (c.id !== cId) return c;

        if (type === 'allowance') {
          return { ...c, allowance: val };
        } else if (type === 'request') {
          const title = name.trim() || 'Allowance top-up';
          const newReq: RequestItem = {
            id: 'req-' + Date.now(),
            title,
            amount: val,
            who: c.name,
            childId: c.id,
            when: 'Just now',
            icon: '📝',
            desc: 'Special purchase requested by ' + c.name,
          };
          return { ...c, requests: [newReq, ...c.requests] };
        } else if (type === 'expense') {
          const detail = name.trim() || 'General expense';
          return {
            ...c,
            balance: Math.max(0, c.balance - val),
            spent: c.spent + val,
            foodSpent: c.foodSpent + val,
            walletHistory: [`✓ Logged ₹${val} for ${detail} · just now`, ...c.walletHistory],
          };
        } else if (type === 'rule') {
          const catName = name.trim() || 'New Category';
          const newBudget: BudgetItem = {
            id: 'budget-' + Date.now(),
            name: catName,
            spent: 0,
            limit: val,
          };
          return { ...c, budgets: [...c.budgets, newBudget] };
        } else if (type === 'goal') {
          const goalName = name.trim() || 'New Goal';
          const newGoal: SavingsGoal = {
            id: 'goal-' + Date.now(),
            name: goalName,
            icon: '🎯',
            current: 0,
            target: val,
          };
          return { ...c, goals: [...c.goals, newGoal] };
        }
        return c;
      }),
    }));

    const childTarget = appState.children.find((c) => c.id === cId) || activeChild;
    if (type === 'allowance') {
      showToast(`Updated ${childTarget.name}’s monthly allowance to ₹${val.toLocaleString('en-IN')}.`);
    } else if (type === 'request') {
      showToast(`Request for ₹${val} sent from ${childTarget.name} to Priya for review.`);
    } else if (type === 'expense') {
      showToast(`Expense of ₹${val} logged for ${childTarget.name}.`);
    } else if (type === 'rule') {
      showToast(`Added spending rule (${name} · ₹${val}) for ${childTarget.name}.`);
    } else if (type === 'goal') {
      showToast(`Savings goal "${name}" created for ${childTarget.name}!`);
    }
  };

  // UPI payment flow
  const handlePayRequest = (req: RequestItem) => {
    setPayingRequest(req);
    setShowUpiModal(true);
  };

  const handleCompleteUpi = (amount: number, reqId?: string) => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        const hasReq = c.requests.some((r) => r.id === reqId);
        if (hasReq) {
          return {
            ...c,
            balance: c.balance + amount,
            spent: c.spent + amount,
            requests: c.requests.filter((r) => r.id !== reqId),
          };
        }
        return c;
      }),
    }));
    showToast(`UPI payment of ₹${amount} completed! Allowance wallet updated.`);
  };

  const handleDeclineRequest = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => ({
        ...c,
        requests: c.requests.filter((r) => r.id !== id),
      })),
    }));
    showToast('Request declined. Notification sent to student.');
  };

  // Teen interactions
  const handleConfirmTeenPay = (amount: number, merchant: string) => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        if (c.id === prev.activeChildId) {
          return {
            ...c,
            balance: Math.max(0, c.balance - amount),
            spent: c.spent + amount,
            foodSpent: c.foodSpent + amount,
            walletHistory: [`✓ Paid ₹${amount} to ${merchant} · just now`, ...c.walletHistory],
          };
        }
        return c;
      }),
    }));
    showToast(`Successfully paid ₹${amount} to ${merchant} via Student Wallet!`);
  };

  const handleWalletPay = (amount: number, merchant: string) => {
    if (activeChild.balance < amount) {
      showToast('Not enough allowance available in student wallet.');
      return;
    }
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        if (c.id === prev.activeChildId) {
          return {
            ...c,
            balance: c.balance - amount,
            spent: c.spent + amount,
            foodSpent: merchant.includes('Café') || merchant.includes('Canteen') ? c.foodSpent + amount : c.foodSpent,
            transportSpent: merchant.includes('Metro') ? c.transportSpent + amount : c.transportSpent,
            walletHistory: [`✓ Paid ₹${amount} at ${merchant} · just now`, ...c.walletHistory],
          };
        }
        return c;
      }),
    }));
    showToast(`Demo wallet payment of ₹${amount} completed at ${merchant}.`);
  };

  const handleSaveTeenGoal = () => {
    if (activeChild.balance < 100) {
      showToast('Insufficient balance to move ₹100 into savings.');
      return;
    }

    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        if (c.id === prev.activeChildId) {
          const updatedGoals = c.goals.map((g, idx) => {
            if (idx === 0) {
              return { ...g, current: Math.min(g.target, g.current + 100) };
            }
            return g;
          });
          return {
            ...c,
            balance: c.balance - 100,
            saved: c.saved + 100,
            goals: updatedGoals,
          };
        }
        return c;
      }),
    }));
    showToast(`₹100 moved to ${activeChild.goals[0]?.name || 'savings goal'}!`);
  };

  const handleCompleteChallenge = () => {
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        if (c.id === prev.activeChildId) {
          return {
            ...c,
            challengeCompleted: true,
            streakDays: c.streakDays + 1,
          };
        }
        return c;
      }),
    }));
    showToast('🏅 Challenge complete! Badge unlocked: Thoughtful Spender.');
  };

  const handleResetDemo = () => {
    setAppState(INITIAL_STATE);
    setLandingRequestApproved(false);
    setLandingRequestDeclined(false);
    showToast('Demo data restored to initial sample family values.');
  };

  // Landing page preview interactions
  const handleApproveLandingRequest = () => {
    setLandingRequestApproved(true);
    setAppState((prev) => ({
      ...prev,
      children: prev.children.map((c) => {
        if (c.id === 'child-1') {
          return {
            ...c,
            spent: c.spent + 350,
            balance: c.balance + 350,
          };
        }
        return c;
      }),
    }));
    showToast('Request approved! ₹350 added to Aarav’s allowance.');
  };

  const handleDeclineLandingRequest = () => {
    setLandingRequestDeclined(true);
    showToast('Request declined. Aarav was asked to update details.');
  };

  return (
    <div className={`pocket-fund-app ${isDarkTheme ? 'dark-theme' : ''}`}>
      {/* Toast Feedback */}
      <div className={`toast ${toastVisible ? 'show' : ''}`} role="status">
        {toastMessage}
      </div>

      {/* Dynamic View Routing: Dedicated Full Webpage After Login, Landing Page When Not Logged In */}
      {appState.session.isLoggedIn ? (
        appState.session.role === 'parent' ? (
          <ParentWebpage
            state={appState}
            activeChild={activeChild}
            onSelectChild={handleSelectChild}
            onOpenAddChild={() => setShowAddChildModal(true)}
            onOpenAction={handleOpenAction}
            onPayRequest={handlePayRequest}
            onDeclineRequest={handleDeclineRequest}
            onSignOut={handleSignOut}
            onResetDemo={handleResetDemo}
            showToast={showToast}
            isDarkTheme={isDarkTheme}
            onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
          />
        ) : (
          <StudentWebpage
            child={activeChild}
            onOpenAction={(type) => handleOpenAction(type, activeChild.id)}
            onOpenQrScanner={() => setShowTeenQrModal(true)}
            onWalletPay={handleWalletPay}
            onSaveTeenGoal={handleSaveTeenGoal}
            onCompleteChallenge={handleCompleteChallenge}
            onSignOut={handleSignOut}
            isDarkTheme={isDarkTheme}
            onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
            showToast={showToast}
          />
        )
      ) : (
        <LandingPage
          onOpenPilot={() => setShowPilotModal(true)}
          onOpenLogin={handleOpenLogin}
          onOpenSiteAi={() => setShowSiteAiModal(true)}
          showToast={showToast}
          isDarkTheme={isDarkTheme}
          onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        />
      )}

      {/* Modals Container */}
      <Modals
        state={appState}
        activeChild={activeChild}
        showPilotModal={showPilotModal}
        setShowPilotModal={setShowPilotModal}
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginInitialRole={loginInitialRole}
        loginInitialEmail={loginInitialEmail}
        showActionModal={showActionModal}
        setShowActionModal={setShowActionModal}
        actionType={actionType}
        actionTargetChildId={actionTargetChildId}
        showAddChildModal={showAddChildModal}
        setShowAddChildModal={setShowAddChildModal}
        showUpiModal={showUpiModal}
        setShowUpiModal={setShowUpiModal}
        payingRequest={payingRequest}
        showTeenQrModal={showTeenQrModal}
        setShowTeenQrModal={setShowTeenQrModal}
        showSiteAiModal={showSiteAiModal}
        setShowSiteAiModal={setShowSiteAiModal}
        onLogin={handleLogin}
        onAuthenticate={handleAuthenticate}
        onSaveAction={handleSaveAction}
        onAddChild={handleAddChild}
        onCompleteUpi={handleCompleteUpi}
        onConfirmTeenPay={handleConfirmTeenPay}
        showToast={showToast}
      />
    </div>
  );
}
