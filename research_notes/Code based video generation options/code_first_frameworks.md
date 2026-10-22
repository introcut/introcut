# Code-first / programmatic video frameworks: what Introcut can legally and technically use (research date 2026-10-22)

Method note: GitHub numbers (license SPDX id, stars, last push) come from the unauthenticated GitHub REST API (api.github.com), fetched 2026-10-22, so they are current. "pushed_at" is the last push to any branch, not necessarily a release. Release dates were NOT retrievable for most repos (GitHub pages showed empty Releases). Anything I could not source is under Gaps and marked "verify". Anecdotal sources are labelled.

## 1. Per-tool facts: license, maturity, browser or server, export, audio (Remotion, Revideo, Motion Canvas, Manim, Theatre.js, GSAP/anime.js, Lottie/Rive, MoviePy, editly, FFmpeg/ffmpeg.wasm, Shotstack/Creatomate, Diffusion Studio, Mediabunny, Etro, HyperFrames, others)

### Takeaway
Only a small set is both permissively licensed and able to render and export MP4 fully in the browser: Mediabunny (MPL-2.0, a library not an engine), VideoFlow (Apache-2.0, small), Remotion's web-renderer (but Remotion is excluded by license), and Diffusion Studio core (MPL-2.0, with a watermark/paid-key twist). The big "video as code" names (Revideo, Motion Canvas, HyperFrames, Manim, MoviePy, editly) need Node/Python plus headless Chrome and FFmpeg, so they break Introcut's "browser-only, zero server" rule for export, even though several are MIT/Apache. Etro.js is GPL-3.0 and therefore unusable.

### Cited Findings

