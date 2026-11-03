# Billdaa Seller Toolkit

Seven bonus tools for Billdaa eCommerce students, in one dashboard. All money is in Naira (₦).

| Tool | What it does | Needs AI? |
|---|---|---|
| Best-Selling Product Finder | Paste a product link → winning-product score out of 100 (or answer 5 questions for an instant score) | Yes (link mode) |
| Product Pricing Calculator | Cost price → Competitive / Recommended / Premium selling prices | No |
| Profit Calculator | Real profit per sale + safe ad budget | No |
| ROI Predictor | Forecast sales, revenue, profit & ROI (worst / likely / best) | No |
| Phone Ad Setup Guide | 15 step-by-step lessons with illustrated phone screens & progress tracking | No |
| Facebook Ad Troubleshooting Bot | Describe a problem or attach a screenshot → exact fix | Yes (falls back to a built-in guide) |
| Online Receipt-Maker | Branded e-receipts → image, PDF or WhatsApp | No |

Pricing, Profit and ROI share the same product numbers, so students type them once.
Students' saved data (business profile, receipts, guide progress) stays in their own browser.

---

## Deploy to Netlify (one time, ~10 minutes)

### 1. The code on GitHub
The code lives in the `aikopywriter/bonus` repository. Any change pushed to `main` redeploys the site automatically once Netlify is connected.

### 2. Connect it to Netlify
1. Log in to Netlify → **Add new site → Import an existing project → GitHub**.
2. Pick the `bonus` repository.
3. Build settings are read from `netlify.toml` automatically. Click **Deploy**.

### 3. Add your secret settings
Netlify → your site → **Site configuration → Environment variables → Add a variable**:

| Key | Value | Required |
|---|---|---|
| `ACCESS_CODE` | The code students type to get in, e.g. `BILLDAA2026`. Add several separated by commas to give each cohort its own code: `BILLDAA-JAN,BILLDAA-FEB`. Not case-sensitive. | ✅ |
| `GEMINI_API_KEY` | Your free Gemini API key (see below) | ✅ for the Bot & Product Finder |
| `TOKEN_SECRET` | Any long random text. If you set it, changing `ACCESS_CODE` won't log out existing students. Leave it unset if you *want* a code change to log everyone out. | Optional |
| `GEMINI_MODEL` | Force a specific model, e.g. `gemini-2.5-flash`. By default the app tries `gemini-flash-latest`, then `gemini-2.5-flash`, then `gemini-2.5-flash-lite`. | Optional |

Then **Deploys → Trigger deploy → Deploy site** so the new settings take effect.

### Get a free Gemini API key
1. Go to **Google AI Studio** (aistudio.google.com) and sign in with a Google account.
2. Click **Get API key → Create API key**.
3. Copy it into `GEMINI_API_KEY` on Netlify.

Free-plan notes: the free tier has per-minute and per-day request limits. If many students use the AI at once, some will see "The AI is very busy, try again in a minute". If you need more capacity, enable billing on the Google Cloud project (you'll only pay for usage beyond the free limits). Google may use free-tier prompts to improve its products — so students shouldn't paste private customer data into the Bot.

### Custom domain (optional)
Netlify → **Domain management → Add a domain**, e.g. `tools.billdaa.com`.

---

## Changing the access code
Edit `ACCESS_CODE` in Netlify and redeploy. Students who already logged in stay logged in for 30 days. To log everyone out, also change `TOKEN_SECRET`.

## Editing content
- Phone Ad Setup Guide lessons: `src/data/phoneGuide.js`
- Troubleshooting knowledge (also used by the AI): `src/data/adIssues.js`
- Tool names & descriptions on the dashboard: `src/data/tools.js`
- Default numbers (CPM, CTR, delivery success rate, Paystack fees): `src/lib/calc.js`

## Run it on your computer (optional, for developers)
```bash
npm install
npm run build
ACCESS_CODE=TEST GEMINI_API_KEY=your-key npm run serve   # http://localhost:8888
# or without a key, with fake AI answers:
ACCESS_CODE=TEST MOCK_AI=1 npm run serve
```
