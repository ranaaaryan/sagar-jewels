import React from 'react';
// Filter Page — modal sheet overlaid on Listing
// Based on Figma "Filter page" (node 182:156)
// Sections: Price Range (slider + Min/Max fields), Metal (Color chips + Purity chips),
// Technical Parameters, Certification → Apply Filters pill + Reset link

const FL = window.JEWEL_TOKENS;
const FL_BG = '#fff';
const FL_SOFT = 'rgb(244,244,242)';
const FL_ACCENT = 'rgb(172,129,108)';
const FL_ACCENT_DK = 'rgb(122,88,67)';
const FL_INK = 'rgb(48,51,51)';
const FL_INK_SOFT = 'rgb(93,96,95)';
const FL_LINE = 'rgb(231,232,231)';

function FilterSheet({ open, initial, onApply, onClose }) {
  const [min, setMin] = React.useState(initial?.min ?? 500);
  const [max, setMax] = React.useState(initial?.max ?? 25000);

  const [metalColors, setMetalColors] = React.useState(initial?.metalColors ?? ['Yellow Gold']);
  const [purity, setPurity] = React.useState(initial?.purity ?? ['22k']);

  const [open1, setOpen1] = React.useState(true);   // Metal open by default
  const [open2, setOpen2] = React.useState(false);  // Technical
  const [open3, setOpen3] = React.useState(false);  // Certification

  const [shape, setShape] = React.useState(initial?.shape ?? []);
  const [clarity, setClarity] = React.useState(initial?.clarity ?? []);
  const [caratMin, setCaratMin] = React.useState(initial?.caratMin ?? 0.2);
  const [caratMax, setCaratMax] = React.useState(initial?.caratMax ?? 2.0);

  const [certs, setCerts] = React.useState(initial?.certs ?? ['BIS Hallmark']);

  function toggle(list, setList, item) {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  }

  function reset() {
    setMin(500); setMax(25000);
    setMetalColors([]); setPurity([]);
    setShape([]); setClarity([]);
    setCaratMin(0.2); setCaratMax(2.0);
    setCerts([]);
  }

  function apply() {
    onApply({
      min, max, metalColors, purity,
      shape, clarity, caratMin, caratMax, certs,
    });
    onClose();
  }

  // slider track — two-handle visual (no drag logic; the number inputs are the source of truth)
  const TRACK_MIN = 500, TRACK_MAX = 25000;
  const pct = v => ((v - TRACK_MIN) / (TRACK_MAX - TRACK_MIN)) * 100;

  if (!open) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(47,52,48,0.45)',
      display: 'flex', flexDirection: 'column', zIndex: 40,
    }} onClick={onClose}>
      <div style={{ flex: 1 }} onClick={onClose}/>

      {/* Sheet */}
      <div onClick={e => e.stopPropagation()}
        style={{
          background: FL_BG, borderRadius: '24px 24px 0 0',
          maxHeight: '90%', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -20px 60px rgba(47,52,48,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* drag handle */}
        <div style={{
          padding: '10px 0 4px', display: 'flex', justifyContent: 'center',
        }}>
          <div style={{ width: 44, height: 4, borderRadius: 2, background: 'rgba(47,52,48,0.2)' }}/>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px 6px',
        }}>
          <div style={{
            fontFamily: `'Noto Serif', ${FL.serif}`, fontSize: 22, fontWeight: 700, color: FL_INK,
          }}>Filters</div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 36, height: 36, borderRadius: '50%', background: FL_SOFT, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={FL_INK} strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 24px 16px' }}>
          {/* ── Price Range card ── */}
          <div style={{
            borderRadius: 14, background: FL_SOFT, padding: 20,
          }}>
            <div style={{
              fontFamily: `'Noto Serif', ${FL.serif}`, fontSize: 20, color: FL_ACCENT_DK, fontWeight: 500,
            }}>Price Range</div>

            {/* bounds row */}
            <div style={{
              marginTop: 18, display: 'flex', justifyContent: 'space-between',
              fontFamily: `'Manrope', ${FL.sans}`, fontSize: 13, color: FL_INK_SOFT,
            }}>
              <span>₹{(min * 80).toLocaleString('en-IN')}</span>
              <span>₹{(max * 80).toLocaleString('en-IN')}+</span>
            </div>

            {/* dual slider */}
            <div style={{
              position: 'relative', height: 28, marginTop: 6,
            }}>
              <div style={{
                position: 'absolute', top: 12, left: 0, right: 0, height: 4, borderRadius: 99,
                background: FL_LINE,
              }}/>
              <div style={{
                position: 'absolute', top: 12, left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%`,
                height: 4, borderRadius: 99, background: FL_ACCENT,
              }}/>
              {/* handles */}
              <Handle pos={pct(min)}/>
              <Handle pos={pct(max)}/>
              {/* invisible range inputs for a11y/interactivity */}
              <input type="range" min={TRACK_MIN} max={TRACK_MAX} step={100} value={min}
                onChange={e => setMin(Math.min(Number(e.target.value), max - 500))}
                style={rangeInput}/>
              <input type="range" min={TRACK_MIN} max={TRACK_MAX} step={100} value={max}
                onChange={e => setMax(Math.max(Number(e.target.value), min + 500))}
                style={rangeInput}/>
            </div>

            {/* min / max input boxes */}
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
              <PriceInput label="Min Price" value={min} onChange={v => setMin(Math.min(v, max - 500))}/>
              <PriceInput label="Max Price" value={max} onChange={v => setMax(Math.max(v, min + 500))}/>
            </div>
          </div>

          {/* ── Metal ── */}
          <FilterGroup title="Metal" open={open1} onToggle={() => setOpen1(!open1)}>
            <div style={{
              fontFamily: `'Manrope', ${FL.sans}`, fontSize: 11, letterSpacing: 1.4,
              color: FL_INK_SOFT, fontWeight: 700,
            }}>COLOR</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {[
                { n: 'Yellow Gold', c: 'rgb(228,190,110)' },
                { n: 'Rose Gold',   c: 'rgb(233,176,155)' },
                { n: 'White Gold',  c: 'rgb(232,230,224)' },
              ].map(m => (
                <ColorChip key={m.n} name={m.n} color={m.c} active={metalColors.includes(m.n)}
                  onClick={() => toggle(metalColors, setMetalColors, m.n)}/>
              ))}
            </div>

            <div style={{
              marginTop: 20,
              fontFamily: `'Manrope', ${FL.sans}`, fontSize: 11, letterSpacing: 1.4,
              color: FL_INK_SOFT, fontWeight: 700,
            }}>PURITY</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              {['14k', '18k', '22k', '24k'].map(p => (
                <Chip key={p} active={purity.includes(p)} onClick={() => toggle(purity, setPurity, p)}>{p}</Chip>
              ))}
            </div>
          </FilterGroup>

          {/* ── Technical Parameters ── */}
          <FilterGroup title="Technical Parameters" open={open2} onToggle={() => setOpen2(!open2)}>
            <div style={{
              fontFamily: `'Manrope', ${FL.sans}`, fontSize: 11, letterSpacing: 1.4,
              color: FL_INK_SOFT, fontWeight: 700,
            }}>STONE SHAPE</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {['Round', 'Oval', 'Pear', 'Princess', 'Emerald', 'Marquise'].map(s => (
                <Chip key={s} active={shape.includes(s)} onClick={() => toggle(shape, setShape, s)}>{s}</Chip>
              ))}
            </div>

            <div style={{
              marginTop: 20,
              fontFamily: `'Manrope', ${FL.sans}`, fontSize: 11, letterSpacing: 1.4,
              color: FL_INK_SOFT, fontWeight: 700,
            }}>CLARITY</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'].map(c => (
                <Chip key={c} active={clarity.includes(c)} onClick={() => toggle(clarity, setClarity, c)}>{c}</Chip>
              ))}
            </div>

            <div style={{
              marginTop: 20,
              fontFamily: `'Manrope', ${FL.sans}`, fontSize: 11, letterSpacing: 1.4,
              color: FL_INK_SOFT, fontWeight: 700,
            }}>CARAT WEIGHT</div>
            <div style={{
              marginTop: 10, display: 'flex', gap: 12,
            }}>
              <PriceInput label="Min" value={caratMin} prefix="" suffix="ct" step={0.1} onChange={v => setCaratMin(Math.min(v, caratMax - 0.1))}/>
              <PriceInput label="Max" value={caratMax} prefix="" suffix="ct" step={0.1} onChange={v => setCaratMax(Math.max(v, caratMin + 0.1))}/>
            </div>
          </FilterGroup>

          {/* ── Certification ── */}
          <FilterGroup title="Certification" open={open3} onToggle={() => setOpen3(!open3)} last>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {[
                { n: 'BIS Hallmark', d: 'Government of India · 916 Gold' },
                { n: 'IGI',          d: 'International Gemological Institute' },
                { n: 'GIA',          d: 'Gemological Institute of America' },
                { n: 'SGL',          d: 'Solitaire Gemological Laboratory' },
              ].map(c => (
                <CertRow key={c.n} name={c.n} desc={c.d}
                  active={certs.includes(c.n)}
                  onClick={() => toggle(certs, setCerts, c.n)}/>
              ))}
            </div>
          </FilterGroup>
        </div>

        {/* Bottom action area */}
        <div style={{
          background: 'rgba(255,255,255,0.96)', borderTop: `1px solid ${FL_LINE}`,
          padding: '14px 24px 18px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
        }}>
          <button onClick={apply} style={{
            width: '100%', height: 56, borderRadius: 999, border: 'none',
            background: FL_ACCENT, color: '#fff', cursor: 'pointer',
            fontFamily: `'Noto Serif', ${FL.serif}`, fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
            boxShadow: '0 10px 20px -6px rgba(119,88,66,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            Apply Filters
            <FilterCount min={min} max={max} metalColors={metalColors} purity={purity} shape={shape} clarity={clarity} certs={certs}/>
          </button>
          <button onClick={reset} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: FL_ACCENT_DK, fontFamily: `'Manrope', ${FL.sans}`,
            fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 8px',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6a5 5 0 019-1.5"/><path d="M11 3v3h-3"/>
              <path d="M12 8a5 5 0 01-9 1.5"/><path d="M3 11V8h3"/>
            </svg>
            RESET ALL
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterCount({ min, max, metalColors, purity, shape, clarity, certs }) {
  const n =
    (min !== 500 || max !== 25000 ? 1 : 0) +
    metalColors.length + purity.length + shape.length + clarity.length + certs.length;
  if (!n) return null;
  return (
    <span style={{
      minWidth: 22, height: 22, borderRadius: 999,
      background: 'rgba(255,255,255,0.25)', color: '#fff',
      fontFamily: `'Manrope', sans-serif`, fontSize: 11, fontWeight: 700,
      padding: '0 8px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{n}</span>
  );
}

function Handle({ pos }) {
  return (
    <div style={{
      position: 'absolute', top: 5, left: `calc(${pos}% - 9px)`,
      width: 18, height: 18, borderRadius: '50%',
      background: '#fff', border: `3px solid ${FL_ACCENT}`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      pointerEvents: 'none',
    }}/>
  );
}

const rangeInput = {
  position: 'absolute', top: 0, left: 0, width: '100%', height: 28,
  background: 'transparent', appearance: 'none', WebkitAppearance: 'none',
  pointerEvents: 'auto', margin: 0, opacity: 0,
};

function PriceInput({ label, value, onChange, prefix = '$', suffix, step = 100 }) {
  return (
    <div style={{
      flex: 1, background: '#fff', borderRadius: 6, padding: '10px 12px',
    }}>
      <div style={{
        fontFamily: `'Manrope', sans-serif`, fontSize: 11, color: FL_INK_SOFT,
      }}>{label}</div>
      <div style={{
        marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        {prefix && <span style={{
          fontFamily: `'Manrope', sans-serif`, fontSize: 14, color: FL_INK, fontWeight: 500,
        }}>{prefix}</span>}
        <input
          type="number" value={value} step={step}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            flex: 1, width: '100%', minWidth: 0, border: 'none', outline: 'none', padding: 0,
            background: 'transparent',
            fontFamily: `'Manrope', sans-serif`, fontSize: 14, color: FL_INK, fontWeight: 500,
          }}/>
        {suffix && <span style={{
          fontFamily: `'Manrope', sans-serif`, fontSize: 11, color: FL_INK_SOFT, fontWeight: 600,
        }}>{suffix}</span>}
      </div>
    </div>
  );
}

function FilterGroup({ title, open, onToggle, last, children }) {
  return (
    <div style={{ borderBottom: last ? 'none' : `1px solid ${FL_LINE}`, padding: '12px 0' }}>
      <button onClick={onToggle} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 0', textAlign: 'left',
      }}>
        <span style={{
          fontFamily: `'Noto Serif', sans-serif`, fontSize: 20, fontWeight: 500, color: FL_ACCENT_DK,
        }}>{title}</span>
        <svg width="14" height="9" viewBox="0 0 12 7.4" fill={FL_ACCENT_DK} style={{
          transform: open ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 180ms',
        }}>
          <path d="M 1.4 7.4 L 0 6 L 6 0 L 12 6 L 10.6 7.4 L 6 2.8 Z"/>
        </svg>
      </button>
      {open && <div style={{ paddingTop: 14, paddingBottom: 12 }}>{children}</div>}
    </div>
  );
}

function ColorChip({ name, color, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 14px 8px 8px', borderRadius: 999,
      background: active ? 'rgba(172,129,108,0.12)' : '#fff',
      border: active ? `1.5px solid ${FL_ACCENT}` : `1px solid ${FL_LINE}`,
      cursor: 'pointer',
      fontFamily: `'Manrope', sans-serif`, fontSize: 13,
      color: active ? FL_ACCENT_DK : FL_INK,
      fontWeight: active ? 700 : 500,
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', background: color,
        border: '1px solid rgba(47,52,48,0.06)',
      }}/>
      {name}
    </button>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      minHeight: 36, padding: '0 16px', borderRadius: 999,
      background: active ? FL_ACCENT : '#fff',
      color: active ? '#fff' : FL_INK,
      border: active ? 'none' : `1px solid ${FL_LINE}`,
      cursor: 'pointer',
      fontFamily: `'Manrope', sans-serif`, fontSize: 13, fontWeight: active ? 700 : 500,
    }}>{children}</button>
  );
}

function CertRow({ name, desc, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      padding: '12px 14px', borderRadius: 12,
      background: active ? 'rgba(172,129,108,0.08)' : '#fff',
      border: active ? `1.5px solid ${FL_ACCENT}` : `1px solid ${FL_LINE}`,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: active ? FL_ACCENT : '#fff',
        border: active ? 'none' : `1.5px solid rgb(180,172,164)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        {active && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: `'Noto Serif', sans-serif`, fontSize: 14, fontWeight: 700, color: FL_INK }}>{name}</div>
        <div style={{ fontFamily: `'Manrope', sans-serif`, fontSize: 11, color: FL_INK_SOFT, marginTop: 2 }}>{desc}</div>
      </div>
    </button>
  );
}

window.FilterSheet = FilterSheet;
