import React from 'react';
// Wishlist page — grid of saved items + move-to-cart
const TW = window.JEWEL_TOKENS;

function WishlistPage({ go, state, setState }) {
  const [tab, setTab] = React.useState('all');
  const cats = [
    { key: 'all',       label: 'All' },
    { key: 'rings',     label: 'Rings' },
    { key: 'necklaces', label: 'Necklaces' },
    { key: 'earrings',  label: 'Earrings' },
    { key: 'bracelets', label: 'Bracelets' },
  ];
  const items = state.wishlist.filter(p => tab === 'all' ? true : p.cat === tab);

  function removeItem(id) {
    setState(s => ({ ...s, wishlist: s.wishlist.filter(w => w.id !== id) }));
  }
  function moveToBag(id) {
    setState(s => ({
      ...s,
      wishlist: s.wishlist.filter(w => w.id !== id),
      cart: [...s.cart, s.wishlist.find(w => w.id === id)],
    }));
  }

  return (
    <>
      <TopBar title="Wishlist" onBack={() => go('profile')} />

      {/* Category scroller */}
      <div style={{ padding: '2px 18px 10px' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {cats.map(c => {
            const active = tab === c.key;
            return (
              <button key={c.key} onClick={() => setTab(c.key)} style={{
                padding: '8px 16px', borderRadius: 999, border: 'none',
                background: active ? TW.ink : 'transparent',
                color: active ? '#fff' : TW.inkSoft,
                fontFamily: TW.sans, fontSize: 12, fontWeight: 600,
                whiteSpace: 'nowrap', cursor: 'pointer',
                border: active ? 'none' : `1px solid ${TW.line}`,
              }}>{c.label}</button>
            );
          })}
        </div>
      </div>

      {/* count */}
      <div style={{ padding: '0 22px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: TW.serif, fontSize: 20, color: TW.accent }}>
          {items.length} saved piece{items.length !== 1 ? 's' : ''}
        </span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: TW.inkSoft, fontFamily: TW.sans, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          Sort
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 30px' }}>
        {items.length === 0 ? (
          <EmptyWishlist go={go} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {items.map(p => (
              <WishCard key={p.id} p={p} onRemove={() => removeItem(p.id)} onMove={() => moveToBag(p.id)} go={go} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function WishCard({ p, onRemove, onMove, go }) {
  return (
    <div style={{ background: TW.card, borderRadius: 18, overflow: 'hidden', boxShadow: TW.shadowCard, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative' }}>
        <Placeholder label={p.cat} h={160} tone={p.tone} radius={0} />
        <button onClick={onRemove} aria-label="Remove" style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, borderRadius: '50%',
          background: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: TW.accent, boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}><Icon.HeartFill width={16} height={16}/></button>
        {p.tag && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            padding: '3px 8px', borderRadius: 4,
            background: 'rgba(42,39,36,0.85)', color: '#fff',
            fontFamily: TW.sans, fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
          }}>{p.tag}</div>
        )}
      </div>
      <div style={{ padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <div style={{ fontFamily: TW.serif, fontSize: 15, color: TW.ink, lineHeight: 1.15 }}>{p.name}</div>
        <div style={{ fontFamily: TW.sans, fontSize: 11, color: TW.inkSoft }}>{p.metal}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <span style={{ fontFamily: TW.sans, fontSize: 14, color: TW.ink, fontWeight: 700 }}>
            ₹{p.price.toLocaleString('en-IN')}
          </span>
          {p.mrp && (
            <span style={{ fontFamily: TW.sans, fontSize: 11, color: TW.inkMuted, textDecoration: 'line-through' }}>
              ₹{p.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <button onClick={onMove} style={{
          marginTop: 8, width: '100%', padding: '8px 0', borderRadius: 8,
          background: TW.accentBg, border: 'none', cursor: 'pointer',
          color: TW.accentDk, fontFamily: TW.sans, fontSize: 10.5, fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase',
        }}>Move to Bag</button>
      </div>
    </div>
  );
}

function EmptyWishlist({ go }) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: TW.accentBg, color: TW.accent,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}><Icon.Heart width={30} height={30}/></div>
      <h3 style={{ margin: 0, fontFamily: TW.serif, fontSize: 22, color: TW.ink }}>Nothing saved yet</h3>
      <p style={{ fontFamily: TW.sans, fontSize: 13, color: TW.inkSoft, marginTop: 6 }}>
        Tap the heart on a piece you love and it'll live here.
      </p>
      <div style={{ marginTop: 16 }}>
        <Btn variant="primary" onClick={() => go('categories')}>Explore catalogue</Btn>
      </div>
    </div>
  );
}

window.WishlistPage = WishlistPage;
