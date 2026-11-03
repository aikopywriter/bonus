import { json, readJson, accessCodes, signToken, verifyRequest } from '../lib/shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const body = await readJson(req);

  // Check an existing session
  if (body.check) return json({ ok: verifyRequest(req) });

  const codes = accessCodes();
  if (!codes.length) {
    return json({ error: 'Access code is not set up yet. Add ACCESS_CODE in your Netlify environment variables.' }, 500);
  }
  const code = String(body.code || '').trim().toLowerCase();
  if (!code || !codes.includes(code)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return json({ error: 'That access code is not correct. Check your Billdaa training dashboard and try again.' }, 401);
  }
  return json({ ok: true, ...signToken(30) });
};

export const config = { path: '/api/auth' };
