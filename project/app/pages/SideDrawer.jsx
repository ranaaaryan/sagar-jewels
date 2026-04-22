// Side Navigation Drawer — slides in from the left
// Luxury-editorial aesthetic: cream field, serif typography, generous whitespace,
// hairline dividers, muted brown accent.

const DR = window.JEWEL_TOKENS;
const DR_ACCENT     = 'rgb(172,129,108)';
const DR_ACCENT_DK  = 'rgb(122,88,67)';
const DR_INK        = '#2F3430';
const DR_INK_SOFT   = '#6B5C54';
const DR_LINE       = 'rgba(47,52,48,0.08)';
const DR_FIELD      = '#F7F6F2';

function SideDrawer({ open, onClose, go, user }) {
  if (!open) return null;

  const items = [
    { label: 'Store Locator',               key: 'store',     icon: IconPin, route: 'store' },
    { label: 'My Order',                    key: 'orders',    icon: IconBag, route: 'orders' },
    { label: 'Gold Schemes',                key: 'schemes',   icon: IconCoins, route: 'schemes' },
    { label: 'Book My Gold',                key: 'book',      icon: IconCalendar, route: 'book' },
    { label: 'Jewellery Rate Calculator',   key: 'calc',      icon: IconCalc, route: 'calc' },
    { label: 'Refer a friend',              key: 'refer',     icon: IconShare, route: 'refer' },
  ];
  const policyItems = [
    { label: 'Privacy Policy', key: 'privacy', icon: IconShield },
    { label: 'Refund Policy',  key: 'refund',  icon: IconRefund },
    { label: 'Rate Us',        key: 'rate',    icon: IconStar },
  ];

  function pick(it) {
    if (it.route) go(it.route);
    onClose();
  }

  return (
    <>
      {/* scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(47,52,48,0.38)',
        zIndex: 60, animation: 'dr-fade 220ms ease',
      }}/>

      {/* panel */}
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '84%', maxWidth: 340,
        background: DR_FIELD, zIndex: 70,
        display: 'flex', flexDirection: 'column',
        boxShadow: '8px 0 40px rgba(47,52,48,0.2)',
        animation: 'dr-slide 300ms cubic-bezier(.2,.8,.2,1)',
        overflow: 'hidden',
      }}>
        {/* ── Header ───────────────────────────────── */}
        <div style={{
          padding: '54px 28px 28px',
          background: '#fff',
          borderBottom: `1px solid ${DR_LINE}`,
          position: 'relative',
        }}>
          {/* Close */}
          <button onClick={onClose} aria-label="Close" style={{
            position: 'absolute', top: 16, right: 16,
            width: 34, height: 34, borderRadius: '50%',
            border: 'none', background: DR_FIELD, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={DR_INK} strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 62, height: 62, borderRadius: '50%',
              backgroundImage: `url(${user.photo})`, backgroundSize: 'cover', backgroundPosition: 'center',
              border: `2px solid ${DR_ACCENT}`,
              boxShadow: '0 2px 10px rgba(122,88,67,0.2)',
              flexShrink: 0,
            }}/>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: `'Noto Serif', ${DR.serif}`, fontSize: 22, color: DR_INK,
                fontWeight: 500, lineHeight: 1.15,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user.name}</div>
              <div style={{
                fontFamily: `'Manrope', ${DR.sans}`, fontSize: 11.5, color: DR_INK_SOFT,
                marginTop: 3,
              }}>{user.email}</div>
            </div>
          </div>

          {/* View profile link */}
          <button onClick={() => { go('profile'); onClose(); }} style={{
            marginTop: 18, background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: `'Manrope', ${DR.sans}`, fontSize: 11, letterSpacing: 1.6,
            color: DR_ACCENT_DK, fontWeight: 700,
          }}>
            VIEW PROFILE
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18"/>
            </svg>
          </button>
        </div>

        {/* ── Navigation list ──────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0 24px' }}>
          {items.map((it, i) => (
            <DrawerRow key={it.key} item={it} onClick={() => pick(it)}/>
          ))}

          {/* Hairline section break */}
          <div style={{
            margin: '18px 28px',
            borderTop: `1px solid ${DR_LINE}`,
            position: 'relative', height: 0,
          }}>
            <span style={{
              position: 'absolute', top: -8, left: 0, background: DR_FIELD, paddingRight: 10,
              fontFamily: `'Manrope', ${DR.sans}`, fontSize: 9.5, letterSpacing: 2.2,
              color: DR_ACCENT_DK, fontWeight: 700,
            }}>THE FINE PRINT</span>
          </div>

          {policyItems.map(it => (
            <DrawerRow key={it.key} item={it} onClick={() => pick(it)} muted/>
          ))}
        </div>

        {/* ── Footer removed ─────────────────────────── */}
      </div>

      <style>{`
        @keyframes dr-slide { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes dr-fade  { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
}

function DrawerRow({ item, onClick, muted }) {
  const IconC = item.icon;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 16, width: '100%',
      padding: muted ? '12px 28px' : '14px 28px',
      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
    }}>
      {IconC ? (
        <div style={{
          width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: muted ? DR_INK_SOFT : DR_ACCENT_DK, flexShrink: 0,
        }}>
          <IconC/>
        </div>
      ) : (
        <div style={{ width: 22, flexShrink: 0 }}/>
      )}
      <span style={{
        flex: 1, minWidth: 0,
        fontFamily: muted ? `'Manrope', ${DR.sans}` : `'Noto Serif', ${DR.serif}`,
        fontSize: muted ? 13 : 15.5,
        fontWeight: muted ? 400 : 500,
        color: muted ? DR_INK_SOFT : DR_INK,
        letterSpacing: 0.2,
      }}>{item.label}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
        stroke={muted ? 'rgba(107,92,84,0.5)' : DR_INK_SOFT}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 6 15 12 9 18"/>
      </svg>
    </button>
  );
}

/* ── tiny line-icons to match the aesthetic ─────────────────────────── */
function SVGWrap({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );
}
const IconPin = () => (
  <SVGWrap>
    <path d="M12 22s-7-8-7-13a7 7 0 1 1 14 0c0 5-7 13-7 13Z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </SVGWrap>
);
const IconBag = () => (
  <SVGWrap>
    <path d="M5 8h14l-1.2 12.2a2 2 0 0 1-2 1.8h-7.6a2 2 0 0 1-2-1.8Z"/>
    <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
  </SVGWrap>
);
const IconCoins = () => (
  <SVGWrap>
    <ellipse cx="9" cy="8" rx="6" ry="2.5"/>
    <path d="M3 8v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V8"/>
    <ellipse cx="15" cy="16" rx="6" ry="2.5"/>
    <path d="M9 16v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4"/>
  </SVGWrap>
);
const IconCalendar = () => (
  <SVGWrap>
    <rect x="3.5" y="5" width="17" height="15" rx="2"/>
    <path d="M3.5 10h17M8 3v4M16 3v4"/>
  </SVGWrap>
);
const IconCalc = () => (
  <SVGWrap>
    <rect x="4" y="3" width="16" height="18" rx="2"/>
    <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>
  </SVGWrap>
);
const IconShare = () => (
  <SVGWrap>
    <circle cx="18" cy="5" r="2.5"/>
    <circle cx="6" cy="12" r="2.5"/>
    <circle cx="18" cy="19" r="2.5"/>
    <path d="M8.3 11l7.4-4.3M8.3 13l7.4 4.3"/>
  </SVGWrap>
);
const IconStar = () => (
  <SVGWrap>
    <path d="M12 3.5l2.6 5.4 6 .9-4.3 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.4 9.8l6-.9Z"/>
  </SVGWrap>
);
const IconShield = () => (
  <SVGWrap>
    <path d="M12 3l7.5 3v6c0 4.5-3.2 8.3-7.5 9.5C7.7 20.3 4.5 16.5 4.5 12V6L12 3Z"/>
    <path d="M9.5 12.2l2 2 3.2-3.5"/>
  </SVGWrap>
);
const IconRefund = () => (
  <SVGWrap>
    <path d="M4 12a8 8 0 1 0 2.3-5.6"/>
    <polyline points="3.5 3.5 3.5 8 8 8"/>
    <path d="M12 8v4l2.5 1.5"/>
  </SVGWrap>
);

window.SideDrawer = SideDrawer;
