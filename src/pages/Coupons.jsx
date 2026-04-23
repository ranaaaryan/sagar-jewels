import React from 'react';
// Coupons — "jewellery voucher ticket" design
// Each coupon is a physical ticket with a perforated notch, a colored spine
// with a wax-seal-style monogram, expiry countdown ring, and a tap-to-copy code.
// Tabs: Active / Locked / Used. Includes a pinnable "favourite" star and
// a cover banner at the top announcing new offers.
const TC = window.JEWEL_TOKENS;

function CouponsPage({ go, state, setState }) {
  const [tab, setTab] = React.useState('active');
  const [pinned, setPinned] = React.useState(() => new Set(['SAGAR10']));
  const [copied, setCopied] = React.useState(null);

  const coupons = [
    // active
    { code: 'SAGAR10',  kind: 'percent', value: 10,    desc: '10% off your next order',            min: 25000, exp: '30 Apr 2026', daysLeft: 12, palette: 'rose',   tag: 'Member' },
    { code: 'MAKING100',  kind: 'flat',    value: 5000,  desc: 'Waived making charges on gold',      min: 45000, exp: '15 May 2026', daysLeft: 27, palette: 'champagne', tag: 'Gold tier' },
    { code: 'FIRSTPAIR',  kind: 'flat',    value: 2500,  desc: '₹2,500 off your first earring pair', min: 9900,  exp: '12 Jun 2026', daysLeft: 55, palette: 'sage',   tag: 'Welcome' },
    { code: 'BRIDAL25',   kind: 'percent', value: 25,    desc: '25% off bridal sets over ₹2L',       min: 200000,exp: '31 Dec 2026', daysLeft: 257,palette: 'blush',  tag: 'Seasonal' },
    // locked (reward on 10+1 completion)
    { code: 'REWARD11',   kind: 'flat',    value: 8000,  desc: 'Your 11th-instalment bonus',         min: 0,     exp: 'Unlocks after 10 instalments', daysLeft: null, palette: 'gold',  tag: 'Locked', locked: true, progress: 6, total: 10 },
    // used
    { code: 'DIWALI500',  kind: 'flat',    value: 500,   desc: 'Diwali gift voucher',                min: 5000,  exp: 'Used 02 Nov 2025', palette: 'mist', used: true },
    { code: 'SPRING15',   kind: 'percent', value: 15,    desc: '15% off studs',                       min: 8000,  exp: 'Used 18 Mar 2026', palette: 'mist', used: true },
  ];

  const filtered = coupons.filter(c => {
    if (tab === 'active') return !c.locked && !c.used;
    if (tab === 'locked') return c.locked;
    if (tab === 'used')   return c.used;
  });
  // pin sort
  filtered.sort((a, b) => (pinned.has(b.code) ? 1 : 0) - (pinned.has(a.code) ? 1 : 0));

  function togglePin(code) {
    setPinned(p => {
      const n = new Set(p);
      n.has(code) ? n.delete(code) : n.add(code);
      return n;
    });
  }
  function copy(code) {
    try { navigator.clipboard.writeText(code); } catch {}
    setCopied(code);
    setTimeout(() => setCopied(c => c === code ? null : c), 1600);
  }

  const counts = {
    active: coupons.filter(c => !c.locked && !c.used).length,
    locked: coupons.filter(c => c.locked).length,
    used:   coupons.filter(c => c.used).length,
  };

  return (
    <>
      <TopBar title="Coupons" onBack={() => go('profile')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 30px' }}>
        {/* Top banner — rewards wallet summary */}
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 18, padding: '16px 18px',
          background: `linear-gradient(135deg, #3E2E23 0%, #5A3F2C 60%, #7E5437 100%)`,
          color: '#F3E6DB', display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.Tag width={20} height={20}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TC.sans, fontSize: 10.5, letterSpacing: 1.6, fontWeight: 700, opacity: 0.75 }}>
              COUPON WALLET
            </div>
            <div style={{ fontFamily: TC.serif, fontSize: 22, marginTop: 2 }}>
              {counts.active} active vouchers
            </div>
          </div>
          <div style={{
            fontFamily: TC.serif, fontSize: 26, padding: '6px 12px',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            lineHeight: 1,
          }}>
            ₹{coupons.filter(c => !c.locked && !c.used && c.kind === 'flat').reduce((s, c) => s + c.value, 0).toLocaleString('en-IN')}
            <div style={{ fontFamily: TC.sans, fontSize: 9.5, letterSpacing: 1.2, fontWeight: 700, opacity: 0.75, marginTop: 4 }}>
              UNLOCKED SAVINGS
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, margin: '18px 0 14px', borderBottom: `1px solid ${TC.line}` }}>
          {[
            { key: 'active', label: 'Active', count: counts.active },
            { key: 'locked', label: 'Locked', count: counts.locked },
            { key: 'used',   label: 'Used',   count: counts.used },
          ].map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 12px 12px', display: 'flex', alignItems: 'center', gap: 6,
                color: active ? TC.accent : TC.inkSoft,
                fontFamily: TC.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
                borderBottom: active ? `2px solid ${TC.accent}` : '2px solid transparent',
                marginBottom: -1,
              }}>
                <span>{t.label}</span>
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 999,
                  background: active ? TC.accentBg : TC.bgSoft, color: active ? TC.accentDk : TC.inkSoft,
                  letterSpacing: 0,
                }}>{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* Promo-code applier */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 16,
          padding: 4, paddingLeft: 14, borderRadius: 999,
          background: TC.card, boxShadow: TC.shadowCard,
          alignItems: 'center',
        }}>
          <Icon.Tag width={16} height={16} style={{ color: TC.inkMuted }}/>
          <span style={{ flex: 1, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, color: TC.inkMuted, letterSpacing: 1 }}>
            Enter a coupon code
          </span>
          <button style={{
            padding: '8px 16px', borderRadius: 999, border: 'none',
            background: TC.ink, color: '#fff', cursor: 'pointer',
            fontFamily: TC.sans, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
          }}>Apply</button>
        </div>

        {/* Tickets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(c => (
            <Ticket key={c.code} c={c}
              pinned={pinned.has(c.code)}
              onPin={() => togglePin(c.code)}
              copied={copied === c.code}
              onCopy={() => copy(c.code)} />
          ))}
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: 40, color: TC.inkSoft,
              fontFamily: TC.sans, fontSize: 13,
            }}>Nothing in this tab.</div>
          )}
        </div>

        {/* How to use — subtle footer */}
        {tab === 'active' && (
          <div style={{
            marginTop: 18, padding: 14, borderRadius: 12, background: TC.bgSoft,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Icon.Sparkle width={16} height={16} style={{ color: TC.accent, flexShrink: 0, marginTop: 2 }}/>
            <div style={{ fontFamily: TC.sans, fontSize: 11.5, color: TC.inkSoft, lineHeight: 1.55 }}>
              One coupon per order. Codes stack with 10+1 Plan savings but not with other promotional offers.
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Ticket ─────────────────────────────────────────────────────
function Ticket({ c, pinned, onPin, copied, onCopy }) {
  const palettes = {
    rose:      { spine: '#9B6B4A', spineSoft: '#C79577', accent: '#7E5437', tint: '#F3E6DB', seal: '#EED9CC' },
    champagne: { spine: '#A88658', spineSoft: '#CFB07B', accent: '#7B5F3A', tint: '#F4EADA', seal: '#EFE0C4' },
    sage:      { spine: '#6F7F5F', spineSoft: '#97A585', accent: '#56664A', tint: '#ECEFE4', seal: '#D9DFCE' },
    blush:     { spine: '#B46E6A', spineSoft: '#D39791', accent: '#8E4A46', tint: '#F6E4DF', seal: '#EED2CD' },
    gold:      { spine: '#B48B3C', spineSoft: '#D9B368', accent: '#8A6526', tint: '#F5EAD0', seal: '#EDD99B' },
    mist:      { spine: '#8A8A85', spineSoft: '#B2B2AD', accent: '#5F5F5B', tint: '#E8E8E4', seal: '#D3D3CF' },
  };
  const p = palettes[c.palette] || palettes.rose;
  const dimmed = c.used;

  return (
    <div style={{
      position: 'relative', display: 'flex',
      borderRadius: 18, overflow: 'visible',
      filter: dimmed ? 'grayscale(0.7)' : 'none',
      opacity: dimmed ? 0.7 : 1,
    }}>
      {/* Spine */}
      <div style={{
        width: 78, flexShrink: 0,
        background: `linear-gradient(160deg, ${p.spine} 0%, ${p.spineSoft} 100%)`,
        borderTopLeftRadius: 18, borderBottomLeftRadius: 18,
        color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '14px 8px', position: 'relative',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.12)',
      }}>
        {/* Wax seal monogram */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${p.seal} 0%, ${p.accent} 90%)`,
          border: `1px solid rgba(255,255,255,0.35)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TC.serif, fontSize: 14, color: p.accent, fontWeight: 600,
          marginBottom: 8, boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.15)',
        }}>A</div>

        {/* Big value */}
        {c.kind === 'percent' ? (
          <>
            <div style={{ fontFamily: TC.serif, fontSize: 32, lineHeight: 1, fontWeight: 500 }}>{c.value}</div>
            <div style={{ fontFamily: TC.sans, fontSize: 10, letterSpacing: 1.6, fontWeight: 700, marginTop: 2 }}>% OFF</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: TC.serif, fontSize: 22, lineHeight: 1, fontWeight: 500 }}>₹{c.value.toLocaleString('en-IN')}</div>
            <div style={{ fontFamily: TC.sans, fontSize: 10, letterSpacing: 1.6, fontWeight: 700, marginTop: 2 }}>OFF</div>
          </>
        )}
      </div>

      {/* Perforation — notched circles top/bottom */}
      <div style={{
        width: 14, flexShrink: 0, position: 'relative',
        background: p.tint,
        backgroundImage: `radial-gradient(circle at center, transparent 4px, ${p.tint} 4.5px)`,
      }}>
        {/* top notch */}
        <div style={{ position: 'absolute', top: -7, left: -7, width: 14, height: 14, borderRadius: '50%', background: TC.bg }}/>
        {/* bottom notch */}
        <div style={{ position: 'absolute', bottom: -7, left: -7, width: 14, height: 14, borderRadius: '50%', background: TC.bg }}/>
        {/* dashed line */}
        <div style={{
          position: 'absolute', top: 10, bottom: 10, left: '50%', width: 0,
          borderLeft: `1.5px dashed ${p.accent}`, opacity: 0.35, transform: 'translateX(-50%)',
        }}/>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, minWidth: 0, background: p.tint,
        borderTopRightRadius: 18, borderBottomRightRadius: 18,
        padding: '14px 16px 14px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
        position: 'relative',
      }}>
        {/* Top row: tag + pin */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {c.tag && (
            <span style={{
              fontFamily: TC.sans, fontSize: 9.5, letterSpacing: 1.3, fontWeight: 700, textTransform: 'uppercase',
              color: p.accent, padding: '2px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.6)',
              border: `1px solid ${p.spineSoft}40`,
            }}>{c.tag}</span>
          )}
          {!c.locked && !c.used && (
            <button onClick={onPin} aria-label="Pin" style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              color: pinned ? p.accent : 'rgba(0,0,0,0.25)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                <path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5 6.8 19.3l1-5.9L3.5 9.2l5.9-.9L12 3z"/>
              </svg>
            </button>
          )}
          {c.used && (
            <span style={{ fontFamily: TC.sans, fontSize: 9.5, color: p.accent, letterSpacing: 1.3, fontWeight: 700, textTransform: 'uppercase' }}>Redeemed</span>
          )}
        </div>

        {/* Description */}
        <div style={{ fontFamily: TC.serif, fontSize: 17, color: TC.ink, lineHeight: 1.2, paddingRight: 4 }}>
          {c.desc}
        </div>

        {/* Min spend / locked progress */}
        {c.locked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
              <div style={{ width: `${(c.progress / c.total) * 100}%`, height: '100%', background: p.accent }}/>
            </div>
            <span style={{ fontFamily: TC.sans, fontSize: 11, fontWeight: 700, color: p.accent }}>
              {c.progress}/{c.total}
            </span>
          </div>
        ) : c.min > 0 && (
          <div style={{ fontFamily: TC.sans, fontSize: 11, color: TC.inkSoft }}>
            on orders over <b style={{ color: TC.ink }}>₹{c.min.toLocaleString('en-IN')}</b>
          </div>
        )}

        {/* Code + action row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
          borderTop: `1px dashed ${p.accent}40`, paddingTop: 10,
        }}>
          {!c.used && !c.locked ? (
            <>
              <button onClick={onCopy} style={{
                flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.7)', border: `1px dashed ${p.accent}80`,
                cursor: 'pointer', color: p.accent,
                fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, fontWeight: 700, letterSpacing: 1,
              }}>
                <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.code}</span>
                {copied ? <Icon.Check width={14} height={14}/> : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                  </svg>
                )}
              </button>
              <div style={{
                fontFamily: TC.sans, fontSize: 10, color: p.accent, fontWeight: 700,
                letterSpacing: 0.3, textAlign: 'right', flexShrink: 0, lineHeight: 1.2,
              }}>
                {c.daysLeft <= 14 ? (
                  <>
                    <div style={{ color: TC.danger }}>{c.daysLeft}d left</div>
                    <div style={{ color: TC.inkMuted, fontWeight: 500, fontSize: 9, letterSpacing: 0.5 }}>exp {c.exp}</div>
                  </>
                ) : (
                  <>
                    <div>{c.exp.split(' ').slice(0, 2).join(' ')}</div>
                    <div style={{ color: TC.inkMuted, fontWeight: 500, fontSize: 9, letterSpacing: 0.5 }}>valid until</div>
                  </>
                )}
              </div>
            </>
          ) : c.locked ? (
            <div style={{
              flex: 1, padding: '7px 10px', borderRadius: 6,
              background: 'rgba(255,255,255,0.5)', border: `1px dashed ${p.accent}60`,
              color: p.accent, fontFamily: TC.sans, fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
              </svg>
              {c.exp}
            </div>
          ) : (
            <div style={{
              flex: 1, padding: '7px 10px',
              fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, fontWeight: 600,
              color: TC.inkMuted, letterSpacing: 1, textDecoration: 'line-through',
            }}>{c.code}</div>
          )}
        </div>
      </div>

      {/* Copied toast */}
      {copied && (
        <div style={{
          position: 'absolute', top: -12, right: 10,
          background: TC.ink, color: '#fff',
          padding: '4px 10px', borderRadius: 999,
          fontFamily: TC.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>Copied</div>
      )}
    </div>
  );
}

window.CouponsPage = CouponsPage;
