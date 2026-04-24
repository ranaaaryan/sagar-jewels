import React from 'react';
// Voucher Wallet — lists residual voucher balances saved when a coupon
// value exceeded a previous order's total. User can apply one to the
// next checkout.

const VW_T = window.JEWEL_TOKENS;
const VW_ACCENT    = 'rgb(172,129,108)';
const VW_ACCENT_DK = 'rgb(119,88,66)';
const VW_INK       = '#1E1B13';
const VW_INK_SOFT  = '#6E655C';
const VW_LINE      = 'rgba(47,52,48,0.10)';

function VoucherWalletPage({ go, state, setState }) {
  const wallet = state.voucherWallet || [];
  const total = wallet.reduce((s, v) => s + v.balance, 0);
  const soonest = wallet
    .map(v => v.expiresAt)
    .filter(Boolean)
    .sort()[0];

  function applyToCheckout(voucher) {
    // Stage it as the cart coupon, capped at whatever cart total is at checkout.
    setState(s => ({
      ...s,
      cartCoupon: { code: voucher.code, value: voucher.balance, fromWallet: voucher.id },
    }));
    go('checkout');
  }

  return (
    <>
      <TopBar title="Voucher Wallet" onBack={() => go('wallet')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: VW_T.bg, padding: '10px 16px 40px' }}>
        {/* Balance hero */}
        <div style={{
          marginTop: 6, padding: '20px 20px', borderRadius: 18,
          background: 'linear-gradient(135deg, #FBF7F1 0%, #F1E6DA 55%, #E6D3BE 100%)',
          border: `1px solid ${VW_LINE}`,
        }}>
          <div style={{
            fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 10.5, letterSpacing: 2.4,
            color: VW_ACCENT_DK, fontWeight: 700,
          }}>◆ WALLET BALANCE</div>
          <div style={{
            marginTop: 8,
            fontFamily: `'Noto Serif', ${VW_T.serif}`, fontSize: 34, fontWeight: 700,
            color: VW_INK, lineHeight: 1.05,
          }}>₹{total.toLocaleString('en-IN')}</div>
          <div style={{
            marginTop: 6, fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 12, color: VW_INK_SOFT,
          }}>
            {wallet.length > 0
              ? `${wallet.length} voucher${wallet.length === 1 ? '' : 's'}${soonest ? ` · next expires ${formatDate(soonest)}` : ''}`
              : 'No residual vouchers yet'}
          </div>
        </div>

        {/* Explainer */}
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 12,
          background: '#fff', border: `1px dashed ${VW_LINE}`,
          fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 11, color: VW_INK_SOFT, lineHeight: 1.55,
        }}>
          When a voucher value is greater than your order total, we save the remainder here automatically —
          nothing is ever lost.
        </div>

        {/* Voucher list */}
        {wallet.length === 0 ? (
          <EmptyState/>
        ) : (
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {wallet.map(v => (
              <VoucherCard key={v.id} voucher={v} onApply={() => applyToCheckout(v)}/>
            ))}
          </div>
        )}

        {/* Back to wallet */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => go('wallet')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: VW_ACCENT_DK, fontFamily: `'Manrope', ${VW_T.sans}`,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
          }}>← Back to Wallet</button>
        </div>
      </div>
    </>
  );
}

function VoucherCard({ voucher, onApply }) {
  const daysLeft = voucher.expiresAt ? daysUntil(voucher.expiresAt) : null;
  const expiringSoon = daysLeft != null && daysLeft <= 7;

  return (
    <div style={{
      padding: 0, borderRadius: 14, overflow: 'hidden',
      background: '#fff', border: `1px solid ${VW_LINE}`,
      boxShadow: '0 2px 10px rgba(30,27,19,0.04)',
      position: 'relative',
    }}>
      {/* Ticket notch */}
      <div style={{
        position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
        width: 16, height: 16, borderRadius: '50%', background: VW_T.bg,
        border: `1px solid ${VW_LINE}`,
      }}/>
      <div style={{
        position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)',
        width: 16, height: 16, borderRadius: '50%', background: VW_T.bg,
        border: `1px solid ${VW_LINE}`,
      }}/>

      <div style={{
        padding: '16px 18px 14px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 8px', borderRadius: 999,
            background: 'rgba(122,88,67,0.10)', color: VW_ACCENT_DK,
            border: '1px solid rgba(122,88,67,0.22)',
            fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V4H4v8l8 8 8-8z"/>
              <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
            </svg>
            {voucher.code}
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: `'Noto Serif', ${VW_T.serif}`, fontSize: 22, fontWeight: 700, color: VW_INK,
          }}>₹{voucher.balance.toLocaleString('en-IN')}</div>
          <div style={{
            marginTop: 4,
            fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 11, color: VW_INK_SOFT,
          }}>{voucher.source}</div>
        </div>
      </div>

      {/* Perforation */}
      <div style={{
        margin: '0 18px', borderTop: `1px dashed ${VW_LINE}`, height: 0,
      }}/>

      <div style={{
        padding: '10px 18px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{
          fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 10.5,
          color: expiringSoon ? '#D65A50' : VW_INK_SOFT, fontWeight: expiringSoon ? 700 : 500,
        }}>
          {voucher.expiresAt
            ? (expiringSoon
                ? `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
                : `Valid till ${formatDate(voucher.expiresAt)}`)
            : 'No expiry'}
        </div>
        <button onClick={onApply} style={{
          padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
          background: VW_ACCENT_DK, color: '#fff',
          fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}>Apply at checkout</button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      marginTop: 28, textAlign: 'center',
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(122,88,67,0.08)', color: VW_ACCENT_DK,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="5" rx="1"/>
          <path d="M5 13v8h14v-8M12 8v13"/>
          <path d="M12 8c-2-3-6-3-6 0 0 2 3 2 6 0zM12 8c2-3 6-3 6 0 0 2-3 2-6 0z"/>
        </svg>
      </div>
      <div style={{
        fontFamily: `'Noto Serif', ${VW_T.serif}`, fontSize: 18, fontWeight: 700, color: VW_INK,
      }}>Your voucher wallet is empty</div>
      <div style={{
        maxWidth: 280, margin: '8px auto 0',
        fontFamily: `'Manrope', ${VW_T.sans}`, fontSize: 12, color: VW_INK_SOFT, lineHeight: 1.55,
      }}>
        When a voucher amount exceeds your order total, the remainder will auto-save here for next time.
      </div>
    </div>
  );
}

function daysUntil(iso) {
  try {
    const ms = new Date(iso).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  } catch { return null; }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

window.VoucherWalletPage = VoucherWalletPage;
