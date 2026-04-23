import React from 'react';
// Categories landing — reached from the bottom-nav "Categories" tab.
// Structure mirrors the reference mockup: header (title + wishlist + bag),
// Women/Men/Kids underlined tabs, "Top Categories" grid of tile cards.
// Each tile navigates to the Listing (product catalog) page.

const TC = window.JEWEL_TOKENS;
const { useState: useStateC } = React;

const TILES = {
  women: [
    { n: 'Rings',              img: 'assets/home/cat-rings.jpg',     tone: 'warm' },
    { n: 'Earrings',           img: 'assets/home/cat-earrings.png',  tone: 'cream' },
    { n: 'Bracelets & Bangles',img: 'assets/home/cat-bracelets.jpg', tone: 'warm' },
    { n: 'Solitaires',         tone: 'mist' },
    { n: '22KT',               tone: 'warm' },
    { n: 'Silver Collection',  tone: 'mist', highlight: true },
    { n: 'Mangalsutra',        tone: 'blush' },
    { n: 'Necklaces',          img: 'assets/home/cat-necklaces.jpg', tone: 'cream' },
    { n: 'Pendants',           img: 'assets/home/cat-pendants.jpg',  tone: 'blush' },
    { n: '9KT',                tone: 'warm' },
    { n: 'Gemstones',          tone: 'sage' },
    { n: 'More Jewellery',     tone: 'cream' },
  ],
  men: [
    { n: 'Rings',          tone: 'warm' },
    { n: 'Chains',         tone: 'cream' },
    { n: 'Bracelets',      img: 'assets/home/cat-bracelets.jpg', tone: 'warm' },
    { n: 'Kada',           tone: 'blush' },
    { n: '22KT',           tone: 'warm' },
    { n: '18KT',           tone: 'cream' },
    { n: 'Cufflinks',      tone: 'mist' },
    { n: 'Gemstones',      tone: 'sage' },
    { n: 'More Jewellery', tone: 'cream' },
  ],
  kids: [
    { n: 'Nazariya',       tone: 'blush' },
    { n: 'Bracelets',      img: 'assets/home/cat-bracelets.jpg', tone: 'warm' },
    { n: 'Earrings',       img: 'assets/home/cat-earrings.png', tone: 'cream' },
    { n: 'Pendants',       img: 'assets/home/cat-pendants.jpg', tone: 'blush' },
    { n: 'Rings',          img: 'assets/home/cat-rings.jpg',    tone: 'warm' },
    { n: 'Anklets',        img: 'assets/home/cat-anklets.jpg',  tone: 'sage' },
    { n: 'More Jewellery', tone: 'cream' },
  ],
};

const GENDERS = [
  { k: 'women', label: 'Women' },
  { k: 'men',   label: 'Men' },
  { k: 'kids',  label: 'Kids' },
];

