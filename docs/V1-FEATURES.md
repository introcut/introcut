# Introcut V1 — Feature Draft (introcut.app)

**One line:** Give Introcut an idea, your material and the clips you generated. It acts as producer, director, sound department and editor, and gives you a finished 30-second vertical video. It runs entirely in your browser, costs nothing and keeps your files on your device.

Companion to `PLAN.md` (architecture, JSON schema, risks). This file is the "what", `PLAN.md` is the "how".

Legend: **[M#]** milestone from PLAN.md · **🔒 Gate** = depends on a go/no-go test (G1–G7) with a fallback.

---

## 1. Walk-through: one user, start to finish (garlic + monkey example)

1. **Open introcut.app, type the idea** ("a monkey teaches how to plant garlic in a paddy field, Nepali, funny, 30 s"). Add a few reference photos if any.
2. **Readiness check:** "Hook 78 · Clarity 85 · Feasibility 52 (hands planting cloves are hard for free generators) · Novelty 80." Introcut suggests a safer shot and asks 1–2 questions.
3. **Introcut picks the format** ("how-to demo", with the reason) and writes the **Nepali script + 6-scene shot list**.
4. **Direction desk:** for every scene it recommends a free generator and gives a ready-to-paste prompt (4–8 s) using one locked character/style. A tracker shows "2 of 6 clips done; credits reset tomorrow".
5. **You generate clips elsewhere** and drag them in.
6. **Introcut analyzes what arrived** and shows a card per scene: what's in it, what's wrong, what it suggests ("5 s instead of 7 s → keep best 3 s + add callout circle", "logo in corner", "voice differs from clip 1").
7. **You watch it assemble** in a phone-shaped preview, scene by scene. Fix or redo one scene without touching the rest. Introcut adds voice (if needed), captions, sound effects, music, transitions and a hook title.
8. **Export** the MP4 with a suggested title, description and hashtags, plus an "AI-generated" reminder.

---

## 2. Features

### A. Start and brief
| ID | Feature | Notes |
|---|---|---|
| A1 | Project home: new, open recent, import `.json` | Auto-save in the browser [M2] |
| A2 | Idea intake: free text plus optional audience, feeling, call to action, language (English / Hindi / Nepali), length (15–60 s, default 30) | [M3] |
| A3 | Add resources: drag-drop, paste screenshots, add links, **record screen + mic**, record **selfie**, voice sample | [M1] |
| A4 | Media bin with a technical probe per file: duration, aspect, fps, audio, loudness | [M1] |
| A5 | Any starting point works: idea only, idea + files, idea + files + clips, or clips only | Same engine [M5] |

### B. Judgement
| ID | Feature | Notes |
|---|---|---|
| B1 | **Readiness check:** hook, clarity, visual feasibility for free generators, novelty. Each 0–100 with a reason | [M3] |
| B2 | Asks for at most 3 specific missing things; "continue anyway" always available | [M3] |
| B3 | **AI-chosen format** with the reason shown; "try another approach" button. Library: mini story, problem → reveal, before/after, 3 things, POV/cinematic, how-to demo. Custom structure from beats if nothing fits | [M3] |

### C. Direction
| ID | Feature | Notes |
|---|---|---|
| C1 | **Script writer** in English / Hindi / Nepali (Devanagari plus roman letters). Always editable | 🔒 G2 for Nepali/Hindi quality [M3] |
| C2 | **Shot list:** each scene has intent, duration, type (generated, your media, card, filler, avatar) | [M3] |
| C3 | **Style bible:** locked character description, anchor image, lighting, palette, lens, camera, negatives, series line | [M4] |
| C4 | **Generator recommendation per scene** from a registry (limits, watermark, commercial-use, audio, last-verified date) | [M4] |
| C5 | **Ready-to-paste prompts**, 4–8 s each, 9-part structure, Nepali dialogue inside the prompt where relevant. Copy button plus open-the-tool link | [M4] |
| C6 | **Multi-day tracker** of clips owed, next prompt, credit resets | [M4] |
| C7 | **Last-frame extractor** to start the next clip from the previous one | [M4] |
| C8 | Registry freshness: scheduled GitHub job flags changed free-tier pages | [M4] |

### D. Receive and analyze (the core)
| ID | Feature | Notes |
|---|---|---|
| D1 | Drop clips, **auto-match to scene slots** | [M5] |
| D2 | **Evidence sheet per clip:** measured facts (length, loudness, speech, motion, blur, corner logo) and estimated facts (what's in the picture, language, was the scripted line spoken, same character, same look) with confidence | [M5] |
| D3 | **Diagnosis per scene and for the whole video** vs the idea and resources | [M5] |
| D4 | **Action cards:** trim, stretch, swap, fill gap, add sound, normalize voice, regenerate, add a new clip, drop. Apply, undo or "do it my way" | [M5] |
| D5 | **"What's still missing"** list | [M5] |
| D6 | **Redo this scene:** writes an improved prompt with the reason | [M5] |
| D7 | Things software can't judge (e.g. "root touches soil") are shown as a frame for you to check | [M5] |

### E. Sound (audio-first)
| ID | Feature | Notes |
|---|---|---|
| E1 | **Audio-first timeline:** narration timing sets scene lengths | [M6] |
| E2 | **Voice per line:** generator-native speech (kept), browser TTS (English and Hindi; Nepali if it passes), own recording, cloned voice | 🔒 G1, G4 [M6] |
| E3 | **Level and tone matching** across clips, voice-drift flag | [M6] |
| E4 | **Captions:** bold word-by-word highlight, Devanagari font, text from the script with timing aligned to audio, fully editable | 🔒 G3 [M6–7] |
| E5 | **Sound effects** matched to the scene and placed on the action beats | 🔒 G6 [M8] |
| E6 | Ambience, CC0 music, ducking (about 15 % under voice, 40 % open), master volume | [M8] |

### F. Edit and finish
| ID | Feature | Notes |
|---|---|---|
| F1 | **Live 9:16 phone preview** and a clickable scene timeline | [M1] |
| F2 | **Per-scene actions:** trim, reorder, delete, replace, redo | [M2, M5] |
| F3 | Undo/redo, and **locks** so AI never overrides your manual edits | [M2] |
| F4 | **Chat box:** "make scene 3 shorter", "move the funny part first" (becomes validated edit operations) | [M5] |
| F5 | **Gap fillers:** freeze-frame + callout circle/arrow/zoom, Ken Burns, depth parallax, stretch (hold/slow/reverse), text and step cards, talking-still (cartoon mouth) | [M9] |
| F6 | **Human-touch finishing:** color match to the look, light grain, consistent camera drift, J/L cuts, hook title in the first 2 s, loopable ending | [M9] |
| F7 | **Retention check:** likely attention dips and how to fix them | [M9] |

### G. Presenter mode
| ID | Feature | Notes |
|---|---|---|
| G1 | Layouts: avatar bubble, split screen, avatar intro then screen | [M10] |
| G2 | Screen-recording smart edit: trim dead time, speed up idle parts, auto-zoom to where the screen changes | [M10] |
| G3 | **Avatar slot** for a clip from any tool (e.g. Veo with your reference photos) | 🔒 G7 [M10] |
| G4 | **Avatar maker:** record 15–20 s selfie + consent phrase once, run on **your own free Hugging Face Space**, reuse for any audio | 🔒 G5 [M11] |
| G5 | **Voice clone** on your free GPU with a spoken consent check | 🔒 G4/G5 [M11] |

### H. Output and platform
| ID | Feature | Notes |
|---|---|---|
| H1 | **Export MP4** 1080×1920, 30 fps, H.264/AAC, plus 720p draft | [M12] |
| H2 | **Title, description, hashtags** suggestion | [M12] |
| H3 | **"AI-generated" label reminder** at export | [M12] |
| H4 | Settings: AI provider (local, your own free API key, rules), language, caption preset | [M3] |
| H5 | Privacy: media stays on your device; clear notice before any model download or optional external call | [M13] |
| H6 | PWA, Cloudflare Pages deploy, README, `CREDITS.md`, license audit. Chrome/Edge desktop | [M13] |

---

## 3. What is NOT in V1
- Introcut generating video itself (we recommend generators and prompt them)
- Direct integration or automation of Flow, Kling or others (copy and drag-and-drop only)
- Watermark removal (never)
- Auto-posting to YouTube, Facebook or TikTok
- Cloud sync and team collaboration (Google sign-in identifies the person and keeps projects per person on this device; it does not sync. See `docs/PLATFORM-PLAN.md`)
- Safari, Firefox and phone browsers as fully supported targets
- Cursor-accurate tracking in screen recordings
- Guaranteed realistic lip-sync of an arbitrary voice on a realistic face

## 4. "V1 is done" when these three runs work end to end
1. **Generated mode:** the garlic-monkey idea → exported MP4 with captions, voice, sound, fillers.
2. **Presenter mode:** a 60-second screen recording → 30 s vertical with avatar bubble, zooms, captions, music.
3. **Clips only:** upload 4 random clips → Introcut infers a story and exports.

Plus: any one scene can be redone without changing the others, and a manual edit is never overwritten by the AI.

## 5. Open risks that can change this list
Nepali voice and speech quality (G1–G4), local-LLM script quality (G2), avatar on a free GPU (G5), free-tier rule changes. Each has a fallback listed in `PLAN.md` §3 and §13.
