import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PptxDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

type SlideCategory = 'all' | 'pitch' | 'blank-masters';

export const PptxDeckModal: React.FC<PptxDeckModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<SlideCategory>('all');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const [showHowToGuide, setShowHowToGuide] = useState(false);

  // Hidden offscreen container for batch rendering full 1920x1080 slide elements
  const offscreenSlidesRef = useRef<HTMLDivElement>(null);
  // Active slide preview element
  const activeSlideRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const SLIDES = [
    {
      id: 'slide-cover',
      type: 'pitch',
      title: 'Title & Cover Pitch',
      desc: 'Hero pitch slide with Pocket Fund brand, tagline & executive contacts',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 80% 20%, #0d384d 0%, transparent 45%), radial-gradient(circle at 15% 85%, #0d2840 0%, transparent 45%), linear-gradient(135deg, #05111d 0%, #081a2b 55%, #05101a 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
          }}
        >
          {/* Subtle geometric financial grid lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />

          {/* Large Watermark */}
          <div
            style={{
              position: 'absolute',
              right: '30px',
              top: '50%',
              transform: 'translateY(-50%) rotate(-10deg)',
              fontSize: '280px',
              fontWeight: 900,
              color: 'rgba(45, 212, 191, 0.03)',
              userSelect: 'none',
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            ₹
          </div>

          {/* Top Header Bar */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
                  color: '#041421',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  boxShadow: '0 8px 24px rgba(45, 212, 191, 0.3)',
                }}
              >
                ₹
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                  Pocket Fund
                </div>
                <div style={{ fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Parent-Guided Companion Banking
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(45, 212, 191, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                padding: '6px 16px',
                borderRadius: '30px',
                fontSize: '0.76rem',
                color: '#2dd4bf',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              FINANCIAL EDUCATION PLATFORM · 2026
            </div>
          </div>

          {/* Center Main Presentation Copy */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: 'auto 0' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '5px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <span>✦</span> The Future of Indian Teen Financial Literacy
            </div>

            <h1
              style={{
                fontSize: '3.4rem',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                margin: '0 0 20px',
              }}
            >
              Money skills don’t start at eighteen.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                They start here.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.22rem',
                lineHeight: 1.55,
                color: '#94a3b8',
                margin: '0 0 28px',
                maxWidth: '740px',
              }}
            >
              A parent-guided smart allowance platform helping Indian teenagers build responsible money habits
              through dual companion wallets, categorized budgets, and RBI-compliant UPI guardrails.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
                <span style={{ color: '#2dd4bf', fontSize: '1.1rem' }}>✓</span> 0% Overdraft Risk
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
                <span style={{ color: '#2dd4bf', fontSize: '1.1rem' }}>✓</span> Real UPI Companion Scanner
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
                <span style={{ color: '#2dd4bf', fontSize: '1.1rem' }}>✓</span> Multi-Child Parent Console
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.88rem', fontWeight: 600 }}>
                <span style={{ color: '#2dd4bf', fontSize: '1.1rem' }}>✓</span> Goal-Saving Habits
              </div>
            </div>
          </div>

          {/* Bottom Footer Metadata */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              fontSize: '0.78rem',
              color: '#64748b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span>
                <strong style={{ color: '#cbd5e1' }}>Lead Founder:</strong> Utkarsh Yadav (+91 9554460651)
              </span>
              <span>
                <strong style={{ color: '#cbd5e1' }}>Desk:</strong> utkarshyadav752@gmail.com
              </span>
            </div>
            <div style={{ color: '#2dd4bf', fontWeight: 600 }}>
              Confidential Presentation Deck · Slide 01
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-problem',
      type: 'pitch',
      title: 'Problem & Opportunity',
      desc: 'Market realities of 250M+ Indian teens moving from cash to unmonitored UPI',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 20% 20%, #0c2b42 0%, transparent 50%), linear-gradient(135deg, #05111d 0%, #091d31 60%, #05111d 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
          }}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#f59e0b', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                THE MARKET NEED
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
                The Cash-to-Digital Gap for 250M+ Indian Youth
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pocket Fund Pitch Deck</div>
              <div style={{ fontSize: '0.9rem', color: '#2dd4bf', fontWeight: 700 }}>Slide 02</div>
            </div>
          </div>

          {/* 3 Pillar Problem Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', margin: 'auto 0' }}>
            <div
              style={{
                background: 'rgba(15, 34, 53, 0.8)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>💸</div>
              <div style={{ color: '#f43f5e', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Pain Point 01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>
                Untracked Cash Handouts
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                78% of teenagers receive ad-hoc paper notes or direct parent account UPI transfers with zero
                categorization, zero receipts, and perpetual month-end friction.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.76rem', color: '#cbd5e1' }}>
                Result: Zero financial visibility for parents
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 34, 53, 0.8)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>⚠️</div>
              <div style={{ color: '#f59e0b', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Pain Point 02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>
                Unsafe UPI Exposure
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Allowing minors to use adult bank accounts or open payment links exposes families to accidental
                drainage, predatory in-game microtransactions, and fraud.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.76rem', color: '#cbd5e1' }}>
                Result: Severe safety risk & anxiety
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 34, 53, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>📉</div>
              <div style={{ color: '#38bdf8', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                Pain Point 03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>
                No Saving Habit Formation
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Schools teach trigonometry, not compounding or budgeting. Teens enter college or work without ever
                experiencing goal-based delayed gratification or budget tradeoffs.
              </p>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.76rem', color: '#cbd5e1' }}>
                Result: Lifelong vulnerability to bad debt
              </div>
            </div>
          </div>

          {/* Bottom Highlight Banner */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(45, 212, 191, 0.12) 0%, rgba(56, 189, 248, 0.12) 100%)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
              borderRadius: '12px',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                The Solution: Give teens real, supervised autonomy before mistakes become expensive.
              </span>
            </div>
            <span style={{ color: '#2dd4bf', fontWeight: 700 }}>Pocket Fund Bridge</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-solution',
      type: 'pitch',
      title: 'Dual-Space Architecture',
      desc: 'Supervised autonomy: Parent Admin Console paired with Student Companion Wallet',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 80% 80%, #0d384d 0%, transparent 45%), linear-gradient(135deg, #05111d 0%, #07192a 60%, #05111d 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#2dd4bf', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                PLATFORM ARCHITECTURE
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
                Two Synchronized Spaces. Zero Friction.
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pocket Fund Pitch Deck</div>
              <div style={{ fontSize: '0.9rem', color: '#2dd4bf', fontWeight: 700 }}>Slide 03</div>
            </div>
          </div>

          {/* Dual Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', margin: 'auto 0' }}>
            {/* Left Column: Parent */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(13, 38, 62, 0.7) 0%, rgba(9, 25, 41, 0.7) 100%)',
                border: '1px solid rgba(45, 212, 191, 0.35)',
                borderRadius: '18px',
                padding: '30px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>👩</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700 }}>
                      Parent Supervisory Console
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#2dd4bf', fontWeight: 600 }}>
                      Administrative Control &amp; Approvals
                    </div>
                  </div>
                </div>
                <span style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                  SUPERVISOR
                </span>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#2dd4bf', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>Multi-Child Management:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Configure customized rules for children aged 12 to 17 from a single unified screen.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#2dd4bf', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>Scheduled Monthly Allowances:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Automated deposits with categorized allowances (Food, Transit, Stationery, Savings).
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#2dd4bf', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>1-Tap UPI Request Fulfillment:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Instantly approve or decline itemized top-ups via standard UPI handles (GPay, PhonePe, Paytm).
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#2dd4bf', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>MCC Merchant Category Filtering:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Adult sites, betting, alcohol, and high-risk merchants automatically declined at network level.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Teen */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(14, 42, 69, 0.7) 0%, rgba(9, 26, 44, 0.7) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '18px',
                padding: '30px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>🧑</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700 }}>
                      Student Companion Space
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                      Everyday Wallet &amp; Habit Builder
                    </div>
                  </div>
                </div>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                  COMPANION
                </span>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>Zero-Overdraft Prepaid Wallet:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Teens can only spend what they have—building disciplined budgeting from day one.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>Real Companion QR Scanner:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Pay at school canteens, stationery stores, and transit with daily safety caps.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>Interactive Savings Goals:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Set visual targets (Headphones, Fest tickets) and allocate funds with 1-tap savings.
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>✓</span>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>Gamified Streak &amp; Challenges:</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Streaks and micro-challenges celebrate deliberate pauses and delayed gratification.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '0.78rem', color: '#64748b' }}>
            <span>RBI-regulated PPI rails · Zero secondary debt or credit risk</span>
            <span style={{ color: '#2dd4bf' }}>Pocket Fund Architecture</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-features',
      type: 'pitch',
      title: 'Core Product Capabilities',
      desc: 'Interactive feature suite: Allowance scheduler, category limits, goals & top-ups',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 30% 70%, #0d2c44 0%, transparent 50%), linear-gradient(135deg, #05111d 0%, #081a2c 60%, #05111d 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                PRODUCT SUITE &amp; WORKFLOW
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
                Engineered for Daily Family Realities
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pocket Fund Pitch Deck</div>
              <div style={{ fontSize: '0.9rem', color: '#2dd4bf', fontWeight: 700 }}>Slide 04</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', margin: 'auto 0' }}>
            <div style={{ background: 'rgba(12, 32, 51, 0.7)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '14px', padding: '22px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>📅</div>
              <h4 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 8px' }}>Smart Allowance</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Set recurring monthly allowances calibrated to age (12–17) and city tiers (Metro vs. Tier-2) automatically.
              </p>
            </div>

            <div style={{ background: 'rgba(12, 32, 51, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '14px', padding: '22px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>📊</div>
              <h4 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 8px' }}>Category Envelopes</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Enforce budgets for Food &amp; Canteens, Transit, and Books. Teens see remaining balances before spending.
              </p>
            </div>

            <div style={{ background: 'rgba(12, 32, 51, 0.7)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '22px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🎯</div>
              <h4 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 8px' }}>Goal Stashes</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Visual progress bars for items teens covet. Teaches intentional delayed gratification over impulse shopping.
              </p>
            </div>

            <div style={{ background: 'rgba(12, 32, 51, 0.7)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '14px', padding: '22px' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>📲</div>
              <h4 style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 8px' }}>1-Tap UPI Top-Up</h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                When unexpected school costs arise, teens request with details and parents fulfill in 3 seconds via UPI.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '0.78rem', color: '#64748b' }}>
            <span>Available on iOS, Android, and Web Browser Consoles</span>
            <span style={{ color: '#2dd4bf' }}>Product Overview</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-traction',
      type: 'pitch',
      title: 'Business Model & Pilot Traction',
      desc: 'Unit economics, 150+ family pilot program, and monetization streams',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 75% 25%, #0e3547 0%, transparent 45%), linear-gradient(135deg, #05111d 0%, #07192b 60%, #05111d 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                GROWTH &amp; BUSINESS MODEL
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
                Early Traction &amp; Multi-Stream Monetization
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pocket Fund Pitch Deck</div>
              <div style={{ fontSize: '0.9rem', color: '#2dd4bf', fontWeight: 700 }}>Slide 05</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', margin: 'auto 0' }}>
            {/* Traction metrics */}
            <div style={{ background: 'rgba(10, 28, 45, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '26px' }}>
              <div style={{ color: '#10b981', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px' }}>
                Early Family Pilot Traction
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#071b2d', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>150+</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Pilot Families</div>
                </div>
                <div style={{ background: '#071b2d', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>94%</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Parent Approval</div>
                </div>
                <div style={{ background: '#071b2d', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>₹0</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Pilot Starter Fee</div>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                Pilot cohorts onboarded across Delhi-NCR, Mumbai, and Bengaluru demonstrate a 68% reduction in monthly
                allowance friction and a 3.4× increase in teen self-reported savings habits.
              </p>
            </div>

            {/* Monetization Streams */}
            <div style={{ background: 'rgba(10, 28, 45, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '26px' }}>
              <div style={{ color: '#38bdf8', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '14px' }}>
                Revenue Channels
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>1.</span>
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '0.84rem' }}>Family Premium Subscription:</strong>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Advanced multi-child rules, credit simulator, AI advice (₹99/mo).</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>2.</span>
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '0.84rem' }}>Interchange Revenue Share:</strong>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Standard interchange earnings on PPI card/companion merchant spends.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800 }}>3.</span>
                  <div>
                    <strong style={{ color: '#ffffff', fontSize: '0.84rem' }}>School Campus Partnerships:</strong>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Institutional financial literacy curriculum &amp; canteen cards.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '0.78rem', color: '#64748b' }}>
            <span>Targeting 50,000 active families in Year 1 across top 8 metropolitan hubs</span>
            <span style={{ color: '#2dd4bf' }}>Business &amp; Unit Economics</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-team',
      type: 'pitch',
      title: 'Founding Team & Leadership',
      desc: 'Meet Utkarsh Yadav, Madhulika Maurya, Sejal Sahu & Shameen Khan',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 10%, #0e2a44 0%, transparent 45%), linear-gradient(135deg, #05111d 0%, #071728 60%, #05111d 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#2dd4bf', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                EXECUTIVE LEADERSHIP
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
                The Team Building Pocket Fund
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pocket Fund Pitch Deck</div>
              <div style={{ fontSize: '0.9rem', color: '#2dd4bf', fontWeight: 700 }}>Slide 06</div>
            </div>
          </div>

          {/* 4 Founder Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', margin: 'auto 0' }}>
            {/* Utkarsh */}
            <div style={{ background: 'rgba(9, 26, 44, 0.8)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src="/utkarsh.jpg"
                  alt="Utkarsh Yadav"
                  referrerPolicy="no-referrer"
                  style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #2dd4bf' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Utkarsh Yadav</h4>
                  <div style={{ fontSize: '0.7rem', color: '#2dd4bf', fontWeight: 700 }}>Lead Founder &amp; CEO</div>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 10px', flex: 1 }}>
                Directs product strategy, RBI partner banking rails, and customer operations.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.68rem', color: '#38bdf8' }}>
                📞 +91 9554460651
              </div>
            </div>

            {/* Madhulika */}
            <div style={{ background: 'rgba(9, 26, 44, 0.8)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src="/madhulika.jpg"
                  alt="Madhulika Maurya"
                  referrerPolicy="no-referrer"
                  style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #2dd4bf' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Madhulika Maurya</h4>
                  <div style={{ fontSize: '0.7rem', color: '#2dd4bf', fontWeight: 700 }}>Curriculum Lead</div>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 10px', flex: 1 }}>
                Designs teen micro-learning modules, gamified savings targets &amp; budgeting challenges.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.68rem', color: '#cbd5e1' }}>
                ✉️ madhulikamaurya9@gmail.com
              </div>
            </div>

            {/* Sejal */}
            <div style={{ background: 'rgba(9, 26, 44, 0.8)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src="/sejal.jpg"
                  alt="Sejal Sahu"
                  referrerPolicy="no-referrer"
                  style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #2dd4bf' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Sejal Sahu</h4>
                  <div style={{ fontSize: '0.7rem', color: '#2dd4bf', fontWeight: 700 }}>Design &amp; UX Lead</div>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 10px', flex: 1 }}>
                Architects frictionless user experience, accessibility, and teen companion interfaces.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.68rem', color: '#cbd5e1' }}>
                ✉️ sejalsahu0106@gmail.com
              </div>
            </div>

            {/* Shameen */}
            <div style={{ background: 'rgba(9, 26, 44, 0.8)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src="/shameen.jpg"
                  alt="Shameen Khan"
                  referrerPolicy="no-referrer"
                  style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #2dd4bf' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Shameen Khan</h4>
                  <div style={{ fontSize: '0.7rem', color: '#2dd4bf', fontWeight: 700 }}>Engineering Lead</div>
                </div>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 10px', flex: 1 }}>
                Leads real-time payment state machines, QR transaction engines, and bank APIs.
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontSize: '0.68rem', color: '#cbd5e1' }}>
                ✉️ shameenkhan964@gmail.com
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', fontSize: '0.78rem', color: '#64748b' }}>
            <span>Connect with our founders directly for partnership, investment, or pilot inquiries</span>
            <span style={{ color: '#2dd4bf' }}>Founding Team</span>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-blank-dark',
      type: 'blank-masters',
      title: 'Blank Master Background (Dark Theme)',
      desc: '16:9 clean dark PPTX background with brand badge, grid & safe zones for custom text',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 85% 15%, #0f3d52 0%, transparent 42%), radial-gradient(circle at 10% 90%, #0d2840 0%, transparent 45%), linear-gradient(135deg, #05111d 0%, #081a2b 55%, #05101a 100%)',
            padding: '45px 65px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
            overflow: 'hidden',
          }}
        >
          {/* Subtle grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />

          {/* Watermark in corner */}
          <div
            style={{
              position: 'absolute',
              right: '25px',
              bottom: '25px',
              fontSize: '180px',
              fontWeight: 900,
              color: 'rgba(45, 212, 191, 0.025)',
              userSelect: 'none',
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            ₹
          </div>

          {/* Master Slide Header Zone */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
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
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                Pocket Fund
              </span>
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
              }}
            >
              PPTX SLIDE BACKGROUND · 16:9 WIDESCREEN
            </div>
          </div>

          {/* Center Safe Presentation Canvas (Guideline frame) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              flex: 1,
              margin: '25px 0',
              border: '1px dashed rgba(45, 212, 191, 0.18)',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.015)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(45, 212, 191, 0.12)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                color: '#2dd4bf',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              PPTX MASTER CONTENT CANVAS
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 10px' }}>
              Insert Your Custom Slide Title &amp; Content Here
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#94a3b8', maxWidth: '580px', margin: '0 0 16px', lineHeight: 1.5 }}>
              This 16:9 widescreen master background provides generous negative space, ambient illumination, and
              unobtrusive brand accents designed specifically for PowerPoint text, charts, and diagrams.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Right-click slide in PowerPoint → Format Background → Picture Fill → Select this downloaded PNG
            </div>
          </div>

          {/* Master Slide Footer Zone */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '12px',
              fontSize: '0.72rem',
              color: '#64748b',
            }}
          >
            <div>Pocket Fund — Money skills start here</div>
            <div>Slide Number [ # ]</div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-blank-light',
      type: 'blank-masters',
      title: 'Blank Master Background (Light Theme)',
      desc: 'Crisp executive light 16:9 background for daylight presentations & conferences',
      render: () => (
        <div
          className="pptx-slide-canvas light-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 85% 15%, #e0f2fe 0%, transparent 40%), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)',
            padding: '45px 65px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#0f172a',
            overflow: 'hidden',
          }}
        >
          {/* Subtle grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />

          {/* Watermark in corner */}
          <div
            style={{
              position: 'absolute',
              right: '25px',
              bottom: '25px',
              fontSize: '180px',
              fontWeight: 900,
              color: 'rgba(15, 23, 42, 0.025)',
              userSelect: 'none',
              pointerEvents: 'none',
              lineHeight: 1,
            }}
          >
            ₹
          </div>

          {/* Master Slide Header Zone */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#0d9488',
                  color: '#ffffff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                }}
              >
                ₹
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Pocket Fund
              </span>
            </div>

            <div
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
              }}
            >
              LIGHT EXECUTIVE MASTER · 16:9 WIDESCREEN
            </div>
          </div>

          {/* Center Safe Presentation Canvas (Guideline frame) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              flex: 1,
              margin: '25px 0',
              border: '1px dashed rgba(13, 148, 136, 0.3)',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.65)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(13, 148, 136, 0.1)',
                border: '1px solid rgba(13, 148, 136, 0.25)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                color: '#0f766e',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              EXECUTIVE LIGHT SLIDE CANVAS
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 700, margin: '0 0 10px' }}>
              Insert Daylight Conference Presentation Text &amp; Metrics
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', maxWidth: '580px', margin: '0 0 16px', lineHeight: 1.5 }}>
              High-contrast, publication-grade light background ideal for projector viewing, investor handouts, and
              formal corporate slides.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Right-click slide in PowerPoint → Format Background → Picture Fill → Select this downloaded PNG
            </div>
          </div>

          {/* Master Slide Footer Zone */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(15, 23, 42, 0.08)',
              paddingTop: '12px',
              fontSize: '0.72rem',
              color: '#64748b',
            }}
          >
            <div>Pocket Fund — Parent-Guided Digital Banking</div>
            <div>Slide Number [ # ]</div>
          </div>
        </div>
      ),
    },
    {
      id: 'slide-divider',
      type: 'blank-masters',
      title: 'Section Header / Divider Slide',
      desc: 'Dramatic transition slide background for new chapters or Q&A sections',
      render: () => (
        <div
          className="pptx-slide-canvas dark-bg"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, #0d384d 0%, transparent 60%), linear-gradient(135deg, #05111d 0%, #061524 55%, #05101a 100%)',
            padding: '50px 70px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: '"Plus Jakarta Sans", Inter, -apple-system, sans-serif',
            color: '#e2e8f0',
            overflow: 'hidden',
          }}
        >
          {/* Subtle grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
              color: '#041421',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: '2rem',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(45, 212, 191, 0.3)',
            }}
          >
            ₹
          </div>

          <div
            style={{
              color: '#2dd4bf',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            CHAPTER TRANSITION
          </div>

          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 16px',
              maxWidth: '700px',
              lineHeight: 1.15,
            }}
          >
            Section Title / Discussion Topic
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '520px', margin: '0 0 28px', lineHeight: 1.5 }}>
            Use this dramatic minimalist slide to introduce key agenda sections, financial demonstrations, or the Q&amp;A conclusion.
          </p>

          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Pocket Fund Presentation Deck · 16:9 Widescreen
          </div>
        </div>
      ),
    },
  ];

  const filteredSlides = SLIDES.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.type === filterCategory;
  });

  const activeSlide = SLIDES[activeSlideIndex] || SLIDES[0];

  // Export current slide as 1920x1080 PNG for PPTX background
  const handleDownloadCurrentSlidePng = async () => {
    try {
      setIsExportingPng(true);
      showToast('Rendering crisp 1920×1080 slide background...');

      // Find the offscreen slide container for true 1920x1080 pixel-perfect rendering
      const targetEl = document.getElementById(`offscreen-slide-${activeSlide.id}`);
      if (!targetEl) throw new Error('Target slide element not found');

      const canvas = await html2canvas(targetEl, {
        scale: 1, // Target element is already 1920x1080
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#05111d',
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `PocketFund_PPTX_Background_${activeSlide.id}.png`;
      link.href = dataUrl;
      link.click();

      showToast(`Downloaded 1920×1080 PNG for "${activeSlide.title}"!`);
    } catch (err) {
      console.error(err);
      showToast('Error generating slide PNG. Please try again.');
    } finally {
      setIsExportingPng(false);
    }
  };

  // Export all slides as a multi-page 16:9 PDF deck for presentations & PPTX backgrounds
  const handleDownloadFullPdfDeck = async () => {
    try {
      setIsExportingPdf(true);
      showToast('Compiling 16:9 Presentation PDF deck...');

      // 16:9 ratio in landscape: standard 297mm width x 167.06mm height
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [297, 167.06],
      });

      for (let i = 0; i < SLIDES.length; i++) {
        const slide = SLIDES[i];
        setExportProgress(`Generating slide ${i + 1} of ${SLIDES.length}: ${slide.title}...`);

        const targetEl = document.getElementById(`offscreen-slide-${slide.id}`);
        if (targetEl) {
          const canvas = await html2canvas(targetEl, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#05111d',
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          if (i > 0) {
            pdf.addPage([297, 167.06], 'landscape');
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, 297, 167.06);
        }
      }

      pdf.save('PocketFund_PPTX_Background_Deck_16x9.pdf');
      showToast('16:9 Presentation PDF successfully downloaded!');
    } catch (err) {
      console.error(err);
      showToast('Error generating PDF deck. Please try again.');
    } finally {
      setIsExportingPdf(false);
      setExportProgress('');
    }
  };

  // Native Vector Browser Print / PDF
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div
      className="modal-overlay pptx-deck-modal-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(3, 10, 18, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="modal-box pptx-modal-box"
        style={{
          width: '100%',
          maxWidth: '1280px',
          maxHeight: '92vh',
          background: '#071829',
          border: '1px solid #163e63',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#cbd5e1',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            background: '#051322',
            borderBottom: '1px solid #133554',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2dd4bf 0%, #0284c7 100%)',
                color: '#041421',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
              }}
            >
              📑
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                PPTX Presentation Deck &amp; Slide Background Studio
              </div>
              <div style={{ fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 600 }}>
                High-Resolution 16:9 Widescreen PDF &amp; PNGs for PowerPoint, Pitch Decks &amp; Google Slides
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn outline small"
              onClick={() => setShowHowToGuide(!showHowToGuide)}
              style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span>💡</span> {showHowToGuide ? 'Hide PPTX Guide' : 'How to use in PPTX'}
            </button>

            <button
              type="button"
              className="btn secondary small"
              onClick={handlePrintPdf}
              title="Print to PDF using browser vector engine"
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              🖨️ Print / Save Vector PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.4rem',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '4px 8px',
              }}
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* How to use in PowerPoint helper card */}
        {showHowToGuide && (
          <div
            style={{
              background: 'linear-gradient(90deg, #092640 0%, #0b3254 100%)',
              borderBottom: '1px solid #1a5180',
              padding: '12px 24px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📌</span>
              <span>
                <strong>How to set in PowerPoint (PPTX) or Google Slides in 2 steps:</strong> Download the 1920×1080 PNG
                → In PowerPoint, right click your slide → <em>Format Background</em> → <em>Picture or texture fill</em> →
                Insert downloaded image!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowHowToGuide(false)}
              style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Main Content (2-Column: Left Carousel Preview, Right Slide Thumbnails & Action Controls) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Left: 16:9 Slide Canvas Preview */}
          <div
            style={{
              padding: '24px',
              background: '#040d16',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 16:9 Aspect Ratio Container */}
            <div
              style={{
                width: '100%',
                maxWidth: '860px',
                aspectRatio: '16 / 9',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(45, 212, 191, 0.25)',
                position: 'relative',
              }}
              ref={activeSlideRef}
            >
              {activeSlide.render()}
            </div>

            {/* Slide Navigation Controls & Metadata */}
            <div
              style={{
                width: '100%',
                maxWidth: '860px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="btn secondary small"
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                  style={{ opacity: activeSlideIndex === 0 ? 0.5 : 1, padding: '6px 12px' }}
                >
                  ← Previous Slide
                </button>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                  Slide {activeSlideIndex + 1} of {SLIDES.length}
                </span>
                <button
                  type="button"
                  className="btn secondary small"
                  disabled={activeSlideIndex === SLIDES.length - 1}
                  onClick={() => setActiveSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
                  style={{ opacity: activeSlideIndex === SLIDES.length - 1 ? 0.5 : 1, padding: '6px 12px' }}
                >
                  Next Slide →
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#2dd4bf', background: 'rgba(45, 212, 191, 0.12)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                  1920 × 1080 Widescreen 16:9
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Deck Actions, Category Filter, and Thumbnails */}
          <div
            style={{
              background: '#071829',
              borderLeft: '1px solid #133554',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Download Buttons Section */}
            <div style={{ padding: '16px', borderBottom: '1px solid #133554', background: '#081e33' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Export Options
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                {/* Download Current Slide PNG */}
                <button
                  type="button"
                  className="btn small"
                  disabled={isExportingPng || isExportingPdf}
                  onClick={handleDownloadCurrentSlidePng}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                  }}
                >
                  <span>🖼️</span>
                  <span>{isExportingPng ? 'Rendering PNG...' : 'Download Current Slide (PNG)'}</span>
                </button>

                {/* Download Full PDF Presentation Deck */}
                <button
                  type="button"
                  className="btn secondary small"
                  disabled={isExportingPdf || isExportingPng}
                  onClick={handleDownloadFullPdfDeck}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderColor: '#38bdf8',
                    color: '#38bdf8',
                  }}
                >
                  <span>📑</span>
                  <span>{isExportingPdf ? 'Compiling PDF...' : 'Download All as 16:9 PDF'}</span>
                </button>
              </div>

              {exportProgress && (
                <div style={{ fontSize: '0.72rem', color: '#2dd4bf', marginTop: '8px', textAlign: 'center' }}>
                  {exportProgress}
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #133554', display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                style={{
                  flex: 1,
                  background: filterCategory === 'all' ? '#10395c' : 'transparent',
                  color: filterCategory === 'all' ? '#2dd4bf' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                All ({SLIDES.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('pitch')}
                style={{
                  flex: 1,
                  background: filterCategory === 'pitch' ? '#10395c' : 'transparent',
                  color: filterCategory === 'pitch' ? '#2dd4bf' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Pitch Slides
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('blank-masters')}
                style={{
                  flex: 1,
                  background: filterCategory === 'blank-masters' ? '#10395c' : 'transparent',
                  color: filterCategory === 'blank-masters' ? '#2dd4bf' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Master PPTX
              </button>
            </div>

            {/* Slide Thumbnails List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {filteredSlides.map((slide) => {
                const originalIndex = SLIDES.findIndex((s) => s.id === slide.id);
                const isSelected = originalIndex === activeSlideIndex;

                return (
                  <div
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(originalIndex)}
                    style={{
                      background: isSelected ? 'rgba(45, 212, 191, 0.1)' : '#0a1d30',
                      border: isSelected ? '1px solid #2dd4bf' : '1px solid #153757',
                      borderRadius: '10px',
                      padding: '10px',
                      cursor: 'pointer',
                      transition: '0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isSelected ? '#2dd4bf' : '#64748b' }}>
                          #{originalIndex + 1}
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>
                          {slide.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', color: slide.type === 'blank-masters' ? '#38bdf8' : '#2dd4bf' }}>
                        {slide.type === 'blank-masters' ? 'Canvas' : 'Pitch'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.35 }}>
                      {slide.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden container offscreen holding all slides in pure 1920x1080 for pristine batch rendering & PDF export */}
      <div
        ref={offscreenSlidesRef}
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          pointerEvents: 'none',
        }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            id={`offscreen-slide-${slide.id}`}
            style={{
              width: '1920px',
              height: '1080px',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {slide.render()}
          </div>
        ))}
      </div>
    </div>
  );
};
