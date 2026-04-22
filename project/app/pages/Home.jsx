// Homepage — based on Sagar Jewellers Figma
// Sections: Greeting header · Search · Gold/Silver rate ticker · Category chips ·
//           New Arrivals banner + carousel · Best Seller banner + carousel ·
//           Bridal offer · For Her / For Him · Our Special grid · Shop by Color

const TH = window.JEWEL_TOKENS;
const ACCENT = 'rgb(175,130,109)';   // brown from figma
const ACCENT_DK = 'rgb(119,88,66)';
const BG = 'rgb(247,246,242)';
const CREAM_PEACH = 'rgb(255,220,198)';

function HomePage({ go, state }) {
  const user = state.user;
  const rates = [
    { k: 'Current Gold', t: '24KT (995)', v: '₹12,450/gm' },
    { k: 'Current Gold', t: '22KT (916)', v: '₹11,400/gm' },
    { k: 'Current Gold', t: '18KT (750)', v: '₹9,340/gm' },
    { k: 'Fine Silver',  t: 'Silver 999', v: '₹248/gm' },
  ];
  const [rateIdx, setRateIdx] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setRateIdx(i => (i + 1) % rates.length), 2800);
    return () => clearInterval(t);
  }, []);

  const cats = [
    { n: 'Rings',     img: 'assets/home/cat-rings.jpg' },
    { n: 'Necklaces', img: 'assets/home/cat-necklaces.jpg' },
    { n: 'Bracelets', img: 'assets/home/cat-bracelets.jpg' },
    { n: 'Earrings',  img: 'assets/home/cat-earrings.png' },
    { n: 'Anklets',   img: 'assets/home/cat-anklets.jpg' },
    { n: 'Pendants',  img: 'assets/home/cat-pendants.jpg' },
  ];

  const newArrivals = [
    { name: 'Butterfly Whispers',   price: 56000, tone: 'blush', cat: 'earrings',  img: 'assets/products/na-hero.png', tag: 'EXCLUSIVE' },
    { name: 'Celestial Hoops',      price: 12000, tone: 'warm',  cat: 'earrings',  img: 'assets/products/earrings.png',   tag: 'NEW' },
    { name: 'Emerald Majesty',      price: 248000,tone: 'sage',  cat: 'ring',      img: 'assets/products/emerald-ring.jpg', tag: 'HEIRLOOM' },
    { name: 'Dawn Charm Bracelet',  price: 14200, tone: 'cream', cat: 'bracelet',  img: 'assets/products/bracelet.jpg' },
  ];

  const bestSellers = [
    { name: 'Luna Pearl Ring',      price: 3500,  tone: 'blush', cat: 'ring',      img: 'assets/products/bs-hero.jpg' },
    { name: 'Celeste Solitaire',    price: 96800, tone: 'warm',  cat: 'ring',      img: 'assets/products/ring.jpg' },
    { name: 'Cascade Necklace',     price: 184000,tone: 'cream', cat: 'necklace',  img: 'assets/home/cat-necklaces.jpg' },
    { name: 'Orbit Bracelet',       price: 14200, tone: 'sage',  cat: 'bracelet',  img: 'assets/products/bracelet.jpg' },
  ];

  const specials = [
    { name: 'Celestial Hoops',  price: 120000, img: 'assets/home/special-hoops.png',  ratio: 168 / 210 },
    { name: 'Starlight Bangle', price: 72000,  img: 'assets/home/special-bangle.jpg', ratio: 168 / 210 },
    { name: 'Forest Ring',      price: 240000, img: 'assets/home/special-ring.jpg',   ratio: 168 / 210 },
    { name: 'Starlight Bangle', price: 720000, img: 'assets/home/special-bangle.jpg', ratio: 168 / 210 },
  ];

  const colorChips = [
    { n: 'Yellow Gold', c: '#E3B24A' },
    { n: 'Rose Gold',   c: '#D99080' },
    { n: 'White Gold',  c: '#E4E4E0' },
    { n: 'Shop by Color', c: null },
  ];

  return (
    <>
      {/* ── Greeting header ──────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 10px' }}>
        <button onClick={() => setDrawerOpen(true)} style={{
          width: 44, height: 44, borderRadius: 8, background: '#fff',
          border: 'none', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(47,52,48,0.08)',
        }} aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F3430" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="20" y2="7"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="17" x2="20" y2="17"/>
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: `'Noto Serif', ${TH.serif}`, fontWeight: 700, fontSize: 16, color: '#000' }}>Welcome Back</div>
          <div style={{ fontFamily: `'Manrope', ${TH.sans}`, fontSize: 13, letterSpacing: 0.5, color: '#000', marginTop: 3 }}>{user.name.split(' ')[0]}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button style={{
            width: 44, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="WhatsApp">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="#25D366">
              <path d="M16.003 3C8.82 3 3 8.82 3 16c0 2.29.6 4.52 1.74 6.49L3 29l6.69-1.75A12.92 12.92 0 0 0 16 29C23.18 29 29 23.18 29 16S23.18 3 16.003 3zm0 23.6c-1.98 0-3.92-.53-5.63-1.53l-.4-.24-3.97 1.04 1.06-3.87-.26-.4A10.56 10.56 0 0 1 5.4 16c0-5.85 4.76-10.6 10.6-10.6S26.6 10.15 26.6 16s-4.76 10.6-10.6 10.6zm5.87-7.94c-.32-.16-1.9-.94-2.19-1.04-.29-.1-.5-.16-.72.16s-.82 1.04-1 1.26c-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.63-.53-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.23 3.4 5.41 4.77 1.9.82 2.64.89 3.59.75.58-.09 1.9-.77 2.17-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z"/>
            </svg>
          </button>
          <button style={{
            width: 44, height: 44, borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Notifications" onClick={() => go('notifications')}><Icon.Bell width={18} height={18}/></button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>

        {/* ── Search bar ─────────────────────── */}
        <div style={{ padding: '8px 15px 14px' }}>
          <button onClick={() => go('search')} style={{
            position: 'relative', height: 53, width: '100%', borderRadius: 50, background: '#fff',
            display: 'flex', alignItems: 'center', padding: '0 4px 0 20px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.05)',
            border: 'none', cursor: 'pointer', textAlign: 'left',
          }} aria-label="Open search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(31,31,31)" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <span style={{ flex: 1, paddingLeft: 12, fontFamily: `'Manrope', ${TH.sans}`, fontSize: 15, color: '#000', letterSpacing: 0.5 }}>Search</span>
            <div style={{
              width: 45, height: 45, borderRadius: '50%', background: 'rgba(115,92,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(115,92,0,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>
              </svg>
            </div>
          </button>
        </div>

        {/* ── Gold/Silver rate card ──────────── */}
        <div style={{ padding: '0 15px 18px' }}>
          <div style={{
            height: 119, borderRadius: 10, background: ACCENT,
            boxShadow: '0 2px 20px rgba(175,130,109,0.5)',
            display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <ArrowBtn dir="left"  onClick={() => setRateIdx(i => (i - 1 + rates.length) % rates.length)}/>
            <div style={{ flex: 1, textAlign: 'center', color: '#fff', padding: '0 8px' }}>
              <div style={{ fontFamily: `'Noto Serif', ${TH.serif}`, fontSize: 13, letterSpacing: 1, marginBottom: 6, opacity: 0.9 }}>{rates[rateIdx].k}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14 }}>
                <span style={{ fontFamily: `'Manrope', ${TH.sans}`, fontSize: 15, opacity: 0.85, letterSpacing: 0.5 }}>{rates[rateIdx].t}</span>
                <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.4)' }}/>
                <span style={{ fontFamily: `'Noto Serif', ${TH.serif}`, fontSize: 22, fontWeight: 500 }}>{rates[rateIdx].v}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                {rates.map((_, i) => (
                  <span key={i} style={{
                    width: i === rateIdx ? 18 : 6, height: 6, borderRadius: 3,
                    background: 'rgba(255,255,255,' + (i === rateIdx ? 0.95 : 0.45) + ')',
                    transition: 'width 200ms',
                  }}/>
                ))}
              </div>
            </div>
            <ArrowBtn dir="right" onClick={() => setRateIdx(i => (i + 1) % rates.length)}/>
          </div>
        </div>

        {/* ── Category chips ─────────────────── */}
        <div style={{ padding: '0 15px 20px' }}>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {cats.map(c => (
              <button key={c.n} onClick={() => go('listing', { cat: c.n })} style={{
                background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 66,
              }}>
                <div style={{
                  width: 55, height: 55, borderRadius: '50%', background: '#fff',
                  backgroundImage: c.img ? `url(${c.img})` : undefined,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  display: c.img ? 'block' : 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {!c.img && <Placeholder label={c.n.toLowerCase()} w={55} h={55} tone={c.tone} radius={28}/>}
                </div>
                <span style={{ fontFamily: `'Manrope', ${TH.sans}`, fontSize: 12, fontWeight: 500, color: '#000', textAlign: 'center', letterSpacing: 0.5 }}>{c.n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Banner carousel (separate from New Arrivals) ── */}
        <BannerCarousel/>

        {/* ── New Arrivals ───────────────────── */}
        <SectionHeadH title="New Arrivals"/>
        <HorizontalRail items={newArrivals} go={go}/>

        {/* ── 10+1 Gold Plan banner ────────────── */}
        <div style={{ padding: '14px 15px 2px' }}>
          <button onClick={() => go('loyalty')} style={{
            display: 'block', width: '100%', border: 'none', padding: 0, cursor: 'pointer',
            background: `url(assets/home/banner-10plus1.png) center / cover no-repeat`,
            height: 150, borderRadius: 10,
            boxShadow: '0 4px 12px rgba(47,52,48,0.08)',
          }} aria-label="10+1 Gold Plan"/>
        </div>

        {/* ── Best Seller ─────────────────────── */}
        <SectionHeadH title="Best Seller"/>
        <HorizontalRail items={bestSellers} go={go}/>

        {/* ── Bridal season offer ────────────── */}
        <div style={{ padding: '16px 18px 4px' }}>
          <div style={{
            borderRadius: 17, background: CREAM_PEACH, padding: '30px 34px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ fontFamily: `'Manrope', ${TH.sans}`, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: ACCENT_DK }}>
              LIMITED TIME
            </div>
            <div style={{ fontFamily: `'Noto Serif', ${TH.serif}`, fontSize: 26, lineHeight: 1.2, color: ACCENT_DK, fontWeight: 500 }}>
              Bridal Season<br/>Exclusive
            </div>
            <div style={{ fontFamily: `'Manrope', ${TH.sans}`, fontSize: 13, color: ACCENT_DK, lineHeight: 1.5, opacity: 0.85 }}>
              Enjoy a complimentary diamond cleaning kit and 15% off on matching wedding bands.
            </div>
            <button style={{
              alignSelf: 'flex-start', padding: '9px 22px', border: `1.1px solid ${ACCENT_DK}`,
              background: 'transparent', cursor: 'pointer',
              fontFamily: `'Manrope', ${TH.sans}`, fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
              color: ACCENT_DK,
            }}>REDEEM OFFER</button>
          </div>
        </div>

        {/* ── For Her / For Him ──────────────── */}
        <div style={{ padding: '18px 15px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { t: 'FOR HER', img: 'assets/home/for-her.jpg' },
            { t: 'FOR HIM', img: 'assets/home/for-him.jpg' },
          ].map(x => (
            <div key={x.t} style={{
              height: 180, borderRadius: 13, position: 'relative', overflow: 'hidden',
              backgroundImage: `url(${x.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }}/>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <span style={{
                  fontFamily: `'Epilogue', ${TH.sans}`, fontWeight: 700, fontSize: 22,
                  letterSpacing: 2.2, color: 'rgb(255,246,242)',
                }}>{x.t}</span>
                <div style={{
                  padding: '5px 14px 4px', border: '1.1px solid rgb(255,246,242)',
                  fontFamily: `'Manrope', ${TH.sans}`, fontWeight: 700, fontSize: 11,
                  letterSpacing: 1.1, color: 'rgb(255,246,242)',
                }}>SHOP NOW</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Our Special ─────────────────────── */}
        <SectionHeadH title="Our Special" centered/>
        <div style={{
          padding: '0 16px 22px',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          columnGap: 16, rowGap: 22,
        }}>
          {specials.map((s, i) => (
            <SpecialCard key={i} item={s}/>
          ))}
        </div>

        {/* ── Shop by Color ───────────────────── */}
        <SectionHeadH title="Shop by Color"/>
        <div style={{
          padding: '0 15px 28px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        }}>
          {[
            { name: 'Yellow Gold', dot: 'linear-gradient(135deg, #FFD86A 0%, #D69419 60%, #9A6A13 100%)' },
            { name: 'Rose Gold',   dot: 'linear-gradient(135deg, #FADAC5 0%, #D88971 60%, #8C4A38 100%)' },
            { name: 'White Gold',  dot: 'linear-gradient(135deg, #FFFFFF 0%, #D4D6D2 60%, #8A8D89 100%)' },
          ].map(c => (
            <ColorShopCard key={c.name} name={c.name} dot={c.dot}/>
          ))}
        </div>

      </div>
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} go={go} user={user}/>
    </>
  );
}

function SectionHeadH({ title, centered }) {
  return (
    <div style={{
      padding: '20px 15px 12px',
      display: 'flex', alignItems: 'center',
      justifyContent: centered ? 'center' : 'space-between',
      position: 'relative',
    }}>
      <h3 style={{ margin: 0, fontFamily: `'Noto Serif', ${TH.serif}`, fontSize: 20, color: '#000', fontWeight: 500 }}>{title}</h3>
      {!centered && (
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: `'Manrope', ${TH.sans}`, fontSize: 12, color: '#000', letterSpacing: 0.5,
        }}>See All</button>
      )}
    </div>
  );
}

function HorizontalRail({ items, go }) {
  return (
    <div style={{ padding: '0 0 18px' }}>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 15px 8px' }}>
        {items.map((p, i) => (
          <div key={i}
            onClick={() => go && go('product')}
            role="button" tabIndex={0}
            style={{
              flexShrink: 0, width: 150, background: '#fff', borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden',
              cursor: 'pointer',
            }}>
            {p.img ? (
              <div style={{
                width: '100%', height: 150,
                backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                backgroundColor: '#FAF9F6',
              }}/>
            ) : (
              <Placeholder label={p.cat} h={150} tone={p.tone} radius={0}/>
            )}
            <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                fontFamily: `'Noto Serif', ${TH.serif}`, fontSize: 14, color: '#2F3430',
                fontWeight: 700, lineHeight: 1.25,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden', textOverflow: 'ellipsis',
                minHeight: `${Math.round(14 * 1.25 * 2)}px`,
              }}>{p.name}</div>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 8,
              }}>
                <div style={{
                  fontFamily: `'Manrope', ${TH.sans}`, fontSize: 12.5, color: ACCENT_DK, fontWeight: 700,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>₹{p.price.toLocaleString('en-IN')}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  aria-label="Add to bag"
                  style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: '#AF826D', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(175,130,109,0.25)',
                  }}
                >
                  <Icon.Bag width={13} height={13} style={{ color: '#fff' }}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowBtn({ dir, onClick }) {
  return (
    <button onClick={onClick} aria-label={dir} style={{
      width: 28, height: 44, background: 'none', border: 'none', cursor: 'pointer',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="10" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'right' ? 'rotate(180deg)' : 'none' }}>
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  );
}

window.HomePage = HomePage;

// ── Our Special card: image with aspect ratio + serif name + brown price ──
function SpecialCard({ item }) {
  return (
    <div>
      <div style={{
        width: '100%', aspectRatio: String(item.ratio),
        borderRadius: 12, overflow: 'hidden',
        backgroundImage: `url(${item.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundColor: '#FAF9F6',
      }}/>
      <div style={{
        fontFamily: `'Noto Serif', ${TH.serif}`, fontWeight: 700, fontSize: 14.5,
        color: 'rgb(47,52,48)', marginTop: 12, lineHeight: 1.4,
      }}>{item.name}</div>
      <div style={{
        fontFamily: `'Manrope', ${TH.sans}`, fontWeight: 700, fontSize: 12.5,
        color: ACCENT_DK, marginTop: 4,
      }}>₹{item.price.toLocaleString('en-IN')}</div>
    </div>
  );
}

// ── Shop-by-Color card: notched image tile + color dot + gold pill + labels ──
function ColorShopCard({ name, dot }) {
  // Notch cut-out matches Figma Group 12 path (140×127 viewBox)
  // A 47-wide semicircle notch is carved into the bottom-center so the color dot sits into it.
  const notchPath =
    "M 130.21 0 C 135.617 0 140 4.383 140 9.79 L 140 117.482 " +
    "C 140 122.889 135.617 127.272 130.21 127.272 L 93.004 127.272 " +
    "C 93.005 127.194 93.007 127.116 93.007 127.037 " +
    "C 93.007 114.331 82.487 104.03 69.511 104.03 " +
    "C 56.534 104.03 46.014 114.331 46.014 127.037 " +
    "C 46.014 127.116 46.016 127.194 46.017 127.272 " +
    "L 9.79 127.272 C 4.383 127.272 0 122.889 0 117.482 " +
    "L 0 9.79 C 0 4.383 4.383 0 9.79 0 L 130.21 0 Z";

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Notched image tile */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '140 / 127.272' }}>
        <svg viewBox="0 0 140 127.272" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <clipPath id={`clip-${name.replace(/\s/g, '')}`}>
              <path d={notchPath}/>
            </clipPath>
          </defs>
          <image
            href="assets/home/color-card-bg.jpg"
            x="0" y="0" width="140" height="127.272"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-${name.replace(/\s/g, '')})`}
          />
        </svg>
        {/* Color dot sitting in the notch */}
        <div style={{
          position: 'absolute',
          left: '50%', bottom: -8, transform: 'translateX(-50%)',
          width: '24%', aspectRatio: '1',
          borderRadius: '50%', background: dot,
          boxShadow:
            'inset -3px -4px 6px rgba(0,0,0,0.22), ' +
            'inset 3px 3px 5px rgba(255,255,255,0.55), ' +
            '0 3px 6px rgba(0,0,0,0.18)',
        }}/>
      </div>

      {/* Gold gradient pill under the card */}
      <div style={{
        width: '69%', height: 15, marginTop: 14,
        borderRadius: '0 0 50px 50px',
        background: 'linear-gradient(180deg, rgb(250,216,118) 0%, rgb(148,128,70) 100%)',
        boxShadow: '0 2px 4px rgba(148,128,70,0.3)',
      }}/>

      {/* 18KT Gold subtitle */}
      <div style={{
        marginTop: 10,
        fontFamily: `'Noto Serif', serif`, fontSize: 8,
        color: '#000', letterSpacing: '0.9px', textTransform: 'uppercase',
      }}>18KT Gold</div>

      {/* Color name */}
      <div style={{
        marginTop: 4,
        fontFamily: `'Manrope', sans-serif`, fontSize: 14, color: '#000',
      }}>{name}</div>
    </div>
  );
}

function BannerCarousel() {
  const slides = [
    { img: 'assets/home/banner-new-arrivals.png' },
    { img: 'assets/home/banner-bestseller.png' },
    { img: 'assets/home/for-her.jpg' },
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 3600);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: '6px 15px 14px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          height: 160, borderRadius: 12,
          backgroundImage: `url(${slides[idx].img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
          transition: 'background-image 300ms ease',
        }}/>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 10,
          display: 'flex', justifyContent: 'center', gap: 6,
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
              width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: 'none', cursor: 'pointer',
              background: i === idx ? '#fff' : 'rgba(255,255,255,0.55)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
              padding: 0, transition: 'width 220ms',
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}
