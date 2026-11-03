import { useEffect, useState } from 'react';
import { Info, ChevronDown, Loader2 } from 'lucide-react';

export function cx(...c) {
  return c.filter(Boolean).join(' ');
}

export function PageHeader({ icon: Icon, title, subtitle, children, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-100 text-brand-800',
    gold: 'bg-gold-100 text-gold-700',
    ink: 'bg-ink text-brand-300',
  };
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={cx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', tones[tone])}>
            <Icon size={24} strokeWidth={2} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex shrink-0 gap-2">{children}</div>}
    </div>
  );
}

export function Card({ title, subtitle, action, children, className, padded = true }) {
  return (
    <section className={cx('rounded-2xl border border-line bg-white shadow-card', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {title && <h2 className="text-[15px] font-bold text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[13px] text-ink-mute">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  );
}

export function Field({ label, hint, tip, children, className }) {
  const [open, setOpen] = useState(false);
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
        {label}
        {tip && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
            className="text-ink-mute hover:text-brand-700"
            aria-label="More info"
          >
            <Info size={14} />
          </button>
        )}
      </span>
      {open && tip && <span className="mb-2 block rounded-lg bg-brand-50 px-3 py-2 text-[12.5px] leading-relaxed text-brand-900">{tip}</span>}
      {children}
      {hint && <span className="mt-1 block text-[12px] text-ink-mute">{hint}</span>}
    </label>
  );
}

const inputBase =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-ink-mute/60 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

function fmtThousands(v) {
  if (v === '' || v == null) return '';
  const [i, d] = String(v).split('.');
  const int = i.replace(/\D/g, '');
  const withCommas = int ? Number(int).toLocaleString('en-NG') : '';
  return d !== undefined ? `${withCommas}.${d.replace(/\D/g, '').slice(0, 2)}` : withCommas;
}

export function MoneyInput({ value, onChange, placeholder = '0', ...rest }) {
  const [text, setText] = useState(value ? fmtThousands(value) : "");
  useEffect(() => {
    const parsed = parseFloat(String(text).replace(/,/g, '')) || 0;
    if (parsed !== Number(value || 0)) setText(value ? fmtThousands(value) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-ink-mute">₦</span>
      <input
        {...rest}
        inputMode="decimal"
        className={cx(inputBase, 'pl-8 font-semibold tabular-nums')}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, '');
          setText(fmtThousands(raw));
          onChange(parseFloat(raw) || 0);
        }}
      />
    </div>
  );
}

export function NumberInput({ value, onChange, suffix, min, max, step = 'any', ...rest }) {
  return (
    <div className="relative">
      <input
        {...rest}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        className={cx(inputBase, 'font-semibold tabular-nums', suffix && 'pr-12')}
        value={value === 0 || value ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-ink-mute">{suffix}</span>
      )}
    </div>
  );
}

export function TextInput(props) {
  return <input {...props} className={cx(inputBase, props.className)} />;
}

export function TextArea(props) {
  return <textarea {...props} className={cx(inputBase, 'min-h-[96px] resize-y leading-relaxed', props.className)} />;
}

export function Select({ value, onChange, options, ...rest }) {
  return (
    <div className="relative">
      <select
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(inputBase, 'appearance-none pr-10')}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute" />
    </div>
  );
}

export function Segmented({ value, onChange, options, size = 'md' }) {
  return (
    <div className="inline-flex w-full rounded-xl bg-paper p-1 ring-1 ring-line">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            'flex-1 rounded-lg font-semibold transition',
            size === 'sm' ? 'px-2 py-1.5 text-[12.5px]' : 'px-3 py-2 text-[13.5px]',
            value === o.value ? 'bg-white text-ink shadow-sm ring-1 ring-line' : 'text-ink-mute hover:text-ink'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Slider({ value, onChange, min, max, step = 1 }) {
  const pctVal = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="slider w-full"
      style={{ '--p': `${pctVal}%` }}
    />
  );
}

export function Button({ variant = 'primary', size = 'md', className, children, icon: Icon, ...rest }) {
  const variants = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm',
    dark: 'bg-ink text-white hover:bg-black',
    soft: 'bg-brand-50 text-brand-800 hover:bg-brand-100',
    outline: 'border border-line bg-white text-ink hover:bg-paper',
    ghost: 'text-ink-soft hover:bg-paper hover:text-ink',
    danger: 'text-red-700 hover:bg-red-50',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#1fb757]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-[13px] rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-[14px] rounded-xl gap-2',
    lg: 'px-5 py-3.5 text-[15px] rounded-xl gap-2',
  };
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon size={size === 'sm' ? 15 : 18} className={Icon === Loader2 ? 'animate-spin' : ''} />}
      {children}
    </button>
  );
}

