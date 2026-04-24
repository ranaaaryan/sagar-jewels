import React from 'react';
// Refer a Friend — commission per metal category + code copy + share
const REF_T = window.JEWEL_TOKENS;
const REF_GOLD      = 'rgb(115,92,0)';
const REF_GOLD_DK   = '#5A4700';
const REF_GOLD_TINT = 'rgba(115,92,0,0.08)';

function ReferPage({ go, state }) {
  const code = `SAGAR${state?.user?.name?.split(' ')[0]?.toUpperCase()?.slice(0, 4) || 'RAVI'}${'123'}`;
  const [copied, setCopied] = React.useState(false);

  function doCopy() {
    try { navigator.clipboard?.writeText(code); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const commissions = [
    { metal: 'Gold',     pct: '0.50%', tone: 'warm',  icon: 'gold'     },
    { metal: 'Silver',   pct: '0.25%', tone: 'mist',  icon: 'silver'   },
    { metal: 'Diamond',  pct: '0.75%', tone: 'rose',  icon: 'diamond'  },
    { metal: 'Platinum', pct: '1.00%', tone: 'sage',  icon: 'platinum' },
  ];

  return (
    <>
      <TopBar title="Refer a Friend" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: REF_T.bg, padding: '6px 18px 40px' }}>

        {/* Hero card */}
        <div style={{
          marginTop: 12, borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(135deg, #3E2E23 0%, #6B4A2E 60%, #9B6B28 100%)',
          position: 'relative', color: '#fff',
          boxShadow: '0 8px 22px rgba(62,42,26,0.22)',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 180, height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(227,178,74,0.35), transparent 70%)',
          }}/>
          <div style={{ position: 'relative', padding: '22px 20px 20px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 50,
              background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)',
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10, fontWeight: 700,
              letterSpacing: 0.8, textTransform: 'uppercase',
            }}>🎁 Earn on every purchase</div>
            <div style={{
              marginTop: 12, fontFamily: `'Noto Serif', ${REF_T.serif}`,
              fontSize: 24, fontWeight: 700, lineHeight: 1.2, maxWidth: 240,
            }}>Invite friends, earn commission for life.</div>
            <div style={{
              marginTop: 6, fontFamily: `'Manrope', ${REF_T.sans}`,
              fontSize: 12, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, maxWidth: 250,
            }}>Every time someone you referred shops, we credit you.</div>
          </div>
        </div>

        {/* Your code card */}
        <div style={{
          marginTop: 16, background: '#fff', borderRadius: 16,
          border: `1px solid ${REF_T.line}`, padding: '16px 18px 18px',
        }}>
          <div style={{
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: '#9A8F84',
            letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700,
          }}>Your referral code</div>

          <div style={{
            marginTop: 10, display: 'flex', alignItems: 'center', gap: 10,
            background: REF_GOLD_TINT, border: `1px dashed ${REF_GOLD}`,
            borderRadius: 12, padding: '14px 16px',
          }}>
            <div style={{
              flex: 1,
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 20, fontWeight: 800,
              color: REF_GOLD_DK, letterSpacing: 2,
            }}>{code}</div>
            <button
              onClick={doCopy}
              style={{
                padding: '8px 14px', height: 36, border: 'none', cursor: 'pointer',
                background: copied ? '#4C6944' : REF_GOLD, color: '#fff',
                borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11, fontWeight: 700,
                letterSpacing: 0.6, textTransform: 'uppercase',
                transition: 'background 180ms ease',
              }}>
              {copied ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>Copy</>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[
              { label: 'WhatsApp', color: '#25D366', icon: 'wa' },
              { label: 'SMS',      color: '#5E6A7A', icon: 'sms' },
              { label: 'Email',    color: '#D04B3D', icon: 'mail' },
              { label: 'More',     color: REF_GOLD,  icon: 'more' },
            ].map(s => (
              <button key={s.label} style={{
                flex: 1, height: 60, border: `1px solid ${REF_T.line}`, background: '#fff',
                borderRadius: 12, cursor: 'pointer', padding: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <ShareIcon kind={s.icon} color={s.color}/>
                <span style={{
                  fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9.5, color: '#6E655C', fontWeight: 600,
                }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Commission structure */}
        <SectionKicker kicker="What you earn" title="Commission per purchase"/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {commissions.map(c => (
            <CommissionTile key={c.metal} {...c}/>
          ))}
        </div>

        <div style={{
          marginTop: 8, fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5,
          color: '#9A8F84', lineHeight: 1.5,
        }}>
          Commission is calculated on the net invoice value (excluding GST and making charges) and credited within 7 days of the purchase.
        </div>

        {/* How it works */}
        <SectionKicker kicker="3 simple steps" title="How it works"/>

        <div style={{
          background: '#fff', borderRadius: 16, border: `1px solid ${REF_T.line}`, overflow: 'hidden',
        }}>
          {[
            { n: '01', t: 'Share your code',       d: 'Send via WhatsApp, SMS or email to a friend.' },
            { n: '02', t: 'Friend signs up',       d: 'They register with Sagar Jewellers using your code.' },
            { n: '03', t: 'You earn, forever',     d: 'Every purchase they make credits your wallet.' },
          ].map((s, i, arr) => (
            <div key={s.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
              borderBottom: i < arr.length - 1 ? `1px solid ${REF_T.line}` : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #F5E2B3, #E3B24A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 12, fontWeight: 700, color: '#3E2E23',
              }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 15, fontWeight: 600, color: '#1E1B13' }}>{s.t}</div>
                <div style={{ fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, color: '#6E655C', marginTop: 2, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Earnings snapshot (synced with the referral earnings list below) */}
        <SectionKicker kicker="Your earnings" title="Lifetime referral bonus"/>

        <div style={{
          background: '#fff', borderRadius: 16, border: `1px solid ${REF_T.line}`,
          padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: '#9A8F84',
              letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
            }}>Total earned</div>
            <div style={{
              fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 26, fontWeight: 700,
              color: REF_GOLD_DK, marginTop: 2,
            }}>₹{REFERRAL_BONUSES.reduce((s, r) => s + r.earned, 0).toLocaleString('en-IN')}</div>
            <div style={{
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11, color: '#6E655C', marginTop: 2,
            }}>{REFERRAL_BONUSES.length} referrals so far</div>
          </div>
          <button style={{
            padding: '10px 16px', borderRadius: 10, border: `1px solid ${REF_GOLD}`,
            background: '#fff', color: REF_GOLD, cursor: 'pointer',
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.6, textTransform: 'uppercase',
          }}>View ledger</button>
        </div>

        {/* Bonus — per-referral earnings list */}
        <SectionKicker kicker="Your network" title="Referral earnings"/>
        <ReferralEarningsList items={REFERRAL_BONUSES}/>

        {/* Terms */}
        <div style={{
          marginTop: 20, padding: '12px 14px', borderRadius: 12,
          background: REF_GOLD_TINT,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: '#6E655C',
          lineHeight: 1.6,
        }}>
          Commission rates are revised every financial year. Cash-outs are processed monthly for balances above ₹500. <span style={{ color: REF_GOLD, fontWeight: 700, textDecoration: 'underline' }}>View full terms</span>.
        </div>
      </div>
    </>
  );
}

// ─── Commission tile ─────────────────────────────
function CommissionTile({ metal, pct, tone, icon }) {
  const palettes = {
    warm: { bg: 'linear-gradient(160deg, #FFF4DC, #F7DFB0)', ink: '#6B4A2E' },
    mist: { bg: 'linear-gradient(160deg, #ECEEF1, #CFD5DC)', ink: '#3E4750' },
    rose: { bg: 'linear-gradient(160deg, #FBEDE6, #EFCFC1)', ink: '#84463D' },
    sage: { bg: 'linear-gradient(160deg, #EFF4E6, #D5E2C4)', ink: '#3C5A3F' },
  };
  const p = palettes[tone];
  return (
    <div style={{
      background: p.bg, borderRadius: 14, padding: '14px 14px 16px',
      border: '1px solid rgba(107,74,46,0.08)',
      display: 'flex', flexDirection: 'column', gap: 6, minHeight: 120,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(255,255,255,0.7)', color: p.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MetalIcon kind={icon}/>
      </div>
      <div style={{ fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 15, fontWeight: 600, color: '#1E1B13', marginTop: 4 }}>{metal}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 22, fontWeight: 700,
          color: p.ink, letterSpacing: 0.2,
        }}>{pct}</span>
        <span style={{
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: p.ink, fontWeight: 600,
        }}>commission</span>
      </div>
    </div>
  );
}

function MetalIcon({ kind }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'gold':     return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>;
    case 'silver':   return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M8 12l3 3 5-6"/></svg>;
    case 'diamond':  return <svg {...common}><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M8 9h8"/></svg>;
    case 'platinum': return <svg {...common}><path d="M4 8l8 4 8-4M4 8v8l8 4 8-4V8M4 8l8-4 8 4"/></svg>;
    default: return null;
  }
}

function ShareIcon({ kind, color }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'wa':   return <svg {...common}><path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.3-4.3A9 9 0 1 1 21 12z"/><path d="M9 10c0 3 2 5 5 5l1.5-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2L9 10z" fill={color}/></svg>;
    case 'sms':  return <svg {...common}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.3A8 8 0 1 1 21 12z"/><path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.4"/></svg>;
    case 'mail': return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>;
    case 'more': return <svg {...common}><circle cx="5"  cy="12" r="1.6" fill={color}/><circle cx="12" cy="12" r="1.6" fill={color}/><circle cx="19" cy="12" r="1.6" fill={color}/></svg>;
    default: return null;
  }
}

function SectionKicker({ kicker, title }) {
  return (
    <div style={{ marginTop: 24, marginBottom: 12 }}>
      <div style={{
        fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10, color: REF_GOLD,
        letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
      }}>{kicker}</div>
      <div style={{
        fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 20, fontWeight: 700,
        color: '#1E1B13', marginTop: 4,
      }}>{title}</div>
    </div>
  );
}

// ─── Referral earnings (Bonus dashboard) ─────────────────────────
// Mock data: each entry is a friend who signed up via the user's code.
// `earned` is derived from their cumulative `spent` at the brand's
// commission rate (0.5%–1% across metals; we use an effective 0.6%).
const REFERRAL_BONUSES = [
  { id: 'r1', name: 'Priya Kapoor',    initials: 'PK', joinedAt: '12 Nov 2024', orders: 4, spent: 186000, earned: 1116 },
  { id: 'r2', name: 'Aarav Mehta',     initials: 'AM', joinedAt: '28 Sep 2024', orders: 2, spent:  94500, earned:  567 },
  { id: 'r3', name: 'Riya Iyer',       initials: 'RI', joinedAt: '03 Aug 2024', orders: 6, spent: 238400, earned: 1430 },
  { id: 'r4', name: 'Vikram Shah',     initials: 'VS', joinedAt: '17 Jun 2024', orders: 1, spent:  48900, earned:  293 },
  { id: 'r5', name: 'Ananya Desai',    initials: 'AD', joinedAt: '02 May 2024', orders: 3, spent: 132000, earned:  792 },
];

function ReferralEarningsList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div style={{
        padding: '22px 16px', borderRadius: 14,
        background: '#fff', border: `1px dashed ${REF_T.line}`, textAlign: 'center',
        fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, color: '#6E655C',
      }}>
        No referrals yet — share your code to start earning.
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: `1px solid ${REF_T.line}`,
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(30,27,19,0.04)',
    }}>
      {/* Column header row — grid layout matches the data rows exactly */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '34px 1fr auto',
        alignItems: 'center', gap: 12,
        padding: '10px 16px',
        fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10,
        color: '#9A8F84', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700,
        borderBottom: `1px solid ${REF_T.line}`,
        background: '#FBF7F3',
      }}>
        <span aria-hidden="true"/>
        <span>Referral</span>
        <span style={{ textAlign: 'right' }}>Earned</span>
      </div>

      {/* Mapped list of referral rows */}
      {items.map((r, i) => (
        <ReferralRow key={r.id} item={r} last={i === items.length - 1}/>
      ))}
    </div>
  );
}

function ReferralRow({ item, last }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '34px minmax(0, 1fr) auto',
      alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${REF_T.line}`,
    }}>
      {/* Avatar */}
      <span style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'linear-gradient(135deg, #F5E2B3, #E3B24A)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#3E2E23',
        fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 12, fontWeight: 700,
        letterSpacing: 0.3, flexShrink: 0,
      }}>{item.initials}</span>

      {/* Name + meta */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 14, fontWeight: 700,
          color: '#1E1B13', lineHeight: 1.2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.name}</div>
        <div style={{
          marginTop: 2,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: '#6E655C',
          letterSpacing: 0.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.orders} order{item.orders === 1 ? '' : 's'} · joined {item.joinedAt}
        </div>
      </div>

      {/* Amount — right-aligned, whole number in serif for weight */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 15, fontWeight: 700,
          color: REF_GOLD_DK, whiteSpace: 'nowrap',
        }}>₹{item.earned.toLocaleString('en-IN')}</div>
        <div style={{
          marginTop: 1,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9.5, color: '#9A8F84',
          letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600,
        }}>on ₹{item.spent.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
}

window.ReferPage = ReferPage;
