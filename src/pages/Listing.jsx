import React from 'react';
// Listing / Explore page — based on Figma "Listing Page"
// Top: back + "Explore" title + bell. Search pill with brown filter chip.
// Horizontal category pills. 2-col grid of product cards w/ wishlist-style image,
// name, EXCLUSIVE/COLLECTION label, price, and small brown bag FAB per card.

const LS = window.JEWEL_TOKENS;
const LS_BG = 'rgb(247,246,242)';
const LS_ACCENT = 'rgb(175,130,109)';
const LS_ACCENT_DK = 'rgb(119,88,66)';
const LS_GOLD = 'rgb(115,92,0)';

function ListingPage({ go }) {
  const cats = ['All', 'Necklaces', 'Rings', 'Bracelets', 'Earrings', 'Anklets'];
  const [cat, setCat] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState(null);

  const products = [
    { name: 'Butterfly Whispers', tag: 'EXCLUSIVE',    price: 56000, tone: 'blush', cat: 'Necklaces', img: 'assets/product/product-1.png' },
    { name: 'Celestial Drops',    tag: 'NEW',          price: 42800, tone: 'cream', cat: 'Earrings',  img: 'assets/product/product-2.png' },
    { name: 'Halo Solitaire',     tag: 'COLLECTION',   price: 96800, tone: 'warm',  cat: 'Rings',     img: 'assets/product/chip-1.jpg' },
    { name: 'Orbit Cuff',         tag: 'EXCLUSIVE',    price: 72400, tone: 'sage',  cat: 'Bracelets', img: 'assets/product/chip-2.jpg' },
    { name: 'Monogram Pendant',   tag: 'SIGNATURE',    price: 18400, tone: 'warm',  cat: 'Necklaces', img: 'assets/product/chip-3.jpg' },
    { name: 'Pebble Stack Ring',  tag: 'BEST SELLER',  price: 22900, tone: 'mist',  cat: 'Rings',     img: 'assets/product/product-1.png' },
  ];

  const filtered = products.filter(p =>
    (cat === 'All' || p.cat === cat) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: LS_BG, minHeight: 0 }}>
      {/* Top bar: back + title + bell */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px' }}>
        <button onClick={() => go('home')} aria-label="Back" style={{
          width: 44, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{ fontFamily: `'Noto Serif', ${LS.serif}`, fontSize: 20, color: '#000' }}>Explore</div>
        <button aria-label="Notifications" onClick={() => go('notifications')} style={{
          width: 44, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 2px rgba(58,42,28,0.05)',
        }}>
          <Icon.Bell width={18} height={18}/>
        </button>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 24px' }}>
        {/* Search pill with filter chip */}
        <div style={{
          position: 'relative', background: '#fff', borderRadius: 50, height: 53,
          display: 'flex', alignItems: 'center', padding: '4px 4px 4px 20px', gap: 10,
          boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>
          </svg>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: `'Manrope', ${LS.sans}`, fontSize: 15, color: '#000', letterSpacing: 0.5,
            }}/>
          <button aria-label="Filter" onClick={() => setFilterOpen(true)} style={{
            width: 45, height: 45, borderRadius: '50%', background: LS_ACCENT, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            position: 'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M7 12h10M10 18h4"/>
            </svg>
            {filters && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 18, height: 18, borderRadius: '50%', background: '#2F3430', color: '#fff',
                fontFamily: `'Manrope', ${LS.sans}`, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff',
              }}>{filterCount(filters)}</span>
            )}
          </button>
        </div>

        {/* Category chips */}
        <div style={{
          display: 'flex', gap: 8, marginTop: 18, overflowX: 'auto',
          paddingBottom: 6,
        }}>
          {cats.map(c => {
            const active = c === cat;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                flexShrink: 0, padding: '9px 18px', borderRadius: 999,
                background: active ? LS_ACCENT : '#fff',
                color: active ? '#fff' : '#2F3430',
                border: active ? 'none' : `1px solid rgba(115,92,0,0.15)`,
                fontFamily: `'Manrope', ${LS.sans}`, fontSize: 13, fontWeight: active ? 700 : 500,
                letterSpacing: 0.3, cursor: 'pointer',
                boxShadow: active ? '0 4px 12px rgba(119,88,66,0.2)' : 'none',
              }}>{c}</button>
            );
          })}
        </div>

        {/* Result count */}
        <div style={{
          marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          fontFamily: `'Manrope', ${LS.sans}`, fontSize: 12, color: 'rgb(107,92,84)',
        }}>
          <span>{filtered.length} piece{filtered.length !== 1 ? 's' : ''} · {cat}</span>
          <span style={{ letterSpacing: 1.2, fontWeight: 700, color: LS_ACCENT_DK }}>SORT · NEWEST</span>
        </div>

        {/* 2-col product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
          {filtered.map((p, i) => (
            <ProductCard key={i} p={p} onClick={() => go('product')}/>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            marginTop: 40, textAlign: 'center',
            fontFamily: `'Manrope', ${LS.sans}`, fontSize: 14, color: 'rgb(107,92,84)',
          }}>No pieces match "{query}".</div>
        )}
      </div>

      {/* Filter sheet */}
      <FilterSheet
        open={filterOpen}
        initial={filters}
        onApply={(f) => setFilters(f)}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
}

