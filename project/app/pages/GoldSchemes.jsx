// Gold Schemes — banner-first layout
// Simple top bar · Active plan strip · Stack of banner cards, one per scheme
const TGS = window.JEWEL_TOKENS;

function GoldSchemesPage({ go, state }) {
  const { completed, monthly, nextAt } = state.loyalty;

  const schemes = [
    {
      id: '10plus1',
      name: '10+1 Gold Plan',
      tagline: 'Pay 10 months, we gift the 11th',
      detail: '₹2,000–₹1,00,000 monthly · 10 months',
      badge: 'POPULAR',
      active: true,
      // Deepest tone — hero
      bg: `linear-gradient(135deg, #5C3B2B 0%, #8A5B44 55%, #AF826D 100%)`,
      accent: '#F2DDCB',
      ink: '#FBEEE2',
      Art: GiftArt,
    },
    {
      id: 'sip',
      name: 'Jewel SIP',
      tagline: 'Accumulate 22k gold every month',
      detail: 'Min ₹1,500/mo · 12–60 month tenure',
      // Core brand — #AF826D forward
      bg: `linear-gradient(135deg, #8A5B44 0%, #AF826D 100%)`,
      accent: '#F6E4D2',
      ink: '#FCEFE3',
      Art: CoinArt,
    },
    {
      id: 'bridal',
      name: 'Bridal Savings',
      tagline: 'Plan the big day, save for it',
      detail: '18–24 months · 5% making waiver',
      // Warmer terracotta shift
      bg: `linear-gradient(135deg, #AF826D 0%, #C89982 100%)`,
      accent: '#FFF0E2',
      ink: '#FFF3E8',
      Art: SparkArt,
    },
    {
      id: 'digital',
      name: 'Digital Gold Vault',
      tagline: 'Buy 24k gold by the gram',
      detail: 'From ₹100 · Insured vault storage',
      // Muted sandstone, slightly desaturated
      bg: `linear-gradient(135deg, #74574A 0%, #9E7765 100%)`,
      accent: '#EBD4C2',
      ink: '#F6E2D0',
      Art: VaultArt,
    },
    {
      id: 'flexi',
      name: 'Flexi Gold',
      tagline: 'Save on your own schedule',
      detail: 'No fixed instalment · 0.5%/mo bonus',
      // Lightest tone — pale café au lait
      bg: `linear-gradient(135deg, #BE927C 0%, #D5AE99 100%)`,
      accent: '#FFFAF3',
      ink: '#FFF6EB',
      Art: LeafArt,
    },
  ];

  return (
    <>
      {/* ── Simple top bar ──────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 15px 10px', background: '#fff',
        borderBottom: `1px solid ${TGS.line}`,
      }}>
        <button onClick={() => go('home')} aria-label="Back" style={gsSq}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 20, color: '#000', letterSpacing: 0.2,
        }}>Gold Schemes</div>
        <button aria-label="Help" style={gsSq}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1.2-1 1.7"/><circle cx="12" cy="17" r="0.6" fill="#000"/>
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: TGS.bg, padding: '16px 15px 28px' }}>

        {/* ── Intro ──────────────────────────────── */}
        <div style={{ marginBottom: 4 }}>
          <div style={{
            fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 22, fontWeight: 700, color: '#1E1B13', lineHeight: 1.25,
          }}>Save in gold, wear it forever.</div>
          <div style={{
            fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 12.5, color: '#6E655C', marginTop: 6, lineHeight: 1.5,
          }}>Pick a scheme that fits how you save.</div>
        </div>

        {/* ── Active plan compact strip ─────────── */}
        <div
          onClick={() => go('loyalty')}
          style={{
            marginTop: 16, background: '#fff', borderRadius: 12,
            border: '1px solid rgba(115,92,0,0.2)',
            padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#4C6944', flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(94,122,85,0.18)',
          }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 10.5, color: '#6E655C',
              letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
            }}>Your active plan</div>
            <div style={{ fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 12.5, color: '#1E1B13', fontWeight: 700, marginTop: 1 }}>
              10+1 Gold Plan · {completed}/10 paid · Next {nextAt}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(115,92,0)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        {/* ── Banner stack ──────────────────────── */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {schemes.map(s => (
            <SchemeBanner key={s.id} s={s} onOpen={() => s.active ? go('loyalty') : null}/>
          ))}
        </div>

        {/* ── Help footer (tiny) ────────────────── */}
        <div style={{
          marginTop: 22, padding: '14px 16px', borderRadius: 12,
          background: '#fff', border: '1px dashed rgba(115,92,0,0.3)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: 'rgba(115,92,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(115,92,0)',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.95.35 1.88.66 2.78a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.3-1.24a2 2 0 0 1 2.11-.45c.9.31 1.83.53 2.78.66A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 12.5, color: '#1E1B13', fontWeight: 700 }}>Need help picking?</div>
            <div style={{ fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 11, color: '#6E655C', marginTop: 1 }}>Call our advisors · Mon–Sat, 10 am–7 pm</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Scheme banner ──────────────────────────────────────
function SchemeBanner({ s, onOpen }) {
  return (
    <div
      onClick={onOpen}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 18, height: 168,
        background: s.bg,
        boxShadow: '0 6px 18px rgba(62,42,26,0.18)',
        cursor: 'pointer',
      }}>
      {/* Decorative art on the right */}
      <div style={{ position: 'absolute', right: -6, top: -8, bottom: -8, width: 160, opacity: 0.9 }}>
        <s.Art accent={s.accent}/>
      </div>

      {/* Subtle vignette so text stays legible */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 65%)',
      }}/>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1, height: '100%',
        padding: '16px 16px 14px', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {s.badge && (
            <span style={{
              padding: '3px 8px', borderRadius: 4, background: s.accent, color: '#1E1B13',
              fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
            }}>{s.badge}</span>
          )}
          {s.active && (
            <span style={{
              padding: '3px 8px', borderRadius: 4,
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
            }}>ACTIVE</span>
          )}
        </div>

        <div style={{ marginTop: 10, maxWidth: 'calc(100% - 110px)' }}>
          <div style={{
            fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 22, fontWeight: 700,
            color: '#fff', lineHeight: 1.2,
          }}>{s.name}</div>
          <div style={{
            fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 12.5, fontWeight: 500,
            color: s.ink, marginTop: 4, lineHeight: 1.4,
          }}>{s.tagline}</div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{
            fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 10.5,
            color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3,
          }}>{s.detail}</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 12px', borderRadius: 50,
            background: '#fff', color: '#1E1B13',
            fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 10.5, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase',
          }}>
            {s.active ? 'View' : 'Enroll'}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Decorative SVG art for each banner ─────────────────
