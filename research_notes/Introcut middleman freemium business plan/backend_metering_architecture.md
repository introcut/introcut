# Introcut backend: accounts, free-creation meter, credits ledger, payments webhooks, optional AI proxy (as of 2026-10-22)

STATUS OF THIS NOTE: Research was cut short. The tool session limit was hit after about 15 calls, before the auth, Vercel/Netlify/Deno/Appwrite/PocketBase/Turso/Neon, Paddle and moderation lookups. Only claims with an inline source are in "Cited Findings". Everything else is either labelled "Inference" (my own reasoning) or listed under "Gaps / verify". Nothing in Gaps should be treated as fact. All dated figures were fetched 2026-10-22 from official docs pages, so none is older than 3 months unless stated.

## 1. Platform options, free tiers and hard limits

### Takeaway
Cloudflare Workers Free + D1 + Durable Objects (SQLite) + Turnstile is the only candidate verified here that gives a hard-stop (no surprise bill) free tier with real limits that fit an auth + counter + ledger service. Supabase Free is generous (50k MAU) but pauses after 1 week of inactivity. Firebase Spark needs no card, but Cloud Functions are not available on Spark, so any server logic forces the Blaze plan.

### Cited Findings
**Cloudflare Workers (Free vs Paid)**
- Workers Free: 100,000 requests/day (resets 00:00 UTC), 10 ms CPU per HTTP request, 50 subrequests per invocation, 128 MB memory, 5 Cron Triggers, 100 Workers per account — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- When the Free daily request limit is exceeded Cloudflare returns Error 1027, and the route's fail mode decides whether the Worker is bypassed (fail open) or the error page is shown (fail closed). Exceeding CPU time returns Error 1102 and kills the request — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Workers Paid: minimum $5/month per account; 10 million requests/month included then $0.30 per extra million; 30 million CPU-ms included then $0.02 per extra million CPU-ms; no egress charges; per-invocation CPU up to 5 min (default 30 s). Page last updated Oct 2, 2026 — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- Workers Logs: 200,000 events/day, 3 days retention on Free; moves to Cloudflare Observability pricing from December 1, 2026 — [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- Sub-limits to know: queue consumers, DO alarms and cron have 15 min wall time — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)

