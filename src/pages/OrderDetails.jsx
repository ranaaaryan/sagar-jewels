import React from 'react';
// Order Details — deep-detail view opened from "View Details" on an order card.
// Shows: order header with status pill, items list with per-item subtotals,
// delivery address, payment summary, totals breakdown, timeline (for active
// orders), and footer actions.

const TOD = window.JEWEL_TOKENS;

function OrderDetailsPage({ go, state }) {
  const id = state.viewOrderId || state.orders[0]?.id;
  const o = state.orders.find(x => x.id === id) || state.orders[0];
  if (!o) {
    return (
      <>
        <TopBar title="Order Details" onBack={() => go('orders')} />
        <div style={{ padding: 40, textAlign: 'center', color: TOD.inkSoft, fontFamily: TOD.sans }}>
          Order not found.
        </div>
      </>
    );
  }

  const statusMap = {
    placed:    { label: 'Order Placed',    tone: 'warn',    icon: Icon.Check },
    shipped:   { label: 'On the Way',      tone: 'warn',    icon: Icon.Truck },
    delivered: { label: 'Delivered',       tone: 'success', icon: Icon.Package },
    cancelled: { label: 'Cancelled',       tone: 'neutral', icon: Icon.Close },
  };
  const st = statusMap[o.status];

  // Build item-level data — fall back to even split of total across listed items
  const itemCount = o.items.length;
  const itemPrices = o.items.map((it, i) => {
    const base = Math.round(o.total / itemCount);
    // vary slightly so it doesn't look canned
    if (i === itemCount - 1) return o.total - base * (itemCount - 1);
    return base;
  });
  const subtotal = itemPrices.reduce((a, b) => a + b, 0);
  const shipping = o.status === 'cancelled' ? 0 : 0; // free
  const gst      = Math.round(subtotal * 0.03);
  const making   = Math.round(subtotal * 0.05);
  const discount = Math.round(subtotal * 0.04);
  const grand    = subtotal + gst + making + shipping - discount;

  // Address
  const addr = state.addresses?.find(a => a.isDefault) || state.addresses?.[0];

  // Timeline
  const timeline =
    o.status === 'delivered' ? [
      { t: 'Order placed',     d: o.date,                done: true },
      { t: 'Packed & inspected', d: 'Studio · 1 day later', done: true },
      { t: 'Shipped',          d: 'Bengaluru hub',        done: true },
      { t: 'Delivered',        d: o.eta || o.date,        done: true, last: true },
    ] :
    o.status === 'shipped' ? [
      { t: 'Order placed',     d: o.date,       done: true },
      { t: 'Packed & inspected', d: 'Complete',  done: true },
      { t: 'Shipped',          d: 'Out for delivery', done: false, active: true },
      { t: 'Out for delivery', d: `Est. ${o.eta}`,    done: false },
    ] :
    o.status === 'cancelled' ? [
      { t: 'Order placed',     d: o.date,        done: true },
      { t: 'Cancelled by you', d: '3 days later', done: true, last: true, error: true },
    ] : [
      { t: 'Order placed',     d: o.date, done: true },
    ];

  return (
    <>
      <TopBar title="Order Details" onBack={() => go('orders')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 30px' }}>

        {/* ── Header summary ── */}
        <div style={{
          background: TOD.card, borderRadius: 18, padding: 18,
          boxShadow: TOD.shadowCard, marginTop: 8,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily: TOD.sans, fontSize: 10, color: TOD.inkMuted,
                letterSpacing: 1.4, fontWeight: 700,
              }}>ORDER ID</div>
              <div style={{
                fontFamily: TOD.sans, fontSize: 16, color: TOD.ink,
                marginTop: 2, fontWeight: 700, letterSpacing: 0.2,
              }}>{o.id}</div>
              <div style={{ fontFamily: TOD.sans, fontSize: 12, color: TOD.inkSoft, marginTop: 4 }}>
                Placed on {o.date}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Pill tone={st.tone}><st.icon width={12} height={12}/> {st.label}</Pill>
            </div>
          </div>

          {o.status === 'shipped' && o.eta && (
            <div style={{
              marginTop: 4, padding: '10px 12px',
              background: TOD.accentBg, borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon.Truck width={16} height={16} style={{ color: '#AF826D' }}/>
              <div style={{ fontFamily: TOD.sans, fontSize: 12.5, color: TOD.ink }}>
                Arriving by <b>{o.eta}</b> · In transit to Bengaluru hub
              </div>
            </div>
          )}
          {o.status === 'delivered' && (
            <div style={{
              marginTop: 4, padding: '10px 12px',
              background: '#E6EEE1', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon.Check width={14} height={14} style={{ color: '#4C6944' }}/>
              <div style={{ fontFamily: TOD.sans, fontSize: 12.5, color: TOD.ink }}>
                Delivered · {o.eta || o.date}
              </div>
            </div>
          )}
          {o.status === 'cancelled' && (
            <div style={{
              marginTop: 4, padding: '10px 12px',
              background: '#F7EAE8', borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Icon.Close width={12} height={12} style={{ color: '#A4443B' }}/>
              <div style={{ fontFamily: TOD.sans, fontSize: 12.5, color: TOD.ink }}>
                Cancelled · refund credited to source
              </div>
            </div>
          )}
        </div>

        {/* ── Items ── */}
        <OD_SectionTitle>Items ({itemCount})</OD_SectionTitle>
        <div style={{ background: TOD.card, borderRadius: 18, boxShadow: TOD.shadowCard, overflow: 'hidden' }}>
          {o.items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '14px 16px',
              borderTop: i === 0 ? 'none' : `1px solid ${TOD.line}`,
            }}>
              <Placeholder label={it.cat} w={64} h={64} tone={it.tone} radius={10}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: TOD.serif, fontSize: 16, color: TOD.ink, lineHeight: 1.2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{it.name}</div>
                <div style={{
                  fontFamily: TOD.sans, fontSize: 11.5, color: TOD.inkSoft,
                  marginTop: 4, textTransform: 'capitalize',
                }}>{it.cat} · Qty 1</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <div style={{ fontFamily: TOD.sans, fontSize: 13.5, color: TOD.ink, fontWeight: 700 }}>
                    ₹{itemPrices[i].toLocaleString('en-IN')}
                  </div>
                  <button onClick={() => go('product')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: TOD.sans, fontSize: 11, color: '#AF826D', fontWeight: 700,
                    letterSpacing: 0.8, textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>View <Icon.Chevron width={10} height={10}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Delivery address ── */}
        <OD_SectionTitle
          action={<button onClick={() => go('track')} style={odLink}>TRACK</button>}
        >Shipping to</OD_SectionTitle>
        {addr ? (
          <div style={{
            background: TOD.card, borderRadius: 18, padding: 16, boxShadow: TOD.shadowCard,
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: TOD.accentBg, color: '#AF826D',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TOD.sans, fontSize: 13, color: TOD.ink, fontWeight: 700 }}>
                {addr.name} <span style={{
                  marginLeft: 6, fontSize: 10, color: '#AF826D',
                  background: TOD.accentBg, padding: '2px 6px', borderRadius: 4,
                  fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                }}>{addr.tag}</span>
              </div>
              <div style={{ fontFamily: TOD.sans, fontSize: 12.5, color: TOD.inkSoft, marginTop: 4, lineHeight: 1.5 }}>
                {addr.line1}<br/>{addr.line2}<br/>{addr.city} — {addr.pincode}
              </div>
              <div style={{ fontFamily: TOD.sans, fontSize: 12, color: TOD.inkSoft, marginTop: 4 }}>{addr.phone}</div>
            </div>
          </div>
        ) : null}

        {/* ── Payment ── */}
        <OD_SectionTitle>Payment</OD_SectionTitle>
        <div style={{
          background: TOD.card, borderRadius: 18, padding: 16, boxShadow: TOD.shadowCard,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 46, height: 32, borderRadius: 5, background: '#2F3430',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 10, letterSpacing: 1, color: '#fff',
            }}>VISA</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOD.sans, fontSize: 13.5, color: TOD.ink, fontWeight: 700 }}>
              Card ending ·· 4021
            </div>
            <div style={{ fontFamily: TOD.sans, fontSize: 11.5, color: TOD.inkSoft, marginTop: 2 }}>
              Charged ₹{grand.toLocaleString('en-IN')} · {o.date}
            </div>
          </div>
          <Pill tone="success"><Icon.Check width={10} height={10}/> Paid</Pill>
        </div>

        {/* ── Bill summary ── */}
        <OD_SectionTitle>Bill summary</OD_SectionTitle>
        <div style={{
          background: TOD.card, borderRadius: 18, padding: '16px 18px',
          boxShadow: TOD.shadowCard,
        }}>
          <OD_Row label={`Item subtotal (${itemCount})`} value={`₹${subtotal.toLocaleString('en-IN')}`}/>
          <OD_Row label="Making charges"                 value={`₹${making.toLocaleString('en-IN')}`}/>
          <OD_Row label="GST (3%)"                       value={`₹${gst.toLocaleString('en-IN')}`}/>
          <OD_Row label="Delivery"                       value={shipping === 0 ? 'Free' : `₹${shipping}`} valueStyle={shipping === 0 ? { color: '#4C6944', fontWeight: 700 } : undefined}/>
          <OD_Row label="Discount (SAGAR10)"             value={`− ₹${discount.toLocaleString('en-IN')}`} valueStyle={{ color: '#4C6944', fontWeight: 700 }}/>
          <div style={{ height: 1, background: TOD.line, margin: '12px 0' }}/>
          <OD_Row
            label="Total paid" value={`₹${grand.toLocaleString('en-IN')}`}
            labelStyle={{ fontWeight: 700, fontSize: 14, color: TOD.ink }}
            valueStyle={{ fontWeight: 800, fontSize: 15, color: TOD.ink }}
          />
        </div>

        {/* ── Timeline ── */}
        <OD_SectionTitle>Order journey</OD_SectionTitle>
        <div style={{
          background: TOD.card, borderRadius: 18, padding: '16px 18px',
          boxShadow: TOD.shadowCard,
        }}>
          {timeline.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flexShrink: 0, paddingTop: 4,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: s.error ? '#A4443B' : (s.done ? '#AF826D' : (s.active ? TOD.accentBg : TOD.bgSoft)),
                  border: `2px solid ${s.error ? '#A4443B' : (s.done || s.active ? '#AF826D' : TOD.line)}`,
                  boxShadow: s.active ? `0 0 0 4px ${TOD.accentBg}` : 'none',
                }}/>
                {i < timeline.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 30,
                    background: timeline[i + 1].done ? '#AF826D' : TOD.line,
                    marginTop: 2,
                  }}/>
                )}
              </div>
              <div style={{ paddingBottom: 18, flex: 1 }}>
                <div style={{
                  fontFamily: TOD.sans, fontSize: 13.5,
                  color: s.done || s.active ? TOD.ink : TOD.inkMuted,
                  fontWeight: s.done || s.active ? 700 : 500,
                }}>{s.t}</div>
                <div style={{ fontFamily: TOD.sans, fontSize: 11.5, color: TOD.inkSoft, marginTop: 3 }}>
                  {s.d}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer actions ── */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {o.status === 'delivered' && (
            <>
              <Btn variant="ghost" style={{ flex: 1, padding: '12px 14px', fontSize: 11 }}>Download invoice</Btn>
              <Btn variant="primary" style={{ flex: 1, padding: '12px 14px', fontSize: 11 }}>Rate & Review</Btn>
            </>
          )}
          {o.status === 'shipped' && (
            <>
              <Btn variant="ghost" style={{ flex: 1, padding: '12px 14px', fontSize: 11 }}>Need help?</Btn>
              <Btn variant="primary" style={{ flex: 1, padding: '12px 14px', fontSize: 11 }} onClick={() => go('track')}>Track order</Btn>
            </>
          )}
          {o.status === 'cancelled' && (
            <>
              <Btn variant="ghost" style={{ flex: 1, padding: '12px 14px', fontSize: 11 }}>Refund details</Btn>
              <Btn variant="primary" style={{ flex: 1, padding: '12px 14px', fontSize: 11 }}>Buy again</Btn>
            </>
          )}
        </div>

        <div style={{
          marginTop: 16, textAlign: 'center',
          fontFamily: TOD.sans, fontSize: 11, color: TOD.inkSoft,
        }}>
          Questions about this order? <span style={{ color: '#AF826D', fontWeight: 700 }}>Chat with us</span>
        </div>
      </div>
    </>
  );
}

const odLink = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: TOD.sans, fontSize: 11, color: '#AF826D',
  fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
};

function OD_SectionTitle({ children, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginTop: 22, marginBottom: 10,
    }}>
      <h3 style={{
        margin: 0, fontFamily: TOD.serif, fontSize: 18, fontWeight: 500, color: TOD.ink,
      }}>{children}</h3>
      {action}
    </div>
  );
}

function OD_Row({ label, value, labelStyle, valueStyle }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '5px 0',
    }}>
      <span style={{ fontFamily: TOD.sans, fontSize: 12.5, color: TOD.inkSoft, ...labelStyle }}>{label}</span>
      <span style={{ fontFamily: TOD.sans, fontSize: 13, color: TOD.ink, fontWeight: 600, ...valueStyle }}>{value}</span>
    </div>
  );
}

window.OrderDetailsPage = OrderDetailsPage;
