# Code-to-video platforms and APIs: render-as-a-service options for a middleman (INCOMPLETE: research stopped at a session limit on 2026-10-22)

STATUS WARNING FOR THE REPORT WRITER: The research tool hit a usage/session limit midway ("You've hit your session limit, resets 4:25pm Asia/Kathmandu"). Only the first ~14 tool calls completed. Verified so far: Creatomate, Shotstack, JSON2Video, Plainly, Rendi (pricing), Shotstack terms, partial Creatomate terms, Remotion Lambda cost figures. NOT researched: HyperFrames hosted options, Hera, Jitter, Canva Connect, Cloudinary, Mux, Diffusion Studio, Bannerbear/Placid, 2026 newcomers, Cloudflare Browser Rendering, GitHub Actions terms, VM costs, quality comparisons. Those are listed under Gaps. A follow-up research pass is needed. All prices below were read on 2026-10-22 (today), so none is older than 3 months unless noted.

## Which render-as-a-service options exist, and what do they cost? (price table, JSON spec, output)

### Takeaway
Four hosted JSON/template-to-MP4 APIs were verified (Creatomate, Shotstack, JSON2Video, Plainly) plus one FFmpeg API (Rendi). Cheapest per minute of output among those verified is Shotstack at 5 to 20 cents per rendered minute (volume to pay-as-you-go), then JSON2Video at roughly 4 to 6 cents per rendered minute at its larger packs ($49.95 for up to 120 min is about 42 cents/min on the small pack; see table). Plainly is a high-priced, agency-oriented product and is far too expensive for a freemium middleman. Rendi is only an FFmpeg-command runner, not a scene renderer.

### Cited Findings