function CategoriesPage({ go, state }) {
  const [gender, setGender] = useStateC('women');
  const tiles = TILES[gender];

  return (
    <>
      {/* ── Header ──────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px 8px', background: TC.bg,
      }}>
        <div style={{
          fontFamily: TC.serif, fontSize: 22, fontWeight: 600,
          color: TC.ink, letterSpacing: 0.2,
        }}>Categories</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => go('wishlist')} aria-label="Wishlist" style={iconBtnStyle}>
            <Icon.Heart width={18} height={18} style={{ color: TC.accent }}/>
            {state.wishlist && state.wishlist.length > 0 && (
              <span style={notifDot}/>
            )}
          </button>
          <button onClick={() => go('notifications')} aria-label="Notifications" style={iconBtnStyle}>
            <Icon.Bell width={18} height={18} style={{ color: TC.accent }}/>
            <span style={notifDot}/>
          </button>
        </div>
      </div>

      {/* ── Gender tabs (underlined) ────────────── */}
      <div style={{
        display: 'flex', alignItems: 'stretch', padding: '0 8px',
        background: TC.bg, borderBottom: `1px solid ${TC.lineSoft}`,
      }}>
        {GENDERS.map(g => {
          const active = g.k === gender;
          return (
            <button key={g.k} onClick={() => setGender(g.k)} style={{
              flex: 1, padding: '12px 0 10px', background: 'none', border: 'none', cursor: 'pointer',
              position: 'relative',
              fontFamily: TC.sans, fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? TC.accent : TC.inkSoft,
              letterSpacing: 0.2,
            }}>
              {g.label}
              <span style={{
                position: 'absolute', left: '22%', right: '22%', bottom: -1, height: 3,
                borderRadius: 2,
                background: active ? TC.accent : 'transparent',
                transition: 'background 180ms ease',
              }}/>
            </button>
          );
        })}
      </div>

      {/* ── Scrollable grid ──────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: TC.bgSoft,
        padding: '18px 14px 22px',
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: TC.serif, fontSize: 17, fontWeight: 500,
          color: TC.ink, letterSpacing: 0.3,
          marginBottom: 14,
        }}>Top Categories</div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gridAutoRows: '72px', gap: 12,
        }}>
          {tiles.map(t => (
            <CategoryCard
              key={t.n}
              name={t.n} img={t.img} tone={t.tone} highlight={t.highlight}
              onClick={() => go('listing')}
            />
          ))}
        </div>

        {/* Divider label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          marginTop: 20, marginBottom: 14,
          fontFamily: TC.sans, fontSize: 11, color: TC.inkSoft,
          letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
        }}>
          <span style={{ flex: 1, height: 1, background: TC.lineSoft, maxWidth: 60 }}/>
          <span>Sagar · Collections</span>
          <span style={{ flex: 1, height: 1, background: TC.lineSoft, maxWidth: 60 }}/>
        </div>

        {/* Promo banner */}
        <button onClick={() => go('listing')} style={{
          width: '100%', height: 120, padding: 0, border: 'none', cursor: 'pointer',
          borderRadius: 16, overflow: 'hidden',
          position: 'relative',
          background: `linear-gradient(100deg, ${TC.accentDk} 0%, ${TC.accent} 55%, ${TC.accentLt} 100%)`,
          boxShadow: '0 8px 22px rgba(142,101,81,0.3)',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{ padding: '14px 20px', textAlign: 'left', color: '#fff' }}>
            <div style={{
              fontFamily: TC.sans, fontSize: 10, letterSpacing: 2.5,
              fontWeight: 700, opacity: 0.85,
            }}>SAGAR JEWELLERS</div>
            <div style={{
              fontFamily: TC.serif, fontSize: 26, fontWeight: 600, marginTop: 4,
              letterSpacing: 1,
            }}>DIAMONDS</div>
            <div style={{
              fontFamily: TC.sans, fontSize: 11, marginTop: 4, opacity: 0.9, letterSpacing: 0.3,
            }}>Lab-grown · Certified · Heirloom</div>
          </div>
          {/* Decorative sparkle ornaments */}
          <svg style={{ position: 'absolute', right: 12, top: 18, opacity: 0.28 }}
               width="90" height="90" viewBox="0 0 90 90" fill="none">
            <g stroke="#fff" strokeWidth="0.8">
              <circle cx="45" cy="45" r="22"/>
              <circle cx="45" cy="45" r="32"/>
              {[...Array(8)].map((_, i) => {
                const a = (i * 45) * Math.PI / 180;
                const x1 = 45 + Math.cos(a) * 22;
                const y1 = 45 + Math.sin(a) * 22;
                const x2 = 45 + Math.cos(a) * 32;
                const y2 = 45 + Math.sin(a) * 32;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
              })}
            </g>
          </svg>
        </button>
      </div>
    </>
  );
}

function CategoryCard({ name, img, tone, highlight, onClick }) {
  const tones = {
    warm:  ['#E9DCC9', '#E2D2BC'],
    cream: ['#F2EADD', '#EBE1D1'],
    blush: ['#EED9CC', '#E6CDBA'],
    sage:  ['#D9DFCE', '#C9D1BC'],
    mist:  ['#D7D9D4', '#C5C8BF'],
  };
  const [a, b] = tones[tone] || tones.warm;

  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: highlight ? '#FBF6EE' : TC.card,
      borderRadius: 14, padding: '0 12px',
      border: highlight ? `1px solid ${TC.accentLt}` : 'none',
      cursor: 'pointer', textAlign: 'left',
      boxShadow: highlight ? '0 4px 14px rgba(175,130,109,0.18)' : TC.shadowCard,
      height: 72, boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10, flexShrink: 0,
        background: img
          ? `url(${img}) center / cover no-repeat, ${a}`
          : `repeating-linear-gradient(45deg, ${a} 0 8px, ${b} 8px 16px)`,
      }}/>
      <div style={{
        flex: 1, minWidth: 0,
        fontFamily: TC.sans, fontSize: 13, fontWeight: 700,
        color: TC.ink, letterSpacing: 0.1, lineHeight: 1.2,
        display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{name}</div>
      <Icon.Chevron width={13} height={13} style={{ color: TC.accent, flexShrink: 0 }}/>
    </button>
  );
}

const iconBtnStyle = {
  position: 'relative',
  width: 40, height: 40, borderRadius: 10,
  background: TC.card, border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: TC.shadowCard,
};

const notifDot = {
  position: 'absolute', top: 6, right: 6,
  width: 8, height: 8, borderRadius: '50%',
  background: TC.accent,
  border: `1.5px solid ${TC.card}`,
};

window.CategoriesPage = CategoriesPage;
