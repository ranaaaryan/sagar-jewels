import React from 'react';
// Profile page — matches Figma: segmented pill tabs (Account Details / Recent Orders),
// and when Recent Orders is active: ALL / ON THE WAY / DELIVERED filter + order cards.
const TP = window.JEWEL_TOKENS;

const P_INK       = 'rgb(48,51,51)';
const P_INK_SOFT  = 'rgb(93,96,95)';
const P_INK_MUTED = 'rgb(120,123,122)';
const P_ACCENT    = 'rgb(122,88,67)';
const P_ACCENT_LT = 'rgb(175,130,109)';
const P_BG        = 'rgb(247,246,242)';
const P_SOFT      = 'rgb(244,244,242)';
const P_LINE      = 'rgb(237,238,237)';
const P_CHIP_BG   = 'rgb(231,232,231)';

function ProfilePage({ go, state, setState }) {
  const [tab, setTab] = React.useState('details');
  const user = state.user;

  return (
    <>
      <TopBar title="User Profile" onBack={() => go('home')} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40, background: P_BG }}>
        {/* Avatar + name header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 20px 0' }}>
          <Avatar initials="SS" size={92} />
          <h2 style={{
            margin: '16px 0 6px', fontFamily: TP.serif, fontWeight: 500,
            fontSize: 24, color: P_INK, lineHeight: 1.1, whiteSpace: 'nowrap',
          }}>{user.name}</h2>
          <p style={{ margin: 0, fontFamily: TP.sans, fontSize: 12.5, color: P_INK_SOFT, lineHeight: 1.3 }}>
            Member since {user.memberSince}
          </p>
        </div>

        {/* Figma-style segmented pill */}
        <div style={{ padding: '22px 25px 18px' }}>
          <div style={{
            height: 41, borderRadius: 999, background: P_SOFT,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex', padding: 4, gap: 0,
          }}>
            <SegBtn active={tab === 'details'} onClick={() => setTab('details')}>Account Details</SegBtn>
            <SegBtn active={tab === 'orders'}  onClick={() => setTab('orders')}>Recent Orders</SegBtn>
          </div>
        </div>

        {tab === 'details' ? <DetailsPanel go={go} state={state} setState={setState}/> :
                             <OrdersPanel  go={go} state={state}/>}
      </div>
    </>
  );
}

function SegBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, height: 33, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: active ? '#fff' : 'transparent',
      boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      fontFamily: `'Noto Serif', serif`, fontWeight: active ? 700 : 400,
      fontSize: 10, letterSpacing: 1,
      color: active ? P_ACCENT : P_INK_SOFT,
      textTransform: 'uppercase',
    }}>{children}</button>
  );
}

// ── Account Details tab ───────────────────────────────
function DetailsPanel({ go, state, setState }) {
  const user = state.user;
  const isKycVerified = user.kyc?.status === 'verified';
  return (
    <div style={{ padding: '0 18px' }}>
      <Card>
        <SectionTitle action={<button onClick={() => setState(s => ({...s, editing: true}))}
          style={{ background: 'none', border: 'none', color: P_INK_SOFT, cursor: 'pointer' }}>
          <Icon.Edit width={18} height={18}/></button>}>
          Personal Details
        </SectionTitle>
        <DetailRow label="FULL NAME" value={user.name} />
        <DetailRow label="EMAIL ADDRESS" value={user.email} />
        <DetailRow label="PHONE NUMBER" value={user.phone} last />

        <div style={{ height: 10 }} />

        <IconRow Icon={Icon.Pin}   label="Saved Addresses" onClick={() => go('addresses')} />
        <IconRow Icon={Icon.Heart} label="Wishlist"        onClick={() => go('wishlist')} />
        <IconRow Icon={Icon.Tag}   label="Coupons"         onClick={() => go('coupons')} />
      </Card>

      {isKycVerified && (
        <div style={{ marginTop: 16 }}>
          <Card>
            <SectionTitle
              action={
                <span style={{
                  fontFamily: TP.sans, fontSize: 10, color: '#4C6944', fontWeight: 700, letterSpacing: 0.6,
                  padding: '3px 8px', borderRadius: 999,
                  background: 'rgba(76,105,68,0.10)', border: '1px solid rgba(76,105,68,0.24)',
                  whiteSpace: 'nowrap',
                }}>VERIFIED · {user.kyc.verifiedOn}</span>
              }>
              KYC Details
            </SectionTitle>
            <DetailRow label="PAN NUMBER"     value={user.kyc.pan} />
            <DetailRow label="AADHAAR NUMBER" value={maskAadhaar(user.kyc.aadhaar)} />
            <DetailRow label="DATE OF BIRTH"  value={user.kyc.dob} last />
          </Card>
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '24px 0 10px' }}>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: TP.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4,
          color: P_ACCENT,
        }}>LOGOUT</button>
      </div>
    </div>
  );
}