function filterCount(f) {
  if (!f) return 0;
  return (
    (f.min !== 500 || f.max !== 25000 ? 1 : 0) +
    (f.metalColors?.length || 0) +
    (f.purity?.length || 0) +
    (f.shape?.length || 0) +
    (f.clarity?.length || 0) +
    (f.certs?.length || 0)
  );
}

function ProductCard({ p, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 16, padding: 12, position: 'relative',
      boxShadow: '0 1px 5px rgba(0,0,0,0.08)', cursor: 'pointer',
    }}>
      {/* Image tile */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden',
        border: `1px solid rgba(115,92,0,0.25)`,
        background: `url(${p.img}) center / cover no-repeat, linear-gradient(135deg, #F2EADD, #EBE1D1)`,
      }}>
        {/* heart chip top-right */}
        <div style={{
          position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%',
          background: 'rgba(255,248,239,0.85)', border: `1px dashed rgba(115,92,0,0.35)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <svg width="12" height="11" viewBox="0 0 24 22" fill="none" stroke={LS_GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-8-5-8-12a5 5 0 019-3 5 5 0 019 3c0 7-8 12-8 12H12z"/>
          </svg>
        </div>
      </div>

      {/* Name + tag + price + bag */}
      <div style={{ marginTop: 12, position: 'relative' }}>
        <div style={{
          fontFamily: `'Noto Serif', ${LS.serif}`, fontWeight: 700, fontSize: 14, color: 'rgb(30,27,19)',
          lineHeight: 1.3, paddingRight: 32,
        }}>{p.name}</div>
        <div style={{
          marginTop: 2,
          fontFamily: `'Manrope', ${LS.sans}`, fontSize: 10, letterSpacing: 0.9, color: 'rgb(69,70,82)',
        }}>{p.tag}</div>
        <div style={{
          marginTop: 6,
          fontFamily: `'Noto Serif', ${LS.serif}`, fontWeight: 700, fontSize: 14, color: LS_GOLD,
        }}>₹{p.price.toLocaleString('en-IN')}</div>

        {/* small bag FAB, bottom-right of text block */}
        <button
          onClick={(e) => { e.stopPropagation(); }}
          aria-label="Add to bag"
          style={{
            position: 'absolute', bottom: -6, right: 0, width: 30, height: 30, borderRadius: 6,
            background: LS_ACCENT, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
          }}
        >
          <Icon.Bag width={14} height={14} style={{ color: '#fff' }}/>
        </button>
      </div>
    </div>
  );
}

window.ListingPage = ListingPage;
