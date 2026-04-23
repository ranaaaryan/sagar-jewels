import React from 'react';
// 10+1 Plan — Personal Details registration form.
// Two collapsible sections: (01) Recipient and (02) Nominee. Each section
// contains a KYC verification block (PAN + doc upload, Aadhaar + simulated OTP).

const TLR = window.JEWEL_TOKENS;
const { useState: useStateLR } = React;

function LoyaltyRegisterPage({ go, state, setState }) {
  const [form, setForm] = useStateLR({
    // Recipient
    name: state.user.name.split(' ')[0] || 'Aaryan',
    email: '',
    country: 'India',
    mobile: '+91 | 9876543210',
    address: '',
    city: '',
    pincode: '',
    stateName: 'Uttar Pradesh',
    dob: '',
    spouseDob: '',
    anniversary: '',
    pan: '',
    aadhaar: '',
    otpSent: false,
    otp: '',
    kycVerified: false,
    // Nominee
    nomName: '',
    nomRelation: 'Spouse',
    nomDob: '',
    nomMobile: '',
    nomAddress: '',
    nomPan: '',
    nomAadhaar: '',
    nomOtpSent: false,
    nomOtp: '',
    nomKycVerified: false,
  });
  const [openRecipient, setOpenRecipient] = useStateLR(true);
  const [openNominee, setOpenNominee]     = useStateLR(false);

  function up(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function onSubmit() {
    setState(s => ({
      ...s,
      loyalty: {
        ...s.loyalty,
        registered: true,
        monthly: s.loyalty.draftMonthly || s.loyalty.monthly,
        autopay: s.loyalty.autopay || { enabled: false },
        nominee: { name: form.nomName, relation: form.nomRelation },
        kyc: {
          recipientVerified: !!form.kycVerified,
          nomineeVerified: !!form.nomKycVerified,
        },
      },
    }));
    go('loyalty');
  }

  return (
    <>
      <TopBar title="10+1" onBack={() => go('loyalty')} />
      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#FAF5EC',
        borderTop: '1px solid rgba(142, 25, 54, 0.35)',
      }}>
        <div style={{ padding: '14px 18px 24px' }}>

          <Section
            number="01" title="Recipient details"
            open={openRecipient} onToggle={() => setOpenRecipient(o => !o)}
            verified={!!form.kycVerified}
          >
            <FieldLR label="Name"  value={form.name}  onChange={v => up('name', v)} />
            <FieldLR label="Email*" value={form.email} onChange={v => up('email', v)} />
            <FieldLR label="Country"        value={form.country} onChange={v => up('country', v)} muted />
            <FieldLR label="Mobile number*" value={form.mobile}  onChange={v => up('mobile', v)}  muted />
            <FieldLR label="Address*" value={form.address} onChange={v => up('address', v)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FieldLR label="City*"    value={form.city}    onChange={v => up('city', v)}    underline={false} compact />
              <FieldLR label="Pincode*" value={form.pincode} onChange={v => up('pincode', v)} underline={false} compact />
            </div>
            <Hairline />

            <FieldLR
              label="State*" value={form.stateName}
              onChange={v => up('stateName', v)}
              rightIcon={<Icon.Chevron width={12} height={12} style={{ color: '#2A2724' }}/>}
            />

            <DateFieldLR label="Date of Birth"        value={form.dob}         onChange={v => up('dob', v)} />
            <DateFieldLR label="Spouse Date of Birth" value={form.spouseDob}   onChange={v => up('spouseDob', v)} />
            <DateFieldLR label="Anniversary Date"     value={form.anniversary} onChange={v => up('anniversary', v)} />

            <KycBlock
              form={form} up={up}
              fields={{ pan: 'pan', aadhaar: 'aadhaar', otpSent: 'otpSent', otp: 'otp', verified: 'kycVerified' }}
            />
          </Section>

          <Section
            number="02" title="Nominee details"
            open={openNominee} onToggle={() => setOpenNominee(o => !o)}
            verified={!!form.nomKycVerified}
          >
            <FieldLR label="Full name*"      value={form.nomName} onChange={v => up('nomName', v)} />
            <RelationField  value={form.nomRelation} onChange={v => up('nomRelation', v)} />
            <DateFieldLR label="Date of Birth" value={form.nomDob} onChange={v => up('nomDob', v)} />
            <FieldLR label="Mobile number*" value={form.nomMobile} onChange={v => up('nomMobile', v)} />
            <FieldLR label="Address*"       value={form.nomAddress} onChange={v => up('nomAddress', v)} />

            <KycBlock
              form={form} up={up}
              fields={{ pan: 'nomPan', aadhaar: 'nomAadhaar', otpSent: 'nomOtpSent', otp: 'nomOtp', verified: 'nomKycVerified' }}
            />
          </Section>

          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontFamily: TLR.sans, fontSize: 12, color: '#5B524A', lineHeight: 1.5,
            marginTop: 14, padding: '0 4px',
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

// ─── Section shell ──────────────────────────────────────────
function Section({ number, title, open, onToggle, verified, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: `1px solid ${TLR.line}`,
      marginBottom: 14, overflow: 'hidden',
    }}>
      <button type="button" onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', width: '100%',
        background: 'transparent', border: 'none', cursor: 'pointer',
        textAlign: 'left',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: '#541B2E', color: '#F2DDA7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Noto Serif', serif", fontSize: 14, fontWeight: 700,
          flexShrink: 0, letterSpacing: 0.5,
        }}>{number}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TLR.sans, fontSize: 15, fontWeight: 700, color: '#2A2724' }}>
            {title}
          </div>
          {verified && (
            <div style={{ fontFamily: TLR.sans, fontSize: 11, color: '#4C6944', marginTop: 3, fontWeight: 700, letterSpacing: 0.6 }}>
              ✓ KYC verified
            </div>
          )}
        </div>
        <div style={{
          width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 180ms ease', color: '#541B2E',
        }}>
          <Icon.Chevron width={14} height={14}/>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 18px 16px' }}>
          <div style={{ height: 1, background: '#E8E1D5', marginBottom: 4 }}/>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── KYC block ──────────────────────────────────────────────
