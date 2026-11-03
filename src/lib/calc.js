// Shared money engine for the Pricing, Profit and ROI tools.
// All amounts are in Naira.

export const GATEWAYS = {
  none: { label: 'Bank transfer / cash (no gateway fee)', short: 'No fee' },
  paystack: { label: 'Paystack (1.5% + ₦100, max ₦2,000)', short: 'Paystack' },
  flutterwave: { label: 'Flutterwave (1.4%, max ₦2,000)', short: 'Flutterwave' },
};

export function gatewayFee(amount, gateway = 'none') {
  const a = Math.max(0, Number(amount) || 0);
  if (gateway === 'paystack') {
    // ₦100 flat fee is waived for transactions under ₦2,500; total capped at ₦2,000
    const fee = a * 0.015 + (a >= 2500 ? 100 : 0);
    return Math.min(fee, 2000);
  }
  if (gateway === 'flutterwave') return Math.min(a * 0.014, 2000);
  return 0;
}

export const DEFAULT_PRODUCT = {
  name: '',
  price: 15000,
  cost: 5000,
  delivery: 2500,
  packaging: 300,
  other: 0,
  gateway: 'none',
  paymentMode: 'pod', // 'pod' (pay on delivery) or 'prepaid'
  successRate: 75, // % of orders that are actually delivered & paid for
  failedCost: 2500, // money lost on each failed delivery (rider fee etc.)
};

const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// Economics of ONE order, before any ad cost.
export function unitEconomics(p, priceOverride) {
  const price = n(priceOverride ?? p.price);
  const fee = gatewayFee(price, p.gateway);
  const costDelivered = n(p.cost) + n(p.delivery) + n(p.packaging) + n(p.other) + fee;
  const profitDelivered = price - costDelivered; // profit on a delivered sale, before ads
  const s = p.paymentMode === 'prepaid' ? 1 : Math.min(1, Math.max(0, n(p.successRate) / 100));
  const failLoss = p.paymentMode === 'prepaid' ? 0 : n(p.failedCost);
  const profitPerOrder = s * profitDelivered - (1 - s) * failLoss; // expected, per order placed
  const revenuePerOrder = s * price;
  return {
    price,
    fee,
    costDelivered,
    profitDelivered,
    successRate: s,
    failLoss,
    profitPerOrder,
    revenuePerOrder,
    marginPct: price > 0 ? (profitDelivered / price) * 100 : 0,
    // Most you can pay in ads for one order and still break even
    breakEvenCPA: Math.max(0, profitPerOrder),
    breakEvenROAS: profitPerOrder > 0 ? revenuePerOrder / profitPerOrder : Infinity,
    markup: n(p.cost) > 0 ? price / n(p.cost) : 0,
  };
}

// Profit after ads
export function profitPlan(p, { adCPA = 0, ordersPerDay = 5, buffer = 30 } = {}) {
  const u = unitEconomics(p);
  const safeCPA = u.breakEvenCPA * (1 - n(buffer) / 100);
  const netPerOrder = u.profitPerOrder - n(adCPA);
  const opd = n(ordersPerDay);
  return {
    ...u,
    safeCPA,
    netPerOrder,
    safeDailyBudget: safeCPA * opd,
    breakEvenDailyBudget: u.breakEvenCPA * opd,
    dailyProfit: netPerOrder * opd,
    monthlyProfit: netPerOrder * opd * 30,
    monthlyRevenue: u.revenuePerOrder * opd * 30,
    netMarginPct: u.revenuePerOrder > 0 ? (netPerOrder / u.revenuePerOrder) * 100 : 0,
  };
}

// ROI forecast for an ad budget
export const AD_DEFAULTS = {
  budget: 50000,
  days: 5,
  cpm: 2000, // cost to show your ad 1,000 times
  ctr: 1.5, // % of viewers who click
  conv: 3, // % of clickers who place an order
};

export const SCENARIOS = {
  worst: { label: 'Worst case', cpm: 1.3, ctr: 0.7, conv: 0.6 },
  likely: { label: 'Most likely', cpm: 1, ctr: 1, conv: 1 },
  best: { label: 'Best case', cpm: 0.8, ctr: 1.3, conv: 1.4 },
};

