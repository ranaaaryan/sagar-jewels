// 10+1 Monthly Investment Plan — recreated from Figma reference
// Hero banner with model portrait + purple promo card, installment input,
// live redemption calculation card, and Start Now CTA that opens the
// Personal Details registration form.

const TL = window.JEWEL_TOKENS;
const { useState: useStateL } = React;

function fmtINR(n) {
  // two-decimal Indian format e.g. 1,09,500.00
  const [int, dec] = n.toFixed(2).split('.');
  // group as Indian: last 3, then groups of 2
  let s = int;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    s = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return `${s}.${dec}`;
}

function LoyaltyPage({ go, state, setState }) {
  const [amount, setAmount] = useStateL(state.loyalty.draftMonthly || 10000);

  const installments = 10;
  const benefitPct = 0.95; // 95% of single installment
  const total = amount * installments;
  const benefit = amount * benefitPct;
  const canBuy = total + benefit;

  function onStart() {
    setState(s => ({ ...s, loyalty: { ...s.loyalty, draftMonthly: amount } }));
    go('loyalty-register');
  }

  return (
    <>
      <TopBar title="10+1" onBack={() => go('home')} />
      <div style={{
        flex: 1, overflowY: 'auto', padding: '6px 18px 30px',
        // thin maroon divider directly under top bar, matches fig
        borderTop: '1px solid rgba(142, 25, 54, 0.35)',
      }}>

        {/* ── Hero banner — purple promo card with model portrait ── */}
        <div style={{
          marginTop: 16,
          position: 'relative', height: 170, borderRadius: 16, overflow: 'hidden',
          background: '#220B2F',
          display: 'flex',
          boxShadow: '0 8px 22px rgba(34,11,47,0.22)',
        }}>
          {/* Model photo — left 43% */}
          <div style={{
            width: '43%', flexShrink: 0, position: 'relative',
            background: `url(assets/loyalty/10plus1-model.png) center / cover no-repeat`,
          }}/>

          {/* Purple detail panel — right side */}
          <div style={{ flex: 1, position: 'relative', padding: '14px 14px 14px 18px', color: '#E9C88A' }}>
            {/* decorative mandala circle (top-right) */}
            <div style={{
              position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,143,71,0.16) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}/>
            {/* corner dots */}
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', right: 6, top: 28, opacity: 0.45 }}>
              <g stroke="#C08A3A" strokeWidth="0.8" fill="none">
                <circle cx="45" cy="45" r="22"/>
                <circle cx="45" cy="45" r="32"/>
                <circle cx="45" cy="45" r="40"/>
                {[...Array(12)].map((_, i) => {
                  const a = (i * 30) * Math.PI/180;
                  const x1 = 45 + Math.cos(a) * 22, y1 = 45 + Math.sin(a) * 22;
                  const x2 = 45 + Math.cos(a) * 40, y2 = 45 + Math.sin(a) * 40;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
                })}
              </g>
            </svg>

            {/* top ornamental row of plus signs */}
            <div style={{
              fontSize: 9, color: '#C08A3A', letterSpacing: 0.5, lineHeight: 1,
              marginBottom: 10, overflow: 'hidden', whiteSpace: 'nowrap',
            }}>+++++++++++++++++++++++++++</div>

            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: "'Noto Serif', serif", fontSize: 20, fontWeight: 500, color: '#C08A3A', lineHeight: 1.15 }}>
                10 + 2 <span style={{ color: '#F2DDA7', fontWeight: 600 }}>Monthly</span>
              </div>
              <div style={{ fontFamily: "'Noto Serif', serif", fontSize: 20, fontWeight: 600, color: '#F2DDA7', lineHeight: 1.15, marginTop: 1 }}>
                Investment Plan
              </div>
              <div style={{ fontFamily: "'Noto Serif', serif", fontSize: 11, color: '#E9C88A', marginTop: 10, lineHeight: 1.4 }}>
                95% of the first installment<br/>
                Minimum amt.: Rs. 100
              </div>
            </div>

            {/* bottom ornamental row */}
            <div style={{
              position: 'absolute', left: 18, right: 12, bottom: 10,
              fontSize: 9, color: '#C08A3A', letterSpacing: 0.5, lineHeight: 1,
              overflow: 'hidden', whiteSpace: 'nowrap',
            }}>+++++++++++++++++++++++++++</div>
          </div>
        </div>

        {/* ── Installment input ────────────────────────────── */}
        <div style={{ marginTop: 22 }}>
          <label style={{
            display: 'block', fontFamily: TL.sans, fontSize: 14, color: TL.ink, marginBottom: 10,
          }}>Enter monthly installment amount</label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px', background: '#fff', borderRadius: 8,
            border: `1px solid ${TL.line}`,
          }}>
            <span style={{ fontFamily: TL.sans, fontSize: 16, fontWeight: 700, color: TL.ink }}>₹</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Math.max(100, Number(e.target.value) || 0))}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: TL.sans, fontSize: 16, fontWeight: 700, color: TL.ink,
                padding: 0,
              }}
            />
          </div>
        </div>

        {/* ── Redemption calc card ─────────────────────────── */}
        <div style={{
          marginTop: 18, background: '#fff',
          border: `1px solid ${TL.line}`, borderRadius: 14,
          padding: '18px 18px 20px',
        }}>
          <div style={{
            fontFamily: TL.sans, fontSize: 15, fontWeight: 700, color: TL.ink,
            paddingBottom: 14, borderBottom: `1px solid ${TL.lineSoft}`,
          }}>Redemption after maturity</div>

          <div style={{ paddingTop: 14 }}>
            <RowL
              title="Your total payment"
              sub="(10 installments)"
              value={`₹${fmtINR(total)}`}
            />
            <RowL
              title="Special benefit"
              sub={`(${(benefitPct * 100).toFixed(2)}% of single\u000Ainstallment value)`}
              value={`₹${fmtINR(benefit)}`}
            />
          </div>

          <div style={{ borderTop: `1px solid ${TL.lineSoft}`, marginTop: 14, paddingTop: 16 }}>
            <RowL
              title="You can buy jewellery worth"
              sub="(after 12th month)"
              value={`₹${fmtINR(canBuy)}`}
              emphasize
            />
          </div>
        </div>

        {/* ── Start Now CTA ────────────────────────────── */}
        <button onClick={onStart} style={{
          marginTop: 18, width: '100%', padding: '16px 0',
          borderRadius: 999, border: 'none', cursor: 'pointer',
          background: '#AF826D', color: '#fff',
          fontFamily: "'Noto Serif', serif", fontSize: 18, fontWeight: 500,
          letterSpacing: 0.3,
          boxShadow: '0 6px 14px rgba(175,130,109,0.35)',
        }}>Start Now</button>

        {/* Tiny footnote for context */}
        <div style={{
          marginTop: 16, fontFamily: TL.sans, fontSize: 10.5,
          color: TL.inkSoft, lineHeight: 1.6, textAlign: 'center',
        }}>
          T&C apply. Amount redeemable in-store or on the app after 12th month.
        </div>
      </div>
    </>
  );
}

function RowL({ title, sub, value, emphasize }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 10, padding: '4px 0 14px', minHeight: 44,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: TL.sans,
          fontSize: emphasize ? 15 : 14.5,
          fontWeight: 700, color: TL.ink, lineHeight: 1.25,
        }}>{title}</div>
        <div style={{
          fontFamily: TL.sans, fontSize: 12, color: TL.ink, opacity: 0.78,
          marginTop: 3, lineHeight: 1.35, whiteSpace: 'pre-line',
        }}>{sub}</div>
      </div>
      <div style={{
        fontFamily: TL.sans,
        fontSize: emphasize ? 15 : 15,
        fontWeight: 800, color: TL.ink,
        whiteSpace: 'nowrap', alignSelf: 'flex-start',
        paddingTop: 2,
      }}>{value}</div>
    </div>
  );
}

window.LoyaltyPage = LoyaltyPage;
