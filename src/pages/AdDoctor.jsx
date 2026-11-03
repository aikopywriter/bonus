import { useEffect, useRef, useState } from 'react';
import { Bot, Send, ImagePlus, X, RotateCcw, Loader2, BookOpen } from 'lucide-react';
import { PageHeader, Button, cx } from '../components/ui';
import { AD_ISSUES, matchIssues } from '../data/adIssues';
import { api } from '../lib/api';
import { mdToHtml } from '../lib/markdown';
import { useStored } from '../lib/storage';

function resizeToJpeg(file, max = 1280) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function guideAnswer(text) {
  const found = matchIssues(text, 1)[0];
  if (!found) return null;
  return `**${found.cause}**\n\nHere’s what to fix:\n\n${found.fixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}`;
}

const STARTERS = AD_ISSUES.slice(0, 8);

export default function AdDoctor() {
  const [messages, setMessages] = useStored('adDoctorChat', []);
  const [input, setInput] = useState('');
  const [image, setImage] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, busy]);

  async function send(textArg) {
    const text = (textArg ?? input).trim();
    if ((!text && !image) || busy) return;
    const userMsg = { role: 'user', content: text || 'Please look at this screenshot of my ad problem.', hasImage: !!image };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    const img = image;
    setImage('');
    setBusy(true);
    try {
      const payload = history.map((m, i) => ({
        role: m.role,
        content: m.content,
        ...(i === history.length - 1 && img ? { image: img } : {}),
      }));
      const res = await api('chat', { messages: payload });
      setMessages([...history, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      const fallback = guideAnswer(text);
      setMessages([
        ...history,
        fallback
          ? { role: 'assistant', content: fallback, source: 'guide', note: err.message }
          : { role: 'assistant', content: `Sorry — ${err.message}`, error: true },
      ]);
    } finally {
      setBusy(false);
      taRef.current?.focus();
    }
  }

  async function onImage(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try { setImage(await resizeToJpeg(f)); } catch { /* ignore */ }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col">
      <PageHeader
        icon={Bot}
        title="Facebook Ad Troubleshooting Bot"
        subtitle="If something looks off, just describe the problem or attach a screenshot. You’ll get exactly what to fix — no guessing, no YouTube rabbit holes."
      >
        {!empty && (
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => setMessages([])}>New chat</Button>
        )}
      </PageHeader>

      <div className="flex flex-1 flex-col rounded-3xl border border-line bg-white shadow-card">
        <div className="flex-1 px-4 py-5 sm:px-6">
          {empty ? (
            <div className="mx-auto max-w-2xl py-4">
              <div className="text-[13px] font-bold uppercase tracking-wider text-ink-mute">Common problems — tap one</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => send(s.title)}
                    className="rounded-xl bg-paper px-4 py-3 text-left text-[14px] font-semibold text-ink ring-1 ring-line transition hover:bg-brand-50 hover:ring-brand-200"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-[13.5px] leading-relaxed text-ink-mute">
                Or type your own — the more detail the better. Example: <i>“My ad has spent ₦8,000 in 2 days, I got 12 WhatsApp chats but only 1 order.”</i>
              </p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-700 px-4 py-3 text-[14.5px] leading-relaxed text-white">
                    {m.content}
                    {m.hasImage && <div className="mt-1 text-[12px] text-brand-100/80">📎 Screenshot attached</div>}
                  </div>
                ) : (
                  <div key={i} className="flex max-w-[92%] gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-950 text-brand-300">
                      <Bot size={17} />
                    </div>
                    <div className={cx('min-w-0 rounded-2xl rounded-tl-md px-4 py-3 text-[14.5px] leading-relaxed', m.error ? 'bg-red-50 text-red-800' : 'bg-paper text-ink-soft ring-1 ring-line/70')}>
                      {m.source === 'guide' && (
                        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-gold-700">
                          <BookOpen size={14} /> Answer from the Billdaa guide (AI is unavailable right now)
                        </div>
                      )}
                      {m.source === 'guide' && m.note && (
                        <div className="mb-2 rounded-lg bg-white px-2.5 py-1.5 text-[12px] text-ink-mute ring-1 ring-line">Reason: {m.note}</div>
                      )}
                      <div className="prose-bot" dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }} />
                    </div>
                  </div>
                )
              )}
              {busy && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-950 text-brand-300"><Bot size={17} /></div>
                  <div className="flex items-center gap-2 rounded-2xl bg-paper px-4 py-3 text-[14px] text-ink-mute ring-1 ring-line/70">
                    <Loader2 size={16} className="animate-spin" /> Checking your ad…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 rounded-b-3xl border-t border-line bg-white/95 p-3 backdrop-blur sm:p-4">
          {image && (
            <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-paper p-1.5 pr-2 ring-1 ring-line">
              <img src={image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <span className="text-[12.5px] font-semibold text-ink-soft">Screenshot</span>
              <button onClick={() => setImage('')} className="rounded-md p-1 text-ink-mute hover:bg-white" aria-label="Remove"><X size={15} /></button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-ink-mute ring-1 ring-line hover:bg-paper hover:text-ink" title="Attach screenshot">
              <ImagePlus size={19} />
              <input type="file" accept="image/*" className="hidden" onChange={onImage} />
            </label>
            <textarea
              ref={taRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) { e.preventDefault(); send(); }
              }}
              placeholder="Describe your ad problem…"
              className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            />
            <button
              onClick={() => send()}
              disabled={busy || (!input.trim() && !image)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition hover:bg-brand-800 disabled:opacity-40"
              aria-label="Send"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
