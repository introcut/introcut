# Introcut freemium pricing and unit economics (as of 2026-10-22)

Scope update from the coordinator: Introcut V1 is now a channel-management and video-creation platform for shy beginners (avatar from a photo, voice clone, code-made 30 s videos, merging AI clips made in free tools). Section 5 sorts those features into cheap-to-serve (browser/local) and costly (server GPU, API clips).

Method note for the report writer: the first pass of this note was cut short by a search-tool usage limit. This version resumes after the limit and fills most gaps. "Official" means a vendor page fetched on 2026-10-22 (pages show no publish date, so they are current as of that day). "Secondary" means a blog, review or search snippet, and is flagged. Prices dated 2026 in blogs are mostly under 6 months old; anything older than 6 months is flagged "OLD". Every computed figure shows its arithmetic, and inputs without a source are labelled ASSUMPTION.

Still NOT found (see Gaps in each section): official Canva and CapCut pages (403 or not fetched), Hera, Pika, Krea and VEED plan prices, Supabase, Ghost and Excalidraw+ precedents, OpenView/ProfitWell/Lenny's/a16z benchmarks, any Nepal-specific willingness-to-pay data, Notion regional pricing.

---

## 1. Pricing benchmarks for AI video and creator tools

### Takeaway
Comparable tools gate on a watermark plus a credit allowance. Free tiers are small: HeyGen gives 3 watermarked videos a month, Runway 125 one-time credits, Fliki 3 credits, Higgsfield 0 credits. Paid plans start around $9-$15 per month and annual billing discounts range from about 17% to about 56%. Prices conflict between sources for CapCut, Canva India, HeyGen, Pictory and Descript, and several tools hide prices behind a toggle.

