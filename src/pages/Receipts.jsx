import { useRef, useState } from 'react';
import { Receipt, Plus, Trash2, Download, FileText, Share2, Upload, History, Copy, Store, Pencil, Loader2 } from 'lucide-react';
import { PageHeader, Card, Field, TextInput, TextArea, MoneyInput, NumberInput, Select, Segmented, Button, Empty, Pill, cx } from '../components/ui';
import ReceiptView, { receiptTotals } from '../components/ReceiptView';
import { useStored } from '../lib/storage';
import { naira, prettyDate, todayISO } from '../lib/format';

const COLORS = ['#039855', '#0B1F1A', '#1D4ED8', '#7A5AF8', '#C11574', '#D92D20', '#DC6803', '#0E7490'];
const METHODS = ['Bank transfer', 'POS', 'Cash', 'Pay on delivery', 'Card (online)', 'USSD'];

const DEFAULT_BIZ = {
  name: '',
  tagline: '',
  logo: '',
  phone: '',
  email: '',
  instagram: '',
  address: '',
  bankName: '',
  accountName: '',
  accountNumber: '',
  color: '#039855',
  template: 'classic',
  prefix: 'RCP',
  nextNo: 1,
  footer: 'Thank you for your patronage!',
};

const blankReceipt = () => ({
  id: null,
  number: '',
  date: todayISO(),
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  items: [{ desc: '', qty: 1, price: 0 }],
  discount: 0,
  deliveryFee: 0,
  vat: false,
  paymentMethod: 'Bank transfer',
  status: 'Paid',
  amountPaid: 0,
  note: '',
});

function resizeImage(file, max = 320) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function triggerDownload(href, name) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 500);
}

function waNumber(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '234' + d.slice(1);
  return d.length >= 12 ? d : '';
}

