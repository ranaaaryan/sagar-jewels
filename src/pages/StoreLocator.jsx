import React from 'react';
// Store Locator — map hero + city selector + store info tiles
const TSL = window.JEWEL_TOKENS;

const SL_CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad'];

const SL_STORES = {
  'Bengaluru': [
    { id: 's1', name: 'Sagar Jewellers · Indiranagar', line: '124, 100ft Road, HAL 2nd Stage', area: 'Indiranagar, Bengaluru 560038',
      phone: '+91 80 4112 9820', hours: '11:00 AM – 9:00 PM', dist: '2.4 km', flagship: true, x: 62, y: 38 },
    { id: 's2', name: 'Sagar Jewellers · UB City Boutique',   line: 'Level 2, UB City Mall, Vittal Mallya Rd', area: 'Shanthala Nagar, Bengaluru 560001',
      phone: '+91 80 4095 6611', hours: '11:00 AM – 9:30 PM', dist: '5.1 km', x: 34, y: 52 },
    { id: 's3', name: 'Sagar Jewellers · Jayanagar',          line: '11th Main, 4th Block', area: 'Jayanagar, Bengaluru 560011',
      phone: '+91 80 2663 7412', hours: '10:30 AM – 8:30 PM', dist: '7.8 km', x: 28, y: 74 },
    { id: 's4', name: 'Sagar Jewellers · Whitefield',         line: 'Forum Shantiniketan, Ground Floor', area: 'Whitefield, Bengaluru 560066',
      phone: '+91 80 6712 3388', hours: '11:00 AM – 9:00 PM', dist: '14.6 km', x: 82, y: 22 },
  ],
  'Mumbai': [
    { id: 'm1', name: 'Sagar Jewellers · Bandra Boutique',    line: 'Linking Rd, opp. National College', area: 'Bandra West, Mumbai 400050',
      phone: '+91 22 2645 1120', hours: '11:00 AM – 9:30 PM', dist: '3.1 km', flagship: true, x: 30, y: 40 },
    { id: 'm2', name: 'Sagar Jewellers · BKC Atelier',        line: 'Jio World Drive, Podium 2',        area: 'Bandra Kurla Complex, Mumbai 400051',
      phone: '+91 22 6197 4422', hours: '11:00 AM – 10:00 PM', dist: '6.4 km', x: 58, y: 48 },
    { id: 'm3', name: 'Sagar Jewellers · Phoenix Palladium',  line: 'Level 3, Palladium Mall',          area: 'Lower Parel, Mumbai 400013',
      phone: '+91 22 4091 8800', hours: '11:00 AM – 10:00 PM', dist: '9.2 km', x: 44, y: 68 },
  ],
  'Delhi NCR': [
    { id: 'd1', name: 'Sagar Jewellers · DLF Emporio',        line: 'Ground Floor, Nelson Mandela Marg', area: 'Vasant Kunj, New Delhi 110070',
      phone: '+91 11 4606 8214', hours: '11:00 AM – 9:00 PM', dist: '4.2 km', flagship: true, x: 26, y: 56 },
    { id: 'd2', name: 'Sagar Jewellers · Khan Market',        line: 'Shop 24, Middle Lane',             area: 'Khan Market, New Delhi 110003',
      phone: '+91 11 2463 2271', hours: '10:30 AM – 8:30 PM', dist: '8.8 km', x: 52, y: 38 },
    { id: 'd3', name: 'Sagar Jewellers · DLF CyberHub',       line: 'Ground Level, Tower C',            area: 'DLF Cyber City, Gurugram 122002',
      phone: '+91 124 661 4500', hours: '11:00 AM – 11:00 PM', dist: '17.2 km', x: 70, y: 72 },
  ],
  'Hyderabad': [
    { id: 'h1', name: 'Sagar Jewellers · Banjara Hills',      line: 'Road No. 10, opp. NIMS',           area: 'Banjara Hills, Hyderabad 500034',
      phone: '+91 40 2355 9960', hours: '11:00 AM – 9:00 PM', dist: '2.8 km', flagship: true, x: 44, y: 42 },
    { id: 'h2', name: 'Sagar Jewellers · Jubilee Hills',      line: 'Road No. 36',                       area: 'Jubilee Hills, Hyderabad 500033',
      phone: '+91 40 4012 3311', hours: '11:00 AM – 9:00 PM', dist: '6.1 km', x: 66, y: 60 },
  ],
};

