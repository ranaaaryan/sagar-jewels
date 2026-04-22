// Shared phone shell matching the Profile.png reference:
// - warm cream background
// - custom top bar: back button (white square), centered serif title, bell (white square)
// - bottom nav: Home, Categories, 10+1 Plan, Profile + center floating bag FAB

const T = window.JEWEL_TOKENS;
const { useState, useEffect } = React;

// ─── Top bar ────────────────────────────────────────────────
function TopBar({ title, onBack, onBell }) {
  if (!onBell) {
    const go = window.__go;
    onBell = go ? () => go('notifications') : () => {};
  }
  const sq = {
    width: 40, height: 40, borderRadius: 12, background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: T.ink, border: 'none', cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px 10px', background: T.bg, gap: 8,
    }}>
      <button style={{...sq, flexShrink: 0}} onClick={onBack} aria-label="Back"><Icon.Back width={20} height={20}/></button>
      <div style={{
        flex: 1, textAlign: 'center', minWidth: 0,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        fontFamily: T.serif, fontSize: 20, color: T.ink, letterSpacing: 0.2, fontWeight: 500,
      }}>{title}</div>
      <button style={{...sq, flexShrink: 0}} onClick={onBell} aria-label="Notifications"><Icon.Bell width={18} height={18}/></button>
    </div>
  );
}

// ─── Bottom nav (with centered FAB) ─────────────────────────
function BottomNav({ current, go }) {
  const items = [
    { key: 'home',       label: 'Home',     Icon: Icon.Home2 },
    { key: 'categories', label: 'Categories', Icon: Icon.Grid },
    { key: '__fab' },
    { key: 'loyalty',    label: '10+1 Plan', Icon: Icon.Crown },
    { key: 'profile',    label: 'Profile',  Icon: Icon.User },
  ];
  return (
    <div style={{ position: 'relative' }}>
      {/* FAB */}
      <button
        onClick={() => go('cart')}
        aria-label="Cart"
        style={{
          position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)',
          width: 62, height: 62, borderRadius: '50%',
          background: T.accent, color: '#fff', border: `4px solid ${T.bg}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: T.shadowFab,
        }}
      >
        <Icon.Bag width={24} height={24} />
      </button>

      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        background: T.bg, padding: '10px 12px 14px',
        borderTop: `1px solid ${T.lineSoft}`,
      }}>
        {items.map((it, i) => {
          if (it.key === '__fab') return <div key="fab" style={{ width: 62 }} />;
          const active = current === it.key;
          const IconC = it.Icon;
          return (
            <button key={it.key} onClick={() => go(it.key)} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '4px 0',
              color: active ? T.ink : T.inkSoft,
            }}>
              <IconC width={22} height={22} />
              <span style={{
                fontFamily: T.sans, fontSize: 11,
                fontWeight: active ? 700 : 500,
                letterSpacing: 0.2,
              }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Phone chrome (uses starter device but hides its app bar) ─
function Phone({ children }) {
  return (
    <div style={{
      width: 402, height: 820, borderRadius: 36, overflow: 'hidden',
      background: T.bg, border: '10px solid #2b2723',
      boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      fontFamily: T.sans, color: T.ink,
      position: 'relative',
    }}>
      {/* Status bar */}
      <div style={{
        height: 34, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 22px',
        fontSize: 13, fontWeight: 600, color: T.ink, position: 'relative',
      }}>
        <span>9:30</span>
        <div style={{
          position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
          width: 20, height: 20, borderRadius: 100, background: '#1d1b1a',
        }} />
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 7l2-2 2 2 3-3 2 2 3-5" stroke={T.ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill={T.ink}><path d="M7 2a7 7 0 0 1 5 2l-1 1a5 5 0 0 0-8 0L2 4a7 7 0 0 1 5-2zm0 3a4 4 0 0 1 3 1l-1 1a2.5 2.5 0 0 0-4 0L4 6a4 4 0 0 1 3-1zm0 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="1" y="1" width="18" height="8" rx="2" stroke={T.ink} strokeWidth="1"/><rect x="3" y="3" width="12" height="4" rx="0.5" fill={T.ink}/><rect x="20" y="3.5" width="1.5" height="3" rx="0.5" fill={T.ink}/></svg>
        </div>
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { TopBar, BottomNav, Phone });
