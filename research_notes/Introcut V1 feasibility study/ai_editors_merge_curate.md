# AI video editors: internal pipelines, open components, and the "merge and curate AI clips" path for Introcut V1 (as of 2026-10-22)

Method note: about 30 web searches and fetches. Primary sources were fetched where possible (GitHub READMEs, FFmpeg legal page, Google Flow help index, Kling quickstart). Many facts from search snippets are secondary and are marked. Statements marked "(inference)" are my reasoning. Statements marked "(general knowledge, not re-verified this session)" come from my training knowledge and carry no citation, so verify them before they go into a spec. Nothing here recommends removing, hiding or cropping out watermarks, scraping, or automating web UIs.

## 1. Component map of commercial AI video editors, and the open permissive option for each stage

### Takeaway
Public engineering detail on commercial editors is thin: almost all of them are black boxes, and the best-documented pattern is "transcript or frame descriptions go to an LLM or VLM, which returns an edit decision list (EDL) that a conventional renderer executes". The open permissive building blocks for every stage exist (Whisper, silero-VAD, PySceneDetect, RNNoise/DeepFilterNet, RIFE, Real-ESRGAN, FFmpeg LGPL). Only the light ones (VAD, small ASR, CLIP-class embeddings, RNNoise, simple image statistics) are realistic in a browser at V1. Heavy ones (upscaling, interpolation, 14B video models) are desktop/GPU.

