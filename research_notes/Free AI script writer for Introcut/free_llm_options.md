# Free LLM options for Introcut script, shot-list and prompt writing (as of 2026-10-21)

Method note: most facts below were fetched from official pages on 2026-10-21 (page "last updated" dates are given where the page showed one). Fetch results were summarised by a small model, so exact numbers should be re-checked in the provider console before they go into UI copy. CORS results are from my own `curl` preflight (OPTIONS with `Origin: https://introcut.app`) and, where noted, a real request with a fake key, run on 2026-10-21. A preflight showing an allowed origin is strong evidence that browser calls work, but I did not make an authenticated browser call (no keys), so end-to-end is "verify". Several 2026 model names in the sources (Gemini 3.8 Flash, Qwen3.5, Gemma 4, "qwen3.8-27b") are newer than my training data; I report them as the sources state them.

## (A1) Free hosted APIs: models, limits, credit card, training use

### Takeaway
As of 2026-10-21 the only no-card, browser-callable, still-generous free sources are Google AI Studio (Gemini Flash/Flash-Lite and Gemma 4, but limits are low and unpublished, and free-tier data is used for training), Groq (fast, free-plan numbers not shown in docs, no training), and OpenRouter `:free` models (20 RPM, 50 requests/day unless the user has bought 10 credits). GitHub Models is retired, Cerebras no longer has a permanent free tier, and several others (NVIDIA, SambaNova, GitHub) fail browser CORS.

### Cited Findings

