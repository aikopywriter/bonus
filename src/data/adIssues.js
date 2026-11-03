// Knowledge base for the Facebook Ad Troubleshooting Bot.
// Used (1) as quick-pick problems, (2) as an offline fallback, and (3) as context for the AI.

export const AD_ISSUES = [
  {
    id: 'card-declined',
    title: 'My card was declined',
    keywords: ['card', 'declined', 'payment failed', 'billing', 'payment method', 'couldn’t charge', 'could not charge', 'unsettled', 'balance', 'payment issue', 'naira card', 'dollar'],
    cause: 'Most Nigerian card declines come from bank limits on online or international payments, low balance, or a mismatch in billing details.',
    fixes: [
      'In your bank app, turn ON online payments and international transactions for the card (or call your bank).',
      'Make sure you have enough balance — Facebook may place a small temporary test charge.',
      'Check the billing country and name match your card.',
      'Try a different card: a virtual dollar card from a reputable fintech often works when naira cards fail.',
      'If you have an unpaid (“outstanding”) balance, go to Billing & payments → Pay now before ads can run again.',
      'Don’t add and remove many cards quickly — that can trigger a payment restriction.',
    ],
  },
  {
    id: 'ad-rejected',
    title: 'My ad was rejected',
    keywords: ['rejected', 'disapproved', 'not approved', 'policy', 'violat', 'review', 'community standards', 'advertising standards'],
    cause: 'The ad text, image/video or landing page broke an advertising rule — often exaggerated claims, before/after images, personal attributes or prohibited products.',
    fixes: [
      'Open the ad in Ads Manager and read the exact reason Facebook gives.',
      'Remove claims like “guaranteed”, “100% cure”, “lose 10kg in a week”, or before/after photos.',
      'Don’t call out personal attributes (“Are you fat?”, “Are you broke?”). Say “For anyone who wants…” instead.',
      'Remove too-good-to-be-true pricing claims and fake countdown timers.',
      'Check the product isn’t restricted (weapons, drugs, adult items, some supplements, crypto “get-rich” offers).',
      'Edit the ad to fix the issue, or tap “Request review” if you believe it was a mistake.',
    ],
  },
  {
    id: 'in-review',
    title: 'My ad has been “In review” too long',
    keywords: ['in review', 'pending', 'stuck', 'under review', 'processing', 'waiting approval'],
    cause: 'Most ads are reviewed within 24 hours. Edits during review, new accounts and sensitive products can make it slower.',
    fixes: [
      'Wait up to 24 hours — don’t keep editing, every edit restarts the review.',
      'If it’s longer than 24–48 hours, duplicate the ad (or ad set) and publish the copy; then turn off the stuck one.',
      'Make sure your payment method is valid — ads sometimes wait on billing.',
      'Check your Facebook Page and ad account aren’t restricted (Account Quality in Business Suite).',
    ],
  },
  {
    id: 'no-delivery',
    title: 'My ad is active but not spending / no impressions',
    keywords: ['not spending', 'no impressions', 'not delivering', '0 reach', 'zero reach', 'no reach', 'not running', 'not showing', 'active but', '₦0 spent', 'no results at all'],
    cause: 'The ad can’t win auctions — usually the budget is too low, the audience too small, or a bid/cost cap is too low.',
    fixes: [
      'Confirm the campaign, ad set AND ad are all switched on (Active).',
      'Raise the daily budget to at least ₦3,000–₦5,000.',
      'Widen the audience: add more states/cities, widen the age range, turn on Advantage+ audience.',
      'If you set a bid cap or cost cap, remove it (use “Highest volume”).',
      'Check the schedule — the start date may be in the future.',
      'Give it 24 hours after any change.',
    ],
  },
  {
    id: 'high-cost',
    title: 'My cost per result is too high',
    keywords: ['expensive', 'high cost', 'cost per result', 'cpa', 'too costly', 'cost per message', 'cost per purchase', 'cpm high', 'high cpm', 'costly'],
    cause: 'Usually the creative isn’t grabbing attention (low CTR), the audience is too narrow, or the offer isn’t strong enough.',
    fixes: [
      'Check CTR (link click-through rate). Under 1% means the video/image isn’t stopping people — change the first 3 seconds.',
      'Test 2–3 new hooks/videos in the same ad set and keep the cheapest.',
      'Widen your targeting — very narrow interests make CPM expensive.',
      'Make sure the price and offer are in the ad so only interested people click.',
      'Give it 3 days before judging; costs are often higher in the first 1–2 days.',
      'Compare with your safe cost per order in the Profit Calculator — it might actually be fine.',
    ],
  },
  {
    id: 'clicks-no-sales',
    title: 'I get clicks/messages but no sales',
    keywords: ['no sales', 'no orders', 'clicks but', 'messages but', 'not buying', 'people ask price', 'nobody buys', 'chats but', 'no purchase', 'not converting'],
    cause: 'The ad is working but the sales process isn’t: offer, price, trust or reply speed.',
    fixes: [
      'Reply within 5 minutes — set WhatsApp Business quick replies and an away message.',
      'Show the price clearly in the ad so “how much?” chats don’t waste your budget.',
      'Build trust: share delivery videos, customer reviews, and offer pay-on-delivery if possible.',
      'Make ordering easy: ask for name, phone, address in one message.',
      'Check your price against competitors with the Pricing Calculator.',
      'If it’s a website: check it loads fast on phone and checkout works.',
    ],
  },
  {
    id: 'learning-limited',
    title: 'Ad set says “Learning limited”',
    keywords: ['learning limited', 'learning phase', 'learning', 'stuck in learning'],
    cause: 'Facebook isn’t getting enough results (about 50 a week) to optimise. Common with small budgets — it isn’t always a problem.',
    fixes: [
      'If you’re still profitable, ignore it — many small accounts run “learning limited” profitably.',
      'Combine similar ad sets into one so results aren’t split.',
      'Widen the audience and use Advantage+ placements.',
      'Optimise for an event that happens more often (e.g. messages or add-to-cart instead of purchases) while you start.',
      'Avoid frequent edits — each big edit restarts learning.',
    ],
  },
  {
    id: 'account-restricted',
    title: 'My ad account is restricted / disabled',
    keywords: ['restricted', 'disabled', 'banned', 'suspended', 'account quality', 'can’t advertise', 'cannot advertise', 'restriction', 'locked'],
    cause: 'Facebook detected suspicious activity, repeated policy violations, or payment problems.',
    fixes: [
      'Open Meta Business Suite → Account Quality (or Business Support Home) to see the exact reason.',
      'If you think it’s a mistake, tap “Request review” and complete any identity check honestly.',
      'Clear any unpaid balance first.',
      'Don’t create lots of new accounts to get around it — that can get your personal profile restricted too.',
      'Going forward: use your real profile, turn on 2FA, avoid policy-breaking claims, and don’t share logins.',
    ],
  },
  {
    id: 'boost-vs-ads-manager',
    title: 'Should I “Boost” a post or use Ads Manager?',
    keywords: ['boost', 'boost post', 'promote', 'boosting'],
    cause: 'Boosting is quick but has fewer controls; Ads Manager lets you choose the objective, audience and track sales properly.',
    fixes: [
      'For selling, use Ads Manager with the Sales (or Engagement → messages) objective.',
      'Boost only to get quick engagement on a post that’s already doing well.',
      'Follow the Phone Ad Setup Guide to create a proper campaign from your phone.',
    ],
  },
  {
    id: 'whatsapp-button',
    title: 'WhatsApp button / number not working',
    keywords: ['whatsapp', 'link whatsapp', 'connect whatsapp', 'whatsapp number', 'click to whatsapp', 'send message button'],
    cause: 'The WhatsApp number isn’t linked to your Facebook Page, or it’s linked to the wrong number.',
    fixes: [
      'Open your Page → Settings → Linked accounts → WhatsApp and connect your WhatsApp Business number.',
      'Enter the number with country code (+234) and confirm the code sent to WhatsApp.',
      'In the ad set, choose WhatsApp as the conversion location / messaging app.',
      'Test it: tap the ad preview button from another phone to check it opens your chat.',
    ],
  },
  {
    id: 'audience-targeting',
    title: 'I don’t know who to target',
    keywords: ['target', 'audience', 'interest', 'who to target', 'targeting', 'age', 'location'],
    cause: 'Beginners often target too narrowly. Facebook’s system usually finds buyers better when given room.',
    fixes: [
      'Target only the locations you can deliver to.',
      'Use a broad age range that fits the product (e.g. 22–55).',
      'Turn on Advantage+ audience and add 2–4 interests only as suggestions.',
      'Let your creative do the targeting: a video that speaks to a specific person attracts that person.',
    ],
  },
  {
    id: 'budget-how-much',
    title: 'How much should I spend?',
    keywords: ['how much', 'budget', 'spend', 'daily budget', 'minimum'],
    cause: 'Your budget should come from your profit numbers, not a guess.',
    fixes: [
      'Use the Profit Calculator to get your safe cost per order and safe daily budget.',
      'Most beginners test with ₦5,000–₦10,000 per day for 3–4 days.',
      'Use the ROI Predictor to see the worst case before you start.',
      'Scale by 20–30% every 2–3 days once your cost per order is below your safe number.',
    ],
  },
  {
    id: 'hacked',
    title: 'I think my account was hacked',
    keywords: ['hacked', 'hack', 'someone else', 'strange charges', 'unknown ads', 'lost access', 'can’t log in'],
    cause: 'Someone may have your password or a session on your account.',
    fixes: [
      'Go to facebook.com/hacked (or Help → “My account is compromised”) and follow the steps.',
      'Change your password and turn on two-factor authentication.',
      'Check Settings → Password and security → Where you’re logged in, and log out unknown devices.',
      'In Ads Manager, pause any ads you didn’t create and remove unknown people from your ad account.',
      'Call your bank to block the card if you see charges you didn’t make.',
    ],
  },
];

export function matchIssues(text, max = 2) {
  const q = String(text || '').toLowerCase();
  if (!q.trim()) return [];
  return AD_ISSUES.map((i) => ({
    issue: i,
    score: i.keywords.reduce((a, k) => a + (q.includes(k.toLowerCase()) ? k.length : 0), 0),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.issue);
}

export function knowledgeText() {
  return AD_ISSUES.map(
    (i) => `## ${i.title}\nWhy: ${i.cause}\nFixes:\n${i.fixes.map((f) => `- ${f}`).join('\n')}`
  ).join('\n\n');
}