export default function Receipts() {
  const [biz, setBiz] = useStored('business', DEFAULT_BIZ);
  const [draft, setDraft] = useStored('receiptDraft', blankReceipt());
  const [history, setHistory] = useStored('receipts', []);
  const [tab, setTab] = useState(biz.name ? 'receipt' : 'business');
  const [busy, setBusy] = useState('');
  const [toast, setToast] = useState('');
  const previewRef = useRef(null);
  const exportRef = useRef(null);

  const setB = (k) => (v) => setBiz((b) => ({ ...b, [k]: v }));
  const setR = (k) => (v) => setDraft((r) => ({ ...r, [k]: v }));
  const setItem = (i, k, v) => setDraft((r) => ({ ...r, items: r.items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)) }));
  const t = receiptTotals(draft);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };

  // Give the receipt a number and save it to history
  function commit() {
    let r = draft;
    if (!r.id) {
      const number = `${(biz.prefix || 'RCP').toUpperCase()}-${String(biz.nextNo || 1).padStart(4, '0')}`;
      r = { ...r, id: Date.now().toString(36), number };
      setBiz((b) => ({ ...b, nextNo: (Number(b.nextNo) || 1) + 1 }));
    }
    const saved = { ...r, total: receiptTotals(r).total, savedAt: Date.now() };
    setHistory((h) => [saved, ...h.filter((x) => x.id !== r.id)].slice(0, 200));
    setDraft(r);
    return r;
  }

  async function renderCanvas() {
    const { toCanvas } = await import('html-to-image');
    // wait for the receipt number to appear before capturing
    await new Promise((res) => setTimeout(res, 80));
    // Export from a hidden full-width copy so it looks the same from any phone
    return toCanvas(exportRef.current, { pixelRatio: 3, backgroundColor: '#ffffff', cacheBust: true });
  }

  function fileName(r) {
    return `${r.number || 'receipt'}${r.customerName ? '-' + r.customerName.replace(/[^a-z0-9]+/gi, '-') : ''}`;
  }

  function validate() {
    if (!biz.name) { setTab('business'); flash('Add your business name first.'); return false; }
    if (!draft.items.some((i) => i.desc && Number(i.price) > 0)) { flash('Add at least one item with a price.'); return false; }
    return true;
  }

  async function downloadPNG() {
    if (!validate()) return;
    setBusy('png');
    try {
      const r = commit();
      const canvas = await renderCanvas();
      triggerDownload(canvas.toDataURL('image/png'), `${fileName(r)}.png`);
      flash('Receipt image downloaded');
    } finally { setBusy(''); }
  }

  async function downloadPDF() {
    if (!validate()) return;
    setBusy('pdf');
    try {
      const r = commit();
      const canvas = await renderCanvas();
      const { jsPDF } = await import('jspdf');
      const w = 420;
      const h = (canvas.height / canvas.width) * w;
      const pdf = new jsPDF({ unit: 'pt', format: [w, h], orientation: h > w ? 'portrait' : 'landscape' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, w, h);
      pdf.save(`${fileName(r)}.pdf`);
      flash('Receipt PDF downloaded');
    } finally { setBusy(''); }
  }

  async function share() {
    if (!validate()) return;
    setBusy('share');
    try {
      const r = commit();
      const canvas = await renderCanvas();
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], `${fileName(r)}.png`, { type: 'image/png' });
      const text = `Hello${r.customerName ? ' ' + r.customerName.split(' ')[0] : ''}, here is your receipt ${r.number} from ${biz.name}. Total: ${naira(receiptTotals(r).total)}. Thank you!`;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `Receipt ${r.number}`, text });
        } catch { /* user closed share sheet */ }
      } else {
        triggerDownload(URL.createObjectURL(blob), file.name);
        const num = waNumber(r.customerPhone);
        window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
        flash('Image downloaded — attach it in WhatsApp');
      }
    } finally { setBusy(''); }
  }

  function newReceipt() {
    setDraft(blankReceipt());
    setTab('receipt');
  }

  function openFromHistory(r, duplicate) {
    const copy = { ...blankReceipt(), ...r };
    if (duplicate) Object.assign(copy, { id: null, number: '', date: todayISO() });
    delete copy.total; delete copy.savedAt;
    setDraft(copy);
    setTab('receipt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onLogo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try { setB('logo')(await resizeImage(f)); } catch { flash('Could not read that image'); }
  }

  return (
    <div>
      <PageHeader
        icon={Receipt}
        tone="ink"
        title="Online Receipt-Maker"
        subtitle="Create branded, professional e-receipts in seconds — no printing. Download as an image or PDF, or send straight to your customer on WhatsApp."
      />

      <div className="mb-5 max-w-md">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'business', label: 'My business' },
            { value: 'receipt', label: 'New receipt' },
            { value: 'history', label: `History (${history.length})` },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          {tab === 'business' && (
            <>
              <Card title="Business details" subtitle="Saved on this device. Set it once — it appears on every receipt.">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
                      {biz.logo ? <img src={biz.logo} alt="Logo" className="h-full w-full object-contain" /> : <Store size={22} className="text-ink-mute" />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13.5px] font-semibold hover:bg-paper">
                        <Upload size={16} /> {biz.logo ? 'Change logo' : 'Upload logo'}
                        <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
                      </label>
                      {biz.logo && <Button variant="ghost" size="sm" onClick={() => setB('logo')('')}>Remove</Button>}
                    </div>
                  </div>
                  <Field label="Business name *">
                    <TextInput value={biz.name} onChange={(e) => setB('name')(e.target.value)} placeholder="e.g. Ada’s Gadget Hub" />
                  </Field>
                  <Field label="Tagline (optional)">
                    <TextInput value={biz.tagline} onChange={(e) => setB('tagline')(e.target.value)} placeholder="e.g. Quality gadgets, delivered nationwide" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone / WhatsApp">
                      <TextInput value={biz.phone} onChange={(e) => setB('phone')(e.target.value)} placeholder="0803 000 0000" inputMode="tel" />
                    </Field>
                    <Field label="Email (optional)">
                      <TextInput value={biz.email} onChange={(e) => setB('email')(e.target.value)} placeholder="hello@yourbrand.com" />
                    </Field>
                    <Field label="Instagram (optional)">
                      <TextInput value={biz.instagram} onChange={(e) => setB('instagram')(e.target.value)} placeholder="@yourbrand" />
                    </Field>
                    <Field label="Address (optional)">
                      <TextInput value={biz.address} onChange={(e) => setB('address')(e.target.value)} placeholder="Ikeja, Lagos" />
                    </Field>
                  </div>
                </div>
              </Card>

              <Card title="Bank details" subtitle="Shown on unpaid and part-payment receipts so customers know where to pay.">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Bank">
                    <TextInput value={biz.bankName} onChange={(e) => setB('bankName')(e.target.value)} placeholder="e.g. Moniepoint" />
                  </Field>
                  <Field label="Account number">
                    <TextInput value={biz.accountNumber} onChange={(e) => setB('accountNumber')(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="0123456789" />
                  </Field>
                  <Field label="Account name">
                    <TextInput value={biz.accountName} onChange={(e) => setB('accountName')(e.target.value)} />
                  </Field>
                </div>
              </Card>

              <Card title="Look & feel">
                <div className="grid gap-5">
                  <Field label="Receipt design">
                    <Segmented
                      value={biz.template}
                      onChange={setB('template')}
                      options={[
                        { value: 'classic', label: 'Classic' },
                        { value: 'bold', label: 'Bold' },
                        { value: 'minimal', label: 'Minimal' },
                      ]}
                    />
                  </Field>
                  <Field label="Brand colour">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setB('color')(c)}
                          className={cx('h-9 w-9 rounded-full ring-offset-2 transition', biz.color === c ? 'ring-2 ring-ink' : 'ring-1 ring-line')}
                          style={{ background: c }}
                          aria-label={c}
                        />
                      ))}
                      <label className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-full ring-1 ring-line" title="Custom colour">
                        <input type="color" value={biz.color} onChange={(e) => setB('color')(e.target.value)} className="absolute -inset-2 h-14 w-14 cursor-pointer" />
                      </label>
                    </div>
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Receipt number prefix" hint={`Next receipt: ${(biz.prefix || 'RCP').toUpperCase()}-${String(biz.nextNo || 1).padStart(4, '0')}`}>
                      <TextInput value={biz.prefix} onChange={(e) => setB('prefix')(e.target.value.replace(/[^a-z0-9]/gi, '').slice(0, 6))} />
                    </Field>
                    <Field label="Thank-you message">
                      <TextInput value={biz.footer} onChange={(e) => setB('footer')(e.target.value)} />
                    </Field>
                  </div>
                </div>
              </Card>
              <Button size="lg" onClick={() => setTab('receipt')} disabled={!biz.name}>Continue to new receipt</Button>
            </>
          )}

          {tab === 'receipt' && (
            <>
              <Card
                title={draft.number ? `Editing ${draft.number}` : 'Customer'}
                action={<Button variant="soft" size="sm" icon={Plus} onClick={newReceipt}>New</Button>}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Customer name">
                    <TextInput value={draft.customerName} onChange={(e) => setR('customerName')(e.target.value)} placeholder="e.g. Chioma Okafor" />
                  </Field>
                  <Field label="Customer phone" hint="Used to open their WhatsApp chat">
                    <TextInput value={draft.customerPhone} onChange={(e) => setR('customerPhone')(e.target.value)} placeholder="0803 000 0000" inputMode="tel" />
                  </Field>
                  <Field label="Delivery address (optional)">
                    <TextInput value={draft.customerAddress} onChange={(e) => setR('customerAddress')(e.target.value)} />
                  </Field>
                  <Field label="Date">
                    <TextInput type="date" value={draft.date} onChange={(e) => setR('date')(e.target.value)} />
                  </Field>
                </div>
              </Card>

              <Card title="Items">
                <div className="grid gap-3">
                  {draft.items.map((it, i) => (
                    <div key={i} className="grid grid-cols-[84px_1fr] gap-2 rounded-xl bg-paper p-3 ring-1 ring-line/70 sm:grid-cols-[1fr_80px_150px_40px]">
                      <TextInput className="col-span-2 sm:col-span-1" value={it.desc} onChange={(e) => setItem(i, 'desc', e.target.value)} placeholder="Item description" />
                      <NumberInput value={it.qty} onChange={(v) => setItem(i, 'qty', v)} min={1} placeholder="Qty" />
                      <MoneyInput value={it.price} onChange={(v) => setItem(i, 'price', v)} placeholder="Unit price" />
                      <button
                        type="button"
                        onClick={() => setDraft((r) => ({ ...r, items: r.items.length > 1 ? r.items.filter((_, idx) => idx !== i) : [{ desc: '', qty: 1, price: 0 }] }))}
                        className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 sm:col-span-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} /> <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  ))}
                  <Button variant="outline" icon={Plus} onClick={() => setDraft((r) => ({ ...r, items: [...r.items, { desc: '', qty: 1, price: 0 }] }))}>
                    Add item
                  </Button>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Field label="Discount">
                    <MoneyInput value={draft.discount} onChange={setR('discount')} />
                  </Field>
                  <Field label="Delivery fee">
                    <MoneyInput value={draft.deliveryFee} onChange={setR('deliveryFee')} />
                  </Field>
                </div>
                <label className="mt-4 flex items-center gap-3 text-[14px] font-semibold text-ink-soft">
                  <input type="checkbox" checked={draft.vat} onChange={(e) => setR('vat')(e.target.checked)} className="h-5 w-5 accent-brand-700" />
                  Add VAT (7.5%)
                </label>
              </Card>

              <Card title="Payment">
                <div className="grid gap-4">
                  <Field label="Status">
                    <Segmented value={draft.status} onChange={setR('status')} options={['Paid', 'Part payment', 'Unpaid'].map((v) => ({ value: v, label: v }))} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Payment method">
                      <Select value={draft.paymentMethod} onChange={setR('paymentMethod')} options={METHODS.map((m) => ({ value: m, label: m }))} />
                    </Field>
                    {draft.status === 'Part payment' && (
                      <Field label="Amount paid so far">
                        <MoneyInput value={draft.amountPaid} onChange={setR('amountPaid')} />
                      </Field>
                    )}
                  </div>
                  <Field label="Note (optional)">
                    <TextArea value={draft.note} onChange={(e) => setR('note')(e.target.value)} placeholder="e.g. Goods sold in good condition. Exchange within 3 days with this receipt." className="min-h-[70px]" />
                  </Field>
                </div>
              </Card>
            </>
          )}

          {tab === 'history' && (
            <Card title="Saved receipts" subtitle="Stored on this device only" padded={false}>
              {history.length === 0 ? (
                <Empty icon={History} title="No receipts yet">Receipts you download or share are saved here so you can resend or copy them.</Empty>
              ) : (
                <ul className="divide-y divide-line">
                  {history.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-ink">{r.number}</span>
                          <Pill tone={r.status === 'Paid' ? 'brand' : r.status === 'Unpaid' ? 'red' : 'gold'}>{r.status}</Pill>
                        </div>
                        <div className="truncate text-[12.5px] text-ink-mute">
                          {r.customerName || 'No name'} · {prettyDate(r.date)}
                        </div>
                      </div>
                      <div className="text-right text-[14px] font-extrabold tabular-nums">{naira(r.total)}</div>
                      <div className="flex shrink-0">
                        <button className="rounded-lg p-2 text-ink-mute hover:bg-paper hover:text-ink" onClick={() => openFromHistory(r)} aria-label="Edit"><Pencil size={16} /></button>
                        <button className="rounded-lg p-2 text-ink-mute hover:bg-paper hover:text-ink" onClick={() => openFromHistory(r, true)} aria-label="Duplicate"><Copy size={16} /></button>
                        <button className="rounded-lg p-2 text-ink-mute hover:bg-red-50 hover:text-red-600" onClick={() => setHistory((h) => h.filter((x) => x.id !== r.id))} aria-label="Delete"><Trash2 size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </div>

        {/* Preview + actions */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-bold uppercase tracking-wider text-ink-mute">Live preview</div>
            <div className="text-[13px] font-semibold text-ink-soft">Total: <b className="text-ink">{naira(t.total)}</b></div>
          </div>
          <div className="flex justify-center rounded-2xl bg-[#E9EDEA] p-3 sm:p-5">
            <div className="w-full max-w-[420px] overflow-hidden rounded-xl shadow-pop">
              <ReceiptView ref={previewRef} biz={biz} receipt={draft} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Button variant="whatsapp" size="lg" className="col-span-2" icon={busy === 'share' ? Loader2 : Share2} onClick={share} disabled={!!busy}>
              Send to customer
            </Button>
            <Button variant="outline" icon={busy === 'png' ? Loader2 : Download} onClick={downloadPNG} disabled={!!busy}>Image</Button>
            <Button variant="outline" icon={busy === 'pdf' ? Loader2 : FileText} onClick={downloadPDF} disabled={!!busy}>PDF</Button>
          </div>
        </div>
      </div>

      {/* Hidden full-size copy used for image/PDF export */}
      <div aria-hidden="true" style={{ position: 'fixed', left: -10000, top: 0, width: 420, pointerEvents: 'none' }}>
        <div style={{ width: 420 }}>
          <ReceiptView ref={exportRef} biz={biz} receipt={draft} />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-3 text-[14px] font-semibold text-white shadow-pop">{toast}</div>
      )}
    </div>
  );
}
