// Local test server: serves the built site (dist/) and runs the Netlify functions at /api/*.
// Usage: ACCESS_CODE=TEST GEMINI_API_KEY=... node scripts/dev-api.mjs
// Set MOCK_AI=1 to fake Gemini answers (for testing without a key).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8888);

if (process.env.MOCK_AI) {
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (String(url).includes('generativelanguage.googleapis.com')) {
      const body = JSON.parse(opts.body);
      const wantsJson = body.generationConfig?.responseMimeType === 'application/json';
      const text = wantsJson ? JSON.stringify((await import('./mock-ai.mjs')).productMock) : (await import('./mock-ai.mjs')).chatMock;
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status: 200 });
    }
    return realFetch(url, opts);
  };
}

const fnDir = path.join(root, 'netlify/functions');
const routes = {};
for (const f of fs.readdirSync(fnDir)) {
  if (!f.endsWith('.mjs')) continue;
  const mod = await import(pathToFileURL(path.join(fnDir, f)).href);
  if (mod.config?.path) routes[mod.config.path] = mod.default;
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const fn = routes[url.pathname];
    if (fn) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      try {
        const out = await fn(request);
        res.writeHead(out.status, Object.fromEntries(out.headers));
        res.end(Buffer.from(await out.arrayBuffer()));
      } catch (e) {
        console.error(e);
        res.writeHead(500).end(String(e));
      }
      return;
    }
    let file = path.join(root, 'dist', url.pathname);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'dist/index.html');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Billdaa toolkit test server on http://localhost:${PORT}`));