### Cited Findings
- **HeyGen (official).** Free: $0, 3 watermarked videos per month, each up to 1 minute, 30+ languages, limited Avatar IV trial, 1 custom avatar, 1 voice clone. Creator: $29 per month (about $24 per month annual per the FAQ), 600 credits, 1080p, watermark removed, up to 30 minutes. Pro: from $49, 1,000 credits, 4K. Business: $149 + $20 per seat, 1,500 credits. Monthly credits roll over one extra month; annual credits accumulate to renewal; credits expire if the subscription lapses. — [HeyGen pricing](https://www.heygen.com/pricing)
- HeyGen secondary sources conflict with the official page: Creator at 200 credits and Pro at $99 in some blogs; free plan "1 credit" versus "3 videos". A secondary source also says the Video Agent rate rose from 20 to 30 credits per minute on 22 July 2026 and that free API credits were removed in February 2026 (unverified). — [Arcade](https://www.arcade.software/post/heygen-pricing), [Anam](https://anam.ai/blog/heygen-pricing)
- **Runway (official).** Free: $0, 125 one-time non-expiring credits, 5 GB storage. Standard: $15 per month or $12 annual, 625 credits. Pro: $35 or $28 annual, 2,250 credits, 1 Brand Kit, 1 custom voice clone. Max: $95 or $76 annual, 9,500 credits. Standard and Pro credits do not roll over; purchased top-ups never expire. Paid plans have no watermark; the page is silent on free-plan watermark. — [Runway pricing](https://runway.com/pricing)
- Runway credit rate (secondary): 12 credits per second for Gen-4.5, so 625 credits is about 52 seconds and 2,250 credits about 187 seconds. — [Creatify](https://creatify.ai/blog/runway-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay)
- **invideo (official).** Basic $9 per month, $4 or $5 annual (the page shows both), 190 credits, about 7 Seedance 2 Fast videos per month. Pro $30 or $15 annual, 1,000 credits, about 26 videos. Ultra $80 or $40 annual, 3,000 credits, about 78 videos. Credits do not roll over and "credit costs can change at any time without notice". The page does not show a free plan, watermark policy or India pricing. — [invideo pricing](https://invideo.io/pricing/)
- **Fliki (official).** Free: 3 credits per month, 720p, 5-minute export, Fliki watermark. Standard: 180 credits, 1080p, 15 minutes. Premium: 600 credits. Dollar amounts are hidden behind a "40% off yearly" toggle. The page is internally inconsistent (0.5 credits per minute versus "Standard covers 60-90 minutes"; "5 minutes free" versus 3 credits). — [Fliki pricing](https://fliki.ai/pricing)
- **VEED (official page).** The fetched content showed no prices. FAQ: AI credits reset on renewal and do not carry over; billing is per seat. — [VEED pricing](https://www.veed.io/pricing)
- **Higgsfield (secondary; the official page was not fetched).** Free: 0 credits, 1 concurrent video, no commercial use. Starter about $19 per month annual, 270 credits. Plus $47 annual or $59 monthly, 1,200 credits. Ultra $99 annual or $129 monthly, 3,000 credits. Subscription credits do not roll over; credit packs expire after 90 days. Sources differ on which features sit in which tier. — [Creatify](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay), [Krea blog](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs)
- **Descript (secondary).** Hobbyist about $16 per month annual or $24 monthly (10 media hours, 400 AI credits). Creator about $24 annual or $35 monthly (30 hours, 800 credits). Business about $50 or $65. Free: 60 media minutes per month and 100 non-renewing AI credits. CASRAI says it checked against Descript's page in August 2026; Sonix lists different media hours (Creator about 10 hours), so the hours conflict. — [Castmagic](https://www.castmagic.io/blog/descript-pricing), [CASRAI](https://www.casrai.org/guides/descript-pricing), [Sonix](https://sonix.ai/resources/descript-pricing/)
- **Pictory (secondary).** Starter $29 per month (about $25 annual), 200 minutes; Professional $59 (about $35 annual per one table, which looks low, so verify), 600 minutes. A 14-day trial gives 15 minutes. AI-credit counts conflict between sources. — [Creatify](https://creatify.ai/blog/pictory-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay)
- **CapCut Pro (secondary, conflicting).** Pro $19.99 per month or $179.99 per year; Standard $9.99 with a 1080p cap; Pro lists 1,200 AI credits and 1 TB storage. Another source gives $9.99-$19.99 per month and $89.99-$179.99 per year, varying by store and region. UK: £21.99 per month, £199.99 per year (July 2026). — [Pixflow](https://pixflow.net/blog/capcut-pro-price/), [Hooked](https://www.hooked.so/compare/capcut-pricing), [Reviewaitool](https://blog.reviewaitool.com/2026/09/03/capcut-pricing-2026/), [Marc Andrews](https://marcandrews.com/capcut-pro-price-uk-2026-plans-costs-best-deals/)
- **Canva.** The official page returned HTTP 403. India secondary prices conflict (₹499 per month, ₹3,999 or ₹4,500 per year, outlier ₹1,299). See Section 3.
- Annual-discount arithmetic from the figures above:
  - Runway: 15 to 12 = 20%; 35 to 28 = 20%; 95 to 76 = 20%.
  - HeyGen Creator: 29 to 24 = 17%.
  - invideo: 30 to 15 = 50%; 9 to 4 = 56% (to 5 = 44%).
  - Higgsfield (secondary): 59 to 47 = 20%; 129 to 99 = 23%.
  - Descript (secondary): 24 to 16 = 33%; 35 to 24 = 31%.
  - Fliki: stated 40%.

### Inferences
- Credit retail price per second of generated video at Runway. Standard: $15 / 52.08 s = $0.288 per second. Pro: $35 / 187.5 s = $0.187 per second. A 30-second story at those rates is 30 x 0.288 = $8.64 and 30 x 0.187 = $5.61. ASSUMPTION: the 12-credits-per-second rate is secondary. Compare with Veo 3.1 Fast list of $0.10 to $0.12 per second (Section 4), where 30 s costs $3.00 to $3.60. A consumer markup of about 1.6x to 2.9x (5.61/3.60 = 1.56; 8.64/3.00 = 2.88) is normal in this market.
- Credits are the dominant metaphor wherever there is variable AI cost (HeyGen, Runway, invideo, VEED, Fliki, Higgsfield, Descript). "Per video" counts appear mainly on free tiers ("3 videos"). No source measured which metaphor converts best; that is a gap.
- Credits that expire monthly (Runway, invideo, VEED, Higgsfield) are the norm and protect margin. Non-expiring prepaid top-ups (Runway) are the lowest-risk revenue.
- HeyGen's free tier (3 watermarked videos, 1 minute) is the closest verified analogue to "3 free videos then pay". Differences: HeyGen renders on its servers; Introcut would render in the browser.
- Watermark is the universal first paywall lever (HeyGen, Fliki; Runway paid plans).

### Gaps
- No current prices for Hera, Pika, Krea; no official Canva, CapCut, Higgsfield, Descript or Pictory page.
- No head-to-head data on which pricing metaphor converts best.
- invideo free-plan limits and watermark rules are not on the fetched page.

---

## 2. Freemium conversion and retention benchmarks

### Takeaway
RevenueCat 2026 puts the freemium median at 2.1% and hard paywalls at 10.7%, with AI apps retaining worse than average. A metered "3 free then pay" design sits between the two, so 2% to 10% is a plausible range (inference). Planning value: 2%, downside 1%, upside 5%.

### Cited Findings
- RevenueCat State of Subscription Apps 2026 (115,000+ apps, $16B+ revenue): Day 35 trial-to-paid median 10.7% for hard paywalls (12.1% in 2025) versus 2.1% for freemium (unchanged). Day 60 revenue per install $3.09 versus $0.38 (about 8x). — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026.md)
- Same report, retention: year-1 retention of yearly subscribers 28% (freemium) and 27% (hard paywall). About 72% of annual subscribers cancel in year 1 (about 56% in 2025). Month 1 holds 35% of annual cancellations. — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026.md)
- Same report, AI apps: year-1 realized LTV median $30.16 (AI) versus $21.37 (non-AI), but AI apps churn 36% faster and AI monthly plans retain 36% worse over 12 months. 12-month payer retention (2025) was 9.2% (App Store) and 11.5% (Google Play) for AI apps. — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026.md)
- Same report, billing failures: involuntary churn is 31% of cancellations on Google Play (28.2% in 2025) versus 14% on the App Store. — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026.md)
- Definition caveat: Webtonic describes the 10.7% and 2.1% numbers as trial-start conversion with an unclear denominator; the fetched report page labels them Day 35 trial-to-paid. The page had no download-to-paid benchmark. — [Webtonic](https://www.webtonic.io/blog/freemium-statistics)
- Secondary: Phiture attributes a 2-5% freemium-to-paid average (top performers 6-8%) to the 2025 RevenueCat report, but its table also cites First Page Sage, so attribution is uncertain. — [Phiture](https://phiture.com/mobilegrowthstack/how-to-determine-paywall-features-and-pricing-with-user-surveys/)
- SaaStr (Jason Lemkin, the author's own unverified figures): ChatGPT about 2%, Perplexity 2-3%, a mobile free-to-paid average of 1.7% attributed to RevenueCat (undated). Midjourney has no free tier. Freemium needs "10x-100x" more users than founders expect; $10 per month at 2% needs about 50 million active users for $100M a year. — [SaaStr](https://www.saastr.com/freemium-is-back-the-ai-edition-but-youll-still-probably-need-50-million-active-users-for-freemium-to-actually-work-as-a-business-model/)
- Webtonic cites a median free-to-paid of 8% (ChartMogul/ProductLed) for general SaaS, not mobile and not AI. — [Webtonic](https://www.webtonic.io/blog/freemium-statistics)

### Inferences
- Planning conversion: 2% central, 1% downside, 5% upside (all inside the cited range).
- No source measures metered "N free creations" designs. Hard-paywall apps show the price on day 1, which a metered design does not, so 10.7% is an upper reference only.
- Plan for 10% or higher monthly churn on monthly plans (ASSUMPTION from "36% worse" and 72% year-1 annual cancellation). Annual plans and prepaid credits protect against that.
- A 31% Google Play involuntary churn share suggests card failure is a first-order problem on Android; one-time prepaid packs and local wallets or UPI may retain better in Nepal and India (inference, no direct evidence).

### Gaps
- No RevenueCat download-to-paid median from a primary page.
- No OpenView, ProfitWell/Paddle, Lenny's, Stripe or a16z benchmark was retrieved.
- No conversion data for Nepal or India.

---

## 3. Localised pricing for Nepal and India

### Takeaway
India has live regional-price precedent (Spotify cut India Premium 30% in May 2026; Canva India at about ₹499; Jio bundles Canva). For Nepal, paying a USD subscription is the real obstacle: Paddle can sell to Nepal customers, but whether a Nepal-based seller can be paid out, and whether Nepali cards can pay recurring USD, are unconfirmed and are launch blockers to check first.

### Cited Findings
- Spotify India (secondary, May 2026): Premium Standard cut 30%, from ₹199 to ₹139 per month; Premium Lite scrapped; Student from ₹99 to ₹69; Platinum ₹299 unchanged. — [Music Business Worldwide](https://www.musicbusinessworldwide.com/spotify-cuts-premium-prices-in-india-by-30-and-scraps-lite-tier-just-six-months-after-launching-it/), [FoneArena](https://www.fonearena.com/blog/482851/spotify-india-price-cut-may-2026.html)
- Spotify Nepal: only a user community post (June 2025, OLD, over 6 months) says the equivalent plan costs USD 3.99 in Nepal versus about ₹119 in India. Not an official price list. — [Spotify Community](https://community.spotify.com/t5/Live-Ideas/Decrease-the-price-of-premium-in-Nepal/idc-p/7022507)
- Canva India (secondary, conflicting): ₹499 per month; ₹3,999 per year (about ₹333 per month) or ₹4,500 per year; an outlier ₹1,299 per year. Canva reportedly adjusts price to currency and purchasing power. — [Wiuwi](https://wiuwi.com/blogs/207324/Complete-Guide-to-Canva-Subscription-Pricing-in-India), [Website Builder Insider](https://www.websitebuilderinsider.com/how-much-does-canva-pro-cost-in-india/)
- Jio offered eligible customers Canva Pro or Pro Lite worth up to ₹4,000 at no extra cost from 16 September 2026 (telco bundling in India). — [The CSR Journal](https://thecsrjournal.in/jio-offers-free-canva-pro-for-12-months-check-eligibility-plans-price-and-how-to-claim), [T2 Online](https://t2online.in/tech/tech-news/jio-and-canva-partner-to-offer-free-premium-subscriptions-to-eligible-users/2008038)
- Paddle (official): can sell in "over 200 countries and territories"; both Nepal (USD price conversion, tax inclusive) and India (INR price conversion) are on the customer-side supported list. The page does not address seller or payout support for Nepal-based businesses. Fee: 5% + 50 cents per checkout transaction on pay-as-you-go; the FAQ says products under $10 can ask for bespoke pricing. — [Paddle supported countries](https://developer.paddle.com/concepts/sell/supported-countries-locales.md), [Paddle pricing](https://www.paddle.com/pricing)
- Paddle payouts (secondary): mainly USD, EUR and GBP, with a $100 minimum payout; may be outdated. — [Learn With Hasan](https://learnwithhasan.com/payment-gateways/paddle/)
- Stripe in Nepal (secondary snippets): Stripe's Tax docs mark Nepal as supported for customer location but not for business location; a contractor-policy page lists Nepal outside Stripe-supported countries; a Creem docs page lists Nepal for local bank payouts (that page returned 404 when fetched, so unverified). A Doola guide claims Stripe works in Nepal but is promotional. — [Stripe Tax Nepal](https://docs.stripe.com/tax/supported-countries/asia-pacific/nepal), [Creem](https://docs.creem.io/faq/supported-countries), [Doola](https://www.doola.com/stripe-guide/how-to-open-a-stripe-account-in-nepal/)
- Nepal card rules (secondary): NRB's 2021 prepaid-dollar-card rule allowed online use up to USD 500 per year (OLD; the 2025 NRB revision reports only domestic NPR limits and no confirmation either way for the USD cap). A reseller says most Nepali cards are blocked for recurring international payments by default. — [OnlineKhabar](https://english.onlinekhabar.com/nepali-banks-can-issue-prepaid-dollar-cards-now-here-are-basics-you-need-to-know-about.html), [ShareSansar Nov 2025](https://www.sharesansar.com/newsdetail/nepal-rastra-bank-introduces-new-rules-for-foreign-currency-transactions-and-card-usage-limits-2025-11-11), [WebSNP](https://www.websnp.com/help/buy-google-workspace-nepal-without-credit-card)
- Razorpay (its own blog, Indian businesses only): domestic methods including UPI 2% + 18% GST; international cards 3% + GST. A Nepal-based owner probably cannot use it directly (unverified). — [Razorpay](https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained/)
- Khalti says it integrated Stripe's infrastructure (undated vendor blog). — [Khalti](https://blog.khalti.com/services-in-khalti/khalti-stripe-international-payments-nepal/)

### Inferences
- ASSUMPTION, not sourced: $1 = NPR 140 and $1 = INR 88 (verify on the day).
- Spotify India at ₹139 is 139 / 88 = $1.58 per month. That is the clearest evidence that a mass-market India subscription sits around $1.5 to $2.5. Nepal's USD 3.99 post suggests no regional discount in Nepal on Spotify, but is OLD and unofficial.
- Proposed local price points (ASSUMPTIONS to test): Creator list $6 = about NPR 840 and INR 528. Regional NPR 399 = 399 / 140 = $2.85 and INR 199 = 199 / 88 = $2.26. That is 52% and 62% below list (1 - 2.85/6 = 0.525; 1 - 2.26/6 = 0.623). Canva India's ₹499 = $5.67 sits above this, so INR 199 is aggressive.
- Fixed fees punish low prices. Using Paddle's official 5% + $0.50 on $2.85: fee = 0.05 x 2.85 + 0.50 = $0.64 (22%); net = $2.21. On $6: fee = 0.30 + 0.50 = $0.80 (13%); net = $5.20. Annual billing is better because the fixed fee is paid once.
- Paddle's under-$10 bespoke pricing note applies to Creator at $6 and to regional prices; ask Paddle for a quote (unverified benefit).
- Discount regionally only features with near-zero marginal cost. AI credits cost USD per second (Section 4), so they should not be discounted.
- ARPU for Nepal/India has no source. Planning ASSUMPTION: about $2 to $3 per paying user per month in regional tiers, $5 to $8 in USD tiers.

### Gaps
- Not confirmed: whether a Nepal-based individual can open a Paddle seller account and receive payouts in Nepal. Not confirmed: Lemon Squeezy, Polar, Creem, Gumroad eligibility (Polar and Lemon Squeezy fees not found).
- No official NRB text on recurring international card payments or the current USD cap.
- No Notion or CapCut regional pricing; no official Canva price; no Nepal willingness-to-pay survey.

---

## 4. Cost structure of the free tier and break-even conversion

### Takeaway
Browser-rendered free creations cost the owner about nothing, so 3-free-then-pay breaks even at roughly 0.4% to 1.3% conversion if paid plans include no server AI. Free AI video is not viable (30% to 52% break-even on a monthly view, against a 2.1% benchmark). A flat plan that includes AI video loses money at $5 and is fragile at $9. Provider prices are volatile: Google lists Veo 3.1 as shutting down on 22 October 2026.

### Cited Findings (provider prices, official unless stated)
- **Google Veo per second, with audio, no free tier** (page read 2026-10-22): Veo 3.1 Standard $0.40 (720p and 1080p), $0.60 (4K). Veo 3.1 Fast $0.10, $0.12, $0.30. Veo 3.1 Lite $0.05 (720p), $0.08 (1080p). The same page says Veo 3.1 models are deprecated and will shut down on 22 October 2026. You are only charged for successful generations. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Gemini Omni 1.1 Flash** (secondary, 28 August 2026): about $0.10 per second at 720p ($17.50 per 1M video-output tokens at 5,792 tokens per second), about $0.034 per second at 360p, no free tier. — [Apidog](https://apidog.com/blog/gemini-omni-1-1-flash-pricing/)
- **Gemini text, per 1M tokens** (official): 2.5 Flash $0.30 input, $2.50 output; 3.8 Flash $0.75 / $3.75 through 2026, then $1.50 / $7.50 from 1 January 2027. The pages list a free tier for these models but not its limits. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Gemini TTS, per 1M tokens** (official): 2.5 Flash Preview TTS $0.50 text input, $10.00 audio output, free tier available; 3.8 Flash TTS $9 audio output through 2026 then $18. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Azure Speech** (official): neural TTS free tier of 0.5 million characters per month. The price per million characters did not load. Secondary: $15 per million (a calculator dated 8 October 2026), Neural HD $22 or $30, or about $16 elsewhere. Custom (Professional and Personal) voice is a limited-access feature; amounts did not load. — [Azure Speech pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/), [InventiveHQ](https://inventivehq.com/tools/developer/tts-stt-api-cost-calculator)
- **Kling API** (secondary and inconsistent): CostBench shows $0.06 to $0.42 per second across plans (August 2026 snapshot, medium confidence, "custom pricing"); prepaid packages from $9.80 (CloudZero). — [CostBench](https://costbench.com/software/ai-media-apis/kling-api/), [CloudZero](https://www.cloudzero.com/blog/kling-ai-pricing/)
- **Talking-avatar from photo, API** (secondary): fal.ai lists OmniHuman v1 at $0.14 per second (30 s audio max) and OmniHuman 1.5 at $0.16 per second ($4.80 for 30 s). RunComfy lists OmniHuman 2.0 at $0.09 per second (reseller, unverified). — [fal.ai OmniHuman](https://fal.ai/models/fal-ai/bytedance/omnihuman), [fal.ai guide](https://fal.ai/learn/devs/omnihuman-15-user-guide), [RunComfy](https://www.runcomfy.com/models/bytedance/omnihuman/v2.0)
- **Hugging Face ZeroGPU** (docs plus forum): free accounts get about 3.5 minutes of GPU per day, PRO 25 minutes; PRO can buy extra at $1 per 10 minutes of GPU time (a forum thread disputes this). The 3.5-minute figure is forum-sourced. — [HF ZeroGPU docs](https://huggingface.co/docs/hub/spaces-zerogpu.md), [HF forum](https://discuss.huggingface.co/t/zero-gpu-daily-quota/168376)
- **Cloudflare** (official): Workers Free 100,000 requests per day with 10 ms CPU per invocation; Workers Paid $5 per month minimum with 10 million requests included and $0.30 per extra million. Turnstile Free: unlimited challenges, 20 widgets. R2 advertises zero egress fees; D1 and R2 free limits not retrieved. — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/), [Cloudflare plans](https://www.cloudflare.com/plans/developer-platform/)
- **Payment fee** (official): Paddle 5% + $0.50 per transaction. — [Paddle pricing](https://www.paddle.com/pricing)
- Conversion benchmarks used: freemium median 2.1% (RevenueCat 2026); 1.7% secondhand. — [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026.md)

### Inferences (the arithmetic)

Cost of one 30 s AI-clip story at list price (30 s x price per second):
- Veo 3.1 Fast: 30 x 0.10 = $3.00 (720p); 30 x 0.12 = $3.60 (1080p); 30 x 0.30 = $9.00 (4K).
- Veo 3.1 Standard: 30 x 0.40 = $12.00. Lite: 30 x 0.05 = $1.50; 30 x 0.08 = $2.40.
- Omni 720p: 30 x 0.10 = $3.00 (secondary). Kling: 30 x 0.06 = $1.80 to 30 x 0.42 = $12.60 (secondary).
- The owner's earlier estimate of $3 to $5 per story matches the Veo 3.1 Fast and Omni range ($3.00 to $3.60), plus retries (ASSUMPTION: about 1.0 to 1.4 generations per accepted clip, giving 3.00 x 1.4 = $4.20 and 3.60 x 1.4 = $5.04).
- Avatar from photo via API: 30 x 0.14 = $4.20; 30 x 0.16 = $4.80; 30 x 0.09 = $2.70 (unverified reseller).

Cost of server-paid text and voice per free user (ASSUMPTION: per video 3,000 input and 2,000 output tokens for the script; 3 videos):
- Gemini 2.5 Flash: per video 3,000 x 0.30 / 1,000,000 = $0.0009 plus 2,000 x 2.50 / 1,000,000 = $0.0050, total $0.0059; x 3 = **$0.018**.
- Gemini 3.8 Flash after 1 January 2027: 3,000 x 1.50 / 1e6 = $0.0045 plus 2,000 x 7.50 / 1e6 = $0.0150, total $0.0195; x 3 = **$0.059**.
- TTS, Azure at $15 per million characters (secondary price), ASSUMPTION 15 characters per second so 30 s = 450 characters: 450 x 15 / 1e6 = **$0.0068** per video. Azure's free tier of 0.5M characters covers 500,000 / 450 = about 1,111 videos per month.
- TTS, Gemini 2.5 Flash Preview TTS, ASSUMPTION 25 audio tokens per second (verify), 30 s = 750 tokens: 750 x 10 / 1e6 = **$0.0075** per video.
- So text and TTS cost under one cent each per video. AI video and avatar generation are the only real cost drivers.

Break-even model:
- Net revenue per payer per month = 0.95 x P - 0.50 (Paddle fee).
  - P = $5: 4.75 - 0.50 = **$4.25**.
  - P = $9: 8.55 - 0.50 = **$8.05**.
  - P = $15: 14.25 - 0.50 = **$13.75**.
- c_f = server cost per free signup (once); c_p = server cost per payer per month; N = 1,000 free signups per month; F = fixed monthly cost.
- p* = (N x c_f + F) / (N x (Net - c_p)).
- ASSUMPTIONS: F = $50 (conservative; Workers Paid alone is $5, plus domain, database and monitoring); c_p base = $0.30 (cloud backup storage, unverified).

| Scenario | c_f | c_p | Break-even at $5 | at $9 | at $15 |
|---|---|---|---|---|---|
| S1: browser render, BYO key for text, no AI video for payers | $0 | $0.30 | 50 / (1000 x 3.95) = **1.27%** | 50 / (1000 x 7.75) = **0.65%** | 50 / (1000 x 13.45) = **0.37%** |
| S2a: S1 plus capped server text, Gemini 2.5 Flash | $0.018 | $0.30 | (18 + 50) / 3,950 = **1.72%** | 68 / 7,750 = **0.88%** | 68 / 13,450 = **0.51%** |
| S2b: same, Gemini 3.8 Flash from 2027 | $0.059 | $0.30 | (59 + 50) / 3,950 = **2.76%** | 109 / 7,750 = **1.41%** | 109 / 13,450 = **0.81%** |
| S3: payer gets 1 AI story per month ($4 cost, c_p = 4.30) | $0 | $4.30 | 4.25 - 4.30 = -0.05, **never** | 50 / (1000 x 3.75) = **1.33%** | 50 / (1000 x 9.45) = **0.53%** |
| S3b: payer uses 3 stories per month (c_p = 12.30) | $0 | $12.30 | negative, **never** | 8.05 - 12.30 = -4.25, **never** | 50 / (1000 x 1.45) = **3.45%** |
| S4: every free user gets 1 free AI story ($4) | $4 | $0.30 | 4,050 / 3,950 = 102.5%, **impossible** | 4,050 / 7,750 = **52.3%** | 4,050 / 13,450 = **30.1%** |

- Sensitivity to F: with F = $10 instead of $50, S1 at $9 is 10 / 7,750 = 0.13%.
- Cohort view for S4. ASSUMPTION: monthly churn 10%, so lifetime L = 10 months. p* = c_f / (L x (Net - c_p)): $5: 4 / (10 x 3.95) = 10.1%; $9: 4 / (10 x 7.75) = 5.2%; $15: 4 / (10 x 13.45) = 3.0%. Still above the 2.1% median at $5 and $9.
- Annual billing: $48 per year gives 0.95 x 48 - 0.50 = $45.10 per year = $3.76 per month, versus $4 per month monthly: 0.95 x 4 - 0.50 = $3.30. Annual wins because the fixed fee is paid once.
- Margin rule (ASSUMPTION): keep AI cost at or below 50% of net revenue: 0.5 x 8.05 = $4.03 at $9 (about 1 story), 0.5 x 13.75 = $6.88 at $15 (about 1.7 stories at $4), 0.5 x 4.25 = $2.13 at $5 (no AI video).
- Real conversion is of users who finish all 3 free creations. If only 40% of signups reach video 3 (ASSUMPTION), signup-level conversion = 0.4 x finisher conversion.
- Design options per user:
  - (a) Browser render: free user $0; payer $0 for rendering.
  - (b) Own free key: $0 for both (the user's quota is used).
  - (c) Server text allowance: $0.018 to $0.059 per free user (S2).
  - (d) No free AI video: $0 per free user.
- Enforceability: the code is MIT and renders in the browser, so a local "3 used" counter can be removed by anyone. Only server-side value (AI credits, sync, hosted voices) can be metered, and metering needs a server-side ledger. That tension with the "no servers we pay for" rule in CLAUDE.md needs an owner decision. The Workers Free plan (100,000 requests per day) may be enough for a ledger at first (inference).

### Gaps
- Official Kling, Azure per-character price, Omni 1.1 and OmniHuman prices not fetched; secondary figures are marked.
- Google's Veo 3.1 shutdown date means current provider prices may change within days; re-verify before pricing credits.
- No data on cloud storage cost, a ledger database cost, or the activation rate to video 3.

---

## 5. Which V1 features are cheap to serve for free and which are costly

### Takeaway
Everything that runs in the user's browser or on the user's own free Hugging Face Space costs the owner $0 and can be free. The costly features are all server-side generation: AI-generated clips ($3.00 to $3.60 per 30 s at Veo 3.1 Fast list) and photo-to-avatar through an API ($4.20 to $4.80 per 30 s), which must be prepaid or capped.

### Cited Findings
- AI clips by API: Veo 3.1 Fast $0.10 to $0.12 per second, Lite $0.05 to $0.08, Standard $0.40; no free tier. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Avatar API: OmniHuman $0.14 to $0.16 per second on fal.ai (secondary). — [fal.ai](https://fal.ai/models/fal-ai/bytedance/omnihuman)
- Free GPU on the user's own account: ZeroGPU gives about 3.5 minutes per day to free accounts (forum-sourced), which is the user's quota, not the owner's cost. — [HF forum](https://discuss.huggingface.co/t/zero-gpu-daily-quota/168376)
- TTS: Azure free tier 0.5M characters per month; Gemini TTS free tier listed. — [Azure Speech](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/), [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Voice cloning at hosted vendors: Azure custom voice is limited access with amounts not retrieved; HeyGen includes 1 voice clone on its free plan and Runway Pro includes 1 custom voice clone, so competitors bundle cloning at low tiers. — [HeyGen](https://www.heygen.com/pricing), [Runway](https://runway.com/pricing)
- Local-only rule from the repo: media never leaves the device; avatar and voice clone run on the user's own free Hugging Face Space as an opt-in. — D:\introcut\CLAUDE.md (local file)

### Inferences
| Feature | Where it runs | Owner cost per use | Recommendation |
|---|---|---|---|
| Code-made 30 s video (own canvas renderer, MP4 export) | User's browser | $0 | Free for 3 videos; unlimited on Creator |
| Merging AI clips the user made in free tools (Flow, Kling, Wan) | User's browser (WebCodecs/Mediabunny), file stays on device | $0 | Free; it is the core value of the "middleman" |
| Script help, idea check | WebLLM in browser or user's own free key | $0 | Free |
| Script help with a server-paid allowance | Provider API | $0.018 to $0.059 per free user over 3 videos (S2) | Optional; cap per user; may switch off if abused |
| TTS with built-in or local voices | Browser | $0 | Free |
| Premium cloud voices (Nepali/Hindi) | Azure/Gemini | about $0.007 per 30 s (Azure $15 per M chars, 450 characters) | Cheap enough for a monthly cap on Creator; discount regionally is safe |
| Voice clone, opt-in on the user's own free Hugging Face Space | User's own HF account | $0 to owner (the user's ZeroGPU quota) | Free; consent phrase required |
| Voice clone hosted by Introcut | Server GPU | not priced (HF PRO reference $1 per 10 GPU minutes = $0.10 per minute; time per clone unknown) | Paid only; verify cost before offering |
| Avatar from a photo, simple local animation (if built) | Browser | $0 | Free |
| Avatar from a photo, lip-synced via API | Server GPU/API | $4.20 to $4.80 per 30 s (0.14 x 30; 0.16 x 30) | Prepaid credits only; never free |
| Avatar on the user's own free HF Space | User's account | $0 to owner; free quota about 3.5 min per day, so about 1 short clip per day if a clip takes about 3 GPU minutes (ASSUMPTION) | Free, opt-in |
| API-generated AI clips | Provider API | $3.00 to $3.60 per 30 s (Veo 3.1 Fast); $12.00 at Standard | Prepaid credits at 2x to 2.5x cost |
| Channel management (calendar, ideas, local project folders) | Browser storage | $0 | Free; strong retention feature, cheap to serve |
| Cloud sync of channel data and projects | Server storage | ASSUMPTION $0.30 per payer per month | Creator feature |
| Direct publishing to YouTube/Facebook | Platform APIs and OAuth | not researched | Gap |

- Retention logic: channel-management features cost nothing and bring people back weekly, while the free tier has only 3 videos. Charging for cloud sync of that data (the only part needing a server) aligns cost with value.
- Shy-beginner avatar and voice features carry safety obligations (own face and voice, consent phrase, "AI-generated" label), per CLAUDE.md. Hosted cloning raises the cost and the abuse surface, so keep it paid or on the user's own Space.

### Gaps
- Per-clip GPU time for avatar and voice clone on ZeroGPU is unknown; no benchmark found.
- YouTube/Facebook publishing API cost and quota not researched.
- Whether HF's free ZeroGPU terms allow an app to route other people's usage through one Space was not checked.

---

## 6. What to charge for (ranked by cost-to-serve and willingness to pay)

### Takeaway
Comparable tools charge for watermark removal, higher resolution and length, AI credits, storage, brand kit, voice clone or avatar features, seats and faster generation. Zero-marginal-cost items (no end card, brand kit, packs, longer or higher-quality local export) are the safest to sell; AI credits must be prepaid and capped.

### Cited Findings
- Watermark removal is a paid lever at HeyGen and Fliki. — [HeyGen](https://www.heygen.com/pricing), [Fliki](https://fliki.ai/pricing)
- Resolution and length tiers: Fliki free 720p and 5-minute export, Standard 1080p and 15 minutes; HeyGen free 1 minute, Creator 1080p and 30 minutes, Pro 4K. — [Fliki](https://fliki.ai/pricing), [HeyGen](https://www.heygen.com/pricing)
- Brand kit, voice clone, storage: Runway Pro includes 1 Brand Kit, 1 voice clone, 100 GB (Standard 20 GB, Free 5 GB); HeyGen Business has a brand kit and 5 custom avatars; CapCut Pro lists 1 TB cloud storage (secondary). — [Runway](https://runway.com/pricing), [HeyGen](https://www.heygen.com/pricing), [Hooked](https://www.hooked.so/compare/capcut-pricing)
- Seats and speed: HeyGen Business $149 plus $20 per seat; invideo seats up to 5, 10, 20; Runway parallel generations 5, 15, 20 by tier. — [HeyGen](https://www.heygen.com/pricing), [invideo](https://invideo.io/pricing/), [Runway](https://runway.com/pricing)
- Higgsfield free has no commercial use rights, so commercial licence is also a tier lever (secondary). — [Creatify](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay)

### Inferences
Ranked by cost-to-serve (low first), with a judged willingness to pay (WTP, not measured):
1. No "made with Introcut" end card: $0 cost, WTP medium-high.
2. Brand kit, premium templates, character and scene packs: about $0 (static files), WTP medium.
3. Higher resolution or longer export (browser rendered): $0 cost, WTP medium; weak phones may fail.
4. Cloud sync and backup of projects and channel data: about $0.30 per month, WTP low-medium.
5. Nepali/Hindi premium voices: about $0.007 per 30 s, WTP medium-high locally.
6. Avatar from a photo and hosted voice clone: $4.20 to $4.80 per 30 s for avatars, so credits only; WTP high among shy beginners (the owner's target).
7. AI clip credits: $3.00 to $3.60 per 30 s at list; sell prepaid at 2x to 2.5x.
8. Team and agency seats, priority generation: later.

### Gaps
- No evidence on what Nepali or Indian creators specifically buy.
- No A/B data on conversion lift from end-card removal.

---

## 7. Abuse and fraud

### Takeaway
The only quantified datapoint found: Stripe, relayed by Adex, says more than 1 in 6 (about 17%) of AI-platform signups link to multi-account abuse. The cheapest defence is not to give anything costly away free; the next is Google sign-in, Turnstile and a server credit ledger.

### Cited Findings
- Stripe (secondhand via vendor Adex): at AI companies, more than one in six signups is linked to multi-account abuse (about 17%); Stripe's models found 6.2x more abusive free trials from November 2025 to February 2026 than a year earlier. The original Stripe publication was not checked and the sources are vendor marketing. — [Adex](https://adex.com/blog/free-trial-abuse-saas), [Stripe resource](https://stripe.com/resources/more/real-time-api-abuse-prevention-for-saas-and-ai-platforms)
- Defences named: persistent device identification (survives cleared cookies, new email, rotated IP), card at signup, CAPTCHA, disposable-email and IP reputation checks, layered detection, and scoring registration before provisioning credits so compute is not spent. These are vendor recommendations. — [ShieldLabs](https://shieldlabs.ai/blog/how-to-prevent-free-trial-abuse), [Adex](https://adex.com/blog/free-trial-abuse-saas)
- Cloudflare Turnstile Free plan: unlimited challenges, 20 widgets per account. — [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)
- Workers Free: 100,000 requests per day; Workers Paid $5 per month. — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- Competitor controls visible on pricing pages: HeyGen caps free to 3 videos, 1 seat and watermark, and reportedly removed free API credits in February 2026; Runway free credits are one-time (125), not monthly; Midjourney reportedly removed its free tier (author's claim). — [HeyGen](https://www.heygen.com/pricing), [Runway](https://runway.com/pricing), [SaaStr](https://www.saastr.com/freemium-is-back-the-ai-edition-but-youll-still-probably-need-50-million-active-users-for-freemium-to-actually-work-as-a-business-model/)

### Inferences
- If the free tier is browser-only (S1), a multi-account abuser costs the owner $0. Abuse risk then applies only to server-paid items (text allowance, voices, AI credits).
- Applying the 17% figure as an ASSUMPTION to the server-paid text allowance: if 17% of signups are abusive and each abusive account takes the full $0.059 allowance repeatedly, the cost scales with account count, not with real users. Capping total spend per day at the ledger removes unbounded risk.
- Cheap stack: Google sign-in only (already planned; identity only), Turnstile (free), server ledger on Workers ($0 up to 100,000 requests per day, $5 per month after, per official pages), prepaid credits only, daily global spend cap. Limits: Google accounts are cheap to create, Turnstile does not stop humans, and shared carrier-grade NAT IPs in Nepal and India could cause false positives on IP limits (ASSUMPTION).
- A client-only counter cannot be trusted in an MIT browser app; tldraw's licence key is verified locally with no server call, illustrating that client-side enforcement is advisory and rests on the licence. — [tldraw license key](https://tldraw.dev/sdk-features/license-key)

### Gaps
- No abuse rate for creator tools, Nepal or India.
- No cost data for device-fingerprinting vendors; no competitor's disclosed anti-abuse stack beyond pricing-page limits.

---

## 8. Open source plus paid hosted service

### Takeaway
MIT lets anyone fork Introcut, strip an end card or paywall and host it. The sourced precedents show four routes: AGPL plus hosted convenience (Plausible), MIT plus a separate proprietary directory (PostHog), going closed (Cal.com in April 2026, MIT fork left behind), and source-available licences with a paid key (tldraw, Remotion). Remotion and tldraw are not permissive, so neither can be a dependency under the repo rule.

### Cited Findings
- **Plausible:** AGPL-licensed Community Edition; the company says its only funding is its managed cloud service. Self-hosted releases come about every six months while cloud updates ship several times a week. About 18,000 paying subscribers per its about page (an older mirror said 12,000+). — [Plausible self-hosting docs](https://plausible.io/docs/self-hosting), [Plausible about](https://plausible.io/about)
- **PostHog:** main repo MIT except an `ee` directory with its own licence (premium features need a licence); a separate fully open-source mirror (posthog-foss) strips proprietary code; hosted cloud has a free monthly allowance (first 1 million events) then usage pricing. — [PostHog project structure](https://posthog.com/docs/contribute/project-structure)
- **Cal.com (April 2026, about 6 months ago, borderline):** secondary reports say that on 15 April 2026 it moved its production code to a private repository and relicensed the public code from AGPL-3.0 to MIT under the name Cal.diy, citing AI-driven security risk; the hosted, Teams and Enterprise offerings are no longer open. Authoritative terms were not checked. — [Noqta](https://www.noqta.tn/en/blog/cal-com-closed-source-ai-open-source-reckoning-2026), [FOSS Force](https://fossforce.com/2026/04/ai-pushes-cal-com-to-shutter-open-and-go-nonfree/)
- **tldraw:** earlier Apache-2.0, then a licence that allows commercial use with a visible "Made with tldraw" watermark and requires a paid Business License to remove it; a CLA protected the right to relicense; key verified on the client. Cannot be distributed as a standalone product. — [tldraw license](https://tldraw.dev/community/license), [tldraw SDK License](https://tldraw.dev/legal/tldraw-license), [tldraw announcement](https://tldraw.substack.com/p/license-updates-for-the-tldraw-sdk)
- **Remotion (official licence file):** free for individuals, for-profit organisations up to 3 employees, non-profits and evaluators; a paid Company License for larger for-profits; you cannot copy or modify it to sell your own derivative; the page does not call it open source; the licence changes in 5.0. — [Remotion LICENSE](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- **Repo rule:** D:\introcut\CLAUDE.md allows only MIT/Apache-style or similarly permissive dependencies; Mediabunny (MPL-2.0) allowed unmodified; Remotion not allowed. (local file)

### Inferences
- What MIT allows: anyone may fork, modify, rebrand and host Introcut commercially, including removing an end card, with only the licence and copyright notice kept. The code licence cannot stop this; only trademark, server-side value and convenience can (general reasoning, not legal advice; trademark rules in Nepal were not researched).
- Mitigations in order of strength: (1) keep paid value server-side in a separate private or differently licensed repository (credit ledger, AI proxy, sync, hosted voices), as PostHog's `ee` and Cal.com's split do; (2) register or at least consistently use the "Introcut" name and logo, and state a trademark policy that lets forks exist under another name; (3) sell convenience (sign-in, preconfigured key, support, regional payments); (4) accept that the end card is advisory.
- Licence compatibility with the "permissive only" rule: the rule covers imports. An MIT client plus a separate closed server is compatible. Do not bundle AGPL, GPL or source-available code (including tldraw and Remotion) into the client. AGPL is a possible choice for the server only if the owner wants forks of the hosted service to share changes (Plausible's route), but AGPL code cannot be copied into the MIT client, and AGPL contributions from the client would conflict with MIT.
- Relicensing later requires contributor consent. tldraw used a CLA; if the owner might ever add a source-available layer, adopt a CLA before outside contributions arrive (inference).
- Plausible's pattern (code open, cloud sold, releases lag behind cloud) is the closest fit for a solo developer: self-hosting is possible but needs infrastructure the target user (a shy beginner) does not want to run.

### Gaps
- Supabase, Ghost and Excalidraw+ were not researched (no results retrieved); do not cite them from memory.
- No legal review of trademark options in Nepal; no data on how often MIT SaaS products are forked and hosted competitively.
- Cal.com details need checking against its own announcement.

---

## 9. Recommendation: packaging proposal, break-even table and riskiest assumptions

### Takeaway
Keep the free tier at zero server cost and sell zero-marginal-cost features on a low-priced Creator plan. Sell AI clips and photo-to-avatar only as prepaid credits at 2x to 2.5x provider cost, never as unlimited. All prices are hypotheses.

### Cited Findings
- Market anchors: HeyGen Free 3 watermarked videos per month; Creator $29 or $24 annual. Runway Standard $15 or $12 annual; non-expiring top-ups. invideo Basic $9 or $4-$5 annual. Descript Hobbyist about $16 annual (secondary). — [HeyGen](https://www.heygen.com/pricing), [Runway](https://runway.com/pricing), [invideo](https://invideo.io/pricing/), [Castmagic](https://www.castmagic.io/blog/descript-pricing)
- Fee and conversion inputs: Paddle 5% + $0.50; freemium median 2.1%. — [Paddle pricing](https://www.paddle.com/pricing), [RevenueCat 2026](https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026.md)
- Provider cost anchors: Veo 3.1 Fast $0.10-$0.12 per second; OmniHuman about $0.14-$0.16 per second (secondary). — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing), [fal.ai](https://fal.ai/models/fal-ai/bytedance/omnihuman)

### Inferences (proposal; every number is an ASSUMPTION to test)

| Tier | USD | NPR / INR (regional) | Included | Owner cost |
|---|---|---|---|---|
| Free | $0 | $0 | 3 finished videos (lifetime), browser-rendered, 1080x1920, "made with Introcut" end card; clip merging, local scripts (WebLLM or own key), local channel planner; avatar and voice clone only on the user's own free HF Space | about $0 (S1) |
| Creator | $6 per month or $48 per year | NPR 399 per month, NPR 3,499 per year; INR 199 per month, INR 1,499 per year | Unlimited browser videos, no end card, brand kit, packs, cloud sync, capped Nepali/Hindi premium voice minutes | about $0.30 per month plus under $0.01 per voiced video |
| Studio | $15 per month or $120 per year | USD list (no regional discount on AI-backed features) | Creator plus a monthly AI allowance worth at most 50% of net revenue (about 1 story or 1 avatar clip) | at most $6.88 per month (0.5 x 13.75) |
| Credit packs | prepaid, never expire | priced at 2x to 2.5x provider cost | AI clips, photo-to-avatar clips, hosted voice clone | 50% to 60% gross margin; cannot lose money |

Break-even at the proposed prices (same model as Section 4, F = $50, N = 1,000):
- Creator at $6: net = 0.95 x 6 - 0.50 = $5.20; p* = 50 / (1000 x (5.20 - 0.30)) = 50 / 4,900 = **1.02%**.
- Creator at regional $2.85: net = 0.95 x 2.85 - 0.50 = $2.21; p* = 50 / (1000 x (2.21 - 0.30)) = 50 / 1,910 = **2.62%**, above the 2.1% median. So regional pricing only works if local fees are lower than Paddle's 5% + $0.50 or if volume is high.
- Studio at $15 with 1 story included: **0.53%** (S3); with 3 stories used: **3.45%** (S3b), so the cap is essential.
- The 3-free-then-pay design at $5, $9 and $15 (the brief's three price points), S1 (no server AI for payers): 1.27%, 0.65%, 0.37%. With the text allowance at 2027 Gemini prices (S2b): 2.76%, 1.41%, 0.81%.
- Never include AI video in a $5 plan (S3: net below cost). Never give a free AI story (S4: 30% to 52% needed).
- Because Veo 3.1 is slated to shut down on 22 October 2026, build the credit price from a provider-agnostic cost table and review it monthly.

Three riskiest assumptions to test with the first users:
1. **Payment feasibility and willingness to pay in Nepal and India.** Test whether a Nepal-based seller can be paid out by Paddle or an alternative, whether Nepali users can pay recurring USD, and whether NPR 399 / INR 199 is acceptable. Run a waitlist pre-sale with both a subscription and a one-time prepaid pack.
2. **Conversion at or above 1% to 2% among users who finish video 3**, and the share of signups that reach video 3 (if under about 40%, signup-level conversion falls proportionally).
3. **Whether an MIT browser-run client can hold a paywall.** Measure how many users self-host or fork and strip the end card, and whether server-side value (credits, sync, voices) is worth paying for. Related: whether AI clip and avatar costs still hold at current provider prices.

### Gaps
- All price points, ARPU, exchange rates, $0.30 storage cost, $50 fixed cost, churn and activation rates are assumptions with no source.
- Not verified: seller eligibility and payouts from Nepal, tax handling, the "no servers we pay for" rule versus a server-side ledger (owner decision), and per-clip GPU time for avatar and voice clone.
