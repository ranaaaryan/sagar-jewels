import React from 'react';
// Today's Rate — live rate listing page reached from the Home rate card.
// Editorial redesign: a hero card for the flagship 22KT rate, a categorised
// list for other gold purities and silver, an info strip, and action CTAs.

const TR = window.JEWEL_TOKENS;

const TR_INK       = '#1E1B13';
const TR_INK_SOFT  = '#6E655C';
const TR_LINE      = 'rgba(47,52,48,0.10)';
const TR_GOLD      = '#C69544';
const TR_GOLD_DK   = '#8E6420';
const TR_SILVER    = '#8A8E92';
const TR_SILVER_DK = '#565A5F';
const TR_UP        = '#4C6944';
const TR_DOWN      = '#D65A50';

// Gold & silver metadata for the list. Hero entry drives the top card.
function getRates(state) {
  const buyRate24  = state?.goldRate?.buy  ?? 15580;
  const delta24h   = state?.goldRate?.delta24h ?? 89;
  // 22K is the flagship Indian purity (916) — derive from 24K at 22/24 weight.
  const rate22     = Math.round((buyRate24 * 22) / 24);
  const rate18     = Math.round((buyRate24 * 18) / 24);
  const rate14     = Math.round((buyRate24 * 14) / 24);
  const silver999  = 252;
  const silver925  = Math.round(silver999 * 0.925);

  return {
    hero: {
      metal: 'Gold', purity: '22KT', fineness: '916', rate: rate22,
      delta: Math.round(delta24h * (22 / 24)),
      deltaPct: (delta24h / buyRate24) * 100,
    },
    gold: [
      { k: '24KT Pure',    fineness: '999',   rate: buyRate24, tone: 'gold' },
      { k: '18KT',         fineness: '750',   rate: rate18,    tone: 'gold-soft' },
      { k: '14KT',         fineness: '585',   rate: rate14,    tone: 'gold-pale' },
    ],
    silver: [
      { k: 'Fine Silver',  fineness: '999',   rate: silver999, tone: 'silver' },
      { k: 'Sterling',     fineness: '925',   rate: silver925, tone: 'silver-pale' },
    ],
  };
}

const TONE_SWATCHES = {
  'gold':        'linear-gradient(135deg,#FFD86A 0%,#D69419 60%,#9A6A13 100%)',
  'gold-soft':   'linear-gradient(135deg,#F1CC85 0%,#C69544 60%,#8E6420 100%)',
  'gold-pale':   'linear-gradient(135deg,#F3DDB8 0%,#CDA87D 60%,#8D6A43 100%)',
  'silver':      'linear-gradient(135deg,#FFFFFF 0%,#D4D6D2 60%,#8A8D89 100%)',
  'silver-pale': 'linear-gradient(135deg,#F0F1F3 0%,#C5C8CC 60%,#858A90 100%)',
};

