import React from 'react';
// Liquidation (Sell Back) — users convert digital gold to cash.
// KYC-gated. Payout requires a verified bank/UPI from user.bankAccounts.

const LQ_T = window.JEWEL_TOKENS;
const LQ_GOLD      = 'rgb(115,92,0)';
const LQ_GOLD_DK   = '#5A4700';
const LQ_GOLD_TINT = 'rgba(115,92,0,0.08)';
const LQ_INK       = '#1E1B13';
const LQ_INK_SOFT  = '#6E655C';
const LQ_LINE      = 'rgba(47,52,48,0.10)';
const LQ_ERR       = '#D65A50';

function LiquidationPage({ go, state, setState }) {
  const isKycVerified = state.user.kyc?.status === 'verified';
  const gold = state.user.digitalGold || { weightGm: 0, lots: [] };
  const ownedGm = Number(gold.weightGm) || 0;

  if (!isKycVerified) {
    return (
      <>
        <TopBar title="Sell Back" onBack={() => go('wallet')}/>
        <KycGate go={go}/>
      </>
    );
  }
  if (ownedGm < 0.001) {
    return (
      <>
        <TopBar title="Sell Back" onBack={() => go('wallet')}/>
        <EmptyVault go={go}/>
      </>
    );
  }

  return (
    <>
      <TopBar title="Sell Back" onBack={() => go('wallet')}/>
      <SellBackForm go={go} state={state} setState={setState}/>
    </>
  );
}

