// Attach a spoken line to a scene: store the audio file, point the script line at it, size the scene to fit the voice,
// and estimate caption timings. Used for a recorded voice, an uploaded file, or a generated voice alike.
import { loadLlmConfig } from "../ai/llm/config";
import type { MediaOrigin } from "../model/types";
import { useStore } from "../store/useStore";
import { estimateWords } from "./timing";
import { loadTtsConfig } from "./tts/config";
import { geminiSpeak } from "./tts/gemini";

/** Quiet time kept after the last word of a line so cuts don't feel rushed. */
const TAIL_MS = 450;

export async function attachVoice(sceneId: string, file: File, origin: MediaOrigin, durationHintMs?: number): Promise<string | null> {
  const store = useStore.getState();
  const scene = store.project.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;
  const line = store.project.script.lines.find((l) => l.sceneId === sceneId);
  const oldMedia = line?.audioMediaId;
  const before = new Set(store.project.media.map((m) => m.id));
  await store.addFiles([file], origin, durationHintMs);
  const item = useStore.getState().project.media.find((m) => !before.has(m.id) && m.kind === "audio");
  if (!item) return null; // addFiles already reported why
  const durMs = item.probe.durationMs ?? durationHintMs;
  const st = useStore.getState();
  const current = st.project.scenes.find((s) => s.id === sceneId);
  if (!current) return null;

  // Setting a voice is automatic follow-up work, not a creative edit, so it runs as "ai": it respects locks and never adds new ones.
  st.dispatch({ type: "setLineAudio", sceneId, mediaId: item.id }, { actor: "ai" });
  if (durMs && durMs > 0) {
    const want = Math.round(durMs + TAIL_MS);
    if (current.card || !current.source) st.dispatch({ type: "setSlotMs", sceneId, ms: want }, { actor: "ai" });
    else if (st.project.media.find((m) => m.id === current.source!.mediaId)?.kind === "photo") st.dispatch({ type: "trimScene", sceneId, outMs: want }, { actor: "ai" });
    const text = line?.text ?? "";
    // A card already shows its own text, so captions go on clips and photos only.
    if (!current.card && text.trim()) st.dispatch({ type: "setCaptions", sceneId, enabled: true, words: estimateWords(text, want) }, { actor: "ai" });
  }
  if (oldMedia && oldMedia !== item.id) st.dispatch({ type: "removeMedia", mediaId: oldMedia }, { actor: "ai" });
  return item.id;
}

/** Make a voice for one scene's line with Gemini (the user's own key). Throws a plain-language Error. */
export async function makeGeminiVoice(sceneId: string, signal?: AbortSignal): Promise<void> {
  const { project } = useStore.getState();
  const line = project.script.lines.find((l) => l.sceneId === sceneId);
  const text = line?.text.trim();
  if (!text) throw new Error("This shot has no line to speak yet.");
  const llm = loadLlmConfig();
  const index = project.scenes.findIndex((s) => s.id === sceneId) + 1;
  const file = await geminiSpeak(llm.apiKey, loadTtsConfig(), text, `voice-scene-${index}.wav`, signal);
  if (!(await attachVoice(sceneId, file, "ai-generated"))) throw new Error("The voice could not be added to the project.");
}
