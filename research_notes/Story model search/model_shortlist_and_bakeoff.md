# Model shortlist and bake-off for story idea -> scene plan -> JSON action timeline (EN / HI / NE), as of 2026-10-22

Method note: builds on `research_notes/Free AI script writer for Introcut/free_llm_options.md` and `nepali_hindi_quality.md` and on `research_notes/Code generated 30 second clips plan/llm_scene_spec_design.md` (not repeated here: free-tier plumbing, CORS, WebLLM VRAM table, validator stack L0-L6, Constraint Tax, json-render, LayoutGPT/SceneCraft/Code2Video). New searches were run 2026-10-22. Many 2026 model names (Gemini 3.8/4, Qwen3.8, Kimi K3, GLM-5.3, DeepSeek V4, MiMo, Muse Spark) are newer than my training data, so they are reported only as the sources state them. Several pages were read through a summarising fetch tool and some are aggregator blogs; those are flagged. Anything not confirmed is marked **verify**. I did not invent any benchmark number; where I found none, it is in Gaps.

---

## 1. Which models are best for creative story planning plus structured spatio-temporal JSON, and what are their licences, sizes, free availability, structured-output support and Hindi/Nepali evidence?

### Takeaway
No single 2026 benchmark measures "story idea -> closed-vocabulary action-timeline JSON", so the ranking below is built from proxies (creative-writing boards, IFEval/BFCL/LiveCodeBench, Indic benchmarks) and must be confirmed by the bake-off in section 6. Best bets for a user-supplied free key: Gemini 3.x Flash/Flash-Lite (schema-constrained, best expected Hindi/Nepali) and Gemma 4 31B (Apache-2.0, free on Gemini API and OpenRouter, the only open model with direct Indic evidence); for self-hosting or later fine-tuning only permissively licensed models count: Gemma 4, Qwen3.5 (Apache-2.0), gpt-oss (Apache-2.0), Mistral Small 4 (Apache-2.0), DeepSeek V4 (MIT per most sources, **verify**). Kimi K3 and GLM-5.3 lead creative-writing boards but carry non-standard licences and are huge, so they are "user-key / OpenRouter only" candidates.

### Cited Findings

