import React from 'react';
// Product detail page — restructured layout:
//   1. Top (Hero): large main image + thumbnail gallery (angles)
//   2. Product Details: title, price, badges, variant rows, description
//      — single CTA: "Virtual Try On"
//   3. Sticky bottom nav: Price (left) + Add to Cart (right)

const PS_BG       = 'rgb(247,246,242)';
const PS_ACCENT   = 'rgb(172,129,108)';
const PS_ACCENT_DK= 'rgb(119,88,66)';
const PS_TILE     = 'rgba(206,178,167,0.2)';
const PS_INK      = 'rgb(47,52,48)';
const PS_SOFT     = 'rgb(92,96,92)';
const PS_LINE     = 'rgba(175,179,174,0.35)';

const FS = {
  serif: `'Noto Serif', 'Cormorant Garamond', Georgia, serif`,
  sans:  `'Manrope', 'Nunito Sans', system-ui, sans-serif`,
};

function ProductPage({ go, state, setState }) {
  const [colorIdx, setColorIdx]   = React.useState(1);
  const [sizeIdx, setSizeIdx]     = React.useState(1);
  const [weightIdx, setWeightIdx] = React.useState(2);
  const [caratIdx, setCaratIdx]   = React.useState(0);
  const [saved, setSaved]         = React.useState(false);
  const [imgIdx, setImgIdx]       = React.useState(0);

  const defaultAddr = (state?.addresses || []).find(a => a.isDefault) || (state?.addresses || [])[0];
  const [pincode, setPincode]         = React.useState(defaultAddr?.pincode || '');
  const [pincodeResult, setPinResult] = React.useState(null);

  function checkPincode() {
    const p = pincode.trim();
    if (!/^\d{6}$/.test(p)) {
      setPinResult({ error: 'Please enter a valid 6-digit pincode.' });
      return;
    }
    // Mocked service check — certain ranges are unavailable for demo
    const first = parseInt(p[0], 10);
    if (first === 9) {
      setPinResult({ error: `We currently don't deliver to ${p}. Try another pincode.` });
      return;
    }
    const cities = {
      1: 'New Delhi', 2: 'Jaipur', 3: 'Ahmedabad',
      4: 'Mumbai', 5: 'Hyderabad', 6: 'Chennai',
      7: 'Kolkata', 8: 'Guwahati',
    };
    const d = new Date();
    d.setDate(d.getDate() + 3 + (parseInt(p[5], 10) % 3));
    const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const cod = first !== 8; // demo: cash-on-delivery unavailable in far east
    setPinResult({
      available: true, city: cities[first] || 'your city', date, cod,
    });
  }

  const colors  = [
    { c: 'rgb(199,198,194)', n: 'White Gold' },
    { c: 'rgb(244,201,192)', n: 'Rose Gold' },
    { c: 'rgb(228,190,110)', n: 'Yellow Gold' },
    { c: 'rgb(239,239,235)', n: 'Platinum' },
  ];
  const colorsMore = ['Two-Tone Gold', '18kt Rose Gold', '22kt Yellow Gold'];
  const weights = ['0.3', '0.4', '0.5'];
  const weightsMore = ['0.6', '0.7', '0.8', '1.0'];
  const sizes   = ['3', '4', '5'];
  const sizesMore = ['6', '7', '8', '9', '10', '11', '12'];
  const carats  = ['0.5', '0.6'];
  const caratsMore = ['0.75', '1.0', '1.25', '1.5', '2.0'];

  const [openMenu, setOpenMenu] = React.useState(null);
  React.useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openMenu]);

  // Gallery — main + 3 thumbnails (reusing companion imagery as alt angles)
  const gallery = [
    'assets/product/hero-fig.png',
    'assets/product/comp-studs.jpg',
    'assets/product/comp-necklace.jpg',
    'assets/product/comp-bracelet.jpg',
  ];

  function addToCart() {
    setState(s => ({ ...s, cart: [...s.cart, {
      id: 'c-' + Date.now(),
      name: 'Diamond Earring',
      cat: 'earring', tone: 'gold',
      metal: `14kt ${colors[colorIdx].n} · ${carats[caratIdx]}ct`,
      size: `US ${sizes[sizeIdx]}`,
      price: 120000, making: 1400, qty: 1,
    }] }));
    go('cart');
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: PS_BG, minHeight: 0, overflowY: 'auto', position: 'relative',
    }}>
      {/* ───────── Top bar (solid, above hero) ───────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 15px', background: PS_BG,
      }}>
        <button onClick={() => go(state._prev || 'products')} aria-label="Back" style={navBtnSolid}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{ fontFamily: FS.serif, fontSize: 20, color: '#000' }}>Product Details</div>
        <button onClick={() => setSaved(s => !s)} aria-label="Wishlist" style={navBtnSolid}>
          <svg width="20" height="18" viewBox="0 0 24 22" fill={saved ? PS_ACCENT : 'none'}
               stroke={saved ? PS_ACCENT : '#000'} strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-8-5-8-12a5 5 0 019-3 5 5 0 019 3c0 7-8 12-8 12H12z"/>
          </svg>
        </button>
      </div>

      {/* ───────── 1. HERO: large image + thumbnail gallery ───────── */}
      <div style={{ padding: '0 15px' }}>
        {/* Main image */}
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '1 / 1',
          borderRadius: 20, overflow: 'hidden',
          background: `url(${gallery[imgIdx]}) center / cover no-repeat, #F1EBE3`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          {/* dot indicators */}
          <div style={{
            position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6,
          }}>
            {gallery.map((_, i) => (
              <div key={i} style={{
                width: i === imgIdx ? 22 : 7, height: 7, borderRadius: 999,
                background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.6)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                transition: 'width 160ms ease',
              }}/>
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {gallery.map((src, i) => (
            <button key={i} onClick={() => setImgIdx(i)} aria-label={`View ${i + 1}`} style={{
              flex: 1, aspectRatio: '1 / 1', borderRadius: 12, padding: 0,
              border: i === imgIdx ? `2px solid ${PS_ACCENT_DK}` : `1px solid ${PS_LINE}`,
              background: `url(${src}) center / cover no-repeat, #F1EBE3`,
              cursor: 'pointer', overflow: 'hidden',
              boxShadow: i === imgIdx ? '0 2px 8px rgba(119,88,66,0.2)' : 'none',
            }}/>
          ))}
        </div>
      </div>

      {/* ───────── 2. PRODUCT DETAILS ───────── */}
      <div style={{ padding: '24px 18px 0' }}>
        {/* Eyebrow + title */}
        <div style={{
          fontFamily: FS.sans, fontSize: 10, letterSpacing: 2,
          color: PS_ACCENT_DK, fontWeight: 700,
        }}>BLOOM COLLECTION · DIAMOND</div>
        <h2 style={{
          margin: '6px 0 0', fontFamily: FS.serif, fontSize: 26, fontWeight: 600,
          color: PS_INK, letterSpacing: -0.3, lineHeight: 1.15,
        }}>Diamond Earring</h2>

        {/* Price + badges */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: FS.serif, fontWeight: 700, fontSize: 22, color: PS_ACCENT_DK,
          }}>₹56,000</span>
          <span style={{
            fontFamily: FS.sans, fontSize: 13, color: 'rgb(154,144,133)',
            textDecoration: 'line-through',
          }}>₹80,000</span>
          <Pill bg="rgba(94,122,85,0.14)" fg="#4F6B44">SAVE 30%</Pill>
          <Pill bg="rgba(94,122,85,0.14)" fg="#4F6B44">In Stock</Pill>
        </div>

        {/* Short description */}
        <p style={{
          margin: '14px 0 0', fontFamily: FS.sans, fontSize: 13, lineHeight: 1.65,
          color: PS_SOFT,
        }}>
          A hand-set cushion halo in 14kt yellow gold, surrounded by 18 pear-cut
          diamonds arranged in a floral silhouette. Certified conflict-free stones,
          cold-forged band, 40+ artisan hours per piece.
        </p>

        {/* Variant rows */}
        <VariantRow label="Material" value={colors[colorIdx].n}>
          {colors.map((c, i) => (
            <button key={i} onClick={() => setColorIdx(i)} aria-label={c.n} style={{
              width: 36, height: 36, borderRadius: 6, background: c.c,
              border: i === colorIdx ? `2px solid ${PS_ACCENT_DK}` : `1px solid rgba(0,0,0,0.08)`,
              cursor: 'pointer', padding: 0,
              boxShadow: i === colorIdx ? '0 2px 6px rgba(119,88,66,0.25)' : 'none',
            }}/>
          ))}
          <MoreTile open={openMenu === 'material'} onOpen={() => setOpenMenu(m => m === 'material' ? null : 'material')}
                    options={colorsMore} onPick={n => setOpenMenu(null)}/>
        </VariantRow>

        <VariantRow label="Size" value={`US ${sizes[sizeIdx]}`}>
          {sizes.map((s, i) => (
            <VariantChip key={s} active={i === sizeIdx} onClick={() => setSizeIdx(i)}>{s}</VariantChip>
          ))}
          <MoreTile open={openMenu === 'size'} onOpen={() => setOpenMenu(m => m === 'size' ? null : 'size')}
                    options={sizesMore} onPick={n => setOpenMenu(null)}/>
        </VariantRow>

        <VariantRow label="Weight Range (gm)" value={`${weights[weightIdx]} gm`}>
          {weights.map((w, i) => (
            <VariantChip key={w} active={i === weightIdx} onClick={() => setWeightIdx(i)}>{w}</VariantChip>
          ))}
          <MoreTile open={openMenu === 'weight'} onOpen={() => setOpenMenu(m => m === 'weight' ? null : 'weight')}
                    options={weightsMore} onPick={n => setOpenMenu(null)}/>
        </VariantRow>

        <VariantRow label="Diamond Carat (ct)" value={`${carats[caratIdx]} ct`}>
          {carats.map((ct, i) => (
            <VariantChip key={ct} active={i === caratIdx} onClick={() => setCaratIdx(i)}>{ct}</VariantChip>
          ))}
          <MoreTile open={openMenu === 'carat'} onOpen={() => setOpenMenu(m => m === 'carat' ? null : 'carat')}
                    options={caratsMore} onPick={n => setOpenMenu(null)}/>
        </VariantRow>

        {/* Single CTA: Virtual Try On */}
        <button style={{
          marginTop: 22, width: '100%', height: 52, borderRadius: 50, background: '#fff',
          border: `2px solid ${PS_ACCENT}`, cursor: 'pointer',
          fontFamily: FS.sans, fontWeight: 700, fontSize: 14, color: PS_ACCENT_DK,
          letterSpacing: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}>
          <svg width="18" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="13" rx="2"/>
            <circle cx="12" cy="12.5" r="3.5"/>
            <path d="M8 6l1.5-2h5L16 6"/>
          </svg>
          Virtual Try On
        </button>
      </div>

      {/* ───────── Check Delivery (pincode availability) ───────── */}
      <Section title="Check Delivery">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 14,
          padding: '6px 6px 6px 16px',
          border: `1px solid ${PS_LINE}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}>
          <svg width="18" height="22" viewBox="0 0 24 24" fill="none" stroke={PS_ACCENT_DK}
               strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 22s-7-6-7-12a7 7 0 0114 0c0 6-7 12-7 12z"/>
            <circle cx="12" cy="10" r="2.5"/>
          </svg>
          <input
            type="text" inputMode="numeric"
            value={pincode}
            onChange={e => {
              setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (pincodeResult) setPinResult(null);
            }}
            placeholder="Enter delivery pincode"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: FS.sans, fontSize: 14, fontWeight: 600, color: PS_INK,
              padding: '12px 0', minWidth: 0,
              letterSpacing: 0.3,
            }}
          />
          <button onClick={checkPincode} disabled={pincode.length < 6} style={{
            height: 44, padding: '0 20px', borderRadius: 10, border: 'none',
            background: pincode.length < 6 ? 'rgba(172,129,108,0.4)' : PS_ACCENT,
            color: '#fff', cursor: pincode.length < 6 ? 'not-allowed' : 'pointer',
            fontFamily: FS.sans, fontWeight: 700, fontSize: 12, letterSpacing: 1,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Check</button>
        </div>

        {pincodeResult && (
          pincodeResult.error ? (
            <div style={{
              marginTop: 12, padding: '12px 14px', borderRadius: 10,
              background: 'rgba(164,68,59,0.08)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A4443B"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 7v6M12 17h.01"/>
              </svg>
              <span style={{
                fontFamily: FS.sans, fontSize: 12.5, color: '#A4443B', fontWeight: 600,
              }}>{pincodeResult.error}</span>
            </div>
          ) : (
            <div style={{
              marginTop: 12, padding: 14, borderRadius: 10,
              background: 'rgba(94,122,85,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F6B44"
                     strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12l3 3 5-6"/>
                </svg>
                <div style={{
                  fontFamily: FS.sans, fontSize: 13, fontWeight: 700,
                  color: '#4F6B44',
                }}>Delivery available in {pincodeResult.city}</div>
              </div>
              <div style={{
                marginTop: 6, paddingLeft: 28,
                fontFamily: FS.sans, fontSize: 12, color: PS_SOFT, lineHeight: 1.55,
              }}>
                Estimated arrival by <strong style={{ color: PS_INK }}>{pincodeResult.date}</strong>
                {' · '}{pincodeResult.cod ? 'Cash-on-delivery available' : 'Prepaid only'}
              </div>
            </div>
          )
        )}
      </Section>

      {/* ───────── Our Certifications ───────── */}
      <Section title="Our Certifications">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <CertTile label={'BIS\nHallmark'} icon={
            <svg width="28" height="26" viewBox="0 0 32 30" fill="none">
              <path d="M16 2l10 6v8c0 7-5 11-10 12-5-1-10-5-10-12V8l10-6z"
                    fill={PS_ACCENT} opacity="0.95"/>
              <path d="M11 15l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          }/>
          <CertTile label={'Timeless\nLuxury'} icon={
            <svg width="30" height="26" viewBox="0 0 32 28" fill="none">
              <path d="M6 4h20l-4 6h-12L6 4zM10 10h12l-6 16-6-16z"
                    fill="none" stroke={PS_ACCENT} strokeWidth="1.7" strokeLinejoin="round"/>
            </svg>
          }/>
          <CertTile label={'Crafted\nTo Last'} icon={
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={PS_ACCENT}
                 strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="16" cy="16" r="11"/>
              <path d="M16 9v7l4.5 3"/>
            </svg>
          }/>
          <CertTile label={'Certified\nJewellery'} icon={
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke={PS_ACCENT}
                 strokeWidth="1.8" strokeLinejoin="round">
              <path d="M16 3l3.8 3.4 5-0.5 1 5 4.2 3-2.4 4.5 1.1 5-5 1.5-2.3 4.5-5-1.5L12 30l-2.3-4.5-5-1.5 1.1-5L3.4 14.4l4.2-3 1-5 5 0.5L16 3z"/>
              <path d="M11 16l3.2 3 6-6.5" strokeLinecap="round"/>
            </svg>
          }/>
        </div>
      </Section>

      {/* ───────── About Product ───────── */}
      <Panel title="About Product" defaultOpen>
        <EyebrowBlock eyebrow="THE ART OF SELECTION">
          Every stone begins its journey through a rigorous selection process. We source
          only conflict-free diamonds that exhibit exceptional "fire" and "scintillation".
          The 2.5-carat cushion-cut center stone is hand-selected by our master gemologists
          for its rare symmetry and light-refracting properties.
        </EyebrowBlock>
        <div style={{ height: 18 }}/>
        <EyebrowBlock eyebrow="HERITAGE CRAFTSMANSHIP">
          The band is a testament to timeless techniques, sculpted from solid 18k gold
          that has been cold-forged for superior density and durability. Our artisans
          spend over 40 hours on a single piece, ensuring that the hidden halo is perfectly
          aligned to catch light from angles the eye rarely observes.
        </EyebrowBlock>
      </Panel>

      {/* ───────── Product Specification ───────── */}
      <Panel title="Product Specification">
        <SubSection eyebrow="PRODUCT DETAILS">
          <SpecCard rows={[
            ['SKU', 'AR814E'],
            ['Style', 'Diamond Ring'],
            ['Gross Weight', '0.056gm'],
            ['Collection', 'Rings'],
          ]}/>
        </SubSection>
        <SubSection eyebrow="GEMSTONE DETAILS">
          <SpecCard rows={[
            ['TOTAL WEIGHT', '0.6D Ct'],
            ['TOTAL NO. OF STONES', '2'],
            ['SHAPE', 'Round'],
            ['CLARITY', 'SI'],
            ['COLOR', 'White'],
            ['CUT–Polish–Symmetry', 'Min. VG - VG - VG'],
          ]}/>
        </SubSection>
        <SubSection eyebrow="METAL DETAILS">
          <SpecCard rows={[
            ['METAL DETAIL', 'Gold Plated'],
            ['Metal Purity', '14kt'],
            ['Metal Color', 'Yellow Gold'],
            ['Net Weight', '0.032gm'],
          ]}/>
        </SubSection>
        <SubSection eyebrow="DIAMOND DETAILS">
          <SpecCard rows={[
            ['CARAT WEIGHT', '2.5ct Center Stone'],
            ['CLARITY GRADE', 'VS1 (Very Slightly Included)'],
            ['COLOR SCALE', 'D - F (Colorless)'],
            ['MATERIAL', '18k Yellow Gold / 950 Platinum'],
            ['Diamond Type', 'Lab Grown'],
            ['Diamond Shape', 'Round Cut'],
            ['Origin', 'India'],
          ]}/>
        </SubSection>
      </Panel>

      {/* ───────── Price Breakup ───────── */}
      <Panel title="Price Breakup" defaultOpen>
        <SubSection eyebrow="GOLD">
          <BreakupTable
            rows={[
              { component: '9 KT Yellow Gold', rate: '₹ 5,783',  rateUnit: '/g',  weight: '2.950 g', discount: '-',    value: '₹ 17,060' },
              { component: 'Making Charges',   rate: '₹ 3,350',  rateUnit: '/g',  weight: '2.950 g', discount: '100%', value: '₹ 0' },
            ]}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 12, padding: '10px 14px',
            background: 'rgba(175,129,108,0.08)', borderRadius: 10,
          }}>
            <span style={{
              fontFamily: FS.sans, fontSize: 11.5, fontWeight: 700,
              color: PS_INK, letterSpacing: 0.4,
            }}>Total Gold Value</span>
            <span style={{
              fontFamily: FS.sans, fontSize: 13, fontWeight: 800, color: PS_ACCENT_DK,
            }}>₹ 17,060</span>
          </div>
        </SubSection>
        <SubSection eyebrow="DIAMOND">
          <BreakupTable
            rows={[
              { component: 'SI IJ round - 16 No.s', rate: '₹ 1,10,000', rateUnit: '/ct', weight: '0.064 ct', discount: '0%', value: '₹ 7,040' },
              { component: 'SI IJ round - 32 No.s', rate: '₹ 1,10,000', rateUnit: '/ct', weight: '0.160 ct', discount: '0%', value: '₹ 17,600' },
              { component: 'SI IJ round - 2 No.s',  rate: '₹ 1,10,000', rateUnit: '/ct', weight: '0.020 ct', discount: '0%', value: '₹ 2,200' },
            ]}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 12, padding: '10px 14px',
            background: 'rgba(175,129,108,0.08)', borderRadius: 10,
          }}>
            <span style={{
              fontFamily: FS.sans, fontSize: 11.5, fontWeight: 700,
              color: PS_INK, letterSpacing: 0.4,
            }}>Total Diamond Value</span>
            <span style={{
              fontFamily: FS.sans, fontSize: 13, fontWeight: 800, color: PS_ACCENT_DK,
            }}>₹ 26,840</span>
          </div>
        </SubSection>

        <div style={{ height: 1, background: PS_LINE, margin: '4px 0 6px' }}/>
        <PriceRow k="Subtotal"     v="₹ 43,900"/>
        <PriceRow k="GST"          v="₹ 1,317"/>
        <PriceRow k="Grand Total"  v="₹ 45,217" bold/>
      </Panel>

      {/* ───────── Curated Companions ───────── */}
      <div style={{ padding: '28px 18px 0' }}>
        <div style={{
          fontFamily: FS.serif, fontSize: 20, fontWeight: 500, color: '#000', letterSpacing: 0.5,
          marginBottom: 14,
        }}>Curated Companions</div>
        <div style={{
          display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6, margin: '0 -18px', paddingLeft: 18, paddingRight: 18,
          scrollbarWidth: 'none',
        }}>
          {[
            { n: 'Stellar Cluster', t: 'EARRINGS',  p: '₹28,000', img: 'assets/product/comp-studs.jpg' },
            { n: 'Orbital Gold',    t: 'NECKLACES', p: '₹36,000', img: 'assets/product/comp-necklace.jpg' },
            { n: 'Infinity Tennis', t: 'BRACELETS', p: '₹40,000', img: 'assets/product/comp-bracelet.jpg' },
          ].map((p, i) => <CompanionCard key={i} {...p}/>)}
          <div style={{
            flexShrink: 0, width: 165, borderRadius: 12, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', background: 'rgb(244,244,240)',
          }}>
            <div style={{
              flex: 1, minHeight: 156, background: 'rgb(230,233,228)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PS_INK}
                   strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontFamily: FS.serif, fontWeight: 700, fontSize: 14, color: PS_INK }}>More Gems</div>
              <div style={{ fontFamily: FS.sans, fontSize: 11, color: PS_SOFT, marginTop: 2, letterSpacing: 0.5 }}>View All</div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Client Reflections ───────── */}
      <div style={{ padding: '28px 18px 110px' }}>
        <div style={{
          fontFamily: FS.serif, fontSize: 20, fontWeight: 500, color: '#000', letterSpacing: 0.5,
        }}>Client Reflections</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, marginBottom: 14 }}>
          <Stars n={5}/>
          <span style={{ fontFamily: FS.sans, fontWeight: 700, fontSize: 12, color: PS_INK, letterSpacing: 1 }}>4.9 / 5.0</span>
        </div>
        <div style={{
          display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6, margin: '0 -18px', paddingLeft: 18, paddingRight: 18,
          scrollbarWidth: 'none',
        }}>
          {[
            { n: 'Eleanor M.', d: '24 OCT 2023',
              body: '"The way this piece catches the morning light is unlike anything else in my collection. The \'invisible\' setting really does make the diamond appear to float."' },
            { n: 'Julian V.', d: '12 SEP 2023',
              body: '"A masterclass in restraint. The proportions are perfect, and the customer service from The Atelier was as refined as the jewelry itself."' },
            { n: 'Sarah K.', d: '05 AUG 2023',
              body: '"Exceeded all expectations. It feels substantial yet incredibly elegant. Truly an heirloom piece that I\'ll cherish forever."' },
          ].map((r, i) => <ReflectionCard key={i} {...r}/>)}
        </div>
      </div>

      {/* ───────── 3. STICKY BOTTOM NAV: Price ↔ Add to Cart ───────── */}
      <div style={{
        position: 'sticky', bottom: 0, left: 0, right: 0,
        background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', padding: '14px 18px',
        borderTop: `1px solid ${PS_LINE}`, gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: FS.sans, fontSize: 10, color: PS_SOFT, fontWeight: 600,
            letterSpacing: 0.5, textTransform: 'uppercase',
          }}>Total Price</div>
          <div style={{
            fontFamily: FS.serif, fontSize: 22, fontWeight: 700, color: PS_ACCENT_DK,
            lineHeight: 1.1, marginTop: 2,
          }}>₹ 45,217</div>
        </div>
        <button onClick={addToCart} style={{
          height: 52, padding: '0 28px', borderRadius: 50, background: PS_ACCENT,
          color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: FS.sans, fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
          boxShadow: '0 4px 14px rgba(119,88,66,0.35)',
          display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── subcomponents ─────────────────── */

const navBtnSolid = {
  width: 42, height: 42, borderRadius: 12,
  background: '#fff', border: `1px solid ${PS_LINE}`, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

function Pill({ children, bg, fg }) {
  return (
    <span style={{
      background: bg, color: fg, padding: '4px 10px', borderRadius: 999,
      fontFamily: FS.sans, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
    }}>{children}</span>
  );
}

function VariantRow({ label, value, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10,
      }}>
        <span style={{
          fontFamily: FS.sans, fontSize: 11, letterSpacing: 1.2, color: PS_SOFT,
          fontWeight: 600,
        }}>{label}</span>
        <span style={{ fontFamily: FS.serif, fontSize: 13, color: PS_INK, fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
    </div>
  );
}

function MoreTile({ open, onOpen, options, onPick }) {
  return (
    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={onOpen} aria-label="More options" style={{
        width: 36, height: 36, borderRadius: 8,
        background: open ? PS_ACCENT : 'rgba(115,92,0,0.05)',
        border: open ? 'none' : '1px solid rgba(115,92,0,0.2)',
        cursor: 'pointer', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: open ? '0 2px 6px rgba(119,88,66,0.25)' : 'none',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke={open ? '#fff' : PS_INK} strokeWidth="2.2"
             strokeLinecap="round" strokeLinejoin="round"
             style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, zIndex: 10,
          background: '#fff', borderRadius: 12, minWidth: 160,
          border: `1px solid ${PS_LINE}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden',
        }}>
          {options.map((o, i) => (
            <button key={o} onClick={() => onPick(o)} style={{
              width: '100%', textAlign: 'left', padding: '12px 14px', background: 'none',
              border: 'none', borderTop: i === 0 ? 'none' : `1px solid rgba(175,179,174,0.2)`,
              fontFamily: FS.sans, fontSize: 13, color: PS_INK, cursor: 'pointer',
            }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantChip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      minWidth: 44, height: 36, padding: '0 14px', borderRadius: 8,
      background: active ? PS_ACCENT : 'rgba(115,92,0,0.05)',
      color: active ? '#fff' : PS_INK,
      border: active ? 'none' : '1px solid rgba(115,92,0,0.12)',
      fontFamily: FS.sans, fontSize: 13, fontWeight: active ? 700 : 500,
      cursor: 'pointer',
      boxShadow: active ? '0 2px 6px rgba(119,88,66,0.25)' : 'none',
    }}>{children}</button>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ padding: '28px 18px 0' }}>
      <div style={{
        fontFamily: FS.serif, fontSize: 20, fontWeight: 500, color: '#000',
        letterSpacing: 0.5, marginBottom: 14,
      }}>{title}</div>
      {children}
    </div>
  );
}

