export default function Logo({ dark = false, size = 'md' }) {
  const box = size === 'lg' ? 'h-11 w-11 rounded-[14px]' : 'h-9 w-9 rounded-xl';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex ${box} items-center justify-center bg-brand-950 ring-1 ring-white/10`}>
        <svg viewBox="0 0 64 64" className="h-[70%] w-[70%]">
          <path
            d="M20 16h14.5c6.4 0 10.5 3.3 10.5 8.6 0 3.4-1.8 5.9-4.7 7 3.7 1 6 3.9 6 7.8 0 5.8-4.4 8.6-11.4 8.6H20V16zm8 6.6v6.8h5.6c2.4 0 3.7-1.2 3.7-3.4s-1.3-3.4-3.7-3.4H28zm0 12.7v7.1h6.2c2.6 0 4-1.3 4-3.6s-1.4-3.5-4-3.5H28z"
            fill="#32D583"
          />
        </svg>
      </div>
      <div className="leading-none">
        <div className={`font-extrabold tracking-tight ${size === 'lg' ? 'text-[20px]' : 'text-[17px]'} ${dark ? 'text-white' : 'text-ink'}`}>
          Billdaa
        </div>
        <div className={`mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] ${dark ? 'text-brand-300' : 'text-brand-700'}`}>
          Seller Toolkit
        </div>
      </div>
    </div>
  );
}
