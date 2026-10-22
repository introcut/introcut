# Avatar / talking-head from ONE photo + audio: models, delivery routes and V1 feasibility (as of 2026-10-22)

Method note: licence facts were read from GitHub READMEs / Hugging Face cards fetched on 2026-10-22 (primary where possible). Several READMEs do NOT state a weights licence; those are marked "weights licence not stated (verify)". Speed/VRAM numbers are quoted only where a source gave them; derived arithmetic is labelled "(my arithmetic)". Search-engine summaries and blog posts are flagged as secondary.

Critical framing fact: the two best-known fast lip-sync models (MuseTalk, LatentSync) are VIDEO-to-video lip-sync (they repaint the mouth of an existing talking video). They are not photo-to-video models. Introcut's "one photo" brief needs a photo + audio model (Hallo, EchoMimic, SadTalker, Sonic, InfiniteTalk, Ditto...) or a trick (feed a still / looped clip into MuseTalk).

---

## 1. Candidate models: licences, hardware, speed, quality, language, browser/CPU

### Takeaway
No photo+audio neural model is both permissively licensed end to end AND runnable at useful speed on an 8 GB / entry-GPU laptop. Light-weight ones (SadTalker, Ditto, MuseTalk) have licence or input caveats; the permissive modern ones (InfiniteTalk, MultiTalk, EchoMimicV3, LongCat, Wan-S2V, SoulX-FlashHead) are video-diffusion models that need 12 GB to 80 GB+ VRAM and minutes per clip. Nothing found runs in a browser from a single photo.

### Cited Findings