function CertTile({ label, icon }) {
  return (
    <div style={{
      background: 'rgb(239,232,227)', borderRadius: 12,
      aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        {icon}
      </div>
      <div style={{
        fontFamily: FS.sans, fontSize: 9.5, fontWeight: 600, color: PS_INK,
        textAlign: 'center', lineHeight: 1.2, whiteSpace: 'pre-line',
      }}>{label}</div>
    </div>
  );
}

function Panel({ title, children, defaultOpen }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div style={{ padding: '14px 18px 0' }}>
      <div style={{
        background: PS_TILE, borderRadius: 10,
        padding: '15px 12px 18px',
      }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: FS.serif, fontSize: 20, fontWeight: 500, color: '#000', letterSpacing: 0.5,
          }}>{title}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        {open && <div style={{ marginTop: 16 }}>{children}</div>}
      </div>
    </div>
  );
}

function EyebrowBlock({ eyebrow, children }) {
  return (
    <div>
      <div style={{
        fontFamily: FS.sans, fontSize: 10, letterSpacing: 2,
        color: PS_ACCENT_DK, fontWeight: 700,
      }}>{eyebrow}</div>
      <p style={{
        margin: '8px 0 0', fontFamily: FS.sans, fontSize: 13,
        lineHeight: 1.65, color: PS_SOFT,
      }}>{children}</p>
    </div>
  );
}

