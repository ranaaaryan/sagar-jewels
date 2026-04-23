import React from 'react';
// Jewellery Rate Calculator — live breakdown based on gross/stone weight, purity, making %
// Palette uses the warm gold accent to distinguish from Book My Gold (maroon).
const CALC_T = window.JEWEL_TOKENS;

const CALC_GOLD      = 'rgb(115,92,0)';
const CALC_GOLD_DK   = '#5A4700';
const CALC_GOLD_TINT = 'rgba(115,92,0,0.08)';

const CASHBACK_FEE_PCT  = 5;     // 5% deduction on cashback payout
const LOOKUP_DELAY_MS   = 900;   // mock network delay

// ── Diamond reference data (for the 'Other Jeweller' flow) ──────
const DIAMOND_CLARITIES = ['FL','IF','VVS1','VVS2','VS1','VS2','SI1','SI2','I1','I2','I3'];
const DIAMOND_COLORS    = ['D','E','F','G','H','I','J','K','L','M'];
const DIAMOND_TYPES     = [
  { v: 'natural', l: 'Natural'   },
  { v: 'lab',     l: 'Lab-grown' },
];
const DIAMOND_SHAPES = [
  { v: 'round',    l: 'Round'    },
  { v: 'princess', l: 'Princess' },
  { v: 'oval',     l: 'Oval'     },
  { v: 'emerald',  l: 'Emerald'  },
  { v: 'cushion',  l: 'Cushion'  },
  { v: 'pear',     l: 'Pear'     },
  { v: 'marquise', l: 'Marquise' },
  { v: 'heart',    l: 'Heart'    },
  { v: 'asscher',  l: 'Asscher'  },
];
const DIAMOND_ORIGINS_NATURAL = [
  'India','Russia','Botswana','South Africa','Australia','Canada',
];
const DIAMOND_ORIGINS_LAB = [
  'CVD','HPHT',
];

// Rough mock valuation multipliers — indicative only.
const DIAMOND_BASE_PER_CT = 18000;          // ₹ / carat (natural mid-grade reference)
const DIAMOND_CLARITY_MULT = { FL:1.35, IF:1.25, VVS1:1.18, VVS2:1.12, VS1:1.05, VS2:1.00, SI1:0.92, SI2:0.82, I1:0.65, I2:0.50, I3:0.38 };
const DIAMOND_COLOR_MULT   = { D:1.30, E:1.22, F:1.15, G:1.05, H:1.00, I:0.92, J:0.82, K:0.72, L:0.60, M:0.50 };
const DIAMOND_TYPE_MULT    = { natural:1.00, lab:0.35 };
const DIAMOND_SHAPE_MULT   = { round:1.00, princess:0.92, oval:0.90, emerald:0.88, cushion:0.90, pear:0.88, marquise:0.85, heart:0.85, asscher:0.88 };
const DIAMOND_VERIFY_FACTOR = 0.95;         // other-jeweller verification haircut

function makeOjInitialForm() {
  return {
    metal:  '', purity: '', weight: '',
    stone:  'none',
    // Diamond-specific (only validated/used when stone === 'diamond')
    diamondType:    '',
    diamondShape:   '',
    diamondCount:   '',
    diamondWeight:  '',   // total carat weight (TCW)
    diamondClarity: '',
    diamondColor:   '',
    diamondOrigin:  '',
  };
}

function computeDiamondValue(f) {
  if (f.stone !== 'diamond') return 0;
  const tcw = Number(f.diamondWeight);
  if (!Number.isFinite(tcw) || tcw <= 0) return 0;
  const type    = DIAMOND_TYPE_MULT   [f.diamondType]    ?? 0;
  const clarity = DIAMOND_CLARITY_MULT[f.diamondClarity] ?? 0;
  const color   = DIAMOND_COLOR_MULT  [f.diamondColor]   ?? 0;
  const shape   = DIAMOND_SHAPE_MULT  [f.diamondShape]   ?? 0;
  if (!type || !clarity || !color || !shape) return 0;
  return Math.round(tcw * DIAMOND_BASE_PER_CT * type * clarity * color * shape * DIAMOND_VERIFY_FACTOR);
}

// Seed catalog returned by the (mocked) bill/barcode lookup.
const MOCK_SAGAR_CATALOG = [
  { id: 'SJ-24-0091', name: 'Temple Work Gold Necklace', purity: '22', weight: 28.40, bill: 'B/24/0912', purchaseDate: '12 Apr 2024', img: 'assets/home/for-her.jpg' },
  { id: 'SJ-24-0183', name: 'Classic Gold Chain',        purity: '22', weight: 12.20, bill: 'B/24/0912', purchaseDate: '12 Apr 2024', img: 'assets/home/for-him.jpg' },
  { id: 'SJ-24-0217', name: 'Diamond Stud Earrings',     purity: '18', weight:  4.60, bill: 'B/24/0912', purchaseDate: '12 Apr 2024', img: 'assets/home/banner-bestseller.png' },
];

