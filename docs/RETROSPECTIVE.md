# Introcut: what we did, how it went, what to fix (2026-10-22)

Written by Claude with the owner. Ratings are Claude's honest opinion, out of 10.

## What exists today
- **Foundation (M1-M2):** React/TypeScript app, one project JSON file with Zod schema, all changes through `applyOp` (undo, locks that protect human edits), browser storage (OPFS) with autosave, import/export, per-person multi-project storage.
- **UI:** landing page, Google sign-in (guest mode until a client ID exists), Home with a chat-style idea box, projects, a project folder (Overview), Board, Timeline, scene sheet, account sheet.
- **Brain (M3a):** a swappable language-model interface, basic mode with no AI, "my own AI" with any OpenAI-compatible service, idea check (scores, questions, format), script and shot list.
- **Video by code (M-Slice and after):** one shared drawing function for preview and export; animated templates; code-drawn backdrops and 17 characters/props; keyword-based picture choice; captions; voice per line (record, upload, Google voice with the user's key); mixing; MP4 export (1080x1920, 30 fps, H.264/AAC), about 100-126 frames per second on the owner's PC; Hindi/Nepali text renders correctly.
- **Tests:** 68 unit tests in the repo; browser end-to-end scripts (outside the repo) for the main flows.
- **Research (about 25 reports/notes in `reports/` and `research_notes/`):** script writing, code-made video, the 30 s clips plan, business/freemium/payments, V1 feasibility, Facebook scheduling, installers.
- **Decisions on file:** `STATUS.md` has the locked V1 scope.

## What went well
- The core architecture (JSON project + ops + locks + one renderer) is sound and has not needed rework.
- Honesty rules held: no fake scores, no fake buttons, unverified claims were marked.
- The export pipeline works and was measured, not guessed.
- Research surfaced real blockers early (Kokoro/eSpeak GPL, VoiceStudio AGPL, Meta review, Stripe/Nepal, Claude-in-runtime question).

## What went wrong (including Claude's own mistakes)
1. **Scope drift.** The product changed direction about six times (AI-clip director -> UI redesigns -> login/projects -> script research -> code video -> middleman business -> channel manager -> back to code video). Each step was reasonable alone; together they meant no single path from idea to a good video existed until very late. Claude followed each pivot instead of holding the line.
2. **Four UI redesign rounds** before the core worked. The UI got polished before the product did.
3. **Too much research before shipping.** Many large research waves, several cut short by a usage limit, many facts only from secondary sources. Useful for decisions, but it delayed building and left a pile of unverified claims.
4. **Nothing with a real AI model has been tested.** The AI path was only tested against a fake service. The idea-to-script quality, Nepali quality and real latency are all unknown.
5. **The "story" is not a story yet.** Pictures are chosen by keyword matching; characters idle and wave but do not act. This is the biggest gap against the product goal.
6. **Weak automated testing.** Browser end-to-end tests live outside the repo and are not in CI. Real screen recording, camera, real Google sign-in, Safari/Firefox, and weak laptops were never tested.
7. **Process slips:** research notes were swept into a commit by accident; pushes lagged (7 commits unpushed); early claims about the reference channel (AI-made vs Blender) were corrected late; long answers confused the owner several times; shell heredoc errors wasted time.
8. **Feature breadth over depth:** voice, captions, export, presenter ideas, channel manager, payments, desktop apps were all explored while the central quality (does the video tell a story well) stayed low.

## Ratings (Claude's view)
| Area | Score | Why |
|---|---|---|
| Architecture and data model | 8 | Clean, tested, swappable, never reworked |
| Export pipeline | 7.5 | Works, measured on one PC only |
| Honesty and licence discipline | 8 | Strong; caught several traps |
| Research | 6 | Broad and useful, but partial, secondary-sourced, too much too early |
| UI/UX | 5 | Clean but churned; never tested with real users |
| AI brain | 4 | Built, never run against a real model |
| Story animation quality | 3-4 | Pictures yes, story/action no |
| Scope discipline | 3 | Biggest failure; fixed only by the locked V1 scope |
| Testing | 5 | Good unit tests; end-to-end outside the repo |
| Communication | 5 | Honest but often too long and jargon-heavy |

## What to improve (concrete)
1. **One focus until it is good:** prompt -> scenes -> action script -> animated 30 s video. No new features until a stranger says "that tells my story".
2. **Define the target as a test:** 10 fixed stories (English/Hindi/Nepali); score each output (story clear, characters act, timing, text readable). Re-run after every change.
3. **Choose a model with a bake-off, not opinions:** run the same 10 stories through candidate models and compare (research under way).
4. **Create the action vocabulary and timeline format** (actors, actions, props with states, camera) before choosing the model, so the model has something precise to output.
5. **Move end-to-end tests into the repo and CI.**
6. **Get 3-5 real users** (Nepali creators) in front of the real thing early.
7. **Keep answers short, show pictures/videos, avoid jargon.**
8. **Push to GitHub regularly** (with the owner's OK) so work is backed up.
9. **Park everything outside the focus** (payments, channel manager, desktop app, avatar, cloning) exactly as locked in `STATUS.md`.
