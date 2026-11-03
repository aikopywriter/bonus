import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tags, Wallet, Check, AlertTriangle } from 'lucide-react';
import { PageHeader, Card, Field, MoneyInput, Slider, Verdict, Button, Pill, cx } from '../components/ui';
import ProductInputs, { useProduct } from '../components/ProductInputs';
import NextStep from '../components/NextStep';
import { pricePlan } from '../lib/calc';
import { naira, pct, num } from '../lib/format';
import { useStored } from '../lib/storage';

export const DEFAULT_AD_PLAN = { adCPA: 3000, ordersPerDay: 5, buffer: 30, marginPct: 25, competitor: 0 };

export default function Pricing() {
  const [product, setProduct] = useProduct();
  const [plan, setPlan] = useStored('adPlan', DEFAULT_AD_PLAN);
  const navigate = useNavigate();
  const set = (k) => (v) => setPlan((p) => ({ ...p, [k]: v }));

  const result = useMemo(() => pricePlan(product, plan), [product, plan]);
  const rec = result.tiers.find((t) => t.key === 'recommended');
  const comp = Number(plan.competitor) || 0;

  function applyPrice(price) {
    setProduct((p) => ({ ...p, price }));
    navigate('/profit');
  }

  let compNote = null;
  if (comp > 0 && rec && Number.isFinite(rec.price)) {
    const diff = ((rec.price - comp) / comp) * 100;
    if (comp < result.breakEven)
      compNote = { tone: 'red', title: 'Competitor is selling below your break-even price', text: `At ${naira(comp)} you would lose money on every order. Don’t fight on price — find a cheaper supplier, bundle extra value, or choose another product.` };
    else if (diff > 25)
      compNote = { tone: 'amber', title: `Recommended price is ${pct(diff)} above competitor`, text: 'You’ll need a stronger offer to justify it: better photos/videos, a bundle, a free gift, faster delivery, or a guarantee.' };
    else if (diff < -10)
      compNote = { tone: 'green', title: `You can undercut the competitor by ${pct(-diff)}`, text: 'You have room to price higher and still be competitive. Consider the Premium price.' };
    else
      compNote = { tone: 'green', title: 'Your price is in line with the market', text: 'Good position. Win on your offer and creative, not just price.' };
  }

  return (
    <div>
      <PageHeader
        icon={Tags}
        tone="gold"
        title="Product Pricing Calculator"
        subtitle="Enter your cost price and the tool works out a selling price that covers every cost, pays for ads and leaves you real profit."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Card title="Your costs" subtitle="Per order">
            <ProductInputs product={product} setProduct={setProduct} showPrice={false} />
          </Card>
          <Card title="Your goals">
            <div className="grid gap-5">
              <Field
                label="Expected ad cost per order"
                tip="How much you expect to spend on ads to get ONE order. Don’t know yet? ₦2,500–₦5,000 is common for beginners in Nigeria. Update it once you have real results."
              >
                <MoneyInput value={plan.adCPA} onChange={set('adCPA')} />
              </Field>
              <Field label={`Target profit margin: ${plan.marginPct}%`} tip="How much of every naira you collect should be profit, after ALL costs including ads. 20–35% is healthy for most products.">
                <Slider value={plan.marginPct} onChange={set('marginPct')} min={10} max={60} />
              </Field>
              <Field label="Competitor’s price (optional)" hint="Check Jumia, Instagram or WhatsApp vendors for the same product.">
                <MoneyInput value={plan.competitor} onChange={set('competitor')} />
              </Field>
            </div>
          </Card>
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {result.tiers.map((t) => {
              const isRec = t.key === 'recommended';
              const ok = Number.isFinite(t.price) && t.price > 0;
              return (
                <div
                  key={t.key}
                  className={cx(
                    'relative flex flex-col rounded-2xl border p-5 shadow-card',
                    isRec ? 'border-brand-600 bg-white ring-4 ring-brand-500/10' : 'border-line bg-white'
                  )}
                >
                  {isRec && (
                    <div className="absolute -top-3 left-5">
                      <Pill>Best choice</Pill>
                    </div>
                  )}
                  <div className="text-[13px] font-bold text-ink-mute">{t.label}</div>
                  <div className={cx('mt-1 text-[30px] font-extrabold tabular-nums tracking-tight', isRec ? 'text-brand-700' : 'text-ink')}>
                    {ok ? naira(t.price) : '—'}
                  </div>
                  <div className="mt-2 space-y-1 text-[13px] text-ink-soft">
                    <div className="flex justify-between"><span>Profit per order</span><b className="tabular-nums text-ink">{ok ? naira(t.netPerOrder) : '—'}</b></div>
                    <div className="flex justify-between"><span>Real margin</span><b className="tabular-nums text-ink">{ok ? pct(t.realMargin) : '—'}</b></div>
                    <div className="flex justify-between"><span>Markup</span><b className="tabular-nums text-ink">{ok ? `${num(t.markup, 1)}×` : '—'}</b></div>
                  </div>
                  <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-ink-mute">{t.note}</p>
                  <Button
                    variant={isRec ? 'primary' : 'outline'}
                    size="sm"
                    className="mt-4"
                    icon={Check}
                    disabled={!ok}
                    onClick={() => applyPrice(t.price)}
                  >
                    Use this price
                  </Button>
                </div>
              );
            })}
          </div>

          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wide text-ink-mute">Never sell below</div>
                <div className="mt-1 text-[24px] font-extrabold tabular-nums text-red-600">
                  {Number.isFinite(result.breakEvenRaw) ? naira(result.breakEven) : '—'}
                </div>
                <p className="mt-1 text-[13px] text-ink-soft">This is your break-even price with ads. Below it, every order loses money.</p>
              </div>
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wide text-ink-mute">Quick rule</div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
                  When you run ads, aim to sell at <b className="text-ink">at least 3× your cost price</b>. Below 2× there’s usually not enough room to pay for ads and delivery.
                </p>
              </div>
            </div>
          </Card>

          {rec && rec.markup > 0 && rec.markup < 2 && (
            <Verdict tone="amber" icon={AlertTriangle} title="Thin room for ads">
              Your recommended price is only {num(rec.markup, 1)}× your cost. This works for repeat customers or organic sales, but paid ads will be risky. Look for a cheaper supplier or a bundle.
            </Verdict>
          )}

          {compNote && (
            <Verdict tone={compNote.tone} title={compNote.title}>
              {compNote.text}
            </Verdict>
          )}

          <NextStep to="/profit" icon={Wallet} title="Check your real profit & safe ad budget">
            Tap “Use this price” to send it straight to the Profit Calculator.
          </NextStep>
        </div>
      </div>
    </div>
  );
}
