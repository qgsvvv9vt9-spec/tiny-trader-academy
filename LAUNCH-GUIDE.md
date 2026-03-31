# 🚀 Tiny Trader Academy — 48-Hour Launch Guide

You have everything you need. Follow this guide and your site will be live and taking payments within 48 hours.

---

## What You Have

| File | What It Does |
|------|-------------|
| `index.html` | Complete website — landing page, all 8 lessons, pricing, auth, simulator |
| `stripe-server.js` | Backend that handles payments securely |
| `package.json` | Server dependencies list |
| `.env.example` | Template for your secret keys |
| `.gitignore` | Keeps your secrets out of GitHub |

---

## DAY 1 — Get the Site Live (2–3 hours)

### STEP 1: Create Your Stripe Account (15 min)

1. Go to **stripe.com** → click "Start now" → create account
2. Fill in your business info (you can use your personal name as the business name)
3. Go to **Developers → API Keys**
4. Copy your **Publishable Key** (starts with `pk_live_...`)
5. Copy your **Secret Key** (starts with `sk_live_...`)

> 💡 Use "Test Mode" keys first (`pk_test_...` and `sk_test_...`) to test payments without real money. Switch to live keys when you're ready to launch for real.

### STEP 2: Create Your Products in Stripe (10 min)

1. In Stripe dashboard, go to **Products → Add product**
2. Create **"Pro Trader"**:
   - Name: Pro Trader
   - Price: $29.00, Recurring, Monthly
   - Copy the **Price ID** (starts with `price_...`)
3. Create **"Elite"**:
   - Name: Elite
   - Price: $99.00, Recurring, Monthly
   - Copy the **Price ID**

### STEP 3: Update Your index.html (5 min)

Open `index.html` and find this section near the bottom (around line 200):

```javascript
const CONFIG = {
  STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY',
  PRICE_IDS: {
    pro: 'price_YOUR_PRO_PRICE_ID',
    elite: 'price_YOUR_ELITE_PRICE_ID',
  },
  API_URL: window.location.origin,
};
```

Replace the placeholder values with your actual Stripe keys and price IDs.

### STEP 4: Create a GitHub Account & Upload Files (15 min)

1. Go to **github.com** → Sign up (free)
2. Click **"New repository"**
3. Name it: `tiny-trader-academy`
4. Make it **Public** (required for free Netlify hosting)
5. Click **"uploading an existing file"**
6. Drag and drop ALL the files from your downloaded folder
7. Click **"Commit changes"**

### STEP 5: Deploy to Netlify (10 min — site goes LIVE here!)

1. Go to **netlify.com** → Sign up with your GitHub account
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** → Select `tiny-trader-academy`
4. Click **"Deploy site"**
5. Wait 1-2 minutes...
6. 🎉 **YOUR SITE IS NOW LIVE** at a URL like `https://amazing-tesla-abc123.netlify.app`

### STEP 6: Add a Custom Domain (Optional but recommended — 15 min)

1. Buy a domain at **namecheap.com** or **godaddy.com** (e.g., `tinytraderacademy.com` — ~$12/year)
2. In Netlify: **Site settings → Domain management → Add custom domain**
3. Follow Netlify's instructions to point your domain to Netlify
4. Netlify gives you **free SSL (HTTPS)** automatically

---

## DAY 2 — Set Up the Payment Backend (2–3 hours)

The `index.html` works on its own for collecting signups. For real Stripe payments, you need the backend server running. Here's the easiest way:

### Option A: Deploy to Railway (EASIEST — Free tier available)

1. Go to **railway.app** → Sign up with GitHub
2. Click **"New Project" → "Deploy from GitHub repo"**
3. Select `tiny-trader-academy`
4. Railway will detect it's a Node.js app automatically
5. Go to **Variables** tab and add:
   ```
   STRIPE_SECRET_KEY = sk_live_your_key_here
   STRIPE_PUBLISHABLE_KEY = pk_live_your_key_here
   STRIPE_WEBHOOK_SECRET = (get this in Step 7 below)
   ```
