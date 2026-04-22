// Saved Addresses
const TA = window.JEWEL_TOKENS;

function AddressesPage({ go, state, setState }) {
  const [editing, setEditing] = React.useState(null); // null | 'new' | addressId

  function setDefault(id) {
    setState(s => ({
      ...s,
      addresses: s.addresses.map(a => ({ ...a, isDefault: a.id === id })),
    }));
  }
  function remove(id) {
    setState(s => ({ ...s, addresses: s.addresses.filter(a => a.id !== id) }));
  }

  return (
    <>
      <TopBar title="Saved Addresses" onBack={() => go('profile')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {state.addresses.map(a => (
            <AddressCard
              key={a.id} a={a}
              onSetDefault={() => setDefault(a.id)}
              onEdit={() => setEditing(a.id)}
              onRemove={() => remove(a.id)}
            />
          ))}
        </div>

        {/* Add new */}
        <button
          onClick={() => setEditing('new')}
          style={{
            width: '100%', marginTop: 16, padding: '22px 16px', borderRadius: 20,
            background: 'transparent', border: `1.5px dashed ${TA.accentLt}`,
            color: TA.accent, fontFamily: TA.sans, fontSize: 13, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Icon.Plus width={18} height={18}/> Add New Address
        </button>

        <div style={{
          marginTop: 18, padding: 16, borderRadius: 14, background: TA.bgSoft,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <Icon.Sparkle width={18} height={18} style={{ color: TA.accent, flexShrink: 0, marginTop: 2 }}/>
          <div style={{ fontFamily: TA.sans, fontSize: 12, color: TA.inkSoft, lineHeight: 1.5 }}>
            Orders over ₹25,000 are delivered by a trained consultant. Please include a daytime contact number.
          </div>
        </div>
      </div>

      {editing && <AddressSheet onClose={() => setEditing(null)} mode={editing}/>}
    </>
  );
}

function AddressCard({ a, onSetDefault, onEdit, onRemove }) {
  const tagIcon = { home: Icon.Home2, work: Icon.Office, other: Icon.Pin }[a.tag] || Icon.Pin;
  const TagIc = tagIcon;
  return (
    <div style={{
      background: TA.card, borderRadius: TA.radiusCard, padding: 18,
      boxShadow: TA.shadowCard, border: a.isDefault ? `1.5px solid ${TA.accentLt}` : '1.5px solid transparent',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: TA.chipBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: TA.ink,
        }}><TagIc width={16} height={16}/></div>
        <span style={{
          fontFamily: TA.sans, fontSize: 12, fontWeight: 700, color: TA.ink,
          letterSpacing: 1.2, textTransform: 'uppercase',
        }}>{a.tag}</span>
        {a.isDefault && <Pill tone="accent">Default</Pill>}
        <div style={{ flex: 1 }}/>
        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TA.inkSoft, padding: 4 }}>
          <Icon.Edit width={16} height={16}/>
        </button>
      </div>

      <div style={{ fontFamily: TA.sans, fontSize: 14, color: TA.ink, fontWeight: 600, marginBottom: 4 }}>
        {a.name}
      </div>
      <div style={{ fontFamily: TA.sans, fontSize: 13, color: TA.inkSoft, lineHeight: 1.55 }}>
        {a.line1}<br/>
        {a.line2}<br/>
        {a.city} — {a.pincode}
      </div>
      <div style={{ fontFamily: TA.sans, fontSize: 12, color: TA.inkMuted, marginTop: 6 }}>
        {a.phone}
      </div>

      {!a.isDefault && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${TA.line}` }}>
          <button onClick={onSetDefault} style={{
            flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
            background: TA.accentBg, color: TA.accentDk,
            fontFamily: TA.sans, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            cursor: 'pointer',
          }}>Set as Default</button>
          <button onClick={onRemove} style={{
            flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${TA.line}`,
            background: 'transparent', color: TA.inkSoft,
            fontFamily: TA.sans, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            cursor: 'pointer',
          }}>Remove</button>
        </div>
      )}
    </div>
  );
}

function AddressSheet({ onClose, mode }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(42,39,36,0.4)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 10,
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: TA.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 20, maxHeight: '85%', overflowY: 'auto',
        }}>
        <div style={{ width: 44, height: 4, borderRadius: 2, background: TA.line, margin: '0 auto 14px' }}/>
        <h3 style={{ margin: '0 0 16px', fontFamily: TA.serif, fontSize: 22, color: TA.ink, fontWeight: 500 }}>
          {mode === 'new' ? 'Add Address' : 'Edit Address'}
        </h3>

        {/* Tag chooser */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['home', 'work', 'other'].map((t, i) => (
            <button key={t} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              border: `1.5px solid ${i === 0 ? TA.accent : TA.line}`,
              background: i === 0 ? TA.accentBg : 'transparent',
              color: i === 0 ? TA.accentDk : TA.inkSoft,
              fontFamily: TA.sans, fontSize: 11, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>

        {[
          { label: 'Full Name', value: '' },
          { label: 'Phone', value: '' },
          { label: 'Flat, House no., Building', value: '' },
          { label: 'Area, Street, Sector', value: '' },
          { label: 'City / Pincode', value: '' },
        ].map((f, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: TA.sans, fontSize: 10.5, color: TA.inkMuted, letterSpacing: 1, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{f.label}</div>
            <div style={{
              padding: '12px 14px', borderRadius: 10, background: TA.card,
              border: `1px solid ${TA.line}`, fontFamily: TA.sans, fontSize: 14, color: TA.inkMuted,
            }}>{f.value || '—'}</div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn variant="primary" onClick={onClose} style={{ flex: 1 }}>Save Address</Btn>
        </div>
      </div>
    </div>
  );
}

window.AddressesPage = AddressesPage;
