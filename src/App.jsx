import React from 'react';
// Main app — state + router + mini pages used as stubs (Home / Categories / Cart / Coupons / Track)
const TM = window.JEWEL_TOKENS;
const { useState, useEffect } = React;
// It starts Here
// Seed data
const SEED = {
  user: {
    name: 'Sakshi Singh',
    email: 'sakshi.singh@google.com',
    phone: '+91 (555) 123-4567',
    memberSince: 2021,
    initials: 'SS',
  },
  orders: [
    { id: 'AUR-2814', date: '14 Apr 2026', status: 'shipped', eta: '22 Apr',
      total: 48900,
      items: [{ name: 'Lumière solitaire ring', cat: 'ring', tone: 'blush' }] },
    { id: 'AUR-2771', date: '02 Apr 2026', status: 'delivered',
      total: 22400,
      items: [
        { name: 'Opaline drop earrings', cat: 'earrings', tone: 'cream' },
        { name: 'Monogram signet pendant', cat: 'necklace', tone: 'warm' },
      ] },
    { id: 'AUR-2540', date: '18 Feb 2026', status: 'delivered',
      total: 134500,
      items: [{ name: 'Bridal vine choker', cat: 'necklace', tone: 'blush' }] },
    { id: 'AUR-2410', date: '09 Jan 2026', status: 'cancelled',
      total: 8900,
      items: [{ name: 'Pebble stacking band', cat: 'ring', tone: 'sage' }] },
  ],
  wishlist: [
    { id: 'w1', name: 'Halo pear diamond ring', cat: 'rings', tone: 'blush', metal: '18k rose gold · 0.42ct', price: 96800, mrp: 102400, tag: 'new' },
    { id: 'w2', name: 'Cascade tennis necklace',  cat: 'necklaces', tone: 'cream', metal: '18k white gold', price: 184000, tag: null },
    { id: 'w3', name: 'Opaline huggies',           cat: 'earrings', tone: 'mist',  metal: '14k yellow gold', price: 24900, mrp: 27500, tag: 'back in stock' },
    { id: 'w4', name: 'Pebble cuff',               cat: 'bracelets', tone: 'sage', metal: '18k yellow gold', price: 62400, tag: null },
    { id: 'w5', name: 'Lumière solitaire',         cat: 'rings', tone: 'cream',   metal: '14k rose gold · 0.30ct', price: 48900, mrp: null, tag: 'low stock' },
    { id: 'w6', name: 'Monogram signet',           cat: 'necklaces', tone: 'warm',  metal: '14k yellow gold', price: 18400, tag: null },
  ],
  addresses: [
    { id: 'a1', tag: 'home', isDefault: true, name: 'Sakshi Singh',
      line1: 'Flat 402, Aria Residences', line2: '18 Cavalry Road, Richards Town',
      city: 'Bengaluru, KA', pincode: '560005', phone: '+91 98452 33412' },
    { id: 'a2', tag: 'work', isDefault: false, name: 'Sakshi Singh',
      line1: 'Level 11, Prestige Orion', line2: '27 MG Road',
      city: 'Bengaluru, KA', pincode: '560001', phone: '+91 98452 33412' },
    { id: 'a3', tag: 'other', isDefault: false, name: 'Mrs. Rekha Singh',
      line1: 'Plot 27, Lane 4, Vasant Vihar', line2: 'Opp. Saket Park',
      city: 'New Delhi, DL', pincode: '110057', phone: '+91 98100 22341' },
  ],
  loyalty: {
    tier: 'Sagar Gold',
    completed: 6,
    monthly: 8000,
    nextAt: '28 Apr 2026',
    registered: false,
    autopay: { enabled: false },
    ledger: [
      { label: 'March instalment',    date: 'Paid 28 Mar 2026', amount: 8000, status: 'paid' },
      { label: 'February instalment', date: 'Paid 28 Feb 2026', amount: 8000, status: 'paid' },
      { label: 'January instalment',  date: 'Paid 28 Jan 2026', amount: 8000, status: 'paid' },
      { label: 'December instalment', date: 'Paid 28 Dec 2025', amount: 8000, status: 'paid' },
    ],
  },
  cart: [
    { id: 'c1', name: 'Lumière solitaire ring',   cat: 'ring',      tone: 'blush', metal: '18k rose gold · 0.42ct lab-grown', size: 'US 6', price: 48900, mrp: 54800, making: 2400, qty: 1 },
    { id: 'c2', name: 'Opaline drop earrings',    cat: 'earrings',  tone: 'cream', metal: '14k yellow gold · opal',           price: 22400, making: 1600, qty: 1 },
    { id: 'c3', name: 'Monogram signet pendant',  cat: 'necklace',  tone: 'warm',  metal: '14k yellow gold · 16" chain',      price: 18400, mrp: 20900, making: 1200, qty: 1 },
  ],
  giftWrap: true,
  cartCoupon: { code: 'SAGAR10', value: 4890 },
};

