# Introcut UX (proposal v3, awaiting approval)

Clickable mock: open `docs/ux/prototype.html` in a browser (mock data, nothing is saved). The links at the bottom jump between screens.

Derived from `docs/V1-FEATURES.md`. Accounts and cloud sync are **not in V1**, so there is no sign-in.

## What was wrong with v1 and v2
v1 was an editor (bin, preview, timeline). v2 was a dashboard that put every feature on screen at once: crowded, and dark with a neon accent, the same look as existing AI-video tools. Neither felt like Introcut.

## The idea of v3: calm, one thing at a time
1. **A conversation with a director, not a control panel.** Each screen asks one question or shows one decision.
2. **The scene is the unit.** The project's home is the **Board**: the scenes as vertical cards, left to right, each with a plain status (Ready / Next / Check / Later). Everything about a scene (line, prompt, clip, diagnosis, trim) lives in that scene's **sheet**, which slides in on demand and closes again.
3. **"Next" is always stated.** One line at the top of the Board says the single best next action, with a button.
4. **Detail on request.** Scores, evidence, extra tracks, last-frame tools and so on sit behind "See more" links. A beginner sees little; a power user can open everything.
5. **Chat is a command bar** at the bottom, not a permanent panel. Suggestions appear as two chips.
6. **Introcut proposes, the person decides.** Findings are cards with a primary action and "keep mine". Edited things are locked and Introcut says when it left one alone.

## Screens (7 in the mock)
| Screen | Purpose |
|---|---|
| Start | One big question ("What's your short about?"). Quiet links for "my clips / a screen recording / photos". Recent projects with one-line status ("2 clips waiting on you"). |
| Verdict | Introcut's honest take in two sentences, one risk, one safer plan, the chosen story format. "See the full score" expands the four scores. |
| Board | Scene cards, Next banner, command bar. Top bar: Board / Timeline switch, **Look**, **Sound**, undo, **Export**. |
| Scene sheet | Adapts to the scene: no clip yet shows the prompt and drop zone; a clip present shows the diagnosis and one-click fixes. |
| Timeline | Large dark preview stage, trim for the selected scene, one-click gap fix, two tracks; "Show all tracks" adds captions, effects, music. |
| Look / Sound sheets | Style bible; voice per scene, captions, effects, music, level matching. Few toggles each. |
| Export sheet | One last check, title, AI-label reminder, Export MP4 / quick draft. |

Side bar: **collapsed to icons by default** (Projects, Media, Settings), expands with the menu button.

## Where each V1 feature lives
| Features | Place |
|---|---|
| A1 home, import | Start (recent list) + side bar Projects |
| A2 intake, A5 any starting point | Start; the extra options (audience, feeling, length) appear after the first answer |
| A3/A4 material, record, probe | Side bar Media (a drawer), and the scene sheet's drop zone |
| B1–B3 readiness, questions, format | Verdict |
| C1/C2 script, shot list | Board (line per scene) + scene sheet |
| C3 style bible | Look sheet |
| C4–C7 generator, prompts, tracker, last frame | Scene sheet; tracker as the Next banner and the Start status line |
| D1–D7 match, evidence, diagnosis, actions, missing, redo | Board statuses + scene sheet; "See evidence" expands the measured/estimated facts |
| E1–E6 voice, levels, captions, SFX, music | Sound sheet; tracks in Timeline |
| F1–F5 preview, per-scene actions, locks, chat, fillers | Timeline, scene sheet, command bar |
| F6/F7 human touch, retention check | Export sheet ("one last check") and Look sheet options |
| G1–G5 presenter, avatar, voice clone | Start routes to a presenter board whose scenes are screen/avatar types; avatar setup lives in a sheet |
| H1–H3 export, title, AI label | Export sheet |
| H4/H5 settings, privacy | Side bar Settings |

## Identity
Light and quiet, with an editorial feel: a **serif headline face** for the questions and the scene lines (system serif, no font to license), clean sans for controls, generous space. One accent, **signal orange**, used only for the single primary action and the "Next" marker. The logo is a small clapperboard. The preview stage stays dark so footage colours read true. Dark mode can follow later through tokens.

## Not designed yet
Presenter-mode board, clips-only board, empty and error states (model download, storage full), mobile, shortcuts.

## What this changes in code (after approval)
Replace the current shell with Start, Verdict, Board, scene sheet, Timeline and the three sheets. The existing editor pieces (preview, trim, timeline, media bin) are reused inside Timeline and the Media drawer. Model, ops, storage and tests are unaffected. The SelfGlance theme from `3ec88f8` is dropped. Screens that depend on later milestones show a clear "coming in M#" state until built.

## Open questions
- Does calm/one-thing-at-a-time match what you want, or do you need more visible at once?
- Light with a dark preview stage, or fully dark?
- Is the Board (scene cards) the right home for a project?