function SubSection({ eyebrow, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: FS.sans, fontSize: 10, letterSpacing: 2,
        color: PS_ACCENT_DK, fontWeight: 700, marginBottom: 10,
      }}>{eyebrow}</div>
      {children}
    </div>
  );
}

function SpecCard({ rows }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: `1px solid ${PS_LINE}`,
      overflow: 'hidden',
    }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px',
          borderTop: i === 0 ? 'none' : `1px solid rgba(175,179,174,0.2)`,
        }}>
          <span style={{ fontFamily: FS.sans, fontSize: 11.5, color: PS_SOFT, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{k}</span>
          <span style={{ fontFamily: FS.sans, fontSize: 12.5, color: PS_INK, fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function BreakupTable({ rows }) {
  const grid = 'minmax(0, 1.55fr) minmax(0, 1.1fr) minmax(0, 0.95fr) minmax(0, 0.8fr) minmax(0, 1.05fr)';
  const headers = ['Component', 'Rate', 'Weight', 'Discount', 'Value'];
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: `1px solid ${PS_LINE}`, overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: grid, gap: 8,
        padding: '10px 12px', background: 'rgba(175,129,108,0.06)',
      }}>
        {headers.map((h, i) => (
          <div key={h} style={{
            fontFamily: FS.sans, fontSize: 9.5, letterSpacing: 1,
            color: PS_ACCENT_DK, fontWeight: 700, textTransform: 'uppercase',
            textAlign: i === headers.length - 1 ? 'right' : 'left',
            lineHeight: 1.2,
          }}>{h}</div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: grid, gap: 8,
          padding: '12px 12px', alignItems: 'center',
          borderTop: `1px solid rgba(175,179,174,0.22)`,
        }}>
          <div style={{
            fontFamily: FS.sans, fontSize: 11.5, color: PS_INK, fontWeight: 600,
            lineHeight: 1.3, wordBreak: 'break-word',
          }}>{r.component}</div>
          <div style={{
            fontFamily: FS.sans, fontSize: 11.5, color: PS_INK, fontWeight: 500,
            lineHeight: 1.3, wordBreak: 'break-word',
          }}>
            {r.rate}
            <span style={{ color: PS_SOFT }}> {r.rateUnit}</span>
          </div>
          <div style={{
            fontFamily: FS.sans, fontSize: 11.5, color: PS_INK, fontWeight: 500,
            lineHeight: 1.3,
          }}>{r.weight}</div>
          <div style={{
            fontFamily: FS.sans, fontSize: 11.5,
            color: r.discount && r.discount !== '-' && r.discount !== '0%' ? '#4F6B44' : PS_INK,
            fontWeight: r.discount && r.discount !== '-' && r.discount !== '0%' ? 700 : 500,
            lineHeight: 1.3,
          }}>{r.discount}</div>
          <div style={{
            fontFamily: FS.sans, fontSize: 12, color: PS_INK, fontWeight: 700,
            textAlign: 'right', lineHeight: 1.3,
          }}>{r.value}</div>
        </div>
      ))}
    </div>
  );
}

