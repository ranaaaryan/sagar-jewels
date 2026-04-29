import React from 'react';
// Sign In — OTP-based two-step flow.
//   Step 1: 10-digit Indian mobile number
//   Step 2: 6-digit OTP with auto-advance, paste support, resend timer
// On success: marks state.user.phone and routes to home.

const LT = window.JEWEL_TOKENS;
const SI_BG        = 'rgb(250,249,246)';
const SI_ACCENT    = 'rgb(175,130,109)';
const SI_ACCENT_DK = 'rgb(119,88,66)';
const SI_CREAM     = 'rgb(255,246,242)';
const SI_INK       = '#2F3430';
const SI_INK_SOFT  = 'rgb(92,96,92)';
const SI_LINE      = 'rgba(175,130,109,0.22)';
const SI_ERROR     = '#D65A50';

const OTP_LENGTH      = 6;
const RESEND_SECONDS  = 30;

function SignInPage({ go, state, setState }) {
  const [step, setStep] = React.useState('phone');     // 'phone' | 'otp'
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = React.useState(null);
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const [verifying, setVerifying] = React.useState(false);
  const inputRefs = React.useRef([]);

  // Resend timer countdown
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  function isValidPhone(p) {
    return /^[6-9]\d{9}$/.test((p || '').replace(/\D/g, ''));
  }

  function sendOtp() {
    setError(null);
    if (!isValidPhone(phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setStep('otp');
    setOtp(Array(OTP_LENGTH).fill(''));
    setSecondsLeft(RESEND_SECONDS);
    setTimeout(() => inputRefs.current[0]?.focus(), 60);
  }

  function resendOtp() {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError(null);
    setTimeout(() => inputRefs.current[0]?.focus(), 60);
  }

  function setOtpAt(idx, value) {
    const v = (value || '').replace(/\D/g, '').slice(0, 1);
    setOtp(prev => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
    setError(null);
  }

  function onOtpKey(e, idx) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function onOtpPaste(e) {
    const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);
    const focusIdx = Math.min(text.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }

  function verify() {
    setError(null);
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      setError('Enter the full 6-digit code.');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      // Demo behaviour: any valid 6-digit code is accepted; '111111' rejected to demo error state.
      if (code === '111111') {
        setVerifying(false);
        setError('Incorrect OTP. Please try again.');
        return;
      }
      if (setState) {
        setState(s => ({ ...s, user: { ...s.user, phone: `+91${phone}` } }));
      }
      setVerifying(false);
      go('home');
    }, 700);
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: SI_BG, padding: '20px 24px 32px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Top bar — back + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => step === 'otp' ? setStep('phone') : go('login')}
          aria-label="Back"
          style={authBackBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={SI_INK}
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div style={{ flex: 1 }}/>
        <BrandMark/>
      </div>

      {/* Headline */}
      <div style={{ marginTop: 36 }}>
        <div style={{
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 11, letterSpacing: 2.2,
          color: SI_ACCENT_DK, fontWeight: 700, textTransform: 'uppercase',
        }}>{step === 'phone' ? 'Welcome back' : 'Verify it’s you'}</div>
        <h1 style={{
          margin: '8px 0 0',
          fontFamily: `'Noto Serif', ${LT.serif}`,
          fontSize: 34, fontWeight: 700, color: SI_INK, letterSpacing: -0.4, lineHeight: 1.15,
        }}>
          {step === 'phone'
            ? <>Sign in with<br/>your <em style={italicSpan()}>mobile</em></>
            : <>Enter the code we<br/>texted to <em style={italicSpan()}>+91 {phone}</em></>}
        </h1>
        <p style={{
          margin: '14px 0 0',
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 13.5, color: SI_INK_SOFT, lineHeight: 1.55,
        }}>
          {step === 'phone'
            ? 'We’ll send a 6-digit code to verify it’s you. No passwords needed.'
            : 'Code expires in 5 minutes.'}
        </p>
      </div>

      {/* Form */}
      <div style={{ marginTop: 28 }}>
        {step === 'phone'
          ? <PhoneField phone={phone} setPhone={v => { setPhone(v); setError(null); }} error={error}/>
          : <OtpFields otp={otp} setOtpAt={setOtpAt} onOtpKey={onOtpKey} onOtpPaste={onOtpPaste}
                       inputRefs={inputRefs} error={error}/>}
      </div>

      {/* Resend / change number row */}
      {step === 'otp' && (
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 12.5,
        }}>
          <button onClick={() => setStep('phone')} style={authLinkBtn}>Change number</button>
          {secondsLeft > 0
            ? <span style={{ color: SI_INK_SOFT }}>Resend in <strong style={{ color: SI_INK }}>{secondsLeft}s</strong></span>
            : <button onClick={resendOtp} style={authLinkBtn}>Resend code</button>}
        </div>
      )}

      <div style={{ flex: 1 }}/>

      {/* CTA */}
      <button
        onClick={step === 'phone' ? sendOtp : verify}
        disabled={verifying}
        style={authCtaBtn(verifying)}
      >
        <span>{step === 'phone'
          ? 'SEND OTP'
          : (verifying ? 'VERIFYING…' : 'VERIFY & SIGN IN')}</span>
        <span style={authCtaArrow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </span>
      </button>

      {/* Sign-up link */}
      <div style={{
        marginTop: 16, textAlign: 'center',
        fontFamily: `'Manrope', ${LT.sans}`, fontSize: 13, color: SI_INK_SOFT,
      }}>
        New to Sagar Jewellers?{' '}
        <span onClick={() => go('signup')} style={{
          color: SI_ACCENT_DK, fontWeight: 700, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 2,
        }}>Create account</span>
      </div>
    </div>
  );
}

/* ─── Shared field components (also used by SignUp via window) ──────── */

function PhoneField({ phone, setPhone, error, label = 'Mobile number' }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <div style={fieldShell(error)}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: SI_INK }}>+91</span>
        <span style={{ width: 1, height: 24, background: SI_LINE }}/>
        <input
          type="tel" inputMode="numeric"
          value={phone}
          onChange={e => setPhone((e.target.value || '').replace(/\D/g, '').slice(0, 10))}
          placeholder="98XXX XXXXX"
          autoFocus
          style={inputStyle}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function OtpFields({ otp, setOtpAt, onOtpKey, onOtpPaste, inputRefs, error }) {
  return (
    <div>
      <label style={fieldLabel}>One-time code</label>
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        {otp.map((v, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="tel" inputMode="numeric" maxLength={1}
            value={v}
            onChange={e => setOtpAt(i, e.target.value)}
            onKeyDown={e => onOtpKey(e, i)}
            onPaste={onOtpPaste}
            aria-label={`Digit ${i + 1}`}
            style={{
              flex: 1, height: 58,
              borderRadius: 12,
              border: `1.5px solid ${error ? SI_ERROR : (v ? SI_ACCENT : SI_LINE)}`,
              background: '#fff', textAlign: 'center',
              fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: SI_INK,
              outline: 'none', minWidth: 0,
              transition: 'border-color 160ms ease',
            }}
          />
        ))}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }) {
  return (
    <div style={{
      marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'Manrope', fontSize: 12, color: SI_ERROR, fontWeight: 600,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 17h.01"/>
      </svg>
      {children}
    </div>
  );
}

function BrandMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: `linear-gradient(135deg, ${SI_ACCENT} 0%, ${SI_ACCENT_DK} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: SI_CREAM, fontFamily: `'Noto Serif', ${LT.serif}`, fontSize: 15, fontWeight: 700,
        boxShadow: '0 4px 12px rgba(119,88,66,0.25)',
      }}>A</div>
      <div style={{
        fontFamily: `'Noto Serif', ${LT.serif}`, fontSize: 12, fontWeight: 600,
        letterSpacing: 2, color: SI_INK, textTransform: 'uppercase',
      }}>Sagar Jewellers</div>
    </div>
  );
}

/* ─── style helpers ────────────────────────────────────── */
const authBackBtn = {
  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
  background: '#fff', border: 'none', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(47,52,48,0.06)',
};

const authLinkBtn = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  fontFamily: 'Manrope', fontWeight: 700, fontSize: 12.5, color: SI_ACCENT_DK,
  textDecoration: 'underline', textUnderlineOffset: 2,
};

const fieldLabel = {
  fontFamily: `'Manrope', sans-serif`, fontSize: 11, fontWeight: 700,
  color: SI_INK_SOFT, letterSpacing: 0.6, textTransform: 'uppercase',
};

const inputStyle = {
  flex: 1, border: 'none', outline: 'none', background: 'transparent',
  fontFamily: 'Manrope', fontSize: 16, fontWeight: 600, color: SI_INK,
  letterSpacing: 0.4, minWidth: 0,
};

function fieldShell(error) {
  return {
    marginTop: 8,
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#fff', borderRadius: 14,
    border: `1px solid ${error ? SI_ERROR : SI_LINE}`,
    padding: '0 16px', height: 58,
  };
}

function italicSpan() {
  return {
    fontFamily: `'Noto Serif', ${LT.serif}`, fontStyle: 'italic',
    fontWeight: 500, color: SI_ACCENT_DK,
  };
}

function authCtaBtn(disabled) {
  return {
    marginTop: 24, width: '100%', height: 60, border: 'none',
    borderRadius: 999,
    background: disabled ? '#C9BFA8' : SI_ACCENT,
    color: SI_CREAM,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 12px 0 30px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: `'Noto Serif', sans-serif`,
    fontSize: 16, fontWeight: 700, letterSpacing: 0.5,
    boxShadow: '0 12px 24px -6px rgba(119,88,66,0.32)',
  };
}

const authCtaArrow = {
  width: 44, height: 44, borderRadius: '50%', background: SI_CREAM,
  color: SI_ACCENT_DK,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// Expose helpers so SignUp can reuse them without re-defining the same UI.
window.AuthHelpers = {
  PhoneField, OtpFields, ErrorText, BrandMark,
  authBackBtn, authLinkBtn, fieldLabel, inputStyle, fieldShell,
  italicSpan, authCtaBtn, authCtaArrow,
  OTP_LENGTH, RESEND_SECONDS,
  colors: { SI_BG, SI_ACCENT, SI_ACCENT_DK, SI_CREAM, SI_INK, SI_INK_SOFT, SI_LINE, SI_ERROR },
};

window.SignInPage = SignInPage;
