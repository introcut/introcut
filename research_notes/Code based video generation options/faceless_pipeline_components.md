# Faceless "code-assembled" story short pipeline: components, licenses, cost, browser feasibility (as of 2026-10-22)

Method note: research done 2026-10-22 with web search plus page fetches. Primary pages fetched: Google Gemini API pricing (page says "Last updated 2026-10-19 UTC"), Gemini API rate limits (updated 2026-10-15), Gemini speech-generation docs, Gemini API terms, Hugging Face model cards, GitHub READMEs. Many other facts come only from third-party blogs and are flagged. Anything I could not source is in the Gaps lists (not stated as fact). "verify" = not confirmed from a primary source.

---

## 1. Image generation for stills (free options, licenses, in-browser diffusion)

### Takeaway
The Gemini API has NO free tier for any image model as of Oct 2026 (primary source), so a zero-cost browser app cannot rely on the Gemini API for images. The user's own Gemini app / AI Studio free quota exists but is unpublished and compute-based (third-party). FLUX.1 schnell (Apache-2.0) is the only strong permissively licensed image model, but the free hosted routes are tiny (Hugging Face $0.10/month credits) or unclear (Pollinations now API-key and "Pollen"-credit based). In-browser diffusion (SD-Turbo via WebGPU) is feasible but small-model, hardware-dependent, and lower quality; the realistic default is "user brings stills made in free tools (Gemini app, Flow, etc.) + optional user-key image API."

