import React from 'react';
// Custom Jewel Design — intake form for bespoke pieces.
// Grouped into cards: Personal Info · Jewelry Details · Specifications ·
// Design Details · Reference Images · Timeline & Expectations.

const CJ_T = window.JEWEL_TOKENS;
const CJ_ACCENT    = 'rgb(172,129,108)';
const CJ_ACCENT_DK = 'rgb(119,88,66)';
const CJ_INK       = '#1E1B13';
const CJ_INK_SOFT  = '#6E655C';
const CJ_LABEL     = '#4B4640';
const CJ_LINE      = 'rgba(47,52,48,0.10)';
const CJ_FIELD     = '#FAF8F4';
const CJ_CARD      = '#FFFFFF';
const CJ_PLACEHOLDER = '#ACA69C';

function CustomiseJewelPage({ go }) {
  const [form, setForm] = React.useState({
    fullName: '', phone: '', email: '',
    description: '', jewelType: '', specificDetails: '',
    diamondShape: '', carat: '',
    metalType: '', metalColor: '', budget: '',
    designSpecifics: '',
    refChoice: '', files: [],
    timeline: '', expectations: '',
  });
  const [submitted, setSubmitted] = React.useState(false);
  const fileRef = React.useRef(null);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function onPickFiles(e) {
    const list = Array.from(e.target.files || []);
    set('files', [...form.files, ...list]);
  }
  function removeFile(i) {
    set('files', form.files.filter((_, idx) => idx !== i));
  }

  function submit(e) {
    e?.preventDefault?.();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.description.trim()) {
      alert('Please fill in Full Name, Phone, Email and Jewelry description.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); go('home'); }, 1600);
  }

  return (
    <>
      <TopBar title="Custom Jewelry Design" onBack={() => go('home')}/>

      <form onSubmit={submit} style={{
        flex: 1, overflowY: 'auto', background: CJ_T.bg,
        padding: '10px 16px 40px',
      }}>
        {/* Intro */}
        <div style={{ textAlign: 'center', padding: '6px 10px 18px' }}>
          <div style={{
            fontFamily: `'Noto Serif', ${CJ_T.serif}`, fontSize: 22, fontWeight: 700,
            color: CJ_INK, lineHeight: 1.2,
          }}>Custom Jewelry Design</div>
          <div style={{
            fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 12.5,
            color: CJ_INK_SOFT, marginTop: 6, lineHeight: 1.55,
          }}>Create your dream piece with our expert craftsmanship</div>
        </div>

        {/* 1 — Personal Information */}
        <Card>
          <CardHead icon={<IconUser/>}  iconBg="#FBE6DA" iconColor="#D2794A" title="Personal Information"/>
          <Row2>
            <Field label="Full Name" required>
              <Input value={form.fullName} onChange={v => set('fullName', v)} placeholder="Enter your full name"/>
            </Field>
            <Field label="Phone Number" required>
              <PhoneInput value={form.phone} onChange={v => set('phone', v)}/>
            </Field>
          </Row2>
          <Field label="Email Address" required>
            <Input type="email" value={form.email} onChange={v => set('email', v)} placeholder="your.email@example.com"/>
          </Field>
        </Card>

        {/* 2 — Jewelry Details */}
        <Card>
          <CardHead icon={<IconGift/>} iconBg="#EBE0F7" iconColor="#8A5CC4" title="Jewelry Details"/>
          <Field label="Tell us about your custom jewelry" required>
            <Textarea value={form.description} onChange={v => set('description', v)}
              placeholder="Describe your dream jewelry piece… What inspires you? Any specific requirements or special meaning?"
              rows={4}/>
          </Field>
          <Row2>
            <Field label="Jewelry Type">
              <Select value={form.jewelType} onChange={v => set('jewelType', v)}
                options={[
                  { v: '',          l: 'Select Jewelry Type' },
                  { v: 'ring',      l: 'Ring' },
                  { v: 'necklace',  l: 'Necklace' },
                  { v: 'earrings',  l: 'Earrings' },
                  { v: 'bracelet',  l: 'Bracelet' },
                  { v: 'bangle',    l: 'Bangle' },
                  { v: 'pendant',   l: 'Pendant' },
                  { v: 'other',     l: 'Other' },
                ]}/>
            </Field>
            <Field label="Specific Details">
              <Input value={form.specificDetails} onChange={v => set('specificDetails', v)}
                placeholder="e.g., Brooch pin, ear cuffs, etc."/>
            </Field>
          </Row2>
        </Card>

        {/* 3 — Specifications */}
        <Card>
          <CardHead icon={<IconSliders/>} iconBg="#FFF1CC" iconColor="#C99415" title="Specifications"/>
          <Row2>
            <Field label="Diamond Shape">
              <Select value={form.diamondShape} onChange={v => set('diamondShape', v)}
                options={[
                  { v: '',          l: 'Select Diamond Shape' },
                  { v: 'round',     l: 'Round Brilliant' },
                  { v: 'princess',  l: 'Princess' },
                  { v: 'oval',      l: 'Oval' },
                  { v: 'emerald',   l: 'Emerald' },
                  { v: 'cushion',   l: 'Cushion' },
                  { v: 'pear',      l: 'Pear' },
                  { v: 'marquise',  l: 'Marquise' },
                  { v: 'heart',     l: 'Heart' },
                ]}/>
            </Field>
            <Field label="Diamond Carat Weight">
              <Select value={form.carat} onChange={v => set('carat', v)}
                options={[
                  { v: '',    l: 'Select Carat Weight' },
                  { v: '0.25',l: '0.25 ct' },
                  { v: '0.5', l: '0.5 ct' },
                  { v: '0.75',l: '0.75 ct' },
                  { v: '1',   l: '1 ct' },
                  { v: '1.5', l: '1.5 ct' },
                  { v: '2',   l: '2 ct' },
                  { v: '2+',  l: '2 ct +' },
                ]}/>
            </Field>
          </Row2>
          <Row2>
            <Field label="Metal Type">
              <MetalToggle value={form.metalType} onChange={v => set('metalType', v)}/>
            </Field>
            <Field label="Metal Color">
              <Input value={form.metalColor} onChange={v => set('metalColor', v)}
                placeholder="e.g., Yellow Gold, White Gold, Rose Gold"/>
            </Field>
          </Row2>
          <Field label="What's your budget ?">
            <Input value={form.budget} onChange={v => set('budget', v)}
              placeholder="Enter your budget" inputMode="numeric"/>
          </Field>
        </Card>

        {/* 4 — Design Details */}
        <Card>
          <CardHead icon={<IconPencil/>} iconBg="#DDF2E2" iconColor="#3C9B5D" title="Design Details"/>
          <Field label="Additional Design Specifics">
            <Textarea value={form.designSpecifics} onChange={v => set('designSpecifics', v)}
              placeholder="Engravings, initials, or other special requirements…"
              rows={3}/>
          </Field>
        </Card>

        {/* 5 — Reference Images */}
        <Card>
          <CardHead icon={<IconImage/>} iconBg="#FDE1DE" iconColor="#D9534F" title="Reference Images"/>

          <div style={{ ...labelStyle, marginBottom: 10 }}>Do you have reference images?</div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 14 }}>
            <Radio name="ref" value="website" checked={form.refChoice === 'website'}
              onChange={() => set('refChoice', 'website')} label="Yes, from your website"/>
            <Radio name="ref" value="own" checked={form.refChoice === 'own'}
              onChange={() => set('refChoice', 'own')} label="No, I'll upload my own"/>
          </div>

          <div style={{ ...labelStyle, marginBottom: 8 }}>Upload Reference Images</div>
          <button type="button" onClick={() => fileRef.current?.click()} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '100%', minHeight: 130, padding: '20px 16px',
            background: CJ_FIELD, border: `1.5px dashed ${CJ_LINE}`, borderRadius: 12,
            cursor: 'pointer', gap: 8,
          }}>
            <div style={{ color: CJ_PLACEHOLDER }}><IconImageLg/></div>
            <div style={{
              fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 13, color: CJ_INK, fontWeight: 500,
            }}>Click to upload images</div>
            <div style={{
              fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 11, color: CJ_PLACEHOLDER,
            }}>PNG, JPG, GIF up to 10MB each</div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={onPickFiles} style={{ display: 'none' }}/>

          {form.files.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {form.files.map((f, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px', borderRadius: 999,
                  background: 'rgba(122,88,67,0.08)', border: `1px solid ${CJ_LINE}`,
                  fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 11, color: CJ_INK,
                }}>
                  <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} style={{
                    border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                    display: 'inline-flex', color: CJ_INK_SOFT,
                  }} aria-label="Remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 6 — Timeline & Expectations */}
        <Card>
          <CardHead icon={<IconClock/>} iconBg="#E0E6FB" iconColor="#4F6CD8" title="Timeline & Expectations"/>
          <Row2>
            <Field label="Estimated Timeline">
              <Input value={form.timeline} onChange={v => set('timeline', v)}
                placeholder="e.g., 2 weeks, 1 month, etc."/>
            </Field>
            <Field label="Expectations & Concerns">
              <Textarea value={form.expectations} onChange={v => set('expectations', v)}
                placeholder="Your expectations, concerns, or questions…"
                rows={3}/>
            </Field>
          </Row2>
        </Card>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <button type="submit" disabled={submitted} style={{
            padding: '12px 42px', border: 'none', cursor: submitted ? 'default' : 'pointer',
            background: submitted ? '#3C9B5D' : '#111', color: '#fff', borderRadius: 10,
            fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 14, fontWeight: 700, letterSpacing: 0.6,
            boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
            transition: 'background 180ms ease',
          }}>
            {submitted ? 'Submitted ✓' : 'Submit'}
          </button>
        </div>

        <div style={{
          marginTop: 18, padding: '0 6px', textAlign: 'center',
          fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 11, color: CJ_INK_SOFT, lineHeight: 1.55,
        }}>
          By registering, you consent to receive promotional communications via the contact details provided. Please
          review our <span style={{ color: CJ_ACCENT_DK, fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</span> for details.
        </div>
      </form>
    </>
  );
}

/* ── atoms ────────────────────────────────────────────────────── */

const labelStyle = {
  fontFamily: `'Manrope', ${CJ_T?.sans || 'sans-serif'}`,
  fontSize: 12, fontWeight: 600, color: CJ_LABEL, letterSpacing: 0.2,
};

function Card({ children }) {
  return (
    <div style={{
      background: CJ_CARD, borderRadius: 14, border: `1px solid ${CJ_LINE}`,
      padding: '16px 16px 18px', marginBottom: 14,
      boxShadow: '0 2px 10px rgba(30,27,19,0.03)',
    }}>{children}</div>
  );
}

function CardHead({ icon, iconBg, iconColor, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: iconBg, color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</div>
      <div style={{
        fontFamily: `'Noto Serif', ${CJ_T.serif}`, fontSize: 16, fontWeight: 700, color: CJ_INK,
      }}>{title}</div>
    </div>
  );
}

function Row2({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10,
    }}>{children}</div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ ...labelStyle, marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#D9534F', marginLeft: 3 }}>*</span>}
      </div>
      {children}
    </div>
  );
}

const baseInputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', borderRadius: 10,
  border: `1px solid ${CJ_LINE}`, background: CJ_FIELD,
  fontFamily: `'Manrope', ${CJ_T?.sans || 'sans-serif'}`, fontSize: 13, color: CJ_INK,
  outline: 'none',
};

function Input({ value, onChange, placeholder, type = 'text', inputMode }) {
  return (
    <input
      type={type} inputMode={inputMode}
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={baseInputStyle}
      onFocus={e => e.target.style.borderColor = CJ_ACCENT}
      onBlur={e => e.target.style.borderColor = CJ_LINE}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{ ...baseInputStyle, resize: 'vertical', lineHeight: 1.5 }}
      onFocus={e => e.target.style.borderColor = CJ_ACCENT}
      onBlur={e => e.target.style.borderColor = CJ_LINE}
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          ...baseInputStyle, appearance: 'none', paddingRight: 32, cursor: 'pointer',
          color: value ? CJ_INK : CJ_PLACEHOLDER,
        }}
        onFocus={e => e.target.style.borderColor = CJ_ACCENT}
        onBlur={e => e.target.style.borderColor = CJ_LINE}
      >
        {options.map(o => (
          <option key={o.v} value={o.v} disabled={o.v === ''} hidden={o.v === ''}>{o.l}</option>
        ))}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CJ_INK_SOFT}
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  );
}

