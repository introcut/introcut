# Animated characters, rigs, expressions and lip-sync for code-generated 9:16 story videos (browser, zero cost, permissive licenses) — as of 2026-10-22

Method note: ~35 tool calls (web search + fetch). Items marked **verify** come from search snippets, secondary sites, or my background knowledge and were not confirmed against primary text. Items under "Inferences" are my judgement, not cited facts. Where a fetch tool returned only a summary of a license page, I quote that summary and say so.

---

## 1. Character formats and runtimes (license of runtime, assets, browser feasibility, size, how well JSON can direct it)

### Takeaway
For a JSON-directed, MIT-licensed, Canvas-rendered app, the cleanest fits are (a) our own layered 2D puppet rig drawn by `renderFrame` (zero runtime dependency, full control of expression/gaze/mouth) and (b) Three.js + three-vrm (MIT) for a 3D stretch. Rive has a permissive runtime but the authoring editor is proprietary, the free plan stamps a splash screen on exports, and community files are CC BY; Spine and Live2D are proprietary-licensed (flag). Lottie is permissive but is a "play this clip" format with weak per-frame direction.

### Cited Findings
**Rive**
- Rive web runtime (rive-wasm) is MIT, "Copyright 2020-2021 Rive" — [rive-wasm LICENSE](https://github.com/rive-app/rive-wasm/blob/master/LICENSE) (fetch summary quoted: "Permission is hereby granted, free of charge, to any person obtaining a copy of this software").
- Runtime WASM sizes (Rive docs, updated Jan 2026, brotli -9): canvas-lite 707 KB raw / 222 KB compressed; canvas 1728 KB / 567 KB; webgl2 2179 KB / 648 KB. canvas-lite lacks Rive Text; `@rive-app/webgl2` is the recommended renderer; canvas has no browser context limit — [Rive runtime sizes](https://rive.app/docs/runtimes/runtime-sizes.md), [canvas vs webgl](https://rive.app/docs/runtimes/web/canvas-vs-webgl).
- Rive free plan: "Export .riv files with a splash screen... Free exports play a Rive splash screen. Upgrade to remove it." Cadet or higher removes it; free plan limits 3 collaborative files, 1 project, 10 MB per imported asset — [Rive pricing](https://rive.app/pricing). Third-party aggregators list Cadet at $9/seat/month (not primary; **verify**) — [bityclips summary](https://bityclips.com/tool/rive/pricing).
- Rive docs: community files and Marketplace files "are all shared under a CC BY license"; "A Remix is a copy of another user's file" — [Rive community overview via search](https://help.rive.app/community/overview), [marketplace overview](https://www.rive.app/docs/community/marketplace-overview). I could not retrieve the full license/attribution text (the Rive community "Start Here" page only said it covers CC BY, downloading .riv and attribution) — **verify**.
- State machines: "State machines define the logic that controls interactive animations in a Rive file" — [Rive docs](https://rive.app/docs/runtimes/state-machines). I did not retrieve the input-type details (boolean/number/trigger inputs, data binding) from the docs this run; from background knowledge the web runtime exposes them as settable inputs — **verify**.

**Lottie / dotLottie**
- LottieFiles "Lottie Simple License": permission to "download, reproduce, modify, publish, distribute, and publicly display" free files incl. commercial use; any redistribution "must contain (and be subject to) the same terms and conditions of this license"; no extra/different terms may be imposed; no use to build a competing service by compiling files from LottieFiles — [LottieFiles license](https://lottiefiles.com/page/license). **Flag:** it is a custom license, not OSI/CC; the "same terms" clause and "no compiling files" clause make bundling LottieFiles files in an MIT repo legally awkward. Treat as not clearly compatible; download at runtime from user's own file or avoid.
- dotLottie has runtime state machines (inputs numeric/boolean/string, interactions, states, guards/actions) and theming/slots; docs edited Feb 2026 — [dotLottie state machines](https://docs.lottiefiles.com/en/format/dotlottie/interactivity/state-machines). LottieFiles marketing says the dotLottie packages are MIT; LICENSE file not checked — **verify** — [dotlottie page](https://lottiefiles.com/dotlottie).

**Spine** — Runtimes require each user to own a Spine Editor license: "each user of the Products must obtain their own Spine Editor license"; redistribution must include the license/copyright notice — [Spine Runtimes License](https://esotericsoftware.com/spine-runtimes-license). **FLAG: proprietary; not usable in an MIT, zero-cost app (editor is paid).**

**Live2D Cubism** — SDK free to download but under Live2D Proprietary Software License and Open Software License; a release/publication contract and payment is needed on publication, with an exemption for small enterprises/general users under 10 million (yen) annual sales; Cubism Core for Web is not in the open repo and must be downloaded from the SDK; MotionSync core is closed — [Live2D docs/search](https://docs.live2d.com/en/cubism-sdk-manual/cubism-sdk-motionsync-plugin-for-web/), [Live2D help](https://help.live2d.com/en/?p=2558). **FLAG: proprietary core; cannot be redistributed in the repo.**

**DragonBones** — I could not retrieve the license (GitHub URL tried returned 404; search returned nothing). From background knowledge the runtimes were MIT but the editor has been unmaintained for years — **verify, and not recommended as a base even if MIT.**

**three-vrm / VRM**
- three-vrm is MIT; v3 current major, supports WebGPU; example uses Three.js r180 — [pixiv/three-vrm](https://github.com/pixiv/three-vrm). Three.js is MIT (2010-2026) — [three.js LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE).
- VRM model licenses are per model: VRM 1.0 metadata lets creators choose avatar-use permissions, commercial use, redistribution, modification, attribution; redistribution options include "Redistribution Prohibited", CC0 and several CC variants — [VRM license settings](https://vrm.dev/en/vrm/meta/license/), [VRoid conditions of use](https://developer.vroid.com/en/guidelines/conditions_of_use.html). VRoid released some alpha sample models under CC0 — [OpenGameArt VRoid CC0 models](https://opengameart.org/content/vroid-studio-cc0-models). I found no current VRoid-Studio-wide license for exported models; each model must be checked.
- Features such as expressions (happy/angry/aa/ih/ou/ee/oh), lookAt and spring bones are from my knowledge of the VRM spec, not confirmed by the fetched README — **verify** at [VRM spec](https://github.com/vrm-c/vrm-specification).

**TalkingHead (met4citizen, MIT)** — a worked example of JSON-ish directing of a GLB avatar in Three.js: moods (neutral, happy, angry, sad, fear, disgust, love, sleep), gestures (handup, index, ok, thumbup, thumbdown, side, shrug), `playAnimation`/`playPose` from Mixamo FBX, requires a Mixamo-compatible rig, root "Armature", 52 ARKit blendshapes + 15 Oculus viseme shape keys — [TalkingHead](https://github.com/met4citizen/TalkingHead). Its example avatars are mostly NOT freely usable: RPM brunette CC BY-NC 4.0; `mpfb.glb` CC0; Avaturn/AvatarSDK/VRoid example avatars non-commercial (same page).

**glTF in Three.js** — MIT runtime (Three.js). Skeletal animation and morph targets are standard; Quaternius "Universal Animation Library" (CC0, 120+ animations on a universal humanoid rig, GLB/FBX/Blend, "ready for retargeting") — [Quaternius UAL](https://quaternius.com/packs/universalanimationlibrary.html). It lists locomotion, combat, sitting, crawling, swimming, death and emotes but not talking/gesture animations (not mentioned).

**PixiJS + skeleton alternatives** — not researched this run; PixiJS is MIT from background knowledge but its Spine plugin inherits the Spine license (see above) — **verify**.

### Inferences
- Rive's strengths (editor-authored state machines, small runtimes, vector quality) are real, but for us the blockers are: authoring requires a closed editor, free exports carry a splash screen (looks unprofessional in a finished short), and CC BY community files need attribution inside each video or credits. Good as an optional "import your own .riv" feature, not as the core.
- A JSON spec can drive Rive/dotLottie only through the *inputs the artist exposed* — the AI is limited to whatever vocabulary the file author built. A custom rig or VRM gives a fixed, documented vocabulary we control.
- Because Introcut already has its own `renderFrame` on Canvas 2D, a self-written puppet rig (rig parameters per frame → canvas draw calls) shares the same code path for preview and export and needs no WASM; Rive/three-vrm would require compositing a second renderer into the frame (feasible via offscreen canvas, but adds a dependency and frame-exact seeking concerns for export) — **verify** Rive's API for seeking to an exact time (advance(dt) vs seek).
- LLM direction quality ranking (my judgement): custom rig with named poses/expressions > VRM expressions + mapped Mixamo-like clip names > Rive state machine (depends on file) > Lottie (clip play only).

### Gaps
- Primary text of Rive community-file CC BY terms and whether Rive's Terms restrict redistributing downloaded .riv files inside an open-source repo.
- DragonBones license, PixiJS/Pixi-spine details, VRM 1.0 expression/lookAt specifics, Rive input API specifics. File sizes of typical VRM (typically several MB to tens of MB — **verify**) and glTF characters (Quaternius low-poly are small; not measured).

---

## 2. Free character/asset sources: licenses and redistribution in an MIT open-source repo

### Takeaway
Safe to commit to the repo: CC0 sources (Quaternius, Kenney, Open Peeps, Humaaans, DiceBear CC0 styles, specific CC0 Sketchfab/OpenGameArt/Poly Pizza items). CC BY is allowed with attribution (add to `CREDITS.md`). Mixamo, Ready Player Me, LottieFiles-licensed files and Avataaars/Bottts-style custom licenses should not be bundled.

### Cited Findings
Table (redistribution column = may the files be committed to an MIT repo or shipped as an app asset; "att." = attribution needed):

| Source | License (evidence) | Character types | Formats | Redistribution in OSS repo? |
|---|---|---|---|---|
| Quaternius | "All models are under the CC0 License... without the need for attribution in commercial, educational, and personal projects" — [Quaternius FAQ](https://quaternius.com/faq.html). FAQ page does not explicitly address redistribution; CC0 itself is a public-domain dedication (background; **verify** the deed) | Low-poly humans, monsters (Ultimate Monsters, 50 with attack/walk/death), farm/low-poly animals (6 animals: idle/walk/run/jump/death), Universal Animation Library humanoid rig | FBX, OBJ, Blend, glTF/GLB (animals listing names FBX/OBJ/Blend; UAL lists GLB) | Yes (CC0). Note: UAL "Source" tier is paid (separate terms not stated); use the free Standard/Pro tiers only — [UAL](https://quaternius.com/packs/universalanimationlibrary.html), [animated animals](https://quaternius.itch.io/lowpoly-animated-animals) |
| Kenney | "all game assets on the asset pages are public domain licensed (CC0)... free to use, even in commercial projects" — [Kenney support](https://kenney.nl/support). Redistribution not addressed on that page | Mostly 2D sprites, some low-poly 3D incl. animated characters (animated-characters page not retrievable — **verify**) | PNG/SVG sprites, GLB/FBX | Yes if CC0 on the asset page (check each pack's included license file) |
| Mixamo (Adobe) | Adobe community FAQ: "the only thing you can't do is distribute the raw character and animation files"; "NO" list includes "Blueprints, templates, or asset packages for video game engines" that redistribute raw files; sharing only within a team; no ML training / bulk download; FAQ does not address open source and defers to Adobe Terms of Use — [Mixamo FAQ thread](https://community.adobe.com/t5/mixamo-discussions/mixamo-faq-licensing-royalties-ownership-eula-and-tos/m-p/13234775), [search summary](https://community.adobe.com/questions-696/mixamo-faq-licensing-royalties-ownership-eula-and-tos-589400). TalkingHead repeats: "Raw files can't be redistributed outside the project team or used to train ML models" — [TalkingHead](https://github.com/met4citizen/TalkingHead). Official helpx FAQ returned HTTP 403 | Humanoid characters + thousands of animations (incl. talking/gesture clips) | FBX | **NO — FLAG.** A public MIT repo containing raw Mixamo FBX/GLB is distribution of raw files. Possible only if each *end user* downloads from Mixamo themselves (not automatable; needs Adobe login) |
| Ready Player Me | Netflix announced acquisition 2025-12-19; standalone services including PlayerZero avatar creator scheduled to shut down 2026-01-31; only previously exported GLBs still work (secondary reports, competitor blogs) — [Genies blog](https://genies.com/blog/ready-player-me-shutdown), [Avatar SDK 2026-08-31](https://avatarsdk.com/blog/2026/08/31/avatar-platforms-2026-whos-alive-whos-gone/), [Invest in Estonia](https://investinestonia.com/netflix-acquires-estonian-avatar-platform-ready-player-me/). TalkingHead's sample RPM avatar is CC BY-NC 4.0 | Realistic half-body avatars | GLB | **NO — FLAG: discontinued; NC license on sample.** |
| DiceBear | Library MIT; 61 styles: CC0 1.0 for 42 (incl. Open Peeps, Lorelei, Notionists, Thumbs, Pixel Art, Critters, Voxel Art, Cutouts, Moods, Gaze, Clay...), CC BY 4.0 for 14 (Adventurer, Big Ears, Big Smile, Croodles, Dylan, Fun Emoji, Micah, Miniavs, Personas, Toon Head...), MIT for Icons, and "artist's own terms" for Avataaars/Avataaars Neutral/Bottts/Bottts Neutral — [DiceBear licenses](https://www.dicebear.com/licenses/) | Head/face avatars (not full-body), some creature/robot styles | SVG generated by JS (seed + options) | CC0 styles yes; CC BY styles yes with credit; **Avataaars/Bottts: unclear — FLAG** ("free for personal and commercial use", full terms not retrieved; [Penpot converted file](https://ark.sudovanilla.org/Penpot/penpot-files/commit/3be62a0f02b3861c99743e6bfc420de403aa8ed0)) |
| Open Peeps (Pablo Stanley) | "Free for commercial and personal use under CC0 License" — [openpeeps.com](https://www.openpeeps.com/) | Hand-drawn people: mix-and-match heads, bodies (sitting/standing) | SVG, PNG | Yes (CC0) |
| Humaaans (Pablo Stanley) | "Free for commercial or personal use", links to CC0 — [humaaans.com](https://www.humaaans.com/) | Flat vector people, mix-and-match | SVG-like vectors | Yes (CC0 per page) |
| Avataaars (Pablo Stanley) | Only secondary: "Free for personal and commercial use" — original terms not retrieved | Cartoon heads | Sketch/SVG | **Unclear — FLAG; avoid** |
| Blender Studio open-movie rigs | Rain, Snow, Huginn (Charge), Alpha (Spring), Vincent, Cat, Dog: CC-BY. Rain page: "You are free to share and adapt this content - but you must give attribution to Blender Studio"; credit line "Rain Rig (CC) Blender Foundation \| studio.blender.org"; 64.4 MB .blend, Blender 4.1+ — [Rain](https://studio.blender.org/characters/rain), [others via search](https://studio.blender.org/characters/snow/) | High-quality cartoon 3D rigs (Rain, Snow = girls; Huginn = raven; Vincent = sheep; Cat, Dog, Alpha) | .blend (need Blender to export GLB) | CC-BY: yes with attribution. Practical issue: big .blend files, must export GLB ourselves; rigs are for Blender, not browsers |
| Sketchfab | License per model: Standard License or CC; CC0 needs no credit, other CC need credit; mesh and animation can carry different licenses (fox: mesh CC0, rig/animation CC-BY 4.0 by another author) — [Sketchfab help](https://help.sketchfab.com/en/articles/16152215-crediting-users-for-3d-model-downloads), [Needle fox](https://asset-explorer.needle.tools/Fox) | Anything | glTF/GLB | Only CC0 or CC BY items you verify one by one; **Standard License = NO** |
| Poly Pizza | FAQ URL returned 404; not verified. Background: models are CC0 or CC-BY per model, mostly Google Poly archive — **verify** | Low-poly props, some animated characters | GLB | Per model — **verify** |
| OpenGameArt | Per asset (CC0, CC-BY, CC-BY-SA, GPL, OGA-BY...). Example: "Animal Pack Vol.2" (CC0, wolf/eagle/dog/cat) — [OGA animal pack](https://opengameart.org/content/animated-animales-low-poly), [VRoid CC0 models](https://opengameart.org/content/vroid-studio-cc0-models) | Sprites and 3D | many | Only CC0/CC-BY; **CC-BY-SA and GPL are copyleft — avoid in an MIT repo** (background; **verify** compatibility for assets-only use) |
| Rive community | CC BY (docs) — see Q1 | Hundreds of animated characters/mascots | .riv | CC BY: probably yes with attribution; **verify** terms and that .riv can be redistributed |
| LottieFiles free animations | Custom Lottie Simple License (see Q1) | Many animated characters | Lottie JSON | **Unclear / FLAG** because of "same terms" and anti-compilation clauses |

### Inferences
- The only sources that give a *complete 2D humanoid with body* under CC0 are Open Peeps and Humaaans; Open Peeps is hand-drawn, layered SVG (head/body/pose separate), which suits our own rig well but has no animals.
- For 3D, Quaternius CC0 (humanoid rig + UAL + animals) is the sole large source I could confirm as CC0 with a retarget-ready rig.
- Credits: any CC BY item belongs in `CREDITS.md` and, depending on the item, perhaps on-screen at export; decide policy before adopting.

### Gaps
- Actual CC0 legal text not fetched (assumed standard); Quaternius/Kenney do not state a redistribution clause on the pages fetched, but CC0 covers it. Kenney animated characters, Poly Pizza, Avataaars original terms, Rive CC BY text, Adobe Terms of Use text itself, itch.io/Fab per-asset terms: not confirmed.

---

## 3. Animals and non-human characters (monkey, cat, dog, farmer)

### Takeaway
Permissive animated animals exist in 3D (Quaternius CC0: farm animals, low-poly animals, monsters; OGA Animal Pack Vol.2 CC0) but a talking *monkey with acting range* is not covered; for 2D we would draw our own animal face/body parts and reuse the same puppet rig.

### Cited Findings
- Quaternius LowPoly Animated Animals: 6 animals, animations Death, Idle, Jump, Run, Walk, FBX/OBJ/Blend, CC0; Farm Animals Animated 6.6 MB, CC0 — [itch.io](https://quaternius.itch.io/lowpoly-animated-animals).
- Quaternius Ultimate Monsters: 50 monsters with attack/death/run/walk, glTF available; Sketchfab page labels CC-BY while author text says CC0 (conflict; check source) — [Sketchfab](https://sketchfab.com/3d-models/ultimate-monsters-pack-fd72e114d119488da71fe3a16f216c4f).
- OpenGameArt "Animal Pack Vol.2": wolf, eagle, dog, cat, piranha (CC0, 2017) — [OGA](https://opengameart.org/content/animated-animales-low-poly).
- Blender Studio CC-BY animal rigs: Cat, Dog (Blender 3.6+), Huginn (raven) — [Blender Studio](https://studio.blender.org/characters/cat/), [dog](https://studio.blender.org/characters/dog/v1/).
- DiceBear CC0 "Critters" and "Thumbs" styles and CC BY "Big Ears", "Toon Head", "Croodles" give animal-ish/mascot heads — [DiceBear licenses](https://www.dicebear.com/licenses/).

### Inferences
- Those 3D animals have only idle/walk/run/jump/death clips and (I infer) no facial morph targets/visemes, so "talking" would require a jaw-bone rotation hack; that reads fine for low-poly but not as acting.
- The lowest-effort talking monkey: our own 2D vector monkey drawn from ~15 SVG/Canvas primitives (head, ears, muzzle, eyes, brows, 5 mouth shapes, body, two arms, tail) written as MIT code. Original art by us = no license burden; the same rig drives a cat/dog/farmer by swapping parts and colour palette.
- Generic quadruped walk cycles in 2D are hard to make convincing; keep animals mostly stationary or in profile with a 2-frame bob or camera moves.

### Gaps
- No confirmed CC0 rigged monkey; no sprite-sheet monkey checked. Per-animal facial rigs not verified in Quaternius packs.

---

## 4. Procedural animation by code (what looks convincing vs robotic)

### Takeaway
Small layered procedural motions (breathing, blink, head sway, eye darts, overshoot easing, squash/stretch, hand gestures with anticipation) carry most of the "alive" feel; walking cycles and IK are costly and are best avoided in V1.

### Cited Findings
- TalkingHead auto-selects expressions from `avatarMood` and emoji, plays hand gestures by name and converts words to visemes — a working precedent for text/emotion-tag-driven animation in JS — [TalkingHead](https://github.com/met4citizen/TalkingHead).
- Rhubarb outputs Preston Blair-style mouth cues; lip-sync-engine README attributes the nine shapes to Preston Blair — [lip-sync-engine](https://cdn.jsdelivr.net/npm/lip-sync-engine@1.0.3/README.md).
- Three.js MIT; its examples include a `CCDIKSolver` (IK) and AnimationMixer cross-fading (from my knowledge; not fetched — **verify**).

### Inferences
(Animation craft; background knowledge, **verify** by prototyping; none of this was cited.)
- Convincing: breathing (1-2% torso scale, 3-4 s period); blinks at random 2-6 s with a 120-200 ms close/open and occasional double-blink; micro head sway via two summed low-frequency sine/noise terms; eye darts (saccades) between 2-3 gaze targets and eyes leading the head by ~100 ms; anticipation then overshoot/settle (spring easing, not linear) on poses; squash-and-stretch on entrances and emphasis; secondary motion (ear/tail/hair follow-through using damped springs); brows and head tilt tied to speech emphasis.
- Robotic: constant-period sine idle, simultaneous blink on both eyes at fixed interval, linear interpolation, mouth flapping at uniform rate, gestures that start/stop abruptly, no weight shift.
- Walk/run: for a puppet, use "slide with bob and tilt" rather than leg cycles; real walk cycles need bone rigs + IK (three.js CCDIKSolver for 3D; FABRIK-style 2-bone IK is ~40 lines for 2D arms/legs and we can write it ourselves).
- Retargeting: only needed for 3D (Mixamo-/UAL-style humanoid rigs, bone-name maps; three.js SkeletonUtils.retargetClip); avoid in V1.

### Gaps
- I did not find or evaluate other open-source JS "text-to-animation" projects beyond TalkingHead (and its HeadAudio add-on). No benchmarked IK libraries were reviewed.

---

## 5. Lip-sync in the browser (audio-driven, text-driven, languages)

### Takeaway
For stylised characters, an audio-loudness-driven mouth with 3-5 mouth shapes is acceptable and language-independent (works for Hindi/Nepali, TTS or recorded). Phoneme-accurate options (Rhubarb, TalkingHead modules) are English-centred; Hindi/Nepali need a custom text-to-viseme module or a loudness approach. Rhubarb has a browser WASM port.

### Cited Findings
- **Rhubarb Lip Sync** (Daniel Wolf): MIT license; "Lip sync data generated from your audio belongs to you alone"; third-party parts are BSD/Boost/MIT (PocketSphinx and CMU English acoustic model are 2-clause BSD variants) plus one component under a WTFPL-style license ("Where Am I?") — [LICENSE.md](https://raw.githubusercontent.com/DanielSWolf/rhubarb-lip-sync/master/LICENSE.md). Uses 6 basic mouth shapes (A-F) + 3 extended (G, H, X). Recognizers: PocketSphinx (default) "only recognizes English dialog"; Phonetic mode "if your recordings are not in English", described as language-independent — [GitHub README](https://github.com/DanielSWolf/rhubarb-lip-sync).
- **lip-sync-engine** (npm): WebAssembly port of Rhubarb, MIT, bundle "2.2MB WASM + models" + ~80 KB JS, outputs `mouthCues` (start, end, value X/A-H), runs in browser — [README](https://cdn.jsdelivr.net/npm/lip-sync-engine@1.0.3/README.md). Maturity/maintainer not checked.
- **wawa-lipsync** (wass08): MIT; Web Audio `AnalyserNode`; call `processAudio()` each frame, read `viseme`; aimed at 2D/3D characters; the README does not say how visemes are computed, which viseme set, or language support — [repo](https://github.com/wass08/wawa-lipsync).
- **HeadAudio** (kyr0): MIT; AudioWorklet; MFCC + Mahalanobis classifier to Oculus visemes (values 0-1 via `onvalue`), model ~14 kB, ~50 ms latency, no transcript needed; bundled model trained on English Harvard Sentences; "far from optimal", less accurate than text-driven — [HeadAudio](https://github.com/kyr0/HeadAudio).
- **TalkingHead text-driven visemes**: language modules (en rule-based ~80% accuracy; fi >99.9%); built-in en, de, fr, pt-BR, fi, lt; Hindi and Nepali not mentioned; other languages by new module (Appendix C) or TTS giving visemes (Azure) — [TalkingHead](https://github.com/met4citizen/TalkingHead).
- **use-lipsync** (npm): claims text-driven lip sync with ARKit morph targets for English and Indian languages incl. Hindi; single version, one maintainer — maturity/licence not verified — [Socket page](https://socket.dev/npm/package/use-lipsync/overview/1.0.0).
- An academic paper maps standard visemes to Hindi phonemes (many-to-one, e.g. /k/ and /g/) — [ACL W13-3904](https://preview.aclanthology.org/moar-dois/W13-3904.pdf).
- Meta's Oculus Lipsync plugin is end-of-life; Meta's current audio-driven output is 15 visemes (Oculus viseme set) — [Meta docs](https://developers.meta.com/horizon/documentation/unreal/audio-ovrlipsync/).
- **Kokoro TTS**: Apache-2.0 code and weights; languages incl. Hindi (`h`), English (a/b), Spanish, French, Italian, Japanese, Portuguese, Mandarin; pipeline yields graphemes and phonemes per segment; token-level timestamps not mentioned; espeak-ng licensing for non-English G2P not addressed (espeak-ng is GPL-3 from background — **verify**; important for MIT purity) — [kokoro](https://github.com/hexgrad/kokoro).

### Inferences
- Nepali shares Devanagari script and most phonemes with Hindi; a Devanagari-grapheme-to-viseme table (vowels dominate mouth shape: a/aa open, i/ee wide, u/oo round, o rounded-open; labials p/b/m closed; f/v teeth-lip; others neutral) would be ~40 lines, timed by distributing each word's letters across the word duration. Word timestamps would need a forced aligner (Whisper word timestamps via transformers.js) for recorded audio, or per-sentence TTS durations (rough). Quality is "good enough for cartoons" but unproven — **verify by prototype**.
- A simple loudness-driven jaw/mouth (RMS or band energy -> open amount with attack/release smoothing, plus 3-5 discrete mouth sprites chosen by amount, and spectral-centroid to pick wide vs round) is the proven cheap baseline in stylised animation; Rhubarb/Preston Blair mouth cues are the next step in quality, needing English-only PocketSphinx or the weaker phonetic recognizer.
- Because the app renders offline (frame-exact export), mouth values must be pre-computed from the audio buffer (analysing decoded PCM per frame time), not by a live AnalyserNode; wawa-lipsync/HeadAudio are real-time and would need an OfflineAudioContext or a precompute pass — **verify**.
- Veo-style photoreal lip-sync is out of scope (as stated).

### Gaps
- No evidence on actual Hindi/Nepali accuracy of any listed tool; no check of Rhubarb phonetic recognizer quality on Hindi; no permissive Hindi/Nepali forced aligner confirmed in this run; TTS viseme outputs of Azure/Google (paid or user-key) not verified.

---

## 6. Directing characters from a JSON spec: minimal "acting vocabulary"

### Takeaway
A 30 s story needs roughly 15-25 distinct named actions drawn from a fixed closed list, used ~25-45 times. Existing systems expose exactly this shape (moods + gestures + poses + named clips + state-machine inputs).

### Cited Findings
- TalkingHead exposes moods (neutral, happy, angry, sad, fear, disgust, love, sleep), gestures (handup, index, ok, thumbup, thumbdown, side, shrug), poses/animations by Mixamo name, emoji-to-expression — [TalkingHead](https://github.com/met4citizen/TalkingHead).
- Rive/dotLottie drive characters via state-machine inputs (boolean/number/trigger or numeric/boolean/string) — [Rive state machines](https://rive.app/docs/runtimes/state-machines), [dotLottie](https://docs.lottiefiles.com/en/format/dotlottie/interactivity/state-machines).
- VRM uses named expressions, plus Oculus 15-viseme set is the common lip-sync target — [VRM](https://vrm.dev/en/vrm/meta/license/) (licensing page only; expression names from background, **verify**), [Meta visemes](https://developers.meta.com/horizon/documentation/unreal/audio-ovrlipsync/).

### Inferences
Proposed closed vocabulary (design, not cited):
- Emotion (face; 9): neutral, happy, sad, angry, surprised, scared, thinking, smug, excited (+ intensity 0-1, blend over 0.2-0.4 s).
- Gesture (body, one-shot; 9): wave, point, shrug, thumbs_up, facepalm, clap, nod, shake_head, lean_in (+ hold/idle fallbacks: idle, talk_idle).
- Pose/state (loops; 4): idle, talking, walking (slide-bob), sitting/holding prop.
- Entrance/exit (6): pop_in (squash-stretch), slide_in_left/right, drop_in, fade, walk_off; same set reversed.
- Gaze (5): camera, other_character, up_left (thinking), down, follow_object; with blink style.
- Placement: slot (left/center/right x depth), scale, flip, z-order.
- Camera (6): hold, push_in, pull_out, pan, shake (impact), whip_cut.
- Timing: each beat = {t, character, say(line ref), emotion, gesture, gaze, enter/exit, camera}; the AI emits ~6-10 scenes x 3-5 beats. Each character has a rig param set (`mouthOpen`, `mouthShape`, `browL/R`, `eyeOpen`, `gazeX/Y`, `headTilt`, `armPose`) computed by the renderer from the beat list, so the AI never outputs frame-level numbers.
- Count: a 30 s clip at one beat per 2-3 s gives ~12-15 beats; 15-25 named actions cover a scene set; the LLM should be restricted to the enum (Zod schema) and a validator falls back to idle/neutral on unknown names.

### Gaps
- No empirical test of LLM reliability at choosing from this vocabulary; no survey of other JSON-director schemas beyond TalkingHead/Rive/dotLottie.

---

## 7. Recommendation (lowest-effort approach that looks intentional, plus stretch)

### Takeaway
Build our own 2D layered puppet rig in Canvas 2D (MIT, our own art), driven by a closed acting vocabulary, with loudness-driven mouth shapes (optional Rhubarb WASM for English) and procedural idle layers. Stretch: VRM/glTF characters in Three.js with Quaternius CC0 animations and three-vrm.

### Cited Findings
(Supporting facts for the choice; see sections above for sources.)
- Open Peeps and Humaaans are CC0; DiceBear has 42 CC0 styles — [DiceBear](https://www.dicebear.com/licenses/), [Open Peeps](https://www.openpeeps.com/), [Humaaans](https://www.humaaans.com/).
- Quaternius is CC0, with a retarget-ready humanoid rig library — [Quaternius](https://quaternius.com/packs/universalanimationlibrary.html).
- three-vrm and Three.js are MIT — [three-vrm](https://github.com/pixiv/three-vrm), [three.js](https://github.com/mrdoob/three.js/blob/dev/LICENSE).
- Rhubarb and its WASM port lip-sync-engine are MIT (English-oriented recognizer) — [Rhubarb license](https://raw.githubusercontent.com/DanielSWolf/rhubarb-lip-sync/master/LICENSE.md), [lip-sync-engine](https://cdn.jsdelivr.net/npm/lip-sync-engine@1.0.3/README.md).
- Avoid: Spine (editor license required), Live2D (proprietary core), Mixamo raw files (no redistribution), Ready Player Me (shut down, NC sample), LottieFiles free files (custom license), Avataaars/Bottts (unclear) — sources in Q1/Q2.

### Inferences
**Option A (recommended, lowest effort): "Cut-out puppet" rig, 2D.** Estimated 6-10 days of work (my estimate, not cited):
1. Rig model + renderer in `src/render` (parts tree, transforms, springs, blink/breath/sway/gaze, layered pose blending): 2-3 days.
2. Art: draw 2 starter characters as code-generated SVG/Canvas paths (a monkey and a person) with 5-6 mouth shapes and ~9 emotion eye/brow sets, original art by us (no license issue; or restyle CC0 Open Peeps parts; credit nothing needed under CC0): 2-3 days.
3. Acting vocabulary Zod schema + AI prompt + validator + fallback: 1 day.
4. Audio-driven mouth: precompute RMS/spectral-centroid per frame from the decoded voice buffer; Devanagari vowel table optional: 1 day. Optional Rhubarb WASM for English: +1 day.
5. Entrances/gestures library with springs and squash-stretch: 1 day.
- Licensing steps: our own art under MIT (state it in repo); any CC0 art noted in `CREDITS.md` (as policy requires, even if not obliged); no new runtime dependency beyond what we write; if Rhubarb WASM is added, note MIT plus the BSD/Boost/WTFPL-style third-party parts in `CREDITS.md`.
- Why it looks intentional: consistent flat style, camera moves + speech-synced mouth + eye/blink layers is the "motion graphic puppet" look; avoids uncanny failures of 3D and avoids per-frame LLM output.

**Option B (stretch): 3D VRM/glTF characters in Three.js, ~15-25 days:** three-vrm for expressions (aa/ih/ou/ee/oh visemes) and lookAt; Quaternius UAL CC0 animations retargeted; characters from CC0 sources (Quaternius humans, our own VRoid-made models with CC0 license set by us, or the OGA/VRoid CC0 samples). Risks: retargeting bugs, 5-30+ MB downloads, a second renderer to unify with `renderFrame`/export, no CC0 talking monkey, per-model licence audits. Fox/animal talk would need morph-target authoring in Blender.

**Option C (optional import, ~2 days):** let users drop their own `.riv` or dotLottie character; AI maps vocabulary to exposed state-machine inputs when a mapping JSON is supplied. Document that Rive free exports carry a splash screen and CC BY files need credit.

### Gaps
- Effort figures are estimates; no prototype was built. Need a sanity prototype for: loudness-driven mouth readability in Hindi, frame-exact offline mouth precompute, and canvas-drawn monkey quality.
