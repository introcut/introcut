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

(Transitive dependencies come from `package-lock.json`; run a license audit in Milestone 13.)

## Planned dependencies (not yet installed)
| Name | Purpose | License |
|---|---|---|
| Vite, React, TypeScript, Zustand, Zod | App | MIT |
| Mediabunny | Decode/mux/encode (used unmodified) | **MPL-2.0** |
| WebLLM + Qwen3 (dense sizes) | Local LLM | Apache-2.0 |
| transformers.js | Whisper/aligner, SigLIP/CLIP, CLAP in the browser | Apache-2.0 |
| Whisper | Speech recognition | MIT |
| Silero VAD | Speech detection | MIT |
| kokoro-js / Kokoro | Browser TTS | Apache-2.0 (verify repo) |
| Chatterbox | Voice clone on user's own free GPU | MIT |
| MuseTalk | Avatar on user's own free Hugging Face Space | MIT code; weights commercial use per README (verify) |
| Noto Sans Devanagari | Hindi/Nepali captions | SIL OFL 1.1 |
| vite-plugin-pwa | PWA | MIT |
| CLAP weights (`laion/clap-htsat-unfused`) | Sound-effect matching | verify |
| Nepali TTS model (Matcha-TTS Nepali, etc.) | Nepali voice | verify |
| Depth model for parallax | Photo parallax | verify |

## Explicitly not allowed
- Remotion: custom source-available license (paid company license above 3 employees).
- Anything non-commercial or share-alike that conflicts with MIT distribution.

## Music and sound effects
CC0 only. One row per file: title, author, source URL, license, date checked. _(none yet)_
