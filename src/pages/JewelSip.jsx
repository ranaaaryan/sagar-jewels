import React from 'react';
// Jewel SIP — premium fintech-style flow.
// If the user has no active SIP for this scheme: renders SipEnrollmentForm.
// If they do: renders SipDashboard (locked-in gold + progress + history + due date).
// Enrollment is gated by PanGateModal when contract value > ₹2L.

const JS_T = window.JEWEL_TOKENS;
const JS_GOLD      = 'rgb(115,92,0)';
const JS_GOLD_DK   = '#5A4700';
const JS_GOLD_TINT = 'rgba(115,92,0,0.08)';
const JS_INK       = '#1E1B13';
const JS_INK_SOFT  = '#6E655C';
const JS_LINE      = 'rgba(47,52,48,0.10)';

const SCHEME_ID   = 'jewel-sip';
const MIN_MONTHLY = 1500;
const MAX_MONTHLY = 100000;
const TENURES     = [12, 18, 24, 36, 48, 60];
const AMOUNT_CHIPS = [2000, 5000, 10000, 15000, 25000];

function JewelSipPage({ go, state, setState }) {
  const active = (state.user.sips || []).find(
    s => s.schemeId === SCHEME_ID && s.status === 'active'
  );

  return (
    <>
      <TopBar title="Jewel SIP" onBack={() => go('schemes')}/>
      {active
        ? <SipDashboard sip={active} go={go} state={state} setState={setState}/>
        : <SipEnrollmentForm go={go} state={state} setState={setState}/>
      }
    </>
  );
}

/* ═══ Enrollment ═══════════════════════════════════════════════════ */

