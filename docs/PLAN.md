# Introcut — PLAN v2

Free, open-source, browser-only **AI producer + director + editor** for anyone who wants an unforgettable ~30-second vertical video. Introcut does not generate video itself. It plans the video, tells you which free generator to use for each shot and how to prompt it, fills the gaps those generators leave, creates the sound, and finishes the cut so it feels made by a person. Domain: introcut.app. Code license: **MIT**.

Supersedes PLAN v1 (editor-only). Everything below is in V1; ordering is for risk control, not scope cutting.

---

## 1. Decisions so far

| Topic | Decision |
|---|---|
| Users | **Anyone** who wants a 30 s AI-assisted clip. Not developer-specific. Example scenario driving design: a Nepali farming how-to with a talking monkey (garlic planting) |
| Length | Target 30 s, adjustable 15–60 s |
| Languages | English, Hindi, Nepali (script, voice, captions). UI English first |
| Formats | **Chosen by the AI from the user's idea.** Library of formats as a menu + beat building blocks for ideas that fit nothing (§6). Optional "try another approach" button, never a required picker |
| Readiness | 4 scores 0–100 with reasons: hook, clarity, **visual feasibility for free generators**, novelty. Below ~60 → ask ≤ 3 specific things. Never blocks ("continue anyway") |
| Generators | Not integrated in V1. Introcut recommends a tool per scene and writes the prompt; user copies, generates, drags the clip back. Swappable **generator profiles** (§7) |
| Voice | If the generator speaks and lip-syncs (e.g. Veo), keep it. Otherwise Introcut makes voice: browser TTS, own recording, or the user's cloned voice (§9) |
| Captions | Bold word-by-word highlight; editable; text taken from the script, only **timing** is aligned to audio |
| Music | Bundled CC0 tracks + ducking (~15 % under speech, ~40 % open) |
| Export | 1080×1920, 30 fps, H.264/AAC MP4 (+720p draft), plus title, description, hashtags. Chrome/Edge desktop |
| Saving | Auto-save in browser (OPFS + JSON), import/export `.json`, "clear all data" |
| Safety | Only your own face/voice for clones, recorded consent phrase, "AI-generated" reminder at export, never watermark removal |
| Cost | Zero. No paid APIs, no servers we pay for. Optional heavy jobs run on the **user's own** free accounts (Hugging Face) |

**Defaults I'm applying unless you object:** no Remotion (custom renderer, §4); Mediabunny accepted (MPL-2.0, used unmodified).

## 2. Two modes, one pipeline

- **Generated mode:** idea → generated clips (monkey, field, compost…) + Introcut-made gap fillers.
- **Presenter mode:** user's screen recording + an avatar of the user presenting it.
- Modes can mix in one project.

### 2a. The core engine: Analyze → Diagnose → Decide (runs on every change)

Introcut is not a fixed pipeline. It is a loop over **three inputs**:

1. **The idea** (brief, script, intended beats and what each scene must show)
2. **The resources** (screenshots, screen recording, selfie, voice sample, links, style bible, anchor image)
3. **The clips actually received** (generated or filmed, in whatever state they arrive)

Any entry point works, and the same engine handles all of them:

| User brings | Engine does |
|---|---|
| Idea only | Plan: format, script, shot list, prompts, tool pick → then waits for clips |
| Idea + resources | Plan using the resources (e.g. screenshots become scenes) and ask for what's missing |
| Idea + resources + clips | **Analyze the clips, compare to the plan, diagnose, fix** |
| Clips only | Infer the idea from what's in them, then build the story and direct the gaps |

**Analyze: an evidence sheet per clip** (facts first, opinions second):
- *Measured (reliable):* duration, aspect, fps, loudness, silence and speech segments, motion over time, internal cuts, frozen/black frames, blur, brightness and color, a static logo/watermark in a corner, first and last frame.
- *Estimated (models, can be wrong, shown with confidence):* what's in the picture (vision embeddings vs. the scene's intent), spoken language, does the audio contain the scripted line (alignment confidence), same character as the anchor image, same look as the style bible.
- *Not decidable by software, shown to the user as a frame to check:* subtle artifacts (extra fingers), whether a precise action is correct ("root touches soil").

**Diagnose:** compare evidence to each scene's intent and to the whole video. Examples: "scene 3 came back at 5 s, planned 7 s", "monkey in clip 2 doesn't match the anchor image (similarity low)", "clip 4 has a visible corner logo", "clip 1 speaks a different line than scripted", "no clip shows the straw mulch yet".