function pad(n) { return String(n).padStart(2, '0'); }
function formatUpdatedAt(d) {
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} · ${pad(h)}:${pad(d.getMinutes())} ${ampm}`;
}

function TodaysRatePage({ go, state }) {
  const now = React.useMemo(() => new Date(), []);
  const lastUpdated = React.useMemo(() => formatUpdatedAt(now), [now]);
  const rates = React.useMemo(() => getRates(state), [state]);

  return (
    <>
      <TopBar title="Today's Rate" onBack={() => go('home')} />

      <div style={{
        flex: 1, overflowY: 'auto', background: TR?.bg || '#F7F6F2',
        padding: '12px 16px 32px',
      }}>

        {/* ── Live header ───────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 2px 14px',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`,
            fontSize: 10, letterSpacing: 1.8, fontWeight: 700,
            color: TR_INK_SOFT, textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: TR_UP,
              animation: 'tr-pulse 1.6s ease-in-out infinite',
            }}/>
            Live · MCX Spot
          </span>
          <span style={{
            fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 10.5,
            color: TR_INK_SOFT, fontWeight: 600, letterSpacing: 0.2,
          }}>{lastUpdated}</span>
        </div>

        {/* ── Hero rate card — flagship 22KT ────────── */}
        <HeroRateCard hero={rates.hero}/>

        {/* ── Gold variants ─────────────────────────── */}
        <CategoryHeader kicker="Pure & Alloyed" title="Gold Variants" />
        <div style={{
          background: '#fff', borderRadius: 16,
          border: `1px solid ${TR_LINE}`, overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(30,27,19,0.04)',
        }}>
          {rates.gold.map((r, i, arr) => (
            <RateRow key={r.k} {...r} last={i === arr.length - 1}/>
          ))}
        </div>

        {/* ── Silver ────────────────────────────────── */}
        <CategoryHeader kicker="By fineness" title="Silver" />
        <div style={{
          background: '#fff', borderRadius: 16,
          border: `1px solid ${TR_LINE}`, overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(30,27,19,0.04)',
        }}>
          {rates.silver.map((r, i, arr) => (
            <RateRow key={r.k} {...r} last={i === arr.length - 1}/>
          ))}
        </div>

        {/* ── Info strip ─────────────────────────────── */}
        <div style={{
          marginTop: 18, padding: '12px 14px', borderRadius: 12,
          background: 'rgba(122,88,67,0.06)',
          border: `1px solid ${TR_LINE}`,
          display: 'flex', alignItems: 'flex-start', gap: 10,
          fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`,
          fontSize: 11, color: TR_INK_SOFT, lineHeight: 1.55,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(119,88,66)"
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 8v5M12 16h.01"/>
          </svg>
          <span>
            Rates reflect MCX spot with our refining margin and are applicable for transactions today.
            Final invoice may vary with making charges, stone weight, and GST.
          </span>
        </div>

        {/* ── Action CTAs ───────────────────────────── */}
        <div style={{
          marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
        }}>
          <ActionBtn
            onClick={() => go('wallet-gold')}
            primary
            label="Buy Digital Gold"
            hint="From ₹100"
          />
          <ActionBtn
            onClick={() => go('book')}
            label="Book this Rate"
            hint="Lock for 30 days"
          />
        </div>
      </div>

      <style>{`
        @keyframes tr-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </>
  );
}

// ── Hero rate card ───────────────────────────────────────────────
// Palette: shades of #AF826D — darker at top-left, brand accent at bottom-right.
// Text + ornament in warm cream so it reads warm, not harsh.
function HeroRateCard({ hero }) {
  const rising = hero.delta >= 0;
  return (
    <div style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(135deg, #5E4234 0%, #7C5A48 50%, #AF826D 100%)',
      color: '#F3DDCB',
      boxShadow: '0 12px 30px rgba(119,88,66,0.32)',
      padding: '20px 20px 22px',
    }}>
      {/* concentric ornament */}
      <svg width="180" height="180" viewBox="0 0 180 180"
        style={{ position: 'absolute', right: -44, top: -46, opacity: 0.22, pointerEvents: 'none' }}>
        <g stroke="#F3DDCB" strokeWidth="1" fill="none">
          <circle cx="90" cy="90" r="36"/>
          <circle cx="90" cy="90" r="54"/>
          <circle cx="90" cy="90" r="72"/>
        </g>
      </svg>

      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(243,221,203,0.18)', border: '1px solid rgba(243,221,203,0.34)',
          fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 10, fontWeight: 700,
          letterSpacing: 1.4, color: '#F3DDCB', textTransform: 'uppercase',
        }}>◆ Flagship · 22KT 916</div>

        <div style={{
          marginTop: 12,
          fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 10.5,
          color: 'rgba(243,221,203,0.78)', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
        }}>
          {hero.metal} · Hallmarked
        </div>

        {/* Big price */}
        <div style={{
          marginTop: 4,
          display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
          fontFamily: `'Noto Serif', ${TR?.serif || 'serif'}`,
          color: '#F3DDCB',
        }}>
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1 }}>
            ₹{hero.rate.toLocaleString('en-IN')}
          </span>
          <span style={{
            fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`,
            fontSize: 13, fontWeight: 500,
            color: 'rgba(243,221,203,0.82)',
          }}>/gm</span>
        </div>

        {/* Delta pill */}
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 999,
            background: rising ? 'rgba(168,225,160,0.22)' : 'rgba(214,90,80,0.22)',
            border: `1px solid ${rising ? 'rgba(168,225,160,0.4)' : 'rgba(214,90,80,0.4)'}`,
            color: rising ? '#D3F0C6' : '#F6C7C2',
            fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.3,
          }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
              {rising ? <path d="M5 1l4 6H1z"/> : <path d="M5 9L1 3h8z"/>}
            </svg>
            {rising ? '+' : '−'}₹{Math.abs(hero.delta)} · {Math.abs(hero.deltaPct).toFixed(2)}%
          </span>
          <span style={{
            fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`,
            fontSize: 10.5, color: 'rgba(243,221,203,0.72)', letterSpacing: 0.4,
          }}>vs yesterday</span>
        </div>

        {/* Decorative divider */}
        <div style={{
          marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(243,221,203,0.24)',
          display: 'flex', justifyContent: 'space-between', gap: 10,
        }}>
          <MiniStat label="1 gram"  value={`₹${hero.rate.toLocaleString('en-IN')}`}/>
          <MiniStat label="8 grams" value={`₹${(hero.rate * 8).toLocaleString('en-IN')}`}/>
          <MiniStat label="10 grams" value={`₹${(hero.rate * 10).toLocaleString('en-IN')}`} last/>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div style={{
        fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 9.5, fontWeight: 700,
        color: 'rgba(243,221,203,0.66)', letterSpacing: 0.8, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        marginTop: 3,
        fontFamily: `'Noto Serif', ${TR?.serif || 'serif'}`, fontSize: 13, fontWeight: 700,
        color: '#F3DDCB',
      }}>{value}</div>
    </div>
  );
}

