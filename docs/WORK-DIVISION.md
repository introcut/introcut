# Introcut — Work Division (two people)

Split by **type of work**, not by milestone, so both of you can build in parallel. Roles are **Person A: Studio** and **Person B: Brain**. Swap them if skills fit the other way round.

- **Studio (A):** everything you see and hear. UI, video and audio handling, rendering, export.
- **Brain (B):** everything that thinks. AI models, analysis, planning, registry, avatar.
- **Contract (shared):** the project JSON schema (`PLAN.md` §5) and edit operations. Both depend on it, so both own it.

## 1. Ownership by folder

| Folder | Owner | Notes |
|---|---|---|
| `src/model/` (schema, ops, timeline) | **Shared** | Change only by PR approved by both |
| `src/store/`, `src/storage/` | A | Undo, locks, OPFS, import/export |
| `src/render/`, `src/media/`, `src/audio/mix|ducking|normalize` | A | Renderer, recording, decode, mixing |
| `src/export/` | A | MP4, metadata UI |
| `src/ui/` shell, Preview, Timeline, SceneInspector, CaptionEditor, Presenter | A | |
| `src/ai/` (llm, brief, readiness, format, script, prompts, tools, match, align, tts, sfx) | B | |
| `src/registry/` (generators, formats) | B | Research content, JSON files |
| `src/avatar/` | B | HF Space, consent logic |
| `src/ui/` Brief, Readiness, ShotList, PromptCard, Tracker, DiagnosisCards, ChatBox | B | Panels plug into A's shell slots |
| `public/music`, `public/sfx`, `CREDITS.md` | A curates, B reviews licenses | |
| `fixtures/` (sample project JSONs) | Shared | Lets each side work without the other |

## 2. Who builds which features

| Feature group | A (Studio) | B (Brain) |
|---|---|---|
| **A. Start and brief** | A1 project home, A3 recording, A4 media bin + probe | A2 idea intake UI, A5 entry-point logic |
| **B. Judgement** | | B1–B3 (all) |
| **C. Direction** | | C1–C8 (all). A provides the panel slots |
| **D. Analyze and decide** | Measured facts: loudness, motion, blur, logo detection (D2 measured part) | D1, D2 estimated part, D3–D7, action cards |
| **E. Sound** | E1 timing, E3 DSP leveling, E6 mix, music, ducking, E4 caption rendering | E2 voices (TTS, clone hook), E3 drift detection, E4 alignment, E5 SFX retrieval |
| **F. Edit and finish** | F1–F3, F5 fillers, F6 finishing, F7 retention (UI + render) | F4 chat commands, F7 retention logic |
| **G. Presenter** | G1 layouts, G2 screen smart edit, G3 avatar slot UI | G4 avatar maker, G5 voice clone |
| **H. Output** | H1, H2 UI, H3, H6 PWA/deploy | H4 settings (AI part), H5 notices |

## 3. Milestone ownership

| M | Name | Lead | Support |
|---|---|---|---|
| 0 | Repo, CI, schema contract, interfaces | **Both together** | |
| 1 | Editor shell | A | B reviews |
| 2 | Project core | A (store, OPFS) | B reviews ops |
| 3 | Brain + brief | B | A: shell slots |
| 4 | Direction desk | B | A: copy/open UI polish |
| 5 | Analyze & Decide | B (engine), A (measured probes) | |
| 6 | Audio-first | Split: B voices + alignment, A timing + DSP | |
| 7 | Captions | A (renderer, editor) | B: aligned words |
| 8 | Sound | B (SFX retrieval), A (placement, mix, music) | |
| 9 | Gap fillers + finishing | A | B: retention logic |
| 10 | Presenter | A | B: avatar slot data |
| 11 | Avatar + clone | B | A: consent recording UI |
| 12 | Export | A | |
| 13 | Ship | Both | |

## 4. Order of work

1. **Phase 0, together:** git repo, CI (typecheck + lint + tests), fill in the schema and the three interfaces below, create `fixtures/`, start gate G1 (your Veo Nepali test).
2. **Phase 1, parallel:** A builds M1–M2. B builds M3 and runs G2.
3. **Phase 2, parallel:** A builds M7 with fixtures and the renderer. B builds M4–M5 and runs G3, G6.
4. **Phase 3, parallel:** A builds M9 and M6/M8 DSP. B builds M6/M8 ML and G4.
5. **Phase 4, parallel:** A builds M10 and M12. B builds M11 and G5.
6. **Phase 5, together:** M13, then the three "done" runs from `V1-FEATURES.md` §4.

First end-to-end generated-mode run is possible once M5 (B) and M9 (A) both land.

## 5. The three interfaces to agree on in Phase 0

1. **`ProjectSchema` + `ops`:** the JSON shape and the only legal ways to change it.
2. **`Analyzer`:** `(media, plan?) → Evidence` (A produces measured facts, B adds estimated facts).
3. **`LlmProvider` and `Planner`:** `(evidence, plan, locks) → Action[]` (B only, but A consumes the actions through `ops`).

A and B work against `fixtures/*.json` until the real parts exist.

## 6. Rules for working together

- `main` is protected. Work on branches (`a/…`, `b/…`), open a PR, the **other person reviews**.
- Never edit the other's folder directly; open an issue or a PR.
- One commit per finished feature, plain messages (e.g. "Add caption editor").
- Every new library: add it to `CREDITS.md` with its license in the same PR.
- 15-minute check-in at the start of each phase: what's next, what's blocked.

## 7. Non-code tasks

| Task | Owner |
|---|---|
| Generator registry research and "last verified" updates | B |
| Format library JSON (6 starters, then more) | B |
| CC0 music and SFX selection, license check | A |
| Gate tests with native Nepali/Hindi speakers | Both, whoever has the contacts |
| G1 and G7 manual tests (Veo prompts) | You (product owner) |
| Name, logo, landing text, README | Shared |

## 8. If one of you has less time

B's work is front-loaded with research and risk, A's with steady build work. If hours are uneven, the person with more time takes A and we move M7, M12 and M13 UI items to the other side. Tell me the hours and I'll rebalance this table.
