import { useMemo } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { PageHeader, Card, Field, MoneyInput, NumberInput, Slider, Stat, Verdict, BreakdownBar } from '../components/ui';
import ProductInputs, { useProduct } from '../components/ProductInputs';
import NextStep from '../components/NextStep';
import { profitPlan } from '../lib/calc';
import { naira, nairaShort, pct, num } from '../lib/format';
import { useStored } from '../lib/storage';
import { DEFAULT_AD_PLAN } from './Pricing';

export default function Profit() {
  const [product, setProduct] = useProduct();
  const [plan, setPlan] = useStored('adPlan', DEFAULT_AD_PLAN);
  const set = (k) => (v) => setPlan((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => profitPlan(product, plan), [product, plan]);
  const s = r.successRate || 1;

  // Where the money from ONE delivered sale goes
  const adPerSale = (Number(plan.adCPA) || 0) / s;
  const failPerSale = ((1 - s) / s) * r.failLoss;
  const profitPerSale = r.price - r.costDelivered - adPerSale - failPerSale;
  const parts = [
    { label: 'Product cost', value: Number(product.cost) || 0, color: '#0B1F1A' },
    { label: 'Delivery', value: Number(product.delivery) || 0, color: '#3D5049' },
    { label: 'Packaging & other', value: (Number(product.packaging) || 0) + (Number(product.other) || 0), color: '#98A2B3' },
    { label: 'Payment fee', value: r.fee, color: '#D0D5DD' },
    { label: 'Ads', value: adPerSale, color: '#2E90FA' },
    { label: 'Failed deliveries', value: failPerSale, color: '#F79009' },
    { label: 'Your profit', value: Math.max(0, profitPerSale), color: '#12B76A' },
  ].map((p) => ({ ...p, display: naira(p.value) }));

  let verdict;
  if (r.profitDelivered <= 0)
    verdict = { tone: 'red', title: 'You lose money even before ads', text: 'Your selling price doesn’t cover product, delivery and fees. Raise the price or cut costs before you spend anything on ads.' };
  else if (r.netPerOrder <= 0)
    verdict = { tone: 'red', title: 'Ads would eat all your profit', text: `At ${naira(plan.adCPA)} per order you lose ${naira(-r.netPerOrder)} on each order. Keep your ad cost per order under ${naira(r.safeCPA)}, or raise your price.` };
  else if (Number(plan.adCPA) > r.safeCPA)
    verdict = { tone: 'amber', title: 'Profitable — but with little safety room', text: `You make ${naira(r.netPerOrder)} per order, but your ad cost is above the safe limit of ${naira(r.safeCPA)}. One bad day can wipe out your profit.` };
  else
    verdict = { tone: 'green', title: 'Healthy numbers — you can run ads', text: `You make about ${naira(r.netPerOrder)} per order after ads. Keep your cost per order below ${naira(r.safeCPA)} and you stay safe.` };

  return (
    <div>
      <PageHeader
        icon={Wallet}
        title="Profit Calculator"
        subtitle="See your true profit after every cost, and exactly how much you can safely spend on ads."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Card title="Your product numbers" subtitle="Per order">
            <ProductInputs product={product} setProduct={setProduct} />
          </Card>
          <Card title="Your ad plan">
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ad cost per order" tip="What you spend (or expect to spend) on ads to get one order. Find it in Ads Manager as ‘Cost per result’.">
                  <MoneyInput value={plan.adCPA} onChange={set('adCPA')} />
                </Field>
                <Field label="Orders per day (goal)">
                  <NumberInput value={plan.ordersPerDay} onChange={set('ordersPerDay')} min={1} />
                </Field>
              </div>
              <Field
                label={`Safety buffer: ${plan.buffer}%`}
                tip="We keep part of your profit as a cushion so a bad ad day doesn’t push you into a loss. 30% is a good default for beginners."
              >
                <Slider value={plan.buffer} onChange={set('buffer')} min={0} max={60} step={5} />
              </Field>
            </div>
          </Card>
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Verdict tone={verdict.tone} title={verdict.title}>{verdict.text}</Verdict>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Stat label="Profit per sale (before ads)" value={naira(r.profitDelivered)} sub={`${pct(r.marginPct)} margin`} tone={r.profitDelivered > 0 ? 'good' : 'bad'} />
            <Stat label="Profit per order (after ads)" value={naira(r.netPerOrder)} sub={product.paymentMode === 'pod' ? `includes ${pct(100 - product.successRate)} failed deliveries` : 'customers pay first'} tone={r.netPerOrder > 0 ? 'good' : 'bad'} />
            <Stat label="Break-even ROAS" value={Number.isFinite(r.breakEvenROAS) ? `${num(r.breakEvenROAS, 2)}×` : '—'} sub="Below this, ads lose money" />
          </div>

          <Card title="Your safe ad budget" subtitle="The most you should spend to stay profitable">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat big label="Safe cost per order" value={naira(r.safeCPA)} sub={`Break-even: ${naira(r.breakEvenCPA)}`} tone="good" />
              <Stat big label="Safe daily budget" value={naira(r.safeDailyBudget)} sub={`for ${num(plan.ordersPerDay)} orders/day`} tone="good" />
              <Stat big label="Never spend over" value={naira(r.breakEvenDailyBudget)} sub="per day at this goal" tone="bad" />
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
              <b className="text-ink">How to use this:</b> In Ads Manager, look at “Cost per result”. If it stays below {naira(r.safeCPA)}, keep the ad running. If it climbs above {naira(r.breakEvenCPA)} for 2–3 days, pause it and fix it.
            </p>
          </Card>

          <Card title="Where your money goes" subtitle={`From one ${naira(r.price)} delivered sale`}>
            <BreakdownBar parts={parts} total={Math.max(r.price, parts.reduce((a, p) => a + p.value, 0))} />
            {profitPerSale < 0 && (
              <p className="mt-3 text-[13px] font-semibold text-red-600">Costs are {naira(-profitPerSale)} more than your price on each delivered sale.</p>
            )}
          </Card>

          <Card title="If you hit your goal">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Daily profit" value={naira(r.dailyProfit)} tone={r.dailyProfit >= 0 ? 'good' : 'bad'} />
              <Stat label="Monthly profit" value={nairaShort(r.monthlyProfit)} tone={r.monthlyProfit >= 0 ? 'good' : 'bad'} />
              <Stat label="Monthly sales" value={nairaShort(r.monthlyRevenue)} sub="money collected" />
            </div>
          </Card>

          <NextStep to="/roi" icon={TrendingUp} title="Predict your ad results with the ROI Predictor">
            Your product numbers carry over automatically.
          </NextStep>
        </div>
      </div>
    </div>
  );
}
