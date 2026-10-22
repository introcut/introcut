# Introcut "channel manager" idea: posting APIs, no-API V1 scope, monetisation in Nepal/India (research date 2026-10-22)

Method note: WebFetch returns model-summarised text, not raw pages, so "quotes" below are as returned by the fetch tool. Where a fetched summary conflicted with other evidence, this is flagged. Pages that returned 404 or could not be read are listed under Gaps. Anything about Nepal payouts/tax comes mostly from blogs and is marked (blog). Freshness flags: any source older than ~6 months (before 2026-04-22) is marked [OLD]; items I could not date are marked [UNDATED].

---

## 1. Posting / scheduling APIs: what exists, under what conditions, what a solo developer in Nepal can realistically get

### Takeaway
All three platforms have a posting API, but each gates public posting behind a review. YouTube: an unaudited project's uploads are locked private (third-party sources say projects created after 28 Jul 2020; the official help page confirms the lock and says no appeal). TikTok: unaudited = private-only, max 5 users per 24 h, audit takes weeks. Meta: no review needed for an app that only serves accounts the developer owns, but any app serving other people's accounts needs App Review (screencast, privacy-policy URL, per-permission justification) and, per vendor sources, business verification. Facebook Reels are Page-only (no personal profiles). So V1 cannot promise "post for the user"; it can only do it for the developer's own accounts and testers until reviews pass.

### Cited Findings

