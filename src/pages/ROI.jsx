import { useMemo } from 'react';
import { TrendingUp, Smartphone, Lightbulb } from 'lucide-react';
import { PageHeader, Card, Field, MoneyInput, NumberInput, Stat, Verdict, Collapsible, cx } from '../components/ui';
import ProductInputs, { useProduct } from '../components/ProductInputs';
import NextStep from '../components/NextStep';
import { forecastAll, AD_DEFAULTS, SCENARIOS, unitEconomics } from '../lib/calc';
import { naira, num, pct } from '../lib/format';
import { useStored } from '../lib/storage';

const VERDICTS = {
  green: { tone: 'green', title: 'Launch it', text: 'Even in the worst case you don’t lose money. Start with this budget and watch your cost per order daily.' },
  amber: { tone: 'amber', title: 'Launch small and test', text: 'You should profit in the likely case, but a bad run could lose money. Start with a smaller budget for 2–3 days, then scale what works.' },
  red: { tone: 'red', title: 'Don’t run this yet', text: 'At these numbers you’re likely to lose money. Improve your offer, price or conversion rate first.' },
  loss: { tone: 'red', title: 'This product loses money on every order', text: 'Your price doesn’t cover product, delivery and failed-delivery costs. Fix the price in the Pricing Calculator before running ads.' },
};

