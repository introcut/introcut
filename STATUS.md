# Status

_Last updated: 2026-10-19. Update this file whenever something changes._

## Where we are
Planning is done. No application code yet. Next step is Milestone 0/1.

## Milestones
| M | Name | Owner | Status |
|---|---|---|---|
| 0 | Repo, CI, schema contract, interfaces | _unassigned_ | todo |
| 1 | Editor shell (upload + record, media bin, 9:16 preview, timeline) | _unassigned_ | todo |
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
