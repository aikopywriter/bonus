import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle2, Circle, ChevronLeft, ChevronRight, Clock, Lightbulb, ArrowLeft, PlayCircle } from 'lucide-react';
import { PageHeader, Card, Button, cx } from '../components/ui';
import PhoneMock from '../components/PhoneMock';
import { MODULES, LESSONS } from '../data/phoneGuide';
import { useStored } from '../lib/storage';

function Overview({ done }) {
  const total = LESSONS.length;
  const count = LESSONS.filter((l) => done[l.id]).length;
  const next = LESSONS.find((l) => !done[l.id]) || LESSONS[0];
  return (
    <div>
      <PageHeader
        icon={Smartphone}
        title="Phone Ad Setup Guide"
        subtitle="You don’t need a laptop. Follow these short lessons to run targeted, profitable Facebook & Instagram ads straight from your smartphone — even as a complete beginner."
      />

      <div className="mb-6 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-[15px] font-bold">Your progress</div>
            <div className="text-[13px] font-semibold text-ink-mute">{count} of {total} lessons</div>
          </div>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-paper ring-1 ring-line">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(count / total) * 100}%` }} />
          </div>
        </div>
        <Link to={`/phone-ads/${next.id}`}>
          <Button icon={PlayCircle} className="w-full sm:w-auto">{count === 0 ? 'Start lesson 1' : count === total ? 'Review lessons' : 'Continue'}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {MODULES.map((m, mi) => (
          <Card key={m.id} title={`${mi + 1}. ${m.title}`} subtitle={`${m.lessons.length} lesson${m.lessons.length > 1 ? 's' : ''}`} padded={false}>
            <ul className="divide-y divide-line">
              {m.lessons.map((l) => (
                <li key={l.id}>
                  <Link to={`/phone-ads/${l.id}`} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-paper">
                    {done[l.id] ? <CheckCircle2 size={20} className="shrink-0 text-brand-600" /> : <Circle size={20} className="shrink-0 text-line" />}
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-ink">{l.title}</div>
                      <div className="truncate text-[12.5px] text-ink-mute">{l.summary}</div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-ink-mute"><Clock size={13} /> {l.minutes}m</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-[12.5px] leading-relaxed text-ink-mute">
        The phone screens in this guide are simplified illustrations to show you where to tap. Meta updates its apps often, so button names or positions may look slightly different on your phone — look for the same words.
      </p>
    </div>
  );
}

function Lesson({ lesson, done, setDone, checks, setChecks }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[idx + 1];
  const prev = LESSONS[idx - 1];
  const total = lesson.steps.length;
  const onFinal = step === total; // checklist screen
  const s = lesson.steps[Math.min(step, total - 1)];
  const ticked = checks[lesson.id] || [];

  const topRef = useRef(null);
  const first = useRef(true);
  useEffect(() => { setStep(0); }, [lesson.id]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const y = (topRef.current?.getBoundingClientRect().top || 0) + window.scrollY - 80;
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: 'smooth' });
  }, [step]);

  function toggle(i) {
    setChecks((c) => {
      const cur = new Set(c[lesson.id] || []);
      cur.has(i) ? cur.delete(i) : cur.add(i);
      return { ...c, [lesson.id]: [...cur] };
    });
  }

  function complete() {
    setDone((d) => ({ ...d, [lesson.id]: true }));
    navigate(next ? `/phone-ads/${next.id}` : '/phone-ads');
  }

  return (
    <div>
      <Link to="/phone-ads" className="mb-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-mute hover:text-ink">
        <ArrowLeft size={16} /> All lessons
      </Link>
      <div className="mb-1 text-[12px] font-bold uppercase tracking-wider text-brand-700">
        {lesson.moduleTitle} · Lesson {idx + 1} of {LESSONS.length}
      </div>
      <h1 className="text-[24px] font-extrabold tracking-tight sm:text-[28px]">{lesson.title}</h1>
      <p className="mt-1 max-w-2xl text-[15px] text-ink-soft">{lesson.summary}</p>

      {/* Step dots */}
      <div ref={topRef} className="mt-5 flex gap-1.5">
        {[...lesson.steps, { title: 'Checklist' }].map((st, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={cx('h-1.5 flex-1 rounded-full transition', i <= step ? 'bg-brand-500' : 'bg-line')}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
        {!onFinal ? (
          <div className="grid items-center gap-8 md:grid-cols-[1fr_260px]">
            <div className="order-2 md:order-1">
              <div className="text-[13px] font-bold text-ink-mute">Step {step + 1} of {total}</div>
              <h2 className="mt-1 text-[21px] font-extrabold tracking-tight">{s.title}</h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{s.text}</p>
              {step === total - 1 && lesson.tip && (
                <div className="mt-5 flex gap-3 rounded-2xl bg-gold-100/60 p-4 text-[14px] leading-relaxed text-gold-700">
                  <Lightbulb size={18} className="mt-0.5 shrink-0" />
                  <span><b>Tip:</b> {lesson.tip}</span>
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <PhoneMock screen={s.screen} />
              <div className="mt-3 text-center text-[11.5px] font-semibold text-ink-mute">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-pink-500 align-middle" /> Tap here
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-lg">
            <div className="text-[13px] font-bold text-ink-mute">Before you move on</div>
            <h2 className="mt-1 text-[21px] font-extrabold tracking-tight">Lesson checklist</h2>
            <ul className="mt-4 grid gap-2.5">
              {lesson.checklist.map((c, i) => {
                const on = ticked.includes(i);
                return (
                  <li key={c}>
                    <button
                      onClick={() => toggle(i)}
                      className={cx('flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-[14.5px] font-semibold ring-1 transition', on ? 'bg-brand-50 text-brand-900 ring-brand-200' : 'bg-white text-ink ring-line hover:bg-paper')}
                    >
                      {on ? <CheckCircle2 size={20} className="shrink-0 text-brand-600" /> : <Circle size={20} className="shrink-0 text-line" />}
                      {c}
                    </button>
                  </li>
                );
              })}
            </ul>
            <Button size="lg" className="mt-6 w-full" onClick={complete} icon={CheckCircle2}>
              {next ? 'Mark complete & next lesson' : 'Finish the guide'}
            </Button>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <Button
            variant="ghost"
            icon={ChevronLeft}
            onClick={() => (step > 0 ? setStep(step - 1) : prev && navigate(`/phone-ads/${prev.id}`))}
            disabled={step === 0 && !prev}
          >
            Back
          </Button>
          {!onFinal && (
            <Button onClick={() => setStep(step + 1)}>
              Next <ChevronRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PhoneGuide() {
  const { lessonId } = useParams();
  const [done, setDone] = useStored('guideProgress', {});
  const [checks, setChecks] = useStored('guideChecks', {});
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return <Overview done={done} />;
  return <Lesson lesson={lesson} done={done} setDone={setDone} checks={checks} setChecks={setChecks} />;
}
