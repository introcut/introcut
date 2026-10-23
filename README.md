# Introcut

**Free, open-source AI producer + editor for 30-second vertical videos. Runs entirely in your browser.**

You bring an idea, your material (screenshots, screen recording, selfie) and the clips you generated in free tools such as Google Flow/Veo, Kling or Wan. Introcut looks at what you have and decides what to do:

- judges whether the idea is strong enough and asks for exactly what's missing,
- picks a story format, writes the script and shot list,
- recommends a free generator for each scene and writes the prompt,
- **analyzes the clips you bring back**, fixes the gaps (trims, callouts, fillers, sound) and keeps your manual edits,
- adds voice, word-by-word captions, sound effects and music, and exports a ready-to-post MP4.

No backend, no paid APIs, no uploads: your media never leaves your device.

> **Status (2026-10-23): early build, works end to end for simple stories.** Type a story, get a 30-second vertical video drawn entirely by code (animated cards, drawn backdrops and characters, captions, optional voice) and export it as an MP4, all in the browser. Pictures are chosen by keywords, characters do not act yet, and no real AI model has been tested. The current focus is turning a story into an *action timeline* so characters actually act. See [`STATUS.md`](STATUS.md).

## New here? Read in this order
1. [`STATUS.md`](STATUS.md): what is built, what is locked for V1, open decisions.
2. [`docs/RETROSPECTIVE.md`](docs/RETROSPECTIVE.md): what we did, what went wrong, ratings, what to improve.
3. [`reports/`](reports/): the research reports (script writing, video through code, the 30 s clips plan, the V1 feasibility study). Raw notes behind them are in [`research_notes/`](research_notes/). Many claims there are marked "verify"; treat them as leads, not facts.
4. [`CLAUDE.md`](CLAUDE.md): the hard rules (zero cost, permissive licences only, honesty, locks).
5. Code map: `src/model` (project schema and ops), `src/render` (the one drawing function, templates, art), `src/ai` (brains, compiler, picture chooser), `src/export` (MP4), `src/audio` (mix, voice), `src/ui` (screens).

Quick check: `npm test` (68 unit tests) and `npm run build`.

## Run it
```
npm install
npm run dev      # open http://localhost:5173 in Chrome or Edge
```
Milestones 1–2 (editor shell + project core) with the Editorial UI: write your idea on the Start screen, then work on the **Board** (scene cards) or the **Timeline** (9:16 preview). Add or record media from the side rail's Media sheet; trim, reorder, replace and delete scenes with undo/redo. Your project saves itself in the browser and can be exported/opened as a JSON file. Press **Try the demo** on an empty board for three sample scenes. Run the unit tests with `npm test`. Milestone 3 adds the idea check and the script: basic mode works with no AI; connect your own free AI service in Settings for scores and a written script. Generator prompts and video export arrive in later milestones.

## Sign-in setup
The app asks people to sign in with Google. For that, create an OAuth client ID (type Web application) in Google Cloud Console, allow `http://localhost:5173` (and your deployed address) as JavaScript origins, and put it in `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```
Without it the sign-in page offers a guest mode for development. Projects are stored per person on this device; signing in does not sync them. See [`docs/PLATFORM-PLAN.md`](docs/PLATFORM-PLAN.md).

## Docs
- [`docs/V1-FEATURES.md`](docs/V1-FEATURES.md) — what V1 includes, with a walk-through
- [`docs/PLAN.md`](docs/PLAN.md) — architecture, JSON schema, milestones, risks
- [`docs/PLATFORM-PLAN.md`](docs/PLATFORM-PLAN.md) — sign-in, projects, and what "free credits" can and cannot mean
- [`docs/WORK-DIVISION.md`](docs/WORK-DIVISION.md) — how contributors split the work
- [`CREDITS.md`](CREDITS.md) — licenses of everything we use

## Contributing with Claude Code
Open this repo in Claude Code. `CLAUDE.md` tells it what Introcut is, the rules, and where your task is.

## License
[MIT](LICENSE)
