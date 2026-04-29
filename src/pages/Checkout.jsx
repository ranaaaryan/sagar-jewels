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
const CX_GOLD_DK   = '#5A4700';
const CX_GOLD_TINT = 'rgba(116,92,0,0.08)';

// Known coupon catalog — value resolved at apply-time. Unknown codes fall back
// to ₹2000 so the existing demo UX still works.
const KNOWN_COUPONS = {
  SAGAR10:    2000,
  FIRSTPAIR:  2500,
  MAKING100:  5000,
  BIGVOUCHER: 100000,   // demo voucher — usually exceeds the order total
};
function resolveCouponValue(code) {
  const v = KNOWN_COUPONS[code?.toUpperCase?.()];
  return typeof v === 'number' ? v : 2000;
}

// Pickup-eligible Sagar stores. `pincode` is used to bias ordering toward the
// user's region (matched on the leading digit, which corresponds to PIN region
// in India: 1 Delhi/NCR, 4 Mumbai, 5 Bengaluru/Hyderabad, etc.).
const PICKUP_STORES = [
  { id: 'p1', name: 'Sagar Jewellers · Indiranagar',     area: 'Indiranagar, Bengaluru',         pincode: '560038', km: 2.4,  hours: '11:00 – 20:30' },
  { id: 'p2', name: 'Sagar Jewellers · UB City Boutique',area: 'Shanthala Nagar, Bengaluru',     pincode: '560001', km: 6.1,  hours: '11:00 – 21:00' },
  { id: 'p3', name: 'Sagar Jewellers · Jayanagar',       area: 'Jayanagar, Bengaluru',           pincode: '560011', km: 9.8,  hours: '10:30 – 20:30' },
  { id: 'p4', name: 'Sagar Jewellers · Whitefield',      area: 'Forum Shantiniketan, Bengaluru', pincode: '560066', km: 14.2, hours: '11:00 – 22:00' },
  { id: 'p5', name: 'Sagar Jewellers · DLF Emporio',     area: 'Vasant Kunj, New Delhi',         pincode: '110070', km: 18.5, hours: '11:00 – 20:00' },
  { id: 'p6', name: 'Sagar Jewellers · Bandra Boutique', area: 'Bandra West, Mumbai',            pincode: '400050', km: 22.1, hours: '11:00 – 21:00' },
];

function rankedPickupStores(userPincode) {
  const region = (userPincode || '')[0];
  const list = [...PICKUP_STORES];
  if (!region) return list.sort((a, b) => a.km - b.km);
  return list.sort((a, b) => {
    const aSame = a.pincode[0] === region;
    const bSame = b.pincode[0] === region;
    if (aSame && !bSame) return -1;
    if (!aSame && bSame) return 1;
    return a.km - b.km;
  });
}

const ADVANCE_PCT_CHIPS = [25, 50, 75];

