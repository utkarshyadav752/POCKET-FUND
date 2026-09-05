import React from 'react';
import { AppState, RequestItem, ChildAccount } from '../types';
import { ParentDashboard } from './ParentDashboard';

interface ParentWebpageProps {
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
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export const ParentWebpage: React.FC<ParentWebpageProps> = ({
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
  isDarkTheme,
  onToggleTheme,
}) => {
  const pendingRequestsCount = state.children.reduce(
    (acc, c) => acc + (c.requests?.length || 0),
    0
  );

  return (
    <div className="portal-webpage-root" style={{ minHeight: '100vh', background: '#05111d' }}>
      {/* Top Application Navigation Bar for Separate Parent Webpage */}
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
        {/* Left: Brand & Portal Badge */}
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
            title="Pocket Fund Family Banking"
          >
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#2dd4bf',
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
          </div>
        </div>

        {/* Center: Child Managing Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#081a2b',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #153a5c',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: '#799ab2', fontWeight: 700, paddingLeft: '4px' }}>
            MANAGING:
          </span>
          {state.children.map((c) => {
            const isSelected = c.id === activeChild.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelectChild(c.id);
                  showToast(`Now managing ${c.name}'s account.`);
                }}
                style={{
                  background: isSelected ? '#103c58' : 'transparent',
                  color: isSelected ? '#2dd4bf' : '#94a3b8',
                  border: isSelected ? '1px solid #2dd4bf' : '1px solid transparent',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: '0.15s ease',
                }}
              >
                <span>{c.avatar}</span>
                <span>{c.name}</span>
                <span style={{ fontSize: '0.66rem', opacity: 0.7 }}>({c.age}y)</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenAddChild}
            style={{
              background: 'transparent',
              color: '#2dd4bf',
              border: '1px dashed rgba(45, 212, 191, 0.4)',
              borderRadius: '8px',
              padding: '5px 9px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Enroll new child profile"
          >
            + Add Child
          </button>
        </div>

        {/* Right: Parent Profile, Pending badge & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {pendingRequestsCount > 0 && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>📩</span> {pendingRequestsCount} Pending Request{pendingRequestsCount > 1 ? 's' : ''}
            </span>
          )}

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
            <div style={{ fontSize: '1rem' }}>{state.parent.avatar}</div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dbeaf5' }}>
                {state.parent.name}
              </div>
              <div style={{ fontSize: '0.64rem', color: '#799ab2' }}>Guardian Account</div>
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
            className="btn small secondary"
            onClick={() => {
              onResetDemo();
              showToast('Demo data restored to original sample values.');
            }}
            title="Reset demo data"
            style={{ padding: '6px 10px', fontSize: '0.72rem' }}
          >
            ↺ Reset
          </button>

          <button
            type="button"
            className="btn small"
            onClick={onSignOut}
            title="Sign out of Parent Console and return to main website"
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

      {/* Main Full-Screen Parent Dashboard Workspace */}
      <div style={{ width: '100%', minHeight: 'calc(100vh - 60px)' }}>
        <ParentDashboard
          state={state}
          activeChild={activeChild}
          onSelectChild={onSelectChild}
          onOpenAddChild={onOpenAddChild}
          onOpenAction={onOpenAction}
          onPayRequest={onPayRequest}
          onDeclineRequest={onDeclineRequest}
          onSignOut={onSignOut}
          onResetDemo={onResetDemo}
          showToast={showToast}
        />
      </div>
    </div>
  );
};
