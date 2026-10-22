# AI video middleman / reseller: provider terms and aggregator economics (PARTIAL, research cut short)

Status note for the report writer: the research session hit a tool usage limit ("session limit, resets 4:25pm Asia/Kathmandu") after about 12 successful tool calls. Only the Google Gemini API terms, fal.ai terms, Replicate terms, Luma API terms and Higgsfield coverage were read. Runway, Google Cloud/Vertex, Kling, MiniMax, BytePlus and DashScope terms, referral programs, wrapper-failure evidence, Fiverr/UGC pricing and the user-count economics were NOT researched. Those are listed under Gaps. Nothing below is invented. All fetched pages were summarised by a small model, so quotes marked "as returned" should be re-checked against the page before being relied on. Today is 2026-10-22. This is research, not legal advice; a lawyer is needed before any resale product.

## 1. Provider terms for building on video APIs and reselling generations or credits

### Takeaway
Read so far: Luma's API terms forbid resale without written consent. Replicate's terms forbid sublicensing and offering the service to others like a service bureau. fal.ai's terms (as returned) forbid reselling the customer's rights and say not to expose the APIs directly to end users. Google's Gemini API terms allow "API Clients" for end users (with a paid-tier requirement in the EEA/UK/Switzerland) and say nothing on resale. Raw "buy credits from Introcut, Introcut calls the API" resale is clearly forbidden by Luma, probably forbidden by fal and Replicate, and unclear for Google.

### Cited Findings

