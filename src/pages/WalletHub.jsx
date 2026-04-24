import React from 'react';
// Wallet Hub — the landing for the /wallet route.
// Shows fiat balance hero, a 2×2 tile grid for sub-features, and a compact
// recent-activity list spanning gold purchases and voucher residuals.

const WH_T = window.JEWEL_TOKENS;
const WH_ACCENT    = 'rgb(172,129,108)';
const WH_ACCENT_DK = 'rgb(119,88,66)';
const WH_GOLD      = 'rgb(115,92,0)';
const WH_GOLD_DK   = '#5A4700';
const WH_INK       = '#1E1B13';
const WH_INK_SOFT  = '#6E655C';
const WH_LINE      = 'rgba(47,52,48,0.10)';

function WalletHubPage({ go, state }) {
  const { user } = state;
  const gold = user.digitalGold || { weightGm: 0, lots: [] };
  const sellRate = state.goldRate?.sell || 0;
  const goldValue = Math.round(gold.weightGm * sellRate);
  const voucherTotal = (state.voucherWallet || []).reduce((s, v) => s + v.balance, 0);
  const voucherCount = (state.voucherWallet || []).length;
  const verifiedBanks = (user.bankAccounts || []).filter(a => a.verified).length;

  const recent = buildRecentActivity(state);

  return (
    <>
      <TopBar title="My Wallet" onBack={() => go('home')}/>

      <div style={{
        flex: 1, overflowY: 'auto', background: WH_T.bg,
        padding: '10px 16px 40px',
      }}>
        {/* Fiat balance hero */}
        <div style={{
          marginTop: 8, padding: '20px 20px 18px', borderRadius: 18,
          background: 'linear-gradient(135deg, #3B2A1E 0%, #6B4A2E 55%, #8A5E3C 100%)',
          color: '#F3D69B', position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 28px rgba(58,36,24,0.28)',
        }}>
          <svg width="160" height="160" viewBox="0 0 160 160"
            style={{ position: 'absolute', top: -40, right: -40, opacity: 0.22, pointerEvents: 'none' }}>
            <g stroke="#E9BE6F" strokeWidth="1" fill="none">
              <circle cx="80" cy="80" r="34"/>
              <circle cx="80" cy="80" r="52"/>
              <circle cx="80" cy="80" r="70"/>
            </g>
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 10.5, letterSpacing: 2.4,
              color: '#E9BE6F', fontWeight: 700,
            }}>◆ CASH IN WALLET</div>
            <div style={{
              marginTop: 8,
              fontFamily: `'Noto Serif', ${WH_T.serif}`, fontSize: 34, fontWeight: 700,
              color: '#F3D69B', lineHeight: 1.05,
            }}>
              ₹{(user.walletBalance || 0).toLocaleString('en-IN')}
            </div>
            <div style={{
              marginTop: 6,
              fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 12, color: 'rgba(243,214,155,0.82)',
            }}>Available across Sagar · instant redemption</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => alert('Top-up flow coming soon')} style={{
                padding: '10px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: '#F3D69B', color: '#2F1D11',
                fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 11.5, fontWeight: 800,
                letterSpacing: 1.2, textTransform: 'uppercase',
              }}>+ Top up</button>
              <button onClick={() => alert('Transactions coming soon')} style={{
                padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
                background: 'transparent', color: '#F3D69B',
                border: '1px solid rgba(243,214,155,0.4)',
                fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 11.5, fontWeight: 700,
                letterSpacing: 1.2, textTransform: 'uppercase',
              }}>Transactions</button>
            </div>
          </div>
        </div>

        {/* Tile grid */}
        <div style={{
          marginTop: 20, display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <HubTile
            onClick={() => go('wallet-gold')}
            icon={<IconGoldBar/>}
            title="Digital Gold"
            value={`${gold.weightGm.toFixed(3)} g`}
            sub={`Worth ₹${goldValue.toLocaleString('en-IN')}`}
          />
          <HubTile
            onClick={() => go('wallet-vouchers')}
            icon={<IconGift/>}
            title="Voucher Wallet"
            value={voucherCount > 0 ? `₹${voucherTotal.toLocaleString('en-IN')}` : 'Empty'}
            sub={voucherCount > 0
              ? `${voucherCount} voucher${voucherCount === 1 ? '' : 's'}`
              : 'Residuals auto-save here'}
            muted={voucherCount === 0}
          />
          <HubTile
            onClick={() => go('wallet-sell')}
            icon={<IconArrowDown/>}
            title="Sell Back"
            value="Liquidate"
            sub={`Today's rate · ₹${sellRate.toLocaleString('en-IN')}/gm`}
          />
          <HubTile
            onClick={() => go('wallet-banks')}
            icon={<IconBank/>}
            title="Bank Methods"
            value={`${verifiedBanks} verified`}
            sub="For payouts"
          />
        </div>

        {/* Recent activity */}
        <div style={{ marginTop: 26 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <div style={{
              fontFamily: `'Noto Serif', ${WH_T.serif}`, fontSize: 18, fontWeight: 700, color: WH_INK,
            }}>Recent activity</div>
            <button onClick={() => alert('Full history coming soon')} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: WH_ACCENT_DK, fontFamily: `'Manrope', ${WH_T.sans}`,
              fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
            }}>See all</button>
          </div>
          {recent.length === 0 ? (
            <div style={{
              padding: '20px 16px', borderRadius: 12,
              background: '#fff', border: `1px solid ${WH_LINE}`,
              fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 12, color: WH_INK_SOFT,
              textAlign: 'center',
            }}>
              Nothing to show yet — your recent wallet activity will appear here.
            </div>
          ) : (
            <div style={{
              background: '#fff', borderRadius: 14, border: `1px solid ${WH_LINE}`,
              overflow: 'hidden',
            }}>
              {recent.map((r, i) => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 14px',
                  borderBottom: i < recent.length - 1 ? `1px solid ${WH_LINE}` : 'none',
                }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: r.tint, color: r.tone,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{r.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 13, fontWeight: 700, color: WH_INK,
                    }}>{r.title}</div>
                    <div style={{
                      fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 11, color: WH_INK_SOFT, marginTop: 1,
                    }}>{r.sub}</div>
                  </div>
                  <div style={{
                    fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 13, fontWeight: 800,
                    color: r.tone, textAlign: 'right', whiteSpace: 'nowrap',
                  }}>{r.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function HubTile({ onClick, icon, title, value, sub, muted }) {
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', padding: '16px 14px', borderRadius: 14, cursor: 'pointer',
      background: '#fff', border: `1px solid ${WH_LINE}`,
      display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120,
      boxShadow: '0 2px 10px rgba(30,27,19,0.04)',
      transition: 'transform 160ms ease, box-shadow 160ms ease',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
    onMouseUp={e => e.currentTarget.style.transform = ''}>
      <span style={{
        width: 32, height: 32, borderRadius: 10,
        background: muted ? '#F4EFE5' : 'rgba(122,88,67,0.10)',
        color: muted ? WH_INK_SOFT : WH_ACCENT_DK,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</span>
      <div style={{
        fontFamily: `'Noto Serif', ${WH_T.serif}`, fontSize: 14, fontWeight: 600,
        color: WH_INK, marginTop: 2,
      }}>{title}</div>
      <div style={{
        fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 18, fontWeight: 800,
        color: muted ? WH_INK_SOFT : WH_ACCENT_DK, letterSpacing: 0.2,
      }}>{value}</div>
      <div style={{
        fontFamily: `'Manrope', ${WH_T.sans}`, fontSize: 10.5, color: WH_INK_SOFT,
        lineHeight: 1.4,
      }}>{sub}</div>
    </button>
  );
}

function buildRecentActivity(state) {
  const events = [];
  const lots = state.user?.digitalGold?.lots || [];
  lots.slice(0, 3).forEach(lot => {
    events.push({
      id: lot.id, ts: new Date(lot.date).getTime(),
      title: `Bought ${lot.gm.toFixed(3)} g gold`,
      sub: `${formatDate(lot.date)} · @ ₹${lot.pricePerGm.toLocaleString('en-IN')}/gm`,
      amount: `₹${lot.paid.toLocaleString('en-IN')}`,
      tone: WH_GOLD_DK, tint: 'rgba(115,92,0,0.10)',
      icon: <IconGoldSmall/>,
    });
  });
  (state.voucherWallet || []).slice(0, 3).forEach(v => {
    events.push({
      id: v.id, ts: new Date(v.createdAt).getTime(),
      title: `Saved ${v.code} to voucher wallet`,
      sub: v.source,
      amount: `+ ₹${v.balance.toLocaleString('en-IN')}`,
      tone: WH_ACCENT_DK, tint: 'rgba(122,88,67,0.10)',
      icon: <IconGift/>,
    });
  });
  return events.sort((a, b) => b.ts - a.ts).slice(0, 4);
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

/* ── icons ─────────────────────────────────────────────────────── */
function IconGoldBar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h14l-2 8H7z"/>
      <path d="M7 9l2-3h6l2 3"/>
    </svg>
  );
}
function IconGoldSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 9h14l-2 8H7z"/>
    </svg>
  );
}
function IconGift() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="5" rx="1"/>
      <path d="M5 13v8h14v-8M12 8v13"/>
      <path d="M12 8c-2-3-6-3-6 0 0 2 3 2 6 0zM12 8c2-3 6-3 6 0 0 2-3 2-6 0z"/>
    </svg>
  );
}
function IconArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v14"/>
      <path d="M6 13l6 6 6-6"/>
    </svg>
  );
}
function IconBank() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10L12 4l9 6"/>
      <path d="M5 10v8M19 10v8M9 10v8M15 10v8"/>
      <path d="M3 20h18"/>
    </svg>
  );
}

window.WalletHubPage = WalletHubPage;