function App() {
  const initial = (() => {
    try { return JSON.parse(localStorage.getItem('jewel_state_v3')) || SEED; }
    catch { return SEED; }
  })();
  const [state, setState] = useState(initial);

  const [page, setPage] = useState(() => localStorage.getItem('jewel_page_v1') || 'home');
  const [transition, setTransition] = useState(null);

  useEffect(() => {
    localStorage.setItem('jewel_state_v3', JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    localStorage.setItem('jewel_page_v1', page);
  }, [page]);

  function go(p) {
    if (p === page) return;
    setTransition(p);
    setTimeout(() => {
      setPage(p);
      setTransition(null);
    }, 180);
  }
  window.__go = go;

  const pageProps = { go, state, setState };

  let content;
  switch (page) {
    case 'login':      content = <LoginPage     {...pageProps}/>; break;
    case 'listing':    content = <ListingPage   {...pageProps}/>; break;
    case 'categories': content = <ListingPage   {...pageProps}/>; break;
    case 'product':    content = <ProductPage   {...pageProps}/>; break;
    case 'profile':    content = <ProfilePage   {...pageProps}/>; break;
    case 'orders':     content = <OrdersPage    {...pageProps}/>; break;
    case 'order-details': content = <OrderDetailsPage {...pageProps}/>; break;
    case 'wishlist':   content = <WishlistPage  {...pageProps}/>; break;
    case 'addresses':  content = <AddressesPage {...pageProps}/>; break;
    case 'loyalty':    content = <LoyaltyPage   {...pageProps}/>; break;
    case 'loyalty-register': content = <LoyaltyRegisterPage {...pageProps}/>; break;
    case 'home':       content = <HomePage      {...pageProps}/>; break;
    case 'store':      content = <StoreLocatorPage {...pageProps}/>; break;
    case 'schemes':    content = <GoldSchemesPage  {...pageProps}/>; break;
    case 'book':       content = <BookMyGoldPage   {...pageProps}/>; break;
    case 'calc':       content = <CalculatorPage   {...pageProps}/>; break;
    case 'refer':      content = <ReferPage        {...pageProps}/>; break;
    case 'cart':       content = <CartPage      {...pageProps}/>; break;
    case 'checkout':   content = <CheckoutPage  {...pageProps}/>; break;
    case 'coupons':    content = <CouponsPage   {...pageProps}/>; break;
    case 'track':      content = <TrackStub     {...pageProps}/>; break;
    case 'notifications': content = <NotificationsPage {...pageProps}/>; break;
    case 'search':     content = <SearchPage    {...pageProps}/>; break;
    default:           content = <HomePage      {...pageProps}/>;
  }

  const navKey = {
    home: 'home', categories: 'categories',
    loyalty: 'loyalty', profile: 'profile',
  }[page];

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'linear-gradient(180deg, #EAE0D2 0%, #E1D4C1 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
      fontFamily: TM.sans,
    }}>
      <div data-screen-label={`App - ${page}`}>
        <Phone>
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
            opacity: transition ? 0 : 1,
            transform: transition ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 180ms ease, transform 180ms ease',
          }}>
            {content}
          </div>
          {page !== 'login' && page !== 'product' && page !== 'checkout' && page !== 'loyalty-register' && (
            <BottomNav current={navKey} go={go}/>
          )}
          {/* gesture pill */}
          <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: TM.bg }}>
            <div style={{ width: 108, height: 4, borderRadius: 2, background: TM.ink, opacity: 0.35 }}/>
          </div>
        </Phone>
      </div>
    </div>
  );
}

