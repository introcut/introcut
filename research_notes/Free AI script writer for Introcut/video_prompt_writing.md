# Writing prompts for free AI video generators (Introcut: ~30 s story from 4-6 clips)

Research date: 2026-10-21. Most sources are third-party blogs (many are vendor marketing); Google's own Flow help page and Google's Vertex prompt guide are the only official sources I could read. Every free-tier number below is dated with its source date. Anything older than ~3 months (before 2026-07-21) is flagged "STALE?". Sections marked "Inferences" are my own synthesis, not sourced facts.

---

## 1. Free-tier reality per generator (as of Oct 2026)

### Takeaway
Only Google Flow has a first-party documented, daily, no-subscription free allowance (50 credits/day, about 5 Veo 3.1 Lite clips of 4/6/8 s with audio). Kling (66/day, disputed), Dreamina (daily, ~120 baseline, disputed) and PixVerse (daily, 30-60) are the other recurring-daily options; Hailuo, Runway and Luma are one-time/trial/limited; Pika is monthly; Wan 2.2 is the only open-weights route (needs a GPU); Sora is discontinued. Nearly all free tiers are watermarked and non-commercial; every number changes often, so Introcut should store these as editable, dated data, not hard-code them.

### Cited Findings

**Google Flow / Veo (the strongest free option)**
- Official: users without Google AI Plus/Pro/Ultra get 50 Flow credits per day; credits work for Veo 3.1 Lite, Fast and Quality; the daily refresh is triggered by your first generation (not midnight); unused credits do not roll over. — [Google Flow Help, "Manage your Google Flow credits"](https://support.google.com/flow/answer/16526234?hl=en) (no date on page; fetched 2026-10-21)
- Official cost table: Veo 3.1 Lite (4 s, 6 s, 8 s, and extend) = 10 credits; Fast = 20; Quality (8 s only) = 100 (beyond the free daily 50). So free = about 5 Lite or 2 Fast clips per day. Gemini Omni Flash (a newer model) is also listed at 360p/720p for 4-10 s clips at 4-15 credits. — [Google Flow Help](https://support.google.com/flow/answer/16526234?hl=en)
- Official restrictions for free users: video generation may be unavailable at peak hours (roughly 2-5 PM UTC, which is about 7:45-10:45 PM Nepal time); no 1080p/4K upscaling; cannot buy extra credits; "Lower Priority" Lite mode is not available. — [Google Flow Help](https://support.google.com/flow/answer/16526234?hl=en)
- Resolution on free tier: the Flow help page only lists 360p/720p for Omni Flash and says no 1080p upscaling for non-subscribers; one third-party guide says free output is capped at 720p. — [diyai.io, updated 2026-09-20](https://diyai.io/ai-tools/video-generation/google-veo-pricing/) and [Google Flow Help](https://support.google.com/flow/answer/16526234?hl=en)
- Watermark: CONFLICT. A Google-Veo pricing roundup says free output carries a visible "Made with Veo" watermark and no commercial use ([search summary of 2026 guides](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026), Krea, 2026-08-27, says only "Watermark: yes"); the official help page does not mention a visible watermark; another guide says Veo output carries an embedded invisible SynthID mark that survives editing. — [aivideosensei, verified 2026-08-14](https://aivideosensei.com/guides/google-veo-access-and-free-tier). Treat "visible watermark on free tier" as probable but unverified; invisible SynthID is documented.
- Commercial use on free tier: not stated by any source I could read; Krea says "check Google's terms". Treat as NOT cleared. — [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026)
- Native audio: Veo 3 generates sound effects, ambience and speech; Google called Flow audio "still experimental" in July 2025. — [Google Flow blog, 2025-07-10](https://blog.google/technology/google-labs/flow-adds-speech-expands/) (STALE? >3 months). Krea notes Lite clips include audio. — [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026)
- Vertical 9:16: Google says Veo 3.1 "Ingredients to Video" adds native vertical output and upscaling to 1080p/4K (upscaling is paid-only for Flow). — [Google blog, Veo 3.1 Ingredients to Video](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/). Whether free-tier text-to-video offers 9:16 in Flow UI was not verified.
- Region: Google's "Where you can use Flow" page lists both Nepal and India as supported (users 18+); Nepali and Hindi appear in the supported-language list (this is likely UI language, NOT spoken-dialogue support). The page has no date. — [Google Labs support](https://support.google.com/labs/answer/16353544). A July 2025 report said India was initially excluded; that is old. — [Social Samosa / 2025](https://www.socialsamosa.com/news-2/google-veo-3-ai-video-generation-model-rolls-71-countries-9310379)
- Paid pointers: Google AI Pro listed with 1,000 Flow credits. — [diyai.io, 2026-09-20](https://diyai.io/ai-tools/video-generation/google-veo-pricing/)

**Kling (Kuaishou)**
- Free: 66 credits per 24 h, reset daily, no rollover (cut from 166); about 6 standard clips; ~5 s per clip standard (some modes 5-10 s); watermark on every export; no commercial use; low priority, one task at a time; web app only, no API. — [aireiter, updated 2026-07-08](https://aireiter.com/blog/kling-ai-free-tier-2026) (STALE? about 3.5 months)
- Dispute: a source citing Kling's membership guide as of 2026-08-03 says the Basic plan is free with no fixed monthly credits (not guaranteed daily); another says 66 credits per month. — [photonpay / crepal search results (Aug 2026)](https://crepal.ai/blog/aivideo/is-kling-ai-free-pricing/); [Dreamina comparison, 2026-08-27](https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026) calls Kling credits "promotional, not guaranteed, variable". Verify in account.
- Resolution on free: sources disagree (360-540p vs "site lists up to 1080p"; some users report 720p). — [aireiter](https://aireiter.com/blog/kling-ai-free-tier-2026)
- Native audio (dialogue, ambience, SFX in one generation) is supported in Kling VIDEO 3.0 / 3.0 Omni; languages listed: Chinese, English, Japanese, Korean, Spanish (plus dialects/accents). Nepali and Hindi are NOT in the list. Whether the free tier can use 3.0 audio is not stated. — [Kling blog, 2026-08-07](https://kling.ai/blog/kling-ai-prompt-guide)
- Nepal/India sign-up: not established by any source (one old Korean post says it once needed a Chinese phone number, likely outdated). Gap.

**Hailuo / MiniMax**
- No reliable daily free credit in 2026: the "100 free/day" claim comes from an older dropped policy; new accounts get a one-time welcome package (reported 200 credits, about 8 clips at 768p/6 s) that expires 3 days after grant. — [aireiter Hailuo pricing](https://aireiter.com/it/blog/hailuo-ai-pricing) (single blog, unverified); Krea says 6 s clips, 720p, watermark, "small daily drop", no commercial use — [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026). Sources conflict (daily vs one-time); the Dreamina comparison says one-time and watermarked on free downloads — [Dreamina article, 2026-08-27](https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026).
- Nepal/India availability: not found. Gap.

**Dreamina / Seedance (ByteDance/CapCut)**
- Daily recurring free credits; Dreamina's own guide cites ~120 credits/day baseline (August 2026) and says to check your account; third-party blogs say 225 daily tokens (unverified); free output is watermarked; credits expire within ~3 days of earning; Seedance 2.5 access depends on eligibility, account and region; commercial-use status of free output not found. — [Dreamina guide (search summary)](https://dreamina.capcut.com/ai-video/free-ai-video-generator-usable-clips-guide-2026); [Dreamina, 2026-08-27](https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026). Note: Dreamina is the vendor's own marketing page.
- Clip length/audio/9:16 on free tier: not found in readable sources. Gap.

**Wan (Alibaba)**
- Open weights stopped at Wan 2.2 (released 2025-07-28, Apache 2.0, 27B MoE plus a 5B variant). Wan 2.5, 2.6, 2.7 (and a reported 3.0 beta) are API-only/closed; claims that later versions are open are described as wrong. — [HowAIWorks](https://howaiworks.ai/blog/alibaba-wan-open-weights-stopped-at-2-2); [Atlas Cloud (vendor)](https://www.atlascloud.ai/blog/tips/is-wan-3.0-open-source)
- "Unlimited free" only means running Wan 2.2 locally on an NVIDIA GPU, no credits, no watermark. — [Dupple summary via search](https://dupple.com/learn/best-free-ai-video-generators). Not usable for most browser-only users, so Introcut should treat Wan as "advanced/optional".
- Hosted trials of Wan 2.6 exist on aggregators (e.g. Pollo AI free trial with limited credits). — [Pollo AI](https://pollo.ai/m/wan-2-6). Wan 2.6 reportedly has native audio and up to 15 s, from aggregator pages only (low confidence).
- Free Hugging Face Space for Wan: I found no verified, stable one. Gap.

**Luma (Dream Machine / Ray3)**
- Free: no permanent free tier on current pricing page per one source; legacy/trial credits, draft resolution, watermark, non-commercial; sources disagree (30 generations vs ~80 credits/day vs limited monthly). Paid Plus (~$30) allows commercial use and no watermark; Luma terms say you may not remove embedded watermarks/identifiers. — [toolradar / gptprompts / review search results](https://gptprompts.ai/ai-pricing/luma-ai-pricing) (low confidence); [Dreamina comparison, 2026-08-27](https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026).

**Runway**
- Free: one-time 125 credits, no top-ups, no refill; watermark on all free outputs; limited models; about 5 s of Gen-4.5 or 25 s of Gen-4 Turbo per grant (Gen-4 Turbo availability on free unverified). — [Creatify, checked Aug 2026](https://creatify.ai/blog/runway-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay); [eesel.ai](https://eesel.ai/blog/runway-ai-pricing). Practically a one-clip trial.

**Pika**
- 80 credits per month (recurring monthly, not daily); mostly 480p on Pika 2.5; sources disagree on watermark (Krea: yes; Dreamina article: watermark-free downloads listed). — [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026); [Dreamina article, 2026-08-27](https://dreamina.capcut.com/ai-video/free-ai-video-generators-recurring-credits-vs-trials-2026).

**PixVerse**
- Daily credits reset at 00:00 UTC; figures disagree: 90 signup + 60/day vs 100 signup + 30/day; free exports watermarked; resolution cap 540p or 720p; watermark removal is paid. — [Atlas Cloud (vendor) 2026](https://www.atlascloud.ai/vi/blog/guides/pixverse-ai-free); [toolsforhumans](https://www.toolsforhumans.ai/ai-tools/pixverse-ai); [fast.io](https://fast.io/resources/pixverse-ai-review-2026/)

**Vidu** — no readable source on its free plan found. Gap.

**Sora (OpenAI)** — discontinued: OpenAI announced on 2026-03-24 that it is shutting down the Sora app and API; Krea says the consumer app shut on April 26, 2026 and the API on September 24, 2026. No free Sora route. — [9to5Google, 2026-03-24](https://9to5google.com/2026/03/24/openai-shutting-down-sora-video-generation-app-but-without-explaining-why/); [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026)

**General**
- Most free tiers watermark and forbid commercial use; paid plans remove the watermark. Introcut must never strip watermarks (several vendor terms, e.g. Luma, forbid removal). — [Krea](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026); [Luma terms via review search results](https://gptprompts.ai/ai-pricing/luma-ai-pricing)
- Krea (a competitor) lists no free video at all on its plan. — [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026)

### Inferences
- A 30 s, 5-clip project needs about 5 x 8 s = 40 s of footage; at 10 credits per attempt, one Flow free day (50 credits) yields roughly 5 attempts, which is enough for one take of each shot but nothing for retries. Hands/dialogue shots are reported to need many retakes (anecdotal 1 keep in 8-20), so realistically a story takes 2-4 days of free Flow credits. Introcut should plan a "credit budget" view and schedule risky shots first.
- Suggested default ladder for Introcut: Flow Veo 3.1 Lite/Fast (audio, best prompt adherence) first; Kling and Dreamina as second and third daily-credit pools (rotate across tools to multiply the free allowance); Hailuo/Runway/Luma as optional one-off trials; Wan 2.2 local as an "advanced" option.
- Because credit/region facts conflict across sources, ship them as a small data file (generator profile) with a "last verified" date and a "verify in your account" label.
- Free-tier outputs with visible watermarks need a plan: either shots go through paid/own credits or Introcut flags the export "contains third-party watermark" rather than removing it; never crop/inpaint marks.

### Gaps
- Official, dated Flow statement on free-tier visible watermark, resolution (360p/720p/1080p for Lite/Fast) and commercial use was not found.
- Vidu, Wan hosted free options (wan.video credits, HF Spaces), Hailuo/Luma/Pika exact current free numbers: no official page was read; all from blogs.
- Whether Kling, Dreamina, Hailuo, PixVerse, Luma, Runway can be signed up and used from Nepal/India: no source found (Flow: yes per Google). Introcut should tell users to try and report.
- Free-tier 9:16 support per generator: only inferable (most support vertical, but not verified for free tier).

---

## 2. Official and community prompt-structure guidance

### Takeaway
All guides converge on the same skeleton: Subject, Action, Scene/Context, Camera, Lighting/Style/Mood, (Audio). Differences: Veo (audio and dialogue in the same prompt, separate sentences, no "no/don't" in negatives), Kling (formula Subject + Movement + Scene + Camera + Lighting + Atmosphere, structured speaker-labelled dialogue, multi-shot mode, element references), Wan/image-to-video (the image defines the look, so the prompt should only describe motion + camera + pace; keep it short).

### Cited Findings
- Google official Veo guide (page "last updated 2026-10-21"): prompt components are subject, action, scene/context, camera angle and movement, lens/optical effects, visual style (lighting, mood), temporal elements (pacing), audio, cinematic terms; "Breaking your idea down into key components is the most effective way"; not every prompt needs every element. — [Google Cloud Veo prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)
- Same guide, audio: "Clearly specify if you want audio. We recommend that you use separate sentences in your prompt to describe the audio." Covers sound effects, ambient noise and dialogue. — [Google Cloud Veo prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)
- Same guide, negatives: avoid instructive words like "no"/"don't"; list the unwanted elements directly (e.g. the negative prompt names "urban, stormy" for an oak-tree scene). Camera vocabulary: eye-level, low-angle, bird's-eye, Dutch angle, close-up; pan, tilt, dolly, zoom, crane, whip pan, arc; lens: wide-angle, telephoto, shallow depth of field, rack focus. "Some advanced camera angles are not officially supported." — [Google Cloud Veo prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)
- Official Vertex docs treat Veo clips as 4, 6 or 8 s. — [Flow Help cost table](https://support.google.com/flow/answer/16526234?hl=en); [frameo guide](https://frameo.ai/blog/google-veo-3-prompt-guide-best-practices/)
- Community Veo tips (Replicate): introduce speech with a colon rather than quotation marks, because quoted speech makes baked-in subtitles more likely; Veo often produces misspelled burned-in subtitles; add "(no subtitles)"; keep dialogue to what is speakable in ~8 s (too long = rushed/breathless, too short = awkward silence or gibberish); in multi-character scenes lines can be assigned to the wrong character, so tie each line to a distinguishing visual trait; respell names phonetically; if ambient audio is not specified the model may add a laughing studio audience, so describe ambience explicitly; reuse the character description verbatim. — [Replicate, "Using and prompting Veo 3"](https://replicate.com/blog/using-and-prompting-veo-3) (community, mid-2025, STALE? for model-version specifics but still the best hands-on source found)
- Kling official blog (2026-08-07): write scene direction, covering subject, action, setting, camera language, lighting, mood; name framing/movement (close-up, wide, low angle, push-in, pan, tilt, tracking shot) and pace (slow, steady, quick). Native audio in 3.0: keep each speaker's name, line and delivery together with clear speaker labels; describe ambience plainly. Multi-shot: automatic mode (describe scene, dialogue, coverage) or custom mode (per shot: content, duration, shot size, perspective, camera move); define setting first then shots in story order. Text rendering: write exact words, placement, surface, camera distance; keep text short. — [Kling blog](https://kling.ai/blog/kling-ai-prompt-guide)
- Kling formula, secondary: "Subject + Movement + Scene + (Camera Language + Lighting + Atmosphere)"; API prompt and negative prompt each capped at 2,500 characters; camera control via six axes -10..10 in advanced UI. — [Atlas Cloud (third party)](https://atlascloud.ai/blog/tips/kling-ai-video-prompt-guide) (not verified against Kling docs)
- Wan 2.2 (community, no official "formula" found): in image-to-video the image sets the look, so the prompt covers only motion and camera; order = subject action, camera move, pace; a 5 s clip has room for one camera move and one subject action; zoom-in is the easiest camera move. — [Unifically](https://unifically.com/blogs/wan-2.2-image-to-video-prompt-guide); [Stable Diffusion Art](https://stable-diffusion-art.com/wan-2-2-text-to-video/). Four-part variant: motion, camera behaviour, environment effects, speed modifiers, plus negatives for warping/flicker. — [VEED](https://www.veed.io/learn/wan-2-2-prompting-guide). ComfyUI docs host a "Wan2.2 Prompt Guide". — [ComfyUI docs](https://docs.comfy.org/tutorials/video/wan)
- Runway, Luma, Hailuo, Pika, Seedance official guides: not retrieved in this pass. Gap.

### Inferences
- Because every generator accepts a plain English paragraph, one generator-agnostic schema plus a per-generator "renderer" function (string assembly) is enough; the differences are (a) where dialogue goes (Veo colon syntax; Kling labelled speaker lines; Wan/Hailuo/Pika: no native dialogue, so none), (b) negative-prompt field vs inline "(no subtitles)", (c) length limits.
- Introcut should keep prompts to about 60-120 words for Veo/Kling, and 25-60 words for image-to-video (Wan, Runway, Luma, Hailuo) since the image already carries appearance. Those numbers are my recommendation, not a documented limit (only Kling's 2,500 characters is a documented-ish cap).
- Safer wording rule from Google's guide: write positives; put exclusions in a separate "avoid:" list rendered as nouns.

### Gaps
- No official Runway/Luma/Hailuo/Pika/Seedance prompt guide was read.
- Google's guide section on image-to-video is a separate page (not read).

---

## 3. Generator-agnostic prompt template (LLM-fillable) and worked examples

### Takeaway
Use one JSON "shot card" per clip with fixed fields; compile it to a per-generator text prompt. The subject block (character bible) is pasted verbatim into every shot. Action is one verb phrase; camera is one move; dialogue is a short line in 8 s or less, with language tagged.

### Cited Findings
- (The structure is derived from the sources in section 2: Google's component list, Kling's formula, Replicate's dialogue and consistency tips.) — [Google Cloud Veo prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide); [Kling blog](https://kling.ai/blog/kling-ai-prompt-guide); [Replicate](https://replicate.com/blog/using-and-prompting-veo-3)

### Inferences (all content below is my own design; not sourced)

**Template (fields)**
```
shot_intent      : why this shot exists (hook / problem / step / payoff / CTA), 1 line
generator        : veo | kling | hailuo | wan | runway | luma | pika | dreamina | user_footage
mode             : t2v | i2v | ingredients | user_footage
duration_s       : 4 | 6 | 8   (cap at the generator's max; Veo 4/6/8, Kling 5, Hailuo 6)
aspect           : "9:16"
subject_block    : verbatim character/prop bible entry (copy from project, never paraphrase)
action           : ONE verb phrase, one subject, one beat
setting          : place + time of day + 3 concrete props
camera           : shot size + ONE move (e.g. "medium close-up, slow push-in")
look             : lighting + style + colour + lens (identical "style bible" string for all shots)
audio            : { ambience, sfx, dialogue: {speaker, language, line, delivery} | null }
avoid            : list of nouns/phenomena (e.g. subtitles, text, watermark, extra people)
start_frame      : optional image id (i2v / ingredients)
fallback         : what to do if it fails (e.g. "use cutaway X" or "user footage")
```

**Compiled Veo prompt (template)**
`{look}. {subject_block} {action}. Setting: {setting}. Camera: {camera}. Audio: ambience {ambience}. Sound effects: {sfx}. {speaker}, speaking {language}, says: {line} ({delivery}). Avoid: {avoid}.`
(Separate sentences for audio per Google; colon before dialogue per Replicate; no "no/don't".)

**Style bible example (reuse for all shots):** "Warm natural daylight, handheld documentary look, soft film grain, 35mm lens feel, muted green and earth tones, shallow depth of field."

**Character bible example (the monkey):** "Kaju, a small expressive rhesus monkey with light brown fur, a pale pink face with a white eyebrow ridge, bright amber eyes, wearing a faded red cotton vest with one yellow button and a thin green scarf."
(Repeat verbatim; include 1-2 unique visual traits, e.g. vest button, to bind lines to speaker.)

**Worked example 1 - Hook (Veo 3.1, text-to-video, dialogue, English, safest)**
`Warm natural daylight, handheld documentary look, soft film grain, muted green and earth tones, shallow depth of field. Kaju, a small expressive rhesus monkey with light brown fur, a pale pink face with a white eyebrow ridge, bright amber eyes, wearing a faded red cotton vest with one yellow button and a thin green scarf, sits on a terrace wall beside a basket of garlic bulbs and looks into the camera. Setting: hillside terrace farm in Nepal at sunrise, terraced green fields behind, wooden basket of garlic in front. Camera: medium close-up, slow push-in. Audio: soft birdsong and distant wind. Kaju, speaking English in a playful voice, says: Everyone plants garlic wrong. Avoid: subtitles, on-screen text, extra animals, extra people.`
Duration 6 s, 9:16. (Dialogue is 5 words, fits easily.)

**Worked example 2 - Step shot with no hands-at-risk (Kling or Veo, Dreamina alt.; silent, VO added in Introcut)**
`Warm natural daylight, handheld documentary look, soft film grain, muted green and earth tones. Close-up of dark, loose soil on a terrace bed; a single garlic clove with its pointed tip facing up rests in a small hole in the soil, and soil is gently pushed over it. Setting: vegetable terrace in morning light, tiny dew drops on leaves. Camera: top-down close-up, static. Pace: slow and steady. Avoid: hands with extra fingers, text, faces.`
Design note: the clove is the subject, not the hand; no face, no counting. Show only one clove. If the hand motion fails, replace with an after-shot (see the cutaway rule below) or user footage.

**Worked example 3 - Payoff with Nepali dialogue (Veo; Nepali speech support UNVERIFIED)**
`(same style bible + character bible as above) Kaju sits on the terrace wall at golden hour with healthy green garlic shoots behind him, grinning at the camera. Camera: medium close-up, slow push-in. Audio: gentle wind and distant temple bell. Kaju, speaking Nepali in a cheerful voice, says: राम्रोसँग रोप्यो भने लसुन धेरै फल्छ। Avoid: subtitles, on-screen text, extra animals.`
- STATUS: I found NO official or independent source confirming that Veo can speak Nepali or lip-sync it (Google's Flow page lists Nepali as a UI language only; Kling lists Chinese/English/Japanese/Korean/Spanish only). Treat as an experiment: Introcut should (a) offer an "English or Hindi line" variant and a "no spoken line, add voice-over in Introcut" variant, (b) tell the user "Nepali speech is unverified; test one clip first", and (c) never promise lip-sync. Also add a phonetic Latin respelling to the prompt in case Devanagari is ignored.
- Safer pattern for Nepali: generate the monkey clip with mouth closed/looking at camera or with a mumbling/chattering action, record or synthesize the Nepali voice-over separately in Introcut, and show Nepali captions. (Introcut's own TTS may not cover Nepali; check separately.)

**Cutaway / fallback shots for the same story**
- Garlic cloves in a wooden bowl, slow dolly-in, no people (almost never fails).
- Rain on terrace leaves, macro, static.
- Monkey reaction shot: tilts head, blinks, looks at the camera (no hands).

### Gaps
- No Nepali-language dialogue samples validated; examples above are drafts to be tested.
- Per-generator exact max prompt length is only known for Kling API (2,500 characters, third party).

---

## 4. Techniques for consistency across shots

### Takeaway
Best current practice: generate or draw one reference sheet of the character, then feed the same reference image(s) into every shot (Veo "Ingredients to Video" up to 3 references; Kling Element Reference), and repeat a verbatim character description plus a fixed style bible. Where the generator has no reference feature, use the previous shot's last frame as the next shot's start frame (image-to-video) and design cuts so small drift is hidden.

### Cited Findings
- Veo 3.1 Ingredients to Video: Google says identity consistency is improved so a character can stay the same as the setting changes; also background/object/texture consistency; adds native vertical output; upscaling to 1080p/4K (paid). — [Google blog](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/)
- Up to three reference images; keep the set small and matched in lighting, palette and camera angle; suggested slots: character, environment, style/texture (vendor suggestion, not official). — [Atlas Cloud, vendor](https://www.atlascloud.ai/blog/tips/how-to-use-veo-3.1) (search summary)
- Flow "Extend" continues action from a clip's last frames for longer shots. — [Google blog](https://blog.google/innovation-and-ai/technology/ai/veo-3-1-ingredients-to-video/) (search summary)
- Text-only Veo consistency: reuse the detailed character description verbatim; keep a reference sheet of descriptions; similar prompts give similar characters; tie dialogue to visual traits. — [Replicate](https://replicate.com/blog/using-and-prompting-veo-3)
- Kling: use Element Reference or Video Element Reference with clean source material for characters, products and props; keep the subject description steady while scene/angle/action change; pair references with consistent clothing/hairstyle/props descriptions. — [Kling blog, 2026-08-07](https://kling.ai/blog/kling-ai-prompt-guide)
- Passing a reference image set to each generation beats describing the face in words. — [Morphic troubleshooting](https://morphic.com/resources/how-to/ai-video-troubleshooting) (vendor blog)
- Wan 2.2 i2v: the start image defines the look. — [Unifically](https://unifically.com/blogs/wan-2.2-image-to-video-prompt-guide)

### Inferences
- Introcut pipeline: (1) generate/accept a character reference sheet (front/side/neutral background; Flow image generation is free for non-subscribers, per the Flow help page) ; (2) store `character_bible` (text) + `ref_images` in the project JSON; (3) every shot prompt embeds `subject_block` verbatim and tells the user which reference to attach; (4) a global `style_bible` string is appended to every shot.
- Prefer an animal, robot or stylised character over a realistic human: drift is far less noticeable, face-likeness is not a safety issue, and an animal is exempt from "real person" rules. A distinctive prop/colour (red vest, yellow button) is a strong consistency anchor.
- Hide drift: alternate between character shots and non-character shots (hands-free cutaways, B-roll), keep the character in similar framing, keep one set/lighting palette, and use hard cuts, not dissolves.
- Seed/lock features: I found no sourced, current detail on seed controls in free tiers; do not rely on seeds.
- When using last-frame as next-shot start: export the last frame in Introcut, offer it as "start frame" download (costs the user nothing).

### Gaps
- Official Google Flow doc for Ingredients (counts, 9:16 behaviour on free tier) not read; the "three references" figure is from vendor guides.
- No verified seed/lock behaviour for Kling/Hailuo/Dreamina.

---

## 5. What AI video models are bad at and shot design around it

### Takeaway
Reported weak points: hands/fingers, readable text, multi-person interaction, fast or complex motion, long continuous action, counting. Design shots with one subject, one action, slow pace, hands out of frame or as tiny/simple actions, no on-screen text in generated clips (add captions in Introcut), and use user footage/screen recordings for anything that must be accurate.

### Cited Findings
- Hands: persistently the weakest point; fingers change count between frames; workarounds: frame hands out of shot, pick the best frame, mask real hand footage over the result, simpler/visible poses, a reference clip for specific hand actions, short clips. — [Opus Pro](https://www.opus.pro/blog/ai-slop-aesthetic-12-tells); [Morphic](https://morphic.com/resources/how-to/ai-video-troubleshooting)
- Fast/jittery motion: add pace words like "slow"/"steady"; fast camera moves blur product details. — [Morphic](https://morphic.com/resources/how-to/ai-video-troubleshooting); [CapCut](https://www.capcut.com/create/ai-video-motion-physics-speed-realism)
- Text: artifacts are most visible in text; minimise on-screen text and add it in post. — [PCWorld](https://www.pcworld.com/article/3057497/why-your-ai-videos-look-distorted-and-5-fixes-that-actually-work.html); [CapCut](https://www.capcut.com/create/ai-video-motion-physics-speed-realism). Kling says text can work if you give exact words, placement and keep it short. — [Kling blog](https://kling.ai/blog/kling-ai-prompt-guide)
- Multiple characters: complex multi-subject prompts are a common failure; focus each generation on a single subject. — [PCWorld](https://www.pcworld.com/article/3057497/why-your-ai-videos-look-distorted-and-5-fixes-that-actually-work.html). Veo may attribute lines to the wrong speaker. — [Replicate](https://replicate.com/blog/using-and-prompting-veo-3)
- Retake rate for hands/dialogue/multi-person is anecdotally 1 keeper in 8-20 attempts. — [Lilach Bullock blog (anecdotal)](https://www.lilachbullock.com/?p=109372)
- Veo dialogue: better at short speech than extended conversations. — [frameo guide search summary](https://frameo.ai/blog/google-veo-3-prompt-guide-best-practices/)
- Counting: I found no source on counting objects/people. Gap.

### Inferences (design rules for the script writer LLM)
1. One subject, one action, one camera move per clip; 4-8 s; no scene-internal cuts unless the generator's multi-shot mode is used.
2. Avoid "counts" ("three garlic cloves", "five steps"); show one item or an uncounted pile.
3. Hands: prefer cutaways where the result of the hand action appears (clove already in the soil, watered bed) or a user-shot/stock hand close-up; if hands must appear, keep them small, simple, slow and in a single plausible pose.
4. No generated text: signs, labels, price tags, UI screens, packaging. Overlay text in Introcut. Phone/website screens and tutorials (e.g. "how to open the app", maps, prices, charts) must be user screen recordings or screenshots.
5. Dialogue: one speaker per clip, 5-20 words, in 8 s or less; the rest of the narration as voice-over.
6. Long actions (planting a whole row, harvest) become 3 short cutaway beats edited together, not one continuous clip.
7. Fast motion (running, throwing, splashing): slow it down in the prompt ("slow, steady") or avoid.
8. Anything factual or brand-specific (the real product, the user's face, the real farm, real prices): user footage.
9. Plan 2-3 attempts per risky shot and have a cutaway fallback in the shot card.

### Gaps
- No quantitative benchmark comparing generators on hands/text in 2026 found.

---

## 6. Decision table: which generator for which kind of shot

### Takeaway
Use Veo for anything needing native audio/dialogue or the best prompt adherence; use Kling when you need its element-reference consistency or multi-shot mode; use image-to-video tools (Kling, Dreamina, Hailuo, Wan, Runway, Luma) to animate a still start frame for atmospheric/B-roll shots; use the user's own recordings for screens, faces and facts.

### Cited Findings
- (Table is derived from the free-tier and feature facts above; individual facts are cited in sections 1-5.) — [Google Flow Help](https://support.google.com/flow/answer/16526234?hl=en); [Kling blog](https://kling.ai/blog/kling-ai-prompt-guide); [Krea](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026); [Unifically](https://unifically.com/blogs/wan-2.2-image-to-video-prompt-guide)

### Inferences (recommendation, not sourced fact)

| Shot kind | First choice | Backup | Notes |
|---|---|---|---|
| Hook with speaking character (English/Hindi) | Veo 3.1 Fast/Lite (colon dialogue) | Kling 3.0 (labelled speaker line) | Lip-sync quality unverified; test 1 clip |
| Spoken line in Nepali | Voice-over in Introcut + closed-mouth or reaction clip | Veo experiment (UNVERIFIED) | Kling lists no Nepali |
| Character reaction (no speech) | Veo Lite | Dreamina, Kling | cheap, short |
| Same character across scenes | Veo Ingredients (<=3 refs) | Kling Element Reference | consistency |
| Atmospheric B-roll / establishing | Any i2v from a still: Dreamina, Hailuo, Wan, Luma | Veo Lite | one slow camera move |
| Product/object close-up (garlic, soil) | Veo / Kling | Hailuo, Luma | no hands, no text |
| Hand action (planting, cutting) | User footage or stock | Veo with simple pose, many retakes | worst failure class |
| Screens, UI, maps, prices, text | User screen recording/screenshots | none | never generate |
| Face of the creator / real farm / real people | User footage | none | safety + accuracy |
| Fast action, crowds, multi-character | Avoid; replace with cutaways | Kling multi-shot | high failure |
| Stylised/anime look | Kling, Dreamina, PixVerse | Veo ("anime style" example in Google's guide) | style bible |
| Advanced local control | Wan 2.2 (needs GPU) | none | open weights only to 2.2 |

- Practical credit-aware rule: Veo Lite = cheapest audio clip (10 credits); reserve for dialogue and consistency-critical shots; spend Kling/Dreamina daily credits on B-roll.
- Mark each recommendation "verify in your account today" (credits, availability, region).

### Gaps
- Per-generator quality ranking for 2026 was not benchmarked here; the table reflects documented features, not tested quality.

---

## 7. Prompting an LLM to write these prompts as JSON, plus a cheap lint

### Takeaway
Have the LLM output one strict JSON object per shot (schema below) rather than free text, give it the project's character/style bibles and the generator profile (limits, quirks), and then run a rule-based lint (length, banned words, presence of camera + action + subject block, dialogue length) with auto-repair or regeneration. This is my design; I did not find a sourced standard.

### Cited Findings
- Documented constraints worth encoding: Veo clips 4/6/8 s; Quality 8 s only (Flow Help); Veo negatives should avoid "no/don't" (Google guide); dialogue speakable within ~8 s (Replicate); Kling prompt and negative prompt 2,500 characters each (Atlas Cloud, third party); Kling dialogue languages Chinese/English/Japanese/Korean/Spanish (Kling blog). — [Google Flow Help](https://support.google.com/flow/answer/16526234?hl=en); [Google Cloud Veo guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide); [Replicate](https://replicate.com/blog/using-and-prompting-veo-3); [Atlas Cloud](https://atlascloud.ai/blog/tips/kling-ai-video-prompt-guide); [Kling blog](https://kling.ai/blog/kling-ai-prompt-guide)

### Inferences (design)

**JSON schema (Zod-friendly)**
```json
{
  "shots": [{
    "id": "s1",
    "intent": "hook|problem|step|payoff|cta",
    "generator": "veo|kling|hailuo|dreamina|wan|runway|luma|pika|pixverse|user_footage",
    "mode": "t2v|i2v|ingredients|user_footage",
    "duration_s": 6,
    "aspect": "9:16",
    "subject_block_id": "kaju",
    "action": "sits on the wall and looks into the camera",
    "setting": "hillside terrace farm at sunrise, basket of garlic in front",
    "camera": "medium close-up, slow push-in",
    "look_id": "style_main",
    "audio": {"ambience": "soft birdsong", "sfx": "", "dialogue": {"speaker": "Kaju", "language": "en", "line": "Everyone plants garlic wrong.", "delivery": "playful"}},
    "avoid": ["subtitles", "on-screen text", "extra people"],
    "start_frame_hint": null,
    "fallback_shot_id": "s1b",
    "risk": "low|medium|high",
    "risk_reason": "hands visible"
  }]
}
```
`prompt_text` is NOT produced by the LLM: code compiles it from fields per generator (guarantees verbatim bibles, separate audio sentences, colon dialogue). The LLM only fills structured fields.

**System-prompt rules to give the LLM (condensed)**
- Output JSON only, matching the schema; no prose.
- One subject, one action (single verb phrase, no "and then"), one camera move per shot.
- Action must be physical and visible; no abstract words ("beautifully", "emotional journey").
- Never describe the character; reference `subject_block_id` (code pastes it).
- No on-screen text, signs, logos, UI, numbers, counts; no hands doing fine work (set `risk: high` and give a `fallback_shot_id` or `user_footage` if unavoidable).
- Dialogue: max 20 words (about 2.5 words/s, so 8 s allows ~20), one speaker per shot; language must be in the generator's supported list from the profile; if the language is unsupported or unverified (e.g. Nepali), set dialogue to null and put the line in `voiceover` instead.
- Set `duration_s` within the generator profile.
- Use positive nouns in `avoid`; no "no/don't".
- Total video: sum of durations 28-34 s over 4-6 shots; at least one cutaway with no character.

**Per-generator profile (fields the LLM and linter read)**
`{max_s, durations, max_prompt_chars, native_audio, dialogue_langs, supports_negative_field, ref_support, i2v, notes, verified_on}`: Veo {4/6/8 s, audio yes, dialogue_langs: ["en"] verified-ish, others unverified, refs<=3}; Kling {5 s standard, audio yes in 3.0, langs zh/en/ja/ko/es, element refs, max 2,500 chars}; Hailuo {6 s, no verified dialogue}; Wan 2.2 {local, i2v}.

**Cheap lint (deterministic, run on compiled prompt and the JSON)**
1. Length: Veo/Kling text 40-150 words (hard cap 2,500 chars for Kling); i2v 15-70 words; fail outside.
2. Required: subject block present verbatim; action verb present (non-empty `action`, <=12 words, a single clause: no " and then ", ";"); camera present (matches a camera vocabulary regex: close-up|wide|medium|push-in|dolly|pan|tilt|tracking|static|handheld|top-down|crane|arc|rack focus|zoom).
3. Banned: brand/trademark words (maintain a list: Nike, Disney, Marvel, Coca-Cola, YouTube, TikTok, iPhone, Netflix, Pixar...), celebrity/real-person names (reject any proper-noun not in project bibles; optionally a short list of public figures), words "logo", "watermark" (as wanted content), "copyright", "in the style of <living artist>", "celebrity", "politician", minors (child, kid, boy, girl, teen, baby, schoolchild: see the safety rules below), violence/gore/weapon/blood/kill/nude/sexual, "photorealistic real person".
4. Negatives phrased with no/don't/not/without: auto-rewrite to a noun list.
5. Text/count traps: regex for quotation marks in non-dialogue fields, digits, "sign reading", "label saying", "text", "caption" in action/setting; "three/four/five/each of", "counting".
6. Dialogue: <=20 words; one speaker; language code in profile; no colon characters inside the line; warn on unverified language.
7. Hands: if the text matches hand|finger|fingers|hands|holding|typing|cutting|pouring|writing, set `risk: high` unless a fallback shot is present.
8. Duration within profile durations; total story 28-34 s; at least one shot with `generator: user_footage` or a screen recording if the intent mentions app/screen/price.
9. Style/identity consistency: the `look` string equals the project style bible byte for byte.
10. Output a lint report {errors[], warnings[]}; on errors the app re-asks the LLM once with the error list, then falls back to a rules-based template.

### Gaps
- No empirical test of LLM reliability here (local small models may break JSON; use a JSON-constrained decoding or a repair pass in WebLLM).

---

## 8. Safety and policy for prompts

### Takeaway
Generators filter real people, minors, brands/IP and violent or sexual content; Introcut's default is a fictional animal or stylised character with generic settings, which avoids most refusals. The linter should block the classes below and Introcut must never offer watermark removal.

### Cited Findings
- Google's Veo guide states safety filters block prompts that violate responsible-AI guidelines and provides an abuse-report form. — [Google Cloud Veo guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)
- Veo output carries an embedded SynthID watermark that survives normal post-production; disclosure obligations are a contract question. — [aivideosensei, 2026-08-14](https://aivideosensei.com/guides/google-veo-access-and-free-tier)
- OpenAI shut Sora down amid deepfake concerns and Disney-character licensing fell through, a sign of IP/likeness risk in this space. — [MaltaToday](https://www.maltatoday.com.mt/news/world/140570/openai_pulls_sora_video_app_over_deepfake_concerns); [9to5Google](https://9to5google.com/2026/03/24/openai-shutting-down-sora-video-generation-app-but-without-explaining-why/) (causation is reporting, OpenAI gave little explanation)
- Luma terms: embedded watermarks/identifiers may not be removed; commercial rights only on paid plans. — [Luma pricing review via search](https://gptprompts.ai/ai-pricing/luma-ai-pricing) (secondary)
- Free outputs of Kling, Hailuo, Runway, PixVerse, Luma are watermarked and generally non-commercial; watermark removal is a paid feature. — [Krea, 2026-08-27](https://www.krea.ai/blog/best-free-ai-video-generators-in-2026); [aireiter Kling](https://aireiter.com/blog/kling-ai-free-tier-2026)

### Inferences (rules Introcut should enforce; policy specifics per generator not verified)
- No real people (by name, "looks like", or a user's face uploaded to a generator unless it is the user's own with consent; follow CLAUDE.md's consent rule). Default cast: fictional animal or stylised character.
- No minors in generated footage (many generators refuse or restrict them); a talking-monkey story avoids this. Linter blocks "child/kid/baby/boy/girl/teen/student" words.
- No brands, logos, trademarks, film/game characters, living artists' names; use generic descriptions ("a red tractor", not a brand).
- No violence, gore, weapons, sexual content, self-harm, hate, medical or dangerous-chemical advice: for farming content avoid pesticide-mixing or burning scenes shown as instructions; keep how-tos to benign steps; keep "safe farming" caveats in captions.
- No political/election or deceptive news-style content; label AI content: show an "AI-generated" reminder at export (CLAUDE.md rule) and keep generator SynthID/visible watermarks intact.
- Never offer, document or automate watermark removal, cropping to hide watermarks, or inpainting over them; if a clip has a watermark, offer an honest label or tell the user to use paid credits.
- Never tell the user free credits give commercial rights; display "free tier: personal use, check the tool's terms" per generator.
- Avoid claiming lip-sync or Nepali speech works until verified by the user's own test.

### Gaps
- Exact refusal categories per generator (e.g. Kling, Hailuo) were not retrieved; only Google's general statement.
- Legal status of using free-tier output in monetised Shorts/Reels varies; I found no authoritative per-tool commercial-use terms for the free tiers (Kling: personal use; Luma/Hailuo/Runway: paid-only for commercial; Flow: unstated).