function SellBackForm({ go, state, setState }) {
  const sellRate = state.goldRate?.sell || 0;
  const buyRate  = state.goldRate?.buy  || 0;
  const ownedGm  = Number(state.user.digitalGold?.weightGm || 0);
  const vaultValue = ownedGm * sellRate;

  const [mode, setMode]           = React.useState('weight');   // 'fiat' | 'weight'
  const [value, setValue]         = React.useState('');
  const [destId, setDestId]       = React.useState(() =>
    state.user.bankAccounts?.find(a => a.primary)?.id ??
    state.user.bankAccounts?.[0]?.id ?? null
  );
  const [touched, setTouched]     = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [settled, setSettled]     = React.useState(null);        // { gm, rupees, dest }

  const verifiedAccounts = (state.user.bankAccounts || []).filter(a => a.verified);

  const parsed = Number(value);
  const errors = (() => {
    const e = {};
    const raw = value.trim();
    if (!raw) {
      e.value = 'Enter an amount';
    } else if (!Number.isFinite(parsed)) {
      e.value = 'Numbers only';
    } else if (parsed <= 0) {
      e.value = 'Must be greater than 0';
    } else if (mode === 'weight' && parsed > ownedGm) {
      e.value = `You own only ${ownedGm.toFixed(4)} g`;
    } else if (mode === 'fiat' && parsed > vaultValue) {
      e.value = `Exceeds your vault value (₹${Math.round(vaultValue).toLocaleString('en-IN')})`;
    } else if (mode === 'weight' && parsed < 0.01) {
      e.value = 'Minimum 0.01 g';
    } else if (mode === 'fiat' && parsed < 100) {
      e.value = 'Minimum ₹100';
    }
    if (!destId) e.dest = 'Pick a payout destination';
    return e;
  })();

  const showError = key => touched[key] && errors[key];
  const valid = Object.keys(errors).length === 0 && sellRate > 0;

  // Derived payout
  const gmToSell = Number.isFinite(parsed) && parsed > 0
    ? (mode === 'weight' ? parsed : parsed / sellRate)
    : 0;
  const payoutAmount = Math.round(gmToSell * sellRate);

  function setQuickPortion(fraction) {
    setMode('weight');
    setValue((ownedGm * fraction).toFixed(4));
    setTouched(t => ({ ...t, value: true }));
  }

  function confirmPayout() {
    if (!valid || submitting) return;
    setTouched({ value: true, dest: true });
    setSubmitting(true);
    setTimeout(() => {
      const gm = +gmToSell.toFixed(4);
      const dest = verifiedAccounts.find(a => a.id === destId);
      setState(s => ({
        ...s,
        user: { ...s.user, digitalGold: {
          ...s.user.digitalGold,
          weightGm: +((s.user.digitalGold.weightGm - gm)).toFixed(4),
        }},
      }));
      setSettled({ gm, rupees: payoutAmount, dest });
      setSubmitting(false);
    }, 700);
  }

  if (settled) return <PayoutConfirmed result={settled} go={go}/>;

  const spreadPct = buyRate > 0 ? Math.round(((buyRate - sellRate) / buyRate) * 100 * 10) / 10 : 0;

  return (
    <>
      <div style={{ flex: 1, overflowY: 'auto', background: LQ_T.bg, padding: '10px 16px 140px' }}>
        {/* Vault summary */}
        <div style={{
          marginTop: 6, padding: '16px 18px', borderRadius: 14,
          background: '#fff', border: `1px solid ${LQ_LINE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10.5, color: '#9A8F84',
              letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
            }}>Your vault</div>
            <div style={{
              fontFamily: `'Noto Serif', ${LQ_T.serif}`, fontSize: 22, fontWeight: 700, color: LQ_INK,
              marginTop: 2,
            }}>{ownedGm.toFixed(4)} g</div>
            <div style={{
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 11, color: LQ_INK_SOFT, marginTop: 2,
            }}>
              ≈ ₹{Math.round(vaultValue).toLocaleString('en-IN')} at today&rsquo;s sell rate
            </div>
          </div>
          <span style={{
            padding: '5px 10px', borderRadius: 999,
            background: LQ_GOLD_TINT, color: LQ_GOLD_DK,
            border: '1px solid rgba(115,92,0,0.22)',
            fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
          }}>24K · 999.9</span>
        </div>

        {/* Rate strip */}
        <div style={{ marginTop: 12 }}>
          <RateStrip
            label="Sell rate · 24K"
            rate={sellRate}
            delta={state.goldRate?.delta24h}
            live
          />
        </div>

        {/* Spread disclosure */}
        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 10,
          background: LQ_GOLD_TINT, border: `1px dashed ${LQ_GOLD}`,
          fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10.5, color: LQ_GOLD_DK, lineHeight: 1.45,
        }}>
          Sell rate is ~{spreadPct}% below the buy rate — this covers refining, insurance and transfer costs.
        </div>

        {/* Amount input */}
        <div style={{
          marginTop: 18, padding: '16px 16px 18px', borderRadius: 16,
          background: '#fff', border: `1px solid ${LQ_LINE}`,
        }}>
          <div style={{
            fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10.5, color: LQ_GOLD,
            letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10,
          }}>How much to sell</div>

          <SegmentedToggle
            ariaLabel="Sell amount mode"
            value={mode}
            onChange={next => { setMode(next); setValue(''); setTouched(t => ({ ...t, value: false })); }}
            options={[
              { v: 'fiat',   l: '₹ Value' },
              { v: 'weight', l: 'Weight'  },
            ]}
          />

          <div style={{
            marginTop: 14,
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FBF7F3',
            border: `1px solid ${showError('value') ? LQ_ERR : LQ_LINE}`,
            borderRadius: 12, padding: '0 14px', height: 52,
            transition: 'border-color 160ms ease',
          }}>
            <span style={{
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 16, fontWeight: 700, color: LQ_INK_SOFT,
              minWidth: 14,
            }}>{mode === 'fiat' ? '₹' : ''}</span>
            <input
              type="text" inputMode="decimal"
              value={value}
              onChange={e => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
              onBlur={() => setTouched(t => ({ ...t, value: true }))}
              placeholder={mode === 'fiat' ? '10000' : '1.000'}
              aria-invalid={!!showError('value')}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 20, fontWeight: 800,
                color: LQ_INK, textAlign: 'right', minWidth: 0,
              }}
            />
            <span style={{
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12, fontWeight: 600, color: LQ_INK_SOFT,
              paddingLeft: 4,
            }}>{mode === 'fiat' ? 'INR' : 'g'}</span>
          </div>
          {showError('value') && <ErrorMsg>{errors.value}</ErrorMsg>}

          {/* Quick portion chips */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[
              { l: '25%', f: 0.25 }, { l: '50%', f: 0.50 }, { l: '75%', f: 0.75 }, { l: 'All',  f: 1.0 },
            ].map(c => (
              <button key={c.l} type="button" onClick={() => setQuickPortion(c.f)} style={{
                padding: '6px 14px', borderRadius: 50, cursor: 'pointer',
                background: '#fff', color: LQ_GOLD_DK, fontWeight: 700, fontSize: 11.5,
                fontFamily: `'Manrope', ${LQ_T.sans}`,
                border: `1px solid rgba(115,92,0,0.22)`, letterSpacing: 0.3,
              }}>{c.l}</button>
            ))}
          </div>

          {/* Payout preview */}
          <div style={{
            marginTop: 14, padding: '12px 14px', borderRadius: 12,
            background: LQ_GOLD_TINT, border: `1px solid rgba(115,92,0,0.22)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            <div>
              <div style={{
                fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10, color: LQ_GOLD_DK,
                letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 700,
              }}>You&rsquo;ll receive</div>
              <div style={{
                fontFamily: `'Noto Serif', ${LQ_T.serif}`, fontSize: 22, fontWeight: 700,
                color: LQ_GOLD_DK, marginTop: 2,
              }}>
                {valid && payoutAmount > 0 ? `₹${payoutAmount.toLocaleString('en-IN')}` : '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 11, color: LQ_INK_SOFT, fontWeight: 600,
              }}>{gmToSell > 0 ? `${gmToSell.toFixed(4)} g` : ''}</div>
              <div style={{
                fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10, color: LQ_INK_SOFT,
              }}>@ ₹{sellRate.toLocaleString('en-IN')}/gm</div>
            </div>
          </div>
        </div>

        {/* Payout destination */}
        <div style={{
          marginTop: 18, padding: '16px 16px 18px', borderRadius: 16,
          background: '#fff', border: `1px solid ${LQ_LINE}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            <div style={{
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10.5, color: LQ_GOLD,
              letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
            }}>Payout destination</div>
            <span style={{
              padding: '3px 8px', borderRadius: 999,
              background: 'rgba(76,105,68,0.10)', color: '#4C6944',
              border: '1px solid rgba(76,105,68,0.24)',
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6,
            }}>KYC VERIFIED</span>
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {verifiedAccounts.length === 0 ? (
              <div style={{
                padding: '14px', borderRadius: 12, background: '#FBF7F3',
                border: `1px dashed ${LQ_LINE}`, textAlign: 'center',
                fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12, color: LQ_INK_SOFT,
              }}>
                No verified accounts yet — add one to receive payouts.
              </div>
            ) : verifiedAccounts.map(a => {
              const active = destId === a.id;
              return (
                <label key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  background: active ? '#fff' : '#FBF7F3',
                  border: `1.5px solid ${active ? LQ_GOLD : LQ_LINE}`,
                  borderRadius: 12, cursor: 'pointer',
                  boxShadow: active ? '0 2px 10px rgba(115,92,0,0.12)' : 'none',
                  transition: 'all 160ms ease',
                }}>
                  <input type="radio" name="liquidation-dest"
                    checked={active}
                    onChange={() => { setDestId(a.id); setTouched(t => ({ ...t, dest: true })); }}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}/>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    border: `1.6px solid ${active ? LQ_GOLD : '#BBB4AA'}`,
                    background: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <span style={{ width: 9, height: 9, borderRadius: '50%', background: LQ_GOLD }}/>}
                  </span>
                  <span style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: LQ_GOLD_TINT, color: LQ_GOLD_DK,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{a.type === 'upi' ? <IconUpi/> : <IconBank/>}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'block',
                      fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 13, fontWeight: 700, color: LQ_INK,
                    }}>
                      {a.label}
                      {a.primary && (
                        <span style={{
                          marginLeft: 8, padding: '2px 6px', borderRadius: 4,
                          background: LQ_GOLD_TINT, color: LQ_GOLD_DK,
                          fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                        }}>Primary</span>
                      )}
                    </span>
                    <span style={{
                      display: 'block', marginTop: 2,
                      fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 11, color: LQ_INK_SOFT,
                      letterSpacing: a.type === 'upi' ? 0 : 1,
                    }}>{a.masked}</span>
                  </span>
                  <span style={{
                    padding: '3px 8px', borderRadius: 999,
                    background: 'rgba(76,105,68,0.10)', color: '#4C6944',
                    fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6,
                  }}>Verified</span>
                </label>
              );
            })}

            <button type="button" onClick={() => go('wallet-banks')} style={{
              padding: '12px 14px', background: 'transparent',
              border: `1.5px dashed ${LQ_LINE}`, borderRadius: 12, cursor: 'pointer',
              fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12, fontWeight: 700,
              color: LQ_GOLD_DK, letterSpacing: 0.4,
            }}>+ Add new account</button>
          </div>

          {showError('dest') && <ErrorMsg>{errors.dest}</ErrorMsg>}
        </div>

        {/* Legal disclosure */}
        <div style={{
          marginTop: 16, padding: '12px 14px', borderRadius: 12,
          background: '#fff', border: `1px solid ${LQ_LINE}`,
          fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10.5, color: LQ_INK_SOFT, lineHeight: 1.55,
        }}>
          Sell rate is indicative and may vary slightly on final MCX settlement. Funds typically settle in your
          account by <strong style={{ color: LQ_INK }}>T+1 business day</strong>. We maintain a full audit log
          against your verified PAN.
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{
        padding: '12px 18px 14px', background: '#fff',
        borderTop: `1px solid ${LQ_LINE}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10, color: LQ_INK_SOFT,
            letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
          }}>{valid ? 'You will receive' : 'Complete the form'}</div>
          <div style={{
            fontFamily: `'Noto Serif', ${LQ_T.serif}`, fontSize: 20, fontWeight: 700,
            color: LQ_GOLD_DK, marginTop: 1,
          }}>{valid && payoutAmount > 0 ? `₹${payoutAmount.toLocaleString('en-IN')}` : '—'}</div>
        </div>
        <button
          type="button" onClick={confirmPayout}
          disabled={!valid || submitting}
          style={{
            height: 48, padding: '0 22px', borderRadius: 12, border: 'none',
            background: (!valid || submitting) ? '#C9BFA8' : LQ_GOLD, color: '#fff',
            cursor: (!valid || submitting) ? 'not-allowed' : 'pointer',
            fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12.5, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase',
            boxShadow: (!valid || submitting) ? 'none' : '0 4px 12px rgba(115,92,0,0.22)',
          }}>
          {submitting ? 'Processing…' : 'Confirm Payout'}
        </button>
      </div>
    </>
  );
}

/* ── KYC gate ─────────────────────────────────────────────────── */
function KycGate({ go }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', background: LQ_T.bg, padding: '40px 24px 40px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: LQ_GOLD_TINT, color: LQ_GOLD_DK,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7.5 3v6c0 4.5-3.2 8.3-7.5 9.5C7.7 20.3 4.5 16.5 4.5 12V6L12 3Z"/>
          <path d="M12 11v3M12 17h.01"/>
        </svg>
      </div>
      <div style={{
        fontFamily: `'Noto Serif', ${LQ_T.serif}`, fontSize: 22, fontWeight: 700, color: LQ_INK,
        lineHeight: 1.25,
      }}>Verify KYC to sell gold</div>
      <div style={{
        marginTop: 10, maxWidth: 320,
        fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 13, color: LQ_INK_SOFT, lineHeight: 1.55,
      }}>
        For regulatory compliance we verify your identity before any payout transfer. It takes under 2
        minutes and uses your PAN &amp; Aadhaar.
      </div>
      <button onClick={() => go('profile')} style={{
        marginTop: 22, padding: '12px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: LQ_GOLD, color: '#fff',
        fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12, fontWeight: 700, letterSpacing: 0.8,
        textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(115,92,0,0.22)',
      }}>Start KYC verification</button>
      <button onClick={() => go('wallet')} style={{
        marginTop: 14, background: 'transparent', border: 'none', cursor: 'pointer',
        color: LQ_INK_SOFT, fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 11, fontWeight: 700,
        letterSpacing: 0.6, textTransform: 'uppercase',
      }}>Back to wallet</button>
    </div>
  );
}