**Gemini (hosted, user key)**
- Google's model page (updated 2026-10-21) lists as stable: `gemini-4-argon`, `gemini-3.8-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`; `gemini-3-flash-preview` is preview; `gemini-2.5-flash/-lite/-pro` are "access-limited" (served until further notice to past users, not shut down as a third-party blog had claimed); several 2.0 and 3-pro-preview ids are shut down. The page does not say which models support structured output or thinking. — [Gemini models](https://ai.google.dev/gemini-api/docs/models)
- Pricing page (updated 2026-10-19): free tier is "free of charge" for Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite, 3 Flash Preview, 2.5 Pro/Flash/Flash-Lite, and Gemma 4. Gemini 4 Argon is NOT on the free tier. Paid: 3.8 Flash $0.75 in / $3.75 out per 1M tokens through 2026-12-31, then $1.50 / $7.50 from 2027-01-01 (output includes thinking tokens); 3.5 Flash-Lite $0.30 / $2.50; 3.1 Flash-Lite $0.25 / $1.50. — [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Free-tier request limits are unpublished (per project, visible in AI Studio); one forum report says 3.8 Flash is 20 requests/day and Flash-Lite 500/day (unofficial). — [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [forum](https://discuss.ai.google.dev/t/gemini-3-8-flash-free-tier-20-rpd-is-too-limited-for-practical-evaluation/180609)
- Structured output: JSON schema subset; ignores minLength/maxLength; may be valid but semantically wrong (see earlier note). — [docs](https://ai.google.dev/gemini-api/docs/structured-output)

**Gemma 4 (open weights, Apache-2.0)**
- April 2, 2026 release moved Gemma to Apache-2.0 for the first time; sizes E2B (2.3B effective), E4B (4.5B effective), 26B MoE (3.8B active), 31B dense (30.7B); 128K context for the small two, 256K for the large two. — [The Decoder](https://the-decoder.com/googles-gemma-4-is-now-available-with-apache-2-0-licensing-for-the-first-time/), [datanorth](https://datanorth.ai/news/google-releases-gemma-4-open-models)
- 31B model card: licence apache-2.0; LiveCodeBench v6 80.0%, MMLU-Pro 85.2%, MMMLU 88.4%, Tau2 76.9%, Codeforces Elo 2150; "35+ languages out of the box", pre-trained on 140+; native system role, thinking toggle `<|think|>`, "structured tool use"; no JSON-schema enforcement described, no IFEval or BFCL on the page. — [Gemma-4-31B-it card](https://huggingface.co/google/gemma-4-31B-it)
- Indic evidence: a 2026 multilingual QA benchmark translated into 19 Indic languages plus English (Nepali is in the dataset but NOT in the multilingual model evaluation) evaluated Gemini 2.5 Flash, GPT-5.4 Mini, Gemma4 31B, Sarvam 30B, Gemma2 9B, Llama 3.1 8B (no Qwen). Gemma4 31B weighted accuracy about 56.9% (Tamil, lowest) to 66.9% (Hindi, highest), beat Indic-specialised Sarvam 30B in every language by 17.4 to 28.3 points (largest in Hindi); per-language numbers for Gemini 2.5 Flash were not legible in the extract. Judge was Gemma 3 12B (a weak judge; take with care). — [HF paper page 2608.15535](https://huggingface.co/papers/2608.15535)
- VakyArth (Sept 2026, pragmatic competence across Indic languages) reports Gemma-4-31B as the strongest model overall (MCQ 0.86, NLI 0.43, COMET 0.81), ahead of Command-A-111B and Sarvam-105B, per a search summary; I could not read the PDF to confirm which languages (Nepali?) were included. — [arXiv 2609.01788](https://arxiv.org/pdf/2609.01788) (**verify**)
- Free hosted: free on Gemini API, and `google/gemma-4-31b-it:free` and `gemma-4-26b-a4b-it:free` on OpenRouter as of 2026-10-21 (from the earlier note).

**Qwen (Alibaba)**
- Qwen3.5-35B-A3B card: Apache-2.0; 35B total / 3B active; "201 languages and dialects"; IFEval 91.9, LiveCodeBench v6 74.6, BFCL-V4 67.3, MMMLU 85.2, PolyMath 64.4, INCLUDE 79.7, NOVA-63 57.1; no Hindi or Nepali mention, no writing benchmark on the page. — [Qwen3.5-35B-A3B card](https://huggingface.co/Qwen/Qwen3.5-35B-A3B)
- Qwen3.5 4B/9B are Apache-2.0 (earlier note). A blog (no data cited) claims Qwen3.5 is slightly more reliable for strict JSON schemas and function calling than Gemma 4 31B. — [MindStudio](https://www.mindstudio.ai/blog/gemma-4-31b-vs-qwen-3-5-comparison/) (low-quality source)
- Qwen3.8 Max ranks 2nd on BenchLM open-weight list (69.7, "Supported") but Artificial Analysis flags it `isOpenWeights: false`; arena.ai labels it Proprietary. So the newest big Qwen is not usable as open weights. — [DEV audit, 2026-10-19](https://dev.to/ward_ed_6b5e6aa8ded94a987/best-open-weight-llm-in-october-2026-auditing-two-leaderboards-row-by-row-1b64), [Digital Applied](https://www.digitalapplied.com/blog/which-ai-model-writes-best-leaderboards-disagree)
- Groq lists a preview `qwen/qwen3.8-27b` (450 tok/s claimed) with strict structured outputs (earlier note). Its licence was not checked (**verify**). Qwen3-Coder: not researched this pass (see Gaps).

**gpt-oss (OpenAI)**
- gpt-oss-120b: Apache-2.0, 117B total / 5.1B active, lists "Structured Outputs" among native capabilities; card shows SWE-bench Verified 52.6 (reasoning medium), GPQA Diamond 80.81; no multilingual claim. — [gpt-oss-120b card](https://huggingface.co/openai/gpt-oss-120b)
- A BenchLM comparison table lists gpt-oss-120b LiveCodeBench about 25% vs Qwen3.5-35B-A3B 74.6% (aggregator, number looks low, **verify**); a community report says gpt-oss-20b failed structured tasks even at high reasoning. — [BenchLM compare](https://benchlm.ai/compare/gpt-oss-120b-vs-qwen3-5-35b-a3b), [search summary](https://www.glukhov.org/ai-devtools/opencode/llms-comparison/)
- On Groq: gpt-oss-20b/120b strict structured outputs, 30 RPM / 1K RPD "developer plan base limits" (earlier note).

**DeepSeek, Kimi, GLM, MiMo (big open-weight Chinese models)**
- DeepSeek V4 Pro (1.6-1.7T) and V4 Flash (284B) widely reported as MIT-licensed; one outlier article says custom weights licence; check the model card. — [aiweekly](https://aiweekly.co/alerts/deepseek-v4-pro-exits-preview-with-mit-licensed-17t-weights); outlier [Lambda blog result via search](https://lambda.ai/blog/deepseek-v4-the-most-expected-open-source-model) (**verify**)
- Kimi K3 (2.8T params, ~1.56 TB, weights July 27, 2026): custom `kimi-k3` licence; reported terms: attribution in UI above 100M MAU or $20M monthly revenue; separate agreement for model-as-a-service above $20M revenue per 12 months; reporting conflicts on whether it is still "modified MIT". — [Simon Willison](https://simonwillison.net/2026/Jul/27/kimi-k3/), [VentureBeat](https://venturebeat.com/technology/kimi-k3s-full-weights-are-here-but-theyre-open-with-a-caveat-what-enterprises-should-know) (secondary; **verify** LICENSE file)
- GLM-5.3: Z.ai model card lists `license: other` (arena.ai labelling it "MIT" is disputed). — [Digital Applied](https://www.digitalapplied.com/blog/which-ai-model-writes-best-leaderboards-disagree)
- MiMo-V2.6-Pro ranks first open-weight on BenchLM (73.7, "Estimated", range 63.92-83.37) and Artificial Analysis (46.3) as of 2026-10-19; MIT is confirmed only for a `-RL` repo, so licence of the ranked checkpoint is unverified; the two leaderboards diverge below #1 (Kendall tau 0.61). — [DEV audit](https://dev.to/ward_ed_6b5e6aa8ded94a987/best-open-weight-llm-in-october-2026-auditing-two-leaderboards-row-by-row-1b64)
- Artificial Analysis Intelligence Index (as quoted in the audit, 2026-10-19): GLM-5.3 44.8, DeepSeek V4.1 Flash 1017 45.1, Kimi K3 43.6, Qwen3.8 Max 45.4, MiMo-V2.6-Pro 46.3. These are index points for general intelligence, not creative or JSON ability. — same source

**Mistral, Llama, Nemotron**
- Mistral Small 4 (2026-03-16): Apache-2.0; 119B total / ~6.5B active MoE; unifies instruct, reasoning, multimodal, and Devstral-style agentic coding; no separate Devstral model licence found. — [Mistral](https://mistral.ai/news/mistral-small-4/), [testingcatalog](https://www.testingcatalog.com/mistral-releases-mistral-small-4-model-under-apache-2-0-licence.md)
- Nemotron 3 Super 120B-A12B and Ultra 550B-A55B are free on OpenRouter (2026-10-21; `structured_outputs` flagged for Super); NVIDIA open model licence terms not checked. — [OpenRouter models API](https://openrouter.ai/api/v1/models) (from earlier note)
- Meta: Llama 3.x uses the Llama community licence (earlier note); `muse-spark-open` appears on Groq (preview) and Muse Spark ranks 20th on arena.ai creative; its licence was not checked. Llama 4: not researched (no result found).

**Creative-writing boards (dated)**
- EQ-Bench Creative Writing v3 top 10 by Elo (no as-of stamp; judges are two Claude models): claude-opus-5 2116, kimi-k3 2071, GLM-5.3 2062, gpt-5.6-sol 1964, ox-alpha 1960, claude-fable-5 1933, muse-spark-1.1 1915, claude-opus-4-7 1906, gpt-5.6-terra 1850, gpt-5.5 1844. — [Digital Applied, 2026-08-31](https://www.digitalapplied.com/blog/which-ai-model-writes-best-leaderboards-disagree)
- arena.ai Creative Writing (snapshot 2026-08-27, 1.21M votes, selected rows): claude-fable-5 1505, claude-opus-4-6-high 1500, gemini-3-pro 1483 (rank 5), glm-5.3-max 1467 (13), qwen3.8-max 1464 (16), muse-spark 1464 (20), kimi-k3-max 1458 (23). The boards largely invert each other (kimi-k3 2nd on EQ-Bench, 23rd on arena). — same source
- Direct `eqbench.com/creative_writing.html` loaded without rows for me. A router vendor claims "deepseek-v4-pro EQ-bench 75, best open-weights creative model", contradicting the above; unverified, no date. — [OrcaRouter](https://www.orcarouter.ai/best/creative)
- Gemma 4, Gemini 3.5/3.8 Flash(-Lite), Qwen3.5 and gpt-oss do not appear in the rows I retrieved; I found no creative-writing score for them.

**Hindi/Nepali (additional to earlier note)**
- 2026 Nepali work found: NeCCo (CHiPSAL 2026, Nepali cultural commonsense MCQ; models not named in the abstract), an Achhami-dialect NER/POS study (LLMs lose 2.9-7.0% on the dialect), NLUE (older). No Nepali generation benchmark comparing Gemma/Qwen/Gemini. — [NeCCo](https://aclanthology.org/2026.chipsal-1.15/), [SIGUL 2026](https://aclanthology.org/2026.sigul-1.21/), [NLUE](https://arxiv.org/html/2411.19244v3)
- Hindi-specific 2025 suite (Hindi IFEval, MT-Bench, GSM8K, BFCL translated): Gemma-2-9B and GPT-OSS-120B led (per search summary). — [arXiv 2508.19831](https://arxiv.org/pdf/2508.19831)

### Inferences
- Ranking for THIS task (proxy-based, to be replaced by bake-off): 1) Gemini 3.8 Flash and 3.5/3.1 Flash-Lite (schema decoding, strongest expected Hindi/Nepali; free but quota-poor); 2) Gemma 4 31B (Apache-2.0, 80.0% LiveCodeBench, best open Indic evidence, free on two routes, same family on-device at E2B/E4B); 3) Qwen3.5-35B-A3B/Qwen3.8-27B (IFEval 91.9, BFCL 67.3, Apache for 3.5; Hindi/Nepali unproven); 4) gpt-oss-120b on Groq (fast, strict schema, but dry prose and no multilingual claim, and likely weak Nepali); 5) Nemotron 3 Super free on OpenRouter (untested for Indic); 6) DeepSeek V4 Flash / GLM-5.3 / Kimi K3 as user-key "quality ceiling" options (strongest creative boards, but huge, not self-hostable by us, and licence terms vary).
- The only models we could ever bundle, self-host or fine-tune and ship are: Gemma 4 (E2B/E4B/26B/31B), Qwen3.5 (0.8B-35B), gpt-oss-20b/120b, Mistral Small 4, and DeepSeek V4 (MIT, but too big). That narrows a future "own hosted model" to Gemma 4 or Qwen3.5 (plus Gemma's Indic edge).
- Creative boards and arena rankings disagree and are judged by Claude models (EQ-Bench) or English-speaking voters; neither measures Hindi/Nepali. Treat creative scores as a weak tie-breaker.
- The `Gemini 4 Argon` model is paid-only; do not plan on it for the free path.

### Gaps
- No creative-writing, IFEval or JSON-validity number found for Gemma 4, Gemini 3.x Flash(-Lite), Qwen3.5 or gpt-oss in a single comparable table; no WritingBench, BFCL or JSONSchemaBench result for any 2026 model was retrieved (aggregator pages only).
- Llama 4, Qwen3-Coder, Devstral standalone, Nemotron 3 licence terms, Mistral free-tier numbers: not confirmed.
- Hindi/Nepali: no head-to-head of Gemini 3.x vs Gemma 4 vs Qwen3.5 on Nepali generation; VakyArth language list unverified.
- Free-tier request limits for Gemini and Groq unpublished (console-only).

---

## 2. Is there a permissively licensed specialised model for text-to-animation, scene, SVG, Lottie or storyboard generation that helps us?

### Takeaway
Specialised vector/Lottie models exist and some are Apache-2.0, but they output raw SVG/Lottie (a different, verbose target), are research-grade, and cannot express "this character digs, then plants, timed to a Hindi sentence". None helps V1; none replaces a general LLM writing our own closed-vocabulary JSON. They are only interesting later as a source of prop/background art.

### Cited Findings
- OmniLottie (CVPR 2026): README states "OmniLottie is licensed under the Apache License 2.0, while MMLottie-2M dataset is under CC BY-NC-SA 4.0"; supports text-to-Lottie; the tokenizer path points to Qwen2.5-VL-3B-Instruct (so base-model licence also matters, not checked); weights ~8.46 GB (4B) reported on a mirror, released 2026-03-03; training code not yet released. — [OmniLottie GitHub](https://github.com/OpenVGLab/OmniLottie), [mirror](https://cnb.cool/ai-models/OmniLottie)
- Earlier note: general LLMs writing raw Lottie fail often (Qwen2.5-VL 0%, DeepSeek 29.3%, GPT-5 12.7-68.7%), which is why OmniLottie re-tokenises. — [OmniLottie supplement](https://openaccess.thecvf.com/content/CVPR2026/supplemental/Yang_OmniLottie_Generating_Vector_CVPR_2026_supplemental.pdf) (from earlier note)
- VAnim (ICML 2026 poster, May 2026): first LLM framework for open-domain text-to-SVG animation, treats animation as sparse updates to a persistent SVG DOM tree (9.8x shorter sequences); weights/licence not stated in what I saw. — [VAnim](https://icml.cc/virtual/2026/poster/64100) (**verify** licence/release)
- Graphic-Design-Bench (Apr 2026): includes Lottie animation tasks on a 50-item subset (up to 10 layers, 50 KB, mean 4.4 s); abstract says "temporal decomposition of animations remain largely unsolved" for frontier closed models. — [GDB arXiv](https://arxiv.org/abs/2604.04192), [PDF](https://arxiv.org/pdf/2604.04192)
- InternSVG family (open, 8B variant reportedly lowest FVD on text-to-animated-SVG task); licence not verified. SVGenius (2025): proprietary models beat open ones on SVG. — [SVGenius](https://arxiv.org/pdf/2506.03139) (InternSVG licence: **verify**)
- Earlier note: StarVector/OmniSVG/Chat2SVG are static or path-level; VideoDirectorGPT and MovieAgent plan and then feed pretrained video generators (not code renderers).

### Inferences
- OmniLottie is Apache-2.0 and could in theory be self-hosted, but (a) 4B VLM, 8 GB, not browser-friendly; (b) outputs Lottie of short icon-like loops, not narrated multi-actor scenes; (c) we would still need a story planner. Recommend no use in V1.
- The best "specialised" approach for us is our own closed vocabulary plus a general LLM, optionally fine-tuning Gemma 4 or Qwen3.5 later on (story, JSON) pairs distilled from the bake-off winners (check teacher-model terms before distilling).

### Gaps
- No story-to-storyboard model with a permissive licence that emits an editable timeline was found. MovieAgent/VideoDirectorGPT repo licences were not checked.
- VAnim and InternSVG licences/weights not confirmed.

---

## 3. Free code vs JSON spec: can strong coders reliably write animation code, and what should V1 do?

### Takeaway
Evidence for direct code is thin and mixed: no benchmark of Manim/Canvas animation code failure rates turned up (search returned only generic code studies); the nearest data show code approaches improve with planner/critic scaffolding (Code2Video +40% over direct code) but small and even large models often produce non-running code for niche libraries. A validated closed-vocabulary JSON spec avoids the whole execution-failure and safety class. Recommend JSON spec for V1; treat sandboxed code as a later, opt-in "advanced scene" feature.

### Cited Findings
- No source found that measures Manim or Canvas animation code success rates in 2026. — [search, 2026-10-22](https://arxiv.org/pdf/2511.04355v1) (generic code study only; nothing on Manim)
- Earlier note: AutoPresent shows un-tuned 7-8B models often cannot produce executable code; Code2Video (Planner/Coder/Critic with auto-fix) reports +40% over direct code generation; Blender-agent loops plateau after about 3 refinement rounds; MCP-Universe GPT-5 52.63% on 3D design.
- Coding strength of candidates: Gemma 4 31B LiveCodeBench v6 80.0%; Qwen3.5-35B-A3B 74.6%; gpt-oss-120b SWE-bench Verified 52.6 (card). — [Gemma card](https://huggingface.co/google/gemma-4-31B-it), [Qwen card](https://huggingface.co/Qwen/Qwen3.5-35B-A3B), [gpt-oss card](https://huggingface.co/openai/gpt-oss-120b)
- Earlier note: Constraint Tax, JSONSchemaBench and json-render (catalogue + Zod) support a validated spec.

### Inferences
- Code correlates with spec-writing ability (both need exact syntax, consistent IDs, arithmetic on times) but competitive-programming scores do not measure "visually correct animation". Use LiveCodeBench only as a rough filter.
- Sandboxed code would need: a Web Worker or sandboxed iframe with no network, a deterministic API (`draw(t)` only, seeded RNG, no `Math.random`/`Date`), an instruction/time budget, an AST allowlist, frame-level determinism tests, and a fallback to the spec renderer. Safety is manageable in the browser sandbox, but quality variance, no editability (violates "edits become locks via ops") and lower success from free-tier/small models make it a poor V1 default.
- Middle path to test: spec for the timeline plus a tiny set of parametric "recipes" (e.g. dig = shovel-swing loop + soil-pile prop state) written by us; the LLM only picks recipe + parameters.

### Gaps
- No measured JSON-vs-code comparison on the same task; no animation-code failure rates.

---

## 4. Prompting strategies, calls, tokens and free-tier cost for this task

### Takeaway
Use: beat sheet (free text, strong model) -> per-scene action list (small constrained JSON, 1 call per scene or per 2-3 scenes) -> code compiler and validator -> bounded repair. About 4-8 calls and roughly 6-12K total tokens per 30 s video; at paid Gemini Flash-Lite prices that is well under one US cent (estimate), but the free-tier request cap is the real limit.

### Cited Findings
- Constrained decoding raises validity, can lower semantic accuracy in small models (Constraint Tax 61.5%->100% valid, accuracy 19.7%->11.0%); strict formats hurt reasoning in some models, helped in JSONSchemaBench GSM8K; "reason free, constrain late" proposed. — [Constraint Tax](https://arxiv.org/abs/2605.26128), [Tam et al.](https://arxiv.org/pdf/2408.02442), [JSONSchemaBench](https://arxiv.org/html/2501.10868v2)
- Gemini ignores maxLength; property ordering matters; keep schema shallow; Groq strict requires all fields `required` (earlier note). — [Gemini docs](https://ai.google.dev/gemini-api/docs/structured-output), [Groq docs](https://console.groq.com/docs/structured-outputs)
- Relation/anchor-based intermediate representation gave the largest ablation effect (SceneCraft 88.9 vs 3.2 without relation graph); VideoDirectorGPT-style two-level plans with consistency groups. — [SceneCraft](https://arxiv.org/html/2403.01248v1), [VideoDirectorGPT](https://arxiv.org/html/2309.15091v2)
- Pricing for cost estimate: Gemini 3.5 Flash-Lite $0.30/$2.50 per 1M; 3.8 Flash $0.75/$3.75 per 1M until 2026-12-31. — [pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Inferences (recommended pipeline; token figures are estimates)
1. **Call 1, story plan (free text, temperature 0.7-0.9):** from idea + language, produce 5-7 beats; each beat = one narration sentence (about 12-20 words for 4-6 s), who is on stage, 1-3 concrete visible actions from the verb list, prop state changes, and camera intent. Write in target language; keep names and verbs in English keys. About 600-900 out tokens.
2. **Call 2..N, scene spec (constrained JSON, temperature 0.2-0.4):** one call per beat (parallel) or one call for all scenes on strong models. Input: beat, vocabulary cheat sheet (about 400 tokens), 1-2 few-shot scenes in schema key order, previous scene's final prop states (continuity), duration budget. About 300-500 out tokens per scene.
3. **Code compile and check:** timing normalisation, vocabulary coverage, precondition checks (cannot "plant" before "dig" and "hold seed"; prop state must follow a legal state machine), then 1 targeted repair call (error list + that scene only), max 2.
4. **Decompose for small models:** first call free-text "visual idea" per scene, second call picks action ids (4-field card as in earlier note); for Hindi/Nepali narration, keep action/prop ids language-independent so only `say` text is localised.
5. **Few-shot with our vocabulary:** show the whole closed list (about 15-25 actions, 15-30 props with states) in the system prompt; give an English example and one Hindi example; shuffle examples per call to avoid copy-collapse.
6. **Totals per 30 s video:** 1 + 6 + 0-2 repair = 7-9 calls, about 8K input and 4K output tokens with shared system prompt (estimate). On paid Flash-Lite ($0.30 in / $2.50 out): about $0.0024 + $0.010 = roughly $0.013 per video; at free tier the cost is zero but 7-9 calls per video consumes 7-9 of a possible 20 (3.8 Flash) or 500 (Flash-Lite) daily requests (unofficial numbers). So batch scenes into one structured call by default on Gemini, and parallel per-scene calls only on Groq/OpenRouter.
7. **Self-critique:** a text-only critic pass ("does each action follow from the narration? list impossible actions") costs 1 call; use only when the cheap code checks pass but the human rating shows story fidelity problems. Plateau after about 3 repair rounds (earlier note).

### Gaps
- No measured benefit of few-shot size, beat-sheet-first, or critique for this exact task: this is what the bake-off should measure (add ablation arms).
- Token figures are estimates; Hindi/Nepali Devanagari tokenisation can be 2-4x longer per word than English on some tokenizers (**verify** per model), which raises cost.

---

## 5. Draft JSON action-timeline schema (first draft for the bake-off)

### Takeaway
Closed vocabulary, anchors not pixels, time in seconds relative to scene start with the compiler snapping to narration, every field optional with defaults except ids and `use`. All numbers below are proposals, to be tuned from first runs.

### Cited Findings
- Design principles (closed vocabulary, anchors, defaults, flat schema, key order, versioned) come from the earlier note. — `research_notes/Code generated 30 second clips plan/llm_scene_spec_design.md` section 2

### Inferences (draft)
```jsonc
{
  "v": 1,
  "lang": "ne",                    // en | hi | ne
  "title": "string<=40",
  "style": "paper-cutout",         // enum, pack decides colours
  "total_s": 30,
  "cast": [                        // <=3 actors
    {"id":"a1","kind":"girl","look":"red-scarf"}   // kind enum: girl, boy, farmer, grandma, fox, ...
  ],
  "scenes": [
    {
      "id":"s1",
      "beat":"hook|setup|try|turn|payoff|cta",
      "set":"garden-morning",          // backdrop enum
      "dur_s":5,                       // 3..7, sum within 28..32
      "narration":{"text":"...","lang":"ne"},   // free text, <= 24 words
      "props":[                        // each prop has a state machine
        {"id":"p1","kind":"seed","at":"ground-center","state":"in-hand"},
        {"id":"p2","kind":"shovel","at":"ground-left","state":"idle"}
      ],
      "actions":[                      // time-ordered; start/dur relative to scene
        {"actor":"a1","verb":"enter","from":"left","start":0.0,"dur":1.2},
        {"actor":"a1","verb":"dig","target":"p3","start":1.4,"dur":2.0},
        {"actor":"a1","verb":"plant","target":"p1","start":3.4,"dur":1.0},
        {"actor":"a1","verb":"wave","start":4.4,"dur":0.6}
      ],
      "prop_changes":[                 // timed state transitions
        {"prop":"p1","to":"planted","at":4.2},
        {"prop":"p4","to":"sprout","at":4.8}
      ],
      "camera":[{"move":"push-in","target":"a1","start":0,"dur":5},
                {"move":"none"}],      // enum: none, push-in, pull-out, pan-l, pan-r, follow, shake
      "emote":[{"actor":"a1","face":"smile","start":4.4}],
      "transition":"cut|fade|slide-l|slide-r",
      "sfx":[{"cue":"dig","at":1.6}]
    }
  ]
}
```
- Verb enum (about 16 to start): enter, exit, walk-to, run-to, stand, wave, point, nod, shake-head, jump, dig, plant, water, pick-up, put-down, hold, sit, look, cheer.
- Prop `kind` enum about 20 with legal states, e.g. seed: [in-hand, planted, buried]; plant: [sprout, small, grown, blooming]; shovel: [idle, held]; watering-can: [full, pouring, empty]; door: [closed, open].
- Anchor enum: left-third, center, right-third, ground-left, ground-center, ground-right, sky, horizon.
- Hard checks the compiler can run: sum of scene `dur_s`; each action within scene duration; no two overlapping actions for the same actor unless verb is in a parallel-allowed set; target prop exists; precondition and post-state legality; at least N distinct verbs; actor visible (entered, not yet exited) when acting; `narration.text` words versus `dur_s` at reading rate.
- Gemini notes: set `propertyOrdering`; avoid giant `anyOf`; Groq strict: all properties required, optionals as `["x","null"]`.

### Gaps
- Vocabulary size and state machines must come from what the renderer can actually draw; coordinate with the renderer owner (role A) before freezing. No empirical evidence of the right vocabulary size.

---

## 6. Bake-off design for the owner's machine

### Takeaway
10 stories x 3 languages x N models, scored by automatic checks (validity, timing, vocabulary, variety, state-machine legality) plus a short human sheet. Run from a Node script using OpenAI-compatible chat-completions endpoints (Gemini and Groq and OpenRouter all expose one). Start with 5 models, one of them on-device later.

### Cited Findings
- Gemini has an OpenAI-compatible endpoint (`/v1beta/openai/chat/completions`, CORS and header behaviour tested earlier); Groq `api.groq.com/openai/v1`; OpenRouter `openrouter.ai/api/v1`. — [Gemini OpenAI compat](https://generativelanguage.googleapis.com/v1beta/openai/chat/completions), [Groq](https://api.groq.com/openai/v1/chat/completions), [OpenRouter](https://openrouter.ai/api/v1/chat/completions) (earlier note, own preflight tests)
- Free limits: OpenRouter `:free` 20 RPM and 50/day without 10 credits purchased; Groq gpt-oss 30 RPM/1K RPD developer base limits; Gemini unpublished. — [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits), [Groq limits](https://console.groq.com/docs/rate-limits)
- Gemini propertyOrdering warning for OpenAI-compat endpoint (forum, unconfirmed): use native `generateContent` for the schema-heavy runs. — [forum](https://discuss.ai.google.dev/t/structured-outputs-propertyordering-field-not-respected-when-using-the-openai-compatible-api-gemini-2-flash/86790)

### Inferences (design)
**Models to run first (all reachable with a free key; check ids live)**
1. `gemini-3.5-flash-lite` (free, volume workhorse) and 2. `gemini-3.8-flash` (free but about 20 RPD reported: run only 10 stories x 1 language per day or use in batches over several days) via native API.
3. `gemma-4-31b-it` via Gemini API or OpenRouter free (the open, Apache-2.0 reference; same family as on-device E2B).
4. `openai/gpt-oss-120b` on Groq (strict schema, fast, tests "reasoning model, English-strong").
5. `qwen/qwen3.8-27b` on Groq preview (or Qwen3.5-35B-A3B if hosted free anywhere; licence verify) as the Qwen representative.
6. `nvidia/nemotron-3-super-120b-a12b:free` on OpenRouter (structured_outputs flagged) as an optional extra; and one "ceiling" model via OpenRouter paid (DeepSeek V4 Flash or Kimi K3, cents) to see how far the free ones are from the best open model. Skip Llama 3.x (licence, older) and gpt-oss-20b (reported structured failures).
Later: Gemma 4 E2B/E4B via WebLLM for the on-device row (Hindi/Nepali expected weak).

**Stories (10):** 5 with a clear action chain (plant a seed, fix a bike, bake roti, rescue a kitten, cross a river), 2 with emotional arc and no dialogue, 2 with cultural settings (Dashain kite, Chhath/Diwali lamp), 1 abstract idea ("patience"). Write each idea in en/hi/ne by a human (owner) rather than machine translation, so the model sees natural input. Narration is generated in the same language as the idea.

**Runs:** per cell 3 repeats at temperature 0.4 for variance; arms: A = one-shot plan+spec in one call (baseline), B = beat sheet then spec (recommended), C = B plus 1 repair loop. Total at most 10 x 3 x 5 x 3 x 2 arms = 900 generations; scale down to arm B only for the first pass (450), and run Gemini 3.8 Flash in a thin slice.

**Automatic checks (computed in code, per output):**
- schema valid on first pass / after repair (Zod); JSON parse failures; HTTP errors and 429 rate.
- timing: sum of scene durations within 28-32 s; per-scene reading-rate vs `dur_s` (words/sec, adjust for Devanagari); actions inside scene window; overlap violations.
- vocabulary: percentage of verbs/props/camera/anchors in enum (before normalisation), count of invented ids; actor and prop reference integrity.
- state-machine legality: preconditions met, prop transitions legal, actor present when acting.
- action variety: distinct verbs per video, longest run of the same verb, fraction of scenes with at least one non-idle action, number of prop state changes, number of camera moves (target: at least 3 distinct verbs, at least 2 prop state changes, at least 2 camera moves) (thresholds are proposals).
- language checks: narration language ID matches requested language (script check: Devanagari ratio; Nepali versus Hindi discriminators such as हो/छ/हुन् vs है/हैं/हूँ as simple word-list flags), no English leakage, no mixed-script words in `narration.text`.
- cost: input/output tokens, latency, calls.

**Human sheet (1-5 each, plus pass/fail), one row per (story, language, model, arm), blind to model:**
story fidelity (does it tell the idea), action portrayal (are the actions the right ones in the right order), prop-state sense, camera usefulness, narration fluency and correctness in language (native-speaker reviewer for Nepali and Hindi), pacing, "would post". Include 3 pairwise comparisons of the top two models per language. Reference baseline = rules-based fallback video.

**How to run from the repo (sketch):**
```js
// scripts/bakeoff/run.mjs  (Node 20+, no deps; keys from env)
const PROVIDERS = {
  gemini:{base:"https://generativelanguage.googleapis.com/v1beta/openai", key:process.env.GEMINI_API_KEY},
  groq:{base:"https://api.groq.com/openai/v1", key:process.env.GROQ_API_KEY},
  openrouter:{base:"https://openrouter.ai/api/v1", key:process.env.OPENROUTER_API_KEY},
};
// models.json: [{id:"gemma-4-31b-it", provider:"gemini", strict:false}, {id:"openai/gpt-oss-120b", provider:"groq", strict:true}, ...]
// for each (story, lang, model, rep, arm):
//   call1 -> beats (plain), call2 -> response_format:{type:"json_schema", json_schema:{name:"timeline", strict:true, schema}}
//   write results/<run>/<model>/<story>_<lang>_<rep>.json with {raw, parsed, usage, ms, http}
// sleep per provider RPM; retry on 429 with Retry-After; resume by skipping existing files
// scripts/bakeoff/score.mjs: Zod parse + checks above -> results.csv; make_sheet.mjs -> blind ratings CSV (shuffled ids)
```
- Generate the JSON Schema from the same Zod catalogue the app uses (so the test exercises the production schema); keep an adapter that flattens it per provider (Gemini subset, Groq strict).
- Reason-model hygiene: set reasoning effort low (gpt-oss), disable thinking on Qwen (`enable_thinking:false`) or cap thinking budget so JSON is not truncated; record thinking tokens.

**Decision gates (proposals):** primary pick = highest median of (first-pass valid x state-legal x human fidelity) with Nepali pass rate at least 80% of English; if a model fails Nepali narration quality (native reviewer) but passes the structure, use a split: any model writes English/language-independent spec; a stronger multilingual model (Gemini) writes the `narration` text only.

### Gaps
- Model ids and availability must be re-listed on the day (provider lists change monthly); free-tier daily caps limit how much can run per day, so the run must be resumable over several days.
- Native-speaker review for Nepali/Hindi is a human cost I cannot estimate.

---

## 7. Recommendation: default model(s) for V1, fallback chain, what to test first

### Takeaway
Default: user's free Gemini key, `gemini-3.5-flash-lite` for per-scene spec and `gemini-3.8-flash` for the story plan (or whichever wins the bake-off), using the JSON spec path. Fallback: Gemma 4 31B (OpenRouter free or Gemini) with the same prompts, then Groq (gpt-oss-120b or Qwen), then on-device Gemma 4 E2B / Qwen3.5-2B in 4-field card mode, then the rules fallback. Do not use LLM-written code in V1.

### Cited Findings
- All model availability and licence facts are in sections 1-3 above; Gemini 4 Argon is not free; Gemma 4 is Apache-2.0 and free on two hosted routes. — [pricing](https://ai.google.dev/gemini-api/docs/pricing), [Gemma 4 card](https://huggingface.co/google/gemma-4-31B-it)

### Inferences
- Fallback chain (task-aware): (1) Gemini 3.8 Flash (plan) + 3.5 Flash-Lite (spec); on 429 or EEA/UK users -> (2) Gemma 4 31B via OpenRouter free (OAuth key, 50 req/day cap) or Gemini key; (3) Groq gpt-oss-120b strict mode for English-first specs, text translated by (1) or (2); (4) on-device Gemma 4 E2B/Qwen3.5-2B, English only, 4-field cards, narration translated later by hosted model; (5) rules fallback. Keep model ids in a config file.
- Our own hosted/fine-tuned model later: start from Gemma 4 (Apache-2.0, best open Indic evidence) fine-tuned on the bake-off's best outputs; Qwen3.5 as alternative; verify teacher-model output terms before distilling.
- Test first (in order): (1) schema and vocabulary on Gemini 3.5 Flash-Lite vs Gemma 4 31B vs gpt-oss-120b in English, 10 stories (one afternoon, free); (2) Nepali and Hindi narration quality of the same models (native reviewer); (3) beat-sheet-first versus one-shot (arm A vs B); (4) batching all scenes in one call vs per-scene calls (quota); (5) Gemma 4 E2B on-device card mode.
- Keep sandboxed code as post-V1 experiment: only after the spec path hits at least 90% first-pass valid and humans rate action portrayal 4+.

### Gaps
- Everything in this section is a recommendation from proxies; no model has been tested on the real schema yet. Licence terms for Kimi K3, GLM-5.3, DeepSeek V4, Qwen3.8, MiMo and Nemotron 3 must be read from the actual LICENSE files before any bundling.
