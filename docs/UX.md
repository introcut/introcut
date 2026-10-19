# Introcut UX (proposal, awaiting approval)

Clickable mock: open `docs/ux/prototype.html` in a browser (mock data, nothing is saved). Keys: `[` collapses the side bar, `]` the assistant. The links at the bottom jump between screens and modes (including **Presenter mode** and **Clips only**).

This design is derived from `docs/V1-FEATURES.md` (every feature ID A1–H6 has a place below). Accounts and cloud sync are explicitly **not in V1**, so there is no sign-in.

## Why the first two UIs felt wrong
They were **editors** (media bin, preview, timeline). Introcut is a **producer + director + editor**: most of a person's time goes on deciding what to make, generating clips in other tools and bringing them back. A timeline matters only late. So the app is organised by **stage**, and the editor is one stage.

## Principles
1. **One stage, one job**, with a clear next button.
2. **Always show where you are:** the stage bar is a mini timeline (done / current / to do / not needed).
3. **The stages adapt to what the person brought** (A5): idea only, idea + material, clips only (Brief/Script/Direct shown as "not needed"), or presenter mode (Record and Avatar replace Direct and Clips).
4. **Introcut proposes, the person decides:** every finding is a card with Apply / Do it my way. Applied things can be undone; edited things are locked, and Introcut says when it left a lock alone (F3).
5. **Collapsible everything that isn't the work:** side bar (full to icons), assistant panel, media drawer.
6. **Dark neutral workspace** so footage colours read true; light theme available.

## Flow
Landing (introcut.app) → one-time **Setup** (where the AI runs, languages; H4) → **Home** ("What do you have?", waiting-on-you tracker, projects, import; A1, A5, C6) → **Workspace**.

Stages (generated): **Brief → Script → Direct → Clips → Audio → Edit → Finish**. Presenter: Brief → Script → **Record → Avatar** → Audio → Edit → Finish.

Workspace frame: top bar (project, stage bar, undo/redo, settings, assistant toggle), left rail (stages; Media; Settings), centre (the stage), right assistant panel (F4 chat + suggestions). The **media drawer** (A3, A4) opens from the rail on any stage.

## Feature → screen map
| Features | Where |
|---|---|
| A1 project home, import | Home |
| A2 idea intake, A3 add/record material, A4 probe | Brief; Media drawer (record screen/selfie/voice, drop, paste, link; probe facts per file) |
| A5 any starting point | Home mode cards; stage bar adapts |
| B1–B3 readiness, questions (max 3), format + "try another" | Brief |
| C1 script (EN/HI/NE), C2 shot list | Script |
| C3 style bible, C4 generator choice + limits + verified date, C5 prompts, C6 tracker, C7 last-frame | Direct; tracker also on Home |
| D1–D7 match, evidence (measured vs estimated + confidence), diagnosis, action cards, still-missing, redo scene, "check this frame" | Clips |
| E1–E3 audio-first, voice per line, level/tone match, E4 captions, E5 SFX, E6 music + ducking | Audio; captions/SFX/music also visible as timeline tracks in Edit |
| F1 phone preview + timeline, F2 per-scene actions, F3 undo + locks, F4 chat, F5 gap fillers | Edit |
| F6 human touch, F7 retention check | Finish |
| G1 layouts, G2 screen smart edit, G3–G5 avatar + voice clone | Record, Avatar (Edit shows the layout) |
| H1 export, H2 title/description/hashtags, H3 AI-label reminder | Finish |
| H4 settings, H5 privacy notice | Setup, Settings |

## Identity
Signature: the **cut line**, one lime vertical line (logo, playhead, current stage). Lime marks the one thing that matters now (primary action, current stage); the rest stays neutral. Flat surfaces, no gradients or blur. System font for now (no licence to track).

## Not designed yet (to decide when we get there)
Mobile layout (V1 targets Chrome/Edge desktop), keyboard shortcut sheet, onboarding hints, empty states for each stage, error states (model download failed, storage full).

## What this changes in code (after approval)
Replace the current shell: landing, setup, home, workspace frame (collapsible rail, assistant panel, media drawer, stage bar). Move the existing editor (preview, inspector, timeline) into the Edit stage and the media bin into the drawer. Stage screens beyond Edit are built with their milestones (M3 Brief/Script, M4 Direct, M5 Clips, and so on); until then they show a clear "coming in M#" state. Model, ops, storage and tests are unaffected. The SelfGlance theme from `3ec88f8` is replaced.

## Open questions
- Do the seven stages and their names fit how you think about the work?
- Dark by default with a light option?
- Should Home's "Waiting on you" tracker be the first thing a returning user sees?
