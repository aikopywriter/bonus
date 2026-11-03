// Naira formatting helpers

export function naira(value, { decimals = 0, sign = false } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '₦0';
  const abs = Math.abs(n).toLocaleString('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const prefix = n < 0 ? '-' : sign && n > 0 ? '+' : '';
  return `${prefix}₦${abs}`;
}

// Short form for big numbers: ₦1.2m, ₦350k
export function nairaShort(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${s}₦${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}bn`;
  if (abs >= 1_000_000) return `${s}₦${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (abs >= 10_000) return `${s}₦${Math.round(abs / 1000)}k`;
  return naira(n);
}

export function num(value, decimals = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function pct(value, decimals = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0%';
  return `${n.toFixed(decimals).replace(/\.0+$/, '')}%`;
}

// Parse "25,000" / "₦25k" style input into a number
export function parseMoney(input) {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  let s = String(input).toLowerCase().replace(/[₦,\s]/g, '');
  let mult = 1;
  if (s.endsWith('k')) { mult = 1000; s = s.slice(0, -1); }
  else if (s.endsWith('m')) { mult = 1_000_000; s = s.slice(0, -1); }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n * mult : 0;
}

export function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function prettyDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}
