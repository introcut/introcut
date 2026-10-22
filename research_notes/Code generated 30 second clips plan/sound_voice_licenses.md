# Sound for code-generated 30 s story videos: voice, captions, music, SFX, mixing, licenses (as of 2026-10-22)

Method note: facts below were fetched from the named pages on 2026-10-22. Fetch tool summaries often did not show full license text; where a LICENSE file text was not read, it is marked "verify". Items from background knowledge only are listed under Gaps/Inferences, never as cited findings.

## 1. Offline / in-browser TTS without GPL contamination (en, hi, ne)

### Takeaway
There is NO verified practical, good-quality, permissive-chain in-browser English TTS today that ships ready-made. The closest are (a) Kokoro-82M weights (Apache-2.0) with misaki running with its espeak fallback turned off (misaki is Apache-2.0, espeak is optional) but kokoro-js's own `phonemizer` npm dependency is the espeak-embedding piece, so a custom permissive G2P front end would have to be written; (b) Supertonic 3 (ONNX, ~99M params, English+Hindi, no phonemizer needed, runs on onnxruntime-web) but its weights are OpenRAIL-M (use-restricted, not OSI-open) and the repo is archived; (c) @piper-plus/g2p (MIT, no eSpeak) which feeds Piper-format models but has no Hindi. Nepali: nothing permissive and verified; Hindi: Supertonic 3 is the only verified in-browser candidate, with the OpenRAIL-M caveat.

