import React from 'react';
// Cart — restyled to match the Figma "My Cart" frame
// White top bar (back + bell), 3 cards with image/name/price/qty, Shipping Details (peach icon),
// Voucher pill, Order Summary card, "Proceed to Checkout" pill with arrow.

const CT = window.JEWEL_TOKENS;
const CT_BG = 'rgb(247,246,242)';
const CT_ACCENT = 'rgb(172,129,108)';
const CT_ACCENT_DK = 'rgb(119,88,66)';
const CT_CARD_SOFT = 'rgb(244,244,242)';
const CT_PEACH = 'rgb(250,228,218)';
const CT_GOLD = 'rgb(116,92,0)';
const CT_INK = 'rgb(48,51,51)';
const CT_INK_SOFT = 'rgb(107,92,84)';
const CT_LINE = 'rgba(176,178,177,0.2)';

function CartPage({ go, state, setState }) {
  const items = state.cart;
  const empty = items.length === 0;

  const subtotal = items.reduce((s, p) => s + p.price * (p.qty || 1), 0);
  const making = items.reduce((s, p) => s + (p.making || 0) * (p.qty || 1), 0);
  const discount = state.cartCoupon?.value || 0;
  const shipping = subtotal > 15000 ? 0 : 250;
  const total = subtotal + making + shipping - discount;

  function updateQty(id, delta) {
    setState(s => ({
      ...s,
      cart: s.cart
        .map(p => p.id === id ? { ...p, qty: Math.max(0, (p.qty || 1) + delta) } : p)
        .filter(p => (p.qty || 1) > 0),
    }));
  }
  function remove(id) { setState(s => ({ ...s, cart: s.cart.filter(p => p.id !== id) })); }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CT_BG, minHeight: 0 }}>
      {/* Figma-style top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 15px 10px',
      }}>
        <button onClick={() => go('home')} aria-label="Back" style={squareBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 20, color: '#000', letterSpacing: 0.2,
        }}>My Cart</div>
        <button aria-label="Notifications" style={squareBtn} onClick={() => go('notifications')}>
          <Icon.Bell width={18} height={18}/>
        </button>
      </div>

      {empty ? (
        <EmptyCart go={go}/>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0 20px' }}>
          {/* Item cards */}
          <div style={{ padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(p => (
              <CartItemCard key={p.id} p={p}
                onInc={() => updateQty(p.id, +1)}
                onDec={() => updateQty(p.id, -1)}
                onRemove={() => remove(p.id)}
              />
            ))}
          </div>

          {/* Shipping Details */}
          <div style={{ padding: '24px 24px 8px' }}>
            <h3 style={{
              margin: 0, fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 21, fontWeight: 700, color: CT_INK,
            }}>Shipping Details</h3>
            <div style={{
              marginTop: 14, background: CT_CARD_SOFT, borderRadius: 33, padding: 16,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', background: CT_PEACH,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="19" height="14" viewBox="0 0 19 14" fill="none" stroke={CT_ACCENT_DK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="0.5" y="2" width="11" height="9" rx="1"/>
                  <path d="M11.5 5h4l3 3v3h-7V5z"/>
                  <circle cx="4.5" cy="12" r="1.2" fill={CT_ACCENT_DK}/>
                  <circle cx="14.5" cy="12" r="1.2" fill={CT_ACCENT_DK}/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 14.5, fontWeight: 700, color: CT_INK,
                }}>Standard Delivery</div>
                <div style={{
                  fontFamily: `'Manrope', ${CT.sans}`, fontSize: 12, color: CT_INK_SOFT, marginTop: 2,
                }}>Est: 2–4 business days{shipping === 0 ? ' · Free' : ` · ₹${shipping}`}</div>
              </div>
              <svg width="7" height="11" viewBox="0 0 6 10" fill="rgb(120,123,122)">
                <path d="M 3.833 4.712 L 0 0.878 L 0.878 0 L 5.59 4.712 L 0.878 9.423 L 0 8.545 L 3.833 4.712 Z" />
              </svg>
            </div>
          </div>

          {/* Voucher */}
          <div style={{ padding: '8px 24px' }}>
            <button onClick={() => go('coupons')} style={{
              width: '100%', borderRadius: 33, background: '#fff',
              border: `1px solid ${CT_LINE}`, padding: '14px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke={CT_GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4.5L4 1.5h11V11.5H4L1 8.5V4.5Z"/>
                  <circle cx="5" cy="6.5" r="1" fill={CT_GOLD}/>
                </svg>
                <span style={{
                  fontFamily: `'Manrope', ${CT.sans}`, fontSize: 13, fontWeight: 500, color: CT_INK,
                }}>{state.cartCoupon ? `${state.cartCoupon.code} applied · − ₹${discount.toLocaleString('en-IN')}` : 'Add voucher code'}</span>
              </div>
              <span style={{
                fontFamily: `'Manrope', ${CT.sans}`, fontSize: 11, fontWeight: 700,
                color: CT_ACCENT_DK, letterSpacing: 1.2,
              }}>{state.cartCoupon ? 'CHANGE' : 'APPLY'}</span>
            </button>
          </div>

          {/* Order Summary */}
          <div style={{ padding: '8px 24px' }}>
            <div style={{
              background: '#fff', borderRadius: 20, padding: 20,
              boxShadow: '0 2px 12px rgba(47,52,48,0.04)',
              border: `1px solid ${CT_LINE}`,
            }}>
              <h3 style={{
                margin: 0, fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 18, fontWeight: 700, color: CT_INK,
              }}>Order Summary</h3>

              <SumRow label={`Subtotal · ${items.length} item${items.length > 1 ? 's' : ''}`} value={`₹${subtotal.toLocaleString('en-IN')}`}/>
              <SumRow label="Making charges" value={`₹${making.toLocaleString('en-IN')}`}/>
              {discount > 0 && <SumRow label={`Voucher · ${state.cartCoupon.code}`} value={`− ₹${discount.toLocaleString('en-IN')}`} tone="success"/>}
              <SumRow label="Delivery" value={shipping === 0 ? 'Free' : `₹${shipping}`} tone={shipping === 0 ? 'success' : undefined}/>

              <div style={{ height: 1, background: CT_LINE, margin: '12px 0' }}/>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{
                  fontFamily: `'Manrope', ${CT.sans}`, fontSize: 12, fontWeight: 700, color: CT_INK,
                  letterSpacing: 1.2, textTransform: 'uppercase',
                }}>Total</div>
                <div style={{
                  fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 26, fontWeight: 700, color: CT_ACCENT_DK,
                }}>₹{total.toLocaleString('en-IN')}</div>
              </div>

              <div style={{
                fontFamily: `'Manrope', ${CT.sans}`, fontSize: 11, color: CT_INK_SOFT,
                marginTop: 4, textAlign: 'right',
              }}>
                or ₹{Math.round(total / 6).toLocaleString('en-IN')}/mo for 6 months · 0% EMI
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{
            margin: '12px 24px 0',
            display: 'flex', justifyContent: 'space-between', gap: 10,
            padding: '12px 10px', background: CT_CARD_SOFT, borderRadius: 12,
          }}>
            {[
              { t: 'BIS Hallmark' },
              { t: 'Lifetime buy-back' },
              { t: 'Insured shipping' },
            ].map((x, i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center',
                fontFamily: `'Manrope', ${CT.sans}`, fontSize: 10.5, color: CT_INK_SOFT, lineHeight: 1.35,
              }}>
                <div style={{ color: CT_ACCENT_DK, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.3L12 16.8 6.4 19.6 7.5 13.3 3 8.9 9 8l3-6z"/>
                  </svg>
                </div>
                {x.t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky CTA */}
      {!empty && (
        <div style={{
          background: CT_BG, padding: '12px 15px 14px',
          borderTop: `1px solid ${CT_LINE}`,
        }}>
          <button
            onClick={() => go('checkout')}
            style={{
              width: '100%', height: 60, borderRadius: 999,
              background: CT_ACCENT, color: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 12px 0 26px',
              fontFamily: `'Noto Serif', ${CT.serif}`, fontWeight: 700, fontSize: 16,
              letterSpacing: 0.5,
              boxShadow: '0 10px 20px -6px rgba(119,88,66,0.35)',
            }}
          >
            <span>Proceed to Checkout · ₹{total.toLocaleString('en-IN')}</span>
            <span style={{
              width: 42, height: 42, borderRadius: '50%', background: '#fff',
              color: CT_ACCENT_DK,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

// Map a cart item to a real product photo.
function cartImg(p) {
  if (p.img) return p.img;
  const cat = (p.cat || '').toLowerCase();
  if (cat.includes('earring'))  return 'assets/product/comp-studs.jpg';
  if (cat.includes('necklace')) return 'assets/product/comp-necklace.jpg';
  if (cat.includes('bracelet')) return 'assets/product/comp-bracelet.jpg';
  if (cat.includes('pendant'))  return 'assets/home/cat-pendants.jpg';
  if (cat.includes('anklet'))   return 'assets/home/cat-anklets.jpg';
  if (cat.includes('ring'))     return 'assets/products/emerald-ring.jpg';
  return 'assets/products/ring.jpg';
}

// ── Item card (Figma idiom: image + name + price + qty stepper) ─────
function CartItemCard({ p, onInc, onDec, onRemove }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 12,
      display: 'flex', gap: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      border: `1px solid ${CT_LINE}`,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 12, flexShrink: 0,
        background: `url(${cartImg(p)}) center / cover no-repeat, linear-gradient(135deg, #F4E6D5, #E9D5BD)`,
      }}/>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 15, fontWeight: 700, color: CT_INK, lineHeight: 1.25,
          }}>{p.name}</div>
          <button onClick={onRemove} aria-label="Remove" style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(154,144,133)', padding: 2, flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div style={{
          fontFamily: `'Manrope', ${CT.sans}`, fontSize: 11, color: CT_INK_SOFT, marginTop: 4, lineHeight: 1.4,
        }}>{p.metal}{p.size ? ` · ${p.size}` : ''}</div>

        <div style={{ flex: 1 }}/>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8,
        }}>
          <div style={{
            fontFamily: `'Noto Serif', ${CT.serif}`, fontSize: 16, fontWeight: 700, color: CT_GOLD,
          }}>₹{(p.price * (p.qty || 1)).toLocaleString('en-IN')}</div>
          <Stepper value={p.qty || 1} onInc={onInc} onDec={onDec}/>
        </div>
      </div>
    </div>
  );
}

