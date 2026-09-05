import React from 'react';
import { ChildAccount } from '../types';
import { TeenDashboard } from './TeenDashboard';

interface StudentWebpageProps {
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

export const StudentWebpage: React.FC<StudentWebpageProps> = ({
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
  return (
    <div className="portal-webpage-root" style={{ minHeight: '100vh', background: '#05111d' }}>
      {/* Top Application Navigation Bar for Separate Student Webpage */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(5, 17, 29, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #133350',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Brand & Student Space Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#dbeaf5',
              cursor: 'pointer',
            }}
            onClick={onSignOut}
            title="Pocket Fund Companion Wallet"
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#38bdf8',
                color: '#041421',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              ₹
            </span>
            <span>Pocket Fund</span>
          </div>

          <div
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
          </div>
        </div>

        {/* Center: Wallet Balance & Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#081e33',
              border: '1px solid #19466f',
              borderRadius: '10px',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: '#799ab2', fontWeight: 600 }}>WALLET BALANCE:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
              ₹{child.balance.toLocaleString('en-IN')}
            </span>
          </div>

          <div
            style={{
              background: '#081e33',
              border: '1px solid #19466f',
              borderRadius: '10px',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔥</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b' }}>
              {child.streakDays}-Day Streak
            </span>
          </div>
        </div>

        {/* Right: Student Identity, Theme & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              background: '#092136',
              borderRadius: '8px',
              border: '1px solid #164064',
            }}
          >
            <div style={{ fontSize: '1rem' }}>{child.avatar}</div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dbeaf5' }}>
                {child.name}
              </div>
              <div style={{ fontSize: '0.64rem', color: '#799ab2' }}>{child.email}</div>
            </div>
          </div>

          <button
            type="button"
            className="btn small secondary"
            onClick={onToggleTheme}
            title={isDarkTheme ? 'Switch to Light mode' : 'Switch to Dark mode'}
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
          >
            {isDarkTheme ? '☀️' : '🌙'}
          </button>

          <button
            type="button"
            className="btn small"
            onClick={onSignOut}
            title="Sign out of Student Space and return to main website"
            style={{
              padding: '7px 14px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0f3a58',
              color: '#38bdf8',
              border: '1px solid #1e5a88',
              boxShadow: 'none',
            }}
          >
            <span>←</span> Return to Website / Sign Out
          </button>
        </div>
      </header>

      {/* Main Full-Screen Student Dashboard Workspace */}
      <div style={{ width: '100%', minHeight: 'calc(100vh - 60px)' }}>
        <TeenDashboard
          child={child}
          onOpenAction={onOpenAction}
          onOpenQrScanner={onOpenQrScanner}
          onWalletPay={onWalletPay}
          onSaveTeenGoal={onSaveTeenGoal}
          onCompleteChallenge={onCompleteChallenge}
          onSignOut={onSignOut}
          isDarkTheme={isDarkTheme}
          onToggleTheme={onToggleTheme}
          showToast={showToast}
        />
      </div>
    </div>
  );
};