#### Google Gemini API (Veo / Gemini video via API)
- Terms page shows "Last updated: 2026-04-28 UTC (Effective March 23, 2026)" (under 6 months old) — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
- API Clients are expressly contemplated: "You may only access the Services (or make API Clients available to users) within an available region" (as returned) — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- EEA/UK/Switzerland: "You may use only Paid Services when making API Clients available to users in the European Economic Area" (as returned; the page's wording on UK and Switzerland should be re-checked) — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Competing models: "You may not use the Services to develop models that compete with the Services (e.g., Gemini API or Google AI Studio)." — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Output ownership: "Google won't claim ownership over that content." Google may generate similar content for others — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Disclosures: Google's terms mention that third-party/Google-provided content "may require the provision of attribution to your users when returned as part of an API call" (as returned) — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Age: "You must be 18 years of age or older to use the APIs." This applies to the developer; the end-user age rules were not checked — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Data: Unpaid Services: Google uses submitted content and responses to improve its products. Paid Services: Google does not use prompts or responses for that — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- The page as returned did not address resale/sublicensing, rate limits or account sharing. These are in other documents (the general Google APIs Terms, the Prohibited Use Policy, rate-limit docs) that were not read.
- Vertex AI Veo guidelines: safety filters aim to block inputs/outputs violating the Google Cloud Acceptable Use Policy and the Generative AI Prohibited Use Policy. Person/child generation can need project approval via a Google account representative — [Veo on Vertex responsible AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/responsible-ai-and-usage-guidelines)

#### Luma API (Dream Machine / Ray)
- Terms "Last updated: April 28, 2026" (under 6 months old) — [Luma API terms](https://lumalabs.ai/api/terms)
- Resale ban: API-specific restriction 4, "resell, sublicense, or otherwise make the Services, APIs, or Output available to third parties", requires Luma's prior written consent (as returned) — [Luma API terms](https://lumalabs.ai/api/terms)
- Building an app is allowed in principle: "API User" is defined as any end user or customer who accesses the Services, APIs or Output. The Customer must ensure all API Users are bound by written terms of service — [Luma API terms](https://lumalabs.ai/api/terms)
- Content moderation: "Customer shall implement and maintain reasonable content moderation policies." — [Luma API terms](https://lumalabs.ai/api/terms)
- Rate limits: Luma may impose and change rate limits and quotas in its sole discretion — [Luma API terms](https://lumalabs.ai/api/terms)
- Competing products: no use of the APIs to build or support a product that competes with Luma, including products that substantially replicate its core functionality (as returned) — [Luma API terms](https://lumalabs.ai/api/terms)
- Output ownership and watermark: not addressed on this page (refers to the Enterprise and Individual User Terms, not read) — [Luma API terms](https://lumalabs.ai/api/terms)

#### fal.ai (marketplace / inference platform)
- Terms "Last Updated: September 8, 2026" (as returned; under 6 months old) — [fal.ai terms](https://fal.ai/terms)
- Section 6(e)(12) prohibits to "resell, transfer, assign, or sublicense Customer's rights under these Terms to any third party" (as returned) — [fal.ai terms](https://fal.ai/terms)
- Section 4(a) limits access to "your own personal or internal business use"; Section 4(b)(ii) says "Client will not expose any of the Services APIs directly to any End Users" (as returned) — [fal.ai terms](https://fal.ai/terms)
- Section 6(e)(9) prohibits building scripts or integrations "unless first authorized in writing by Company" (as returned, odd for an API company, probably refers to the consumer UI; verify) — [fal.ai terms](https://fal.ai/terms)
- Section 14: third-party hosted models may carry extra terms; outputs from them may not be used to develop competing products or train AI models — [fal.ai terms](https://fal.ai/terms)
- Account sharing: "You may not share or permit others to use your individual account credentials." — [fal.ai terms](https://fal.ai/terms)
- Output ownership: the terms as returned do not expressly address ownership of Output; customer owns its Input — [fal.ai terms](https://fal.ai/terms)
- API use is governed by separate "API Services Supplemental Terms" (section 6(g)). I tried `fal.ai/api-services-supplemental-terms` and got 404; the real URL was not found, so the API-specific terms are unread — [fal.ai terms](https://fal.ai/terms)
- Enterprise/reseller programme: not found on the terms page.

#### Replicate
- Terms "Last Update: April 1, 2026" (under 6 months old) — [Replicate terms](https://replicate.com/terms)
- Section 2.1: "non-exclusive, non-transferable, revocable, non-sublicensable right to access and use the Services"; Section 2.7(c)(iii) bars you from "rent, lease, lend, sell, sublicense, assign, distribute, publish, transfer" and from making the Services available to others, including as a service bureau or cloud offering (as returned) — [Replicate terms](https://replicate.com/terms)
- Output: Section 5.1 refers to "your use of Output for commercial purposes such as sale or publication", subject to Third Party Terms of the model used — [Replicate terms](https://replicate.com/terms)
- Section 2.5/2.7(c)(i): you must comply with Third-Party Terms (model licences) — [Replicate terms](https://replicate.com/terms)
- Account sharing: login credentials may not be shared with anyone other than the specific Authorized User (2.7(c)(ii)) — [Replicate terms](https://replicate.com/terms)
- Note: the clause bans making the service itself available. Selling a different product (a finished video) that uses outputs may be allowed. That is an inference, not tested.

#### Kling
- I could not read Kling's official API/business terms. A search returned only third-party summaries that say commercial rights depend on the access route (direct vs third-party reseller), model version and plan, and that the consumer ToS shifts content-moderation liability to the user (secondary sources, not the text) — [WaveSpeed guide](https://wavespeed.ai/blog/video-model-access/can-i-use-kling-ai-api-for-commercial-projects/); [ConductAtlas summary](https://conductatlas.com/platform/kling-ai/kling-ai-terms-of-service/)
- Status: unclear, mark "verify". The consumer policy ban noted in the brief stands as previously researched.

#### Runway, MiniMax/Hailuo, BytePlus Seedance, Alibaba DashScope Wan, Google Cloud service terms
- Not read. The Runway API terms URLs I tried (`runwayml.com/api-terms-of-use`, `runway.com/api-terms-of-use`, `runway.com/terms-of-use/api`) redirected to runway.com and returned 404 — [attempted](https://runway.com/api-terms-of-use). The real URL needs to be found (check the Runway developer portal footer).
- Status for all: unknown, mark "verify".

### Inferences
- A model of "user pays Introcut credits, Introcut's single API key generates" is the exact pattern Luma (4) and fal/Replicate (resale/sublicense/service bureau) prohibit in text. Google is the only reviewed provider whose terms explicitly contemplate "API Clients" serving end users, so it is the most defensible upstream, but its resale position is still unverified.
- Providers distinguish "building an application on the API" (allowed, with end-user terms and moderation duties) from "reselling the API or credits" (forbidden). An app that sells finished stories as a product (value-add layer) may sit in the allowed zone; a credit store for raw generations does not. A lawyer or written provider consent is needed to be sure.
- Even where terms are silent (Google), the paid-tier requirement for EEA users means a free tier funded by free-tier API keys would train Google on users' content and is not allowed for EEA users.

### Gaps
- Primary terms for Runway, Kling (business), MiniMax, BytePlus, DashScope, Google Cloud service-specific terms and Google's general API terms (resale/sublicense, SynthID/C2PA obligations) were not read; research tools hit a usage limit.
- fal.ai API supplemental terms and any fal reseller/enterprise programme not found.
- No quotes on watermarking/SynthID/C2PA from any provider reviewed.

## 2. Existing aggregator models (Higgsfield, Krea, OpenArt, Freepik, Pollo, Hedra, Pika, Leonardo)

### Takeaway
Only Higgsfield was researched. It is the strongest public proof that a multi-model aggregator can scale (large company-reported run rate, cash-flow positive early), but its margins are not audited and the founder says they are far below SaaS levels. Its growth also came with serious reputational and refund-style complaints. Others: not researched.

### Cited Findings
- Higgsfield aggregates 12+ third-party models (Sora 2, Veo 3.1, WAN 2.5/2.6, Kling) and uses GPT models for planning; claims to integrate new models within 24 hours; 100+ cinematic templates, click-to-video workflows, Cinema Studio, Click-to-Ad, UGC Factory — [Product Growth teardown, Mar 2026](https://www.productgrowth.blog/p/higgsfield-growth-teardown)
- Reported ARR milestones (company-reported or teardown author's timeline): $50M Aug 2025 (cash-flow positive), $100M Nov 2025, $200M Jan 2026, $300M Feb 2026; about 300K paying subscribers; about 100 employees; $138M raised by Jan 2026 — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown)
- Later claims: $400M Series B at $5.4B valuation with $700M annualized revenue (Aug 2026, PR Newswire as cited); on track for over $1B annualized (Bloomberg as cited, Sept 2026). Annualized revenue is a projection from recent weeks, not audited — [Remio analysis](https://www.remio.ai/post/higgsfield-1-billion-revenue-target-puts-ai-video-economics-on-trial)
- Margins: founder Alex Mashrabov quoted "Gross margins aren't like traditional SaaS, they're well below 80-90%" — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown). Remio says gross margin is not disclosed — [Remio](https://www.remio.ai/post/higgsfield-1-billion-revenue-target-puts-ai-video-economics-on-trial)
- A search summary attributed to a CEO podcast, claiming 80%+ margins on open-weight models versus 20-30% on closed models, positive gross margin since the start of 2026, and routing to cheaper models in over 40% of cases. This came from a secondary summary only (not read in full). Treat as anecdotal — [Trending Topics](https://www.trendingtopics.eu/higgsfield-1-billion-revenue-in-18-months/) (search result, page not opened; URL as returned by search was https://www.trendingtopics.eu/higgsfield-1-billion-revenue/)
- Pricing: credits, Free tier to $125/month plans; third-party review says a 5 s Kling 3.0 720p clip is about 6 credits and premium models such as Sora 2 40-70 credits (secondary review) — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown); [Layer3 Labs pricing](https://www.layer3labs.io/guides/higgsfield-ai-pricing)
- "Unlimited" plans advertised at 65% off; users report throttling until buying more credits; Trustpilot about 4.0 across about 1,700 reviews with 22% one-star, complaints about credit "nerfing" and "good models now cost extra" (Mar 2026) — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown)
- Distribution: creator payouts ("Higgsfield Earn": 10,000+ creators, $1M+ paid, 50,000+ submissions, company-reported) used instead of performance ads; Forbes reportedly found offensive marketing and deepfake content; X account suspended for "inauthentic behavior" Feb 2026 — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown)
- Higgsfield is reportedly OpenAI's largest Sora 2 customer (article claim) — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown). Note the brief says the Sora API was switched off Sept 2026, which is a platform-risk example for aggregators.

### Inferences
- Aggregator margin depends on model mix: cheap/open models carry margin, premium closed models carry little. This is the mechanism that supports a "route to the cheapest adequate model" design.
- Higgsfield's growth is not a template for a solo founder: it spent on creator distribution, had direct partner-level relationships with model vendors, and drew abuse and reputation problems.

### Gaps
- Krea, OpenArt, Freepik, Pollo AI, Hedra, Pika, Leonardo, fal's own apps, Replicate apps: pricing, free credits, margins and differentiation not researched.
- Abuse/fraud handling and free-tier cost control (card verification, throttling, watermarks, credit expiry) for these companies: not found.
- Higgsfield's refund policy and free credit amount: not found.

## 3. Evidence on wrapper/aggregator sustainability

### Takeaway
Not researched beyond the Higgsfield material and two structural facts. No postmortems, shutdowns, price-war analyses or Fiverr/Upwork data were collected.

### Cited Findings
- Platform-risk example in the brief: Sora API switched off Sept 2026 (from earlier research, not re-verified here).
- Higgsfield differentiates through templates, workflows, speed of model integration and creator distribution, not a proprietary model — [Product Growth teardown](https://www.productgrowth.blog/p/higgsfield-growth-teardown)
- Luma's terms bar building products that "substantially replicate the Services' core functionality", so a provider can contractually block a wrapper that copies its own app — [Luma API terms](https://lumalabs.ai/api/terms)

### Inferences
- Moats that appear to exist in the reviewed material: templates, workflows, model-routing and planning layer, creator distribution. Moats that do not: access to the same model API.

### Gaps
- 2025-2026 wrapper postmortems/shutdowns, provider price cuts, Google Flow competition, agency/UGC reseller price points on Fiverr/Upwork/X: not searched.

## 4. Realistic economics for a solo founder at 10, 100, 1000 paying users

### Takeaway
No sourced data was gathered for conversion rates, chargebacks, refunds or support load, so I will not give revenue figures. Only inputs available are the brief's earlier cost figures (about $3 raw and $4.50 with retries per 30 s story).

### Cited Findings
- (none newly sourced; per-story cost figures come from the brief's earlier research and are not re-verified here)

### Inferences
- With a retry-loaded cost of about $4.50 per story, a $5 story pack leaves almost no margin after card fees and failed-generation costs. This is arithmetic on the brief's number, not a researched benchmark. Payment processor fees were not researched (and Nepal-based merchant access to Stripe/Paddle/Lemon Squeezy was not checked).

### Gaps
- Free-to-paid conversion, chargeback rates for AI video, support load, refund norms: not researched.
- Nepal payout options (Stripe unavailable in Nepal to my knowledge, unverified; merchant-of-record services such as Paddle or Lemon Squeezy need checking).

## 5. Safer variants (BYOK, credit packs with caps, affiliate programmes, selling the prompt engine/templates)

### Takeaway
Not researched against sources. Reasoning from the terms read: variants where the user holds their own provider account (BYOK) avoid the "resale" and "sublicense" clauses, because Introcut never resells the provider's service.

### Cited Findings
- Replicate and fal prohibit sharing credentials and offering the service as a service bureau, which describes a shared-key credit store but not a BYOK client where each user signs up themselves — [Replicate terms](https://replicate.com/terms); [fal.ai terms](https://fal.ai/terms)
- Luma's resale clause covers making "the Services, APIs, or Output available to third parties" — [Luma API terms](https://lumalabs.ai/api/terms). A BYOK flow where the user's own key calls Luma is not obviously covered, but it is not tested.
- Gemini API: the developer's own terms apply to the key holder, and end users in the EEA need Paid Services — [Gemini API terms](https://ai.google.dev/gemini-api/terms). Under BYOK the end user is the key holder, so the "API Clients" language is less relevant; this needs verification.

### Inferences
- Legal risk ranking (reasoned, not sourced): selling the prompt engine/templates (lowest) < BYOK < hard-capped credit packs through an enterprise or reseller agreement < shared-key credit resale (highest, contradicts Luma/fal/Replicate text).
- Cash risk: BYOK and template sales carry no upfront API spend; credit packs carry float risk; a free tier of generations carries unbounded cost unless the free tier is limited to non-generation features (prompt writing, curation, assembling clips users already made) which the current Introcut architecture already supports.

### Gaps
- Provider affiliate/referral programmes and rates (fal, Replicate, Runway, Luma, Kling, Higgsfield, Freepik, etc.): not researched.
- Whether any provider offers an official reseller programme: not found for fal (terms page links only to Enterprise).
- Provider terms on BYOK clients (key held by the end user): not read.

## 6. Verdict (provisional, based on partial evidence)

### Takeaway
Provisional: for a zero-capital solo founder in Nepal, avoid a shared-key credit-resale middleman. Prefer "Introcut sells the prompt/curation/assembly layer, user brings own provider key or own generated clips", with generations paid by the user to the provider. Confidence is moderate on the legal direction (three primary terms texts forbid resale-like models) and low on economics (no sourced data).

### Cited Findings
- See sections 1 and 2: Luma, Replicate and fal text restrict resale/sublicensing/service-bureau use; Higgsfield's founder says margins are far below SaaS levels.

### Inferences
- Keep the free tier on features with no per-use API cost; paid tier sells templates, the prompt engine and workflow. Avoid: reselling raw credits on one shared key, a free tier that spends the founder's API money, promising providers' free credits (Flow credits cannot be used via API, per earlier research), and anything touching the Kling consumer policy ban.
- Before launching any paid generation: get written confirmation from the chosen provider (Google is the best candidate on text) and have a lawyer review; also check how a Nepal-based seller can receive payments.

### Gaps
- Everything in the "Gaps" lists above. Recommended follow-up: a second research pass on (a) Runway, Kling, MiniMax, BytePlus, DashScope and Google Cloud terms, (b) referral programme rates, (c) wrapper postmortems and price-war evidence, (d) Fiverr/Upwork AI video agency pricing, (e) Nepal payment options.
