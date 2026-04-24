import React from 'react';
// Gold Schemes — premium fintech hub.
// Layout strategy:
//   1. Active SIP summary card (only if user has one)
//   2. Live MCX rate strip
//   3. Quick actions (Buy Gold · Sell · Book My Gold)
//   4. Scheme tiles grid
//   5. Learning / trust footer
const TGS = window.JEWEL_TOKENS;

const GS_INK       = '#1E1B13';
const GS_INK_SOFT  = '#6E655C';
const GS_LINE      = 'rgba(47,52,48,0.10)';
const GS_GOLD      = 'rgb(115,92,0)';
const GS_GOLD_DK   = '#5A4700';
const GS_GOLD_TINT = 'rgba(115,92,0,0.08)';
const GS_ACCENT    = 'rgb(172,129,108)';
const GS_ACCENT_DK = 'rgb(119,88,66)';

function GoldSchemesPage({ go, state }) {
  const rate = state.goldRate?.buy || 11850;
  const activeSip = (state.user.sips || []).find(s => s.status === 'active');
  const loyaltyActive = state.loyalty?.registered;

  const schemes = [
    {
      id: 'jewel-sip', route: 'scheme-sip',
      name: 'Jewel SIP', tag: 'FLAGSHIP',
      tagline: 'Monthly 22K SIP',
      detail: 'From ₹1,500/mo · 12–60 months',
      bg: 'linear-gradient(135deg, #5C3B2B 0%, #8A5B44 55%, #AF826D 100%)',
      ink: '#FBEEE2', accent: '#F2DDCB',
      Art: GiftArt,
    },
    {
      id: '10plus1', route: 'loyalty',
      name: '10+1 Gold Plan', tag: 'POPULAR',
      tagline: 'Pay 10, get 11',
      detail: '₹2K–₹1L monthly · 11th free',
      bg: 'linear-gradient(135deg, #8A5B44 0%, #AF826D 100%)',
      ink: '#FCEFE3', accent: '#F6E4D2',
      Art: CoinArt,
    },
    {
      id: 'digital', route: 'wallet-gold',
      name: 'Digital Gold', tag: '24K · 999.9',
      tagline: 'Buy by the gram',
      detail: 'From ₹100 · insured vault',
      bg: 'linear-gradient(135deg, #74574A 0%, #9E7765 100%)',
      ink: '#F6E2D0', accent: '#EBD4C2',
      Art: VaultArt,
    },
    {
      id: 'bridal', route: null,
      name: 'Bridal Savings', tag: 'COMING SOON',
      tagline: 'Plan the big day',
      detail: '18–24 months · 5% making waiver',
      bg: 'linear-gradient(135deg, #AF826D 0%, #C89982 100%)',
      ink: '#FFF3E8', accent: '#FFF0E2',
      Art: SparkArt,
      locked: true,
    },
  ];

  return (
    <>
      <TopBar title="Gold Schemes" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: TGS.bg, padding: '10px 16px 40px' }}>
        {/* Active SIP summary (if any) */}
        {activeSip && (
          <button onClick={() => go('scheme-sip')} style={{
            marginTop: 6, width: '100%', textAlign: 'left', cursor: 'pointer',
            padding: '18px 18px 20px', borderRadius: 18,
            background: 'linear-gradient(135deg, #2F1D11 0%, #5A3B23 48%, #8A5E3C 100%)',
            color: '#F3D69B', position: 'relative', overflow: 'hidden',
            border: 'none', boxShadow: '0 10px 28px rgba(58,36,24,0.28)',
          }}>
            <svg width="150" height="150" viewBox="0 0 150 150"
              style={{ position: 'absolute', top: -34, right: -28, opacity: 0.22, pointerEvents: 'none' }}>
              <g stroke="#E9BE6F" strokeWidth="1" fill="none">
                <circle cx="75" cy="75" r="30"/>
                <circle cx="75" cy="75" r="48"/>
                <circle cx="75" cy="75" r="66"/>
              </g>
            </svg>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 10.5, letterSpacing: 2.4,
                  color: '#E9BE6F', fontWeight: 700,
                }}>◆ YOUR ACTIVE SIP</div>
                <div style={{
                  marginTop: 6,
                  fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 22, fontWeight: 700,
                  lineHeight: 1.15,
                }}>{activeSip.lockedGm.toFixed(3)} g locked in</div>
                <div style={{
                  marginTop: 4,
                  fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 12, color: 'rgba(243,214,155,0.82)',
                }}>
                  {activeSip.paidMonths.length}/{activeSip.tenure} instalments · next ₹{activeSip.monthly.toLocaleString('en-IN')} on {formatMonth(activeSip.nextDueAt)}
                </div>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(243,214,155,0.18)', color: '#F3D69B',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18"/>
                </svg>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: 14, height: 6, borderRadius: 6,
              background: 'rgba(243,214,155,0.2)', overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${Math.min(100, Math.round((activeSip.paidMonths.length / activeSip.tenure) * 100))}%`,
                background: '#F3D69B', borderRadius: 6, transition: 'width 400ms ease',
              }}/>
            </div>
          </button>
        )}

        {/* Rate strip */}
        <div style={{ marginTop: activeSip ? 14 : 6 }}>
          <RateStrip label="Today's buy rate · 24K" rate={rate} delta={state.goldRate?.delta24h} live/>
        </div>

        {/* Quick actions */}
        <div style={{
          marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        }}>
          <QuickAction icon={<IconPlus/>}  label="Buy Gold"    onClick={() => go('wallet-gold')}/>
          <QuickAction icon={<IconMinus/>} label="Sell Back"   onClick={() => go('wallet-sell')}/>
          <QuickAction icon={<IconCal/>}   label="Book Rate"   onClick={() => go('book')}/>
        </div>

        {/* Heading */}
        <div style={{
          marginTop: 22, marginBottom: 10,
          fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 20, fontWeight: 700, color: GS_INK,
        }}>All schemes</div>

        {/* Scheme tiles */}
        <div style={{ display: 'grid', gap: 12 }}>
          {schemes.map(sch => (
            <SchemeTile
              key={sch.id}
              scheme={sch}
              isYours={
                (sch.id === 'jewel-sip' && !!activeSip) ||
                (sch.id === '10plus1' && loyaltyActive)
              }
              onClick={() => sch.route ? go(sch.route) : null}
            />
          ))}
        </div>

        {/* Trust footer */}
        <div style={{
          marginTop: 22, padding: '14px 16px', borderRadius: 14,
          background: '#fff', border: `1px solid ${GS_LINE}`,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'rgba(76,105,68,0.12)', color: '#4C6944',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l7.5 3v6c0 4.5-3.2 8.3-7.5 9.5C7.7 20.3 4.5 16.5 4.5 12V6L12 3Z"/>
              <path d="M9.5 12.2l2 2 3.2-3.5"/>
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 13, fontWeight: 700, color: GS_INK,
            }}>Your gold, protected</div>
            <div style={{
              marginTop: 2,
              fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 11, color: GS_INK_SOFT, lineHeight: 1.5,
            }}>
              BIS-hallmarked jewellery at redemption · insured vault storage · PAN-verified per IT rules
              above ₹2,00,000 · transparent daily rates from MCX.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '14px 10px 12px', borderRadius: 14, cursor: 'pointer',
      background: '#fff', border: `1px solid ${GS_LINE}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      boxShadow: '0 2px 8px rgba(30,27,19,0.03)',
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        background: GS_GOLD_TINT, color: GS_GOLD_DK,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</span>
      <span style={{
        fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 11, fontWeight: 700, color: GS_INK,
        letterSpacing: 0.3,
      }}>{label}</span>
    </button>
  );
}

