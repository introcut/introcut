# Voice cloning for Introcut V1 (English, Hindi, Nepali) - open models, hosted routes, consent design, verdict (as of 22 Oct 2026)

Method note: licence tags and file lists were read from the Hugging Face API (`https://huggingface.co/api/models/<id>`) and raw model cards on 22 Oct 2026. Some pages (Oshara/chatterbox-nepali-tts, TelvoxAI/Imbatmann/ayushkhadkaa Nepali Chatterbox repos, ai4bharat/IndicF5 card, canopylabs Hindi Orpheus) are gated or private and could not be read. arXiv numbers for OmniVoice came through a summariser of the HTML paper, so check them against the PDF before quoting them in the final report ("verify").

---

## 1. Candidate cloners and zero-shot TTS: licences, languages, hardware, evidence

### Takeaway
No model I found is simultaneously permissive (code AND weights), cloning-capable, and evidenced for Nepali. For Hindi, only a few permissive cloners exist (Chatterbox Multilingual MIT, VoxCPM2 Apache, svara-TTS voice-clone beta Apache, MOSS-TTS v1.5 Apache but 8.5B). The best-evidenced multilingual cloner covering both Hindi and Nepali, OmniVoice, has non-commercial weights (CC-BY-NC) and so fails Introcut's hard rule. Chatterbox (MIT) is the safest English anchor, with Hindi as "experimental".

### Cited Findings

**Summary table (code licence / weights licence / languages / size)**

| Model | Code | Weights (as published) | Hindi | Nepali | Size / hardware | Verdict vs Introcut rules |
|---|---|---|---|---|---|---|
| Chatterbox Multilingual (Resemble, V3) | MIT | HF tag `license: mit` | Yes (in the 23) | No | 0.5B Llama backbone; GPU example uses CUDA, no VRAM figure published | Passes licence (training-data provenance not stated: verify). Built-in PerTh watermark |
| Chatterbox-Turbo / Nano | MIT | MIT | No (English) | No | Turbo 350M; Nano 110M, "3x faster than realtime on 8 CPU cores" | English-only; CPU-friendly |
| OmniVoice (k2-fsa, Mar 2026) | Apache-2.0 | **CC-BY-NC** | Yes (WER 4.33) | Yes (`npi`, FLEURS CER 3.43) | 0.8B (Qwen3-0.6B init), RTF 0.032 on H20 | **Fails** (NC weights) |
| VoxCPM2 (OpenBMB, Apr 2026) | Apache-2.0 | Apache-2.0 | Yes (30 langs) | No | 2B, ~8 GB VRAM, RTF ~0.30 on RTX 4090; GGUF CPU path via llama.cpp-omni | Passes licence |
| svara-TTS voice-clone beta (Kenpath) | Apache-2.0 (card) | Apache-2.0 (card) but Llama-3.2 base | Yes | Yes | 3.3B params BF16, 6.6 GB | Licence chain needs checking; beta |
| MOSS-TTS v1.5 (OpenMOSS, May 2026) | Apache-2.0 | Apache-2.0 | Yes (31 langs) | No | 8.49B params BF16 | Passes licence; too big for target laptops |
| Qwen3-TTS Base (0.6B/1.7B) | Apache-2.0 | Apache-2.0 | No | No (10 langs) | 0.6B / 1.7B | Passes licence; wrong languages |
| OpenVoice v2 | MIT | MIT | not a Hindi TTS (see below) | no | small | Passes licence; cloning = timbre transfer only |
| XTTS-v2 (Coqui) | MPL-2.0 (idiap fork) | CPML (non-commercial) | Yes | No | ~0.5B (verify) | **Fails** (CPML) |
| F5-TTS | MIT | **CC-BY-NC-4.0** | via IndicF5 | no | - | **Fails** |
| IndicF5 (AI4Bharat) | (no GitHub licence field) | HF tag MIT; gated | Yes (11 langs) | **No** | 1417 h training data | Passes by tag; no Nepali |
| Fish Audio S2 Pro / OpenAudio S1 / Fish-Speech 1.5 | NOASSERTION | Fish Audio Research Licence / CC-BY-NC-SA | - | - | - | **Fails** |
| CosyVoice 2 / Fun-CosyVoice3 | (repo licence not retrieved) | Apache-2.0 | No | No | 0.5B | Wrong languages |
| IndexTTS-2 | NOASSERTION | bilibili custom licence | No (en/zh) | No | - | Custom licence; wrong languages |
| Spark-TTS | - | CC-BY-NC-SA-4.0 | No | No | 0.5B | **Fails** |
| MaskGCT | - | CC-BY-NC-4.0 | No | No | - | **Fails** |
| Zonos v0.1 | Apache-2.0 | Apache-2.0 | no evidence | no | - | Languages: HF metadata lists none (verify) |
| Orpheus 3B | Apache-2.0 | Apache-2.0; base Llama-3.2-3B-Instruct | English official | No | 3B | Not a general cloner; Hindi research release is gated |
| VibeVoice-1.5B | MIT | MIT | No (en/zh only) | No | 1.5B | Passes licence; wrong languages; auto watermark + audible disclaimer |
| Higgs Audio v2 | - | HF tag `other` | No (en, zh, de, ko) | No | 3B | Custom licence (verify) |
| Dia 1.6B | Apache-2.0 | Apache-2.0 | No (English) | No | 1.6B | Wrong languages |
| MegaTTS3 | - | Apache-2.0 (tag) | No (en/zh) | No | - | Wrong languages; encoder availability not verified |
| StyleTTS2 | MIT | - | no evidence | no | - | Not assessed beyond code licence; phonemizer chain not verified here |
| Seed-VC (voice conversion) | **GPL-3.0** | GPL-3.0 tag | n/a (VC) | n/a | - | **Fails** (copyleft) |
| kNN-VC (voice conversion) | MIT (LICENSE file) | - | n/a | n/a | - | Passes; quality needs minutes of reference |
| RVC / Applio (voice conversion) | MIT / MIT | pretrained weights tag MIT | n/a | n/a | - | Passes by tag; needs per-voice training |