export default function ROI() {
  const [product, setProduct] = useProduct();
  const [ad, setAd] = useStored('roiAd', AD_DEFAULTS);
  const set = (k) => (v) => setAd((a) => ({ ...a, [k]: v }));

  const f = useMemo(() => forecastAll(product, ad), [product, ad]);
  const u = unitEconomics(product);
  const L = f.likely;
  const v = VERDICTS[f.verdict];
  const daily = (Number(ad.budget) || 0) / Math.max(1, Number(ad.days) || 1);

  const rows = [
    { label: 'People reached (views)', fmt: (x) => num(x.impressions) },
    { label: 'Clicks', fmt: (x) => num(x.clicks) },
    { label: 'Orders', fmt: (x) => num(x.orders, 1) },
    { label: 'Delivered sales', fmt: (x) => num(x.delivered, 1) },
    { label: 'Cost per order', fmt: (x) => (Number.isFinite(x.cpa) ? naira(x.cpa) : '—') },
    { label: 'Revenue', fmt: (x) => naira(x.revenue) },
    { label: 'Product & delivery costs', fmt: (x) => naira(x.productCosts) },
    { label: 'Ad spend', fmt: (x) => naira(x.adSpend) },
    { label: 'Profit', fmt: (x) => naira(x.profit), strong: true, tone: (x) => (x.profit >= 0 ? 'text-brand-700' : 'text-red-600') },
    { label: 'ROI', fmt: (x) => pct(x.roi), strong: true, tone: (x) => (x.roi >= 0 ? 'text-brand-700' : 'text-red-600') },
    { label: 'ROAS', fmt: (x) => `${num(x.roas, 2)}×` },
  ];

  const tips = [];
  if (f.verdict !== 'green') {
    if (Number.isFinite(f.breakEvenConv))
      tips.push(`You need about ${pct(f.breakEvenConv, 1)} of clickers to order just to break even (you assumed ${pct(ad.conv, 1)}). Better product videos, clear price in the ad and a WhatsApp order button raise this.`);
    if (product.paymentMode === 'pod' && product.successRate < 80)
      tips.push(`Only ${product.successRate}% of orders get delivered. Calling every customer to confirm before dispatch and asking for a small commitment fee can push this to 80%+.`);
    if (u.markup > 0 && u.markup < 2.5) tips.push(`Your price is only ${num(u.markup, 1)}× your cost. Products that sell at 3× or more leave room for ads.`);
    tips.push('Test a stronger hook in the first 3 seconds of your video — it’s the cheapest way to lower cost per click.');
  }

  return (
    <div>
      <PageHeader
        icon={TrendingUp}
        title="ROI Predictor"
        subtitle="Before you spend a kobo, see how many sales to expect, what your revenue could look like, and whether you’ll actually make profit."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Card title="Your ad budget">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Total budget">
                <MoneyInput value={ad.budget} onChange={set('budget')} />
              </Field>
              <Field label="Number of days" hint={`≈ ${naira(daily)} per day`}>
                <NumberInput value={ad.days} onChange={set('days')} min={1} suffix="days" />
              </Field>
            </div>
          </Card>

          <Collapsible
            title="Your product"
            subtitle={`${product.name || 'Product'} · sells for ${naira(product.price)} · costs ${naira(product.cost)}`}
            defaultOpen={false}
          >
            <ProductInputs product={product} setProduct={setProduct} />
          </Collapsible>

          <Collapsible title="Ad performance assumptions" subtitle="Pre-filled with typical beginner numbers" defaultOpen={false}>
            <div className="grid gap-4">
              <Field label="Cost per 1,000 views (CPM)" tip="How much Facebook charges to show your ad 1,000 times. In Nigeria this is often ₦1,500–₦4,000. Check ‘CPM’ in your Ads Manager results.">
                <MoneyInput value={ad.cpm} onChange={set('cpm')} />
              </Field>
              <Field label="Click rate (CTR)" tip="Out of 100 people who see your ad, how many click. 1–2% is normal; above 2% is a strong ad.">
                <NumberInput value={ad.ctr} onChange={set('ctr')} suffix="%" step={0.1} />
              </Field>
              <Field label="Order rate" tip="Out of 100 people who click, how many place an order (on your WhatsApp or website). 2–5% is typical; great offers get more.">
                <NumberInput value={ad.conv} onChange={set('conv')} suffix="%" step={0.1} />
              </Field>
              <button type="button" onClick={() => setAd({ ...AD_DEFAULTS, budget: ad.budget, days: ad.days })} className="justify-self-start text-[13px] font-semibold text-brand-700 hover:underline">
                Reset to typical numbers
              </button>
            </div>
          </Collapsible>
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Verdict tone={v.tone} title={v.title}>{v.text}</Verdict>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat big label="Expected sales" value={num(L.delivered, 0)} sub={`${num(L.orders, 0)} orders`} />
            <Stat big label="Revenue" value={naira(L.revenue)} />
            <Stat big label="Profit" value={naira(L.profit)} tone={L.profit >= 0 ? 'good' : 'bad'} />
            <Stat big label="ROI" value={pct(L.roi)} sub={`ROAS ${num(L.roas, 2)}×`} tone={L.roi >= 0 ? 'good' : 'bad'} />
          </div>

          <Card title="Three possible outcomes" subtitle="Ads never perform exactly the same — plan for the range" padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-[13.5px]">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="px-5 py-3 font-semibold text-ink-mute" />
                    {Object.entries(SCENARIOS).map(([k, s]) => (
                      <th key={k} className={cx('px-4 py-3 text-right font-bold', k === 'likely' ? 'text-ink' : 'text-ink-mute')}>
                        {s.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className={cx('border-b border-line/70 last:border-0', row.strong && 'bg-paper/60')}>
                      <td className={cx('px-5 py-2.5 text-ink-soft', row.strong && 'font-bold text-ink')}>{row.label}</td>
                      {Object.keys(SCENARIOS).map((k) => (
                        <td
                          key={k}
                          className={cx(
                            'px-4 py-2.5 text-right tabular-nums',
                            row.strong ? 'font-extrabold' : 'font-semibold',
                            k === 'likely' ? 'text-ink' : 'text-ink-soft',
                            row.tone && row.tone(f[k])
                          )}
                        >
                          {row.fmt(f[k])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Orders needed to break even" value={Number.isFinite(f.ordersNeeded) ? num(Math.ceil(f.ordersNeeded)) : '—'} sub={`Max ad cost per order: ${naira(u.breakEvenCPA)}`} />
            <Stat label="Order rate needed to break even" value={Number.isFinite(f.breakEvenConv) ? pct(f.breakEvenConv, 1) : '—'} sub={`You assumed ${pct(ad.conv, 1)}`} tone={f.breakEvenConv <= ad.conv ? 'good' : 'warn'} />
          </div>

          {tips.length > 0 && (
            <Card title={<span className="flex items-center gap-2"><Lightbulb size={17} className="text-gold-500" /> How to improve these numbers</span>}>
              <ul className="grid gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                {tips.map((t) => (
                  <li key={t} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{t}</li>
                ))}
              </ul>
            </Card>
          )}

          <p className="text-[12.5px] leading-relaxed text-ink-mute">
            Forecasts are estimates based on the numbers you enter. Replace the assumptions with your real Ads Manager results after 2–3 days for a sharper prediction.
          </p>

          <NextStep to="/phone-ads" icon={Smartphone} title="Set up your ad from your phone">
            Follow the step-by-step Phone Ad Setup Guide.
          </NextStep>
        </div>
      </div>
    </div>
  );
}
