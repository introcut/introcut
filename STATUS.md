# Status

_Last updated: 2026-10-19. Update this file whenever something changes._

## Where we are
Planning is done. **Milestones 1 (editor shell) and 2 (project core) are built.** Next: Milestone 3 (brain + brief).

Run it: `npm install` then `npm run dev` and open http://localhost:5173 (Chrome or Edge). Unit tests: `npm test`.

**UI v3 "Editorial" is built (awaiting the owner's approval of how it looks and feels).** Design rationale and the feature-to-screen map are in `docs/UX.md`; the look is chosen in `docs/ux/styles.html` (option A).
- Screens (`src/ui/`): `StartScreen` (the one question, saved to `project.brief.idea` via the new `setIdea` op), `VerdictScreen` (honest "not built yet" until M3), `BoardScreen` (scene cards, a Next banner worked out from real state, drag to reorder), `TimelineScreen` (dark preview stage, scene inspector, timeline). Secondary things are side sheets (`Sheets.tsx`): scene, Media (the old media bin + recorder), Export (project file only; video export is M12), Settings (new project, clear data, JSON view).
- View state (`uiStore.ts`: view, sheet, rail) is separate from the project store. The rail is collapsed to icons by default. Re-skinning = edit tokens in `src/theme.css`.
- Deliberately not shown because not built: Look, Sound, chat/command bar, idea verdict. They arrive with M3–M8 (see `docs/UX.md`).
- Not designed yet: presenter-mode board, clips-only board, mobile, empty/error states for later milestones.
- Verified: 30 unit tests, build, and a 50-check headless-browser run of the new UI (`ui.mjs`, outside the repo) covering Start → Verdict → Board, trim/locks/undo/AI-refusal, reorder by buttons and drag on both the board and the timeline, delete/replace, scene sheet, reload persistence, recorded clip, project export/clear/import/re-link, bad import.
- **Start is now a chat-style composer** (owner feedback): one prompt box, a + menu to attach photos/clips/audio (or open the recorders), attached files as chips, Enter to send. Removed: the save-status line under Settings, the "Already have something?" links, the "What do these numbers mean?" box. Opening a saved project file now lives only in Export. The `ui.mjs` browser check still targets the old Start screen and needs updating before it is used again; unit tests (30) and typecheck pass.
- The earlier SelfGlance restyle (`3ec88f8`) and the dashboard prototypes are replaced.

**(Superseded) UI restyle, step 1**
- `src/theme.css` is the SelfGlance "soft neo-brutalism" theme, copied unchanged and imported once in `main.tsx`; `src/styles.css` holds only Introcut layout and pieces built from its tokens. Light/dark follow the OS; the sidebar toggle (`ui/ThemeToggle.tsx`, `ui/theme.ts`) forces one and remembers it in `localStorage` (optional, never required).
- Done: app shell (sidebar with brand, grouped nav, media bin, theme toggle and save card; page header with the toolbar), the preview card, timeline as a card with the selected scene in yellow, interim card look for the other panels, buttons/inputs/chips on tokens. No behaviour or data changed (29 unit tests, M1 17/17 and M2 40/40 browser checks pass; the M2 check now ignores the heading's upper-casing).
- Step 2 (after approval): restyle media items, inspector, recorder and JSON panel as proper cards/tiles/chips; bento tiles for scene facts.
- Known: "Brief / Direction / Analyze" in the sidebar are disabled placeholders for later milestones. Narrow screens (<900 px) just stack the sidebar above the page; a real mobile layout is not designed yet. Canvas frame colors (black letterbox, demo cards) are video content, not UI.

**Milestone 2 notes for the next person**
- **The contract:** `src/model/schema.ts` is the full v2 project schema (Zod, every field has a default). `src/model/ops.ts` is the ONLY way to change a project: `applyOp(project, op, actor)` with `actor` = `"user"` or `"ai"`. Never mutate a project directly. Add new ops there (and tests).
- **Locks:** a user trim/move sets a lock on that scene; an `"ai"` op on a locked field is refused (`reason` says why). Only the user can change locks. The store's `dispatch(op, { actor, coalesce })` records undo steps; `coalesce` merges rapid edits (slider drags) into one step. `dispatchMany` = one undo step for several ops.
- **Saving:** `src/storage/opfs.ts` keeps `project.json`, `media/<id>` and `thumbs/<id>.txt` in the browser's private file system (OPFS). `autosave.ts` writes 500 ms after each change and when the tab is hidden. Orphaned files are cleaned up on load/replace only (so undo never loses a file within a session).
- **Import/export:** export is the project JSON only (no media). Importing flags media without files as *missing*; dropping the original files re-links them by name + size.
- Undo history is **not** saved across reloads (by design for now).
- One project at a time; an "open recent" list is not built yet (A1 in the feature list is partly done: new / import / auto-save).
- Not built in M2 (belongs to M5): "redo this scene" and the chat box.
- `Player.ts` keeps `<video>` elements for media of removed/replaced projects until the tab closes (small leak, to be replaced by the shared renderer in M9).
- Verified: 29 unit tests (schema, ops, locks, history, repair) + a 39-check headless-browser run (trim, lock chip, coalesced undo, AI refused on locked scene, reorder by button and drag, delete, replace, reload persistence incl. a recorded clip, export, clear, import, re-link, bad file). The browser tests live outside the repo for now; adding them to CI is planned for M13.

**Milestone 1 notes for the next person**
- `src/model/types.ts` is a *subset* of the schema in `docs/PLAN.md` §5. M2 replaces it with the full Zod schema + ops.
- `src/render/Player.ts` plays scenes back to back with `<video>`/`<img>` elements drawn center-cropped to a canvas. M9 turns this into the shared `renderFrame` used for export.
- Recordings (screen/selfie/voice) are WebM from `MediaRecorder`; they have no stored length, so `probe.ts` forces the browser to discover it. Mediabunny (M2/M12) will read real container info and remux.
- Audio "loudness" is an average dBFS measured by decoding in memory (files over 300 MB are skipped). True LUFS comes with M6. `fps` is not probed yet (needs Mediabunny).
- "No audio" for a video can also mean an audio codec the browser can't decode; Mediabunny will make this exact.
- Verified with a headless-browser test (16 checks: demo load, scene click/seek, playback, selfie recording with a fake camera, probing, JSON view). Real screen recording and real camera were not tested headlessly.

## Milestones
| M | Name | Owner | Status |
|---|---|---|---|
| 0 | Repo, CI, schema contract, interfaces | _unassigned_ | todo |
| 1 | Editor shell (upload + record, media bin, 9:16 preview, timeline) | Bashanta (with Claude) | **done** (needs your manual test: real screen recording and your own clips) |
| 2 | Project core (schema, ops, undo, locks, OPFS, import/export) | Bashanta (with Claude) | **done** (needs your manual test, see steps in chat) |
| 3 | Brain + brief (LLM provider, readiness, format, script, shot list) | _unassigned_ | todo |
| 4 | Direction desk (generator registry, prompts, tracker) | _unassigned_ | todo |
| 5 | Analyze & Decide engine | _unassigned_ | todo |
| 6 | Audio-first (timing, voices, alignment, leveling) | _unassigned_ | todo |
| 7 | Captions | _unassigned_ | todo |
| 8 | Sound (SFX, ambience, music, ducking) | _unassigned_ | todo |
| 9 | Gap fillers + finishing + retention check | _unassigned_ | todo |
| 10 | Presenter mode | _unassigned_ | todo |
| 11 | Avatar + voice clone | _unassigned_ | todo |
| 12 | Export | _unassigned_ | todo |
| 13 | Ship (PWA, deploy, license audit) | _unassigned_ | todo |

## Risk gates (go/no-go tests)
| Gate | Question | Result |
|---|---|---|
| G1 | Does Veo speak clear, lip-synced Nepali from a prompt? Watermark? | **pending** (owner runs the test prompt in Flow) |
| G2 | Can a local LLM write usable Nepali/Hindi scripts? | pending |
| G3 | Best way to align known script text to Nepali audio (caption timing)? | pending |
| G4 | Nepali TTS: quality and license | pending |
| G5 | Avatar on a free Hugging Face Space (MuseTalk): feasible? license? | pending |
| G6 | CLAP in the browser + sound-effect corpus license | pending |
| G7 | Veo reference images on free tier + rules for using own face | pending |

## Open decisions
- Defaults applied unless changed: own renderer instead of Remotion; Mediabunny (MPL-2.0) accepted.
- Role assignment (A Studio / B Brain) once a second contributor joins.

## Blocked / notes
- Nothing blocked.
