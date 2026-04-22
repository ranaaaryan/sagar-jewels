// Orders / Order history
const TO = window.JEWEL_TOKENS;

function OrdersPage({ go, state, setState }) {
  const [tab, setTab] = React.useState('all');
  const orders = state.orders.filter(o => tab === 'all' ? true : o.status === tab);

  return (
    <>
      <TopBar title="My Orders" onBack={() => go('profile')} />
      <Tabs
        items={[
          { key: 'all',       label: 'All' },
          { key: 'shipped',   label: 'On the Way' },
          { key: 'delivered', label: 'Delivered' },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {orders.map((o, i) => <OrderCard key={o.id} o={o} go={go} setState={setState} />)}
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: TO.inkSoft, fontFamily: TO.sans, fontSize: 14 }}>
            No orders in this view yet.
          </div>
        )}
      </div>
    </>
  );
}

function OrderCard({ o, go, setState }) {
  const statusMap = {
    placed:    { label: 'Order Placed',    tone: 'warn',    icon: Icon.Check },
    shipped:   { label: 'On the Way',      tone: 'warn',    icon: Icon.Truck },
    delivered: { label: 'Delivered',       tone: 'success', icon: Icon.Package },
    cancelled: { label: 'Cancelled',       tone: 'neutral', icon: Icon.Close },
  };
  const st = statusMap[o.status];
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: TO.sans, fontSize: 10, color: TO.inkMuted, letterSpacing: 1, fontWeight: 600, whiteSpace: 'nowrap' }}>
            ORDER · {o.id}
          </div>
          <div style={{ fontFamily: TO.sans, fontSize: 11.5, color: TO.inkSoft, marginTop: 3, whiteSpace: 'nowrap' }}>
            {o.date}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}><Pill tone={st.tone}><st.icon width={12} height={12}/> {st.label}</Pill></div>
      </div>

      {/* items */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Placeholder label={o.items[0].cat} w={72} h={72} tone={o.items[0].tone} radius={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TO.serif, fontSize: 17, color: TO.ink, lineHeight: 1.2 }}>
            {o.items[0].name}
          </div>
          {o.items.length > 1 && (
            <div style={{ fontFamily: TO.sans, fontSize: 12, color: TO.inkSoft, marginTop: 4 }}>
              + {o.items.length - 1} more item{o.items.length > 2 ? 's' : ''}
            </div>
          )}
          <div style={{ fontFamily: TO.sans, fontSize: 14, color: TO.ink, marginTop: 6, fontWeight: 600 }}>
            ₹{o.total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* progress bar for shipped */}
      {o.status === 'shipped' && (
        <div style={{ marginTop: 14 }}>
          <ProgressStops steps={['Placed', 'Packed', 'Shipped', 'Delivery']} active={2} />
          <div style={{ fontFamily: TO.sans, fontSize: 12, color: TO.inkSoft, marginTop: 8 }}>
            Arriving by <b style={{ color: TO.ink }}>{o.eta}</b>
          </div>
        </div>
      )}

      {/* actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {o.status === 'shipped' && <Btn variant="primary" style={{ flex: 1, padding: '10px 14px', fontSize: 11 }} onClick={() => go('track', { orderId: o.id })}>Track Order</Btn>}
        {o.status === 'delivered' && <Btn variant="primary" style={{ flex: 1, padding: '10px 14px', fontSize: 11 }}>Rate & Review</Btn>}
        <Btn variant="ghost" style={{ flex: 1, padding: '10px 14px', fontSize: 11 }} onClick={() => {
          setState(s => ({ ...s, viewOrderId: o.id }));
          go('order-details');
        }}>View Details</Btn>
      </div>
    </Card>
  );
}

function ProgressStops({ steps, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0 4px' }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, width: 58, flexShrink: 0 }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: i <= active ? TO.accent : TO.bgSoft,
              border: `2px solid ${i <= active ? TO.accent : TO.line}`,
              boxShadow: i === active ? `0 0 0 4px ${TO.accentBg}` : 'none',
              flexShrink: 0,
            }}/>
            <div style={{
              fontFamily: TO.sans, fontSize: 9.5, marginTop: 6, color: i <= active ? TO.ink : TO.inkMuted,
              letterSpacing: 0.3, fontWeight: i === active ? 700 : 500, textAlign: 'center',
              lineHeight: 1.15,
            }}>{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, background: i < active ? TO.accent : TO.line,
              marginTop: 6, minWidth: 8,
            }}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

window.OrdersPage = OrdersPage;
