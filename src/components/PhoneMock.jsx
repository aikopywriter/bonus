// Illustrated phone screen. Simplified mock-ups (not real screenshots) that show
// where to tap. Each row type draws a common app element.
import { ChevronRight, ChevronLeft, Search, Plus, Check, Image as ImageIcon, Lock } from 'lucide-react';
import { cx } from './ui';

function Tap() {
  return (
    <span className="pointer-events-none absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-60" />
      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-pink-500 ring-2 ring-white" />
    </span>
  );
}

function Row({ r }) {
  const hl = r.highlight;
  const ring = hl ? 'ring-2 ring-pink-500 ring-offset-1' : '';
  switch (r.type) {
    case 'section':
      return <div className="px-1 pt-2 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">{r.label}</div>;
    case 'text':
      return <div className={cx('px-1 text-[10.5px] leading-snug text-slate-500', r.bold && 'font-bold text-slate-800 text-[12px]')}>{r.label}</div>;
    case 'search':
      return (
        <div className={cx('relative flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-2 text-[10.5px] text-slate-400', ring)}>
          <Search size={11} /> {r.label}
          {hl && <Tap />}
        </div>
      );
    case 'app':
      return (
        <div className={cx('relative flex items-center gap-2.5 rounded-xl bg-white p-2.5 ring-1 ring-slate-200', ring)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-black text-white" style={{ background: r.color || '#1877F2' }}>
            {r.icon || r.label[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-bold text-slate-800">{r.label}</div>
            <div className="truncate text-[9.5px] text-slate-400">{r.value}</div>
          </div>
          <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[9.5px] font-bold text-white">{r.action || 'Install'}</span>
          {hl && <Tap />}
        </div>
      );
    case 'option':
      return (
        <div className={cx('relative flex items-center gap-2.5 rounded-xl px-2.5 py-2.5', r.selected ? 'bg-blue-50 ring-1 ring-blue-500' : 'bg-white ring-1 ring-slate-200', ring)}>
          <span className={cx('flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2', r.selected ? 'border-blue-600' : 'border-slate-300')}>
            {r.selected && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">{r.label}</div>
            {r.value && <div className="text-[9.5px] leading-snug text-slate-400">{r.value}</div>}
          </div>
          {hl && <Tap />}
        </div>
      );
    case 'check':
      return (
        <div className={cx('relative flex items-center gap-2 px-1 py-1', ring)}>
          <span className={cx('flex h-3.5 w-3.5 items-center justify-center rounded', r.selected ? 'bg-blue-600 text-white' : 'border-2 border-slate-300')}>
            {r.selected && <Check size={9} strokeWidth={4} />}
          </span>
          <span className="text-[10.5px] font-semibold text-slate-700">{r.label}</span>
          {hl && <Tap />}
        </div>
      );
    case 'field':
      return (
        <div className={cx('relative rounded-xl bg-white px-2.5 py-2 ring-1 ring-slate-200', ring)}>
          <div className="text-[9px] font-semibold text-slate-400">{r.label}</div>
          <div className={cx('mt-0.5 text-[11px] font-bold', r.value ? 'text-slate-800' : 'text-slate-300')}>{r.value || r.placeholder || '—'}</div>
          {hl && <Tap />}
        </div>
      );
    case 'nav':
      return (
        <div className={cx('relative flex items-center justify-between rounded-xl bg-white px-2.5 py-2.5 ring-1 ring-slate-200', ring)}>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800">{r.label}</div>
            {r.value && <div className="truncate text-[9.5px] text-slate-400">{r.value}</div>}
          </div>
          <ChevronRight size={13} className="shrink-0 text-slate-400" />
          {hl && <Tap />}
        </div>
      );
    case 'toggle':
      return (
        <div className={cx('relative flex items-center justify-between rounded-xl bg-white px-2.5 py-2.5 ring-1 ring-slate-200', ring)}>
          <div className="min-w-0 pr-2">
            <div className="text-[11px] font-bold text-slate-800">{r.label}</div>
            {r.value && <div className="text-[9.5px] leading-snug text-slate-400">{r.value}</div>}
          </div>
          <span className={cx('relative h-4 w-7 shrink-0 rounded-full', r.selected ? 'bg-blue-600' : 'bg-slate-300')}>
            <span className={cx('absolute top-0.5 h-3 w-3 rounded-full bg-white transition', r.selected ? 'left-3.5' : 'left-0.5')} />
          </span>
          {hl && <Tap />}
        </div>
      );
    case 'chips':
      return (
        <div className={cx('relative flex flex-wrap gap-1 rounded-xl bg-white p-2 ring-1 ring-slate-200', ring)}>
          {r.items.map((c) => (
            <span key={c} className="rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-bold text-blue-700">{c} ×</span>
          ))}
          {hl && <Tap />}
        </div>
      );
    case 'media':
      return (
        <div className={cx('relative grid grid-cols-3 gap-1', ring)}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cx('flex aspect-square items-center justify-center rounded-md', i === 0 ? 'bg-gradient-to-br from-amber-200 to-pink-300 ring-2 ring-blue-600' : 'bg-slate-200')}>
              {i === 0 ? <Check size={14} className="text-blue-700" strokeWidth={3} /> : <ImageIcon size={12} className="text-slate-400" />}
            </div>
          ))}
          {hl && <Tap />}
        </div>
      );
    case 'adpreview':
      return (
        <div className={cx('relative overflow-hidden rounded-xl bg-white ring-1 ring-slate-200', ring)}>
          <div className="flex items-center gap-1.5 p-2">
            <div className="h-5 w-5 rounded-full bg-emerald-600" />
            <div>
              <div className="text-[9.5px] font-bold text-slate-800">{r.label || 'Your Page'}</div>
              <div className="text-[8px] text-slate-400">Sponsored</div>
            </div>
          </div>
          <div className="px-2 pb-1.5 text-[9.5px] leading-snug text-slate-700">{r.value}</div>
          <div className="flex h-20 items-center justify-center bg-gradient-to-br from-amber-200 via-orange-200 to-pink-300 text-[10px] font-bold text-white/90">Your product video</div>
          <div className="flex items-center justify-between bg-slate-50 px-2 py-1.5">
            <span className="text-[9.5px] font-bold text-slate-700">{r.headline || 'Order now — pay on delivery'}</span>
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[8.5px] font-bold text-slate-700">{r.cta || 'Send message'}</span>
          </div>
          {hl && <Tap />}
        </div>
      );
    case 'stats':
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {r.items.map((s) => (
            <div key={s.label} className={cx('relative rounded-xl bg-white p-2 ring-1 ring-slate-200', s.highlight && 'ring-2 ring-pink-500')}>
              <div className="text-[8.5px] font-semibold text-slate-400">{s.label}</div>
              <div className="text-[12.5px] font-extrabold text-slate-800">{s.value}</div>
              {s.highlight && <Tap />}
            </div>
          ))}
        </div>
      );
    case 'menu':
      return (
        <div className={cx('relative rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200')}>
          {r.items.map((m) => (
            <div key={m.label} className={cx('relative flex items-center gap-2 rounded-lg px-2 py-2 text-[10.5px] font-semibold text-slate-700', m.highlight && 'bg-blue-50 text-blue-700')}>
              {m.label}
              {m.highlight && <Tap />}
            </div>
          ))}
        </div>
      );
    case 'button':
      return (
        <div className={cx('relative rounded-xl py-2.5 text-center text-[11px] font-bold', r.secondary ? 'bg-slate-100 text-slate-700' : 'bg-blue-600 text-white', ring)}>
          {r.label}
          {hl && <Tap />}
        </div>
      );
    case 'status':
      return (
        <div className={cx('relative flex items-center gap-2 rounded-xl px-2.5 py-2 text-[10.5px] font-bold', r.tone === 'good' ? 'bg-emerald-50 text-emerald-700' : r.tone === 'bad' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')}>
          <span className={cx('h-2 w-2 rounded-full', r.tone === 'good' ? 'bg-emerald-500' : r.tone === 'bad' ? 'bg-red-500' : 'bg-amber-500')} />
          {r.label}
        </div>
      );
    default:
      return null;
  }
}

export default function PhoneMock({ screen }) {
  if (!screen) return null;
  return (
    <div className="mx-auto w-[230px] shrink-0 rounded-[34px] bg-slate-900 p-2 shadow-pop">
      <div className="relative flex h-[440px] flex-col overflow-hidden rounded-[27px] bg-slate-50">
        {/* status bar */}
        <div className="flex items-center justify-between px-5 pb-1 pt-2.5 text-[9px] font-bold text-slate-700">
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-slate-900" />
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded-sm bg-slate-700" />
          </span>
        </div>
        {/* app bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
          {screen.back !== false && <ChevronLeft size={14} className="text-slate-500" />}
          <div className="flex-1 truncate text-[12px] font-extrabold text-slate-800">{screen.title}</div>
          {screen.plus && (
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
              <Plus size={13} strokeWidth={3} />
              {screen.plusHighlight && <Tap />}
            </span>
          )}
          {screen.lock && <Lock size={12} className="text-slate-400" />}
        </div>
        {screen.progress && (
          <div className="flex gap-1 bg-white px-3 pb-2 pt-1.5">
            {['Campaign', 'Ad set', 'Ad'].map((s, i) => (
              <div key={s} className="flex-1">
                <div className={cx('h-1 rounded-full', i < screen.progress ? 'bg-blue-600' : 'bg-slate-200')} />
                <div className={cx('mt-0.5 text-[7.5px] font-bold', i === screen.progress - 1 ? 'text-blue-700' : 'text-slate-400')}>{s}</div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden px-3 py-2.5">
          {screen.rows.map((r, i) => (
            <Row key={i} r={r} />
          ))}
        </div>
        {screen.footer && (
          <div className="border-t border-slate-200 bg-white p-2.5">
            <Row r={{ type: 'button', label: screen.footer, highlight: screen.footerHighlight }} />
          </div>
        )}
      </div>
      <div className="mx-auto mt-1.5 h-1 w-16 rounded-full bg-slate-600" />
    </div>
  );
}
