import { useState } from 'react';
import { Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { api, setAuth } from '../lib/api';
import { TOOLS } from '../data/tools';

export default function Login({ onSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!code.trim()) return setError('Enter the access code from your Billdaa training.');
    setBusy(true);
    setError('');
    try {
      const res = await api('auth', { code: code.trim() });
      setAuth({ token: res.token, exp: res.exp });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-950 lg:flex-row">
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden px-6 pb-10 pt-8 sm:px-10 lg:px-16 lg:py-14">
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #12B76A 0%, transparent 65%)' }}
        />
        <Logo dark size="lg" />
        <div className="relative mt-12 max-w-xl lg:mt-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-brand-300">
            <ShieldCheck size={14} /> Billdaa students only
          </div>
          <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[46px]">
            Know your numbers.
            <br />
            <span className="text-brand-400">Sell with confidence.</span>
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-brand-100/70">
            Seven tools that help you find winning products, price them right, predict your ad results and look professional to customers.
          </p>
          <div className="mt-8 hidden flex-wrap gap-2 sm:flex">
            {TOOLS.map((t) => (
              <span key={t.path} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[12.5px] font-semibold text-brand-50/80 ring-1 ring-white/10">
                <t.icon size={14} /> {t.short}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden text-[12.5px] text-brand-100/40 lg:block">© {new Date().getFullYear()} Billdaa eCommerce Training</div>
      </div>

      <div className="flex items-start justify-center bg-paper px-5 py-10 lg:w-[480px] lg:items-center lg:rounded-l-[32px]">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
            <Lock size={22} />
          </div>
          <h2 className="text-[24px] font-extrabold tracking-tight">Enter your access code</h2>
          <p className="mt-1.5 text-[14.5px] text-ink-soft">You’ll find it in your Billdaa training. You only need to do this once on each device.</p>

          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. BILLDAA-XXXX"
            autoCapitalize="characters"
            autoComplete="off"
            className="mt-6 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-[16px] font-bold tracking-wider outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          {error && <p className="mt-2.5 text-[13.5px] font-medium text-red-600">{error}</p>}

          <button
            disabled={busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <>Open my toolkit <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