function KycBlock({ form, up, fields }) {
  const { pan, aadhaar, otpSent, otp, verified } = fields;
  const aadhaarVal = form[aadhaar] || '';
  const otpVal     = form[otp] || '';
  const isVerified = !!form[verified];
  const wasSent    = !!form[otpSent];

  function sendOtp() {
    if (aadhaarVal.length < 12) return;
    up(otpSent, true);
  }
  function doVerify() {
    if (otpVal.length < 4) return;
    up(verified, true);
  }
  function reset() {
    up(otpSent, false);
    up(otp, '');
    up(verified, false);
  }

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: TLR.sans, fontSize: 11, color: '#541B2E',
        letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700,
        marginBottom: 6,
      }}>
        <span>KYC verification</span>
        {isVerified && (
          <span style={{
            padding: '3px 10px', borderRadius: 999,
            background: '#E6EEE1', color: '#4C6944',
            fontSize: 10, letterSpacing: 0.8,
          }}>Verified</span>
        )}
      </div>

      {/* PAN + upload */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 14, alignItems: 'end' }}>
        <FieldLR
          label="Enter PAN number"
          value={form[pan] || ''}
          onChange={v => up(pan, v.toUpperCase().slice(0, 10))}
          underline={false} compact
        />
        <div style={{
          height: 78, border: `1px solid ${TLR.line}`, borderRadius: 6,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 6,
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
      <Hairline top={14} bottom={0}/>

      {/* Aadhaar */}
      <FieldLR
        label="Aadhaar number"
        value={aadhaarVal}
        onChange={v => up(aadhaar, v.replace(/\D/g, '').slice(0, 12))}
        underline={!wasSent && !isVerified}
      />

      {/* OTP flow */}
      {!wasSent && !isVerified && (
        <button type="button" onClick={sendOtp} disabled={aadhaarVal.length < 12} style={{
          marginTop: 10, padding: '10px 18px', borderRadius: 999,
          border: `1.5px solid #541B2E`,
          background: 'transparent', color: '#541B2E',
          fontFamily: TLR.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
          textTransform: 'uppercase',
          cursor: aadhaarVal.length < 12 ? 'not-allowed' : 'pointer',
          opacity: aadhaarVal.length < 12 ? 0.45 : 1,
        }}>Send OTP</button>
      )}

      {wasSent && !isVerified && (
        <>
          <FieldLR
            label="Enter OTP"
            value={otpVal}
            onChange={v => up(otp, v.replace(/\D/g, '').slice(0, 6))}
            underline={false}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 4, alignItems: 'center' }}>
            <button type="button" onClick={doVerify} disabled={otpVal.length < 4} style={{
              padding: '10px 22px', borderRadius: 999, border: 'none',
              background: '#541B2E', color: '#fff',
              fontFamily: TLR.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
              textTransform: 'uppercase',
              cursor: otpVal.length < 4 ? 'not-allowed' : 'pointer',
              opacity: otpVal.length < 4 ? 0.45 : 1,
            }}>Verify</button>
            <button type="button" onClick={() => up(otpSent, false)} style={{
              padding: 0, background: 'transparent', border: 'none',
              fontFamily: TLR.sans, fontSize: 12, color: '#541B2E',
              textDecoration: 'underline', cursor: 'pointer',
            }}>Resend</button>
          </div>
          <div style={{
            marginTop: 8, fontFamily: TLR.sans, fontSize: 11, color: '#6E655C',
          }}>A 6-digit code was sent to the registered mobile.</div>
        </>
      )}

      {isVerified && (
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: '#E6EEE1', color: '#4C6944',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" fill="#4C6944"/>
            <path d="M5.5 9.5l2.3 2.2L12.5 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <div style={{ flex: 1, fontFamily: TLR.sans, fontSize: 13, fontWeight: 700 }}>
            KYC verified successfully
          </div>
          <button type="button" onClick={reset} style={{
            padding: 0, background: 'transparent', border: 'none',
            fontFamily: TLR.sans, fontSize: 11, color: '#4C6944',
            textDecoration: 'underline', cursor: 'pointer',
          }}>Redo</button>
        </div>
      )}
    </div>
  );
}