function CheckoutPage({ go, state, setState }) {
  const defaultAddr = (state.addresses.find(a => a.isDefault) || state.addresses[0]);
  const [addressId, setAddressId] = React.useState(defaultAddr?.id);
  const [payMethod, setPayMethod] = React.useState('card');
  const [advancePct, setAdvancePct] = React.useState(50);
  const [fulfillment, setFulfillment] = React.useState('delivery');
  const [pickupStoreId, setPickupStoreId] = React.useState(null);
  const [pickupListOpen, setPickupListOpen] = React.useState(false);
  const [billingSame, setBillingSame] = React.useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = React.useState(true);
  const [placed, setPlaced] = React.useState(false);
  const [voucher, setVoucher] = React.useState('');
  const [coupon, setCoupon] = React.useState('');
  const [residualToast, setResidualToast] = React.useState(null);  // { code, amount } after voucher overflow

  const items = state.cart;
  const subtotal = items.reduce((s, p) => s + p.price * (p.qty || 1), 0);
  const making   = items.reduce((s, p) => s + (p.making || 0) * (p.qty || 1), 0);
  const discount = state.cartCoupon?.value || 0;
  const deliveryCharge = subtotal > 15000 ? 0 : 250;
  const shipping = fulfillment === 'pickup' ? 0 : deliveryCharge;
  const tax      = Math.round((subtotal - discount) * 0.003 * 100) / 100;  // ~0.3% GST on jewellery
  const total    = subtotal + making + shipping + tax - discount;

  // ── Digital Gold redemption derivation ─────────────────
  const ownedGm       = Number(state.user.digitalGold?.weightGm || 0);
  const sellRate      = Number(state.goldRate?.sell || 0);
  const maxGoldValue  = ownedGm * sellRate;
  const useGold       = !!state.cartPayment?.useDigitalGold && ownedGm > 0.001 && sellRate > 0;
  const goldApplied   = useGold ? Math.min(maxGoldValue, total) : 0;
  const goldGmApplied = goldApplied > 0 ? goldApplied / sellRate : 0;
  const cashRemaining = Math.max(0, total - goldApplied);
  const fullyCoveredByGold = useGold && cashRemaining === 0 && goldApplied > 0;

  // PAN gate — triggers when the order total crosses ₹2L.
  // Uses `total` (not `cashRemaining`) because the IT threshold applies to
  // transaction value, not the post-gold residual.
  const pan = usePanGate({ user: state.user, cumulativeValue: total });
  const [pendingPlace, setPendingPlace] = React.useState(false);

  const addr = state.addresses.find(a => a.id === addressId) || state.addresses[0];

  // Pickup stores ranked by user's pincode region; default selection is nearest.
  const sortedPickupStores = React.useMemo(
    () => rankedPickupStores(addr?.pincode),
    [addr?.pincode]
  );
  React.useEffect(() => {
    if (!pickupStoreId && sortedPickupStores[0]) setPickupStoreId(sortedPickupStores[0].id);
  }, [sortedPickupStores, pickupStoreId]);
  const selectedPickupStore =
    sortedPickupStores.find(s => s.id === pickupStoreId) || sortedPickupStores[0];

  // Advance-pay split: customer pays a chosen % now and the rest on receipt.
  // Splits whatever is otherwise payable now (post digital-gold credit).
  const baseDueNow      = useGold ? cashRemaining : total;
  const isAdvance       = payMethod === 'advance' && !fullyCoveredByGold && baseDueNow > 0;
  const advanceAmount   = isAdvance ? Math.round(baseDueNow * advancePct / 100) : 0;
  const dueOnReceipt    = isAdvance ? Math.max(0, baseDueNow - advanceAmount) : 0;
  const finalPayNow     = isAdvance ? advanceAmount : baseDueNow;

  // ── Coupon apply with residual-to-wallet logic ─────────
  function applyCoupon(raw) {
    const code = raw.trim().toUpperCase();
    if (!code) return;
    const nominalValue = resolveCouponValue(code);
    const cap = Math.max(0, total);                 // residual is any value above the order total
    const applied = Math.min(nominalValue, cap);
    const residual = nominalValue - applied;

    setState(s => ({
      ...s,
      cartCoupon: { code, value: applied },
      voucherWallet: residual > 0
        ? [
            {
              id: `vw_${Date.now()}`,
              code: `${code}-R`,
              balance: residual,
              source: `Residual from ${code}`,
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            },
            ...(s.voucherWallet || []),
          ]
        : (s.voucherWallet || []),
    }));
    setCoupon('');
    if (residual > 0) {
      setResidualToast({ code: `${code}-R`, amount: residual });
    }
  }

  // ── Place order: debit gold (if used) before showing confirmation ────
  function placeOrder() {
    if (pan.blocked) { setPendingPlace(true); pan.openGate(); return; }
    actuallyPlace();
  }

  function actuallyPlace() {
    if (goldGmApplied > 0) {
      setState(s => ({
        ...s,
        user: { ...s.user, digitalGold: {
          ...s.user.digitalGold,
          weightGm: +((s.user.digitalGold?.weightGm || 0) - goldGmApplied).toFixed(4),
        }},
      }));
    }
    setPlaced(true);
    setPendingPlace(false);
  }

  function onPanUploaded(panImage) {
    setState(s => ({ ...s, user: { ...s.user, panImage } }));
    pan.closeGate();
    if (pendingPlace) actuallyPlace();
  }

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

        {/* ─── Billing Address ─── */}
        <SectionHead title="Billing Address"/>
        <div style={{ padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <PayCard selected={billingSame} onClick={() => setBillingSame(true)}>
            <div style={{
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: CX_INK,
              letterSpacing: 0.2,
            }}>Same as shipping address</div>
          </PayCard>

          <PayCard selected={!billingSame} onClick={() => setBillingSame(false)}>
            <div>
              <div style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: CX_INK,
                letterSpacing: 0.2,
              }}>Use a different billing address</div>
              {!billingSame && (
                <button onClick={e => { e.stopPropagation(); go('addresses'); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'Manrope', fontSize: 12, color: CX_ACCENT,
                  letterSpacing: 0.4, fontWeight: 600, marginTop: 4,
                }}>Change or add address →</button>
              )}
            </div>
          </PayCard>
        </div>

        {/* WhatsApp updates opt-in */}
        <div style={{ padding: '14px 15px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setWhatsappUpdates(w => !w)} aria-pressed={whatsappUpdates}
            style={{
              width: 22, height: 22, borderRadius: 6, border: 'none',
              background: whatsappUpdates ? CX_ACCENT : '#fff',
              boxShadow: whatsappUpdates ? 'none' : 'inset 0 0 0 1.5px rgba(176,178,177,0.5)',
              cursor: 'pointer', flexShrink: 0, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {whatsappUpdates && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff"
                   strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7"/>
              </svg>
            )}
          </button>
          <span style={{
            fontFamily: 'Manrope', fontSize: 13, color: CX_ACCENT_DK,
            fontWeight: 600, letterSpacing: 0.2,
          }}>Send me order related updates on WhatsApp</span>
        </div>

        {/* ─── Digital Gold redemption ─── */}
        {ownedGm > 0.001 && (
          <>
            <SectionHead title="Pay with Digital Gold"/>
            <div style={{ padding: '0 15px' }}>
              <GoldRedemptionCard
                ownedGm={ownedGm}
                sellRate={sellRate}
                useGold={useGold}
                goldApplied={goldApplied}
                goldGmApplied={goldGmApplied}
                cashRemaining={cashRemaining}
                total={total}
                onToggle={() => setState(s => ({
                  ...s,
                  cartPayment: { ...(s.cartPayment || {}), useDigitalGold: !useGold },
                }))}
              />
            </div>
          </>
        )}

        {/* ─── Payment Method ─── */}
        {!fullyCoveredByGold && (
        <>
        <SectionHead title={useGold ? 'Remaining payment' : 'Payment Method'}/>
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

          {/* Advance Pay — split between now and on receipt */}
          <PayCard selected={payMethod === 'advance'} onClick={() => setPayMethod('advance')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: CX_CREAM, color: CX_ACCENT_DK,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19"/>
                  <circle cx="6.5" cy="6.5" r="2.5"/>
                  <circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: CX_INK,
                }}>Advance Pay</div>
                <div style={{
                  fontFamily: 'Manrope', fontSize: 12, color: CX_INK_SOFT, marginTop: 2,
                }}>Pay part now, settle the rest on receipt</div>
              </div>
            </div>
          </PayCard>

          {payMethod === 'advance' && (
            <AdvancePayPanel
              total={baseDueNow}
              pct={advancePct}
              setPct={setAdvancePct}
              advanceAmount={advanceAmount}
              dueOnReceipt={dueOnReceipt}
              fulfillment={fulfillment}
            />
          )}
        </div>
        </>
        )}

        {/* ─── Fulfillment (Home Delivery / Store Pickup) ─── */}
        <SectionHead title="Fulfillment"/>
        <div style={{ padding: '0 15px', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <PayCard selected={fulfillment === 'delivery'} onClick={() => setFulfillment('delivery')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
              <FulfillIcon type="delivery"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: CX_INK,
                }}>Home Delivery</div>
                <div style={{
                  fontFamily: 'Manrope', fontSize: 12, color: CX_INK_SOFT, marginTop: 2,
                }}>Delivered to your address in 2–4 business days</div>
              </div>
              <div style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
                color: deliveryCharge === 0 ? CX_ACCENT_DK : CX_INK,
                whiteSpace: 'nowrap',
              }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</div>
            </div>
          </PayCard>

          <PayCard selected={fulfillment === 'pickup'} onClick={() => setFulfillment('pickup')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
              <FulfillIcon type="pickup"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: CX_INK,
                }}>Store Pickup</div>
                <div style={{
                  fontFamily: 'Manrope', fontSize: 12, color: CX_INK_SOFT, marginTop: 2,
                }}>Collect from your nearest Sagar Jewellers store</div>
              </div>
              <div style={{
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
                color: CX_ACCENT_DK, whiteSpace: 'nowrap',
              }}>FREE</div>
            </div>
          </PayCard>

          {fulfillment === 'pickup' && selectedPickupStore && (
            <StorePickupDropdown
              stores={sortedPickupStores}
              selected={selectedPickupStore}
              onSelect={id => { setPickupStoreId(id); setPickupListOpen(false); }}
              open={pickupListOpen}
              onToggle={() => setPickupListOpen(o => !o)}
              userPincode={addr?.pincode}
            />
          )}
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
            onAction={() => applyCoupon(coupon)}
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
          <SumRow label={fulfillment === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                  value={shipping === 0 ? 'Complimentary' : `₹${shipping}`}
                  valueColor={shipping === 0 ? CX_ACCENT : CX_INK}/>
          <SumRow label="Estimated Tax" value={`₹${tax.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}/>
          {useGold && goldApplied > 0 && (
            <SumRow
              label={`Digital gold · ${goldGmApplied.toFixed(4)} g`}
              value={`−₹${Math.round(goldApplied).toLocaleString('en-IN')}`}
              valueColor={CX_GOLD_DK}
            />
          )}
          {isAdvance && (
            <>
              <SumRow
                label="Order Total"
                value={`₹${baseDueNow.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}
              />
              <SumRow
                label={`Due on ${fulfillment === 'pickup' ? 'pickup' : 'delivery'}`}
                value={`₹${dueOnReceipt.toLocaleString('en-IN')}`}
                valueColor={CX_INK_SOFT}
              />
            </>
          )}
          <div style={{ height: 1, background: CX_LINE, margin: '2px 0' }}/>
          <SumRow label={isAdvance
                    ? `Advance · ${advancePct}%`
                    : (useGold && goldApplied > 0 ? 'Payable now' : 'Total')}
                  value={`₹${finalPayNow.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}
                  bold/>
        </div>

        <div style={{
          padding: '14px 24px 4px',
          fontFamily: 'Manrope', fontSize: 10.5, color: CX_INK_SOFT, textAlign: 'center', lineHeight: 1.6,
        }}>
          By placing this order you agree to Sagar Jewellers' <u>Terms</u> and <u>Return Policy</u>.
        </div>
      </div>

      {/* ─── Residual voucher toast (above sticky CTA) ─── */}
      {residualToast && (
        <div style={{ padding: '0 18px 4px' }}>
          <SuccessBanner
            tone="voucher"
            title={`₹${residualToast.amount.toLocaleString('en-IN')} saved to your Voucher Wallet`}
            sub={`Your voucher exceeded this order — we stored the rest as ${residualToast.code}.`}
            action={{ label: 'View wallet', onClick: () => go('wallet-vouchers') }}
            onDismiss={() => setResidualToast(null)}
            timeout={6500}
          />
        </div>
      )}

      {/* ─── Sticky "Complete Purchase" CTA ─── */}
      <div style={{
        background: 'rgba(247,246,242,0.92)', backdropFilter: 'blur(12px)',
        padding: '10px 24px 16px',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
      }}>
        <button onClick={placeOrder} style={{
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

      <PanGateModal
        open={pan.open}
        pendingValue={total}
        panNumber={state.user.kyc?.pan}
        onSubmit={onPanUploaded}
        onCancel={() => { pan.closeGate(); setPendingPlace(false); }}
      />

      {placed && <PlacedSheet
                    total={useGold ? cashRemaining : total}
                    goldGm={goldGmApplied}
                    payLabel={fullyCoveredByGold ? 'digital gold' : payLabel(payMethod)}
                    addr={addr}
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

// Fulfillment option icon — truck for delivery, storefront for pickup
function FulfillIcon({ type }) {
  return (
    <div style={{
      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
      background: CX_CREAM,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: CX_ACCENT_DK,
    }}>
      {type === 'delivery' ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1.5" y="7" width="12" height="10" rx="1"/>
          <path d="M13.5 11h4.5l3 3v3h-7.5"/>
          <circle cx="6" cy="19" r="2"/>
          <circle cx="17" cy="19" r="2"/>
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10l1.6-5h14.8L21 10"/>
          <path d="M4.5 10v10h15V10"/>
          <path d="M9 20v-5h6v5"/>
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

function PlacedSheet({ onClose, total, payLabel, addr, goldGm }) {
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
          {goldGm > 0 && total === 0 ? (
            <>We&rsquo;ve deducted <b>{goldGm.toFixed(4)} g</b> from your digital gold vault to cover this order in full.</>
          ) : goldGm > 0 ? (
            <>Charged <b>₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b> to your {payLabel}, and <b>{goldGm.toFixed(4)} g</b> deducted from your gold vault.</>
          ) : (
            <>We&rsquo;ve charged <b>₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b> to your {payLabel}.</>
          )}
          {' '}Your pieces will arrive at <b>{addr?.city || 'your address'}</b> in 2–4 business days.
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

// ── Gold Redemption Card ─────────────────────────────────────────
function GoldRedemptionCard({
  ownedGm, sellRate, useGold,
  goldApplied, goldGmApplied, cashRemaining, total,
  onToggle,
}) {
  const vaultValue = Math.round(ownedGm * sellRate);
  const coveredPct = total > 0 ? Math.min(100, Math.round((goldApplied / total) * 100)) : 0;

  return (
    <div style={{
      background: useGold
        ? 'linear-gradient(180deg, #FBF7F1 0%, #F4EADD 100%)'
        : '#fff',
      borderRadius: 12,
      border: `1px solid ${useGold ? 'rgba(116,92,0,0.35)' : 'rgba(176,178,177,0.22)'}`,
      padding: '16px 18px 16px',
      display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'all 180ms ease',
    }}>
      {/* Header row: icon + label + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: CX_GOLD_TINT, color: CX_GOLD_DK,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9h14l-2 8H7z"/>
            <path d="M7 9l2-3h6l2 3"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: CX_INK,
          }}>Use my gold toward this order</div>
          <div style={{
            marginTop: 2,
            fontFamily: 'Manrope', fontSize: 11.5, color: CX_INK_SOFT,
          }}>
            Vault: {ownedGm.toFixed(4)} g &middot; ₹{vaultValue.toLocaleString('en-IN')} at today&rsquo;s sell rate
          </div>
        </div>
        <Switch on={useGold} onToggle={onToggle}/>
      </div>

      {/* Coverage readout (only when toggled on) */}
      {useGold && goldApplied > 0 && (
        <>
          <div style={{
            padding: '10px 12px', borderRadius: 10,
            background: '#fff', border: `1px solid rgba(116,92,0,0.18)`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Manrope', fontSize: 10.5, color: CX_GOLD_DK,
                letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700,
              }}>Applying from gold</div>
              <div style={{
                fontFamily: 'Manrope', fontWeight: 800, fontSize: 16,
                color: CX_INK, marginTop: 2,
              }}>
                ₹{Math.round(goldApplied).toLocaleString('en-IN')}
                <span style={{
                  fontSize: 11, fontWeight: 500, color: CX_INK_SOFT, marginLeft: 6,
                }}>· {goldGmApplied.toFixed(4)} g</span>
              </div>
            </div>
            <div style={{
              padding: '4px 10px', borderRadius: 999,
              background: CX_GOLD_TINT, color: CX_GOLD_DK,
              fontFamily: 'Manrope', fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
            }}>{coveredPct}% COVERED</div>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 4, borderRadius: 4, background: 'rgba(116,92,0,0.12)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${coveredPct}%`,
              background: CX_GOLD_DK, borderRadius: 4,
              transition: 'width 220ms ease',
            }}/>
          </div>

          {/* Split hint */}
          <div style={{
            fontFamily: 'Manrope', fontSize: 11.5, color: CX_INK_SOFT, lineHeight: 1.5,
          }}>
            {cashRemaining === 0 ? (
              <>Your gold covers this order in full — no card needed.</>
            ) : (
              <>Remaining <strong style={{ color: CX_INK }}>₹{cashRemaining.toLocaleString('en-IN')}</strong> will be charged to the payment method below.</>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Switch({ on, onToggle }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={on} style={{
      width: 46, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? CX_GOLD_DK : 'rgb(200,197,192)',
      position: 'relative', flexShrink: 0,
      transition: 'background 160ms ease',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 160ms ease',
      }}/>
    </button>
  );
}

// ── Advance Pay panel (split now / on receipt) ───────────────
function AdvancePayPanel({ total, pct, setPct, advanceAmount, dueOnReceipt, fulfillment }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #FBF7F1 0%, #F4EADD 100%)',
      borderRadius: 12,
      border: `1px solid rgba(116,92,0,0.25)`,
      padding: '14px 16px 16px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        fontFamily: 'Manrope', fontSize: 10.5, color: CX_GOLD_DK,
        letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 700,
      }}>How much to pay now?</div>

      <div style={{ display: 'flex', gap: 8 }}>
        {ADVANCE_PCT_CHIPS.map(p => {
          const on = pct === p;
          return (
            <button key={p} type="button" onClick={() => setPct(p)} style={{
              flex: 1, height: 44, borderRadius: 10, cursor: 'pointer',
              background: on ? '#fff' : 'rgba(255,255,255,0.55)',
              border: `1.5px solid ${on ? CX_GOLD_DK : 'rgba(116,92,0,0.18)'}`,
              color: on ? CX_GOLD_DK : CX_INK,
              boxShadow: on ? '0 2px 8px rgba(116,92,0,0.14)' : 'none',
              fontFamily: 'Manrope', fontSize: 14, fontWeight: 800,
              transition: 'all 160ms ease',
            }}>{p}%</button>
          );
        })}
      </div>

      <div style={{
        background: '#fff', borderRadius: 10, border: '1px solid rgba(116,92,0,0.16)',
        padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: CX_INK_SOFT, fontWeight: 600 }}>
            Pay now
          </span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 16, color: CX_GOLD_DK }}>
            ₹{advanceAmount.toLocaleString('en-IN')}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Manrope', fontSize: 11.5, color: CX_INK_SOFT, fontWeight: 600 }}>
            On {fulfillment === 'pickup' ? 'pickup' : 'delivery'}
          </span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: CX_INK }}>
            ₹{dueOnReceipt.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        fontFamily: 'Manrope', fontSize: 11, color: CX_INK_SOFT, lineHeight: 1.5,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CX_GOLD_DK}
             strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v5M12 16h.01"/>
        </svg>
        <span>
          The balance of <strong style={{ color: CX_INK }}>₹{dueOnReceipt.toLocaleString('en-IN')}</strong> will
          be collected when you {fulfillment === 'pickup' ? 'pick up' : 'receive'} your jewellery.
        </span>
      </div>
    </div>
  );
}