6. Click **Deploy** — Railway gives you a URL like `https://tiny-trader-academy.up.railway.app`
7. Update `CONFIG.API_URL` in `index.html` to this Railway URL
8. Push the updated `index.html` to GitHub — Netlify auto-redeploys!

### Option B: Deploy to Render (Also free)

1. Go to **render.com** → Sign up
2. New → **Web Service** → Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `node stripe-server.js`
5. Add environment variables (same as Railway above)
6. Deploy!

### STEP 7: Set Up Stripe Webhooks (Important!)

Webhooks tell your server when subscriptions are created, cancelled, or payments fail.

1. In Stripe dashboard: **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://YOUR-RAILWAY-URL/api/webhook`
3. Events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook Secret** (starts with `whsec_...`)
5. Add it as `STRIPE_WEBHOOK_SECRET` in your Railway variables

---

## Testing Payments (Before Going Live)

Use these Stripe test card numbers — they work in test mode:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Always succeeds |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure authentication |
| `4000 0000 0000 9995` | ❌ Always declines |

Use any future expiry date and any 3-digit CVV.

---

## Marketing Your Course (Start Day 2)

### Free Traffic Sources

**TikTok / Instagram Reels** (highest potential)
- Record 30-second "did you know?" trading tips
- Use text overlays explaining candles, support/resistance, etc.
- End every video: "Full course at [your URL] — first 3 lessons free!"
- Post 2-3x per day for the first 2 weeks

**YouTube Shorts**
- Same content as TikTok, just upload there too
- Add your course link in every video description

**Reddit**
- Post helpful trading content (not ads!) in:
  - r/Daytrading
  - r/StockMarket  
  - r/investing
  - r/personalfinance
- Add your URL to your profile bio

**Facebook Groups**
- Join trading and investing groups
- Answer questions genuinely — become the helpful expert
- People will click your profile and find your site

### Paid Traffic (When You're Ready)

**Facebook/Instagram Ads**
- Budget: Start with $10-20/day
- Target: Ages 25-45, interested in "stock trading", "investing", "financial freedom"
- Best ad hook: "I learned day trading in 30 days — here's exactly how"
- Link to your free signup (low friction = more signups = more upgrades)

**Google Ads**
- Keywords: "learn day trading", "day trading for beginners", "how to read stock charts"
- Budget: $15-25/day
- Link directly to your pricing page

### Email Marketing

Once you have 100+ signups:
1. Use **Mailchimp** (free up to 500 contacts) or **ConvertKit**
2. Set up an automated welcome sequence:
   - Day 1: Welcome + link to first lesson
   - Day 3: Reminder to try the candle lesson
   - Day 7: "Have you tried the simulator?" + upgrade pitch
   - Day 14: Limited-time 20% off Pro offer

### Affiliate Program

- Offer 30% recurring commission to affiliates
- Other trading educators, YouTubers, and influencers will promote for you
- Use **Rewardful** (integrates with Stripe, $49/mo) to manage it

---

## Revenue Projections

| Signups | Pro Conversions (5%) | Monthly Revenue |
|---------|----------------------|-----------------|
| 100 | 5 | $145/mo |
| 500 | 25 | $725/mo |
| 1,000 | 50 | $1,450/mo |
| 5,000 | 250 | $7,250/mo |
| 10,000 | 500 | $14,500/mo |

The course content is done. Your only job now is to get eyeballs on it.

---

## Quick Reference: Your Key Links

Once deployed, bookmark these:

- 🌐 **Your site**: `https://YOUR-NETLIFY-URL.netlify.app`
- 📊 **Stripe dashboard**: `https://dashboard.stripe.com`
- 🚂 **Railway dashboard**: `https://railway.app/dashboard`
- 📧 **Netlify dashboard**: `https://app.netlify.com`

---

## Getting Help

If you get stuck on any step:
1. Ask Claude (I'm right here!) — paste your error message and I'll fix it
2. Netlify docs: docs.netlify.com
3. Stripe docs: stripe.com/docs
4. Railway docs: docs.railway.app

---

*© 2025 Tiny Trader Academy · For educational purposes only · Not financial advice*
