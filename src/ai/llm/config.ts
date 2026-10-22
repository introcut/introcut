// The user's own AI service settings. Kept in this browser only (localStorage), never in the project file,
// so exporting or sharing a project can't leak the key.
import { notifySettings } from "../../settingsBus";
import type { OpenAiCompatConfig } from "./openaiCompat";

const KEY = "introcut.llm";

export const PRESETS = [
  { id: "groq", name: "Groq", baseUrl: "https://api.groq.com/openai/v1", note: "Free tier with limits. Browser access: untested." },
  { id: "openrouter", name: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", note: "Some models are free. Browser access: untested." },
  { id: "gemini", name: "Google Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", note: "Free tier exists. Browsers may be blocked by CORS (a forum report says so), so test it." },
  { id: "ollama", name: "On this computer (Ollama)", baseUrl: "http://localhost:11434/v1", note: "Runs on your PC, free, private. Ollama must allow this site (OLLAMA_ORIGINS)." },
  { id: "custom", name: "Other", baseUrl: "", note: "Any service that speaks the OpenAI chat format." },
] as const;

export const emptyConfig = (): OpenAiCompatConfig => ({ baseUrl: "", apiKey: "", model: "" });

export function loadLlmConfig(): OpenAiCompatConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<OpenAiCompatConfig>;
      return { baseUrl: String(v.baseUrl ?? ""), apiKey: String(v.apiKey ?? ""), model: String(v.model ?? "") };
    }
  } catch {
    /* storage blocked or corrupt: behave as not configured */
  }
  return emptyConfig();
}

export function saveLlmConfig(c: OpenAiCompatConfig): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* ignore: the settings just won't be remembered */
  }
  notifySettings();
}

export const isConfigured = (c: OpenAiCompatConfig) => c.baseUrl.trim() !== "" && c.model.trim() !== "";
