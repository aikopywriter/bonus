import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TOOLS, GROUPS } from '../data/tools';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-brand-950 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #12B76A 0%, transparent 65%)' }}
        />
        <div className="relative max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-brand-300">
            <Sparkles size={13} /> Your Billdaa bonus tools
          </div>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight sm:text-[36px]">
            Stop guessing. <span className="text-brand-400">Start knowing.</span>
          </h1>
          <p className="mt-3 text-[15.5px] leading-relaxed text-brand-100/75">
            Follow the tools in order: find a winning product, price it, check your profit, predict your ad results, then launch from your phone.
          </p>
          <Link
            to="/product-finder"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-[14.5px] font-bold text-brand-950 transition hover:bg-brand-300"
          >
            Start with step 1 <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section key={g} className="mt-9">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-mute">{g}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.filter((t) => t.group === g).map((t) => (
              <Link
                key={t.path}
                to={t.path}
                className="group relative flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-pop"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{ background: t.accent }}
                  >
                    <t.icon size={21} />
                  </div>
                  <span className="text-[12px] font-bold text-ink-mute">Step {t.step}</span>
                </div>
                <h3 className="mt-4 text-[16px] font-extrabold leading-snug tracking-tight text-ink">{t.name}</h3>
                <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{t.blurb}</p>
                <div className="mt-4 flex items-center gap-1 text-[13.5px] font-bold text-brand-700">
                  Open tool <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
