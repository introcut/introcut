# Browser video pipeline: rendering, decoding, audio mixing and MP4 encoding with zero backend (as of 2026-10-22)

Research method note: ~25 web searches/fetches on 2026-10-22. Web search coverage of low-level benchmarks, Devanagari canvas shaping, OfflineAudioContext/LUFS and Safari/Firefox AAC encode was thin; those are listed under Gaps and flagged "verify". Items in "Inferences" that rest on general engineering knowledge rather than a fetched source are marked (verify).

---

## 1. WebCodecs support matrix and H.264/AAC encode support (Chrome, Edge, Safari, Firefox; desktop and mobile)

### Takeaway
WebCodecs exists in all four engines as of late 2026 (Chrome/Edge 94, Firefox 130, Safari 26), but codec coverage is per-device and must be feature-detected at runtime. H.264 video is the safest codec; AAC encoding is NOT guaranteed by the spec and some browsers lack it, so Introcut should ship a WASM AAC fallback (or use Opus-in-MP4) behind a runtime `isConfigSupported` check.

### Cited Findings
- caniuse: WebCodecs first supported in Chrome 94, Edge 94, Firefox 130 (desktop), Safari 26.0 (partial 16.4-18.7), Chrome for Android 155 (only version listed), Safari iOS 26.0 (partial 16.4-18.7), Firefox for Android not supported (listed through 158). Global usage 91.56% + 3.99% partial = ~95.5%. Spec is still a W3C Working Draft. — [caniuse](https://caniuse.com/webcodecs)
- MDN interface table for AudioEncoder: Chrome 94, Edge 94, Firefox 130, Safari 26, Firefox Android unsupported; not Baseline. — [MDN AudioEncoder mirror via search](https://developer.mozilla.org/en-US/docs/Web/API/AudioEncoder)
- MDN WebCodecs guide: H.264 is the most widely supported video codec; VP9/AV1 compress better but AV1 has limited hardware encoders; HEVC has significant support gaps outside Apple platforms. For audio, Opus is recommended, AAC "widely supported", MP3 is decode-only, PCM uncompressed. Codec strings must be full (e.g. `avc1.4d0034`). Available in Dedicated Workers. Feature-detect with `isConfigSupported`. — [MDN WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- The W3C AAC registration note defines AAC codec strings and an `aac`/`adts` format option and states implementers are not required to support AAC. — [W3C AAC WebCodecs Registration](https://www.w3.org/TR/2024/DNOTE-webcodecs-aac-codec-registration-20240313/)
- Mediabunny docs: "In some browsers, AAC encoding is not supported by WebCodecs"; polyfill with `@mediabunny/aac-encoder`. MP3 encoding is not supported by WebCodecs (polyfill `@mediabunny/mp3-encoder`). AC-3/E-AC-3 not native. — [Mediabunny supported formats and codecs](https://mediabunny.dev/guide/supported-formats-and-codecs)
- `@mediabunny/aac-encoder` is FFmpeg's AAC encoder compiled to a size-optimised WASM build, AAC-LC only; use `await canEncodeAudio('aac')` and call `registerAacEncoder()` only if false. Page states no license or bundle size. — [Mediabunny AAC encoder extension](https://mediabunny.dev/guide/extensions/aac-encoder)
- Chromium has a hardware-accelerated "PlatformAudioEncoder" for AAC on Windows; Google disabled hardware AAC on Windows ARM64 in Jan 2024 after test failures, later traced to a Windows 11 bug and fixed. — [Windows Latest, Feb 2025](https://windowslatest.com/2025/02/05/chrome-gets-faster-audio-encoding-on-windows-11-arm-thanks-to-microsoft)
- A user report on Linux Chromium 150 says `MediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.2"')` returned false (this is playback/MSE, not AudioEncoder; user report only). — [Opera forum](https://forums.opera.com/topic/89324/opera-doesn-t-support-aac-in-mp4-containers/1?lang=en-GB)
- Mozilla bug 1932528 (Firefox WebCodecs tests, fixed in Firefox 136 branch) quotes: "Currently, Chrome refuses to encode larger video sizes (720p or 1080p) using the H264 codec, whereas it can handle VP8, VP9, and AV1 at higher resolutions." No absolute date on the page (about late 2024/early 2025, relative "1 year ago"). This is a test-environment note and likely CI-specific (software H.264 encoder availability); treat as a caution. — [Mozilla Bugzilla 1932528](https://bugzilla.mozilla.org/show_bug.cgi?id=1932528)
- canvas-record (WebCodecs library) notes AVC max frame-size limits apply and are fine "until a bit more than 4K 16:9 @ 30fps"; 1080x1920 is far below. — [canvas-record README](https://cdn.jsdelivr.net/npm/canvas-record@5.5.1/README.md)
- Remotion's client-side renderer (built on Mediabunny) documents its browser support as Chrome 94+, Firefox 130+, Safari 26+. — [Remotion client-side rendering](https://www.remotion.dev/docs/client-side-rendering)
- A developer ladder article (Apple M4, posted Oct 20 [2026, per the article's macOS 26.5 / Chrome 155 versions]) found "hardware-only chains returned nothing on two of the six builds", `configure` can pass and the encoder still fail later, and advises a fallback ladder: HEVC hw, H.264 hw, H.264 no-preference, VP9 no-preference, validated with a short timed trial. — [DEV: WebCodecs encoder ladder](https://dev.to/iterandum/my-webcodecs-encoder-ladder-for-h265-hardware-hint-first-a-timed-trial-h264-as-the-floor-2f5)

### Inferences
- For "Chrome/Edge desktop first", the core pipeline (H.264 `avc1.*` encode via `VideoEncoder` + AAC) is a mainstream path, but because AAC encode is optional and platform-dependent, Introcut must do `canEncodeAudio('aac')` at startup and register a WASM AAC encoder (license of the Mediabunny package must be checked before use: it wraps FFmpeg's native AAC encoder, which is LGPL-2.1+ in FFmpeg unless built with GPL components; see section 2) or switch to Opus (verify that target players accept Opus-in-MP4: it is valid MP4 but less universal than AAC).
- Use level/profile-specific codec strings and test 1080x1920 explicitly (portrait 1080x1920 is level 4.0+ for H.264, e.g. `avc1.640028` High L4.0; 1080x1920x30 = 62,208 macroblocks/s*... verify exact level needed) rather than assuming 1920x1080 support implies 1080x1920.
- Safari 26 and Firefox 130+ are workable secondary targets but with slower/different encode behaviour (see section 6); keep them "best effort".

### Gaps
- No authoritative per-OS matrix of which Chrome platforms ship an AAC `AudioEncoder` (Windows, macOS, Linux, ChromeOS, Android) was found. Verify empirically with `AudioEncoder.isConfigSupported({codec:'mp4a.40.2',...})` per platform; do not claim universal AAC.
- Firefox and Safari AAC encode status could not be confirmed from sources.
- Maximum bitrate and level limits for hardware H.264 encoders on integrated GPUs were not found.
- Behaviour of WebCodecs on very low-RAM machines was not documented in any source found (see section 7 for what is known).

---

## 2. Libraries: Mediabunny, mp4-muxer, mp4box.js, Diffusion Studio, ffmpeg.wasm; API, licenses, size, memory strategy

### Takeaway
Mediabunny (MPL-2.0, successor of mp4-muxer/webm-muxer, 5 kB-ish tree-shaken) is the best fit: it has a `CanvasSource` -> `VideoEncoder` -> MP4 pipeline with backpressure and a streaming `StreamTarget` that writes directly to a File System Access writable, so the output never has to sit fully in RAM. ffmpeg.wasm is a poor fit (size, memory ceiling, GPL/LGPL build-dependence); Remotion's and Diffusion Studio's later versions are not freely licensable.

### Cited Findings
- Mediabunny: MPL-2.0 ("use it for any purpose, including closed source; modifications to the licensed source files must be published under MPL-2.0"); reads/writes MP4, MOV, WebM, MKV, HLS, WAVE, MP3, Ogg, ADTS, FLAC, MPEG-TS; 25+ codecs; zero dependencies; streaming I/O for any file size; claims "as small as 5 kB gzipped" tree-shaken. — [Mediabunny GitHub](https://github.com/vanilagy/mediabunny)
- Official site lists about 17.3 kB min+gzip for an MP4-writing bundle; docs say it is the successor to mp4-muxer and webm-muxer by the same author. — [mediabunny.dev](https://mediabunny.dev/), [Introduction](https://mediabunny.dev/guide/introduction) (via search summaries; verify exact numbers with Bundlephobia)
- Gold sponsors of Mediabunny include Remotion and Diffusion Studio (i.e. the main browser-video products build on it). — [Mediabunny GitHub](https://github.com/vanilagy/mediabunny)
- Output API: `Output` + target + tracks, `start()`, add data, `finalize()`. `BufferTarget` holds the whole file in memory (docs: suits files under ~100 MB). `StreamTarget` takes a `WritableStream`; chunks carry byte `position` (some regions are rewritten, so you must write at offsets, which FileSystemWritableFileStream supports); chunked mode batches to 16 MiB by default. `StreamTarget` accepts the object returned by `createWritable()` from the File System Access API and `finalize()` closes it. Output applies backpressure automatically. — [Mediabunny writing media files](https://mediabunny.dev/guide/writing-media-files)
- Multi-track outputs buffer packets until every track has data for a timestamp, so add media in interleaved time slices (not all video, then all audio) to bound memory. — [Mediabunny writing media files](https://mediabunny.dev/guide/writing-media-files)
- `CanvasSource`: one canvas redrawn in a loop, `add(timestamp, duration)` in seconds, `await` it for backpressure, optional forced keyframe; `keyFrameInterval` default 2 s; `latencyMode` quality/realtime; `hardwareAcceleration` hint (docs recommend `no-preference`); `Quality` presets or explicit `bitrate`. `AudioBufferSource` accepts Web Audio `AudioBuffer`s appended sequentially (first starts at t=0); `close()` sources early to reduce memory. — [Mediabunny media sources](https://mediabunny.dev/guide/media-sources)
- Mediabunny supports custom encoder/decoder registration (`registerEncoder`) for polyfills. — [Supported formats and codecs](https://mediabunny.dev/guide/supported-formats-and-codecs)
- Diffusion Studio Core: v1.x documented as open source MPL-2.0; one README says v2 ("^2.0.0") is invite-only; no license statement found for v3/v4 now promoted in docs; client-side, WebCodecs, no ffmpeg/WASM; bundle size claims differ (38 KB vs 75 KB). Also a separate commercial browser NLE using WebCodecs and WebGPU. — [DS core README on jsDelivr](https://cdn.jsdelivr.net/npm/@diffusionstudio/core-v2@2.0.1/README.md), [Diffusion Studio docs](https://docs.diffusion.studio)
- Remotion: `@remotion/webcodecs` is under the Remotion License (teams of 4+ need a company license; a "WebCodecs Conversion Seat" is planned); `@remotion/web-renderer` is an experimental alpha encoding via Mediabunny; docs say Remotion licensing may still apply to client-side rendering. CLAUDE.md already forbids Remotion. — [Remotion WebCodecs docs](https://remotion.dev/docs/webcodecs), [Remotion Editor Starter client-side rendering](https://www.remotion.dev/docs/editor-starter/client-side-rendering)
- ffmpeg.wasm: wrapper `@ffmpeg/ffmpeg` is MIT but the core inherits FFmpeg's license, which depends on the build (some cores LGPL-2.1+, others `--enable-gpl` so GPL-2+); older docs cite a 1-2 GB input limit and a separate single-thread core. — [oss.kr license Q&A and README snippets via search](https://www.oss.kr/oss_license_qna/show/84a4147a-5d60-4246-96d4-5f9f7630b6d3), [ffmpeg-fix README](https://cdn.jsdelivr.net/npm/ffmpeg-fix@0.0.4/README.md)
- Remotion's own benchmark (M2 MacBook Air, Chrome 131, self-described non-scientific) claims its WebCodecs converter is at least 3x faster than ffmpeg.wasm; canvas-record claims WebCodecs 5-10x faster than H264MP4Encoder (WASM) and ~20x faster than FFmpeg (its own benchmark). — [remotion-dev/webcodecs-benchmark](https://github.com/remotion-dev/webcodecs-benchmark), [canvas-record](https://cdn.jsdelivr.net/npm/canvas-record@5.5.1/README.md)

### Inferences
- Recommended pipeline: `OffscreenCanvas`/canvas -> `CanvasSource` (AVC, explicit bitrate ~8-12 Mbps for 1080x1920 (verify visual quality)) + audio rendered offline -> `AudioBufferSource` (AAC via native or `@mediabunny/aac-encoder`, else Opus) -> `Output(Mp4OutputFormat, StreamTarget(fileHandle.createWritable()))`. A 30 s 1080x1920 file is only ~30-50 MB at 10-12 Mbps, so `BufferTarget` is also viable on a 4 GB machine, but streaming to disk is the safe default. Fall back to `BufferTarget` + `<a download>` where `showSaveFilePicker` is missing (Firefox/Safari; verify).
- Because Mediabunny is MPL-2.0 (file-level copyleft), using the unmodified npm package is compatible with a permissive app; keep it as a separate dependency, never patch its files. The `@mediabunny/aac-encoder` license was not stated in docs: check its repo/LICENSE and its FFmpeg build flags before shipping (FFmpeg's native `aac` encoder is LGPL-compatible code, but verify build is not GPL) and add to CREDITS.md.
- mp4-muxer/mp4box.js were not researched directly here (no sources fetched); Mediabunny supersedes mp4-muxer per its own docs. mp4box.js license (BSD-3-Clause) is from general knowledge: verify.

### Gaps
- License text of `@mediabunny/aac-encoder` and `@mediabunny/mp3-encoder`, and exact WASM size: not retrievable (GitHub page 404 on guessed URL).
- mp4box.js and current Diffusion Studio v3/v4 license: not confirmed.
- Real ffmpeg.wasm current memory limit and multithread (SharedArrayBuffer / COOP-COEP) requirement: not confirmed.

---

## 3. Deterministic frame rendering: Canvas 2D vs WebGL/WebGPU, OffscreenCanvas worker, text/Devanagari/emoji, Three.js, faster-than-real-time vs MediaRecorder

### Takeaway
Frame-by-frame rendering into a canvas and handing each frame (with an explicit timestamp) to `VideoEncoder` is deterministic and runs as fast as the machine can render/encode, unlike MediaRecorder which records the wall clock in real time. Devanagari and emoji shaping in Canvas 2D rely on the browser text stack; I found no source confirming the details, so this needs a bench test (see Gaps).

### Cited Findings
- MediaRecorder on a canvas stream stamps frames with the wall clock; a WICG proposal notes a 3-minute video always takes 3 minutes, and dropped frames from expensive rendering get baked into the file; developers report choppy output even using `requestFrame()` workarounds. — [WICG discourse: non-realtime MediaRecorder](https://discourse.WICG.io/t/allow-non-realtime-use-of-mediarecorder/2308), [W3C WebRTC logs 2022](https://lists.w3.org/Archives/Public/public-webrtc-logs/2022Jun/0138.html)
- Canvas capture lacks a constant frame rate (GitNation talk on WebCodecs encoding); large canvases on Android MediaRecorder have failed silently (older report, 2018-ish). — [GitNation talk](https://portal.gitnation.org/contents/pushing-the-limits-of-video-encoding-in-browsers-with-webcodecs), [Paul Kinlan](https://paul.kinlan.me/chrome-bug-897727mediarecorder-using-canvas-capturestreamfails-for-large-canvas-elements-on-android/)
- Mediabunny `CanvasSource.add(timestamp, duration)` takes explicit timestamps; `frameRate` option snaps timestamps. — [Mediabunny writing media files](https://mediabunny.dev/guide/writing-media-files)
- Remotion's browser renderer is single-threaded, headful browsers usually have GPU access, background tabs throttle `requestAnimationFrame` (they fall back to a worker timer, so renders are slower: keep the tab visible), supports Three.js (`ThreeCanvas`) and Skia canvas, and its DOM-to-image path has many CSS limits (no `writing-mode`, no `mix-blend-mode`, only linear-gradient backgrounds, fonts loaded via `@font-face`/`FontFace` not embedded in SVG capture). This is a lesson against DOM-screenshot capture: draw directly to canvas. — [Remotion client-side rendering limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- Devanagari conjunct formation requires a shaping engine; browsers shape correctly while apps lacking complex-text layout (e.g. Blender) do not. (General background; nothing about canvas `fillText` specifically.) — [Blender bug T100584](https://developer.blender.org/T100584), [Android TextRunShaper](https://developer.android.com/reference/kotlin/android/graphics/text/TextRunShaper)

### Inferences
- Pipeline: for each frame n, `t = n/30`; `renderFrame(project, t)` draws to one reusable canvas; `new VideoFrame(canvas, {timestamp: t*1e6, duration: 1e6/30})` or Mediabunny `CanvasSource.add`. Deterministic as long as renderFrame is a pure function of (project, t) and every asset (decoded clip frame, font, image) is ready before drawing (await `document.fonts.load()` and `ImageBitmap` decode first). Preview then uses the same function (matches CLAUDE.md rule).
- Canvas 2D is sufficient for text, images, rounded masks, simple effects at 1080x1920 (verify per-frame cost; it is GPU-accelerated in Chrome). Use WebGL only for shader effects/transitions that Canvas 2D can't do; WebGPU adds complexity and weaker support (verify) with no need for V1.
- Text: draw with Canvas 2D `fillText` using a bundled Noto Sans Devanagari (SIL OFL, verify license text) font loaded via `FontFace` and awaited before first frame; do own line-breaking with `measureText`. Chrome's canvas text goes through Skia/HarfBuzz so conjuncts should shape correctly (verify with a test string such as "क्ष त्र ज्ञ श्री" and matras like "कि"). Do NOT split Devanagari text per character (e.g. for typewriter or word-pop captions animate per word/grapheme cluster using `Intl.Segmenter`, never per code point) or ligatures/matras break. Emoji: canvas uses system color emoji fonts, which differ per OS and would break determinism across machines; bundle an emoji font (e.g. Noto Color Emoji, OFL; verify) or render emoji as images (verify).
- OffscreenCanvas in a Worker keeps the UI responsive and isolates memory; WebCodecs and OffscreenCanvas both work in workers (MDN says WebCodecs available in dedicated workers). Fonts: `FontFace` can be loaded into `self.fonts` in a worker (verify in Chrome).
- Three.js can render to an OffscreenCanvas/WebGL canvas that is then drawn into the 2D canvas or passed to `VideoFrame` directly; keep the WebGL context to one and use `preserveDrawingBuffer`/drawImage right after render (verify). Remotion ships Three/Skia canvas support, showing the approach works.

### Gaps
- No source confirming canvas `fillText` Devanagari shaping behaviour, `letterSpacing` interaction with conjuncts, `textRendering`/`fontKerning` flags, or worker font loading. Must be tested.
- No source on emoji rendering determinism in Canvas.
- No source on Three.js capture performance into WebCodecs.

---

## 4. Audio: OfflineAudioContext mixing, ducking, LUFS normalisation, TTS capture, AAC/Opus encoding

### Takeaway
Mix the whole 30 s soundtrack offline into one `AudioBuffer` (faster than real time, deterministic), apply ducking with gain automation, measure loudness with a WASM/JS EBU R128 meter on the rendered buffer and apply a single gain, then hand it to the encoder. I found sources for the encode side and the licensing of EBU R128 libraries, but not for the Web Audio behaviours themselves.

### Cited Findings
- Mediabunny `AudioBufferSource` takes Web Audio `AudioBuffer`s directly (first starts at t=0, later ones appended), so an `OfflineAudioContext.startRendering()` result can be encoded without custom glue. Codec options include AAC, Opus (MP4/WebM/MKV/OGG), MP3 etc. — [Mediabunny media sources](https://mediabunny.dev/guide/media-sources), [formats and codecs](https://mediabunny.dev/guide/supported-formats-and-codecs)
- Opus is recommended by MDN for WebCodecs audio encode; AAC "widely supported"; MP3 decode-only. — [MDN WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- EBU R128 loudness: the Rust `ebur128` crate is MIT-licensed, a port of C library `libebur128` (also MIT), supports momentary/short-term/integrated loudness, loudness range and true peak and passes EBU TECH 3341/3342 tests. I found no ready MIT npm/WASM package for it. — [docs.rs ebur128](https://docs.rs/crate/ebur128/latest), [FFmpeg ebur128 header (API reference)](https://ffmpeg.org/doxygen/6.0/ebur128_8h.html)
- Mediabunny's AAC polyfill is FFmpeg's AAC encoder as WASM, AAC-LC only. — [AAC encoder extension](https://mediabunny.dev/guide/extensions/aac-encoder)

### Inferences
- Mix design (all general Web Audio knowledge; verify in a prototype): decode clips' audio with `decodeAudioData` or Mediabunny `AudioBufferSink`; per-track `GainNode` with `setValueCurveAtTime`/`linearRampToValueAtTime` for ducking envelopes computed from voice-over activity (compute the envelope offline from the VO buffer's RMS, then bake it into gain automation: deterministic and no sidechain needed); sum at 48 kHz stereo (AAC-friendly; Chrome encoders typically accept 44.1/48 kHz, verify). Use `DynamicsCompressorNode` or a simple look-ahead limiter at the end to avoid clipping.
- LUFS: compile libebur128 (MIT) to WASM, or port the K-weighting filter + gating (~150 lines of JS; Float32 offline processing of a 30 s buffer takes milliseconds (verify)). Target around -14 LUFS integrated for short-form social (platform targets are commonly cited; verify per platform), peak <= -1 dBTP. Apply one static gain after measurement, then re-limit.
- TTS audio capture: kokoro-js / transformers.js return Float32 PCM, which can be wrapped directly into an `AudioBuffer`; no capture via MediaRecorder is needed. Do not record system audio (real-time and lossy).
- Memory: 30 s stereo 48 kHz float32 = 30*48000*2*4 = 11.5 MB per full-length track, so 8 stems is ~90 MB; render sparse stems (or only the active spans) or sum progressively to stay safe on low-RAM machines.
- Encode AAC with native `AudioEncoder` when `isConfigSupported` is true, else WASM AAC; Opus is a native alternative (MP4 with Opus is valid and Mediabunny can write it) but compatibility on phones/social upload (verify) is lower than AAC.

### Gaps
- No sourced description of OfflineAudioContext limits (max length/channels, memory), ducking approaches, or Chrome vs Firefox/Safari OfflineAudioContext differences.
- No ready-made MIT browser LUFS package found; selecting one (or building from libebur128) is an open task.

---

## 5. Performance numbers: time to encode 30 s of 1080x1920@30 and memory

### Takeaway
There is no rigorous published benchmark for exactly this case. The best sourced datapoint is a 1080p30 H.264 per-device table: hardware-encoder machines reach 60-200 fps (so 900 frames in ~5-15 s of encode time), but a low-end Windows netbook managed 11 fps (~80 s). Software-fallback encoding can be an order of magnitude slower than hardware. Total export time also includes rendering each frame and decoding source clips.

### Cited Findings
- 1080p30 H.264 encode/decode fps (no stated methodology or date): Windows netbook (low tier) Chrome 11 fps encode / 540 decode, Firefox 25 / 30; Samsung Chromebook Chrome 60 / 600; Ubuntu Lenovo (mid) Chrome 100 / 350, Firefox 80 / 300; iPhone 16 Pro Chrome 120, Safari 12; Galaxy S25 Chrome 200; MacBook Pro M4 Chrome 200 / 1200, Firefox 80, Safari 200. "Encoding is generally much slower than decoding and varies widely." — [webcodecsfundamentals.org encoder page](https://webcodecsfundamentals.org/basics/encoder/)
- The same page warns the encoder queue grows without bound if frames are submitted faster than encoded, "until it exhausts video memory and the process can crash": poll `encodeQueueSize` (example limit 20) and call `frame.close()` immediately after `encode()`; open VideoFrame count, `decodeQueueSize` and `encodeQueueSize` are the memory bottlenecks. — [webcodecsfundamentals.org](https://webcodecsfundamentals.org/basics/encoder/)
- Software vs hardware (HEVC, M4, Chromium): 30 frames 1080p took ~6 s with `prefer-software` versus <200 ms hardware; a 60 s 1080p H.265 transcode took 55.5 s with x265 WASM (24 MB, not WebCodecs) versus 8.5 s hardware (Chromium 149, hardware encoding disabled). — [DEV: WebCodecs encoder ladder](https://dev.to/iterandum/my-webcodecs-encoder-ladder-for-h265-hardware-hint-first-a-timed-trial-h264-as-the-floor-2f5)
- Desktop-CLI reference (not browser): 1080p 60 s clip encoded locally in ~8 s with H.264 (vendor guide; different engine). — [ittybit codec guide](https://ittybit.com/guides/compare-video-codecs.md)
- Remotion's renderer is single-threaded; keeping the tab foreground avoids timer-based throttling slowdowns. — [Remotion limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- Remotion's non-scientific benchmark (M2 Air, Chrome 131): `@remotion/webcodecs` at least 3x faster than ffmpeg.wasm for conversion. — [remotion-dev/webcodecs-benchmark](https://github.com/remotion-dev/webcodecs-benchmark)

### Inferences
- Rough estimate (GUESS, verify on target hardware): 30 s x 30 fps = 900 frames. If the encode rate is the bottleneck, a hardware machine (60-200 fps) takes ~5-15 s for encoding; a 25-fps-class machine ~36 s; a software-only low-end machine (~11 fps) ~80 s. The per-frame canvas render cost (1080x1920 = 2.07 MP per frame; texture uploads of decoded clip frames; text drawing) typically matters as much and is not covered by these numbers. A realistic honest promise for typical integrated-GPU laptops: "about 0.5-3 minutes for a 30 s video", with a progress bar and an ETA after the first few seconds (GUESS, to be replaced by Introcut's own benchmark; build a benchmark harness at M0/M1).
- Portrait 1080x1920 has the same pixel count as 1920x1080, so landscape benchmark fps transfer approximately.
- Memory: one 1080x1920 RGBA frame is 8.3 MB; if the encoder queue is limited to ~10-20 frames and decoded frames are closed promptly, GPU/CPU frame memory is ~100-200 MB (GUESS from frame size arithmetic). Frames held unclosed are what blow up memory.

### Gaps
- No sourced end-to-end export timing for a canvas-composited 30 s portrait video on integrated GPUs (Intel UHD/Iris, AMD Vega) in Chrome; no reliable RAM profile data for WebCodecs pipelines. Introcut should measure and publish its own numbers.
- The device table has no date or methodology; treat as indicative only.

---

## 6. Decoding user clips: VideoDecoder vs `<video>` seeking; HEVC/iPhone; variable frame rate

### Takeaway
For frame-accurate export, use WebCodecs `VideoDecoder` fed by a demuxer (Mediabunny `VideoSampleSink`/`CanvasSink`), not `<video>.currentTime` seeking, which is not frame-exact. iPhone HEVC clips decode in Chrome only when the OS/GPU supports HEVC hardware decode; offer a clear "unsupported codec" path.

### Cited Findings
- Mediabunny input side: `VideoSampleSink.getSample(t)` returns the frame displayed at time t; `samples(start,end)` iterates frames; `CanvasSink` produces (optionally downscaled) canvases at timestamps; `getRotation()/getFlip()/getDisplayWidth()` handle rotation metadata (important for iPhone portrait clips); first timestamps can be slightly negative; `canDecode()` checks decodability; files are read lazily to keep memory low and `input.dispose()` closes decoders. — [Mediabunny reading media files](https://mediabunny.dev/guide/reading-media-files)
- Variable frame rate: Mediabunny never trusts metadata for frame rate; use `computeFrameRateMetrics()` / `bestGuessFrameRate` (probes first 256 packets by default). — [Mediabunny reading media files](https://mediabunny.dev/guide/reading-media-files)
- HEVC: an unofficial guide states Chrome >= 107 enabled HEVC hardware decoding by default on ChromeOS, Mac, Windows and Android (Linux from 108); WebCodecs 8-bit needs >=107.0.5272.0 and 10-bit needs >=108.0.5343.0; on Windows before Chrome 130 max resolution was hard-coded 1920x1088@30fps and later queried from MediaFoundation. A Blink intent-to-ship thread (2025) says HEVC support was limited to Windows, macOS and Android hosts — the two conflict on ChromeOS/Linux. — [StaZhu enable-chromium-hevc-hardware-decoding](https://fr.github.com/StaZhu/enable-chromium-hevc-hardware-decoding), [blink-dev: H26x codec support updates](https://groups.google.com/a/chromium.org/g/blink-dev/c/YJ1QijNiHeM/m/3EhMjMVwAgAJ)
- MDN: HEVC "has significant browser support gaps outside Apple platforms." — [MDN WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
- Remotion's `<Video>` in client rendering uses its own media package; `<OffthreadVideo>`/`<Html5Video>` are unsupported in browser rendering. — [Remotion limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- Decode is much faster than encode (e.g. 350-1200 fps for 1080p H.264 on non-netbook devices). — [webcodecsfundamentals.org](https://webcodecsfundamentals.org/basics/encoder/)

### Inferences
- `<video>` seeking (`currentTime` + `seeked`/`requestVideoFrameCallback`) is async, can land on neighbouring frames, and depends on the player's keyframe handling (verify); it is workable only for the preview. Export should demux with Mediabunny and decode sequentially (decode in order from the nearest keyframe; export reads clips mostly forward, so sequential iteration with `samples(start,end)` is cheapest).
- For clips with VFR (screen recordings, phone clips), map output frame times to source times using presentation timestamps and pick the sample whose interval contains the time (nearest-previous) rather than computing index = t*fps.
- iPhone clips: HEVC (often 10-bit HDR HLG on newer iPhones) in .mov. If `canDecode()` is false (e.g. Chrome on a Windows PC without HEVC hardware decode) options are: tell the user to re-save as H.264 / use "most compatible" camera setting, or add a WASM HEVC decoder (patent/license risk and size; not recommended for V1). HDR (BT.2020/HLG) clips will look washed out when drawn to an SDR canvas (verify) unless tone-mapped.
- Always honour rotation metadata before drawing.

### Gaps
- No authoritative current Chrome/Edge HEVC matrix as of Oct 2026 (the two sources disagree on Linux/ChromeOS) and nothing specific on 10-bit/HDR iPhone clips in Windows Chrome.
- No source on `<video>` seeking frame-accuracy numbers.

---

## 7. Failure modes and low-memory mitigations

### Takeaway
The big risks are unbounded encoder queues, unclosed `VideoFrame`/`ImageBitmap` objects, whole-file buffering and holding all decoded clip frames or all audio in RAM. All are controllable with backpressure, streaming output and a bounded sliding window of frames.

### Cited Findings
- Encoder queue grows until video memory is exhausted if frames are submitted too fast; check `encodeQueueSize`, close frames immediately. — [webcodecsfundamentals.org](https://webcodecsfundamentals.org/basics/encoder/)
- Mediabunny: awaiting `add()` provides backpressure; use `StreamTarget` + File System Access to avoid holding the file; `BufferTarget` keeps the whole file in RAM (suits <~100 MB); interleave audio/video additions to bound packet buffering; close sources early; lazy file reads; dispose inputs. — [writing media files](https://mediabunny.dev/guide/writing-media-files), [media sources](https://mediabunny.dev/guide/media-sources), [reading media files](https://mediabunny.dev/guide/reading-media-files)
- Hardware encoder may be unavailable or fail after `configure` passes; use a trial-encode ladder and cache the result. — [DEV: encoder ladder](https://dev.to/iterandum/my-webcodecs-encoder-ladder-for-h265-hardware-hint-first-a-timed-trial-h264-as-the-floor-2f5)
- Software encoding fallback can be one to two orders of magnitude slower than hardware. — [DEV: encoder ladder](https://dev.to/iterandum/my-webcodecs-encoder-ladder-for-h265-hardware-hint-first-a-timed-trial-h264-as-the-floor-2f5)
- Background tabs throttle `requestAnimationFrame`; Remotion falls back to a worker timer and renders slower; keep the tab visible. — [Remotion limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- ffmpeg.wasm has historical 1-2 GB WASM memory limits. — [ffmpeg-fix README](https://cdn.jsdelivr.net/npm/ffmpeg-fix@0.0.4/README.md)

### Inferences
- Mitigation checklist (engineering judgement, verify via prototype): (1) run export in a dedicated Worker with `OffscreenCanvas`, one reusable canvas, no `getImageData` readbacks; (2) drive the loop with `await source.add()`, plus a manual guard on `encoder.encodeQueueSize`; (3) never keep more than the current and next source frames per clip; call `VideoFrame.close()`/`ImageBitmap.close()` right after drawing; (4) decode each clip with one decoder and release it (`input.dispose()`) after its last scene; (5) write to disk with `StreamTarget`; (6) mix audio per scene or in sparse stems; (7) offer "Draft" export at 720x1280 (about 44% of the pixels) first and "Final" at 1080x1920; also a "low memory mode" that lowers decoded frame cache and encoder queue to ~4-8; (8) catch `QuotaExceeded`/encoder `error` events and `VideoEncoder` state `closed`, and resume by re-running from the last keyframe-aligned chunk (chunked rendering: render 5-10 s segments to separate files and concatenate/mux with Mediabunny's packet copying without re-encode, verify feasibility); (9) when the tab loses focus, warn the user; use a Web Lock or `navigator.wakeLock` to stop sleep (verify); (10) request persistent storage if staging in OPFS.
- OPFS can stage large intermediate files in a worker (`createSyncAccessHandle`), useful when `showSaveFilePicker` is unavailable (verify).

### Gaps
- No documented crash thresholds per RAM size (e.g. at what free-RAM level Chrome kills tab at 1080x1920) and no data on tab-discard behaviour mid-export.
- No source on Chrome's behaviour with GPU process crashes during long WebCodecs sessions (verify by testing; the spec has `error` callbacks).

---

## 8. Existing open-source browser editors/renderers and what they learned

### Takeaway
Real products build on Mediabunny + WebCodecs (Remotion's web renderer, Diffusion Studio) so the approach is proven in 2026, but licenses vary: OpenCut is MIT (export mechanism unclear in sources), Remotion is not allowed, and Diffusion Studio's newer versions are not clearly open.

### Cited Findings
- OpenCut: multiple secondary sources say MIT-licensed (commercial use and modification allowed) with 45,000+ GitHub stars; project is being rewritten (Editor API, plugins, MCP server, headless mode) with the older version called "classic". Sources conflict on whether export is local or cloud; I found no source tying OpenCut export to WebCodecs. — [Menon Lab blog](https://themenonlab.blog/blog/opencut-open-source-capcut-alternative-video-editor), [OpenCut-app GitHub](https://github.com/OpenCut-app/OpenCut), [OpenCut vs ChatCut](https://www.nemovideo.com/blog/video-tool-comparisons/opencut-vs-chatcut)
- OpenReel Video (separate project) is described as React + TypeScript + WebCodecs + WebGPU. License not verified. — [OpenCut search results](https://www.opentechhub.io/opencut/)
- Remotion web renderer (alpha) encodes via Mediabunny, ships Three/Skia/"HTML in canvas" capture, and documents many DOM-capture limitations; licensing is the Remotion License (not permitted by CLAUDE.md). — [Remotion limitations](https://www.remotion.dev/docs/client-side-rendering/limitations), [Remotion WebCodecs docs](https://remotion.dev/docs/webcodecs)
- Diffusion Studio Core v1 (MPL-2.0) is a client-side WebCodecs editing library; later versions' license unclear. — [DS core README](https://cdn.jsdelivr.net/npm/@diffusionstudio/core-v2@2.0.1/README.md)
- Mediabunny's sponsors include Remotion, Diffusion Studio, Screen Studio, Tella, Kino, Mux, which suggests production use. — [Mediabunny GitHub](https://github.com/vanilagy/mediabunny)
- Mozilla's own WebCodecs tests include an encode-from-canvas performance test (reports frame-to-frame timing and drops). — [Searchfox test_encode_from_canvas](https://searchfox.org/firefox-main/source/dom/media/webcodecs/test/performance/test_encode_from_canvas.html)

### Inferences
- Lessons applicable to Introcut: draw directly to canvas (not DOM screenshot); bundle fonts and load them before capture; avoid reliance on tab-throttled timers; use Mediabunny rather than hand-rolled muxing; check codec availability at runtime.
- Do not copy code from any editor without checking its license; reading OpenCut (MIT) for architecture ideas is fine (verify its LICENSE file, and also that its dependencies like FFmpeg.wasm are not GPL-built).

### Gaps
- Could not verify OpenCut's current export path (WebCodecs vs ffmpeg.wasm vs cloud) or any Clipchamp-like project's learnings. OpenReel Video's license unconfirmed.

---

## 9. Unavoidable server-side steps and what Introcut can honestly promise

### Takeaway
Nothing in the decoding/render/mix/encode/mux chain requires a server; Mediabunny + WebCodecs can write MP4 H.264/AAC entirely client-side. The only soft dependencies are device-dependent: availability of a hardware H.264 encoder, native AAC (otherwise ship a WASM AAC), HEVC decode, and a way to save large files.

### Cited Findings
- Mediabunny supports in-browser MP4 writing via WebCodecs with streaming to a File System Access writable, no server. — [Mediabunny writing media files](https://mediabunny.dev/guide/writing-media-files)
- Remotion's browser renderer renders and encodes entirely in the browser with no Node server or Lambda (though licensing/asset storage costs may still apply for Remotion). — [Remotion client-side rendering](https://www.remotion.dev/docs/client-side-rendering)
- Browser support: Chrome/Edge 94+, Firefox 130+, Safari 26+. — [caniuse](https://caniuse.com/webcodecs)
- AAC encoding may be missing, with a WASM polyfill available; HEVC decode and hardware encoders are device-dependent. — [Mediabunny codecs](https://mediabunny.dev/guide/supported-formats-and-codecs), [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)

### Inferences
- Honest promise (draft wording, subject to Introcut's own measurements): "Export runs on your device in Chrome or Edge on desktop; a 30-second 1080x1920 video usually takes about 1-3 minutes (GUESS; slower on old or low-memory computers). Keep the tab open and visible. Your files never leave your computer. Firefox and Safari: may work, slower, not guaranteed (Safari 26 had 12 fps encode on iPhone 16 Pro in one table). Phones: not supported in V1." Provide a "Run a 10-second test" button that measures encoder fps, then shows an estimated time, and warn if only software encoding is available.
- Do not promise: HEVC iPhone clip import on every machine, AAC from the native encoder on every machine, or any fixed speed.
- Zero-cost constraint holds: static hosting only; MPL-2.0 Mediabunny unmodified; avoid GPL/LGPL WASM builds (e.g. ffmpeg.wasm with `--enable-gpl`); verify any AAC WASM license before shipping.

### Gaps
- No sourced evidence about Chrome versions or OS combos where no H.264 encoder exists (e.g. Chromium builds without proprietary codecs, some Linux distros: Chromium vs Chrome differences) — verify.
- Safari/Firefox export reliability as of Oct 2026 not independently tested in sources.
