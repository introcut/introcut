# Status

_Last updated: 2026-10-19. Update this file whenever something changes._

## Where we are
Planning is done and **Milestone 1 (editor shell) is built**. Next: Milestone 2 (project core).

Run it: `npm install` then `npm run dev` and open http://localhost:5173 (Chrome or Edge).

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
| 2 | Project core (schema, ops, undo, locks, OPFS, import/export) | _unassigned_ | todo |
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