**Google Gemini API / AI Studio**
- Google's rate-limit page (last updated 2026-10-15 UTC) no longer lists free-tier numbers; it says limits are per project (not per key), RPD resets at midnight Pacific, and tells users to read their live limits in AI Studio. — [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- Free-of-charge input/output on the free tier (pricing page, updated 2026-10-19): Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite, 3 Flash Preview, 2.5 Pro, 2.5 Flash, 2.5 Flash-Lite, Gemma 4, plus TTS/Live/transcribe models. Free tier row "Used to improve our products: Yes". — [Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- Gemini 2.5 models are reported as scheduled to shut down on 2026-10-16 (i.e. already past), migrate to Gemini 3 series. This is from a third-party blog, so verify against Google's deprecations page. — [neuraplus blog, updated Oct 2026](https://neuraplus-ai.github.io/blog/gemini-api-free-tier.html)
- A user report (Google forum, 2026-09-03) says Gemini 3.8 Flash free tier is 20 requests/day and Flash-Lite is 500 requests/day. Unofficial; no Google reply shown. Older third-party figures (15 RPM / 1,500 RPD for Flash) are described as outdated; Google reportedly cut free quotas sharply in late 2025 and again around 2026-04-01 (Pro removed from free). — [Forum thread](https://discuss.ai.google.dev/t/gemini-3-8-flash-free-tier-20-rpd-is-too-limited-for-practical-evaluation/180609); [neuraplus blog](https://neuraplus-ai.github.io/blog/gemini-api-free-tier.html); [AgentDeals, 2026-04-08](https://agentdeals.dev/gemini-api-pricing-changes)
- Terms: unpaid services let Google use prompts and responses to improve products, with human review possible after disconnecting from account/key; you must be 18+; "If you make API clients available to users in the EEA, Switzerland, or the UK, you may use only Paid Services." — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms)
- Credit card: not required for the free tier (consistent across third-party guides; Google's own page did not state it). — [OpenRouter comparison, updated 2026-09-24](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/)

**Groq**
- Production models: llama-3.1-8b-instant (560 tok/s listed), llama-3.3-70b-versatile (280), openai/gpt-oss-120b (~500), openai/gpt-oss-20b (1,000). Preview: qwen/qwen3.8-27b (450), minimaxai/minimax-m2.7 (260), meta-models/muse-spark-open (350). Speeds are Groq's own claims. — [Groq models](https://console.groq.com/docs/models)
- Rate-limit page shows gpt-oss-20b, gpt-oss-120b and qwen3.8-27b at 30 RPM / 1K RPD / 8K TPM / 200K TPD but labels these "Developer plan base limits"; no free-plan table is shown, Llama 3.3 70B row not shown. The exact free-plan numbers are only in the user's console. — [Groq rate limits](https://console.groq.com/docs/rate-limits)
- No card needed to sign up per third-party guides (older). Groq's terms: Groq may not use inputs/outputs to train models unless the customer permits. — [OpenRouter comparison](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/); [Groq services agreement](https://console.groq.com/docs/legal/services-agreement)

**OpenRouter**
- `:free` models: 20 requests/min; 50 requests/day if the account has bought less than 10 credits, 1,000/day if 10 or more (one-off purchase). Negative balance errors even on free models. — [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits)
- Live model list (queried 2026-10-21) of zero-price models: google/gemma-4-31b-it:free (262K ctx), google/gemma-4-26b-a4b-it:free, nvidia/nemotron-3-super-120b-a12b:free (262K, structured outputs flagged), nvidia/nemotron-3-ultra-550b-a55b:free, nvidia/nemotron-3.5-super-vl:free, minimax/minimax-m3.1-flash:free, liquid/lfm-2.5-2.6b:free, the router `openrouter/free`, plus a few others. No free Llama 3.3 70B or gpt-oss in the list at this date. Free-model availability changes frequently. — [OpenRouter models API](https://openrouter.ai/api/v1/models)
- OpenRouter says free endpoints can serve smaller context than paid versions, and some free providers may log prompts for training (per-model, verify per model). — [OpenRouter comparison](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/) (that page's table says "no training" which is a simplification; verify)

**Cerebras**
- Official page now says there is "no permanently free tier"; trial gives $5 credits after adding a verified payment method, expiring after 30 days; free-trial limits 5 RPM, 1M TPD for gpt-oss-120b and qwen-3.8-27b. Older third-party lists (30 RPM / 1M tokens per day free) are stale. — [Cerebras rate limits](https://inference-docs.cerebras.ai/support/rate-limits); contradicted by [OpenRouter comparison](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/) (stale, relies on March/April 2026 data)

**Mistral La Plateforme (Experiment plan)**
- Official limits are not published in the pages I could read (docs tier page 404'd for me); the console shows them. Third-party: ~1B tokens/month, ~1 request/s, phone verification required, free plan requires opting into data training. All unverified. — [Search summary of tier docs and third-party aggregators](https://docs.mistral.ai/deployment/laplateforme/tier); [OpenRouter comparison](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/)

**Cloudflare Workers AI**
- 10,000 Neurons/day free; text-generation default limit 300 requests/min; paid-only models 20 RPM. 10K neurons is only a few thousand tokens on mid-size models (my estimate, verify per model). Cards not mentioned for the free allocation. — [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/); [Workers AI limits](https://developers.cloudflare.com/workers-ai/platform/limits/)

**Hugging Face Inference Providers**
- Free users get no monthly credits; they must buy credits. PRO gets $2/month. So not a zero-cost option. — [HF pricing](https://huggingface.co/docs/inference-providers/pricing)

**GitHub Models**
- Fully retired on 2026-07-30; playground, catalog, inference API and BYOK gone for all customers. (Note: `models.github.ai/catalog/models` still returned HTTP 200 for me, but do not rely on it.) — [GitHub changelog](https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026); [GitHub docs](https://docs.github.com/en/github-models/prototyping-with-ai-models)

**NVIDIA NIM, SambaNova, Together, others**
- Sources conflict: NVIDIA free tier reported as ~1,000 calls/day or 40 RPM with phone verification; SambaNova reported as $5 trial credit needing a card. Both unverified; both fail browser CORS (see A6). Together and Fireworks: trial credits at best ($1 style). — [OpenRouter comparison](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/)
- Third-party aggregator (cheahjs list, unknown snapshot date, appears based on 2024-era numbers) is stale for Gemini and Cerebras. — [cheahjs mirror](https://github.com/lloydchang/cheahjs-free-llm-api-resources)

### Inferences
- Gemini's free limits are now both low and unpublished; plan for 429s and for Flash-Lite as the practical free workhorse (500 RPD reported). One 30 s video needs maybe 3 to 6 calls, so even 20 RPD would cover only a handful of projects per day on Gemini 3.8 Flash.
- Gemma 4 (Apache-2.0) is both free on Gemini API and free on OpenRouter, so it is a single model family available hosted free, via a Google key or OpenRouter, and on-device, which makes outputs more consistent across the fallback chain.
- Groq plus Google are the realistic "paste your key" pair; OpenRouter is the best "no key at all" candidate only if combined with its OAuth key flow (see A6).

### Gaps
- Exact current free-tier RPM/RPD/TPM for each Gemini model and for Groq's free plan: only visible in logged-in consoles.
- Mistral and NVIDIA official numbers: pages not retrievable.
- Which OpenRouter `:free` models log or train on prompts: not verified per model.

## (A2) CORS (browser calls with the user's key)

### Takeaway
Gemini API, Groq, OpenRouter, Mistral, Together, Hugging Face router, Cerebras, xAI and Cohere all answer the preflight with permissive CORS headers, so a static site can call them directly. GitHub Models, NVIDIA, SambaNova and Cloudflare Workers AI REST returned no allow-origin header and should be treated as not browser-callable.

### Cited Findings
Own preflight tests, 2026-10-21 (`OPTIONS` with `Origin: https://introcut.app`, request headers `authorization,content-type,x-goog-api-key`):
- Gemini `generativelanguage.googleapis.com/v1beta/models/...:generateContent` and `/v1beta/openai/chat/completions`: 200, `Access-Control-Allow-Origin: https://introcut.app` (origin echoed), allows `x-goog-api-key` and `authorization`. A real GET with a fake key also returned the allow-origin header. — [Gemini endpoint](https://generativelanguage.googleapis.com/v1beta/models)
- Groq `api.groq.com/openai/v1/chat/completions`: 204, `access-control-allow-origin: *`; real 401 response also carried the header. — [Groq endpoint](https://api.groq.com/openai/v1/chat/completions)
- OpenRouter `/api/v1/chat/completions`, `/api/v1/models`, `/api/v1/auth/keys`: 204 with `Access-Control-Allow-Origin: *`; allowed headers list includes Authorization, Content-Type, HTTP-Referer, X-Title. — [OpenRouter endpoint](https://openrouter.ai/api/v1/chat/completions)
- Mistral, Together, Hugging Face router, Cerebras, xAI, Cohere: 200 with `access-control-allow-origin: *` (Mistral's allow-headers list is only Authorization, Content-Type and a few X- headers, which is enough). DeepSeek echoes the origin. — [Mistral](https://api.mistral.ai/v1/chat/completions), [HF router](https://router.huggingface.co/v1/chat/completions), [Together](https://api.together.xyz/v1/chat/completions)
- No `Access-Control-Allow-Origin` header on preflight: GitHub Models (`models.github.ai`), NVIDIA (`integrate.api.nvidia.com`), SambaNova (`api.sambanova.ai`), Cloudflare REST (`api.cloudflare.com/.../ai/run`, 405), and Anthropic (400; Anthropic also needs a special browser-access header, verify). — [NVIDIA](https://integrate.api.nvidia.com/v1/chat/completions), [SambaNova](https://api.sambanova.ai/v1/chat/completions)
- Google's docs discourage client-side keys and say only ephemeral tokens are offered for direct browser access, and only for the Live API; a community report shows the OpenAI JS library hitting a CORS error against Gemini's OpenAI-compatible URL (older, my preflight now succeeds). — [Gemini API key docs](https://ai.google.dev/gemini-api/docs/api-key); [forum](https://discuss.ai.google.dev/t/gemini-api-cors-error-with-openai-compatability/58619)

### Inferences
- Use native `generateContent` with the `x-goog-api-key` header for Gemini (verified to be allowed); send keys in headers, not URLs.
- Cloudflare Workers AI would need a Cloudflare Worker proxy, which the developer would host for free on the Workers free plan, but that is a server component and conflicts with the "no backend" rule; skip.

### Gaps
- No authenticated, end-to-end browser test with real keys (no keys available). Streaming (SSE) CORS behaviour not tested. Mark all as "verify with a real key".

## (A3) Structured output and instruction following

### Takeaway
Gemini and Groq both offer schema-constrained JSON, Gemini for its models via a JSON-schema response format, Groq only for gpt-oss-20b/120b, qwen3.8-27b and muse-spark-open (strict mode). Llama 3.3 70B on Groq is limited to loose JSON mode. Always still validate with Zod and retry.

### Cited Findings
- Gemini supports JSON-schema output (`mime_type: application/json` + schema), a subset of JSON Schema; `minLength/maxLength/minProperties/maxProperties` are ignored during decoding; docs say outputs may be valid JSON but semantically wrong, so validate in app. — [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- Groq `strict: true` (constrained decoding, guaranteed schema) listed for openai/gpt-oss-20b, gpt-oss-120b, qwen/qwen3.8-27b, meta-models/muse-spark-open; best-effort for gpt-oss-safeguard-20b; `json_object` mode only for other models (e.g. llama-3.3-70b-versatile), and the schema must be described in the prompt. — [Groq structured outputs](https://console.groq.com/docs/structured-outputs)
- OpenRouter: of the free models, `response_format` is flagged for most and `structured_outputs` for xingchen-agi/xing4.0-29b-a4b, nvidia nemotron-3.5-super-vl, nemotron-3-super-120b-a12b, liquid lfm-2.5-2.6b and the `openrouter/free` router; Gemma 4 free models flagged `response_format` only (not strict). — [OpenRouter models API](https://openrouter.ai/api/v1/models)
- WebLLM v0.2.81 added XGrammar-based constrained generation and function calling, so on-device JSON can be grammar-constrained. — [WebLLM releases](https://github.com/mlc-ai/web-llm/releases)
- Creative-writing ranking: EQ-Bench Creative Writing v3 is the relevant benchmark (LLM-judged; it also reports "Slop" and repetition) but its leaderboard table did not load for me, so I have no current ranking data. — [EQ-Bench creative writing](https://eqbench.com/creative_writing.html)

### Inferences
- Best structured-output reliability among free options: Gemini (schema-constrained, big Flash models) and Groq gpt-oss-120b/qwen3.8-27b in strict mode. Since the Introcut schema is nested, keep schemas shallow per call (script, then shot list, then prompts) and validate with Zod plus one repair retry.
- Without leaderboard data, I can't rank creative-writing quality; Gemini Flash-class and 70B+ class models are expected to be better than gpt-oss (reasoning-tuned, often dry in prose). This is an inference to verify with a quick in-house A/B test on 5 sample briefs in English, Hindi and Nepali.

### Gaps
- No current EQ-Bench or LMArena creative-writing numbers retrieved.
- No independent JSON-reliability benchmark found for these specific free models.
- Nepali/Hindi: I found no benchmark of Gemma 4, Qwen3.5 or Gemini 3.x on Nepali or Hindi generation. Closest: IndicParam (Dec 2025) found closed models (Gemini 2.5 at 58% average) ahead of open ones on low-resource Indic languages, and IndicGenBench found generation weaker than understanding. — [IndicParam](https://arxiv.org/pdf/2512.00333v2); [IndicGenBench](https://arxiv.org/pdf/2404.16816)

## (A4) Latency

### Takeaway
I found no independent TTFT / tokens-per-second measurements for these free tiers; only Groq's own advertised speeds. For 800 to 1,500 output tokens, Groq's claimed speeds imply ~1 to 5 s; Gemini and OpenRouter free should be assumed 10 to 40 s (my estimate, verify).

### Cited Findings
- Groq-advertised speeds: gpt-oss-20b 1,000 tok/s, gpt-oss-120b ~500, llama-3.1-8b 560, qwen3.8-27b 450, llama-3.3-70b 280 tok/s. — [Groq models](https://console.groq.com/docs/models)
- Cerebras free trial limits are 5 RPM. — [Cerebras limits](https://inference-docs.cerebras.ai/support/rate-limits)
- WebLLM paper: retains up to 80% of native performance on the same device. — [WebLLM arXiv](https://arxiv.org/abs/2412.15803)

### Inferences
- 1,500 tokens at 280 to 1,000 tok/s is about 1.5 to 5.5 s plus network and queue time. Reasoning models (gpt-oss, Gemini thinking models, Qwen3.5 with thinking on) add hidden thinking tokens, so set low reasoning effort or disable thinking.

### Gaps
- No independently measured TTFT or tok/s for Gemini free tier, OpenRouter free models, or Mistral free tier.

## (B) On-device: WebLLM / WebGPU, sizes, memory, licenses, quality

### Takeaway
WebLLM now ships Qwen3.5 (0.8B/2B/4B/9B), Qwen3 (0.6B to 8B) and Gemma 4 E2B, all Apache-2.0, with grammar-constrained JSON. Qwen3.5-4B q4f16 needs about 3.9 GB of GPU memory (~4.7 GB in the f32 build), so the realistic minimum for a machine with frequent low-memory issues is Qwen3.5-2B or Qwen3-1.7B (about 2.0 to 2.3 GB). Quality at 1 to 4B is adequate for English structured JSON and weak for creative Hindi and especially Nepali.

### Cited Findings
- WebLLM prebuilt list, `vram_required_MB` (from `src/config.ts`, checked 2026-10-21): Qwen3-0.6B q4f16 1,403; Qwen3-1.7B q4f16 2,037; Qwen3-4B q4f16 3,432 (q4f32 4,328); Qwen3-8B q4f16 5,696; Qwen3.5-0.8B 1,629; Qwen3.5-2B q4f16 2,245; Qwen3.5-4B q4f16 3,868 (q4f32 4,680); Qwen3.5-9B q4f16 6,433; Gemma-4-E2B q4f16 3,387 (q4f32 3,863); gemma3-1b 711; Llama-3.2-1B 879, 3B 2,264; Phi-4-mini q4f16 3,438; Phi-3.5-mini 2,520 (1k ctx) to 3,672; SmolLM2-1.7B 1,774. No SmolLM3 seen. — [WebLLM config.ts](https://raw.githubusercontent.com/mlc-ai/web-llm/main/src/config.ts)
- WebLLM v0.2.86 (Oct 11) added Gemma 4 E2B (text and audio input); v0.2.85 added OPFS sync handles; v0.2.81 added XGrammar constrained decoding and OpenAI-style API. f16 builds need the WebGPU `shader-f16` feature; f32 builds do not. — [WebLLM releases](https://github.com/mlc-ai/web-llm/releases)
- Qwen3.5-4B and 9B: Apache-2.0, 201 languages and dialects claimed, 262K context, thinking on by default (`enable_thinking: false` to disable; the old `/nothink` switch is not supported). Hindi and Nepali not named. — [Qwen3.5-4B card](https://huggingface.co/Qwen/Qwen3.5-4B); [Qwen3.5-9B card](https://huggingface.co/Qwen/Qwen3.5-9B)
- Gemma 4: Apache-2.0 on the card (earlier Gemma generations used the custom Gemma terms, so this is a change worth re-verifying before bundling); E2B is 2.3B effective / 5.1B with embeddings, 140+ languages pre-trained and 35+ with out-of-the-box support; Hindi and Nepali not named; E2B MMLU-Pro 60.0%, MMMLU 67.4%. 26B-A4B MoE has 25.2B total / 3.8B active params, 256K context. — [Gemma 4 E2B card](https://huggingface.co/google/gemma-4-E2B-it); [Gemma 4 26B-A4B card](https://huggingface.co/google/gemma-4-26B-A4B-it)
- Licensing flags: Llama 3.x models in WebLLM use the Llama community licence (not MIT/Apache) and Phi-3.5/4-mini are MIT per Microsoft (verify); neither should be the bundled default. SmolLM2 is Apache-2.0 (verify). I did not re-check these cards this session.
- Third-party estimate: WebGPU runs 25 to 35% below native (calculator site, not measured); Qwen3-4B native on Apple M4 10-core ~31 tok/s (community oMLX), M1 Max ~36 tok/s. — [InventiveHQ](https://inventivehq.com/tools/llm-gpu-benchmark); [oMLX benchmark](https://omlx.ai/benchmarks/laksnp2j)

### Inferences
- Download sizes: q4 weights are roughly 0.5 bytes per parameter, so Qwen3.5-2B is about 1.3 to 1.6 GB and Qwen3.5-4B about 2.5 to 3 GB (my arithmetic; check the MLC repo). Plan on VRAM figure plus 1 to 2 GB system RAM for the browser tab. On an integrated GPU the model lives in shared RAM, so a 4 GB-class model on an 8 GB machine with other tabs open is risky; make the default on-device tier the ~2 GB class and offer 4B as opt-in with a RAM check (`navigator.deviceMemory`, WebGPU `maxBufferSize`).
- Integrated-GPU speed: I have no WebLLM measurement; at 25 to 35 tok/s native for a 4B on Apple M-series and a 25 to 35% browser penalty, expect roughly 5 to 25 tok/s for 2 to 4B on typical Windows integrated GPUs (guess, verify). 1,200 tokens would then take about 50 to 240 s, far over the 30 s target. On-device is a privacy/offline fallback, not a speed option.
- Quality: at 2 to 4B, expect usable English scripts, repetitive prose, and unreliable Hindi/Nepali grammar. Hosted Gemini Flash or 70B-class models are likely noticeably better (inference, no head-to-head data found). Gemma 4 26B-A4B (3.8B active) would be the best open on-device-sized candidate for quality but needs ~16 GB-class memory and is not in WebLLM's list as of v0.2.86.

### Gaps
- No measured tokens/sec for WebLLM on integrated GPUs; no MLC download sizes in GB retrieved.
- No creative-writing or Hindi/Nepali benchmark of Qwen3.5 or Gemma 4.
- Ollama and transformers.js not researched in depth (Ollama needs a local install and `OLLAMA_ORIGINS` for browser CORS; verify).

## (C) Best default and fallback chain; model-router approach

### Takeaway
Recommended default: user's own free Google AI Studio key calling Gemini Flash-Lite or Flash (schema-constrained JSON, good multilingual), with Groq (gpt-oss-120b or qwen3.8-27b, strict schema) as the fast second, OpenRouter via OAuth PKCE (Gemma 4 / Nemotron free) as the no-key-paste third, on-device Qwen3.5-2B/4B next, and a rules/template fallback last.

### Cited Findings
- OpenRouter offers an OAuth PKCE flow that returns a user API key from `POST /api/v1/auth/keys`, designed for client-side apps; `/auth/keys` answers CORS with `*` in my preflight test. — [OpenRouter OAuth](https://openrouter.ai/docs/guides/overview/auth/oauth)
- Gemini API key and free-tier details as above; Gemma 4 is a free-tier model on both Gemini API and OpenRouter. — [Pricing](https://ai.google.dev/gemini-api/docs/pricing); [OpenRouter models](https://openrouter.ai/api/v1/models)

### Inferences
- Router design: an `LLMProvider` interface (already a hard rule) with entries {gemini, groq, openrouter, webllm, rules}, a per-provider capability record (strict schema yes/no, max output, thinking toggle), cool-down on 429 using `retry-after` / `x-ratelimit-*` headers, and a task-to-model map: cheap/fast model for shot-list and prompt expansion, larger model for the script. Store keys in the user's browser only (OPFS or IndexedDB), never in the project JSON.
- Suggested order: (1) Gemini key (Flash-Lite for volume, Flash for the script pass); (2) Groq key; (3) OpenRouter OAuth (free models, 50 req/day cap unless the user bought credits); (4) WebLLM Qwen3.5-2B (default) or 4B (opt-in); (5) rules-based fallback. Detect memory and `shader-f16` before offering (4).
- Ship a fixture-based A/B test: 5 briefs times 3 languages, scored for JSON validity, schema repair rate, time, and a human 1 to 5 for style. Model names churn monthly, so pick via a config file, not code.
- Language: for Hindi and Nepali use hosted Gemini (best expected); keep script text generation in English for on-device and translate with the hosted model when available. Mark as an inference, no benchmark found.

### Gaps
- No head-to-head quality data between Gemini Flash-Lite, gpt-oss-120b, qwen3.8-27b and Gemma 4 on this task.
- Google may change free quotas without notice (reports in Jan, Apr, Sep 2026), so the chain must degrade gracefully.

## (D) Terms of service: pasting your own free key

### Takeaway
Nothing I found forbids an open-source app from asking users to paste their own key, but no provider explicitly blesses it either, and Google's terms contain a clause about EEA/CH/UK users and free tier plus a minimum age of 18. Keep keys on-device, tell users the data-use implications, and do not ship or share any key.

### Cited Findings
- Google: free-tier content may be used for product improvement and human review; 18+; unpaid services not for apps likely to be accessed by under-18s; "If you make API clients available to users in the EEA, Switzerland, or the UK, you may use only Paid Services" (the text refers to the API client developer; whether it applies when a user brings their own key is unclear, verify). Google's docs also say keys in client-side code can be extracted and recommend a server. The page did not set out rules about key sharing; it incorporates the Google APIs ToS (not read). — [Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms); [Gemini API key docs](https://ai.google.dev/gemini-api/docs/api-key)
- Groq: customer responsible for its keys; may not resell or lease account access; may not "resell, sublicense, transfer, or distribute" cloud services; may not use services "in a manner intended to avoid incurring Fees"; free-service liability capped at $5,000; no training on inputs/outputs without permission; may suspend access for suspected unauthorised access. — [Groq services agreement](https://console.groq.com/docs/legal/services-agreement)
- OpenRouter: DDoS protection may block requests far exceeding reasonable usage; free models also need a non-negative balance. — [OpenRouter limits](https://openrouter.ai/docs/api-reference/limits)
- Mistral free Experiment plan reportedly requires opting into training (third-party). Cohere free tier is non-commercial only (third-party). — [OpenRouter comparison](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/)

### Inferences
- A bring-your-own-key model with the key stored only in the user's browser and each user on their own account keeps Introcut a client, not a reseller, which fits the Groq clause. Never include a shared developer key in the bundle; that would breach the "no resell/lease" clause and quota limits.
- Show an in-app notice on the key screen: "Gemini free tier: Google may use your prompts to improve its products; do not paste confidential material", plus age/region note for EEA/UK users (suggest recommending Groq or on-device there).
- This is not legal advice; Google APIs ToS and each provider's acceptable-use policy were not read in full.

### Gaps
- Did not read the full Google APIs Terms of Service or Google AUP, Mistral, OpenRouter or Cerebras terms; no explicit statement found about "automated use" for any provider beyond rate limits.
- No evidence found of any provider that explicitly forbids browser-side use of a user's own key; none confirmed as explicitly allowing it either.
