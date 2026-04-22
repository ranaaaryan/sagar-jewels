import React from 'react';
// Login / Get Started splash — two overlapping hero images + big headline + CTA
// Based on the Figma "Log In" frame: gold-detail card overlapped by a necklace-detail card,
// then "Find Your Perfect Sparkle" headline and a brown pill "GET STARTED" button.

const LT = window.JEWEL_TOKENS;
const LOGIN_BG = 'rgb(250,249,246)';
const LOGIN_ACCENT = 'rgb(175,130,109)';
const LOGIN_ACCENT_DK = 'rgb(119,88,66)';
const LOGIN_CREAM = 'rgb(255,246,242)';

function LoginPage({ go }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: LOGIN_BG, padding: '32px 24px 48px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Brand mark */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: `linear-gradient(135deg, ${LOGIN_ACCENT} 0%, ${LOGIN_ACCENT_DK} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: LOGIN_CREAM, fontFamily: `'Noto Serif', ${LT.serif}`, fontSize: 15, fontWeight: 700,
          boxShadow: '0 4px 12px rgba(119,88,66,0.25)',
        }}>A</div>
        <div style={{
          fontFamily: `'Noto Serif', ${LT.serif}`, fontSize: 15, fontWeight: 600,
          letterSpacing: 3, color: '#2F3430', textTransform: 'uppercase',
        }}>Sagar Jewellers</div>
      </div>

      {/* Image collage */}
      <div style={{
        position: 'relative', height: 340, marginTop: 6,
      }}>
        {/* back card */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: 230, height: 286, borderRadius: 14,
          background: 'url(assets/login/hero1.png) center / cover no-repeat',
          boxShadow: '0 32px 64px -16px rgba(47,52,48,0.14)',
        }}/>
        {/* decorative sparkle dots behind */}
        <SparkleDots/>
        {/* front card, overlapping */}
        <div style={{
          position: 'absolute', right: 0, bottom: 0,
          width: 184, height: 246, borderRadius: 14,
          background: 'url(assets/login/hero2.png) center / cover no-repeat',
          border: `4px solid ${LOGIN_BG}`,
          boxShadow: '0 32px 64px -16px rgba(47,52,48,0.14)',
        }}/>
        {/* tiny "hand-picked" chip */}
        <div style={{
          position: 'absolute', left: 10, bottom: 72,
          background: '#fff', padding: '8px 12px', borderRadius: 999,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 10px 24px -8px rgba(47,52,48,0.18)',
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 11, color: '#2F3430', fontWeight: 600,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: 99, background: LOGIN_ACCENT,
          }}/>
          Hand-picked · BIS Hallmark
        </div>
      </div>

      {/* Headline */}
      <div style={{ marginTop: 30 }}>
        <h1 style={{
          margin: 0,
          fontFamily: `'Epilogue', 'Noto Serif', ${LT.serif}`,
          fontWeight: 700, fontSize: 50, lineHeight: 1.07, letterSpacing: -1.2,
          color: '#2F3430', textWrap: 'pretty',
        }}>Find Your<br/>Perfect<br/><em style={{
          fontFamily: `'Noto Serif', ${LT.serif}`, fontStyle: 'italic',
          fontWeight: 500, color: LOGIN_ACCENT_DK,
        }}>Sparkle</em></h1>
        <p style={{
          margin: '18px 0 0',
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 16, lineHeight: 1.55,
          color: 'rgb(92,96,92)', maxWidth: 300,
        }}>Find your perfect gems and elevate<br/>your look effortlessly.</p>
      </div>

      <div style={{ flex: 1 }}/>

      {/* CTA pill button */}
      <button
        onClick={() => go('home')}
        style={{
          marginTop: 24, width: '100%', height: 66, border: 'none',
          borderRadius: 999, background: LOGIN_ACCENT, color: LOGIN_CREAM,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px 0 40px', cursor: 'pointer',
          fontFamily: `'Noto Serif', ${LT.serif}`,
          fontSize: 18, fontWeight: 700, letterSpacing: 0.5,
          boxShadow: '0 12px 24px -6px rgba(119,88,66,0.35), 0 4px 8px -2px rgba(0,0,0,0.1)',
        }}
      >
        <span>GET STARTED</span>
        <span style={{
          width: 48, height: 48, borderRadius: '50%', background: LOGIN_CREAM,
          color: LOGIN_ACCENT_DK,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </span>
      </button>

      {/* sign-in subline */}
      <div style={{
        marginTop: 18, textAlign: 'center',
        fontFamily: `'Manrope', ${LT.sans}`, fontSize: 13, color: 'rgb(92,96,92)',
      }}>
        Already have an account?{' '}
        <span onClick={() => go('home')} style={{
          color: LOGIN_ACCENT_DK, fontWeight: 700, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 2,
        }}>Sign in</span>
      </div>
    </div>
  );
}

function SparkleDots() {
  return (
    <svg width="340" height="340" viewBox="0 0 340 340"
         style={{ position: 'absolute', left: -20, top: -20, pointerEvents: 'none', opacity: 0.5 }}>
      {[[40,70],[280,40],[300,150],[30,260],[90,310],[310,280]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="rgb(175,130,109)" opacity="0.35"/>
        </g>
      ))}
    </svg>
  );
}

window.LoginPage = LoginPage;
