# Rendering engines, determinism and export for code-generated story animation (Introcut), as of 2026-10-22

Method note: about 20 tool calls (web search and fetch). Many fetches returned only summaries from a small model and several sources are third-party blogs. Primary-source license checks that succeeded are marked "(LICENSE file)". Anything without a source is in Inferences or Gaps and should be read as "verify". No benchmark numbers were found for Introcut-like scenes (1080x1920, integrated GPU, SwiftShader); none are invented here.

## 1. Option-by-option: license, size, capabilities

### Takeaway
All candidate engines except GSAP (and Theatre.js Studio) are bundle-able under MIT, Apache-2.0 or BSD. GSAP's current license is proprietary "free", not open source, and has a Webflow-competition clause, so it should not be bundled into an MIT app. Rive and Lottie are MIT, Skia/CanvasKit is BSD-3-Clause, Babylon.js is Apache-2.0, and PixiJS and three.js are MIT.

### Cited Findings
- PixiJS: "The MIT License", Copyright (c) 2013-2023 Mathew Groves, Chad Engler (LICENSE file, dev branch) — [pixijs LICENSE](https://raw.githubusercontent.com/pixijs/pixijs/dev/LICENSE)
- three.js: "The MIT License", Copyright 2010-2026 three.js authors (LICENSE file) — [three.js LICENSE](https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE)
- Skia (the engine under CanvasKit): BSD 3-Clause, Copyright 2011 Google Inc. (LICENSE file). CanvasKit is Skia's WASM build; I verified the Skia repo license, not the npm `canvaskit-wasm` package file itself — [skia LICENSE](https://raw.githubusercontent.com/google/skia/main/LICENSE)
- Babylon.js: "Apache License, Version 2.0" (license.md) — [Babylon.js license](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/license.md)
- Rive WASM runtime (rive-wasm repo): MIT per repository page; page gives no WASM size figures and does not confirm offscreen/deterministic stepping, only "a low-level API that allows you to drive your own render loop" — [rive-wasm](https://github.com/rive-app/rive-wasm)
- lottie-web: MIT; renderers `svg`, `canvas`, `html`; no archive/deprecation notice visible on the repo page, 788 open issues, 70 open PRs (2026 footer, no last-commit date shown) — [lottie-web](https://github.com/airbnb/lottie-web)
- Theatre.js: `@theatre/core` is Apache-2.0; `@theatre/studio` is AGPL-3.0; the final bundle includes only core; 1.0 development temporarily in a private repo with a promise that license stays OSS — [theatre-js/theatre](https://github.com/theatre-js/theatre)
- GSAP: current license is the "Standard 'No Charge' GSAP License", classed by a license database as "Proprietary Free" (not open source). It forbids use "in tools that allow users to build visual animations without code" where that "encourages, induces, or materially assists in creating a solution that competes with Webflow's" visual animation capabilities, and forbids reverse engineering to create competing products. Permitted use is on "any website, web application, or digital interface" and includes companies that compete with Webflow elsewhere. There is no redistribution clause in the text I could read. Webflow's blog says GSAP is now free including commercial use, but the gsap.com version says a Business membership is needed if end users are charged a usage/access/license fee. The copies found carry a 2025 identifier; I could not fetch the gsap.com license page itself (fetches returned only a banner) — [Wind River license entry](https://open.windriver.com/info/uni-license-list/licenses/gsap-standard-no-charge-2025.html); [license search summary / Pinegrow thread](https://forum.pinegrow.com/t/gsap-has-been-acquired-by-webflow/9906); [Webflow announcement](https://webflow.com/blog/gsap-becomes-free)
- PixiJS size: one third-party guide says roughly 450 KB minified for the full library, tree-shakeable via ES module imports; official v8 notes say a single `pixi.js` import root improves tree shaking. No official size number found (treat 450 KB as unverified) — [abratabia PixiJS guide](https://abratabia.com/pixijs/); [Pixi v8 beta post](https://pixijs.com/blog/pixi-v8-beta)
- PixiJS v8 WebGPU backend falls back to WebGL when WebGPU is unavailable, and the official post warns WebGPU does not automatically beat WebGL; it may help scenes with many batch breaks (filters, masks, blend modes). Newer coverage describes v8.20.0 with WebGPU-focused features, while a Japanese article names 8.19.0 as latest in July 2026 (conflicting version info) — [Pixi v8 launch](https://pixijs.com/blog/pixi-v8-launches); [gamedev.net v8.20.0](https://gamedev.net/news/5221-pixijs-v8200-released/)
- Flutter CanvasKit bundle sizes (indicative only, single blog benchmark, Flutter 3.47.4): Chromium CanvasKit variant 1,564 KB JS+Wasm (1,977 KB total brotli), full variant 2,281 KB (2,695 KB total brotli); skwasm about 330 KB smaller. Image codecs and ICU data are left to the browser in the Chromium variant. No size data for Paragraph/Devanagari — [startdebugging.net, Sept 2026](https://startdebugging.net/2026/09/canvaskit-vs-skwasm-for-flutter-web-in-2026/)
- Skia quickstart shows a ParagraphBuilder API in CanvasKit — [Skia CanvasKit quickstart](https://skia.org/docs/user/modules/quickstart/)
- Complex-script text (Devanagari) needs a shaping engine such as HarfBuzz; drawing is a separate step from shaping — [HarfBuzz overview](https://en.wikipedia.org/wiki/HarfBuzz)
- Search found nothing on how PixiJS's own Text/BitmapText handles Devanagari shaping — see Gaps.

### Inferences
- Because Introcut's existing Canvas 2D path already draws text through the browser's native text shaper (verify in repo: the last commit mentions a "Devanagari layout fix"), the safest rule is: any text (captions, titles, Devanagari) stays on a Canvas 2D layer, and any WebGL layer consumes it as a texture. This avoids shipping HarfBuzz/CanvasKit-Paragraph (the latter is large, see Flutter numbers above).
- GSAP is out for an MIT-bundled library: not OSI-open, scope clause is vague, and whether an "AI video producer" counts as a "tool that allows users to build visual animations without code" is a legal question, not an engineering one. Use MIT alternatives or a custom system (section 5).
- Theatre.js core (Apache-2.0) is usable, but Studio (AGPL) must not be shipped; also the repo's 1.0 path is private and it is designed for hand-authored sheets rather than a JSON-spec pure function. Low value for Introcut.
- Rive and Lottie are only worth adding if users import `.riv`/Lottie assets; both are MIT but add a runtime and a second time-model to keep deterministic.

### Gaps
- Official bundle sizes (gzip) for Pixi v8, three.js (core + the pieces needed), Babylon, Rive WASM, CanvasKit: not found from primary sources. Measure with the app's own bundler output (see test plan).
- License of `canvaskit-wasm` npm package file, ogl/regl/twgl, Phaser, react-three-fiber/drei, popmotion/motion, anime.js, @react-spring, pmndrs/postprocessing: not verified (one LICENSE fetch for pmndrs/postprocessing 404'd). Training-data memory says MIT for most and Zlib for pmndrs/postprocessing, but this is unverified: verify at repo before adding to CREDITS.md.
- Phaser: not researched (game-oriented; likely redundant with Pixi).
- Whether PixiJS v8 Text shapes Devanagari (it rasterizes through a 2D canvas internally per training memory: verify).

## 2. Performance, memory, WebGPU availability, context loss

### Takeaway
WebGPU is now broadly available (about 83-88% global per caniuse in 2026) but Firefox coverage is platform-limited and WebGPU does not by itself make rendering faster, so the export path should be WebGL2-first (via libraries that fall back automatically) with WebGPU as an optional later optimisation. I found no dated benchmark for 1080x1920 frame times on integrated GPUs or SwiftShader; those numbers must come from Introcut's own test plan.

### Cited Findings
- caniuse WebGPU (fetched Oct 2026, via summarising tool): about 87.82% global (85.8% full + 2.02% partial); Chrome/Edge from 113; Opera from 99; Safari desktop "partial" in 26.0 to 27.1; Safari iOS from 26.0; Chrome for Android 155; Samsung Internet 24+. The same summary says Firefox desktop "disabled by default in 63 to 161" and Firefox Android disabled in 158 — [caniuse WebGPU](https://caniuse.com/webgpu)
- Conflict on Firefox: Firefox 141 enabled WebGPU on Windows (July 2025) and Firefox 147 (13 Jan 2026) on Apple Silicon Macs; Linux, Intel Macs and Android lacked it in stable as of mid-2026 — [Simon Willison on Firefox 141](https://simonwillison.net/2025/Jul/16/webgpu-firefox); [MacMagazine on Firefox 147](https://macmagazine.com.br/post/2026/01/13/firefox-147-inclui-suporte-a-webgpu-em-macs-com-apple-silicon-melhorias-no-pip-e-mais/); [buildmvpfast, July 2026](https://www.buildmvpfast.com/blog/threejs-webgl-to-webgpu-renderer-migration-2026). The caniuse summary ("disabled by default through 161") contradicts this; treat Firefox as "Windows and Apple Silicon only, verify"
- A web.dev post dated 25 Nov 2025 states WebGPU is supported in Chrome, Edge, Firefox and Safari — [web.dev](https://web.dev/blog/webgpu-supported-major-browsers?hl=ja)
- three.js WebGPURenderer can fall back automatically to a WebGL2 backend (official manual); `forceWebGL: true` forces the fallback for testing; needs `await renderer.init()` before the first render when using a custom loop (black canvas otherwise); custom `ShaderMaterial`/`onBeforeCompile` code does not run on the WebGPU backend and requires TSL — [three.js WebGPURenderer manual](https://threejs.org/manual/en/webgpurenderer.html); [buildmvpfast](https://www.buildmvpfast.com/blog/threejs-webgl-to-webgpu-renderer-migration-2026)
- Third-party performance claims (unverified, vendor-blog level): WebGL 4x faster than WebGPURenderer on many separate meshes as of r176 (May 2025, old); about 30% lower memory under WebGPURenderer in one draw-call-heavy scene; order-of-magnitude particle gains only with compute shaders — [utsubo, 100 tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [buildmvpfast](https://www.buildmvpfast.com/blog/threejs-webgl-to-webgpu-renderer-migration-2026)
- With `preserveDrawingBuffer: false` a WebGL canvas is cleared after the buffer swap, so reading it later gives blank output unless capture happens in the same task as the draw — [Chromium review on capture timing](https://codereview.chromium.org/2627793003)
- Search found no source on WebGL context-loss recovery, texture memory limits, or SwiftShader frame times (see Gaps).

### Inferences
- Memory budget (estimate, not measured): one 1080x1920 RGBA texture/framebuffer is 1080*1920*4 = about 8.3 MB. A pipeline with scene target + 2 ping-pong post targets + bloom mip chain is on the order of 40-60 MB of GPU memory, small versus a typical 2 GB budget. The real risk is source art: each decoded 2048x2048 RGBA sprite sheet is 16 MB (plus mipmaps +33%). For a 30 s, 9:16 short, texture atlases (not frames) dominate. Frames are never held: export streams each frame to the encoder.
- Do not hold decoded frames of all 900 frames (30 s x 30 fps x 8.3 MB = about 7.5 GB); the existing streaming design with Mediabunny backpressure avoids this. Keep `await source.add()` in the loop.
- Low-RAM machine: render at 1080x1920 only at export; cap preview at 540x960 (already done); prefer ImageBitmap with explicit `.close()`; build mip-less textures for flat sprites; unload scene assets between scenes. Treat context loss as expected: export loop should catch `webglcontextlost`, rebuild resources, and resume from the current frame index (possible only because rendering is a pure function of time; see section 3).
- For Introcut the main WebGPU benefit (compute particles) is not needed for a 30 s short with at most thousands of particles. Recommendation: ship WebGL2; allow WebGPU only when a library adds it for free and parity tests pass.

### Gaps
- Real frame times at 1080x1920 on Intel UHD/Iris, AMD integrated, and CPU-only software WebGL: no dated benchmark found. Must be measured.
- WebGL context-loss behaviour under memory pressure on Windows low-RAM machines, and `WEBGL_lose_context` test patterns: not covered by found sources.
- Max texture size and memory caps per browser: not researched (MAX_TEXTURE_SIZE is typically 8192-16384 on desktop integrated GPUs per training memory; verify with `gl.getParameter`).
- Whether Chrome's headless/software WebGL (SwiftShader) is enabled for users without GPU acceleration in 2026: not researched.

## 3. Determinism and preview/export parity; reading pixels into Mediabunny

### Takeaway
Mediabunny's `CanvasSource` accepts both `HTMLCanvasElement` and `OffscreenCanvas` and takes explicit timestamps in seconds, so export timing is fully under Introcut's control and independent of requestAnimationFrame. For WebGL canvases the safe pattern is to draw then call `add()` in the same task (or use `preserveDrawingBuffer: true`, or composite into a 2D canvas first).

### Cited Findings
- `CanvasSource` constructor: `canvas: HTMLCanvasElement | OffscreenCanvas`, throws TypeError otherwise. `add(timestamp, duration, encodeOptions?)` wraps the canvas in a `VideoSample` with the given timestamp and duration (seconds) and closes it after encoding; the `VideoFrame` is created inside the encoder wrapper via `toVideoFrame()`. `add()` returns a promise that provides backpressure when the encoder is overloaded; `{ keyFrame: true }` option exists; close the source when done — [Mediabunny source, media-source.ts](https://raw.githubusercontent.com/Vanilagy/mediabunny/main/src/media-source.ts); [Mediabunny media sources guide](https://mediabunny.dev/guide/media-sources)
- Encoder wrapper restores precise timing through a `preciseTimings` lookup (VideoEncoder uses microseconds) and has a Firefox AVC chunk timestamp workaround — [Mediabunny source](https://raw.githubusercontent.com/Vanilagy/mediabunny/main/src/media-source.ts) (read first 100,000 of 105,499 chars)
- Cleared-after-swap behaviour of WebGL canvases with `preserveDrawingBuffer=false` — [Chromium review](https://codereview.chromium.org/2627793003)
- A WPT test exists for `VideoFrame` texImage (VideoFrame to WebGL texture) in Firefox's tree, showing the reverse direction is standardised; the search did not confirm canvas-to-VideoFrame specifics for WebGL — [searchfox WPT](https://searchfox.org/firefox-main/source/testing/web-platform/tests/webcodecs/videoFrame-texImage.any.js)
- three.js WebGPURenderer: custom render loops must `await renderer.init()` first; `setAnimationLoop` handles it — [buildmvpfast](https://www.buildmvpfast.com/blog/threejs-webgl-to-webgpu-renderer-migration-2026)

### Inferences
- Rule set for parity (engineering practice, not sourced; verify each in tests):
  1. `renderFrame(tMs)` is a pure function of (project JSON, tMs, loaded assets). No `performance.now()`, no `Date.now()`, no `requestAnimationFrame` delta inside; preview rAF only chooses which tMs to ask for; export steps `tMs = i * 1000/fps`.
  2. Seeded PRNG (for example mulberry32) for particles and grain, seeded by (sceneId, particleIndex), and compute particle state analytically from t (position = f(seed, t)) instead of integrating frame by frame. This makes random access and resume after context loss free and removes physics non-determinism. If a physics engine is ever added, use a fixed-step integrator with checkpoints.
  3. Preload and fully decode all assets (`await document.fonts.load(...)`, `createImageBitmap`, `await img.decode()`) before frame 0; fail the export if any asset is not ready rather than drawing a placeholder.
  4. Render the same internal resolution for preview and export only if cheap; otherwise render preview as a scaled `renderFrame` with all pixel-based params (blur radius, grain size, outline width, shadow offsets) specified in 1080x1920 units and multiplied by scale. Grain and outlines are the main parity breakers (noise should be sampled in output-pixel space or seeded per source pixel to avoid shimmer differences).
  5. Fix `devicePixelRatio` out of the pipeline: use explicit canvas width/height, ignore DPR.
  6. Use `premultipliedAlpha` consistently: Canvas 2D is premultiplied; WebGL texture upload with `UNPACK_PREMULTIPLY_ALPHA_WEBGL` true and blend `ONE, ONE_MINUS_SRC_ALPHA`; avoids dark fringes at sprite edges.
  7. Colour: render in sRGB 8-bit end to end for V1; if any linear-light bloom is added, convert on the shader and tag the output as BT.709; compare preview and export with a pixel-diff test (see test plan).
  8. For WebGL: draw and call `source.add()` in the same JS task, or set `preserveDrawingBuffer: true` for the export canvas only. Alternative that makes the 2D HUD/captions interop trivial: render WebGL into its own canvas, then `ctx2d.drawImage(glCanvas, 0, 0)` onto the final 2D canvas in the same task, draw captions on top, and hand the 2D canvas to `CanvasSource`. The extra copy is a GPU-to-GPU/CPU blit; its cost is unmeasured (verify).
- Using `OffscreenCanvas` in a worker lets export run without blocking the UI; this is compatible with `CanvasSource` per the source above. Whether the 2D HUD layer can run in the same worker depends on fonts (workers have `FontFace` via `self.fonts`; verify Devanagari font loading there).

### Gaps
- Exact current Chrome/Firefox/Safari behaviour of `new VideoFrame(webglCanvas)` and `OffscreenCanvas.transferToImageBitmap()` with `preserveDrawingBuffer: false`: no authoritative current source found. Needs a 20-line experiment per browser.
- Measured cost of copying a WebGL canvas into a 2D canvas at 1080x1920 versus passing the WebGL canvas directly to `CanvasSource`: not found.
- Colour management differences between Canvas 2D and WebGL canvases and the colour tags that Mediabunny/VideoEncoder put in the MP4 (BT.709 flags): not researched.
- Antialiasing parity (MSAA on WebGL vs 2D canvas AA at different sizes): not researched.

## 4. Animation timing systems for a JSON-driven pure-function renderer

### Takeaway
Do not use GSAP (proprietary no-charge license). For a renderer that must be a pure function of time, a small custom keyframe-and-easing evaluator driven by the project JSON is the best fit; MIT libraries such as anime.js or motion can supply easing curves but their timelines are built around wall-clock playback.

### Cited Findings
- GSAP license is proprietary-free, with a Webflow-competition prohibition and no redistribution clause (see section 1) — [Wind River entry](https://open.windriver.com/info/uni-license-list/licenses/gsap-standard-no-charge-2025.html)
- Theatre.js core Apache-2.0; Studio AGPL-3.0 (see section 1) — [theatre-js/theatre](https://github.com/theatre-js/theatre)
- No primary-source license fetch succeeded for motion (Framer Motion/popmotion), anime.js, @react-spring — Gaps.

### Inferences
- Design (my recommendation): `value(t) = interpolate(keyframes, t)` with `{t, v, ease}` keys; easing set = linear, cubic-bezier, ease in/out (Penner subset), spring as a closed-form damped oscillator function of t (not stepped), step, and hold. Seeded noise for shake: `shake(t) = sum of sin with seeded phases` or value noise with integer-lattice hash, so it is a pure function of t. About 200-300 lines, no dependency, and it works identically in preview and export.
- Keep React/spring libraries out of the render path: they run on rAF with wall-clock and mutate state, which breaks frame-exact export. They are fine for the editor UI only.
- Stagger/sequence helpers (text-per-word reveal, stagger offsets) are trivially expressed as per-item time offsets in the JSON.

### Gaps
- Licenses and current maintenance status of motion/popmotion, anime.js, @react-spring: not verified (training memory says MIT for all; verify). Also whether anime.js v4 and motion expose a seek(t)/manual time API suitable for deterministic stepping: not researched.

## 5. Camera, cinematography, post effects and cost

### Takeaway
I found no cited data on costs for these effects. Everything below is engineering reasoning (marked estimate) and must be validated by the test plan.

### Cited Findings
- PixiJS notes WebGPU may help scenes with many batch breaks such as filters, masks and blend modes, implying those are the expensive features in a 2D scene graph — [Pixi v8 launch](https://pixijs.com/blog/pixi-v8-launches)
- three.js shader code: three.js itself is MIT (LICENSE file), so its `examples/jsm` post-processing passes are MIT-licensed along with the repo — [three.js LICENSE](https://raw.githubusercontent.com/mrdoob/three.js/dev/LICENSE) (the examples folder inheriting the repo license is an inference; verify per-file headers)
- three.js WebGPU post-processing uses TSL, a node material system that compiles to WGSL or GLSL; custom GLSL passes do not run on WebGPU — [utsubo](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [buildmvpfast](https://www.buildmvpfast.com/blog/threejs-webgl-to-webgpu-renderer-migration-2026)

### Inferences (estimates, unmeasured)
- Camera: model a virtual camera as `{x, y, zoom, rotation, shake}` evaluated from keyframes; apply as a single `ctx.setTransform` for the world layer in Canvas 2D (almost free) and per-layer parallax factor (`layer.offset = cam.pos * (1 - depth)`) to produce parallax. Cost: negligible.
- Rack focus / depth-of-field: in 2D, blur each depth layer by `|depth - focus|`; cost is one blur per layer (Canvas 2D `ctx.filter = 'blur()'` is CPU-heavy on some browsers; verify). In WebGL, a two-pass separable blur per layer at half resolution is cheap. Limit to 2-3 blur levels (baked blurred sprite variants for static backgrounds are free at runtime).
- Motion blur: subframe accumulation multiplies render time by N (N=4 means 4x); only apply on whip pans/fast moves, per scene; at 70 fps flat 2D baseline, a 4-sample accumulation would be about 17 fps (arithmetic from the user's own figure, not measured with effects).
- Transitions (whip pan, zoom, glitch, match cut): in Canvas 2D a transition between two scenes needs two offscreen canvases composed (2 render passes plus draw); glitch/RGB-split can be done with channel-offset drawImage using `globalCompositeOperation: 'lighter'` or in a fragment shader in one pass. WebGL shader transitions are cheaper per effect once the scene is a texture.
- Film grain: pre-generated seeded noise tile (for example 256x256, several variants selected by frame index) drawn with `overlay`/`soft-light` blend; cost very low in both Canvas 2D and WebGL. Vignette: one pre-baked radial gradient image; very low. Bloom: Canvas 2D approximation = downscale to 1/4, blur, draw back with `lighter`; WebGL = threshold + mip blur chain. Chromatic aberration: 3 offset draws in 2D, one shader pass in WebGL. Colour grading LUT: practical only in WebGL (a 2D canvas per-pixel loop in JS at 1080x1920 is about 2 M pixels per frame, likely too slow; verify). Toon outlines: for 2D characters, stroke paths; for 3D, inverted-hull or Sobel edge shader.
- Cheap-first plan: vignette, grain, colour tint, camera shake, parallax, simple glow all stay in Canvas 2D; LUT grading, bloom with real thresholding, DOF, and shader transitions are the first features that justify WebGL.

### Gaps
- Real cost figures for `ctx.filter` blur, `globalCompositeOperation` blends, and `getImageData`-based effects at 1080x1920: not found.
- The `pmndrs/postprocessing` license (believed Zlib) not verified because the LICENSE fetch 404'd.
- Shader-code licensing for individual community shaders (for example gl-transitions is believed MIT): not researched; verify before copying any shader.

## 6. Existing projects to learn from

### Takeaway
My research budget covered licenses and capabilities more than project post-mortems, so this section is thin. Relevant leads to read next are given with what I could and could not confirm.

### Cited Findings
- Mediabunny itself (used by Introcut) is designed around `CanvasSource` for "repeatedly redrawn canvas" render loops with backpressure, which matches a frame-by-frame export design — [Mediabunny media sources](https://mediabunny.dev/guide/media-sources)
- Rive's runtime exposes a low-level API for driving your own render loop, which suggests frame-by-frame advance is possible (not confirmed) — [rive-wasm](https://github.com/rive-app/rive-wasm)

### Inferences
- Pattern from the three.js ecosystem that is well known (training memory, verify): CCapture.js-style capture hooks `requestAnimationFrame`/`Date.now` to force deterministic stepping. Introcut does not need this because its renderer is a pure function of time and takes tMs directly.

### Gaps
- Not researched: Diffusion Studio/VideoFlow (previously covered per the brief), Motion Canvas browser rendering notes, Rive/Lottie-to-video converters, three.js + WebCodecs example repositories, and what failed in them. A follow-up pass should read their issues for readback, memory-leak and colour-space bugs.

## 7. Recommendation: staged engine strategy, dependencies, risks, test plan

### Takeaway
Keep Canvas 2D as the compositing spine and text/HUD layer; add WebGL only behind a layer interface, starting with a small custom WebGL2 post-effects pass (no library) or, if 3D is truly in scope, three.js (MIT) rendered into its own canvas and composited as a layer. Do not adopt PixiJS, Babylon, Phaser or Skia/CanvasKit for V1: they either duplicate the Canvas 2D renderer or add large weight. All parts are estimates and rest on the cited license facts above.

### Cited Findings
- Licenses allowing bundling: MIT (PixiJS, three.js, Rive, lottie-web), BSD-3-Clause (Skia), Apache-2.0 (Babylon.js, Theatre.js core) — see section 1 sources
- GSAP and Theatre.js Studio are not bundle-able in an MIT product — [Wind River GSAP entry](https://open.windriver.com/info/uni-license-list/licenses/gsap-standard-no-charge-2025.html); [theatre-js](https://github.com/theatre-js/theatre)
- three.js WebGPURenderer can fall back to WebGL2 with the same API — [three.js manual](https://threejs.org/manual/en/webgpurenderer.html)

### Inferences
**Staged strategy**
- Stage 0 (now, no new dependency): add a `Layer` interface `{ id, render(ctx2d | target, tMs, env) }`; `renderFrame` becomes: camera transform, background layers (parallax), character layers, particles (analytic, seeded), cheap 2D post (vignette, grain, tint), captions/HUD last. Add the custom keyframe/easing module and seeded PRNG. Add the pixel-diff preview-vs-export test.
- Stage 1: richer 2D in Canvas 2D (sprite/puppet characters with bone-less transforms, parallax, particles, camera moves, shake). Move export to an OffscreenCanvas worker only if the main thread stutters (verify need; export at 70 fps already).
- Stage 2 (when WebGL features are needed: LUT grade, bloom, DOF, shader transitions, toon outline): add a `WebGLPostLayer` that takes the 2D scene canvas as a texture and runs a fixed chain of fragment shaders, output into a second canvas which is composited (or the final canvas) before captions. Prefer hand-written WebGL2 (about 300-500 lines, zero dependency, MIT original code) over a library for a fixed effect chain. Optionally use `ogl` or `twgl` (believed MIT; verify) if boilerplate grows.
- Stage 3 (only if 3D low-poly/toon is confirmed in scope): add three.js (MIT) with `WebGLRenderer` (not WebGPURenderer) for export determinism and simplicity; render to its own canvas, composite as a layer. Lazy-load via dynamic import so 2D-only projects pay nothing. Use three's own MIT post-processing passes only if needed; avoid react-three-fiber (React reconciler loop, rAF driven) in the export path, keep it out of the renderer.
- Stage 4 (optional, later): WebGPU only via three.js/Pixi fallback behavior if profiling shows a bottleneck; keep WebGL2 as the baseline.
- Not recommended for V1: PixiJS (second 2D scene graph overlapping with your own renderer; text shaping unverified), Babylon.js (heavy, Apache-2.0 fine but overkill), Phaser (game framework), CanvasKit (about 1.5 MB+ WASM per Flutter numbers; only worth it for Skia-specific vector features), Rive/Lottie (only for importing user-supplied assets).

**Minimum extra dependencies**
- Stage 0-2: none (all custom code). Stage 3: `three` (MIT, verified LICENSE file). Add each to CREDITS.md with the license per project rules.

**Risks**
- Preview/export mismatch from scale-dependent effects; mitigated by 1080x1920-unit params and pixel-diff tests.
- WebGL canvas readback blank frames (`preserveDrawingBuffer=false`); mitigated by same-task `add()` or 2D copy.
- Context loss on low-RAM machines; mitigated by resumable pure-function rendering and resource rebuild.
- WebGPU fragmentation (Firefox Windows/Apple Silicon only, Safari partial per caniuse); mitigated by WebGL2 baseline.
- Licensing creep (GSAP, Theatre Studio, any shader copied from the web); mitigated by CREDITS.md review.
- Fonts: Devanagari shaping lost if text is moved into a WebGL text system; mitigated by keeping text in Canvas 2D.

**Performance test plan (acceptance thresholds are proposals, not sourced)**
1. Baseline: current flat 2D scene, 1080x1920, 300 frames, record ms/frame p50/p95 on (a) owner's low-RAM PC, (b) an integrated-GPU laptop, (c) Chrome with hardware acceleration disabled (software rendering). Threshold: 2D-only export at least 24 fps effective on (a), 60 s or less for a 30 s clip.
2. Scene stress: 3 parallax layers + 500 analytic particles + vignette + grain; threshold: at most 25 ms/frame p95 at 1080x1920 on (a); preview at 540x960 holds 30 fps.
3. Post chain: 2D-canvas upload to WebGL, 4-pass chain (grade LUT, bloom, vignette, grain) plus readback into `CanvasSource`; threshold: at most 20 ms added per frame on integrated GPU; measure both "pass WebGL canvas directly" and "drawImage into 2D canvas" paths.
4. Memory: record `performance.memory`/Task Manager peak during a 900-frame export; threshold: stable (no growth over 5 repeated exports, which catches leaked `VideoFrame`/`ImageBitmap`/textures) and peak below a budget you set for the owner's PC (for example 1.5 GB tab memory; choose after measuring).
5. Context loss: call `WEBGL_lose_context.loseContext()` mid-export; threshold: export resumes and the output is bit-identical to an uninterrupted run (frame-hash compare).
6. Determinism: export twice, hash each decoded frame (or the canvas pixels before encode); threshold: identical hashes for all frames. Compare preview-size render upscaled vs export render with PSNR; threshold: at least 35 dB (proposed) with no systematic edge differences.
7. Text parity: Devanagari captions on 2D layer pre/post WebGL stage; threshold: identical glyph shapes, no missing conjuncts (visual check on a fixed fixture string).
8. Bundle: measure gzip size of the app with and without WebGL layer and three.js (dynamic import); record in STATUS.md.

### Gaps
- All numeric thresholds are proposals to be calibrated by the baseline run; no sourced benchmark exists in these notes.
- Whether the owner's PC has hardware WebGL at all (and which GPU): unknown; needs one `about:gpu` check.
- Final decision on whether 3D is in V1 scope (drives Stage 3).