**Decide:** a model picks from a fixed **action menu**, each action being an op that respects user locks:
`use as is · trim · stretch/slow · reorder · swap clip · fill gap (freeze+callout, Ken Burns, parallax, card, talking-still) · add SFX · replace or normalize voice · color-match · regenerate (writes an improved prompt with the reason) · request a new clip · drop scene`.

**The user sees** a per-scene card: *evidence → what's wrong → proposed action → apply / undo / do it my way*, plus a "what's still missing" list. Every manual change becomes a lock the engine plans around. Pipeline stages (brief, script, prompts, audio, captions, export) are tools the engine calls, not a fixed sequence.

**Worked example, clips received:** clip 3 (planting) is 5 s and its paws never show the root touching soil → decision: keep the best 3 s, add a freeze-frame callout circle "root must touch soil" (filler), flag "check this frame" to the user, and offer an improved close-up prompt. Clip 6's voice is lower than clip 1's → normalize and flag possible voice drift.

Worked example (garlic video, 30 s): hook monkey (gen) → stubble field (gen) → planting close-up (gen, flagged hard: hands) + freeze-frame **callout circle** "root touches soil" (Introcut filler) → compost (gen) → straw mulch (gen) → monkey outro CTA (gen or Introcut talking-still).

## 3. Risk gates (tests before building dependent features)

| Gate | Question | Decides |
|---|---|---|
| G1 | **Veo Nepali test** (user runs, 5 min): is speech clear, lips synced, watermark? | How much Nepali voice work Introcut owns |
| G2 | Local LLM quality: Nepali/Hindi **script writing** (free text, harder than menu choice) | Default LLM; whether script drafting needs the opt-in free-API-key provider |
| G3 | Nepali ASR/alignment: align *known script text* to audio (Whisper timestamps vs IndicWav2Vec/CTC) | Caption timing method |
| G4 | Nepali TTS: Matcha-TTS Nepali / Chatterbox Nepali / others — quality + **license** | Built-in Nepali voice |
| G5 | Avatar: MuseTalk (MIT) on a free Hugging Face Space — works? time? quota? Also SadTalker weights license | Avatar maker design |
| G6 | CLAP in browser + sound-effect corpus license | Sound-effect matching |
| G7 | Veo reference images ("Ingredients") on free tier + Google's rules for own face | Presenter-avatar route A |

Each gate has a fallback so no milestone is blocked by a failed gate.

## 4. Stack and licenses

| Purpose | Choice | License |
|---|---|---|
| App | Vite, React, TypeScript, Zustand, Zod | MIT |
| Renderer | **Own** `renderFrame(project, t, canvas)` shared by preview and export (Canvas 2D → WebGL later) | MIT (ours) |
| Decode/mux/encode | Mediabunny + WebCodecs | **MPL-2.0** (unmodified use) |
| Screen/voice recording | `getDisplayMedia` + `MediaRecorder` (browser APIs) | — |
| LLM (brief, script, prompts) | WebLLM + Qwen3 (default, local) · **opt-in** user's own free API key · rules fallback; one `LlmProvider` interface | Apache-2.0 |
| Speech alignment / ASR | Whisper (transformers.js) or CTC aligner, picked by G3 | MIT / Apache-2.0 |
| Vision (clip↔slot matching, quality flags, style check) | SigLIP/CLIP via transformers.js | Apache-2.0 / MIT |
| Sound-effect matching | CLAP via transformers.js (G6) | verify |
| TTS | kokoro-js (English, Hindi); Nepali per G4 | Apache-2.0 (verify repo) |
| Voice clone (later in V1) | Chatterbox on user's free GPU | MIT |
| Avatar (G5) | MuseTalk on user's free Hugging Face Space | MIT code, weights commercial-OK per README (verify) |
| Fonts | Noto Sans Devanagari | OFL |
| Music, SFX | CC0, license recorded per file in `CREDITS.md` | CC0 |
| PWA, deploy | vite-plugin-pwa, Cloudflare Pages | MIT |
| Registry freshness | GitHub Actions (free on public repo) | — |

## 5. Project JSON (v2)

Times in ms. Caption word times are in **source time**, so trims need no re-timing.