function PriceRow({ k, v, bold }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '13px 0',
    }}>
      <span style={{
        fontFamily: FS.sans, fontSize: bold ? 15 : 13,
        color: bold ? PS_INK : PS_SOFT,
        fontWeight: bold ? 700 : 500, letterSpacing: 0.3,
      }}>{k}</span>
      <span style={{
        fontFamily: bold ? FS.serif : FS.sans, fontSize: bold ? 18 : 13,
        color: bold ? PS_ACCENT_DK : PS_INK, fontWeight: bold ? 700 : 600,
      }}>{v}</span>
    </div>
  );
}

function CompanionCard({ n, t, p, img }) {
  return (
    <div style={{
      flexShrink: 0, width: 165, borderRadius: 12, overflow: 'hidden',
      background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        position: 'relative', width: '100%', height: 156,
        background: `url(${img}) center / cover no-repeat, ${PS_TILE}`,
      }}>
        <button aria-label="Like" style={{
          position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(250,249,246,0.85)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          <svg width="12" height="11" viewBox="0 0 14 13" fill="none" stroke={PS_INK} strokeWidth="1.3" strokeLinejoin="round">
            <path d="M7 12s-5.5-3.3-5.5-7.5a3 3 0 015.5-1.7 3 3 0 015.5 1.7C12.5 8.7 7 12 7 12z"/>
          </svg>
        </button>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: FS.sans, fontSize: 9, fontWeight: 700, color: PS_SOFT, letterSpacing: 1.2 }}>{t}</div>
        <div style={{ fontFamily: FS.serif, fontWeight: 700, fontSize: 14, color: PS_INK, marginTop: 2 }}>{n}</div>
        <div style={{ fontFamily: FS.sans, fontSize: 12, fontWeight: 700, color: PS_ACCENT_DK, marginTop: 3 }}>{p}</div>
      </div>
    </div>
  );
}

function Stars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 2, color: '#D4A253' }}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3 6.5 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
        </svg>
      ))}
    </div>
  );
}

function ReflectionCard({ n, d, body }) {
  return (
    <div style={{
      flexShrink: 0, width: 290, borderRadius: 16, background: '#fff',
      border: `1px solid ${PS_LINE}`, padding: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: FS.serif, fontSize: 14, fontWeight: 700, color: PS_INK }}>{n}</div>
          <div style={{ fontFamily: FS.sans, fontSize: 9, color: PS_SOFT, letterSpacing: 1, marginTop: 2 }}>VERIFIED COLLECTOR</div>
        </div>
        <div style={{ fontFamily: FS.sans, fontSize: 9, color: PS_SOFT }}>{d}</div>
      </div>
      <div style={{ marginTop: 10 }}><Stars n={5}/></div>
      <p style={{ margin: '10px 0 0', fontFamily: FS.sans, fontSize: 13, color: PS_SOFT, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

window.ProductPage = ProductPage;
