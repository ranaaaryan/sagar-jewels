import React from 'react';
// Checkout — redesigned to match Figma "Checkout Page" frame.
// Adds: Gift Voucher pill, Apply Coupon pill, per-item Order Summary cards,
// simple UPI / Wallets rows (Google-Pay-style dual-circle logos), and a
// full-width "Complete Purchase" CTA. Keeps Address tile + Card details.

const CX = window.JEWEL_TOKENS;
const CX_BG        = 'rgb(247,246,242)';
const CX_ACCENT    = 'rgb(172,129,108)';
const CX_ACCENT_DK = 'rgb(119,88,66)';
const CX_CREAM     = 'rgb(239,232,227)';
const CX_SOFT      = 'rgb(244,244,240)';
const CX_INK       = 'rgb(48,51,51)';
const CX_INK_SOFT  = 'rgb(107,92,84)';
const CX_LINE      = 'rgba(176,178,177,0.22)';
const CX_GOLD      = 'rgb(116,92,0)';

function CheckoutPage({ go, state, setState }) {
  const defaultAddr = (state.addresses.find(a => a.isDefault) || state.addresses[0]);
  const [addressId, setAddressId] = React.useState(defaultAddr?.id);
  const [payMethod, setPayMethod] = React.useState('card');
  const [placed, setPlaced] = React.useState(false);
  const [voucher, setVoucher] = React.useState('');
  const [coupon, setCoupon] = React.useState('');

  const items = state.cart;
  const subtotal = items.reduce((s, p) => s + p.price * (p.qty || 1), 0);
  const making   = items.reduce((s, p) => s + (p.making || 0) * (p.qty || 1), 0);
  const discount = state.cartCoupon?.value || 0;
  const shipping = subtotal > 15000 ? 0 : 250;
  const tax      = Math.round((subtotal - discount) * 0.003 * 100) / 100;  // ~0.3% GST on jewellery
  const total    = subtotal + making + shipping + tax - discount;

  const addr = state.addresses.find(a => a.id === addressId) || state.addresses[0];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CX_BG, minHeight: 0 }}>
      {/* ─── Top bar (back + title) ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 15px 10px',
      }}>
        <button onClick={() => go('cart')} aria-label="Back" style={cxSq}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', ${CX.serif}`, fontSize: 20, color: '#000', letterSpacing: 0.2,
        }}>Checkout</div>
        <div style={{ width: 45, height: 44 }} aria-hidden="true"/>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0 20px' }}>
        {/* ─── Shipping Address ─── */}
        <SectionHead title="Shipping Address" action={
          <button onClick={() => go('addresses')} style={linkBtn}>Add New</button>
        }/>
        <div style={{
          padding: '0 15px', display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 6,
        }}>
          {state.addresses.map(a => (
            <AddressTile key={a.id} a={a} active={a.id === addressId} onClick={() => setAddressId(a.id)}/>
          ))}
        </div>

        {/* ─── Payment Method ─── */}
        <SectionHead title="Payment Method"/>
        <div style={{ padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 15 }}>
          {/* Card — expanded by default showing saved card */}
          <PayCard selected={payMethod === 'card'} onClick={() => setPayMethod('card')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 32, borderRadius: 4, background: '#2F3430',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 10, letterSpacing: 1,
                  color: 'rgb(250,249,246)',
                }}>VISA</span>
              </div>
              <div>
                <div style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 16,
                  color: CX_INK, letterSpacing: 0.5,
                }}>•••• •••• •••• 8821</div>
                <div style={{
                  fontFamily: 'Manrope', fontSize: 12, color: CX_INK_SOFT, marginTop: 2,
                }}>Expires 12/26</div>
              </div>
            </div>
          </PayCard>

          {/* UPI — collapsed row */}
          <PayCard selected={payMethod === 'upi'} onClick={() => setPayMethod('upi')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                fontFamily: 'Manrope', fontWeight: 500, fontSize: 20, letterSpacing: 1,
                color: '#000',
              }}>UPI</span>
              <div style={{ flex: 1 }}/>
              <DualLogo/>
            </div>
          </PayCard>

          {/* Wallets — collapsed row */}
          <PayCard selected={payMethod === 'wallet'} onClick={() => setPayMethod('wallet')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                fontFamily: 'Manrope', fontWeight: 500, fontSize: 20, letterSpacing: 1,
                color: '#000',
              }}>Wallets</span>
              <div style={{ flex: 1 }}/>
              <DualLogo/>
            </div>
          </PayCard>
        </div>

        {/* ─── Gift Voucher ─── */}
        <SectionHead title="Gift Voucher"/>
        <div style={{ padding: '0 15px' }}>
          <PillInput
            icon={
              <svg width="17" height="14" viewBox="0 0 17 14" fill="none" stroke={CX_GOLD}
                   strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="5" width="15" height="8" rx="1"/>
                <path d="M8.5 5v8M1 8.5h15"/>
                <path d="M5 5c-1.5 0-2.5-1-2.5-2s1-2 2.5-2c1.5 0 3.5 2 3.5 4M12 5c1.5 0 2.5-1 2.5-2s-1-2-2.5-2C10.5 1 8.5 3 8.5 5"/>
              </svg>
            }
            placeholder="Gift Voucher"
            value={voucher}
            onChange={setVoucher}
            actionLabel="Apply"
            placeholderColor={CX_INK}
            actionColor={CX_INK}
          />
        </div>

        {/* ─── Order Summary ─── */}
        <SectionHead title="Order Summary" action={
          <button onClick={() => go('cart')} style={linkBtn}>Edit Bag</button>
        }/>
        <div style={{ padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(p => <OrderItemCard key={p.id} p={p}/>)}
        </div>

        {/* ─── Apply Coupon (inside summary block) ─── */}
        <div style={{ padding: '16px 15px 0' }}>
          <PillInput
            placeholder="Apply Coupon Code"
            value={coupon}
            onChange={setCoupon}
            actionLabel="Apply"
            placeholderColor="rgb(180,182,182)"
            actionColor={CX_ACCENT}
            onAction={() => {
              if (coupon.trim()) {
                setState(s => ({ ...s, cartCoupon: { code: coupon.trim().toUpperCase(), value: 2000 } }));
                setCoupon('');
              }
            }}
          />
        </div>

        {/* ─── Totals ─── */}
        <div style={{
          padding: '26px 23px 8px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <SumRow label="Subtotal"      value={`₹${subtotal.toLocaleString('en-IN')}`}/>
          {discount > 0 &&
            <SumRow label={state.cartCoupon?.code ? `Discount · ${state.cartCoupon.code}` : 'Discount'}
                    value={`₹${discount.toLocaleString('en-IN')}`}/>}
          <SumRow label="Shipping"
                  value={shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  valueColor={shipping === 0 ? CX_ACCENT : CX_INK}/>
          <SumRow label="Estimated Tax" value={`₹${tax.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}/>
          <div style={{ height: 1, background: CX_LINE, margin: '2px 0' }}/>
          <SumRow label="Total"
                  value={`₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}
                  bold/>
        </div>

        <div style={{
          padding: '14px 24px 4px',
          fontFamily: 'Manrope', fontSize: 10.5, color: CX_INK_SOFT, textAlign: 'center', lineHeight: 1.6,
        }}>
          By placing this order you agree to Sagar Jewellers' <u>Terms</u> and <u>Return Policy</u>.
        </div>
      </div>

      {/* ─── Sticky "Complete Purchase" CTA ─── */}
      <div style={{
        background: 'rgba(247,246,242,0.92)', backdropFilter: 'blur(12px)',
        padding: '10px 24px 16px',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
      }}>
        <button onClick={() => setPlaced(true)} style={{
          width: '100%', height: 66, borderRadius: 999, border: 'none',
          background: '#AF826D',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 18,
          boxShadow: '0 10px 16px -3px rgba(119,88,66,0.25), 0 4px 6px -4px rgba(119,88,66,0.15)',
        }}>
          Complete Purchase
          <svg width="14" height="14" viewBox="0 0 13 13" fill="#fff">
            <path d="M10.1 6.9L0 6.9V5.6h10.1L5.4.9 6.3 0l6.2 6.2-6.2 6.3-.9-.9L10.1 6.9z"/>
          </svg>
        </button>
      </div>

      {placed && <PlacedSheet total={total} payLabel={payLabel(payMethod)} addr={addr}
                              onClose={() => { setPlaced(false); go('orders'); }}/>}
    </div>
  );
}

// ── Pay method card (radio on the right) ─────────────────
function PayCard({ selected, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      position: 'relative', width: '100%',
      background: CX_SOFT, borderRadius: 12,
      padding: '24px 24px 24px 24px', cursor: 'pointer',
      border: 'none', textAlign: 'left',
      boxShadow: selected
        ? '0 4px 4px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(172,129,108,0.5)'
        : '0 1px 10px rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center',
      minHeight: 88,
    }}>
      <div style={{ flex: 1 }}>{children}</div>
      <RadioRight on={selected}/>
    </button>
  );
}

