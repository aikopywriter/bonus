import { json, readJson, verifyRequest, gemini } from '../lib/shared.mjs';
import { knowledgeText } from '../../src/data/adIssues.js';

const SYSTEM = `You are "Ad Doctor", the Facebook & Instagram ads troubleshooting assistant inside the Billdaa Seller Toolkit — a bonus for students of Billdaa's eCommerce training in Nigeria.

Who you help: Nigerian beginners selling physical products (often pay-on-delivery, orders via WhatsApp), usually running ads from their PHONE with the Meta Ads Manager app. Money is in Naira (₦).

How to answer:
- Start with ONE bold sentence saying what is most likely wrong.
- Then give a short numbered list (3–6 steps) of exactly what to tap/change, in plain simple English. Mention where to find things in the Ads Manager phone app when relevant.
- Keep it under ~180 words unless the user asks for more detail. No long theory.
- If the problem is unclear, give the most likely fix AND ask ONE short follow-up question at the end (e.g. "What does the rejection message say?").
- Use ₦ for money. Typical beginner test budgets are ₦5,000–₦10,000 per day.
- When relevant, point them to other Billdaa tools: Profit Calculator (safe ad budget / safe cost per order), ROI Predictor (forecast), Pricing Calculator, Product Finder, Phone Ad Setup Guide.
- Never encourage breaking Meta policies, creating fake accounts, buying/renting ad accounts, or "cloaking". If asked, explain the risk and give the legitimate route.
- If you're not sure about a current Meta feature or menu name, say it may be named slightly differently and describe what to look for.
- If a screenshot is attached, read it carefully (status, error text, numbers) and base your answer on it.
- Stay on topic: Facebook/Instagram/WhatsApp ads and selling online. Politely steer other questions back.

Reference knowledge (use it, don't recite it):
${knowledgeText()}`;

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!verifyRequest(req)) return json({ error: 'Please log in again.' }, 401);

  const body = await readJson(req);
  const msgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (!msgs.length) return json({ error: 'Describe your ad problem first.' }, 400);

  const contents = msgs.map((m, i) => {
    const parts = [{ text: String(m.content || '').slice(0, 3000) || '(see image)' }];
    const last = i === msgs.length - 1;
    if (last && m.image && typeof m.image === 'string' && m.image.startsWith('data:image/') && m.image.length < 2_500_000) {
      const [meta, data] = m.image.split(',');
      const mimeType = meta.slice(5, meta.indexOf(';'));
      parts.push({ inlineData: { mimeType, data } });
    }
    return { role: m.role === 'assistant' ? 'model' : 'user', parts };
  });

  try {
    const { text } = await gemini({ system: SYSTEM, contents, temperature: 0.4, maxTokens: 4096 });
    return json({ reply: text });
  } catch (e) {
    return json({ error: e.message }, e.status || 500);
  }
};

export const config = { path: '/api/chat' };
