import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Link2, ListChecks, Loader2, Sparkles, ThumbsUp, AlertTriangle, Target, Megaphone, ArrowRight, Tags, History, Trash2 } from 'lucide-react';
import { PageHeader, Card, Field, TextInput, TextArea, MoneyInput, Button, Segmented, Verdict, Pill, cx } from '../components/ui';
import { api } from '../lib/api';
import { naira } from '../lib/format';
import { useStored } from '../lib/storage';

const QUESTIONS = [
  {
    key: 'Solves a real problem',
    q: 'Does it solve a real problem or strong desire?',
    options: [
      { label: 'Yes — a painful, everyday problem', score: 10 },
      { label: 'Somewhat — nice to have', score: 6 },
      { label: 'Not really — just cool or random', score: 2 },
    ],
  },
  {
    key: 'Wow factor for ads',
    q: 'Would it stop someone scrolling in a 15-second video?',
    options: [
      { label: 'Yes — it’s visual and surprising', score: 10 },
      { label: 'Maybe — needs good editing', score: 6 },
      { label: 'No — hard to show on video', score: 2 },
    ],
  },
  {
    key: 'Not easily found locally',
    q: 'Can people find it cheaply in local markets or supermarkets?',
    options: [
      { label: 'No — hard to find in Nigeria', score: 10 },
      { label: 'Some shops sell it', score: 6 },
      { label: 'Yes — it’s everywhere', score: 2 },
    ],
  },
  {
    key: 'Easy to ship & deliver',
    q: 'How easy is it to deliver?',
    options: [
      { label: 'Small, light and hard to break', score: 10 },
      { label: 'Medium size or a bit delicate', score: 6 },
      { label: 'Big, heavy, fragile or perishable', score: 2 },
    ],
  },
  {
    key: 'Nigerian market fit',
    q: 'Will Nigerians want it at your price?',
    options: [
      { label: 'Yes — clear demand here', score: 10 },
      { label: 'Probably — for some people', score: 6 },
      { label: 'Unsure — might be too pricey or niche', score: 3 },
    ],
  },
];

function localScore(answers, cost, price) {
  const markup = cost > 0 && price > 0 ? price / cost : 0;
  const marginScore = markup >= 4 ? 10 : markup >= 3 ? 8 : markup >= 2.5 ? 6 : markup >= 2 ? 4 : markup > 0 ? 1 : 5;
  const criteria = QUESTIONS.map((q, i) => ({ name: q.key, score: answers[i] ?? 0, note: q.options.find((o) => o.score === answers[i])?.label || '' }));
  criteria.splice(2, 0, {
    name: 'Profit margin potential',
    score: marginScore,
    note: markup ? `Selling at ${markup.toFixed(1)}× your cost.` : 'Add cost and selling price to judge margin.',
  });
  const weights = [1.3, 1.2, 1.3, 0.9, 0.8, 1.1];
  const total = criteria.reduce((a, c, i) => a + c.score * weights[i], 0) / weights.reduce((a, b) => a + b, 0);
  const score = Math.round(total * 10);
  const verdict = score >= 70 ? 'winner' : score >= 50 ? 'test' : 'avoid';
  const weak = criteria.filter((c) => c.score <= 4).map((c) => c.name);
  const strong = criteria.filter((c) => c.score >= 8).map((c) => c.name);
  return {
    productName: '',
    score,
    verdict,
    summary:
      verdict === 'winner'
        ? 'This product ticks most of the boxes of a winning product. Test it with a small budget.'
        : verdict === 'test'
        ? 'Some good signs, but there are weak spots. Fix them or test very carefully.'
        : 'Too many weak spots. You’re likely to lose money — look for a better product.',
    criteria,
    strengths: strong.length ? strong : ['No strong points yet'],
    risks: weak.length ? weak.map((w) => `Weak: ${w}`) : ['No major red flags from your answers'],
    suggestedPrice: cost > 0 ? { low: Math.round(cost * 2.8), high: Math.round(cost * 4) } : null,
    targetCustomers: '',
    adAngles: [],
    nextSteps: ['Order a sample and check the quality yourself', 'Shoot a 15-second demo video on your phone', 'Run a 3-day test at your safe daily budget'],
  };
}