function Stepper({ value, onInc, onDec }) {
  const btn = {
    width: 26, height: 26, borderRadius: '50%', border: `1px solid ${CT_LINE}`,
    background: '#fff', cursor: 'pointer', color: CT_INK,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={onDec} style={btn} aria-label="Decrease">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14"/></svg>
      </button>
      <span style={{
        fontFamily: `'Manrope', ${CT.sans}`, fontSize: 13, fontWeight: 700, color: CT_INK, minWidth: 14, textAlign: 'center',
      }}>{value}</span>
      <button onClick={onInc} style={btn} aria-label="Increase">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
  );
}

function SumRow({ label, value, tone }) {
  const color = tone === 'success' ? '#4C6944' : CT_INK;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
      <span style={{ fontFamily: `'Manrope', sans-serif`, fontSize: 13, color: CT_INK_SOFT }}>{label}</span>
      <span style={{ fontFamily: `'Manrope', sans-serif`, fontSize: 13, color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function EmptyCart({ go }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: CT_PEACH, color: CT_ACCENT_DK,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <Icon.Bag width={30} height={30}/>
        </div>
        <h3 style={{
          margin: 0, fontFamily: `'Noto Serif', sans-serif`, fontSize: 22, color: CT_INK, fontWeight: 700,
        }}>Your cart is empty</h3>
        <p style={{
          fontFamily: `'Manrope', sans-serif`, fontSize: 13, color: CT_INK_SOFT, marginTop: 8,
        }}>Saved pieces are waiting in your wishlist.</p>
        <button onClick={() => go('wishlist')} style={{
          marginTop: 14, padding: '12px 22px', borderRadius: 999, border: 'none',
          background: CT_ACCENT, color: '#fff', cursor: 'pointer',
          fontFamily: `'Manrope', sans-serif`, fontSize: 12, fontWeight: 700, letterSpacing: 1,
        }}>GO TO WISHLIST</button>
      </div>
    </div>
  );
}

const squareBtn = {
  width: 45, height: 44, borderRadius: 10,
  background: '#fff', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
};

window.CartPage = CartPage;