// Mask the middle 8 digits of an Aadhaar number, keep the last group visible.
function maskAadhaar(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\s/g, '');
  if (digits.length < 4) return raw;
  const last = digits.slice(-4);
  return `XXXX XXXX ${last}`;
}


// ── Recent Orders tab ─────────────────────────────────
function OrdersPanel({ go, state }) {
  const [filter, setFilter] = React.useState('all');
  const orders = state.orders.filter(o =>
    filter === 'all' ? true :
    filter === 'shipped' ? o.status === 'shipped' :
    filter === 'delivered' ? o.status === 'delivered' : true
  );

  return (
    <div>
      {/* ALL / ON THE WAY / DELIVERED row */}
      <div style={{
        display: 'flex', gap: 32,
        padding: '4px 16px 16px',
        borderBottom: `1px solid ${P_LINE}`,
        margin: '0 16px',
      }}>
        <FilterBtn active={filter === 'all'}       onClick={() => setFilter('all')}      boxed>ALL</FilterBtn>
        <FilterBtn active={filter === 'shipped'}   onClick={() => setFilter('shipped')}>ON THE WAY</FilterBtn>
        <FilterBtn active={filter === 'delivered'} onClick={() => setFilter('delivered')}>DELIVERED</FilterBtn>
      </div>

      <div style={{
        padding: '24px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        {orders.map(o => <FigmaOrderCard key={o.id} o={o} go={go}/>)}
        {orders.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 40, color: P_INK_SOFT,
            fontFamily: TP.sans, fontSize: 14,
          }}>
            No orders in this view yet.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, boxed, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: boxed && active ? '5px 10px' : '5px 0',
      ...(boxed && active ? { border: `1px solid ${P_ACCENT}` } : {}),
      fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, letterSpacing: 0.72,
      color: active ? P_ACCENT : P_INK_SOFT,
      opacity: active ? 1 : 0.6,
    }}>{children}</button>
  );
}