const VERDICT = {
  winner: { tone: 'green', label: 'Winner', title: 'Looks like a winner', pill: 'brand' },
  test: { tone: 'amber', label: 'Test carefully', title: 'Test carefully', pill: 'gold' },
  avoid: { tone: 'red', label: 'Avoid', title: 'Waste of money — avoid', pill: 'red' },
};

function ScoreRing({ score, verdict }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const color = verdict === 'winner' ? '#12B76A' : verdict === 'test' ? '#F79009' : '#F04438';
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="#E3E8E4" strokeWidth="11" fill="none" />
        <circle cx="60" cy="60" r={r} stroke={color} strokeWidth="11" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[36px] font-extrabold leading-none tabular-nums">{score}</div>
        <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-ink-mute">out of 100</div>
      </div>
    </div>
  );
}

function Result({ result, source, onPrice }) {
  const v = VERDICT[result.verdict] || VERDICT.test;
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <ScoreRing score={result.score} verdict={result.verdict} />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <Pill tone={v.pill}>{v.label}</Pill>
            <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight">{result.productName || v.title}</h2>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{result.summary}</p>
            {source && (
              <p className="mt-2 text-[12.5px] text-ink-mute">
                {source.read ? `Read from ${source.site}` : `Couldn’t fully read ${source.site} — judged from the link and your details`}
                {source.price ? ` · listed at ${source.currency === 'NGN' || !source.currency ? '₦' : source.currency + ' '}${Number(source.price).toLocaleString()}` : ''}
                {source.sold ? ` · ${source.sold}` : ''}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card title="Score breakdown">
        <div className="grid gap-3.5">
          {result.criteria.map((c) => (
            <div key={c.name}>
              <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                <span className="font-bold text-ink">{c.name}</span>
                <span className="font-extrabold tabular-nums text-ink">{c.score}/10</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper ring-1 ring-line">
                <div
                  className={cx('h-full rounded-full', c.score >= 7 ? 'bg-brand-500' : c.score >= 5 ? 'bg-gold-400' : 'bg-red-400')}
                  style={{ width: `${c.score * 10}%` }}
                />
              </div>
              {c.note && <div className="mt-1 text-[12.5px] text-ink-mute">{c.note}</div>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card title={<span className="flex items-center gap-2"><ThumbsUp size={16} className="text-brand-600" /> Strengths</span>}>
          <ul className="grid gap-2 text-[14px] text-ink-soft">{result.strengths.map((s) => <li key={s} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{s}</li>)}</ul>
        </Card>
        <Card title={<span className="flex items-center gap-2"><AlertTriangle size={16} className="text-gold-500" /> Risks</span>}>
          <ul className="grid gap-2 text-[14px] text-ink-soft">{result.risks.map((s) => <li key={s} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{s}</li>)}</ul>
        </Card>
      </div>

      {(result.suggestedPrice || result.targetCustomers) && (
        <div className="grid gap-5 sm:grid-cols-2">
          {result.suggestedPrice && (
            <Card title="Suggested selling price">
              <div className="text-[24px] font-extrabold tabular-nums text-brand-700">
                {naira(result.suggestedPrice.low)} – {naira(result.suggestedPrice.high)}
              </div>
              <p className="mt-1 text-[13px] text-ink-mute">Confirm with the Pricing Calculator using your real costs.</p>
            </Card>
          )}
          {result.targetCustomers && (
            <Card title={<span className="flex items-center gap-2"><Target size={16} className="text-sky-600" /> Who will buy it</span>}>
              <p className="text-[14px] leading-relaxed text-ink-soft">{result.targetCustomers}</p>
            </Card>
          )}
        </div>
      )}

      {result.adAngles?.length > 0 && (
        <Card title={<span className="flex items-center gap-2"><Megaphone size={16} className="text-pink-600" /> Ad hooks to test</span>}>
          <ul className="grid gap-2">
            {result.adAngles.map((a) => <li key={a} className="rounded-xl bg-paper px-4 py-2.5 text-[14px] font-semibold text-ink ring-1 ring-line/70">{a}</li>)}
          </ul>
        </Card>
      )}

      <Card title="Next steps">
        <ol className="grid gap-2 text-[14px] text-ink-soft">
          {result.nextSteps.map((s, i) => (
            <li key={s} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[12px] font-extrabold text-brand-800">{i + 1}</span>{s}</li>
          ))}
        </ol>
        {result.verdict !== 'avoid' && (
          <Button className="mt-5 w-full sm:w-auto" icon={Tags} onClick={onPrice}>
            Price this product <ArrowRight size={16} />
          </Button>
        )}
      </Card>
      <p className="text-[12.5px] leading-relaxed text-ink-mute">
        This score is based on proven winning-product criteria, not a guarantee of sales. Always order a sample and run a small test before buying stock.
      </p>
    </div>
  );
}

export default function ProductFinder() {
  const [mode, setMode] = useState('link');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [notes, setNotes] = useState('');
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [data, setData] = useState(null);
  const [recent, setRecent] = useStored('productChecks', []);
  const [, setProduct] = useStored('product', {});
  const navigate = useNavigate();

  function remember(result, label, source = null) {
    setRecent((r) => [{ id: Date.now(), name: result.productName || label || 'Product', score: result.score, verdict: result.verdict, data: { result, source } }, ...r].slice(0, 12));
  }

  async function analyse() {
    setError(''); setInfo('');
    if (!url.trim() && !name.trim()) return setError('Paste a product link (or type the product name).');
    setBusy(true);
    setData(null);
    try {
      const res = await api('product', { url: url.trim(), productName: name.trim(), notes, cost }, { timeout: 60000 });
      if (res.needsDetails) {
        setInfo(`${res.reason} No problem — answer 5 quick questions instead.`);
        setMode('questions');
      } else {
        setData(res);
        remember(res.result, name, res.source);
        setTimeout(() => document.getElementById('pf-result')?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    } catch (err) {
      setError(`${err.message} You can also use “Answer questions” for an instant score.`);
    } finally {
      setBusy(false);
    }
  }

  function scoreQuestions() {
    setError('');
    if (QUESTIONS.some((_, i) => answers[i] == null)) return setError('Answer all 5 questions to get your score.');
    const result = localScore(answers, cost, price);
    result.productName = name.trim();
    setData({ result, source: null });
    remember(result, name);
    setTimeout(() => document.getElementById('pf-result')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function priceIt() {
    const r = data.result;
    setProduct((p) => ({
      ...p,
      name: r.productName || name || p.name,
      ...(cost ? { cost } : {}),
      ...(r.suggestedPrice ? { price: Math.round((r.suggestedPrice.low + r.suggestedPrice.high) / 2 / 100) * 100 } : {}),
    }));
    navigate('/pricing');
  }

  return (
    <div>
      <PageHeader
        icon={Search}
        title="Best-Selling Product Finder"
        subtitle="Paste a product link from AliExpress, Jumia, Amazon, Temu or any store. Find out if it’s a winner or a waste of money before you spend on stock or ads."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Segmented
            value={mode}
            onChange={(m) => { setMode(m); setError(''); }}
            options={[
              { value: 'link', label: <span className="inline-flex items-center gap-1.5"><Link2 size={15} /> Paste link</span> },
              { value: 'questions', label: <span className="inline-flex items-center gap-1.5"><ListChecks size={15} /> Answer questions</span> },
            ]}
          />

          {info && <Verdict tone="info" title="Couldn’t read that page">{info}</Verdict>}

          {mode === 'link' ? (
            <Card>
              <div className="grid gap-4">
                <Field label="Product link">
                  <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.aliexpress.com/item/…" inputMode="url" onKeyDown={(e) => e.key === 'Enter' && analyse()} />
                </Field>
                <Field label="Product name (optional)" hint="Helps if the website blocks automatic reading.">
                  <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rechargeable neck fan" />
                </Field>
                <Field label="Your landed cost (optional)" tip="Product price + shipping to Nigeria + clearing, per unit. Helps judge your profit margin.">
                  <MoneyInput value={cost} onChange={setCost} />
                </Field>
                <Field label="Anything else? (optional)">
                  <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Supplier in Lagos, I plan to sell pay-on-delivery in Abuja" className="min-h-[70px]" />
                </Field>
                <Button size="lg" icon={busy ? Loader2 : Sparkles} onClick={analyse} disabled={busy}>
                  {busy ? 'Analysing product…' : 'Check this product'}
                </Button>
                {busy && <p className="text-center text-[12.5px] text-ink-mute">Reading the page and scoring it — about 10–20 seconds.</p>}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="grid gap-5">
                <Field label="Product name (optional)">
                  <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rechargeable neck fan" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Landed cost"><MoneyInput value={cost} onChange={setCost} /></Field>
                  <Field label="Planned selling price"><MoneyInput value={price} onChange={setPrice} /></Field>
                </div>
                {QUESTIONS.map((q, i) => (
                  <div key={q.key}>
                    <div className="mb-2 text-[14px] font-bold text-ink">{i + 1}. {q.q}</div>
                    <div className="grid gap-1.5">
                      {q.options.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => setAnswers((a) => ({ ...a, [i]: o.score }))}
                          className={cx(
                            'rounded-xl px-3.5 py-2.5 text-left text-[13.5px] font-semibold ring-1 transition',
                            answers[i] === o.score ? 'bg-brand-50 text-brand-900 ring-brand-500' : 'bg-white text-ink-soft ring-line hover:bg-paper'
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button size="lg" icon={Sparkles} onClick={scoreQuestions}>Get my score</Button>
              </div>
            </Card>
          )}

          {error && <p className="text-[13.5px] font-medium text-red-600">{error}</p>}

          {recent.length > 0 && (
            <Card title={<span className="flex items-center gap-2"><History size={16} /> Recent checks</span>} padded={false}
              action={<button onClick={() => setRecent([])} className="text-ink-mute hover:text-red-600" aria-label="Clear"><Trash2 size={15} /></button>}>
              <ul className="divide-y divide-line">
                {recent.map((r) => (
                  <li key={r.id}>
                    <button onClick={() => setData(r.data)} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-paper">
                      <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{r.name}</span>
                      <Pill tone={VERDICT[r.verdict]?.pill}>{r.score}</Pill>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div id="pf-result" className="scroll-mt-20">
          {data ? (
            <Result result={data.result} source={data.source} onPrice={priceIt} />
          ) : (
            <div className="rounded-3xl border border-dashed border-line bg-white/60 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7A5AF8]/10 text-[#7A5AF8]"><Search size={26} /></div>
              <h3 className="mt-4 text-[17px] font-extrabold">What makes a winning product?</h3>
              <p className="mx-auto mt-1 max-w-md text-[14px] text-ink-soft">Every product is scored on the 6 things that separate winners from stock you can’t sell:</p>
              <div className="mx-auto mt-5 grid max-w-md gap-2 text-left sm:grid-cols-2">
                {['Solves a real problem', 'Wow factor for ads', 'Profit margin (3×+)', 'Not easily found locally', 'Easy to ship & deliver', 'Nigerian market fit'].map((c) => (
                  <div key={c} className="rounded-xl bg-white px-3.5 py-2.5 text-[13px] font-semibold ring-1 ring-line">{c}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
