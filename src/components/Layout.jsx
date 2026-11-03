import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutGrid } from 'lucide-react';
import Logo from './Logo';
import { TOOLS, GROUPS } from '../data/tools';
import { logout } from '../lib/api';
import { cx } from './ui';

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-6">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          cx(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition',
            isActive ? 'bg-white/10 text-white' : 'text-brand-100/70 hover:bg-white/5 hover:text-white'
          )
        }
      >
        <LayoutGrid size={18} /> Dashboard
      </NavLink>
      {GROUPS.map((g) => (
        <div key={g}>
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-300/60">{g}</div>
          <div className="flex flex-col gap-0.5">
            {TOOLS.filter((t) => t.group === g).map((t) => (
              <NavLink
                key={t.path}
                to={t.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition',
                    isActive ? 'bg-white/10 text-white' : 'text-brand-100/70 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <t.icon size={18} />
                {t.short}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <div className="min-h-screen lg:pl-[264px]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col bg-brand-950 px-4 py-6 lg:flex">
        <Link to="/" className="px-2">
          <Logo dark />
        </Link>
        <div className="mt-8 flex-1 overflow-y-auto scrollbar-none">
          <NavItems />
        </div>
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-brand-100/60 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} /> Log out
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-brand-950 px-4 py-3 lg:hidden">
        <Link to="/">
          <Logo dark />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[84%] max-w-[320px] flex-col bg-brand-950 px-4 py-5 shadow-pop">
            <div className="mb-6 flex items-center justify-between px-2">
              <Logo dark />
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavItems onNavigate={() => setOpen(false)} />
            </div>
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-brand-100/60"
            >
              <LogOut size={17} /> Log out
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-10">{children}</main>
    </div>
  );
}