function PhoneInput({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      border: `1px solid ${CJ_LINE}`, borderRadius: 10, background: CJ_FIELD,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 10px', borderRight: `1px solid ${CJ_LINE}`,
        background: '#fff',
      }}>
        <span style={{ fontSize: 14 }}>🇮🇳</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={CJ_INK_SOFT}
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <input
        type="tel" inputMode="tel"
        value={value} onChange={e => onChange(e.target.value)}
        placeholder="+91"
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          padding: '10px 12px',
          fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 13, color: CJ_INK,
        }}
      />
    </div>
  );
}

function MetalToggle({ value, onChange }) {
  const options = [
    { v: 'gold',   l: 'Gold',   ring: 'linear-gradient(135deg,#FFD86A 0%,#D69419 60%,#9A6A13 100%)' },
    { v: 'silver', l: 'Silver', ring: 'linear-gradient(135deg,#FFFFFF 0%,#D4D6D2 60%,#8A8D89 100%)' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      padding: 4, borderRadius: 10, background: CJ_FIELD, border: `1px solid ${CJ_LINE}`,
    }}>
      {options.map(o => {
        const active = value === o.v;
        return (
          <button key={o.v} type="button" onClick={() => onChange(o.v)} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
            background: active ? '#FFFFFF' : 'transparent',
            border: `1px solid ${active ? CJ_ACCENT : 'transparent'}`,
            boxShadow: active ? '0 1px 4px rgba(119,88,66,0.14)' : 'none',
            fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 13,
            fontWeight: active ? 700 : 500,
            color: active ? CJ_ACCENT_DK : CJ_INK,
            transition: 'background 160ms ease, border-color 160ms ease',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%', background: o.ring,
              border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0,
            }}/>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

function Radio({ name, value, checked, onChange, label }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      fontFamily: `'Manrope', ${CJ_T.sans}`, fontSize: 13, color: CJ_INK,
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%',
        border: `1.6px solid ${checked ? CJ_ACCENT : '#BBB4AA'}`,
        background: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 180ms ease',
      }}>
        {checked && <span style={{
          width: 8, height: 8, borderRadius: '50%', background: CJ_ACCENT,
        }}/>}
      </span>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}/>
      {label}
    </label>
  );
}

