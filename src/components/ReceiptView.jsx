import { forwardRef } from 'react';
import { naira, prettyDate } from '../lib/format';

export function receiptTotals(r) {
  const subtotal = (r.items || []).reduce((a, i) => a + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
  const discount = Math.min(subtotal, Number(r.discount) || 0);
  const delivery = Number(r.deliveryFee) || 0;
  const taxable = subtotal - discount;
  const vat = r.vat ? taxable * 0.075 : 0;
  const total = taxable + delivery + vat;
  const paid = r.status === 'Paid' ? total : r.status === 'Part payment' ? Math.min(total, Number(r.amountPaid) || 0) : 0;
  return { subtotal, discount, delivery, vat, total, paid, balance: total - paid };
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function Initials({ name, color, size = 48 }) {
  const ini = (name || 'B').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  return (
    <div style={{ width: size, height: size, background: color, borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: size * 0.38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {ini}
    </div>
  );
}

function Logo({ biz, size = 48, light }) {
  if (biz.logo) return <img src={biz.logo} alt="" style={{ width: size, height: size, objectFit: 'contain', borderRadius: 10, background: light ? '#fff' : 'transparent' }} />;
  return <Initials name={biz.name} color={light ? 'rgba(255,255,255,0.18)' : biz.color} size={size} />;
}

const StatusStamp = ({ status, color }) => {
  const map = { Paid: color, 'Part payment': '#B54708', Unpaid: '#D92D20' };
  const c = map[status] || color;
  return (
    <div style={{ flexShrink: 0, whiteSpace: 'nowrap', border: `2px solid ${c}`, color: c, padding: '4px 10px', borderRadius: 8, fontWeight: 800, fontSize: 11, lineHeight: 'normal', letterSpacing: 0.6, textTransform: 'uppercase' }}>
      {status}
    </div>
  );
};

function ItemsTable({ r, color, compact }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
      <thead>
        <tr style={{ color: '#667085', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 700 }}>Item</th>
          <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: 700, width: 36 }}>Qty</th>
          {!compact && <th style={{ textAlign: 'right', padding: '8px 4px', fontWeight: 700 }}>Price</th>}
          <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 700 }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {(r.items || []).filter((i) => i.desc || i.price).map((i, idx) => (
          <tr key={idx} style={{ borderTop: '1px solid #EAECF0' }}>
            <td style={{ padding: '9px 0', color: '#101828', fontWeight: 600, wordBreak: 'break-word' }}>{i.desc || 'Item'}</td>
            <td style={{ textAlign: 'center', padding: '9px 4px', color: '#475467' }}>{i.qty}</td>
            {!compact && <td style={{ textAlign: 'right', padding: '9px 4px', color: '#475467', whiteSpace: 'nowrap' }}>{naira(i.price)}</td>}
            <td style={{ textAlign: 'right', padding: '9px 0', color: '#101828', fontWeight: 700, whiteSpace: 'nowrap' }}>{naira((Number(i.qty) || 0) * (Number(i.price) || 0))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Totals({ r, t, color }) {
  const Row = ({ label, value, bold, c }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: bold ? 15 : 12.5, fontWeight: bold ? 800 : 500, color: c || (bold ? '#101828' : '#475467') }}>
      <span>{label}</span>
      <span style={{ whiteSpace: 'nowrap', paddingLeft: 8 }}>{value}</span>
    </div>
  );
  return (
    <div>
      <Row label="Subtotal" value={naira(t.subtotal)} />
      {t.discount > 0 && <Row label="Discount" value={`-${naira(t.discount)}`} />}
      {t.delivery > 0 && <Row label="Delivery" value={naira(t.delivery)} />}
      {t.vat > 0 && <Row label="VAT (7.5%)" value={naira(t.vat, { decimals: 2 })} />}
      <div style={{ borderTop: `2px solid ${color}`, marginTop: 6, paddingTop: 6 }}>
        <Row label="Total" value={naira(t.total, { decimals: t.vat ? 2 : 0 })} bold />
      </div>
      {r.status === 'Part payment' && (
        <>
          <Row label="Amount paid" value={naira(t.paid)} />
          <Row label="Balance due" value={naira(t.balance, { decimals: t.vat ? 2 : 0 })} c="#B54708" bold />
        </>
      )}
      {r.status === 'Unpaid' && <Row label="Amount due" value={naira(t.total, { decimals: t.vat ? 2 : 0 })} c="#D92D20" bold />}
    </div>
  );
}

function Footer({ biz, r }) {
  const hasBank = biz.accountNumber && r.status !== 'Paid';
  return (
    <div style={{ marginTop: 18 }}>
      {r.paymentMethod && (
        <div style={{ fontSize: 12, color: '#475467' }}>
          Payment method: <b style={{ color: '#101828' }}>{r.paymentMethod}</b>
        </div>
      )}
      {hasBank && (
        <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #EAECF0', fontSize: 12, color: '#475467', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 800, color: '#101828', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>Pay to</div>
          {biz.bankName} · <b style={{ color: '#101828' }}>{biz.accountNumber}</b>
          <br />
          {biz.accountName}
        </div>
      )}
      {r.note && <div style={{ marginTop: 10, fontSize: 12, color: '#475467', lineHeight: 1.55 }}>{r.note}</div>}
      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: '#101828' }}>{biz.footer || 'Thank you for your patronage!'}</div>
      <div style={{ marginTop: 4, textAlign: 'center', fontSize: 10.5, color: '#98A2B3' }}>
        {[biz.phone, biz.email, biz.instagram && `IG: ${biz.instagram}`].filter(Boolean).join('  ·  ')}
      </div>
    </div>
  );
}

function Customer({ r, label = 'Billed to' }) {
  if (!r.customerName && !r.customerPhone && !r.customerAddress) return null;
  return (
    <div style={{ fontSize: 12.5, color: '#475467', lineHeight: 1.55 }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
      {r.customerName && <div style={{ fontWeight: 700, color: '#101828', fontSize: 14 }}>{r.customerName}</div>}
      {r.customerPhone && <div>{r.customerPhone}</div>}
      {r.customerAddress && <div>{r.customerAddress}</div>}
    </div>
  );
}

// ---------- Templates ----------
function Classic({ biz, r, t }) {
  const color = biz.color;
  return (
    <div style={{ padding: 24, borderTop: `6px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
          <Logo biz={biz} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#101828', lineHeight: 1.2 }}>{biz.name || 'Your Business Name'}</div>
            {biz.tagline && <div style={{ fontSize: 11.5, color: '#667085', marginTop: 2 }}>{biz.tagline}</div>}
            {biz.address && <div style={{ fontSize: 11, color: '#98A2B3', marginTop: 2 }}>{biz.address}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: -0.3 }}>RECEIPT</div>
          <div style={{ fontSize: 12, color: '#475467', marginTop: 2 }}>No. <b style={{ color: '#101828' }}>{r.number || 'DRAFT'}</b> · {prettyDate(r.date)}</div>
        </div>
        <StatusStamp status={r.status} color={color} />
      </div>
      <div style={{ marginTop: 16 }}><Customer r={r} /></div>
      <div style={{ marginTop: 14 }}><ItemsTable r={r} color={color} /></div>
      <div style={{ marginTop: 8, marginLeft: 'auto', maxWidth: 240 }}><Totals r={r} t={t} color={color} /></div>
      <Footer biz={biz} r={r} />
    </div>
  );
}

function Bold({ biz, r, t }) {
  const color = biz.color;
  return (
    <div>
      <div style={{ background: color, color: '#fff', padding: '22px 24px 26px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Logo biz={biz} light />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>{biz.name || 'Your Business Name'}</div>
            {biz.tagline && <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>{biz.tagline}</div>}
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Amount</div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>{naira(t.total, { decimals: t.vat ? 2 : 0 })}</div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>Receipt {r.number || 'DRAFT'} · {prettyDate(r.date)}</div>
      </div>
      <div style={{ padding: '18px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <Customer r={r} />
          <StatusStamp status={r.status} color={color} />
        </div>
        <div style={{ marginTop: 12 }}><ItemsTable r={r} color={color} /></div>
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, background: hexToRgba(color, 0.06) }}><Totals r={r} t={t} color={color} /></div>
        <Footer biz={biz} r={r} />
        {biz.address && <div style={{ marginTop: 4, textAlign: 'center', fontSize: 10.5, color: '#98A2B3' }}>{biz.address}</div>}
      </div>
    </div>
  );
}

function Minimal({ biz, r, t }) {
  const color = biz.color;
  const dash = { borderTop: '1.5px dashed #D0D5DD', margin: '14px 0' };
  return (
    <div style={{ padding: '26px 24px', textAlign: 'left' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Logo biz={biz} size={44} />
        <div style={{ fontWeight: 800, fontSize: 17, color: '#101828', marginTop: 8 }}>{biz.name || 'Your Business Name'}</div>
        {biz.address && <div style={{ fontSize: 11, color: '#98A2B3', marginTop: 2 }}>{biz.address}</div>}
        {biz.phone && <div style={{ fontSize: 11, color: '#98A2B3' }}>{biz.phone}</div>}
      </div>
      <div style={dash} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475467' }}>
        <span>Receipt <b style={{ color: '#101828' }}>{r.number || 'DRAFT'}</b></span>
        <span>{prettyDate(r.date)}</span>
      </div>
      {r.customerName && <div style={{ fontSize: 12, color: '#475467', marginTop: 4 }}>Customer: <b style={{ color: '#101828' }}>{r.customerName}</b>{r.customerPhone ? ` · ${r.customerPhone}` : ''}</div>}
      <div style={dash} />
      <ItemsTable r={r} color={color} compact />
      <div style={dash} />
      <Totals r={r} t={t} color={color} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}><StatusStamp status={r.status} color={color} /></div>
      <Footer biz={{ ...biz, phone: '' }} r={r} />
    </div>
  );
}

const TEMPLATES = { classic: Classic, bold: Bold, minimal: Minimal };

const ReceiptView = forwardRef(function ReceiptView({ biz, receipt }, ref) {
  const T = TEMPLATES[biz.template] || Classic;
  const t = receiptTotals(receipt);
  return (
    <div
      ref={ref}
      style={{ width: '100%', maxWidth: 420, background: '#fff', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#101828', overflow: 'hidden' }}
    >
      <T biz={biz} r={receipt} t={t} />
    </div>
  );
});

export default ReceiptView;