```ts
type Project = {
  version: 2; id: string; name: string; createdAt: string; updatedAt: string;
  mode: "generated" | "presenter" | "mixed";
  settings: { width: 1080; height: 1920; fps: 30; targetDurationSec: number; maxDurationSec: number;
              language: "en" | "hi" | "ne"; captionPreset: "bold-highlight"; llm: "local" | "user-key" | "rules" };
  brief: { idea: string; audience?: string; feeling?: string; cta?: string; links: string[];
           assetIds: string[]; qa: { q: string; a: string }[] };
  readiness: { scores: { hook: number; clarity: number; feasibility: number; novelty: number }; overall: number;
               reasons: Record<string, string>; missing: { ask: string; fixHint: string }[]; proceededAnyway: boolean };
  format: { id: string | "custom"; why: string; beats: { id: string; kind: BeatKind; targetMs: number }[] };
  styleBible: { character?: { name: string; description: string; anchorMediaIds: string[] };
                look: { lighting: string; palette: string[]; lens: string; camera: string };
                aspect: "9:16"; negative: string[]; seriesLine: string };   // appended to every prompt
  script: { language: string; lines: { id: string; sceneId: string; text: string; roman?: string;
            voice: "generator" | "tts" | "recorded" | "cloned" | "none" }[] };
  media: MediaItem[];
  scenes: Scene[];
  audio: { sfx: SfxCue[]; music: { trackId: string | null; master: number; ducked: number; open: number };
           normalize: { loudnessLUFS: number; matchVoiceAcrossClips: boolean } };
  avatar?: { consent: { mediaId: string; phrase: string; at: string }; baseVideoMediaId: string;
             engine: "hf-space-musetalk" | "external-clip"; layout: "bubble" | "split" | "intro" };
  export: { title: string; description: string; hashtags: string[]; aiLabelAck: boolean };
  diagnosis?: { runAt: string; scenes: { sceneId: string;
                  evidence: { measured: Record<string, unknown>; estimated: { claim: string; confidence: number }[]; needsHumanCheck: string[] };
                  findings: string[];
                  actions: { op: string; params: Record<string, unknown>; reason: string; status: "proposed" | "applied" | "rejected" }[] }[];
                missing: string[] };
  meta: { retention?: { dips: { atMs: number; why: string; fix: string }[]; score: number }; notes?: string };
};

type MediaItem = { id: string; kind: "video" | "photo" | "audio"; name: string; opfsPath: string; width: number; height: number;
  durationMs?: number; hasAudio?: boolean; origin: "camera" | "screen" | "selfie" | "ai-generated" | "unknown";
  generatorId?: string; watermark?: "none" | "visible" | "unknown"; analysis?: { speech: Range[]; motionPeaks: number[]; quality: Range[]; /* … */ } };

type Scene = {
  id: string; beat: string; role: "hook" | "body" | "cta";
  type: "generated" | "user-media" | "card" | "filler" | "avatar";
  intent: string;                                              // what this beat must show
  slot: { targetMs: number; status: "empty" | "filled" | "flagged"; flags: string[] };
  source?: { mediaId: string; inMs: number; outMs: number };
  generation?: { generatorId: string; prompt: string; startFrameMediaId?: string; refMediaIds: string[];
                 why: string; attempts: { promptVersion: number; mediaId?: string; note?: string }[] };
  filler?: { kind: "freeze-callout" | "kenburns" | "parallax" | "stretch" | "card" | "talking-still"; params: Record<string, unknown> };
  framing: { mode: "center" | "manual" | "auto-zoom"; x: number; y: number; zoom: number };
  captions: { enabled: boolean; words: { text: string; startMs: number; endMs: number }[] };
  overlays: { id: string; text: string; startMs: number; endMs: number; position: "top" | "center" | "bottom" }[];
  transition: { kind: "cut" | "fade" | "slide" | "j-cut" | "l-cut"; durationMs: number };
  audio: { useSourceAudio: boolean; volume: number };
  grade: { matchToLook: boolean };
  locks: Partial<Record<"trim" | "order" | "captions" | "overlays" | "transition" | "framing" | "prompt", true>>;
  provenance: { by: "ai" | "user"; reason?: string };
};
```

Human edits set `locks`/`provenance.by = "user"`. Every AI action (full rebuild, redo scene, chat command) treats locks as constraints and changes only its own scope.

## 6. Format library

Formats are JSON files (adding one = adding a file). The AI picks by matching the brief; if none fits it composes from beat kinds: `hook, setup, escalation, demo, reveal, proof, payoff, cta`.