function GiftArt({ accent }) {
  return (
    <svg viewBox="0 0 160 184" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      {/* big 1 with + at base */}
      <text x="92" y="160" fontFamily="'Noto Serif', serif" fontSize="180" fontWeight="700"
        fill="none" stroke={accent} strokeWidth="2" opacity="0.85">1</text>
      <text x="50" y="120" fontFamily="'Noto Serif', serif" fontSize="40" fontWeight="700" fill={accent} opacity="0.75">+</text>
      {/* sparkles */}
      <g fill={accent} opacity="0.8">
        <path d="M140,40 l3,6 l6,3 l-6,3 l-3,6 l-3,-6 l-6,-3 l6,-3 z"/>
        <circle cx="122" cy="30" r="1.6"/>
        <circle cx="150" cy="100" r="1.6"/>
      </g>
    </svg>
  );
}
function CoinArt({ accent }) {
  return (
    <svg viewBox="0 0 160 184" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      {/* stacked coins */}
      <g fill="none" stroke={accent} strokeWidth="2" opacity="0.9">
        <ellipse cx="100" cy="148" rx="44" ry="10"/>
        <ellipse cx="100" cy="130" rx="44" ry="10"/>
        <ellipse cx="100" cy="112" rx="44" ry="10"/>
        <path d="M56,112 v36 M144,112 v36"/>
        <circle cx="104" cy="62" r="30"/>
        <path d="M104,46 v32 M92,62 h24"/>
      </g>
    </svg>
  );
}
function SparkArt({ accent }) {
  return (
    <svg viewBox="0 0 160 184" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={accent} strokeWidth="2" opacity="0.9">
        {/* diamond */}
        <path d="M100,40 l28,22 l-28,58 l-28,-58 z"/>
        <path d="M72,62 h56 M86,62 l14,58 M114,62 l-14,58"/>
      </g>
      <g fill={accent} opacity="0.8">
        <path d="M140,30 l2.5,5 l5,2.5 l-5,2.5 l-2.5,5 l-2.5,-5 l-5,-2.5 l5,-2.5 z"/>
        <path d="M50,130 l2,4 l4,2 l-4,2 l-2,4 l-2,-4 l-4,-2 l4,-2 z"/>
      </g>
    </svg>
  );
}
function VaultArt({ accent }) {
  return (
    <svg viewBox="0 0 160 184" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={accent} strokeWidth="2" opacity="0.9">
        <rect x="52" y="44" width="90" height="96" rx="6"/>
        <circle cx="104" cy="92" r="22"/>
        <circle cx="104" cy="92" r="6"/>
        {/* hands */}
        <path d="M104,70 l10,-10 M104,70 l-10,-10 M104,114 l10,10 M104,114 l-10,10"/>
        {/* bolts */}
        <circle cx="60" cy="52" r="1.5" fill={accent}/>
        <circle cx="134" cy="52" r="1.5" fill={accent}/>
        <circle cx="60" cy="132" r="1.5" fill={accent}/>
        <circle cx="134" cy="132" r="1.5" fill={accent}/>
      </g>
    </svg>
  );
}
function LeafArt({ accent }) {
  return (
    <svg viewBox="0 0 160 184" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
      <g fill="none" stroke={accent} strokeWidth="2" opacity="0.9">
        <path d="M60,150 q50,-60 90,-100"/>
        <path d="M80,128 q18,-4 30,-22 q-22,-4 -30,22z"/>
        <path d="M100,108 q18,-4 30,-22 q-22,-4 -30,22z"/>
        <path d="M120,88 q18,-4 30,-22 q-22,-4 -30,22z"/>
      </g>
    </svg>
  );
}

const gsSq = {
  width: 40, height: 40, borderRadius: 12, background: 'rgba(255,248,239,0.7)',
  border: '1px solid rgba(115,92,0,0.12)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

window.GoldSchemesPage = GoldSchemesPage;