// ─── Field atoms ────────────────────────────────────────────
function FieldLR({ label, value, onChange, placeholder, rightIcon, muted, underline = true, compact }) {
  return (
    <div style={{ paddingTop: compact ? 12 : 14, paddingBottom: underline ? 10 : 6 }}>
      <div style={{
        fontFamily: TLR.sans, fontSize: 12,
        color: muted ? '#9A9085' : '#2A2724',
        fontWeight: muted ? 400 : 700,
        marginBottom: 6, letterSpacing: 0.1,
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
      {underline && <Hairline top={10} bottom={0}/>}
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
          <div style={{ fontFamily: TLR.sans, fontSize: 16, fontWeight: 700, color: '#2A2724' }}>{label}</div>
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
      <Hairline top={10} bottom={0}/>
    </div>
  );
}

function RelationField({ value, onChange }) {
  const options = ['Spouse', 'Parent', 'Child', 'Sibling', 'Other'];
  return (
    <div style={{ paddingTop: 14, paddingBottom: 10 }}>
      <div style={{
        fontFamily: TLR.sans, fontSize: 12, color: '#2A2724',
        fontWeight: 700, marginBottom: 6, letterSpacing: 0.1,
      }}>Relationship*</div>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', border: 'none', outline: 'none',
            background: 'transparent', appearance: 'none', WebkitAppearance: 'none',
            fontFamily: TLR.sans, fontSize: 16, fontWeight: 700, color: '#2A2724',
            padding: 0, paddingRight: 24, cursor: 'pointer',
          }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          color: '#2A2724', pointerEvents: 'none',
        }}>
          <Icon.Chevron width={12} height={12}/>
        </div>
      </div>
      <Hairline top={10} bottom={0}/>
    </div>
  );
}

function Hairline({ top = 0, bottom = 14 }) {
  return <div style={{ height: 1, background: '#E8E1D5', marginTop: top, marginBottom: bottom }}/>;
}

window.LoyaltyRegisterPage = LoyaltyRegisterPage;
