// Fake AI answers used only by the local test server (MOCK_AI=1)
export const chatMock = `**This usually means Facebook can't find enough people to show your ad to, or your budget is too low.**

Here's what to fix:

1. **Check the ad status** — open Ads Manager and confirm the campaign, ad set *and* ad are all "Active" (not "In review" or "Off").
2. **Widen your audience** — if you selected only one small city and many interests, switch on *Advantage+ audience* or add more states.
3. **Raise your daily budget** to at least ₦3,000–₦5,000 so the ad can start delivering.

Wait 24 hours after each change before judging the results.

Did your ad get approved, or is it still showing "In review"?`;

export const productMock = {
  productName: 'Portable Neck Fan (Rechargeable)',
  score: 78,
  verdict: 'winner',
  summary: 'Strong problem-solving product for hot Nigerian weather with good wow factor in video ads.',
  criteria: [
    { name: 'Solves a real problem', score: 9, note: 'Heat and NEPA outages make cooling products an easy sell.' },
    { name: 'Wow factor for ads', score: 8, note: 'Looks great in a short demo video.' },
    { name: 'Profit margin potential', score: 7, note: 'Cheap to source; can sell at 3–4× cost.' },
    { name: 'Not easily found locally', score: 6, note: 'Some sellers in Lagos markets; brand it well.' },
    { name: 'Easy to ship & deliver', score: 9, note: 'Light, small and hard to break.' },
    { name: 'Nigerian market fit', score: 8, note: 'Appeals to students, workers and commuters.' },
  ],
  strengths: ['Clear everyday benefit', 'Light and cheap to deliver', 'Easy to demo on video'],
  risks: ['Seasonal — demand drops in rainy season', 'Quality varies between suppliers; order samples first'],
  suggestedPrice: { low: 12000, high: 18000 },
  targetCustomers: 'Workers, students and commuters in hot cities like Lagos, Abuja and Port Harcourt',
  adAngles: ['“NEPA took light? Stay cool anyway”', 'Show sweat vs. cool commuter in traffic', 'Gift idea for parents and spouses'],
  nextSteps: ['Order 2–3 samples to test quality', 'Shoot a 15-second demo video', 'Test with ₦5,000/day for 3 days'],
};
