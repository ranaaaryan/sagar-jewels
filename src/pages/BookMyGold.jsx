import React from 'react';
// Book My Gold — lock today's gold rate
// Top: segmented toggle (Book My Gold | Redeem)
// Body: Benefits, How it works, Terms & Conditions
const BMG = window.JEWEL_TOKENS;

function BookMyGoldPage({ go, state }) {
  const [tab, setTab] = React.useState('book');   // 'book' | 'redeem'
  const [step, setStep] = React.useState('home'); // 'home' | 'rate' | 'redeem'

  if (step === 'rate')   return <RateBookingScreen onBack={() => setStep('home')}/>;
  if (step === 'redeem') return <RedeemGoldScreen onBack={() => setStep('home')}/>;

  return (
    <>
      <TopBar title="Book My Gold" onBack={() => go('home')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: BMG.bg, padding: '10px 15px 28px' }}>

        {/* ── Segmented toggle ─────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
          background: '#F1EADC',
          border: `1px solid ${BMG.line}`,
          padding: 4, borderRadius: 12,
        }}>
          {[
            { k: 'book',   label: 'Book My Gold' },
            { k: 'redeem', label: 'Redeem' },
          ].map(t => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                style={{
                  padding: '10px 0', borderRadius: 9, cursor: 'pointer',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#5A4700' : '#6E655C',
                  border: active ? '1px solid rgb(115,92,0)' : '1px solid transparent',
                  boxShadow: active ? '0 1px 4px rgba(115,92,0,0.16)' : 'none',
                  fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12.5,
                  fontWeight: 700, letterSpacing: 0.4,
                  transition: 'all 180ms ease',
                }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'book' ? <BookTab go={go} onLock={() => setStep('rate')}/> : <RedeemTab go={go} onRedeem={() => setStep('redeem')}/>}
      </div>
    </>
  );
}

// ─── BOOK TAB ─────────────────────────────────────────────────
function BookTab({ go, onLock }) {
  return (
    <>
      {/* ── Hero rate card ──────────────────────── */}
      <div style={{
        marginTop: 16, borderRadius: 18, overflow: 'hidden',
        background: 'linear-gradient(135deg, #6B4638 0%, #8E6452 52%, #AF826D 100%)',
        position: 'relative', minHeight: 140,
        boxShadow: '0 8px 22px rgba(119,88,66,0.28)',
      }}>
        {/* decorative glow — warm cream on top of #AF826D family */}
        <div style={{
          position: 'absolute', right: -40, top: -40, width: 180, height: 180,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,221,203,0.45), transparent 70%)',
        }}/>
        <div style={{ position: 'relative', padding: '18px 18px 16px', color: '#FCEFE3' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(252,239,227,0.16)',
            border: '1px solid rgba(252,239,227,0.28)',
            padding: '4px 10px', borderRadius: 50,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A8E1A0', boxShadow: '0 0 0 3px rgba(168,225,160,0.25)' }}/>
            <span style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>LIVE RATE · 22 APR, 10:24 AM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 14 }}>
            <div>
              <div style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 10.5, color: 'rgba(252,239,227,0.78)', letterSpacing: 0.5, textTransform: 'uppercase' }}>22KT Gold</div>
              <div style={{ fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 28, fontWeight: 700, letterSpacing: 0.2, marginTop: 2 }}>₹11,400<span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(252,239,227,0.78)' }}> /gm</span></div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(252,239,227,0.28)', paddingLeft: 16, marginBottom: 4 }}>
              <div style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 10.5, color: 'rgba(252,239,227,0.78)', letterSpacing: 0.5, textTransform: 'uppercase' }}>24KT</div>
              <div style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 16, fontWeight: 700, marginTop: 2 }}>₹12,450</div>
            </div>
          </div>
          <button
            onClick={onLock}
            style={{
              marginTop: 14, width: '100%', height: 44, border: 'none', cursor: 'pointer',
              background: '#F3DDCB', color: '#3E2A1E',
              fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12.5, fontWeight: 700,
              letterSpacing: 0.8, textTransform: 'uppercase', borderRadius: 10,
              boxShadow: '0 4px 12px rgba(107,70,56,0.35)',
            }}>
            Lock This Rate
          </button>
        </div>
      </div>

      {/* ── Benefits ────────────────────────────── */}
      <SectionLabel kicker="Why book?" title="Benefits of locking gold" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <BenefitTile
          icon="lock"
          title="Lock today's rate"
          desc="Stay safe from price rise for 30 days"
          tone="warm"
        />
        <BenefitTile
          icon="shield"
          title="Just 10% advance"
          desc="Pay the rest when you buy"
          tone="sage"
        />
        <BenefitTile
          icon="clock"
          title="Flexible window"
          desc="Redeem anytime within 30 days"
          tone="rose"
        />
        <BenefitTile
          icon="wallet"
          title="Any jewellery"
          desc="Use toward any 22K or 18K piece"
          tone="cream"
        />
      </div>

      {/* ── How it works ────────────────────────── */}
      <SectionLabel kicker="Simple steps" title="How it works" />

      <div style={{
        background: '#fff', borderRadius: 16,
        border: `1px solid ${BMG.line}`,
        overflow: 'hidden',
      }}>
        {[
          { n: '01', t: 'Choose your weight',    d: 'Select how many grams of 22K or 24K gold you want to lock.' },
          { n: '02', t: 'Pay 10% booking',       d: 'A small advance confirms the rate for the next 30 days.' },
          { n: '03', t: 'Rate is locked',        d: 'Your rate won\u2019t change, even if market gold rises.' },
          { n: '04', t: 'Redeem & take home',    d: 'Pay the balance, choose any piece, walk out with it.' },
        ].map((s, i, arr) => (
          <div key={s.n} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '14px 16px',
            borderBottom: i < arr.length - 1 ? `1px solid ${BMG.line}` : 'none',
          }}>
            <div style={{
              flexShrink: 0,
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5E2B3, #E3B24A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 13, fontWeight: 700, color: '#3E2E23',
              boxShadow: 'inset 0 0 0 1px rgba(107,74,46,0.25)',
            }}>{s.n}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 15, fontWeight: 600, color: '#1E1B13' }}>{s.t}</div>
              <div style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12, color: '#6E655C', marginTop: 3, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── T&C ─────────────────────────────────── */}
      <SectionLabel kicker="The fine print" title="Terms & Conditions" />

      <div style={{
        background: '#fff', borderRadius: 16,
        border: `1px solid ${BMG.line}`,
        padding: '4px 0',
      }}>
        {[
          'Booking is valid for 30 calendar days from the date of advance payment.',
          'Minimum weight to book is 1 gram; maximum is 500 grams per booking.',
          '10% advance is adjusted in final invoice. No interest is paid on the advance held.',
          'Rate locked applies to the base gold rate only. Making charges, stone charges and GST are billed at the prevailing rate on the date of final purchase.',
          'Booking can be transferred to any 22K or 18K jewellery available in-store or online.',
          'If rate drops below the locked rate, you pay the lower rate \u2014 the booking is non-binding on you.',
          'Advance is non-refundable if the booking is not redeemed within 30 days.',
          'Only one active booking per customer at a time. Subject to in-store verification of KYC.',
        ].map((t, i, arr) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '12px 16px',
            borderBottom: i < arr.length - 1 ? `1px dashed ${BMG.line}` : 'none',
          }}>
            <span style={{
              flexShrink: 0, marginTop: 6,
              width: 5, height: 5, borderRadius: '50%',
              background: 'rgb(115,92,0)',
            }}/>
            <div style={{
              flex: 1, fontFamily: `'Manrope', ${BMG.sans}`,
              fontSize: 12, color: '#3E3529', lineHeight: 1.6,
            }}>{t}</div>
          </div>
        ))}
      </div>

      {/* ── Footer note ─────────────────────────── */}
      <div style={{
        marginTop: 18, padding: 12,
        borderRadius: 12, background: 'rgba(115,92,0,0.06)',
        fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 11, color: '#6E655C',
        lineHeight: 1.5, textAlign: 'center',
      }}>
        Questions? Call <b style={{ color: '#1E1B13' }}>+91 80 4123 5678</b> or visit any Sagar Jewellers store.
      </div>
    </>
  );
}

