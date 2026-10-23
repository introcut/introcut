# Introcut own fine-tuned story->timeline model: feasibility, cost, legality, serving (as of 2026-10-22)

Scope note: research, not legal advice. A lawyer is needed before relying on any "distillation" reading of provider terms. Search budget was exhausted before every primary page could be fetched; items I could not confirm from a primary page are marked "verify". Numbers labelled "my estimate" are arithmetic or judgement, not measurements. Earlier notes (free_llm_options.md, nepali_hindi_quality.md, architecture_rag_vs_prompting_data.md, llm_scene_spec_design.md) were not repeated; only the facts from free_llm_options.md that matter here are reused.

## 1. Base models: licences, size, multilingual ability, 90%+ validity plausibility

### Takeaway
Licences are no longer a blocker: Gemma 4 is now Apache-2.0, Qwen3/3.5 is Apache-2.0, Phi-4 is MIT, gpt-oss is Apache-2.0 (with a usage policy); Llama is the only one with a custom, non-OSI licence. For a closed-schema JSON task, 0.5-4B LoRA fine-tunes are plausible to reach high validity, especially combined with constrained decoding, but I found no study of exactly our task; Hindi/Nepali story understanding is the weak point, not JSON syntax.

### Cited Findings
- Gemma 4 was released 2026-04-02 under Apache 2.0, dropping the earlier custom Gemma licence; Google's Open Source Blog calls it the first Gemma family under an OSI-approved licence. Sizes reported by one secondary source: E2B (2.3B effective), E4B (4.5B effective), 26B MoE (4B active), 31B dense; another source mentions a 12B variant that does not match, so check the model card. — [Google Open Source Blog](https://opensource.googleblog.com/2026/03/gemma-4-expanding-the-gemmaverse-with-apache-20.html?m=0); [Techwyse](https://www.techwyse.com/news/ai-search/google-deepmind-gemma-4-open-models-apache-2-0-release); [implicator.ai](https://www.implicator.ai/google-releases-gemma-4-under-apache-2-0-dropping-its-custom-ai-license/)
- Qwen 3 and 3.5, Mistral Large 3, Mistral Small 4 and Gemma 4 (26B A4B) are reported as Apache 2.0; Phi-4 family MIT; Llama 4 uses the Llama 4 Community License (not OSI-approved; 700M MAU cap; derivatives must carry the Llama name per Meta brand guidelines, exact wording not confirmed). — [Telnyx/daily.dev/morphllm roundups surfaced in search](https://telnyx.com/resources/open-weight-models); [codenote.net](https://codenote.net/en/posts/oss-license-coding-llm-local-guide-2026/)
- gpt-oss is Apache 2.0 with a separate usage policy per one roundup; another roundup lists it under MIT; the sources conflict, so read the model card (verify). SmolLM3 licence: not confirmed in my searches (I believe Apache-2.0; verify). — [Telnyx](https://telnyx.com/resources/open-weight-models); [codenote.net](https://codenote.net/en/posts/oss-license-coding-llm-local-guide-2026/)
- From earlier Introcut notes: WebLLM ships Qwen3.5 (0.8B/2B/4B/9B), Qwen3 (0.6B-8B) and Gemma 4 E2B, all Apache-2.0, with XGrammar constrained decoding; Qwen3.5-4B q4f16 needs about 3.9 GB GPU memory, 2B about 2.2 GB; Qwen3.5 claims 201 languages but Hindi/Nepali are not named. — [WebLLM releases](https://github.com/mlc-ai/web-llm/releases); [Qwen3.5-4B card](https://huggingface.co/Qwen/Qwen3.5-4B) (via research_notes/Free AI script writer for Introcut/free_llm_options.md)
- Small-model JSON fine-tune evidence: a 2026 study of 24 LoRA variants for merchant extraction found Qwen3.5 0.8B reached 94.75% F1 vs 96.95% for an 8B baseline, and LoRA rank 8 was almost as good as rank 32. — [HF paper 2606.08051](https://huggingface.co/papers/2606.08051)
- Qwen2.5-0.5B LoRA on app-review->JSON improved an aggregate score 62.3% -> 76.6% on 200 held-out examples (author notes some of the gain may be learning deterministic labelling rules). — [HF Space demo](https://tanmaydeshpande-app-review-extraction.static.hf.space/index.html)
- A vendor blog reports Llama 3.1 8B base produced valid JSON ~64% of the time on a 1,000-input extraction test, mostly syntax errors, and claims fine-tuning reaches 99%+ (vendor marketing, unverified). — [Ertas blog](https://www.ertas.ai/blog/fine-tuning-json-output)
- Schema-constrained decoding fixes structure but not whether the content is right; fine-tuning addresses the latter. — [Predibase/LoRAX post](https://www.rubrik.com/blog/ai/24/lorax-outlines-better-json-extraction-with-structured-generation-and-lora)
- JSONSchemaBench (Geng et al., 10K real-world schemas, six constrained-decoding frameworks). A secondary blog reports all frameworks above 86% on simple schemas but big drops on very hard ones (Outlines 3%, XGrammar 28%); check against the paper. Our schema is a small closed one, nearer the "simple" end. — [arXiv 2501.10868](https://arxiv.org/abs/2501.10868); [secondary summary](https://beancount.io/bean-labs/research-logs/2026/07/08/jsonschemabench-structured-outputs-language-models)
- SchemaBench/SRL (ACL 2025): LLaMA-3.1 8B with schema RL reached 79.67% overall, +18.61 points over GPT-4o on that benchmark (hard schemas; 8B+RL, not LoRA 1.5B). — [themoonlight review](https://www.themoonlight.io/en/review/learning-to-generate-structured-output-with-schema-reinforcement-learning)
- I did not find "Constraint Tax" in my searches; not cited.

### Inferences
- Pick Qwen3 (1.7B/4B, Apache-2.0) or Gemma 4 E2B as primary candidates. Gemma 4 E2B is already in WebLLM, so one fine-tune could serve both browser and server. Qwen3.5 small models are in WebLLM too, but Unsloth reportedly advises against 4-bit QLoRA on Qwen3.5 (see section 3), which favours Qwen3 or Gemma 4 for a free-GPU pipeline (verify Gemma 4 support).
- 90%+ schema-valid is plausible for a 1.5-4B LoRA on a small closed schema WITH grammar-constrained decoding at serve time (then syntax validity is ~100% by construction and the question becomes semantic validity: timing sums, vocabulary, referenced actor ids). Without constrained decoding I would expect high-80s to 90s after fine-tuning; no direct citation, validate on our own held-out set. English-only validity is easier than Hindi/Nepali input.
- A pragmatic trick for multilingual: keep the JSON vocabulary and keys English; let the model output only short narration strings in the user's language, or translate the input story to English first (see nepali_hindi_quality.md). The fine-tune can then be mostly English.

### Gaps
- No benchmark of Gemma 4, Qwen3, Qwen3.5 or SmolLM3 on Nepali story understanding found.
- No peer-reviewed result for a 1.5-4B LoRA hitting 90%+ on a nested animation-timeline schema; only analogues.
- Constraint Tax paper not located. SmolLM3 and gpt-oss licence primary files not read.

## 2. Training data and what provider terms say

### Takeaway
Safe data sources: owner-written, rule-engine synthetic data, public-domain stories as inputs, and distillation only from teachers whose licences permit it (Apache/MIT open models run by us or via a provider that allows it). Anthropic, OpenAI and Google Gemini API terms all contain a clause barring use of outputs/services to build competing models, so do NOT distil from them into a released model.

### Cited Findings
- Anthropic Commercial Terms, section D.4: "Customer may not and must not attempt to (a) access the Services to build a competing product or service, including to train competing AI models or resell the Services except as expressly approved by Anthropic". Support article says Outputs may not be used to train competitive models; customers own Outputs. — [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms); [Claude help center](https://support.claude.com/en/articles/12326764-can-i-use-my)
- Google Gemini API Additional Terms: "You may not use the Services to develop models that compete with the Services (e.g., Gemini API or Google AI Studio)." Also bars attempting to "reverse engineer, extract or replicate any component of the Services". Free tier may use your prompts to improve Google products. — [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- OpenAI terms list as prohibited: "Use Output to develop models that compete with OpenAI." (seen via search snippets of the current and EU terms; direct fetch returned 403, so quote and current wording are verify). A commentary argues the clause binds the account holder, not downstream recipients of a dataset (secondary interpretation, not safe to rely on). — [OpenAI terms (search snippet)](https://openai.com/en-GB/policies/row-terms-of-use/); [Hartford commentary](https://erichartford.com/demystifying-openais-terms-of-use-with-regards-to-dataset-licenses)
- Open-model teachers: Qwen3/3.5, Gemma 4 are Apache-2.0 (no field-of-use or output-training restriction in Apache-2.0 itself); I could not read the primary Qwen/DeepSeek licence files for any output-use clause (verify). DeepSeek's R1 distills (800K samples) were released openly, showing the practice is common but not what terms allow. Llama licences have historically had a clause about using outputs to improve other LLMs (needs "Llama" naming) (verify the Llama 4 text). gpt-oss has an Apache-2.0 licence plus a usage policy (verify scope). — [BytePlus](https://www.byteplus.com/en/topic/397925); [Simon Willison](https://simonwillison.net/2025/Jan/20/deepseek-r1)
- Groq says it may not use inputs/outputs to train models unless the customer permits (that is about Groq's own use, not about your training on outputs). — [Groq services agreement](https://console.groq.com/docs/legal/services-agreement)

### Inferences
Source ranking:
- (a) Owner-written: safest, but expensive in time. 150-300 high-quality pairs, mostly used as the gold validation set and a few-shot seed.
- (b) Rule-based synthesis from our own engine (templates + keyword director + augmentation, paraphrase): safe, our own IP. Risk is the model just learning the rules; mitigate with variety and by treating it as a structure teacher while quality comes from (c)/(a).
- (c) Distilling from Apache-2.0 open models (e.g., Qwen3 large, Gemma 4 31B, run by us on rented GPU or via a host): likely safe, since Apache-2.0 has no output restriction; confirm each model's own licence file and the host's terms (OpenRouter/Groq hosting a model does not change the model licence but adds the host terms, verify).
- Not safe: outputs from Claude, GPT or Gemini API/AI Studio (explicit competing-model clauses; a "narrow story-to-JSON" model arguably still competes, no official answer found). Using these only for a private internal evaluation judge, not training data, is a lower-risk use but still ask a lawyer.
- (d) User-consented real edits: good for Phase 4; needs an explicit opt-in and a privacy note, consistent with "media never leaves device" (only the story text and spec would be sent, and only if consented).
- (e) Public-domain/CC0 stories (Project Gutenberg, folktales) as INPUT stories: legally fine for pre-1929/PD texts (verify per-country status; Nepali folktale collections may be under copyright, verify). The target JSON still has to come from (a)-(c).
- Also record provenance per example (source, teacher model, licence) so a release can be audited.

### Gaps
- Primary text of Qwen, DeepSeek, Llama 4 and gpt-oss output-use terms not read; OpenAI clause not fetched directly. Whether "story->timeline JSON" counts as "competing" is untested; lawyer needed.

## 3. Free/cheap training compute and arithmetic

### Takeaway
A first LoRA of a 1.5-4B model on 2-10K examples is feasible on free Kaggle/Colab T4-class GPUs in hours, or about $2-10 on a rented 4090. Reproducible numbers for our dataset must come from a pilot run.

### Cited Findings
- Kaggle: secondary sources agree on ~30 GPU hours/week on T4 (x2 = 32 GB) or P100 (16 GB); session length conflicts (9 h vs 12 h). Kaggle's own docs not read (verify). — [Thunder Compute](https://www.thundercompute.com/blog/colab-alternatives-for-cheap-deep-learning-in-2025); [AIMultiple](https://aimultiple.com/free-cloud-gpu)
- Colab free: official FAQ says free resources are "dynamic usage limits", no guarantees, notebook-interactive use prioritised; third-party guides say disconnects after idle time and non-interactive/batch use can trigger termination; numbers conflict. The terms-of-service text on fine-tuning was not retrieved (verify). — [Colab FAQ](https://research.google.com/colaboratory/faq.html)
- Unsloth: claims 2x faster, 70% less VRAM; Qwen3-14B fits a free 16 GB T4; minimum VRAM table cited by Vast.ai: ~3.5 GB for 3B and ~5 GB for 7B under QLoRA (batch/context dependent). Unsloth's Qwen3.5 guide advises against 4-bit QLoRA on Qwen3.5. — [Unsloth Qwen3.5 guide](https://unsloth.ai/docs/models/qwen3.5/fine-tune); [Vast.ai/Unsloth](https://docs.vast.ai/examples/ai-ml-frameworks/unsloth-studio); [Qwen docs](https://qwen.readthedocs.io/en/latest/training/unsloth.html)
- Data size analogues: 500 HTML->JSON pairs for Phi-3-mini LoRA gave "accurate, schema-consistent" output (practitioner post, not controlled); 0.8B reached 94.75% F1 with rank-8 LoRA (study above). — [LinkedIn post](https://fr.linkedin.com/in/jmarchand1); [HF paper](https://huggingface.co/papers/2606.08051)
- Prices: Modal Starter $0 + compute with $30/month free credits (card requirement unclear), L4 $0.000222/s (~$0.80/h), T4 $0.000164/s. RunPod RTX 4090 ~$0.89/h (owner-supplied, dated 2026-10-08). — [Modal pricing](https://modal.com/pricing)

### Inferences (my estimates, verify with a pilot)
- Token count: 5,000 examples x ~1,200 tokens (story + JSON) = 6M tokens/epoch; 3 epochs = 18M tokens.
- Throughput guess: 1.5B QLoRA on a T4 ~1.5-3K tokens/s -> 18M tokens in about 2-3.5 h; 4B ~0.6-1K tokens/s -> 5-8 h. Fits within one Kaggle week (30 h). 10K examples roughly doubles it.
- On a 4090 (~$0.89/h): 4B run ~2-3 h -> ~$2-3; budget 3-5 iterations -> about $10-15 total. Add ~$5 for synthetic-data generation with an open 30B+ teacher (e.g., 20K generations x 1,500 tokens = 30M tokens; at ~1,000-3,000 tok/s batched, 3-8 GPU-hours, $3-7). Total first-model cost estimate: under $30, plausibly $0 on Kaggle plus a few hours' patience.
- Kaggle publishing: no clause found restricting publishing weights you trained; verify Kaggle and Colab ToS before relying on them for a commercial-adjacent project (Introcut is free/MIT, so likely fine).

### Gaps
- No measured T4 training times for Qwen3 1.7B/4B (search returned none; one Chinese blog with GGUF-labelled numbers I rejected). Lightning AI credits, HF AutoTrain and Axolotl/TRL specifics not researched in this pass.

## 4. Serving options

### Takeaway
Cheapest credible route: ship the fine-tuned model quantised to the browser (WebLLM) for English, and for Hindi/Nepali or weak devices use a small serverless-GPU or CPU endpoint with an OpenAI-compatible server; the app already supports any OpenAI-compatible URL so no app change is needed. A free HF CPU Space is feasible only for a 0.5-1.5B model and very slow for 4B.

### Cited Findings
- HF Spaces CPU Basic: free, 2 vCPU, 16 GB RAM, 50 GB non-persistent disk; sleeps after 48 h inactivity and wakes on visit; forum reports of sleeping spaces failing to restart and quota errors (user reports). — [HF Hub docs](https://huggingface.co/docs/hub/spaces-overview); [huggingface_hub docs](https://huggingface.co/docs/huggingface_hub/main/guides/manage-spaces); [forum](https://discuss.huggingface.co/t/sleeping-spaces-are-not-restarting/174003)
- Cloudflare Workers AI LoRA: supported for specific models only, base model must not be quantised, rank <= 8 (up to 32), adapter < 300 MB, up to 100 adapters/account, open beta and "free for now"; the supported model list in the docs must be checked (launch post listed Gemma 2B/7B, Llama 2 7B, Mistral 7B). So a Qwen3/Gemma 4 adapter is probably NOT supported (verify). — [Cloudflare LoRA docs](https://developers.cloudflare.com/workers-ai/features/fine-tunes/loras/); [launch blog](https://blog.cloudflare.com/fine-tuned-inference-with-loras)
- Modal: L4 $0.000222/s, T4 $0.000164/s, $30/month free credit. — [Modal pricing](https://modal.com/pricing)
- Hetzner raised cloud prices twice in 2026 (CX22/CAX11 EUR 3.29 -> 4.49 in April; CAX11 -> 5.99 on 15 June per a tracker) and, per third-party reports, cheap CX/CAX plans were "not available" as of Sept 2026 (unverified against Hetzner's live site). Oracle Always Free ARM: no data found. — [agentdeals.dev](https://agentdeals.dev/hetzner-pricing-2026); [agentdeals digest](https://agentdeals.dev/digest/2026-w25)
- From earlier notes: Workers Free is 100k requests/day, Workers AI 10k Neurons/day; Cloudflare Workers AI REST is not browser-callable (no CORS), so a Worker proxy would be needed. — free_llm_options.md

### Inferences (my estimates; none measured)
Per option, assuming ~1,500 output tokens per story:
1. In-browser (WebLLM / transformers.js): cost $0 to us; weights on HF (free hosting, check HF storage terms); 1.7B q4 about 1-2 GB download, 2B ~2.2 GB VRAM; generation maybe 10-40 s on a decent GPU laptop; no cold start beyond first download; no abuse risk to us. Needs MLC conversion of the fine-tune (merge LoRA, run mlc_llm convert; effort 1-3 days first time). Weakest on Nepali.
2. llama.cpp on HF CPU Space (llama-server gives an OpenAI-compatible API): 2 vCPU; I would guess 8-15 tok/s for 1.5B Q4 and 3-6 tok/s for 4B Q4 -> 1.5B story about 2-3 min, 4B 4-8 min (guess, verify). Cost $0, cold start of tens of seconds after 48 h sleep, no formal rate limits but shared and fragile; fine for a demo/fallback, not for a real launch. Whether API-style traffic to a free Space is permitted should be checked in HF content/usage terms (verify).
3. Cloudflare Workers AI custom LoRA: only if the base is on the supported list; likely not for our base; skip unless the list includes it.
4. Serverless GPU (Modal/RunPod serverless): L4 at $0.000222/s; a 1.5B model on vLLM at ~50-100 tok/s -> ~15-30 s per story, about $0.003-0.007 warm; cold start 10-60 s (billed). ~$3-7 per 1,000 stories plus cold-start overhead; the $30/month Modal credit would cover on the order of 4,000+ stories/month before paying. vLLM exposes an OpenAI-compatible server; add a small Cloudflare Worker in front for keys, per-IP rate limits and an on/off switch. Abuse is the real cost risk: cap daily spend.
5. Always-on VPS: Hetzner cheap plans are re-priced and reportedly sold out; CPU-only 4 GB boxes give the same slow speeds as option 2 at EUR 5-6/month. Not recommended before real demand.
6. User self-hosting (Ollama): free for us, works with our "My own AI" setting (Ollama exposes an OpenAI-compatible endpoint, verify CORS settings for a browser app). Publish GGUF to HF with the model card.
- Arithmetic example: RunPod 4090 $0.89/h = $0.000247/s; at ~100 tok/s batch-1 a 1,500-token story takes 15 s = $0.0037; with batching of 8 concurrent, cost per story falls roughly proportionally (my estimate).

### Gaps
- No measured tok/s for CPU Space or L4 serving of our model; RunPod serverless, Replicate, fal pricing not fetched; Oracle free tier terms/availability in Nepal not found; LiteLLM not researched (vLLM and llama-server both provide OpenAI-compatible endpoints, which I state from general knowledge, verify).

## 5. Evaluation, safety, release licensing

### Takeaway
Reuse the existing bake-off: automatic checks (JSON parses, Zod-valid, timing sums, vocabulary coverage, referenced ids) are cheap and decisive for a go/no-go; human rating on 50-100 stories decides creative quality; keep a held-out gold set that never enters training.

### Cited Findings
- Constrained decoding fixes structure but not content correctness, so evaluate semantic checks separately. — [Predibase/LoRAX post](https://www.rubrik.com/blog/ai/24/lorax-outlines-better-json-extraction-with-structured-generation-and-lora)
- Apache-2.0 requires keeping licence/NOTICE and stating changes; Llama licence would add "Llama" naming and its own terms (per search roundups; exact text verify). — [codenote.net](https://codenote.net/en/posts/oss-license-coding-llm-local-guide-2026/)
- Providers' free tiers may use your prompts for product improvement (Gemini), relevant if we use them to generate training data. — [Gemini API terms](https://ai.google.dev/gemini-api/terms)

### Inferences
- Metrics: schema validity %, semantic validity % (durations sum to scene length, all actor ids defined, actions in closed vocabulary), vocabulary coverage (share of the action list ever used), variety (distinct n-grams / distinct action sequences across 200 stories), narration language correctness per language, latency, and human 1-5 ratings blind against Gemini/Qwen-prompted outputs. Use the same seed prompts for all.
- Contamination: split by story, not by example; hold out all template families for a subset; do not let synthetic templates leak into the test set; keep eval stories hand-written.
- Content safety: filter inputs/outputs for sexual content involving minors, real-person defamation, hate, self-harm instructions; keep a blocklist plus a classifier or a small moderation prompt; include refusal/neutralisation examples in training; add "AI-generated" labels, consistent with Introcut's rules.
- Release: MIT or Apache-2.0 for the LoRA/weights is compatible with Apache-2.0 bases if you keep their NOTICE; avoid Llama bases for a clean MIT release. Model card: base model, licences, data provenance (list sources and that no closed-API outputs were used), languages, known limits (Nepali weak), intended use, eval numbers. Add to CREDITS.md per project rules.

### Gaps
- No published standard for model-card duties beyond Hugging Face conventions was researched; any EU/Nepal AI-regulation duties not researched.

## 6. Roadmap with gates and an honest quality verdict

### Takeaway
At launch, "prompt a hosted model with a good schema + validator" will almost certainly beat our own small model on quality, especially in Hindi/Nepali; our own model wins on independence, cost control and consistency. So build the data/eval assets first, which are needed either way, and train only once the gate is passed.

### Inferences (effort and money are my estimates)
- Phase 0 (3-5 days, $0): free hosted API (Gemini/Groq/OpenRouter Gemma or Qwen) + Zod validator + repair retry + logging of (story, spec, pass/fail). Careful: do NOT harvest Gemini/Anthropic/OpenAI outputs as training data. Gate: >=90% valid after one retry on 100 hand-written stories.
- Phase 1 (1-3 weeks, $0-5): owner writes 150-300 gold pairs; rule engine synthesises 3-10K pairs with paraphrase augmentation; optionally generate more with an Apache-2.0 open teacher (Qwen3 large / Gemma 4 31B) via free or rented GPU. Build the eval harness. Gate: dataset with provenance, held-out set of >=100 stories.
- Phase 2 (3-7 days, $0-15): QLoRA/LoRA on Qwen3 1.7B and 4B (or Gemma 4 E2B) on Kaggle/Colab free, or a 4090 at $0.89/h. Gate: >=95% schema-valid with constrained decoding, >=90% semantic-valid, human rating within 0.5 point of the prompted hosted baseline on English; otherwise stay with Phase 0.
- Phase 3 (3-7 days, $0-10/month): publish weights to HF; ship in-browser via WebLLM (MLC conversion) for English; offer a Modal/RunPod serverless OpenAI-compatible endpoint behind a rate-limited Cloudflare Worker for others, with a hard spend cap; document Ollama GGUF for self-hosters. Gate: p95 latency under ~40 s and monthly cost under the free credit.
- Phase 4 (ongoing): consented real edits and thumbs-up data, retrain quarterly; consider a larger teacher for Hindi/Nepali narration.
- Honest verdict: a 1.5-4B model is near chance on Nepali comprehension (owner-supplied earlier finding), so the English-keys/translate-first design above is needed; expect the fine-tune to be better than prompting for strict structure/vocabulary adherence and worse on creative variety and non-English input. A hybrid (our model for the timeline JSON, a bigger hosted/open model for translation or narration polishing) is the realistic launch architecture.

### Gaps
- Effort and money figures are not sourced benchmarks; confirm with a one-day pilot. A lawyer should review the distillation-source policy before any public release of a model trained on third-party model outputs.