### Cited Findings
- Gemini API pricing page lists "Not available" free tier for every image model: Nano Banana 2.1 ($0.0336/1K image), Nano Banana 2 / 3.1 Flash Image ($0.067 per 1K), Nano Banana 2 Lite ($0.0336), Nano Banana Pro / 3 Pro Image ($0.134 for 1K/2K), Nano Banana / 2.5 Flash Image ($0.039; deprecated, scheduled shutdown 2026-10-02). Imagen is not listed. Page last updated 2026-10-19. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Gemini API rate-limits page: free-tier limits are per project (RPM/TPM/RPD, reset midnight Pacific); "IPM" (images per minute) applies to image models like Nano Banana; no free-tier IPM figure given. Updated 2026-10-15. — [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- Gemini API unpaid-services terms: Google uses submitted content and generated responses to "provide, improve, and develop" products; human reviewers may read inputs/outputs; users must be 18+; apps directed at under-18s not permitted. This matters if Introcut ever routes user data through a free-tier key. — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Consumer Gemini app free image generation: no published image count; compute-based allowance that "refreshes every 5 hours until you reach your weekly limit"; limits changed from 2026-05-17; older "100 images/day" figure no longer matches Google's pages; Nano Banana 2.1 launched 2026-10-06 for paid plans. SOURCE IS A THIRD-PARTY BLOG that sells API access (laozhang.ai, published 2026-02-24, updated 2026-10-21) — treat as unverified. — [laozhang.ai](https://blog.laozhang.ai/en/posts/gemini-image-generation-free-limit-2026.md)
- FLUX.1 [schnell]: Apache-2.0, "personal, scientific, and commercial purposes", 12B-parameter rectified-flow transformer, 1-4 steps. Hosted via bfl.ml, Replicate, fal.ai, Mystic. Files gated behind accepting HF conditions. — [FLUX.1-schnell model card](https://huggingface.co/black-forest-labs/FLUX.1-schnell)
- Hugging Face Inference Providers: free users get about $0.10/month in credits (subject to change), PRO $2.00/month. Search results did not confirm per-image FLUX cost or that FLUX is covered. — [HF Inference Providers pricing](https://huggingface.co/docs/inference-providers/pricing)
- Pollinations (MIT-licensed code): README now points to API keys at enter.pollinations.ai with pay-as-you-go "Pollen" ($1 ~ 1 Pollen) and "Quests" to earn Pollen; app keys (pk_) have budgets; recommends "Connect User Wallets (BYOP)" where users pay for their own usage so developer cost is $0. No anonymous-access policy or commercial terms stated on the README. Third-party roundups (undated, conflicting) still describe it as "free, no key" with ~1 request per 15 s for anonymous users. — [pollinations GitHub](https://github.com/pollinations/pollinations); [roundup, unverified](https://apiframe.ai/blog/free-ai-image-generation-api-2026)
- Stability AI: Community License is free for research, non-commercial and commercial use for individuals/orgs under US$1M annual revenue; Enterprise license above that; covers SD 3.5 suite and SDXL Turbo. A third-party review says registration and "Powered by Stability AI" display are required (not verified on Stability's pages). Whether SDXL base is OpenRAIL++-M is NOT confirmed by any source I found. — [Stability AI license page](https://stability.ai/license); [License update](https://stability.ai/news/license-update); [third-party review](https://www.fast.io/resources/stability-ai-review-2026.md)
- In-browser diffusion: Microsoft ONNX Runtime Web post (Feb 2024) says SD-Turbo runs in the browser via WebGPU at about 1 second per image on an RTX 4090. Older web-stable-diffusion (MLC) demo reported ~7 GB memory use and "a few minutes" on an 8 GB Apple-silicon Mac. No 2026 browser benchmark found. — [ONNX Runtime Web blog](https://opensource.microsoft.com/blog/2024/02/29/onnx-runtime-web-unleashes-generative-ai-in-the-browser-using-webgpu/); [web-stable-diffusion](https://github.com/cnye36/web-stable-diffusion)
- Character consistency: third-party sources say Gemini 3 Pro Image (Nano Banana Pro) accepts up to 14 reference images, with differing breakdowns (6 objects + 5 humans; or "consistency for up to 5 people"); another attributes 14-input composition to the Flash variant; user reports are "hit-or-miss" with many references; workaround advice is a single character-sheet reference or structured JSON of visual attributes. A "95% consistency" claim has no methodology. — [MindStudio](https://www.mindstudio.ai/blog/what-is-gemini-3-pro-image); [DEV post](https://dev.to/aigame/gemini-3-pro-image-is-here-and-it-changes-everything-i-thought-i-knew-about-ai-art-tools-3ng4); [Reddit snapshot](https://reddit.sentinel-team.org/posts/1rzfex7/snapshots/2026-03-27T19%3A11%3A00.8892Z)
- A ZackD-style tutorial workflow (creator claims, anecdotal) uses ChatGPT for script and per-scene image prompts, Nano Banana for one image per scene (upload a 9:16 reference to get 9:16 output), 11 Labs for voice, Grok "imagine" to animate each image, and CapCut to assemble; it gives no explicit character-consistency method. — [Lilys summary of tutorial](https://lilys.ai/en/notes/ai-shorts-20251110/make-zack-d-style-ai-shorts-free)

### Inferences
- Introcut cannot bundle or silently call any image generator at zero cost. The permissive-license options are: FLUX.1 schnell via the user's own account/key, SD-Turbo-class models locally, or (cleanest) user-supplied stills from tools they already use (Gemini app, Flow, Grok, etc.), which also respects "media never leaves the device".
- Because Gemini API free tier is zero and its free-tier terms allow Google to train on prompts, a "paste your free Gemini key" path for images does not work for free users; only for users who pay.
- For 6-12 consistent stills the practical method in 2026 is: one character sheet / reference image reused as input every shot + a fixed style-prompt block; consistency is imperfect and should be hidden by stylization, cuts, partial views (hands, silhouettes, backs of heads) rather than promised.
- SD-Turbo in-browser is plausible as an optional "experimental, needs WebGPU GPU" feature but quality and VRAM make it unsuitable as the default.

### Gaps
- No primary source on current Gemini app / AI Studio free daily image counts (Google publishes none per the third-party blog).
- No confirmed current Pollinations anonymous-tier limits or commercial-use terms; fetch of its terms page not done.
- No primary confirmation of SDXL / SD 3.5 license text details, or of Leonardo / Ideogram / Bing Image Creator free quotas (not searched; per brief, do not recommend UI scraping anyway).
- No source found on quality/speed of FLUX-class or newer small diffusion models running in-browser in 2026 (e.g., quantized FLUX in WebGPU); not searched.
- Gemini "consistent character" official doc not fetched; reference-image limit unconfirmed.

---

## 2. Motion from stills in code (Ken Burns, parallax, depth, cutout, talking-head)

### Takeaway
Ken Burns is trivial in a Canvas renderer; depth-based parallax is feasible in-browser with Depth Anything V2 Small (Apache-2.0) via transformers.js/ONNX, but only the Small size is permissively licensed. The only mature open parallax tool found (DepthFlow) is Python and AGPL-3.0, so it cannot be bundled; a WebGL/WebGPU displacement shader would have to be written (or an MIT/Apache implementation located). No source quantifies viewer perception of parallax vs Ken Burns.

### Cited Findings
- Depth Anything V2: Small model is Apache-2.0; Base/Large/Giant are CC-BY-NC-4.0 (non-commercial). — [Depth-Anything-V2 repo](https://github.com/DepthAnything/Depth-Anything-V2)
- An ONNX conversion of Depth Anything V2 Small tagged for Transformers.js is on Hugging Face, license tag apache-2.0. WebGPU behavior not confirmed in sources found. — [onnx-community/depth-anything-v2-small](https://huggingface.co/onnx-community/depth-anything-v2-small/commits/f7421df0cc30f121782ab050d42f0a423291dcde/README.md)
- DepthFlow ("parallax shader for animating images"): AGPL-3.0; ray-marching GLSL shader on depth maps; frames piped to FFmpeg; claims artifact-free edges and seamless loops; desktop/local, no browser statement. — [DepthFlow](https://github.com/BrokenSource/DepthFlow)
- A Three.js/GLSL demo converts an image + depth map + normal map into a parallax scene, but is hard-coded to one artwork (not a reusable library). — [freefrontend demo](https://freefrontend.com/code/halloween-2-5d-parallax-shader-2026-05-07/)
- The ZackD-style tutorial uses an image-to-video generator (Grok) for animation rather than code motion, implying the reference style relies on real AI motion per scene. Tutorial says Grok free tier allows 10-20 clips/day (creator claim). — [Lilys summary](https://lilys.ai/en/notes/ai-shorts-20251110/make-zack-d-style-ai-shorts-free)

### Inferences
- Plan: Canvas/WebGL "camera" with ease-in/out push-in, pan, rack-style zoom, shake, plus optional depth-parallax using Depth Anything V2 Small (Apache-2.0 only). Never bundle Base/Large (NC) or DepthFlow (AGPL).
- Parallax from monocular depth tends to show stretching at occlusion edges; hiding it with small camera travel (a few percent), foreground/background layer splits and vignette/grain is a design choice (inference, not sourced).
- Because the admired reference style (ZackD) appears to use true AI image-to-video per scene, a code-only Ken Burns version will feel visibly lower-motion; the hybrid (a few real generated clips for hero moments + code motion for the rest) is the sensible bridge.

### Gaps
- No source on Depth Pro license or browser feasibility (not searched).
- No open-source, permissively licensed browser implementation of depth-parallax video found.
- No source on talking-head / lip-flap from stills in the browser (not searched) or on cutout/puppet animation libraries.
- No audience-perception data comparing Ken Burns vs parallax vs AI motion.
- Depth Anything V2 Small WebGPU speed in browser not verified.

---

## 3. TTS (English, Hindi, Nepali): models, licenses, browser feasibility, word timestamps

### Takeaway
English and Hindi are well covered by permissive in-browser options (Kokoro-82M, Apache-2.0, has Hindi but Hindi quality is unverified). Nepali is the weak link: the only permissively usable Nepali options found are very young community models (Kala VITS ONNX, MIT code but CC-BY-SA-4.0 weights; Matcha-TTS Nepali, CC-BY-4.0 weights with a CC-BY-SA-4.0 G2P) with no formal quality metrics (one reports Whisper CER ~0.41-0.44). Good Nepali exists in Gemini TTS (free tier, user key), Indic Parler-TTS (Apache-2.0, 0.9B, too heavy for browser), and Microsoft Edge/Azure neural voices (not licensed for third-party app use). Meta MMS-TTS is CC-BY-NC.

### Cited Findings
**Kokoro (English, Hindi)**
- Kokoro: Apache-2.0 repo and weights, 82M params; languages by lang_code: a/b English (US/UK), e Spanish, f French, h Hindi, i Italian, j Japanese, p Brazilian Portuguese, z Mandarin. Nepali not listed. kokoro-js (in-browser) lives in the repo's kokoro.js directory. Some non-English languages use espeak-ng. — [hexgrad/kokoro](https://github.com/hexgrad/kokoro)
- Hindi voices named by one third-party guide: hf_alpha, hf_beta (female), hm_omega, hm_psi (male). A community Replicate page grades hf_alpha "C" overall (rough estimate of data quality/quantity, not listening test) and says non-English support may be thin due to weak G2P/training data. — [Soniqo guide](https://soniqo.audio/guides/kokoro); [Replicate readme](https://replicate.com/codingayam/kokoro-82m-complete/readme)

**Nepali**
- Matcha-TTS Nepali (sandipghimire): code MIT; weights CC-BY-4.0 (inherits from AI4Bharat Rasa Nepali data, a gated dataset); Nepali G2P frontend ("real_nepali") CC-BY-SA-4.0; vocoder license not stated; 2 speakers (female, male); trained on 19,822 utterances; Whisper-measured CER ~0.41 at ~20k steps and ~0.4375 at ~72k; tagged ONNX but no usage details; no inference speed given. — [Matcha-TTS Nepali](https://huggingface.co/sandipghimire/matcha-tts-nepali)
- Kala (kala-tts, Ampixa): "first open-source Nepali TTS without eSpeak" per search snippet; VITS in ONNX FP32 (~60 MB, downloads on first use, ~897 kB wheel); 5 speakers (kala recommended; barsha has most data); code MIT, model weights and training data CC-BY-SA 4.0; PyPI status "Alpha"; no MOS or quality metrics; Python package, browser use not described. — [kala-tts on PyPI](https://pypi.org/project/kala-tts/)
- Other Nepali results from search (not fetched individually): a Chatterbox Nepali fine-tune (Oshara) listed Apache-2.0 but base Chatterbox weights keep their license; rajanishpoudel VITS Nepali multi-speaker has a placeholder "other" license and gated access (treat as unclear); datasets Chitwan 1.0 (CC0) and OpenSLR SLR143 (listing inconsistent: "Attribution-ShareAlike 4.0" vs NC-SA). — [search results: Chatterbox Nepali](https://huggingface.co/Oshara/chatterbox-nepali-tts); [rajanishpoudel VITS](https://huggingface.co/rajanishpoudel/vits-ne-multispeaker); [OpenSLR 143](https://openslr.org/143/); [Chitwan 1.0](https://datacollective.mozillafoundation.org/datasets/cmiugmupp01etmf07h89hfpir)
- Meta MMS: "The MMS code and model weights are released under the CC-BY-NC 4.0 license" (page does not name TTS or Nepali specifically; third-party listings say MMS-TTS checkpoints are CC-BY-NC 4.0). mms-tts-npi model card could not be fetched (HTTP 401), so Nepali checkpoint existence/license is unconfirmed by me. Non-commercial: cannot be bundled. — [fairseq MMS README](https://github.com/facebookresearch/fairseq/tree/main/examples/mms); [PromptLayer listing](https://www.promptlayer.com/models/mms-tts)
- Indic Parler-TTS (AI4Bharat): Apache-2.0 (gated download), 0.9B params (F32 safetensors), 21 official languages including Hindi and Nepali; Hindi speakers Rohit/Divya/Aman/Rani; Nepali has one speaker (Amrita); native-speaker scores: Hindi ~83-85%, Nepali ~64% pretrained to ~80% fine-tuned with high variance; no voice cloning; prompt-described voices. — [ai4bharat/indic-parler-tts](https://huggingface.co/ai4bharat/indic-parler-tts)
- Gemini TTS: docs list gemini-3.8-flash-tts and gemini-3.8-flash-lite-tts supporting 130+/100+ languages with Hindi and Nepali explicitly supported; 30 prebuilt voices plus extended library; single/multi-speaker, voice design, voice replication (3.8 models); output WAV/PCM; docs do not mention timestamps or length limits. Pricing page marks Gemini 3.8 Flash TTS, 3.8 Flash-Lite TTS and 3.1 Flash TTS Preview as free (Standard tier) for input and output. Free-tier terms: Google may use content for product improvement and human review. — [Speech generation docs](https://ai.google.dev/gemini-api/docs/speech-generation); [pricing](https://ai.google.dev/gemini-api/docs/pricing); [terms](https://ai.google.dev/gemini-api/terms)
- Chatterbox (Resemble AI): MIT; multilingual model lists 23 languages incl. Hindi, NOT Nepali; Hindi single-language pack exists; ~500M params; Perth neural watermark in all outputs; Python/PyTorch, no browser statement. — [Chatterbox](https://github.com/resemble-ai/chatterbox)
- Edge / Azure neural voices: voice names ne-NP-HemkalaNeural and ne-NP-SagarNeural, hi-IN-SwaraNeural and hi-IN-MadhurNeural exist (community lists; use `edge-tts --list-voices` to confirm). Microsoft Q&A moderator: edge-tts-style projects that rely on Microsoft's proprietary service may violate terms without an Azure subscription (informal, not legal advice); GitHub issue warns of possible rate limiting. — [FoloToy voice wiki](https://github.com/FoloToy/folotoy-server-self-hosting/wiki/Edge%E2%80%90TTS%E2%80%90Voices); [json2video Hemkala](https://json2video.com/ai-voices/azure/voices/ne-np-hemkalaneural/); [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/2088770/are-opensource-edge-tts-free-for-commercial-use)
- Piper: engine adds no restrictions on voices but each voice has a MODEL_CARD with its own license; tts.ai lists Nepali and Hindi among Piper languages (secondary, no per-voice license). — [search results re Piper](https://tts.ai/voices/piper/?lang=hi)
- Google Cloud TTS Chirp 3 HD: a third-party guide says 0-1M free characters/month then $30 per 1M; Nepali/Hindi availability for Chirp 3 HD not confirmed. — [SpeechActors guide](https://speechactors.com/article/google-cloud-pricing-and-plans)

### Inferences
- Zero-cost, permissive, fully in-browser: English (Kokoro) is solid; Hindi (Kokoro "h") is bundle-able but quality unproven, so Introcut should do its own listening test before promising it.
- Nepali tiering for Introcut: (1) best quality at zero cost to Introcut = user's own free Gemini API key calling a Gemini TTS model (explicit opt-in notice, data goes to Google and may be reviewed; check quota in AI Studio); (2) offline fallback = Kala or Matcha-TTS Nepali in ONNX (verify quality, speaker licensing: CC-BY-SA/CC-BY need attribution/share-alike analysis, add to CREDITS.md); (3) user-uploaded recording (always works, and fits "voice" resource in the app); (4) browser SpeechSynthesis if the OS has a Nepali voice (not researched).
- Share-alike weights (Kala CC-BY-SA-4.0) are a licensing risk if "only permissive" is read strictly; CC-BY-4.0 Matcha weights are fine with attribution but its G2P is CC-BY-SA; get a legal read before bundling.
- Indic Parler-TTS is the highest-quality permissive Nepali/Hindi candidate but 0.9B params is impractical in-browser today (inference); better as optional user-run Hugging Face Space (matches the "user's own free HF Space" allowance).
- MMS-TTS Nepali and Edge/Azure voices must not be bundled/auto-called by Introcut; MMS is NC, Edge relies on an unofficial endpoint.

### Gaps
- No listening test or MOS for Kala, Matcha-TTS Nepali, or Kokoro Hindi; quality statements are unknown.
- Kokoro-js Hindi support in the browser build (phonemizer/espeak in WASM) unconfirmed.
- No source confirming Gemini TTS Nepali output quality, or whether the free tier has usable daily quota (rate-limit page lists no numbers); no word-timestamp output documented.
- Google Cloud TTS and Azure official language/voice tables and free-tier numbers not fetched.
- Piper Nepali/Hindi voice names, quality and MODEL_CARD licenses not verified; XTTS (CPML, non-commercial per my memory), Orpheus, MeloTTS, ElevenLabs free-tier terms not researched (unsourced; verify).
- Browser SpeechSynthesis Nepali availability not researched.

---

## 4. Captions: word timing sources, styles, Devanagari rendering

### Takeaway
Best word timing for Introcut is whatever the TTS provides (Edge-style boundary events are used by existing tools), otherwise Whisper word timestamps via transformers.js; Whisper's accuracy on Nepali is unverified and WebGPU word timestamps had an open limitation. For user-recorded or non-timestamped audio, forced alignment / Whisper is needed.

### Cited Findings
- MoneyPrinterTurbo subtitle modes: "edge" uses TTS timestamps (fast, no GPU); "whisper" uses local faster-whisper for more precise timing (1.6-3 GB model downloads). — [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)
- transformers.js: a GitHub issue stated the pipeline did not support word-level timestamps on WebGPU (contributor was working on a fix; merge status not confirmed); an older bug returned word timestamps all equal to audio duration. Remotion's @remotion/whisper-webgpu runs Whisper in-browser with word timestamps via Transformers.js and recommends small/small.en; setting the language reduces detection errors. NOTE: Remotion itself is NOT allowed in Introcut (custom license) — only cite for evidence of feasibility. — [transformers.js issue 820](https://github.com/huggingface/transformers.js/issues/820); [Remotion whisper-webgpu](https://remotion.dev/docs/whisper-webgpu)
- Whisper timestamp accuracy may vary for low-resource languages (general statement; Nepali not tested in any source found). — [offlinetts.com Whisper comparison](https://offlinetts.com/blog/browser-speech-recognition-whisper-comparison/)

### Inferences
- Since Introcut generates the script text, it can do text-to-audio alignment (known words, unknown timing) rather than open transcription; this is more reliable than Whisper transcription for Nepali (inference; a CTC aligner or Whisper-with-forced-text approach would need testing; wav2vec2 Nepali models exist on HF per a search result, license not checked).
- Fallback: proportional timing by syllable/character count per sentence is robust for 30 s clips, and snap to detected pauses.

### Gaps
- No source on Devanagari rendering in Canvas (need bundled OFL font e.g., Noto Sans Devanagari; canvas text shaping across browsers; per-word highlight with conjuncts/ligatures — my own knowledge, unsourced; verify by testing). Caveat: per-word splitting must be on whitespace, never per codepoint, to avoid breaking conjuncts.
- No data on which caption styles perform best (word-by-word highlight etc.); only creator folklore; not researched.
- Transformers.js current status of WebGPU word timestamps and Nepali/Hindi accuracy not verified.

---

## 5. Music and SFX (CC0 sources, AI music)

### Takeaway
Only a Pixabay licence result was retrieved. Pixabay's Content License is free for commercial use without attribution, but forbids redistributing the content as standalone files and is not CC0, so bundling music inside an open-source repo is problematic. Safer: CC0 sources only (Freesound CC0 filter, Kenney, OpenGameArt CC0, FMA CC0) or user-supplied music.

### Cited Findings
- Pixabay Content License: free commercial and non-commercial use, attribution optional; selling or distributing content as music files etc. not allowed unless extra value is added; third-party rights (people, logos, brands, audio samples) may apply; only the full licence text is binding. — [Pixabay license summary](https://pixabay.com/en/service/license/)
- MoneyPrinterTurbo ships default tracks in resource/songs and supports random, local, or AI-generated background music with independent volume. — [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)

### Inferences
- Redistributing Pixabay tracks in a public GitHub repo/PWA bundle looks like "distributing content as music files", so avoid (inference; verify with the full licence text).

### Gaps
- Freesound CC0 terms, Free Music Archive CC0 availability, OpenGameArt, Kenney (CC0 per my memory, unsourced), Incompetech (CC-BY per my memory, needs attribution), YouTube Audio Library: not retrieved.
- AI music generators with free tiers (Suno, Udio, Stable Audio Open, MusicGen license CC-BY-NC for weights per my memory) not researched; verify before any mention.
- Ducking/LUFS specifics for voice-over mixes not researched.

---

## 6. Evidence on viewer acceptance: faceless "AI still + voice-over" vs full AI video

### Takeaway
There is no rigorous data comparing still-plus-voice-over shorts to full AI video. What exists: a measured saturation of AI "slop" in Shorts feeds, YouTube policy tightening against templated mass-produced content (while AI/faceless is not banned), and creator anecdotes of rapid growth with image-plus-image-to-video workflows. All performance claims are anecdotal.

### Cited Findings
- Kapwing/NeoMam study (Nov 2025): in the first 500 Shorts shown to a fresh account, 104 (21%) were classified AI-generated and 165 (33%) "brainrot"; of top-100 trending channels in each country (15,000 total) 278 were AI-slop-only, with 63 billion views, 221 million subscribers and ~$117 million annual revenue (as reported). Company-run study; follow-up says some channels were later removed. — [The Decoder](https://the-decoder.com/one-in-five-youtube-shorts-shown-to-new-users-is-ai-generated-slop-study-finds/); [TechSpot](https://www.techspot.com/news/110735-over-21-youtube-now-ai-slop-report.html); [NeoMam report](https://neomam.com/projects/youtube-ai-slop-report/)
- YouTube Partner Program: July 15, 2025 renamed "repetitious content" to "inauthentic content" (mass-produced or repetitive); creator liaison said AI-using channels stay eligible; blogs report a July 2026 clarification naming generic/template-based videos, off-putting content, and AI personas giving advice on sensitive topics; changing only names/images/captions on the same script is the cited risk; sources are creator-marketing blogs and conflict on dates — verify at YouTube's official policy page. — [AIR Media-Tech timeline](https://air.io/en/monetization/youtube-monetization-policy-changes-2026-a-complete-dated-timeline); [Outlierkit July 2026](https://outlierkit.com/blog/youtube-updates-july-2026); [Fliki](https://fliki.ai/blog/do-ai-generated-videos-monetize)
- ZackD Films: a tutorial blog reports 24M+ subscribers and 53B views with 20-45 s videos (marketing source, unverified); the tutorial's creator claims a new TikTok account reached 100K followers and 100M views in 40 days (anecdotal, not tied to the exact workflow). — [Lilys summary](https://lilys.ai/en/notes/ai-shorts-20251110/make-zack-d-style-ai-shorts-free)
- Vendor guides (Dreamina/CapCut/invideo) advise creating a reference image for each character and key location before generating. — [CapCut guide](https://www.capcut.com/resource/build-multi-scene-ai-narrative-short-film)

### Inferences
- Pacing, distinct story structure, sound design and per-video originality (not templated) are what separate premium from "slop" feel; the policy trend means a pipeline that stamps the same template risks both viewer fatigue and demonetization; Introcut should favor LLM-directed varied structure and user-supplied specifics.
- "2-3 s cut rate, motion variety, consistent style" are common creator folklore; no study found (not claimed as fact).

### Gaps
- No retention / completion-rate data for still-image shorts vs AI video.
- No independent case study of a still-plus-TTS channel's growth; official YouTube policy page not fetched.
- No data on Hindi/Nepali audience reception of synthetic voices.

---

## 7. Open-source repos implementing this pipeline

### Takeaway
MoneyPrinterTurbo (MIT, ~134k stars) and ShortGPT (MIT, ~8k stars, "experimental") implement script-to-short end to end, but both are Python/FFmpeg server-side tools relying on stock footage (Pexels/Pixabay) and Edge TTS or paid TTS, not stylized still-image stories; none runs in-browser.

### Cited Findings
- MoneyPrinterTurbo: MIT; ~133.8k stars, 21.1k forks; topic -> LLM script (many providers incl. Gemini, OpenAI, Claude, DeepSeek, Ollama) -> footage (local uploads, Pexels, Pixabay, Coverr, AI video via paid services, OpenAI-compatible text-to-image) -> TTS (Edge TTS default, Azure, Gemini, ElevenLabs, Chatterbox, Kokoro, others) -> subtitles (edge timestamps or faster-whisper) -> FFmpeg composition (9:16, 16:9, 1:1) -> music (random/local/AI). — [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)
- ShortGPT: MIT; ~8.1k stars; engines ContentShortEngine, ContentVideoEngine, ContentTranslationEngine, EditingEngine (JSON "editing markup" designed for LLMs); TTS ElevenLabs or EdgeTTS ("30+ languages", Hindi listed); footage from Pexels and Bing Image; self-described "Experimental", docs incomplete. — [ShortGPT](https://github.com/RayVentura/ShortGPT)
- DepthFlow (AGPL-3.0) is the parallax-from-image tool. — [DepthFlow](https://github.com/BrokenSource/DepthFlow)

### Inferences
- Introcut's differentiator is browser-only + stylized stills + user-owned assets. Reuse ideas (EditingEngine-style JSON LLM-readable edit format maps to Introcut's project JSON) but not code, since the stack differs.

### Gaps
- Did not inspect Auto-Shorts-style or other repos (e.g., browser-based ones), or measure output quality of these tools; Bing Image dependency in ShortGPT may be scraping (do not follow).

---

## 8. Verdict: realistic zero-cost code-assembled story pipeline

### Takeaway
Feasible but with honest limits. Strongest stages: script/LLM (already in Introcut), Canvas camera motion + captions + mixing (pure code, zero cost), English TTS (Kokoro). Weakest: Nepali voice (young community models of unmeasured quality, or Gemini TTS via the user's key), consistent-character stills at zero cost (no free API; depends on the user's own tools), and music licensing. Recommended product shape: "bring your stills/clips" assembler that code-animates them, with a few real generated clips for hero beats.

### Cited Findings
(Facts underpinning the verdict are cited in sections 1-7; key ones: no Gemini API free image tier [pricing](https://ai.google.dev/gemini-api/docs/pricing); Gemini TTS free tier includes Nepali and Hindi [docs](https://ai.google.dev/gemini-api/docs/speech-generation); Kokoro Apache-2.0 with Hindi [repo](https://github.com/hexgrad/kokoro); Depth Anything V2 Small Apache-2.0 [repo](https://github.com/DepthAnything/Depth-Anything-V2); Indic Parler-TTS Apache-2.0 with Nepali [card](https://huggingface.co/ai4bharat/indic-parler-tts); MMS CC-BY-NC [fairseq](https://github.com/facebookresearch/fairseq/tree/main/examples/mms).)

### Inferences
- Proposed pipeline (all steps in the browser, license-safe):
  1. LLM (WebLLM or user key) writes a 12-20 beat script + per-beat shot prompt + camera move + SFX cue. Introcut already has idea check/script writer (STATUS commits).
  2. Stills: user imports stills (from Gemini app, Flow stills, etc.); optional user-key image API (FLUX schnell via a provider they pay for, Gemini paid key); optional experimental in-browser SD-Turbo. Provide a "prompt pack" with character-sheet + style block so the user generates consistently in the free tools; check duplicate-character drift by SigLIP/CLIP similarity (already in stack).
  3. Motion: Canvas Ken Burns with varied moves per beat; optional Depth-Anything-V2-Small parallax for 2-4 hero shots; grain, vignette, light flicker, speed ramps, match cuts; aim 2-3 s per cut (folklore, not data).
  4. Voice: EN Kokoro; HI Kokoro "h" after listening test, or Gemini TTS via user key; NE via Gemini TTS (user key), or Kala/Matcha-TTS Nepali offline (labelled "beta"), or user-recorded voice. Show opt-in notices.
  5. Captions: word-timing from TTS where available, else Whisper/aligner; bundled OFL Devanagari font; style presets.
  6. Music/SFX: only CC0 or user-supplied; ducking under voice.
  7. Hybrid: user's few Flow/Grok/Veo clips (about 5 per day on Flow) are placed at the hook, twist and ending; stills with code motion fill the middle. This matches the ZackD-style recipe (image per scene animated by an image-to-video tool) while cutting the number of generated clips needed.
- Risk gates to add: G-Nepali-TTS quality (listening test with native speakers), G-licenses for share-alike weights, G-policy (templated content demonetization risk), G-Gemini-free-tier-data (privacy notice).

### Gaps
- Nothing here has been prototyped or listened to; quality judgments on Nepali/Hindi voice and parallax are untested.
- Real engagement outcomes of this pipeline vs full AI video are unknown (no data found).