// ── Store Pickup dropdown (nearest stores, ranked by user's pincode) ─────
function StorePickupDropdown({ stores, selected, onSelect, open, onToggle, userPincode }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: `1px solid rgba(176,178,177,0.35)`,
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%', padding: '14px 16px', cursor: 'pointer',
          background: 'transparent', border: 'none', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: CX_CREAM, color: CX_ACCENT_DK,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s-7-6-7-12a7 7 0 0114 0c0 6-7 12-7 12z"/>
            <circle cx="12" cy="10" r="2.5"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Manrope', fontSize: 9.5, letterSpacing: 1.4,
            color: CX_INK_SOFT, textTransform: 'uppercase', fontWeight: 700,
          }}>Pickup store</div>
          <div style={{
            marginTop: 2,
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: CX_INK,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{selected.name}</div>
          <div style={{
            marginTop: 2,
            fontFamily: 'Manrope', fontSize: 11.5, color: CX_INK_SOFT,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{selected.area} · {selected.km} km away</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CX_INK_SOFT}
             strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
             style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{
          borderTop: `1px solid ${CX_LINE}`,
          background: CX_SOFT, maxHeight: 280, overflowY: 'auto',
        }}>
          {userPincode && (
            <div style={{
              padding: '10px 16px',
              fontFamily: 'Manrope', fontSize: 10.5, color: CX_INK_SOFT,
              letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
              borderBottom: `1px solid ${CX_LINE}`,
            }}>
              Nearest to {userPincode}
            </div>
          )}
          {stores.map((s, i) => {
            const active = s.id === selected.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                style={{
                  width: '100%', padding: '14px 16px', cursor: 'pointer',
                  background: active ? 'rgba(172,129,108,0.10)' : 'transparent',
                  border: 'none', textAlign: 'left',
                  borderBottom: i < stores.length - 1 ? `1px solid ${CX_LINE}` : 'none',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  transition: 'background 160ms ease',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontFamily: 'Manrope', fontWeight: 700, fontSize: 13,
                      color: active ? CX_ACCENT_DK : CX_INK,
                    }}>{s.name}</span>
                    {i === 0 && (
                      <span style={{
                        padding: '1px 7px', borderRadius: 50,
                        background: 'rgba(76,105,68,0.14)', color: '#4C6944',
                        fontFamily: 'Manrope', fontSize: 8.5, fontWeight: 800,
                        letterSpacing: 0.7, textTransform: 'uppercase',
                      }}>Nearest</span>
                    )}
                  </div>
                  <div style={{
                    marginTop: 2,
                    fontFamily: 'Manrope', fontSize: 11.5, color: CX_INK_SOFT,
                  }}>{s.area}</div>
                  <div style={{
                    marginTop: 2,
                    fontFamily: 'Manrope', fontSize: 10.5, color: CX_INK_SOFT,
                    letterSpacing: 0.4,
                  }}>Open {s.hours}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontFamily: 'Manrope', fontWeight: 700, fontSize: 13,
                    color: active ? CX_ACCENT_DK : CX_INK,
                  }}>{s.km} km</div>
                  {active && (
                    <div style={{
                      marginTop: 2,
                      width: 18, height: 18, borderRadius: '50%', marginLeft: 'auto',
                      background: CX_ACCENT_DK, color: '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.CheckoutPage = CheckoutPage;
