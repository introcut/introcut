# Platform plan: sign-in, projects, and "whose credits"

Decided with the owner on 2026-10-21. Sources are third-party reports unless marked; anything marked **verify** must be checked before it is relied on.

## What changed in the product
- **Landing page → "Get started" → Google sign-in → Home.** Home is the one question (a chat-style box with a + for files) and the person's projects below it.
- **Projects replace the media bin.** Every idea is a project. A project's **Overview** is its folder: what you sent, Introcut's check, the script, the clips and the final video. It reads from the project file, so it is a true record.
- **No Settings page.** The account menu (bottom of the sidebar) holds who you are, the AI connection, storage use and sign out.

## What sign-in is, and is not (today)
- Google sign-in only identifies the person (name, e-mail, picture). It is done in the browser with Google Identity Services; there is **no server**, so the token is decoded locally and not verified by us.
- Projects are stored **per person on this device** (OPFS `introcut-v2/u/<google id>/p/<project id>/`). Signing in on another device does **not** bring the projects. Cross-device sync needs storage we don't have yet (see "Next decisions").
- Setup: create an OAuth client ID (Web application) in Google Cloud Console, add `http://localhost:5173` and `https://introcut.app` as authorized JavaScript origins, and put it in `.env.local` as `VITE_GOOGLE_CLIENT_ID=…`. Without it the sign-in page offers a clearly labelled guest mode (for development).

## "Use their Google ID's free credits to generate video": findings
The idea is that Introcut calls a video generator with the user's own Google credit. As far as the sources show, **this does not work for Google's video tools**:

- **Flow's free credits are a consumer-app allowance** (reported: about 50 per day without a paid plan, no roll-over). They are **separate from API billing** and cannot be converted into API usage. ([DiyAI](https://diyai.io/ai-tools/video-generation/google-veo-pricing/))
- **Veo through the API is paid** (reported about $0.40 per second of output, no free tier in the lists we saw). The developer route is Vertex AI with a Google Cloud project. ([Finout](https://www.finout.io/blog/gemini-pricing-in-2026)) **verify** on Google's own pricing page.
- **A Google OAuth login does not automatically make the user pay.** A developer reported that Gemini API calls made with OAuth tokens were billed to *their own* Cloud project; the "per-user quota" scope is deprecated and poorly documented. ([Google AI forum](https://discuss.ai.google.dev/t/unexpected-billing-when-using-gemini-api-with-oauth-scopes-and-deprecated-peruserquota-scope/95821)) Using the Gemini CLI's OAuth in third-party software is reported as a policy violation. **verify**
- Driving the Flow website on the user's behalf (automation) would be a terms-of-service risk and is **not something Introcut will build**.

What *can* work, each needing its own verification:
1. **The user's own AI Studio key for text** (script, idea check). Works today through "My own AI". Free-tier limits are Google's. This is the honest version of "their credit".
2. **Hugging Face sign-in for open video models.** On ZeroGPU Spaces, a visitor who signs in on the Space with Hugging Face uses *their own* GPU quota (reported about 300 s/day when logged in; anonymous visitors by IP). Wan 2.x Spaces exist. Reports say calling a Space from code with a token is unreliable; the in-Space sign-in works. ([HF forum](https://discuss.huggingface.co/t/exceeded-gpu-quota/107022)) **verify** with a real test (new gate G8).
3. **Keep recommending a tool and writing the prompt** (M4): the user generates in Flow or elsewhere and drops the clip in. No terms risk, uses the user's free credits, zero build cost.

Recommendation: ship (3) first, offer (1), and test (2) before promising anything. Do not tell users "your Google credits generate the video".

## Measuring whether the platform improves
Server-side records of users' scripts and videos would break the privacy promise (media and ideas stay on the device). Instead:
- **Per-project record on the device** (the Overview), which the user can export.
- **Opt-in, content-free feedback** (later): a thumbs up/down on the script, "did you post it?", counts of checks, scripts and exports. No ideas, no files, no names. Needs a tiny free endpoint (for example Cloudflare Workers) and an on-screen notice. Version history per project ("script v1, v2") shows improvement to the user too.

## Next decisions for the owner
- **Cross-device projects:** (a) stay local for V1 (current), (b) back up to the user's own Google Drive app-data folder (needs a Drive scope; verification requirements **verify**), (c) our own storage (breaks zero-cost; not recommended).
- **Rules to update (done in CLAUDE.md):** Google sign-in is now an allowed labelled outside call.