// ── Category header ──────────────────────────────────────────────
function CategoryHeader({ kicker, title }) {
  return (
    <div style={{ marginTop: 22, marginBottom: 10 }}>
      <div style={{
        fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 10,
        color: 'rgb(119,88,66)', letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: 700,
      }}>{kicker}</div>
      <div style={{
        marginTop: 2,
        fontFamily: `'Noto Serif', ${TR?.serif || 'serif'}`, fontSize: 18, fontWeight: 700,
        color: TR_INK,
      }}>{title}</div>
    </div>
  );
}

// ── Single rate row ──────────────────────────────────────────────
function RateRow({ k, fineness, rate, tone, last }) {
  const isSilver = tone.startsWith('silver');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 16px',
      borderBottom: last ? 'none' : `1px solid ${TR_LINE}`,
    }}>
      {/* Metal disc */}
      <span style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: TONE_SWATCHES[tone] || TONE_SWATCHES['gold-soft'],
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
      }}/>
      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${TR?.serif || 'serif'}`, fontSize: 15, fontWeight: 700,
          color: TR_INK, lineHeight: 1.2,
        }}>{k}</div>
        <div style={{
          marginTop: 2,
          fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 10.5, fontWeight: 600,
          color: TR_INK_SOFT, letterSpacing: 0.6,
        }}>Fineness · {fineness}</div>
      </div>
      {/* Rate */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${TR?.serif || 'serif'}`, fontSize: 17, fontWeight: 700,
          color: isSilver ? TR_SILVER_DK : TR_GOLD_DK,
        }}>₹{rate.toLocaleString('en-IN')}</div>
        <div style={{
          marginTop: 1,
          fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`, fontSize: 10, fontWeight: 600,
          color: TR_INK_SOFT, letterSpacing: 0.4,
        }}>per gram</div>
      </div>
    </div>
  );
}

// ── Action button ────────────────────────────────────────────────
function ActionBtn({ onClick, label, hint, primary }) {
  return (
    <button onClick={onClick} style={{
      padding: '14px 14px', borderRadius: 14, cursor: 'pointer',
      background: primary ? 'rgb(119,88,66)' : '#fff',
      color: primary ? '#fff' : 'rgb(119,88,66)',
      border: primary ? 'none' : '1px solid rgba(119,88,66,0.35)',
      boxShadow: primary ? '0 6px 16px rgba(119,88,66,0.25)' : '0 2px 8px rgba(30,27,19,0.04)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      fontFamily: `'Manrope', ${TR?.sans || 'sans-serif'}`,
      transition: 'transform 160ms ease',
    }}>
      <span style={{
        fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
      }}>{label}</span>
      <span style={{
        fontSize: 10, fontWeight: 600, opacity: 0.78, letterSpacing: 0.3,
      }}>{hint}</span>
    </button>
  );
}

window.TodaysRatePage = TodaysRatePage;
