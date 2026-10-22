# Prompt engine and curation layer for the Introcut middleman (as of 2026-10-22)

Scope note. The research session hit a tool rate limit after about 17 calls, so several planned searches did not run (image-first workflow evidence, licences of in-browser scorers, Seedance/Kling/Luma official docs, aesthetic predictors, OCR for garbled text, Wan official repo). Those items are listed under Gaps and not filled from memory. Where I give engineering judgment with no source, it sits under Inferences and is labelled as judgment. Vendor claims and measured results are separated where possible. Prices come mostly from third-party trackers, which disagree with each other; every price is marked "verify".

## (a) What makes a prompt or spec "best", and how to measure it

### Takeaway
Provider guidance converges on a structured prompt: cinematography, subject, action, context, style, audio, with one focused action per clip, and reference images for consistency. I found no published prompt-ablation or A/B study for current video models. "Best" therefore cannot be settled from literature, and Introcut would have to define it with its own blind tests.

### Cited Findings
- Google's Veo 3.1 guide (published 2025-10-16) recommends a five-part formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]. It lists camera vocabulary (dolly, tracking, crane, aerial, POV; wide, close-up, low angle; shallow depth of field). Clip lengths are 4, 6 or 8 s, at 720p or 1080p, in 16:9 or 9:16. — [Google Cloud blog, Veo 3.1 prompting guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- Veo audio syntax: dialogue in quotation marks (`A woman says, "We have to leave now."`), `SFX:` prefix for sound effects, `Ambient noise:` prefix for ambience. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- Negative prompting advice from Google: describe what you want rather than what to exclude, for example "a desolate landscape with no buildings or roads" and not "no man-made structures". — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- Google's consistency tools: "Ingredients to Video" (reference images of characters, objects, settings, styles reused across shots), "First and Last Frame" (start and end image plus a description of the move between them), a consistent Style & Ambiance block, and generating references with Gemini 2.5 Flash Image. Google also suggests using Gemini to expand simple prompts into cinematic language. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- Google's timestamp prompting assigns one shot to each 2-second segment of an 8 s clip. The page does not state a "one action per shot" rule outright; it is implied by the timestamp example. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- That page's own status is internally inconsistent (it says both "generally available" and "preview" on Vertex AI), and its "30-40% retention uplift" figure is a customer testimonial and unverified. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- Third-party summaries of Google's guidance (dated 2026-03-30) list components subject, action, scene or context, camera, visual style, audio and negative prompts, and say not every element is needed every time. They suggest roughly 100 to 150 words per prompt. This is secondhand and the word count is a blogger's claim, not Google's. — [Frameo summary](https://frameo.ai/blog/google-veo-3-prompt-guide-best-practices/)
- Kling 3.0 (third-party guides, not official docs): native multi-shot storyboards of up to six shots per output; define subjects at the start and repeat identical descriptors in each shot ("same costume"); label each shot with framing, subject and motion; attribute dialogue to named characters with tone; "auto" mode lets the model plan cuts, "custom" mode gives per-shot duration and content and is recommended when cut timing matters. Sources disagree on the release date (Feb 2025 vs Feb 2026). — [fal.ai Kling 3.0 guide](https://blog.fal.ai/kling-3-0-prompting-guide/); [Morphic Kling 3.0 guide](https://morphic.com/resources/how-to/kling-3.0-guide)
- Wan 2.2 (third-party guides, not the official repo): 80 to 120 words, standard cinematography terms (pan, tilt, dolly, orbit, crane) plus speed modifiers; a 5 s clip has room for about one camera move and one subject action; contradictory camera commands can break the temporal sequence; `prompt_extend` rewrites short prompts by default and should be turned off when you need literal control. — [Scenario Wan 2.2 essentials](https://help.scenario.com/en/articles/wan-2-2-models-the-essentials/); [Unifically Wan 2.2 I2V guide](https://unifically.com/blogs/wan-2.2-image-to-video-prompt-guide); [Dreamina Wan 2.2 prompt guide](https://dreamina.capcut.com/ai-video/wan-2-2-prompt)
- Gemini Omni Flash (announced at Google I/O, May 19 or 20, 2026; sources differ): takes text, images, audio and video as input; up to 10 s clips with native audio; up to five photos into video; multi-turn conversational editing (change one element, add objects, adjust camera angle). Rolled out in the Gemini app, Flow and YouTube Shorts; API access was said to follow, and I did not confirm it is live. Outputs carry SynthID. — [9to5Google, 2026-05-11](https://9to5google.com/2026/05/11/gemini-omni-video-model-shows-up-with-some-early-demos/); [Inquirer](https://technology.inquirer.net/146830/google-introduces-gemini-omni-an-ai-video-editing-model/amp)
- Runway's official Gen-4 prompting guide returned HTTP 403, so I have no verified Runway guidance from the source. — attempted [Runway help centre](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)

### Inferences
- The common core across vendors is: a short list of named slots, concrete camera terms, one subject action per clip, identical character and style descriptors repeated each shot, and reference images. This is exactly what a "shot card" JSON compiled per generator can encode, and a code linter can check each item (slot present, one verb phrase, descriptor block identical to the style bible, word count in range).
- Since Gemini Omni offers conversational editing, a compiler target for "edit instruction" (change one element of an existing clip) is plausible. It would let a user fix one shot without regenerating. Marked verify, because I did not see the API surface.
- Judgment, no source: the metrics for "best" should be outcome measures at the shot level (usable-take rate, number of re-rolls per accepted shot, blind preference between prompt versions) rather than prompt length or prompt-style purity.

### Gaps
- No published prompt-ablation or A/B study for video models was found (not searched deeply; the one search on this returned only benchmarks and vendor guides).
- Official guides for Kling, Seedance 2, Runway, Luma, and the Wan GitHub repo were not read; only third-party summaries.
- Seedance 2 prompting specifics were not covered.
- Failure modes (text garbling, hands, identity drift, physics) are not documented for 2026 models in anything I read, other than the VBench-2.0 numbers in section (b).

## (b) Automatic evaluation of generated clips: metrics, reliability, what can run in a browser

### Takeaway
Evaluators exist for several dimensions, but reliability varies a lot by dimension and judge model. Specialist detectors (identity, camera motion, anatomy) agree best with humans; composition, motion rationality and plot are weakest. VLM judges range from 48% to 73% pairwise agreement with humans in one 2026 benchmark, so they should rank and advise, not auto-reject.

### Cited Findings
- VBench-2.0 covers five areas (Human Fidelity, Controllability, Creativity, Physics, Commonsense) with 18 fine-grained dimensions, scored by VLMs/LLMs plus specialist anomaly detectors. — [VBench-2.0, arXiv 2503.21755](https://arxiv.org/html/2503.21755v2)
- Correlation of VBench-2.0 scores with human win ratios, computed over only four models: Identity Consistency 99.46%, Motion Order 99.31%, Instance Preservation 99.11%, Camera Motion 97.95%, Anatomy 95.46%, Dynamic Attribute 90.95%, Human Interaction 89.28%, Plot 89.59%, Motion Rationality 87.97%, Composition 81.70%. — [VBench-2.0](https://arxiv.org/html/2503.21755v2). Caveat: four models is a very small sample, and the table says "correlation" while a figure caption says Spearman.
- Tools VBench-2.0 uses: LLaVA-Video-7B (captioning/VQA), Qwen2.5-7B-Instruct as judge, ViT-base anomaly classifiers for body/hands/faces with YOLO-World, ArcFace plus RetinaFace for identity, CoTracker-v2 for camera motion, SIFT/FLANN/RANSAC plus RAFT for multi-view. — [VBench-2.0](https://arxiv.org/html/2503.21755v2)
- VBench-2.0's own stated limits: VLMs have training gaps for anomalies and are weak at counting and 3D; about 70 prompts per dimension; most videos under 10 s. The authors report models fail about 80% of the time on simple dynamic changes. — [VBench-2.0](https://arxiv.org/html/2503.21755v2)
- VideoScore (a trained video-quality metric, built on Mantis, trained on VideoFeedback: human multi-aspect scores for 37.6K videos from 11 generators) reports Spearman 77.1 with humans on its own test split, and better correlation than other metrics on EvalCrafter, GenAI-Bench and VBench. These are the authors' numbers, with no independent replication found. — [VideoScore, arXiv 2406.15252](https://arxiv.org/abs/2406.15252)
- A 2026 benchmark (VGI-Bench) reported pairwise agreement with humans of 73.2% for Gemini-3-Flash as judge, 64.3% for GPT-5-mini, and 47.9% for Claude-Haiku-4.5. Another 2026 paper (VBVR-Pro) reports per-vote agreement of 0.54 for GPT-5.5 and 0.52 for Gemini-3.1-Pro against a human ceiling of 0.77, with its own rule-based scorer at over 0.60. WorldModelBench reports 70% pairwise agreement among human annotators. These came through search snippets only, not full reads, so treat the numbers as preliminary. — [VGI-Bench](https://arxiv.org/pdf/2608.19583); [VBVR-Pro](https://arxiv.org/pdf/2608.26105); [WorldModelBench](https://arxiv.org/pdf/2502.20694)
- Video reward models (VideoDRM, VideoGRM) are reported by their authors to improve best-of-N selection, with self-reported accuracy and no cost data. — [benchmarklist.com VideoGRM](https://benchmarklist.com/models/videogrm/)

### Inferences
- Judgment: evaluators by trust level for Introcut:
  - Auto-reject (cheap, high agreement, objective): black/blank frames, wrong duration or aspect ratio, missing audio track, frozen video (near-zero optical flow), face-identity mismatch against the user's own reference (ArcFace-style embedding distance). Identity consistency had the highest human agreement in VBench-2.0.
  - Advise only (flag, show a score, never hide): anatomy/hand glitches, camera-motion match, prompt alignment, aesthetics, VLM overall rating, garbled on-screen text.
  - Never auto-decide: story/plot fit, emotional tone, "is this good". These are the weakest dimensions and human agreement itself is only about 70% pairwise.
- Pairwise comparison against a rubric by a VLM is probably more reliable than absolute scoring, in line with the pairwise numbers above, but I did not find a direct test; verify before relying on it.
- Browser-feasible candidates (licences NOT verified in this session, so do not bundle until checked): CLIP/SigLIP image-text similarity on sampled frames, frame-difference or simple optical flow on canvas, Tesseract-style OCR to compare rendered text with intended text, face-embedding distance. Cloud-only in practice: LLaVA-Video-7B, Qwen2.5-VL, VideoScore (7B-class), Gemini as judge. The user-supplied free Gemini key from earlier research could run the VLM judge at the user's own cost.

### Gaps
- Per-evaluation cost for Gemini or GPT video judging was not looked up.
- Licences for SigLIP, CLIP, aesthetic predictors, RAFT, CoTracker, ArcFace/RetinaFace (RetinaFace/InsightFace weights are often non-commercial; verify), VideoScore, VBench code and the LLaVA-Video weights were not verified. The search for them failed on the rate limit.
- No data found on OCR reliability for garbled AI text or on aesthetic predictor correlation with human taste for video.
- VBench (original) leaderboard content and agreement stats were not read.

## (c) Variants and selection economics

### Takeaway
I found no source quantifying savings from "first-frame then animate". The cheapest selection level is picking between prompts or images before spending on video. Per-second video prices make best-of-N at video level costly, so any plan has to select earlier in the pipeline.

### Cited Findings
- Google's own guide promotes an image-first path: generate matched start and end frames with Gemini 2.5 Flash Image, then use First and Last Frame to video, and reuse reference images across shots. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
- Wan 2.2 advice for image-to-video: prompt the motion rather than re-describing the scene. — [Unifically](https://unifically.com/blogs/wan-2.2-image-to-video-prompt-guide)
- Video reward models claim best-of-N gains (self-reported, no cost accounting). — [benchmarklist.com VideoGRM](https://benchmarklist.com/models/videogrm/)
- Reward-model gradient methods are memory-heavy for video, which is a training-time concern, not an inference selection concern. — [DOLLAR, arXiv 2412.15689](https://arxiv.org/pdf/2412.15689)
- Veo 3.1 has no free API tier. — [BenchLM Veo pricing, dated 2026-09-11](https://benchlm.ai/media-pricing/veo)

### Inferences
- Cost arithmetic of best-of-N on video (assumption: $0.10/s): one 8 s clip costs $0.80; N=4 costs $3.20 for that single shot. Doing this for a whole 30 s story would be $12 (4 x 30 x $0.10). That is why N must be applied only to hero shots, or earlier in the funnel.
- Cheapest-first ladder (judgment, no source): (1) LLM critic or linter scores 3 to 5 prompt variants and drops weak ones for free; (2) user picks among 3 to 4 first-frame stills (cost depends on the image model; I did not price one; Gemini free-tier image generation is a possibility, verify); (3) generate video only for the winning still, one take; (4) re-roll only on user thumbs-down or an auto-reject hit; (5) cache accepted shots keyed by shot-card hash for reuse.
- The user's own generator access (their free Flow/Kling credits, as in the owner's model) means Introcut does not pay for takes, so selection tooling matters more than spend control: help the user avoid wasting limited free generations.

### Gaps
- No evidence on actual savings or hit-rate improvement from first-frame workflows.
- No data on low-resolution draft previews for video models (no provider draft mode was found).
- No published study on learning prompts from thumbs up/down for video.

## (d) Routing: code-rendered scene versus AI video versus user footage

### Takeaway
I found no published routing study. The available evidence about what AI video does badly (counting, dynamic attribute change, human interaction, plot) supports routing exact-content shots (text, numbers, charts, UI) to code and organic or cinematic motion to AI. The rule set below is engineering judgment.

### Cited Findings
- VBench-2.0: models fail roughly 80% of the time on simple dynamic changes; absolute scores are low for dynamic attribute, dynamic spatial relationship, motion order, human interaction, complex plot and complex landscape. VLM judges are weak at object counting. — [VBench-2.0](https://arxiv.org/html/2503.21755v2)
- Kling 3.0 multi-shot mode caps at six shots per output, and cut-timing control needs "custom" mode. — [fal.ai](https://blog.fal.ai/kling-3-0-prompting-guide/)
- Veo clips are 4, 6 or 8 s, and Gemini Omni Flash up to 10 s, so a 30 s story needs at least 3 to 5 AI clips plus cuts. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1); [Inquirer on Gemini Omni](https://technology.inquirer.net/146830/google-introduces-gemini-omni-an-ai-video-editing-model/amp)

### Inferences
Judgment rule set the AI planner can follow (a decision order, first match wins):
1. User supplied footage or screenshots for this beat: use them (edit, crop, zoom, caption). Cost $0.
2. Beat contains exact text, numbers, a chart, a timeline, a UI mock, a map pin, logo or icon, or a list: code scene. Reason: AI video garbles exact content and cannot be edited cheaply; code is deterministic and Devanagari/Nepali text can be laid out by Introcut's own renderer (the repo already fixed Devanagari layout).
3. Beat needs a recognizable person from the user (face/voice): user selfie or the opt-in avatar path; do not route to generic AI faces.
4. Beat needs organic motion (people moving naturally, animals, water, fire, crowds, cinematic atmosphere): AI video, one action per shot.
5. Abstract mood, transition, or background texture: code (gradients, particles, kinetic type) first; AI only if the user chose Premium.
6. Anything the linter flags as risky for AI (more than one action, counting, text in frame, hand-object interaction, 3+ characters): split it, or move the risky element to a code overlay on a clean AI plate (for example, AI background clip plus code-rendered caption).
Failure cases: code scenes look flat if overused (a 30 s all-code video reads as slides); AI clips with burned-in text can be unreadable, so put text in an overlay layer; mixed styles clash unless the style bible controls palette and grain on both sides.

### Gaps
- No evidence on audience or retention effects of hybrid versus all-AI videos.
- No published list of what code-rendered scenes beat AI on.
- Cost of a hybrid story is computed in section (g) from assumptions only.

## (e) Story-to-prompt pipeline design and existing open pipelines

### Takeaway
Published storyboard-to-video agents follow the same shape Introcut needs (plan, per-shot specs, consistency groups, critic), but their evidence is author-reported on benchmarks and mostly pre-2026 generators. Their value for Introcut is architecture, not proof of quality.

### Cited Findings
- VideoDirectorGPT (2023): GPT-4 writes a "video plan" with scene descriptions, entity layouts, backgrounds and consistency groupings; a separate generator (Layout2Vid) renders it. Authors report better layout accuracy on VPEval and higher cross-scene object consistency versus baselines such as ModelScopeT2V, and favourable human ratings. I could not read its limitations section. — [arXiv 2309.15091](https://arxiv.org/pdf/2309.15091)
- MovieAgent (NUS): LLM agents playing director, screenwriter, storyboard artist and location manager; authors claim state-of-the-art on script faithfulness, character consistency and narrative coherence. My attempt to read the paper hit the rate limit, so the numbers are not verified. — [arXiv 2503.07314](https://arxiv.org/html/2503.07314v1)
- MAViS (multi-agent long-sequence video storytelling): script, shot design, character modelling, keyframe generation, animation and audio, using an Explore, Examine, Enhance loop (a critic stage). Positioned against MovieAgent on seven properties including ID consistency and audio. — [arXiv 2508.08487](https://arxiv.org/html/2508.08487v5)
- A 2026 framework (hyper.ai summary of arXiv 2601.17737) splits work into a scripting agent, a director agent and a critic agent; I did not read the original. — [hyper.ai](https://hyper.ai/ko/papers/2601.17737)
- Veo timestamp prompting and Kling multi-shot are native in-model multi-shot options, which reduce the need for a shot-by-shot stitching step for short sequences. — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1); [fal.ai](https://blog.fal.ai/kling-3-0-prompting-guide/)

### Inferences
- Proposed pipeline (judgment, consistent with the cited designs and Introcut's earlier decisions of one structured LLM call plus a code validator):
  1. Intake (6 questions or fewer): the point of the video, the audience and language (Nepali, Hindi, English), the one-sentence takeaway, what the user already has (screens, selfie, voice, clips), tone, and constraints (no faces, brand colours).
  2. Beat sheet: 5 to 8 beats for 30 s, each with a purpose, duration, and a route (user/code/AI) from the section (d) rules.
  3. Style bible (generated once, locked): palette, lens/look, character sheet with fixed descriptor strings, aspect ratio, grain, caption font.
  4. Shot cards (JSON): slots from section (a) plus a continuity block that code pastes verbatim, so the LLM cannot drift the descriptors.
  5. Compilers per target: Veo (colon-free quoted dialogue, SFX: prefix, <=8 s), Kling (shot labels, up to six shots, named speakers), Wan (80 to 120 words, one motion), Runway, Luma, Seedance, and Introcut scene spec.
  6. Lint: slot completeness, one action, duration limit, continuity block identical, no negative phrasing, word range, route sanity.
  7. Edit points with locks: user edits to a beat, shot card or style bible become locks, and the AI regenerates only unlocked fields.
- The cited agent papers all include a critic stage, which supports building the evaluator in section (b) as an explicit step and not an afterthought.

### Gaps
- Results, benchmarks and stated limitations of MovieAgent, MAViS and VideoDirectorGPT were not read in full.
- LTX/Wan ComfyUI "AI film" workflows and community pipelines were not researched.
- No evidence on real-user outcomes from any of these agents; all are academic benchmarks.

## (f) Are "viral prompts" a defensible asset?

### Takeaway
Probably not on their own. Prompts are weakly protected (US Copyright Office view in January 2025 says prompts alone do not give authorship of the output, and I found no source that protects a prompt text as a standalone moat), marketplaces sell them cheaply and buyers can re-share them, and a prompt library is easy to copy. More defensible items are an evaluated engine, consented pick data, language-specific craft rules and distribution. Virality cannot be promised.

### Cited Findings
- The US Copyright Office's Part 2 report (2025-01-29) concluded that, with current technology, prompts alone do not give users enough control to be authors of the output; repeated refinement did not change that; human-authored elements within a mixed work can be protected; AI used as an assisting tool does not make the whole work uncopyrightable; sufficiency is decided case by case. — [IPWatchdog](https://ipwatchdog.com/2025/01/29/part-two-copyright-office-ai-report-says-creative-prompting-doesnt-constitute-authorship/); [Skadden](https://www.skadden.com/insights/publications/2025/02/copyright-office-publishes-report); [Sidley](https://datamatters.sidley.com/2025/02/07/u-s-copyright-office-issues-report-on-artificial-intelligence-and-copyrightability/). Note this is US law; Nepal and India were not researched.
- PromptBase (launched 2022): prompts priced $1.99 to $4.99, platform takes 20%; it checks prompts by running them and doing reverse image search; purchased prompts can be shared online with no recourse for the marketplace. A 2022 PetaPixel piece cites a seller selling 3 to 5 prompts a day. — [PetaPixel 2022](https://petapixel.com/2022/09/06/you-can-now-buy-and-sell-ai-image-prompts-on-a-marketplace); [TechCrunch 2022](https://techcrunch.com/2022/07/29/a-startup-is-charging-1-99-for-strings-of-text-to-feed-to-dall-e-2/)
- Seller income and volume claims for 2025 ($5k to $20k per month for top sellers, 500,000 prompts sold, $10M in transactions) come from promotional blogs with no primary source. Treat as anecdotal at best. — [neuraplus guide](https://neuraplus-ai.github.io/blog/selling-ai-prompts-online-guide.html); [Oakgen](https://oakgen.ai/blog/prompt-economy-marketplaces)
- I found no source documenting whether PromptBase declined, and no source on whether video prompts specifically sell.

### Inferences
- Price points of $2 to $5 per prompt versus $3 to $5 raw cost per generated 30 s story mean a prompt must save at least one failed generation to be worth buying; but the buyer cannot verify that before paying, and the text can be copied. Judgment.
- Model updates (Veo 3 to 3.1, Kling to 3, Gemini Omni in 2026) change what works, so a static prompt library decays quickly; an engine that recompiles shot cards per generator version holds value longer. Judgment.
- Defensibility ranking (judgment): (1) distribution and the editing workflow (locks, timeline, export) where the user spends time; (2) evaluation harness plus consented pick data (which prompt or still users chose, which takes they accepted), because competitors cannot copy data they do not have; (3) Nepali/Hindi craft rules and Devanagari-correct code scenes, which global tools under-serve (a claim about competitors I did not verify); (4) templates and community; (5) the prompt text itself, last.
- Honest limits: no prompt can guarantee virality, and Introcut must not promise views or retention. The only truthful metrics are measurable quality ones (usable-take rate, user preference in blind tests).

### Gaps
- No data on how easily competitors copy prompt libraries other than the general sharing problem.
- No confirmation of PromptBase's current business status or non-US law on prompt protection.
- No evidence on user willingness to pay for video prompts.
- Whether user-pick data can be collected under consent and local-only constraints in Introcut's privacy model is a design question, not researched (CLAUDE.md says media never leaves the device, so any dataset must be opt-in and metadata-only).

## (g) Quality-versus-cost tiers (dated provider prices, arithmetic shown)

### Takeaway
At the lowest list prices found (about $0.05 to $0.12 per second), raw AI footage for 30 s costs $1.50 to $3.60, and about $3.40 to $9 at Seedance reseller prices. A standard tier using AI for about 8 to 10 s costs about $1 to $2, and a premium tier with best-of-N on hero shots costs about $5 to $8 or more. All prices are third-party reports; verify on each vendor's page.

### Cited Findings
- Veo 3.1 Fast on the Gemini API: $0.10/s at 720p, $0.12/s at 1080p, $0.30/s at 4K; no free tier for Veo 3.1; a Lite tier at about $0.05/s was reported (price page dated 2026-09-11; another tracker updated 2026-07-20 lists $0.12/s with audio at 1080p and fal.ai at $0.15/s). — [BenchLM Veo pricing](https://benchlm.ai/media-pricing/veo); [Finout Gemini pricing 2026](https://www.finout.io/blog/gemini-pricing-in-2026); [perkstack tracker](https://perkstack.co/blog/cheapest-veo-3-1-fast-api)
- Runway API: a credit is $0.01; Gen-4 Turbo 5 credits/s = $0.05/s; Gen-4.5 12 credits/s = $0.12/s. — [Creatify Runway pricing 2026](https://creatify.ai/blog/runway-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay); [Unifically Runway Gen-4](https://unifically.com/blogs/runway-gen-4)
- Luma: priced per generation; one comparison reports Ray 3.2 at $0.30 per 5 s clip at 720p and $1.20 at 1080p, another a $0.10 to $0.30/s range; sources disagree on version. — [novoads Luma vs Runway](https://novoads.ai/blog/luma-vs-runway); [rangy.ai pricing guide](https://rangy.ai/blog/ai-video-pricing-explained)
- Seedance 2.0: reported about $0.14/s on ByteDance's Volcengine; resellers $0.15 to $0.30/s (fal.ai about $0.30); Atlas Cloud $0.112/s (and $0.081/s in another post, inconsistent); Mini tier $0.056/s; the Dreamina consumer app has no public API. "Seedance 2.5" is mentioned but unverified. — [Higgsfield pricing blog](https://higgsfield.ai/blog/seedance-2-0-pricing-2026); [Atlas Cloud](https://www.atlascloud.ai/blog/seedance-2.0-pricing-full-cost-breakdown-2026); [LLM Gateway](https://llmgateway.io/models/seedance-2-0)
- Kling and Wan API prices: not found (gap).

### Inferences
Assumptions: final length 30 s; reference price $0.10/s (Veo 3.1 Fast, 720p); AI clips are 8 s; image model cost for stills is unpriced (set to $0 or free-tier, verify); Introcut pays nothing in the owner's model because the user generates in their own free tools, so these numbers are what the user would spend or consume in credits.
- All-AI raw, one take: 30 s x $0.10 = $3.00. At Runway Gen-4 Turbo $0.05/s: $1.50. At Gen-4.5 $0.12/s: $3.60. At Seedance reseller $0.112 to $0.30/s: $3.36 to $9.00.
- Draft (free): all code-rendered scenes, user footage and screenshots, voice via local TTS. Cost $0 per video; minutes.
- Standard: AI for about 3 key shots of 8 s = 24 s is too much; use about 2 key shots = 16 s, with 2 takes on average = 32 s billed x $0.10 = $3.20; or 1 hero shot of 8 s with 2 takes = 16 s x $0.10 = $1.60. Rest is code/user footage. Range about $1.60 to $3.20.
- Premium: 30 s of AI = 4 clips of 8 s (32 s billed, $3.20), plus best-of-3 on 2 hero shots adds 2 x 2 extra x 8 s = 32 s x $0.10 = $3.20, total about $6.40; if re-rolls for failures add 25% it is about $8. Range $6 to $8 at the Veo Fast price, higher at Seedance reseller prices.
- Hybrid saves cost mainly because code-rendered seconds cost $0: if 60% of seconds are code or user footage, billed AI seconds fall from 30 to 12 before retakes.
- Veo has no free API tier, so a free "standard" tier would depend on the user's own Flow or app credits and not on an API (consistent with the owner's no-paid-API rule).

### Gaps
- Kling, Wan and Gemini Omni API prices not found; Omni API availability unverified.
- Image model cost for first-frame stills not priced.
- Prices may have changed since the cited trackers; none are official price sheets.

## (h) Recommendation: engine to build first, evaluation protocol, minimum viable curation

### Takeaway
Build first a rule-plus-LLM planning engine that outputs a beat sheet with per-beat routes and compiled shot cards, with a free code-side linter and a user-pick curation step. This adds visible value with zero marginal cost per user. Judge with blind A/B tests with real users, and do not use model judges to auto-reject beyond objective technical failures.

### Cited Findings
- Agent pipelines in the literature include a critic or examine/enhance stage, and use consistency groups. — [VideoDirectorGPT](https://arxiv.org/pdf/2309.15091); [MAViS](https://arxiv.org/html/2508.08487v5)
- Identity consistency, camera motion and anatomy show the highest agreement between automatic metrics and humans; composition and motion rationality the lowest. — [VBench-2.0](https://arxiv.org/html/2503.21755v2)
- VLM judge agreement with humans varies from 47.9% to 73.2% pairwise depending on model. — [VGI-Bench](https://arxiv.org/pdf/2608.19583) (snippet-level)

### Inferences
All of this is design judgment built on the findings above.
- Engine v1, inputs: idea or story text, language, tone, uploaded assets, chosen target generators, tier.
- Steps and who does each:
  - Rule-based: route assignment first pass (section (d) rules), duration budget, shot-card schema validation, compiler per generator, linter, continuity block pasting, locks.
  - One LLM call (Gemini free key per earlier research): intake-to-beat-sheet, style bible, shot-card fields, then a repair call if the linter fails.
  - Model-judged (advice only): LLM pairwise critique of 3 to 5 prompt variants against the rubric before anything is generated; optional VLM judge on a returned clip using the user's own key.
  - Objective code checks on returned clips (auto-reject allowed): duration, aspect ratio, blank or frozen frames, audio present.
- Minimum viable curation (no per-user cost): the user generates in their own tool, uploads takes, and Introcut shows a side-by-side view with objective flags and an optional LLM note; the user picks, the pick becomes a lock, and the timeline assembles the winners with code scenes. Add first-frame still comparison later if a free image path is confirmed.
- Evaluation protocol with real users: recruit 20 to 30 Nepali-speaking creators; each brings 3 stories; for each story produce prompts via (A) plain user prompt, (B) Introcut compiled shot card, (C) B plus LLM critique; they generate in their own free tools with the same settings; blind rating by the creator and 2 outside raters on usable-take (yes/no), preference rank, and number of re-rolls needed; log time to a finished video. Report win rate of B versus A with a confidence interval; do not claim improvement without it. Do not measure or promise virality or retention.
- Consent and privacy: pick data collected only if opt-in, stored as metadata (shot-card hash, chosen variant, thumbs), never the media, per the hard rules.

### Gaps
- Sample sizes and thresholds are my design judgment, not from a source.
- No source shows that compiled prompts beat plain prompts on 2026 models; this is exactly what the protocol must test.
- Licences of any bundled evaluator are unverified; per the project's hard rules, check each one and add it to CREDITS.md before shipping.
