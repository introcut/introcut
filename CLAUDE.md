# Introcut — instructions for Claude Code

You are working on **Introcut** (introcut.app): a free, open-source, browser-only AI **producer + director + editor**. A user gives an idea, their resources (screenshots, screen recording, selfie, voice) and the clips they generated in free tools (Google Flow/Veo, Kling, Wan…). Introcut analyzes what it received, decides what to do, and produces a finished ~30 s 9:16 short. It does not generate video itself in V1.

## Read these first, in this order
1. `docs/V1-FEATURES.md` — what we are building in V1 (feature IDs A1…H6). Start here.
2. `docs/PLAN.md` — architecture, the **project JSON schema**, the core engine (§2a Analyze → Diagnose → Decide), risk gates G1–G7, milestones M0–M13.
3. `docs/WORK-DIVISION.md` — two roles (**A Studio**, **B Brain**), folder ownership, milestone leads. If only one person is working, they take both roles.
4. `STATUS.md` — what is done, in progress, blocked, and who owns it. **Update it whenever you finish something.**

## First thing to do in a new session
Read `STATUS.md`, then ask the person: *"Are you role A (Studio) or B (Brain), or both, and which milestone/feature are you taking?"* Work only in your role's folders (see `docs/WORK-DIVISION.md` §1). Changes to `src/model/` (schema, ops) need a PR approved by the other person when there are two contributors.

## Hard rules (never break)
- **Zero cost** to build and run: no paid APIs, no servers we pay for, no GPU rental.
- **Everything runs in the user's browser** (PWA, later on Cloudflare Pages). Media files never leave the device. The only allowed outside calls are one-time model downloads and clearly labelled opt-in features (user's own free API key; user's own free Hugging Face Space for avatar/voice clone) with an on-screen notice.
- **Licenses:** only MIT/Apache-style (or similarly permissive) libraries and models. When you add *any* dependency, model, font, sound or music, tell the user its license and add it to `CREDITS.md` in the same change. Never assume a license; verify it. Known special cases: Mediabunny is MPL-2.0 (use unmodified), Remotion is NOT allowed (custom license).
- **Every external tool/model is swappable** behind an interface (LLM, TTS, aligner, avatar engine, generator profiles). Never depend on one provider.
- **The whole project is one JSON file** (schema in `docs/PLAN.md` §5). Preview and export both render from it via the same `renderFrame` function. All changes go through `ops` so user edits, AI edits and undo share one path.
- **Human edits are sacred:** anything the user changes becomes a `lock`; AI actions must respect locks and only touch their own scope.
- **Safety:** clones use only the user's own face/voice with a recorded consent phrase; show an "AI-generated" reminder at export; never build watermark removal.
- **Be honest about limits.** Don't claim lip-sync, virality, or free-tier rules you haven't verified. Anything unverified is marked "verify" and is covered by a gate (G1–G7).

## How we work
- The user is a developer but **new to video**. When a video/audio concept first appears (codec, frame rate, keyframe, aspect ratio, ducking, LUFS, forced alignment…), explain it in one or two plain sentences.
- Build in **small milestones**, each runnable with `npm run dev`. After each milestone: say exactly how to run and test it, make a git commit, update `STATUS.md`, and ask what's next.
- Prefer a recommendation with a default over open-ended questions. Challenge the plan if you know better, and say why.
- Use branches (`a/<topic>` for Studio, `b/<topic>` for Brain) and open a PR when two people work together; the other person reviews. `main` stays working.
- Commit messages: short, plain, imperative ("Add caption editor").

## Tech stack (see PLAN §4 for the full table with licenses)
Vite + React + TypeScript + Zustand + Zod · own Canvas renderer (`src/render`) · Mediabunny + WebCodecs · WebLLM (Qwen3) / optional user key / rules fallback · transformers.js (Whisper or aligner, SigLIP/CLIP, CLAP) · kokoro-js TTS · OPFS storage · vite-plugin-pwa.

## Repo map (planned; create as milestones need)
```
docs/          V1-FEATURES.md, PLAN.md, WORK-DIVISION.md
src/model/     schema (Zod), ops, timeline            ← shared contract
src/store/ storage/ render/ media/ audio/ export/      ← role A
src/ai/ registry/ avatar/                              ← role B
src/ui/        panels (A: shell, preview, timeline…  B: brief, direction, diagnosis…)
fixtures/      sample project JSONs so A and B work independently
public/        music, sfx, fonts
```
