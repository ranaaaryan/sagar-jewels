import React from 'react';
// Jewellery Rate Calculator — live breakdown based on gross/stone weight, purity, making %
// Palette uses the warm gold accent to distinguish from Book My Gold (maroon).
const CALC_T = window.JEWEL_TOKENS;

const CALC_GOLD      = 'rgb(115,92,0)';
const CALC_GOLD_DK   = '#5A4700';
const CALC_GOLD_TINT = 'rgba(115,92,0,0.08)';

function CalculatorPage({ go, state }) {
  const [metal,   setMetal  ] = React.useState('22');   // '24' | '22' | '18' | 'silver'
  const [gross,   setGross  ] = React.useState('');
  const [stone,   setStone  ] = React.useState('');
  const [mcPct,   setMcPct  ] = React.useState('12');   // making % on gold value
  const [gstOn,   setGstOn  ] = React.useState(true);

  // Live rates (₹/gm)
  const rateMap = { '24': 12450, '22': 11400, '18': 9340, 'silver': 95 };
  const rate = rateMap[metal];

  const g  = parseFloat(gross) || 0;
  const s  = parseFloat(stone) || 0;
  const mc = parseFloat(mcPct) || 0;
  const net = Math.max(0, g - s);

  const goldValue    = net * rate;
  const makingAmount = goldValue * (mc / 100);
  const stoneAmount  = 0; // could add stone value input, skip to keep tight
  const subtotal     = goldValue + makingAmount + stoneAmount;
  const gst          = gstOn ? Math.round(subtotal * 0.03) : 0;
  const total        = Math.round(subtotal + gst);

  function fmt(n) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

  const metals = [
    { k: '24',     label: '24KT',   sub: '999' },
    { k: '22',     label: '22KT',   sub: '916' },
    { k: '18',     label: '18KT',   sub: '750' },
    { k: 'silver', label: 'Silver', sub: '999' },
  ];

  function reset() { setGross(''); setStone(''); setMcPct('12'); }

  return (
    <>
      <TopBar title="Rate Calculator" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: CALC_T.bg, padding: '6px 18px 120px' }}>

        {/* ── Kicker ──────────────────────────────── */}
        <div style={{ marginTop: 10 }}>
          <div style={{
            fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 22, fontWeight: 700,
            color: '#1E1B13', lineHeight: 1.2,
          }}>Estimate your price</div>
          <div style={{
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, color: '#6E655C',
            marginTop: 4, lineHeight: 1.5,
          }}>Plug in weight &amp; making charges to see a live breakdown.</div>
        </div>

        {/* ── Metal selector ──────────────────────── */}
        <div style={{
          marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
        }}>
          {metals.map(m => {
            const active = metal === m.k;
            return (
              <button
                key={m.k}
                onClick={() => setMetal(m.k)}
                style={{
                  padding: '10px 0', borderRadius: 12, cursor: 'pointer',
                  background: active ? CALC_GOLD : '#fff',
                  color:      active ? '#fff'     : CALC_GOLD,
                  border: active ? `1px solid ${CALC_GOLD}` : `1px solid ${CALC_T.line}`,
                  fontFamily: `'Manrope', ${CALC_T.sans}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                  transition: 'all 180ms ease',
                }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>{m.label}</span>
                <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.8 }}>{m.sub}</span>
              </button>
            );
          })}
        </div>

        {/* ── Current rate strip ──────────────────── */}
        <div style={{
          marginTop: 14, background: '#fff', borderRadius: 12,
          border: `1px solid ${CALC_T.line}`,
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: CALC_GOLD_TINT, color: CALC_GOLD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
              letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
            }}>Today&rsquo;s rate · {metals.find(m => m.k === metal).label}</div>
            <div style={{
              fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 18, fontWeight: 700,
              color: CALC_GOLD_DK, marginTop: 2,
            }}>
              ₹{rate.toLocaleString('en-IN')}<span style={{ fontSize: 12, fontWeight: 500, color: '#6E655C' }}> /gm</span>
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, fontWeight: 700,
            color: '#4C6944', background: 'rgba(94,122,85,0.12)',
            padding: '4px 8px', borderRadius: 50,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4C6944' }}/>
            Live
          </span>
        </div>

        {/* ── Inputs ──────────────────────────────── */}
        <div style={{
          marginTop: 18, background: '#fff', borderRadius: 16,
          border: `1px solid ${CALC_T.line}`, overflow: 'hidden',
        }}>
          <CalcRow
            label="Gross weight"
            unit="gm"
            value={gross}
            onChange={setGross}
            placeholder="0.000"
          />
          <CalcRow
            label="Stone weight"
            unit="gm"
            value={stone}
            onChange={setStone}
            placeholder="0.000"
            subtle="Subtracted from gross"
          />
          <CalcRow
            label="Making charges"
            unit="%"
            value={mcPct}
            onChange={setMcPct}
            placeholder="0"
            last
          />
        </div>

        {/* ── Quick MC chips ──────────────────────── */}
        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['8', '12', '15', '18', '22'].map(p => {
            const active = mcPct === p;
            return (
              <button
                key={p}
                onClick={() => setMcPct(p)}
                style={{
                  padding: '6px 12px', borderRadius: 50, cursor: 'pointer',
                  background: active ? CALC_GOLD_TINT : '#fff',
                  color: CALC_GOLD, fontWeight: 600, fontSize: 11,
                  fontFamily: `'Manrope', ${CALC_T.sans}`,
                  border: `1px solid ${active ? CALC_GOLD : 'rgba(115,92,0,0.18)'}`,
                  letterSpacing: 0.2,
                }}>
                {p}% MC
              </button>
            );
          })}
        </div>

        {/* ── Breakdown ───────────────────────────── */}
        <div style={{
          marginTop: 22,
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: CALC_GOLD,
          letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
        }}>Estimate</div>

        <div style={{
          marginTop: 10, background: '#fff', borderRadius: 16,
          border: `1px solid ${CALC_T.line}`,
          padding: '4px 0',
        }}>
          <BreakdownRow label={`Net gold (${metals.find(m => m.k === metal).label})`} detail={`${net.toFixed(3)} gm × ₹${rate.toLocaleString('en-IN')}`} value={fmt(goldValue)}/>
          <BreakdownRow label="Making charges" detail={`${mc || 0}% on gold value`} value={fmt(makingAmount)}/>
          <BreakdownRow
            label="GST"
            detail="3% on subtotal"
            value={gstOn ? fmt(gst) : '—'}
            right={
              <button
                onClick={() => setGstOn(v => !v)}
                style={{
                  fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10, fontWeight: 700,
                  color: gstOn ? CALC_GOLD : '#9A8F84', background: 'transparent',
                  border: 'none', cursor: 'pointer', letterSpacing: 0.4, textTransform: 'uppercase',
                  padding: 0, marginTop: 2,
                }}>
                {gstOn ? 'Remove' : 'Add'}
              </button>
            }
          />
          <div style={{ height: 1, background: CALC_T.line, margin: '4px 16px' }}/>
          {/* Total */}
          <div style={{
            padding: '14px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
                letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
              }}>Total payable</div>
              <div style={{
                fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 30, fontWeight: 700,
                color: CALC_GOLD_DK, marginTop: 2, letterSpacing: 0.2,
              }}>
                {total > 0 ? `₹${total.toLocaleString('en-IN')}` : '—'}
              </div>
            </div>
            <button
              onClick={reset}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#9A8F84', fontFamily: `'Manrope', ${CALC_T.sans}`,
                fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 1 3 6.7"/><polyline points="3 21 3 15 9 15"/>
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* ── Disclaimer ──────────────────────────── */}
        <div style={{
          marginTop: 16, fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
          lineHeight: 1.5, fontStyle: 'italic',
        }}>
          Estimate uses today&rsquo;s rate. Actual invoice may vary with stone charges, hallmarking, and final making.
        </div>
      </div>

      {/* ── Sticky actions ────────────────────────── */}
      <div style={{
        padding: '12px 18px 14px', background: '#fff',
        borderTop: `1px solid ${CALC_T.line}`, display: 'flex', gap: 10,
      }}>
        <button
          onClick={() => go('listing')}
          style={{
            flex: 1, height: 48, border: `1px solid ${CALC_GOLD}`,
            background: '#fff', color: CALC_GOLD, cursor: 'pointer',
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase', borderRadius: 12,
          }}>Shop now</button>
        <button
          onClick={() => null}
          disabled={total <= 0}
          style={{
            flex: 1, height: 48, border: 'none',
            background: total > 0 ? CALC_GOLD : '#C9BFA8', color: '#fff',
            cursor: total > 0 ? 'pointer' : 'not-allowed',
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase', borderRadius: 12,
            boxShadow: total > 0 ? '0 4px 12px rgba(115,92,0,0.22)' : 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5"  r="3"/><circle cx="6"  cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>
          </svg>
          Share
        </button>
      </div>
    </>
  );
}

// ─── Row for inputs ────────────────────────────────────────────
function CalcRow({ label, unit, value, onChange, placeholder, subtle, last }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${CALC_T.line}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, color: '#1E1B13',
          fontWeight: 600,
        }}>{label}</div>
        {subtle && (
          <div style={{
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84', marginTop: 1,
          }}>{subtle}</div>
        )}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        background: '#FBF7F3', borderRadius: 10,
        border: `1px solid ${CALC_T.line}`,
        padding: '0 12px', height: 40, minWidth: 120,
      }}>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder={placeholder}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 14, fontWeight: 700,
            color: '#1E1B13', minWidth: 0, textAlign: 'right',
          }}/>
        <span style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 11, color: '#9A8F84', fontWeight: 600,
          paddingLeft: 6,
        }}>{unit}</span>
      </div>
    </div>
  );
}

// ─── Breakdown row ─────────────────────────────────────────────
function BreakdownRow({ label, detail, value, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '12px 16px', gap: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, color: '#1E1B13', fontWeight: 600,
        }}>{label}</div>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84', marginTop: 2,
        }}>{detail}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 13, fontWeight: 700,
          color: '#1E1B13',
        }}>{value}</div>
        {right}
      </div>
    </div>
  );
}

window.CalculatorPage = CalculatorPage;