```ts
type Format = { id: string; name: string; fitsWhen: string[];           // matching hints for the LLM
  hook: { style: string; maxMs: 2000 }; beats: { kind: BeatKind; share: number }[];   // share of total length
  sceneCount: [min: number, max: number]; pacing: { cutEveryMs: [number, number] };
  captions: { maxWords: 4; style: string }; music: { mood: string }; idealLengthSec: [number, number];
  feasibilityNotes: string[] };                                          // e.g. avoid readable text
```

Starters: **mini story** (hook→rising→twist→payoff) · **problem → reveal** · **before/after** · **3 things you didn't know** · **POV / cinematic mood** · **how-to demo** (your garlic example: hook→steps with callouts→result→cta).

## 7. Generator registry ("the researcher")

```ts
type GeneratorProfile = { id: string; name: string; url: string; lastVerified: string; sourceUrls: string[];
  clip: { minSec: number; maxSec: number }; aspects: string[]; resolution?: string;
  audio: { native: boolean; speechLanguages: string[]; lipSync: boolean; confidence: "verified" | "claimed" | "unknown" };
  free: { allowance: string; resets: "daily" | "monthly"; watermark: "visible" | "invisible" | "none" | "unknown"; commercial: "yes" | "no" | "unknown" };
  inputs: { startFrame: boolean; referenceImages: number };
  strengths: string[]; weaknesses: string[]; promptStyle: string };
```

- Tool pick = deterministic scoring of scene needs (speech language, clip length, character, start frame, watermark tolerance) vs profile, then LLM explains.
- Prompts are written **per scene** (4–8 s), each with the style bible + the 9-part structure: character, setting, camera, lighting, action, narration, ambience, negatives, series style.
- **Last-frame bridging:** Introcut extracts the last frame of clip N as start frame for N+1.
- **Multi-day tracker:** "3 of 6 clips done; next prompt; free credits reset daily".
- **Freshness:** scheduled GitHub Action re-fetches registry source pages, diffs, opens an issue/PR for review. The app shows `lastVerified`. Users with a free API key can run live research. We never claim more than a profile's `confidence`.

## 8. Gap fillers and finishing (the "human touch")

- **Fillers:** freeze-frame + callout circle/arrow/zoom insert, Ken Burns, depth parallax on stills (small depth model, license-checked), stretch (hold, slow, reverse), text/step cards, talking-still (audio-driven mouth for cartoon characters).
- **Continuity:** color matching to the style bible, light film grain, consistent slight camera drift, voice-level matching across clips.
- **Editing craft:** audio-first timing, cuts on speech beats, J/L cuts (audio overlaps), hook title in first 2 s, one visual event every 2–3 s, loopable ending when possible.
- **Retention check:** flags likely attention dips (long static scenes, weak hook, late payoff) and suggests fixes. A heuristic, not a promise of virality.

## 9. Sound department

1. **Voice sources per line:** generator-native (kept, normalized) · browser TTS (kokoro-js en/hi; Nepali per G4) · own recording · cloned voice.
2. **Captions:** text from script, timing from alignment (G3); caption editor for fixes.
3. **Sound effects:** scene description → text-to-sound retrieval (CLAP, G6) from a CC0 library; placement on **action beats** found by motion-peak detection.
4. **Ambience and music:** keep good generator ambience, add CC0 music, duck under voice, loudness-normalize.
5. **Honest limit:** realistic-face lip-sync of an arbitrary voice is not promised (no free permissive browser solution known). Mitigations: generator-native sync, voice-over shots, cartoon mouth animation.

## 10. Presenter mode and avatar

- **Screen recording** in-app (`getDisplayMedia` + mic). Smart edit: dead-time trim, speed-up of idle parts, auto-zoom to where the screen changes (no cursor-accurate tracking promised).
- **Layouts:** bubble, split, avatar-intro-then-screen.
- **Avatar routes:** (A) external clip, e.g. Veo with your reference photos (G7) → drag in. (B) **Avatar maker**: record 15–20 s selfie video + consent phrase once; run MuseTalk on **your own free Hugging Face Space** with any audio; result lands in your project (G5). Selfie + audio go to *your own* Space only, with an explicit notice.
- **Voice clone:** Chatterbox on your free GPU, spoken consent check, Nepali quality verified before enabling.

## 11. Architecture

