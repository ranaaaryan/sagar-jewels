import React from 'react';
// Notifications page — warm jewellery aesthetic matching Profile / Orders / Checkout.
// Top bar (back + title + mark-all-read), filter chips (All / Orders / Offers / Account),
// grouped sections (Today / Earlier this week / Older) of rich notification cards with
// category icon, title, timestamp, blurb, and contextual CTA. Unread cards get a
// subtle cream tint + small brown dot.
const NT = window.JEWEL_TOKENS;

const N_BG        = 'rgb(247,246,242)';
const N_CARD      = '#fff';
const N_UNREAD    = 'rgb(239,232,227)';
const N_INK       = 'rgb(48,51,51)';
const N_INK_SOFT  = 'rgb(93,96,95)';
const N_INK_MUTED = 'rgb(120,123,122)';
const N_ACCENT    = 'rgb(122,88,67)';
const N_ACCENT_LT = 'rgb(175,130,109)';
const N_CREAM     = 'rgb(244,244,242)';
const N_LINE      = 'rgb(237,238,237)';
const N_SUCCESS   = 'rgb(94,122,85)';
const N_GOLD      = 'rgb(176,133,53)';

const SEED_NOTIFS = [
  { id: 'n1', kind: 'order',   status: 'shipped',   title: 'Your order is on the way',
    body: 'Lumière solitaire ring — Order #AUR-2814 shipped via Blue Dart. Expected 22 Apr.',
    time: 'Just now', bucket: 'today', unread: true, cta: 'Track Order', action: 'track' },
  { id: 'n2', kind: 'offer',   title: '₹500 off for you',
    body: 'Thanks for being a Sagar Gold member. Use code SAGAR500 on orders above ₹15,000.',
    time: '2h ago', bucket: 'today', unread: true, cta: 'Apply Now', action: 'coupons' },
  { id: 'n3', kind: 'price',   title: 'Gold rate dropped ₹120/gm',
    body: '22K gold is now ₹7,240/gm — a good moment to lock your 10+1 instalment.',
    time: '5h ago', bucket: 'today', unread: true, cta: 'Book My Gold', action: 'book' },
  { id: 'n4', kind: 'wishlist', title: 'Back in stock: Opaline huggies',
    body: '14k yellow gold · opaline drops. Only 3 pairs made per batch.',
    time: 'Yesterday', bucket: 'week', unread: false, cta: 'View Wishlist', action: 'wishlist' },
  { id: 'n5', kind: 'order',   status: 'delivered', title: 'Delivered — rate your pieces',
    body: 'Opaline drop earrings & Monogram signet pendant arrived on 11 Apr.',
    time: '3d ago', bucket: 'week', unread: false, cta: 'Write a Review', action: 'profile' },
  { id: 'n6', kind: 'loyalty', title: 'March instalment received',
    body: '₹8,000 credited to your 10+1 Plan. 6 of 10 paid — 4 to go.',
    time: '5d ago', bucket: 'week', unread: false, cta: 'View Plan', action: 'loyalty' },
  { id: 'n7', kind: 'account', title: 'New device signed in',
    body: 'iPhone 15 · Bengaluru. If this wasn\'t you, secure your account now.',
    time: '2 weeks ago', bucket: 'older', unread: false },
  { id: 'n8', kind: 'offer',   title: 'Akshaya Tritiya preview opens Friday',
    body: 'Early access to the bridal vine collection for Sagar Gold members.',
    time: '3 weeks ago', bucket: 'older', unread: false, cta: 'Explore', action: 'listing' },
];