function StoreLocatorPage({ go }) {
  const [city, setCity] = React.useState('Bengaluru');
  const [cityOpen, setCityOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(SL_STORES['Bengaluru'][0].id);

  const stores = SL_STORES[city];

  function changeCity(c) {
    setCity(c);
    setCityOpen(false);
    setSelected(SL_STORES[c][0].id);
  }

  return (
    <>
      {/* ── Top bar ───────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 15px 10px', background: '#fff',
        borderBottom: `1px solid ${TSL.line}`,
      }}>
        <button onClick={() => go('home')} aria-label="Back" style={slSq}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', ${TSL.serif}`, fontSize: 20, color: '#000', letterSpacing: 0.2,
        }}>Store Locator</div>
        <button aria-label="Search" style={slSq}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: TSL.bg }}>

        {/* ── Map ─────────────────────────────────── */}
        <div style={{ position: 'relative', height: 260, background: '#DDE7E4', overflow: 'hidden' }}>
          <MapSvg stores={stores} selected={selected} onPick={setSelected}/>

          {/* City selector floating on map */}
          <div style={{ position: 'absolute', top: 14, left: 15, right: 15, zIndex: 2 }}>
            <button
              onClick={() => setCityOpen(v => !v)}
              style={{
                width: '100%', height: 46, borderRadius: 50, background: '#fff',
                border: 'none', cursor: 'pointer', padding: '0 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(115,92,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(115,92,0)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.4"/>
                </svg>
              </span>
              <span style={{
                flex: 1, textAlign: 'left',
                fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 13.5, fontWeight: 600, color: '#2F3430',
              }}>{city}</span>
              <span style={{
                fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 11, color: '#6E655C',
                letterSpacing: 0.6,
              }}>{stores.length} STORES</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F3430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: cityOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {cityOpen && (
              <div style={{
                marginTop: 8, background: '#fff', borderRadius: 16,
                padding: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.14)',
                overflow: 'hidden',
              }}>
                {SL_CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => changeCity(c)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '11px 14px',
                      background: c === city ? 'rgba(115,92,0,0.08)' : 'transparent',
                      border: 'none', cursor: 'pointer', borderRadius: 12,
                      fontFamily: `'Manrope', ${TSL.sans}`,
                      fontSize: 13.5, fontWeight: c === city ? 700 : 500,
                      color: c === city ? 'rgb(115,92,0)' : '#2F3430',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span>{c}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#9A9085', letterSpacing: 0.5 }}>
                      {SL_STORES[c].length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── List header ─────────────────────────── */}
        <div style={{
          padding: '18px 15px 10px',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: `'Noto Serif', ${TSL.serif}`, fontSize: 18, fontWeight: 700, color: '#1E1B13',
          }}>Stores in {city}</div>
          <div style={{
            fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 11, color: '#6E655C',
            letterSpacing: 0.6, textTransform: 'uppercase',
          }}>Nearest first</div>
        </div>

        {/* ── Store tiles ─────────────────────────── */}
        <div style={{ padding: '0 15px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stores.map(s => (
            <StoreTile
              key={s.id}
              s={s}
              active={s.id === selected}
              onSelect={() => setSelected(s.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Stylized map with store pins ───────────────────────
function MapSvg({ stores, selected, onPick }) {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
    }}>
      {/* land */}
      <rect x="0" y="0" width="100" height="60" fill="#E8EFEB"/>
      {/* green parks */}
      <path d="M8,12 q4,-6 10,-3 q6,3 3,10 q-4,6 -10,3 q-6,-3 -3,-10 z" fill="#C8DBCF" opacity="0.7"/>
      <path d="M72,42 q3,-4 8,-2 q5,2 3,8 q-3,4 -8,2 q-5,-2 -3,-8 z" fill="#C8DBCF" opacity="0.7"/>
      {/* water body */}
      <path d="M-2,50 q10,-6 22,-2 q12,4 24,-2 q14,-5 30,2 q14,6 30,-2 L130,70 L-10,70 Z" fill="#BDD3D6" opacity="0.65"/>

      {/* major roads */}
      <g stroke="#F5F1EA" strokeWidth="3.2" strokeLinecap="round" fill="none">
        <line x1="-2" y1="20" x2="104" y2="18"/>
        <line x1="-2" y1="36" x2="104" y2="40"/>
        <line x1="22" y1="-2" x2="28" y2="62"/>
        <line x1="60" y1="-2" x2="58" y2="62"/>
        <path d="M-2,54 Q30,48 54,52 T104,46"/>
      </g>
      {/* minor roads */}
      <g stroke="#EDE6DA" strokeWidth="1.2" strokeLinecap="round" fill="none">
        <line x1="-2" y1="10" x2="104" y2="10"/>
        <line x1="-2" y1="28" x2="104" y2="26"/>
        <line x1="-2" y1="46" x2="104" y2="44"/>
        <line x1="10" y1="-2" x2="12" y2="62"/>
        <line x1="42" y1="-2" x2="44" y2="62"/>
        <line x1="78" y1="-2" x2="76" y2="62"/>
        <line x1="92" y1="-2" x2="92" y2="62"/>
      </g>

      {/* pins */}
      {stores.map(s => {
        const active = s.id === selected;
        return (
          <g key={s.id} transform={`translate(${s.x} ${s.y})`} onClick={() => onPick(s.id)} style={{ cursor: 'pointer' }}>
            {active && <circle r="5.2" fill="rgba(115,92,0,0.18)"/>}
            <circle r={active ? 3.6 : 2.6} fill={active ? 'rgb(115,92,0)' : '#fff'} stroke="rgb(115,92,0)" strokeWidth={active ? 0 : 1.4}/>
            {active && <circle r="1.2" fill="#fff"/>}
          </g>
        );
      })}
    </svg>
  );
}

// ── Store tile ─────────────────────────────────────────
function StoreTile({ s, active, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: '#fff', borderRadius: 14,
        border: active ? '1.5px solid rgb(115,92,0)' : '1px solid rgba(176,178,177,0.25)',
        padding: '14px 14px 12px',
        boxShadow: active ? '0 6px 18px rgba(115,92,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
        cursor: 'pointer', transition: 'all 180ms ease',
      }}
    >
      {/* Header row: name + distance */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: `'Noto Serif', ${TSL.serif}`, fontSize: 15, fontWeight: 700, color: '#1E1B13', lineHeight: 1.25,
            }}>{s.name}</span>
            {s.flagship && (
              <span style={{
                fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
                color: 'rgb(115,92,0)', background: 'rgba(115,92,0,0.1)',
                padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
              }}>Flagship</span>
            )}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 11, fontWeight: 600, color: '#6E655C',
          background: TSL.bg, padding: '4px 8px', borderRadius: 10,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="10" r="2"/>
          </svg>
          {s.dist}
        </div>
      </div>

      {/* Address */}
      <div style={{ marginTop: 6, fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 12, color: '#454652', lineHeight: 1.5 }}>
        {s.line}<br/>{s.area}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
        <MetaRow icon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
          </svg>
        }>{s.hours}</MetaRow>
        <MetaRow icon={
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.95.35 1.88.66 2.78a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.3-1.24a2 2 0 0 1 2.11-.45c.9.31 1.83.53 2.78.66A2 2 0 0 1 22 16.92z"/>
          </svg>
        }>{s.phone}</MetaRow>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1, height: 38, borderRadius: 50, border: 'none', cursor: 'pointer',
            background: '#AF826D', color: '#fff',
            fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.9,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          GET DIRECTIONS
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 42, height: 38, borderRadius: 50, border: '1px solid rgba(115,92,0,0.35)', cursor: 'pointer',
            background: '#fff', color: 'rgb(115,92,0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Call store"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.95.35 1.88.66 2.78a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.3-1.24a2 2 0 0 1 2.11-.45c.9.31 1.83.53 2.78.66A2 2 0 0 1 22 16.92z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function MetaRow({ icon, children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontFamily: `'Manrope', ${TSL.sans}`, fontSize: 11.5, color: '#6E655C',
    }}>
      <span style={{ color: 'rgb(115,92,0)', display: 'inline-flex' }}>{icon}</span>
      {children}
    </span>
  );
}

const slSq = {
  width: 40, height: 40, borderRadius: 12, background: 'rgba(255,248,239,0.7)',
  border: '1px solid rgba(115,92,0,0.12)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

window.StoreLocatorPage = StoreLocatorPage;
