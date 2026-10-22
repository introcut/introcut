# Nepali and Hindi script-writing quality: models, pipelines, checks (as of 2026-10-21)

Method note: about 33 search/fetch calls. Several primary pages could not be read in full (PDF streams, truncated pages); where a claim rests on a search snippet or a third-party aggregator, it is marked. Items with no source are in Inferences (my reasoning, untested) or Gaps. The hard finding up front: there is NO published benchmark of Nepali open-ended generation quality (fluency, register, Hindi leakage) for any current model. The only per-language Nepali numbers found are multiple-choice knowledge accuracy (IndicParam).

---

## 1. Which models are best for Nepali and Hindi generation, and what do benchmarks say?

### Takeaway
For Nepali, the only comparable numbers are IndicParam zero-shot MCQ accuracy (UGC-NET Nepali papers): Gemini-2.5 52.0, Claude-4.5 43.8, GPT-5 43.4, Grok-4-fast 40.9, DeepSeek-3.2 39.7, Gemma3-27b 39.3, Qwen3-A3B 37.2, gpt-oss-120b 37.1, Llama3.3-70B 35.0; Llama-3.1-8B 25.5 (chance is about 25%). That is knowledge/linguistic MCQ, not script-writing, so it ranks models but does not prove naturalness. Gemini is the clear leader and it also has a free API tier, so "Gemini on user's free key" is the evidence-backed default for Nepali. For Hindi there is more evidence (MILU, Hindi suites), but nothing recent that compares free-tier models on Hindi script writing.