export function Stat({ label, value, sub, tone = 'default', big }) {
  const tones = {
    default: 'text-ink',
    good: 'text-brand-700',
    bad: 'text-red-600',
    warn: 'text-gold-700',
  };
  return (
    <div className="rounded-xl bg-paper px-4 py-3 ring-1 ring-line/70">
      <div className="text-[12px] font-semibold uppercase tracking-wide text-ink-mute">{label}</div>
      <div className={cx('mt-1 font-extrabold tabular-nums tracking-tight', big ? 'text-[26px]' : 'text-[20px]', tones[tone])}>{value}</div>
      {sub && <div className="mt-0.5 text-[12.5px] text-ink-mute">{sub}</div>}
    </div>
  );
}

export function Verdict({ tone = 'green', title, children, icon: Icon }) {
  const tones = {
    green: 'bg-brand-50 ring-brand-200 text-brand-900',
    amber: 'bg-gold-100/70 ring-gold-400/40 text-gold-700',
    red: 'bg-red-50 ring-red-200 text-red-800',
    info: 'bg-sky-50 ring-sky-200 text-sky-900',
  };
  const dot = { green: 'bg-brand-500', amber: 'bg-gold-500', red: 'bg-red-500', info: 'bg-sky-500' };
  return (
    <div className={cx('rounded-2xl px-5 py-4 ring-1', tones[tone])}>
      <div className="flex items-center gap-2.5">
        {Icon ? <Icon size={20} /> : <span className={cx('h-2.5 w-2.5 rounded-full', dot[tone])} />}
        <div className="text-[16px] font-extrabold">{title}</div>
      </div>
      {children && <div className="mt-1.5 text-[14px] leading-relaxed opacity-90">{children}</div>}
    </div>
  );
}

export function Pill({ children, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-100 text-brand-800',
    gold: 'bg-gold-100 text-gold-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-paper text-ink-soft ring-1 ring-line',
  };
  return <span className={cx('inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold', tones[tone])}>{children}</span>;
}

export function Collapsible({ title, subtitle, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-line bg-white shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <div className="text-[15px] font-bold text-ink">{title}</div>
          {subtitle && <div className="mt-0.5 text-[13px] text-ink-mute">{subtitle}</div>}
        </div>
        <ChevronDown size={20} className={cx('shrink-0 text-ink-mute transition', open && 'rotate-180')} />
      </button>
      {open && <div className="border-t border-line p-5">{children}</div>}
    </div>
  );
}

// Horizontal stacked bar showing where each naira goes
export function BreakdownBar({ parts, total }) {
  const sum = total || parts.reduce((a, p) => a + Math.max(0, p.value), 0) || 1;
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-paper ring-1 ring-line">
        {parts.map((p) =>
          p.value > 0 ? (
            <div key={p.label} style={{ width: `${(p.value / sum) * 100}%`, background: p.color }} title={p.label} />
          ) : null
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center gap-2 text-[12.5px] text-ink-soft">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: p.color }} />
            <span className="truncate">{p.label}</span>
            <span className="ml-auto font-semibold tabular-nums text-ink">{p.display}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-ink-mute ring-1 ring-line">
          <Icon size={22} />
        </div>
      )}
      <div className="text-[15px] font-bold text-ink">{title}</div>
      {children && <div className="mt-1 max-w-sm text-[13.5px] text-ink-mute">{children}</div>}
    </div>
  );
}