### Cited Findings
- Kokoro code is Apache-2.0 and README says weights are Apache-licensed ("With Apache-licensed weights"). Lists Hindi as lang code 'h'. README: "espeak-ng ... used for English OOD fallback and some non-English languages". — [hexgrad/kokoro](https://github.com/hexgrad/kokoro)
- misaki (Kokoro's G2P) is Apache-2.0; English G2P does not require espeak; default `fallback=None`; espeak is an optional fallback for out-of-dictionary words via `EspeakFallback` + `phonemizer-fork`. Hindi is NOT listed in misaki's README (only English, Japanese, Korean, Chinese, Vietnamese). — [hexgrad/misaki](https://github.com/hexgrad/misaki)
- Kokoro Hindi voices (hf_alpha, hf_beta, hm_omega, hm_psi) are graded C with ~1-10 h training data; Hindi uses misaki code 'h' with espeak-ng `hi` as fallback; one listing warns non-English support may be thin from weak G2P/data (community mirror of model card, not official). — [Replicate listing of Kokoro model card](https://replicate.com/codingayam/kokoro-82m-complete/readme)
- kokoro-js (npm package.json) is Apache-2.0 with runtime dependencies `@huggingface/transformers` and `phonemizer` (^1.2.1). The `phonemizer` npm package is the one the owner found embedding eSpeak NG (GPL-3.0); I could not load its npm page (403) so its exact license text is "verify". — [kokoro.js/package.json](https://raw.githubusercontent.com/hexgrad/kokoro/main/kokoro.js/package.json)
- espeak-ng is GPL: FreeBSD port lists GPLv3; an npm espeak-ng wrapper lists GPL-3.0-or-later. — [FreshPorts](https://www.freshports.org/audio/espeak-ng/), [npm espeak-ng](https://npmjs.com/package/espeak-ng)
- Ports of misaki without espeak exist outside JS: misaki-rs (all lexicons embedded; without espeak feature, unknown words are spelled letter by letter), MisakiSharp (C#, no espeak). No misaki-js found. — [search result summary](https://docs.rs/crate/misaki-rs/0.5.0), [MisakiSharp](https://github.com/Lyrcaxis/MisakiSharp)
- Piper: old `rhasspy/piper` shows MIT license label and was archived Oct 6, 2025 ("Development has moved: OHF-Voice/piper1-gpl"). `OHF-Voice/piper1-gpl` is GPL-3.0 and "embeds espeak-ng for phonemization". — [rhasspy/piper](https://github.com/rhasspy/piper), [OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl)
- `@piper-plus/g2p` (npm): MIT, "No eSpeak-ng — Zero GPL dependencies; fully MIT licensed", WASM/browser, English is "Rule-based", outputs Piper-compatible phoneme IDs; languages only ja, en, zh, es, fr, pt, ko, sv (no Hindi). Dictionary/accuracy for English not documented. — [package README](https://cdn.jsdelivr.net/npm/@piper-plus/g2p@0.4.1/README.md)
- Supertonic: sample code MIT; model "released under the OpenRAIL-M License"; 31 languages including Hindi (CER 5.34 on Minimax-MLS-test), not Nepali; ~99M params (Supertonic 3); onnxruntime-web / WebGPU/WASM web example; no phonemizer dependency mentioned; repo archived (notice July 23, 2026; read-only Sept 9, 2026; Voice Builder shut Aug 31, 2026). — [supertone-inc/supertonic](https://github.com/supertone-inc/supertonic)
- Supertonic OpenRAIL-M per third-party mirrors: BigScience Open RAIL-M (Aug 18, 2022), "not OSI-approved", use restrictions in Attachment A passed downstream (e.g., no impersonation, no undisclosed machine-generated content, defamation). Summaries not primary: "verify" by reading the LICENSE. — [HF mirror search results](https://huggingface.co/lnkiai/supertonic-3-mirror)
- KittenTTS: code Apache-2.0; "models are licensed separately"; KittenTTS 2 (1.7B, 506-947 MiB) is under "Stellon Labs Community License" (terms not read, treat as not bundle-able); V0.8 ONNX models 15M-80M params (25-80 MB); lists 20 languages incl. Hindi but the page is internally inconsistent ("ten languages" elsewhere); does not state G2P or browser support. — [KittenML/KittenTTS](https://github.com/KittenML/KittenTTS)
- Sherpa-ONNX pretrained TTS list: matcha-icefall en_US-ljspeech and zh-baker, kokoro-en-v0_19 / multi-lang (zh+en), kitten-nano/mini en, many Piper-based vits models; NO Hindi or Nepali model listed. Page does not state licenses or which need espeak-ng-data. — [sherpa-onnx TTS models](https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/index.html)
- Chatterbox: repo MIT; Hindi in the 23-language Multilingual model plus a Hindi single-language pack; 110M (Nano) to 500M params; Python (cuda/cpu/mps), no browser/ONNX mention; every output carries an imperceptible Perth watermark. Weights license not stated on the page ("verify" on the HF cards). — [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox)

### Inferences
- A "permissive Kokoro" = Kokoro weights + misaki lexicon (Apache) + `fallback=None`, i.e. dictionary-only English with out-of-vocabulary words spelled letter by letter (as misaki-rs does). It would need a JS port of misaki's lexicon lookup (gold/silver dictionaries) or running misaki-rs/MisakiSharp compiled to WASM; nobody has shipped that in JS as far as I found. Effort: moderate (days), quality for OOV words (names, slang) is the risk. Dictionary data provenance (misaki gold/silver lexicons derive from public sources, possibly CMUdict-like) must be checked: "verify".
- Supertonic 3 is the only candidate that covers English and Hindi in-browser with no GPL piece, but OpenRAIL-M is a custom, use-restricted license; under the project's rule "custom licenses not bundle-able" it needs an owner decision. Using it as a user-initiated download from Hugging Face (as the Kokoro plan did) rather than bundling softens but does not remove the question. Archived upstream means no fixes.
- Hindi G2P for Devanagari is largely rule-based (schwa deletion being the hard part), so a permissive hand-written Devanagari-to-phoneme converter is feasible, but no existing Hindi/Nepali model that takes IPA in a verified permissive way was found; model-and-G2P must match the training phoneme set, so a new G2P cannot just feed Kokoro Hindi voices (they were trained with espeak `hi` phonemes). This is reasoning, not a sourced fact.
- For Nepali, nothing was found beyond the earlier research; skip in-browser offline Nepali in V1, use cloud voice (Gemini/Azure) or user recording.

### Gaps
- Not verified at source this session (background knowledge only, treat as "verify"): SpeechT5 (MIT; English only, x-vector speakers, needs no espeak, uses its own SentencePiece tokenizer; quality mediocre), Parler-TTS / Indic Parler-TTS (Apache-2.0 code/weights per memory; heavy), MMS-TTS (CC-BY-NC), XTTS (CPML), F5-TTS (code MIT, weights CC-BY-NC), StyleTTS2 (MIT code but uses espeak/phonemizer), OpenVoice (MIT), Orpheus (Apache-2.0, Llama-based, 3B, too heavy for browser). No page for these was fetched.
- The exact license text of the `phonemizer` npm package and whether misaki's lexicons are compatible with Apache-2.0 redistribution (data sources) were not read.
- Real quality of Supertonic Hindi and Kokoro Hindi: only a self-reported CER and a community grade C; no listening test.
- Whether misaki's English lexicon alone gives acceptable quality for narration scripts (OOV rate) is unmeasured.

## 2. Cloud TTS free tiers with the user's own key

### Takeaway
All three big clouds list Hindi; only Gemini (3.8 Flash TTS, Flash-Lite TTS) and Azure (ne-NP-HemkalaNeural / SagarNeural) were confirmed to list Nepali. Gemini free tier is tiny (anecdotally ~10-15 requests/day, officially "check AI Studio") and unpaid use may feed Google training and human review; Azure F0 gives 0.5M neural characters/month and has word-boundary events in its SDK; ElevenLabs free is 10k credits/month with unclear commercial terms.

### Cited Findings
- Gemini TTS models listed: `gemini-3.8-flash-tts` (130+ languages, single/multi-speaker, voice design, voice replication) and `gemini-3.8-flash-lite-tts` (100+ languages); Nepali and Hindi supported by both; output is 24 kHz mono 16-bit WAV (unary) or raw PCM (streaming); docs state no word timestamps and no output-length limit. — [Gemini speech generation docs](https://ai.google.dev/gemini-api/docs/speech-generation)
- Gemini rate limits: per project (not per key), RPD resets midnight Pacific, "Specified rate limits are not guaranteed"; docs give no free-tier TTS numbers (only AI Studio shows them). A forum user reported 10 RPD for `gemini-3.1-flash-tts` on free tier (anecdotal); a third-party table lists 15 RPD for 2.5 Flash Preview TTS (possibly outdated). — [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [forum thread](https://discuss.ai.google.dev/t/gemini-lies-about-free-tier-quota-limits-sudden-resource-exhausted-blockers-on-tts-models/177531)
- Gemini data terms: unpaid services "Google uses the content you submit ... to provide, improve", "human reviewers may read, annotate, and process your API input and output", "Do not submit sensitive ... information to the Unpaid Services"; paid services are not used for product improvement. — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Google Cloud TTS free usage: Chirp 3 HD 0-1M characters free then $30/1M; WaveNet and Standard 0-4M characters free then $4/1M (figures consistent across regional pricing pages). Hindi and Nepali availability per voice type NOT confirmed (voice list page too long to read fully). Cloud TTS SSML `<mark>` timepoints via `enable_time_pointing` came from the fetch tool's background knowledge, not the page: verify. — [pricing search results](https://cloud.google.com/text-to-speech/pricing)
- Azure: `ne-NP-HemkalaNeural` (F), `ne-NP-SagarNeural` (M); Hindi has 9 standard neural voices (Aarav, Ananya, Aarti, Arjun, Kavya, Kunal, Rehaan, Swara, Madhur) plus HD "MAI-Voice-2" voices. Speech SDK exposes `synthesis_word_boundary` event (word boundary support for ne-NP not confirmed on the page). F0 free tier: 0.5M neural characters/month per pricing pages. — [Azure language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts), [Azure pricing](https://azure.microsoft.com/en-in/pricing/details/speech)
- ElevenLabs Free: "10k credits" per month, no rollover; Commercial License is listed starting at Starter; 74 languages listed unnamed; Hindi/Nepali not confirmed from the page. — [ElevenLabs pricing](https://elevenlabs.io/pricing)

### Inferences
- Gemini is best quality-per-effort for ne/hi but a 30 s clip is one request, so ~10-15/day is a few videos per day on free keys; add a retry/"use recording" fallback and a notice that the unpaid tier may use the text.
- Gemini returns audio without timestamps, so captions need a separate alignment step (section 3).
- Azure's word-boundary events would give captions timing for free, but need a key plus region and the browser Speech SDK (license MIT per memory, verify) or REST; CORS from browser to Azure Speech REST is believed fine (verify). ElevenLabs free terms probably exclude commercial output: treat as "verify".

### Gaps
- Browser CORS behaviour for Gemini, Google Cloud TTS (API key), Azure and ElevenLabs was not tested. Gemini generativelanguage API is commonly called from browsers with a key header, but I did not verify this session.
- Google Cloud TTS: Nepali/Hindi voice types and free-tier status of newer Gemini-based TTS inside Cloud TTS were not confirmed.
- Whether Azure word boundaries work for Nepali voices.

## 3. Caption timing (word-level) for a known script

### Takeaway
For a known script, do not transcribe: align. The cheapest usable approach for 30 s clips is proportional alignment by character/syllable count refined with silence/energy detection (no dependency, works for Devanagari). Whisper via transformers.js can give word timestamps (`return_timestamps: 'word'`, MIT) and can be used to snap to the known text, but Nepali accuracy is unmeasured. CTC forced aligners are the accurate route but MMS-FA is CC-BY-NC.

### Cited Findings
- transformers.js supports `return_timestamps: 'word'` for Whisper (example `Xenova/whisper-tiny.en`), accepts `language` hint; multilingual Whisper examples use `Xenova/whisper-small`. Docs do not discuss Hindi/Nepali accuracy. — [transformers.js pipelines docs](https://huggingface.co/docs/transformers.js/api/pipelines)
- A transformers.js commit fixed word-level timestamps for non-English languages (language token handling). Whisper word timestamps rely on DTW over cross-attention weights; accuracy may vary for under-resourced languages. No benchmark for Hindi/Nepali word timing was found. — [commit](https://cdn05042023.gitlink.org.cn/dnrops/transformers.js/commit/c3af5964439f199419b8640ac0e55e3d2d0f08c2), [whisper-timestamped](https://github.com/linto-ai/whisper-timestamped)
- OpenAI Whisper code is MIT. — [openai/whisper LICENSE](https://github.com/openai/whisper/blob/main/LICENSE)
- Azure Speech SDK offers a word-boundary event during synthesis (offset per word). — [Azure docs example](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)
- Gemini TTS returns no timestamps (see section 2). — [Gemini docs](https://ai.google.dev/gemini-api/docs/speech-generation)

### Inferences
- Recommended pipeline: (1) if the voice comes from Azure, use its word-boundary events; (2) otherwise detect speech/silence with an energy threshold on the decoded PCM (pure JS, MIT-free of dependencies), split into phrases at pauses of ~150-250 ms, then distribute known words proportionally by grapheme-cluster count inside each phrase; (3) optional "refine" button running Whisper-small in the browser and snapping to word starts when the Whisper text matches the script. For 30 s, phrase-anchored proportional alignment typically errs by well under a few hundred ms, enough for 2-4 word caption chunks (this error claim is an engineering estimate, not sourced).
- Devanagari: count grapheme clusters (Intl.Segmenter) rather than code points, and treat matras/conjuncts as one unit; Nepali and Hindi syllable rhythm is close to proportional.

### Gaps
- No licensed-and-verified in-browser CTC aligner found. MMS-FA (torchaudio) is CC-BY-NC per memory: flag, not fetched. wav2vec2-based Hindi aligners (e.g., AI4Bharat IndicWav2Vec) license/ONNX availability not checked. WhisperX/MFA are Python (not browser) per earlier knowledge, not re-verified.
- Whisper Nepali word-timestamp error: unmeasured (needs a 10-clip test).

## 4. Lip-sync input (visemes) for stylised characters

### Takeaway
A loudness envelope alone drives a convincing open/closed mouth for stylised characters and needs no text. Rhubarb gives 6-9 mouth shapes but is a CLI tool, English-oriented (language-independent phonetic mode is less precise), so it is not browser-ready; a cheap in-browser vowel classifier from FFT formants is feasible without text.

### Cited Findings
- Rhubarb Lip Sync: six basic mouth shapes plus three optional extended (6-9); dialog text optional but improves reliability; PocketSphinx recognizer is English-only; a language-independent "phonetic" recognizer exists for other languages with less precise results; command-line tool for Windows/macOS/Linux, no browser version mentioned. License of Rhubarb and PocketSphinx not confirmed from the page (LICENSE.md linked). — [DanielSWolf/rhubarb-lip-sync](https://github.com/DanielSWolf/rhubarb-lip-sync)

### Inferences
- Tier 1 (V1): mouth-open amount = smoothed RMS envelope (e.g., 20 ms windows, attack 40 ms, release 80 ms) mapped to 3-4 mouth sprites (closed, small, open, wide). No text, language-independent, works for en/hi/ne.
- Tier 2: add a vowel hint from spectral centroid or first two formant peaks (A/E/I/O/U buckets) to pick "wide/round/smile" shapes; still text-free. Both tiers are original engineering, not sourced; they need a listening/visual test.
- Rhubarb (if license permits, verify) could be run offline at asset-creation time for pre-baked demo characters, not in-app.

### Gaps
- Rhubarb license (believed MIT in memory, PocketSphinx BSD-like) not verified. No browser WASM port verified.

## 5. Music: bundle-able sources, Content ID, procedural, AI tools

### Takeaway
Only CC0 sources are safe to bundle and ship without attribution plumbing: Kenney (CC0, confirmed) and Freesound CC0-filtered items (but download needs a login, so curate at build time). Kevin MacLeod is CC BY 4.0 (bundle-able with a credits screen; Content ID claims possible). Pixabay/Mixkit/YouTube Audio Library/Sonniss terms are not suitable for redistribution as asset files. Procedural music with Tone.js (MIT) is license-clean; Strudel is AGPL-3.0 and must not be used.

### Cited Findings
- Kenney: "all game assets on the asset pages are public domain licensed (CC0)"; "free to use them, even in commercial projects". (Kenney's site is mostly game audio, UI and impact/interface sounds; music is limited.) — [kenney.nl/support](https://kenney.nl/support)
- Kevin MacLeod / Incompetech: "the Creative Commons license that I offer all of my music under"; credit "Licensed under Creative Commons: By Attribution 4.0"; music is copyrighted not public domain; modifications allowed but must say which parts are yours; credits must be easy to find; page links a YouTube Content ID article and suggests answering challenges with the track's ISRC. — [Incompetech FAQ](https://incompetech.com/music/royalty-free/faq.html)
- Freesound: CC0 "you can do pretty much what you want", CC-BY needs credit, CC-BY-NC forbids earning money (flag NC); a registered login is required to download; remix rules: CC-BY-NC sources can only be re-released as CC-BY-NC. — [Freesound FAQ](https://freesound.org/help/faq/)
- OpenGameArt licenses: CC0, CC-BY, CC-BY-SA, OGA-BY, GPL; "CC-BY and CC-BY-SA: Do not bundle on platforms that use DRM"; for non-GPL projects "check license compatibility yourself"; OGA-BY drops the anti-DRM clause. — [OpenGameArt FAQ](https://opengameart.org/content/faq)
- Mixkit: pages show separate "Stock Music Free License" and "Sound Effects Free License"; redistribution/bundling terms not shown (license pages not read). — [Mixkit license index](https://mixkit.co/license/)
- Sonniss GDC bundles: royalty-free, commercial, no attribution; but redistribution as sound effects/library/sample pack "Not as sound effects" (even edited); use "for media production only"; AI/ML training prohibited. — [Sonniss GDC page](https://sonniss.com/gameaudiogdc)
- YouTube Audio Library: third-party guides say standard-license tracks are limited to YouTube, Content ID protection applies only on YouTube, CC BY tracks are usable elsewhere with credit; YouTube's own Help text not retrieved. — [Foximusic guide](https://www.foximusic.com/blog/?p=546), [licenseorg guide](https://licenseorg.com/guide/music-audio/youtube-audio-library)
- Tone.js: MIT; npm `tone@next` from dev branch. Offline rendering not confirmed from the README. — [Tone.js](https://github.com/tonejs/Tone.js)
- Strudel: "licensed under AGPL-3.0"; derivative work must use the same license; "Source code must be distributed along with web publication". — [Strudel technical manual](https://strudel.cc/technical-manual/project-start/)

### Inferences
- Bundle policy: CC0 only in repo (`public/music`), each file with a row in CREDITS.md; CC BY 4.0 tracks (Incompetech) possible if the exported video's credit text is auto-added, but then every exported video needs an attribution line and Content ID risk exists for the creators; owner decision.
- Pixabay is already ruled out (earlier research). Do not fetch Mixkit/Pixabay at runtime or copy into repo; users could be told to add their own music file (uploaded locally) which sidesteps redistribution.
- A procedural engine is the license-safest default: sequence chords/pad/arpeggio/drum pattern from mood presets (calm, tense, hopeful, epic, mysterious) using plain Web Audio oscillators/filters/noise (no dependency) or Tone.js (MIT), rendered inside OfflineAudioContext so preview and export match. Realistic quality: good for ambient pads, lo-fi loops and tension drones; weak for "real band" feel. Stated as engineering judgement, not sourced.
- Content ID risk: procedural and CC0 audio have effectively no registered fingerprint; MacLeod and other CC tracks may be re-registered by third parties (as the YouTube-library note describes).

### Gaps
- Free Music Archive: license page 404; per-track CC license mix (many are NC/ND) unverified this session. Treat as not bundle-able unless a track is CC0/CC-BY and individually checked.
- Mixkit license text, itch.io CC0 pack list, and Kenney's music pack availability were not checked item by item.
- AI music generators with free tiers (Suno, Udio, Stable Audio, MusicGen/Meta weights CC-BY-NC): not researched this session; MusicGen weights are CC-BY-NC per memory (flag, verify). Not bundle-able either way.
- Quality of Tone.js/Web Audio procedural music for story moods is unmeasured.

## 6. Sound effects: CC0 libraries and procedural SFX

### Takeaway
Procedural SFX are the cheapest zero-risk path: ZzFX (MIT, under 1 KB compressed) generates blips, hits, risers and whooshes from 20-number arrays, so a 40-sound library is a few KB of JSON instead of megabytes. Real recorded CC0 (Kenney, Freesound CC0) can fill in what synthesis does badly. Sonniss/ZapSplat/Mixkit are not for redistribution as files.

### Cited Findings
- ZzFX: MIT license; "Less than 1 kilobyte when compressed"; no dependencies; each sound is a 20-parameter array, e.g. `zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17])`; a sound designer web app builds arrays. Music variant is a separate project, ZzFXM. — [KilledByAPixel/ZzFX](https://github.com/KilledByAPixel/ZzFX)
- Kenney assets are CC0 (see section 5). — [kenney.nl/support](https://kenney.nl/support)
- Freesound CC0 sounds are free to reuse but require a logged-in download; Sonniss prohibits redistribution as sound effects (see section 5). — [Freesound FAQ](https://freesound.org/help/faq/), [Sonniss](https://sonniss.com/gameaudiogdc)

### Inferences
- Minimal bundle plan (engineering estimate): 30-40 procedural presets as JSON (~5 KB total), rendered at runtime through OfflineAudioContext (ZzFX's code plays live, so use its buffer-generating function or port its ~40-line `buildSamples` to fill an AudioBuffer; confirm in code). Add 10-15 CC0 recorded files (Kenney impacts/UI, a few Freesound CC0 ambiences) as 64 kbps mono Opus/AAC at ~50-150 KB each, total well under 2 MB. Numbers are estimates.
- Tagged vocabulary for the AI to choose from: `whoosh_short`, `whoosh_long`, `riser_tension`, `impact_soft`, `impact_hard`, `hit_boom`, `tick`, `pop`, `click_ui`, `swell_pad`, `sparkle`, `heartbeat`, `ambience_room`, `ambience_wind`, `ambience_crowd`, plus attributes (duration, intensity 1-3, mood). The LLM outputs tag + time + intensity only; code resolves to a preset. Original design suggestion.
- Use Web Audio nodes directly for whoosh (filtered noise with sweeping bandpass), riser (sawtooth pitch ramp plus noise), impact (sine pitch drop plus noise burst), tick (short click). All these are original DSP, no license.

### Gaps
- ZapSplat terms (attribution/redistribution) not fetched; believed to require attribution for free tier, not verified, so exclude.
- jsfxr/sfxr license not fetched (believed MIT/public-domain variants, verify).
- Real-world quality of procedural SFX vs. recordings for story videos not evaluated.

## 7. Mixing and loudness in the browser

### Takeaway
Do ducking as gain automation on the music bus in the OfflineAudioContext using voice-activity ranges already known from the script/caption timing, and measure integrated loudness with a small in-house ITU-R BS.1770 K-weighting pass (no dependency) or libebur128 (MIT) compiled to WASM if exactness is needed. No ready npm WASM ebur128 package was found.

### Cited Findings
- libebur128 (C) "all source code is licensed under the MIT license", implements EBU R128 with M/S/I modes, loudness range and true-peak scanning. A Rust port `ebur128` is MIT too. — [martingasser/libebur128 mirror](https://github.com/martingasser/libebur128), [docs.rs ebur128](https://docs.rs/crate/ebur128/latest)
- I found no confirmed npm/WASM build of ebur128 (search returned only C, Rust, Python bindings; the elsabe/ebur128-wasm URL I guessed 404'd). — [search results](https://docs.rs/crate/ebur128/latest)
- Mediabunny export and OfflineAudioContext are as described in the project brief (no new source needed).

### Inferences
- Simple pipeline (engineering recommendation): voice track at 0 dB normalised to about -16 dBFS RMS target; music bus -20 dB base, ducked another -8 to -12 dB while voice active (attack 80 ms, release 400 ms) via `gain.linearRampToValueAtTime` schedule built from the voice's own energy envelope; SFX bus -12 dB; master DynamicsCompressorNode (soft limiter) then peak ceiling at -1 dBFS; then compute integrated LUFS with a ~60-line K-weighting biquad pair plus gated mean-square (BS.1770 is a public standard) and apply one static gain to reach -14 LUFS (clamped so peak <= -1 dBTP approximated by 4x oversampled peak). A 30 s mix is cheap enough that a two-pass render (measure, then gain) is fine.
- Because the K-weighting filter coefficients are published in the standard, a dependency is unnecessary; libebur128 WASM is the "verify against a reference" option for tests.

### Gaps
- No verified WASM/JS loudness package with license. K-weighting coefficient values for 48 kHz must be copied from the standard or ITU/EBU docs (not fetched here).
- True-peak limiter quality of DynamicsCompressorNode vs. a lookahead limiter not measured.

## 8. Recommendation: zero-cost permissive sound stack for V1

### Takeaway
V1 should treat voice as a tiered choice (user recording and upload first, Gemini/Azure with the user's key second, an offline voice only as an experiment), generate caption timing without ML (energy-phrase proportional alignment, with Azure boundaries when available), and use only procedural music, procedural SFX, plus a small CC0-only bundle. The one real open question for the owner is whether an OpenRAIL-M model (Supertonic 3) or a self-built dictionary-only Kokoro front end is acceptable for the offline voice tier.

### Cited Findings
- See per-item citations above; the decisive ones: espeak-ng is GPL (sections 1), Piper current is GPL-3.0 (section 1), Kokoro weights+misaki are Apache-2.0 with espeak optional (section 1), Supertonic weights OpenRAIL-M (section 1), Gemini lists Nepali/Hindi but unpaid terms permit training use (section 2), Azure has ne-NP voices with 0.5M free chars (section 2), Kenney CC0 / Incompetech CC BY 4.0 / Strudel AGPL / ZzFX MIT / Tone.js MIT / libebur128 MIT (sections 5-7).

### Inferences
- Voice tiers per language:
  - English: (1) user recording/upload; (2) Gemini or Azure with user's key; (3) optional offline: Kokoro weights with a dictionary-only misaki-style G2P (build effort) or Supertonic 3 (owner decision on OpenRAIL-M). Do NOT use kokoro-js as published.
  - Hindi: (1) recording/upload; (2) Gemini/Azure (nine Azure voices + HD); (3) offline only Supertonic 3 (31 languages incl. Hindi, owner decision) or Chatterbox (Python only, weights license verify, not browser).
  - Nepali: (1) recording/upload; (2) Gemini (listed) or Azure Hemkala/Sagar; (3) no offline option in V1.
- Captions: proportional + silence-snapped alignment first, Whisper refine later, Azure boundaries when present.
- Music: procedural moods first (Tone.js MIT or raw Web Audio); optional CC0 tracks only; user-uploaded music always allowed.
- SFX: ZzFX-style presets plus tagged vocabulary; 10-15 CC0 recordings.
- Mixing: ducking by gain automation, two-pass render, in-house LUFS meter, -14 LUFS, -1 dB peak.
- Build order: (1) mixer with ducking and LUFS pass (everything else depends on it); (2) caption alignment by energy/phrases (ships value for all three languages); (3) procedural SFX presets and tags; (4) procedural music moods; (5) Azure provider with boundaries; (6) CC0 bundle and CREDITS.md entries; (7) offline voice experiment last.
- Owner decisions needed: (a) accept OpenRAIL-M for Supertonic (as bundled or user-downloaded) or not; (b) allow CC BY 4.0 (Incompetech) with auto-credit; (c) approve writing/maintaining a permissive G2P for Kokoro English; (d) gate for the Gemini free-tier "text may be used by Google" notice (section 2); (e) whether using Perth-watermarked Chatterbox is acceptable, if ever.

### Gaps
- Sections 1-7 gaps apply; additionally no listening tests were run, no bundle sizes measured, and several licenses (Rhubarb, Chatterbox weights, KittenTTS Stellon license, Supertonic LICENSE text) need reading at source before any dependency is added to CREDITS.md.