function NotificationsPage({ go, state, setState }) {
  const [filter, setFilter] = React.useState('all');
  const [notifs, setNotifs] = React.useState(() => state.notifs || SEED_NOTIFS);

  React.useEffect(() => { setState(s => ({ ...s, notifs })); }, [notifs]);

  const filtered = notifs.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'orders')  return n.kind === 'order';
    if (filter === 'offers')  return n.kind === 'offer' || n.kind === 'price';
    if (filter === 'account') return n.kind === 'account' || n.kind === 'loyalty' || n.kind === 'wishlist';
    return true;
  });

  const groups = [
    { key: 'today',  label: 'Today' },
    { key: 'week',   label: 'Earlier this week' },
    { key: 'older',  label: 'Older' },
  ].map(g => ({ ...g, items: filtered.filter(n => n.bucket === g.key) })).filter(g => g.items.length);

  const unreadCount = notifs.filter(n => n.unread).length;

  function markAllRead() { setNotifs(ns => ns.map(n => ({ ...n, unread: false }))); }
  function openNotif(n) {
    setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x));
    if (n.action) go(n.action);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: N_BG, minHeight: 0 }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 15px 10px',
      }}>
        <button onClick={() => go('home')} aria-label="Back" style={sqBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', serif`, fontSize: 20, color: '#000', letterSpacing: 0.2,
        }}>Notifications</div>
        <button onClick={markAllRead} disabled={!unreadCount} style={{
          background: 'none', border: 'none', cursor: unreadCount ? 'pointer' : 'default',
          fontFamily: 'Manrope', fontWeight: 500, fontSize: 12, letterSpacing: 1.2,
          color: unreadCount ? N_ACCENT : 'rgba(122,88,67,0.35)',
          padding: '6px 8px',
        }}>MARK ALL READ</button>
      </div>

      {/* Summary strip */}
      <div style={{
        margin: '0 15px 4px', padding: '14px 18px',
        background: N_CREAM, borderRadius: 16,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: N_ACCENT,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/>
            <path d="M10 20a2 2 0 0 0 4 0"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 16, color: N_INK, lineHeight: 1.2,
          }}>
            {unreadCount ? `${unreadCount} new update${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up'}
          </div>
          <div style={{
            fontFamily: 'Manrope', fontSize: 11.5, color: N_INK_SOFT, marginTop: 2, lineHeight: 1.4,
          }}>
            {unreadCount
              ? 'Orders, offers and gold rate alerts since your last visit.'
              : 'We\'ll ping you the moment something changes.'}
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '14px 15px 4px',
        overflowX: 'auto',
      }}>
        {[
          { key: 'all',     label: 'All' },
          { key: 'orders',  label: 'Orders' },
          { key: 'offers',  label: 'Offers & Rates' },
          { key: 'account', label: 'Account' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
            background: filter === f.key ? N_ACCENT : '#fff',
            border: filter === f.key ? 'none' : `1px solid ${N_LINE}`,
            color: filter === f.key ? '#fff' : N_INK_SOFT,
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 11.5, letterSpacing: 0.5,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{f.label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 15px 24px' }}>
        {groups.length === 0 && (
          <div style={{
            padding: '60px 20px', textAlign: 'center',
            fontFamily: 'Manrope', fontSize: 13, color: N_INK_MUTED, lineHeight: 1.6,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 36, background: N_CREAM,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: N_ACCENT_LT, marginBottom: 14,
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/>
                <path d="M10 20a2 2 0 0 0 4 0"/>
              </svg>
            </div>
            <div style={{ fontFamily: `'Noto Serif', serif`, fontSize: 17, color: N_INK, marginBottom: 4 }}>
              Nothing here yet
            </div>
            Try a different filter, or come back after your next order.
          </div>
        )}

        {groups.map(g => (
          <div key={g.key} style={{ marginBottom: 18 }}>
            <div style={{
              padding: '10px 4px 10px',
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 10, letterSpacing: 1.4,
              color: N_INK_MUTED, textTransform: 'uppercase',
            }}>{g.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map(n => <NotifCard key={n.id} n={n} onOpen={() => openNotif(n)}/>)}
            </div>
          </div>
        ))}

        <div style={{
          padding: '18px 20px 8px', textAlign: 'center',
          fontFamily: 'Manrope', fontSize: 10.5, color: N_INK_MUTED, lineHeight: 1.6,
        }}>
          Manage preferences in <u>Settings → Notifications</u>
        </div>
      </div>
    </div>
  );
}

function NotifCard({ n, onOpen }) {
  const config = ({
    order: {
      bg: '#F3EDE4', fg: N_ACCENT,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7h13l3 4v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V7z"/>
          <path d="M16 11h4"/>
        </svg>
      ),
    },
    offer: {
      bg: '#F4E9DC', fg: N_GOLD,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12l-8 8-9-9V3h8l9 9z"/>
          <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/>
        </svg>
      ),
    },
    price: {
      bg: '#EDEEE6', fg: N_SUCCESS,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-6 4 4 8-8"/>
          <path d="M14 7h7v7"/>
        </svg>
      ),
    },
    wishlist: {
      bg: '#F3E4E0', fg: 'rgb(173,104,90)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.4 5.6a5.5 5.5 0 0 0-8.4.7 5.5 5.5 0 0 0-8.4-.7 5.5 5.5 0 0 0 0 7.8l8.4 8.1 8.4-8.1a5.5 5.5 0 0 0 0-7.8z"/>
        </svg>
      ),
    },
    loyalty: {
      bg: '#EEE6DA', fg: N_ACCENT,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8"/>
          <path d="M12 7v10M9 10l3-3 3 3M9 14l3 3 3-3"/>
        </svg>
      ),
    },
    account: {
      bg: '#E8E7E3', fg: N_INK_SOFT,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="16" height="10" rx="2"/>
          <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
        </svg>
      ),
    },
  })[n.kind] || { bg: N_CREAM, fg: N_ACCENT, icon: null };

  return (
    <button onClick={onOpen} style={{
      position: 'relative', width: '100%', textAlign: 'left', cursor: 'pointer',
      background: n.unread ? N_UNREAD : N_CARD,
      borderRadius: 16, padding: 16,
      border: n.unread ? 'none' : `1px solid ${N_LINE}`,
      boxShadow: n.unread
        ? '0 6px 18px rgba(119,88,66,0.08)'
        : '0 1px 3px rgba(48,51,51,0.03)',
      display: 'flex', gap: 14,
    }}>
      {/* icon tile */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: config.bg, color: config.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{config.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10,
        }}>
          <div style={{
            fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 15,
            color: N_INK, lineHeight: 1.25, letterSpacing: 0.1,
            display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
          }}>
            {n.unread && (
              <span style={{
                width: 7, height: 7, borderRadius: 4, background: N_ACCENT, flexShrink: 0,
              }}/>
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</span>
          </div>
          <div style={{
            fontFamily: 'Manrope', fontSize: 10.5, color: N_INK_MUTED, whiteSpace: 'nowrap', flexShrink: 0,
          }}>{n.time}</div>
        </div>
        <div style={{
          marginTop: 4,
          fontFamily: 'Manrope', fontSize: 12.5, color: N_INK_SOFT, lineHeight: 1.5,
        }}>{n.body}</div>

        {n.cta && (
          <div style={{
            marginTop: 12,
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, letterSpacing: 1.2,
            color: N_ACCENT, textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {n.cta}
            <svg width="10" height="10" viewBox="0 0 13 13" fill="currentColor">
              <path d="M10.1 6.9L0 6.9V5.6h10.1L5.4.9 6.3 0l6.2 6.2-6.2 6.3-.9-.9z"/>
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

const sqBtn = {
  width: 45, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
};

window.NotificationsPage = NotificationsPage;
