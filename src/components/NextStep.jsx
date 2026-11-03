import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NextStep({ to, title, children, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl bg-brand-950 px-5 py-4 text-white transition hover:bg-brand-900"
    >
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300">
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-[11.5px] font-bold uppercase tracking-wider text-brand-300">Next step</div>
        <div className="text-[15px] font-bold">{title}</div>
        {children && <div className="text-[13px] text-brand-100/70">{children}</div>}
      </div>
      <ArrowRight size={20} className="shrink-0 transition group-hover:translate-x-1" />
    </Link>
  );
}