**Remotion (excluded, but current terms confirmed)**
- Repo license shows as "Other / NOASSERTION" (a custom license, not OSI); 66,130 stars; last push 2026-10-22; created 2020-06-23. — [GitHub API](https://api.github.com/repos/remotion-dev/remotion)
- Current LICENSE.md: free if you are an individual, a for-profit organization "with up to 3 employees", a non-profit/not-for-profit, or are evaluating Remotion and not yet using it commercially. Otherwise a Company License is required. — [LICENSE.md](https://raw.githubusercontent.com/remotion-dev/remotion/HEAD/LICENSE.md)
- Change over time: an earlier (2025) text listed only individuals and for-profits with up to 3 employees; the non-profit category and evaluation clause are newer. — [WebSearch result summarising LICENSE versions (jsDelivr/unpkg copies of LICENSE.md)](https://cdn.jsdelivr.net/npm/remotion@4.0.529/LICENSE.md) (secondary summary of the diff; flag as "verify by diffing old vs new LICENSE.md")
- LICENSE.md states "In Remotion 5.0, the license will slightly change." PR #3750 says the 5.0 license counts contractors toward team size, ties the Company License to new Terms and Conditions, and later commits restate that operating a bring-your-own-code rendering service is prohibited. Effective with Remotion 5.0 (no date given). — [PR #3750](https://github.com/remotion-dev/remotion/pull/3750)
- Company License prices (remotion.pro): "Remotion for Automators" $0.01 per render with a $100/month minimum; "for Creators" $25/month per seat; Enterprise from $500/month. The free license is for individuals and companies of up to 3 people; organizations of 4+ need a company license. — [remotion.pro/license](https://www.remotion.pro/license)
- Remotion ships `@remotion/web-renderer`, which renders videos/stills in the browser with no server, encoding through WebCodecs via Mediabunny (not FFmpeg); API stable from 4.0.491. Limited to a subset of tags/CSS: no backdrop-filter, mix-blend-mode, z-index (DOM order only), no 3D transforms, only color and linear-gradient backgrounds, CSS-loaded web fonts are not embedded. — [Remotion web-renderer docs](https://www.remotion.dev/docs/web-renderer), [limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- Remotion says companies that only want the Mediabunny multimedia library do not need a Company License for it (search snippet from the Remotion Mediabunny docs page; verify wording). — [remotion.dev/docs/mediabunny](https://remotion.dev/docs/mediabunny/)
- Conclusion for Introcut: Remotion remains excluded (custom, non-OSI license). Nothing found in 2025-2026 loosens this; the 5.0 change tightens it (contractors count).

**Revideo (redotvideo/revideo)**
- MIT; 4,127 stars; created 2024-03-11; last push 2026-07-15 (about 3 months ago); not archived; 63 open issues. — [GitHub API](https://api.github.com/repos/redotvideo/revideo)
- TypeScript scenes (shapes, text, media, animation) rendered via `renderVideo()` that "runs anywhere Node and a headless browser run"; a React `<Player/>` previews in the browser; anonymous PostHog telemetry on renders (opt out with `DISABLE_TELEMETRY=true`). — [GitHub README](https://github.com/redotvideo/revideo)
- Fork of Motion Canvas lineage (inferred from README; not confirmed in fetched text).

**Motion Canvas**
- MIT; 19,424 stars; created 2022-08-03; last push 2026-07-02; not archived; 176 open issues. — [GitHub API](https://api.github.com/repos/motion-canvas/motion-canvas)
- TypeScript generator-based animations, an editor with real-time preview, a browser player custom element and a Vite plugin; designed to sync animations with voice-overs. The fetched page did not describe the export path or audio details. — [GitHub README](https://github.com/motion-canvas/motion-canvas)

**Manim**
- ManimCE (ManimCommunity/manim): MIT, 41,755 stars, last push 2026-10-20. — [GitHub API](https://api.github.com/repos/ManimCommunity/manim)
- ManimGL (3b1b/manim): MIT, 95,483 stars, last push 2026-09-09. — [GitHub API](https://api.github.com/repos/3b1b/manim)
- Python; rendering relies on local Cairo/OpenGL + FFmpeg (from background knowledge; not verified here, see Gaps). Not a browser tool.

**Theatre.js**
- Apache-2.0; 12,783 stars; last push 2024-08-14 (over 2 years ago, effectively dormant). Description: "Motion design editor for the web". — [GitHub API](https://api.github.com/repos/theatre-js/theatre)
- It is an animation/sequencing editor, not a video exporter (no MP4 path found; verify).

**GSAP / anime.js**
- GSAP homepage states "GSAP is now free for everyone, thanks to Webflow's support!" The license text itself could not be retrieved (both LICENSE URLs 404'd or did not contain it). Treat GSAP as NOT confirmed OSI/MIT; my understanding is it uses a custom "Standard No Charge" license (verify before any use). — [gsap.com](https://gsap.com/community/standard-license/)
- anime.js repo API call 404'd (wrong slug); license not verified here (verify; believed MIT).
- HyperFrames and Helios both document GSAP as the seekable animation driver for headless-capture rendering. — [HyperFrames README](https://github.com/heygen-com/hyperframes), [Helios README](https://github.com/BintzGavin/helios)

**Lottie / Rive / dotLottie**
- lottie-web (airbnb): MIT; 32,262 stars; last push 2025-09-01 (13 months ago). — [GitHub API](https://api.github.com/repos/airbnb/lottie-web)
- rive-wasm (Rive runtime): MIT; 1,011 stars; last push 2026-10-22 (active). — [GitHub API](https://api.github.com/repos/rive-app/rive-wasm)
- Both are playback runtimes for vector animation assets, not video composers. Remotion and HyperFrames support Lottie as an embedded asset type. dotLottie not checked.

**MoviePy**
- MIT; 15,011 stars; last push 2026-08-26. Python, wraps FFmpeg. — [GitHub API](https://api.github.com/repos/Zulko/moviepy)

**editly**
- MIT; 5,537 stars; last push 2025-05-12 (17 months ago: stale). Node + FFmpeg, JSON5/JSON edit spec. — [GitHub API](https://api.github.com/repos/mifi/editly)
- A newer self-hosted wrapper "vidapi" (MIT, 7 stars) exposes editly + FFmpeg as a FastAPI service, illustrating that this stack needs a server. — [GitHub search result](https://api.github.com/search/repositories?q=%22video+as+code%22+OR+%22programmatic+video%22+pushed:%3E2026-03-01&sort=stars&per_page=15)

**FFmpeg / ffmpeg.wasm**
- ffmpeg.wasm wrapper: MIT; 17,897 stars; last push 2026-09-29. README says "pure WebAssembly / JavaScript port of FFmpeg". — [GitHub API](https://api.github.com/repos/ffmpegwasm/ffmpeg.wasm), [README](https://raw.githubusercontent.com/ffmpegwasm/ffmpeg.wasm/main/README.md)
- The docs list x264 0.164.x among the bundled libraries, offer a multi-thread core (`@ffmpeg/core-mt`) that spawns extra workers, and say custom builds can shrink the core. The page did not state LGPL/GPL terms. — [ffmpegwasm docs](https://ffmpegwasm.netlify.app/docs/overview)
- Licensing implication: the MIT label covers the JS wrapper only; the FFmpeg core is LGPL by default but becomes GPL if built with x264 (GPL) etc. (background knowledge, see Gaps; verify core license files).

**Shotstack / Creatomate (JSON video APIs, cloud, paid)**
- Shotstack: pay-as-you-go 20 cents/min, Starter $39/mo (15.6c/min), Pro $99/mo, Scale $199/mo, Volume $499/mo; 10 sign-up credits valid 30 days plus a free sandbox. Edit API accepts JSON. — [shotstack.io/pricing](https://shotstack.io/pricing/)
- Creatomate: no permanent free plan, trial of 50 credits; plans Essential 2,000 credits, Growth 10,000-40,000; 1 minute of 720p/25fps video costs about 14 credits; API access on all plans. — [creatomate.com/pricing](https://www.creatomate.com/pricing)
- Both render on their servers: violates zero-cost/browser-only rule.
- Shotstack schemas repo URL (github.com/shotstack/schemas) returned 404; license of their JSON schema unverified.

**Diffusion Studio core**
- MPL-2.0 per GitHub; 1,248 stars; created 2024-07-30; last push 2025-11-18 (11 months ago); 179 commits. — [GitHub API](https://api.github.com/repos/diffusionstudio/core), [README](https://github.com/diffusionstudio/core)
- Browser engine: decoding and encoding via WebCodecs, frames painted with Canvas 2D; declarative timeline compositions; captions, rich text, keyframing, masking, audio ramps, silence removal, transitions. Needs COOP `same-origin` and COEP `credentialless` headers. Sends server-side rendering needs to Remotion. — [README](https://github.com/diffusionstudio/core)
- Catch: the README pricing section says the engine is free only if the "Made with Diffusion Studio" watermark stays on rendered video; removing it requires a purchased license key. This conflicts with Introcut's rules (a non-removable watermark or paid key on an MIT app). — [README](https://github.com/diffusionstudio/core)

**Mediabunny (and mp4-muxer / webm-muxer lineage)**
- MPL-2.0 (modified versions you distribute must be published under the same license; unmodified use is fine, matching Introcut's CLAUDE.md note); 7,358 stars; created 2024-09-01; last push 2026-10-21 (yesterday); 1,468 commits. — [GitHub API](https://api.github.com/repos/vanilagy/mediabunny), [README](https://github.com/vanilagy/mediabunny)
- Reads/writes MP4, MOV, WebM, MKV, HLS, WAVE, MP3, Ogg, ADTS, FLAC, MPEG-TS; 25+ codecs hardware-accelerated via WebCodecs; has a `CanvasSource` that makes a video track from a canvas (README example uses avc with `Quality('high')`). — [README](https://github.com/vanilagy/mediabunny)
- It is the encoder underneath Remotion's web-renderer and VideoFlow's browser renderer, which is strong evidence of production use. — [Remotion docs](https://www.remotion.dev/docs/web-renderer), [VideoFlow README](https://github.com/ybouane/VideoFlow)
- mp4-muxer/webm-muxer (same author) not fetched; believed superseded by Mediabunny (verify).

**Etro.js**
- GPL-3.0; 1,153 stars; last push 2026-10-20. — [GitHub API](https://api.github.com/repos/etro-js/etro)
- GPL-3.0 is not permissive: cannot be linked into an MIT app. Excluded.

**HyperFrames (HeyGen) - notable 2026 newcomer**
- Apache-2.0; 69,382 stars; created 2026-03-10; last push 2026-10-22; 395 open issues; description "Write HTML. Render video. Built for agents." — [GitHub API](https://api.github.com/repos/heygen-com/hyperframes)
- Compositions are HTML with data attributes (`data-start`, `data-duration`, `data-track-index`), animations driven by GSAP timelines (`window.__timelines`); "no proprietary timeline format"; no JSON format. Requires Node.js 22+ and FFmpeg, drives headless Chrome (Docker and AWS Lambda distributed rendering mentioned). Composition plays in a browser and ships a `<hyperframes-player>` web component, but MP4 export is the CLI path. Ships 7 agent skills (Claude Code, Codex, Cursor, Gemini CLI). Audio via `<audio>` elements. — [README](https://github.com/heygen-com/hyperframes)
- A secondary aggregator reported v0.7.42 on 2026-07-08 (unverified). — [themenonlab blog (anecdotal/secondary)](https://themenonlab.blog/blog/heygen-hyperframes-video-as-code)

**Other 2026 newcomers (GitHub search results, 2026-10-22; license/stars from API, descriptions only)**
- VideoFlow (ybouane): Apache-2.0, 166 stars, last push 2026-09-16. TypeScript API compiles to a self-describing `VideoJSON` (width, height, fps, duration, layers) renderable in the browser (`@videoflow/renderer-browser`, MP4 via WebCodecs + MediaBunny), DOM live preview (`renderer-dom`), or on Node via Playwright Chromium. Supports audio tracks and `addCaptions`. Full schema not documented in README. — [GitHub README](https://github.com/ybouane/VideoFlow)
- Helios (BintzGavin): engine under Elastic License 2.0 (not OSI, forbids offering it as a hosted service); skills Apache-2.0; beta; production rendering is headless Chromium + Playwright + FFmpeg, WebCodecs for client-side export with audio mixing and captions. 122 stars. Elastic License 2.0 fails the permissive-license rule. — [README](https://github.com/BintzGavin/helios)
- fframes (dmtrKovalenko): MIT, 2,925 stars, last push 2026-10-22. Rust, SVG-tree frames, Skia GPU backend, links FFmpeg libav; local CLI; browser editor runs the compiled video as WASM for scrubbing only. Not a browser export path. — [README](https://github.com/dmtrKovalenko/fframes)
- nexu-io/html-video: Apache-2.0, 4,730 stars, "programmatic video for coding agents, HTML/CSS/data to MP4" (server-style, not inspected). Vandit1604/vawe (Apache-2.0, 8 stars), motionforge (MIT, React Remotion alternative, 93 stars) also exist. — [GitHub search](https://api.github.com/search/repositories?q=%22video+as+code%22+OR+%22programmatic+video%22+pushed:%3E2026-03-01&sort=stars&per_page=15)
- Browser editors (not engines): OpenCut (MIT, 95,614 stars, last push 2026-09-24, "open-source CapCut alternative") — [GitHub API](https://api.github.com/repos/OpenCut-app/OpenCut). Others reported by a search aggregator but NOT verified: Timeline Studio (MIT claimed, WebCodecs, portable `.timeline` project files with agent edit-plan validation), OpenReel (MIT claimed, WebCodecs/WebGPU, IndexedDB), FreeCut, VoidCut (ffmpeg-wasm). — [WebSearch results incl. dev.to](https://dev.to/martindelophy/how-i-built-a-local-first-ai-video-editor-with-webcodecs-webgpu-and-wasm-4lkn); verify each repo's LICENSE.
- Anecdotal: a 2026 roundup lists HyperFrames, Diffusion Studio, Creatomate, Shotstack as having direct agent workflows and Motion Canvas, VideoFlow, Manim as agent-friendly because source is structured code. — [Moda blog (vendor, anecdotal)](https://moda.app/blog/remotion-alternatives)

**p5.js / Three.js / Babylon capture**
- No dedicated source fetched. See Gaps. HyperFrames lists Three.js as a seekable animation option. — [HyperFrames README](https://github.com/heygen-com/hyperframes)

### Inferences
- Maturity ranking by recency and activity (GitHub pushes): active (pushed within 2 weeks): Mediabunny, HyperFrames, Manim, fframes, Rive. Moderate (1-4 months): Revideo, Motion Canvas, MoviePy, ffmpeg.wasm. Stale: Diffusion Studio core (11 mo), lottie-web (13 mo), editly (17 mo), Theatre.js (26 mo).
- The common pattern across new tools is "HTML/TS composition + headless Chrome + FFmpeg"; only Remotion web-renderer and VideoFlow have a documented browser-only MP4 path, both via Mediabunny. This is essentially what Introcut already plans (own renderer + Mediabunny CanvasSource).
- Introcut already has the hard parts these tools provide (deterministic frame function, canvas draw, WebCodecs export). The rest of these tools mostly add authoring convenience or server rendering.
- Render speed for 30 s at 1080x1920 (900 frames): I found NO sourced benchmarks. Headless-capture tools typically render far slower than real time; WebCodecs canvas export can run faster than real time on hardware encoders (not verified).

### Gaps
- Manim, MoviePy, editly export mechanics and FFmpeg dependency: standard knowledge, not re-verified from docs (verify).
- ffmpeg.wasm core license (LGPL vs GPL depending on x264/x265 build): the docs fetched did not say; check the ffmpeg-core license files (verify). Speed of ffmpeg.wasm for 1080x1920 30 s: no data (single-thread wasm is generally far slower than WebCodecs; verify).
- GSAP exact license text (fetches failed), anime.js license (wrong repo slug), dotLottie, p5.js/Three.js/Babylon capture approaches: not researched.
- Whether Diffusion Studio changed its license from MIT to MPL-2.0 plus watermark scheme (history unknown; verify releases/commit history).
- Last release dates and npm download counts: GitHub Releases pages were empty in the fetch; npm stats not retrieved.
- Exact Remotion 5.0 license text and release date; 5.0 not confirmed shipped.
- Timeline Studio / OpenReel / FreeCut / Videola licenses and JSON schemas: only seen in an aggregator search result.
- Hacker News/Reddit experience threads: not retrieved.

## 2. Which tools run entirely in a static browser app with zero server cost and export MP4, and which require a server/desktop

### Takeaway
Browser-only MP4 export is feasible with WebCodecs plus Mediabunny; confirmed examples are Remotion web-renderer (excluded), VideoFlow (Apache-2.0), Diffusion Studio core (MPL-2.0 with watermark caveat) and Helios's client-side path (Elastic License, excluded). Server/desktop-only: Revideo, Motion Canvas (as far as documented), HyperFrames, Manim, MoviePy, editly, fframes, Shotstack, Creatomate.

### Cited Findings
- Remotion web-renderer: browser, WebCodecs via Mediabunny, no server. — [docs](https://www.remotion.dev/docs/web-renderer)
- VideoFlow: `@videoflow/renderer-browser` exports MP4 entirely client-side via WebCodecs and MediaBunny; server renderer needs Node + Playwright Chromium. — [README](https://github.com/ybouane/VideoFlow)
- Diffusion Studio core: browser-based, WebCodecs encode/decode, Canvas 2D paint; needs COOP/COEP headers (cross-origin isolation), which matters for Cloudflare Pages hosting but is configurable via `_headers`. — [README](https://github.com/diffusionstudio/core)
- Helios: production render headless Chromium + Playwright + FFmpeg; client-side WebCodecs export path exists. — [README](https://github.com/BintzGavin/helios)
- Revideo: "runs anywhere Node and a headless browser run"; React Player only for preview. — [README](https://github.com/redotvideo/revideo)
- HyperFrames: Node 22+, FFmpeg, headless Chrome for MP4; browser used for preview only. — [README](https://github.com/heygen-com/hyperframes)
- fframes: Rust CLI + local GPU/FFmpeg libav; browser only scrubs a WASM build. — [README](https://github.com/dmtrKovalenko/fframes)
- editly via vidapi shows the server-wrapping pattern (FastAPI + Editly + FFmpeg). — [GitHub search](https://api.github.com/repos/moshehbenavraham/vidapi)
- Shotstack and Creatomate are paid cloud renderers. — [Shotstack](https://shotstack.io/pricing/), [Creatomate](https://www.creatomate.com/pricing)
- Mediabunny provides mux/demux and 25+ codecs through WebCodecs in the browser. — [README](https://github.com/vanilagy/mediabunny)

### Inferences
- Introcut's rules allow: Mediabunny (unmodified MPL-2.0), VideoFlow (Apache-2.0, as library or reference), ffmpeg.wasm only if the core build is LGPL-only and speed is acceptable.
- Disallowed or risky: Remotion (license), Helios (Elastic), Etro (GPL), Diffusion Studio (watermark/paid key to remove; MPL ok but commercial terms conflict), any Node/Python/Rust tool for export.
- WebCodecs availability: the web-renderer requires a browser with WebCodecs and lists minimum versions; Safari/Firefox support for encoding is a risk (not researched).

### Gaps
- No benchmark of 30 s 1080x1920 export time for any browser tool.
- Audio encode support in WebCodecs per browser (AAC on Firefox/Linux) not researched.

## 3. Declarative level, JSON scene formats an LLM can generate safely, and sandboxing options for LLM-written code

### Takeaway
Most code-first tools are imperative code (React/TSX, TypeScript generators, Python, Rust, HTML+GSAP), meaning an LLM must write executable code. The JSON-first ones are VideoFlow (`VideoJSON`), Shotstack/Creatomate (cloud), editly (JSON5 spec) and Introcut's own project JSON. For Introcut, an LLM should emit validated JSON (Zod) through ops; running LLM code is unnecessary.

### Cited Findings
- VideoFlow compiles a TypeScript API into a self-describing `VideoJSON` (width, height, fps, duration, layers) that can be stored, sent, and passed to any renderer. — [README](https://github.com/ybouane/VideoFlow)
- HyperFrames compositions are HTML + data attributes + GSAP timelines, "no proprietary timeline format", no JSON. — [README](https://github.com/heygen-com/hyperframes)
- Helios compositions are web pages exposing `window.renderAt(t)`; no JSON format. — [README](https://github.com/BintzGavin/helios)
- Revideo and Motion Canvas are TypeScript code (generator functions). — [Revideo](https://github.com/redotvideo/revideo), [Motion Canvas](https://github.com/motion-canvas/motion-canvas)
- Remotion props are JSON inputs to React components (code defines the template; JSON is data) (background; Remotion docs not fetched here).
- Agent-oriented repos exist for code-first tools: HyperFrames ships 7 agent skills; Remotion has community skills repos; Helios has agent skills under Apache-2.0. — [HyperFrames README](https://github.com/heygen-com/hyperframes), [Helios README](https://github.com/BintzGavin/helios), [GitHub search](https://api.github.com/search/repositories?q=%22video+as+code%22+OR+%22programmatic+video%22+pushed:%3E2026-03-01&sort=stars&per_page=15)
- Sandbox options (status facts): quickjs-emscripten is MIT-labelled? API returned NOASSERTION, 1,732 stars, last push 2026-07-23 (verify license; believed MIT) — [GitHub API](https://api.github.com/repos/justjake/quickjs-emscripten). The TC39 ShadowRealm proposal repo was last pushed 2025-02-10 and is described as "ECMAScript Proposal, specs, and reference implementation for Realms" — no evidence of browser shipping. — [GitHub API](https://api.github.com/repos/tc39/proposal-shadowrealm)

### Inferences
- Safest LLM path: JSON validated against a Zod schema (Introcut's existing design, PLAN §5) with ops. No code execution, no sandbox needed. This is the main argument against adopting a code-first engine.
- If Introcut ever lets the LLM write code (e.g. custom motion templates), the layering would be: sandboxed `<iframe sandbox>` (no `allow-same-origin`) or a dedicated Web Worker with no DOM and a message-only API; for stronger isolation QuickJS compiled to WASM (no access to fetch/DOM by default); ShadowRealm should not be relied on (unshipped as far as found). Treat as design suggestions, not verified specs. Also consider a restricted expression DSL (e.g. easing/keyframe formulas) instead of general JS.
- Compared to the code-first options, a JSON scene format scores best on LLM reliability: schema-constrained decoding, validation errors fed back, easy undo via ops.

### Gaps
- Not verified from primary docs: iframe sandbox attribute semantics, Worker limits, SES/Endo (Hardened JS) as another option.
- No data on LLM success rates generating Remotion/HyperFrames/VideoFlow compositions (only vendor claims).
- VideoFlow's full JSON schema is not published in the README; unclear if there is a JSON Schema file.

## 4. Is a "video-as-data" standard emerging, and is any of it MIT/Apache and usable?

### Takeaway
No dominant standard for AI-authored composition exists. The nearest formal one is OpenTimelineIO (Apache-2.0), which models editorial cuts/tracks, not text animation or effects. Vendor JSON (Shotstack, Creatomate), VideoFlow's VideoJSON and Timeline Studio's `.timeline` are single-project formats.

### Cited Findings
- OpenTimelineIO (Academy Software Foundation): Apache-2.0, 2,032 stars, last push 2026-10-17. — [GitHub API](https://api.github.com/repos/AcademySoftwareFoundation/OpenTimelineIO)
- Shotstack and Creatomate offer JSON edit APIs, but they are commercial cloud services; schema licensing unverified (repo URL 404). — [Shotstack pricing](https://shotstack.io/pricing/)
- VideoFlow `VideoJSON` is Apache-2.0 and renderer-agnostic by design. — [README](https://github.com/ybouane/VideoFlow)
- Timeline Studio reports portable `.timeline` project files with revisioned edit plans (unverified aggregator claim). — [dev.to / search result](https://dev.to/martindelophy/how-i-built-a-local-first-ai-video-editor-with-webcodecs-webgpu-and-wasm-4lkn)
- Lottie is a JSON animation format (lottie-web MIT) usable as an embedded asset type, not a project format. — [lottie-web](https://api.github.com/repos/airbnb/lottie-web)

### Inferences
- OpenTimelineIO could be an optional import/export adapter (cuts, tracks, clips) for interop with DaVinci/Premiere users, but it cannot represent Introcut's captions/animation/AI-diagnosis semantics. Low priority for V1.
- Lottie is worth supporting as an asset type for stickers/animated overlays (MIT runtimes), not as the project spec.
- Introcut's own JSON schema is a reasonable bet; the sensible hedge is to keep it simple and make it map cleanly to VideoJSON/Shotstack-like concepts (tracks, clips, start/length, transforms) so a converter is cheap.

### Gaps
- MLT XML (license LGPL/GPL, used by Kdenlive/Shotcut): API fetch 404'd; not verified.
- Remotion props, Rive file format licensing, Shotstack schema license, and any 2026 standardization effort (e.g. an agent-video JSON spec): not found.

## 5. Recommendation for Introcut

### Takeaway
Keep Introcut's own Canvas renderer and project JSON. Use Mediabunny for the muxing/encoding (already planned). Do not adopt Remotion, Helios, Etro, or Diffusion Studio; treat VideoFlow (Apache-2.0) and Remotion's web-renderer architecture as reference designs, and optionally add narrow adapters (Lottie playback, OpenTimelineIO export) later.

### Cited Findings
- The two browser-only MP4 pipelines that exist (Remotion web-renderer, VideoFlow) both encode through Mediabunny and WebCodecs, the same plan Introcut already has. — [Remotion docs](https://www.remotion.dev/docs/web-renderer), [VideoFlow README](https://github.com/ybouane/VideoFlow)
- Remotion web-renderer limits: only a subset of CSS, z-index ignored, CSS web fonts not embedded: poor fit for caption/text-heavy 9:16 shorts compared with a purpose-built canvas renderer. — [limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- Mediabunny is MPL-2.0, actively maintained (pushed 2026-10-21), 7.4k stars. — [GitHub API](https://api.github.com/repos/vanilagy/mediabunny)
- Disqualifiers: Remotion custom license ([LICENSE.md](https://raw.githubusercontent.com/remotion-dev/remotion/HEAD/LICENSE.md)), Helios Elastic License 2.0 ([README](https://github.com/BintzGavin/helios)), Etro GPL-3.0 ([API](https://api.github.com/repos/etro-js/etro)), Diffusion Studio watermark/paid-key model ([README](https://github.com/diffusionstudio/core)).
- Headless-browser engines (Revideo MIT, HyperFrames Apache-2.0, fframes MIT, Motion Canvas MIT) are permissive but need Node/FFmpeg/Chromium, so they violate "browser-only, zero server". — [Revideo](https://github.com/redotvideo/revideo), [HyperFrames](https://github.com/heygen-com/hyperframes), [fframes](https://github.com/dmtrKovalenko/fframes)

### Inferences
- Reasons to keep own renderer: (1) already built and tied to `renderFrame` shared by preview and export; (2) no permissive engine offers both browser MP4 export and rich caption/animation; (3) JSON-first design is the safest for LLM control and satisfies the "human edits are locks" ops model, which code-first tools do not provide; (4) avoids dependency on young projects (VideoFlow 166 stars).
- Concrete actions: (a) study VideoFlow's VideoJSON and renderer-browser (Apache-2.0) for schema/audio-mixing ideas; (b) read Mediabunny's CanvasSource + AudioBufferSource docs for the exporter; (c) do not run LLM-written code; if custom templates are wanted later, use sandboxed iframe/Worker or QuickJS-wasm; (d) optionally offer HyperFrames-style "agent skills" docs so users' own coding agents can author Introcut JSON; (e) for owner's "generated through code" idea: Introcut already is video-from-JSON; the LLM producing that JSON is the equivalent.
- Possible later add-ons: Lottie (MIT) overlays; OpenTimelineIO export (Apache-2.0).
- ffmpeg.wasm only as an optional fallback for formats WebCodecs cannot handle, after confirming the core build license (LGPL-only) and cost in bundle size.

### Gaps
- Real-world render time of an own-canvas + Mediabunny pipeline at 1080x1920/30 fps/30 s on typical user hardware is not benchmarked here (belongs to Introcut gate checks).
- No verification of Safari/Firefox WebCodecs encoding coverage.
- Would need a check of whether Remotion 5.0 has shipped and whether its terms alter Mediabunny usage (low relevance since Introcut uses Mediabunny directly).
