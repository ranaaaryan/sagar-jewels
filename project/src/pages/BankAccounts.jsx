import React from 'react';
// Bank Accounts — manages payout destinations used by Liquidation.
// Supports bank accounts (IFSC + A/C) and UPI handles. New entries land
// as unverified; a simulated verify flow flips them to verified.

const BA_T = window.JEWEL_TOKENS;
const BA_ACCENT    = 'rgb(172,129,108)';
const BA_ACCENT_DK = 'rgb(119,88,66)';
const BA_INK       = '#1E1B13';
const BA_INK_SOFT  = '#6E655C';
const BA_LINE      = 'rgba(47,52,48,0.10)';
const BA_ERR       = '#D65A50';

function BankAccountsPage({ go, state, setState }) {
  const accounts = state.user.bankAccounts || [];
  const [adding, setAdding] = React.useState(false);

  function setPrimary(id) {
    setState(s => ({
      ...s,
      user: { ...s.user, bankAccounts: (s.user.bankAccounts || []).map(a =>
        ({ ...a, primary: a.id === id })
      )},
    }));
  }

  function remove(id) {
    setState(s => ({
      ...s,
      user: { ...s.user, bankAccounts: (s.user.bankAccounts || []).filter(a => a.id !== id) },
    }));
  }

  function addAccount(entry) {
    const id = `ba_${Date.now()}`;
    setState(s => ({
      ...s,
      user: { ...s.user, bankAccounts: [
        ...(s.user.bankAccounts || []),
        { ...entry, id, verified: false, primary: false },
      ]},
    }));
    setAdding(false);
  }

  function verify(id) {
    setState(s => ({
      ...s,
      user: { ...s.user, bankAccounts: (s.user.bankAccounts || []).map(a =>
        a.id === id ? { ...a, verified: true } : a
      )},
    }));
  }

  return (
    <>
      <TopBar title="Bank Methods" onBack={() => go('wallet')}/>

      <div style={{ flex: 1, overflowY: 'auto', background: BA_T.bg, padding: '10px 16px 40px' }}>
        {/* Header note */}
        <div style={{
          marginTop: 6, padding: '12px 14px', borderRadius: 12,
          background: '#fff', border: `1px solid ${BA_LINE}`,
          fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 11.5, color: BA_INK_SOFT, lineHeight: 1.55,
        }}>
          Your payout destinations for gold sell-back and refunds. Only <strong style={{ color: BA_INK }}>verified</strong> accounts can receive transfers.
        </div>

        {/* Account list */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {accounts.length === 0 ? (
            <div style={{
              padding: '22px 16px', borderRadius: 12,
              background: '#fff', border: `1px dashed ${BA_LINE}`, textAlign: 'center',
              fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 12, color: BA_INK_SOFT,
            }}>
              No accounts yet. Add your first one to receive payouts.
            </div>
          ) : accounts.map(a => (
            <AccountRow key={a.id}
              account={a}
              onMakePrimary={() => setPrimary(a.id)}
              onRemove={() => remove(a.id)}
              onVerify={() => verify(a.id)}
            />
          ))}
        </div>

        {/* Add CTA */}
        {!adding && (
          <button onClick={() => setAdding(true)} style={{
            marginTop: 18, width: '100%',
            padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
            background: 'transparent',
            border: `1.5px dashed ${BA_ACCENT}`,
            color: BA_ACCENT_DK,
            fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 12, fontWeight: 700, letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}>+ Add Bank or UPI</button>
        )}

        {adding && <AddAccountForm onCancel={() => setAdding(false)} onSubmit={addAccount}/>}
      </div>
    </>
  );
}

function AccountRow({ account, onMakePrimary, onRemove, onVerify }) {
  return (
    <div style={{
      padding: '14px', borderRadius: 14,
      background: '#fff', border: `1px solid ${account.primary ? BA_ACCENT : BA_LINE}`,
      boxShadow: account.primary ? '0 2px 10px rgba(122,88,67,0.12)' : 'none',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: 'rgba(122,88,67,0.10)', color: BA_ACCENT_DK,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {account.type === 'upi' ? <IconUpi/> : <IconBank/>}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 13, fontWeight: 700, color: BA_INK,
        }}>
          {account.label}
          {account.primary && (
            <span style={{
              padding: '2px 7px', borderRadius: 4,
              background: 'rgba(122,88,67,0.12)', color: BA_ACCENT_DK,
              fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
            }}>Primary</span>
          )}
          <span style={{
            padding: '2px 7px', borderRadius: 4,
            background: account.verified ? 'rgba(76,105,68,0.12)' : 'rgba(214,90,80,0.10)',
            color: account.verified ? '#4C6944' : BA_ERR,
            fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
          }}>{account.verified ? 'Verified' : 'Pending verification'}</span>
        </div>
        <div style={{
          marginTop: 3,
          fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 11, color: BA_INK_SOFT,
          letterSpacing: account.type === 'upi' ? 0 : 1,
        }}>
          {account.masked}
          {account.ifsc && <span style={{ marginLeft: 8 }}>· {account.ifsc}</span>}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {!account.primary && account.verified && (
            <TextLink onClick={onMakePrimary}>Make primary</TextLink>
          )}
          {!account.verified && (
            <TextLink onClick={onVerify} tone="accent">Verify now</TextLink>
          )}
          <TextLink onClick={onRemove} tone="danger">Remove</TextLink>
        </div>
      </div>
    </div>
  );
}

function AddAccountForm({ onSubmit, onCancel }) {
  const [type, setType]         = React.useState('bank');  // 'bank' | 'upi'
  const [label, setLabel]       = React.useState('');
  const [account, setAccount]   = React.useState('');      // A/C number OR UPI handle
  const [ifsc, setIfsc]         = React.useState('');
  const [touched, setTouched]   = React.useState({});

  const errors = (() => {
    const e = {};
    if (!label.trim()) e.label = type === 'bank' ? 'Bank name required' : 'Label required';
    if (!account.trim()) {
      e.account = type === 'bank' ? 'Account number required' : 'UPI handle required';
    } else if (type === 'bank') {
      if (!/^[0-9]{9,18}$/.test(account.trim())) e.account = 'Account number must be 9–18 digits';
    } else {
      if (!/^[\w.\-]+@[\w.\-]+$/.test(account.trim())) e.account = 'Enter a valid UPI handle (e.g., name@bank)';
    }
    if (type === 'bank') {
      if (!ifsc.trim()) e.ifsc = 'IFSC required';
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())) e.ifsc = 'Invalid IFSC format';
    }
    return e;
  })();
  const valid = Object.keys(errors).length === 0;

  function submit() {
    setTouched({ label: true, account: true, ifsc: true });
    if (!valid) return;
    const masked = type === 'bank'
      ? `XXXX XXXX ${account.slice(-4)}`
      : account.trim();
    onSubmit({
      type, label: label.trim(),
      masked,
      ifsc: type === 'bank' ? ifsc.trim().toUpperCase() : undefined,
    });
  }

  const showError = k => touched[k] && errors[k];

  return (
    <div style={{
      marginTop: 14, padding: '16px 16px 18px', borderRadius: 14,
      background: '#fff', border: `1px solid ${BA_LINE}`,
    }}>
      <div style={{
        fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 10.5, color: BA_ACCENT_DK,
        letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10,
      }}>Add a payout method</div>

      <SegmentedToggle
        ariaLabel="Account type"
        value={type}
        onChange={next => { setType(next); setIfsc(''); setAccount(''); setTouched({}); }}
        options={[
          { v: 'bank', l: 'Bank Account' },
          { v: 'upi',  l: 'UPI'          },
        ]}
      />

      <FieldLabel>{type === 'bank' ? 'Bank name' : 'Label'}</FieldLabel>
      <TextField
        value={label}
        onChange={setLabel}
        onBlur={() => setTouched(t => ({ ...t, label: true }))}
        placeholder={type === 'bank' ? 'e.g., HDFC Bank' : 'e.g., PhonePe'}
        error={showError('label')}
      />
      {showError('label') && <ErrorMsg>{errors.label}</ErrorMsg>}

      <FieldLabel>{type === 'bank' ? 'Account number' : 'UPI handle'}</FieldLabel>
      <TextField
        value={account}
        onChange={v => setAccount(type === 'bank' ? v.replace(/[^0-9]/g, '') : v)}
        onBlur={() => setTouched(t => ({ ...t, account: true }))}
        placeholder={type === 'bank' ? '0000 0000 0000' : 'name@bank'}
        inputMode={type === 'bank' ? 'numeric' : 'text'}
        error={showError('account')}
      />
      {showError('account') && <ErrorMsg>{errors.account}</ErrorMsg>}

      {type === 'bank' && (
        <>
          <FieldLabel>IFSC code</FieldLabel>
          <TextField
            value={ifsc}
            onChange={v => setIfsc(v.toUpperCase())}
            onBlur={() => setTouched(t => ({ ...t, ifsc: true }))}
            placeholder="HDFC0001234"
            error={showError('ifsc')}
            uppercase
          />
          {showError('ifsc') && <ErrorMsg>{errors.ifsc}</ErrorMsg>}
        </>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button onClick={onCancel} style={{
          flex: 1, height: 44, borderRadius: 10, cursor: 'pointer',
          background: 'transparent', color: BA_INK_SOFT,
          border: `1px solid ${BA_LINE}`,
          fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}>Cancel</button>
        <button onClick={submit} disabled={!valid} style={{
          flex: 2, height: 44, borderRadius: 10, border: 'none',
          cursor: valid ? 'pointer' : 'not-allowed',
          background: valid ? BA_ACCENT_DK : '#C9BFA8', color: '#fff',
          fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6,
          textTransform: 'uppercase',
          boxShadow: valid ? '0 4px 12px rgba(122,88,67,0.2)' : 'none',
        }}>Add account</button>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{
      marginTop: 14, marginBottom: 6,
      fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 11, color: '#4B4640',
      letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 700,
    }}>{children}</div>
  );
}

function TextField({ value, onChange, onBlur, placeholder, error, inputMode = 'text', uppercase }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: '#FBF7F3',
      border: `1px solid ${error ? BA_ERR : BA_LINE}`,
      borderRadius: 10, padding: '0 14px', height: 44,
      transition: 'border-color 160ms ease',
    }}>
      <input
        type="text" inputMode={inputMode}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: `'Manrope', ${BA_T.sans}`, fontSize: 13.5, fontWeight: 600,
          color: BA_INK, minWidth: 0,
          textTransform: uppercase ? 'uppercase' : 'none',
          letterSpacing: uppercase ? 1 : 0,
        }}
      />
    </div>
  );
}

function TextLink({ onClick, children, tone = 'default' }) {
  const color = tone === 'danger' ? BA_ERR : tone === 'accent' ? BA_ACCENT_DK : BA_INK_SOFT;
  return (
    <button type="button" onClick={onClick} style={{
      background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
      color, fontFamily: `'Manrope', ${BA_T.sans}`,
      fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
    }}>{children}</button>
  );
}

function IconBank() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10L12 4l9 6"/>
      <path d="M5 10v8M19 10v8M9 10v8M15 10v8"/>
      <path d="M3 20h18"/>
    </svg>
  );
}
function IconUpi() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M7 9l4 6 3-10 3 6"/>
    </svg>
  );
}

window.BankAccountsPage = BankAccountsPage;
