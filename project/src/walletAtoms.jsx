import React from 'react';
// Wallet atoms — shared primitives used by the Wallet ecosystem pages
// and to dedupe patterns that previously lived inside Calculator.jsx.
// Registered on window so any page can reference them bare.

const WA_T = window.JEWEL_TOKENS;
const WA_GOLD      = 'rgb(115,92,0)';
const WA_GOLD_DK   = '#5A4700';
const WA_GOLD_TINT = 'rgba(115,92,0,0.08)';
const WA_INK       = '#1E1B13';
const WA_INK_SOFT  = '#6E655C';
const WA_LINE      = 'rgba(47,52,48,0.10)';
const WA_ERR       = '#D65A50';

// ── SegmentedToggle ───────────────────────────────────────────────
// Two-option pill selector. Replaces the inline copies previously
// scattered through Calculator.jsx (mode toggle, lookup-kind, etc.).
function SegmentedToggle({ value, onChange, options, ariaLabel }) {
  return (
    <div role="tablist" aria-label={ariaLabel} style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 6,
      padding: 4, borderRadius: 12, background: '#F1EADC', border: `1px solid ${WA_LINE}`,
    }}>
      {options.map(opt => {
        const active = value === opt.v;
        return (
          <button
            key={opt.v}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.v)}
            style={{
              padding: '10px 0', borderRadius: 9, cursor: 'pointer',
              background: active ? '#fff' : 'transparent',
              color: active ? WA_GOLD_DK : WA_INK_SOFT,
              border: active ? `1px solid ${WA_GOLD}` : '1px solid transparent',
              boxShadow: active ? '0 1px 4px rgba(115,92,0,0.16)' : 'none',
              fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 12.5,
              fontWeight: 700, letterSpacing: 0.4,
              transition: 'all 180ms ease',
            }}>
            {opt.l}
          </button>
        );
      })}
    </div>
  );
}

