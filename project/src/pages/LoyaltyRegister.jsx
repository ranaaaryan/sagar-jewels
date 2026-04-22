import React from 'react';
// 10+1 Plan — Personal Details registration form
// Follows the fig: stacked label-over-value fields separated by hairlines,
// city+pincode in a two-col row, state with chevron, three date pickers,
// PAN upload card.

const TLR = window.JEWEL_TOKENS;
const { useState: useStateLR } = React;

function LoyaltyRegisterPage({ go, state, setState }) {
  const [form, setForm] = useStateLR({
    name: state.user.name.split(' ')[0] || 'Aaryan',
    email: '',
    country: 'India',
    mobile: '+91 | 9370430926',
    address: '',
    city: '',
    pincode: '',
    stateName: 'Bihar',
    dob: '',
    spouseDob: '',
    anniversary: '',
    pan: '',
  });

  function up(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function onSubmit() {
    // persist something so the user sees confirmation-ish behaviour
    setState(s => ({
      ...s,
      loyalty: { ...s.loyalty, registered: true, monthly: s.loyalty.draftMonthly || s.loyalty.monthly },
    }));
    go('loyalty');
  }

  return (
    <>
      <TopBar title="10+1" onBack={() => go('loyalty')} />
      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#fff',
        borderTop: '1px solid rgba(142, 25, 54, 0.35)',
      }}>
        <div style={{ padding: '4px 20px 24px' }}>

          <FieldLR
            label="Name" value={form.name}
            onChange={v => up('name', v)}
          />
          <FieldLR
            label="Email*" value={form.email}
            placeholder=""
            onChange={v => up('email', v)}
          />
          <FieldLR
            label="Country" value={form.country}
            onChange={v => up('country', v)}
            muted
          />
          <FieldLR
            label="Mobile number*" value={form.mobile}
            onChange={v => up('mobile', v)}
            muted
          />

          <FieldLR
            label="Address*" value={form.address}
            onChange={v => up('address', v)}
          />

          {/* City + Pincode row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <FieldLR
              label="City*" value={form.city}
              onChange={v => up('city', v)}
              underline={false}
              compact
            />
            <FieldLR
              label="Pincode*" value={form.pincode}
              onChange={v => up('pincode', v)}
              underline={false}
              compact
            />
          </div>
          {/* single hairline under both */}
          <div style={{ height: 1, background: '#E8E1D5', margin: '0 0 14px' }}/>

          {/* State with chevron */}
          <FieldLR
            label="State*" value={form.stateName}
            onChange={v => up('stateName', v)}
            rightIcon={<Icon.Chevron width={12} height={12} style={{ color: '#2A2724' }}/>}
          />

          {/* Date fields (read-only look, with calendar icon) */}
          <DateFieldLR label="Date of Birth"        value={form.dob}        onChange={v => up('dob', v)}/>
          <DateFieldLR label="Spouse Date of Birth" value={form.spouseDob}  onChange={v => up('spouseDob', v)}/>
          <DateFieldLR label="Anniversary Date"     value={form.anniversary} onChange={v => up('anniversary', v)}/>

          {/* PAN + upload */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: 14, alignItems: 'end', marginTop: 4 }}>
            <FieldLR
              label="Enter PAN number" value={form.pan}
              onChange={v => up('pan', v.toUpperCase())}
              underline={false}
              compact
            />
            <div style={{
              height: 86, border: `1px solid ${TLR.line}`, borderRadius: 6,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              fontFamily: TLR.sans, fontSize: 11, color: '#5B524A',
              background: '#FCFAF6', cursor: 'pointer',
            }}>
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                <path d="M3 1h8l6 6v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="#2A2724" strokeWidth="1.2"/>
                <path d="M11 1v6h6" stroke="#2A2724" strokeWidth="1.2" fill="none"/>
                <path d="M9 16V11m0 0l-2 2m2-2l2 2" stroke="#2A2724" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Click to upload
            </div>
          </div>
          <div style={{ height: 1, background: '#E8E1D5', margin: '14px 0 18px' }}/>

          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontFamily: TLR.sans, fontSize: 12, color: '#5B524A', lineHeight: 1.5,
            marginTop: 4,
          }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 3, accentColor: '#541B2E' }}/>
            I agree to the <span style={{ color: '#541B2E', textDecoration: 'underline' }}>Terms &amp; Conditions</span> of the 10+1 Plan.
          </label>

          <button onClick={onSubmit} style={{
            marginTop: 18, width: '100%', padding: '16px 0',
            borderRadius: 999, border: 'none', cursor: 'pointer',
            background: '#AF826D', color: '#fff',
            fontFamily: "'Noto Serif', serif", fontSize: 18, fontWeight: 500,
            letterSpacing: 0.3,
            boxShadow: '0 6px 14px rgba(175,130,109,0.35)',
          }}>Continue to Payment</button>

          <div style={{ height: 10 }}/>
        </div>
      </div>
    </>
  );
}