// ─── Lightweight stubs for non-core screens (still navigable) ─────
function StubShell({ title, go, children, back = 'profile' }) {
  return (
    <>
      <TopBar title={title} onBack={() => go(back)} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 30px' }}>{children}</div>
    </>
  );
}

function HomeStub({ go, state }) {
  return (
    <StubShell title="Sagar Jewellers" go={go} back="profile">
      <div style={{ fontFamily: TM.serif, fontSize: 28, color: TM.ink, lineHeight: 1.15 }}>
        Hello, {state.user.name.split(' ')[0]}.
      </div>
      <div style={{ fontFamily: TM.sans, fontSize: 13, color: TM.inkSoft, marginTop: 6 }}>
        Pieces picked for your week.
      </div>

      <div style={{ marginTop: 16 }}><Placeholder label="editorial hero" h={180} tone="blush" radius={18}/></div>

      <SectionTitleRow title="Shop by occasion"/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {['Everyday', 'Bridal', 'Gifting', 'Statement'].map((l, i) => (
          <div key={l} style={{ background: TM.card, borderRadius: 14, padding: 12, boxShadow: TM.shadowCard }}>
            <Placeholder label={l.toLowerCase()} h={80} tone={['warm', 'blush', 'cream', 'sage'][i]} radius={10}/>
            <div style={{ fontFamily: TM.serif, fontSize: 15, marginTop: 8, color: TM.ink }}>{l}</div>
          </div>
        ))}
      </div>

      <SectionTitleRow title="New this week"/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {state.wishlist.slice(0, 4).map(p => (
          <div key={p.id} style={{ background: TM.card, borderRadius: 14, overflow: 'hidden', boxShadow: TM.shadowCard }}>
            <Placeholder label={p.cat} h={110} tone={p.tone} radius={0}/>
            <div style={{ padding: 10 }}>
              <div style={{ fontFamily: TM.serif, fontSize: 14, color: TM.ink }}>{p.name}</div>
              <div style={{ fontFamily: TM.sans, fontSize: 12, color: TM.ink, fontWeight: 700, marginTop: 4 }}>₹{p.price.toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
      </div>
    </StubShell>
  );
}

function SectionTitleRow({ title }) {
  return (
    <h3 style={{ margin: '22px 0 12px', fontFamily: TM.serif, fontSize: 20, fontWeight: 500, color: TM.accent }}>{title}</h3>
  );
}

function CategoriesStub({ go }) {
  const cats = [
    { n: 'Rings', tone: 'blush' }, { n: 'Necklaces', tone: 'cream' },
    { n: 'Earrings', tone: 'warm' }, { n: 'Bracelets', tone: 'sage' },
    { n: 'Bridal',  tone: 'blush' }, { n: 'Men',       tone: 'mist' },
  ];
  return (
    <StubShell title="Categories" go={go} back="home">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {cats.map(c => (
          <div key={c.n} style={{ background: TM.card, borderRadius: 16, overflow: 'hidden', boxShadow: TM.shadowCard }}>
            <Placeholder label={c.n.toLowerCase()} h={130} tone={c.tone} radius={0}/>
            <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: TM.serif, fontSize: 16, color: TM.ink }}>{c.n}</span>
              <Icon.Chevron width={14} height={14} style={{ color: TM.accent }}/>
            </div>
          </div>
        ))}
      </div>
    </StubShell>
  );
}

function CartStub({ go, state }) {
  const empty = state.cart.length === 0;
  return (
    <StubShell title="Your Bag" go={go} back="home">
      {empty ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: TM.accentBg, color: TM.accent,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}><Icon.Bag width={28} height={28}/></div>
          <h3 style={{ margin: 0, fontFamily: TM.serif, fontSize: 22, color: TM.ink }}>Your bag is empty</h3>
          <p style={{ fontFamily: TM.sans, fontSize: 13, color: TM.inkSoft, marginTop: 6 }}>Your saved pieces are waiting in your wishlist.</p>
          <div style={{ marginTop: 14 }}><Btn variant="primary" onClick={() => go('wishlist')}>Go to Wishlist</Btn></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {state.cart.map((p, i) => (
            <div key={i} style={{ background: TM.card, borderRadius: 14, padding: 14, boxShadow: TM.shadowCard, display: 'flex', gap: 12 }}>
              <Placeholder label={p.cat} w={72} h={72} tone={p.tone} radius={10}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TM.serif, fontSize: 15, color: TM.ink }}>{p.name}</div>
                <div style={{ fontFamily: TM.sans, fontSize: 11, color: TM.inkSoft, marginTop: 2 }}>{p.metal}</div>
                <div style={{ fontFamily: TM.sans, fontSize: 14, color: TM.ink, fontWeight: 700, marginTop: 6 }}>₹{p.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
          <Btn variant="primary" full style={{ marginTop: 8 }}>Proceed to Checkout</Btn>
        </div>
      )}
    </StubShell>
  );
}

function CouponsStub({ go }) {
  const coupons = [
    { code: 'SAGAR10', desc: '10% off your next order', exp: '30 Apr 2026' },
    { code: 'MAKING100', desc: 'Waived making charges up to ₹5,000', exp: '15 May 2026' },
    { code: 'FIRSTPAIR', desc: '₹2,500 off first earring pair', exp: '12 Jun 2026' },
  ];
  return (
    <StubShell title="Coupons" go={go}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {coupons.map(c => (
          <div key={c.code} style={{
            position: 'relative', background: TM.card, borderRadius: 14, padding: 16,
            boxShadow: TM.shadowCard,
            display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: TM.accentBg, color: TM.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.Tag width={20} height={20}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TM.serif, fontSize: 17, color: TM.ink }}>{c.desc}</div>
              <div style={{ fontFamily: TM.sans, fontSize: 11, color: TM.inkSoft, marginTop: 4 }}>Valid until {c.exp}</div>
            </div>
            <div style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11,
              color: TM.accent, padding: '6px 10px', border: `1px dashed ${TM.accentLt}`, borderRadius: 6,
            }}>{c.code}</div>
          </div>
        ))}
      </div>
    </StubShell>
  );
}

