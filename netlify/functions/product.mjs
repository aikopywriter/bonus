import { json, readJson, verifyRequest, gemini, parseJsonLoose } from '../lib/shared.mjs';

// ---------- Read the product page ----------
function blockedHost(host) {
  const h = host.toLowerCase();
  return (
    h === 'localhost' ||
    h.endsWith('.local') ||
    h.endsWith('.internal') ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    h.includes(':')
  );
}

const decode = (s) =>
  String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();

function meta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${name}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  if (!tag) return '';
  return decode(tag.match(/content=["']([^"']*)["']/i)?.[1]);
}

function jsonLdProduct(html) {
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  for (const b of blocks) {
    try {
      const data = JSON.parse(b.trim());
      const list = Array.isArray(data) ? data : data['@graph'] || [data];
      for (const item of list) {
        const t = item['@type'];
        if (t === 'Product' || (Array.isArray(t) && t.includes('Product'))) {
          const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers || {};
          return {
            name: item.name,
            description: item.description,
            brand: typeof item.brand === 'string' ? item.brand : item.brand?.name,
            price: offers.price || offers.lowPrice,
            currency: offers.priceCurrency,
            rating: item.aggregateRating?.ratingValue,
            reviews: item.aggregateRating?.reviewCount || item.aggregateRating?.ratingCount,
          };
        }
      }
    } catch { /* ignore bad JSON */ }
  }
  return null;
}

async function readPage(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-NG,en;q=0.9',
      },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const html = (await res.text()).slice(0, 1_500_000);
    const ld = jsonLdProduct(html) || {};
    const title = ld.name || meta(html, 'og:title') || decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
    const description = ld.description || meta(html, 'og:description') || meta(html, 'description');
    const price = ld.price || meta(html, 'product:price:amount') || meta(html, 'og:price:amount') || meta(html, 'price');
    const currency = ld.currency || meta(html, 'product:price:currency') || meta(html, 'og:price:currency') || meta(html, 'priceCurrency');
    const sold = html.match(/([\d.,]+\s?[kK]?\+?)\s*(?:sold|orders|bought in past month)/i)?.[0];
    const text = decode(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
    ).slice(0, 2500);
    const image = meta(html, 'og:image');
    const usable = Boolean(title && title.length > 3 && !/access denied|robot|captcha|just a moment|verify you are human/i.test(title));
    return { ok: usable, title, description: description?.slice(0, 600), price, currency, rating: ld.rating, reviews: ld.reviews, sold, brand: ld.brand, image, text };
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? 'timeout' : 'fetch_failed' };
  } finally {
    clearTimeout(t);
  }
}

// ---------- Ask Gemini to score it ----------
const SCHEMA = {
  type: 'OBJECT',
  properties: {
    productName: { type: 'STRING' },
    score: { type: 'INTEGER', description: '0-100 overall winning-product score' },
    verdict: { type: 'STRING', enum: ['winner', 'test', 'avoid'] },
    summary: { type: 'STRING' },
    criteria: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { name: { type: 'STRING' }, score: { type: 'INTEGER' }, note: { type: 'STRING' } },
        required: ['name', 'score', 'note'],
      },
    },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    risks: { type: 'ARRAY', items: { type: 'STRING' } },
    suggestedPrice: { type: 'OBJECT', properties: { low: { type: 'INTEGER' }, high: { type: 'INTEGER' } }, required: ['low', 'high'] },
    targetCustomers: { type: 'STRING' },
    adAngles: { type: 'ARRAY', items: { type: 'STRING' } },
    nextSteps: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['productName', 'score', 'verdict', 'summary', 'criteria', 'strengths', 'risks', 'suggestedPrice', 'targetCustomers', 'adAngles', 'nextSteps'],
};