/* ── icons ─────────────────────────────────────────────────────── */
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.6"/>
      <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4"/>
    </svg>
  );
}
function IconGift() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="8" width="17" height="5" rx="1"/>
      <path d="M5 13v8h14v-8M12 8v13"/>
      <path d="M12 8c-2-3-6-3-6 0 0 2 3 2 6 0zM12 8c2-3 6-3 6 0 0 2-3 2-6 0z"/>
    </svg>
  );
}
function IconSliders() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h12M20 17h0"/>
      <circle cx="16" cy="7" r="2"/>
      <circle cx="8" cy="12" r="2"/>
      <circle cx="18" cy="17" r="2"/>
    </svg>
  );
}
function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4l10-10-4-4L4 16v4z"/>
      <path d="M14 6l4 4"/>
    </svg>
  );
}
function IconImage() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2"/>
      <circle cx="9" cy="10" r="1.6"/>
      <path d="M5 18l5-5 4 4 3-3 3 3"/>
    </svg>
  );
}
function IconImageLg() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2"/>
      <circle cx="9" cy="10" r="1.6"/>
      <path d="M5 18l5-5 4 4 3-3 3 3"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5"/>
      <path d="M12 7.5V12l3 2"/>
    </svg>
  );
}

window.CustomiseJewelPage = CustomiseJewelPage;