**Chatterbox family**
- Weights: HF metadata `License: mit`; the multilingual list is "Arabic, Danish, German, Greek, English, Spanish, Finnish, French, Hebrew, Hindi, Italian, Japanese, Korean, Malay, Dutch, Norwegian, Polish, Portuguese, Russian, Swedish, Swahili, Turkish, Chinese". Nepali is not listed. 500M parameters, "0.5B Llama backbone" — [HF card](https://huggingface.co/ResembleAI/chatterbox)
- Watermark: "Every audio file generated by Chatterbox includes Resemble AI's Perth (Perceptual Threshold) Watermarker ... imperceptible neural watermarks that survive MP3 compression, audio editing, and common manipulations" — [Chatterbox README](https://raw.githubusercontent.com/resemble-ai/chatterbox/master/README.md). Perth repo is MIT — [GitHub API](https://api.github.com/repos/resemble-ai/Perth)
- Repo licence MIT, 27k stars, last push 2026-07-21 — [GitHub API](https://api.github.com/repos/resemble-ai/chatterbox)
- Chatterbox-Turbo: "350M parameter ... English". Chatterbox-Nano: 110M, "running 3x faster than realtime on 8 CPU cores", English; README also ships `example_vc.py` (voice conversion example) — [README](https://raw.githubusercontent.com/resemble-ai/chatterbox/master/README.md)
- Dedicated Hindi finetune `ResembleAI/Chatterbox-Multilingual-hi`: MIT tag, "optimized for Hindi", 2.14 GB T3 file — [HF card](https://huggingface.co/ResembleAI/Chatterbox-Multilingual-hi)
- Hindi quality evidence is thin and mixed: issue #163 "Hindi tts is needed, performs poorly at present with Hindi audio" (June 2025, written before the multilingual release), issue #291 "in multimodel language hindi audio is not correct" (Sept 2025, open, body contains only demo-prompt text and no comments) — [#163](https://github.com/resemble-ai/chatterbox/issues/163), [#291](https://github.com/resemble-ai/chatterbox/issues/291); code-switching (Hindi-English) is not supported natively, "Foreign words/phrases inherit the accent and phonetic rules of the specified language" — [#346](https://github.com/resemble-ai/chatterbox/issues/346)
- Only quantitative Hindi figure for the Chatterbox family: community LoRA `reenigne314/chatterbox-indic-lora` (MIT) reports Hindi mean CER 0.1058 (Whisper large-v3, 100 held-out samples, ~10 h IndicTTS training data); "Naturalness (MOS), speaker similarity, and prosody have not been formally evaluated"; two speakers per language — [HF card](https://huggingface.co/reenigne314/chatterbox-indic-lora)
- Reference-audio length: model card gives none; Nepali community Space asks for "a clean 5-10 second reference voice clip" — [waglesameer5 card](https://huggingface.co/waglesameer5/chatterbox-nepali)
- Browser port: `onnx-community/chatterbox-multilingual-ONNX` (MIT), q4 language model ~354 MB plus conditional decoder ~534 MB, speech encoder ~591 MB, embed tokens ~68 MB (about 1.55 GB total at q4) — [HF tree API](https://huggingface.co/api/models/onnx-community/chatterbox-multilingual-ONNX/tree/main?recursive=true)

**OmniVoice (the strongest Hindi+Nepali evidence, but non-commercial)**
- Licence sentence: "Our code is released under the Apache 2.0 License. The pre-trained model is licensed under the CC-BY-NC due to constraints from its training data (e.g., Emilia)." — [HF card](https://huggingface.co/k2-fsa/OmniVoice). A secondary German page claims Apache for the model; the primary card contradicts it ([secondary](https://nevercodealone.de/glossare/ki-tools-2026/omnivoice-zero-shot-tts-modell-600-sprachen-2026)).
- Language list in the card metadata contains `hi` and `npi` among 600+ — [HF raw card](https://huggingface.co/k2-fsa/OmniVoice/raw/main/README.md)
- Paper: 0.8B params; Hindi WER 4.330 / SIM-o 0.863 on MiniMax-Multilingual-24 (MiniMax 6.962/0.818; ElevenLabs 5.827/0.730); FLEURS CER Hindi 2.64 (ground truth 2.54), Nepali 3.43 (ground truth 4.76); no per-language MOS/SIM for Nepali; RTF 0.0319 at 16 steps on an H20; "currently trained solely on publicly available open-source datasets" — [arXiv 2604.00688](https://arxiv.org/html/2604.00688v2) (verify numbers)
- Code Apache-2.0, 15.5k stars, last push 2026-10-19 — [GitHub API](https://api.github.com/repos/k2-fsa/OmniVoice). Disclaimer forbids "unauthorized voice cloning, voice impersonation, fraud" — [HF card](https://huggingface.co/k2-fsa/OmniVoice)
- A GitHub issue titled "Hindi" was closed with "Not sure what the issue is" and no detail — [issue 14](https://github.com/k2-fsa/OmniVoice/issues/14); no Nepali user reports found.
- Install guide: pip + CUDA PyTorch (`torch==2.8.0+cu128`) or Apple Silicon — [HF card](https://huggingface.co/k2-fsa/OmniVoice)

**VoxCPM2**
- Apache-2.0: "Released under the Apache-2.0 license, free for commercial use"; "2B parameters, 30 languages, 48kHz"; Hindi in list, Nepali not; VRAM "~8 GB"; RTF ~0.30 on RTX 4090 (~0.13 with Nano-vLLM); LoRA fine-tune "with as little as 5-10 minutes of audio"; "Performance varies across languages depending on training data availability"; "Strictly forbidden to use for impersonation, fraud, or disinformation. AI-generated content should be clearly labeled." — [HF card](https://huggingface.co/openbmb/VoxCPM2)
- Hindi on MiniMax multilingual test: WER 19.699 (vs ElevenLabs 5.827, FishAudio S2 14.640), speaker similarity 85.6 (best in that table); another table gives Hindi CER 0.79% — [VoxCPM README](https://raw.githubusercontent.com/OpenBMB/VoxCPM/main/README.md). The WER gap versus OmniVoice's 4.33 on the same benchmark name suggests VoxCPM2 Hindi is intelligible-but-error-prone while keeping timbre well (inference, conditions of the two evaluations not compared).
- CPU/edge: GGUF support for VoxCPM2 on CPU/Metal/CUDA/Vulkan via llama.cpp-omni — same README.

**svara-TTS voice-clone beta (Hindi and Nepali, Apache)**
- Card: Apache-2.0; 19 languages including `hi` and `ne`; "works with short (~10s) reference audio"; trained on SYSPIN, RASA, IndicTTS, SPICOR "~2000 hours, ~50 speakers"; limitations "Zero-shot cloning is not identical to dedicated finetuning", "Speaker similarity may degrade over long utterances", "Varies by language due to dataset imbalance"; "this is a beta research release" — [HF card](https://huggingface.co/kenpath/svara-tts-voiceclone-beta)
- 3.30B parameters BF16, 6.62 GB — [HF API](https://huggingface.co/api/models/kenpath/svara-tts-voiceclone-beta)
- Launch article gives no MOS/CER for Nepali or Hindi; Nepali ~55 h RASA data, Hindi ~100 h — [HF blog](https://huggingface.co/blog/kenpath/svara-tts-open-multilingual-speech-for-india)
- Base chain: svara is built on `canopylabs/3b-hi-ft-research_release` (gated); Orpheus 3B declares `base_model: meta-llama/Llama-3.2-3B-Instruct` with Apache tag — [Orpheus HF API](https://huggingface.co/api/models/canopylabs/orpheus-3b-0.1-ft). A Llama 3.2 base normally brings the Llama 3.2 Community Licence (custom) — verify, as the cards only say Apache-2.0.
- Training data: RASA and IndicVoices-R are CC-BY-4.0 on HF — [Rasa](https://huggingface.co/api/datasets/ai4bharat/Rasa), [IndicVoices-R](https://huggingface.co/api/datasets/ai4bharat/indicvoices_r); SYSPIN, SPICOR and IndicTTS licences not verified.

**MOSS-TTS v1.5**: Apache-2.0, "31 languages ... including ... Hindi", zero-shot cloning, 8.49B parameters BF16 — [HF card](https://huggingface.co/OpenMOSS-Team/MOSS-TTS-v1.5), [HF API](https://huggingface.co/api/models/OpenMOSS-Team/MOSS-TTS-v1.5). No Nepali.

**Qwen3-TTS**: Apache-2.0; "covers 10 major languages (Chinese, English, Japanese, Korean, German, French, Russian, Portuguese, Spanish, and Italian)"; Base models clone — [HF card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base). A tts.ai listing claiming it cannot clone contradicts the official card ([tts.ai](https://tts.ai/voices/qwen3-tts/?lang=zh), disregard).

**Non-permissive items (quoted)**
- Fish Audio S2 Pro: "Any use of the Fish Audio Materials or Derivative Works for a Commercial Purpose requires a separate written license agreement from Fish Audio." — [LICENSE](https://huggingface.co/fishaudio/s2-pro/raw/main/LICENSE.md). OpenAudio S1-mini and Fish-Speech 1.5 are CC-BY-NC-SA-4.0 — [HF API](https://huggingface.co/api/models/fishaudio/openaudio-s1-mini)
- F5-TTS weights CC-BY-NC-4.0 (HF tag), repo MIT — [HF API](https://huggingface.co/api/models/SWivid/F5-TTS), [GitHub API](https://api.github.com/repos/SWivid/F5-TTS)
- XTTS-v2: `license: other`, `coqui-public-model-license`; supports 17 languages incl. Hindi (hi); "clone voices into different languages by using just a quick 6-second audio clip" — [HF card](https://huggingface.co/coqui/XTTS-v2/raw/main/README.md). I did not retrieve the CPML sentence itself (gap).
- IndexTTS-2: custom "bilibili Model Use License Agreement" with a 100-million-MAU clause (and a "Derivative Work" definition that includes model outputs) — [LICENSE](https://huggingface.co/IndexTeam/IndexTTS-2/raw/main/LICENSE.txt)
- Spark-TTS CC-BY-NC-SA-4.0, MaskGCT CC-BY-NC-4.0 — [Spark](https://huggingface.co/api/models/SparkAudio/Spark-TTS-0.5B), [MaskGCT](https://huggingface.co/api/models/amphion/MaskGCT)
- Seed-VC repo licence GPL-3.0 — [GitHub search API](https://api.github.com/search/repositories?q=seed-vc+voice+conversion&sort=stars)
- Mistral Voxtral-4B-TTS: CC-BY-NC-4.0 — [HF API](https://huggingface.co/api/models/mistralai/Voxtral-4B-TTS-2603)
- VibeVoice-1.5B (MIT): "Voice impersonation without explicit, recorded consent" is out of scope; "the model is trained only on English and Chinese data"; "Embedded an audible disclaimer ... automatically into every synthesized audio file" plus "an imperceptible watermark" — [HF card](https://huggingface.co/microsoft/VibeVoice-1.5B)

**OpenVoice v2 and voice conversion**
- OpenVoice: "Starting from April 2024, both V2 and V1 are released under MIT License. Free for commercial use." It claims zero-shot cross-lingual cloning where "neither of the language of the generated speech nor the language of the reference speech needs to be presented" in training — [README](https://raw.githubusercontent.com/myshell-ai/OpenVoice/main/README.md). Last push 2025-04-19 (dormant) — [GitHub API](https://api.github.com/repos/myshell-ai/OpenVoice). No Hindi/Nepali quality evidence found.
- kNN-VC: MIT LICENSE; "The improvement in quality diminishes beyond 5 minutes of reference speech" — [README](https://raw.githubusercontent.com/bshall/knn-vc/master/README.md), [LICENSE](https://raw.githubusercontent.com/bshall/knn-vc/master/LICENSE)
- RVC (MIT, 38.9k stars) and Applio (MIT, active 2026-10-22) — [RVC API](https://api.github.com/repos/RVC-Project/Retrieval-based-Voice-Conversion-WebUI), [Applio API](https://api.github.com/repos/IAHispano/Applio); pretrained `lj1995/VoiceConversionWebUI` tag MIT — [HF API](https://huggingface.co/api/models/lj1995/VoiceConversionWebUI). Per-voice training data requirement not retrieved (gap).

### Inferences
- Only Chatterbox, VoxCPM2, svara beta and MOSS are both permissive and Hindi-capable cloners; of these Chatterbox has the clearest "MIT weights + MIT code + built-in watermark" story and smallest size, so it is the natural V1 anchor.
- OmniVoice is the quality ceiling for Hindi and Nepali by published numbers but the NC weights make it unusable as a bundled or required component; it is useful only as an internal listening-test reference.
- svara beta is the only permissive model that claims Nepali cloning, but with ~50 training speakers and no published metrics its zero-shot generalisation to arbitrary user voices is unproven.

### Gaps
- Per-model VRAM/RAM and real-time factor on RTX 3050 / 8 GB integrated-GPU laptops: no published figures for Chatterbox Multilingual, svara or OmniVoice on such hardware.
- Chatterbox training-data provenance and any extra weights terms: not stated on the card.
- Zonos, MegaTTS3, StyleTTS2, Higgs Audio v2, CosyVoice repo licence: only partially verified; no Hindi/Nepali evidence found for any.
- XTTS CPML sentence; Fish S2 and CosyVoice3 Hindi support not checked beyond metadata.
- OmniVoice's Hindi/Nepali numbers need PDF verification; no independent Nepali listening report found.

---

## 2. Nepali specifically: is there any open, permissive route to a cloned Nepali voice?

### Takeaway
There is no proven permissive route. Three speculative open routes exist: (a) svara beta (claims Nepali, Apache card, Llama-base caveat, no metrics), (b) community Chatterbox Nepali fine-tunes (MIT tags, mostly gated, no metrics), (c) two-step generic Nepali TTS then voice conversion (all pieces exist under permissive licences, but nobody has published quality). The only published Nepali cloning quality numbers are from a 2024-25 academic transfer-learning paper (MOS 3.93 naturalness, 3.29 speaker similarity) with no confirmed released model, and OmniVoice's Nepali CER (NC weights).

### Cited Findings
- Multilingual zero-shot cloners that list Nepali: OmniVoice (`npi`, CC-BY-NC weights; FLEURS CER 3.43 vs ground truth 4.76) and ElevenLabs (hosted); Chatterbox, VoxCPM2, Qwen3-TTS, MOSS, XTTS do not list Nepali — sources in section 1; [ElevenLabs blog, 9 Oct 2025](https://elevenlabs.io/blog/voice-cloning-in-12-indian-languages-demonstrated-live-at-iit-delhi)
- svara-tts-voiceclone-beta lists `ne` (Nepali); Nepali ~55 h RASA data; no scores — [card](https://huggingface.co/kenpath/svara-tts-voiceclone-beta), [blog](https://huggingface.co/blog/kenpath/svara-tts-open-multilingual-speech-for-india)
- Community Chatterbox Nepali fine-tunes exist, created 2026: `waglesameer5/chatterbox-nepali` (MIT, only `t3_mtl_nepali_final.safetensors`, created 2026-05-22, 0 downloads, README points to a Space and asks for a "clean 5-10 second reference voice clip"); gated repos `TelvoxAI/chatterbox-nepali-tts`, `Imbatmann/chatterbox-nepali-tts`, `ayushkhadkaa/chatterbox-nepali-tts` (MIT tags, "restricted") — [waglesameer5](https://huggingface.co/waglesameer5/chatterbox-nepali), [HF search API](https://huggingface.co/api/models?search=nepali%20chatterbox&sort=downloads&limit=12)
- `Oshara/chatterbox-nepali-tts`: search listing describes a LoRA fine-tune of the Hindi multilingual Chatterbox checkpoint for Nepali Devanagari text, rank 32 / alpha 64, 24 kHz, Apache 2.0 with base weights licence retained, "primarily optimized for standard Nepali (Khas Kura)" — search-engine summary only; the page returned HTTP 401 to me (verify) — [search result](https://huggingface.co/Oshara/chatterbox-nepali-tts)
- A Nepali F5-TTS trained from scratch on Open Bible data (~20,448 utterances, 500k updates on 4 GPUs, 5-10 s reference, CC-BY-SA-4.0); evaluated with CER via Omnilingual ASR and UTMOSv2 but I retrieved no numbers — [HF card](https://huggingface.co/multilingual-tts/F5-TTS-OpenBible-Nepali), [eval repo](https://github.com/davidguzmanr/open-bible-models). A different Nepali F5 model on OSLR43 romanised is CC-BY-NC-SA-4.0 — [HF API](https://huggingface.co/api/models?search=nepali%20f5&sort=downloads&limit=12)
- Nepali Qwen3-TTS LoRA adapters (Apache-2.0): 0.6B Base + one female and one male adapter per language trained on up to 500 Rasa samples; adapters ship fixed `ref.wav` and speaker embeddings; no evaluation — [HF card](https://huggingface.co/aguken-ai/Qwen3-TTS-0.6B-LoRA-Finetuned-Indic-Multilingual)
- Academic: few-shot Nepali voice cloning (speaker encoder + Tacotron2 + WaveRNN) reports no MOS on the abstract page and no stated code release — [arXiv 2601.18694](https://arxiv.org/abs/2601.18694); a transfer-learning Nepali cloning paper reports MOS 3.93 naturalness and 3.29 speaker similarity (search summary; no release confirmed) — [nepjol](https://nepjol.info/index.php/jsce/article/view/82362); earlier work used OpenSLR with 150,000+ files up to 168 h — [arXiv 2408.10128](https://www.arxiv.org/pdf/2408.10128)
- Generic Nepali TTS voices for a two-step route: `ampixa/real-nepali-v0.2-kala` (CC-BY-SA-4.0, ONNX, VITS/Piper tags, multi-speaker, CPU, created 2026-05-04, 2.5k downloads), `multilingual-tts/VITS-OpenBible-Nepali` (CC-BY-SA-4.0), `Dragneel/nepali-vits2-tts` (MIT, 11 downloads) — [HF API search](https://huggingface.co/api/models?search=nepali%20tts&sort=downloads&limit=12), [Kala](https://huggingface.co/api/models/ampixa/real-nepali-v0.2-kala)
- Voice-conversion components: Chatterbox ships VC (`example_vc.py`, MIT); OpenVoice tone-colour converter (MIT) claims cross-lingual use; kNN-VC (MIT) wants up to ~5 min of reference; RVC/Applio (MIT); Seed-VC is GPL-3.0 — sources in section 1. No published evaluation of any of them on Nepali was found.
- Hindi model reading Nepali text: no evidence found either way. Community Nepali Chatterbox work starts from the Hindi checkpoint (Oshara card, via search summary), which shows the community treats Hindi as the nearest base, not that it works zero-shot.
- Fine-tuning data scale for adjacent cases: VoxCPM2 LoRA "5-10 minutes of audio" (no Nepali base); Chatterbox Indic LoRA used 7-52 h per language — [VoxCPM2](https://huggingface.co/openbmb/VoxCPM2), [Indic LoRA](https://huggingface.co/reenigne314/chatterbox-indic-lora)

### Inferences
- Proven: Nepali zero-shot cloning is technically achievable (OmniVoice CER; ElevenLabs hosts it). Proven permissive: nothing. Speculative: svara beta, Chatterbox Nepali LoRAs, two-step TTS+VC, per-user fine-tune.
- Two-step route licence chain is clean only if the Nepali TTS is permissive; Kala and the Open Bible VITS are CC-BY-SA-4.0 (share-alike on model, a flag; whether it extends to generated audio is a legal question to verify), only `Dragneel/nepali-vits2-tts` is MIT and is very young.
- A per-user fine-tune on a beginner's own few minutes of Nepali audio is not realistic for V1: no source shows it working, and it needs GPU time the user may not have.

### Gaps
- No Nepali MOS, speaker-similarity or CER for svara, any Chatterbox Nepali LoRA, Kala-plus-VC, or OpenVoice on Nepali.
- Oshara card and gated Chatterbox-Nepali repos unread; Open Bible Nepali metric values not retrieved.
- Whether the two Nepali papers released code or weights.
- Reference audio needed for RVC per-voice training (commonly cited ~10 min, not verified here).

---

## 3. Hosted / free routes with the user's own accounts

### Takeaway
ElevenLabs Instant Voice Cloning (supports Nepali and Hindi cloning per its blog) is not on the Free plan; it starts at Starter ($6/month). Azure and Google custom voice are gated for enterprise customers or allow-lists. Hugging Face Spaces ZeroGPU and Colab are quota-limited and Colab's FAQ bars serving a third-party app. For V1, the "hosted free route" is effectively unavailable for cloning.

### Cited Findings
- ElevenLabs Free plan features list (TTS, STT, SFX, Voice Design, Music, 10,000 credits/month) does not include Instant Voice Cloning; IVC first appears on Starter ($6/month), Professional Voice Cloning on Creator ($22/month); Commercial licence is a Starter addition — [pricing page](https://elevenlabs.io/pricing)
- ElevenLabs (9 Oct 2025): "Record yourself for 30 seconds to generate an Instant Voice Clone"; Pro clone needs 10+ minutes; cloning offered in Hindi, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Nepali, Punjabi, Sindhi, Tamil, Telugu; blog states no consent mechanism — [blog](https://elevenlabs.io/blog/voice-cloning-in-12-indian-languages-demonstrated-live-at-iit-delhi). A search summary says the multilingual-model page lists 32 languages for cloned voices without Nepali (not confirmed on the page; verify).
- Azure: "custom neural voice is a Limited Access feature available by registration only"; "Only customers managed by Microsoft, meaning those who are working directly with Microsoft account teams, are eligible"; Personal voice "requires registration and approval"; Microsoft "reserves the right to use Microsoft's speaker recognition biometric identification technology on this recorded acknowledgement statement and verify it against the training audio data" and "will also continue to retain this recorded acknowledgement statement file and the custom voice model" — [Microsoft Learn, updated 2026-08-26](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/limited-access)
- Google Chirp 3 Instant Custom Voice: "Access to Instant Custom Voice is restricted to allow-listed users" (contact sales); hi-IN supported with its own consent statement; ne-NP not supported; consent clip single-channel up to 10 s; "You can't use a custom consent script instead of the default." — [Google Cloud docs](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice)
- HF ZeroGPU: free for all users, Gradio SDK only, free personal accounts (verified email, 30+ days) can host up to 2 ZeroGPU Spaces; PRO gets 8x quota — [HF docs](https://huggingface.co/docs/hub/spaces-zerogpu.md). A search summary of the docs gives free-account quota as 3.5 min/day (forum says 5; a staff reply in April 2026 mentioned three runs/day) — [forum thread](https://discuss.huggingface.co/t/what-is-the-free-zerogpu-quota-for-1-space/178610) (verify)
- Colab FAQ: "file hosting, media serving, or other web service offerings not related to interactive compute with Colab" are disallowed; "connecting to remote proxies" prohibited; free tier prohibits "bypassing the notebook UI to interact primarily via a web UI"; "dynamic usage limits that sometimes fluctuate" — [Colab FAQ](https://research.google.com/colaboratory/faq.html)
- Resemble: first voice clone free then $2 each (changelog 8 May 2026); Personal tier 1,000 free seconds/month; Hindi support not confirmed in sources found — [changelog](https://www.resemble.ai/changelogs/voice-cloning-pricing-first-clone-free-then-2-each-2026), [plans](https://knowledge.resemble.ai/what-are-the-plans-whats-included)
- PlayHT/PlayAI: acquired by Meta July 2025, platform reported shut down 31 Dec 2025 (secondary sources) — [aiwiki](https://aiwiki.ai/wiki/play_ht)
- Sarvam Bulbul V3: hosted API, ₹30 per 10,000 characters (beta, Aug 2026 third-party), no open weights found, Nepali not named, sources conflict on self-serve cloning — [YourStory](https://yourstory.com/ai-story/sarvam-ai-bulbul-v3), [Sarvam](https://www.sarvam.ai/tts-v2)
- Privacy: uploading a voice sample to a hosted service is biometric data; Microsoft's terms put the burden on the customer to give notice, get consent and delete — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/limited-access)

### Inferences
- Introcut cannot run a free shared backend: Colab prohibits it, ZeroGPU quotas are minutes per day per viewer account, and any shared Space would put users' voice samples on a server (conflicts with "media stays on device").
- A "bring your own ElevenLabs key" opt-in is feasible for users who already pay for Starter, but is not zero-cost for them, and ElevenLabs Nepali quality is unverified by me.

### Gaps
- ElevenLabs ToS wording on consent/verification for IVC, and whether the multilingual model officially includes Nepali.
- Kaggle terms not researched. Resemble Hindi cloning, Resemble consent flow not confirmed.
- ZeroGPU free quota number is secondhand.

---

## 4. Safe consent design, watermarking, labelling, legal risk

### Takeaway
A local consent flow is feasible with permissive components (random phrase read aloud, ASR check, speaker-embedding match with WeSpeaker/ECAPA/Resemblyzer, Apache-2.0), but embedding match only proves that the same voice read the phrase and the sample; replay and zero-shot clones can pass it, so it must be paired with an explicit attestation, local evidence log, AI label and watermark. Watermarking tools (AudioSeal, Perth) are MIT.

### Cited Findings
- Industry pattern: Microsoft requires a recorded pre-defined statement from the voice talent and verifies it against training audio by speaker recognition; Google requires a fixed per-language consent script, up to 10 s, recorded in the same environment as the reference audio — [Microsoft](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/limited-access), [Google](https://docs.cloud.google.com/text-to-speech/docs/chirp3-instant-custom-voice)
- Speaker-embedding models: SpeechBrain ECAPA-TDNN `spkrec-ecapa-voxceleb` is Apache-2.0 but "trained on Voxceleb 1+ Voxceleb2 training data" (VoxCeleb dataset terms: verify) — [HF card](https://huggingface.co/speechbrain/spkrec-ecapa-voxceleb/raw/main/README.md); `Wespeaker/wespeaker-voxceleb-resnet34` Apache-2.0 — [HF API](https://huggingface.co/api/models/Wespeaker/wespeaker-voxceleb-resnet34); Resemblyzer Apache-2.0 but last pushed 2023-10-12 — [GitHub API](https://api.github.com/repos/resemble-ai/Resemblyzer)
- Limits of verification: a study found that with real clips ECAPA-TDNN, ESPnet and Resemblyzer were 100% accurate but "the introduction of cloned voices changed the results" (F5-TTS v1 clones); a survey found "the advancement of spoofing attacks far outpaces that of ASV systems"; replay attacks are described as the biggest practical threat — [arXiv 2601.02914](https://arxiv.org/pdf/2601.02914) and search summary of related papers (verify)
- Watermarks: AudioSeal "updated our license to full MIT license (including the license for the model weights)" — [README](https://raw.githubusercontent.com/facebookresearch/audioseal/main/README.md); HF tag MIT — [HF API](https://huggingface.co/api/models/facebook/audioseal); Perth MIT — [GitHub API](https://api.github.com/repos/resemble-ai/Perth); VibeVoice embeds an audible disclaimer and watermark — [card](https://huggingface.co/microsoft/VibeVoice-1.5B). Chatterbox watermarks by default (section 1).
- Model-side terms already forbid impersonation: VoxCPM2 ("Strictly forbidden ... AI-generated content should be clearly labeled"), OmniVoice disclaimer, svara "Impersonating private individuals without consent", VibeVoice — cards above.
- India: IT Amendment Rules notified 10 Feb 2026, in force 20 Feb 2026; "synthetically generated information" covers audio "artificially or algorithmically created, generated, modified or altered ... in a manner that makes it appear real"; non-prohibited SGI "must be clearly and prominently labelled", audio needs "audio disclosures"; where feasible intermediaries embed "permanent metadata or unique identifiers" and "must not allow the removal or modification of labels or metadata"; intermediaries offering generative capability must use "reasonable and appropriate technical measures" against unlawful content incl. deceptive depictions of people; takedown 2 h (impersonation, morphed images, etc.) or 3 h (court/government orders); non-compliance risks losing safe harbour; routine editing, transcription, compression excluded — [Freshfields](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/india-targets-deepfakes-and-ai-generated-content-key-changes-under-meitys-2026-102mjwn); gazette text not checked — [secondary explainers](https://blog.ipleaders.in/it-rules-2026/)
- India personality rights: Bombay High Court orders for Arijit Singh (2024, described as first AI voice-cloning injunction) and Asha Bhosle; Delhi High Court injunctions covering voice for Aishwarya Rai Bachchan (2025), Sri Sri Ravi Shankar (2025), Allu Arjun (Apr 2026), Jubin Nautiyal (2026); "no Indian statute names the voice as something a person owns" (2025 paper) — [iPleaders](https://blog.ipleaders.in/personality-rights-in-india/), [OECD.AI](https://oecd.ai/en/incidents/2026-04-21-9f02), [WIPO Magazine](https://www.wipo.int/en/web/wipo-magazine/articles/ai-voice-cloning-how-a-bollywood-veteran-set-a-legal-precedent-73631); 2026 entries rest on a single secondary table (verify)
- Nepal: Electronic Transactions Act 2063 is the foundational cyber law and is described as not built for AI; Individual Privacy Act 2075 requires informed consent for personal data processing; no source found applying it to deepfakes; a bill to regulate AI/deepfakes is reported pending (status unconfirmed); no personality-rights source found — [Kathmandu Post](https://kathmandupost.com/editorial/2025/01/07/not-ready-for-ai), [asianews](https://asianews.network/can-ai-fake-a-nepali-voice-convincingly-heres-what-the-experts-say/), [ungovr summary](https://law.ungovr.org/ai/np)
- EU: AI Act Article 50 transparency applies from 2 Aug 2026; the Digital Omnibus gave existing systems until 2 Dec 2026 for the machine-readable marking duty in Art. 50(2); adoption dates differ between sources — [CSA note, 29 Jul 2026](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-article-50-transparency-20260729/), [Pillitteri summary](https://pasqualepillitteri.it/en/news/5190/digital-omnibus-ai-act-eu-parliament) (verify against Official Journal)

### Inferences
- Recommended consent flow: (1) show a random sentence in the target language (English/Hindi/Nepali) plus a fixed statement "I am recording my own voice and consent to a clone"; (2) transcribe locally with the existing ASR to confirm the phrase was read; (3) embed consent clip and the sample with an Apache-2.0 speaker model and require similarity above a threshold calibrated on volunteers; (4) store locally a signed record (timestamp, phrase, both embeddings or hashes, similarity score, user attestation) with the project; (5) refuse to proceed on mismatch but treat the match as a speed bump, not proof.
- Do not claim detection of other people's audio: replayed or cloned audio can pass embedding checks; the honest control is attestation plus labelling plus watermark, and a warning that India's rules put visible audio disclosure and non-removal of marks on the platform side while Introcut is a tool that creates SGI.
- Keep Chatterbox's Perth mark and add an Introcut-side AudioSeal mark (MIT incl. weights) plus an audible/visual AI label at export; never offer removal.
- Introcut would plausibly count as a tool that lets users create synthetic audio, so India's labelling and "permanent metadata where feasible" duties are a design requirement, not just a courtesy (legal reading, needs counsel).

### Gaps
- Official gazette text of the India rules and exact audio-label wording; Nepal personality rights; whether a locally run open-source tool is an "intermediary" under Indian law.
- VoxCeleb-trained models' dataset licence for commercial redistribution; browser-ready (ONNX) speaker embedding model and its licence for sherpa-onnx not verified.
- No test of ASR-plus-embedding pipeline false-reject rates on Nepali/Hindi speech.

---

## 5. Practical integration: sidecar vs browser, sizes, hardware

### Takeaway
Only Chatterbox has a published browser (ONNX) build (about 1.55 GB at q4, 23 languages, no Nepali) and a CPU-capable English variant (Nano 110M). Every other candidate is a Python/PyTorch (or GGUF) desktop sidecar of several GB. An 8 GB-RAM integrated-GPU laptop is documented for none of the multilingual cloners; an RTX 3050-class GPU is plausible for VoxCPM2 (~8 GB stated) and Chatterbox but unmeasured.

### Cited Findings
- Chatterbox ONNX (MIT) sizes: language model q4 353.6 MB, fp16 1,040 MB, fp32-ish 2,081 MB; conditional decoder 534 MB; speech encoder 591 MB; embed tokens 68 MB — [HF tree API](https://huggingface.co/api/models/onnx-community/chatterbox-multilingual-ONNX/tree/main?recursive=true). Turbo and Nano ONNX ports also exist (`ResembleAI/chatterbox-turbo-ONNX`, `owensong/chatterbox-nano-ONNX`) — [HF search API](https://huggingface.co/api/models?search=chatterbox%20onnx&limit=8&sort=downloads)
- Chatterbox-Nano: "running 3x faster than realtime on 8 CPU cores", English only — [README](https://raw.githubusercontent.com/resemble-ai/chatterbox/master/README.md)
- VoxCPM2: ~8 GB VRAM, RTF ~0.30 on RTX 4090, GGUF CPU path via llama.cpp-omni — [HF card](https://huggingface.co/openbmb/VoxCPM2), [README](https://raw.githubusercontent.com/OpenBMB/VoxCPM/main/README.md)
- svara voice-clone beta: 6.62 GB weights; GGUF and vLLM compatibility claimed — [HF API](https://huggingface.co/api/models/kenpath/svara-tts-voiceclone-beta), [card](https://huggingface.co/kenpath/svara-tts-voiceclone-beta)
- OmniVoice requires pip install and CUDA PyTorch or Apple Silicon (NVIDIA GPU or Apple Silicon only in docs); RTF 0.032 on an H20, so 5-10x slower on a laptop GPU is plausible but unmeasured — [HF card](https://huggingface.co/k2-fsa/OmniVoice)
- F5-TTS ONNX community ports exist but are unofficial and mixed-licence (Apache-tagged ports of NC weights) — [HF search API](https://huggingface.co/api/models?search=f5-tts%20onnx&limit=5&sort=downloads)
- MOSS-TTS v1.5 is 8.49B parameters BF16 — [HF API](https://huggingface.co/api/models/OpenMOSS-Team/MOSS-TTS-v1.5)

### Inferences
- A sidecar (small Python or llama.cpp process started by a Windows desktop shell) is needed for Hindi cloning; the PyTorch + CUDA wheel set alone is multiple GB, so first-run download will likely be 3-8 GB for any non-Nano model (estimate from file sizes above).
- A pure-browser V1 can offer English cloning (Nano/Turbo ONNX) with WebGPU/WASM; Hindi cloning in-browser via the 1.55 GB multilingual ONNX is possible on paper but WebGPU speed and Hindi quality in that port are unmeasured.
- 8 GB RAM / integrated GPU: only Chatterbox-Nano (English) has a documented CPU speed; anything 2B+ should be treated as "needs a discrete GPU or very slow" until measured. Laptop RTX 3050 VRAM varies (4-8 GB), so VoxCPM2's "~8 GB" may not fit (verify).

### Gaps
- No measured RTF for any Hindi-capable cloner on CPU, integrated GPU, or RTX 3050; no WebGPU benchmark for the Chatterbox multilingual ONNX; Windows installer size for a PyTorch sidecar not measured.

---

## 6. Verdict for V1

### Takeaway
Offer one clone route first: English voice clone using Chatterbox (MIT code and weights, built-in watermark), delivered as an optional local sidecar or Nano/Turbo ONNX in-browser, with a mandatory consent step. Add Hindi as "experimental" only after a short listening test of Chatterbox Multilingual-hi versus VoxCPM2 and svara beta. Do not promise a Nepali clone in V1; keep Nepali narration on the existing record-your-own-voice path and run Nepali clone candidates as a lab-flagged spike.

### Cited Findings
- Chatterbox: MIT code (27k stars, active), MIT weights tag, Hindi in the 23 languages, no Nepali, watermarking on by default — [HF card](https://huggingface.co/ResembleAI/chatterbox), [GitHub API](https://api.github.com/repos/resemble-ai/chatterbox)
- Hindi evidence is limited to open issues, a community-LoRA CER of 0.1058, and VoxCPM2's Hindi WER 19.699 with SIM 85.6; OmniVoice's Hindi WER 4.33 is excluded for NC weights — sections 1 and 2 sources.
- Nepali: no permissive, evidenced route; sources in section 2.
- Hosted clone routes are paid or gated (ElevenLabs Starter, Azure Limited Access, Google allow-list) — section 3 sources.
- The licence quotes for every recommended component: Chatterbox `License: mit` ([HF](https://huggingface.co/ResembleAI/chatterbox)); VoxCPM2 "Released under the Apache-2.0 license, free for commercial use" ([HF](https://huggingface.co/openbmb/VoxCPM2)); svara "License: Apache-2.0" ([HF](https://huggingface.co/kenpath/svara-tts-voiceclone-beta)); AudioSeal "full MIT license (including the license for the model weights)" ([README](https://raw.githubusercontent.com/facebookresearch/audioseal/main/README.md)); OpenVoice "released under MIT License. Free for commercial use." ([README](https://raw.githubusercontent.com/myshell-ai/OpenVoice/main/README.md)).

### Inferences
- **Languages and promise.** English: "clones your timbre and pace from a 10-30 s clip, quality varies with your recording". Hindi: "experimental; check the preview; accent and word errors possible". Nepali: "no cloned voice yet; record your own voice or use a built-in voice"; never claim a Nepali clone sounds good until a listening test supports it.
- **Order of work.** (1) Consent flow + local evidence log + AI label + watermark (works regardless of model). (2) Chatterbox English via sidecar or ONNX. (3) 1-2 day bake-off for Hindi on 3 volunteer voices, measuring Whisper-based CER and a WeSpeaker similarity score, comparing Chatterbox-Multilingual-hi, VoxCPM2, svara beta (and OmniVoice only as a non-shipped reference). (4) Nepali spike with svara beta and `waglesameer5/chatterbox-nepali`, gated behind a "lab" flag and the same bake-off; ship only if listeners rate it acceptable.
- **Defer.** Per-user fine-tuning (data and GPU needs, no evidence for Nepali); two-step TTS + voice-conversion for Nepali (no published quality; CC-BY-SA TTS voices); OmniVoice, F5-TTS, Fish, Spark, MaskGCT (non-commercial); Seed-VC (GPL-3.0); XTTS (CPML); IndexTTS-2 and Higgs (custom licences); hosted ElevenLabs/Azure/Google integration; PVC.
- **Licence housekeeping if svara is used.** Treat the Llama-3.2 base as a likely extra licence and verify before bundling; also verify SYSPIN/SPICOR/IndicTTS data terms. Add every chosen model to `CREDITS.md` with its licence in the same change (project rule).
- **Desktop vs hosted.** The owner's Windows-desktop idea fits the sidecar requirement; the "hosted free route" does not exist at zero cost for cloning with privacy intact (Colab bans serving; ZeroGPU is minutes per day; hosted services paid).

### Gaps
- All Nepali quality claims remain unverified by listening; all hardware claims for the target laptops remain unmeasured; Chatterbox training-data provenance and svara's Llama-base terms need checking before shipping.