function RadioRight({ on }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      marginLeft: 12,
      background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: on ? `inset 0 0 0 1.5px ${CX_ACCENT_DK}` : `inset 0 0 0 1.5px rgb(200,197,192)`,
    }}>
      {on && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CX_ACCENT_DK}
             strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7"/>
        </svg>
      )}
    </div>
  );
}

// Google-Pay style dual-circle logo ("G Pay" overlap)
function DualLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: 'conic-gradient(from 210deg, #EA4335 0%, #EA4335 25%, #FBBC05 25%, #FBBC05 50%, #34A853 50%, #34A853 75%, #4285F4 75%, #4285F4 100%)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}/>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        marginLeft: -8,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      }}>
        <svg width="13" height="13" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.4 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.3 17.6 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.5 2.9-2.2 5.3-4.7 6.9l7.6 5.9c4.4-4.1 6.9-10.1 6.9-17.1z"/>
          <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.3.7-4.7L2.6 13.2C.9 16.6 0 20.2 0 24c0 3.8.9 7.4 2.6 10.8l7.8-6.1z"/>
          <path fill="#EA4335" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-4.3-13.6-10l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
        </svg>
      </div>
    </div>
  );
}

// ── Pill input (Gift Voucher, Apply Coupon) ─────────────────
function PillInput({ icon, placeholder, value, onChange, actionLabel, onAction,
                     placeholderColor = 'rgb(180,182,182)', actionColor = CX_ACCENT }) {
  return (
    <div style={{
      height: 56, borderRadius: 999, background: '#fff',
      border: '1px solid rgba(176,178,177,0.25)',
      display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px',
    }}>
      {icon}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'Manrope', fontSize: 14,
          color: value ? CX_INK : placeholderColor,
        }}
      />
      <button onClick={onAction} style={{
        border: 'none', background: 'none', cursor: 'pointer',
        fontFamily: 'Manrope', fontWeight: 500, fontSize: 14, letterSpacing: 2,
        color: actionColor,
      }}>{actionLabel}</button>
    </div>
  );
}