**Video-to-video lip-sync (needs a talking video as input, not a still photo)**
- MuseTalk (v1.5, released 2025-03-28): code "released under the MIT License"; trained models "are available for any purpose, even commercially"; but other components "must comply with their license, such as whisper, ft-mse-vae, dwpose, S3FD, etc."; test data is non-commercial only. Weights per component: musetalk v1.5 unet, syncnet (from LatentSync), dwpose, face-parse-bisent, sd-vae, whisper. Face region is 256x256; "some details of the original face are not well preserved, such as mustache, lip shape and color"; jitter because single-frame generation; 25 fps video recommended. — [MuseTalk README](https://github.com/TMElyralab/MuseTalk)
- MuseTalk speed: "30fps+ on an NVIDIA Tesla V100"; minimum tested hardware RTX 3050 Ti Laptop 4 GB in fp16: "an 8-second video took about 5 minutes" (README). — [MuseTalk README](https://github.com/TMElyralab/MuseTalk). (My arithmetic: about 37 s compute per second of video, so a 30 s clip is roughly 19 min on that laptop GPU. Note: README does not say whether this includes first-time avatar preparation.)
- MuseTalk install is heavy and Linux-oriented: Python 3.10, PyTorch 2.0.1/cu118, mmcv 2.0.1, mmdet 3.1.0, mmpose 1.1.0 (MMLab), ffmpeg. — [MuseTalk README](https://github.com/TMElyralab/MuseTalk)
- MuseTalk keeps head motion/background from the source video; a still image gives no head motion to preserve (secondary write-up; I found no GitHub issue specifically on still-image input). — [sync.so explainer via search](https://sync.so/blog/what-is-musetalk)
- MuseTalk languages: README says audio in "various languages, such as Chinese, English, and Japanese" (search summary of README); audio encoder is frozen Whisper-tiny (multilingual). I found NO benchmark or test for Hindi/Nepali. — [MuseTalk README](https://github.com/TMElyralab/MuseTalk) (language wording from search summary; verify)
- LatentSync: code Apache-2.0, "no carve-outs" (secondary), weights licence not stated on README (verify); 1.5 (2025-03-14) needs 8 GB min inference VRAM, 1.6 (2025-06-11, trained at 512x512) needs 18 GB; data pipeline uses InsightFace landmarks for face alignment (inference detector not named). No speed figures in README; more inference steps (20-50) slower. — [LatentSync README](https://github.com/bytedance/LatentSync), [Creative AI News licence roundup, 2026-09-16 (secondary)](https://www.creativeainews.com/articles/open-source-lip-sync-licenses-commercial-use-2026/)
- Wav2Lip: repo has no licence file (GitHub API license null); README: "as the models are trained on the LRS2 dataset, any form of commercial use is strictly prohibited"; research/academic/personal only. Wav2Lip-HD: NOT verified (not fetched; it inherits Wav2Lip weights, so treat as non-commercial; verify). — [Creative AI News (secondary, quotes README)](https://www.creativeainews.com/articles/open-source-lip-sync-licenses-commercial-use-2026/)

**Photo + audio models (genuine "one photo" input)**
- SadTalker: README says licence "has been updated to Apache 2.0, and we've removed the non-commercial restriction"; weights licence not stated; third-party parts include Deep3DFaceReconstruction/BFM, Wav2Lip checkpoint, PIRender/face-vid2vid reproduction, facexlib, GFPGAN, Real-ESRGAN, dlib landmark predictor, face-alignment; last push 2024-06-26 (unmaintained); no speed/VRAM/CPU statements; Python 3.8, cu113 install; 512x512 model is "beta". — [SadTalker README](https://github.com/OpenTalker/SadTalker), [Creative AI News (secondary)](https://www.creativeainews.com/articles/open-source-lip-sync-licenses-commercial-use-2026/). Wav2Lip checkpoint inside SadTalker's stack inherits the LRS2 non-commercial statement (inference, verify).
- Ditto-talkinghead (Ant Group, ACM MM 2025): code and HF repo "released under the Apache-2.0 license"; single image + audio in, MP4 out; TensorRT engines are Ampere+ only, ONNX models provided for conversion, PyTorch version added 2025-07-11; tested on A100; no FPS numbers on README. CAUTION: its checkpoints ship `det_10g.onnx` and `2d106det.onnx` (these are InsightFace detector/landmark model filenames; my inference) alongside MediaPipe `face_landmarker.task`. — [Ditto GitHub](https://github.com/antgroup/ditto-talkinghead), [Ditto HF card](https://huggingface.co/digital-avatar/ditto-talkinghead). I found no consumer-GPU (3060/4060) speed reports.
- Hallo (v1): code MIT; weights licence not stated; depends on InsightFace models, MediaPipe face landmarker, SD 1.5, AnimateDiff, Kim_Vocal_2; tested A100 only; "Driving audio must be WAV and in English, since our training datasets are only in this language"; Windows untested. — [Hallo README](https://github.com/fudan-generative-vision/hallo)
- Hallo3: code MIT; weights "must comply with the license terms of CogVideo-5B"; tested H100; needs insightface + MediaPipe + T5-XXL. — [Hallo3 README](https://github.com/fudan-generative-vision/hallo3). Hallo2: not fetched; licence unverified.
- Hallo-Live (2026): MIT code; text-driven joint audio+video; 20.38 FPS on two H200s; not an image+audio tool. — [Hallo-Live](https://github.com/fudan-generative-vision/Hallo-Live)
- EchoMimic (V1/V2): Apache-2.0 code; weights licence not stated; accelerated version "~7mins/120frames to ~50s/120frames on A100"; tested A100 80G / RTX4090D 24G / V100 16G. — [EchoMimicV2 README](https://github.com/antgroup/echomimic_v2)
- EchoMimicV3 (Wan2.1-Fun 1.3B base): Apache-2.0 for repo and weights; Flash variant (Jan 2026) "12G VRAM Requirement", up to 768x768, 8-step; ComfyUI 16 GB; base model licence not stated on page; no timing data. — [EchoMimicV3 README](https://github.com/antgroup/echomimic_v3)
- AniPortrait: code Apache-2.0; weights licence not stated; SD1.5 / wav2vec2-base-960h based; no VRAM or speed data. — [AniPortrait README](https://github.com/Zejun-Yang/AniPortrait)
- Sonic (Tencent): code CC BY-NC-SA 4.0, "our license is non-commercial"; tested on 32 GB GPU; uses SVD-xt, yoloface. NOT permissive. — [Sonic README](https://github.com/jixiaozhong/Sonic)
- V-Express (Tencent): code "released for both academic and commercial usage" but "checkpoints are also for research purposes only"; needs InsightFace buffalo_l; 31 s audio took 2617 s on a V100 with peak 7956 MiB (about 84 s compute per second of video, my arithmetic). NOT permissive for weights. — [V-Express README](https://github.com/tencent-ailab/V-Express)
- DreamTalk: repo shows MIT, but disclaimer says "RESEARCH/NON-COMMERCIAL USE ONLY"; weights not publicly downloadable (email request, academic research only). NOT usable. — [DreamTalk README](https://github.com/ali-vilab/dreamtalk)
- GeneFace: not fetched; it is per-identity (trains a NeRF per person from a video), so does not fit "one photo" regardless; licence unverified.
- LivePortrait (Kuaishou): MIT licence (copyright Kuaishou). It is a video/image-driven portrait animator, NOT audio-driven (audio-driven talking heads built on it are community projects such as Ditto). Default face detector InsightFace; speed doc: 14.77 ms/frame summed modules on RTX 4090 with torch.compile (no other GPU listed); macOS "maybe 20x slower than RTX 4090" (README). — [LivePortrait LICENSE](https://raw.githubusercontent.com/KwaiVGI/LivePortrait/main/LICENSE), [README](https://github.com/KwaiVGI/LivePortrait), [speed.md](https://github.com/KwaiVGI/LivePortrait/blob/main/assets/docs/speed.md)
- InsightFace weights problem (quoted): "The code of InsightFace is released under the MIT License. There is no limitation for both academic and commercial usage. The training data containing the annotation (and the models trained with these data) are available for non-commercial research purposes only. Both manual-downloading models ... and auto-downloading models with our python-library follow the above license policy." A 2025-11-24 update says licensing contact is required for buffalo_l-style recognition packages, inswapper models and InspireFace. — [InsightFace README](https://github.com/deepinsight/insightface). Community LivePortrait nodes offer MediaPipe as an alternative to InsightFace so the stack becomes MIT/Apache. — [ComfyUI-LivePortraitKJ via search summary](https://github.com/kijai/ComfyUI-LivePortraitKJ)

**Wan-family video-diffusion avatar models (photo + audio, 2025-2026)**
- Wan2.2-S2V-14B (2025-08-26): "The models in this repository are licensed under the Apache 2.0 License"; single-GPU command "can run on a GPU with at least 80GB VRAM"; 480p/720p; inputs audio + reference image (+ optional text, pose video); no statement on audio languages. — [Wan2.2-S2V HF card](https://huggingface.co/Wan-AI/Wan2.2-S2V-14B)
- InfiniteTalk (MeiGen): "The models in this repository are licensed under the Apache 2.0 License"; image+audio-to-video supported, good "up to about 1 minute", colour shift beyond ~1 min; 480p/720p; fp8 quant and `--num_persistent_param_in_dit 0` low-VRAM mode but README gives no minimum VRAM or timings; audio encoder chinese-wav2vec2-base; base Wan2.1-I2V-14B licence not stated on page; needs flash-attn, CUDA 12.1. — [InfiniteTalk README](https://github.com/MeiGen-AI/InfiniteTalk)
- MultiTalk (MeiGen): Apache-2.0; "enabling 480P video generation on a single RTX 4090" (June 2025 news); community Wan2GP claims 8 GB (not official); trained on 81-frame 25 fps clips, up to 15 s claimed; TeaCache about 2-3x; Kokoro-82M TTS + chinese-wav2vec2. — [MultiTalk README](https://github.com/MeiGen-AI/MultiTalk)
- OmniAvatar: Apache-2.0; 14B on A800: 36 GB at 16.0 s/it, 21 GB at 19.4 s/it, 8 GB at 22.1 s/it (offloading everything), "4 GPUs ... 4.8 s/it"; 480p only; wav2vec2-base-960h; steps per clip not given, so seconds-per-video-second cannot be derived. — [OmniAvatar README](https://github.com/Omni-Avatar/OmniAvatar)
- LongCat-Video-Avatar 1.5 (Meituan): weights MIT ("This license does not grant any rights to use Meituan trademarks or patents"); tagged English and Chinese; demo commands use 2 GPUs (`--nproc_per_node=2`); no VRAM number; 480p/720p; INT8 option. — [LongCat HF card](https://huggingface.co/meituan-longcat/LongCat-Video-Avatar), [Creative AI News (secondary)](https://www.creativeainews.com/articles/open-source-lip-sync-licenses-commercial-use-2026/)
- SoulX-FlashHead (2026-02-12): 1.3B; code Apache-2.0; HF card metadata "other": DiT weights Apache-2.0, Wan VAE Apache-2.0, but the Lite variant uses the LTX-Video-0.9 VAE under Open-RAIL-M (use restrictions must be preserved); wav2vec2-base-960h; Lite 96 FPS on one RTX 4090, Pro 10.8 FPS on 4090 (real-time needs two RTX 5090); input described as image + text in Diffusers example, audio input not explicitly documented (verify). — [SoulX-FlashHead GitHub](https://github.com/Soul-AILab/SoulX-FlashHead), [HF card](https://huggingface.co/Soul-AILab/SoulX-FlashHead-1_3B)
- SoulX-FlashTalk: Apache-2.0 repo, 14B, real-time only on 8x H800; single GPU over 64 GB (about 40 GB with cpu_offload). Server-class only. — [SoulX-FlashTalk](https://github.com/Soul-AILab/SoulX-FlashTalk)
- NanoAvatar (2026): the only genuinely on-device system found (Android APK + Windows NVIDIA web demo, 39-41 model FPS on Snapdragon 8 Gen 3, 224-333 FPS on RTX 4090), BUT lip-sync weights are CC BY-NC 4.0 (non-commercial), and input is a short video of the person, not one photo. — [NanoAvatar README](https://github.com/wpydcr/NanoAvatar)
- MOVA (OpenMOSS, Apache-2.0): joint video+speech, 8 s clips, about 48 GB (about 12 GB with offload); self-reported benchmarks. — [Creative AI News summary of MOVA (secondary)](https://news.creeta.com/en/open-source-lip-sync-models-2026/)
- Other 2026 names seen in a curated list but NOT assessed (licence/input unverified): Omni-LiveAvatar, Avatar-Forever, LeapTalk, AptAvatar, TaoMate, AvatarForcing (Kling Research), Lip Forcing, TempoSyncDiff, HighSync, FreeTalkDiff, Live Avatar (Alibaba-Quark), TalkVerse, AnyTalker, SkyReels-V3, DreamID-Omni. — [Awesome-Talking-Head-Synthesis](https://github.com/Kedreamix/Awesome-Talking-Head-Synthesis) (first 100k chars of a 207k-char page read only)
- Not assessed at all: Hunyuan-Avatar / HunyuanVideo-Avatar, Kling-Avatar (proprietary), OmniHuman (proprietary), LTX-2 audio-video. No source fetched.

**Language behaviour**
- Audio encoders used: whisper-tiny (MuseTalk, LatentSync, Sonic), wav2vec2-base-960h (English, 960 h LibriSpeech; Hallo, EchoMimic V2/OmniAvatar/AniPortrait/V-Express/SoulX-FlashHead), chinese-wav2vec2-base (InfiniteTalk, MultiTalk, EchoMimicV3 Flash), Whisper-Large-v3 (LongCat 1.5, secondary). READMEs checked do not list Hindi/Nepali; Hallo explicitly says English-only training. — READMEs linked above; LongCat encoder from [mer.vin write-up (secondary)](https://mer.vin/2026/05/longcat-video-avatar-1-5-open-source-talking-heads-from-one-photo-and-audio/)
- I found no published Hindi/Nepali lip-sync evaluation for any model. Whisper-based conditioning (MuseTalk/LatentSync/Sonic) is the best bet for language-agnostic behaviour (inference from encoder choice, verify by test).

**ONNX / browser / CPU**
- Ditto ships ONNX models (TensorRT is the tested path). BiRefNet ONNX runs in browsers via ONNX Runtime Web (third-party apps). I found NO project running a photo+audio talking-head network in onnxruntime-web/WebGPU; a search for one returned only building blocks (Kokoro HeadTTS viseme timing, three.js TalkingHead). — [Ditto HF card](https://huggingface.co/digital-avatar/ditto-talkinghead), [BiRefNet README](https://github.com/ZhengPeng7/BiRefNet), [HeadTTS/TalkingHead via search](https://gittrend.io/repo/met4citizen/HeadTTS)
- CPU-only: no README found claims practical CPU inference; DreamTalk mentions `--device=cpu` only; SadTalker README silent. Treat CPU as non-viable for 30 s clips (inference).

### Inferences
- "One clear photo + audio" on an 8 GB laptop is not a solved problem with permissive weights in Oct 2026. The practical permissive photo+audio options are the Wan-based 1.3B-14B family, needing a 12-24 GB desktop GPU or a rented one.
- MuseTalk is the only permissive, sub-8 GB-VRAM option found, but it needs a driving video; a still photo would give a frozen head with only the mouth moving (inference). A cheap workaround is a looped "idle" clip; this needs testing.
- Several "Apache-2.0 code" projects pull in InsightFace/buffalo_l (Hallo, V-Express, Ditto checkpoints, LivePortrait default, LatentSync data pipeline). Each needs the detector swapped (e.g., MediaPipe) before it can be called permissive end to end.

### Gaps
- No per-clip timings for any photo+audio model on RTX 3050/3060/4060 laptops (searches for SadTalker, InfiniteTalk/Wan2GP, Ditto consumer benchmarks returned nothing relevant). Wan2GP README lists no InfiniteTalk/MultiTalk/S2V entry and gives 6 GB as its lowest figure for select models. — [Wan2GP README](https://github.com/deepbeepmeep/Wan2GP)
- Weights licences not stated for: Hallo, Hallo2, EchoMimic V1/V2, AniPortrait, SadTalker, LatentSync, Ditto (HF says repo Apache-2.0), Wav2Lip-HD, GeneFace, base-model licences for InfiniteTalk/EchoMimicV3.
- Hindi/Nepali behaviour of every model: untested in any source.
- 9:16 support, teeth artifacts and head-motion quality: only MuseTalk's own limitation list was found; others have no independent evaluation in what I read.

---

## 2. Permissive-end-to-end shortlist (and what a user-run local install changes)

### Takeaway
Cleanest candidates (code AND weights stated permissive, minimal propagating components): InfiniteTalk, MultiTalk, OmniAvatar, Wan2.2-S2V (all Apache-2.0), LongCat-Video-Avatar (MIT), EchoMimicV3 (Apache-2.0). They are heavy. The light options (MuseTalk MIT, Ditto Apache-2.0, SadTalker Apache-2.0) carry component caveats. Everything else is non-commercial or unusable.

### Cited Findings
- Clean-ish (statements as quoted in section 1): InfiniteTalk, MultiTalk, OmniAvatar (Apache-2.0); Wan2.2-S2V ("licensed under the Apache 2.0 License"); LongCat-Video-Avatar (MIT); EchoMimicV3 Apache-2.0 (base Wan2.1-Fun licence not stated). — links in section 1
- Permissive but with caveats: MuseTalk (MIT; whisper MIT, ft-mse-vae, DWPose Apache-2.0, face-parsing MIT per manifest; S3FD named in licence section; test data non-commercial) — [Creative AI News (secondary)](https://www.creativeainews.com/articles/open-source-lip-sync-licenses-commercial-use-2026/), [MuseTalk README](https://github.com/TMElyralab/MuseTalk); Ditto (Apache-2.0 but InsightFace-named ONNX files in checkpoints); SadTalker (Apache-2.0 plus third-party components, Wav2Lip checkpoint); SoulX-FlashHead Pro (Apache-2.0 chain; Lite adds Open-RAIL-M VAE).
- Non-commercial / non-permissive: Sonic (CC BY-NC-SA 4.0), V-Express weights (research only), DreamTalk, Wav2Lip and Wav2Lip-HD (LRS2), NanoAvatar lip-sync weights (CC BY-NC 4.0), plus anything depending on InsightFace buffalo_l weights unless swapped. — links in section 1
- Does a user-run local install change the picture? The CLAUDE.md rule restricts what Introcut "bundles or requires". Non-commercial research weights are, by their own terms, restricted to non-commercial research use by the person who downloads them; a hobby user running them locally is a different legal position from Introcut distributing/requiring them, but InsightFace states even auto-downloaded models follow the non-commercial policy and the user's output goes onto monetised platforms. — [InsightFace README](https://github.com/deepinsight/insightface). This is a legal-risk inference, not legal advice.
- MediaPipe Face Landmarker: 478 landmarks, 52 blendshape scores, face detector BlazeFace; page content CC BY 4.0, code samples Apache-2.0 (model-file licence not stated on that page; verify the .task bundle terms). — [MediaPipe Face Landmarker](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker)

### Inferences
- Best "ship-as-optional-companion" candidate on permissive grounds: InfiniteTalk or MultiTalk via a user-installed ComfyUI/Wan2GP stack (Apache-2.0). Best light fallback: MuseTalk with a looped idle clip, after verifying the S3FD/DWPose/face-parse components.
- Introcut must not auto-download or require InsightFace weights; any model needing them is excluded unless the detector is swapped for MediaPipe/SCRFD-alternative with a permissive licence.

### Gaps
- Exact licences of the Wan2.1 base weights inside InfiniteTalk/MultiTalk/EchoMimicV3 were not stated on the pages read (Wan2.1 is generally Apache-2.0, not verified here).
- Did not verify S3FD's licence (named in MuseTalk's licence section) or mmpose/mmcv licences.

---

## 3. Hardware reality: cost of a 30 s clip by route

### Takeaway
Only MuseTalk has a published consumer-laptop figure (about 5 min for 8 s on a 4 GB RTX 3050 Ti, so roughly 19 min for 30 s, my arithmetic). Modern photo+audio models are datacentre/24 GB-class; the sensible 2026 paid route is a per-second API at about $0.02 to $0.20 per second (about $0.60 to $6 per 30 s clip). Free hosted GPU routes are quota-limited or restricted for automation.

### Cited Findings
- (a) 4-8 GB laptop: MuseTalk 4 GB fp16 8 s in about 5 min (README). MuseTalk "Minimum about 4 GB, recommended about 6 GB" per a community mirror (secondary). EchoMimicV3-Flash 12 GB; MultiTalk 480p on a single 4090; OmniAvatar can offload to 8 GB VRAM but at 22.1 s per iteration on an A800 (offloading). — [MuseTalk README](https://github.com/TMElyralab/MuseTalk), [AEmotionStudio mirror](https://huggingface.co/AEmotionStudio/musetalk-models/blob/main/README.md), [EchoMimicV3](https://github.com/antgroup/echomimic_v3), [OmniAvatar](https://github.com/Omni-Avatar/OmniAvatar)
- RTX 3060 comparator (a different workload): a May 2026 Reddit thread reports LTX 2.3 video generation of 5 s at 1920x800 takes about 280 s on an RTX 3060 (user comment; unverified). — [Reddit snapshot via search](https://reddit.sentinel-team.org/posts/1t5tq7e/snapshots/2026-05-08T22%3A29%3A22.49338Z)
- (b) Integrated GPU only / (c) CPU only: no source found; all fetched READMEs assume CUDA. Wan2GP lists AMD RDNA2-4 and NVIDIA 10-series up, but its lowest listed requirement is 6 GB VRAM. — [Wan2GP README](https://github.com/deepbeepmeep/Wan2GP)
- (d) Free hosted: HF ZeroGPU quota already covered by earlier research (about 5 GPU-min/day free, PRO 40). Replicate lists a SadTalker fork at about $0.0059/run (7 s on L40S) in one snapshot versus about $0.059/run (61 s) in another; MuseTalk forks $0.052 (A100, about 37 s) to $0.42 (L40S, about 8 min). — [Replicate lucataco/sadtalker](https://replicate.com/lucataco/sadtalker), [internal mirror](https://internal.replicate.com/lucataco/sadtalker), [tmappdev/lipsync](https://replicate.com/tmappdev/lipsync), [douwantech/musetalk](https://replicate.com/douwantech/musetalk) (search-result snapshots, internally inconsistent; verify live)
- (e) Paid GPU rental, RunPod page dated 2026-10-08: on-demand RTX 4090 $0.89/hr, RTX 3090 $0.50/hr, L4 $0.59/hr, A40 $0.59/hr, A100 $1.79/hr; serverless flex RTX 4090 $1.10/hr, 24 GB (L4/3090) $0.69/hr, A100 80 GB $2.72/hr. JSON-LD on the page lists lower Community Cloud rates (4090 $0.34/hr, 3090 $0.22/hr). — [RunPod pricing](https://www.runpod.io/pricing)
- Per-second hosted avatar APIs (fal.ai, via search, prices to verify live): InfiniteTalk $0.2/s (a third-party article says about $0.30/s at 480p, conflicting); MultiTalk $0.2/s; SoulX-FlashTalk $0.02/s; Kling AI Avatar v2 Standard $0.0562/s and Pro $0.115/s (proprietary). LongCat single-avatar on fal bills "1 unit per second at 480p, 4 at 720p" with unit price not shown. — [fal search results](https://fal.ai/models/fal-ai/infinitalk/single-text/llms.txt), [fal LongCat](https://fal.ai/models/fal-ai/longcat-single-avatar/image-audio-to-video/api), [breakingac article (secondary, conflicting)](https://breakingac.com/news/2025/dec/05/how-to-choose-the-most-cost-effective-infinite-talk-api-the-efficient-solution-provided-by-kieai/). (My arithmetic for 30 s: InfiniteTalk about $6, FlashTalk about $0.60, Kling Standard about $1.69.)
- Free-GPU context: Colab/Kaggle restrictions on remote driving and ZeroGPU limits are covered by the earlier research and are not repeated here.

### Inferences
- A rented 4090 at $0.89/hr is about 1.5 US cents per GPU-minute, so even a 10-minute generation would cost about $0.15; the true blocker for "zero cost" is not the GPU price but who pays and the lack of an anonymous, key-less hosted endpoint. A bring-your-own-key (fal/Replicate) route is cheap per clip but is a paid, opt-in route that must be labelled as such.
- For a beginner on 8 GB hardware, local neural avatar generation is realistic only as "start it, come back in 15-20 minutes" (MuseTalk-class) and is likely worse for photo+audio models (no data found).

### Gaps
- No source for RTX 3060/4060 or integrated-GPU timings of photo+audio models; no CPU-only timings; no verified free-tier Colab/Kaggle step-by-step route for a user to run themselves.
- Kling Avatar and other proprietary systems excluded from licence reasoning; their ToS were not read.

---

## 4. "Cheap avatar": stylised/cut-out avatar with code-driven mouth, blink and sway

### Takeaway
It is feasible fully in the browser with permissive parts (MediaPipe face landmarks, segmentation like BiRefNet-lite, Kokoro/HeadTTS visemes, canvas/WebGL), and avoids the uncanny valley by being obviously stylised, but no ready-made photo-to-animated-avatar open-source package was found, so effort is substantial and quality is "cartoon puppet", not "realistic presenter".

### Cited Findings
- MediaPipe Face Landmarker: 478 3D landmarks + 52 blendshape scores + facial transformation matrix, designed for real-time, Web guide exists; content CC BY 4.0, code samples Apache-2.0. — [MediaPipe docs](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker)
- TalkingHead (met4citizen, MIT): 3D GLB avatar with ARKit 52 + Oculus 15 visemes; built-in lip-sync for English, German, French, Brazilian Portuguese, Finnish, Lithuanian (Hindi not mentioned; other languages via custom module or Azure visemes); HeadAudio worklet detects visemes directly from audio ("No text transcription or timestamps needed"); HeadTTS gives free Kokoro TTS with phoneme timestamps in-browser (WebGPU/WASM); photo-to-3D avatars via Avaturn (free for non-commercial use only) or Avatar SDK; sample avatar licences vary (one CC BY-NC 4.0, one CC0); author calls it "just a small side-project". — [TalkingHead README](https://github.com/met4citizen/TalkingHead)
- Rhubarb Lip Sync (2D mouth-shape A-F/G/H/X from audio): PocketSphinx recogniser "only recognizes English dialog"; phonetic recogniser is language-independent but "usually less precise"; licence type not stated on page (verify). — [Rhubarb README](https://github.com/DanielSWolf/rhubarb-lip-sync)
- BiRefNet segmentation: MIT code; ONNX files exist; run in browsers via ONNX Runtime Web (BiRefNet_lite in third-party apps); weights licence not stated on README; RMBG-2.0 (trained with BiRefNet) is non-commercial. — [BiRefNet README](https://github.com/ZhengPeng7/BiRefNet)
- Timeline Studio (martindelophy) is claimed to be a local-first browser editor with talking avatars using ONNX/WebGPU/WASM; pipeline and licence not verified. — [search result](https://github.com/martindelophy)
- Kokoro/HeadTTS provide visemes for English; for Hindi/Nepali visemes, the audio-driven route (amplitude/phoneme-free mouth opening, or HeadAudio) is the language-agnostic option (inference).

### Inferences
- Simplest cheap version: segmented bust or bust-in-a-bubble, audio-envelope-driven jaw/scale ("squash and stretch"), random blink, slow head sway. Language-agnostic because it uses audio loudness, not phonemes. Needs only canvas, one segmentation pass and optionally MediaPipe landmarks to find mouth/eye positions. Risk: "talking cut-out" can look uncanny if realistic; a stylised/cartoon filter lowers expectation (not verified; need a cartoonisation model with a permissive licence, none verified here).
- A 3D avatar route (TalkingHead) needs a rigged avatar from a photo; the photo-to-3D services found are non-commercial or paid, so it is not a clean fit.
- Compared with neural lip-sync: far less realistic mouths, but near-zero compute/zero-cost, instant, works offline, and honest about being synthetic (which helps platform-label compliance).

### Gaps
- No permissively licensed photo-cartoonisation model verified; no benchmark/user-study of perceived quality of code-driven avatars; Rhubarb licence text not read.
- No source for how audio-envelope jaw animation is perceived by viewers.

---

## 5. Layout and product use: presenter bubble vs full-frame, length, caching, voice chaining

### Takeaway
Evidence for specific best-practice lengths was not found in sources; the technical limits of the models point to short segments (5-15 s) and a presenter bubble, which hides low resolution and the 256x256 face region of MuseTalk-class models.

### Cited Findings
- MuseTalk's face region is 256x256 (README suggests GFPGAN-style super-resolution for more); LatentSync 1.6 is 512x512; EchoMimicV3-Flash up to 768x768; InfiniteTalk/MultiTalk/OmniAvatar are 480p (720p needs more VRAM/GPUs). — links in section 1
- Segment limits: MultiTalk trained on 81-frame 25 fps clips (up to 201 frames; "up to 15 seconds" claimed); InfiniteTalk good for single image up to about 1 minute then colour shift; LongCat generates in segments (first about 5.8 s then about 5 s each on fal). — [MultiTalk](https://github.com/MeiGen-AI/MultiTalk), [InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk), [fal LongCat](https://fal.ai/models/fal-ai/longcat-single-avatar/image-audio-to-video/api)
- Chaining with voice: models take an audio file (WAV/MP3; Hallo wants WAV; MultiTalk repo itself integrates Kokoro-82M TTS), so TTS or cloned voice output can be fed directly; audio volume affects Hallo results (README known issue). — [Hallo README](https://github.com/fudan-generative-vision/hallo), [MultiTalk](https://github.com/MeiGen-AI/MultiTalk)
- Source-image guidance (Hallo): square crop, face 50-70% of frame, rotation under 30 degrees. — [Hallo README](https://github.com/fudan-generative-vision/hallo)

### Inferences
- Presenter bubble (about 25-35% of the 9:16 frame, circular mask, over screen recordings/slides) is the best match for any model with 256-480p output; full-frame talking head needs 720p-class models and is the costly case.
- Caching: key the avatar clip on hash(photo) + hash(audio segment) + model version + settings; keep it per sentence/segment (5-10 s) so a script edit re-renders only changed lines; store in OPFS. For MuseTalk-class, cache the per-avatar preprocessing (README distinguishes real-time throughput after avatar preparation, secondary) — [aireiter review (secondary)](https://aireiter.com/blog/musetalk-lipsync-review-cost-vs-paid-apis).
- Introcut's existing per-line voice design (voice per line in the repo) maps naturally to per-line avatar clips.

### Gaps
- No evidence on viewer retention for bubble vs full-frame, nor on audience acceptance of AI presenters in short-form video.
- Seam/identity consistency between independently generated per-line clips was not covered by any source.

---

## 6. Safety, legal and platform rules

### Takeaway
Platforms require disclosure/labelling of realistic synthetic people, India's 2026 IT Rules amendment adds mandatory labelling and provenance for intermediaries, and Instagram now has an "AI-generated profile" label with reach penalties for unlabelled AI persons. A same-person check is feasible with permissive face-embedding models, but liveness is not solved by those models alone.

### Cited Findings
- YouTube: creators must disclose realistic altered/synthetic content "a viewer could easily mistake for a real person, place, scene, or event", including "the likeness of a realistic person" and "generating a person's voice to narrate a video"; clearly unrealistic/animated content, filters, and AI used for scripts/captions are exempt; YouTube may add a label itself and "may later introduce enforcement measures." — [YouTube blog](https://blog.youtube/news-and-events/disclosing-ai-generated-content). YouTube likeness-detection claims for Partner Program creators come from secondary coverage — [Influencer Marketing Hub](https://influencermarketinghub.com/youtubes-new-standards-for-inauthentic-content-and-creator-likeness).
- TikTok: AIGC label is a disclosure requirement for realistic-looking people/scenes; unlabelled impersonating deepfakes prohibited (marketing-blog sources, conflicting detail, no official text read; verify). — [Cinerads (secondary)](https://www.cinerads.com/blog/tiktok-ai-content-policy)
- Meta: "AI info" post label is triggered by disclosure or detected technical signals; realistic AI video of a real person should be disclosed (third-party explainer; official text not read; verify). — [gradually.ai (secondary)](https://www.gradually.ai/en/instagram-ai-label/)
- Instagram: "AI creator" label replaced by "AI-generated profile" on 2026-08-31; unlabelled profiles featuring an AI-generated person may be excluded from recommendations; real creators who merely edit with AI do not need it (secondary coverage; Instagram help text not read; verify). — [Unite.AI](https://www.unite.ai/instagram-renames-ai-creator-label-and-restricts-unlabeled-ai-generated-profiles/), [Free Press Journal](https://www.freepressjournal.in/business/instagram-tightens-ai-rules-limits-reach-of-undisclosed-ai-generated-profiles)
- India: IT (Intermediary Guidelines and Digital Media Ethics Code) Amendment Rules, 2026, notified 2026-02-10, in force 2026-02-20; defines "synthetically generated information"; platforms enabling such content must label it prominently and embed persistent metadata/provenance where technically feasible; takedown windows cut to 3 hours in specified cases; an April 2026 draft would require a label visible throughout the content (status unconfirmed). Law-firm summaries, not the gazette. — [Mondaq](https://www.mondaq.com/india-it-intermediary-rules-amended-%E2%80%93-new-obligations-for-ai-synthetic-content/1743594), [Hogan Lovells](https://www.hoganlovells.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content), [Gala Law blog](https://blog.galalaw.com/post/102micu/indias-2026-it-rules-amendment-regulating-ai-generated-content-and-accelerating)
- Nepal: no deepfake-specific law under the Electronic Transactions Act was found; reporting describes 2021 election social-media guidelines and a draft code of conduct, called outdated for generative AI. — [MEA Tech Watch, 2026-01-26](https://meatechwatch.com/2026/01/26/ai-deepfakes-threaten-nepals-upcoming-march-5th-election/), [NepJOL article](https://www.nepjol.info/index.php/gswow/article/view/97581)
- Same-person check candidates: OpenCV SFace model files "licensed under Apache 2.0"; AdaFace listed MIT in a weights-provenance table (EdgeFace also in the permissive group; FaceX in-browser WASM Apache-2.0 but underlying weight licence unconfirmed). ArcFace/InsightFace pretrained weights are non-commercial. — [OpenCV SFace HF](https://huggingface.co/opencv/face_recognition_sface), [UniFace weights table](https://huggingface.co/yakhyo/uniface-weights), [FaceX](https://github.com/facex-engine/facex)
- Several model READMEs themselves prohibit fraud, infringement of portrait rights and misleading use (SadTalker disclaimer; InfiniteTalk says users are responsible for content). — [SadTalker](https://github.com/OpenTalker/SadTalker), [InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk)

### Inferences
- Because platforms ask for disclosure of "realistic" synthetic people, a stylised avatar lowers (not removes) the obligation; a photoreal neural avatar clearly triggers it. Introcut should embed a visible "AI-generated" label option plus metadata for both.
- Consent flow (design suggestion): record a short video where the user reads a random phrase, compute SFace/AdaFace embeddings between the selfie and video frames (same-person check) and between the uploaded avatar photo and the live capture; refuse mismatches. This blocks casual use of others' photos but is NOT robust liveness or deepfake-proof (no source evaluated attack resistance).
- India's rules put duties on platforms, not on end-user tools, but Introcut's own export labelling/metadata aligns with them.

### Gaps
- No official TikTok or Meta policy text; Instagram label details only from news coverage.
- No official gazette text for India; no Nepali legal source on synthetic media beyond news/academic commentary; EU AI Act Article 50 not checked.
- No evaluation of liveness/anti-spoof open-source models and their licences.

---

## 7. Verdict for V1

### Takeaway
Do not ship a neural talking-head avatar bundled in V1. Ship a cheap, code-driven presenter bubble (stylised cut-out with audio-driven mouth/blink/sway) as the default, and offer neural lip-sync only as an optional, clearly labelled "advanced/local companion" (MuseTalk-class or Wan-based, user-installed) or bring-your-own-key hosted route; defer true one-photo realistic avatars.

### Cited Findings
- The only light permissive option (MuseTalk) needs a video input, runs about 5 min per 8 s on a 4 GB RTX 3050 Ti, has a 256x256 face region and identity-loss notes. — [MuseTalk README](https://github.com/TMElyralab/MuseTalk)
- The permissive one-photo models need 12 GB (EchoMimicV3-Flash) up to 80 GB (Wan2.2-S2V single-GPU) VRAM, or two GPUs (LongCat), or 8x H800 for real time (FlashTalk). — links in section 1
- Hosted per-second APIs exist at about $0.02 to $0.20 per second, but are paid. — fal links in section 3
- InsightFace weights are non-commercial research only even when auto-downloaded. — [InsightFace README](https://github.com/deepinsight/insightface)

### Inferences
- Verdict by route:
  - Browser-only neural: not feasible today (no photo+audio model found in ONNX/WebGPU) — defer.
  - Windows/local companion: feasible for owners of 12-24 GB NVIDIA GPUs using InfiniteTalk/MultiTalk/EchoMimicV3 through ComfyUI/Wan2GP; for the target 8 GB laptops, only MuseTalk-class and only with long waits — "optional local companion", not default.
  - Free hosted GPU: HF ZeroGPU's few minutes per day cannot cover a 30 s clip on heavy models (inference from earlier research); defer.
  - Paid hosted: only as opt-in bring-your-own-key.
- Simplest acceptable first version (V1): (1) user supplies photo; (2) in-browser segmentation to a cut-out bust, optional stylise; (3) presenter bubble over screen recording/slides; (4) mouth/jaw driven by audio envelope (language-agnostic, works for Hindi/Nepali/English), blink timer, subtle sway; (5) consent step with same-person check; (6) "AI-generated" label on export.
- What to tell users honestly: "This is an animated presenter, not a realistic video of you; mouth movement follows the loudness of the voice, not exact lip shapes. Realistic lip-sync needs a powerful graphics card or a paid service and is optional." Do not claim lip-sync accuracy, Hindi/Nepali lip-sync quality, or free hosted GPU availability (all unverified).
- Re-test triggers: a permissively licensed photo+audio model at or under 1.5B parameters running in ONNX/WebGPU; SoulX-FlashHead Lite (96 FPS on a 4090) if its audio-input path and Open-RAIL-M VAE terms are confirmed.

### Gaps
- No empirical test was run; everything above is from documentation and secondary reports, as of 2026-10-22.
- Verify before any recommendation is acted on: Wan2.1 base licences, SoulX-FlashHead audio input and VRAM, MuseTalk component licences (S3FD), Ditto's InsightFace-named files, Hindi/Nepali lip-sync quality (needs a hands-on test of MuseTalk/LatentSync/InfiniteTalk), TikTok/Meta official policy text.