// ─── REDEEM TAB ────────────────────────────────────────────────
function RedeemTab({ go, onRedeem }) {
  return (
    <>
      <div style={{
        marginTop: 16, padding: '22px 18px',
        borderRadius: 18, background: '#fff',
        border: `1px solid ${BMG.line}`, textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto',
          background: 'rgba(115,92,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(115,92,0)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="12" rx="2"/>
            <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M3 13h18"/>
          </svg>
        </div>
        <div style={{
          fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 18, fontWeight: 600,
          color: '#1E1B13', marginTop: 14,
        }}>No active bookings to redeem</div>
        <div style={{
          fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12, color: '#6E655C',
          marginTop: 6, lineHeight: 1.5, maxWidth: 260, margin: '6px auto 0',
        }}>
          When you book gold at a locked rate, you{'\u2019'}ll see it here and can redeem it any time within 30 days.
        </div>
        <button
          onClick={onRedeem}
          style={{
            marginTop: 16, height: 44, padding: '0 22px',
            border: 'none', cursor: 'pointer',
            background: '#6B1F2B', color: '#fff',
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12.5, fontWeight: 700,
            letterSpacing: 0.8, textTransform: 'uppercase', borderRadius: 10,
            boxShadow: '0 4px 12px rgba(107,31,43,0.2)',
          }}>
          Redeem Now
        </button>
      </div>

      <SectionLabel kicker="When you redeem" title="Redemption benefits" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <BenefitTile icon="tag"    title="Pay locked rate"    desc="Even if market rate went up"  tone="warm"/>
        <BenefitTile icon="gem"    title="Any design"          desc="Pick from our full catalogue" tone="rose"/>
        <BenefitTile icon="clock"  title="30 day window"      desc={`Redeem when you’re ready`} tone="sage"/>
        <BenefitTile icon="wallet" title="Advance adjusted"    desc="10% booking deducted"         tone="cream"/>
      </div>

      <SectionLabel kicker="How to redeem" title="Steps to redeem" />

      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BMG.line}`, overflow: 'hidden' }}>
        {[
          { n: '01', t: 'Visit any Sagar store',  d: 'Or browse online \u2014 either works.' },
          { n: '02', t: 'Choose your jewellery',  d: 'Any 22K or 18K piece is eligible.' },
          { n: '03', t: 'Apply your booking',     d: 'Locked rate is used for gold value.' },
          { n: '04', t: 'Pay & take delivery',    d: 'Making, stone charges & GST at today\u2019s rate.' },
        ].map((s, i, arr) => (
          <div key={s.n} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
            borderBottom: i < arr.length - 1 ? `1px solid ${BMG.line}` : 'none',
          }}>
            <div style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5E2B3, #E3B24A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 13, fontWeight: 700, color: '#3E2E23',
              boxShadow: 'inset 0 0 0 1px rgba(107,74,46,0.25)',
            }}>{s.n}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 15, fontWeight: 600, color: '#1E1B13' }}>{s.t}</div>
              <div style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12, color: '#6E655C', marginTop: 3, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel kicker="The fine print" title="Redemption Terms" />

      <div style={{
        background: '#fff', borderRadius: 16,
        border: `1px solid ${BMG.line}`, padding: '4px 0',
      }}>
        {[
          'Booking must be redeemed within 30 days of the booking date.',
          'Booking advance is adjusted in the final invoice at time of redemption.',
          'Redemption is available only on 22K or 18K gold jewellery \u2014 not on coins or bullion.',
          'Making charges, stone charges, hallmarking, and GST are billed at rates applicable on the date of final purchase.',
          'If the market gold rate on redemption day is lower than the locked rate, the lower rate applies.',
          'Advance is non-refundable if booking lapses; unredeemed value cannot be claimed as cash.',
          'KYC proof and the original booking SMS/email are required at redemption.',
        ].map((t, i, arr) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '12px 16px',
            borderBottom: i < arr.length - 1 ? `1px dashed ${BMG.line}` : 'none',
          }}>
            <span style={{ flexShrink: 0, marginTop: 6, width: 5, height: 5, borderRadius: '50%', background: 'rgb(115,92,0)' }}/>
            <div style={{ flex: 1, fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12, color: '#3E3529', lineHeight: 1.6 }}>{t}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Bits ───────────────────────────────────────────────────────
function SectionLabel({ kicker, title }) {
  return (
    <div style={{ marginTop: 24, marginBottom: 12 }}>
      <div style={{
        fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 10, color: 'rgb(115,92,0)',
        letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 700,
      }}>{kicker}</div>
      <div style={{
        fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 20, fontWeight: 700,
        color: '#1E1B13', marginTop: 4, letterSpacing: 0.2,
      }}>{title}</div>
    </div>
  );
}

function BenefitTile({ icon, title, desc, tone }) {
  const palettes = {
    warm:  { bg: 'linear-gradient(160deg, #FFF4DC, #F7DFB0)', ink: '#6B4A2E' },
    sage:  { bg: 'linear-gradient(160deg, #EFF4E6, #D5E2C4)', ink: '#3C5A3F' },
    rose:  { bg: 'linear-gradient(160deg, #FBEDE6, #EFCFC1)', ink: '#84463D' },
    cream: { bg: 'linear-gradient(160deg, #FDF7EC, #F1E5CC)', ink: '#6E5A31' },
  };
  const p = palettes[tone] || palettes.warm;
  return (
    <div style={{
      background: p.bg, borderRadius: 14, padding: '14px 12px 12px',
      border: '1px solid rgba(107,74,46,0.08)',
      minHeight: 118, display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(255,255,255,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: p.ink,
      }}>
        <BenefitIcon kind={icon}/>
      </div>
      <div style={{ fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 14, fontWeight: 600, color: '#1E1B13', lineHeight: 1.25 }}>{title}</div>
      <div style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 11, color: p.ink, lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
}

function BenefitIcon({ kind }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'lock':   return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>;
    case 'shield': return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/></svg>;
    case 'clock':  return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'wallet': return <svg {...common}><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h3M3 10h18"/></svg>;
    case 'tag':    return <svg {...common}><path d="M20 12l-8 8-8-8V4h8l8 8z"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>;
    case 'gem':    return <svg {...common}><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M8 9h8M12 3l-4 6 4 12 4-12-4-6z"/></svg>;
    default:       return null;
  }
}

// ─── RATE BOOKING SCREEN ─────────────────────────────────────
// Appears after user taps "Lock This Rate" on the book tab
const MAROON      = '#6B1F2B';
const MAROON_DK   = '#511622';
const MAROON_TINT = '#F6E7E6';

function RateBookingScreen({ onBack }) {
  const [purity, setPurity] = React.useState('22');      // '22' | '18'
  const [mode,   setMode  ] = React.useState('rupees');  // 'rupees' | 'grams'
  const [amount, setAmount] = React.useState('');
  const [secondsLeft, setSecondsLeft] = React.useState(4 * 60 + 33);
  const inputRef = React.useRef(null);

  // Countdown timer
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const rate = purity === '22' ? 14330 : 11720;  // ₹/gm
  const min  = 500;

  const parsed = parseFloat(amount) || 0;
  const grams  = mode === 'rupees' ? (parsed / rate) : parsed;
  const rupees = mode === 'rupees' ? parsed : parsed * rate;

  const canProceed = mode === 'rupees' ? rupees >= min : rupees >= min;

  const mm = String(Math.floor(secondsLeft / 60));
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <>
      {/* ── Top bar ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 15px 12px', background: '#fff',
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 36, height: 36, borderRadius: 50, background: 'transparent',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -6,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 19,
          color: '#1E1B13', letterSpacing: 0.2,
        }}>Book My Gold</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#FBF7F3', padding: '8px 18px 24px' }}>

        {/* ── Rate card (purity + rate together) ── */}
        <div style={{
          background: '#fff', borderRadius: 16,
          border: `1px solid ${BMG.line}`,
          padding: 18,
        }}>
          {/* Purity pill selector */}
          <div style={{
            background: MAROON_TINT, borderRadius: 50,
            padding: 3, display: 'grid', gridTemplateColumns: '1fr 1fr',
          }}>
            {[
              { k: '22', label: '22KT', fineness: '916' },
              { k: '18', label: '18KT', fineness: '750' },
            ].map(p => {
              const active = purity === p.k;
              return (
                <button
                  key={p.k}
                  onClick={() => setPurity(p.k)}
                  style={{
                    height: 36, cursor: 'pointer', borderRadius: 50, border: 'none',
                    background: active ? MAROON : 'transparent',
                    color:      active ? '#fff'  : MAROON,
                    fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12.5, fontWeight: 700,
                    letterSpacing: 0.3, transition: 'background 200ms ease, color 200ms ease',
                  }}>
                  {p.label} <span style={{ opacity: 0.8, fontWeight: 500 }}>· {p.fineness}</span>
                </button>
              );
            })}
          </div>

          {/* Rate row */}
          <div style={{
            marginTop: 18, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10,
          }}>
            <div>
              <div style={{
                fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 10.5, color: '#9A8F84', fontWeight: 600,
                letterSpacing: 1, textTransform: 'uppercase',
              }}>Booking rate</div>
              <div style={{
                fontFamily: `'Noto Serif', ${BMG.serif}`, color: MAROON_DK,
                fontSize: 30, fontWeight: 700, letterSpacing: 0.2, marginTop: 4, lineHeight: 1,
              }}>
                ₹{rate.toLocaleString('en-IN')}
                <span style={{ fontSize: 13, fontWeight: 500, color: '#6E655C' }}> /gm</span>
              </div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, color: MAROON,
              fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 11.5, fontWeight: 700,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={MAROON} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
              {mm}:{ss}
            </div>
          </div>
        </div>

        {/* ── Mode tabs ───────────────────────────── */}
        <div style={{ marginTop: 24, display: 'flex', gap: 28 }}>
          {[
            { k: 'rupees', label: 'By Rupees' },
            { k: 'grams',  label: 'By Grams' },
          ].map(t => {
            const active = mode === t.k;
            return (
              <button
                key={t.k}
                onClick={() => { setMode(t.k); setAmount(''); }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '4px 0 10px', position: 'relative',
                  fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? MAROON : '#9A8F84', letterSpacing: 0.2,
                }}>
                {t.label}
                {active && (
                  <span style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0,
                    height: 2, background: MAROON, borderRadius: 2,
                  }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Amount input (single field, inline unit) ── */}
        <label
          onClick={() => inputRef.current?.focus()}
          style={{
            marginTop: 14, display: 'flex', alignItems: 'center',
            background: '#fff', borderRadius: 12,
            border: `1px solid ${BMG.line}`,
            padding: '0 16px', height: 60, cursor: 'text',
          }}>
          <span style={{
            fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 22,
            color: '#1E1B13', fontWeight: 600, marginRight: 8,
          }}>{mode === 'rupees' ? '₹' : ''}</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 22, fontWeight: 600,
              color: '#1E1B13', minWidth: 0,
            }}/>
          <span style={{
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 13, color: '#9A8F84', fontWeight: 600,
          }}>{mode === 'rupees' ? 'INR' : 'gm'}</span>
        </label>

        {/* Equivalence helper */}
        <div style={{
          marginTop: 8, fontFamily: `'Manrope', ${BMG.sans}`,
          fontSize: 12, color: '#6E655C',
        }}>
          {mode === 'rupees'
            ? <>≈ <b style={{ color: '#1E1B13' }}>{grams.toFixed(3)} gm</b> of {purity}KT gold</>
            : <>≈ <b style={{ color: '#1E1B13' }}>₹{rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></>}
        </div>

        {/* Min text */}
        <div style={{
          marginTop: 14, fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12, color: '#9A8F84',
        }}>
          Minimum booking: <b style={{ color: '#1E1B13' }}>₹500</b>.
        </div>

        {/* ── Disclaimer (quiet) ──────────────────── */}
        <div style={{
          marginTop: 28, paddingTop: 16,
          borderTop: `1px dashed ${BMG.line}`,
          fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 11, color: '#9A8F84',
          lineHeight: 1.55, fontStyle: 'italic',
        }}>
          At redemption, making charges, other charges and GST will be applicable on the prevailing rate.
        </div>
      </div>

      {/* ── Sticky CTA ────────────────────────────── */}
      <div style={{
        padding: '12px 18px 14px', background: '#fff',
        borderTop: `1px solid ${BMG.line}`,
      }}>
        <button
          disabled={!canProceed}
          style={{
            width: '100%', height: 52, border: 'none',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            background: canProceed ? '#AF826D' : '#D6C4C4',
            color: '#fff',
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 13, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase', borderRadius: 12,
            boxShadow: canProceed ? '0 6px 14px rgba(175,130,109,0.3)' : 'none',
            transition: 'background 200ms ease',
          }}>
          Proceed to Book
        </button>
      </div>
    </>
  );
}

window.BookMyGoldPage = BookMyGoldPage;

// ─── REDEEM GOLD SCREEN ──────────────────────────────────────
// Reached from the Redeem tab "Redeem Now" CTA
function RedeemGoldScreen({ onBack }) {
  const [purity, setPurity] = React.useState('22');
  const [mode,   setMode  ] = React.useState('amount'); // 'amount' | 'grams'
  const [amount, setAmount] = React.useState('');
  const [accepted, setAccepted] = React.useState(false);
  const inputRef = React.useRef(null);

  const rate = purity === '22' ? 14330 : 11720;
  const parsed = parseFloat(amount) || 0;
  const grams  = mode === 'amount' ? (parsed / rate) : parsed;
  const rupees = mode === 'amount' ? parsed : parsed * rate;

  // For empty state the spec shows ₹ 0/gm (no rate available). We keep it dynamic.
  const avgRate = 0; // no active booking → avg rate shown as 0 per spec

  const canProceed = accepted && parsed > 0;

  return (
    <>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 15px 12px', background: '#fff',
        borderBottom: `1px solid ${BMG.line}`,
      }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 36, height: 36, borderRadius: 50, background: 'transparent',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -6,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{
          fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 19,
          color: '#1E1B13', letterSpacing: 0.2,
        }}>Redeem My Gold</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#FBF7F3', padding: '18px 18px 24px' }}>
        {/* Purity selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { k: '22', label: '22KT', fineness: '916' },
            { k: '18', label: '18KT', fineness: '750' },
          ].map(p => {
            const active = purity === p.k;
            return (
              <button
                key={p.k}
                onClick={() => setPurity(p.k)}
                style={{
                  height: 44, cursor: 'pointer', borderRadius: 10,
                  border: active ? `1px solid ${MAROON}` : `1px solid ${MAROON}`,
                  background: active ? MAROON : '#fff',
                  color:      active ? '#fff'  : MAROON,
                  fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                <span>{p.label}</span>
                <span style={{ opacity: 0.85, fontWeight: 500, fontSize: 12 }}>({p.fineness})</span>
              </button>
            );
          })}
        </div>

        {/* Avg rate card */}
        <div style={{
          marginTop: 16, background: '#fff', borderRadius: 14,
          border: `1px solid ${BMG.line}`,
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(30,27,19,0.04)',
        }}>
          <div style={{
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 10.5, color: '#9A8F84', fontWeight: 600,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>{purity}GO Avg. Rate</div>
          <div style={{
            marginTop: 6, fontFamily: `'Noto Serif', ${BMG.serif}`,
            fontSize: 26, fontWeight: 700, color: MAROON_DK, letterSpacing: 0.2,
          }}>
            ₹ {avgRate.toLocaleString('en-IN')}<span style={{ fontSize: 13, fontWeight: 500, color: '#6E655C' }}>/gm</span>
            <span style={{ color: '#9A8F84', fontFamily: `'Manrope', ${BMG.sans}`, fontWeight: 500, fontSize: 14, margin: '0 8px' }}>|</span>
            <span style={{ fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 14, fontWeight: 700, color: MAROON }}>{purity}GO</span>
          </div>
        </div>

        {/* Mode tabs */}
        <div style={{ marginTop: 24, display: 'flex', gap: 28, borderBottom: `1px solid ${BMG.line}` }}>
          {[
            { k: 'amount', label: 'Redeem by Amount' },
            { k: 'grams',  label: 'Redeem by Grams' },
          ].map(t => {
            const active = mode === t.k;
            return (
              <button
                key={t.k}
                onClick={() => { setMode(t.k); setAmount(''); }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '4px 0 10px', position: 'relative',
                  fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? MAROON : '#9A8F84', letterSpacing: 0.2,
                }}>
                {t.label}
                {active && (
                  <span style={{
                    position: 'absolute', left: 0, right: 0, bottom: -1,
                    height: 3, background: MAROON, borderRadius: 2,
                  }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* Input */}
        <label
          onClick={() => inputRef.current?.focus()}
          style={{
            marginTop: 18, display: 'flex', alignItems: 'center',
            background: '#fff', borderRadius: 12,
            border: `1px solid ${BMG.line}`,
            padding: '0 16px', height: 60, cursor: 'text',
          }}>
          <span style={{
            fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 22,
            color: '#1E1B13', fontWeight: 700, marginRight: 10,
          }}>{mode === 'amount' ? '₹' : ''}</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 20, fontWeight: 600,
              color: '#1E1B13', minWidth: 0,
            }}/>
          <span style={{
            fontFamily: `'Noto Serif', ${BMG.serif}`, fontSize: 20,
            fontWeight: 700, color: '#1E1B13', margin: '0 12px',
          }}>=</span>
          <span style={{
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 14, fontWeight: 700,
            color: '#1E1B13',
          }}>
            {mode === 'amount'
              ? `${grams.toFixed(3)} gm`
              : `\u20B9 ${rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          </span>
        </label>

        <div style={{
          marginTop: 14, fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12, color: '#6E655C',
        }}>
          You can redeem your gold at store only.
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{
        padding: '14px 18px 14px', background: '#fff',
        borderTop: `1px solid ${BMG.line}`,
      }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          marginBottom: 12,
        }}>
          <span
            onClick={() => setAccepted(v => !v)}
            style={{
              width: 18, height: 18, borderRadius: 4,
              border: `2px solid ${MAROON}`,
              background: accepted ? MAROON : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
            {accepted && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </span>
          <div style={{
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 12.5, color: '#1E1B13',
          }}>
            I accept <span style={{ color: '#2563C4', textDecoration: 'underline', cursor: 'pointer' }}>terms & conditions</span>
          </div>
        </label>

        <button
          disabled={!canProceed}
          style={{
            width: '100%', height: 50, border: 'none',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            background: canProceed ? MAROON : '#D6C4C4',
            color: '#fff',
            fontFamily: `'Manrope', ${BMG.sans}`, fontSize: 13, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase', borderRadius: 12,
            boxShadow: canProceed ? '0 6px 14px rgba(107,31,43,0.22)' : 'none',
            transition: 'background 200ms ease',
          }}>
          Redeem
        </button>
      </div>
    </>
  );
}