// ── Order summary item card ─────────────────
function OrderItemCard({ p }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 25,
      display: 'flex', gap: 24, alignItems: 'center',
    }}>
      <div style={{
        width: 99, height: 99, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
        background: `url(${cartImgFor(p)}) center / cover no-repeat, rgb(237,238,234)`,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 18, lineHeight: '28px',
          color: CX_INK,
        }}>{p.name}</div>
        <div style={{
          marginTop: 4,
          fontFamily: 'Manrope', fontSize: 12, letterSpacing: 1.2,
          color: 'rgba(92,96,92,0.7)', textTransform: 'uppercase',
        }}>{p.meta || `${p.material || '18K GOLD'} / ${p.variant || 'STD'}`}</div>
        <div style={{
          marginTop: 12,
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: CX_ACCENT_DK,
        }}>₹{(p.price * (p.qty || 1)).toLocaleString('en-IN')}.00</div>
      </div>
    </div>
  );
}

function cartImgFor(p) {
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

// ── Totals row ─────────────────
function SumRow({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{
        fontFamily: 'Manrope',
        fontSize: bold ? 18 : 14,
        fontWeight: bold ? 700 : 400,
        color: CX_INK,
      }}>{label}</span>
      <span style={{
        fontFamily: 'Manrope',
        fontSize: bold ? 24 : 14,
        fontWeight: bold ? 700 : 500,
        color: valueColor || (bold ? CX_ACCENT_DK : CX_INK),
      }}>{value}</span>
    </div>
  );
}

