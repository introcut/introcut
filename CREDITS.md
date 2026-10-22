# Credits and licenses

Rule: nothing is added to Introcut without its license listed here, in the same change. "verify" means the license has not yet been confirmed from the project's own repository and must be before use.

## Installed (Milestone 1)
| Name | Purpose | License |
|---|---|---|
| React, React DOM | UI | MIT |
| Zustand | State store | MIT |
| Vite, @vitejs/plugin-react | Dev server and build | MIT |
| TypeScript | Type checking | Apache-2.0 |
| Zod | Project schema validation | MIT |
| Vitest | Unit tests (dev only) | MIT |
| Mediabunny | Writes the MP4 and encodes/decodes video and audio with the browser's WebCodecs (used unmodified) | **MPL-2.0** (checked on npm, v1.62.0) |
| Inter (`@fontsource/inter`) | Latin text in videos (bundled woff2 files) | SIL OFL 1.1 (checked on npm) |
| Noto Sans Devanagari (`@fontsource/noto-sans-devanagari`) | Hindi/Nepali text in videos (bundled woff2 files) | SIL OFL 1.1 (checked on npm) |

## Design
| Name | Purpose | License / source |
|---|---|---|
| `src/theme.css` ("Editorial" look: tokens and base controls) | Look of the whole UI | Written for Introcut (MIT, same as the repo). Icons in `src/ui/Icon.tsx` are simple paths drawn for Introcut. |
| Fonts | Text | **None bundled.** Sans: Segoe UI Variable on Windows, otherwise the system UI font. Serif headings: Iowan Old Style (macOS/iOS), Palatino Linotype (Windows), Georgia as fallback; all are fonts already on the user's device, so nothing needs a license. If we later bundle a font (for example Inter, SIL OFL 1.1) for a uniform look, it is added here in the same change. |

| Google Identity Services (`accounts.google.com/gsi/client`) | "Sign in with Google" | A Google-hosted script, not bundled and not open source; loaded only on the sign-in page and subject to Google's terms. Owner-approved exception to the licence rule: it is a service, not a library. |

(Transitive dependencies come from `package-lock.json`; run a license audit in Milestone 13.)

## Planned dependencies (not yet installed)
| Name | Purpose | License |
|---|---|---|
| Vite, React, TypeScript, Zustand, Zod | App | MIT |
| WebLLM + Qwen3 (dense sizes) | Local LLM | Apache-2.0 |
| transformers.js | Whisper/aligner, SigLIP/CLIP, CLAP in the browser | Apache-2.0 |
| Whisper | Speech recognition | MIT |
| Silero VAD | Speech detection | MIT |
| kokoro-js / Kokoro | Browser TTS | kokoro-js is Apache-2.0, **but its `phonemizer` dependency embeds eSpeak NG (GPL-3.0)**. NOT added; see STATUS.md decision |
| Chatterbox | Voice clone on user's own free GPU | MIT |
| MuseTalk | Avatar on user's own free Hugging Face Space | MIT code; weights commercial use per README (verify) |
| vite-plugin-pwa | PWA | MIT |
| CLAP weights (`laion/clap-htsat-unfused`) | Sound-effect matching | verify |
| Nepali TTS model (Matcha-TTS Nepali, etc.) | Nepali voice | verify |
| Depth model for parallax | Photo parallax | verify |

## Explicitly not allowed
- Remotion: custom source-available license (paid company license above 3 employees).
- Anything non-commercial or share-alike that conflicts with MIT distribution.

## Music and sound effects
CC0 only. One row per file: title, author, source URL, license, date checked. _(none yet)_
