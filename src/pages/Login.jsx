import React from 'react';
// Get-Started splash — luxury editorial layout.
//   • Centered monogram crest + house wordmark + "Est." dateline
//   • Slim Art Deco ornament divider
//   • One framed hero image (no collage / no chip pill / no sparkle dots)
//   • Centered serif headline with an italic flourish
//   • Tight pill CTA → SignUp; subtle "Sign in" link below

const LT = window.JEWEL_TOKENS;
const LOGIN_BG_TOP    = '#FAF8F4';
const LOGIN_BG_BOTTOM = '#F2EAD8';
const LOGIN_INK       = '#2F3430';
const LOGIN_INK_SOFT  = '#6E655C';
const LOGIN_MUTED     = '#9A8F7E';
const LOGIN_ACCENT    = 'rgb(175,130,109)';
const LOGIN_ACCENT_DK = 'rgb(119,88,66)';
const LOGIN_GILT      = '#C9A77A';
const LOGIN_CREAM     = '#FAF8F4';

function LoginPage({ go }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, ${LOGIN_BG_TOP} 0%, ${LOGIN_BG_BOTTOM} 100%)`,
      padding: '36px 28px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* House mark — crest, wordmark, dateline */}
      <header style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <Crest/>
        <div style={{
          fontFamily: `'Noto Serif', ${LT.serif}`, fontSize: 11, fontWeight: 600,
          letterSpacing: 4, color: LOGIN_INK, textTransform: 'uppercase',
        }}>Sagar Jewellers</div>
        <div style={{
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 9, fontWeight: 600,
          letterSpacing: 2.4, color: LOGIN_MUTED, textTransform: 'uppercase',
        }}>Est. 1948 · Bengaluru</div>
      </header>

      <Ornament/>

      {/* Hero — single framed portrait */}
      <div style={{
        margin: '24px auto 0',
        width: '76%', aspectRatio: '3 / 4',
        borderRadius: 18, overflow: 'hidden', position: 'relative',
        background: `url(assets/login/hero1.png) center / cover no-repeat, #F1EBE3`,
        border: `5px solid ${LOGIN_CREAM}`,
        boxShadow: `
          0 28px 48px -16px rgba(47,52,48,0.22),
          0 6px 14px -6px rgba(47,52,48,0.10),
          0 0 0 1px rgba(201,167,122,0.18)
        `,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 60%, rgba(47,52,48,0.18) 100%)',
        }}/>
      </div>

      {/* Headline */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <h1 style={{
          margin: 0,
          fontFamily: `'Noto Serif', ${LT.serif}`,
          fontSize: 34, fontWeight: 600, lineHeight: 1.18,
          color: LOGIN_INK, letterSpacing: -0.4,
        }}>
          Heirloom luxury,
          <br/>
          <em style={{
            fontFamily: `'Noto Serif', ${LT.serif}`, fontStyle: 'italic',
            fontWeight: 500, color: LOGIN_ACCENT_DK,
          }}>made for you.</em>
        </h1>
        <p style={{
          margin: '12px auto 0', maxWidth: 280,
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 13, lineHeight: 1.6,
          color: LOGIN_INK_SOFT,
        }}>
          Hand-crafted pieces, certified by BIS — delivered with care since 1948.
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 16 }}/>

      {/* CTA */}
      <button
        onClick={() => go('signup')}
        style={{
          width: '100%', height: 60, border: 'none', borderRadius: 999,
          background: LOGIN_ACCENT, color: LOGIN_CREAM,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          cursor: 'pointer',
          fontFamily: `'Noto Serif', ${LT.serif}`, fontSize: 14, fontWeight: 700,
          letterSpacing: 3, textTransform: 'uppercase',
          boxShadow: '0 14px 26px -10px rgba(119,88,66,0.40), 0 2px 6px -2px rgba(119,88,66,0.18)',
        }}
      >
        <span>Begin</span>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(250,248,244,0.18)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </span>
      </button>

      {/* Sign-in link */}
      <div style={{
        marginTop: 18, textAlign: 'center',
        fontFamily: `'Manrope', ${LT.sans}`, fontSize: 12, color: LOGIN_INK_SOFT,
        letterSpacing: 0.3,
      }}>
        Already a member?{' '}
        <span
          onClick={() => go('signin')}
          style={{
            color: LOGIN_ACCENT_DK, fontWeight: 700, cursor: 'pointer',
            letterSpacing: 0.6, paddingBottom: 1,
            borderBottom: `1px solid ${LOGIN_ACCENT_DK}`,
          }}
        >Sign in</span>
      </div>
    </div>
  );
}

// Round monogram — gilt gradient with a soft inner highlight.
function Crest() {
  return (
    <div style={{
      width: 58, height: 58, borderRadius: '50%',
      background: `radial-gradient(circle at 30% 28%, #E8C99A 0%, #B98C5A 55%, #6B4A2E 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `
        0 12px 24px -10px rgba(107,74,46,0.45),
        inset 0 1px 0 rgba(255,255,255,0.35),
        inset 0 -2px 4px rgba(75,52,30,0.35)
      `,
      position: 'relative',
    }}>
      <span style={{
        fontFamily: `'Noto Serif', ${LT.serif}`,
        fontSize: 28, fontWeight: 700, fontStyle: 'italic',
        color: LOGIN_CREAM, letterSpacing: -0.6,
        textShadow: '0 1px 1px rgba(75,52,30,0.4)',
      }}>S</span>
    </div>
  );
}

// Slim Art Deco–style divider — gold hairlines flanking a centered diamond.
function Ornament() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 12, marginTop: 18,
    }}>
      <span style={{
        width: 56, height: 1,
        background: `linear-gradient(90deg, transparent, ${LOGIN_GILT} 50%, transparent)`,
        opacity: 0.7,
      }}/>
      <span style={{
        width: 6, height: 6, transform: 'rotate(45deg)',
        background: LOGIN_GILT, opacity: 0.85,
        boxShadow: `0 0 0 2px ${LOGIN_BG_TOP}, 0 0 0 3px rgba(201,167,122,0.4)`,
      }}/>
      <span style={{
        width: 56, height: 1,
        background: `linear-gradient(90deg, transparent, ${LOGIN_GILT} 50%, transparent)`,
        opacity: 0.7,
      }}/>
    </div>
  );
}

window.LoginPage = LoginPage;
