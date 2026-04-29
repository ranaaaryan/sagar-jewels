import React from 'react';
// Refer a Friend — tier-based bonus ladder.
// Bonus % is determined by cumulative referrals: 1–25 Silver (0.25%),
// 26–50 Gold (0.50%), 51–75 Diamond (1%), 76–100 Platinum (2%).

const REF_T = window.JEWEL_TOKENS;
const REF_GOLD      = 'rgb(115,92,0)';
const REF_GOLD_DK   = '#5A4700';
const REF_GOLD_TINT = 'rgba(115,92,0,0.08)';
const REF_INK       = '#1E1B13';
const REF_INK_SOFT  = '#6E655C';

const TIERS = [
  { id: 'silver',   name: 'Silver',   pct: 0.25, range: [1, 25],
    accent: '#7E8893', accentDark: '#3E4750',
    bg: 'linear-gradient(160deg, #ECEEF1, #CFD5DC)',
    icon: 'silver' },
  { id: 'gold',     name: 'Gold',     pct: 0.50, range: [26, 50],
    accent: '#C99339', accentDark: '#6B4A2E',
    bg: 'linear-gradient(160deg, #FFF4DC, #F7DFB0)',
    icon: 'gold' },
  { id: 'diamond',  name: 'Diamond',  pct: 1.00, range: [51, 75],
    accent: '#C97C71', accentDark: '#84463D',
    bg: 'linear-gradient(160deg, #FBEDE6, #EFCFC1)',
    icon: 'diamond' },
  { id: 'platinum', name: 'Platinum', pct: 2.00, range: [76, 100],
    accent: '#7C9272', accentDark: '#3C5A3F',
    bg: 'linear-gradient(160deg, #EFF4E6, #D5E2C4)',
    icon: 'platinum' },
];

function tierAt(n) {
  if (n < 1)    return null;
  if (n <= 25)  return TIERS[0];
  if (n <= 50)  return TIERS[1];
  if (n <= 75)  return TIERS[2];
  return TIERS[3];
}