// ── Address tile ─────
function AddressTile({ a, active, onClick }) {
  const tagLabel = {
    home:  'HOME STUDIO',
    work:  'ATELIER OFFICE',
    other: 'SUMMER RESIDENCE',
  }[a.tag] || (a.label || 'ADDRESS').toUpperCase();

  return (
    <button onClick={onClick} style={{
      position: 'relative', flexShrink: 0, width: 280, height: 241,
      borderRadius: 12,
      background: active ? CX_CREAM : '#fff',
      border: active ? 'none' : '1px solid rgba(175,179,174,0.1)',
      padding: '32px 32px', cursor: 'pointer', textAlign: 'left',
      boxShadow: active ? '0 4px 4px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex', flexDirection: 'column', gap: 24,
      opacity: 1,
    }}>
      <span style={{
        fontFamily: 'Manrope', fontSize: 10, letterSpacing: 1,
        color: active ? CX_ACCENT_DK : 'rgba(92,96,92,0.4)',
        lineHeight: '15px',
      }}>{tagLabel}</span>

      <div style={{ opacity: active ? 1 : 0.6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 18, lineHeight: '28px',
          color: 'rgb(47,52,48)',
        }}>{a.name}</div>
        <div style={{
          fontFamily: 'Manrope', fontSize: 16, lineHeight: '26px',
          color: 'rgb(92,96,92)',
        }}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br/>{a.city}, India, {a.pincode}</div>
      </div>

      <div style={{
        opacity: active ? 0.6 : 0.4,
        fontFamily: 'Manrope', fontSize: 12, lineHeight: '16px',
        color: 'rgb(47,52,48)',
        display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto',
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.9 19.9 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.9 19.9 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72a2 2 0 0 1 1.72 2z"/>
        </svg>
        {a.phone}
      </div>

      {active && (
        <div style={{
          position: 'absolute', top: 24, right: 24,
          width: 20, height: 20, borderRadius: '50%', background: CX_ACCENT_DK, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </div>
      )}
    </button>
  );
}

function SectionHead({ title, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '26px 15px 16px',
    }}>
      <h3 style={{
        margin: 0, fontFamily: `'Noto Serif', serif`, fontWeight: 500, fontSize: 20,
        letterSpacing: 1, color: '#000',
      }}>{title}</h3>
      {action}
    </div>
  );
}

function payLabel(m) { return m === 'card' ? 'Card' : m === 'upi' ? 'UPI' : 'Wallet'; }

const cxSq = {
  width: 45, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
};

const linkBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: CX_ACCENT, fontFamily: 'Manrope', fontWeight: 500,
  fontSize: 14, letterSpacing: 2,
};

function PlacedSheet({ onClose, total, payLabel, addr }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(42,39,36,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22, zIndex: 20,
    }}>
      <div style={{ background: '#fff', borderRadius: 22, padding: 26, textAlign: 'center', maxWidth: 320 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#E6EEE1', color: '#4C6944',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        </div>
        <h3 style={{ margin: 0, fontFamily: `'Noto Serif', serif`, fontSize: 24, color: CX_INK, fontWeight: 700 }}>
          Order placed
        </h3>
        <p style={{ fontFamily: 'Manrope', fontSize: 13, color: CX_INK_SOFT, marginTop: 8, lineHeight: 1.55 }}>
          We've charged ₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})} to your {payLabel}.
          Your pieces will arrive at <b>{addr?.city || 'your address'}</b> in 2–4 business days.
        </p>
        <button onClick={onClose} style={{
          marginTop: 18, width: '100%', height: 52, borderRadius: 999, border: 'none',
          background: CX_ACCENT, color: '#fff', cursor: 'pointer',
          fontFamily: `'Noto Serif', serif`, fontWeight: 700, fontSize: 14,
        }}>Track Order</button>
      </div>
    </div>
  );
}

window.CheckoutPage = CheckoutPage;