### Cited Findings
- IndicParam (arXiv 2512.00333 v2): 13k+ MCQs from UGC-NET papers, 11 low/extremely-low-resource Indic languages including Nepali; 20 LLMs; top average accuracy is Gemini-2.5 at 58%. v1 abstract said GPT-5 at 45% was top, so v2 changed the ranking; use v2. — [arXiv abstract](https://arxiv.org/abs/2512.00333), [HTML v2](https://arxiv.org/html/2512.00333v2), [search summary of v1/v2 difference](https://arxiv.org/pdf/2512.00333)
- IndicParam Table 5, Nepali zero-shot accuracy (%): Qwen2.5-3B 27.1; Llama3.2-3B 26.2; Gemma-3-4b 29.0; Qwen3-4B 28.7; Aya-8b 28.2; Llama3.1-8B 25.5; Gemma-3-12b 34.8; Mistral3.1-24b 34.9; Gemma3-27b 39.3; Aya-32b 31.6; Qwen3-32B 33.0; Llama3.3-70B 35.0; DeepSeek-3.2 39.7; Qwen3-A3B 37.2; Llama-4-Scout 34.6; gpt-oss-120b 37.1; GPT-5 43.4; Grok-4-fast 40.9; Claude-4.5 43.8; Gemini-2.5 52.0. Hindi is not in IndicParam; Sarvam models were not evaluated. (Read through a fetch-and-summarize tool; numbers not independently re-checked against the PDF table: verify before quoting.) — [arXiv HTML v2](https://arxiv.org/html/2512.00333v2)
- Practical reading of that table: on-device-size models (3-4B) are at or near chance on Nepali knowledge/linguistic MCQs (26-29% vs 25% chance); Gemma-3-27b / Mistral-24b / DeepSeek / gpt-oss-120b cluster at 35-40%; Gemini-2.5 is about 8 points above the next frontier model. — derived from the table above ([source](https://arxiv.org/html/2512.00333v2))
- MILU (Indic MCQ, 11 languages, includes Hindi, does NOT include Nepali): GPT-4o 77.16% on Hindi, Gemini-1.5-Pro 69.93%, best open model gemma-2-27b base 63.28%; many open models near random outside English; Indic-specific fine-tunes only slightly better than random. These are 2024-era models, so dated. — [MILU paper](https://arxiv.org/html/2411.02538v1)
- Global-MMLU classes Nepali as low-resource and Hindi as high-resource (resource tiers only; per-model Nepali/Hindi numbers not retrieved). — [Global-MMLU paper](https://arxiv.org/pdf/2412.03304)
- IndicGenBench (generation benchmark, ACL 2024): PaLM-2 best, large gap to English; covers Indic languages in general and predates Gemini 2.x/3, Qwen3, Llama 4, so it is dated for this decision. — [ACL 2024](https://preview.aclanthology.org/add_acl24_videos/2024.acl-long.595)
- Language coverage claims (vendor-stated, not quality): Qwen3 lists 119 languages, with Nepali and Hindi named — [Qwen3 blog](https://qwenlm.github.io/blog/qwen3/). Aya Expanse 32B supports 23 languages including Hindi but NOT Nepali, and its license is CC-BY-NC — [HF model card](https://huggingface.co/CohereLabs/aya-expanse-32b). Sarvam-30B and Sarvam-105B (Mar 2026) are Apache-2.0 MoE models aimed at 22 Indian languages (company claim; Hindi listed; Nepali is not one of the 22 scheduled languages, so it is likely not a target; verify) — [OpenSourceForU](https://www.opensourceforu.com/2026/03/sarvam-releases-30b-and-105b-llms-under-apache-2-0/), [AIKosh](https://aikosh.indiaai.gov.in/home/models/details/sarvam2_30b_a2b_4.html).
- Gemini free tier: Google's rate-limit page names no per-model free numbers (limits are per project, vary by model, shown in AI Studio). Third-party snapshots give conflicting numbers (e.g. 2.5 Flash 10 RPM/250 RPD; 2.5 Flash-Lite 15 RPM/1000 RPD in one snapshot) and a forum report says Gemini 3.5 Flash and the "latest" alias errored on free keys while other models worked. Aggregators mention Gemini 3.x/3.5/3.8 Flash and 3.1 Flash-Lite Preview; I could not confirm the exact current model list from Google. Free-tier data may be used by Google to improve products (third-party guide: verify). — [Google rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [search snapshot](https://ai.google.dev/gemini-api/docs/rate-limits?authuser=1), [forum](https://discuss.ai.google.dev/t/gemini-3-5-flash-and-flash-latest-free-tier-api-failing-immediately-with-quota-resource-exhausted-errors-on-first-request/171753), [Gemini 3 Flash free-tier guide (third-party)](https://apidog.com/blog/how-to-use-gemini-3-5-for-free/)
- Groq free tier: aggregator sites disagree on limits (e.g. 30 RPM / 1,000 RPD for Llama 3.3 70B in one table vs 14,400 RPD in others), limits are per organization, and Groq reportedly moved to model-specific daily limits mid-2026 (secondary source). Official numbers are only visible in the Groq console. — [eesel](https://eesel.ai/blog/groq-pricing), [OpenRouter blog](https://openrouter.ai/blog/tutorials/free-llm-apis-compared/)
- Hindi-specific suites exist (IFEval-Hi, MT-Bench-Hi, GSM8K-Hi, ChatRAG-Hi, BFCL-Hi) but results were not retrievable. — [arXiv 2508.19831](https://arxiv.org/abs/2508.19831)
- Romanized Nepali study (2026): base Llama-3.1-8B, Mistral-7B, Qwen3-8B could not respond in Romanized Nepali without fine-tuning; Llama-3.1-8B weakest zero-shot. — [arXiv 2604.14171](https://arxiv.org/pdf/2604.14171)
- A 2026 bilingual English-Nepali model paper (Arkios, 1.04B, Apache-2.0 weights) reports that even its own chat model landed in Devanagari only 58% of the time for en-to-ne translation (zero-shot) and 8% for the base model (5-shot): small models often stay in the source language. — [Arkios](https://arxiv.org/html/2608.30092)
- Qualitative reports of Hindi-neighbour leakage in other languages: an Urdu study reports Devanagari intrusion in DeepSeek, GPT and Qwen outputs; a Marathi study reports vibhakti case markers replaced by Hindi equivalents. This is by analogy only. — [Urdu paper](https://arxiv.org/pdf/2609.10758) (found via search snippet; not read in full)

### Inferences
- Nepali ranking for a user with a free key: Gemini (best evidence) > other frontier closed models via user key > DeepSeek / Gemma-27B / gpt-oss-120b / Qwen3-large (all about 35-40% on IndicParam, no generation evidence) >> any 3-8B on-device model (near chance on Nepali knowledge; expect frequent Hindi/English drift).
- On-device Qwen3 (WebLLM) is not a viable direct Nepali writer; at most it can write English and hand off to a translator or to Gemini.
- Hindi is a much safer target than Nepali for every model on the list; Qwen3, Gemma 3, Llama and Gemini all have substantial Hindi data (e.g. Hindi is the top Indic language in MILU).
- Because MCQ accuracy is a weak proxy for idiomatic spoken style, the owner's rating protocol (section 7) is the real decision tool.

### Gaps
- No benchmark of Nepali open-ended generation quality (fluency, register, naturalness) for any model. No data for Hindi-leaking-into-Nepali rates.
- No Nepali per-language numbers for Global-MMLU, Aya evaluations, SEA/Indic leaderboards; Nepali is absent from MILU.
- No IndicParam-style numbers for Gemini 3.x, Qwen3.5+, Llama 4 variants, Gemma 4 (Gemma terms page references a separate "Gemma 4 license"; not examined: verify).
- Could not confirm current Gemini free-tier model list and quotas from Google primary sources; Groq limits unverified.
- Sarvam performance on Nepali: no data. Sarvam on Hindi: only vendor claims found.

---

## 2. Common failure modes and prompt techniques

### Takeaway
Direct evidence in the literature is thin: the documented failure modes are wrong-script / wrong-language output from small models (Arkios), Hindi-neighbour leakage (Urdu/Marathi studies) and near-chance performance of small models. The technique list below is my engineering judgment, not published results; each must be validated with the owner's test set.

### Cited Findings
- Small or weakly multilingual models often continue in the source language or fail to land in the target script (en-to-ne in Devanagari only 8% base / 58% chat for a 1B Nepali-specific model). — [Arkios](https://arxiv.org/html/2608.30092)
- Hindi grammatical markers displace native ones in close relatives (Marathi case markers; Devanagari intrusion in Urdu outputs). — [Urdu paper](https://arxiv.org/pdf/2609.10758) (snippet-level)
- Anecdotal (not Nepali): a developer's blog reports Gemini voice in Sindhi using an Indian-Sindhi accent with occasional Hindi words but accurate grammar; Rest of World reported ChatGPT inventing words in low-resource languages (Bengali, Urdu, not Nepali). — [Rest of World 2023](https://restofworld.org/2023/chatgpt-problems-global-language-testing/) (dated, anecdotal)
- Evaluation pitfall: a letter-choice MCQ format can make a model look at chance in both languages; use answer-text scoring or a paired-language control. — [Arkios](https://arxiv.org/html/2608.30092)

### Inferences
- Likely failure modes to test for (no published frequencies): Hindi vocabulary in Nepali (e.g. Hindi "hai/hain/kar raha hai" patterns vs Nepali "ho/chha/gardai chha"; Hindi "aapko/aap" vs Nepali tapai/timi/timro honorific tiers); Nepali verb honorific levels (ta/timi/tapai/hajur) mixed within one script; Hindi postpositions ("ka/ki/ke" vs Nepali "ko/ki/ka"); translationese from English word order; English words in Devanagari; digits (Devanagari vs ASCII numerals; TTS reads them differently); Arabic/Urdu-derived Hindi words (zindagi, mushkil) vs Sanskrit/Nepali (jeevan, kathin).
- Prompt techniques to try (all untested here): (a) name the register explicitly: "spoken Nepali of Kathmandu, as a friend talking to a friend, not formal news Nepali"; fix the honorific level (e.g. "use timi/tapai consistently, never aap"); (b) give 2-3 short native examples of the target register in the prompt (few-shot, from a native speaker or CC-licensed text); (c) explicit negative list: "do not use Hindi words: kya, hai, nahi, bahut, aur, lekin, mera/meri..." and a short Nepali alternative table; (d) force Devanagari only, ASCII digits written out as words or consistent, no English letters except brand names; (e) ask for 2 candidate scripts and a self-check step, but do the check in a separate call; (f) low-ish temperature (0.4-0.7) for fewer invented words; (g) ask for short sentences (8-12 words), concrete nouns, no metaphors, because TTS and translation both fail on idiom.
- Back-translation check (Nepali to English by same or another model, compare to the English draft) is cheap and catches meaning drift, but not register errors.

### Gaps
- No peer-reviewed or community source on Nepali-specific honorific or Hindi-leakage rates in Gemini/GPT/Qwen/Llama; no Nepali prompt-engineering evaluations found. All technique effectiveness is unverified.

---

## 3. Pipelines and translation tools (licenses, size, runnability)

### Takeaway
No source shows that "write in English then translate" beats direct generation for Nepali or Hindi, and dedicated translators have gaps: TranslateGemma does not list Nepali among its 55 evaluated languages (Hindi yes); IndicTrans2 is MIT but is built for the 22 scheduled Indian languages (Nepali support is unconfirmed: the model-card tag says "26 languages" without a list); NLLB-200 supports Nepali but is CC-BY-NC (cannot be bundled); MADLAD-400 (Apache-2.0) covers 400+ languages including Nepali (MADLAD license verified via aggregator snippets only). My recommendation: Hindi = direct generation in a strong LLM, optionally refined; Nepali = direct generation with Gemini plus a Gemini "native editor" second pass; do not use Hindi as a pivot.

### Cited Findings
- TranslateGemma (Google, Jan 2026): open translation models on Gemma 3, sizes 4B/12B/27B, 55 evaluated languages; on WMT24++ MetricX 5.32 / 3.60 / 3.09 and COMET 81.6 / 83.5 / 84.4 for 4B/12B/27B; the 55-language list in the community WebGPU demo includes Hindi (hi_IN), Marathi, Bengali, Gujarati, Urdu etc. and does NOT include Nepali. The model is trained on nearly 500 language pairs per the demo's source comments, so Nepali might work but is unevaluated. License is "gemma" (custom Gemma Terms with a Prohibited Use Policy; flow-down obligations; derivative-model definition includes distillation). — [HF model card](https://huggingface.co/google/translategemma-4b-it), [TranslateGemma WebGPU demo constants](https://huggingface.co/spaces/webml-community/TranslateGemma-WebGPU/blob/main/src/constants.ts), [Gemma Terms](https://ai.google.dev/gemma/terms), [tech report abstract](https://arxiv.org/abs/2601.09012)
- Gemma Terms are a custom agreement, not MIT/Apache: treat as NOT bundle-able under Introcut's rules; a user-chosen download at runtime is a separate legal question (verify). Outputs are not Model Derivatives and Google claims no ownership of outputs (§3.3). — [Gemma Terms](https://ai.google.dev/gemma/terms)
- A TranslateGemma WebGPU demo exists on Hugging Face (webml-community), so in-browser inference of the 4B model is demonstrated; its size and speed on typical laptops were not verified. — [demo source](https://huggingface.co/spaces/webml-community/TranslateGemma-WebGPU/blob/main/src/constants.ts)
- IndicTrans2 (AI4Bharat): MIT license; distilled 200M and 320M plus 1B variants; the 200M model card requires IndicTransToolkit, `trust_remote_code=True`, notes the `translation` pipeline is not supported in transformers v5, and shows no ONNX/transformers.js build; the card also says a newer "Indic-Translate" model exists and performs better (I could not find that model by search: verify). The card tags "26 languages" without listing them; project pages describe the 22 scheduled languages; I could not confirm Nepali (npi_Deva) support in the 1B/320M cards despite one search summary claiming it. — [HF indictrans2-en-indic-dist-200M](https://huggingface.co/ai4bharat/indictrans2-en-indic-dist-200M), [paper](https://arxiv.org/pdf/2305.16307), [AIKosh](https://aikosh.indiaai.gov.in/home/models/details/indic_trans2.html), [Indic-Indic 320M card](https://huggingface.co/ai4bharat/indictrans2-indic-indic-dist-320M/blame/c46c5c562baf8cdff81255fc45586ddfddf5729c/README.md)
- NLLB-200 (Meta): model cards list CC-BY-NC 4.0 (a Meta MinT page lists a differently worded NC license; either way non-commercial); includes Nepali and Hindi; distilled 600M and 3.3B variants exist. — [HF nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M/blob/main/README.md), [MinT page](https://meta.wikimedia.org/wiki/Machine_learning_models/Production/Machine_translation)
- MADLAD-400-3B-MT is listed Apache-2.0 (aggregator sources; verify on the Google HF card before use); the 400+ language coverage claim comes from the model name/paper, not verified here for Nepali quality. — [MinT table](https://meta.wikimedia.org/wiki/Machine_learning_models/Production/Machine_translation), [soniqo guide](https://soniqo.audio/guides/translate)
- FLORES-200 (evaluation set, includes Nepali and Hindi) is CC-BY-SA 4.0 per the HF card; one TFDS catalog entry for the older Nepali-English set says "No known license". — [HF flores](https://huggingface.co/datasets/facebook/flores/blob/f9c6ebdb38d0e8e3a23cdbe0b05ac07e69fbf930/flores.py), [TFDS](https://tensorflow.org/datasets/community_catalog/huggingface/flores)
- Qwen3 dense models (0.6B-32B) are Apache-2.0 (MoE license not stated on the blog; check card) — [Qwen3 blog](https://qwenlm.github.io/blog/qwen3/). Sarvam-30B/105B are Apache-2.0 — [OpenSourceForU](https://www.opensourceforu.com/2026/03/sarvam-releases-30b-and-105b-llms-under-apache-2-0/). Aya Expanse is CC-BY-NC — [HF](https://huggingface.co/CohereLabs/aya-expanse-32b). gpt-oss license (Apache-2.0) not re-verified in this session: verify.
- Chat-style translation by small Nepali-aware models is unreliable on the script (see Arkios en-to-ne numbers). — [Arkios](https://arxiv.org/html/2608.30092)

### Inferences
- Pipeline 1 (direct generation, strong LLM): best for natural spoken register because the model writes in the language's own idiom instead of mapping English idioms; weakest on the risk of Hindi leakage for Nepali. Recommended for Hindi and for Nepali when a Gemini-class model is available.
- Pipeline 2 (English then same-LLM translate): easy to implement, lets the English draft be judged by the user, and keeps content controllable; risk is translationese and honorific drift. Useful as the fallback when the user key is weak or when the user only reads English; also useful as the "meaning anchor" for a back-translation check.
- Pipeline 3 (dedicated MT): Hindi can be handled by TranslateGemma (evaluated language, but Gemma license) or IndicTrans2 (MIT, strong Indic focus, heavy Python toolchain, no browser build found); Nepali has no clean permissive, browser-runnable, evaluated MT model: NLLB is NC, TranslateGemma does not list Nepali, IndicTrans2 Nepali unconfirmed, MADLAD-3B is large (3B) for a browser. So for Nepali, prefer an LLM (Gemini) over a dedicated MT, and use MT only as a back-translation checker (via user key or optional local server), not as the writer.
- Hindi-as-pivot (write in Hindi, translate to Nepali) is NOT recommended: it adds exactly the Hindi-register leakage that is the main failure mode, and I found no evidence for it.
- Suggested design: (Nepali) Gemini draft in Nepali with the register prompt, then a second Gemini call acting as "native editor" (fix Hindi words, honorifics, spoken style, keep timing), then automated checks; offer an English-then-translate toggle only as fallback. (Hindi) same flow, with a Hinglish/clean-Hindi switch.

### Gaps
- No Nepali translation-quality numbers (chrF/MetricX) for NLLB, MADLAD, TranslateGemma, Gemini, or GPT retrieved; FLORES-200 per-language tables not read.
- IndicTrans2 Nepali support and the "Indic-Translate" successor unconfirmed. TranslateGemma's tech report language list could not be read (PDF unreadable via tool).
- MADLAD license (Apache-2.0) and gpt-oss license were not verified on primary model cards. No in-browser size/speed measurements for any of these.

---

## 4. Cheap automated quality checks feasible in the browser

### Takeaway
Script ratio, simple lexical Hindi-leak lists, length/pacing estimators and an LLM-judge call are trivially feasible in the browser. Language-ID separating Nepali from Hindi is feasible with GlotLID (Apache-2.0) but I could not confirm its Nepali/Hindi accuracy or a browser build; Meta's fastText LID is CC-BY-NC (flag).

### Cited Findings
- GlotLID v3: Apache-2.0 "plus notices", about 2,100+ labels; the card does not state Nepali vs Hindi accuracy or file size; examples use Python fastText. — [HF cis-lmu/glotlid](https://huggingface.co/cis-lmu/glotlid)
- Meta's fastText language-identification model (lid218e, 217 languages): CC BY-NC 4.0 (non-commercial; do not bundle). — [HF facebook/fasttext-language-identification](https://huggingface.co/facebook/fasttext-language-identification)
- Evaluation pitfalls for Nepali: Nepali script bytes inflate token counts; Devanagari combining marks (vowel signs, virama) fragment tokens in tokenizers whose pre-tokenizer regex ignores `\p{M}`; Arkios fixed this for its own tokenizer. Relevant for any browser-side tokenization or length counting. — [Arkios](https://arxiv.org/html/2608.30092)
- Back-translation and chrF-style metrics: chrF++ is used by FLORES/NLLB evaluations (metrics named in model cards). — [NLLB card](https://huggingface.co/facebook/nllb-200-distilled-600M/blob/main/README.md)

### Inferences
- Feasible in the browser with no model: (1) Devanagari ratio = Devanagari letters / all letters (>= 0.97 for a script that should have no Latin); flag stray Latin words, ASCII digits and Arabic-script characters; (2) a small blocklist/allowlist of Hindi-only function words and verb endings for Nepali output (e.g. hai, hain, nahi, kya, aur, bahut vs ho, chha/chhan, haina, ke, ra, dherai) using Unicode word match: cheap, high precision, modest recall; (3) a Unicode-normalization check (NFC, no zero-width junk, correct danda "।" use, consistent nukta); (4) pacing estimator (section 6); (5) repetition/length checks.
- Feasible but heavier: GlotLID via a fastText-WASM or a converted classifier (not verified to exist); would give a Nepali-vs-Hindi probability per sentence. Cheaper alternative: ask the LLM judge to output language label per sentence.
- Back-translation check: translate script back to English using the user's key (LLM) and compare with the English intent by an LLM or embedding similarity; in-browser option is a small sentence-embedding model (transformers.js) but multilingual embeddings for Nepali are not verified. Treat as a coarse meaning-drift flag, not a quality score.
- LLM-judge with rubric (score 1-5 each): spoken naturalness, correct register/honorific level, absence of Hindi words (list them), absence of English-isms, correct Devanagari spelling, 30-second length, culturally relatable. Use a different model or at least a fresh call from the writer; judges are weak at detecting subtle Nepali errors (no evidence either way: gap), so weight them below the owner's ratings.

### Gaps
- No evidence on judge reliability for Nepali; no GlotLID/CLD3 Nepali-vs-Hindi confusion figures retrieved; no confirmed WASM build of GlotLID.
- cld3/CLD2 licenses and Nepali support not checked in this session.

---

## 5. Romanization (display and TTS input)

### Takeaway
Use a deterministic rule-based transliterator for display (ITRANS or a readable "Nepali-friendly" scheme) and send Devanagari, not Roman text, to TTS whenever the engine supports it. Python `indic_transliteration` is MIT; Aksharamukha is GPL/AGPL (do not bundle); vidyut-lipi (Rust/WASM) supports ITRANS/IAST/ISO but its license was not verified.

### Cited Findings
- `indic_transliteration` (Python, sanskrit-coders / indic-transliteration org): MIT license; schemes include ITRANS, Harvard-Kyoto, OPTITRANS, IAST (full list in repo data files; ISO 15919 not confirmed); the README examples show Latin to Devanagari and Devanagari to other Indic scripts, and IAST as an output target. — [GitHub](https://github.com/indic-transliteration/indic_transliteration_py), [sanskrit-coders repo](https://github.com/sanskrit-coders/indic_transliteration)
- Aksharamukha: npm listing shows GPL-3.0-only; the CLI wrapper AGPL-3.0-only: copyleft, flag. — [jsDelivr npm](https://www.jsdelivr.com/package/npm/aksharamukha), [aksharamukha-cli](https://mcp.depscope.dev/pkg/pypi/aksharamukha-cli)
- vidyut-lipi (Ambuda): about 35 schemes including Itrans, Iast, Iso15919, Devanagari; targets Rust and WebAssembly with an online browser demo; license not stated on the README page: verify. — [README](https://github.com/ambuda-org/vidyut/blob/main/vidyut-lipi/README.md)
- AI4Bharat IndicXlit is a transliteration model (romanized to native scripts) that includes Nepali; license not verified here. — [AIKosh](https://aikosh.indiaai.gov.in/home/models/details/indicxlit.html)
- `inditrans` (Dart) MIT; Haskell devanagari-transliterations BSD-3 (not browser-relevant). — [pub.dev](https://pub.dev/documentation/inditrans/0.13.1/)

### Inferences
- Rule-based ITRANS/IAST output is accurate but unfriendly (diacritics or capital-letter conventions) and ignores schwa deletion, so words like "कमल" may be rendered kamala instead of the spoken "kamal". For display, a "casual Roman Nepali/Hinglish" style is more readable: ask the LLM to produce it in the same call (so it can apply schwa deletion) and keep the ITRANS version as a deterministic fallback/consistency check. That is a recommended design, not a tested one.
- TTS: most TTS engines need either Devanagari input or an engine-specific phoneme/Roman scheme; there is no evidence here about Nepali support in kokoro-js or other TTS (no data; TTS is covered by other researchers). Keep Devanagari as the source of truth; derive Roman from it.
- To integrate in a browser/TypeScript app, check the npm `@indic-transliteration/sanscript` package and its license (not checked: verify), or vidyut-lipi WASM (license verify); porting the MIT Python scheme tables is an option.

### Gaps
- Licenses for vidyut-lipi, IndicXlit and the npm sanscript package were not verified; no evidence on schwa-deletion accuracy of any library for Nepali vs Hindi.

---

## 6. Spoken length: syllables per second and words for 30 seconds

### Takeaway
I found NO published syllables-per-second figure for Nepali or Hindi narration. The estimate below is an engineering heuristic that must be calibrated by timing the real TTS or the real video-generator voice.

### Cited Findings
- No Nepali speech-rate study found. A secondary article lists conversational rates (Japanese 7.84, Spanish 7.82, French 7.18, Italian 6.99, German 6.97, English 6.19 syllables/s) without Nepali or Hindi. — [thedonutwhole.com](https://www.thedonutwhole.com/do-some-languages-talk-faster/) (secondary, low authority)
- Syllables per second is "not completely reliable" because syllable boundaries are hard to agree on; Hindi is described as syllable-timed in the prosody literature; the one Hindi rate paper found studies L2 Hindi spoken by Assamese speakers, not a native baseline. — [Wikipedia: Speech tempo](https://en.wikipedia.org/wiki/Speech_tempo), [Gauhati University paper](https://gauhati.ac.in/?p=20274)
- A cross-language study claims information rate converges to about 39 bits/s; no Nepali confirmation. — [Gigazine summary](https://gigazine.net/gsc_news/en/20190905-human-speech-information-rate)

### Inferences
- Working assumption (unsourced, to be calibrated): clear narration for short video at about 4.5-6 syllables per second (slower than casual conversation, as TTS and ad voice-over usually are). For 30 s, that is roughly 135-180 syllables of speech, minus pauses (about 2-4 s of total silence for a 5-6 sentence script), so aim for about 120-160 syllables.
- Devanagari word length: assuming an average of about 2.5-3 syllables per Nepali/Hindi word (unverified; Nepali words tend to be short and verb-final; Hindi has many one-syllable function words), 120-160 syllables is about 40-60 words. Hindi with many "hai/ka/ki" particles will pack more words per second. English counterpart at about 2.5 words/s is 70-80 words, so a Nepali/Hindi 30 s script is noticeably fewer words than English.
- Syllable counting in Devanagari for estimation: count independent vowels and consonant+matra units (akshara), subtract schwa-deleted word-final consonants (Hindi/Nepali final inherent 'a' is usually not pronounced), count conjuncts (virama joins) as one akshara. A simple approximation "number of aksharas = consonant letters not followed by virama + independent vowels" is within roughly +-10% for estimating, but this accuracy is a guess.
- Best practice: store a per-voice calibration factor (measured seconds per syllable) from the first TTS render and adjust the writer prompt's target word count; the video generator (Veo etc.) speaking pace should be measured separately.

### Gaps
- No primary source for Nepali or Hindi native narration rate; no corpus statistics (e.g. from Common Voice or IndicTTS) retrieved.

---

## 7. Free datasets/resources and cultural relevance

### Takeaway
Permissive Nepali text exists at scale (Sangraha CC-BY-4.0 with Nepali Devanagari; FineWeb-2 npi_Deva), but is mostly web/news text, not colloquial narration; for few-shot examples, owner-authored or owner-curated short spoken-style scripts are better and license-clean.

### Cited Findings
- Sangraha (AI4Bharat): CC-BY-4.0; 22 Indic languages plus English; Nepali (`npi_Deva`, and a Latin-script `npi_Latn` split) about 4.88M rows each; Nepali about 12.9B tokens in total, of which 1.82B Verified, 10.59B Synthetic (Wikipedia English translated into Indic, so translationese: avoid for style examples), 0.49B Unverified. — [HF ai4bharat/sangraha](https://huggingface.co/datasets/ai4bharat/sangraha)
- Practical public Nepali corpus: about 4.18B unique tokens across FineWeb-2 npi_Deva (3.32B), Sangraha verified Nepali (0.40B), IndicCorpV2 npi_Deva (0.42B) and Wikipedia ne (0.02B); the paper gives no per-source license terms. — [Arkios](https://arxiv.org/html/2608.30092)
- FLORES-200 (Nepali, Hindi): CC-BY-SA 4.0 (share-alike: flag for bundling; fine for evaluation); Nepali-English FLORES originated from Wikipedia sentences (formal). — [HF flores](https://huggingface.co/datasets/facebook/flores/blob/f9c6ebdb38d0e8e3a23cdbe0b05ac07e69fbf930/flores.py), [PapersWithCode](https://paperswithcode.com/paper/two-new-evaluation-datasets-for-low-reso)
- Nepali NLU benchmark NLUE (IJCNLP-AACL 2025 Findings, 12 new datasets) exists for understanding, not generation; "existing top models struggle". Per-model results not retrieved. — [ACL Anthology](https://preview.aclanthology.org/new-sigs/2025.findings-ijcnlp.119/)
- NepaliGPT paper: generative Nepali model and a 4,296 QA pairs benchmark. — [arXiv 2506.16399](https://arxiv.org/pdf/2506.16399)
- A Goldfish Nepali model card (Apache-2.0) lists MADLAD-400, NLLB and other corpora among its training sources. — [HF goldfish nep_deva_5mb](https://huggingface.co/goldfish-models/nep_deva_5mb/blob/main/README.md)

### Inferences
- Do not bundle web-scraped corpora (mixed underlying copyright even when the compilation license is CC-BY: verify FineWeb-2 and IndicCorp terms before any redistribution). Use them offline only to inspire/validate; put owner-written few-shot examples in the repo (the owner owns the copyright, so they can be CC0/MIT).
- Cultural relevance (unsourced judgment): relatable Nepali short-video themes include remittance and family members abroad (migration to Gulf/Malaysia/Korea/Australia), farming and seasons (dhan ropai, monsoon, landslides), festivals (Dashain, Tihar, Chhath, Holi, Teej), student life (+2, IELTS, abroad study, results), trekking/tourism, small-shop entrepreneurship, load-shedding legacy, online-shopping and wallet apps. Test ideas should span these and include politics-free everyday scenes. Hindi equivalents: festivals (Diwali, Holi), exam prep, small business, village-to-city migration.
- Nepal is multilingual (Maithili, Bhojpuri, Newari, Tamang etc.); script writer's "Nepali" should default to standard Kathmandu-valley spoken Nepali unless the user asks otherwise.

### Gaps
- No Nepali colloquial/short-narrative corpus with a verified permissive license identified (news portal text is typically copyrighted). OSCAR, CC-100, IndicCorp, Nepali Wikipedia licenses not individually verified here (Wikipedia is CC-BY-SA; IndicCorp and OSCAR terms: verify).

---

## 8. Minimal test set and owner rating protocol

### Takeaway
Use 10 ideas x 3 languages (English, Hindi, Nepali) x 3 pipelines for Nepali only (direct, English-then-translate, direct plus editor pass) and have the native Nepali speaker rate each script in under a minute with a 5-item rubric; analyze by pipeline. This is a recommendation; no published protocol for Nepali exists.

### Cited Findings
- Evidence that benchmark formats can mislead (letter-choice MCQ vs answer-text scoring, paired-language control): use a paired-language control in any automated check. — [Arkios](https://arxiv.org/html/2608.30092)
- No published Nepali script-writing human-eval protocol found.

### Inferences
- Test set (10 ideas, mixed genres): 1 remittance/family abroad story; 2 farmer and weather; 3 Dashain/Tihar festival memory; 4 student exam-result pressure; 5 small momo/tea shop launch; 6 mobile-wallet scam warning (public service); 7 morning routine tip; 8 trekking guide teaser; 9 a joke/relationship scene (casual register, tests honorifics); 10 product/app explainer with English loanwords (tests code-mixing). Provide each idea in the language the user would type (4 in Nepali, 3 in English, 3 in romanized Nepali/Hindi) to test input handling.
- Matrix: for each idea generate Nepali and Hindi with the candidate setups: A) Gemini free model, direct; B) Gemini, English first then translate; C) Gemini direct then native-editor pass; D) one open model (e.g. Qwen3-32B or gpt-oss-120b via Groq/OpenRouter, user key) direct. That is 10 x 4 = 40 Nepali scripts; Hindi can be rated by the owner only if fluent: otherwise skip or ask a Hindi speaker (owner is Nepali: Hindi rating may be weaker; mark).
- Rating form (owner, blind to pipeline, randomized order, about 45 s per script): 1-5 each for (a) sounds like a person speaking vs reading/translated, (b) correct Nepali (spelling, grammar, no Hindi words), (c) honorific/tone fit for the audience, (d) meaning matches idea, (e) would I post this as is? Plus tick-boxes for failure tags: Hindi word, English-ism, wrong script/digits, too long/short when read aloud, awkward idiom, wrong spelling. Record the offending words: they feed the blocklist and prompt negative list.
- Timing: owner reads each script aloud once with a stopwatch (or the TTS is timed); log seconds and syllable estimate to calibrate section 6.
- Decision rule: adopt the pipeline with the highest mean "would post" and zero or near-zero Hindi-word tags; require at least 70% of scripts rated >= 4 on (a) and (b); re-run after every prompt change on the same 10 ideas; keep the rated outputs as a regression set and as few-shot candidates (owner-approved lines become licensed examples).
- Automated pre-checks (section 4) run first so the owner only sees scripts that pass script ratio and blocklist tests.

### Gaps
- No inter-rater data, since there is one rater; scores will be subjective but sufficient for a pipeline choice. No evidence on whether LLM-judge scores correlate with the owner's ratings: the owner's first 40 ratings can also be used to measure that correlation.

---

## Source-quality summary and caveats
- Strongest evidence: IndicParam v2 (arXiv Dec 2025, updated), TranslateGemma model card, Gemma Terms, Qwen3 blog, model cards for licenses. Weakest: aggregator pages for free-tier quotas; summarizer-tool reads of PDFs (Table 5 numbers should be rechecked against the paper before quoting).
- Several 2026 arXiv items (Arkios 2608.30092, Urdu 2609.10758, Romanized-Nepali 2604.14171) were found in search results and not independently cross-checked.
- Unresolved "verify" list: Gemini current free models and quotas; Groq limits; Gemma 4 license; IndicTrans2 Nepali support and "Indic-Translate"; MADLAD and gpt-oss licenses; vidyut-lipi / IndicXlit / sanscript-npm licenses; FineWeb-2, IndicCorp, OSCAR license terms; GlotLID Nepali-vs-Hindi accuracy and browser build.
