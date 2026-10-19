# Introcut UX (proposal, awaiting approval)

Clickable mock: open `docs/ux/prototype.html` in a browser (mock data, nothing is saved). Keys: `[` collapses the side bar, `]` the assistant.

## Why the first two UIs felt wrong
They were **editors** (media bin, preview, timeline). Introcut is a **producer + director + editor**: most of a person's time is spent deciding what to make, generating clips in other tools and bringing them back. A timeline only matters at the end. So the product is organised by **stage**, and the timeline is one stage, not the whole screen.

## Principles
1. **One stage, one job.** Each stage has a single clear next action and a "next" button. A beginner is never facing a wall of panels.
2. **Always show where you are.** The stage bar at the top is a mini timeline: done / current / to do.
3. **Progressive power.** Beginners follow the stages. Anyone can jump to any stage; the full editor (preview, inspector, tracks) is the Edit stage.
4. **The assistant is a side panel, not a chat page.** It explains what it found and offers buttons (Apply / Skip). Your locked edits are never overridden, and it says so.
5. **Collapsible everything that is not the work:** side bar (full to icons), assistant panel, and the timeline outside the Edit stage.
6. **Dark, neutral workspace** (like most editors) so footage colours read true. Light theme stays available.

## Flow
Landing page (introcut.app) → Welcome (local profile) → Home (idea box + projects) → Workspace with six stages:
**Idea** (readiness score, why/why-not, format picked) → **Script** → **Shots** (generator + prompt per shot) → **Clips** (drop clips, per-clip diagnosis) → **Edit** (preview, trim, gap fixes, timeline) → **Finish** (captions, sound, retention check, export).

Layout of the workspace: top bar (project, stage bar, undo/redo, assistant toggle, profile), left rail (stages, then Media and Style), centre (the stage), right assistant panel.

## Sign-in: recommendation
Introcut has no server, so a normal account has nothing to log into, and "your media never leaves your device" is a hard rule. Proposed:
- **V1: local profile** (name, languages, platforms), stored on the device. No sign-in required.
- **Optional "Continue with Google"** later: backs up only the small project file to a private app folder in the user's *own* Google Drive (scope `drive.appdata`), from the browser, no server of ours. Free, but needs a Google OAuth app set up and possibly a review. **Verify before promising.** Videos are never uploaded.

## Identity
Signature: the **cut line**, a single lime vertical line (logo, playhead, current stage). Lime marks the one thing that matters now (primary action, current stage); everything else stays neutral. Flat surfaces, no gradients or blur. Font: system UI for now (no licence to track).

## What this changes in code (after approval)
Replace the current shell with: landing + welcome + home screens, the workspace frame (top bar, collapsible rail, assistant panel), and move the existing editor into the Edit stage. The data model, ops, storage and tests are unaffected. The SelfGlance theme from `3ec88f8` is superseded and will be removed.

## Open questions
- Keep the six stages as named, or merge/rename any?
- Local profile for V1, with Google Drive backup as a later option: OK?
- Dark by default with a light option: OK?