function SipEnrollmentForm({ go, state, setState }) {
  const rate = state.goldRate?.buy || 11850;
  const [monthly, setMonthly] = React.useState(5000);
  const [tenure, setTenure]   = React.useState(24);
  const [autopay, setAutopay] = React.useState(true);
  const [touched, setTouched] = React.useState(false);

  const contractValue = monthly * tenure;
  const estLockedGm   = contractValue / rate;
  const maturityDate  = new Date(Date.now() + tenure * 30 * 24 * 60 * 60 * 1000);

  // PAN gate — gate the enrollment if the full contract value > threshold
  const pan = usePanGate({ user: state.user, cumulativeValue: contractValue });
  const [pendingEnroll, setPendingEnroll] = React.useState(false);

  const error = (() => {
    if (!touched) return null;
    if (!Number.isFinite(monthly) || monthly <= 0) return 'Enter a valid amount';
    if (monthly < MIN_MONTHLY) return `Minimum monthly instalment is ₹${MIN_MONTHLY.toLocaleString('en-IN')}`;
    if (monthly > MAX_MONTHLY) return `Maximum is ₹${MAX_MONTHLY.toLocaleString('en-IN')}`;
    return null;
  })();

  function tryStartSip() {
    setTouched(true);
    if (error || !monthly) return;
    if (pan.blocked) { setPendingEnroll(true); pan.openGate(); return; }
    actuallyEnroll();
  }

  function actuallyEnroll() {
    const now = new Date();
    const nextDue = new Date(now); nextDue.setMonth(nextDue.getMonth() + 1);
    const id = `sip_${now.getTime()}`;
    setState(s => ({
      ...s,
      user: { ...s.user, sips: [
        ...(s.user.sips || []),
        {
          id, schemeId: SCHEME_ID, schemeName: 'Jewel SIP',
          monthly, tenure, autopay,
          startedAt: now.toISOString(),
          nextDueAt: nextDue.toISOString(),
          status: 'active',
          paidMonths: [],
          lockedGm: 0,
        },
      ]},
    }));
    setPendingEnroll(false);
  }

  function onPanUploaded(panImage) {
    setState(s => ({ ...s, user: { ...s.user, panImage } }));
    pan.closeGate();
    if (pendingEnroll) actuallyEnroll();
  }

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', background: JS_T.bg, padding: '10px 16px 140px' }}>
        {/* Value prop hero */}
        <div style={{
          marginTop: 6, padding: '20px 20px 22px', borderRadius: 18,
          background: 'linear-gradient(135deg, #5C3B2B 0%, #8A5B44 55%, #AF826D 100%)',
          color: '#FBEEE2', position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 28px rgba(58,36,24,0.28)',
        }}>
          <svg width="160" height="160" viewBox="0 0 160 160"
            style={{ position: 'absolute', top: -40, right: -40, opacity: 0.22, pointerEvents: 'none' }}>
            <g stroke="#F2DDCB" strokeWidth="1" fill="none">
              <circle cx="80" cy="80" r="34"/>
              <circle cx="80" cy="80" r="52"/>
              <circle cx="80" cy="80" r="70"/>
            </g>
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, letterSpacing: 2.4,
              color: '#F2DDCB', fontWeight: 700,
            }}>◆ MONTHLY GOLD SIP</div>
            <div style={{
              marginTop: 8,
              fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 26, fontWeight: 700,
              lineHeight: 1.15, maxWidth: 260,
            }}>Turn rupees into 22K gold, month after month.</div>
            <div style={{
              marginTop: 8,
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 12.5, color: 'rgba(251,238,226,0.82)',
              lineHeight: 1.55, maxWidth: 280,
            }}>
              Fixed monthly investment, accrues live at today&rsquo;s rate. Redeem as jewellery at maturity —
              we waive 5% making charges.
            </div>
          </div>
        </div>

        {/* Rate strip */}
        <div style={{ marginTop: 12 }}>
          <RateStrip label="Today's buy rate · 24K" rate={rate} delta={state.goldRate?.delta24h} live/>
        </div>

        {/* Monthly amount */}
        <Card title="Monthly instalment">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FBF7F3',
            border: `1px solid ${error ? '#D65A50' : JS_LINE}`,
            borderRadius: 12, padding: '0 14px', height: 52,
          }}>
            <span style={{
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 16, fontWeight: 700, color: JS_INK_SOFT,
            }}>₹</span>
            <input
              type="text" inputMode="numeric"
              value={monthly === 0 ? '' : String(monthly)}
              onChange={e => setMonthly(Number((e.target.value || '').replace(/[^0-9]/g, '')) || 0)}
              onBlur={() => setTouched(true)}
              placeholder="5000"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 22, fontWeight: 800,
                color: JS_INK, textAlign: 'right', minWidth: 0,
              }}
            />
            <span style={{
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 12, fontWeight: 600, color: JS_INK_SOFT,
            }}>/mo</span>
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {AMOUNT_CHIPS.map(c => {
              const on = monthly === c;
              return (
                <button key={c} type="button"
                  onClick={() => { setMonthly(c); setTouched(true); }}
                  style={{
                    padding: '6px 14px', borderRadius: 50, cursor: 'pointer',
                    background: on ? JS_GOLD_TINT : '#fff',
                    color: JS_GOLD_DK, fontWeight: 700, fontSize: 11.5,
                    fontFamily: `'Manrope', ${JS_T.sans}`,
                    border: `1px solid ${on ? JS_GOLD : 'rgba(115,92,0,0.22)'}`,
                    letterSpacing: 0.3,
                  }}>₹{c.toLocaleString('en-IN')}</button>
              );
            })}
          </div>
        </Card>

        {/* Tenure */}
        <Card title="Tenure">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {TENURES.map(t => {
              const on = tenure === t;
              return (
                <button key={t} type="button" onClick={() => setTenure(t)} style={{
                  padding: '12px 0', borderRadius: 10, cursor: 'pointer',
                  background: on ? '#fff' : '#FBF7F3',
                  border: `1.5px solid ${on ? JS_GOLD : JS_LINE}`,
                  color: on ? JS_GOLD_DK : JS_INK,
                  boxShadow: on ? '0 2px 8px rgba(115,92,0,0.14)' : 'none',
                  fontFamily: `'Manrope', ${JS_T.sans}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 160ms ease',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>{t}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.8 }}>
                    {t === 12 ? '1 year' : t === 24 ? '2 years' : t === 60 ? '5 years' : `${t} months`}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Contract summary */}
        <div style={{
          marginTop: 16, padding: '16px 16px 18px', borderRadius: 16,
          background: 'linear-gradient(180deg, #FBF7F1 0%, #F4EADD 100%)',
          border: `1px solid rgba(115,92,0,0.2)`,
        }}>
          <div style={{
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, color: JS_GOLD_DK,
            letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12,
          }}>Contract summary</div>
          <SummaryRow label="Total invested over tenure"
            value={`₹${contractValue.toLocaleString('en-IN')}`}/>
          <SummaryRow label="Estimated locked-in gold"
            detail="at today's rate · actual grams accrue per month"
            value={`${estLockedGm.toFixed(3)} g`}/>
          <SummaryRow label="Maturity date"
            value={maturityDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            last/>
        </div>

        {/* Autopay */}
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 14,
          background: '#fff', border: `1px solid ${JS_LINE}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'rgba(76,105,68,0.12)', color: '#4C6944',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 1 9 9"/>
              <path d="M3 6v6h6"/>
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 13, fontWeight: 700, color: JS_INK,
            }}>Auto-pay instalments</div>
            <div style={{
              marginTop: 2,
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, color: JS_INK_SOFT, lineHeight: 1.4,
            }}>Never miss a month. Debits from your primary bank on the due date.</div>
          </div>
          <Switch on={autopay} onToggle={() => setAutopay(v => !v)}/>
        </div>

        {/* PAN required notice */}
        {pan.required && (
          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 12,
            background: JS_GOLD_TINT, border: `1px dashed ${JS_GOLD}`,
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, color: JS_GOLD_DK, lineHeight: 1.5,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="5" width="18" height="14" rx="2"/>
              <path d="M3 10h18"/>
            </svg>
            <span>
              This plan totals ₹{contractValue.toLocaleString('en-IN')} —
              {pan.hasPan
                ? <strong> PAN on file, ready to enrol.</strong>
                : <strong> we&rsquo;ll ask for your PAN card image when you start.</strong>}
            </span>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{
        padding: '12px 18px 14px', background: '#fff',
        borderTop: `1px solid ${JS_LINE}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10, color: JS_INK_SOFT,
            letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
          }}>Your contract</div>
          <div style={{
            fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 18, fontWeight: 700,
            color: JS_GOLD_DK, marginTop: 1,
          }}>₹{monthly.toLocaleString('en-IN')} × {tenure} months</div>
        </div>
        <button onClick={tryStartSip} style={{
          height: 48, padding: '0 22px', borderRadius: 12, border: 'none',
          background: JS_GOLD, color: '#fff',
          cursor: 'pointer',
          fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 12.5, fontWeight: 700,
          letterSpacing: 0.8, textTransform: 'uppercase',
          boxShadow: '0 4px 12px rgba(115,92,0,0.22)',
        }}>Start SIP</button>
      </div>

      <PanGateModal
        open={pan.open}
        pendingValue={contractValue}
        panNumber={state.user.kyc?.pan}
        onSubmit={onPanUploaded}
        onCancel={() => { pan.closeGate(); setPendingEnroll(false); }}
      />
    </>
  );
}

/* ═══ Dashboard ═══════════════════════════════════════════════════ */

function SipDashboard({ sip, go, state, setState }) {
  const rate = state.goldRate?.buy || 11850;
  const sellRate = state.goldRate?.sell || 11368;
  const paid = sip.paidMonths || [];
  const lockedGm = sip.lockedGm ?? paid.reduce((g, m) => g + m.gramsAccrued, 0);
  const currentValue = Math.round(lockedGm * sellRate);
  const invested = paid.reduce((a, m) => a + m.amount, 0);
  const progressPct = Math.min(100, Math.round((paid.length / sip.tenure) * 100));
  const remainingMonths = Math.max(0, sip.tenure - paid.length);

  const [payingNow, setPayingNow] = React.useState(false);
  function payNow() {
    if (payingNow) return;
    setPayingNow(true);
    setTimeout(() => {
      const now = new Date();
      const grams = +((sip.monthly / rate)).toFixed(4);
      const nextDue = new Date(sip.nextDueAt || now);
      nextDue.setMonth(nextDue.getMonth() + 1);
      setState(s => ({
        ...s,
        user: { ...s.user, sips: (s.user.sips || []).map(x => x.id === sip.id ? {
          ...x,
          paidMonths: [
            ...x.paidMonths,
            { date: now.toISOString(), amount: sip.monthly, gramsAccrued: grams, pricePerGm: rate },
          ],
          lockedGm: +(x.lockedGm + grams).toFixed(4),
          nextDueAt: nextDue.toISOString(),
          status: (x.paidMonths.length + 1) >= x.tenure ? 'matured' : 'active',
        } : x)},
      }));
      setPayingNow(false);
    }, 600);
  }

  function toggleAutopay() {
    setState(s => ({
      ...s,
      user: { ...s.user, sips: (s.user.sips || []).map(x =>
        x.id === sip.id ? { ...x, autopay: !x.autopay } : x
      )},
    }));
  }

  const nextDueDate = sip.nextDueAt ? new Date(sip.nextDueAt) : null;
  const dueSoon = nextDueDate && daysBetween(new Date(), nextDueDate) <= 5;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: JS_T.bg, padding: '10px 16px 40px' }}>
      {/* Locked-in hero */}
      <div style={{
        marginTop: 6, padding: '20px 20px 22px', borderRadius: 18,
        background: 'linear-gradient(135deg, #2F1D11 0%, #5A3B23 48%, #8A5E3C 100%)',
        color: '#F3D69B', position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 28px rgba(58,36,24,0.28)',
      }}>
        <svg width="150" height="150" viewBox="0 0 150 150"
          style={{ position: 'absolute', top: -34, right: -30, opacity: 0.22, pointerEvents: 'none' }}>
          <g stroke="#E9BE6F" strokeWidth="1" fill="none">
            <path d="M75 16l42 40-42 72L33 56z"/>
            <path d="M33 56h84"/>
          </g>
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, letterSpacing: 2.4,
            color: '#E9BE6F', fontWeight: 700,
          }}>◆ LOCKED-IN GOLD · 22KT</div>
          <div style={{
            marginTop: 8,
            fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 34, fontWeight: 700,
            lineHeight: 1.05,
          }}>{lockedGm.toFixed(4)} g</div>
          <div style={{
            marginTop: 6,
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 13, color: 'rgba(243,214,155,0.85)',
          }}>
            Worth ₹{currentValue.toLocaleString('en-IN')} &middot;
            Invested ₹{invested.toLocaleString('en-IN')}
            {currentValue > invested && (
              <span style={{ color: '#A8E1A0', fontWeight: 700, marginLeft: 8 }}>
                +₹{(currentValue - invested).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress + stats */}
      <div style={{
        marginTop: 14, padding: '18px 16px', borderRadius: 16,
        background: '#fff', border: `1px solid ${JS_LINE}`,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <ProgressRing pct={progressPct} label={`${paid.length}/${sip.tenure}`}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, color: JS_INK_SOFT,
            letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 700,
          }}>Progress</div>
          <div style={{
            marginTop: 2,
            fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 17, fontWeight: 700, color: JS_INK,
          }}>
            {paid.length} of {sip.tenure} instalments paid
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11.5, color: JS_INK_SOFT,
          }}>
            {remainingMonths > 0
              ? `${remainingMonths} month${remainingMonths === 1 ? '' : 's'} remaining · ₹${(remainingMonths * sip.monthly).toLocaleString('en-IN')} left to invest`
              : <span style={{ color: '#4C6944', fontWeight: 700 }}>Matured — ready to redeem</span>}
          </div>
        </div>
      </div>

      {/* Next due */}
      {sip.status === 'active' && nextDueDate && (
        <div style={{
          marginTop: 14, padding: '16px 16px', borderRadius: 16,
          background: dueSoon ? '#FFF6EB' : '#fff',
          border: `1px solid ${dueSoon ? '#E3B24A' : JS_LINE}`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: JS_GOLD_TINT, color: JS_GOLD_DK,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="5" width="17" height="15" rx="2"/>
              <path d="M3.5 10h17M8 3v4M16 3v4"/>
            </svg>
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, color: JS_INK_SOFT,
              letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 700,
            }}>Next due</div>
            <div style={{
              marginTop: 1,
              fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 17, fontWeight: 700, color: JS_INK,
            }}>
              ₹{sip.monthly.toLocaleString('en-IN')} on {formatDate(sip.nextDueAt)}
            </div>
            {dueSoon && (
              <div style={{
                marginTop: 3,
                fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, color: '#9B6B28', fontWeight: 700,
              }}>Due in {daysBetween(new Date(), nextDueDate)} days</div>
            )}
          </div>
          {!sip.autopay && (
            <button onClick={payNow} disabled={payingNow} style={{
              height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
              background: payingNow ? '#C9BFA8' : JS_GOLD_DK, color: '#fff',
              cursor: payingNow ? 'not-allowed' : 'pointer',
              fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, fontWeight: 700,
              letterSpacing: 0.8, textTransform: 'uppercase',
            }}>{payingNow ? 'Paying…' : 'Pay Now'}</button>
          )}
        </div>
      )}

      {/* Autopay row */}
      <div style={{
        marginTop: 14, padding: '14px 16px', borderRadius: 14,
        background: '#fff', border: `1px solid ${JS_LINE}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: sip.autopay ? 'rgba(76,105,68,0.12)' : JS_GOLD_TINT,
          color: sip.autopay ? '#4C6944' : JS_GOLD_DK,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 1 9 9"/><path d="M3 6v6h6"/>
          </svg>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 13, fontWeight: 700, color: JS_INK,
          }}>Auto-pay {sip.autopay ? 'enabled' : 'off'}</div>
          <div style={{
            marginTop: 2,
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, color: JS_INK_SOFT,
          }}>
            {sip.autopay
              ? 'We auto-debit on the 15th of every month'
              : 'You’ll need to pay each month manually'}
          </div>
        </div>
        <Switch on={sip.autopay} onToggle={toggleAutopay}/>
      </div>

      {/* Payment history */}
      <div style={{ marginTop: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10,
        }}>
          <div style={{
            fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 18, fontWeight: 700, color: JS_INK,
          }}>Payment history</div>
          <span style={{
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, color: JS_INK_SOFT,
          }}>{paid.length} paid</span>
        </div>

        {paid.length === 0 ? (
          <div style={{
            padding: '22px 16px', borderRadius: 12,
            background: '#fff', border: `1px solid ${JS_LINE}`, textAlign: 'center',
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 12, color: JS_INK_SOFT,
          }}>
            No instalments yet — your first payment will appear here.
          </div>
        ) : (
          <div style={{
            background: '#fff', borderRadius: 14, border: `1px solid ${JS_LINE}`, overflow: 'hidden',
          }}>
            {paid.slice().reverse().map((m, i, arr) => (
              <div key={m.date} style={{
                padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: i < arr.length - 1 ? `1px solid ${JS_LINE}` : 'none',
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(76,105,68,0.12)', color: '#4C6944',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 13, fontWeight: 700, color: JS_INK,
                  }}>
                    Instalment {arr.length - i}
                  </div>
                  <div style={{
                    marginTop: 1,
                    fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, color: JS_INK_SOFT,
                  }}>
                    {formatDate(m.date)} · {m.gramsAccrued.toFixed(4)} g @ ₹{m.pricePerGm.toLocaleString('en-IN')}/gm
                  </div>
                </div>
                <div style={{
                  fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 13, fontWeight: 800, color: JS_GOLD_DK,
                }}>₹{m.amount.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits footer */}
      <div style={{
        marginTop: 20, padding: '14px 16px', borderRadius: 12,
        background: JS_GOLD_TINT, border: `1px dashed ${JS_GOLD}`,
        fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 11, color: JS_GOLD_DK, lineHeight: 1.6,
      }}>
        <strong>Benefits:</strong> 5% making waiver on redemption · insured vault storage ·
        premature withdrawal allowed after 6 months · GST borne by Sagar on redemption.
      </div>
    </div>
  );
}

/* ═══ bits & pieces ═══════════════════════════════════════════════ */

function Card({ title, children }) {
  return (
    <div style={{
      marginTop: 14, padding: '16px 16px 18px', borderRadius: 16,
      background: '#fff', border: `1px solid ${JS_LINE}`,
    }}>
      <div style={{
        fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, color: JS_GOLD,
        letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12,
      }}>{title}</div>
      {children}
    </div>
  );
}

function SummaryRow({ label, detail, value, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '10px 0', gap: 10,
      borderBottom: last ? 'none' : `1px solid ${JS_LINE}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 12, color: JS_INK_SOFT, fontWeight: 600,
        }}>{label}</div>
        {detail && (
          <div style={{
            marginTop: 2,
            fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 10.5, color: JS_INK_SOFT, lineHeight: 1.4,
          }}>{detail}</div>
        )}
      </div>
      <div style={{
        fontFamily: `'Noto Serif', ${JS_T.serif}`, fontSize: 16, fontWeight: 700, color: JS_INK,
        whiteSpace: 'nowrap',
      }}>{value}</div>
    </div>
  );
}

function Switch({ on, onToggle }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={on} style={{
      width: 46, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? JS_GOLD_DK : 'rgb(200,197,192)',
      position: 'relative', flexShrink: 0,
      transition: 'background 160ms ease',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 160ms ease',
      }}/>
    </button>
  );
}

function ProgressRing({ pct, label }) {
  const r = 28, c = 2 * Math.PI * r;
  const off = c - (c * pct) / 100;
  return (
    <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} stroke={JS_LINE} strokeWidth="5" fill="none"/>
        <circle
          cx="35" cy="35" r={r}
          stroke={JS_GOLD_DK} strokeWidth="5" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          transform="rotate(-90 35 35)"
          style={{ transition: 'stroke-dashoffset 400ms ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: `'Manrope', ${JS_T.sans}`, fontSize: 12, fontWeight: 800, color: JS_GOLD_DK,
      }}>{label}</div>
    </div>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

function daysBetween(a, b) {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

window.JewelSipPage = JewelSipPage;