**Cloudflare D1**
- Free: 5 million rows read/day, 100,000 rows written/day, 5 GB total storage; reset 00:00 UTC. No egress charge — [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- Paid: 25 billion reads/month and 50 million writes/month included; overage $0.001 per million reads, $1.00 per million writes; storage $0.75/GB-month beyond 5 GB — [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- Exceeding Free daily limits: queries stop and the API returns "daily limits exceeded" errors (hard stop, no bill). Going to Paid lifts the limit typically within minutes — [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)

**Cloudflare Durable Objects**
- Workers Free supports only SQLite-backed Durable Objects. Free: 100,000 requests/day, 13,000 GB-s/day duration, 5M rows read/day, 100,000 rows written/day, 5 GB stored. Exceeding a limit makes further operations of that type fail — [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- Paid DO: 1M requests/month included then $0.15/million; 400,000 GB-s/month then $12.50/million GB-s; SQLite storage billing took effect from about January 2026 — [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

**Cloudflare KV**
- Free: 100,000 reads/day, 1,000 writes/day, 1,000 deletes/day, 1,000 lists/day, 1 GB. Paid: 10M reads and 1M writes per month included — [KV pricing](https://developers.cloudflare.com/kv/platform/pricing/)

**Cloudflare Queues**
- Free: 10,000 operations/day, 24 hour retention fixed. Paid: $0.40 per million operations after 1M/month included, retention up to 14 days — [Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/)

**Cloudflare R2**
- Free tier (Standard): 10 GB-month storage, 1M Class A ops/month, 10M Class B ops/month; egress free. Paid: $0.015/GB-month, Class A $4.50/M, Class B $0.36/M — [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- Card requirement for R2: official page is silent. Blog and Reddit sources (anecdotal, 2025-2026) say Cloudflare asks for a payment method before R2 can be activated, even for free usage; a DEV Community guide says the opposite. Treat as "probably needs a card, verify in the dashboard" — [freetier.co](https://freetier.co/directory/products/cloudflare-r2); [eastondev.com (Nov 2025)](https://eastondev.com/blog/en/posts/dev/20251130-r2-picgo-setup/); contradicted by [DEV Community guide](https://dev.to/leonwong282/the-complete-beginners-guide-to-cloudflare-r2-image-hosting-2025-2g4k)

**Cloudflare Turnstile**
- Free: unlimited challenges/verifications, 20 widgets per account, 10 hostnames per widget, 7 days analytics, usable without other Cloudflare services — [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)

**Supabase**
- Free: $0, 50,000 Auth MAU, 500 MB database, 5 GB egress, 500,000 Edge Function invocations, 1 GB storage, paused after 1 week of inactivity, 2 active projects. Pro from $25/month: 100,000 MAU then $0.00325/MAU, 8 GB disk, 250 GB egress, 2M function invocations, no inactivity pause — [Supabase pricing](https://supabase.com/pricing)
- Card requirement for Free: the pricing page does not say — [Supabase pricing](https://supabase.com/pricing)

**Firebase**
- Spark plan says "No payment method needed". Every Cloud Functions row under Spark is "Not applicable"; free Functions quotas appear only under Blaze — [Firebase pricing](https://firebase.google.com/pricing)
- Auth (Identity Platform): 50K MAU free; phone auth billed per SMS — [Firebase pricing](https://firebase.google.com/pricing)
- Firestore free (Standard edition): 1 GiB stored, 10 GiB/month egress, 20K writes/day, 50K reads/day, 20K deletes/day — [Firebase pricing](https://firebase.google.com/pricing)
- Blaze may offer up to $300 free credit "if eligible" — [Firebase pricing](https://firebase.google.com/pricing)

### Inferences
- Cloudflare Free is the best "hard stop, no surprise bill" fit: D1/DO/KV limits stop operations instead of billing. That matches a zero-capital solo developer. The risk is the opposite one: at the limit the app breaks until 00:00 UTC rather than costing money. Design the client to fail gracefully (offline/local editing still works because everything media-related is local).
- The 10 ms CPU cap per request on Free is the real constraint for auth. Verifying an RS256 Google JWT uses WebCrypto (native), which I expect to be cheap, but I did not verify it counts little against the 10 ms. Measure it first. If it fails, the $5/month Workers Paid plan removes the cap.
- Supabase Free is attractive on MAU (50k) and gives real Postgres transactions, but the 1-week inactivity pause is a hazard for a low-traffic launch (the meter would be down). A keep-alive ping is a hack; Pro at $25/month is the honest fix.
- Firebase: Spark has no card but cannot run server code, so token verification, meter and webhooks all need Blaze (card, billing account with budget alerts but, as far as I know, no hard cap, verify). That conflicts with "no mandatory card".
- Vendor lock-in: D1 is SQLite, so schema and SQL port to Turso, Postgres (minor changes) or a self-hosted VPS. Durable Object code is the most Cloudflare-specific part, so keep it behind one small interface (`reserveCredit()`), or avoid it by using D1 batch statements.

### Gaps
- Vercel, Netlify, Deno Deploy, Appwrite, PocketBase (self-host), Turso, Neon: free quotas, cold starts, card requirements and overage behaviour not researched (session limit). Verify on each official pricing page before considering them.
- Whether Cloudflare requires a card to create an account or enable R2 for a Nepal-based developer: not confirmed by an official source. Verify by trying it.
- Whether Supabase Free requires a card: not stated. Verify.
- Cold starts: Workers are known for near-zero cold starts but I did not retrieve a source; Supabase Edge Functions and Firebase Functions cold starts not researched.
- Whether a Firebase Blaze budget can hard-stop spending: not verified.

## 2. Auth: verifying Google ID tokens, sessions, linking, abuse

### Takeaway
No fetch of Google's verification guide succeeded. The design below is therefore my own reasoning and the standard documented approach, and must be checked against Google's page before implementation.

### Cited Findings
- None retrieved for this question (the Google Identity verification page fetch failed because of the session limit). Intended source to check: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

### Inferences (not sourced, verify against Google docs)
- Verification steps the server must perform on every sign-in POST: fetch Google's public keys (JWKS) and cache them by Cache-Control; verify RS256 signature; check `iss` is `https://accounts.google.com` (or `accounts.google.com`); check `aud` equals Introcut's own OAuth client ID; check `exp`; read `sub` as the stable account key; require `email_verified` true if email is used. Never key accounts by email, only by `sub`.
- Nonce: the client generates a random nonce, sends it to Google, and the server issues the nonce beforehand (stored short-lived in KV/D1, single use) so a stolen ID token cannot be replayed. Optional but cheap.
- After verification, issue an own session: a random opaque session id in an HttpOnly, Secure, SameSite=Lax cookie stored server-side (D1/KV) is simpler to revoke than JWTs. Because the app and API can share a registrable domain (for example `app.introcut.app` and `api.introcut.app`), cookies work without third-party cookie problems. A short-lived signed JWT in memory + refresh cookie is the alternative if the API must be on another site.
- Account linking: keep one `users` row keyed by Google `sub`; if a second provider is ever added, link by a verified-email match only after re-authenticating with the first provider.
- Abuse resistance: Google-only login already costs the abuser a Google account per extra free creation. It does not stop someone making many Gmail accounts. Add Turnstile on the first sign-in/claim of the free quota, plus per-IP rate limiting. Do not promise it is unbeatable.
- Cost: free (Google Identity Services has no per-sign-in fee as far as I know, verify).

### Gaps
- No official confirmation of the JWKS/aud/iss/nonce procedure, the GIS library recommendation or the cost statement.
- Whether `google-auth-library`/`jose` run within the 10 ms Free CPU cap on Workers: not measured.

## 3. The free-creation meter (what to count, tamper resistance, ethics)

### Takeaway
Pure reasoning, no sources. Honest conclusion: because the editor and exporter run in an open-source browser client, a browser-side export cannot be forced to be metered. Only features that need the server (AI clips via proxy, cloud backup, hosted features) can be hard-enforced. The only way to enforce "3 free videos" on local export is a server-issued signed token that the client chooses to request, which a modified client can skip.

### Cited Findings
- None. All of this section is design reasoning. (The only sourced ingredient is that Durable Objects/D1 provide transactional single-writer storage on the free plan, see section 1.)

### Inferences
- Option A, count exports: client calls `POST /v1/exports/start` with a client-generated `export_id` (UUID). Server atomically does: if `export_id` already exists return the earlier result (idempotent); else if `free_used < 3` or credits >= 1, insert into `usage_events(export_id, user_sub, state='started')` and return a short-lived (for example 10 min) signed `export_token`. On success the client calls `POST /v1/exports/{id}/complete`; on failure `.../fail` which marks the event refunded. A started event with no completion after N minutes auto-refunds via a cron. The token can be embedded as a signed manifest in the MP4 metadata or simply recorded.
- What counts: count "started and token issued" as reserved, "completed" as consumed, "failed or abandoned" as refunded. Counting at start prevents starting unlimited exports and cancelling; refunding failures protects honest users.
- Tamper honesty: the MIT-licensed client can be modified to skip the call and export locally. No cryptography fixes that because the exporter code runs on the attacker's machine. Mitigations that do work are social/product ones: the official hosted build includes the check, the check is clearly documented, and paid value is attached to things that need the server (AI clips, cloud storage, brand kit, sync).
- Option B, count server-side AI features only: nothing to tamper with, since the server holds the keys and the ledger. Free tier becomes "3 free AI-assisted creations" or "N free credits on signup" rather than "3 free videos". Simplest, honest, and consistent with the privacy rule (no export data leaves the device). Recommended default.
- Hybrid: meter exports softly (server counter + nag paywall in the official build) but state in the docs that self-hosted/modified builds are unmetered. Be explicit in a licence/README note that the meter is a convenience of the hosted service, not a licence restriction on the MIT code, so forks are legitimate. Do not add anti-tamper obfuscation, DRM or telemetry to the MIT client: it contradicts the project's open-source and privacy stance and does not work anyway.
- Ethics of nagging: keep the paywall at the point of server-side value (clear message "AI clips cost real money, local editing stays free"), never block local editing of an existing project, and let people export what they already made. Shipping a blocking nag in an MIT client is allowed by the licence but erodes trust; the "only paid where we pay a vendor" framing is easier to defend.
- Data model sketch: `users(sub PK, created_at, free_used)`, `usage_events(export_id PK, sub, kind, state, created_at)`.

### Gaps
- No research done on what comparable open-source freemium tools (for example other browser editors) do. I did not find or cite any.

## 4. Credits ledger and idempotent payment webhooks

### Takeaway
Payment-provider eligibility is the first hard problem for a Nepal-based seller: Lemon Squeezy and Polar both do NOT list Nepal for payouts, and Stripe is not evidently available there.

### Cited Findings
- Lemon Squeezy: bank payouts only in the listed countries and Nepal is not listed; PayPal payouts are available in "200+ countries" so Nepal depends on PayPal's own list; if a country is on neither list the person cannot use Lemon Squeezy as a merchant. Customers from Nepal can buy (Nepal is not on the unsupported-customer list) — [Lemon Squeezy supported countries](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)
- Polar: payouts use Stripe Connect Express to residents or businesses in the listed countries; Nepal is not on that list — [Polar supported countries](https://polar.sh/docs/merchant-of-record/supported-countries)
- Stripe: I found no evidence that Nepal is a Stripe-supported merchant country. Stripe's own tax docs mention Nepal only for VAT on digital services. Stripe says Atlas lets anyone incorporate a US company, get a US bank account and activate Stripe, though the Nepal-specific eligibility is not confirmed — [Stripe tax Nepal page](https://docs.stripe.com/tax/supported-countries/asia-pacific/nepal); [Stripe global (example)](https://stripe.com/en-sg/global); [doola Stripe-in-Nepal guide (third party)](https://www.doola.com/stripe-guide/how-to-open-a-stripe-account-in-nepal/)
- Lemon Squeezy footnote: Stripe stopped accepting new Indian accounts in May 2024 except by invite, showing that Stripe-backed rails can disappear for a region — [Lemon Squeezy supported countries](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)
- Paddle: the supported-countries URL I tried returned 404, so no data — [attempted URL](https://developer.paddle.com/resources/supported-countries)

### Inferences (ledger design, standard patterns, no sources)
- Ledger: append-only `ledger(id, sub, delta, reason, ref_id UNIQUE, created_at, expires_at NULL)`. Balance = `SUM(delta)` over non-expired rows; cache it in `users.balance` updated in the same transaction. Never UPDATE or DELETE ledger rows; corrections are new rows (refund = positive delta with `ref_id` of the original).
- Atomicity: in D1 use a single `batch([...])` (atomic) containing `INSERT INTO ledger ... ; UPDATE users SET balance = balance - ? WHERE sub = ? AND balance >= ?`, then check changes. In Durable Objects (SQLite) use a per-user DO as the single writer so reservations cannot race. D1 batch is simpler and enough at this scale.
- Idempotency: the unique `ref_id` (provider event id such as the order id or the job id) means a replayed webhook inserts nothing. Webhook handler: verify the HMAC signature over the raw body with the provider secret, check timestamp tolerance, insert a `webhook_events(id PK)` row first, then apply the credit in the same batch, return 200 fast.
- Reconciliation: a nightly cron compares the sum of provider orders (provider API) with ledger purchase rows and alerts on drift. A reservation pattern for AI jobs: `reserve` (negative row, state pending), `commit` on success, `release` (positive row) on failure or timeout.
- Expiry: avoid it if possible (simpler, and in some jurisdictions expiring prepaid credits raises consumer-law questions, verify). If used, expire by a negative `expiry` ledger row created by a cron, never by deleting.
- Provider options for Nepal: a merchant-of-record that pays out via PayPal (if PayPal payouts work to a Nepal-based account, verify), a Stripe Atlas US company (cost and US tax filing obligations, verify), or selling through a platform that handles it. This choice may dominate the whole plan and must be resolved before any payment code is written.

### Gaps
- Paddle, Dodo Payments, Gumroad, Creem, local Nepali gateways (eSewa, Khalti, Fonepay) for international sellers: not researched. Nepal's rules for receiving foreign currency from digital sales (Nepal Rastra Bank / payment-service rules) not researched.
- Webhook signature formats and retry behaviour for Stripe/Paddle/Lemon Squeezy/Polar: not retrieved this session.
- Transaction fees (MoR percent + fixed) not retrieved, so unit economics at the paid tier cannot be computed from sources.

## 5. Proxying AI generation (keys, spend caps, async jobs, kill switch, moderation)

### Takeaway
Feasible on Cloudflare because Workers have no egress fee and no wall-time limit for HTTP, but the Free plan's 10 ms CPU and 50 subrequests mean a submit-and-poll design, never long streaming relays. The proxy is also the place where the money is, so it needs the strictest controls.

### Cited Findings
- Workers have no duration charge or HTTP wall-time limit, and Workers Paid has no egress/bandwidth charges — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/); [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Workers environment variables are 5 KB each, max 64 per Worker on Free (secrets are separate in Cloudflare, verify) — [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- R2 egress is free, so serving generated clips back to the user from R2 does not incur bandwidth cost; 10 GB-month free then $0.015/GB-month — [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- Queues Free allows only 10,000 operations/day with 24 h retention; consumers have 15 min wall time — [Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/); [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- Turnstile is free and unlimited, usable for gating the submit endpoint — [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)

### Inferences
- Secrets: store provider API keys as Worker secrets (`wrangler secret put`), never in the repo or `vars`. Never return keys to the client.
- Async job pattern: `POST /v1/jobs` (authenticated, idempotency key) -> server estimates cost from a fixed price table, reserves credits in the ledger, calls the provider with a callback URL or stores the provider task id -> returns job id. Client polls `GET /v1/jobs/{id}` (cheap D1 read). On completion a Worker copies the video to R2 with a lifecycle rule (for example delete after 24-72 h), commit credits; on failure release credits.
- Free-plan arithmetic problem: a polling client at one request every 5 s for a 2 minute job is 24 requests per job. 4,000 jobs/day would use the whole 100,000 requests/day budget. Use longer poll intervals, provider webhooks, or Paid.
- Cost estimate before submit: show "this will cost N credits (about $X)" from a static price table in the Worker; do not trust the client's estimate.
- Controls: per-user daily credit cap and per-user concurrent job cap (for example 2); a global monthly budget row in D1 (`budget_remaining_cents`) checked on every submit, with a hard kill switch (an env flag or D1 row read first in the handler) that returns 503; alerts when 50/80% consumed; separate provider API keys with provider-side spending limits where the provider offers them (verify per provider).
- Open-relay protection: never forward arbitrary URLs or prompts to arbitrary endpoints; accept only a fixed set of model ids and parameters, validate with Zod, cap prompt length, require an authenticated session plus Turnstile on first use, and rate limit per user and per IP.
- Request signing: server-to-provider uses the provider key; browser-to-server uses the session cookie plus an anti-CSRF header (see section 7). Signing individual browser requests adds little beyond that.
- Logging: store job id, user sub, model, credits, status, timestamps, provider task id, and a hash of the prompt at most. Do not store the prompt, the script or the media, and delete job rows after a retention period.
- Moderation hooks: run a prompt-text check before submit (a cheap provider moderation endpoint or keyword rules, verify which is free and permitted), and rely on the provider's own policy enforcement. The provider's terms may forbid reselling or proxying their API to third parties: that needs checking per provider before launching a paid proxy.

### Gaps
- Not researched: Provider terms on resale/proxying (Google Veo/Gemini API, fal, Replicate, Kling, Wan hosts), their per-clip prices, and moderation APIs. This is a major legal and cost unknown for the "paid AI clips" plan.
- Cloudflare Workers secrets limits and Browser Rendering free limits: not retrieved.

## 6. Privacy and compliance design

### Takeaway
Keep the privacy promise by storing only: account id (Google `sub`), counters, ledger and job metadata. Never store media or scripts. Specific EU/India/Nepal legal requirements were not researched, so this section is a design stance, not legal advice.

### Cited Findings
- None retrieved (no legal source was fetched). The only sourced technical hooks: Workers Logs retention is 3 days on Free, and D1 has no egress charges, so a data export or delete endpoint costs nothing extra to serve — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/); [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)

### Inferences
- Stored: `sub`, optional email (needed to send receipts; consider not storing it and relying on the payment provider's receipt), counters, ledger, job metadata, webhook event ids. Never stored: media files, scripts, ideas text beyond a transient proxy pass-through.
- On-screen wording suggestion: "Your videos and files stay on your device. We store your account id, how many creations you used, your credit balance and payment receipts, and for AI clips: the job status. We do not store your ideas or scripts."
- Deletion: `DELETE /v1/me` removes the user row and job rows; keep ledger rows only as anonymised financial records if tax law requires it (verify), using a tombstoned `sub`.
- Using a merchant-of-record means the provider is the seller to the buyer and handles sales tax/VAT and card data, which avoids PCI scope and most tax registration (verify per provider). That is the main way to avoid a heavy compliance regime.
- EU (GDPR) and India (DPDP Act 2023) basics: lawful basis, notice, deletion on request and breach notification apply once real users exist. Nepal's own privacy law (Individual Privacy Act 2018) also applies to the developer. None of these was researched; get a template privacy policy reviewed.
- Cloudflare logging default: Worker logs may contain IPs/requests; disable `console.log` of tokens and keep Workers Logs retention short.

### Gaps
- GDPR/DPDP/Nepal Privacy Act obligations, cookie-consent need for a strictly-necessary session cookie, and whether Google sign-in data triggers specific duties: not researched.
- Data-processor terms for Cloudflare and the payment provider: not researched.

## 7. Cost modelling at 100 / 1,000 / 10,000 MAU

### Takeaway
On verified limits, the auth + meter + ledger service for 10,000 MAU fits inside Cloudflare's free quotas on arithmetic, so the fixed cost can be $0. The first real costs are the $5/month Workers Paid plan (if the 10 ms CPU cap bites or the request count passes 100k/day) and the AI provider spend, which dwarfs infrastructure. All traffic assumptions below are mine.

### Cited Findings
- Limits used: Workers Free 100,000 req/day, 10 ms CPU — [Workers limits](https://developers.cloudflare.com/workers/platform/limits/); D1 Free 5M reads/day, 100k writes/day — [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/); Paid $5/month, 10M requests, $0.30 per extra million — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/); Supabase Free 50k MAU, 500 MB, 500k function calls, pause after 1 week; Pro $25/month — [Supabase pricing](https://supabase.com/pricing); Firebase Spark no card, no Functions; Auth 50K MAU free — [Firebase pricing](https://firebase.google.com/pricing)

### Inferences (arithmetic, assumptions marked)
Assumption set: each MAU makes 40 API calls/month (sign-in, session check, export start/complete, a few job polls) and 20 D1 writes/month. Peak day is 5 percent of monthly requests. Paid-AI users are 5 percent of MAU at 10 clips/month, 20 polls per clip.

Stack 1: Cloudflare Workers + D1 (Free, Paid as needed)
| MAU | API calls/month | Peak-day calls | vs 100k/day | D1 writes/day (peak) | vs 100k/day |
|---|---|---|---|---|---|
| 100 | 4,000 | 200 | 0.2% | 100 | 0.1% |
| 1,000 | 40,000 | 2,000 | 2% | 1,000 | 1% |
| 10,000 | 400,000 | 20,000 | 20% | 10,000 | 10% |
- AI polling add-on at 10,000 MAU: 500 paid users x 10 clips x 20 polls = 100,000 requests/month, about 5,000 on a peak day: negligible.
- Infrastructure fixed cost: $0 at all three sizes on arithmetic. Switch to Paid ($5/month, 10M requests included) if CPU time errors (1102) appear or a viral day exceeds 100k requests. Paid at 10,000 MAU: $5 since 0.5M requests is far below 10M included.
- R2 for AI clips: 500 users x 10 clips x ~20 MB = 100 GB written per month, but clips expire after 1-3 days, so standing storage is about 3-10 GB, inside the 10 GB-month free tier; Class A ops are tiny. Verify clip sizes.

Stack 2: Supabase
- 100 and 1,000 MAU: Free ($0) covers 50k MAU, but the project pauses after 1 week of inactivity, so a launch with gaps is risky. 10,000 MAU is within the 50k MAU limit and 500k function calls (400k assumed calls). Database 500 MB: at about 1 KB per ledger row and 20 rows per MAU per month, 10,000 MAU is about 200 MB/month, so storage is exceeded within 2-3 months without pruning. Plan for Pro at $25/month by roughly 10,000 MAU.

Stack 3: Firebase (Spark + Blaze)
- Auth is free to 50K MAU, Firestore free quota 50K reads/20K writes per day, but server logic needs Cloud Functions, i.e. Blaze with a billing account. Cost is probably $0-a few dollars at these volumes because Blaze has free quotas, but a card is mandatory — I did not retrieve the Functions free quota numbers, so the dollar figures are not computed (verify).

Where free tiers break (Cloudflare): around 100,000 requests/day, which under these assumptions is about 50,000 MAU, or sooner if polling is chatty. Or at 100,000 D1 writes/day. D1 and KV writes stop hard on Free: KV only has 1,000 writes/day, so do not use KV for counters or sessions at scale; use D1.

AI provider cost: not computed, no provider price was researched. Provider spend per paid clip is the real cost driver; price credits at cost plus MoR fees plus margin, and do not launch the proxy without a verified unit price.

### Gaps
- Payment provider fees and Nepal payout path unknown (see section 4), so net revenue per user cannot be modelled.
- Vercel/Netlify/Deno/Turso/Neon cost not modelled.

## 8. Security checklist for a solo developer

### Takeaway
No security source was fetched; the list below is standard practice from my own knowledge and should be checked against OWASP before implementation.

### Cited Findings
- Turnstile is free for bot protection on sign-in and job submit — [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)
- Cloudflare Free stops service rather than billing when daily limits are hit (D1, DO), which is itself a cost-abuse control — [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/); [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

### Inferences (verify against OWASP)
- Secrets: Worker secrets only; separate keys for dev and prod; rotate on any leak; never commit `.dev.vars`; use provider keys with spend limits. Webhook secret verified by HMAC on the raw body with constant-time comparison.
- CORS: allow exactly the production origin (and localhost in dev), `Access-Control-Allow-Credentials: true` only for that origin, never `*` with cookies.
- CSRF: SameSite=Lax session cookie plus a required custom header (for example `X-Introcut: 1`) or Origin header check on all state-changing requests; webhook endpoints are exempt but signature-verified.
- Rate limiting: per-user and per-IP counters in D1 or a DO (Cloudflare's built-in rate limiting rules are an option, not verified for the free plan); strict on `/auth`, `/jobs`, `/exports/start`.
- Open relay: allowlist models and parameters; no pass-through URL fetch (SSRF); size-limit request bodies.
- Dependencies: few server dependencies (a JWT library such as `jose`, Zod); pin versions; enable GitHub Dependabot and secret scanning (both free on public repos, verify).
- Backups: D1 has export via `wrangler d1 export`; schedule a weekly export to a private R2 bucket or a local copy; test a restore once. (Time Travel point-in-time restore exists in D1 but I did not verify the free-plan retention.)
- Observability: alerts on error spikes, 1027/1102 errors, webhook failures; a budget kill switch; a documented runbook.

### Gaps
- OWASP cheat sheets, D1 Time Travel retention, Cloudflare rate limiting rules on Free: not fetched.

## 9. Recommendation and implementation order

### Takeaway
Recommended stack: Cloudflare Workers (Hono or plain fetch handler) + D1, with Turnstile; add R2 and Queues only when the AI proxy exists. Meter AI/server features honestly (Option B) and treat local export counting as a soft, documented nicety. Resolve how to get paid from Nepal BEFORE building credits.

### Cited Findings
- Cloudflare Free tier components (Workers, D1, DO SQLite, KV, Queues, Turnstile) are free and hard-stop; $5/month Workers Paid is the upgrade path — see sections 1 and 7 sources (e.g. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/)).
- Payment-provider fit for Nepal is the blocker: Lemon Squeezy and Polar list neither bank/payout coverage for Nepal — [Lemon Squeezy](https://docs.lemonsqueezy.com/help/getting-started/supported-countries); [Polar](https://polar.sh/docs/merchant-of-record/supported-countries)

### Inferences
Order of work (smallest first):
1. Week 1, days 1-2: Workers project + D1 schema (`users`, `sessions`, `usage_events`, `ledger`, `webhook_events`). `POST /auth/google` verifying the ID token and setting a session cookie; `GET /me`. Keep all project data in OPFS as today.
2. Week 1, days 3-4: the counter: `/usage/start`, `/usage/complete`, `/usage/fail` with idempotent export ids; cron to release stale reservations; client paywall screen shown on the fourth creation in the official build. Document that forks are unmetered.
3. Week 1, day 5: privacy screen text, `DELETE /me`, data export, Turnstile on first sign-in. Weekly D1 backup.
4. Week 2: payments, only after confirming a provider that can pay a Nepal-based seller (open item). Hosted checkout link, webhook endpoint with signature check and idempotent ledger insert, credit pack products, reconciliation script.
5. After 2 weeks (separate milestone): AI proxy for one provider and one model, with kill switch, per-user caps, R2 expiry, and prior legal check of the provider's reseller terms.
Stays client-side: all editing, rendering, export (Mediabunny), media, scripts, project JSON, local project storage. Server sees account id, counters, ledger, job metadata only.
Challenge to the plan: "3 free videos" on local export is unenforceable; promise "3 free AI-assisted creations" or a starting credit balance instead, and keep local export free forever, which is also the strongest privacy and open-source message.

### Gaps
- All items marked verify above. Highest priority to verify: Nepal payout route (PayPal payout to Nepal, Paddle/Dodo/other MoR eligibility, Stripe Atlas cost); whether Cloudflare requires a card for a Nepal account/R2; provider API terms for resale; Google ID token verification page; legal basics.