function CalculatorPage({ go, state }) {
  const [mode,    setMode   ] = React.useState('jewellery'); // 'jewellery' | 'buyback'
  const [source,  setSource ] = React.useState('ours');      // 'ours' | 'other' (buy-back only)
  const [metal,   setMetal  ] = React.useState('22');   // '24' | '22' | '18' | 'silver'
  const [gross,   setGross  ] = React.useState('');
  const [stone,   setStone  ] = React.useState('');
  const [mcPct,   setMcPct  ] = React.useState('12');   // making % on gold value
  const [gstOn,   setGstOn  ] = React.useState(true);

  // ── Sagar buy-back (bill / barcode lookup) ─────────
  const [lookupKind,   setLookupKind  ] = React.useState('barcode'); // 'barcode' | 'bill'
  const [lookupValue,  setLookupValue ] = React.useState('');
  const [lookupStatus, setLookupStatus] = React.useState('idle');    // 'idle' | 'loading' | 'done' | 'notfound'
  const [lookupItems,  setLookupItems ] = React.useState([]);
  const [selectedIds,  setSelectedIds ] = React.useState(() => new Set());
  const [payout,       setPayout      ] = React.useState('exchange'); // 'exchange' | 'cashback'

  // ── Other-jeweller buy-back (custom item form) ─────
  const [ojForm, setOjForm] = React.useState(() => makeOjInitialForm());
  const [ojTouched, setOjTouched] = React.useState({}); // per-field blur markers

  const isBuyBack      = mode === 'buyback';
  const isSagarBuyBack = isBuyBack && source === 'ours';
  const isOtherBuyBack = isBuyBack && source === 'other';

  // Live rates (₹/gm) — buy-back rate is lower than market rate
  const sellRateMap = { '24': 12450, '22': 11400, '18': 9340, 'silver': 95 };
  const buyRateMap  = { '24': 11850, '22': 10830, '18': 8780, 'silver': 88 };
  // Pieces purchased from another jeweller carry a small deduction for purity verification / wastage.
  const sourceFactor = isBuyBack && source === 'other' ? 0.97 : 1;
  const rate = Math.round(((isBuyBack ? buyRateMap : sellRateMap)[metal]) * sourceFactor);

  const g  = parseFloat(gross) || 0;
  const s  = parseFloat(stone) || 0;
  const mc = parseFloat(mcPct) || 0;
  const net = Math.max(0, g - s);

  const goldValue    = net * rate;
  const makingAmount = isBuyBack ? 0 : goldValue * (mc / 100);
  const stoneAmount  = 0; // could add stone value input, skip to keep tight
  const subtotal     = goldValue + makingAmount + stoneAmount;
  const gst          = (!isBuyBack && gstOn) ? Math.round(subtotal * 0.03) : 0;
  const total        = Math.round(subtotal + gst);

  function fmt(n) { return `₹${Math.round(n).toLocaleString('en-IN')}`; }

  // ── Sagar buy-back derived state ───────────────────
  const chosenItems = lookupItems.filter(i => selectedIds.has(i.id));
  const sagarSubtotal = chosenItems.reduce(
    (sum, i) => sum + i.weight * (buyRateMap[i.purity] || 0), 0
  );
  const sagarDeduction = payout === 'cashback' ? sagarSubtotal * (CASHBACK_FEE_PCT / 100) : 0;
  const sagarFinal     = Math.round(sagarSubtotal - sagarDeduction);

  async function runLookup(e) {
    e?.preventDefault?.();
    if (!lookupValue.trim()) return;
    setLookupStatus('loading');
    setLookupItems([]);
    setSelectedIds(new Set());
    // Simulate network latency — swap for a real fetch later.
    await new Promise(r => setTimeout(r, LOOKUP_DELAY_MS));
    if (lookupValue.trim().length < 4) {
      setLookupStatus('notfound');
      return;
    }
    setLookupItems(MOCK_SAGAR_CATALOG);
    setLookupStatus('done');
  }

  function toggleItem(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(lookupItems.map(i => i.id)));
  }

  function resetLookup() {
    setLookupValue('');
    setLookupStatus('idle');
    setLookupItems([]);
    setSelectedIds(new Set());
  }

  // Clear the lookup flow when the user navigates away from Sagar buy-back.
  React.useEffect(() => {
    if (!isSagarBuyBack) resetLookup();
  }, [isSagarBuyBack]);

  // ── Other-jeweller: handlers, validation, valuation ───────
  function setOjField(key, value) {
    setOjForm(prev => {
      const next = { ...prev, [key]: value };
      // Purity options depend on metal — clear purity when metal changes.
      if (key === 'metal' && prev.metal !== value) next.purity = '';
      // Leaving the diamond branch clears all diamond-specific sub-fields.
      if (key === 'stone' && prev.stone === 'diamond' && value !== 'diamond') {
        Object.assign(next, {
          diamondType: '', diamondShape: '', diamondCount: '', diamondWeight: '',
          diamondClarity: '', diamondColor: '', diamondOrigin: '',
        });
      }
      // Switching diamond type resets origin (option list depends on type).
      if (key === 'diamondType' && prev.diamondType !== value) next.diamondOrigin = '';
      return next;
    });
  }
  function touchOj(key) { setOjTouched(t => (t[key] ? t : { ...t, [key]: true })); }
  function resetOj() {
    setOjForm(makeOjInitialForm());
    setOjTouched({});
  }

  const ojErrors = (() => {
    const e = {};
    if (!ojForm.metal) e.metal = 'Select a metal';
    if (ojForm.metal && !ojForm.purity) e.purity = 'Select the purity';
    const raw = ojForm.weight.trim();
    if (!raw) {
      e.weight = 'Enter the weight';
    } else {
      const w = Number(raw);
      if (!Number.isFinite(w))    e.weight = 'Numbers only, e.g., 12.40';
      else if (w <= 0)             e.weight = 'Weight must be greater than 0';
      else if (w > 10000)          e.weight = 'That weight looks unrealistic';
    }
    // Diamond sub-form — strictly required only when stone is 'diamond'.
    if (ojForm.stone === 'diamond') {
      if (!ojForm.diamondType)    e.diamondType    = 'Select natural or lab-grown';
      if (!ojForm.diamondShape)   e.diamondShape   = 'Pick a shape';
      if (!ojForm.diamondClarity) e.diamondClarity = 'Clarity grade required';
      if (!ojForm.diamondColor)   e.diamondColor   = 'Color grade required';
      if (!ojForm.diamondOrigin)  e.diamondOrigin  = 'Origin required';

      const cntRaw = String(ojForm.diamondCount).trim();
      if (!cntRaw) {
        e.diamondCount = 'How many stones?';
      } else {
        const n = Number(cntRaw);
        if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) e.diamondCount = 'Whole number greater than 0';
        else if (n > 500) e.diamondCount = 'That stone count looks unrealistic';
      }

      const cwRaw = String(ojForm.diamondWeight).trim();
      if (!cwRaw) {
        e.diamondWeight = 'Total carat weight required';
      } else {
        const cw = Number(cwRaw);
        if (!Number.isFinite(cw))  e.diamondWeight = 'Numbers only, e.g., 1.25';
        else if (cw <= 0)          e.diamondWeight = 'Carat must be greater than 0';
        else if (cw > 50)          e.diamondWeight = 'That carat weight looks unrealistic';
      }
    }
    return e;
  })();
  const ojValid = Object.keys(ojErrors).length === 0;

  // Mock valuation — deterministic, pure. Combines metal + diamond sub-value.
  const ojBaseValue = React.useMemo(() => {
    if (!ojValid) return 0;
    const w = Number(ojForm.weight);
    let ratePerGm = 0;
    if (ojForm.metal === 'gold') {
      ratePerGm = buyRateMap[ojForm.purity] || 0;
    } else if (ojForm.metal === 'silver') {
      ratePerGm = (buyRateMap.silver || 0) * (parseInt(ojForm.purity, 10) / 1000);
    }
    const stoneFactor        = ojForm.stone !== 'none' ? 0.92 : 1;  // stones occupy ~8% of gross weight
    const verificationFactor = 0.97;                                 // other-jeweller purity deduction
    const metalValue   = Math.round(w * stoneFactor * ratePerGm * verificationFactor);
    const diamondValue = computeDiamondValue(ojForm);
    return metalValue + diamondValue;
  }, [
    ojValid,
    ojForm.metal, ojForm.purity, ojForm.weight, ojForm.stone,
    ojForm.diamondType, ojForm.diamondShape, ojForm.diamondCount,
    ojForm.diamondWeight, ojForm.diamondClarity, ojForm.diamondColor, ojForm.diamondOrigin,
  ]);

  const ojDeduction = payout === 'cashback' ? ojBaseValue * (CASHBACK_FEE_PCT / 100) : 0;
  const ojFinal     = Math.round(ojBaseValue - ojDeduction);

  React.useEffect(() => {
    if (!isOtherBuyBack) resetOj();
  }, [isOtherBuyBack]);

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

        {/* ── Mode toggle: Jewellery Rate / Buy Back ─── */}
        <div style={{
          marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
          padding: 4, borderRadius: 12, background: '#F1EADC',
          border: `1px solid ${CALC_T.line}`,
        }}>
          {[
            { k: 'jewellery', label: 'Jewellery Rate' },
            { k: 'buyback',   label: 'Buy Back' },
          ].map(t => {
            const active = mode === t.k;
            return (
              <button key={t.k} onClick={() => setMode(t.k)} style={{
                padding: '10px 0', borderRadius: 9, cursor: 'pointer',
                background: active ? '#fff' : 'transparent',
                color: active ? CALC_GOLD_DK : '#6E655C',
                border: active ? `1px solid ${CALC_GOLD}` : '1px solid transparent',
                boxShadow: active ? '0 1px 4px rgba(115,92,0,0.16)' : 'none',
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5,
                fontWeight: 700, letterSpacing: 0.4,
                transition: 'all 180ms ease',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* ── Source selector (buy-back only) ─────── */}
        {isBuyBack && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: CALC_GOLD,
              letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
            }}>Where was this purchased?</div>
            <div style={{
              marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
            }}>
              {[
                { k: 'ours',  label: 'From Sagar',       sub: 'Original invoice honoured',       icon: 'ours'  },
                { k: 'other', label: 'Other jeweller',   sub: 'Rate applied after purity check', icon: 'other' },
              ].map(s => {
                const active = source === s.k;
                return (
                  <button key={s.k} onClick={() => setSource(s.k)} style={{
                    textAlign: 'left', padding: '12px 12px', borderRadius: 12, cursor: 'pointer',
                    background: active ? '#fff' : '#FBF7F3',
                    border: `1px solid ${active ? CALC_GOLD : CALC_T.line}`,
                    boxShadow: active ? '0 2px 8px rgba(115,92,0,0.14)' : 'none',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    transition: 'all 180ms ease',
                  }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: active ? CALC_GOLD_TINT : '#fff',
                      color: CALC_GOLD,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${active ? 'transparent' : CALC_T.line}`,
                    }}>
                      <SourceIcon kind={s.icon}/>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        display: 'block',
                        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
                        color: active ? CALC_GOLD_DK : '#1E1B13', letterSpacing: 0.2,
                      }}>{s.label}</span>
                      <span style={{
                        display: 'block', marginTop: 2,
                        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5,
                        color: '#9A8F84', lineHeight: 1.4,
                      }}>{s.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {source === 'ours' && (
              <div style={{
                marginTop: 8, padding: '8px 12px', borderRadius: 10,
                background: CALC_GOLD_TINT, border: `1px dashed ${CALC_GOLD}`,
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 11, color: CALC_GOLD_DK,
                lineHeight: 1.45,
              }}>Keep your original invoice handy — we honour the full buy-back rate for jewellery purchased from us.</div>
            )}
          </div>
        )}

        {/* ── Other-jeweller buy-back (custom item form) ─── */}
        {isOtherBuyBack && (
          <OtherJewellerFlow
            form={ojForm} errors={ojErrors} touched={ojTouched} valid={ojValid}
            onChange={setOjField} onBlur={touchOj} onReset={resetOj}
            buyRateMap={buyRateMap}
            baseValue={ojBaseValue}
            payout={payout} setPayout={setPayout}
            deduction={ojDeduction} finalValue={ojFinal}
            fmt={fmt}
          />
        )}

        {/* ── Sagar buy-back flow (bill / barcode lookup) ─── */}
        {isSagarBuyBack && (
          <SagarLookupFlow
            lookupKind={lookupKind} setLookupKind={setLookupKind}
            lookupValue={lookupValue} setLookupValue={setLookupValue}
            lookupStatus={lookupStatus}
            items={lookupItems} selectedIds={selectedIds}
            onToggleItem={toggleItem} onSelectAll={selectAll}
            onSubmit={runLookup} onReset={resetLookup}
            payout={payout} setPayout={setPayout}
            buyRateMap={buyRateMap}
            subtotal={sagarSubtotal} deduction={sagarDeduction} finalValue={sagarFinal}
            fmt={fmt}
          />
        )}

        {/* ── Kicker ──────────────────────────────── */}
        {!isBuyBack && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 22, fontWeight: 700,
            color: '#1E1B13', lineHeight: 1.2,
          }}>Estimate your price</div>
          <div style={{
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, color: '#6E655C',
            marginTop: 4, lineHeight: 1.5,
          }}>Plug in weight &amp; making charges to see a live breakdown.</div>
        </div>
        )}

        {!isBuyBack && (
        <>


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
          {!isBuyBack && (
            <CalcRow
              label="Making charges"
              unit="%"
              value={mcPct}
              onChange={setMcPct}
              placeholder="0"
              last
            />
          )}
        </div>

        {/* ── Quick MC chips (selling mode only) ──── */}
        {!isBuyBack && (
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
        )}

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
          <BreakdownRow label={`Net ${metal === 'silver' ? 'silver' : 'gold'} (${metals.find(m => m.k === metal).label})`} detail={`${net.toFixed(3)} gm × ₹${rate.toLocaleString('en-IN')}`} value={fmt(goldValue)}/>
          {!isBuyBack && (
            <>
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
            </>
          )}
          <div style={{ height: 1, background: CALC_T.line, margin: '4px 16px' }}/>
          {/* Total */}
          <div style={{
            padding: '14px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
                letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
              }}>{isBuyBack ? 'Buy-back value' : 'Total payable'}</div>
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
          {isBuyBack
            ? 'Buy-back rate is indicative. Final value may vary after purity and wastage assessment at the store.'
            : 'Estimate uses today’s rate. Actual invoice may vary with stone charges, hallmarking, and final making.'}
        </div>
        </>
        )}
      </div>

      {/* ── Sticky actions ────────────────────────── */}
      {isSagarBuyBack ? (
        <SagarStickyFooter
          selectedCount={chosenItems.length}
          finalValue={sagarFinal}
          payout={payout}
          fmt={fmt}
          onContinue={() => {
            if (chosenItems.length > 0) go('store');
          }}
        />
      ) : isOtherBuyBack ? (
        <OtherJewellerStickyFooter
          valid={ojValid}
          finalValue={ojFinal}
          payout={payout}
          fmt={fmt}
          onContinue={() => { if (ojValid) go('store'); }}
        />
      ) : (
        <div style={{
          padding: '12px 18px 14px', background: '#fff',
          borderTop: `1px solid ${CALC_T.line}`, display: 'flex', gap: 10,
        }}>
          <button
            onClick={() => go(isBuyBack ? 'store' : 'listing')}
            style={{
              flex: 1, height: 48, border: `1px solid ${CALC_GOLD}`,
              background: '#fff', color: CALC_GOLD, cursor: 'pointer',
              fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
              letterSpacing: 0.8, textTransform: 'uppercase', borderRadius: 12,
            }}>{isBuyBack ? 'Visit store' : 'Shop now'}</button>
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
      )}
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

// ─── Other-jeweller buy-back: custom item form + settlement ────
const GOLD_PURITIES = [
  { v: '24', l: '24KT', sub: '999 fine' },
  { v: '22', l: '22KT', sub: '916' },
  { v: '18', l: '18KT', sub: '750' },
  { v: '14', l: '14KT', sub: '585' },
];
const SILVER_PURITIES = [
  { v: '999', l: '999', sub: 'Fine silver' },
  { v: '925', l: '925', sub: 'Sterling'   },
];
const STONE_OPTIONS = [
  { v: 'none',     l: 'No stones'         },
  { v: 'diamond',  l: 'Diamond'           },
  { v: 'polki',    l: 'Polki / Uncut'     },
  { v: 'emerald',  l: 'Emerald'           },
  { v: 'ruby',     l: 'Ruby'              },
  { v: 'sapphire', l: 'Sapphire'          },
  { v: 'other',    l: 'Other / mixed'     },
];

function OtherJewellerFlow({
  form, errors, touched, valid,
  onChange, onBlur, onReset,
  buyRateMap,
  baseValue,
  payout, setPayout,
  deduction, finalValue,
  fmt,
}) {
  const purityList = form.metal === 'silver' ? SILVER_PURITIES : GOLD_PURITIES;

  const showError = key => touched[key] && errors[key];
  const previewRate = form.metal && form.purity
    ? (form.metal === 'gold'
        ? buyRateMap[form.purity] || 0
        : Math.round((buyRateMap.silver || 0) * (parseInt(form.purity, 10) / 1000)))
    : 0;

  return (
    <div>
      {/* Kicker */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 22, fontWeight: 700,
          color: '#1E1B13', lineHeight: 1.2,
        }}>Tell us about your jewellery</div>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, color: '#6E655C',
          marginTop: 4, lineHeight: 1.5,
        }}>A {CASHBACK_FEE_PCT}% verification allowance applies. Final value is confirmed after a purity check at the store.</div>
      </div>

      {/* Metal */}
      <OjFieldLabel>Metal</OjFieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { k: 'gold',   label: 'Gold',   ring: 'linear-gradient(135deg,#FFD86A 0%,#D69419 60%,#9A6A13 100%)' },
          { k: 'silver', label: 'Silver', ring: 'linear-gradient(135deg,#FFFFFF 0%,#D4D6D2 60%,#8A8D89 100%)' },
        ].map(m => {
          const active = form.metal === m.k;
          return (
            <button key={m.k} type="button"
              onClick={() => { onChange('metal', m.k); onBlur('metal'); }}
              style={{
                padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
                background: active ? '#fff' : '#FBF7F3',
                border: `1.5px solid ${active ? CALC_GOLD : CALC_T.line}`,
                boxShadow: active ? '0 2px 10px rgba(115,92,0,0.14)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 160ms ease',
              }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', background: m.ring,
                border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0,
              }}/>
              <span style={{
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 13.5,
                fontWeight: active ? 700 : 600,
                color: active ? CALC_GOLD_DK : '#1E1B13',
              }}>{m.label}</span>
            </button>
          );
        })}
      </div>
      {showError('metal') && <OjError>{errors.metal}</OjError>}

      {/* Purity */}
      <OjFieldLabel>Purity{form.metal === 'silver' ? ' (fineness)' : ''}</OjFieldLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {purityList.map(p => {
          const active  = form.purity === p.v;
          const disabled = !form.metal;
          return (
            <button key={p.v} type="button"
              disabled={disabled}
              onClick={() => { onChange('purity', p.v); onBlur('purity'); }}
              style={{
                padding: '8px 14px', borderRadius: 50,
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: active ? CALC_GOLD : '#fff',
                color: active ? '#fff' : (disabled ? '#C9BFA8' : CALC_GOLD_DK),
                border: `1px solid ${active ? CALC_GOLD : (disabled ? CALC_T.line : 'rgba(115,92,0,0.24)')}`,
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, fontWeight: 700,
                letterSpacing: 0.3,
                display: 'inline-flex', alignItems: 'baseline', gap: 6,
                opacity: disabled ? 0.7 : 1,
                transition: 'all 160ms ease',
              }}>
              {p.l}
              <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>· {p.sub}</span>
            </button>
          );
        })}
      </div>
      {!form.metal && (
        <div style={{
          marginTop: 6, fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5,
          color: '#9A8F84', fontStyle: 'italic',
        }}>Pick a metal first to see purity options.</div>
      )}
      {showError('purity') && <OjError>{errors.purity}</OjError>}

      {/* Weight */}
      <OjFieldLabel>Gross weight</OjFieldLabel>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff', border: `1px solid ${showError('weight') ? '#D65A50' : CALC_T.line}`,
        borderRadius: 12, padding: '0 14px', height: 48,
        transition: 'border-color 160ms ease',
      }}>
        <input
          type="text" inputMode="decimal"
          value={form.weight}
          onChange={e => onChange('weight', e.target.value.replace(/[^0-9.]/g, ''))}
          onBlur={() => onBlur('weight')}
          placeholder="0.000"
          aria-invalid={!!showError('weight')}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 16, fontWeight: 700,
            color: '#1E1B13', textAlign: 'right', minWidth: 0,
          }}
        />
        <span style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, fontWeight: 600,
          color: '#9A8F84', paddingLeft: 6,
        }}>gm</span>
      </div>
      {showError('weight') && <OjError>{errors.weight}</OjError>}

      {/* Stone type */}
      <OjFieldLabel>Stone type <span style={{ color: '#9A8F84', fontWeight: 500 }}>(optional)</span></OjFieldLabel>
      <div style={{ position: 'relative' }}>
        <select
          value={form.stone}
          onChange={e => onChange('stone', e.target.value)}
          style={{
            width: '100%', appearance: 'none',
            background: '#fff', border: `1px solid ${CALC_T.line}`, borderRadius: 12,
            padding: '12px 36px 12px 14px', fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 13,
            color: '#1E1B13', cursor: 'pointer', outline: 'none',
          }}
        >
          {STONE_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9A8F84"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {form.stone !== 'none' && (
        <div style={{
          marginTop: 6, fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5,
          color: '#9A8F84', lineHeight: 1.45,
        }}>Stones occupy roughly 8% of gross weight — we’ll deduct this from the estimate.</div>
      )}

      {/* Diamond details (conditional) */}
      {form.stone === 'diamond' && (
        <DiamondDetails
          form={form}
          errors={errors}
          showError={showError}
          onChange={onChange}
          onBlur={onBlur}
          fmt={fmt}
        />
      )}

      {/* Live rate hint */}
      {form.metal && form.purity && (
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 12,
          background: CALC_GOLD_TINT, border: `1px dashed ${CALC_GOLD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, color: CALC_GOLD_DK,
        }}>
          <span style={{ letterSpacing: 0.3 }}>
            Applicable buy-back rate · {form.metal === 'silver'
              ? `Silver ${form.purity}`
              : `${form.purity}KT Gold`}
          </span>
          <span style={{ fontWeight: 800 }}>₹{previewRate.toLocaleString('en-IN')}/gm</span>
        </div>
      )}

      {/* Reset (when anything entered) */}
      {(form.metal || form.purity || form.weight || form.stone !== 'none') && (
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <button type="button" onClick={onReset} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#9A8F84', fontFamily: `'Manrope', ${CALC_T.sans}`,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 1 3 6.7"/><polyline points="3 21 3 15 9 15"/>
            </svg>
            Clear form
          </button>
        </div>
      )}

      {/* Settlement options (only when valid) */}
      {valid && baseValue > 0 && (
        <>
          <div style={{
            marginTop: 22,
            fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: CALC_GOLD,
            letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
          }}>Choose your settlement</div>

          <div style={{
            marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
            {[
              { k: 'exchange', label: 'Exchange', tagline: 'Full value · towards new jewellery', badge: '100%',                      value: baseValue },
              { k: 'cashback', label: 'Cashback', tagline: `${CASHBACK_FEE_PCT}% fee · credited to your account`, badge: `−${CASHBACK_FEE_PCT}%`, value: Math.round(baseValue - baseValue * (CASHBACK_FEE_PCT / 100)) },
            ].map(opt => {
              const active = payout === opt.k;
              return (
                <button key={opt.k} type="button" onClick={() => setPayout(opt.k)} style={{
                  textAlign: 'left', padding: '14px 14px 16px',
                  background: active ? '#fff' : '#FBF7F3',
                  border: `1.5px solid ${active ? CALC_GOLD : CALC_T.line}`,
                  borderRadius: 14, cursor: 'pointer',
                  boxShadow: active ? '0 4px 14px rgba(115,92,0,0.14)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  transition: 'all 160ms ease',
                }}>
                  <span style={{
                    display: 'inline-flex', alignSelf: 'flex-start',
                    padding: '3px 8px', borderRadius: 50,
                    background: active ? CALC_GOLD_TINT : 'rgba(154,143,132,0.14)',
                    color: active ? CALC_GOLD_DK : '#6E655C',
                    fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10, fontWeight: 700,
                    letterSpacing: 0.6,
                  }}>{opt.badge}</span>
                  <span style={{
                    fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 16, fontWeight: 700, color: '#1E1B13',
                  }}>{opt.label}</span>
                  <span style={{
                    fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#6E655C', lineHeight: 1.4,
                  }}>{opt.tagline}</span>
                  <span style={{
                    marginTop: 4,
                    fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 15, fontWeight: 800, color: CALC_GOLD_DK,
                  }}>{fmt(opt.value)}</span>
                </button>
              );
            })}
          </div>

          {/* Breakdown */}
          <div style={{
            marginTop: 14, background: '#fff', borderRadius: 16,
            border: `1px solid ${CALC_T.line}`, padding: '4px 0',
          }}>
            {(() => {
              const diamondValue = computeDiamondValue(form);
              const metalValue = baseValue - diamondValue;
              return (
                <>
                  <BreakdownRow
                    label={form.metal === 'silver' ? 'Silver value' : 'Gold value'}
                    detail={`${form.weight} g × ₹${previewRate.toLocaleString('en-IN')} · ${form.stone !== 'none' ? 'less stones' : 'no stones'}`}
                    value={fmt(metalValue)}
                  />
                  {diamondValue > 0 && (
                    <BreakdownRow
                      label="Diamond value"
                      detail={`${form.diamondCount} stones · ${form.diamondWeight} ct · ${form.diamondClarity}/${form.diamondColor}`}
                      value={fmt(diamondValue)}
                    />
                  )}
                </>
              );
            })()}
            {payout === 'cashback' && (
              <BreakdownRow
                label="Cashback processing fee"
                detail={`${CASHBACK_FEE_PCT}% of base value`}
                value={`− ${fmt(deduction)}`}
              />
            )}
            <div style={{ height: 1, background: CALC_T.line, margin: '4px 16px' }}/>
            <div style={{
              padding: '14px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
                  letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
                }}>{payout === 'exchange' ? 'Exchange value' : 'You will receive'}</div>
                <div style={{
                  fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 30, fontWeight: 700,
                  color: CALC_GOLD_DK, marginTop: 2,
                }}>{finalValue > 0 ? `₹${finalValue.toLocaleString('en-IN')}` : '—'}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div style={{
        marginTop: 16, fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
        lineHeight: 1.5, fontStyle: 'italic',
      }}>
        Estimate is indicative. Actual buy-back value is confirmed at the store after a purity and stone-weight assessment.
      </div>
    </div>
  );
}

function DiamondDetails({ form, errors, showError, onChange, onBlur, fmt }) {
  const originOptions = form.diamondType === 'lab'
    ? DIAMOND_ORIGINS_LAB
    : form.diamondType === 'natural'
      ? DIAMOND_ORIGINS_NATURAL
      : [...DIAMOND_ORIGINS_NATURAL, ...DIAMOND_ORIGINS_LAB];

  const diamondValuePreview = computeDiamondValue(form);

  return (
    <div style={{
      marginTop: 16, padding: '14px 14px 18px',
      background: 'linear-gradient(180deg, #FBF7F3 0%, #F7F0E4 100%)',
      border: `1px solid ${CALC_T.line}`, borderRadius: 14,
      minWidth: 0, overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          background: '#fff', color: CALC_GOLD_DK, border: `1px solid ${CALC_T.line}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M8 9h8"/>
          </svg>
        </span>
        <span style={{
          fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 15, fontWeight: 700, color: '#1E1B13',
        }}>Diamond details</span>
      </div>
      <div style={{
        marginTop: 2, paddingLeft: 30,
        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
        lineHeight: 1.45,
      }}>All fields below are required once Diamond is chosen.</div>

      {/* Type */}
      <OjFieldLabel>Type</OjFieldLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, minWidth: 0 }}>
        {DIAMOND_TYPES.map(t => {
          const active = form.diamondType === t.v;
          return (
            <button key={t.v} type="button"
              onClick={() => { onChange('diamondType', t.v); onBlur('diamondType'); }}
              style={{
                padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                background: active ? '#fff' : 'rgba(255,255,255,0.5)',
                color: active ? CALC_GOLD_DK : '#6E655C',
                border: `1.5px solid ${active ? CALC_GOLD : CALC_T.line}`,
                boxShadow: active ? '0 1px 4px rgba(115,92,0,0.14)' : 'none',
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5,
                fontWeight: active ? 700 : 600, letterSpacing: 0.3,
              }}>{t.l}</button>
          );
        })}
      </div>
      {showError('diamondType') && <OjError>{errors.diamondType}</OjError>}

      {/* Shape */}
      <OjFieldLabel>Shape</OjFieldLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {DIAMOND_SHAPES.map(s => {
          const active = form.diamondShape === s.v;
          return (
            <button key={s.v} type="button"
              onClick={() => { onChange('diamondShape', s.v); onBlur('diamondShape'); }}
              style={{
                padding: '6px 12px', borderRadius: 50, cursor: 'pointer',
                background: active ? CALC_GOLD : '#fff',
                color: active ? '#fff' : CALC_GOLD_DK,
                border: `1px solid ${active ? CALC_GOLD : 'rgba(115,92,0,0.24)'}`,
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 11.5, fontWeight: 700,
                letterSpacing: 0.2,
              }}>{s.l}</button>
          );
        })}
      </div>
      {showError('diamondShape') && <OjError>{errors.diamondShape}</OjError>}

      {/* Count + Weight (two numeric inputs side-by-side) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        <div style={{ minWidth: 0 }}>
          <DiamondNumLabel>Stones</DiamondNumLabel>
          <DiamondNumberInput
            value={form.diamondCount}
            onChange={v => onChange('diamondCount', v.replace(/[^0-9]/g, ''))}
            onBlur={() => onBlur('diamondCount')}
            placeholder="e.g., 7"
            unit="nos"
            error={showError('diamondCount')}
            inputMode="numeric"
          />
          {showError('diamondCount') && <OjError>{errors.diamondCount}</OjError>}
        </div>
        <div style={{ minWidth: 0 }}>
          <DiamondNumLabel>Total carat</DiamondNumLabel>
          <DiamondNumberInput
            value={form.diamondWeight}
            onChange={v => onChange('diamondWeight', v.replace(/[^0-9.]/g, ''))}
            onBlur={() => onBlur('diamondWeight')}
            placeholder="0.00"
            unit="ct"
            error={showError('diamondWeight')}
            inputMode="decimal"
          />
          {showError('diamondWeight') && <OjError>{errors.diamondWeight}</OjError>}
        </div>
      </div>

      {/* Clarity + Color */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        <div style={{ minWidth: 0 }}>
          <DiamondNumLabel>Clarity</DiamondNumLabel>
          <DiamondSelect
            value={form.diamondClarity}
            onChange={v => { onChange('diamondClarity', v); onBlur('diamondClarity'); }}
            placeholder="Select"
            options={DIAMOND_CLARITIES.map(c => ({ v: c, l: c }))}
            error={showError('diamondClarity')}
          />
          {showError('diamondClarity') && <OjError>{errors.diamondClarity}</OjError>}
        </div>
        <div style={{ minWidth: 0 }}>
          <DiamondNumLabel>Color</DiamondNumLabel>
          <DiamondSelect
            value={form.diamondColor}
            onChange={v => { onChange('diamondColor', v); onBlur('diamondColor'); }}
            placeholder="Select"
            options={DIAMOND_COLORS.map(c => ({ v: c, l: c }))}
            error={showError('diamondColor')}
          />
          {form.diamondColor && (
            <div style={{
              marginTop: 4,
              fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10, color: '#9A8F84',
            }}>{colorDescriptor(form.diamondColor)}</div>
          )}
          {showError('diamondColor') && <OjError>{errors.diamondColor}</OjError>}
        </div>
      </div>

      {/* Origin */}
      <div style={{ marginTop: 16 }}>
        <DiamondNumLabel>Origin</DiamondNumLabel>
        <DiamondSelect
          value={form.diamondOrigin}
          onChange={v => { onChange('diamondOrigin', v); onBlur('diamondOrigin'); }}
          placeholder={form.diamondType ? 'Select origin' : 'Pick diamond type first'}
          disabled={!form.diamondType}
          options={originOptions.map(o => ({ v: o, l: o }))}
          error={showError('diamondOrigin')}
        />
        {showError('diamondOrigin') && <OjError>{errors.diamondOrigin}</OjError>}
      </div>

      {/* Live diamond valuation hint */}
      {diamondValuePreview > 0 && (
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 12,
          background: '#fff', border: `1px dashed ${CALC_GOLD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10, flexWrap: 'wrap',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, color: CALC_GOLD_DK,
        }}>
          <span style={{ letterSpacing: 0.3, minWidth: 0 }}>
            Indicative diamond value
            <span style={{
              display: 'block', color: '#9A8F84', fontSize: 10.5, marginTop: 2,
              wordBreak: 'break-word',
            }}>
              {form.diamondCount || 0} stones · {form.diamondWeight || 0} ct {form.diamondType === 'lab' ? '· lab-grown' : ''}
            </span>
          </span>
          <span style={{ fontWeight: 800, whiteSpace: 'nowrap' }}>{fmt(diamondValuePreview)}</span>
        </div>
      )}
    </div>
  );
}

function colorDescriptor(c) {
  if (['D','E','F'].includes(c)) return 'Colorless';
  if (['G','H','I','J'].includes(c)) return 'Near-colorless';
  if (['K','L','M'].includes(c)) return 'Faint';
  return '';
}

function DiamondNumLabel({ children }) {
  return (
    <div style={{
      marginBottom: 6,
      fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 11, color: '#6E655C',
      letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 700,
    }}>{children}</div>
  );
}

function DiamondNumberInput({ value, onChange, onBlur, placeholder, unit, error, inputMode = 'decimal' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: '#fff', border: `1px solid ${error ? '#D65A50' : CALC_T.line}`,
      borderRadius: 10, padding: '0 10px', height: 44,
      minWidth: 0, overflow: 'hidden',
      transition: 'border-color 160ms ease',
    }}>
      <input
        type="text" inputMode={inputMode}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 14, fontWeight: 700,
          color: '#1E1B13', minWidth: 0, textAlign: 'right',
        }}
      />
      <span style={{
        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84', fontWeight: 600,
        paddingLeft: 4,
      }}>{unit}</span>
    </div>
  );
}

function DiamondSelect({ value, onChange, placeholder, options, error, disabled }) {
  return (
    <div style={{ position: 'relative', minWidth: 0 }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%', maxWidth: '100%', boxSizing: 'border-box',
          appearance: 'none',
          background: disabled ? '#F4F0E8' : '#fff',
          border: `1px solid ${error ? '#D65A50' : CALC_T.line}`, borderRadius: 10,
          padding: '11px 30px 11px 10px',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 13,
          color: value ? '#1E1B13' : '#9A8F84',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none', opacity: disabled ? 0.7 : 1,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9A8F84"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function OjFieldLabel({ children }) {
  return (
    <div style={{
      marginTop: 16, marginBottom: 8,
      fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 11, color: '#6E655C',
      letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700,
    }}>{children}</div>
  );
}
function OjError({ children }) {
  return (
    <div role="alert" style={{
      marginTop: 6,
      fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 11, color: '#D65A50', fontWeight: 600,
    }}>{children}</div>
  );
}

function OtherJewellerStickyFooter({ valid, finalValue, payout, fmt, onContinue }) {
  const disabled = !valid || finalValue <= 0;
  return (
    <div style={{
      padding: '12px 18px 14px', background: '#fff',
      borderTop: `1px solid ${CALC_T.line}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10, color: '#9A8F84',
          letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
        }}>
          {valid
            ? `${payout === 'exchange' ? 'Exchange value' : 'Cashback payout'}`
            : 'Complete the form'}
        </div>
        <div style={{
          fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 20, fontWeight: 700,
          color: CALC_GOLD_DK, marginTop: 1,
        }}>{valid && finalValue > 0 ? fmt(finalValue) : '—'}</div>
      </div>
      <button
        type="button" onClick={onContinue} disabled={disabled}
        style={{
          height: 48, padding: '0 22px', borderRadius: 12, border: 'none',
          background: disabled ? '#C9BFA8' : CALC_GOLD, color: '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
          letterSpacing: 0.8, textTransform: 'uppercase',
          boxShadow: disabled ? 'none' : '0 4px 12px rgba(115,92,0,0.22)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
        {payout === 'exchange' ? 'Start Exchange' : 'Request Cashback'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Sagar buy-back: bill / barcode lookup + item selection ────
function SagarLookupFlow({
  lookupKind, setLookupKind,
  lookupValue, setLookupValue,
  lookupStatus,
  items, selectedIds, onToggleItem, onSelectAll,
  onSubmit, onReset,
  payout, setPayout,
  buyRateMap,
  subtotal, deduction, finalValue,
  fmt,
}) {
  const hasItems     = items.length > 0;
  const allSelected  = hasItems && selectedIds.size === items.length;
  const selectedList = items.filter(i => selectedIds.has(i.id));

  return (
    <div>
      {/* Kicker */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 22, fontWeight: 700,
          color: '#1E1B13', lineHeight: 1.2,
        }}>Find your jewellery</div>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, color: '#6E655C',
          marginTop: 4, lineHeight: 1.5,
        }}>Enter the barcode on the tag or your bill number to pull up your past purchases.</div>
      </div>

      {/* Lookup-kind toggle */}
      <div style={{
        marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
        padding: 4, borderRadius: 12, background: '#F1EADC', border: `1px solid ${CALC_T.line}`,
      }}>
        {[
          { k: 'barcode', label: 'Barcode Number' },
          { k: 'bill',    label: 'Bill Number'    },
        ].map(t => {
          const active = lookupKind === t.k;
          return (
            <button key={t.k} type="button" onClick={() => setLookupKind(t.k)} style={{
              padding: '9px 0', borderRadius: 9, cursor: 'pointer',
              background: active ? '#fff' : 'transparent',
              color: active ? CALC_GOLD_DK : '#6E655C',
              border: active ? `1px solid ${CALC_GOLD}` : '1px solid transparent',
              boxShadow: active ? '0 1px 4px rgba(115,92,0,0.14)' : 'none',
              fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, fontWeight: 700,
              letterSpacing: 0.3,
            }}>{t.label}</button>
          );
        })}
      </div>

      {/* Lookup form */}
      <form onSubmit={onSubmit} style={{
        marginTop: 10, display: 'flex', gap: 8,
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', border: `1px solid ${CALC_T.line}`, borderRadius: 12,
          padding: '0 14px', height: 46,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8F84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {lookupKind === 'barcode' ? (
              <>
                <path d="M4 6v12M8 6v12M12 6v12M16 6v12M20 6v12"/>
              </>
            ) : (
              <>
                <rect x="4.5" y="3.5" width="15" height="17" rx="2"/>
                <path d="M8 8h8M8 12h8M8 16h5"/>
              </>
            )}
          </svg>
          <input
            type="text"
            inputMode={lookupKind === 'barcode' ? 'numeric' : 'text'}
            value={lookupValue}
            onChange={e => setLookupValue(e.target.value)}
            placeholder={lookupKind === 'barcode' ? 'e.g., 8901234567890' : 'e.g., B/24/0912'}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 13, color: '#1E1B13',
            }}
          />
          {lookupValue && (
            <button type="button" onClick={onReset} aria-label="Clear" style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'inline-flex', color: '#9A8F84',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
        <button type="submit" disabled={!lookupValue.trim() || lookupStatus === 'loading'} style={{
          padding: '0 16px', height: 46, borderRadius: 12, border: 'none',
          background: lookupValue.trim() ? CALC_GOLD : '#C9BFA8', color: '#fff',
          cursor: lookupValue.trim() ? 'pointer' : 'not-allowed',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, fontWeight: 700,
          letterSpacing: 0.6, textTransform: 'uppercase',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          {lookupStatus === 'loading' ? 'Finding…' : 'Find'}
        </button>
      </form>

      {/* Status: loading / notfound / done */}
      {lookupStatus === 'loading' && (
        <div style={{
          marginTop: 14, padding: '32px 16px', textAlign: 'center',
          background: '#fff', borderRadius: 14, border: `1px solid ${CALC_T.line}`,
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, color: '#6E655C',
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            border: `2.4px solid ${CALC_GOLD_TINT}`, borderTopColor: CALC_GOLD,
            margin: '0 auto 10px', animation: 'sbSpin 800ms linear infinite',
          }}/>
          Pulling up your jewellery…
          <style>{`@keyframes sbSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {lookupStatus === 'notfound' && (
        <div style={{
          marginTop: 14, padding: '18px 16px',
          background: '#FFF4E8', borderRadius: 14, border: '1px dashed #D9A65E',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12, color: '#6B4A2E',
          lineHeight: 1.55,
        }}>
          <strong style={{ color: '#6B4A2E' }}>No records found.</strong> Double-check the {lookupKind === 'barcode' ? 'barcode' : 'bill number'} and try again, or visit any Sagar store for assistance.
        </div>
      )}

      {lookupStatus === 'done' && hasItems && (
        <>
          {/* Results header */}
          <div style={{
            marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            <div>
              <div style={{
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: CALC_GOLD,
                letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
              }}>{items.length} item{items.length === 1 ? '' : 's'} found</div>
              <div style={{
                fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 18, fontWeight: 700,
                color: '#1E1B13', marginTop: 2,
              }}>Choose what to return</div>
            </div>
            <button type="button" onClick={onSelectAll} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: CALC_GOLD, fontFamily: `'Manrope', ${CALC_T.sans}`,
              fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
            }}>{allSelected ? 'All selected' : 'Select all'}</button>
          </div>

          {/* Item cards */}
          <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
            {items.map(item => {
              const checked  = selectedIds.has(item.id);
              const rate     = buyRateMap[item.purity] || 0;
              const value    = Math.round(item.weight * rate);
              return (
                <label key={item.id} style={{
                  display: 'flex', alignItems: 'stretch', gap: 12, padding: 12,
                  background: '#fff', borderRadius: 14, cursor: 'pointer',
                  border: `1.5px solid ${checked ? CALC_GOLD : CALC_T.line}`,
                  boxShadow: checked ? '0 2px 10px rgba(115,92,0,0.12)' : 'none',
                  transition: 'all 160ms ease',
                }}>
                  <input type="checkbox" checked={checked} onChange={() => onToggleItem(item.id)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}/>
                  <span style={{
                    width: 60, height: 60, borderRadius: 10, flexShrink: 0,
                    backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    background: item.img ? `center/cover no-repeat url(${item.img}), #FBF7F3` : '#FBF7F3',
                    border: `1px solid ${CALC_T.line}`,
                  }}/>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span>
                      <span style={{
                        display: 'block',
                        fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 14, fontWeight: 700,
                        color: '#1E1B13', lineHeight: 1.25,
                      }}>{item.name}</span>
                      <span style={{
                        display: 'block', marginTop: 4,
                        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
                        letterSpacing: 0.3,
                      }}>{item.purity}KT · {item.weight.toFixed(2)}g · Bill {item.bill}</span>
                    </span>
                    <span style={{
                      marginTop: 6,
                      fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
                      color: CALC_GOLD_DK,
                    }}>{fmt(value)}</span>
                  </span>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0, alignSelf: 'center',
                    border: `1.6px solid ${checked ? CALC_GOLD : '#C9BFA8'}`,
                    background: checked ? CALC_GOLD : '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 160ms ease',
                  }}>
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Payout selector (appears once anything is selected) */}
          {selectedList.length > 0 && (
            <>
              <div style={{
                marginTop: 22,
                fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: CALC_GOLD,
                letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
              }}>Choose your payout</div>

              <div style={{
                marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              }}>
                {[
                  {
                    k: 'exchange',
                    label: 'Exchange',
                    tagline: 'Full value · towards new jewellery',
                    badge: '100%',
                    value: Math.round(subtotal),
                  },
                  {
                    k: 'cashback',
                    label: 'Cashback',
                    tagline: `${CASHBACK_FEE_PCT}% fee · credited to your account`,
                    badge: `−${CASHBACK_FEE_PCT}%`,
                    value: Math.round(subtotal - subtotal * (CASHBACK_FEE_PCT / 100)),
                  },
                ].map(opt => {
                  const active = payout === opt.k;
                  return (
                    <button key={opt.k} type="button" onClick={() => setPayout(opt.k)} style={{
                      textAlign: 'left', padding: '14px 14px 16px',
                      background: active ? '#fff' : '#FBF7F3',
                      border: `1.5px solid ${active ? CALC_GOLD : CALC_T.line}`,
                      borderRadius: 14, cursor: 'pointer',
                      boxShadow: active ? '0 4px 14px rgba(115,92,0,0.14)' : 'none',
                      display: 'flex', flexDirection: 'column', gap: 6,
                      transition: 'all 160ms ease',
                    }}>
                      <span style={{
                        display: 'inline-flex', alignSelf: 'flex-start',
                        padding: '3px 8px', borderRadius: 50,
                        background: active ? CALC_GOLD_TINT : 'rgba(154,143,132,0.14)',
                        color: active ? CALC_GOLD_DK : '#6E655C',
                        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10, fontWeight: 700,
                        letterSpacing: 0.6,
                      }}>{opt.badge}</span>
                      <span style={{
                        fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 16, fontWeight: 700,
                        color: '#1E1B13',
                      }}>{opt.label}</span>
                      <span style={{
                        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#6E655C',
                        lineHeight: 1.4,
                      }}>{opt.tagline}</span>
                      <span style={{
                        marginTop: 4,
                        fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 15, fontWeight: 800,
                        color: CALC_GOLD_DK,
                      }}>{fmt(opt.value)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Breakdown */}
              <div style={{
                marginTop: 14, background: '#fff', borderRadius: 16,
                border: `1px solid ${CALC_T.line}`, padding: '4px 0',
              }}>
                <BreakdownRow
                  label={`Selected jewellery (${selectedList.length})`}
                  detail={`${selectedList.reduce((g, i) => g + i.weight, 0).toFixed(2)} g total`}
                  value={fmt(subtotal)}
                />
                {payout === 'cashback' && (
                  <BreakdownRow
                    label="Cashback processing fee"
                    detail={`${CASHBACK_FEE_PCT}% of item value`}
                    value={`− ${fmt(deduction)}`}
                  />
                )}
                <div style={{ height: 1, background: CALC_T.line, margin: '4px 16px' }}/>
                <div style={{
                  padding: '14px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{
                      fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10.5, color: '#9A8F84',
                      letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
                    }}>{payout === 'exchange' ? 'Exchange value' : 'You will receive'}</div>
                    <div style={{
                      fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 30, fontWeight: 700,
                      color: CALC_GOLD_DK, marginTop: 2,
                    }}>{finalValue > 0 ? `₹${finalValue.toLocaleString('en-IN')}` : '—'}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function SagarStickyFooter({ selectedCount, finalValue, payout, fmt, onContinue }) {
  const disabled = selectedCount === 0;
  return (
    <div style={{
      padding: '12px 18px 14px', background: '#fff',
      borderTop: `1px solid ${CALC_T.line}`,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 10, color: '#9A8F84',
          letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
        }}>
          {selectedCount > 0
            ? `${selectedCount} item${selectedCount === 1 ? '' : 's'} · ${payout === 'exchange' ? 'Exchange' : 'Cashback'}`
            : 'No items selected'}
        </div>
        <div style={{
          fontFamily: `'Noto Serif', ${CALC_T.serif}`, fontSize: 20, fontWeight: 700,
          color: CALC_GOLD_DK, marginTop: 1,
        }}>{selectedCount > 0 ? fmt(finalValue) : '—'}</div>
      </div>
      <button
        type="button" onClick={onContinue} disabled={disabled}
        style={{
          height: 48, padding: '0 22px', borderRadius: 12, border: 'none',
          background: disabled ? '#C9BFA8' : CALC_GOLD, color: '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: `'Manrope', ${CALC_T.sans}`, fontSize: 12.5, fontWeight: 700,
          letterSpacing: 0.8, textTransform: 'uppercase',
          boxShadow: disabled ? 'none' : '0 4px 12px rgba(115,92,0,0.22)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
        {payout === 'exchange' ? 'Start Exchange' : 'Request Cashback'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Tiny icon for buy-back source chips ───────────────────────
function SourceIcon({ kind }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'ours') {
    return (
      <svg {...common}>
        <path d="M3 9l9-5 9 5v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
        <path d="M8 13l3 3 5-6"/>
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3"/>
      <path d="M5 21c1.2-4 4-6 7-6s5.8 2 7 6"/>
      <path d="M17 6l2 2"/>
    </svg>
  );
}

window.CalculatorPage = CalculatorPage;