function EmptyVault({ go }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', background: LQ_T.bg, padding: '60px 24px 40px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    }}>
      <div style={{
        fontFamily: `'Noto Serif', ${LQ_T.serif}`, fontSize: 20, fontWeight: 700, color: LQ_INK,
      }}>Nothing to sell yet</div>
      <div style={{
        marginTop: 8, maxWidth: 300,
        fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12.5, color: LQ_INK_SOFT, lineHeight: 1.55,
      }}>
        Your digital gold vault is empty. Buy some first — you can start with as little as ₹100.
      </div>
      <button onClick={() => go('wallet-gold')} style={{
        marginTop: 20, padding: '12px 22px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: LQ_GOLD, color: '#fff',
        fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12, fontWeight: 700, letterSpacing: 0.8,
        textTransform: 'uppercase',
      }}>Buy Digital Gold</button>
    </div>
  );
}

function PayoutConfirmed({ result, go }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', background: LQ_T.bg, padding: '30px 24px 40px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(76,105,68,0.14)', color: '#4C6944',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{
        fontFamily: `'Noto Serif', ${LQ_T.serif}`, fontSize: 22, fontWeight: 700, color: LQ_INK,
      }}>Payout initiated</div>
      <div style={{
        marginTop: 6, fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 13, color: LQ_INK_SOFT,
      }}>₹{result.rupees.toLocaleString('en-IN')} on the way to {result.dest?.label}</div>

      {/* Tracker */}
      <div style={{
        marginTop: 24, width: '100%', maxWidth: 360,
        padding: '16px 18px', borderRadius: 14,
        background: '#fff', border: `1px solid ${LQ_LINE}`,
      }}>
        {['Initiated', 'In transit', 'Settled in your account'].map((s, i) => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 0',
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              background: i === 0 ? '#4C6944' : LQ_LINE,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              {i === 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12.5,
                fontWeight: i === 0 ? 700 : 500, color: i === 0 ? LQ_INK : LQ_INK_SOFT,
              }}>{s}</div>
              {i === 0 && (
                <div style={{
                  fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 10.5, color: LQ_INK_SOFT, marginTop: 1,
                }}>{new Date().toLocaleString('en-IN')}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 18, fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 11, color: LQ_INK_SOFT,
        textAlign: 'center', maxWidth: 320, lineHeight: 1.5,
      }}>
        Expected settlement within <strong style={{ color: LQ_INK }}>T+1 business day</strong>. We&rsquo;ll
        notify you once funds reach your bank.
      </div>

      <button onClick={() => go('wallet')} style={{
        marginTop: 22, padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: LQ_GOLD, color: '#fff',
        fontFamily: `'Manrope', ${LQ_T.sans}`, fontSize: 12, fontWeight: 700, letterSpacing: 0.8,
        textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(115,92,0,0.22)',
      }}>Back to Wallet</button>
    </div>
  );
}

function IconBank() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10L12 4l9 6"/>
      <path d="M5 10v8M19 10v8M9 10v8M15 10v8"/>
      <path d="M3 20h18"/>
    </svg>
  );
}
function IconUpi() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M7 9l4 6 3-10 3 6"/>
    </svg>
  );
}

window.LiquidationPage = LiquidationPage;
