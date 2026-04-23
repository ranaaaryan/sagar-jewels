import React from 'react';
// 10+1 Monthly Investment Plan — SIP enrollment + management.
// Two tabs: "Enroll" (pre-enrollment flow with hero, installment input, autopay
// toggle, redemption calc, Start Now CTA) and "My Plan" (post-enrollment
// dashboard with progress, next payment, autopay, and installment history).

const TL = window.JEWEL_TOKENS;
const { useState: useStateL } = React;

function fmtINR(n) {
  const [int, dec] = n.toFixed(2).split('.');
  let s = int;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    s = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return `${s}.${dec}`;
}

function LoyaltyPage({ go, state, setState }) {
  const registered = !!state.loyalty.registered;
  const [tab, setTab] = useStateL(registered ? 'plan' : 'enroll');
  const [amount, setAmount] = useStateL(state.loyalty.draftMonthly || 10000);
  const [autopay, setAutopay] = useStateL(!!state.loyalty.autopay?.enabled);

  function onStart() {
    setState(s => ({
      ...s,
      loyalty: { ...s.loyalty, draftMonthly: amount, autopay: { enabled: autopay } },
    }));
    go('loyalty-register');
  }

  function togglePlanAutopay() {
    setState(s => ({
      ...s,
      loyalty: { ...s.loyalty, autopay: { enabled: !s.loyalty.autopay?.enabled } },
    }));
  }

  function payNow() {
    setState(s => {
      const total = 11;
      const nextCompleted = Math.min(total, (s.loyalty.completed || 0) + 1);
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const entry = {
        label: `Instalment ${nextCompleted}`,
        date: `Paid ${today}`,
        amount: s.loyalty.monthly,
        status: 'paid',
      };
      return {
        ...s,
        loyalty: {
          ...s.loyalty,
          completed: nextCompleted,
          ledger: [entry, ...(s.loyalty.ledger || [])],
        },
      };
    });
  }

  return (
    <>
      <TopBar title="10+1" onBack={() => go('home')} />
      <div style={{
        flex: 1, overflowY: 'auto',
        borderTop: '1px solid rgba(142, 25, 54, 0.35)',
      }}>
        <Tabs
          items={[{ key: 'enroll', label: 'Enroll' }, { key: 'plan', label: 'My Plan' }]}
          value={tab}
          onChange={setTab}
        />
        <div style={{ padding: '0 18px 30px' }}>
          {tab === 'enroll' ? (
            <EnrollTab
              amount={amount} setAmount={setAmount}
              autopay={autopay} setAutopay={setAutopay}
              onStart={onStart}
            />
          ) : (
            <PlanTab
              state={state}
              onEnroll={() => setTab('enroll')}
              toggleAutopay={togglePlanAutopay}
              payNow={payNow}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Enroll tab ──────────────────────────────────────────────
function EnrollTab({ amount, setAmount, autopay, setAutopay, onStart }) {
  const installments = 10;
  const benefitPct = 0.95;
  const total = amount * installments;
  const benefit = amount * benefitPct;
  const canBuy = total + benefit;

  return (
    <>
      {/* ── Hero banner — purple promo card with model portrait ── */}
      <div style={{
        marginTop: 4,
        position: 'relative', height: 170, borderRadius: 16, overflow: 'hidden',
        background: '#220B2F',
        display: 'flex',
        boxShadow: '0 8px 22px rgba(34,11,47,0.22)',
      }}>
        <div style={{
          width: '43%', flexShrink: 0, position: 'relative',
          background: `url(assets/loyalty/10plus1-model.png) center / cover no-repeat`,
        }}/>

        <div style={{ flex: 1, position: 'relative', padding: '14px 14px 14px 18px', color: '#E9C88A' }}>
          <div style={{
            position: 'absolute', right: -30, top: -30, width: 110, height: 110, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,143,71,0.16) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>
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

      {/* ── Autopay toggle ───────────────────────────────── */}
      <div style={{
        marginTop: 16, background: '#fff',
        border: `1px solid ${TL.line}`, borderRadius: 14,
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TL.sans, fontSize: 14.5, fontWeight: 700, color: TL.ink }}>
            Automate monthly payments
          </div>
          <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
            Installments auto-debit on due date.
          </div>
        </div>
        <Toggle value={autopay} onChange={() => setAutopay(v => !v)}/>
      </div>

      {/* ── Redemption calc card ─────────────────────────── */}
      <div style={{
        marginTop: 16, background: '#fff',
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
            sub={`(${(benefitPct * 100).toFixed(2)}% of single
installment value)`}
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

      <div style={{
        marginTop: 16, fontFamily: TL.sans, fontSize: 10.5,
        color: TL.inkSoft, lineHeight: 1.6, textAlign: 'center',
      }}>
        T&C apply. Amount redeemable in-store or on the app after 12th month.
      </div>
    </>
  );
}

// ─── My Plan tab ─────────────────────────────────────────────
function PlanTab({ state, onEnroll, toggleAutopay, payNow }) {
  const L = state.loyalty;
  const registered = !!L.registered;
  const totalMonths = 11;
  const completed = L.completed || 0;
  const pct = Math.min(100, Math.round((completed / totalMonths) * 100));
  const done = completed >= totalMonths;

  return (
    <>
      {/* ── Status banner ─────────────────────────────── */}
      <div style={{
        marginTop: 4,
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        background: '#220B2F',
        padding: '18px 20px',
        boxShadow: '0 8px 22px rgba(34,11,47,0.22)',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,143,71,0.16) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          fontFamily: TL.sans, fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
          color: '#C08A3A', textTransform: 'uppercase',
        }}>{L.tier || 'Sagar Gold'}</div>
        <div style={{
          fontFamily: "'Noto Serif', serif", fontSize: 22, fontWeight: 600, color: '#F2DDA7',
          lineHeight: 1.2, marginTop: 6,
        }}>
          {registered ? '10+1 Plan active' : 'Not enrolled yet'}
        </div>
        <div style={{
          fontFamily: TL.sans, fontSize: 12, color: '#E9C88A', marginTop: 6, lineHeight: 1.5,
        }}>
          {registered
            ? `You've completed ${completed} of ${totalMonths} months.`
            : 'Start your 10+1 plan to save every month.'}
        </div>
        {!registered && (
          <button onClick={onEnroll} style={{
            marginTop: 14, padding: '10px 18px', borderRadius: 999,
            background: '#C08A3A', color: '#220B2F',
            border: 'none', cursor: 'pointer',
            fontFamily: TL.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}>Enroll now</button>
        )}
      </div>

      {registered && (
        <div style={{
          marginTop: 16, background: '#fff',
          border: `1px solid ${TL.line}`, borderRadius: 14,
          padding: '18px 18px 14px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 12,
          }}>
            <div style={{ fontFamily: TL.sans, fontSize: 15, fontWeight: 700, color: TL.ink }}>
              Your 10+1 plan
            </div>
            <div style={{ fontFamily: TL.sans, fontSize: 12, fontWeight: 700, color: '#AF826D' }}>
              {pct}%
            </div>
          </div>
          <div style={{
            height: 8, borderRadius: 999, background: '#E8E1D5', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #AF826D 0%, #C08A3A 100%)',
              transition: 'width 220ms ease',
            }}/>
          </div>
          <div style={{ marginTop: 14 }}>
            <RowL title="Monthly installment" sub="" value={`₹${fmtINR(L.monthly)}`}/>
            <RowL title="Completed" sub="" value={`${completed} of ${totalMonths}`}/>
            <RowL title="Next installment on" sub="" value={done ? '—' : (L.nextAt || '—')}/>
          </div>
        </div>
      )}

      {registered && !done && (
        <div style={{
          marginTop: 16, background: '#fff',
          border: `1px solid ${TL.line}`, borderRadius: 14,
          padding: 18,
        }}>
          <div style={{
            fontFamily: TL.sans, fontSize: 10.5, color: TL.inkMuted,
            letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase',
          }}>Next payment</div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 14, marginTop: 10,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Noto Serif', serif", fontSize: 24, fontWeight: 600, color: TL.ink }}>
                ₹{fmtINR(L.monthly)}
              </div>
              <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.inkSoft, marginTop: 3 }}>
                {L.autopay?.enabled ? 'Auto-debit on' : 'Due'} {L.nextAt || '—'}
              </div>
            </div>
            <button onClick={payNow} style={{
              padding: '12px 22px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: '#AF826D', color: '#fff',
              fontFamily: "'Noto Serif', serif", fontSize: 15, fontWeight: 500,
              letterSpacing: 0.3, whiteSpace: 'nowrap',
              boxShadow: '0 6px 14px rgba(175,130,109,0.35)',
            }}>Pay Now</button>
          </div>
        </div>
      )}

      {/* ── Autopay ────────────────────────────────────── */}
      <div style={{
        marginTop: 16, background: '#fff',
        border: `1px solid ${TL.line}`, borderRadius: 14,
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TL.sans, fontSize: 14.5, fontWeight: 700, color: TL.ink }}>Autopay</div>
          <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.inkSoft, marginTop: 4, lineHeight: 1.4 }}>
            {L.autopay?.enabled
              ? 'Installments auto-debit on due date.'
              : 'Turn on to auto-debit each installment.'}
          </div>
        </div>
        <Toggle value={!!L.autopay?.enabled} onChange={toggleAutopay}/>
      </div>

      {/* ── Installment history ───────────────────────── */}
      {registered && L.ledger && L.ledger.length > 0 && (
        <div style={{
          marginTop: 16, background: '#fff',
          border: `1px solid ${TL.line}`, borderRadius: 14,
          padding: '18px 18px 6px',
        }}>
          <div style={{
            fontFamily: TL.sans, fontSize: 15, fontWeight: 700, color: TL.ink,
            marginBottom: 4,
          }}>Installment history</div>
          {L.ledger.map((e, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10, padding: '14px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${TL.lineSoft}`,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TL.sans, fontSize: 14, fontWeight: 700, color: TL.ink }}>
                  {e.label}
                </div>
                <div style={{ fontFamily: TL.sans, fontSize: 12, color: TL.inkSoft, marginTop: 2 }}>
                  {e.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  fontFamily: TL.sans, fontSize: 14, fontWeight: 800, color: TL.ink, whiteSpace: 'nowrap',
                }}>₹{fmtINR(e.amount)}</div>
                <Pill tone={e.status === 'paid' ? 'success' : 'warn'}>{e.status}</Pill>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Atoms local to this page ────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={value}
      style={{
        width: 48, height: 28, borderRadius: 999, border: 'none',
        background: value ? '#AF826D' : '#E8E1D5',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background 180ms ease', padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: value ? 23 : 3,
        width: 22, height: 22, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 180ms ease',
      }}/>
    </button>
  );
}

function RowL({ title, sub, value, emphasize }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 10, padding: '4px 0 14px', minHeight: sub ? 44 : 28,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: TL.sans,
          fontSize: emphasize ? 15 : 14.5,
          fontWeight: 700, color: TL.ink, lineHeight: 1.25,
        }}>{title}</div>
        {sub && (
          <div style={{
            fontFamily: TL.sans, fontSize: 12, color: TL.ink, opacity: 0.78,
            marginTop: 3, lineHeight: 1.35, whiteSpace: 'pre-line',
          }}>{sub}</div>
        )}
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
