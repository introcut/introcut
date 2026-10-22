# Who is already doing "AI generates video by writing code" (as of 22 Oct 2026)

Research date: 22 Oct 2026. GitHub numbers (stars, license, last push) were read live from the GitHub API / raw files on that date. Where a claim comes from a vendor or an SEO blog, it is labelled as such. Items marked "verify" were not confirmed from a primary source.

## 1. Which products and projects do this today? (what they make, how, license, price, evidence)

### Takeaway
The approach is real and now mainstream in 2026 for motion graphics, charts, kinetic text, explainers and math animation. The main players: Remotion plus agent skills (66k stars), HeyGen's HyperFrames (69k stars, Apache-2.0), Anthropic's own Claude Motion (beta, 8 Oct 2026), Hera (YC S25), Jitter, Midrender/Revideo, and many Manim agent projects. The "faceless short" repos with the most stars (MoneyPrinterTurbo, 134k) do NOT generate animation with code. They stitch stock footage, TTS and subtitles with a LLM-written script.

### Cited Findings

**A. Remotion (React-to-video) + agent skills**
- Remotion repo: 66,130 stars, last push 2026-10-22; GitHub reports license "NOASSERTION" because it is a custom license — [GitHub API](https://api.github.com/repos/remotion-dev/remotion)
- License terms (from repo LICENSE.md): free for individuals, for-profit orgs with up to 3 employees, non-profits, and evaluation; a paid Company License is required for larger for-profit orgs; you may not copy or modify Remotion to sell/sublicense your own derivative — [LICENSE.md](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md). This is why Introcut's CLAUDE.md lists Remotion as NOT allowed (not MIT/Apache).
- Official agent skills repo `remotion-dev/skills`: 5,497 stars, pushed 2026-10-19, no SPDX license shown by GitHub API; works with Claude Code, Codex, Kimi Code, Cursor; install `npx skills add remotion-dev/skills`; skills include remotion-best-practices, -create, -markup, -captions, -render, -maps, -studio, -saas, etc.; example prompt "/remotion-create Make a promo video for a record store" — [skills README](https://raw.githubusercontent.com/remotion-dev/skills/main/README.md), [GitHub API](https://api.github.com/repos/remotion-dev/skills)
- Remotion docs say docs are "optimized for AI agents" (copy as markdown, `.md` URLs, content negotiation) — [Remotion AI docs](https://www.remotion.dev/docs/ai/)
- Official templates in the Remotion monorepo: `template-prompt-to-motion-graphics` (pipeline: validate prompt, detect skills, one-shot code generation, sanitise, compile in browser with Babel, live preview; skills: charts, typography, messaging, transitions, spring-physics, social-media, 3d; says it works well for kinetic typography, data viz, chat UI mockups, social content, logo animations, abstract motion graphics; direct image uploads not supported) and `template-prompt-to-video` (CLI that generates a story script, images and voiceover using OpenAI and ElevenLabs, for TikTok/Instagram) — [prompt-to-motion-graphics README](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-motion-graphics/README.md), [prompt-to-video README](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-video/README.md)
- Adoption narrative: Syntax podcast (May 2026) says the Claude skill "blew up" around January 2026; a Feb 2026 podcast with Jonny Burger says thousands of non-coders began prompting videos. Burger says OpenAI posted an announcement video for Node built with Remotion (his claim, verify) — [Syntax transcript](https://www.syntax.fm/show/1005/programatic-and-skill-based-video-creation-with-remotion/transcript); the "viral" claim rests on podcast remarks, not on a metric.
- Remotion also has an in-browser renderer (`@remotion/web-renderer`): encodes with WebCodecs through Mediabunny, no server; docs say API stable from 4.0.491; supports only a subset of HTML/CSS — [web renderer docs](https://www.remotion.dev/docs/web-renderer/), [limitations](https://www.remotion.dev/docs/client-side-rendering/limitations). (Introcut already uses Mediabunny, but Remotion itself is license-blocked for Introcut.)

**B. HyperFrames (HeyGen) — HTML to video, "built for agents"**
- 69,383 stars, created 2026-03-10, Apache-2.0, pushed 2026-10-22, 395 open issues — [GitHub API](https://api.github.com/repos/heygen-com/hyperframes)
- Video is plain HTML with data attributes for timing, animated with GSAP, CSS, Lottie, Three.js, Anime.js or WAAPI via seekable timelines; the renderer seeks each frame in headless Chrome and encodes with FFmpeg, giving deterministic output; requires Node 22 and FFmpeg (so server/desktop, not browser-only) — [README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md)
- Ships 7 agent skills and "about 450 ready-made blocks and components" (transitions, overlays, titles, kinetic type, captions, charts, maps, 3D, camera moves) installed as editable source; has a `/remotion-to-hyperframes` migration skill; the skills teach the loop "plan, write valid HTML, wire seekable animations, add media, lint, preview, render" — [README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md)
- Star count is very high for a 7-month-old repo; I did not check whether it is organic. HeyGen is a commercial avatar-video company with an interest in promoting it.

**C. Anthropic Claude Motion (newest, 8 Oct 2026)**
- Official help article: Claude writes code that animates text, charts, shapes and images; "doesn't use a video generation model"; exports MP4; beta on Team and Enterprise plans; counts toward plan usage limits; longer/more complex animations use more; page gives no max duration or aspect ratios — [Claude help center](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion.md)
- Launch date 8 Oct 2026 and examples (all-hands explainer, board-deck chart, onboarding walkthrough) come from third-party summaries, not the help article — [eesel.ai](https://eesel.ai/blog/claude-motion) (promotional blog; verify).

**D. Hera (YC S25) — prompt to editable motion graphics**
- Makes product launch videos, animated charts/infographics, SaaS explainers, social cutdowns, logo intros; first-draft-then-refine workflow; page warns not to treat first draft as final — [Hera blog](https://hera.video/blog/mastering-hera-create-stunning-ai-animations)
- Company claims: YC S25, 100k waitlist signups in 8 weeks, "doubling revenue monthly" (unverified company claims) — [YC page via search result](https://ycombinator.com/companies/hera-video)
- Pricing is inconsistent across sources: from $15/mo with a free plan (MakerStack), free tier 720p with watermark (another review), "not published" (eesel) — [MakerStack review](https://makerstack.co/reviews/hera-review/), [eesel comparison](https://www.eesel.ai/blog/claude-motion-alternatives). Third-party review complaints: thin undo history, uneven prompt accuracy, complex scenes need 5-10 iterations (aggregated by [search summary](https://www.toolworthy.ai/tool/hera); verify). Closed source SaaS. Whether it outputs code is a company statement; not independently verified.

**E. Jitter** — "Animate with AI" launched 2026-05-13 in a design-tool animation editor; generates editable custom effects from a prompt; model not named; $15/editor/month per eesel (verify) — [Jitter changelog](https://thomas.jitter.video/changelog/2026-05-13-animate-with-ai/). eesel claims Claude Opus 5.5 powers it; I found nothing on Jitter's own pages confirming this (verify).

**F. Midrender / Revideo (code-first motion graphics)**
- Revideo repo moved to `midrender/revideo`: 4,127 stars, MIT, last push 2026-07-15, 63 open issues; "rendering engine for creating videos in code" in TypeScript with headless render API and React player; README says "A scene is plain TypeScript, so Claude or Codex can produce one from a prompt"; it is the engine behind Midrender (SaaS with CLI/MCP, visual timeline editor; pricing not listed on its home page) — [Revideo README](https://raw.githubusercontent.com/midrender/revideo/main/README.md), [GitHub API](https://api.github.com/repos/midrender/revideo), [midrender.com](https://midrender.com)
- Motion Canvas (the project Revideo forked from): 19,424 stars, MIT, last push 2026-07-02, 176 open issues — [GitHub API](https://api.github.com/repos/motion-canvas/motion-canvas). Its stale-ish push date is a mild maintenance concern.

**G. Lottie generators**
- LottieFiles "Motion Copilot 2.0" in Lottie Creator builds scenes from a prompt (shapes, text, gradients, keyframes, easing), plus a Lottie Creator MCP so any MCP-capable AI can build/edit animations — [LottieFiles blog](https://lottiefiles.com/blog/working-with-lottie-animations/introducing-motion-copilot-on-lottie-creator.md). Pricing/licence of the SaaS not checked.

**H. Manim + LLM projects (math/educational animation)**
- Manim: 3b1b/manim 95,483 stars MIT; ManimCommunity/manim 41,755 stars MIT, pushed 2026-10-20 — [3b1b](https://api.github.com/repos/3b1b/manim), [Community](https://api.github.com/repos/ManimCommunity/manim)
- Generative Manim (now `marcelo-earth/generative-manim`): 934 stars, Apache-2.0, last push 2026-09-17; "GPT-4o powered", supports Claude; companion hosted platform "Animo" (animo.video) — [GitHub API](https://api.github.com/repos/marcelo-earth/generative-manim), [README](https://raw.githubusercontent.com/marcelo-earth/generative-manim/main/README.md). The older name is 360macky/generative-manim (redirects). The earlier search snippet saying "license not stated" was wrong; the API shows Apache-2.0.
- Math-To-Manim (HarleyCoops): 2,796 stars, MIT, pushed 2026-10-21 — [GitHub API](https://api.github.com/repos/HarleyCoops/Math-To-Manim). Others found in search but not assessed: manim-mcp, manimkit (adds a linter for common LLM Manim mistakes and a render-and-review loop), manimator — [search results summary](https://github.com/raficharm/generative-manim). I did not find an end-user Manim-based product with verified traction.
- Research: Code2Video (Show Lab, NUS), arXiv 2510.01174, 2,156 stars, MIT, pushed 2026-08-24; agents Planner/Coder/Critic generating Manim CE v0.19.0 code; the repo says NeurIPS 2025 DL4C Workshop (an aggregator says ICML 2026; unconfirmed) — [arXiv](https://arxiv.org/abs/2510.01174), [GitHub API](https://api.github.com/repos/showlab/Code2Video)
- Research: TheoremExplainAgent (ACL 2025, arXiv 2502.19400) — Manim videos, 5+ minutes, 240 theorems — [arXiv HTML](https://arxiv.org/html/2502.19400v2)
- Research: ManimAgent / PhysicsSolutionAgent (arXiv 2601.13453): GPT-5-mini planner+coder with VLM frame feedback, 100% video-completion over 32 physics videos, avg automated score 3.8/5 — [arXiv](https://arxiv.org/abs/2601.13453)
- Research: HeyGen "Code2Video Benchmark" (different from Show Lab's Code2Video despite the name): 168 product-launch-beat briefs; agents write code that HyperFrames renders — [HeyGen research](https://www.heygen.com/research/introducing-code2video-benchmark)
- 3D by code: BlenderMCP (ahujasid, ~12k stars, MIT per search summary, not re-verified; rate-limited on my GitHub API check) lets Claude drive Blender via Python — [glama listing](https://glama.ai/mcp/servers/@ahujasid/blender-mcp/blob/7636d13bded82eca58eb93c3f4cd8708dfdfbe8b/README.md). Its example prompt is "create a low poly scene in a dungeon, with a dragon guarding a pot of gold"; I found no evidence of a character-animation pipeline.

**I. "Faceless video" automation repos (no code-generated animation; stock footage + TTS + subtitles)**
- MoneyPrinterTurbo: 133,843 stars, MIT, pushed 2026-10-21; topic/keyword in, LLM writes script, footage matched, subtitles + music, HD short out; README is heavily sponsor-funded (Kimi, BytePlus, etc.) — [GitHub API](https://api.github.com/repos/harry0703/MoneyPrinterTurbo), [README](https://raw.githubusercontent.com/harry0703/MoneyPrinterTurbo/main/README-en.md)
- MoneyPrinter (FujiwaraChoki): 14,079 stars, MIT, last push 2026-03-26 (MoviePy); MoneyPrinterV2: 32,172 stars, AGPL-3.0 (copyleft; not suitable to copy into Introcut); ShortGPT: 8,058 stars, MIT, last push 2025-02-10 (effectively dormant); RedditVideoMakerBot: 12,550 stars, GPL-3.0 — [MoneyPrinter](https://api.github.com/repos/FujiwaraChoki/MoneyPrinter), [V2](https://api.github.com/repos/FujiwaraChoki/MoneyPrinterV2), [ShortGPT](https://api.github.com/repos/RayVentura/ShortGPT), [RedditVideoMakerBot](https://api.github.com/repos/elebumm/RedditVideoMakerBot)

### Inferences
- The "code, not pixels" idea has moved from research (2024-25) to productised (Claude Motion, Hera, Midrender, HyperFrames) in 2026. Anthropic shipping it as a first-party feature is the strongest signal that the output class is considered production-viable for text, charts and shapes.
- Star counts are popularity, not quality evidence. Neither Remotion's skills nor HyperFrames has published independent success-rate numbers (only HeyGen's own benchmark).
- For Introcut, the useful licences are MIT/Apache: Revideo, Motion Canvas, HyperFrames (but needs Chrome+FFmpeg), Manim (MIT, but Python). None runs fully in-browser out of the box with the exception of Motion Canvas/Revideo's player (verify browser export path).

### Gaps
- Remotion skills' official page on remotion.dev/docs/ai/skills was not read (the fetched /docs/ai/ page was mostly empty); I relied on the GitHub README.
- No primary source confirming Hera's internal format (code vs. proprietary) or Jitter's model.
- Revideo browser-side render capability, Motion Canvas export in browser: not verified.
- Product Hunt / Hacker News launch metrics: not found.

---

## 2. Which content types work, which do not? Is a Zack D. Films-like stylised 3D/cartoon look achievable by code?

### Takeaway
Code-generated video is strong for anything made of text, numbers, shapes, charts, UI mockups, maps, transitions and math; it is weak for photorealism, organic motion, characters and anything needing rich imagery. A Zack D. Films-style 3D cartoon is not achievable with a prompt-to-code pipeline at acceptable effort; the evidence we found shows hobbyists making that look with AI image/video generation, not code.

### Cited Findings
- Remotion's own template lists what works: kinetic typography, data visualisations, chat/messaging UI mockups, social media content, logo animations, abstract motion graphics; images must be referenced by URL — [prompt-to-motion-graphics README](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-motion-graphics/README.md)
- HyperFrames lists: launch videos, PR walkthroughs with animated code diffs, chart races and maps, kinetic captions, docs/PDF/site-tour explainers — [README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md)
- Claude Motion: animates text, charts, shapes and images; no realistic footage or people by design — [Claude help center](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion.md)
- Pixel video models scored near zero on educational explainers (text blurry/corrupted, inconsistent style); code-based methods beat them clearly — [Code2Video paper](https://arxiv.org/html/2510.01174). This is the best quantitative case for the code approach: for text-heavy content, pixel generators fail where code works.
- Math animation: Manim videos with o3-mini reached 93.8% success on a 240-theorem benchmark with retries, but "most videos exhibit minor layout issues" (overlap, inconsistent sizes) — [TheoremExplainAgent](https://arxiv.org/html/2502.19400v2)
- Code-to-video failure modes in HeyGen's benchmark: linear/abrupt motion, text laid out for the final position so words overlap mid-animation, flat "safe" design with small type, elements drifting off-frame, blank end frames, a dropped letter in a typewriter reveal — [HeyGen Code2Video Benchmark](https://www.heygen.com/research/introducing-code2video-benchmark) (vendor-run)
- Practitioner view: a developer said early Claude+Remotion output "technically ran but looked janky" until the skills improved it; a motion designer said Claude is "not ready to fully edit a video" and still uses After Effects, but finds it useful for bulk animations (anecdotes quoted by eesel) — [eesel.ai](https://www.eesel.ai/blog/claude-motion-alternatives)
- Zack D. Films style: I found no description of its real pipeline; secondary sources say copycats use AI image/video tools (Open Art, Nano Banana, Runway, Midjourney); a creator forum noted Mixamo characters were "too hard to rig" — [dicloak video summary](https://dicloak.com/video-insights-detail/i-copied-a-youtube-channel-with-ai-3d-animation-tools), [Snaplama](https://www.snaplama.com/blog/how-to-create-animation-videos-like-zack-d-films-in-2026), [longstories.ai](https://longstories.ai/blog/complete-guide-ai-3d-animation-youtube). All low-authority, and the "team of 50" claim is unverified.
- Three.js is a supported animation target in both Remotion skills and HyperFrames (the `3d` skill / adapters) — [Remotion template](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-motion-graphics/README.md), [HyperFrames](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md); no evidence found of quality results for stylised characters.

### Inferences
- Works: kinetic typography, captions, number/stat reveals, charts, maps, UI/chat/screen mockups, diagrams, slideshow-with-motion over user images, math.
- Does not work (by code, today): photoreal people, faces, organic/cloth/hair motion, convincing 3D characters with rigging and lip-sync. A Zack D. look needs rigged characters, environments, camera work and lip-sync: likely weeks of asset building even with a code engine; low-poly props or abstract 3D objects (cubes, globes, phones) are feasible. This is an inference, not a measured result.
- This matches Introcut's hybrid direction: native-rendered text/number scenes plus user-supplied AI clips for anything organic.

### Gaps
- No measured quality comparison of code-generated 3D stylised shorts; no evidence either way for rigged-character code pipelines.
- Zack D. Films' real production method not found.

---

## 3. Reliability: how often does LLM-written animation code fail, and what fixes help?

### Takeaway
One-shot generation fails often (single-digit to 60%+ failure depending on model and library), but retry/repair loops push render success to roughly 90-100% for Manim. The bigger problem is not crashes but "renders fine, looks wrong" (overlap, timing, layout). Fixes with evidence: planner stage, retrieved docs, scoped auto-fix, rendering frames for a VLM critic (helps but VLM judges are unreliable), and constraining to components/templates.

### Cited Findings
- TheoremExplainAgent success rate (video produced) by model: o3-mini 93.8%; o3-mini+RAG 82.1%; GPT-4o 55.0%; Gemini 2.0 Flash 14.6%; Claude 3.5 Sonnet v1 2.1% (older models). With zero retries success was 0-7%; with 5 attempts 91-96% — [TheoremExplainAgent v2](https://arxiv.org/html/2502.19400v2). Error types ranked: hallucinated Manim functions/properties, LaTeX errors, general coding errors (no counts).
- ManiBench (arXiv 2603.13251, pilot of 12 problems): zero-shot executability Claude-Sonnet-4 66.7%, Kimi-K2.5 66.7%, Gemini-2.5-Pro 33.3%, Qwen3-235B 25%, DeepSeek-R1 13.9%, Qwen-2.5-Coder 0%; alignment keyword-based, no human validation, authors call numbers lower bounds; only 12 problems so very noisy — [ManiBench HTML](https://arxiv.org/html/2603.13251v1)
- Code2Video paper: states that even strong LLMs rarely produce fully executable code in one pass; it does not report compile rates. Ablations (GPT-4.1): removing the Planner cuts aesthetics 79.0 to 38.1; without ScopeRefine (scoped error fixing) debugging takes 2.5-2.8x time and 1.4-1.6x tokens; removing the Critic lowers quiz score 82 to 60.7 — [Code2Video](https://arxiv.org/html/2510.01174)
- Direct code generation baselines in the same paper: aesthetics 32.7-37.8 / 100 and quiz 36.5-40 (GPT-5, GPT-4.1, Claude Opus 4.1) vs. 72.2-87.9 / 80-86 with the full agent pipeline — [Code2Video](https://arxiv.org/html/2510.01174). Note their baseline is a single-pass, not a modern coding agent with tools.
- Training study on ManimBench (a different benchmark with the same-ish name): best sub-30B model 94% render success rate and 85.7% visual similarity — [deeplearn.org summary](https://deeplearn.org/arxiv/815516/training-and-agentic-inference-strategies-for-llm-based-manim-animation-generation) (secondary summary; verify).
- VLM-in-the-loop: ManimAgent/PhysicsSolutionAgent uses a VLM to review rendered frames; the authors also report errors in how the VLM interpreted visuals — [arXiv 2601.13453](https://arxiv.org/abs/2601.13453). HeyGen's report says VLM judges miss glitches, invent flaws, favour their own model family and show position bias; their trained judge agrees with humans 82% vs 75% for VLMs — [HeyGen](https://www.heygen.com/research/introducing-code2video-benchmark). SGA (arXiv 2607.18116) argues for rendering-free symbolic geometric verification instead of VLM critics (+16.1% relative with Code2Video + GPT-5.1) — [arXiv PDF](https://arxiv.org/pdf/2607.18116) (as summarised by search; verify).
- Remotion-specific traps the docs/podcast name: CSS animations do not work with frame-by-frame rendering and cause flicker — [Syntax transcript](https://www.syntax.fm/show/1005/programatic-and-skill-based-video-creation-with-remotion/transcript). A preview that loads does not prove external assets/fonts work at render time — [Tella guide](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code) (found via search; secondary).
- Remotion's repo contains an internal `@remotion/skills-evals` package with scenarios, but it is undocumented and I found no published pass rates — [package listing](https://api.github.com/repos/remotion-dev/remotion/contents/packages/skills-evals).
- Ready-made fix: the Remotion prompt-to-motion-graphics template has a validation classifier before generation, a sanitisation step (strip markdown wrappers), and constants-first code (all text/colours/timings declared as editable constants at the top) — [README](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-motion-graphics/README.md). HyperFrames adds a lint step and a catalog of ~450 blocks so agents compose instead of hand-writing — [README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md).

### Inferences
- There is no published, comparable "pass rate" for Remotion/HyperFrames-style React/HTML generation with a modern agent; all hard numbers are from Manim (a harder, rarer library, so hallucinated APIs are more common). Likely lower failure on React/HTML/GSAP because models know them better (inference, not measured).
- Practical stack that the evidence supports: plan first, retrieve/inject API docs or a small component library, compile + run in a sandbox, auto-fix scoped to the failing part, render 2-4 key frames, run cheap programmatic checks (text bounding boxes inside safe area, overlap), use VLM only as a soft critic.

### Gaps
- No measured compile/render failure rate for Remotion, Revideo, Motion Canvas or HyperFrames with current models.
- ManiBench pilot (12 problems) and the "94% RSR" summary are small/secondary; treat as indicative.
- GitHub issue-based failure analysis (e.g. issue counts mentioning LLM errors) not done.

---

## 4. Spec-vs-code: does a constrained JSON scene spec work better than free-form code?

### Takeaway
Industry practice is converging on constrained specs/components for reliability, but I found no head-to-head measurement of JSON-spec vs free-form code failure rates. The systems that ship at scale (Shotstack, Creatomate, HyperFrames blocks, Remotion props, Claude Motion's editable values) all separate trusted rendering code from model-filled content.

### Cited Findings
- Creatomate describes JSON-to-video, where scenes, text, images, audio, animations and timing are JSON rendered by an API; suited to automated pipelines — [Creatomate blog](https://creatomate.com/blog/json-to-video-practical-examples)
- Template-based video APIs (Shotstack, Creatomate, JSON2Video) are the common pattern for automated personalised video; evidenced mainly by freelancer listings and vendor comparisons (low authority) — [Fiverr listing](https://fiverr.com/sul_lal/build-ai-video-automation-creatomate-shotstack-json2video-template)
- Atlas Cloud reports that a model "routinely drops critical asset tags or spits out invalid syntax that breaks the video generation batch" when prompting video models with JSON (single vendor; about prompts, not render specs) — [Atlas Cloud](https://www.atlascloud.ai/sv/blog/guides/seedance-2-5-json-prompts-workflow)
- Claude Motion's selling point: because animation is code, changing one number updates only that element — a spec-like editability property of code-with-constants — [Claude help center](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion.md)
- Remotion's template tells the model to declare all text/colours/timing as constants at the top (a spec embedded in code) — [README](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-motion-graphics/README.md). HyperFrames' frame.md says "Atoms stay sacred. Composition stays free. Numbers come from the script." — [README](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md)
- Code2Video's Planner (storyboard spec) is the single largest contributor: without it aesthetics fall by about 41 points (GPT-4.1) — [Code2Video](https://arxiv.org/html/2510.01174). This supports "spec first, then render", though their render step is still free-form code.

### Inferences
- Spec plus trusted renderer eliminates compile/runtime failures by construction (a schema validator catches errors cheaply) and gives locks/undo for free, which fits Introcut's "one JSON file, ops, locks" rules. Trade-off: the ceiling is the template library.
- A hybrid is common in practice: spec for 90% of scenes (template + props), with an optional sandboxed code escape-hatch for custom scenes (risky; browser-only needs a safe sandbox such as an iframe/worker).

### Gaps
- No paper or benchmark comparing JSON-spec vs code generation on failure rate or visual quality.
- Lottie as an LLM target: no failure-rate evidence found.

---

## 5. Costs: tokens per video, render time, who pays; is "free" realistic?

### Takeaway
Measured numbers exist only for Manim research agents: roughly $0.10-$4.67 per 5-minute-plus video in 2025 (older models), 10-40 minutes wall time, 20-50k tokens per short topic. Product pricing: Claude Motion consumes paid Team/Enterprise plan usage; Hera and Jitter are paid. "Free" is realistic only if the user supplies a free LLM and rendering is local; the LLM is the hard part for a zero-cost browser app.

### Cited Findings
- TheoremExplainAgent cost and time per video: Gemini 2.0 Flash $0.10 / 1120 s; o3-mini $1.16 / 1680 s; GPT-4o $1.71; Claude 3.5 Sonnet v1 $2.42 / 2240 s; with RAG up to $4.67 (long, 5+ min videos, 2025 models) — [TheoremExplainAgent](https://arxiv.org/html/2502.19400v2)
- Code2Video: 8.8-16.8 minutes and 19-49 K tokens per topic for the agent pipeline (GPT-5: 8.8 min / 19.3K tokens; Claude Opus 4.1: 13.8 min / 43.1K tokens); direct code gen 1.8-2.8 min and 1.1-2.3K tokens; no dollar figures; parallel execution cuts time 5.6x — [Code2Video](https://arxiv.org/html/2510.01174)
- Remotion: free for individuals and teams up to 3; otherwise paid. eesel quotes $25/seat/month for teams of 4+ (verify) — [LICENSE](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md), [eesel](https://www.eesel.ai/blog/claude-motion-alternatives). Server render: headless Chrome + FFmpeg; Lambda render concurrency is limited for cost and stability per Burger — [Syntax](https://www.syntax.fm/show/1005/programatic-and-skill-based-video-creation-with-remotion/transcript)
- Beginner guide: first preview in 20-30 min, final MP4 render 1-5 minutes on a laptop (secondary guide) — [buldrr](https://buldrr.com/remotion-claude-code-ai-video-generation-beginners/)
- Claude Motion: no per-clip price; counts toward Team/Enterprise plan usage — [Claude help center](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion.md)
- Hera: free tier (watermark, 720p per one review), paid from about $15/mo (inconsistent sources) — [MakerStack](https://makerstack.co/reviews/hera-review/)
- Browser rendering is possible: Remotion's web renderer encodes via WebCodecs with no server, single-threaded, background tabs throttled — [limitations](https://www.remotion.dev/docs/client-side-rendering/limitations)
- MoneyPrinterTurbo needs an LLM API key (README sponsors pitch paid APIs) plus a TTS and stock-footage API key — [README](https://raw.githubusercontent.com/harry0703/MoneyPrinterTurbo/main/README-en.md) (key requirement inferred from sponsor/setup text; verify).

### Inferences
- A 30 s vertical short from a spec-based system is a small amount of output tokens (a JSON scene list is likely a few thousand tokens), versus 20-50K tokens for an agentic free-form code loop. This is an inference from the Code2Video numbers; not measured for shorts.
- Zero-cost levers for Introcut: (1) fill templates with the rules fallback or small in-browser LLM (WebLLM/Qwen3 already planned) instead of free-form code; (2) render locally with Canvas + Mediabunny; (3) optional user-supplied free-tier API key for harder tasks, labelled opt-in. Small local models are likely poor at free-form animation code (the ManiBench pilot shows open models below 35% executability, but only on Manim and 12 problems).

### Gaps
- No token/dollar numbers for Remotion/HyperFrames/Claude Motion per video.
- No data on how small in-browser models (Qwen3 4B-8B) perform at scene-spec filling or animation code.
- Current 2026 API prices were not checked.

---

## 6. Quality perception: do audiences accept code-generated motion-graphics shorts?

### Takeaway
There is no reliable performance data (views, retention) for code-generated shorts. The only rigorous perception data is the Code2Video human study (small, educational) which favoured the code-agent output over pixel video and naive code. Platform policy risk is real: YouTube demonetises mass-produced/templated content.

### Cited Findings
- Human study (40 participants: 5 groups of 6 middle-school + 2 undergrads), educational explainers: Code2Video (Claude Opus 4.1) had completion willingness 64.0 and average rank 1.8, vs human 3Blue1Brown 36.2 / 1.2, Veo3 46.8 / 5.0, naive code LLM 15.0 / 3.9. Veo3 clips were 8 s so not like-for-like — [Code2Video Table 8](https://arxiv.org/html/2510.01174). Authors note long videos reduce completion willingness, and a single VLM (Gemini-2.5 Pro) did aesthetics scoring.
- Syntax hosts: one host's Remotion-made "slop" video "performed poorly on TikTok" (anecdote, N=1, cause unknown) — [Syntax transcript](https://www.syntax.fm/show/1005/programatic-and-skill-based-video-creation-with-remotion/transcript)
- Anecdotal: a creator video claims a Claude-assisted Shorts channel got 17M views on one video; it does not say Remotion or code-generation was used — [videohighlight summary](https://videohighlight.com/v/V_t51u1tBJc) (unverified creator claim).
- Vendor claims such as "motion outperforms static," "up to 30% more engagement" are unsourced marketing — [Mirra](https://www.mirra.my/en/blog/ai-motion-graphics-social-media-reels-shorts-2026), [ImagineArt](https://imagine.art/blogs/video-marketing-trends).
- YouTube policy: from 15 July 2025, YouTube's YPP "inauthentic content" policy targets mass-produced, repetitive content (not AI per se); sources report a clarification in July 2026 naming generic/template-based content as non-monetisable; dates conflict across secondary sources, verify against YouTube's policy page — [Gulf News](https://gulfnews.com/technology/youtube-updates-monetisation-policies-ai-and-repetitive-content-ban-begins-july-15-1.500192660), [logie.ai](https://logie.ai/news/youtube-ai-slop-crackdown-2026-monetization/)

### Inferences
- Audience acceptance appears to depend on content value and pacing, not on whether it was code-made. Template sameness is the risk: many users filling the same 20 templates will look alike, which is also what monetisation policy punishes. Designing for variety (style packs, user media mixed in) helps.
- Treat all "viral" claims as anecdotal.

### Gaps
- No data on retention, watch time, CTR for code-generated shorts on YouTube Shorts/TikTok/Reels.
- No audience survey for kinetic-typography/chart shorts specifically.

---

## 7. Lessons for Introcut

### Takeaway
Evidence supports a hybrid: a spec-driven library of trusted animated scene templates (text, numbers, charts, UI mockups, captions) rendered natively by Introcut's Canvas renderer, with user/AI-generated clips for anything organic. Free-form LLM-written code should be optional/advanced, not core, given cost, reliability and sandbox concerns.

### Cited Findings
(Drawing on the cited evidence in sections 1-6; key anchors below.)
- Pixel video models scored near zero for text-heavy explainers while code-based methods did well — [Code2Video](https://arxiv.org/html/2510.01174)
- A planner/storyboard step is the biggest quality lever (about 41 aesthetic points) — [Code2Video](https://arxiv.org/html/2510.01174)
- HyperFrames' approach (about 450 prebuilt blocks, agents compose instead of hand-writing, lint, then render) and Remotion's constants-first code are template-library strategies — [HyperFrames](https://raw.githubusercontent.com/heygen-com/hyperframes/main/README.md), [Remotion template](https://raw.githubusercontent.com/remotion-dev/remotion/main/packages/template-prompt-to-motion-graphics/README.md)
- Frequent failure patterns to design out: overlapping text mid-animation, text off-frame, abrupt/linear easing, blank end frames — [HeyGen benchmark](https://www.heygen.com/research/introducing-code2video-benchmark)
- Remotion's licence blocks use in Introcut; Revideo/Motion Canvas (MIT) and Mediabunny-based rendering are options — [Remotion LICENSE](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md), [Revideo](https://api.github.com/repos/midrender/revideo)

### Inferences (recommendations)
1. Build about 15-25 scene templates (title/hook, big number, comparison, bar/line chart, list/steps, quote, chat mockup, phone/UI mockup with user screenshot, map-less location card, timeline, kinetic caption, image-with-Ken-Burns, lower third, outro/CTA). Each defined by a Zod props schema, a `renderFrame` function with eased tweens and safe-area layout built in. The LLM (or rules fallback) only fills props and picks order, so output is always valid.
2. Add automatic layout checks (text fits box, safe areas for Shorts/Reels UI, minimum duration/readability, contrast) rather than a VLM critic; evidence shows VLM judges are unreliable.
3. Hybrid: user's Veo/Kling clips for organic shots; code-native scenes for text, numbers, charts, UI, transitions and captions; this sidesteps the quality ceiling (no photoreal people, no organic motion by code).
4. Keep free-form code generation out of V1 core; if ever added, run it in a sandboxed worker with a restricted draw API, validate by rendering a few frames, and gate it behind the opt-in user-key notice.
5. Do not promise a Zack D.-style 3D cartoon via code; note it as a clip-generation job.
6. Make variety a feature (several style packs, user media, per-story palettes) to avoid the "templated/mass-produced" look that YouTube's policy targets.
7. Spec-first fits Introcut's existing architecture (project JSON, ops, locks), and template props are directly editable by users (human edits become locks).
8. A 2-minute prototype to de-risk: have a small WebLLM model fill 5 templates for a given story and measure schema-valid rate and visual issues (Gate-style test).

### Gaps
- No evidence on small in-browser LLM performance at template filling; needs a spike.
- Whether Revideo/Motion Canvas can render in-browser without a server was not verified; Introcut's own Canvas + Mediabunny route is already planned.
- No performance data on whether template-based motion shorts retain viewers compared with clip-based shorts.
