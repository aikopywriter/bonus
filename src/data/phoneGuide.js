// Phone Ad Setup Guide content.
// Screens are simplified illustrations. Menu names in Meta's apps change from time to time —
// the steps below describe what to look for, not exact pixel positions.

export const MODULES = [
  {
    id: 'm1',
    title: 'Get ready',
    lessons: [
      {
        id: 'what-you-need',
        title: 'What you need before you start',
        minutes: 3,
        summary: 'You don’t need a laptop. Here’s the short list of things to have ready on your phone.',
        steps: [
          {
            title: 'Any smartphone works',
            text: 'An Android or iPhone with at least 2GB of free storage and a stable data connection is enough. Keep your phone updated so the apps run smoothly.',
            screen: {
              title: 'Checklist', back: false,
              rows: [
                { type: 'section', label: 'Have these ready' },
                { type: 'check', label: 'Smartphone with free storage', selected: true },
                { type: 'check', label: 'Your real Facebook account', selected: true },
                { type: 'check', label: 'A Facebook Page for your business', selected: true },
                { type: 'check', label: 'WhatsApp Business number', selected: true },
                { type: 'check', label: 'Card that works for online payments', selected: false, highlight: true },
                { type: 'check', label: 'Product photos or videos', selected: false },
              ],
            },
          },
          {
            title: 'Use your real Facebook account',
            text: 'Run ads from your own, real profile — not a new “business” profile you just opened. New or fake profiles get restricted quickly. Turn on two-factor authentication (Settings → Accounts Centre → Password and security) before you start.',
            screen: {
              title: 'Password and security',
              rows: [
                { type: 'section', label: 'Login & recovery' },
                { type: 'nav', label: 'Change password' },
                { type: 'nav', label: 'Two-factor authentication', value: 'Off — turn this on', highlight: true },
                { type: 'nav', label: 'Saved login' },
                { type: 'section', label: 'Security checks' },
                { type: 'nav', label: 'Where you’re logged in' },
                { type: 'nav', label: 'Login alerts' },
              ],
            },
          },
          {
            title: 'Prepare your payment card',
            text: 'Facebook charges your card as your ads run. Call your bank or check your banking app and make sure your card is enabled for online and international payments. Many “card declined” problems come from this one setting.',
            screen: {
              title: 'My bank app · Cards',
              rows: [
                { type: 'text', label: 'Debit card •••• 4821', bold: true },
                { type: 'toggle', label: 'Online payments', value: 'Allow purchases on websites & apps', selected: true },
                { type: 'toggle', label: 'International transactions', value: 'Needed for Facebook ads', selected: false, highlight: true },
                { type: 'toggle', label: 'Contactless', selected: true },
                { type: 'field', label: 'Online spending limit', value: '₦100,000 / month' },
              ],
            },
          },
        ],
        tip: 'Keep ₦5,000–₦10,000 per day for at least 3–4 days as your first test budget. Use the Profit Calculator to find your exact safe budget.',
        checklist: ['Two-factor authentication is on', 'Card is enabled for online & international payments', 'I have at least 3 product photos or 1 video'],
      },
      {
        id: 'install-apps',
        title: 'Install the right apps',
        minutes: 2,
        summary: 'Four free apps turn your phone into a full ad studio.',
        steps: [
          {
            title: 'Install Meta Ads Manager',
            text: 'Search “Meta Ads Manager” in the Play Store or App Store. This is the app you’ll use to create, edit and track ads. It gives you the full campaign → ad set → ad setup, not just the simple “Boost” button.',
            screen: {
              title: 'Play Store', back: false,
              rows: [
                { type: 'search', label: 'meta ads manager' },
                { type: 'app', label: 'Meta Ads Manager', value: 'Create & manage ads', icon: 'AM', color: '#0866FF', highlight: true },
                { type: 'app', label: 'Meta Business Suite', value: 'Manage Page, inbox & posts', icon: 'BS', color: '#1C2B33' },
                { type: 'app', label: 'WhatsApp Business', value: 'Catalogue, labels, quick replies', icon: 'WB', color: '#25D366' },
                { type: 'app', label: 'CapCut', value: 'Edit product videos', icon: 'CC', color: '#111827' },
              ],
            },
          },
          {
            title: 'Add the helper apps',
            text: 'Meta Business Suite manages your Page and replies to messages. WhatsApp Business lets you add a catalogue, auto-replies and labels for “New order”, “Paid” and “Delivered”. CapCut or Canva let you edit videos and add captions on your phone.',
            screen: {
              title: 'Home screen', back: false,
              rows: [
                { type: 'section', label: 'Your ad toolkit' },
                { type: 'app', label: 'Meta Ads Manager', value: 'Ads', icon: 'AM', color: '#0866FF', action: 'Open' },
                { type: 'app', label: 'Meta Business Suite', value: 'Page & inbox', icon: 'BS', color: '#1C2B33', action: 'Open' },
                { type: 'app', label: 'WhatsApp Business', value: 'Orders', icon: 'WB', color: '#25D366', action: 'Open' },
                { type: 'app', label: 'CapCut', value: 'Videos', icon: 'CC', color: '#111827', action: 'Open' },
              ],
            },
          },
        ],
        tip: 'Log in to all the Meta apps with the same Facebook account so they connect to the same Page and ad account.',
        checklist: ['Meta Ads Manager installed', 'Meta Business Suite installed', 'WhatsApp Business set up with my business name & logo'],
      },
      {
        id: 'page-setup',
        title: 'Set up your Facebook Page & link WhatsApp',
        minutes: 4,
        summary: 'Your ads run from a Page. A clean, trustworthy Page makes people more likely to order.',
        steps: [
          {
            title: 'Create your business Page',
            text: 'In the Facebook app, tap the Menu (☰) → Pages → Create. Use your brand name, choose a category like “Shopping & retail”, and add a logo and cover photo.',
            screen: {
              title: 'Create a Page',
              rows: [
                { type: 'field', label: 'Page name', value: 'Ada’s Gadget Hub' },
                { type: 'field', label: 'Category', value: 'Shopping & retail', highlight: true },
                { type: 'field', label: 'Bio', value: 'Quality gadgets · Nationwide delivery · Pay on delivery in Lagos' },
                { type: 'section', label: 'Photos' },
                { type: 'nav', label: 'Add profile picture (logo)' },
                { type: 'nav', label: 'Add cover photo' },
              ],
              footer: 'Create Page',
            },
          },
          {
            title: 'Link your WhatsApp Business number',
            text: 'Open your Page → Settings → Linked accounts (sometimes under “Professional dashboard”) → WhatsApp. Enter your number and the code you receive. Now your ads can send buyers straight into your WhatsApp chat.',
            screen: {
              title: 'Linked accounts',
              rows: [
                { type: 'nav', label: 'Instagram', value: 'Connect to run ads on Instagram too' },
                { type: 'nav', label: 'WhatsApp', value: 'Not connected', highlight: true },
                { type: 'field', label: 'WhatsApp number', value: '+234 803 123 4567' },
                { type: 'text', label: 'We’ll send a code to this number to confirm it’s yours.' },
              ],
              footer: 'Send code',
            },
          },
          {
            title: 'Make the Page look trustworthy',
            text: 'Before running ads, post 3–6 times: product photos, a delivery video, a customer review screenshot. Buyers check your Page before they message — an empty Page loses sales.',
            screen: {
              title: 'Ada’s Gadget Hub',
              rows: [
                { type: 'status', label: 'Profile photo & cover added', tone: 'good' },
                { type: 'status', label: 'Contact & WhatsApp button added', tone: 'good' },
                { type: 'status', label: '6 posts published', tone: 'good' },
                { type: 'status', label: 'Add 2 customer reviews', tone: 'warn' },
                { type: 'adpreview', label: 'Ada’s Gadget Hub', value: 'Delivered to Ikeja today 🚚 Thank you Chioma!', headline: 'Nationwide delivery', cta: 'Message' },
              ],
            },
          },
        ],
        checklist: ['Page created with logo & cover', 'WhatsApp linked to the Page', 'At least 3 posts on the Page'],
      },
    ],
  },
  {
    id: 'm2',
    title: 'Set up your ad account',
    lessons: [
      {
        id: 'ad-account',
        title: 'Open Ads Manager & set up your ad account',
        minutes: 3,
        summary: 'Get your country, currency and time zone right the first time.',
        steps: [
          {
            title: 'Open Meta Ads Manager',
            text: 'Log in with your Facebook account. If you have more than one ad account, tap the account name at the top to switch. Use the account connected to your business Page.',
            screen: {
              title: 'Ads Manager', back: false, plus: true,
              rows: [
                { type: 'nav', label: 'Ada’s Gadget Hub (ad account)', value: 'Tap to switch accounts', highlight: true },
                { type: 'section', label: 'Last 7 days' },
                { type: 'stats', items: [{ label: 'Amount spent', value: '₦0' }, { label: 'Results', value: '0' }, { label: 'Reach', value: '0' }, { label: 'Impressions', value: '0' }] },
                { type: 'text', label: 'You don’t have any campaigns yet. Tap + to create your first ad.' },
              ],
            },
          },
          {
            title: 'Check country, currency & time zone',
            text: 'Go to Menu → Ad account settings. Set country to Nigeria, time zone to Africa/Lagos, and pick your currency. The currency usually can’t be changed later without opening a new ad account — so choose carefully.',
            screen: {
              title: 'Ad account settings',
              rows: [
                { type: 'field', label: 'Ad account name', value: 'Ada’s Gadget Hub' },
                { type: 'field', label: 'Country', value: 'Nigeria' },
                { type: 'field', label: 'Currency', value: 'Nigerian Naira (NGN)', highlight: true },
                { type: 'field', label: 'Time zone', value: '(GMT+01:00) Africa/Lagos' },
                { type: 'text', label: 'Currency and time zone are hard to change later.' },
              ],
              footer: 'Save',
            },
          },
        ],
        tip: 'Your budget “day” follows the time zone you pick. Africa/Lagos keeps your daily spend aligned with your real day.',
        checklist: ['I’m in the right ad account', 'Country, currency & time zone are correct'],
      },
      {
        id: 'payment',
        title: 'Add your payment method',
        minutes: 3,
        summary: 'Add a card so your ads can run without stopping.',
        steps: [
          {
            title: 'Go to Billing & payments',
            text: 'In Ads Manager tap Menu → Billing & payments (it may be called “Payment settings”). Tap “Add payment method”.',
            screen: {
              title: 'Menu',
              rows: [
                { type: 'menu', items: [{ label: 'Campaigns' }, { label: 'Audiences' }, { label: 'Billing & payments', highlight: true }, { label: 'Ad account settings' }, { label: 'Help' }] },
              ],
            },
          },
          {
            title: 'Enter your card details',
            text: 'Add your debit or virtual dollar card. If it’s declined, check that online/international payments are turned on, that you have enough balance (Facebook may place a small test charge), and that the billing country matches. Still stuck? Ask the Ad Troubleshooter.',
            screen: {
              title: 'Add payment method', lock: true,
              rows: [
                { type: 'option', label: 'Credit or debit card', selected: true },
                { type: 'field', label: 'Card number', value: '5399 •••• •••• 4821' },
                { type: 'field', label: 'Expiry · CVV', value: '08/28 · •••' },
                { type: 'field', label: 'Name on card', value: 'ADA OKONKWO' },
                { type: 'field', label: 'Billing country', value: 'Nigeria', highlight: true },
              ],
              footer: 'Save',
            },
          },
          {
            title: 'Set an account spending limit (recommended)',
            text: 'In Billing & payments, set an “Account spending limit”. If something goes wrong — a typo in your budget, a hacked account — Facebook can’t spend more than this.',
            screen: {
              title: 'Account spending limit',
              rows: [
                { type: 'text', label: 'Ads stop when your total spend reaches this amount.' },
                { type: 'field', label: 'Limit', value: '₦60,000', highlight: true },
                { type: 'status', label: 'Spent so far: ₦0', tone: 'good' },
              ],
              footer: 'Set limit',
            },
          },
        ],
        checklist: ['Card added and accepted', 'Account spending limit set'],
      },
    ],
  },
  {
    id: 'm3',
    title: 'Create your first campaign',
    lessons: [
      {
        id: 'objective',
        title: 'Choose your campaign objective',
        minutes: 3,
        summary: 'Tell Facebook what you want: sales or WhatsApp messages.',
        steps: [
          {
            title: 'Tap + → Create campaign',
            text: 'From the Ads Manager home screen tap the + button, then “Create campaign”. Note: the app doesn’t save drafts, so set aside 15–20 quiet minutes and finish in one go.',
            screen: {
              title: 'Ads Manager', back: false, plus: true, plusHighlight: true,
              rows: [
                { type: 'menu', items: [{ label: 'Create campaign', highlight: true }, { label: 'Duplicate existing' }, { label: 'Boost a post' }] },
                { type: 'text', label: 'Tip: you can’t save drafts in the app — finish in one sitting.' },
              ],
            },
          },
          {
            title: 'Pick the right objective',
            text: 'If customers order on WhatsApp, choose Sales or Engagement, then later set the conversion location to WhatsApp. If you have a website with the Meta Pixel, choose Sales and send people to your website. Avoid “Awareness” and “Traffic” for selling — they bring viewers, not buyers.',
            screen: {
              title: 'Choose objective', progress: 1,
              rows: [
                { type: 'option', label: 'Awareness', value: 'Show ads to many people' },
                { type: 'option', label: 'Traffic', value: 'Clicks to a website' },
                { type: 'option', label: 'Engagement', value: 'Messages, video views, likes' },
                { type: 'option', label: 'Leads', value: 'Collect contacts' },
                { type: 'option', label: 'Sales', value: 'Find people likely to buy', selected: true, highlight: true },
              ],
              footer: 'Continue',
            },
          },
          {
            title: 'Name your campaign',
            text: 'Use a name you’ll understand later, like “Neck fan – WhatsApp – Nov”. Leave “Advantage+ campaign budget” off for your first test so you control the budget per ad set.',
            screen: {
              title: 'Campaign', progress: 1,
              rows: [
                { type: 'field', label: 'Campaign name', value: 'Neck fan – WhatsApp – Nov', highlight: true },
                { type: 'toggle', label: 'Advantage+ campaign budget', value: 'Leave off for your first test', selected: false },
                { type: 'nav', label: 'Special ad categories', value: 'None (for normal products)' },
              ],
              footer: 'Next',
            },
          },
        ],
        checklist: ['Objective: Sales (or Engagement for WhatsApp)', 'Clear campaign name'],
      },
      {
        id: 'budget',
        title: 'Set your budget & schedule',
        minutes: 2,
        summary: 'Spend what you can afford to test — no more.',
        steps: [
          {
            title: 'Choose where orders happen',
            text: 'In the ad set, set “Conversion location” (or “Where do you want to get messages?”) to WhatsApp if you take orders on WhatsApp, or Website if you have a store.',
            screen: {
              title: 'Ad set · Conversion', progress: 2,
              rows: [
                { type: 'section', label: 'Conversion location' },
                { type: 'option', label: 'Website', value: 'Your online store' },
                { type: 'option', label: 'Message apps', value: 'WhatsApp, Messenger, Instagram', selected: true, highlight: true },
                { type: 'check', label: 'WhatsApp', selected: true },
                { type: 'check', label: 'Messenger', selected: false },
              ],
              footer: 'Next',
            },
          },
          {
            title: 'Set a daily budget',
            text: 'Choose “Daily budget”. Start with your safe daily budget from the Profit Calculator — for most beginners ₦5,000–₦10,000 a day. Run for at least 3–4 days before judging the results.',
            screen: {
              title: 'Budget & schedule', progress: 2,
              rows: [
                { type: 'option', label: 'Daily budget', selected: true },
                { type: 'field', label: 'Amount per day', value: '₦7,000', highlight: true },
                { type: 'field', label: 'Start date', value: 'Today' },
                { type: 'toggle', label: 'Set an end date', value: 'Optional', selected: false },
                { type: 'text', label: 'You won’t spend more than ₦49,000 per week.' },
              ],
              footer: 'Next',
            },
          },
        ],
        tip: 'Never set a budget you’d be upset to lose. Testing is part of the process — the ROI Predictor shows you the worst case before you start.',
        checklist: ['Conversion location matches where I take orders', 'Daily budget is within my safe budget'],
      },
      {
        id: 'audience',
        title: 'Target the right people',
        minutes: 4,
        summary: 'Only show your ad to people you can actually deliver to.',
        steps: [
          {
            title: 'Set locations you deliver to',
            text: 'Remove the default and add only the states or cities you deliver to — e.g. Lagos, Abuja (FCT), Rivers. For pay-on-delivery, targeting only cities your riders cover cuts failed deliveries.',
            screen: {
              title: 'Audience · Locations', progress: 2,
              rows: [
                { type: 'search', label: 'Search states or cities', highlight: true },
                { type: 'chips', items: ['Lagos', 'FCT Abuja', 'Rivers'] },
                { type: 'option', label: 'People living in or recently in this location', selected: true },
                { type: 'text', label: 'Estimated audience: 9.4M – 11.1M' },
              ],
              footer: 'Done',
            },
          },
          {
            title: 'Age and gender',
            text: 'Set an age range that fits your buyer (e.g. 22–55). Only choose a gender if the product is clearly for one gender (e.g. women’s wigs). Otherwise leave “All”.',
            screen: {
              title: 'Audience · Demographics', progress: 2,
              rows: [
                { type: 'field', label: 'Age', value: '22 – 55', highlight: true },
                { type: 'option', label: 'All genders', selected: true },
                { type: 'option', label: 'Men' },
                { type: 'option', label: 'Women' },
              ],
              footer: 'Done',
            },
          },
          {
            title: 'Let Facebook find buyers (Advantage+ audience)',
            text: 'Keep Advantage+ audience on and add 2–4 interests as “suggestions” (e.g. Online shopping, Jumia, Gadgets). Facebook uses them as a starting point and then finds buyers. Very narrow targeting usually makes ads more expensive.',
            screen: {
              title: 'Audience', progress: 2,
              rows: [
                { type: 'toggle', label: 'Advantage+ audience', value: 'Recommended — Facebook finds likely buyers', selected: true, highlight: true },
                { type: 'section', label: 'Audience suggestions (optional)' },
                { type: 'chips', items: ['Online shopping', 'Gadgets', 'Jumia'] },
              ],
              footer: 'Next',
            },
          },
        ],
        checklist: ['Only locations I deliver to', 'Sensible age range', 'Advantage+ audience on with a few interest suggestions'],
      },
      {
        id: 'placements',
        title: 'Placements: where your ad shows',
        minutes: 1,
        summary: 'Keep it simple and let Facebook choose.',
        steps: [
          {
            title: 'Use Advantage+ placements',
            text: 'Leave “Advantage+ placements” selected. Your ad will show across Facebook, Instagram, Reels and Stories wherever it performs best. Only switch to manual placements after you have data showing a placement doesn’t work.',
            screen: {
              title: 'Placements', progress: 2,
              rows: [
                { type: 'option', label: 'Advantage+ placements', value: 'Recommended — maximise results', selected: true, highlight: true },
                { type: 'option', label: 'Manual placements', value: 'Choose where ads appear' },
              ],
              footer: 'Next',
            },
          },
        ],
        checklist: ['Advantage+ placements selected'],
      },
      {
        id: 'create-ad',
        title: 'Create the ad itself',
        minutes: 5,
        summary: 'Upload your video, write your text, add your WhatsApp button.',
        steps: [
          {
            title: 'Choose identity & format',
            text: 'Pick your Facebook Page (and Instagram account if connected). Choose “Single image or video” for your first ad.',
            screen: {
              title: 'Ad · Setup', progress: 3,
              rows: [
                { type: 'field', label: 'Facebook Page', value: 'Ada’s Gadget Hub' },
                { type: 'field', label: 'Instagram account', value: '@adagadgets' },
                { type: 'section', label: 'Format' },
                { type: 'option', label: 'Single image or video', selected: true, highlight: true },
                { type: 'option', label: 'Carousel', value: '2 or more images/videos' },
              ],
              footer: 'Next',
            },
          },
          {
            title: 'Upload media from your gallery',
            text: 'Tap “Add media” and pick your best product video (or 1–3 photos). Vertical (9:16) or square-ish (4:5) works best on phones. Videos usually beat photos.',
            screen: {
              title: 'Choose media', progress: 3,
              rows: [
                { type: 'section', label: 'Gallery' },
                { type: 'media', highlight: true },
                { type: 'text', label: '1 video selected · 0:18' },
              ],
              footer: 'Use media',
            },
          },
          {
            title: 'Write your text',
            text: 'Primary text: start with a hook, list 2–3 benefits, state price and “pay on delivery” if you offer it. Headline: your offer in a few words. Call to action: “Send WhatsApp message” or “Shop now”.',
            screen: {
              title: 'Ad · Text', progress: 3,
              rows: [
                { type: 'field', label: 'Primary text', value: 'NEPA took light? Stay cool anyway 😮‍💨 Rechargeable neck fan…' },
                { type: 'field', label: 'Headline', value: '₦14,900 · Pay on delivery in Lagos' },
                { type: 'field', label: 'Call to action', value: 'Send WhatsApp message', highlight: true },
                { type: 'adpreview', value: 'NEPA took light? Stay cool anyway 😮‍💨', headline: '₦14,900 · Pay on delivery', cta: 'WhatsApp' },
              ],
              footer: 'Next',
            },
          },
          {
            title: 'Add a welcome message (WhatsApp ads)',
            text: 'Set a greeting and 2–3 quick questions like “How much is it?”, “Do you deliver to my area?”, “I want to order”. This makes it easy for people to start the chat.',
            screen: {
              title: 'Message template', progress: 3,
              rows: [
                { type: 'field', label: 'Greeting', value: 'Hi! 👋 Thanks for your interest in our neck fan.' },
                { type: 'section', label: 'Quick questions' },
                { type: 'nav', label: 'I want to order' },
                { type: 'nav', label: 'Do you deliver to my area?' },
                { type: 'nav', label: 'How long does it last?' },
              ],
              footer: 'Save',
            },
          },
        ],
        checklist: ['Best video/photo uploaded', 'Hook, benefits, price in primary text', 'WhatsApp or Shop now button', 'Welcome message set'],
      },
      {
        id: 'publish',
        title: 'Review & publish',
        minutes: 2,
        summary: 'A final check before you spend money.',
        steps: [
          {
            title: 'Check the preview',
            text: 'Tap Preview and look at Feed, Stories and Reels. Check spelling, price, phone number and that the video isn’t cut off.',
            screen: {
              title: 'Preview', progress: 3,
              rows: [
                { type: 'adpreview', value: 'NEPA took light? Stay cool anyway 😮‍💨 Rechargeable, 8 hours battery.', headline: '₦14,900 · Pay on delivery', cta: 'WhatsApp' },
                { type: 'chips', items: ['Feed', 'Stories', 'Reels'] },
              ],
              footer: 'Looks good',
            },
          },
          {
            title: 'Publish and wait for review',
            text: 'Tap Publish. Your ad goes “In review” — usually approved within minutes to 24 hours. Don’t edit it during review or it restarts. Once active, leave it alone for 2–3 days so Facebook can learn.',
            screen: {
              title: 'Review', progress: 3,
              rows: [
                { type: 'nav', label: 'Campaign', value: 'Sales · Neck fan – WhatsApp – Nov' },
                { type: 'nav', label: 'Ad set', value: '₦7,000/day · Lagos, Abuja, Rivers · 22–55' },
                { type: 'nav', label: 'Ad', value: 'Video · Send WhatsApp message' },
                { type: 'status', label: 'In review — usually within 24 hours', tone: 'warn' },
              ],
              footer: 'Publish', footerHighlight: true,
            },
          },
        ],
        tip: 'Ad rejected or stuck in review? Paste the exact message into the Ad Troubleshooter for the fix.',
        checklist: ['Preview checked on Feed, Stories and Reels', 'Ad published'],
      },
    ],
  },
  {
    id: 'm4',
    title: 'Make ads with your phone',
    lessons: [
      {
        id: 'video',
        title: 'Shoot a product video that sells',
        minutes: 4,
        summary: 'Your phone camera is enough. What matters is the first 3 seconds.',
        steps: [
          {
            title: 'Grab attention in 3 seconds',
            text: 'Open with the problem or the “wow” moment: sweating in traffic, a messy kitchen, the product doing something surprising. Don’t start with your logo.',
            screen: {
              title: 'Video plan', back: false,
              rows: [
                { type: 'section', label: '15–30 second video' },
                { type: 'status', label: '0–3s  Hook: show the problem / wow', tone: 'warn' },
                { type: 'status', label: '3–12s  Product solving it', tone: 'good' },
                { type: 'status', label: '12–20s  Benefits + real use', tone: 'good' },
                { type: 'status', label: '20–30s  Price, delivery, how to order', tone: 'good' },
              ],
            },
          },
          {
            title: 'Film it right',
            text: 'Hold the phone vertically. Film near a window or outdoors in daylight. Clean the lens. Show the product in a real hand, in a real Nigerian setting. Record a few short clips rather than one long one.',
            screen: {
              title: 'Camera', back: false,
              rows: [
                { type: 'check', label: 'Vertical (9:16)', selected: true },
                { type: 'check', label: 'Daylight / window light', selected: true },
                { type: 'check', label: 'Lens wiped clean', selected: true },
                { type: 'check', label: 'Product in a real hand', selected: true },
                { type: 'check', label: '5–8 short clips', selected: true },
              ],
            },
          },
          {
            title: 'Edit in CapCut',
            text: 'Join the clips, cut slow parts, add auto-captions (most people watch without sound), add the price and “Pay on delivery” as text near the end. Export in 1080p.',
            screen: {
              title: 'CapCut · Edit', back: false,
              rows: [
                { type: 'adpreview', label: 'Your clip', value: '“NEPA took light? Stay cool anyway”', headline: 'Captions on', cta: '0:18' },
                { type: 'chips', items: ['Split', 'Captions', 'Text', 'Music'] },
              ],
              footer: 'Export 1080p',
            },
          },
        ],
        checklist: ['Hook in the first 3 seconds', 'Captions added', 'Price & how to order shown at the end'],
      },
      {
        id: 'copy',
        title: 'Write ad text that gets orders',
        minutes: 3,
        summary: 'A simple formula you can copy for any product.',
        steps: [
          {
            title: 'Use the 5-line formula',
            text: '1) Hook question or bold statement. 2) The problem. 3) How your product fixes it (2–3 benefits). 4) Offer: price, delivery, pay on delivery, guarantee. 5) Call to action: “Tap Send Message to order now.”',
            screen: {
              title: 'Primary text', back: false,
              rows: [
                { type: 'text', label: '😮‍💨 Tired of sweating in Lagos traffic?', bold: true },
                { type: 'text', label: 'This rechargeable neck fan keeps you cool for up to 8 hours — no hands, no noise.' },
                { type: 'text', label: '✅ Light & comfortable  ✅ USB charging  ✅ 3 speeds' },
                { type: 'text', label: '🔥 ₦14,900 · Free delivery in Lagos · Pay on delivery' },
                { type: 'text', label: '👉 Tap “Send Message” to order now!' },
              ],
            },
          },
        ],
        tip: 'Write 2–3 different hooks and test them as separate ads in the same ad set. Keep the one with the lowest cost per result.',
        checklist: ['Hook + problem + benefits + offer + call to action'],
      },
    ],
  },
  {
    id: 'm5',
    title: 'Read results & scale',
    lessons: [
      {
        id: 'read-results',
        title: 'Read your numbers like a pro',
        minutes: 3,
        summary: 'Five numbers tell you if your ad is working.',
        steps: [
          {
            title: 'The numbers to watch',
            text: 'Open your campaign in Ads Manager. Look at: Amount spent, Results (orders or messages), Cost per result, CTR (click-through rate — aim for 1%+), and CPM (cost per 1,000 views). Cost per result is the most important one.',
            screen: {
              title: 'Neck fan – WhatsApp',
              rows: [
                { type: 'status', label: 'Active', tone: 'good' },
                { type: 'stats', items: [
                  { label: 'Amount spent', value: '₦14,000' },
                  { label: 'Results', value: '6 chats' },
                  { label: 'Cost per result', value: '₦2,333', highlight: true },
                  { label: 'CTR (link)', value: '1.8%' },
                  { label: 'CPM', value: '₦1,950' },
                  { label: 'Frequency', value: '1.3' },
                ] },
              ],
            },
          },
          {
            title: 'Compare with your safe numbers',
            text: 'Take the “Safe cost per order” from the Profit Calculator. If your cost per order is below it, you’re making money. If you run WhatsApp ads, count how many chats become paid orders — that gives your real cost per order.',
            screen: {
              title: 'Your numbers', back: false,
              rows: [
                { type: 'field', label: 'Safe cost per order (Profit Calculator)', value: '₦3,343' },
                { type: 'field', label: 'Ads cost per chat', value: '₦2,333' },
                { type: 'field', label: 'Chats → orders', value: '6 chats → 4 orders' },
                { type: 'field', label: 'Real cost per order', value: '₦3,500', highlight: true },
                { type: 'status', label: 'Slightly above safe — improve replies or ad', tone: 'warn' },
              ],
            },
          },
        ],
        checklist: ['I know my cost per result', 'I compare it to my safe cost per order'],
      },
      {
        id: 'scale',
        title: 'Kill, fix or scale',
        minutes: 3,
        summary: 'Simple rules for what to do after 3 days.',
        steps: [
          {
            title: 'Kill',
            text: 'If you’ve spent about 2× your safe cost per order and got zero orders, pause the ad. Don’t keep “hoping”. Try a new hook or video, or a different product.',
            screen: {
              title: 'Decision', back: false,
              rows: [
                { type: 'status', label: 'Spent 2× safe CPA, 0 orders → PAUSE', tone: 'bad' },
                { type: 'status', label: 'Cost per order above safe → FIX', tone: 'warn' },
                { type: 'status', label: 'Below safe for 3 days → SCALE', tone: 'good' },
              ],
            },
          },
          {
            title: 'Fix',
            text: 'Low CTR (under 1%)? Change the first 3 seconds of the video. Good CTR but few orders? Fix the offer, price or how fast you reply on WhatsApp. High failed deliveries? Call to confirm every order.',
            screen: {
              title: 'What to fix', back: false,
              rows: [
                { type: 'nav', label: 'CTR under 1%', value: 'New hook / new video' },
                { type: 'nav', label: 'Clicks but no orders', value: 'Offer, price, reply speed' },
                { type: 'nav', label: 'Orders but failed deliveries', value: 'Confirm by call before dispatch' },
              ],
            },
          },
          {
            title: 'Scale',
            text: 'When cost per order stays under your safe number for 3+ days, increase the daily budget by 20–30% every 2–3 days. Big jumps can reset learning and push costs up.',
            screen: {
              title: 'Edit budget',
              rows: [
                { type: 'field', label: 'Current daily budget', value: '₦7,000' },
                { type: 'field', label: 'New daily budget (+25%)', value: '₦8,750', highlight: true },
                { type: 'text', label: 'Increase again in 2–3 days if results hold.' },
              ],
              footer: 'Save',
            },
          },
        ],
        checklist: ['I know when to pause an ad', 'I scale by 20–30% at a time'],
      },
    ],
  },
];

export const LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