```
src/
  model/      schema.ts (Zod), ops.ts, timeline.ts, retention.ts
  store/      project store, undo, autosave
  storage/    opfs.ts, projectIO.ts
  render/     renderFrame.ts, captions.ts, fillers/, transitions.ts, grade.ts, framing.ts
  media/      decode.ts, record.ts (screen/mic/selfie), thumbs.ts, motion.ts
  audio/      mix.ts, ducking.ts, normalize.ts, sfx.ts
  ai/         llm/ (provider interface: local | user-key | rules), brief.ts, readiness.ts, format.ts,
              script.ts, shotlist.ts, prompts.ts, tools.ts, match.ts, align.ts, tts.ts
  registry/   generators/*.json, formats/*.json
  avatar/     hfSpace.ts, consent.ts
  export/     exportMp4.ts, metadata.ts
  ui/         MediaBin, Preview (phone frame), Timeline, Brief, Readiness, ShotList, PromptCard,
              Tracker, SceneInspector, CaptionEditor, ChatBox, Presenter
.github/workflows/registry-check.yml
```
Principles: heavy work in Web Workers; swappable interfaces for LLM, TTS, aligner, avatar engine, generator profiles; every state change goes through `ops.ts` (shared by user, AI, undo).

## 12. Milestones

Each is runnable with `npm run dev` and ends with test steps, a git commit, and your call on what next.

| M | Name | Contents |
|---|---|---|
| 1 | Editor shell | Upload **and record** (screen, mic, selfie) → media bin showing a **technical probe per clip** (duration, aspect, audio, loudness); 9:16 phone preview playing a sample project JSON; clickable scene timeline. No AI |
| 2 | Project core | v2 schema, ops, undo/redo, locks, OPFS autosave, JSON import/export |
| 3 | Brain + brief | `LlmProvider` (local WebLLM / user key / rules); intake UI; readiness scores + missing-info questions; format pick with reasons; script + shot list. **Gates G1, G2 run here** |
| 4 | Direction desk | Generator registry + profiles, per-scene tool pick, prompt writer, style bible + anchor image, last-frame extraction, copy/open handoff, multi-day tracker; registry GitHub Action |
| 5 | **Analyze & Decide engine** | Evidence sheet per clip (measured + estimated), clip↔slot matching, diagnosis vs idea/resources, action menu with per-scene cards (apply/undo/override), "what's missing" list, improved-prompt regeneration. Works for all four entry points (§2a) |
| 6 | Audio-first | Narration drives timing; TTS voices (en/hi, Nepali per **G4**); recording; native-audio mode; script→audio **alignment (G3)**; loudness + voice matching |
| 7 | Captions | Bold-highlight renderer, Devanagari, caption editor |
| 8 | Sound | SFX retrieval and beat placement (**G6**), ambience, CC0 music, ducking |
| 9 | Gap fillers + finishing | Callout/freeze, Ken Burns, parallax, stretch, cards, color match, grain, transitions incl. J/L cuts, hook title, retention check |
| 10 | Presenter mode | Layouts, screen-recording smart edit, avatar slot (**G7**) |
| 11 | Avatar + clone | Consent flow, MuseTalk Space maker (**G5**), Chatterbox voice clone, Nepali verified or disabled with message |
| 12 | Export | MP4 1080/720, title/description/hashtags, AI-label reminder |
| 13 | Ship | PWA, Cloudflare Pages, README, `CREDITS.md`, license audit |

Useful earlier: generated-clip mode works end to end from M9; presenter mode from M10.

## 13. Risks (honest)

1. **Free tiers change** (generators, Hugging Face quotas, Flow rules) → registry with dates, fallbacks, never hard-depend on one provider.
2. **Local LLM writing Nepali/Hindi scripts** is free-text generation, harder than picking from a menu → G2; opt-in user-key provider for quality; local stays default; editable script always.
3. **Voice drift** between generated clips (unverified expectation) → normalization, re-voicing fallback.
4. **Avatar via free GPU** may be slow, queued or revoked → guided flow, external-clip route A always works.
5. **Watermarks and commercial-use limits** on free generator tiers → shown per profile; no removal feature.
6. **Virality is not guaranteed** → we optimize measurable levers and say so.
7. **Scale of V1:** 13 milestones. Generated mode becomes usable at M9.

## 14. Needs your OK
1. Plan v2 as written, including all of §10–§11 in V1 (with gates)?
2. Defaults: own renderer instead of Remotion; Mediabunny accepted?
3. Start Milestone 1?
