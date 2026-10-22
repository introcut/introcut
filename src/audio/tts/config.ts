// Settings for spoken voices made by Google's text-to-speech with the user's own key. Kept in this browser only, like the AI key.
import { useSyncExternalStore } from "react";
import { loadLlmConfig } from "../../ai/llm/config";
import { notifySettings, subscribeSettings } from "../../settingsBus";

const KEY = "introcut.tts";

export interface TtsConfig {
  /** A Gemini speech model id, e.g. one the account lists with "tts" in its name. Model names change often, so it is typed or picked, not hard-coded. */
  model: string;
  voice: string;
}

export const VOICES = ["Kore", "Puck", "Charon", "Aoede", "Fenrir", "Leda", "Orus", "Zephyr"];

export function loadTtsConfig(): TtsConfig {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<TtsConfig>;
    return { model: String(v.model ?? ""), voice: String(v.voice ?? "Kore") };
  } catch {
    return { model: "", voice: "Kore" };
  }
}

export function saveTtsConfig(c: TtsConfig) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
  notifySettings();
}

/** Gemini voices need the Gemini address + key (from the AI settings) and a speech model. */
export function geminiVoiceReady(): boolean {
  const llm = loadLlmConfig();
  const tts = loadTtsConfig();
  return llm.apiKey.trim() !== "" && /generativelanguage\.googleapis\.com/.test(llm.baseUrl) && tts.model.trim() !== "";
}

/** Like geminiVoiceReady(), but the screen re-draws when the settings change. */
export const useGeminiVoiceReady = () => useSyncExternalStore(subscribeSettings, geminiVoiceReady);
