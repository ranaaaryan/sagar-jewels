import React from 'react';
// Today's Rate — live rate listing page reached from the Home rate card.

const TR = window.JEWEL_TOKENS;

const RATES = [
  { k: 'FINE SILVER', rate: 252 },
  { k: '18KT (750)',  rate: 12360 },
  { k: '22KT (916)',  rate: 14330 },
];

function pad(n) { return String(n).padStart(2, '0'); }
function formatUpdatedAt(d) {
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(h)}:${pad(d.getMinutes())} ${ampm}`;
}

function TodaysRatePage({ go }) {
  const lastUpdated = React.useMemo(() => formatUpdatedAt(new Date()), []);

  return (
    <>
      <TopBar title="Today's Rate" onBack={() => go('home')} />
      <div style={{
        flex: 1, overflowY: 'auto',
        borderTop: '1px solid rgba(142, 25, 54, 0.35)',
        background: TR.bg,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ flex: 1, padding: '22px 22px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <CoinsAndSpoons width={52} height={52}/>
            <h2 style={{
              margin: 0, fontFamily: TR.serif, fontSize: 24, fontWeight: 600,
              color: TR.ink, letterSpacing: 0.2,
            }}>Today's Rate</h2>
          </div>

          <div style={{
            fontFamily: TR.sans, fontSize: 12, color: TR.inkSoft,
            marginTop: 10, textAlign: 'right',
          }}>Last updated at : {lastUpdated}</div>

          <div style={{ height: 1, background: TR.lineSoft, marginTop: 12 }}/>

          {RATES.map(r => (
            <React.Fragment key={r.k}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 4px',
              }}>
                <span style={{
                  fontFamily: TR.sans, fontSize: 14, fontWeight: 500,
                  color: TR.ink, letterSpacing: 1,
                }}>{r.k}</span>
                <span style={{
                  fontFamily: TR.sans, fontSize: 16, fontWeight: 800, color: TR.ink,
                }}>₹{r.rate.toLocaleString('en-IN')}/gm</span>
              </div>
              <div style={{ height: 1, background: TR.lineSoft }}/>
            </React.Fragment>
          ))}
        </div>

        <div style={{ padding: '16px 22px 22px' }}>
          <button onClick={() => go('home')} style={{
            width: '100%', padding: '18px 0',
            borderRadius: 999, border: 'none', cursor: 'pointer',
            background: '#541B2E', color: '#fff',
            fontFamily: TR.sans, fontSize: 16, fontWeight: 700,
            letterSpacing: 1,
            boxShadow: '0 6px 14px rgba(84,27,46,0.25)',
          }}>Ok</button>
        </div>
      </div>
    </>
  );
}

function CoinsAndSpoons({ width = 52, height = 52 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      {/* Spoon (silver) */}
      <g transform="translate(4 8) rotate(-18 10 20)">
        <ellipse cx="10" cy="9" rx="6" ry="8" fill="#D9DBDE" stroke="#A5AAB1" strokeWidth="0.9"/>
        <path d="M10 17 L9 35 Q10 37 11 35 L10 17Z" fill="#D9DBDE" stroke="#A5AAB1" strokeWidth="0.9"/>
      </g>
      {/* Coin stack (gold) */}
      <g>
        <ellipse cx="38" cy="44" rx="16" ry="4.5" fill="#B78336" stroke="#7E5421" strokeWidth="0.9"/>
        <rect x="22" y="34" width="32" height="10" fill="#D8A25A"/>
        <ellipse cx="38" cy="34" rx="16" ry="4.5" fill="#E9BE6F" stroke="#7E5421" strokeWidth="0.9"/>
        <rect x="22" y="24" width="32" height="10" fill="#E3B15F"/>
        <ellipse cx="38" cy="24" rx="16" ry="4.5" fill="#F1CF7C" stroke="#7E5421" strokeWidth="0.9"/>
        {/* coin face detail */}
        <ellipse cx="38" cy="24" rx="10" ry="2.6" fill="none" stroke="#A06D32" strokeWidth="0.6"/>
      </g>
    </svg>
  );
}

window.TodaysRatePage = TodaysRatePage;