// ── RateStrip ─────────────────────────────────────────────────────
// Live-rate card. Extracted pattern from Calculator.jsx's current rate strip.
function RateStrip({ label, rate, unit = '/gm', delta, live = true, tone = 'gold' }) {
  const deltaSign = typeof delta === 'number' ? (delta > 0 ? '+' : delta < 0 ? '−' : '') : '';
  const deltaColor = typeof delta === 'number'
    ? (delta > 0 ? '#4C6944' : delta < 0 ? '#D65A50' : WA_INK_SOFT)
    : WA_INK_SOFT;
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: `1px solid ${WA_LINE}`,
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: WA_GOLD_TINT, color: WA_GOLD,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 10.5, color: '#9A8F84',
          letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
        }}>{label}</div>
        <div style={{
          fontFamily: `'Noto Serif', ${WA_T.serif}`, fontSize: 18, fontWeight: 700,
          color: WA_GOLD_DK, marginTop: 2,
          display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap',
        }}>
          ₹{Number(rate).toLocaleString('en-IN')}
          <span style={{ fontSize: 12, fontWeight: 500, color: WA_INK_SOFT }}>{unit}</span>
          {typeof delta === 'number' && delta !== 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, color: deltaColor,
              fontFamily: `'Manrope', ${WA_T.sans}`,
            }}>{deltaSign}₹{Math.abs(delta).toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
      {live && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 10.5, fontWeight: 700,
          color: '#4C6944', background: 'rgba(94,122,85,0.12)',
          padding: '4px 8px', borderRadius: 50,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', background: '#4C6944',
            animation: 'wa-pulse 1.6s ease-in-out infinite',
          }}/>
          Live
        </span>
      )}
      <style>{`@keyframes wa-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
    </div>
  );
}

// ── BreakdownRow ──────────────────────────────────────────────────
// Label / detail / value row used inside estimate or breakdown cards.
// Previously module-local in Calculator.jsx.
function BreakdownRow({ label, detail, value, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '12px 16px', gap: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 12.5, color: WA_INK, fontWeight: 600,
        }}>{label}</div>
        {detail && (
          <div style={{
            fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 10.5, color: '#9A8F84', marginTop: 2,
          }}>{detail}</div>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 13, fontWeight: 700, color: WA_INK,
        }}>{value}</div>
        {right}
      </div>
    </div>
  );
}

// ── ErrorMsg ──────────────────────────────────────────────────────
// Inline form error. Replaces OjError from Calculator.jsx.
function ErrorMsg({ children }) {
  return (
    <div role="alert" style={{
      marginTop: 6,
      fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11, color: WA_ERR, fontWeight: 600,
    }}>{children}</div>
  );
}

// ── SuccessBanner ─────────────────────────────────────────────────
// Inline confirmation banner used at checkout (voucher residual) and
// after digital-gold purchases. Auto-dismisses unless `persistent`.
function SuccessBanner({ title, sub, icon, tone = 'gold', action, onDismiss, persistent = false, timeout = 6000 }) {
  React.useEffect(() => {
    if (persistent || !onDismiss) return;
    const id = setTimeout(onDismiss, timeout);
    return () => clearTimeout(id);
  }, [persistent, onDismiss, timeout]);

  const palette = tone === 'voucher'
    ? { bg: 'linear-gradient(180deg, #FBF7F3 0%, #F4EADD 100%)', ink: WA_GOLD_DK, accent: WA_GOLD }
    : tone === 'success'
      ? { bg: 'rgba(76,105,68,0.08)', ink: '#355042', accent: '#4C6944' }
      : { bg: WA_GOLD_TINT, ink: WA_GOLD_DK, accent: WA_GOLD };

  return (
    <div role="status" style={{
      padding: '12px 14px', borderRadius: 12,
      background: palette.bg, border: `1px solid ${palette.accent}33`,
      display: 'flex', alignItems: 'flex-start', gap: 10,
      animation: 'wa-slideup 220ms cubic-bezier(.2,.8,.2,1)',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: '#fff', color: palette.accent,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${palette.accent}33`,
      }}>
        {icon || (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 12.5, fontWeight: 700,
          color: palette.ink, lineHeight: 1.35,
        }}>{title}</div>
        {sub && (
          <div style={{
            marginTop: 2,
            fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11, color: WA_INK_SOFT, lineHeight: 1.45,
          }}>{sub}</div>
        )}
        {action && (
          <button type="button" onClick={action.onClick} style={{
            marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, color: palette.accent,
            fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase',
          }}>{action.label} →</button>
        )}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: 4, color: WA_INK_SOFT, flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      )}
      <style>{`@keyframes wa-slideup { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── fmt ───────────────────────────────────────────────────────────
// Shared rupee formatter used across wallet pages.
function fmtINR(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

// ── PAN gate ──────────────────────────────────────────────────────
// Per Indian IT rules, bullion/gold transactions over ₹2,00,000 require
// a PAN card. KYC holds the PAN *number*; this gate captures the
// physical-card *image* as an audit artefact for high-value transactions.
const PAN_THRESHOLD = 200000;

// Hook: returns whether the gate is required and its open/close state.
// Callers pass the cumulative rupee value of the pending transaction.
function usePanGate({ user, cumulativeValue, threshold = PAN_THRESHOLD }) {
  const [open, setOpen] = React.useState(false);
  const hasPan = !!user?.panImage?.url;
  const required = (Number(cumulativeValue) || 0) > threshold;
  const blocked = required && !hasPan;
  return {
    required,
    hasPan,
    blocked,
    open,
    openGate: () => setOpen(true),
    closeGate: () => setOpen(false),
  };
}

// Modal: file upload + simulated verification.
// onSubmit({ url, uploadedAt, verified }) — parent persists to user.panImage
// then re-invokes the pending action. onCancel dismisses without proceeding.
function PanGateModal({ open, pendingValue, panNumber, onSubmit, onCancel }) {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [phase, setPhase] = React.useState('idle');   // 'idle' | 'uploading' | 'verifying'
  const [err, setErr] = React.useState(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) { setFile(null); setPreview(null); setPhase('idle'); setErr(null); }
  }, [open]);

  if (!open) return null;

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { setErr('Please upload an image file (JPG or PNG).'); return; }
    if (f.size > 8 * 1024 * 1024)  { setErr('File size must be under 8 MB.'); return; }
    setErr(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }

  function submit() {
    if (!file) return;
    setPhase('uploading');
    // Simulate upload → verification
    setTimeout(() => {
      setPhase('verifying');
      setTimeout(() => {
        onSubmit({
          url: preview,                     // mock — base64 data URL; real impl would return S3/CDN url
          uploadedAt: new Date().toISOString(),
          verified: true,
        });
      }, 800);
    }, 600);
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(42,39,36,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      zIndex: 40, animation: 'wa-fade 180ms ease',
    }} onClick={phase === 'idle' ? onCancel : undefined}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 18, padding: '22px 22px 20px',
        maxWidth: 360, width: '100%',
        boxShadow: '0 20px 40px rgba(30,27,19,0.3)',
        animation: 'wa-slideup 220ms cubic-bezier(.2,.8,.2,1)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: WA_GOLD_TINT, color: WA_GOLD_DK,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2"/>
              <path d="M3 10h18"/>
              <path d="M7 15h4"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: `'Noto Serif', ${WA_T.serif}`, fontSize: 17, fontWeight: 700, color: WA_INK,
            }}>PAN card required</div>
            <div style={{
              marginTop: 2,
              fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11, color: WA_INK_SOFT,
            }}>For transactions above ₹{PAN_THRESHOLD.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Transaction context */}
        <div style={{
          padding: '10px 12px', borderRadius: 10,
          background: WA_GOLD_TINT, border: `1px solid rgba(115,92,0,0.2)`,
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11.5, color: WA_GOLD_DK, lineHeight: 1.5,
        }}>
          This transaction totals <strong>₹{Math.round(pendingValue || 0).toLocaleString('en-IN')}</strong>.
          Per IT rules, we&rsquo;re required to keep a copy of your PAN card on file.
          {panNumber && <span style={{ display: 'block', marginTop: 4, color: WA_INK_SOFT, fontSize: 10.5 }}>PAN on record: <strong>{panNumber}</strong></span>}
        </div>

        {/* Upload area */}
        {!preview ? (
          <button type="button" onClick={() => inputRef.current?.click()} style={{
            padding: '22px 16px', borderRadius: 12, cursor: 'pointer',
            background: '#FBF7F3', border: `1.5px dashed ${WA_LINE}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{ color: WA_INK_SOFT }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="14" rx="2"/>
                <path d="M3 14l5-5 4 4 3-3 6 6"/>
                <circle cx="8" cy="9" r="1.4"/>
              </svg>
            </div>
            <div style={{
              fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 12.5, fontWeight: 700, color: WA_INK,
            }}>Upload PAN card image</div>
            <div style={{
              fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 10.5, color: WA_INK_SOFT,
            }}>JPG or PNG · up to 8 MB</div>
          </button>
        ) : (
          <div style={{
            padding: 8, borderRadius: 12,
            background: '#FBF7F3', border: `1px solid ${WA_LINE}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <img src={preview} alt="PAN preview" style={{
              width: 72, height: 46, borderRadius: 6, objectFit: 'cover',
              border: `1px solid ${WA_LINE}`, flexShrink: 0,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 12, fontWeight: 700, color: WA_INK,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{file?.name}</div>
              <div style={{
                fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 10.5, color: WA_INK_SOFT, marginTop: 1,
              }}>{Math.round((file?.size || 0) / 1024)} KB</div>
            </div>
            {phase === 'idle' && (
              <button onClick={() => { setFile(null); setPreview(null); }} style={{
                background: 'transparent', border: 'none', cursor: 'pointer', color: WA_INK_SOFT,
                padding: 4,
              }} aria-label="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }}/>
        {err && <ErrorMsg>{err}</ErrorMsg>}

        {/* Phase indicator */}
        {phase !== 'idle' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(76,105,68,0.08)',
            fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11.5, color: '#355042',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2px solid rgba(76,105,68,0.3)', borderTopColor: '#4C6944',
              animation: 'wa-spin 800ms linear infinite',
            }}/>
            {phase === 'uploading' ? 'Uploading PAN…' : 'Verifying with issuer…'}
          </div>
        )}

        {/* Compliance footer */}
        <div style={{
          fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 10, color: WA_INK_SOFT, lineHeight: 1.5,
        }}>
          Stored encrypted. Only visible to our compliance team. We&rsquo;ll never share or use it
          for anything else. <span style={{ color: WA_GOLD_DK, fontWeight: 700 }}>Privacy Policy</span>.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onCancel} disabled={phase !== 'idle'} style={{
            flex: 1, height: 44, borderRadius: 10, cursor: phase === 'idle' ? 'pointer' : 'not-allowed',
            background: 'transparent', color: WA_INK_SOFT,
            border: `1px solid ${WA_LINE}`,
            fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11.5, fontWeight: 700,
            letterSpacing: 0.6, textTransform: 'uppercase',
            opacity: phase === 'idle' ? 1 : 0.5,
          }}>Cancel</button>
          <button type="button" onClick={submit} disabled={!file || phase !== 'idle'} style={{
            flex: 2, height: 44, borderRadius: 10, border: 'none',
            cursor: (file && phase === 'idle') ? 'pointer' : 'not-allowed',
            background: (file && phase === 'idle') ? WA_GOLD_DK : '#C9BFA8', color: '#fff',
            fontFamily: `'Manrope', ${WA_T.sans}`, fontSize: 11.5, fontWeight: 700,
            letterSpacing: 0.6, textTransform: 'uppercase',
            boxShadow: (file && phase === 'idle') ? '0 4px 12px rgba(115,92,0,0.22)' : 'none',
          }}>Submit &amp; Continue</button>
        </div>

        <style>{`
          @keyframes wa-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes wa-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}

Object.assign(window, {
  SegmentedToggle,
  RateStrip,
  BreakdownRow,
  ErrorMsg,
  SuccessBanner,
  fmtINR,
  usePanGate,
  PanGateModal,
  PAN_THRESHOLD,
});