// ── Figma order card ──────────────────────────────────
function FigmaOrderCard({ o, go }) {
  const stepIdx = ({
    placed: 0, packed: 1, shipped: 2, delivery: 3, delivered: 3, cancelled: -1,
  })[o.status] ?? 0;
  const isDelivered = o.status === 'delivered';
  const statusLabel = {
    placed:    'ORDER PLACED',
    shipped:   'ON THE WAY',
    delivered: 'DELIVERED',
    cancelled: 'CANCELLED',
  }[o.status] || 'ORDER PLACED';
  const item = o.items[0];

  return (
    <article style={{
      background: '#fff', borderRadius: 20,
      padding: 24,
      boxShadow: '0 12px 32px rgba(48,51,51,0.04)',
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, letterSpacing: 0.6,
            color: P_INK_SOFT, lineHeight: '16px',
          }}>ORDER #{o.id}</span>
          <span style={{
            fontFamily: 'Manrope', fontSize: 10, color: P_INK_MUTED, lineHeight: '15px',
          }}>Placed on {o.date}</span>
        </div>
        <div style={{
          background: P_CHIP_BG, borderRadius: 999,
          padding: '4px 12px',
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 10, letterSpacing: 0.5,
          color: P_INK_SOFT, whiteSpace: 'nowrap',
        }}>{statusLabel}</div>
      </div>

      {/* Product */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{
          width: 82, height: 82, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
          background: `url(${imgFor(item)}) center / cover no-repeat, rgb(217,217,217)`,
        }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{
            fontFamily: `'Noto Serif', serif`, fontSize: 18, lineHeight: '29px',
            color: P_INK,
          }}>{titleCase(item.name)}</div>
          <div style={{
            fontFamily: 'Manrope', fontWeight: 500, fontSize: 14,
            color: P_ACCENT, lineHeight: '21px',
          }}>₹{o.total.toLocaleString('en-IN')}</div>
          {o.items.length > 1 && (
            <div style={{ fontFamily: 'Manrope', fontSize: 11, color: P_INK_MUTED }}>
              + {o.items.length - 1} more item{o.items.length > 2 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Progress Tracker (only for non-cancelled) */}
      {o.status !== 'cancelled' && (
        <ProgressTracker activeIdx={stepIdx} isDelivered={isDelivered}/>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        {o.status === 'shipped' && (
          <OrderBtn variant="outline" onClick={() => go('track', { orderId: o.id })}>TRACK ORDER</OrderBtn>
        )}
        {o.status === 'delivered' && (
          <OrderBtn variant="primary">WRITE A REVIEW</OrderBtn>
        )}
        {o.status === 'cancelled' && (
          <OrderBtn variant="outline">REORDER</OrderBtn>
        )}
        <OrderBtn variant="outline" inkDark>VIEW DETAILS</OrderBtn>
      </div>
    </article>
  );
}

function OrderBtn({ children, onClick, variant = 'outline', inkDark }) {
  const styles = {
    outline: {
      background: '#fff',
      border: '1px solid rgba(176,178,177,0.3)',
      color: inkDark ? P_INK : P_ACCENT,
    },
    primary: {
      background: P_ACCENT_LT,
      border: 'none',
      color: '#fff',
    },
  }[variant];
  return (
    <button onClick={onClick} style={{
      flex: 1, height: 44, borderRadius: 999, cursor: 'pointer',
      fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, letterSpacing: 0.62,
      ...styles,
    }}>{children}</button>
  );
}

function ProgressTracker({ activeIdx, isDelivered }) {
  const steps = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERY'];
  // Fill line goes from start to the active dot (or to end if delivered)
  const filledPct = isDelivered ? 100 : (activeIdx / (steps.length - 1)) * 100;

  return (
    <div style={{ padding: '8px 10px 0', position: 'relative' }}>
      {/* line backdrop */}
      <div style={{
        position: 'absolute', left: 30, right: 30, top: 18,
        height: 2, background: P_LINE, borderRadius: 2,
      }}/>
      {/* filled line */}
      <div style={{
        position: 'absolute', left: 30, top: 18,
        width: `calc((100% - 60px) * ${filledPct / 100})`,
        height: 2, background: P_ACCENT_LT, borderRadius: 2,
      }}/>
      {/* dots + labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {steps.map((s, i) => {
          const on = i <= activeIdx;
          const current = i === activeIdx && !isDelivered;
          return (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 46 }}>
              <div style={{
                width: 21, height: 21, borderRadius: '50%', position: 'relative',
                background: on ? P_ACCENT_LT : P_LINE,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: current
                  ? `0 0 0 4px #fff, 0 0 0 5px ${P_ACCENT_LT}`
                  : 'none',
              }}>
                {on && (
                  <svg width="9" height="7" viewBox="0 0 8.4 6.2" fill="#fff">
                    <path d="M2.85 6.012L0 3.162l.712-.712 2.138 2.138L7.438 0l.712.712z"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 9, letterSpacing: 0.46,
                color: on ? P_ACCENT : P_INK_SOFT,
                opacity: on ? 1 : 0.6,
              }}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Photo picker — mirrors cart's category→photo mapping
function imgFor(item) {
  if (item.img) return item.img;
  const cat = (item.cat || '').toLowerCase();
  if (cat.includes('earring'))  return 'assets/product/comp-studs.jpg';
  if (cat.includes('necklace')) return 'assets/product/comp-necklace.jpg';
  if (cat.includes('bracelet')) return 'assets/product/comp-bracelet.jpg';
  if (cat.includes('pendant'))  return 'assets/home/cat-pendants.jpg';
  if (cat.includes('anklet'))   return 'assets/home/cat-anklets.jpg';
  if (cat.includes('ring'))     return 'assets/products/emerald-ring.jpg';
  return 'assets/products/ring.jpg';
}

function titleCase(s) {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1));
}

function DetailRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${TP.line}`,
    }}>
      <span style={{ fontFamily: TP.sans, fontSize: 10, color: TP.inkMuted, letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontFamily: TP.sans, fontSize: 14, color: TP.ink, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

window.ProfilePage = ProfilePage;