const SYSTEM = `You are a sharp eCommerce product analyst for the Billdaa Seller Toolkit. You judge whether a product is likely to be a WINNING product for a beginner Nigerian online seller who will run Facebook/Instagram video ads, often selling pay-on-delivery via WhatsApp, with prices in Naira (₦).

Score the product on exactly these 6 criteria, each 0–10:
1. "Solves a real problem" — clear pain or strong desire it fixes.
2. "Wow factor for ads" — easy to demo in a short phone video; scroll-stopping.
3. "Profit margin potential" — can sell at 3× landed cost or more.
4. "Not easily found locally" — not sold cheaply in every Nigerian market/supermarket.
5. "Easy to ship & deliver" — small, light, not fragile, no regulatory issues.
6. "Nigerian market fit" — demand, climate, culture, power supply, purchasing power at the likely price.

Overall score (0–100) = weighted judgement of the criteria (not just a sum). Verdict: "winner" if ≥70, "test" if 50–69, "avoid" if <50. Also mark "avoid" for products Meta restricts (weapons, drugs, adult, risky health claims, counterfeit brands).

Be honest and specific — beginners lose money on bad products. Keep each note to one short sentence. suggestedPrice is a Naira selling-price range for Nigeria (integers, no symbols). Give 3 ad angles (hooks) written for Nigerian buyers and 3 practical next steps. If the information is thin, say so in the summary and be more conservative.`;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!verifyRequest(req)) return json({ error: 'Please log in again.' }, 401);

  const body = await readJson(req);
  const rawUrl = String(body.url || '').trim();
  const name = String(body.productName || '').trim().slice(0, 200);
  const notes = String(body.notes || '').trim().slice(0, 800);
  const cost = Number(body.cost) || 0;

  let page = null;
  if (rawUrl) {
    let u;
    try { u = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`); } catch { return json({ error: 'That link doesn’t look right. Copy the full product link and try again.' }, 400); }
    if (!['http:', 'https:'].includes(u.protocol) || blockedHost(u.hostname)) return json({ error: 'That link can’t be checked.' }, 400);
    page = await readPage(u.href);
    page.url = u.href;
    page.site = u.hostname.replace(/^www\./, '');
    page.slug = decodeURIComponent(u.pathname).replace(/[-_/]+/g, ' ').replace(/\b\d{6,}\b/g, '').trim().slice(0, 200);
  }

  // Nothing usable to analyse → ask the user for details
  if (!name && (!page || (!page.ok && (!page.slug || page.slug.length < 8)))) {
    return json({ needsDetails: true, site: page?.site, reason: page?.status ? `The site returned an error (${page.status}).` : 'The site blocked automatic reading.' });
  }

  const facts = [
    name && `Product name (from user): ${name}`,
    page?.site && `Website: ${page.site}`,
    page?.ok && page.title && `Page title: ${page.title}`,
    page?.ok && page.brand && `Brand: ${page.brand}`,
    page?.ok && page.price && `Listed price: ${page.price} ${page.currency || ''}`,
    page?.ok && page.rating && `Rating: ${page.rating}${page.reviews ? ` from ${page.reviews} reviews` : ''}`,
    page?.ok && page.sold && `Sales signal on page: ${page.sold}`,
    page?.ok && page.description && `Description: ${page.description}`,
    page && !page.ok && page.slug && `Page could not be read; product words from the link: ${page.slug}`,
    cost && `Seller's landed cost: ₦${cost}`,
    notes && `Seller notes: ${notes}`,
    page?.ok && page.text && `Page text excerpt: ${page.text.slice(0, 1500)}`,
  ].filter(Boolean).join('\n');

  try {
    const { text } = await gemini({
      system: SYSTEM,
      contents: [{ role: 'user', parts: [{ text: `Analyse this product:\n${facts}` }] }],
      json: true,
      schema: SCHEMA,
      temperature: 0.3,
      maxTokens: 8192,
    });
    const result = parseJsonLoose(text);
    if (!result || typeof result.score !== 'number') return json({ error: 'The AI gave an unclear answer. Please try again.' }, 502);
    result.score = Math.max(0, Math.min(100, Math.round(result.score)));
    return json({
      result,
      source: page ? { site: page.site, read: page.ok, title: page.ok ? page.title : null, price: page.ok ? page.price : null, currency: page.currency, image: page.ok ? page.image : null, sold: page.sold || null, rating: page.rating || null } : null,
    });
  } catch (e) {
    return json({ error: e.message }, e.status || 500);
  }
};

export const config = { path: '/api/product' };
