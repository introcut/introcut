# Architecture for a free, browser-only story-script generator: prompting vs craft cards vs RAG vs fine-tuning vs pipelines

Research date: 2026-10-21. Method: ~25 searches/fetches. Primary sources were fetched where possible (arXiv, Hugging Face cards, YouTube/Gemini terms). Anything I could not source is in Inferences (marked "verify") or Gaps. Third-party blog numbers (rate limits, hook statistics) are flagged as weak.

## 1. What does the evidence say about prompting, few-shot, retrieval, fine-tuning, multi-step pipelines and best-of-N for creative/structured writing?

### Takeaway
Evidence is strongest for hierarchical outline-then-write (DOC, Re3) but those papers target long stories (thousands of words), not 30-second scripts. Self-Refine and LLM-as-judge are well supported in general but weakly supported for creative writing specifically. No source found shows that fine-tuning or retrieval beats a good prompt on a ~80-word script. For this task the pragmatic ranking is: structured prompt with beats + rubric (always) > a few curated exemplars > a short plan-then-write step > a critique/revise pass > best-of-N; fine-tuning is not viable (static hosting, zero cost).

### Cited Findings
- DOC (Yang, Klein, Peng, Tian, ACL 2023) uses a detailed outliner (hierarchical outline) plus a detailed controller. In human evaluation it beat the Re3 baseline by 22.5% absolute on plot coherence, 28.2% on outline relevance and 20.7% on interestingness. Stories averaged 3,500+ words in the repo's experiments. — [arXiv 2212.10077](https://arxiv.org/html/2212.10077v3), [ACL Anthology](https://aclanthology.org/2023.acl-long.190)
- Re3 (Yang et al., 2022): draft a structured plan, write passage by passage feeding plan + state, rerank candidate continuations for coherence/premise relevance, edit for consistency. Humans judged Re3 stories as having a coherent plot 14% (absolute) more often and as relevant to the premise 20% more often than same-length direct generation from the same base model. — [arXiv 2210.06774](https://arxiv.org/abs/2210.06774)
- Self-Refine (Madaan et al., NeurIPS 2023): one model drafts, critiques and revises in a loop, no extra training. Summaries report about 20% average absolute improvement across 7 tasks (tested on GPT-3.5/GPT-4). Creative writing is not broken out in what I found. — [NeurIPS 2023](https://proceedings.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract.html), [paper PDF](https://arxiv.org/pdf/2303.17651)
- GROVE (EMNLP Findings 2023) retrieves exemplary human stories (1.5K IMDB plot summaries as the repository) to build few-shot prompts that push LLMs toward more varied plots; it was evaluated against plain in-context learning and CoT with 3 human raters on 100 stories plus a ChatGPT judge. Small human study. This is the only creative-writing exemplar-retrieval paper I found. — [arXiv 2310.05388](https://arxiv.org/abs/2310.05388v2)
- Dynamic (retrieved) exemplar selection beat static few-shot in a radiology QA agent paper (not creative writing, so only weak transfer evidence). — [CT-Agent, arXiv 2505.16229](https://arxiv.org/pdf/2505.16229)
- Fine-tuning vs in-context for style imitation (Chakrabarty and Dhillon): expert writers preferred human writing in 82.7% of cases under in-context prompting, but preferred AI 62% after fine-tuning on authors' complete works. Style imitation of acclaimed authors with whole-book corpora, not short scripts. — [search summary of arXiv result list](https://arxiv.org/pdf/2601.18353) (snippet only, verify in the full paper)
- LLM-generated stories are consistently more similar to one another than human stories, with redundant underlying plot elements even when wording differs. This is a risk for any generator (repetitive stories). — [arXiv 2606.17350](https://arxiv.org/pdf/2606.17350), [arXiv 2604.01504](https://arxiv.org/pdf/2604.01504)
- Post-training (RLHF/DPO) improves quality but tends to cause mode collapse, reducing diversity. — [Peeperkorn thesis / Chung et al. 2025 as summarised](https://kar.kent.ac.uk/116708/1/peeperkorn2026phdfinal.pdf)
- LLM-as-judge for creative writing: EQ-Bench uses Claude 3 Opus as judge, finds a 0-10 scalar rating works poorly, uses 36 narrow criteria and tells the judge not to reward length. The author concedes self-preference may still bias scores. — [EQ-Bench about](https://sam-paech-eq-bench-leaderboard.static.hf.space/about.html), [Judgemark](https://eqbench.com/judgemark.html)
- Known judge biases: verbosity bias and self-preference bias; a 2025 study on LitBench found strong recency and provenance effects in GPT-4o and Gemini-2.5-Flash judges. — [arXiv 2602.07996](https://www.arxiv.org/pdf/2602.07996), [arXiv 2506.22316](https://arxiv.org/html/2506.22316v3), [LongJudgeBench arXiv 2606.01629](https://arxiv.org/pdf/2606.01629). Specific percentage figures in vendor blogs (futureagi) could not be verified and should not be used.

### Inferences
- A 30 s script is about 70-90 spoken words, so the long-story coherence problems that DOC/Re3 solve (character/plot drift over thousands of words) mostly do not exist. What a short script needs is a strong hook, one clear turn and a payoff. A single well-structured call with explicit beats should capture most of the gain; plan-then-write mainly helps by forcing a premise/twist decision before prose (my judgment, not tested in a paper I found).
- Best-of-N with a judge is cheap for short outputs, but the same model judging its own output is exposed to self-preference. Mitigate with narrow rubric criteria, pairwise comparison with order swapped, and a hard word-count check done in code (not by the LLM). Evidence for N>3 helping is not established in what I found (verify).
- Fine-tuning is infeasible under the zero-cost, no-backend rule (no GPU rental, user's API key models are not tunable for free). Even where possible, evidence is for whole-book style imitation, not hooks. The better lever against sameness is curated diversity: random draw of a hook pattern and structure per run (inference, supported by the homogenization papers above).
- Evidence strength: DOC/Re3 = peer-reviewed, human eval, but different regime (strong for long stories, extrapolated here). Self-Refine = strong in general, weak for creative. GROVE = small human study. Judge-bias = well documented. Few-shot vs zero-shot for 30 s scripts = no direct evidence found.

### Gaps
- No benchmark found directly comparing system-prompt-only vs few-shot vs retrieved exemplars on very short scripts (under 100 words).
- No source found quantifying best-of-N gains for creative writing with an LLM judge.
- Chakrabarty and Dhillon details come from a search snippet; the full paper was not read.

## 2. Is RAG needed? Craft cards vs embedding retrieval, and where the latency actually comes from

### Takeaway
Embedding RAG is not needed for a 50-300 card library. Select cards with rules (story type, hook family, length) and inject 2-5 cards into the prompt for roughly zero latency. If semantic search is wanted later (for example matching a free-text idea to the nearest pattern), a 23 MB int8 MiniLM or 33M-param BGE-small plus precomputed card vectors costs one download (cached) and tens of ms per query; brute-force cosine over a few thousand vectors is negligible. Real latency comes from first-time model download and LLM generation, not from search.

### Cited Findings
- all-MiniLM-L6-v2 (Xenova ONNX build) is Apache-2.0, 384 dimensions, with ONNX variants: fp32 90.4 MB, fp16 45.3 MB, int8/quantized 23 MB, uint8 22.8 MB, q4f16 30 MB. — [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2), [onnx file listing](https://huggingface.co/Xenova/all-MiniLM-L6-v2/tree/main/onnx)
- BGE-small-en-v1.5: MIT, about 33.4M parameters, 384 dims, 512-token max, MTEB average 62.17. — [BAAI/bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5)
- EmbeddingGemma-300m: Gemma license (not MIT/Apache; custom terms, gated on HF), 300M params, 768 dims with Matryoshka truncation to 512/256/128, 2048-token input, QAT Q4_0/Q8_0 checkpoints, English MTEB v2 69.67 (Q8 69.49, Q4 69.31). Weights are F32 (about 1.2 GB per my estimate, not stated on the card); no float16 support. — [google/embeddinggemma-300m](https://huggingface.co/google/embeddinggemma-300m)
- transformers.js usage is a three-line `pipeline('feature-extraction', model)` with `pooling: 'mean', normalize: true`. — [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2)
- Community WebGPU benchmark of unquantized all-MiniLM-L6-v2 at sequence length 512, batch 1: 507 ms on WASM vs 45.7 ms on WebGPU (Chrome/Windows run); 15-24 ms on WebGPU in Mac runs. Higher-batch rows are flagged as suspect by a contributor, and all runs were unquantized. — [HF benchmark space discussions](https://huggingface.co/spaces/Xenova/webgpu-embedding-benchmark/discussions/1), [discussion 2](https://huggingface.co/spaces/Xenova/webgpu-embedding-benchmark/discussions/2)
- A SitePoint article suggests WASM suits small (<100M param) single-pass models such as embedding; WebGPU can be 10-15x faster depending on model/hardware. Vendor-style article, benchmarks not verified. — [SitePoint](https://www.sitepoint.com/webgpu-vs-webasm-transformers-js/)
- Downloaded WebLLM weights are cached after the first visit. A small Qwen3 0.6B is about 335 MB / 1.4 GB VRAM per one guide; the WebLLM paper reports 41.1 tok/s for Llama 3.1 8B on an M3 Max (about 71% of native). — [pinggy guide](https://pinggy.io/blog/run_llm_in_browser_webgpu/), [WebLLM paper](https://arxiv.org/html/2412.15803v1)

### Inferences
- Case FOR embedding RAG: free-text ideas that do not match a rule ("my cousin got scammed on a visa"), a corpus larger than ~500 cards, or wanting to retrieve similar exemplar scripts. Case AGAINST: corpus of 50-300 cards fits entirely in a prompt budget (a card of 80-150 tokens x 5 = under 800 tokens); retrieval adds a model download (23-54 MB), a worker, and failure modes, for a gain nobody has measured on short scripts; the sameness problem is better handled by random hook selection than by nearest-neighbour (which retrieves the most typical pattern).
- Brute-force cosine cost (my arithmetic): 5,000 vectors x 384 floats = about 7.7 MB as Float32 (1.9 MB as int8); 5,000 dot products of 384 dims is about 2 million multiply-adds, roughly 1-5 ms in plain JS. A vector DB is unnecessary below roughly 100k vectors.
- Latency budget for embedding RAG: (1) one-time model fetch of 23 MB int8 MiniLM, cached by the browser/Cache API/IndexedDB, hidden by preloading in a Web Worker while the user types the idea or sign-in screen is shown; (2) query embedding of about 10-20 tokens: tens of ms on WASM with a quantized small model (the 507 ms figure is for 512-token padded input unquantized, so overstates it; verify with a quick benchmark on a low-end laptop); (3) cosine: ms; (4) no network round trip, since vectors ship as a static binary. The dominant cost is still the LLM call (seconds).
- Licenses: MiniLM (Apache-2.0) and BGE-small (MIT) are fine to bundle/redistribute; EmbeddingGemma's Gemma license is not MIT/Apache style, so flag it and avoid for V1.
- Recommended order: rules-based card selection first (V1), keyword/tag scoring (BM25-lite in JS, no model) second, MiniLM embeddings only if card count passes about 500 or tag matching measurably fails.

### Gaps
- No measured quantized-MiniLM short-query latency on WASM/WebGPU found; needs a 10-minute benchmark in the repo.
- No real WebLLM numbers for Qwen3 1.7B/4B (download size, tok/s) were found; check WebLLM's model list.

## 3. What data would make the generator better, and where can it be sourced legally and cheaply? (including the ZackD.Films / YouTube question)

### Takeaway
The most valuable data is not a large corpus but 50-300 original, hand-written "pattern cards" and 10-30 original exemplar scripts written by the owner, annotated with beats and why they retain. Scraping YouTube transcripts of ZackD.Films or similar creators is a ToS violation and a copyright risk; do not do it. Public-domain folktales and open story datasets can supply plots/premises, not short-form craft.

### Cited Findings
- YouTube ToS (Permissions and Restrictions): you may not "access the Service using any automated means (such as robots, botnets or scrapers)" except public search engines per robots.txt or "with YouTube's prior written permission"; users may "view or listen to Content for your personal, non-commercial use"; also bars accessing/copying Content without authorization. The page does not mention AI/ML datasets explicitly. — [YouTube Terms of Service](https://www.youtube.com/t/terms)
- The Pile's YouTube Subtitles subset (173,536 scraped transcripts) drew press coverage as a ToS problem. — [The Register, 2024-07-17](https://www.theregister.com/2024/07/17/youtube_video_subtitles_ai/)
- Gemini API Additional Terms: you may not use the Services to develop models that compete with the Services; unpaid-tier inputs/outputs may be used by Google to improve products and human reviewers may read them; do not submit sensitive/personal info on unpaid services; the terms do not explicitly address synthetic data generation; Grounded Results and Maps data cannot be used for training. — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- Project Gutenberg: most eBooks are US public domain, free for any use including commercial and derivative works; "Project Gutenberg" is a trademark (strip the boilerplate/name if redistributing); non-US copyright status may differ; some items remain copyrighted. — [Gutenberg permissions](https://www.gutenberg.org/policy/permission.html)
- WritingPrompts (fairseq export on HF `euclaise/writingprompts`): card says MIT, about 303k rows, stories include mature content; origin is Reddit r/WritingPrompts. — [dataset card](https://huggingface.co/datasets/euclaise/writingprompts), [paper arXiv 1805.04833](https://arxiv.org/abs/1805.04833)
- TinyStories: CDLA-Sharing-1.0, about 2.14M synthetic stories from GPT-3.5/GPT-4 with a small vocabulary; GPT-3.5 portion lower quality. — [roneneldan/TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories)
- HC3 (human vs ChatGPT answers) is CC-BY-SA-4.0 (not useful for stories, shown as an example of copyleft licensing to avoid bundling). — [HC3](https://huggingface.co/datasets/Hello-SimpleAI/HC3)
- Hook advice from practitioners (direct claims, mid-action starts, avoid context-free "Did you know?", clean loops) and the repeated "65% leave in 3 seconds" figure come from marketing blogs without primary studies. — [Metricool](https://metricool.com/viral-video-hooks/), [quso.ai](https://quso.ai/research/video-retention-benchmarks), [Medium](https://medium.com/@techwithlandon/want-over-70-retention-on-your-short-form-videos-heres-how-to-do-it-5ce7bae94a43)
- Related: GROVE used IMDB plot summaries as a retrieval repository (1.5K) — shows plot-summary corpora can drive few-shot, though IMDB data licensing is its own question (verify before any use). — [GROVE](https://arxiv.org/abs/2310.05388v2)

### Inferences
- YouTube analysis: scraping transcripts violates the automated-access clause even if the transcript text is only used privately; storing/redistributing them in an open-source repo adds copyright infringement risk (the script text is a copyrighted literary work in most jurisdictions; I did not find a source on fair use for training, so treat as unresolved). The Gemini/YouTube API caption download route is, to my memory, limited to the video owner (verify). Never ship copyrighted transcripts; also the app's rule "never claim unverified things" applies.
- Legal alternative (my recommendation): the owner watches reference videos and writes original structure notes, i.e. abstract patterns ("cold open on the consequence, reveal the cause at 0:12, one-line moral twist"). Ideas, structures and techniques are generally not protected by copyright, expression is (general copyright principle, not sourced here; verify with a lawyer if concerned). Use no verbatim lines, no creator names as style labels in shipped data (prompting "in the style of ZackD" is also a branding/impersonation concern: describe the style by traits instead).
- Data tiers, ordered by value/legal safety: (1) owner-written pattern cards (hook families, beat sheets by story type such as story-time/cautionary/revenge/mystery-reveal/underdog/relationship/folk-tale, do/don't rules, word-count pacing); (2) 10-30 owner-written exemplar scripts under MIT/CC0, with beat annotations, which also seed the eval set; (3) opt-in user-contributed scripts with a clear license grant (CC0) and no personal data, later; (4) public-domain folktales (Gutenberg: Aesop, Grimm, Jataka tales, Indian/Nepali folktale collections published before about 1929 in the US; verify each translation's own copyright since translations can be newer) as premise/plot seeds, to be rewritten rather than copied; (5) synthetic exemplars from a strong model: allowed to generate for your own product in general, but the Gemini terms bar using the Services to build competing models, and are silent on synthetic data, so check each provider's current terms and keep synthetic cards human-edited, labeled and not used to train a model (verify); (6) WritingPrompts (MIT card label, but underlying stories are Reddit user content, so the card's MIT label may not clear the authors' rights, verify) and TinyStories (CDLA-Sharing: share-alike obligations on the data, and its style is children's vocabulary, poor fit) are for offline research/eval at most, not for bundling.
- Synthetic-output caveat: a card library where each card is hand-edited by the owner is the safest copyright and quality position (human authorship). Do not bundle large raw synthetic corpora.

### Gaps
- No primary-source statement found on whether training/analysis on YouTube transcripts is fair use; no official YouTube caption policy for third-party use was fetched. Treat as legal risk, not settled.
- No licensing check done on specific folktale collections (e.g., Nepali/South Asian PD collections) or their translations; names above are unverified candidates.
- OpenAI/Anthropic/Groq terms on synthetic data not checked in this pass.
- No primary study on hook retention; only marketing sources.

## 4. Where to search for such data (places, queries, licenses)

### Takeaway
Use Hugging Face dataset search with a license filter, Project Gutenberg subject/bookshelf pages, and Wikisource/Wikimedia Commons for PD folktales; for craft knowledge, expect to write it yourself because no open corpus of short-form retention scripts was found.

### Cited Findings
- Hugging Face datasets seen with licenses: WritingPrompts (MIT label), TinyStories (CDLA-Sharing-1.0), HC3 (CC-BY-SA-4.0). — [WritingPrompts](https://huggingface.co/datasets/euclaise/writingprompts), [TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories), [HC3](https://huggingface.co/datasets/Hello-SimpleAI/HC3)
- Project Gutenberg PD policy as above. — [Gutenberg](https://www.gutenberg.org/policy/permission.html)
- GROVE's repository example: IMDB movie plot summaries (1.5K). — [GROVE](https://arxiv.org/abs/2310.05388v2)

### Inferences
- Suggested searches (not executed beyond the above; verify each license on the card): Hugging Face with filters license:cc0-1.0 / mit / apache-2.0 / cc-by-4.0 and queries "short stories", "fables", "folktales", "story summaries", "screenplay", "story structure"; Gutenberg bookshelves "Folklore", "Fairy Tales", "Children's Myths, Fables, Folk Tales"; Wikisource and Wikipedia plot sections (CC-BY-SA, share-alike, so use only as private inspiration, not bundled text); ROCStories (research license, requires a form, not open for redistribution; verify), Kaggle and academic corpora (check each; many are non-commercial or CC-BY-NC, which fails the MIT/Apache requirement).
- Given the license constraint, bundle only owner-authored material and CC0/PD-derived rewrites; keep everything else as offline reference.

### Gaps
- No existing open dataset of short-form video scripts with retention labels was found.
- ROCStories, Wikipedia, Kaggle dataset licenses not checked in this pass.

## 5. How to evaluate quality cheaply

### Takeaway
Use a narrow-criteria rubric, deterministic code checks for what code can measure (word count, hook length, banned phrases), a pairwise LLM judge with order swap for subjective items, and a 30-50 prompt regression set with a few human ratings to calibrate. Run it offline in the repo, not in the user's browser.

### Cited Findings
- EQ-Bench: scalar 0-10 ratings were poor; narrow criteria (36) and explicit anti-length instructions used; self-bias possible. — [EQ-Bench about](https://sam-paech-eq-bench-leaderboard.static.hf.space/about.html)
- GROVE's human rubric: grammar, coherence, likability, relevance, complexity, creativity (5-point), plus ChatGPT-as-judge queried three times per story. — [GROVE](https://arxiv.org/abs/2310.05388v2)
- Length-controlled judge benchmark design (LongJudgeBench) isolates quality from length. — [arXiv 2606.01629](https://arxiv.org/pdf/2606.01629)

### Inferences
- Rubric (each 1-5, judged with anchored descriptions): hook strength in first 2 seconds, clarity (one idea, one protagonist), pacing/word budget, specificity (concrete details versus generic), payoff/turn, relatability/emotional truth, voice naturalness for spoken delivery, originality versus the last N outputs.
- Deterministic checks (free, run on every output): word count (about 70-90 words for 30 s at roughly 2.5-3 words/s; verify speaking rate for the TTS voice), hook line under about 12 words, no filler openers ("Did you know"), shot list covers total duration, JSON schema validity (the repo already uses Zod), no named real people.
- Minimal eval design: `eval/prompts.json` with 30-50 ideas across story types (fixed seed); `eval/run.ts` generates with the pipeline under test; judge model scores by rubric with temperature 0 and pairwise A/B against a baseline output with positions swapped; use a different model family from the generator as judge to cut self-preference; human-rate 20 pairs once (owner plus a friend) and report judge-vs-human agreement; store scores in JSON and fail CI if mean rubric drops by more than a threshold or deterministic checks fail. Cost: 40 prompts x (1 generation + 2 judge calls) = 120 calls, fits a single free-tier day (see section 6).

### Gaps
- No validated rubric specific to short-form video hooks found in literature.
- Judge-human agreement for this domain is unknown until the small human set is rated.

## 6. Cost control: caching, one call vs several, token budgets, free-tier request counts

### Takeaway
Free-tier quotas are unstable and sources disagree; design for 1-3 LLM calls per script, cache everything, and handle 429s gracefully. Free-tier Gemini inputs may be used by Google for product improvement, so show an on-screen notice.

### Cited Findings
- Google's rate-limit page lists no numeric free-tier values; it says to view active limits in AI Studio, limits are per project, daily quotas reset at midnight Pacific, and vary by model. — [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- Third-party blogs conflict: Flash free tier reported as about 10 RPM / 20-50 RPD (April 2026 guide), about 15 RPM / 1,500 RPD (May 2026), or 100 RPD; several say Pro models left the free tier in April 2026 (a later guide says otherwise). Treat as unverified. — [agentdeals](https://agentdeals.dev/gemini-api-pricing-changes), [tinkerllm](https://tinkerllm.com/blog/gemini-api-free-tier-limits-rate-quotas/), [yingtu.ai](https://yingtu.ai/en/blog/google-gemini-api-free-tier-limits-2026)
- Groq: limits measured in RPM/RPD/TPM/TPD per organization; `x-ratelimit-*` headers and 429 with `retry-after`; cached tokens do not count toward limits; the docs page is inconsistent about which plan its table covers. Third-party reports say llama-3.3-70b free is about 30 RPM, 12,000 TPM, 1,000 RPD and the 8B model 14,400 RPD (unverified). — [Groq rate limits](https://console.groq.com/docs/rate-limits), [eesel.ai](https://eesel.ai/blog/groq-pricing)
- Gemini unpaid terms: content submitted may be used by Google and reviewed by humans. — [Gemini API terms](https://ai.google.dev/gemini-api/terms)

### Inferences
- Token budget per script (estimates): system prompt with beat sheet + rubric + 3 cards about 900-1,500 tokens in, script about 150-250 tokens out; critique about 400 in / 150 out; so a 3-call pipeline is about 4,000 tokens total. At the lowest reported Gemini Flash free limit (about 20-50 RPD) that is only 6-16 scripts per day with 3 calls versus 20-50 with one call; at about 1,500 RPD it is a non-issue. Groq 70B at 12,000 TPM supports about 3 full pipelines per minute.
- Therefore design for adaptive depth: default 2 calls (plan+script in one JSON call, then one critique-and-revise call only if deterministic checks or a cheap self-score fail), a "quality mode" with 3-4 calls opt-in, and a rules-only fallback. Cache by hash of (idea, story type, settings, prompt version) in IndexedDB; reuse the plan across "regenerate script only"; show remaining quota from `x-ratelimit-*` headers where available; exponential backoff on 429.
- Move work from LLM to code: story-type classification by keyword rules or one-word LLM output, hook-family choice by weighted random, word-count enforcement and shot-list timing by deterministic code.

### Gaps
- Actual free-tier numbers for Gemini/Groq must be verified in-account; sources conflict and docs no longer list Gemini numbers.
- Other free providers (OpenRouter free models, Cerebras, Mistral) were not researched.

## 7. Final recommendation: pipeline, latency, call count, and build order

### Takeaway
Build a hybrid: rules pick story type and craft cards (zero latency), one structured LLM call does idea check + logline + beats + script + shot list as JSON, a deterministic validator runs, and one optional critique-and-revise call fires only on failure or in quality mode. No embedding RAG and no fine-tuning in V1; add MiniLM-based retrieval only if the card library outgrows rule selection.

### Cited Findings
- Evidence supporting plan-before-write: DOC and Re3 gains (22.5/28.2/20.7 and 14/20 points). — [DOC](https://arxiv.org/html/2212.10077v3), [Re3](https://arxiv.org/abs/2210.06774)
- Evidence supporting critique/revise with caveats: Self-Refine (about 20% average on 7 tasks, GPT-3.5/4). — [Self-Refine](https://arxiv.org/pdf/2303.17651)
- Evidence supporting exemplar-conditioned diversity: GROVE. — [GROVE](https://arxiv.org/abs/2310.05388v2)
- Evidence supporting judge-bias controls: EQ-Bench design. — [EQ-Bench](https://sam-paech-eq-bench-leaderboard.static.hf.space/about.html)
- Retrieval stack facts: MiniLM int8 23 MB (Apache-2.0), BGE-small 33M params (MIT). — [MiniLM files](https://huggingface.co/Xenova/all-MiniLM-L6-v2/tree/main/onnx), [BGE-small](https://huggingface.co/BAAI/bge-small-en-v1.5)

### Inferences
Concrete pipeline (all counts and latencies are my estimates; verify by measurement):
1. Story-type classification (rules): keyword/regex on the idea plus the user's chosen type; fallback to "general". 0 ms, 0 LLM calls.
2. Card selection (rules): pick 1 beat-sheet card for the type, 2 hook-pattern cards (one weighted-random for variety, one best-fit by tags), plus the always-on do/don't card; about 600-900 tokens. 0 ms.
3. Call 1 (LLM, structured JSON, temperature about 0.8): input is idea, resources summary, cards, rubric, duration budget; output is verdict/angle, logline, 5-6 timed beats, VO script, shot list with durations. Fast model (Flash/8B-70B on Groq) about 2-5 s on a hosted free-tier API; on-device small model about 15-40 s at roughly 20-40 tok/s for 300-400 tokens plus download (verify).
4. Validator (code, 0 LLM): word count versus duration, hook length, banned openers, schema, shot durations sum, locked-field respect (per CLAUDE.md human-edit locks).
5. Call 2 (LLM, conditional): critique against the rubric then revise only the failing parts, scoped by locks; about 2-4 s. Skip if validator and the self-score in call 1 pass.
6. Quality mode (opt-in): 3 hook variants in call 1, a pairwise judge call picks the winner (different model family if the user has two keys), then revise. 4 calls, about 10-15 s.
- Expected: default 1-2 calls, about 3-8 s hosted; quality mode 3-4 calls. On-device small models: use a shorter single-call prompt with 1-2 cards and the rules-based fallback, since small models handle long rubrics poorly (verify with the eval set).
- Build first (MVP): the card schema and 15-30 cards written by the owner (5-6 story types x hook patterns), rules selector, the one-call JSON prompt with beat sheet and rubric, the deterministic validator, the 30-prompt eval script with pairwise judge. Build later: critique/revise call, quality mode and best-of-N, IndexedDB response cache, quota display, opt-in contributed exemplars, MiniLM retrieval over 300+ cards, public-domain folktale premise seeds, per-card performance feedback (thumbs up/down locally).
- Licensing and compliance to log in CREDITS.md: any embedding model (MiniLM Apache-2.0, BGE-small MIT), owner-authored cards (MIT/CC0), PD folktale rewrites (note source and translation date). Avoid EmbeddingGemma (Gemma license), WritingPrompts/TinyStories bundling, Wikipedia text bundling (CC-BY-SA).
- Validate the ranking with the eval set before investing in extra calls: compare (a) prompt only, (b) prompt + cards, (c) + critique pass, (d) best-of-3; keep the cheapest variant whose judged mean is within noise of the best.

### Gaps
- All latency numbers for the LLM calls are estimates; none were measured against current free-tier endpoints.
- The recommended ordering of prompt vs cards vs critique is untested for 30 s scripts; the eval set is the way to settle it.
- Provider terms for synthetic data (OpenAI, Anthropic, Groq-hosted open models) not reviewed.