### Cited Findings
**What commercial products say publicly**
- OpusClip ClipAnything: the help docs describe clipping by natural-language prompts using visual, audio and sentiment cues, analysing each frame for objects, scenes, actions, sounds, emotions and text, then rating each scene for virality potential — [Opus help](https://help.opus.pro/docs/article/how-to-use-clipanything.md)
- OpusClip uses Gemini 1.5 Flash for "visual description" processing (vendor-partner case study, 2024-25, so possibly outdated by 2026) — [Google Developers Blog](https://developers.googleblog.com/en/opusclip-achieves-30-percent-cost-savings-in-visual-description-processing-with-gemini-flash/)
- OpusClip's reframing is a separate component ("ReframeAnything") using AI object tracking to keep a chosen subject in frame when changing aspect ratio; Opus publishes a self-reported "Repurpose-10K" benchmark (24.9% vs 15.7% for Gemini-1.5). Methodology unchecked, treat as marketing — [Opus ClipAnything page](https://opus.pro/clipanything)
- Descript: the transcript is the editing surface (delete words, video follows). Underlord is a chat-based agentic co-editor where the user picks the backing LLM (help center lists GPT and Gemini models); automated workflows can import, transcribe, remove filler words, apply Studio Sound. Descript publishes no internal agent architecture — [Descript help](https://help.descript.com/hc/en-us/articles/36803785502221-Underlord-beta-Your-AI-co-editor-in-Descript)
- MoneyPrinterTurbo (MIT) is a documented end-to-end open example of the "text-to-short" pipeline: LLM script, materials (local, stock from Pexels/Pixabay/Coverr, or AI-generated clips), TTS (Edge TTS default), subtitles (edge TTS timestamps by default, or local faster-whisper for accuracy), 9:16/16:9/1:1 output, background music — [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo)

**Open components by stage (licence, where it runs)**
| Stage | Component | Licence (source) | Runs where |
|---|---|---|---|
| Shot/scene detection | PySceneDetect (Content, Adaptive, Threshold detectors) | BSD-3-Clause — [repo](https://github.com/Breakthrough/PySceneDetect) | Python/OpenCV, desktop. Not needed for Introcut (we know the cuts: one file = one scene). A frame-difference detector is trivial in Canvas if needed (inference). |
| Speech detection | silero-VAD: JIT model about 2 MB, under 1 ms per 30 ms chunk on one CPU thread (project claim); ONNX supported; community browser build exists, not official. README says "MIT" but the licence badge alt text says "CC BY-NC 4.0": a conflict, so read the LICENSE file before bundling — [repo](https://github.com/snakers4/silero-vad) | MIT (per README; verify) | Browser via onnxruntime-web is feasible (inference) |
| Silence/motion cutting | auto-editor: cuts by audio loudness threshold and by motion threshold, exports to Premiere/Resolve/FCP/Kdenlive. Public domain — [repo](https://github.com/WyattBlue/auto-editor) | Unlicense (repo; binaries and app assets may differ) | Desktop CLI. The *algorithms* (RMS loudness, frame-difference motion) are simple enough to reimplement in the browser (inference). |
| ASR / word timestamps | Whisper (MIT) via transformers.js; VideoLingo (Apache-2.0) defaults to Qwen3-ASR + Qwen3-ForcedAligner, WhisperX optional — [VideoLingo](https://github.com/Huanshere/VideoLingo). Whisper licence MIT and transformers.js Apache-2.0 are general knowledge, not re-verified this session. | MIT / Apache-2.0 | Browser (WASM/WebGPU) for tiny/base class; desktop for larger. Introcut already writes the script, so it knows the words and only needs forced alignment of its own TTS audio (inference). |
| Noise suppression | RNNoise: small RNN library, expects raw 16-bit mono 48 kHz PCM — [repo](https://github.com/xiph/rnnoise) | BSD-3-Clause | Tiny; WASM builds exist (general knowledge, verify). DeepFilterNet: search results consistently say dual MIT/Apache-2.0 but I did not see the upstream LICENSE file — [HF card](https://huggingface.co/vokra/deepfilternet3); verify. |
| Frame interpolation | RIFE / Practical-RIFE: MIT claimed; one mirror warns that v4.26 weights should be checked before redistribution beyond research use. Original paper reports 30+ FPS for 2x 720p on a 2080Ti — [Practical-RIFE](https://github.com/hzwer/Pratical-RIFE), [HF mirror](https://huggingface.co/daydreamlive/RIFE/blob/main/README.md) | MIT (verify per weight version) | Desktop GPU. I found no verified browser RIFE benchmark. |
| Upscaling | Real-ESRGAN: BSD-3-Clause; ONNX exports exist for CUDA/TensorRT/DirectML/CPU; I found no official WebGPU build or browser video pipeline — [HF ONNX card](https://huggingface.co/FuryTMP/RealESR_Gx4_fp16) | BSD-3-Clause | Desktop GPU; browser is image-only/experimental |
| Quality metrics | VBench: 16 dimensions (subject consistency, background consistency, temporal flickering, motion smoothness, dynamic degree, aesthetic quality, imaging quality ...); custom-video mode supports only 6 (subject, background consistency, motion smoothness, dynamic degree, aesthetic, imaging); uses AMT, RAFT, CLIP, LAION aesthetic predictor, IQA-PyTorch; some dimensions need Detectron2 on CUDA — [VBench repo](https://github.com/Vchitect/VBench) | Apache-2.0 (repo; component model licences differ) | Python/GPU. Do not port it; borrow the idea (see section 3). |
| Encode/mux | FFmpeg: LGPL-2.1+ unless built with `--enable-gpl` or `--enable-nonfree`; libx264 is GPL; LGPL obligations include dynamic linking, shipping matching source, credit in about box — [FFmpeg legal](https://ffmpeg.org/legal.html) | LGPL-2.1+ / GPL | Desktop. In the browser Introcut uses WebCodecs + Mediabunny (MPL-2.0) instead, which avoids this. |
| Background removal / segmentation | rembg (MIT), MediaPipe (Apache-2.0), OpenCV (Apache-2.0): licences from general knowledge, not re-verified. | — | MediaPipe selfie segmentation runs in browser (general knowledge, verify) |
| Open composition tools | OpenCut: MIT, currently being rewritten in Rust ("opencut-classic" recommended for now); planned editor API, MCP server and headless mode — [OpenCut](https://github.com/OpenCut-app/OpenCut) | MIT | Reference only. |

### Inferences
- Commercial editors almost certainly share one shape (inference, no single public document confirms it): ingest, transcribe, sample frames, describe or embed them with a VLM, ask an LLM for a ranked EDL (cuts, order, captions, B-roll), then render with a deterministic engine. Introcut's "script, shot list, project JSON, renderFrame" architecture already matches this and the LLM never touches pixels.
- Because Introcut writes the script, whole stages that long-form clippers need (finding highlights in a 60-minute podcast, diarisation, virality scoring) are unnecessary here. Each AI clip is a known scene with a known intended prompt, which makes the analysis problem much easier.

### Gaps
- No public engineering blogs, patents or papers found describing the internals of Captions, Submagic, VEED, HeyGen, Pictory, InVideo, CapCut or Runway's editor pipelines. I did not search these individually beyond Opus and Descript; their stage breakdowns above are inference.
- Browser benchmarks (size, ms/frame) for silero-VAD ONNX, RNNoise WASM, and small CLIP/SigLIP models were not obtained. Do not quote speeds for them; measure on the M0 test machine.

---

## 2. The merge-and-curate problem: typical defects, what code can detect, what fixes are feasible

### Takeaway
Cross-clip *technical* mismatches (resolution, fps, aspect, loudness, average colour/exposure, frozen frames, duplicated frames, near-black frames) are detectable and fixable with cheap deterministic code in a browser. *Semantic* defects (warped hands/faces, garbled text, character drift, wrong action) are not reliably detectable by any open permissive tool as of 2026, and the research literature says even strong multimodal LLMs are near chance at it. Introcut should detect-and-flag the first group, and show frames to the human for the second.

### Cited Findings
- Artifact-Bench (arXiv, May 2026): multimodal LLMs tested on detecting AI-video artifacts approach random or below-random performance in challenging settings and misalign with human preferences, so they are unreliable automatic evaluators — [Artifact-Bench](https://arxiv.org/pdf/2605.18984)
- Another 2025 dataset paper states that lack of data and metrics for spatial (distorted geometry, inconsistent appearance) and temporal (physically implausible motion) artifacts is a fundamental obstacle and that human assessment remains the gold standard — [arXiv 2509.08818](https://arxiv.org/pdf/2509.08818)
- Dedicated artifact-recognition research (DVAR, Skyra) targets flickering textures, temporal discontinuities, non-physical dynamics and unstable camera motion, but these are research models, not drop-in permissive browser tools; I did not verify licences or sizes — [DVAR](https://arxiv.org/html/2601.20297v1), [Skyra](https://cvpr.thecvf.com/virtual/2026/poster/39260)
- Veo 3.1 output is 720p or 1080p at a fixed 24 fps in 16:9 or 9:16 (secondary tutorial) — [DataCamp](https://www.datacamp.com/tutorial/veo-3-1-complete-guide-with-examples)
- Google Flow: all outputs made with Veo, Omni or Nano Banana include invisible SynthID watermarks (quoted by a third party from Google's support page; not confirmed on the live page) — [Atlas Cloud summary](https://www.atlascloud.ai/es/blog/tips/veo-watermark-remover)
- Free-tier visible watermark: Google's 2025 Flow FAQ said Google One Pro videos carry a visible Veo watermark and Ultra videos do not — [BGR](https://bgr.com/tech/those-amazing-veo-3-videos-will-finally-tell-you-they-were-made-with-ai/). A third party says a "Visible watermarking" toggle under the profile menu has since replaced the tier rule; I could not confirm it on Google's page, so treat as **verify**.
- Kling: free generations carry a watermark; paid tiers remove it (Standard from about $5.99/month on annual billing per one source). Free credit rules conflict between sources (66 per day vs per month): **verify in the Kling dashboard** — [AI Tool Curator](https://www.aitoolcurator.com/learn/kling-guide/free-plan-limits/), [Atlas Cloud](https://www.atlascloud.ai/blog/guides/kling-ai-free)

**Defect by defect (detectability and fix). Items without a link are general knowledge or inference, not re-verified.**
| Defect | Detect by code? | Fix | V1 browser? |
|---|---|---|---|
| Different resolution / fps / aspect | Yes, read from container metadata | Scale-to-fill or letterbox into 1080x1920; output at one fps (e.g. 30) by frame-time sampling in renderFrame (already the engine's job) | Yes |
| Colour / exposure drift between clips | Partly: mean and std of Lab or luma per clip (cheap) | Reinhard-style colour transfer (match per-channel mean and std in Lab to a reference clip, Reinhard et al. 2001), or simple gain/gamma on luma; conservative strength | Yes in a WebGL/Canvas shader; exports from the same renderFrame |
| Speed / motion mismatch | Yes: mean optical-flow magnitude or frame-difference energy per clip | Per-clip speed factor 0.8-1.25x; larger changes look wrong without interpolation | Yes (retime); interpolation is desktop |
| Frozen or duplicated frames, black frames, hard glitches | Yes: consecutive-frame difference near zero, or spikes | Trim head/tail; cut around the glitch; flag to user | Yes |
| Temporal flicker | Partly: high-frequency luminance variation on static regions (VBench "temporal flickering" idea; VBench's own code requires filtering static videos first) | Rank down; deflicker is non-trivial | Detect yes; fix no |
| Warped hands/faces, extra fingers, garbled text/logos | No reliable open method (see Artifact-Bench above). Face detection can find *a* face, not a correct one | Human decision; re-generate | No auto-detect |
| Character drift between clips | Weak proxy: face-embedding or CLIP image similarity between clip frames. Unvalidated for this use (inference) | Chaining techniques in section 6 reduce it upstream; show similarity as a hint only | Hint only |
| Burned-in subtitles / text in frame | Possible with OCR (not verified in browser) | Do not crop to hide; ask user to re-generate with "no text" prompt | Optional |
| Visible tool watermark | Can detect a static corner logo by temporal variance (inference); detection is for *warning only* | See compliance below | Warning only |
| Generated audio mismatch between clips | Yes: loudness, noise floor, spectral tilt | Section 5 | Yes |
| Hard cut between dissimilar clips feels jarring | Yes (colour/motion distance between last and first frames) | 4-8 frame crossfade, dip-to-colour, match-cut ordering, J/L audio overlap | Yes |

**Watermark compliance (Introcut must not remove or hide watermarks)**
- Compliant options (inference, based on the source facts above): (1) detect a likely visible watermark and tell the user plainly which tool/tier produces it and that a watermark-free tier or setting may exist if the tool's own terms permit; (2) never use crop, blur, overlay, zoom or inpainting aimed at the mark; (3) choose 9:16 framing by the content's subject, not by where the logo is, and if the mark sits in a region that scale-to-fill would crop, pick the framing that keeps it fully visible (or keep the mark visible) and note it; (4) never strip SynthID or C2PA metadata, and keep the export "AI-generated" reminder; (5) if the user chooses to publish with the mark visible, that is their decision.
- A claimed "no tier hides the mark" statement is wrong: tier rules exist and are changing (see conflict above), so Introcut should phrase it as "verify in the tool's current help page".

### Inferences
- The high-value, low-risk V1 set is *normalisation* (resolution, fps, loudness, colour/exposure, speed) plus *ordering and transitions*. It is invisible when it works and fixes the most common "this looks like four unrelated clips" problem.
- Colour matching should be bounded (for example, move 50-70 percent toward the reference) and previewable with a toggle, because Reinhard-type global transfers can distort skin tones and stylised looks (general knowledge, verify visually on real clips).
- Honesty line for the UI: "Introcut can make clips match technically. It cannot tell whether a hand looks wrong."

### Gaps
- No quantified rates for how often free-tier 6-8 s clips exhibit each defect: no reliable public study found.
- No verified open permissive browser detector for hand/face/text artifacts.
- Current (October 2026) exact free-tier output specs (resolution, fps, audio on/off, watermark) for Flow, Kling, Wan hosted UIs were only partly confirmed; the earlier prompt/free-tier research covers them.

---

## 3. Auto-curation among 2-3 takes per scene

### Takeaway
Rank cheaply with several weak signals, display the numbers and reasons, and let the user pick. Evidence says CLIP-style text-to-frame similarity is a weak proxy for human preference on generated video and cannot see temporal quality. Motion amount, flicker, frozen frames and exposure stability are cheap and meaningful for *filtering out bad takes*, but not for choosing the best of two good takes.

### Cited Findings
- FETV: CLIPScore and BLIPScore correlate positively with human ratings but much more weakly than humans agree with each other; authors conclude they cannot be relied on to rank open text-to-video models; a video-trained UMTScore correlated better — [arXiv 2311.01813](https://arxiv.org/pdf/2311.01813)
- TC-Bench: averaged text-frame CLIP similarity is unreliable for temporal content; CLIP is trained on static image-text pairs — [arXiv 2406.08656](https://arxiv.org/pdf/2406.08656)
- SLVMEval: CLIPScore scores each frame independently, so it performs near chance on dynamics and temporal flow, though it does well on object presence and integrity — [arXiv 2603.29186](https://arxiv.org/pdf/2603.29186)
- VideoScore reports 77.1 Spearman correlation with humans on its own test set, well above prior metrics (own paper's data, may not transfer; model licence not checked) — [arXiv 2406.15252](https://arxiv.org/pdf/2406.15252)
- VBench dimension definitions as used in practice: motion smoothness via frame-interpolation model discrepancy; dynamic degree via RAFT optical flow; aesthetic via LAION aesthetic predictor; imaging quality via MUSIQ; background consistency via CLIP features. One paper argues dynamic degree measures motion volume, not perceptual quality. Example numbers (Wan2.1-1.3B baseline: subject consistency 95.6%, motion smoothness 96.4%, dynamic degree 83.2%, aesthetic 56.8%, imaging 61.0%) show that consistency and smoothness scores sit in a narrow high band and barely discriminate between decent clips — [FlowMo table](https://arxiv.org/pdf/2506.01144), summary via [Emergent Mind VBench](https://www.emergentmind.com/topics/vbench)
- VBench custom-video mode covers only 6 dimensions (subject consistency, background consistency, motion smoothness, dynamic degree, aesthetic, imaging) — [VBench repo](https://github.com/Vchitect/VBench)

### Inferences
- **Browser-feasible signals, ordered by expected usefulness (inference, none validated on Introcut data):**
  1. Hard-fail filters: frozen/duplicate frames, black frames, sudden luminance jumps, fewer frames than expected, wrong aspect ratio. Reliable because they are measured, not judged.
  2. Motion amount (frame-difference or lightweight optical flow): flags "nearly static" takes and chaotic takes. Use as a band, not "higher is better".
  3. Temporal stability: frame-to-frame embedding or histogram jumps and high-frequency luminance flicker.
  4. SigLIP/CLIP similarity between the *prompt* and a few sampled frames, and between the frames and the scene's reference image if one exists. Treat as a tie-breaker only given FETV/TC-Bench/SLVMEval. Models run via transformers.js; licence of the chosen checkpoint must be checked at integration time (general knowledge: CLIP weights MIT, SigLIP Apache-2.0, verify).
  5. Aesthetic predictor (LAION): small MLP on CLIP embeddings, cheap once embeddings exist. Weak signal.
  6. Face present/size/stability using MediaPipe face detection (Apache-2.0, verify): can flag "face vanished/jumped"; it cannot judge a face as correct.
- **Product design:** show each take as a card with: thumbnail strip, 3-5 plain-language flags ("frozen last 14 frames", "low motion", "brightness jumps at 2.1 s"), a "suggested" badge only when the margin is large, and a "you pick" default. Never display a single opaque score. A user override becomes a lock (per CLAUDE.md "human edits are sacred").
- Do not use a VLM judge for artifact verdicts (consistent with the user's earlier "unreliable VLM judges" research and with Artifact-Bench).

### Gaps
- No evidence found for how well any combination of these cheap signals picks the take a human prefers on 6-8 s consumer-tool clips. Introcut should log user picks vs suggestions (locally) in V1 to measure this.
- Browser latency for SigLIP/CLIP on 8-16 frames per take not benchmarked here.

---

## 4. Audio assembly (generated audio, voice-over, music, SFX)

### Takeaway
Treat each clip's own audio as optional: default to dropping it for the final mix unless the user marks it as wanted (for example generated ambience or a spoken line), because clips' loudness, room tone and voices will not match across scenes. Loudness-normalise whatever is kept, duck it under the voice-over, and add one continuous music bed to glue the scenes.

### Cited Findings
- Flow "voice references" keep a character's voice consistent across clips, but work only with ingredient-based generations — [Google Flow help](https://support.google.com/flow/answer/16353334)
- RNNoise is BSD-3-Clause, 48 kHz mono 16-bit PCM — [repo](https://github.com/xiph/rnnoise); silero-VAD is about 2 MB and fast (licence ambiguity noted above) — [repo](https://github.com/snakers4/silero-vad); DeepFilterNet reported as MIT/Apache-2.0 (verify) — [HF card](https://huggingface.co/vokra/deepfilternet3)
- auto-editor's default audio edit method is loudness threshold based (for example `audio:-19dB`) — [repo](https://github.com/WyattBlue/auto-editor)

### Inferences (general knowledge, not re-verified; the numbers are common conventions, check before specifying)
- Extract: Mediabunny/WebCodecs decodes each clip's audio track to PCM; resample to 48 kHz.
- Loudness: compute integrated loudness (ITU-R BS.1770 / EBU R128 K-weighting, in LUFS: a perceptual loudness unit, "how loud it sounds", not peak level) per clip and gain-match. Short-form platforms commonly target around -14 LUFS; confirm each platform's current guidance (**verify**).
- Ducking: lower music/ambience by roughly 8-14 dB while the voice-over is active, with 100-300 ms attack and 300-600 ms release. The voice-over timings are known exactly because Introcut generates the TTS and knows the word times, so no VAD is needed for the duck envelope; silero-VAD would matter only if the user's own recorded voice or a generated clip's speech must be detected.
- Cleaning: RNNoise on kept generated speech is cheap; do not run it on music. Expect artefacts on non-speech ambience.
- Join: J-cut (next scene's audio starts before its picture) and L-cut (previous audio continues over the next picture) are just per-track offsets of 150-500 ms in the project JSON; they hide mismatched cuts better than any picture effect.
- Mixed lip-sync reality: if a clip contains a talking person with generated speech and the user also wants a voice-over, the lips will not match the voice-over. The honest options are keep the clip's own audio for that scene, or use the shot only where the mouth is not visible.

### Gaps
- No verified per-tool statement of which free tiers output audio in 2026 beyond the Flow voice-reference page; the earlier free-tier research should be the source.
- No verified WASM build and size for RNNoise or DeepFilterNet; DeepFilterNet licence file not read.

---

## 5. Open-source projects that already do pieces of this

### Takeaway
No open project does "merge and curate user-supplied AI clips with QA flags" end to end. The nearest are MoneyPrinterTurbo (MIT; text-to-short with stock or AI clips), VideoLingo (Apache-2.0; ASR/translation/dubbing, not editing), auto-editor (Unlicense; dead-space trimming) and OpenCut (MIT; editor, mid-rewrite). All are desktop/Python servers, not browser-first.

### Cited Findings
- MoneyPrinterTurbo: MIT; pipeline script, materials, TTS, subtitles, music, 3 aspect ratios; offers AI video generation providers as a material source; composition relies on FFmpeg (library not explicitly named) — [repo](https://github.com/harry0703/MoneyPrinterTurbo)
- VideoLingo: Apache-2.0; yt-dlp, ASR with word alignment, subtitle segmentation, terminology, translation, dubbing; Qwen3-ASR + ForcedAligner default; no editing of generated clips — [repo](https://github.com/Huanshere/VideoLingo)
- auto-editor: Unlicense; cut by audio loudness or motion; exports timelines to other editors — [repo](https://github.com/WyattBlue/auto-editor)
- OpenCut: MIT; rewriting in Rust for desktop/mobile/browser; not accepting outside contributions during the rewrite — [repo](https://github.com/OpenCut-app/OpenCut)
- The ShortGPT repo URL I tried (RimoChan/ShortGPT) returned 404; the licence of the real ShortGPT project (RayVentura) is not verified here.
- Revideo, LosslessCut, Kdenlive scripts, ComfyUI video workflows, "AI clip editors" on GitHub in 2025-26: not researched in this pass.

### Inferences
- What to copy: MoneyPrinterTurbo's dual subtitle timing mode (TTS timestamps by default, forced alignment only when needed) fits Introcut, since Introcut owns the TTS. auto-editor's audio/motion thresholds are the right level of sophistication for "trim dead frames at head and tail".
- What to avoid: server-side Python dependency stacks (breaks the browser-only rule), stock-footage API calls (outside calls forbidden except opt-in), and any project whose licence is non-permissive or unclear (check each LICENSE file before reading the code for inspiration at all).
- Introcut's differentiator is the thing nobody ships: normalise, flag and rank *user-supplied* generated clips against a script-derived shot list.

### Gaps
- Licence and quality of Revideo, LosslessCut (GPL-2.0 per my general knowledge, verify), ShortGPT, and ComfyUI workflow packs not checked.

---

## 6. Continuity techniques and per-tool support (what Introcut's prompts should use)

### Takeaway
The most portable continuity tricks in 2026 are: (1) a single "anchor" still (character/location reference) used as the first frame or reference for every scene; (2) first-frame chaining, where the last frame of clip N is exported as a still and used as the start frame of clip N+1; (3) start+end-frame generation where the tool supports it; (4) fixed style/palette/lighting language repeated verbatim in every prompt. Support for these varies by tool and tier and changes often, so Introcut should present them as "if your tool has it" options with a verify note.

### Cited Findings
- Google Flow, Frames to Video: set a start frame, an end frame, or both, then describe the action between them; availability may vary by country; Ingredients let you reference images or videos by typing `@`; best results with subject references on a plain background; voice references for consistent voice (only with ingredient-based generations) — [Flow help](https://support.google.com/flow/answer/16353334)
- Flow Extend (secondary tutorial): continues from a clip's final frames; works only on clips generated in Veo 3.1 inside Flow, not on uploaded footage; one reviewer found start/end-frame clips begin and end on the given frames but do not always transition naturally — [DataCamp Veo 3.1 guide](https://www.datacamp.com/tutorial/veo-3-1-complete-guide-with-examples). I could not verify Extend on Google's own help pages (the relevant article was not reachable); **verify**.
- Kling: official quickstart describes "Start and End Frames" (two images as opening and closing frame; "Add End Frame" in Image to Video); it advises that the first and last frames be as similar as possible because big differences may cause a lens switch, for smoother transitions within 5 seconds — [Kling quickstart](https://kling.ai/quickstart/ai-video-start-end-frames). Whether this is available on the *free* plan was not confirmed.
- Wan 2.2 open weights: Apache-2.0 for the I2V-A14B model, 480P/720P, single-GPU command needs at least 80 GB VRAM; model card does not mention first-last-frame — [Hugging Face](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B). A separate FLF2V variant is described by marketplaces as Apache-2.0 (unverified third-party claim) — [Atlas Cloud](https://www.atlascloud.ai/ru/models/alibaba/wan-flf2v). Implication: local Wan is not a V1 or typical-user path.
- Higgsfield (vendor claims only): Popcorn storyboard tool generates sequences of up to 8 frames with up to 4 reference images, aiming to persist identity, lighting and atmosphere; a "Reference Anchor" workflow locks face, wardrobe and lighting from the first storyboard frame into video — [Higgsfield help](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-popcorn), [Higgsfield blog](https://higgsfield.ai/blog/best-ai-storyboard-generator)
- Runway/Luma (one vendor comparison blog, unverified): Runway Gen-4 uses a single reference image for multi-shot consistency; Luma Ray3.2 supports up to 16 keyframes per clip — [Atlas Cloud comparison](https://www.atlascloud.ai/blog/guides/kling-ai-vs-runway-vs-luma). Treat as unconfirmed.

### Inferences
- Storyboard-first is the aggregator pattern: generate stills for every shot first (one image model, same references), approve them, then animate each still. Introcut can mirror it without generating anything: the prompt pack gives (a) an "anchor image" prompt, (b) 4-5 still prompts, (c) per-scene motion prompts that begin "Starting from this image,...".
- Last-frame chaining can be partly automated *inside the browser*: when the user drops clip N back in, Introcut extracts its last frame (WebCodecs/Canvas), shows it, and offers it for download so the user can upload it as the start frame of clip N+1 in their tool. This stays compliant (no web UI automation), costs nothing, and directly improves continuity. Caveat: error accumulates across chained clips (quality and colour drift), so chain at most 2-3 clips and re-anchor to the original reference image (inference).
- Prompt rules that follow from the evidence: keep the first and last frames similar (Kling's own advice); describe motion only, since the frame carries the look; repeat an identical "style block" (palette, lens, lighting, time of day) in every scene; avoid scene changes inside one clip; ask for "no text, no logos, no subtitles" in the frame.
- Per-tool table for the app (all **verify** at publish time): Flow = start/end frame yes, ingredients yes, extend only on Flow-made clips; Kling = start/end frame yes (free-tier access unconfirmed); Wan hosted UIs = varies; others not verified in this pass.

### Gaps
- Official docs for Runway, Luma, Seedance, Pollo, Krea, Freepik, OpenArt chaining features were not retrieved; Freepik/Krea/OpenArt/Pollo returned no usable results.
- Which of these features exist on free tiers in October 2026 is largely unverified.

---

## 7. V1 verdict: smallest "merge and curate" feature set, desktop upgrades, and what will not work

### Takeaway
V1 should do deterministic normalisation, sensible ordering and transitions, a take-picker with explained flags, and a unified audio mix with the Introcut voice-over, captions and music. It should not promise to repair bad generations. Desktop (FFmpeg + GPU) adds interpolation, upscaling and heavier models.

### Cited Findings
- (Supporting facts from above) Introcut's own stack uses WebCodecs/Mediabunny, which avoids FFmpeg LGPL/GPL packaging duties that a desktop FFmpeg bundle would carry — [FFmpeg legal](https://ffmpeg.org/legal.html)
- Free-tier clips are watermarked on at least some tools (Kling free) and may carry visible marks elsewhere; invisible SynthID is on all Flow outputs — sources in section 2.
- Heavy models are not browser-friendly: Wan 2.2 A14B needs at least 80 GB VRAM — [HF](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B); RIFE benchmark is on a 2080Ti desktop GPU — [Practical-RIFE](https://github.com/hzwer/Pratical-RIFE).

### Inferences
**V1 browser feature set (smallest set with visible value; all inference, ordered by value per effort)**
1. Import and probe: per clip resolution, fps, duration, audio presence, aspect; warn on mismatches.
2. Auto trim: drop frozen/black head and tail frames; pick in/out so each scene fits its beat length from the shot list (6-8 s source cut to about 5-7 s).
3. Normalise to 1080x1920, 30 fps; scale-to-fill with subject-safe framing and no cropping aimed at any logo.
4. Colour/exposure match to a chosen reference clip with a strength slider and a before/after toggle.
5. Take picker with hard-fail filters, motion/flicker/stability flags, optional SigLIP prompt similarity; user decides.
6. Transitions: hard cut by default, short crossfade or dip when the colour/motion distance between last and first frames is high; J/L audio overlap.
7. Audio: drop or keep generated audio per clip, LUFS gain match, RNNoise optional, TTS voice-over, music bed with ducking.
8. Captions from the script with known word timing (already built).
9. Continuity helper: extract last frame of each clip for the user to use as the next clip's start frame.
10. Honest report screen: "what we fixed", "what we flagged", "what only you can judge".

**Desktop (Windows, FFmpeg LGPL build, local GPU) would unlock**
- Frame interpolation (RIFE) for 24-to-30 fps and slow-motion/speed ramps; upscaling (Real-ESRGAN) for 720p sources; stronger denoise and deflicker; faster encode with hardware encoders; larger ASR/aligner; heavier VLM-based tagging (still unreliable for artifacts); optional local video generation (Wan class) for users with 24-80 GB VRAM (inference from the 80 GB figure; smaller variants exist, not researched). Watch FFmpeg licence duties and avoid libx264 in a bundled build, or ship as GPL deliberately.

**What will NOT work (state plainly in the product)**
- Automatically fixing warped hands/faces, garbled text, wrong physics, or changed characters: no open reliable detector and no fixer; the user must re-generate or choose another take.
- Making different generator "looks" truly consistent: global colour matching reduces drift but does not change identity, lighting direction or texture style.
- Removing, hiding or cropping around watermarks, or stripping SynthID/provenance: explicitly out of scope.
- Re-synchronising lips with a different voice-over: not in V1.
- Guaranteeing that chained start-frame continuity works on free tiers: feature availability unverified and changes.
- Any claim of predicting which take is "best" or "viral".

### Gaps
- No user-facing evidence yet that colour matching plus crossfades makes mixed-tool clips look "polished"; needs a small internal test set (suggested: 10 sets of 4 free-tier clips, measure with a human A/B).
- Performance of the above analyses in-browser (ms per second of footage) is unmeasured; the existing 70 fps export figure covers flat scenes only.
- Windows desktop packaging decisions (Tauri/Electron, FFmpeg build flags) not researched in this pass.
