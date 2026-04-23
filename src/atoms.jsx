import React from 'react';
// Shared UI atoms
const T2 = window.JEWEL_TOKENS;

// Placeholder image — subtle diagonal striped SVG with monospace caption
function Placeholder({ label = 'product', w = '100%', h = 140, tone = 'warm', radius = 14 }) {
  const tones = {
    warm:  ['#E9DCC9', '#E2D2BC'],
    cream: ['#F2EADD', '#EBE1D1'],
    blush: ['#EED9CC', '#E6CDBA'],
    sage:  ['#D9DFCE', '#C9D1BC'],
    mist:  ['#D7D9D4', '#C5C8BF'],
  };
  const [a, b] = tones[tone] || tones.warm;
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(45deg, ${a} 0 10px, ${b} 10px 20px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 10, letterSpacing: 1, color: 'rgba(60,45,30,0.55)',
        textTransform: 'uppercase', padding: '4px 8px',
        background: 'rgba(255,255,255,0.6)', borderRadius: 4,
      }}>{label}</span>
    </div>
  );
}

// Avatar — monogram on warm dark disc (original, non-copyrighted)
function Avatar({ initials = 'SS', size = 96 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #3a2e26 0%, #1d1815 80%)',
      border: `3px solid ${T2.accentLt}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#F3E6DB', fontFamily: T2.serif, fontSize: size * 0.38,
      letterSpacing: 1,
      boxShadow: '0 4px 14px rgba(58,42,28,0.18)',
    }}>{initials}</div>
  );
}

// Segmented tab pill (matches profile: one active = white pill w/ accent text)
function Tabs({ items, value, onChange }) {
  return (
    <div style={{
      display: 'flex', padding: 4, background: T2.bgSoft,
      borderRadius: 999, gap: 4, margin: '8px 18px 18px',
    }}>
      {items.map(it => {
        const active = it.key === value;
        return (
          <button key={it.key} onClick={() => onChange(it.key)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 999, border: 'none',
              background: active ? '#fff' : 'transparent',
              color: active ? T2.accent : T2.inkSoft,
              fontFamily: T2.sans, fontSize: 11,
              fontWeight: 700, letterSpacing: 1.2,
              textTransform: 'uppercase', cursor: 'pointer',
              boxShadow: active ? '0 1px 3px rgba(58,42,28,0.06)' : 'none',
            }}>{it.label}</button>
        );
      })}
    </div>
  );
}

// Row used in profile-style list (circle icon + label + chevron)
function IconRow({ Icon: Ic, label, onClick, trailing }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 4px', width: '100%',
      background: 'none', border: 'none', cursor: 'pointer',
      borderTop: `1px solid ${T2.line}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: T2.chipBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: T2.ink,
        flexShrink: 0,
      }}><Ic width={18} height={18}/></div>
      <span style={{ flex: 1, textAlign: 'left', fontFamily: T2.sans, fontSize: 15, color: T2.ink, fontWeight: 500 }}>{label}</span>
      {trailing || <Icon.Chevron width={18} height={18} color={T2.inkMuted} style={{ color: T2.inkMuted }}/>}
    </button>
  );
}

// Card shell
function Card({ children, style }) {
  return (
    <div style={{
      background: T2.card, borderRadius: T2.radiusCard,
      boxShadow: T2.shadowCard, padding: 20, ...style,
    }}>{children}</div>
  );
}

// Section title (serif, terracotta)
function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10 }}>
      <h3 style={{
        margin: 0, fontFamily: T2.serif, fontSize: 20, fontWeight: 500, color: T2.accent,
        lineHeight: 1.15, minWidth: 0, flex: 1,
      }}>{children}</h3>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// Small pill badge
function Pill({ children, tone = 'accent' }) {
  const tones = {
    accent:  { bg: T2.accentBg, fg: T2.accentDk },
    success: { bg: '#E6EEE1',   fg: '#4C6944' },
    warn:    { bg: '#F7E8D4',   fg: '#8C5A25' },
    neutral: { bg: T2.bgSoft,   fg: T2.inkSoft },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: tones.bg, color: tones.fg,
      fontFamily: T2.sans, fontSize: 10.5, fontWeight: 700,
      letterSpacing: 0.8, textTransform: 'uppercase',
    }}>{children}</span>
  );
}

// Primary / ghost button
function Btn({ children, onClick, variant = 'primary', full, style, ...rest }) {
  const base = {
    padding: '12px 22px', borderRadius: 999, border: 'none',
    fontFamily: T2.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
    textTransform: 'uppercase', cursor: 'pointer',
    width: full ? '100%' : 'auto',
  };
  const variants = {
    primary: { background: T2.accent, color: '#fff' },
    ghost:   { background: 'transparent', color: T2.accent, border: `1.5px solid ${T2.accent}` },
    subtle:  { background: T2.accentBg, color: T2.accentDk },
    dark:    { background: T2.ink, color: '#fff' },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }} {...rest}>{children}</button>
  );
}

Object.assign(window, { Placeholder, Avatar, Tabs, IconRow, Card, SectionTitle, Pill, Btn });