function FieldLR({ label, value, onChange, placeholder, rightIcon, muted, underline = true, compact }) {
  const labelMuted = muted || !value;
  return (
    <div style={{ paddingTop: compact ? 12 : 14, paddingBottom: underline ? 10 : 6 }}>
      <div style={{
        fontFamily: TLR.sans, fontSize: 12,
        color: muted ? '#9A9085' : '#2A2724',
        fontWeight: muted ? 400 : 700,
        marginBottom: 6,
        letterSpacing: 0.1,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          value={value}
          placeholder={placeholder}
          onChange={e => onChange && onChange(e.target.value)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: TLR.sans, fontSize: 16,
            fontWeight: muted ? 400 : 700,
            color: muted ? '#6E655C' : '#2A2724',
            padding: 0, minWidth: 0,
          }}
        />
        {rightIcon}
      </div>
      {underline && <div style={{ height: 1, background: '#E8E1D5', marginTop: 10 }}/>}
    </div>
  );
}

function DateFieldLR({ label, value, onChange }) {
  return (
    <div style={{ paddingTop: 18, paddingBottom: 12 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      }}>
        <div>
          <div style={{
            fontFamily: TLR.sans, fontSize: 16, fontWeight: 700, color: '#2A2724',
          }}>{label}</div>
          {value && (
            <div style={{ fontFamily: TLR.sans, fontSize: 12, color: '#6E655C', marginTop: 3 }}>{value}</div>
          )}
        </div>
        <button onClick={() => {
          const d = new Date();
          d.setFullYear(d.getFullYear() - (label.includes('Spouse') ? 28 : label.includes('Anniversary') ? 3 : 25));
          const iso = d.toISOString().slice(0, 10);
          onChange && onChange(iso);
        }} style={{
          width: 26, height: 26, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#541B2E',
        }} aria-label={label}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="4" width="18" height="16" rx="2" stroke="#541B2E" strokeWidth="1.4"/>
            <path d="M2 8h18" stroke="#541B2E" strokeWidth="1.4"/>
            <path d="M7 2v4M15 2v4" stroke="#541B2E" strokeWidth="1.4" strokeLinecap="round"/>
            <rect x="6" y="11" width="2.5" height="2.5" rx="0.4" fill="#541B2E"/>
            <rect x="10" y="11" width="2.5" height="2.5" rx="0.4" fill="#541B2E"/>
            <rect x="14" y="11" width="2.5" height="2.5" rx="0.4" fill="#541B2E"/>
            <rect x="6" y="15" width="2.5" height="2.5" rx="0.4" fill="#541B2E"/>
            <rect x="10" y="15" width="2.5" height="2.5" rx="0.4" fill="#541B2E"/>
          </svg>
        </button>
      </div>
      <div style={{ height: 1, background: '#E8E1D5', marginTop: 10 }}/>
    </div>
  );
}

window.LoyaltyRegisterPage = LoyaltyRegisterPage;