function TrackStub({ go }) {
  return (
    <StubShell title="Track Order" go={go} back="orders">
      <div style={{ background: TM.card, padding: 18, borderRadius: 18, boxShadow: TM.shadowCard }}>
        <div style={{ fontFamily: TM.sans, fontSize: 11, color: TM.inkMuted, letterSpacing: 1, fontWeight: 600 }}>ORDER · AUR-2814</div>
        <div style={{ fontFamily: TM.serif, fontSize: 22, color: TM.ink, marginTop: 4 }}>Arriving by 22 Apr</div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { t: 'Order placed', d: '14 Apr, 10:12 AM', done: true },
            { t: 'Packed & inspected', d: '15 Apr, 4:30 PM', done: true },
            { t: 'Shipped from studio', d: '16 Apr, 9:00 AM', done: true },
            { t: 'In transit', d: 'Currently in Bengaluru hub', done: false, active: true },
            { t: 'Out for delivery', d: 'Est. 22 Apr', done: false },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%', marginTop: 4,
                background: s.done ? TM.accent : (s.active ? TM.accentBg : TM.bgSoft),
                border: `2px solid ${s.done || s.active ? TM.accent : TM.line}`,
                boxShadow: s.active ? `0 0 0 4px ${TM.accentBg}` : 'none', flexShrink: 0,
              }}/>
              <div>
                <div style={{ fontFamily: TM.sans, fontSize: 13.5, fontWeight: 600, color: s.done || s.active ? TM.ink : TM.inkMuted }}>{s.t}</div>
                <div style={{ fontFamily: TM.sans, fontSize: 12, color: TM.inkSoft, marginTop: 2 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StubShell>
  );
}

window.App = App;

