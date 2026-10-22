# Facebook Reels scheduling (and YouTube scheduling) for Introcut: feasibility, as of 2026-10-22

Method note for the report writer: pages were read with a fetch tool that returns a model-made extract of each page, not raw HTML. Text in quotation marks is what that extract reported as quoted. A few extracts were limited to short fragments, and some Meta Business Help pages (facebook.com/business/help/...) returned only their title, so they could not be read. Anything not read directly is marked "verify". Meta's docs moved to developers.facebook.com/documentation/... (with `.md` versions) while the older /docs/... paths still resolve. The Graph API version shown in the Reels doc is v26.0.

## 1. Development mode vs Live mode, App Review, Business Verification

### Takeaway
An app used only by people who hold a role on it (admin, developer, tester) does not need App Review or Business Verification, so "my own Page, my own login" can work in Development mode with no review. App Review plus Business Verification is triggered the moment anyone without a role (for example a friend who is only a Page admin) uses the app in Live mode. Meta does not document whether an individual with no company can pass Business Verification, so that part is unverified.

### Cited Findings
- App Review is not needed for role-only use. Quote: "If your app will only be used by app users who have a role on the app itself, App Review is not required." And the opposite case: "If your app will be used by anyone without a Role on the app or a role in a Business that has claimed the app, it must first undergo App Review." (dated: undated page, read 2026-10-22) — [Meta App Review](https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review)
- Standard Access is automatic. Quote: "All Business, Consumer, and Gaming apps are automatically approved for Standard Access for all permissions and features." Also: "Permissions with Standard Access can only be requested from app users who have a role on the requesting app." and "Permissions with Advanced Access can be requested from any app user." — [Meta Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels)
- Advanced Access needs Business Verification. Quote: "Advanced Access now requires Business Verification" (since February 1, 2023). Advanced Access holders must also complete an annual Data Use Checkup: "Apps that have Advanced Access for a permission or feature must complete Data Use Checkup." — [Meta Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels); [Permissions Reference](https://developers.facebook.com/documentation/development/permissions) (intro: Business Verification "is required for all apps making requests for" Advanced Access)
- Business Verification page: role-only apps are exempt: "you do not need to complete verification." Required when "must be connected to a Business that has completed Business Verification" for apps requesting advanced access. "only someone with an Admin role in the Business will be able to complete the verification process." The page lists no documents (points to the Business Help Center) and gives no timelines. It mentions "Individual Verification" exactly once, only in "Click the Start Verification button or the '+ Business Verification' link if you have previously completed Individual Verification," and does not explain it. — [Meta Business Verification](https://developers.facebook.com/docs/development/release/business-verification/)
- App modes: "Apps in Development mode can only request permissions from role users." "Apps in Live mode can request permissions from anyone, but only permissions approved through App Review." Advice: "You should only switch the app to Live mode after you have completed app development and have completed App Review." Test data created in Development mode becomes visible to all app users after the switch. — [Meta App Modes](https://developers.facebook.com/docs/development/build-and-test/app-modes)
- Roles: "Developers can grant the app any permission while it is in development." Administrator, Developer, Tester roles can grant any permission in development. Limits: "Apps can have up to 500 administrators"; most unlinked apps up to 50 testers (testers+analytics capped at 500 for apps linked to a verified Business Manager). Admin/Developer/Analytics roles need a Meta Developer Account: "In order to have an Administrator, Developer, or Analytics role on an app, a person must have a Meta Developer Account." — [Meta App Roles](https://developers.facebook.com/docs/development/build-and-test/app-roles)
- Restriction on who can be a Tester (matters for "my friend"): "You may only add a person as a Tester to your app if they are your employee" (or they otherwise act on your behalf under an agreement). A separate "Authorized App Tester" (a Facebook user with no role) must agree to Meta Platform Terms and confirm they work on the developer's behalf, and while the app is in development can "grant your app permissions." — [Meta App Roles](https://developers.facebook.com/docs/development/build-and-test/app-roles)
- To switch to Live mode the Basic Settings page says the Terms of Service URL, App Icon and Category are required ("This field is required to switch your app to Live mode"). Privacy Policy URL and Data Deletion are described but the extract did not state them as required for the switch. Data deletion: "Developers need to specify either a data deletion callback instruction URL or a callback URL." — [Basic Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings); [Data deletion callback](https://developers.facebook.com/documentation/development/create-an-app/app-dashboard/data-deletion-callback.md)
- pages_manage_posts: "The pages_manage_posts permission allows your app to create, edit and delete your Page posts." Allowed usage includes "Publish a post, photo, or video to your Page." Dependencies: pages_read_engagement, pages_show_list. The App Review column asks for "specific examples of why your app needs to create or manage posts on behalf of other users for the pages they own." — [Permissions Reference](https://developers.facebook.com/documentation/development/permissions)
- Reels doc prerequisite: a Page access token "from a user who can perform the CREATE_CONTENT task on the Page" and Facebook Login grants for pages_show_list, pages_read_engagement, pages_manage_posts. — [Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing/)
- Access Verification (Tech Provider) is for businesses serving other businesses, not individuals, and requires Business Verification first; the doc says ~5 days for a decision. News dated 2026-10-11 reports Meta retired it: Meta "will rely on Business Verification and App Review instead." — [Access Verification doc](https://developers.facebook.com/documentation/development/release/access-verification.md); [Social Media Today, 2026-10-11](https://www.socialmediatoday.com/news/meta-removes-access-verification-for-developers/832678/)
- Third-party vendor guides say sole proprietors can pick "Sole Proprietorship" in the verification flow and usually need ID plus utility bill/bank statement/trade licence. These are vendor blogs, treat as unverified. — [SleekFlow help](https://help.sleekflow.io/verifying-facebook-business-account/facebook-business-verification)

### Inferences
- "Owner posts to own Page" works in Development mode with the owner as app Admin: no App Review, no Business Verification. A friend can be covered only if they hold a role (Tester roles are restricted by Meta to employees/people acting on your behalf; Authorized App Tester also requires they work on your behalf), so a general "friends use my app" setup is a grey area. Treat any user without a role as requiring Live mode + Advanced Access.
- The docs say nothing about a user-count ceiling in Development mode other than role caps (500 admins, ~50 testers).
- Nothing read says a Page owner must hold a role in a different sense; the practical requirement is that the person who logs in (and holds CREATE_CONTENT on the Page) has a role on the app.

### Gaps
- No official statement was found on whether an individual without a registered company can complete Business Verification, which documents Nepal-based individuals can use, or review timelines for App Review. Business Help Center pages could not be read. Mark: verify at business.facebook.com security centre.
- Whether the "Pages" use case in the App Dashboard needs a Business-type app or Business Portfolio at creation: not found.
- Whether the Page itself must belong to the same Meta Business Portfolio as the app: not found.

## 2. Reels publishing flow, scheduling, hosting

### Takeaway
Three calls on the Page: start, upload bytes (either as a binary POST to rupload.facebook.com, or by giving Meta a public file URL), finish with video_state=SCHEDULED and scheduled_publish_time. So Facebook itself publishes later. The doc supports uploading local bytes, but CORS from a browser is not documented and one developer thread shows a failure (on a different, graph-based upload), so a Worker proxy or a hosted URL is the likely route.

### Cited Findings
- Step 1 start: `POST https://graph.facebook.com/v26.0/{page-id}/video_reels` with `upload_phase=start` and the Page access token; returns `video_id` and `upload_url`. — [Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing/)
- Step 2 upload, local file (doc example): `curl -X POST "https://rupload.facebook.com/video-upload/v26.0/video-id" -H "Authorization: OAuth Your_page_access_token" -H "offset: 0" -H "file_size: Your_file_size_in_bytes" --data-binary "@my_video_file.mp4"`. Content-Type `application/octet-stream`; success returns `{"success": true}`. — same page
- Step 2 hosted file (doc example): same endpoint with `-H "file_url: https://some.cdn.url/video.mp4"`. Hosts must allow the `facebookexternalhit/1.1` user agent; Meta CDN (fbcdn) URLs are rejected. — same page
- Resume: `GET https://graph.facebook.com/v26.0/{video-id}?fields=status`; resume by re-sending with `offset` = `bytes_transfered`. — same page
- Step 3 finish: `POST /{page-id}/video_reels` with `video_id`, `upload_phase=finish`, `video_state` (DRAFT, SCHEDULED, PUBLISHED); optional `description`, `title`, `scheduled_publish_time`, `is_ai_generated`, `place`. — same page; field list also in [Page video_reels reference](https://developers.facebook.com/docs/graph-api/reference/page/video_reels/) (video_state enum DRAFT/PUBLISHED/SCHEDULED; scheduled_publish_time "datetime/timestamp"; error 613 rate limit, 190 invalid token, 200 permissions, 100 invalid parameter, 6000 upload problem, 368 abusive/disallowed)
- Scheduling rule: "If set, the publish time must be greater than 10 minutes from the current time and within 29 days of the current date." `scheduled_publish_time` is only valid with `video_state` = `SCHEDULED`; value is a Unix timestamp. — same Reels page
- Rate limit: "Reels API is limited to 30 API-published posts within a 24-hour moving period." Enforced on `POST /{page_id}/video_reels`. "Meta recommends that your app also enforces the publishing rate limit, especially if your app allows app users to schedule posts to be published in the future." — same page
- Video spec (doc extract): mp4, H.264/H.265 (VP9, AV1 also supported); 9:16; 1080x1920 recommended, 540x960 minimum; 24-60 fps fixed progressive; 3-90 seconds; AAC-LC stereo 48 kHz, 128 kbps or higher. — same page
- Maximum file size: the doc does not state one; `file_size` is just "The total size in bytes." Whether the video must stay hosted after upload: not stated beyond that the `file_url` must be publicly reachable for the upload. — same page
- Browser upload evidence: a Meta developer-community thread (Graph v20.0, ~148 MB MP4, Resumable Upload API, from localhost:3000) reports "no Access-Control-Allow-Origin" and a 403 on the OPTIONS preflight; the accepted workaround was a server-side CORS proxy; no official fix is given. That thread concerns the generic resumable upload, not rupload.facebook.com for Reels. — [Meta community thread](https://developers.secure.facebook.com/community/threads/486109443829984)
- One third-party guide claims Reels cannot be scheduled through the API; Meta's own doc (above) contradicts it, so the third-party claim is not relied on. — [postproxy guide](https://postproxy.dev/blog/facebook-graph-api-posting-guide/) (search snippet only)

### Inferences
- With SCHEDULED state, Facebook holds the video; the app does not need to run at 9:00. Not documented: whether the file source must remain online after finish. After finish, the video is processed on Meta's side, so a hosted URL most likely only needs to survive until processing completes (verify in spike).
- Token expiry before the scheduled time: no official statement found. The publish is performed by Meta after the finish call returned success, so the likely behavior is that it still publishes, but this is an inference, not documented (verify in spike by scheduling with a short-lived token and waiting).
- A static site cannot assume rupload accepts browser CORS. Safe design: a Cloudflare Worker proxies the upload (but note Workers request body limits; verify), or the app uploads the file to R2 and uses `file_url`.

### Gaps
- Max file size, CORS behavior of rupload.facebook.com, post-upload hosting requirement, and token-expiry-vs-scheduled-publish behavior: not found in official docs. The Reels doc's per-reel error handling for scheduled reels that fail at publish time: not found.

## 3. Tokens without a server, domain settings

### Takeaway
One session fully in the browser is plausible: JS SDK login gives a short-lived user token, and /me/accounts returns a Page token. But the long-lived exchange needs the app secret, so a server (a Worker) is required for anything beyond that session. A Worker is a normal place to keep the secret.

### Cited Findings
- Lifetimes: "Short-lived tokens typically last about one to two hours, while long-lived tokens last about 60 days." "Do not depend on these lifetimes remaining the same." Web-login tokens are short-lived and convertible via a server-side call that uses the app secret. — [Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)
- Exchange: GET `oauth/access_token` with `grant_type=fb_exchange_token`; `client_secret` is required. Quote: "Your app secret is included in this API call, so you should never make the request client-side." — [Long-lived tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)
- Page tokens: "Default User and Page access tokens are short-lived, expiring in hours." "If you need a long-lived Page access token, you can generate one from a long-lived User access token." "Long-lived Page access token do not have an expiration date" but "only expire or are invalidated under certain conditions." — same page
- Getting the Page token: GET `/{user-id}/accounts` returns the Pages the user has a role on with a Page access token each; "Page access tokens are unique to each Page, admin, and app combination." Pages API getting-started: the token returned there is described as short-lived when called with a short-lived user token; permissions listed there include pages_manage_metadata, pages_manage_posts, pages_manage_read_engagement, pages_show_list. — [Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens); [Pages API getting started](https://developers.facebook.com/docs/pages-api/getting-started)
- Security: "Therefore the App Secret or an App Access token should never be included in any code." OAuth redirect: "The full URI must be an exact match." "Enabling Strict Mode is required for all apps." JS SDK: the domain "must match one of the entries" in Allowed Domains; only HTTPS pages are supported for JS SDK authentication. Manual flow: `response_type=token` returns the token in the URL fragment, but verifying a token (debug_token) must not be done from the client. — [Facebook Login security](https://developers.facebook.com/docs/facebook-login/security); [Manual login flow](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow)
- Data deletion: callback must be HTTPS; Facebook POSTs `signed_request`; verify HMAC-SHA256 with the app secret; respond with JSON `{ url, confirmation_code }`. Doing this verification needs the secret, so it is also a Worker job. — [Data deletion callback](https://developers.facebook.com/documentation/development/create-an-app/app-dashboard/data-deletion-callback.md)
- Basic Settings: App Domains ("Domains and subdomains of your app ... used during Graph API request for verification"), Privacy Policy URL, User Data Deletion, Terms of Service URL (required for Live). — [Basic Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings)

### Inferences
- Settings needed for introcut.app: App Domain `introcut.app`; JS SDK allowed domain and Valid OAuth Redirect URI on `https://introcut.app/...`; privacy-policy URL on the same domain; data deletion URL (instructions page is enough per the "either" wording, a Worker callback if wanted).
- Minimum-server design: browser login (token in memory), browser calls /me/accounts and the three Reels calls in one session; a Worker is needed only for persistent tokens and for any proxy of the upload.

### Gaps
- Whether the short-lived Page token is accepted by rupload and scheduled finish: expected yes, not documented. Whether a Page token derived from a short-lived user token is itself short-lived: Pages API doc says short-lived; the Access Tokens page gives no Page-token lifetime.
- Cloudflare Worker specifics were not researched here.

## 4. Meta native scheduling and policy

### Takeaway
Meta Business Suite offers free native scheduling of Reels for Pages, but the official help pages could not be read, so limits are only from third-party blogs. No official Platform Terms text on automated posting was retrievable. Meta's originality policy affects distribution of unoriginal Reels, which matters for AI/stitched content.

### Cited Findings
- Business Help Center pages for "Save, Schedule and Reschedule Posts in Meta Business Suite" and "Create a Facebook Reel" returned only their titles (content not readable). Meta's overview lists scheduling for posts, stories, reels. — [Create a Facebook Reel](https://www.facebook.com/business/help/2683452421955589); [Schedule in Business Suite](https://www.facebook.com/business/help/2223502627919449) (titles only)
- Third-party blogs (Planable, Publer, Nuelink and others) say Business Suite schedules Reels up to 29 days ahead, with one saying from 20 minutes; Pages only, not profiles. Secondary, unverified. — [Planable](https://planable.io/blog/schedule-facebook-reels/)
- Platform Terms extract: no clauses on automated or repetitive posting; closest: sharing on a user's behalf only "when a User expressly directs you to share or expressly consents" (section 3.c.ii.3), and requests for data limited to what is necessary. Meta defers to Developer Policies. — [Meta Platform Terms](https://developers.facebook.com/terms/)
- Originality (news coverage of Meta announcements, not Meta's own text): original means filmed or produced by the Page owner; minor edits (borders, captions, speed) and re-uploads are unoriginal; repeat offenders can lose monetization and reach. — [Mediapost](https://www.mediapost.com/publications/article/413530/meta-defines-original-content-tests-protection.html); [exchange4media](https://www.exchange4media.com/digital-news/meta-updates-policies-to-reward-original-creators-and-limit-reposted-content-152931.html)
- The Reels API sets `is_ai_generated` as an optional publish field. — [Reels Publishing API](https://developers.facebook.com/docs/video-api/guides/reels-publishing/)

### Inferences
- Introcut must beat a free, native, 29-day (reportedly) scheduler, so scheduling alone is not a differentiator; the value is "make and schedule in one place".
- Because the publish call is user-initiated per upload, a single-user flow looks like ordinary third-party scheduling, but nothing official was found confirming a policy for third-party schedulers.

### Gaps
- Official Meta statement on third-party scheduling tools, spam/automation limits beyond the 30/24h API cap, and Business Suite scheduling window/limits: not readable; verify in Meta Business Help Center.
- Meta's own originality policy page: not read (one candidate URL 404).

## 5. Nepal and Facebook monetization

### Takeaway
Only secondary news found: Nepal reportedly became eligible for Facebook Content Monetization, with tightened thresholds in late 2025; no official page read. Mark verify.

### Cited Findings
- Ekantipur (2025-12-18): new rules require "at least three reels within 90 days, have 10,000 user followers, and have 150,000 views within 28 days"; the article headline asks whether monetization was shut down in Nepal and a search snippet says the reports of shutdown were not accurate, attributing issues to rule changes. — [Ekantipur](https://ekantipur.com/news/2025/12/18/en/has-facebook-monetization-been-shut-down-in-nepal-this-is-the-reality-00-18.html)
- Nepalitelecom reports Nepal was added to the eligible-countries list after earlier being invitation-only; Ekantipur 2025-12-04 guide says Nepali bank accounts can be linked for payout (snippet only). — [Nepalitelecom](https://nepalitelecom.com/facebook-monetization-in-nepal); [Ekantipur guide](https://ekantipur.com/technology/2025/12/04/en/is-your-facebook-profile-monetized-heres-how-to-earn-money-38-23.html)
- Conflicting: a Tribune (Pakistan) piece says payout details are requested from certain countries (US, UK, UAE, India); Nepal not in its list; and an older Epidemic Sound guide says Nepal creators cannot monetize. — [Tribune, 2026-06](https://tribune.com.pk/story/2534763/why-facebook-pages-got-demonetised-and-how-to-reclaim-monetisation)

### Gaps
- Official Meta eligible-countries list and Nepal payout availability as of October 2026: not found. Tell the owner to check the Professional Dashboard Monetization tab.

## 6. YouTube scheduling

### Takeaway
Scheduling is `status.publishAt` with `privacyStatus=private`. Default is 100 uploads/day. Official YouTube pages currently conflict on whether unverified API projects get locked private, so the owner must test it. A project used by the owner for their own channel is not exempted anywhere I could read.

### Cited Findings
- `status.publishAt`: "The date and time when the video is scheduled to publish." "It can be set only if the privacy status of the video is private." `privacyStatus` defaults to public if unspecified. — [videos resource](https://developers.google.com/youtube/v3/docs/videos)
- `videos.insert`: "Quota impact: 100 calls per day. A call to this method has a quota cost of 1 unit in the Video Uploads quota bucket." "Maximum file size: 256GB". — [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert)
- Default quota: "100 search.list calls, 100 videos.insert calls, and 10,000 units per day combined for all other endpoints." "A video upload costs 1 unit." To exceed it, complete an audit via the "YouTube API Services - Audit and Quota Extension Form." — [Getting started](https://developers.google.com/youtube/v3/getting-started); [Quota and compliance audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits)
- Revision history: 2026-06-01 move to granular quota buckets starting with `videos.insert`; 2025-12-04 upload cost revised "from approximately 1600 units to approximately 100 units" (pre-granular accounting). — [Revision history](https://developers.google.com/youtube/v3/revision_history)
- Locked-private rule, original: 2020-07-28 entry: "All videos uploaded via the videos.insert endpoint from unverified API projects created after 28 July 2020 ... will be restricted to private viewing mode"; lifted only by an audit; projects created before were not affected then. — [Revision history](https://developers.google.com/youtube/v3/revision_history)
- Conflict: the current `videos.insert` reference says: "Videos uploaded from unverified API projects are not restricted to private viewing mode." Yet the YouTube Help page says: "For videos that have been locked as private due to upload via an unverified API service, you will not be able to appeal," and "The unverified API service can also apply for an API audit." No revision-history entry removing the restriction was found in the first ~200,000 characters read. — [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert) contradicted by [YouTube Help 7300965](https://support.google.com/youtube/answer/7300965)
- Upload scope: `https://www.googleapis.com/auth/youtube.upload` "allows an application to upload files to the authenticated user's YouTube channel." Resumable uploads supported. — [Uploading a video](https://developers.google.com/youtube/v3/guides/uploading_a_video)
- Developer policies: "please apply for an API Compliance Audit." — [Developer Policies guide](https://developers.google.com/youtube/terms/developer-policies-guide)

### Inferences
- The owner uploading to their own channel is not exempted in any page read; a quick test with a new Cloud project (create project, private upload with publishAt) shows whether it locks.
- Shorts specifics (length, vertical): the Help page fetch failed (404 on the guess URL); not researched. Mark verify.

### Gaps
- The audit's detailed requirements and review timeline: not found. Shorts rules: not read.

## 7. One-day spike plan (own Page, tomorrow 09:00)

### Takeaway
This is achievable in Development mode with the owner as app Admin and Page admin, no review. Steps below are built from the documented flow; expected responses beyond `{"success": true}` and `video_id`/`upload_url` are not documented in what was read.

### Plan (derived from cited docs above)
1. Create a Meta developer account and an app (Pages use case adds business_management, pages_show_list, public_profile by default per [Pages use case](https://developers.facebook.com/documentation/development/create-an-app/pages-use-case.md); add pages_manage_posts and pages_read_engagement). Keep it in Development mode. You are Admin automatically.
2. Use a Facebook Page you administer (the account used to log in must be able to do CREATE_CONTENT on it).
3. Settings: App Domain `introcut.app`, valid redirect/JS SDK domain `https://introcut.app`; privacy URL; data deletion instructions URL (only needed later for Live).
4. Test video: mp4, H.264 + AAC 48 kHz stereo, 1080x1920, 30 fps, 15-30 s.
5. In the browser: FB login with the three scopes, call `/me/accounts` for the Page id and token.
6. `POST /{page-id}/video_reels` `upload_phase=start`, then upload bytes to the returned `upload_url` / rupload endpoint with `Authorization: OAuth <page token>`, `offset: 0`, `file_size`. Expect CORS trouble from the browser: if it fails, route the upload through a Worker or switch to `file_url` from R2 (public URL allowing `facebookexternalhit/1.1`).
7. `POST /{page-id}/video_reels` `upload_phase=finish`, `video_state=SCHEDULED`, `scheduled_publish_time=<unix now+24h>`, description. Check `GET /{video-id}?fields=status`.
8. Verify in Meta Business Suite that the Reel appears under scheduled content; test also a reel with token expiry (short-lived token, wait 2 h+ before the scheduled time of a second test reel scheduled at +15 min) to settle the token-expiry gap.
9. Common errors from the doc: 190 invalid token, 200 permissions, 100 invalid parameter, 613 rate limit, 6000 upload problem; a publish time under 10 minutes or over 29 days is invalid.
10. Optional parallel 1-hour YouTube test: new Google Cloud project, OAuth consent in testing mode, upload private with `publishAt` and see if it unlocks.

### Gaps
- Exact JSON error bodies and the response to the finish call were not found in the docs read.