export function forecast(p, ad, scenario = SCENARIOS.likely) {
  const u = unitEconomics(p);
  const budget = n(ad.budget);
  const cpm = Math.max(1, n(ad.cpm) * scenario.cpm);
  const ctr = (n(ad.ctr) / 100) * scenario.ctr;
  const conv = (n(ad.conv) / 100) * scenario.conv;
  const impressions = (budget / cpm) * 1000;
  const clicks = impressions * ctr;
  const orders = clicks * conv;
  const delivered = orders * u.successRate;
  const failed = orders - delivered;
  const revenue = delivered * u.price;
  const productCosts = delivered * u.costDelivered + failed * u.failLoss;
  const profit = revenue - productCosts - budget;
  return {
    impressions,
    clicks,
    orders,
    delivered,
    revenue,
    productCosts,
    adSpend: budget,
    profit,
    roi: budget > 0 ? (profit / budget) * 100 : 0,
    roas: budget > 0 ? revenue / budget : 0,
    cpa: orders > 0 ? budget / orders : Infinity,
    cpc: clicks > 0 ? budget / clicks : 0,
  };
}

export function forecastAll(p, ad) {
  const res = {};
  for (const [k, s] of Object.entries(SCENARIOS)) res[k] = forecast(p, ad, s);
  const u = unitEconomics(p);
  const clicks = res.likely.clicks;
  const ordersNeeded = u.profitPerOrder > 0 ? n(ad.budget) / u.profitPerOrder : Infinity;
  res.breakEvenConv = clicks > 0 ? (ordersNeeded / clicks) * 100 : Infinity;
  res.ordersNeeded = ordersNeeded;
  res.unit = u;
  let verdict;
  if (u.profitPerOrder <= 0) verdict = 'loss';
  else if (res.likely.profit <= 0) verdict = 'red';
  else if (res.worst.profit < 0) verdict = 'amber';
  else verdict = 'green';
  res.verdict = verdict;
  return res;
}

// Pricing: find the price that gives a target net margin after ads
export function netPerOrderAt(p, price, adCPA) {
  return unitEconomics(p, price).profitPerOrder - n(adCPA);
}

export function solvePrice(p, { adCPA = 0, marginPct = 30 } = {}) {
  const m = n(marginPct) / 100;
  const u0 = unitEconomics(p, 0);
  const s = u0.successRate;
  const target = (price) => netPerOrderAt(p, price, adCPA) - m * s * price;
  let lo = 0;
  let hi = Math.max(10000, (n(p.cost) + n(p.delivery) + n(adCPA)) * 40);
  if (target(hi) < 0) return Infinity;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (target(mid) >= 0) hi = mid; else lo = mid;
  }
  return hi;
}

// Round to a "selling" price: ₦9,900, ₦14,500, ₦24,900...
export function nicePrice(p) {
  if (!Number.isFinite(p) || p <= 0) return 0;
  const step = p < 5000 ? 100 : p < 20000 ? 500 : p < 100000 ? 1000 : 5000;
  let r = Math.ceil(p / step) * step;
  if (r >= 2000 && r % 1000 === 0 && r - 100 >= p) r -= 100;
  return r;
}

export function pricePlan(p, { adCPA = 0, marginPct = 30 } = {}) {
  const tiers = [
    { key: 'competitive', label: 'Competitive', margin: Math.max(5, n(marginPct) - 12), note: 'Win on price. Thinner profit — needs volume.' },
    { key: 'recommended', label: 'Recommended', margin: n(marginPct), note: 'Balanced profit and sales. Start here.' },
    { key: 'premium', label: 'Premium', margin: n(marginPct) + 15, note: 'For strong branding, bundles or unique products.' },
  ];
  const breakEven = solvePrice(p, { adCPA, marginPct: 0 });
  const out = tiers.map((t) => {
    const raw = solvePrice(p, { adCPA, marginPct: t.margin });
    const price = nicePrice(raw);
    const u = unitEconomics(p, price);
    const net = u.profitPerOrder - n(adCPA);
    return {
      ...t,
      raw,
      price,
      netPerOrder: net,
      profitDelivered: u.profitDelivered - n(adCPA) / Math.max(u.successRate, 0.01),
      realMargin: u.revenuePerOrder > 0 ? (net / u.revenuePerOrder) * 100 : 0,
      markup: n(p.cost) > 0 ? price / n(p.cost) : 0,
    };
  });
  return { tiers: out, breakEven: nicePrice(breakEven), breakEvenRaw: breakEven };
}
