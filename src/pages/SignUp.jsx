import React from 'react';
// Sign Up — collects name, mobile and email, then verifies the mobile via OTP.
//   Step 1: profile form (with T&C consent)
//   Step 2: 6-digit OTP (reuses SignIn's OtpFields via window.AuthHelpers)
// On success: writes name/phone/email to state.user and routes to home.

const LT = window.JEWEL_TOKENS;
// Pull shared field components / styles from SignIn.jsx so the two pages stay
// visually identical without duplicating the markup.
const H = () => window.AuthHelpers;

function SignUpPage({ go, state, setState }) {
  const helpers = H();
  // Defensive — SignIn.jsx must load first (it does, since main.jsx imports it).
  if (!helpers) return null;

  const {
    PhoneField, OtpFields, ErrorText, BrandMark,
    authBackBtn, authLinkBtn, fieldLabel, inputStyle, fieldShell,
    italicSpan, authCtaBtn, authCtaArrow,
    OTP_LENGTH, RESEND_SECONDS,
    colors: { SI_BG, SI_ACCENT_DK, SI_INK, SI_INK_SOFT, SI_LINE, SI_ERROR },
  } = helpers;

  const [step, setStep] = React.useState('form');      // 'form' | 'otp'
  const [name, setName]   = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [agree, setAgree] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const [otp, setOtp] = React.useState(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = React.useState(null);
  const [secondsLeft, setSecondsLeft] = React.useState(0);
  const [verifying, setVerifying] = React.useState(false);
  const inputRefs = React.useRef([]);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  function validateForm() {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test((phone || '').replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim())) e.email = 'Enter a valid email address.';
    if (!agree) e.agree = 'Please accept the Terms & Privacy Policy to continue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function sendOtp() {
    if (!validateForm()) return;
    setStep('otp');
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError(null);
    setSecondsLeft(RESEND_SECONDS);
    setTimeout(() => inputRefs.current[0]?.focus(), 60);
  }

  function resendOtp() {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpError(null);
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
    setOtpError(null);
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
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  function verifyAndCreate() {
    setOtpError(null);
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      setOtpError('Enter the full 6-digit code.');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      if (code === '111111') {
        setVerifying(false);
        setOtpError('Incorrect OTP. Please try again.');
        return;
      }
      if (setState) {
        setState(s => ({
          ...s,
          user: {
            ...s.user,
            name: name.trim(),
            phone: `+91${phone}`,
            email: email.trim(),
          },
        }));
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
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => step === 'otp' ? setStep('form') : go('login')}
          aria-label="Back" style={authBackBtn}
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
      <div style={{ marginTop: 28 }}>
        <div style={{
          fontFamily: `'Manrope', ${LT.sans}`, fontSize: 11, letterSpacing: 2.2,
          color: SI_ACCENT_DK, fontWeight: 700, textTransform: 'uppercase',
        }}>{step === 'form' ? 'Join Sagar' : 'Verify it’s you'}</div>
        <h1 style={{
          margin: '8px 0 0',
          fontFamily: `'Noto Serif', ${LT.serif}`,
          fontSize: 32, fontWeight: 700, color: SI_INK, letterSpacing: -0.4, lineHeight: 1.15,
        }}>
          {step === 'form'
            ? <>Create your<br/><em style={italicSpan()}>account</em></>
            : <>Enter the code we<br/>texted to <em style={italicSpan()}>+91 {phone}</em></>}
        </h1>
        {step === 'form' && (
          <div style={{
            marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(175,130,109,0.10)', border: `1px solid ${SI_LINE}`,
            fontFamily: 'Manrope', fontSize: 11.5, fontWeight: 700, color: SI_ACCENT_DK,
            letterSpacing: 0.4,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
            </svg>
            Welcome gift · ₹500 voucher on first order
          </div>
        )}
      </div>

      {/* Form / OTP body */}
      {step === 'form' ? (
        <div style={{
          marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {/* Name */}
          <div>
            <label style={fieldLabel}>Full name</label>
            <div style={fieldShell(errors.name)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SI_INK_SOFT}
                   strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21a8 8 0 0116 0"/>
              </svg>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); if (errors.name) setErrors(x => ({ ...x, name: null })); }}
                placeholder="As on PAN / passport"
                autoFocus
                style={inputStyle}
              />
            </div>
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </div>

          {/* Phone */}
          <PhoneField
            phone={phone}
            setPhone={v => { setPhone(v); if (errors.phone) setErrors(x => ({ ...x, phone: null })); }}
            error={errors.phone}
          />

          {/* Email */}
          <div>
            <label style={fieldLabel}>Email address</label>
            <div style={fieldShell(errors.email)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={SI_INK_SOFT}
                   strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 7 9-7"/>
              </svg>
              <input
                type="email" inputMode="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(x => ({ ...x, email: null })); }}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </div>

          {/* T&C */}
          <button
            type="button"
            onClick={() => { setAgree(a => !a); if (errors.agree) setErrors(x => ({ ...x, agree: null })); }}
            aria-pressed={agree}
            style={{
              marginTop: 4, padding: 0,
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: agree ? SI_ACCENT_DK : '#fff',
              boxShadow: agree ? 'none' : `inset 0 0 0 1.5px ${SI_LINE}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {agree && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff"
                     strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              )}
            </span>
            <span style={{
              fontFamily: 'Manrope', fontSize: 12, color: SI_INK_SOFT, lineHeight: 1.5,
            }}>
              I agree to Sagar Jewellers'{' '}
              <span style={{ color: SI_ACCENT_DK, fontWeight: 700, textDecoration: 'underline' }}>Terms</span>{' '}
              and{' '}
              <span style={{ color: SI_ACCENT_DK, fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</span>.
            </span>
          </button>
          {errors.agree && <ErrorText>{errors.agree}</ErrorText>}
        </div>
      ) : (
        <>
          <p style={{
            margin: '14px 0 22px',
            fontFamily: `'Manrope', ${LT.sans}`, fontSize: 13.5, color: SI_INK_SOFT, lineHeight: 1.55,
          }}>
            Code expires in 5 minutes.
          </p>
          <OtpFields
            otp={otp}
            setOtpAt={setOtpAt}
            onOtpKey={onOtpKey}
            onOtpPaste={onOtpPaste}
            inputRefs={inputRefs}
            error={otpError}
          />
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: `'Manrope', ${LT.sans}`, fontSize: 12.5,
          }}>
            <button onClick={() => setStep('form')} style={authLinkBtn}>Edit details</button>
            {secondsLeft > 0
              ? <span style={{ color: SI_INK_SOFT }}>Resend in <strong style={{ color: SI_INK }}>{secondsLeft}s</strong></span>
              : <button onClick={resendOtp} style={authLinkBtn}>Resend code</button>}
          </div>
        </>
      )}

      <div style={{ flex: 1 }}/>

      {/* CTA */}
      <button
        onClick={step === 'form' ? sendOtp : verifyAndCreate}
        disabled={verifying}
        style={authCtaBtn(verifying)}
      >
        <span>{step === 'form'
          ? 'SEND OTP'
          : (verifying ? 'CREATING ACCOUNT…' : 'VERIFY & CREATE')}</span>
        <span style={authCtaArrow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </span>
      </button>

      {/* Sign-in link */}
      <div style={{
        marginTop: 16, textAlign: 'center',
        fontFamily: `'Manrope', ${LT.sans}`, fontSize: 13, color: SI_INK_SOFT,
      }}>
        Already have an account?{' '}
        <span onClick={() => go('signin')} style={{
          color: SI_ACCENT_DK, fontWeight: 700, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 2,
        }}>Sign in</span>
      </div>
    </div>
  );
}

window.SignUpPage = SignUpPage;
