import crypto from 'node:crypto';

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const env = (k) => (typeof Netlify !== 'undefined' && Netlify.env?.get?.(k)) || process.env[k] || '';

export function accessCodes() {
  return env('ACCESS_CODE')
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
}

function secret() {
  return env('TOKEN_SECRET') || `billdaa:${env('ACCESS_CODE')}`;
}

export function signToken(days = 30) {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const sig = crypto.createHmac('sha256', secret()).update(String(exp)).digest('base64url');
  return { token: `${exp}.${sig}`, exp };
}

export function verifyRequest(req) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const good = crypto.createHmac('sha256', secret()).update(String(exp)).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(good);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function readJson(req) {
  try { return await req.json(); } catch { return {}; }
}

// ---------- Gemini ----------
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

export async function gemini({ system, contents, json: wantJson = false, schema, temperature = 0.6, maxTokens = 2048 }) {
  const key = env('GEMINI_API_KEY');
  if (!key) {
    const e = new Error('The AI is not set up yet. Add GEMINI_API_KEY in your Netlify environment variables.');
    e.status = 503;
    throw e;
  }
  const preferred = env('GEMINI_MODEL');
  const models = [...new Set([preferred, ...FALLBACK_MODELS].filter(Boolean))];

  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      ...(wantJson ? { responseMimeType: 'application/json' } : {}),
      ...(schema ? { responseSchema: schema } : {}),
    },
  };

  let lastErr;
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error?.message || `Gemini error ${res.status}`;
        lastErr = Object.assign(new Error(msg), { status: res.status });
        // Model missing or busy → try the next one
        if ([404, 400, 429, 500, 503].includes(res.status)) continue;
        throw lastErr;
      }
      const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
      if (!text) {
        lastErr = new Error('The AI returned an empty answer.');
        continue;
      }
      return { text, model };
    } catch (e) {
      lastErr = e;
    }
  }
  if (lastErr?.status === 429) {
    const e = new Error('The AI is very busy right now (free plan limit reached). Please wait a minute and try again.');
    e.status = 429;
    throw e;
  }
  const e = new Error('The AI could not answer right now. Please try again in a moment.');
  e.status = 502;
  e.detail = lastErr?.message;
  throw e;
}

export function parseJsonLoose(text) {
  try { return JSON.parse(text); } catch { /* try to extract */ }
  const m = text.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* ignore */ } }
  return null;
}
