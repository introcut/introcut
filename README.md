# Introcut

**Free, open-source AI producer + editor for 30-second vertical videos. Runs entirely in your browser.**

You bring an idea, your material (screenshots, screen recording, selfie) and the clips you generated in free tools such as Google Flow/Veo, Kling or Wan. Introcut looks at what you have and decides what to do:

- judges whether the idea is strong enough and asks for exactly what's missing,
- picks a story format, writes the script and shot list,
- recommends a free generator for each scene and writes the prompt,
- **analyzes the clips you bring back**, fixes the gaps (trims, callouts, fillers, sound) and keeps your manual edits,
- adds voice, word-by-word captions, sound effects and music, and exports a ready-to-post MP4.

No backend, no paid APIs, no uploads: your media never leaves your device.

> **Status:** planning complete, building starts at Milestone 1. See [`STATUS.md`](STATUS.md).

## Run it
```
npm install
npm run dev      # open http://localhost:5173 in Chrome or Edge
```
Milestone 1 (editor shell): drop or record media, see its details, add it to the timeline and play it back in a 9:16 phone preview. Press **Load demo** for three sample scenes.

## Docs
- [`docs/V1-FEATURES.md`](docs/V1-FEATURES.md) — what V1 includes, with a walk-through
- [`docs/PLAN.md`](docs/PLAN.md) — architecture, JSON schema, milestones, risks
- [`docs/WORK-DIVISION.md`](docs/WORK-DIVISION.md) — how contributors split the work
- [`CREDITS.md`](CREDITS.md) — licenses of everything we use

## Contributing with Claude Code
Open this repo in Claude Code. `CLAUDE.md` tells it what Introcut is, the rules, and where your task is.

## License
[MIT](LICENSE)
