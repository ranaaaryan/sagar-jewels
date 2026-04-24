import React from 'react';
// Digital Gold Dashboard — buy-and-hold 24K gold.
// Users can purchase by ₹ value or by weight; rate ticks via a mock MCX
// subscriber that mutates state.goldRate every 8s.

const DG_T = window.JEWEL_TOKENS;
const DG_GOLD      = 'rgb(115,92,0)';
const DG_GOLD_DK   = '#5A4700';
const DG_GOLD_TINT = 'rgba(115,92,0,0.08)';
const DG_INK       = '#1E1B13';
const DG_INK_SOFT  = '#6E655C';
const DG_LINE      = 'rgba(47,52,48,0.10)';

const MIN_FIAT   = 100;       // ₹100 floor (business rule)
const MAX_FIAT   = 200000;
const MAX_WEIGHT = 50;        // grams per transaction cap
const WEIGHT_STEP = 0.5;      // suggested increment

const FIAT_CHIPS   = [100, 500, 1000, 5000];
const WEIGHT_CHIPS = [0.1, 0.5, 1, 2];

function DigitalGoldPage({ go, state, setState }) {
  const rate = useMockGoldRateTicker(state, setState);        // ticks buy/sell/delta every 8s

  const [mode, setMode]       = React.useState('fiat');       // 'fiat' | 'weight'
  const [value, setValue]     = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [toast, setToast]     = React.useState(null);         // { gm, paid } after buy
  const [pendingBuy, setPendingBuy] = React.useState(false);  // gated by PAN modal

  const gold = state.user.digitalGold || { weightGm: 0, invested: 0, lots: [] };
  const vaultValueNow = Math.round(gold.weightGm * (rate?.sell || 0));

  // PAN gate — triggers when cumulative (invested + this transaction) exceeds ₹2L
  const cumulative = (gold.invested || 0) + (Number.isFinite(Number(value)) ? (mode === 'fiat' ? Number(value) : Number(value) * (rate?.buy || 0)) : 0);
  const pan = usePanGate({ user: state.user, cumulativeValue: cumulative });

  const parsed = Number(value);
  const validParse = Number.isFinite(parsed) && parsed > 0;

  const error = (() => {
    if (!touched) return null;
    if (!value.trim())  return 'Enter an amount to invest';
    if (!validParse)    return 'Numbers only, e.g., 500';
    if (mode === 'fiat') {
      if (parsed < MIN_FIAT)    return `Minimum investment is ₹${MIN_FIAT}`;
      if (parsed > MAX_FIAT)    return `Maximum ₹${MAX_FIAT.toLocaleString('en-IN')} per transaction`;
    } else {
      if (parsed > MAX_WEIGHT)  return `Maximum ${MAX_WEIGHT} g per transaction`;
      if (parsed < 0.01)        return 'Minimum 0.01 g';
    }
    return null;
  })();

  const equiv = React.useMemo(() => {
    if (!validParse || !rate?.buy) return { gm: 0, rupees: 0 };
    if (mode === 'fiat') return { gm: parsed / rate.buy, rupees: parsed };
    return { gm: parsed, rupees: parsed * rate.buy };
  }, [mode, value, rate?.buy, validParse, parsed]);

  const canBuy = validParse && !error && equiv.gm > 0;

  function confirmBuy() {
    if (!canBuy || confirming) return;
    if (pan.blocked) { setPendingBuy(true); pan.openGate(); return; }
    actuallyBuy();
  }

  function actuallyBuy() {
    setConfirming(true);
    setTimeout(() => {
      const paid = Math.round(equiv.rupees);
      const gm   = +equiv.gm.toFixed(4);
      const lot  = {
        id: `lot_${Date.now()}`,
        date: new Date().toISOString(),
        gm, pricePerGm: rate.buy, paid,
      };
      setState(s => ({
        ...s,
        user: { ...s.user, digitalGold: {
          weightGm: +(((s.user.digitalGold?.weightGm || 0) + gm)).toFixed(4),
          invested: (s.user.digitalGold?.invested || 0) + paid,
          lots: [lot, ...(s.user.digitalGold?.lots || [])],
        }},
      }));
      setValue(''); setTouched(false);
      setToast({ gm, paid });
      setConfirming(false);
      setPendingBuy(false);
    }, 600);
  }

  function onPanUploaded(panImage) {
    setState(s => ({ ...s, user: { ...s.user, panImage } }));
    pan.closeGate();
    if (pendingBuy) actuallyBuy();
  }

  return (
    <>
      <TopBar title="Digital Gold" onBack={() => go('wallet')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: DG_T.bg, padding: '10px 16px 140px' }}>

        {/* Vault header */}
        <div style={{
          marginTop: 6, padding: '20px 20px 20px', borderRadius: 18,
          background: 'linear-gradient(135deg, #FBF7F1 0%, #F1E6DA 55%, #E6D3BE 100%)',
          border: `1px solid ${DG_LINE}`, position: 'relative', overflow: 'hidden',
        }}>
          <svg width="140" height="140" viewBox="0 0 140 140"
            style={{ position: 'absolute', top: -26, right: -28, opacity: 0.22, pointerEvents: 'none' }}>
            <g stroke={DG_GOLD_DK} strokeWidth="1" fill="none">
              <path d="M70 16l40 38-40 70L30 54z"/>
              <path d="M30 54h80"/>
            </g>
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 10.5, letterSpacing: 2.4,
              color: DG_GOLD_DK, fontWeight: 700,
            }}>◆ YOUR VAULT</div>
            <div style={{
              marginTop: 8,
              fontFamily: `'Noto Serif', ${DG_T.serif}`, fontSize: 34, fontWeight: 700,
              color: DG_INK, lineHeight: 1.05,
            }}>{gold.weightGm.toFixed(3)} g</div>
            <div style={{
              marginTop: 6,
              fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 13, color: DG_INK_SOFT, fontWeight: 600,
            }}>
              Worth ₹{vaultValueNow.toLocaleString('en-IN')}
              {typeof rate?.delta24h === 'number' && rate.delta24h !== 0 && (
                <span style={{
                  marginLeft: 10, fontSize: 11,
                  color: rate.delta24h > 0 ? '#4C6944' : '#D65A50', fontWeight: 700,
                }}>
                  {rate.delta24h > 0 ? '+' : '−'}₹{Math.abs(Math.round(rate.delta24h * gold.weightGm)).toLocaleString('en-IN')} today
                </span>
              )}
            </div>
            <div style={{
              display: 'inline-flex', gap: 6, marginTop: 14,
              padding: '4px 10px', borderRadius: 999,
              background: '#fff', border: `1px solid ${DG_LINE}`,
              fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 10.5, color: DG_GOLD_DK, fontWeight: 700,
              letterSpacing: 0.6,
            }}>24K · 999.9 · Insured · Redeemable as jewellery</div>
          </div>
        </div>

        {/* Rate strip */}
        <div style={{ marginTop: 12 }}>
          <RateStrip
            label="Buy rate · 24K"
            rate={rate?.buy || 0}
            delta={rate?.delta24h}
            live
          />
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ marginTop: 12 }}>
            <SuccessBanner
              tone="success"
              title={`Added ${toast.gm.toFixed(4)} g to your vault`}
              sub={`Paid ₹${toast.paid.toLocaleString('en-IN')} at today's rate — lot recorded.`}
              onDismiss={() => setToast(null)}
              timeout={4500}
            />
          </div>
        )}

        {/* Buy input */}
        <div style={{
          marginTop: 18, padding: '16px 16px 18px', borderRadius: 16,
          background: '#fff', border: `1px solid ${DG_LINE}`,
        }}>
          <div style={{
            fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 10.5, color: DG_GOLD,
            letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
            marginBottom: 10,
          }}>Buy gold</div>

          <SegmentedToggle
            ariaLabel="Buy input mode"
            value={mode}
            onChange={next => { setMode(next); setValue(''); setTouched(false); }}
            options={[
              { v: 'fiat',   l: '₹ Value' },
              { v: 'weight', l: 'Weight'  },
            ]}
          />

          {/* Input field */}
          <div style={{
            marginTop: 14,
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FBF7F3',
            border: `1px solid ${error ? '#D65A50' : DG_LINE}`,
            borderRadius: 12, padding: '0 14px', height: 52,
            transition: 'border-color 160ms ease',
          }}>
            <span style={{
              fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 16, fontWeight: 700, color: DG_INK_SOFT,
              minWidth: 14,
            }}>{mode === 'fiat' ? '₹' : ''}</span>
            <input
              type="text" inputMode="decimal"
              value={value}
              onChange={e => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
              onBlur={() => setTouched(true)}
              placeholder={mode === 'fiat' ? String(MIN_FIAT) : WEIGHT_STEP.toFixed(3)}
              aria-invalid={!!error}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 20, fontWeight: 800,
                color: DG_INK, textAlign: 'right', minWidth: 0,
              }}
            />
            <span style={{
              fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 12, fontWeight: 600, color: DG_INK_SOFT,
              paddingLeft: 4,
            }}>{mode === 'fiat' ? 'INR' : 'g'}</span>
          </div>

          {/* Conversion preview */}
          <div style={{
            marginTop: 8, minHeight: 16,
            fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 11.5, color: DG_INK_SOFT,
          }}>
            {validParse && !error && rate?.buy && (
              mode === 'fiat'
                ? <>≈ <strong style={{ color: DG_INK }}>{equiv.gm.toFixed(4)} g</strong> at today&rsquo;s rate</>
                : <>≈ <strong style={{ color: DG_INK }}>₹{Math.round(equiv.rupees).toLocaleString('en-IN')}</strong> at today&rsquo;s rate</>
            )}
          </div>
          {error && <ErrorMsg>{error}</ErrorMsg>}

          {/* Quick chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {(mode === 'fiat' ? FIAT_CHIPS : WEIGHT_CHIPS).map(c => {
              const label = mode === 'fiat'
                ? `₹${c.toLocaleString('en-IN')}`
                : `${c} g`;
              const raw = String(c);
              const active = value === raw;
              return (
                <button
                  key={raw}
                  type="button"
                  onClick={() => { setValue(raw); setTouched(true); }}
                  style={{
                    padding: '6px 14px', borderRadius: 50, cursor: 'pointer',
                    background: active ? DG_GOLD_TINT : '#fff',
                    color: DG_GOLD_DK, fontWeight: 700, fontSize: 11.5,
                    fontFamily: `'Manrope', ${DG_T.sans}`,
                    border: `1px solid ${active ? DG_GOLD : 'rgba(115,92,0,0.22)'}`,
                    letterSpacing: 0.3,
                  }}>{label}</button>
              );
            })}
          </div>
        </div>

        {/* Holdings */}
        {gold.lots && gold.lots.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{
              fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 10.5, color: DG_GOLD,
              letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
            }}>Recent lots</div>
            <div style={{
              marginTop: 10, background: '#fff', borderRadius: 14,
              border: `1px solid ${DG_LINE}`, overflow: 'hidden',
            }}>
              {gold.lots.slice(0, 4).map((lot, i, arr) => (
                <div key={lot.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${DG_LINE}` : 'none',
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: DG_GOLD_TINT, color: DG_GOLD_DK,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 9h14l-2 8H7z"/>
                    </svg>
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 13, fontWeight: 700, color: DG_INK,
                    }}>{lot.gm.toFixed(4)} g</div>
                    <div style={{
                      fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 11, color: DG_INK_SOFT, marginTop: 1,
                    }}>
                      {formatDate(lot.date)} · @ ₹{lot.pricePerGm.toLocaleString('en-IN')}/gm
                    </div>
                  </div>
                  <div style={{
                    fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 13, fontWeight: 800, color: DG_GOLD_DK,
                  }}>₹{lot.paid.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div style={{
          marginTop: 18, display: 'flex', gap: 10,
        }}>
          <LinkChip onClick={() => go('wallet-sell')} label="Sell back"/>
          <LinkChip onClick={() => go('wallet')}      label="Wallet hub"/>
        </div>

        {/* Info */}
        <div style={{
          marginTop: 16, padding: '12px 14px', borderRadius: 12,
          background: '#fff', border: `1px solid ${DG_LINE}`,
          fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 10.5, color: DG_INK_SOFT, lineHeight: 1.55,
        }}>
          Your gold is <strong style={{ color: DG_INK }}>24 karat (999.9 fineness)</strong>, stored in
          insured vaults, and can be sold back or redeemed as physical jewellery at any Sagar store.
          Rates are indicative — final invoice may vary slightly with MCX spot at settlement.
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{
        padding: '12px 18px 14px', background: '#fff',
        borderTop: `1px solid ${DG_LINE}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 10, color: DG_INK_SOFT,
            letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
          }}>{canBuy ? 'You will buy' : 'Enter amount'}</div>
          <div style={{
            fontFamily: `'Noto Serif', ${DG_T.serif}`, fontSize: 20, fontWeight: 700,
            color: DG_GOLD_DK, marginTop: 1,
          }}>{canBuy ? `${equiv.gm.toFixed(4)} g` : '—'}</div>
        </div>
        <button
          onClick={confirmBuy}
          disabled={!canBuy || confirming}
          style={{
            height: 48, padding: '0 22px', borderRadius: 12, border: 'none',
            background: canBuy && !confirming ? DG_GOLD : '#C9BFA8', color: '#fff',
            cursor: canBuy && !confirming ? 'pointer' : 'not-allowed',
            fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 12.5, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase',
            boxShadow: canBuy && !confirming ? '0 4px 12px rgba(115,92,0,0.22)' : 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
          {confirming ? 'Processing…' : `Buy Gold · ₹${canBuy ? Math.round(equiv.rupees).toLocaleString('en-IN') : '—'}`}
        </button>
      </div>

      <PanGateModal
        open={pan.open}
        pendingValue={cumulative}
        panNumber={state.user.kyc?.pan}
        onSubmit={onPanUploaded}
        onCancel={() => { pan.closeGate(); setPendingBuy(false); }}
      />
    </>
  );
}

function LinkChip({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 50, cursor: 'pointer',
      background: '#fff', color: DG_GOLD_DK,
      border: `1px solid rgba(115,92,0,0.22)`,
      fontFamily: `'Manrope', ${DG_T.sans}`, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
      textTransform: 'uppercase',
    }}>{label} →</button>
  );
}

// Mock MCX ticker — jitters rate by ±₹10/gm every 8s; swap for a WebSocket
// later. Returns the current rate object so callers re-render on update.
function useMockGoldRateTicker(state, setState) {
  React.useEffect(() => {
    const id = setInterval(() => {
      setState(s => {
        const r = s.goldRate || {};
        const jitter = Math.round((Math.random() - 0.5) * 20);
        return {
          ...s,
          goldRate: {
            ...r,
            buy:  Math.max(10000, (r.buy  || 11850) + jitter),
            sell: Math.max(10000, (r.sell || 11368) + jitter),
            delta24h: (r.delta24h || 0) + jitter,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    }, 8000);
    return () => clearInterval(id);
  }, [setState]);
  return state.goldRate;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

window.DigitalGoldPage = DigitalGoldPage;