**YouTube Data API v3**
- videos.insert quota: "100 calls per day. A call to this method has a quota cost of 1 unit in the Video Uploads quota bucket." Accepted scopes include youtube.upload, youtube, youtubepartner, youtube.force-ssl. Max file size 256GB. — [YouTube videos.insert reference](https://developers.google.com/youtube/v3/docs/videos/insert) (fetched 2026-10-22)
- Default allocation: "Projects that enable the YouTube Data API have a default quota allocation of 100 search.list calls, 100 videos.insert calls, and 10,000 units per day". Additional quota requires an audit: "you must first complete an audit ... to show that your project is in compliance with the YouTube API Services Terms of Service"; start with the "YouTube API Services - Audit and Quota Extension Form"; "A member of YouTube's API Services team will contact you as soon as possible" (no timeline stated). — [Quota and Compliance Audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) (fetched 2026-10-22)
- Quota costs: all requests cost at least 1 point; daily quota resets at midnight Pacific Time. — [Determine quota cost](https://developers.google.com/youtube/v3/determine_quota_cost) (fetched 2026-10-22)
- Private-lock for unverified projects, official help page: videos "uploaded by an unverified third party API service" can be locked private; "For videos that have been locked as private due to upload via an unverified API service, you will not be able to appeal." Remedies: re-upload via a verified API service or directly in the YouTube app/site, or have the service complete an API audit. — [YouTube Help 7300965](https://support.google.com/youtube/answer/7300965) (fetched 2026-10-22)
- The July 28, 2020 rule (projects created after that date; "setting privacyStatus to public does not change that, and the call does not fail"; creators get an email) is reported by secondary sources only, e.g. [Ayrshare](https://www.ayrshare.com/solutions/google-api-error-403-unverified-app-how-to-fix-the-audit-pipeline/) and developer forums; I could not retrieve the original official notice (the API revision-history page fetch did not show a 28 Jul 2020 entry). CONFLICT: the fetch summary of the videos.insert reference page said "Videos uploaded from unverified API projects are not restricted to private viewing mode"; this contradicts the help page and the secondary sources and is likely a summarisation error or a doc change. Treat as VERIFY on the live page before building anything.
- OAuth: youtube.upload is the sensitive-scope path (sensitive scopes need Google OAuth app verification: privacy policy, domain, demo video); I did not fetch the Google verification page, so scope-sensitivity classification and timeline are Gaps (verify).
- Shorts: no dedicated endpoint or flag. Shorts classification is by file: vertical/square and under 3 minutes (up from 60 s, reported effective on/after 15 Oct 2024). #Shorts tag reported as optional. API-uploaded videos sometimes fail to enter the Shorts shelf (anecdotal). — [bundle.social, 2026-08-04, vendor blog](https://bundle.social/blog/youtube-shorts-api-secrets); [Veed guide, UNDATED](https://www.veed.io/learn/youtube-shorts-api)

**Meta: Instagram content publishing**
- Written for "Instagram professional accounts" (personal accounts not served; the page does not explicitly say so). Permissions: Instagram Login = instagram_business_basic + instagram_business_content_publish; Facebook Login = instagram_basic, instagram_content_publish, pages_read_engagement. Limit: "Instagram accounts are limited to 100 API-published posts within a 24-hour moving period" (carousel section says 50; unreconciled). Media must be on a publicly accessible server at publish time; media_type=REELS with video_url; no filters, no shopping tags. — [Instagram Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) (fetched 2026-10-22)
- App Review: "Your app must complete App Review before it can request permissions with Advanced Access from any app user" (Tech Provider serving multiple businesses). An app built "only for a business I own or manage" uses Standard Access and review is "Not required". Submission needs: 1024x1024 app icon, Privacy Policy URL, app category, business email, step-by-step reviewer instructions with test credentials, per-permission description plus a screencast of the end-to-end experience, and at least one successful API call per permission. Review duration not stated. Business verification not mentioned on the page. — [Instagram App Review](https://developers.facebook.com/docs/instagram-platform/app-review) (fetched 2026-10-22; vendor search snippet dates the page to 2026-06-30)
- Business verification for Advanced Access is asserted by vendors (not found in the official page I read): [anim.hr blog, UNDATED](https://anim.hr/en/blog/facebook-graph-api-verifikacija-glavobolja). VERIFY.

**Meta: Facebook Reels / Page publishing**
- "You can only publish Reels to Facebook Pages" (profiles not supported); needs a Page access token from a user with CREATE_CONTENT task; permissions pages_show_list, pages_read_engagement, pages_manage_posts. Specs: mp4, 9:16, 1080x1920 recommended (min 540x960), 24-60 fps, 3-90 s (Page-story Reels capped 60 s), H.264/H.265, AAC 48 kHz. "Reels API is limited to 30 API-published posts within a 24-hour moving period." Scheduling supported: video_state=SCHEDULED, scheduled_publish_time between 10 minutes and 29 days ahead. — [Facebook Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing) (fetched 2026-10-22)
- A vendor notes pages_manage_posts App Review demands screenshots and a screencast "even for internal tools". — [anim.hr, UNDATED](https://anim.hr/en/blog/facebook-graph-api-verifikacija-glavobolja)

**TikTok Content Posting API**
- Direct Post requires the video.publish scope; "All content posted by unaudited clients will be restricted to private viewing mode"; the client must "undergo an audit". Region availability is not mentioned on the page. — [TikTok Content Posting API: Get Started](https://developers.tiktok.com/doc/content-posting-api-get-started) (fetched 2026-10-22)
- UX rules for Direct Post apps: show creator nickname; privacy must be chosen manually from creator_info options with no default; comment/duet/stitch off by default and respect creator settings; commercial-content toggle off by default; branded content cannot be private; apps must not "superimpose or otherwise include any brand name, logo, watermark"; preset title/hashtags must be user-editable. — [TikTok Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) (fetched 2026-10-22)
- Unaudited limits (up to 5 users per 24 h, all posts private) and the 24 h active-creator cap are consistent across sources; the official fetch did not show the "5 users" figure, but earlier project research and search results agree. Audit timeline: official docs give none; vendor estimate "weeks" / "2-6 weeks" (unverified). Two stages: product access (typically days) then a content audit (weeks). Upload-to-inbox (video.upload) is a separate product with a lower bar; the user finishes posting in the TikTok app. Rejection reasons reported: demo video missing the full flow (login, consent, composer from creator_info, resulting post), no review screen, missing/unreachable privacy policy and terms, scopes not shown in demo. — [bundle.social, 2026-08-04, vendor with commercial interest](https://bundle.social/blog/tiktok-api-approval)

**What open-source schedulers teach**
- Postiz: AGPL-3.0; supports Instagram, YouTube, TikTok, Facebook, etc.; self-hosters "must create their own developer apps on each platform and complete that platform's approval process", and the page notes Meta, YouTube and TikTok "can take weeks"; Postiz Cloud ships pre-approved apps. Stack: Next.js, NestJS, PostgreSQL, Redis, Temporal. — [Postiz GitHub](https://github.com/gitroomhq/postiz-app) (fetched 2026-10-22). Implication: AGPL means Introcut must not copy its code into a permissively licensed repo; use only as a reference. Mixpost, Typefully, Repurpose.io, Later, Hootsuite, Canva planner: not researched (budget).

### Inferences
- For a solo developer in Nepal with no company, the realistic order of difficulty: Meta own-accounts (Standard Access, no review) < YouTube audit (form-based, needs a real compliant app and privacy policy/domain; timeline unknown) < Meta Advanced Access (review + likely business verification, which usually needs a legal entity/documents) < TikTok Direct Post audit (weeks, strict UX, demo video). I found no source saying residence in Nepal blocks any of these, nor one saying it does not; treat eligibility of a Nepal-based individual developer as unknown. The simplest honest promise is "we open the upload page with your package ready", plus optional "post to your own connected accounts" only after approvals.
- A browser-only app with no backend cannot satisfy Meta's requirement that media be at a public URL, and OAuth client secrets/refresh tokens need server storage; so API posting in V1 would also force a paid-or-free backend (Cloudflare Workers/R2 free tiers are possible but conflict with "media never leaves the device"). This is a design inference, not a sourced fact.
- YouTube is the only one where a purely client-side flow (Google sign-in + resumable upload from the browser using youtube.upload) is plausible, but uploads will be private-locked until audit.

### Gaps
- Official YouTube text of the 28 Jul 2020 private-restriction notice (not retrieved; conflict noted above).
- Google OAuth sensitive-scope verification requirements and timeline for youtube.upload.
- Meta Business Verification requirements and whether an individual in Nepal can complete it; App Review turnaround time.
- Whether TikTok Content Posting API is available to developers/creators in Nepal.
- TikTok "upload to inbox" (video.upload) official page not read.
- Mixpost, Typefully, Repurpose.io, Later, Hootsuite, Canva planner not researched.

---

## 2. Honest no-API V1: what a browser-only, zero-cost "channel manager" can do

### Takeaway
Everything except automated publishing is feasible in-browser at zero cost: per-platform export presets, per-platform title/description/hashtag packs, a posting checklist with deep links, calendar/series planner, a local post log, manual analytics entry and reminders. Existing free schedulers cap channels/queued posts, so "plan and package" is the differentiator for Introcut rather than "schedule".

### Cited Findings
- Facebook Reels spec (use as export preset): mp4, 9:16, 1080x1920 (min 540x960), 24-60 fps, 3-90 s, H.264/H.265, AAC 48 kHz stereo 128 kbps+. — [Facebook Reels API](https://developers.facebook.com/docs/video-api/guides/reels-publishing) (2026-10-22)
- YouTube Shorts: vertical/square, under 3 minutes. — [bundle.social 2026-08-04](https://bundle.social/blog/youtube-shorts-api-secrets) (secondary)
- Free scheduler tiers (secondary summaries, mid-2026): Buffer free = 3 channels, 10 queued posts per channel; Publer free = 3 accounts, 10 scheduled posts per account (30 total), published posts deleted after 24 h, X excluded; Metricool free = 1 brand with 20 (Buffer's comparison) or 50 (Metricool's own claim) posts/month, conflicting. — [Publer Help](https://publer.com/help/en/article/what-is-included-in-publer-free-dliovh/); [Buffer vs Metricool](https://buffer.com/resources/buffer-vs-metricool/); [Metricool vs Buffer](https://metricool.com/metricool-vs-buffer/)
- Character limits (title/description/hashtag/first-comment per platform): not researched this pass. VERIFY each platform's current limits before shipping presets.
- Deep links to each platform's upload page and PWA notifications: not researched this pass (PWA notifications generally need a service worker/push service; push on iOS requires install to home screen, claim from general knowledge, VERIFY).

### Inferences
- Feasible with zero cost in-browser: local post log with "mark as posted + URL" (OPFS/IndexedDB), content calendar and series planner (idea -> script -> video -> posted), manual analytics entry, consistency streak nudges, per-platform text packs (LLM or rules), export presets (already in the Mediabunny pipeline).
- Reminders: in-app on open are free; true background reminders need push (needs a push service) or export to Google Calendar via an .ics file (zero-cost alternative; Google sign-in is already present).
- Be honest that Buffer/Publer free tiers already give 3-channel scheduling to platforms with approved apps; Introcut's V1 advantage is the beginner coaching + package, not scheduling.

### Gaps
- Per-platform caption/hashtag limits; upload-page deep link URLs; PWA reminder limits; Mixpost/Later/Hootsuite/Typefully free tiers.

---

## 3. Monetisation reality for beginners in Nepal and India

### Takeaway
Money is possible in Nepal but slow and small: YouTube (AdSense wire to a local bank) is the largest channel by NRB data; Facebook monetisation reportedly opened to eligible Nepali accounts in Sept 2025 with thresholds that have tightened since; TikTok Creator Rewards in Nepal and Instagram bonuses in Nepal are not confirmed. India: TikTok is banned there; YouTube and Meta programmes exist. Most beginners earn little (the only survey data found is dated 2022).

### Cited Findings

**YouTube / AdSense**
- YPP requires: age 18+ (or guardian with AdSense) and "Live in a country/region where YPP is available". The page also states "Starting February 1, 2027" YPP updates are coming, with terms to accept "by January 31, 2027" (details not captured: re-check). — [YouTube Help 72857](https://support.google.com/youtube/answer/72857) (2026-10-22). Thresholds not repeated (prior research).
- AdSense payment methods by payment address (APAC table): Nepal = Check yes, EFT no, Wire yes, Hyperwallet no; India = Check no, EFT no, Wire yes, Hyperwallet no. Minimum payout amount not on the page. — [YouTube Help 14728152](https://support.google.com/youtube/answer/14728152) (2026-10-22)
- Wire needs a bank account in the same country as the payments address (blog: [Easton Dev, 2026-01-09](https://eastondev.com/blog/en/posts/media/20260109-adsense-cmb-wire-transfer/)); Nepal US-tax-treaty and withholding claims (24-30% without W-8BEN) are blog-only and unverified.
- NRB (the central bank) data: Nepalis earned over Rs 3.53 billion from videos on YouTube, TikTok and Facebook in FY 2024/25; NRB "has started keeping records of such income"; YouTube is the largest share, Meta platforms 12.21% (secondary summary); brand deals paid directly are not included. — [Republica, Aug 2025 (year inferred), fetched 2026-10-22](https://myrepublica.nagariknetwork.com/index.php/news/nepalis-earn-over-rs-35-billion-from-youtube-tiktok-and-facebook-videos-81-47.html)
- NRB 2020 notice: paying for social-media advertising outside banking channels is prohibited under the Foreign Exchange (Regulation) Act 2019; foreign-currency platform income can be converted via licensed banks. — [Pradhan Law](https://pradhanlaw.com/publications/nepal-rastra-banks-nrb-notice-relating-to-foreign-payment-system) [OLD, 2020; summary via search]

**Facebook Content Monetization (Nepal)**
- Nepali telecom news, 2025-09-03 [OLD, >6 months]: Meta began monetising eligible accounts in Nepal after earlier invite-only access; criteria reported as professional mode, 5,000 followers, 60,000 minutes watch time in 60 days, age 18+, original content; payouts via local bank account with name as on citizenship, PAN, SWIFT. — [Nepali Telecom](https://nepalitelecom.com/facebook-monetization-in-nepal)
- Ekantipur 2025-12-18 [OLD], machine-translated: new rules reported as at least 3 reels in 90 days, 10,000 followers, 150,000 views in 28 days; earlier criteria quoted by a search snippet as 500,000 engagements and 2,000 followers. Headline question was whether monetisation was shut down; the text did not confirm a shutdown. — [Ekantipur](https://ekantipur.com/news/2025/12/18/en/has-facebook-monetization-been-shut-down-in-nepal-this-is-the-reality-00-18.html)
- Payout blog (undated, mentions 2026): $100 minimum for bank wire, W-8BEN for Nepali individuals, FTIN = citizenship or PAN number, 30% withholding if no form, wire 5-10 business days, eSewa/Khalti not payout options. Blog only. — [Merokalam](https://merokalam.com/blog/facebook-payout-nepal/)
- CONFLICT: thresholds differ between sources (5,000 followers / 60k minutes vs 10,000 followers / 150k views / 3 reels) and a Pakistani article lists India among countries whose bank/tax details are used for payouts (not an eligibility list): [Express Tribune, 2026-06-13](https://tribune.com.pk/story/2534763/1). I could not retrieve Meta's official eligibility page (the Meta help URL returned 404). VERIFY with Meta Professional Dashboard.

**Instagram (secondary only)**
- Blogs say Gifts/Subscriptions/Live Badges are available to eligible creators in India (Subscriptions ~10k followers, Gifts ~500 followers by one source, 18+), bonuses invite-only in US/Korea/Japan, and Nepal is not named in Meta's announced country lists for gifts/bonuses; Nepali creators earn mainly via brand deals. Indian creator CPM claim ($0.005-$0.015) is a blog figure. — [Reshma Shaji, India 2026](https://reshmashaji.com/?p=816); [BossWallah](https://bosswallah.com/blog/creator-hub/instagram-monetization-requirements-for-reels-ads-bonuses/). Not official; UNDATED.

**TikTok**
- Creator Rewards eligibility per third-party blogs: 18+, 10,000 followers, 100,000 views in 30 days, live in an eligible country; listed countries are US, UK, Germany, France, Brazil, Japan, South Korea (plus Mexico/Canada/Australia/Spain/Italy in some lists); none lists Nepal. — [Toptal](https://www.toptal.com/creator/post/how-to-join-the-tiktok-creator-rewards-program); [ttcalculator](https://ttcalculator.net/learn/creator-fund-countries/). Official TikTok page could not be read (fetch returned empty). VERIFY. India: TikTok banned (prior research). Nepal TikTok status in 2026: only a blog says accessible; TikTok received Nepal registration Nov 2024 ([Spotlight Nepal](https://www.spotlightnepal.com/2024/11/06/tiktok-officially-registered-nepal/)) [OLD]. TikTok Shop availability in Nepal/India: not researched.

**Earnings reality**
- 2022 Linktree survey (~9,500 creators): 46% of full-time and 68% of part-time creators earn under $1,000/year; Goldman Sachs figure that ~4% earn over $100,000. These are repeated in 2026 roundups; no newer primary survey found. — [Influencer Marketing Hub, via search](https://influencermarketinghub.com/creator-economy-stats) [OLD, 2022 data]
- Do not publish earnings estimates per view for Nepal: the "$1-4 per 1,000 views" figure is a single blog estimate.

### Inferences
- Honest message: "Some Nepali creators earn; most beginners earn little or nothing for months; none of these programmes is guaranteed and thresholds change." Monetisation is a milestone beyond V1's promise; non-platform income (brand deals, affiliate, services/courses) is the more common beginner route per NRB's note that direct brand deals are unmeasured, but I found no sourced data on affiliate/course income in Nepal.
- Legal receipt: Nepalis evidently receive platform income via banks (NRB tracks it); personal income tax return threshold claim (Rs 500,000) is blog-only; advise "ask a tax professional" and do not give tax advice.

### Gaps
- Official Meta eligibility/country page; official TikTok Creator Rewards page; official AdSense minimum payout and tax pages; affiliate/sponsorship/TikTok Shop in Nepal/India; AdSense PIN process; Nepal tax rules (IRD source); Instagram monetisation official availability; YouTube Shorts revenue-share details.

---

## 4. Beginner struggles, consistency, cadence, shy creators, coach feature

### Takeaway
Evidence found is mostly about burnout and platform pressure, not about cadence rules; no official cadence recommendation was retrieved, and nothing on faceless/shy creators. A coach feature should therefore promise routine and feedback, not growth.

### Cited Findings
- Billion Dollar Boy / Censuswide, July 2025, 1,000 US/UK creators: 52% have experienced burnout, 37% considered leaving. — [Cosmetics Design Europe, 2025-07-17](https://www.cosmeticsdesign-europe.com/Article/2025/07/17/52-of-content-creators-say-they-have-experienced-burnout) [OLD]
- Patreon State of Create 2025 (secondhand): 78% say burnout affects motivation; 75% believe platforms punish creators who do not post constantly. Original not verified. — [Voxbooster, 2026](https://voxbooster.com/blog/creator-burnout-statistics-2026) (secondary)
- Shorts analytics: "Viewed vs swiped away" is in YouTube Studio > Analytics > Content > Shorts; YouTube publishes no official threshold; benchmarks (70-80% viewed) are informal. Since 31 Mar 2025 every start/replay counts as a Shorts view; engaged views tie to YPP eligibility (vendor claim). — [bytecap.io](https://www.bytecap.io/research/youtube-shorts-retention-benchmarks); [VidIQ](https://vidiq.com/blog/post/youtube-shorts-algorithm/) (vendors)

### Inferences
- Reasonable coach scope: fixed weekly slot, small batch targets (e.g. 1-2 videos/week), series templates, "what to improve" from the user's own viewed-vs-swiped numbers, no claims about virality. A 30-60 s teaching format (hook, one idea, example, takeaway) is a product design choice; I found no sourced study to cite.

### Gaps
- Official cadence guidance (YouTube, Instagram, TikTok, Facebook); research on consistency vs growth; shy/faceless creator evidence; niche definition research; series-format retention data.

---

## 5. Policy and risk

### Takeaway
Three hard rules from sources: do not auto-post through an unaudited API on behalf of users (private-lock, no appeal); do not mass-produce near-identical videos (YouTube inauthentic content applies channel-wide); do not add a brand watermark in a Direct Post app. Bulk posting and fake engagement were not researched but are plainly out of scope.

### Cited Findings
- YouTube renamed "repetitious content" to "inauthentic content" on 2025-07-15; covers "repetitive or mass-produced" content; viewer test: "if the average viewer can clearly tell that content on your channel differs from video to video, it's fine to monetize"; applies to the channel as a whole, so monetisation can be removed from the entire channel; AI-using channels remain eligible; no change to reused-content policy. — [YouTube Help 1311392 via search](https://support.google.com/youtube/answer/1311392?hl=en); [Social Samosa](https://www.socialsamosa.com/news-2/youtube-clarifies-monetisation-policy-targeting-inauthentic-content-9493155); [SEJ](https://www.searchenginejournal.com/youtube-clarifies-monetization-update-targeting-spam-not-reaction-channels/550755) [OLD, 2025-07]
- Instagram: Mosseri (2021/2022) said Reels with a creator's own logo are fine, but Instagram tries not to recommend Reels carrying other apps' logos (TikTok watermark); reposted watermarked Reels still reach followers but not Explore/recommendations; "originality" favoured over aggregators. A 2026 blog claims an "Originality Score" but is unconfirmed. — [Social Media Today](https://www.socialmediatoday.com/news/instagram-clarifies-including-your-own-logo-on-a-reel-is-ok/730852/) [OLD, 2022]
- TikTok Direct Post guidelines forbid apps adding watermarks/logos and require user-controlled privacy and disclosure toggles (see section 1).
- Platform AI-label rules: covered by earlier research, not repeated.

### Inferences
- Introcut should export without a visible Introcut watermark on the file (or make it optional and never TikTok-style), strip other platforms' watermarks only by re-exporting from its own project (never "remove watermark" tools, per CLAUDE.md), include per-video variation prompts, and avoid any "one idea -> 20 near-identical videos" bulk feature.

### Gaps
- Automation/third-party posting rules in platform ToS (Meta Platform Terms, TikTok developer terms); fake-engagement policies; 2026 updates since July 2025.

---

## 6. Recommendation: V1 "channel manager" scope and honest messaging

### Takeaway
Ship a "plan, create, package, track" manager with zero API approvals in V1, add "send to my account" only in V2 per platform as approvals arrive, and never promise income.

### Cited Findings (supporting)
- Publishing APIs are gated as in section 1; vendors and Postiz docs confirm weeks-long reviews. — [Postiz GitHub](https://github.com/gitroomhq/postiz-app); [bundle.social](https://bundle.social/blog/tiktok-api-approval)

### Inferences (proposed scope, not sourced fact)
V1 (no approvals, browser-only):
1. Channel setup coach: pick 1 niche, 1 series format, weekly slot, platforms to start with (suggest starting with 1-2).
2. Idea backlog -> script -> video -> "ready to post" -> "posted" board; local storage (OPFS/IndexedDB).
3. Per-platform export presets from the existing renderer (9:16, 1080x1920, under 90 s for FB Reels; under 3 min for Shorts; platform file/duration limits to be verified).
4. Per-platform text pack: title, description, hashtags, first comment (limits to verify), plus AI-label reminder.
5. Posting checklist with deep link to each upload page and the exported file; "Mark as posted" with URL and date.
6. Manual analytics entry (views, viewed-vs-swiped, followers) and a weekly review prompt.
7. Reminders via in-app, and .ics calendar export (works with the existing Google sign-in).
8. Streak and "small batch" nudges; no growth promises.
V2 (when approvals exist): YouTube upload (after audit) -> Meta Page/IG publishing for own accounts (Standard Access) then Advanced Access -> TikTok upload-to-inbox first, Direct Post after audit. Requires a privacy policy, domain, demo video, and likely a backend.
Honest messaging (suggested wording): "Introcut helps you plan, make and package videos for YouTube, Facebook, Instagram and TikTok and keeps your record. You post them yourself for now. Platforms such as YouTube and Facebook pay some creators in some countries after you meet their rules (followers, views, watch time); most beginners earn little, and Introcut cannot promise or speed up payment."

### Gaps
- Validating which approvals a Nepal-based individual can actually pass; real review timelines; whether Google sign-in verification already done for Introcut covers youtube.upload (it does not automatically, claim from general knowledge, VERIFY).

---

## Source freshness summary
- Fetched live 2026-10-22 (official): YouTube insert/quota/audit/help pages, Meta Instagram publishing/App Review/Reels API, TikTok posting/guidelines, YouTube payment-method and YPP pages.
- Older than 6 months [OLD]: NRB 2020 notice, Nepali Facebook monetisation articles (Sept and Dec 2025), YouTube inauthentic-content change (July 2025), Linktree 2022 survey, Mosseri 2021/22, burnout surveys July 2025. Re-check: Meta eligibility thresholds, YPP changes effective 2027-02-01, TikTok Creator Rewards countries, TikTok availability in Nepal.