function SchemeTile({ scheme, isYours, onClick }) {
  const { Art } = scheme;
  return (
    <button onClick={onClick} disabled={scheme.locked} style={{
      position: 'relative', width: '100%', textAlign: 'left',
      padding: '18px 18px 18px', borderRadius: 18, overflow: 'hidden',
      background: scheme.bg, color: scheme.ink,
      border: 'none', cursor: scheme.locked ? 'not-allowed' : 'pointer',
      opacity: scheme.locked ? 0.75 : 1,
      boxShadow: '0 8px 24px rgba(58,36,24,0.2)',
      minHeight: 140,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ position: 'absolute', right: -10, bottom: -8, opacity: 0.55, pointerEvents: 'none' }}>
        <Art accent={scheme.accent}/>
      </div>

      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8,
            color: scheme.accent,
          }}>{scheme.tag}</span>
          {isYours && (
            <span style={{
              display: 'inline-flex',
              padding: '3px 8px', borderRadius: 999,
              background: 'rgba(168,225,160,0.22)',
              border: '1px solid rgba(168,225,160,0.5)',
              fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8,
              color: '#E4F6DF',
            }}>YOURS</span>
          )}
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: `'Noto Serif', ${TGS.serif}`, fontSize: 22, fontWeight: 700, lineHeight: 1.15,
        }}>{scheme.name}</div>
        <div style={{
          marginTop: 4,
          fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 12.5, fontWeight: 600,
          color: scheme.accent,
        }}>{scheme.tagline}</div>
        <div style={{
          marginTop: 6,
          fontFamily: `'Manrope', ${TGS.sans}`, fontSize: 11, color: scheme.accent, opacity: 0.85,
        }}>{scheme.detail}</div>
      </div>

      {!scheme.locked && (
        <div style={{
          position: 'relative',
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,0.18)', color: scheme.ink,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        </div>
      )}
    </button>
  );
}

/* ── tiny inline icons + scheme art ─────────────────────── */
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}
function IconMinus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14"/>
    </svg>
  );
}
function IconCal() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2"/>
      <path d="M3.5 10h17M8 3v4M16 3v4"/>
    </svg>
  );
}

function GiftArt({ accent }) {
  return (
    <svg width="150" height="140" viewBox="0 0 150 140" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="35" y="55" width="90" height="70" rx="6"/>
      <path d="M30 65h100M80 55v70"/>
      <path d="M80 55c-18-28-50-28-50 0 0 18 28 18 50 0zM80 55c18-28 50-28 50 0 0 18-28 18-50 0z"/>
    </svg>
  );
}
function CoinArt({ accent }) {
  return (
    <svg width="140" height="130" viewBox="0 0 140 130" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="70" cy="60" rx="42" ry="14"/>
      <path d="M28 60v22c0 8 20 14 42 14s42-6 42-14V60"/>
      <path d="M28 82v22c0 8 20 14 42 14s42-6 42-14V82"/>
    </svg>
  );
}
function VaultArt({ accent }) {
  return (
    <svg width="140" height="130" viewBox="0 0 140 130" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="25" width="90" height="85" rx="8"/>
      <circle cx="70" cy="68" r="22"/>
      <path d="M70 50v10M70 76v10M54 68h10M80 68h10"/>
      <path d="M115 55v26"/>
    </svg>
  );
}
function SparkArt({ accent }) {
  return (
    <svg width="140" height="130" viewBox="0 0 140 130" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M70 28l6 20 20 6-20 6-6 20-6-20-20-6 20-6z"/>
      <path d="M110 78l3 10 10 3-10 3-3 10-3-10-10-3 10-3z"/>
      <path d="M30 92l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>
    </svg>
  );
}

function formatMonth(iso) {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
  catch { return ''; }
}

window.GoldSchemesPage = GoldSchemesPage;
