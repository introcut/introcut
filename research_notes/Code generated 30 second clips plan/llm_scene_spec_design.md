# LLM-generated validated scene spec (JSON) for a ~30 s animated short: design note (as of 2026-10-22)

Scope: Introcut writes a script, then a scene spec; its own trusted renderer draws it. LLM-written executable code is out of scope. Evidence is labelled: **[measured]** = number from a paper or official doc as retrieved; **[claim]** = vendor or blog statement; **[inference]** = my design reasoning; **[estimate]** = my numbers, not measured; **[verify]** = could not confirm from a primary source. Several pages were read through a summarising fetch tool, so exact figures should be re-checked before they go into the final report. The search tool returned no results for MotionGPT-style text-to-motion work, and I did not search for it (see Gaps).

---

## 1. Literature and systems on LLMs generating layouts, scenes and animations

### Takeaway
Every system that works reliably puts the LLM in a **planner/specifier** role over a constrained representation (a scene graph, relational constraints, CSS-like boxes, a component catalog) and leaves exact numbers and geometry to code or an optimizer. Systems that let the LLM emit raw low-level formats (Lottie JSON, Blender or Manim code) fail often without retries or specialised tokenisation. I found no head-to-head test of JSON spec versus free-form code on the same video task.

### Cited Findings
- **LayoutGPT** (NeurIPS 2023): the LLM writes layouts in CSS-like syntax with category name as selector and x/y/w/h as left/top/width/height, normalised to 256 px. The paper reports 20-40% better numerical and spatial correctness than text-to-image systems, and 3D indoor scene synthesis comparable to supervised methods. Lesson: a familiar format (CSS) plus in-context examples works; output is boxes, not drawing code. [measured, abstract] — [arXiv 2305.15393](https://arxiv.org/pdf/2305.15393), [NeurIPS page](https://proceedings.neurips.cc/paper_files/paper/2023/hash/3a7f9e485845dac27423375c934cb4db-Abstract.html)
- **VideoDirectorGPT** (UNC, 2023): GPT-4 turns one prompt into a "video plan" with per-scene descriptions, entity lists with bounding-box layouts per frame, per-scene backgrounds and consistency groupings; a separate generator (Layout2Vid) follows the plan. Authors report better cross-scene object consistency. Lesson: a two-level plan (story, then per-scene layout) with explicit consistency groups. [claim from summaries; paper not read in full] — [arXiv 2309.15091](https://arxiv.org/html/2309.15091v2)
- **Holodeck** (CVPR 2024): GPT-4 proposes spatial relational constraints between objects ("near", "in front of") and a solver places objects; a user study ranked constraint-based layout above absolute-coordinate, random and edge-placement baselines as more reliable. Lesson: relational/semantic placement beats LLM-chosen coordinates. [measured via user study, details not read] — [arXiv 2312.09067](https://arxiv.org/pdf/2312.09067)
- **SceneCraft** (ICML 2024): LLM builds a scene-graph "blueprint", turns relations into 0-1 scoring functions, a search optimises layout, and a GPT-4V critique loop revises. Constraint score 88.9 vs 5.6 for BlenderGPT; CLIP similarity 69.8 vs 24.7; human pairwise win 76.8% vs 12.7%. Ablations: no relation graph 3.2, no inner critique loop 26.1, no learned library 64.5. Evaluated on 20 synthetic queries (small sample). Lesson: the intermediate relation graph is the single biggest contributor. [measured, small n] — [arXiv 2403.01248](https://arxiv.org/html/2403.01248v1)
- **Chat2SVG** (CVPR 2025): the LLM is restricted to SVG templates built from basic geometric primitives, using a scene -> object -> layout expansion; detail is added by diffusion-guided path optimisation. Authors state LLMs place basic shapes well but struggle with complex paths. Lesson: confine the LLM to a simple closed vocabulary and hand detail to deterministic or learned stages. [claim, abstract-level] — [arXiv 2411.16602](https://arxiv.org/html/2411.16602v1)
- **LLM to Lottie** (CVPR 2026, OmniLottie and LottieGPT): per the OmniLottie supplement, general LLMs writing raw Lottie JSON do poorly: Qwen2.5-VL 0% (invented an incompatible schema), DeepSeek 29.3% (attributes on wrong nodes), GPT-5 12.7% to 68.67% depending on task. OmniLottie's tokenizer converts the verbose JSON into a shorter command sequence, said to cut raw tokens by about 81%. LottieGPT's supplement reports some frontier-model runs (Claude Sonnet 4.5, Gemini 2.5 Pro, Qwen3-Max) produced no renderable Lottie even after several attempts. Lesson: a verbose, expressive, externally defined format is a bad target; a compact custom one is better. [measured, second-hand from supplements and summaries] — [OmniLottie supplement](https://openaccess.thecvf.com/content/CVPR2026/supplemental/Yang_OmniLottie_Generating_Vector_CVPR_2026_supplemental.pdf), [LottieGPT supplement](https://openaccess.thecvf.com/content/CVPR2026/supplemental/Chen_LottieGPT_Tokenizing_Vector_CVPR_2026_supplemental.pdf), [hyper.ai summary](https://hyper.ai/de/papers/2603.02138)
- **AutoPresent / SlidesBench** (CVPR 2025): programmatic generation against a small purpose-built library (SlidesLib) beats end-to-end image generation and yields editable output; an 8B model fine-tuned on 7k instruction-to-code pairs approaches GPT-4o, while un-tuned 7-8B models "are often unable to produce executable code"; self-refinement improves quality. Lesson: small models need either a tiny API or fine-tuning; a spec avoids the code-execution failure class. I did not find a spec-versus-code ablation. [measured/claim from summaries] — [arXiv 2501.00912](https://arxiv.org/html/2501.00912v2)
- **PPTAgent** (EMNLP 2025): edit-based generation, i.e. the LLM emits edit actions over existing reference slides rather than building layouts from scratch. A competitor paper (PreGenie) reports PPTAgent outputs still show inconsistent fonts and content overflowing page boundaries. Lesson: template reuse reduces but does not remove overflow; code-side checks are needed. [claim; PreGenie is a competitor] — [arXiv 2501.03936](https://arxiv.org/abs/2501.03936v3), [PreGenie](https://arxiv.org/pdf/2505.21660)
- **Code2Video** (Show Lab; ICML 2026 listing): Planner (storyboard), Coder (Manim with scope-guided auto-fix) and Critic (VLM with visual-anchor prompts). Reported +40% over direct code generation. (Earlier research already covers the ablation numbers.) — [arXiv 2510.01174 via project listing](https://icml.cc/virtual/2026/poster/65050), [repo](https://github.com/xxx-lang/Code2Video)
- **Blender-MCP-style agents**: no standardised success-rate benchmark for Blender MCP itself. MCP-Universe reports GPT-5 at 52.63% in its 3D-design domain (43.72% overall) using execution-based evaluators. Related papers report script syntax/logic failures, quality that degrades or plateaus after about three refinement iterations, and weak tracking of positions among dozens of objects. [measured for MCP-Universe; the rest case-study-level] — [MCP-Universe](https://arxiv.org/pdf/2508.14704), [Planner-Actor-Critic 3D](https://arxiv.org/pdf/2601.05016), [3Dify](https://arxiv.org/pdf/2510.04536)
- **json-render (Vercel Labs, Apache-2.0)**: developer defines a catalog of allowed components and actions with Zod; the LLM emits a JSON spec limited to the catalog; props are Zod-validated so malformed output fails loudly; catalog schemas can be exported for provider structured-output APIs. This is the closest production analogue to Introcut's design. [claim; secondary write-ups, not official docs] — [InfoQ, Mar 2026](https://infoq.com/news/2026/03/vercel-json-render), [LogRocket](https://blog.logrocket.com/vercel-json-render-dynamic-ui/)
- **JSON-spec-to-video in practice**: community projects drive Remotion from a JSON storyboard with typed scene kinds and Pydantic validation; one PR reports all 42 storyboard scenes render with frame-count QA. These are small single-author projects, not evidence of quality. — [GitHub issue](https://github.com/ferraroroberto/content-management/issues/359), [PR](https://github.com/jonborchardt/video-knowledge/pull/9), [Medium (403 on fetch; snippet only)](https://medium.com/@kenzic/building-ai-generated-video-with-json-render-and-remotion-b9f1000ff7af)
- **StoryBlender** (2026): uses a strict JSON schema for layout agents with the 3D engine acting as gatekeeper, and states LLMs "inherently suffer from spatial hallucinations". [claim from search snippet] — [arXiv 2604.03315](https://arxiv.org/html/2604.03315v1)
- **Remotion Agent Skills / HyperFrames**: these let a coding agent write code against a framework (Remotion React, HyperFrames HTML + GSAP). They are the "free-form code with guardrails and a block library" approach, not a JSON spec. Reported limits: Remotion output feels like animated presentations; most coding agents need a paid subscription. [third-party blogs] — [Tella guide](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code), [HyperFrames mirror](https://gitee.com/mcnick/hyperframes)

### Inferences
- The recurring winning pattern is: (1) LLM picks from a closed vocabulary, (2) LLM states relations/anchors, not coordinates, (3) code resolves geometry and timing, (4) code-side checks plus bounded repair. SceneCraft's ablation (relation graph 3.2 vs 88.9) and Code2Video's planner ablation are the two strongest pieces of evidence that the intermediate representation matters more than the critique loop.
- Raw Lottie failures show the cost of an LLM writing a large external schema. A custom compact spec (the OmniLottie tokenizer idea applied to prompts) is the cheaper equivalent for us.
- Because scene-spec generation is closer to LayoutGPT/json-render than to Manim, the 0-7% zero-retry code failure figure probably does not transfer; the relevant risk is semantic (wrong content, ugly layout), not syntactic. [inference, untested]

### Gaps
- No head-to-head measured comparison of JSON spec vs free-form code on the same video task.
- MotionGPT-style text-to-motion work not researched (not searched); likely less relevant since the output is learned motion tokens rather than an editable spec.
- Holodeck and VideoDirectorGPT numbers were taken from search summaries, not read from the full paper.
- No source found for Hera's internal representation (whether it is a JSON spec or code).

---

## 2. Spec design principles for LLM reliability

### Takeaway
Define a small closed vocabulary with enum-valued choices and semantic anchors, let code own geometry, timing and defaults, and use provider structured-output features for syntax while treating them as insufficient for semantics. Keep schemas flat and small because provider schema subsets are limited and schema tokens count against input.

### Cited Findings
- **Gemini structured output**: supports string, number, integer, boolean, object, array and null types; `enum`, `minimum`/`maximum`, `minItems`/`maxItems`, `prefixItems` and `required`/`additionalProperties` are honoured; `minLength`/`maxLength`, `minProperties`/`maxProperties` and `uniqueItems` are ignored (silently stripped). Very large or deeply nested schemas may be rejected with 400 INVALID_ARGUMENT, with common causes being large nested `maxItems` and `anyOf` with many alternatives. Google says output may be valid JSON but semantically wrong and advises validating with Zod/Pydantic client-side. [measured, official docs as fetched; model names in the page examples looked unfamiliar, so check the current list] — [Gemini docs](https://ai.google.dev/gemini-api/docs/structured-output)
- **Gemini property ordering**: without `propertyOrdering` the API may order keys alphabetically; few-shot examples whose key order differs from the schema can produce "rambling or unexpected" output; a forum report says ordering was not respected through the OpenAI-compatible endpoint (unconfirmed). Schema size counts toward input tokens; docs suggest shortening names, flattening nested arrays and reducing optional properties if a valid schema errors. — [Vertex/Gemini docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output?authuser=1), [forum thread](https://discuss.ai.google.dev/t/structured-outputs-propertyordering-field-not-respected-when-using-the-openai-compatible-api-gemini-2-flash/86790)
- **Groq structured outputs**: `strict: true` uses constrained decoding and requires every property in `required` and `additionalProperties: false` (optional via `["string","null"]` unions); best-effort mode (`strict: false`) can return valid JSON that does not match, surfacing as HTTP 400 "Generated JSON does not match the expected schema"; `$defs`/`$ref`, recursion, enums and `anyOf` are supported; streaming and tool use are not supported with structured outputs; other models fall back to JSON object mode (valid JSON, no schema). Supported-model list as fetched: strict on openai/gpt-oss-20b, gpt-oss-120b, plus two newer models; best-effort adds gpt-oss-safeguard-20b. **[verify]**: the fetch tool's summary named models I could not cross-check, and a LangChain page and the AI SDK page give conflicting lists (GPT-OSS only vs kimi-k2). A forum thread reports intermittent `json_validate_failed` with strict outputs. — [Groq docs](https://console.groq.com/docs/structured-outputs), [LangChain ref](https://reference.langchain.com/python/langchain-groq/chat_models/ChatGroq/with_structured_output), [AI SDK](https://ai-sdk.dev/providers/ai-sdk-providers/groq), [HF forum](https://discuss.huggingface.co/t/groq-route-intermittently-returns-json-validate-failed-with-strict-structured-outputs/179097)
- **WebLLM/XGrammar**: WebLLM supports JSON-schema/grammar-constrained decoding via XGrammar compiled to WebAssembly; the XGrammar paper reports near-zero overhead for 4-bit Llama-3.1-8B in Chrome on an M3 Max and Qwen2.5-0.5B on an iPhone 14 Pro Max. — [XGrammar paper](https://arxiv.org/pdf/2411.15100), [WebLLM blog](https://blog.mlc.ai/2024/06/13/webllm-a-high-performance-in-browser-llm-inference-engine)
- **XGrammar correctness caveat**: JSONSchemaBench found XGrammar had few compile errors but the most under-constrained outputs (38 on the JSON Schema Test Suite), and Kubernetes-schema empirical coverage of only 0.07 (compliance 0.58). — [JSONSchemaBench](https://arxiv.org/html/2501.10868v2)
- **Format restrictions can hurt reasoning**: Tam et al. (EMNLP 2024 Industry) found stricter format constraints degrade reasoning (e.g. GSM8K) for Claude 3 Haiku, GPT-3.5 and LLaMA 3 8B, while strict formats can help classification; they suggest NL-then-format conversion or looser formats. Contrast: JSONSchemaBench found constrained decoding raised downstream accuracy slightly (GSM8K 80.1% unconstrained vs 82-84% constrained, Llama-3.1-8B). The two findings conflict; the difference is probably in how the schema forces reasoning inside fields. [inference] — [Tam et al.](https://arxiv.org/pdf/2408.02442), [JSONSchemaBench](https://arxiv.org/html/2501.10868v2)
- **"Reason free, constrain late"**: Constraint Tax paper (May 2026, Qwen2.5 0.5B/1.5B, SmolLM2-1.7B, 15,000 generations) proposes delaying structured packaging. — [arXiv 2605.26128](https://arxiv.org/abs/2605.26128)
- **Compact representation**: OmniLottie's ~81% token reduction from re-encoding verbose JSON (see Section 1). — [hyper.ai](https://hyper.ai/de/papers/2603.02138)

### Inferences (design principles, with 3 concrete examples)

Principles for the Introcut spec:
1. **Closed vocabulary, discriminated by one `use` enum** (component id). Each component has 2-6 props, all with defaults. Props are mostly enums or short strings; free numbers are limited to a few clamped ones.
2. **Semantic anchors, not pixels**: `at` in {left-third, center, right-third, ground, hero, top-safe, lower-third}; `size` in {s, m, l, hero}. Code maps anchors to a 1080x1920 grid with a safe-area margin. (Holodeck evidence: relational placement beats absolute coordinates.)
3. **Time in beats, not ms**: each scene is bound to one narration sentence/beat (`say`); duration comes from voice alignment (or word count / reading rate when there is no voice). The LLM may only give a relative weight `dur` in {short, med, long}. Animation offsets are `at: "start" | "on-word:<n>" | "end"`, never milliseconds.
4. **Defaults for everything**: an empty `{use, p:{text}}` scene must render acceptably. This makes repair trivial (drop invalid optional fields instead of failing).
5. **Flat schema for provider APIs**: avoid `anyOf` with 12+ branches (Gemini rejection risk); use one `use` enum plus a loose `p` object, then validate `p` against the per-component Zod schema in code (a second validation layer). For strict-mode providers (Groq) every field must be listed and nullable. Keep a provider-adapter that generates a flattened JSON Schema from the Zod catalogue. If an adapter finds the schema rejected, fall back to JSON-object mode plus Zod. [inference]
6. **Short keys and one-line scenes** to reduce tokens (about 50-90 tokens per scene, so roughly 500-800 tokens for 8 scenes) [estimate]. Version field `v`; the compiler migrates older versions.
7. **Key order consistent** between schema, few-shot examples and output (Gemini finding).
8. **Two-stage generation so the model can think before constraining**: a free-text beat sheet first, then constrained JSON per scene (Constraint Tax / Tam et al.).
9. **Few-shot**: 2-3 complete examples at different tones, and shuffle their order/content per request to limit copy-the-example collapse [inference]. Example selection in LayoutGPT was by similarity (details not verified).

**Example A: whole 30 s project, compact (6 scenes; fox story with a big number)**
```json
{"v":1,"theme":"dusk","seed":7,"voice":"vo1",
 "scenes":[
  {"beat":"hook","say":"Most people lose three hours a day to email.","use":"hook_text",
   "p":{"text":"3 HOURS","sub":"gone, every day","emph":"3 HOURS"},"cam":"push","tr":"cut","sfx":"hit"},
  {"beat":"problem","say":"And every ping costs eleven minutes to refocus.","use":"big_number",
   "p":{"value":11,"unit":"min","label":"to refocus","count":"up"},"cam":"none","tr":"slide-l","sfx":"tick"},
  {"beat":"story","say":"Meet Fox. Fox checked mail forty times before lunch.","use":"character_stage",
   "p":{"set":"office-night","actor":"fox","at":"left-third",
        "acts":[["enter","left"],["type"],["sweat"]],"prop":["laptop","mail-stack"]},
   "cam":"pull","tr":"fade"},
  {"beat":"turn","say":"Then Fox tried batching mail twice a day.","use":"icon_row",
   "p":{"items":[["clock","9:00"],["clock","16:00"]],"label":"twice a day"},"tr":"wipe-r","sfx":"pop"},
  {"beat":"proof","say":"Result: two hours back, every day.","use":"image_focus",
   "p":{"img":"asset:2","cam":"push-in","caption":"+2 h / day"},"tr":"cut"},
  {"beat":"cta","say":"Try it for a week.","use":"end_card","p":{"title":"Batch your mail","cta":"Follow for more"}}
 ]}
```

**Example B: one scene with layers and per-actor timing (used for "regenerate this scene" and as the compile target of a simple card)**
```json
{"beat":"story","say":"The dragon spotted the village at dawn.","dur":"med",
 "use":"character_stage",
 "p":{"set":"hills-dawn","palette":"warm",
      "actors":[{"id":"dragon","at":"right-third","acts":[["enter","right","on-word:1"],["roar","on-word:3"]]},
                {"id":"villager","at":"ground-left","acts":[["look-up","on-word:4"],["flee","end"]]}],
      "fx":["sun-rays","birds"],"text":{"say":"DAWN","at":"top-safe","style":"title-pop"}},
 "cam":"pan-r","tr":"fade","sfx":"riser"}
```
Closed action set (about 10-14): enter, exit, walk-to, wave, point, jump, nod, shake, look-up, flee, type, sweat, roar-or-shout, sit.

**Example C: the minimal "card" a 1-3B on-device model can emit per scene (constrained to 4 fields), which the compiler expands with defaults**
```json
{"use":"big_number","text":"11 min","sub":"to refocus","mood":"tense"}
```
Compiler adds: cam, tr, sfx, timing from beat, palette from `mood` + theme pack, seed-based variation. This is the "degraded mode" spec: schema validity is near-certain and layout cannot fail.

### Gaps
- No evidence found on whether short keys versus verbose keys change quality (only token savings are reasoned).
- Groq and Gemini current model lists and free-tier rate limits could not be verified from primary sources in this pass.
- No measured effect of anchor-versus-pixel representation for LLMs on video layouts specifically (only Holodeck's user study, on 3D).

---

## 3. Component/template library strategy

### Takeaway
No source gave a measured "how many templates are enough". The only hard number found is HyperFrames' 50+ blocks. A layered design (scene component + background pack + theme/palette + camera + transition + seeded variation) is the way to get variety from 12-15 components; this recommendation is inference.

### Cited Findings
- HyperFrames (HeyGen, Apache-2.0) advertises 50+ ready-made blocks and components (social overlays, shader transitions, data visualisations, cinematic effects) installable by CLI; compositions are plain HTML with timed elements and a GSAP timeline. HeyGen added templates, an Inspector for visual tweaks, and textures/shaders to the catalogue (reported via aggregated tweets, unverified). — [README mirror](https://gitee.com/mcnick/hyperframes), [traeai summary](https://www.traeai.com/en/entities/hyperframes). The official docs page I fetched showed only an intro and a Catalog link, so block categories were not verified (**verify** at hyperframes.heygen.com).
- Hera outputs code-based motion graphics where keyframes, fonts, colours and easing remain editable; supports brand kits; reviewers report complex scenes often need 5-10 prompt iterations and limited precise spacing/alignment control. [claim; marketing and review sites] — [Creative AI News](https://www.creativeainews.com/articles/hera-launch-ai-product-launch-videos-prompt/), [toolworthy](https://www.toolworthy.ai/tool/hera)
- json-render: catalogue-first design (components + actions), with each component declaring props and a description that guides the model. — [LogRocket](https://blog.logrocket.com/vercel-json-render-dynamic-ui/)
- A community Remotion storyboard design uses typed scene kinds as a scene catalogue. — [GitHub issue](https://github.com/ferraroroberto/content-management/issues/359)

### Inferences
- **Layered composition over monolithic templates**: scene = background layer + 1-3 content layers (text, image, stat, character stage, icons) + overlay (captions, fx) + camera + transition. Monolithic "hook_text" style templates are fine as presets that expand into layers, so the renderer only needs layer primitives and the LLM sees presets as a convenience.
- **First 12-15 components** are listed in Section 8. A multiplicative count of distinct looks is roughly 14 components x 4 style variants x 8 palette/font packs x 6 backgrounds x 5 transitions, which is thousands of combinations, but perceived variety depends on layout and motion diversity, not colour alone. [estimate]
- **Avoiding sameness**: (a) seeded randomisation of variant, easing, entrance direction, background motif, per project; (b) variety constraints enforced in the compiler (no same component three scenes in a row, at least 5 distinct components in 8 scenes, alternating text-heavy and visual scenes); (c) theme packs that change typography, palette, corner radius, easing family and sfx set together; (d) the LLM picks `mood` (enum) and the pack decides specifics; (e) user-supplied images/screenshots/selfie carry most of the unique visual identity.
- Expand the library only when the eval set shows a recurring beat type with no good component (data-driven growth).

### Gaps
- No verified counts for Canva or CapCut templates (searches returned usage counts per template, not library totals).
- No data on Hera's component count or HyperFrames block categories beyond the 50+ claim.
- No study found of "perceived sameness" versus library size.

---

## 4. Reliability engineering: validation, repair, fallback, critique, caching

### Takeaway
Constrained decoding fixes syntax only, and the official docs and recent small-model papers agree that semantics must be validated in application code. Use cheap deterministic layers first (Zod, then geometry/timing checks computed from real text measurement), repair with a bounded error-list loop scoped to one scene, and always have a rules fallback so a video is always produced.

### Cited Findings
- Google's structured-output docs: output is syntactically valid but may be semantically wrong; always validate values in application code (Zod `.parse()`). — [Gemini docs](https://ai.google.dev/gemini-api/docs/structured-output)
- Small-model study (0.6B-4B, five models, three families): schema validity 78.6-92.9% unconstrained, 100% with Outlines/XGrammar; type-coercion failures vanish but instruction-semantic failures persist ("CD's reach ends exactly where schema conformance ends"). — [arXiv 2609.23742](https://arxiv.org/abs/2609.23742)
- Constraint Tax (Qwen2.5-0.5B/1.5B, SmolLM2-1.7B): hard schema decoding raised validity 61.5% to 100% but lowered answer accuracy 19.7% to 11.0%, and wrong-but-valid outputs went from 49.5% to 88.9%. A calendar tool-call task on Qwen2.5-1.5B dropped from 91.5% (prompt-only JSON) to 48.0% under the hard schema, both 100% schema-valid. The 3B model still paid a tax. Recommendation: report schema validity, accuracy, executable accuracy and wrong-valid rate separately. — [arXiv 2605.26128](https://arxiv.org/abs/2605.26128)
- Groq best-effort mode returns HTTP 400 on schema mismatch with advice to retry, simplify the schema, or use strict mode. — [Groq docs](https://console.groq.com/docs/structured-outputs)
- Tam et al. suggest an LLM reformat step for parsing failures improves reliability at low cost. — [arXiv 2408.02442](https://arxiv.org/pdf/2408.02442)
- Code2Video uses a VLM critic with visual-anchor prompts and scope-guided auto-fix; SceneCraft's critique loop matters (26.1 without it vs 88.9), but the loop there is paired with a constraint scorer, i.e. a programmatic check. — [Code2Video](https://icml.cc/virtual/2026/poster/65050), [SceneCraft](https://arxiv.org/html/2403.01248v1)
- Blender-agent studies: quality degrades or converges after about three refinement iterations. — [Planner-Actor-Critic](https://arxiv.org/pdf/2601.05016)
- Earlier research (given in the task) says vision-model judges are unreliable. I did not re-research this.
- StoryBlender: engine acts as gatekeeper for strict JSON because of LLM spatial hallucination. — [arXiv 2604.03315](https://arxiv.org/html/2604.03315v1)

### Inferences (proposed validator stack, all my design)
1. **L0 Transport**: provider structured output when available (Gemini; Groq strict on supported models; WebLLM XGrammar), else JSON-object mode plus a tolerant extractor (strip code fences, repair trailing commas).
2. **L1 Zod parse** with per-component prop schemas; unknown component or prop -> drop prop with warning; unknown component -> replace with `text_card` using the scene's `say`.
3. **L2 Auto-normalise (deterministic, no LLM)**: clamp enums to nearest valid, truncate/shrink text to limits, drop unavailable asset refs, convert numerics, fill defaults.
4. **L3 Semantic checks computed in code**: text length (chars per line, max lines, by script, including Devanagari width via canvas measureText); safe-area (text box inside the platform safe zone); overlap between anchored boxes; contrast ratio of text over resolved palette (WCAG formula); scene duration vs sentence/audio length (+/- tolerance); total length 25-35 s; pacing (each scene 1.5-6 s); hook present in first 3 s; variety rules; asset coverage (every user-provided asset used or explicitly skipped); sfx not clustering; no more than N words per scene.
5. **L4 Repair loop**: send only the failing scene plus a numbered error list (code, field, limit, observed) and the scene's locked neighbours as context; max 2 retries per scene, then deterministic fallback. Do not resend the whole spec (token cost, and Blender-agent evidence says gains plateau after about 3 iterations).
6. **L5 Fallback**: rules mapping beat role -> default component with user text (hook -> hook_text, number detected -> big_number, asset present -> image_focus, last -> end_card). This guarantees output when the LLM is absent, offline or exhausted.
7. **Optional L6 render-and-critique**: rendering one thumbnail per scene and asking a vision model is possible with a free Gemini key, but given the unreliability of VLM judges and quota cost, keep it as opt-in "polish" reporting advisory flags, never auto-editing; code metrics are the gate. [inference]
8. **Caching**: cache LLM outputs keyed by hash(prompt version + beat text + catalogue version + model + seed); a regenerate action bumps the seed; cache the compiled layout results per scene for fast preview. Store raw model output and validation report in the project JSON's debug area for the eval harness.
9. **Determinism**: seed must be stored in the spec; renderer must never call Math.random.

### Gaps
- No measured data found on VLM critique success for animated short layouts (earlier research is the only source).
- Typical repair-loop convergence numbers for spec-style outputs (rather than code) were not found; the reported "91-96% with 5 retries" is for code.
- Quota/rate limits of free tiers (Gemini, Groq) not verified, which constrains how many repair calls are affordable.

---

## 5. Small and free model performance on structured creative JSON

### Takeaway
Small models (0.5-4B) reach near-100% syntax validity with constrained decoding, but pay a semantic tax: wrong-but-valid output rises. For 1-8B models the evidence supports short prompts, tiny per-call schemas, decomposition, and free reasoning before constrained packaging. Absolute quality for creative layout with 1-8B models has not been measured by anyone I found, so thresholds must come from our own eval.

### Cited Findings
- JSONSchemaBench (Geng et al., Microsoft; 10K real-world schemas): complexity is the main driver. Llama-3.1-8B/1B results: on easy GlaiveAI schemas compliance is 0.93-0.98 across engines, unconstrained 0.90; on GitHub-Medium Guidance 0.87, Llamacpp 0.74, XGrammar 0.66, Outlines 0.40, unconstrained 0.38; on GitHub-Hard 0.69/0.63/0.41/0.06 vs unconstrained 0.13. Outlines suffered timeouts on `minItems`/`maxItems`/`enum`. Closed engines had low empirical coverage (OpenAI 0.29, Gemini 0.07 on GitHub-Easy, with compliance 0.97 and 0.88), but the paper warns open and closed results are not directly comparable. — [JSONSchemaBench](https://arxiv.org/html/2501.10868v2)
- Same paper: constrained decoding gave small accuracy gains downstream (GSM8K 80.1% -> 82-84% for Llama-3.1-8B). — same source.
- Qwen3 small models on BFCL: sources conflict. TinyLLM paper (prompt mode) reports Qwen3-4B 62.04% overall (multi-turn 35.25%) and Qwen3-1.7B 55.49% (multi-turn 16.88%); a leaderboard aggregator lists Qwen3-4B-Instruct-2507 around 35.5% and Qwen3-1.7B around 28.1%, Qwen3-8B 42.4%. Both agree single-turn is much better than multi-turn. **[verify]** against the official BFCL leaderboard. — [TinyLLM](https://arxiv.org/pdf/2511.22138), [benchmarklist BFCL](https://benchmarklist.com/benchmarks/bfcl/)
- StructEval (ICLR 2026): even o1-mini averaged 75.58, open models about 10 points lower, generation harder than conversion, visual formats harder than text; a third-party leaderboard lists Qwen3-4B at 67.04% average (provenance not confirmed). — [StructEval](https://arxiv.org/html/2505.20139v3), [benchmarklist](https://benchmarklist.com/benchmarks/structeval/)
- "Don't Adapt Small Language Models for Tools; Adapt Tool Schemas to the Models": constrained generation raised Qwen2.5-7B single-turn tool selection from 49.5% to 78.1% on RoTBench. — [arXiv 2510.07248](https://arxiv.org/pdf/2510.07248)
- Small-model code generation is the weak point: AutoPresent reports un-tuned 7-8B models often cannot produce executable code. — [arXiv 2501.00912](https://arxiv.org/html/2501.00912v2)
- WebLLM overhead for constrained decoding is near zero in the XGrammar paper's tests, including a 0.5B model on a phone. — [XGrammar](https://arxiv.org/pdf/2411.15100)

### Inferences
- **Make the model's job small**: Call 1 free-text beats; Call 2 per scene with only (beat text, role, previous scene's `use`, remaining asset list, palette name) and a 2-example prompt, about 400-800 input tokens [estimate]. For on-device 1-4B models, use the 4-field "card" (Example C) and let code expand it.
- **Reduce choice entropy**: for small models, present only 6-8 relevant components for the beat role (hook -> {hook_text, big_number, image_focus}), not all 15.
- **Reason free, constrain late** where the model must make a creative choice: let it write a one-line "visual idea" (free text), then pick the component and props under the schema.
- **Expected outcomes** [estimate, untested]: cloud free-tier models (Gemini Flash-class, GPT-OSS-class on Groq) with structured outputs should reach >=98% schema validity per scene and need semantic repair in perhaps 5-15% of scenes; 1-4B on-device models with grammar constraints reach ~100% syntax but a higher wrong-valid rate, so the rules fallback and heavier normalisation carry more of the quality. These must be replaced by measured numbers from the eval harness.
- Avoid the Outlines-style engines for schemas with `enum`/`minItems` in a browser setting; WebLLM's XGrammar may under-constrain on complex schemas (JSONSchemaBench), so always run Zod after decoding even in constrained mode.

### Gaps
- No benchmark found of 1-8B models on creative layout JSON (video, slides or posters) with a quality metric.
- BFCL small-model numbers conflict between sources.
- No verified data on WebLLM model availability/latency for Qwen3 sizes in October 2026 (not searched in this pass).

---

## 6. Human-in-the-loop: editing, locks, scoped regeneration

### Takeaway
Commercial tools keep AI output as editable structure (Hera: keyframes, fonts, colours, easing stay editable; follow-up prompts refine), and the typed-ops, locks and undo model Introcut already has is the right fit. Concrete lock semantics and "regenerate one scene" UX for Canva Magic and CapCut were not found in sources.

### Cited Findings
- Hera: output stays code-based and editable; users refine with plain-language follow-ups and on-canvas editing; reviewers report 5-10 iterations for complex scenes and limited fine alignment control. [claim] — [Creative AI News](https://www.creativeainews.com/articles/hera-launch-ai-product-launch-videos-prompt/), [Medium review](https://medium.com/data-science-collective/hera-build-motion-graphics-with-ai-ffee1fac66c7)
- HyperFrames added an Inspector for visual tweaks to AI-made compositions (unverified tweet summaries). — [traeai](https://www.traeai.com/en/entities/hyperframes)
- AutoPresent: programmatic output yields "user-interactable" editable formats versus image generation. — [arXiv 2501.00912](https://arxiv.org/html/2501.00912v2)
- Blender case study on output-level human feedback (feedback on rendered output only) examines how it fails for coding agents, i.e. agents lose track of what to change. — [arXiv 2603.26942](https://arxiv.org/pdf/2603.26942) (title only seen in search results; content not read)

### Inferences (design)
- **Scene is the unit of regeneration**: each scene has `id` and optional `lock` per field path (`p.text`, `use`, `cam`). Regenerate-scene sends the scene, its neighbours' `use` values (for variety), and locks; the response is merged field by field, ignoring locked paths. Output becomes a single typed op `replaceScene(id, patch, origin:"ai")`, so undo is one step.
- **Edits become locks** (per project rule): any user edit to a field adds a lock on that path; the AI-side validator rejects patches that touch locked paths (code-enforced, not prompt-enforced).
- **Scoped NL instructions** ("make this scene punchier") run with the same pipeline over one scene plus a short instruction; "shuffle look" only changes the seed and theme variant (free, no LLM call).
- **Diff preview**: show before/after for the scene and accept/reject, since Hera users reportedly iterate many times.
- **Regenerate variants cheaply**: seed bump re-rolls variation without LLM; LLM re-roll only when the user asks for a different idea.

### Gaps
- No documentation retrieved on how Canva Magic Design/Magic Studio or CapCut AI scope regeneration or preserve manual edits.
- Hera's lock/undo semantics were not documented in any source retrieved.

---

## 7. Evaluation: a cheap harness for spec quality

### Takeaway
There is no standard benchmark for LLM-generated motion-graphic specs, so build a small code-computed harness. Report validity, repair dependence, wrong-valid rate, layout/timing violations and variety separately, in the spirit of the Constraint Tax recommendation. All thresholds below are proposals.

### Cited Findings
- Constraint Tax recommends reporting schema validity, answer accuracy, executable accuracy and wrong-valid-schema rate as separate metrics. — [arXiv 2605.26128](https://arxiv.org/abs/2605.26128)
- SceneCraft evaluates with a programmatic constraint score plus CLIP similarity and human pairwise preference (76.8% wins). — [arXiv 2403.01248](https://arxiv.org/html/2403.01248v1)
- Code2Video evaluates with a VLM aesthetic score, code efficiency, and TeachQuiz (a viewer model answers questions after watching). — [project listing](https://icml.cc/virtual/2026/poster/65050)
- MCP-Universe uses execution-based evaluators instead of LLM judges. — [arXiv 2508.14704](https://arxiv.org/pdf/2508.14704)
- StructEval separates text-only and visual-rendering checks. — [arXiv 2505.20139](https://arxiv.org/html/2505.20139v3)

### Inferences (proposed harness, thresholds are estimates)
- **Regression set**: 30 prompts (10 each: explainer/stat-led, character story, product/screen-recording promo) x 3 languages incl. one Devanagari prompt x 3 seeds, run against each supported model path (Gemini free, Groq, WebLLM small model, rules fallback). Store raw outputs and the validator report. Run on every change to prompts, catalogue or validators.
- **Metrics (all computed in code)**:
  - First-pass schema validity (before any repair) and post-repair validity; fallback rate per scene.
  - Wrong-valid rate: scenes that parse but fail L3 semantic checks.
  - Overlap/safe-area/contrast violations per video; text-overflow count.
  - Timing accuracy: |sum of scene durations - target| and per-scene vs sentence-length mismatch.
  - Variety: number of distinct components, max run length of the same component, entropy of `use`, distinct transitions, and a pairwise "same video" score across seeds for one prompt.
  - Asset coverage: share of user assets used.
  - Cost: tokens in/out, number of calls, latency.
- **Proposed pass thresholds [estimate]**: cloud models first-pass scene validity >=90% and post-repair 100% (fallback allowed), semantic violations after auto-fix = 0 hard (overflow outside safe area, unreadable contrast), timing within +/-1 s of target, >=5 distinct components in 8 scenes, no component repeated 3 times in a row; on-device small model first-pass >=70% with the same post-repair outcome (everything shipped must pass hard checks).
- **Human rating**: 5-10 representative outputs per release rated 1-5 by 2-3 people on hook strength, readability, visual match to the sentence, variety, "would post"; also pairwise against the rules-fallback baseline for the same prompt (target: AI spec preferred in >=60% of pairs [estimate]). Use few humans because VLM judges are unreliable per earlier research.
- **Optional cheap vision check** (non-gating): render one frame per scene and ask a VLM only objective questions (is text readable? is anything cut off?), compare with code metrics to measure agreement before trusting it.

### Gaps
- No existing benchmark or public dataset of LLM-generated short-video scene specs was found.
- No evidence on appropriate thresholds; the numbers above are untested proposals.

---

## 8. Recommendation: concrete spec architecture, pipeline and first components

### Takeaway
Use a three-layer pipeline: free-text beat sheet -> per-scene constrained "scene cards" validated by Zod and code checks -> deterministic compile into a resolved timeline rendered by `renderFrame`. Build 14 components, a small effects vocabulary, 6-8 theme packs, and the eval above before expanding.

### Cited Findings
- Planner stage had the largest effect in Code2Video (given in task); SceneCraft's relation-graph ablation shows an intermediate representation matters most. — [SceneCraft](https://arxiv.org/html/2403.01248v1)
- Constrained decoding does not fix semantics; "reason free, constrain late" is proposed for small models. — [arXiv 2605.26128](https://arxiv.org/abs/2605.26128), [arXiv 2609.23742](https://arxiv.org/abs/2609.23742)
- Catalogue + Zod is the pattern used by json-render. — [InfoQ](https://infoq.com/news/2026/03/vercel-json-render)

### Inferences (my recommendation)

**Pipeline (calls and steps)**
1. *Brief normalise (code)*: collect idea, assets (with tags: screenshot, selfie, recording, clip), voice choice, target length, language, theme.
2. *Call 1 - Beat sheet (LLM, free text or lightly structured)*: existing script writer produces 6-9 beats: role (hook, problem, turn, proof, payoff, cta), narration sentence, one-line visual idea, optional emphasised word/number. Already built.
3. *Pre-pass (code)*: bind assets to beats by simple rules (and later by embeddings), detect numbers/lists/quotes in sentences to suggest component shortlist per beat.
4. *Call 2..N - Scene card (LLM, one per beat, schema-constrained)*: input = beat + shortlist of 6-8 components + theme name + previous `use`; output = Example A scene object. Can run in parallel for cloud models; sequential for on-device. Small model uses the 4-field card.
5. *Validate and normalise*: L1-L3 from Section 4; auto-fix; collect error list.
6. *Repair (max 2 per scene)*: only for scenes with remaining errors; then fallback component.
7. *Compile (code)*: durations from voice alignment; anchors -> boxes; theme pack + seed -> variants, easing, sfx; variety pass (re-pick variants, not components, to fix repetition); write resolved timeline plus `compiled` hash.
8. *Render/preview*: `renderFrame`; optional opt-in vision critique as advisory.
9. *Edit loop*: typed ops, locks, scene-scoped regenerate.

**First 14 components** (each with 2-6 props, all defaulted):
1. `hook_text` (big kinetic title + sub), 2. `big_number` (count-up with unit/label), 3. `image_focus` (still with push-in/pan, caption), 4. `split_compare` (two images or before/after), 5. `bullet_reveal` (up to 3-4 short lines), 6. `quote_card`, 7. `icon_row` (3 icons from a closed icon set with labels), 8. `bar_chart_simple` (2-5 bars growing), 9. `steps_timeline` (3-5 steps), 10. `character_stage` (preset characters + sets + the closed action list, anchors left-third/center/right-third/ground), 11. `screen_demo` (user screenshot/recording in a device frame with highlight ring and zoom), 12. `selfie_title` (user's face/clip with lower-third), 13. `text_card` (the universal safe fallback), 14. `end_card` (CTA + handle). Global layers: `captions` (already built), background packs (gradient, grid, particles, paper), camera enum (none, push, pull, pan-l, pan-r, shake), transitions (cut, fade, slide-l/r, wipe, zoom), sfx cue enum (hit, whoosh, pop, tick, riser, ding), 6-8 theme packs (palette + font pair + easing + corner style + sfx set). A 15th, `sticker_pop` (emoji/prop pop-ins as overlay), can follow.

**Provider specifics**
- Gemini: one flat response schema per scene card, `propertyOrdering` set, few-shot keys in the same order, avoid `anyOf` explosion and large nested `maxItems`.
- Groq: strict mode only on supported models (verify list at call time via a capability probe); every field required with nullable unions; fall back to JSON-object plus Zod.
- WebLLM: XGrammar JSON-schema mode for the 4-field card; Zod always after.
- All: temperature low (0.3-0.6) for the card call, higher for the beat sheet [estimate].

**Eval to run first**: the Section 7 harness with 30 prompts x 3 seeds x 4 paths (Gemini, Groq, WebLLM small model, rules fallback). Decision gates: if first-pass validity < 70% on the best free cloud path, simplify the schema (fewer props/components) before adding repair; if the on-device model's wrong-valid rate is > 40% [estimate], ship it only in 4-field card mode plus fallback.

**Open risks**: free-tier quota for N per-scene calls (mitigate by batching two or three scenes per call when quota is tight); structured-output feature churn across providers; copy-the-example collapse in few-shot; sameness across videos (mitigated by seeds and variety rules).

### Gaps
- All thresholds and component counts are proposals; none are validated by an external study.
- Current free-tier limits and model lists (Gemini, Groq, WebLLM catalogue) must be re-verified before implementation.