Comparison table (all figures from each vendor's pricing page, fetched 2026-10-22):

| Platform | JSON scene spec via API? | Pricing (dated 2026-10-22) | Free tier / watermark | Max resolution | White-label / reseller |
|---|---|---|---|---|---|
| Shotstack | Yes (Edit API; "Director" and White Label Studio SDK also mentioned) | Pay as you go $10 one-time for 50 min (20 cents/min); Starter $39/mo for 250 min (15.6 cents/min); Pro $99/mo 750 min (13.2 cents/min); Scale $199/mo 2,000 min (10 cents/min); Volume $499/mo 10,000 min (5 cents/min) | 10 credits on signup, valid 30 days; page does not mention watermark | 1080p on PAYG and Starter; 4K on Pro and above | White-label editor on every plan (PolyForm Shield licensed); reselling see terms below |
| Creatomate | Yes (JSON "source"; also templates, JS Preview SDK) | Essential ~2,000 credits, Growth 10k-40k credits, Beyond 50k-200k credits per month. About 14 credits per minute of 720p/25 fps video; 1 credit per image. Prices: official pricing page capture showed no dollar amounts; Creatomate docs say Essential $54/mo and Growth 10K $129/mo; third-party aggregators disagree ($29, $39, $41, $49) so treat as verify | 50 credits free trial, no card | Not stated on pricing page (verify) | Not mentioned on page (verify) |
| JSON2Video | Yes (JSON movie spec) | 1 credit per second of video (60 credits/min) at any resolution. Prepaid $49.95 = 7,200 credits (up to 120 min); $99.95 = 15,600 credits (up to 260 min). Subscriptions: Hobby $16.63/mo billed $199.50/yr, 3,000 credits (50 min); Professional $49.95/mo, 12,000 credits (200 min); Startup $99.95/mo, 30,000 credits (500 min). Max video length 30 min | 600 credits free, no card, but free-plan videos are watermarked | No limit listed; 4K costs same per second | Not mentioned; page links to an affiliate program |
| Plainly | Template-based (After Effects / Canva-style templates) with API on all plans | Starter $69/mo (50 render min), Explorer $134/mo (100), Team $259/mo (200), Pro $649/mo (600), Unlimited from $1,500/mo; yearly billing about 30% lower | 14-day free trial (card requirement not stated) | Not stated | Not mentioned |
| Rendi (FFmpeg API) | No scene spec; runs your FFmpeg commands | Free $0 (4 vCPU, 50 GB processing/mo, 1 min command limit, 4 commands/min); Pro $25/mo (250 GB processing, 10 min runtime, from $0.10 per GB processed); larger tiers up to $6,400/mo | Free tier needs a credit card for identity verification; one free account per card | No resolution surcharge | Terms not read (verify); Enterprise has custom terms |

- Shotstack pricing and minutes-per-credit: "Minutes are counted by the second, rounded down." Pay as you go unused minutes last 12 months; plan minutes roll over for 3 months; above 10,000 min/month contact sales — [Shotstack pricing](https://shotstack.io/pricing/)
- Shotstack bundles AI generation credits (examples: 5-second Seedance 2.5 clip at 720p = 14.8 credits = $2.96 at PAYG-equivalent rate; ElevenLabs music 30 s = 5 credits) — [Shotstack pricing](https://shotstack.io/pricing/)
- Shotstack white-label editor is "source-available under the PolyForm Shield License" and "uses FFmpeg for exports and works with the Edit API" (as summarised by the fetch tool, verify exact wording) — [Shotstack pricing](https://shotstack.io/pricing/)
- Creatomate: "One minute of 720p video (25 fps): about 14 credits"; generated videos hosted up to 30 days then deleted; credits expire monthly and do not roll over — [Creatomate pricing](https://creatomate.com/pricing), [Creatomate pricing docs](https://creatomate.com/docs/account/how-does-the-pricing-work)
- Creatomate price conflict: docs page says Essential $54/mo, Growth 10K $129/mo; aggregators list $41/$99/$249 (G2/SaaSworthy), $29 (ToolRadar), $39 (Bityclips). Unresolved — [Creatomate docs](https://creatomate.com/docs/account/how-does-the-pricing-work); search summary listing the aggregators at [G2](https://www.g2.com/products/creatomate-creatomate/reviews)
- Creatomate API docs describe use cases including "building a SaaS or service that leverages Creatomate's features" (search-result summary, verify on the page) — [Creatomate docs](https://creatomate.com/docs/api/limits)
- JSON2Video: subscription credits expire monthly; prepaid credits do not expire; prepaid removes watermark — [JSON2Video pricing](https://json2video.com/pricing/)
- JSON2Video: users own rendered videos on every plan and can use paid-plan output commercially; TTS provider licence terms travel with output; binding text is the "Developer API Terms of Use" (not retrieved) — [JSON2Video content ownership](https://json2video.com/docs/v2/reference/content-ownership) (via search snippet; verify)
- Plainly retention/limits not captured. Rendi "Processing is the combined size of input and output media for each command" — [Rendi pricing](https://www.rendi.dev/pricing)

Cost arithmetic for a Nepali solo middleman (derived from the figures above, not vendor claims): a 30-second clip costs about 0.5 min. Shotstack PAYG about 10 cents; Starter about 7.8 cents; Scale 5 cents. JSON2Video: 30 credits; on the $49.95 pack (7,200 credits) that is about 0.42 cents per credit-second, so about 12.5 cents per 30-second clip; on Startup sub ($99.95 for 30,000 credits) about 10 cents. Creatomate: about 7 credits per 30 s at 720p; at $54 for 2,000 credits that is about 19 cents per 30 s (1080p likely costs more credits; verify). Plainly: $69/50 min is about 69 cents per 30 s.

### Inferences
- Per-render cost on Shotstack/JSON2Video/Creatomate is roughly 5 to 20 cents per 30 s clip, so 3 free videos per user costs roughly 15 to 60 cents of vendor spend per user. That is only viable if free tier rendering happens in the browser (zero cost) and paid users are the ones hitting vendor APIs.
- Plainly's pricing is out of range for a freemium middleman.
- A single vendor account serving many end users makes the vendor's reselling and end-user clauses (below) the deciding factor, not the price.

### Gaps
- Not researched (session limit): Bannerbear, Placid, HyperFrames hosted/API, Hera, Jitter, Canva Connect, Cloudinary video, Mux, Diffusion Studio cloud, Remotion Cloud Run details, any 2026 newcomers. Their JSON spec support, pricing and licence terms are unknown to this note.
- Creatomate's actual current dollar prices (pricing page capture omitted amounts), max resolution, rate limits, concurrency page ("limits and concurrency" docs) not retrieved.
- Output specs for all vendors (9:16 1080x1920 support, audio mixing, speed per render, auth from browser vs server) not verified. From general knowledge, all of these APIs are server-side with secret API keys; browser use would expose the key (unverified here).
- Devanagari/Unicode and custom font support not checked for any vendor. This is critical for Nepali content and must be tested in each vendor's sandbox.
- JSON2Video terms of use, Plainly terms, Rendi terms not read.

## What do the terms say about building a commercial product on top and reselling renders?

### Takeaway
Only Shotstack's legal terms were read in full enough to quote. They permit using the API inside your own product ("does not, by itself, constitute a transfer or resale") but forbid transferring, licensing or reselling your rights to third parties and require flow-down terms to end users. Creatomate's published terms page appears generic and silent on resale, which is not the same as permission (verify with the vendor in writing). Shotstack's own help centre describes a "bring your own key" pattern where each end user is a direct Shotstack subscriber.

### Cited Findings
- Shotstack clause 4.4: "these rights must not be leased, assigned, sold, licensed, resold or transferred to any third party" — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack clause 4.4 also: "Using our APIs within your own products or services does not, by itself, constitute a transfer or resale" — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack section 10.3: "If you provide the Services to end users, you must impose terms no less protective than this Section 10" (Section 10 is acceptable use) — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack Schedule 2 (Templates): "You may offer our templates to your end users only if the video is rendered using our Services." and "Standalone animations cannot be used for resale, other products, videos or any other method to distribute it" — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack clause 4.3 prohibits to "utilise our dynamic templates and APIs other than in conjunction with our Services" and to "reverse engineer, copy, duplicate, reproduce, create derivative works from" the Platform — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack clause 9.1: "All Intellectual Property Rights created out of your use of the Services immediately and automatically vests with you." Clause 9.4: you warrant uploaded content is lawful (full list not captured) — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack has no explicit competing-service clause found in the legal terms, and "white-label" appears only in marketing navigation ("fully-featured, white-label video editor seamlessly embedded within your application"), not in the legal terms — [Shotstack terms](https://shotstack.io/terms/)
- Shotstack help centre: when an app is built on the API using each user's own credentials, every user is billed directly as an individual Shotstack subscriber, and the developer app must store keys securely; the White Label Studio SDK licence covers this bring-your-own-key use case (search-result summary, verify at source) — [Shotstack help: integrations FAQ](https://help.shotstack.io/en/articles/16187584-integrations-faqs)
- Creatomate terms page (fetched): no clause found on resale, sublicensing, building on top, competing, white-label or API restrictions. It has a content-restrictions clause: "You may not transmit any Content that is unlawful, offensive, upsetting..." and a licence letting Creatomate "make Your Content available to other users of the Service" — [Creatomate terms](https://creatomate.com/terms-of-service). This appears to be a generic template, so a vendor email is needed (verify).
- JSON2Video: paid-plan output is commercially usable; free-plan output is watermarked; the binding Developer API Terms were not read — [JSON2Video content ownership](https://json2video.com/docs/v2/reference/content-ownership)

### Inferences
- Under Shotstack's terms, a middleman that holds one Shotstack account and renders for end users is plausibly allowed ("using our APIs within your own products"), but the same clause bars reselling your rights; selling renders as a metered service is a grey area and should be confirmed in writing before launch (verify).
- The safer pattern for Shotstack is the bring-your-own-key route (each user subscribes to Shotstack) but that destroys a simple "3 free then pay Introcut" model.
- Because Introcut is MIT open source, any vendor-specific template/animation assets must not be bundled in the repo, because Shotstack forbids redistributing standalone template animations.

### Gaps
- Terms of Creatomate (confirmed), JSON2Video, Plainly, Rendi, Bannerbear, Placid, Cloudinary, Mux, Canva, HeyGen, Hera, Jitter, Diffusion Studio were not read. No reseller programme was found for any vendor (not systematically searched).
- No dedicated reseller or white-label rendering programme was verified for any vendor.

## Self-hosting route: cost per 30 s render, free options, and whether browser export removes the need for server rendering

### Takeaway
Only Remotion Lambda numbers were retrieved, and Remotion is excluded by licence, so they serve only as a rough benchmark of what serverless headless-Chrome rendering costs. Cloudflare Browser Rendering, GitHub Actions terms and cheap-VM costs were not researched.

### Cited Findings
- Remotion's cost-example page: a Hello World render costs about $0.001 (warm Lambda 7.56 s, cold Lambda 11.02 s); a 1-minute remote-video render about $0.017 to $0.021 warm/cold, with the cold run faster in one version, indicating variance; example uses 2048 MB in us-east-1, Remotion 4.0.381. Costs exclude S3 and Remotion licence fees — [Remotion cost example](https://remotion.dev/docs/lambda/cost-example)
- Remotion licence fee for automated use: "Remotion for Automators" $0.01 per render, $100/mo minimum (already known, repeated for scale) — [Remotion pricing](https://www.remotion.dev/docs/pricing)
- Remotion advises always measuring your own composition's cost — [Remotion docs](https://remotion.dev/docs/lambda)

### Inferences
- If a serverless headless-Chrome render costs around 2 cents of compute for a 1-minute simple video, a 30 s Introcut render on a self-built pipeline is plausibly pennies, cheaper than the 5 to 20 cent vendor APIs, but this is an extrapolation from Remotion's figures and is not verified for HyperFrames, Revideo or FFmpeg.
- Introcut already renders and exports MP4 in the browser (project facts), so server rendering is unnecessary for the free tier; it is only needed for paying features (longer videos, 1080p on weak devices, background rendering).

### Gaps
- Cloudflare Browser Rendering: whether it can record video/frames, its free-plan limits and price per browser hour; not checked (fetch failed at limit).
- GitHub Actions as a render farm: Terms of Service and Actions usage-limit clauses (e.g., prohibition on serverless/compute abuse) not read. Verify before considering.
- Cheap-VM costs (Hetzner, Oracle free tier, Fly.io, Modal, Cloud Run) and cold start times for HyperFrames/Revideo/FFmpeg+Chrome not researched.
- HyperFrames hosted/API options by HeyGen: not found.

## Quality for story-style 30 s shorts, and whether platforms can render our scene spec

### Takeaway
Not researched beyond the structural point that every verified vendor renders its own JSON or templates, not Introcut's scene spec.

### Cited Findings
- Shotstack's White Label Studio SDK exports with FFmpeg and works with the Edit API (their own editor, not a custom-component renderer) — [Shotstack pricing](https://shotstack.io/pricing/)
- Shotstack prohibits using its dynamic templates and APIs "other than in conjunction with our Services" — [Shotstack terms](https://shotstack.io/terms/)

### Inferences
- To use any vendor as an engine, Introcut would need a compiler from its own project JSON (the scene spec used by renderFrame) to the vendor's JSON schema, which will lose Introcut-specific animated scene templates and its Devanagari layout handling. Visual parity with the browser preview is therefore not guaranteed.
- A self-hosted route that runs Introcut's own renderFrame in headless Chrome (or another WebCodecs-capable runtime) would preserve parity, which is an argument for self-hosting over adopting a vendor, but it was not tested here.

### Gaps
- No independent comparison, sample gallery or Devanagari render test was found or run. No vendor's custom-component support was checked.

## Verdict per option and cheapest credible server-side rendering for paying users

### Takeaway
Provisional only. Based on verified data: Shotstack (and possibly JSON2Video) are the only vendors with price points compatible with a freemium margin, but their JSON schema is not Introcut's, and resale terms need written confirmation. Everything else is unevaluated.

### Cited Findings
- See tables above for prices; Shotstack terms quotes above for the commercial constraints.

### Inferences (provisional, labelled verify)
- Shotstack: candidate paid-tier engine only if written confirmation allows metered resale and the Devanagari font test passes; otherwise skip. Cheapest tier: PAYG $10/50 min at 20 cents per min (about 10 cents per 30 s clip).
- JSON2Video: candidate paid-tier engine on price (about 10 to 12.5 cents per 30 s clip); resale terms unknown; verify Developer API Terms.
- Creatomate: candidate but price uncertain and terms silent; verify with vendor.
- Plainly: skip on price ($69/mo for 50 minutes).
- Rendi: not a scene renderer; only useful as a post-process (e.g., concat, transcode) helper; free tier needs a credit card.
- Remotion Lambda/Cloud Run: skip (licence; already decided).
- Everything else (HyperFrames, Revideo, Motion Canvas, Hera, Jitter, Canva, Cloudinary, Mux, Diffusion Studio, Bannerbear/Placid): no verdict possible from this research.
- Cheapest credible approach (provisional hypothesis, unverified): keep free tier fully in-browser (0 cost); for paid users, either (a) let them do browser export too and charge for AI features (Introcut's costs are then near zero), or (b) run Introcut's own renderFrame in headless Chrome on a cheap VM or pay-per-use compute for long/1080p/background jobs, avoiding vendor schema and resale-term risk. Cost of (b) must be measured.

### Gaps
- Cost and feasibility of (b) not measured; Cloudflare/CI/VM options not researched.
- Hosted options from HeyGen (HyperFrames), Hera, Jitter, Canva, Cloudinary, Mux, Diffusion Studio and any 2026 newcomers remain unresearched. Re-run this task for those with fresh quota.