function ReferPage({ go, state }) {
  const code = `SAGAR${state?.user?.name?.split(' ')[0]?.toUpperCase()?.slice(0, 4) || 'RAVI'}${'123'}`;
  const [copied, setCopied] = React.useState(false);

  const totalReferred   = TOTAL_REFERRALS;
  const currentTier     = tierAt(totalReferred) || TIERS[0];
  const curIdx          = TIERS.indexOf(currentTier);
  const nextTier        = TIERS[curIdx + 1] || null;
  const [tierLow, tierHigh] = currentTier.range;
  const inTier          = Math.max(0, totalReferred - (tierLow - 1));
  const tierSize        = tierHigh - tierLow + 1;
  const tierProgress    = Math.min(100, Math.round((inTier / tierSize) * 100));
  const remainingToNext = nextTier ? (nextTier.range[0] - totalReferred) : 0;

  function doCopy() {
    try { navigator.clipboard?.writeText(code); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <TopBar title="Refer a Friend" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: REF_T.bg, padding: '6px 18px 40px' }}>

        {/* HERO — current tier with progress to next */}
        <TierHero
          tier={currentTier}
          nextTier={nextTier}
          inTier={inTier}
          tierSize={tierSize}
          tierProgress={tierProgress}
          remainingToNext={remainingToNext}
        />

        {/* CODE + share */}
        <CodeCard code={code} copied={copied} doCopy={doCopy}/>

        {/* TIER LADDER */}
        <SectionKicker kicker="Reward ladder" title="Refer more, earn more"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIERS.map((t, i) => (
            <TierLadderRow
              key={t.id}
              tier={t}
              index={i}
              currentIdx={curIdx}
              totalReferred={totalReferred}
            />
          ))}
        </div>

        <div style={{
          marginTop: 12,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5,
          color: '#9A8F84', lineHeight: 1.55,
        }}>
          Bonus % is based on how many friends you've referred. Calculated on net invoice value (excluding GST and making charges) and credited within 7 days of the purchase.
        </div>

        {/* HOW TIERS WORK */}
        <SectionKicker kicker="How tiers work" title="The more you refer, the higher you climb"/>
        <div style={{
          background: '#fff', borderRadius: 16, border: `1px solid ${REF_T.line}`, overflow: 'hidden',
        }}>
          {[
            { n: '01', t: 'Share your code',     d: 'Send via WhatsApp, SMS or email — your friend signs up with it.' },
            { n: '02', t: 'They start shopping', d: 'Every purchase they make credits your wallet at your current tier rate.' },
            { n: '03', t: 'You climb tiers',     d: 'After 25 referrals → Gold. 50 → Diamond. 75 → Platinum (2%).' },
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
                <div style={{ fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 15, fontWeight: 600, color: REF_INK }}>{s.t}</div>
                <div style={{ fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, color: REF_INK_SOFT, marginTop: 2, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* EARNINGS SNAPSHOT */}
        <SectionKicker kicker="Your earnings" title="Lifetime referral bonus"/>
        <div style={{
          background: '#fff', borderRadius: 16, border: `1px solid ${REF_T.line}`,
          padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: '#9A8F84',
              letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
            }}>Total earned</div>
            <div style={{
              fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 26, fontWeight: 700,
              color: REF_GOLD_DK, marginTop: 2,
            }}>₹{TOTAL_EARNED.toLocaleString('en-IN')}</div>
            <div style={{
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11, color: REF_INK_SOFT, marginTop: 2,
            }}>{totalReferred} referrals · currently on {currentTier.name}</div>
          </div>
          <button style={{
            padding: '10px 16px', borderRadius: 10, border: `1px solid ${REF_GOLD}`,
            background: '#fff', color: REF_GOLD, cursor: 'pointer',
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>View ledger</button>
        </div>

        {/* REFERRAL LIST */}
        <SectionKicker kicker="Your network" title="Recent referrals"/>
        <ReferralEarningsList items={REFERRAL_BONUSES}/>

        {/* TERMS */}
        <div style={{
          marginTop: 20, padding: '12px 14px', borderRadius: 12,
          background: REF_GOLD_TINT,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: REF_INK_SOFT,
          lineHeight: 1.6,
        }}>
          Tier rates may be revised every financial year. Cash-outs are processed monthly for balances above ₹500. <span style={{ color: REF_GOLD, fontWeight: 700, textDecoration: 'underline' }}>View full terms</span>.
        </div>
      </div>
    </>
  );
}

// ─── Hero ────────────────────────────────────────────
function TierHero({ tier, nextTier, inTier, tierSize, tierProgress, remainingToNext }) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 20, overflow: 'hidden',
      background: 'linear-gradient(135deg, #2E2117 0%, #4D3823 50%, #6B4A2E 100%)',
      position: 'relative', color: '#fff',
      boxShadow: '0 10px 26px rgba(46,33,23,0.32)',
    }}>
      <div style={{
        position: 'absolute', right: -50, top: -50, width: 220, height: 220,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${tier.accent}55, transparent 70%)`,
      }}/>
      <div style={{ position: 'relative', padding: '22px 20px 22px' }}>
        {/* tier badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 12px 5px 6px', borderRadius: 50,
          background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)',
        }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: tier.bg, color: tier.accentDark,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TierIcon kind={tier.icon}/>
          </span>
          <span style={{
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, fontWeight: 700,
            letterSpacing: 1.2, textTransform: 'uppercase',
          }}>You're on {tier.name}</span>
        </div>

        {/* big rate */}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 44, fontWeight: 700,
            lineHeight: 1, color: '#FFE9C2',
          }}>{tier.pct.toFixed(2)}%</span>
          <span style={{
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, fontWeight: 600,
            color: 'rgba(255,255,255,0.78)',
          }}>on every purchase</span>
        </div>

        {/* progress to next tier */}
        {nextTier ? (
          <>
            <div style={{
              marginTop: 14,
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, color: 'rgba(255,255,255,0.85)',
            }}>
              {inTier} of {tierSize} referrals to <strong style={{ color: '#FFE9C2' }}>{nextTier.name}</strong> ({nextTier.pct.toFixed(2)}%)
            </div>
            <div style={{
              marginTop: 8, height: 8, borderRadius: 4, overflow: 'hidden',
              background: 'rgba(255,255,255,0.14)',
            }}>
              <div style={{
                height: '100%', width: `${tierProgress}%`,
                background: `linear-gradient(90deg, ${tier.accent}, #FFE9C2)`,
                borderRadius: 4,
                transition: 'width 400ms ease',
              }}/>
            </div>
            <div style={{
              marginTop: 8,
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11, color: 'rgba(255,255,255,0.7)',
            }}>
              Refer {remainingToNext} more friend{remainingToNext === 1 ? '' : 's'} to unlock {nextTier.name}.
            </div>
          </>
        ) : (
          <div style={{
            marginTop: 14,
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, color: '#FFE9C2', fontWeight: 700,
          }}>
            ★ Top tier reached — earning the maximum 2% on every purchase.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code card ───────────────────────────────────────
function CodeCard({ code, copied, doCopy }) {
  return (
    <div style={{
      marginTop: 14, background: '#fff', borderRadius: 16,
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
        <button onClick={doCopy} style={{
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
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9.5, color: REF_INK_SOFT, fontWeight: 600,
            }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tier ladder row ─────────────────────────────────
function TierLadderRow({ tier, index, currentIdx, totalReferred }) {
  const isCurrent = index === currentIdx;
  const isPast    = index < currentIdx;
  const isFuture  = index > currentIdx;
  const [lo, hi]  = tier.range;

  let progressWithinTier = 0;
  if (isPast) progressWithinTier = 100;
  else if (isCurrent) {
    const inTier = Math.max(0, Math.min(hi - lo + 1, totalReferred - (lo - 1)));
    progressWithinTier = Math.round((inTier / (hi - lo + 1)) * 100);
  }

  return (
    <div style={{
      background: isCurrent ? tier.bg : '#fff',
      borderRadius: 14,
      border: isCurrent ? `1.5px solid ${tier.accent}` : `1px solid ${REF_T.line}`,
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
      position: 'relative',
      opacity: isFuture ? 0.92 : 1,
      boxShadow: isCurrent ? '0 4px 14px rgba(30,27,19,0.08)' : 'none',
    }}>
      <span style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: tier.bg, color: tier.accentDark,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid rgba(255,255,255,0.6)`,
      }}>
        <TierIcon kind={tier.icon} large/>
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 16, fontWeight: 700,
            color: REF_INK,
          }}>{tier.name}</span>
          {isCurrent && (
            <span style={{
              padding: '2px 8px', borderRadius: 50,
              background: tier.accentDark, color: '#fff',
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9, fontWeight: 700,
              letterSpacing: 0.8, textTransform: 'uppercase',
            }}>You're here</span>
          )}
          {isPast && (
            <span style={{
              padding: '2px 8px', borderRadius: 50,
              background: 'rgba(76,105,68,0.14)', color: '#4C6944',
              fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9, fontWeight: 700,
              letterSpacing: 0.8, textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Unlocked
            </span>
          )}
        </div>
        <div style={{
          marginTop: 3,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 11.5, color: REF_INK_SOFT,
        }}>
          {lo}–{hi} referrals
        </div>

        {(isCurrent || isPast) && (
          <div style={{
            marginTop: 8, height: 5, borderRadius: 3, overflow: 'hidden',
            background: 'rgba(0,0,0,0.06)',
          }}>
            <div style={{
              height: '100%', width: `${progressWithinTier}%`,
              background: tier.accentDark, borderRadius: 3,
              transition: 'width 400ms ease',
            }}/>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 22, fontWeight: 700,
          color: tier.accentDark,
        }}>{tier.pct.toFixed(2)}%</div>
        <div style={{
          marginTop: -2,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9.5, color: REF_INK_SOFT,
          letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
        }}>bonus</div>
      </div>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────
function TierIcon({ kind, large }) {
  const sz = large ? 22 : 14;
  const common = { width: sz, height: sz, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'silver':   return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M8 12l3 3 5-6"/></svg>;
    case 'gold':     return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>;
    case 'diamond':  return <svg {...common}><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M8 9h8"/></svg>;
    case 'platinum': return <svg {...common}><path d="M3 8l9 5 9-5"/><path d="M3 8v8l9 5 9-5V8"/><path d="M3 8l9-5 9 5"/></svg>;
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
        color: REF_INK, marginTop: 4,
      }}>{title}</div>
    </div>
  );
}

// ─── Mock data ───────────────────────────────────────
// User has referred 28 friends total — currently on Gold tier.
// Visible list shows the 5 most recent (3 Gold-tier, 2 Silver-tier).
const TOTAL_REFERRALS = 28;
const TOTAL_EARNED    = 8940;
const REFERRAL_BONUSES = [
  { id: 'r1', name: 'Priya Kapoor', initials: 'PK', joinedAt: '15 Apr 2026', position: 28, orders: 4, spent: 186000, earned:  930 },
  { id: 'r2', name: 'Aarav Mehta',  initials: 'AM', joinedAt: '02 Apr 2026', position: 27, orders: 2, spent:  94500, earned:  472 },
  { id: 'r3', name: 'Riya Iyer',    initials: 'RI', joinedAt: '20 Mar 2026', position: 26, orders: 6, spent: 238400, earned: 1192 },
  { id: 'r4', name: 'Vikram Shah',  initials: 'VS', joinedAt: '08 Mar 2026', position: 25, orders: 1, spent:  48900, earned:  122 },
  { id: 'r5', name: 'Ananya Desai', initials: 'AD', joinedAt: '24 Feb 2026', position: 24, orders: 3, spent: 132000, earned:  330 },
];

function ReferralEarningsList({ items }) {
  if (!items || items.length === 0) {
    return (
      <div style={{
        padding: '22px 16px', borderRadius: 14,
        background: '#fff', border: `1px dashed ${REF_T.line}`, textAlign: 'center',
        fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 12, color: REF_INK_SOFT,
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
      {items.map((r, i) => (
        <ReferralRow key={r.id} item={r} last={i === items.length - 1}/>
      ))}
    </div>
  );
}

function ReferralRow({ item, last }) {
  const tier = tierAt(item.position) || TIERS[0];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '34px minmax(0, 1fr) auto',
      alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${REF_T.line}`,
    }}>
      <span style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'linear-gradient(135deg, #F5E2B3, #E3B24A)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#3E2E23',
        fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 12, fontWeight: 700,
        flexShrink: 0,
      }}>{item.initials}</span>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <span style={{
            fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 14, fontWeight: 700,
            color: REF_INK, lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{item.name}</span>
          <span style={{
            padding: '1px 7px', borderRadius: 50,
            background: tier.bg, color: tier.accentDark,
            fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 8.5, fontWeight: 800,
            letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0,
          }}>{tier.name}</span>
        </div>
        <div style={{
          marginTop: 2,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 10.5, color: REF_INK_SOFT,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          #{item.position} · {item.orders} order{item.orders === 1 ? '' : 's'} · {item.joinedAt}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${REF_T.serif}`, fontSize: 15, fontWeight: 700,
          color: REF_GOLD_DK, whiteSpace: 'nowrap',
        }}>₹{item.earned.toLocaleString('en-IN')}</div>
        <div style={{
          marginTop: 1,
          fontFamily: `'Manrope', ${REF_T.sans}`, fontSize: 9.5, color: '#9A8F84',
          letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600,
        }}>{tier.pct.toFixed(2)}% on ₹{item.spent.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
}

window.ReferPage = ReferPage;
