// Talks to any service that speaks the "OpenAI chat completions" format: Groq, OpenRouter, Google's compatibility endpoint,
// or a model running on your own computer (Ollama, LM Studio). The user brings the address, key and model.
import { LlmError, type ChatMessage, type CompleteOptions, type LlmProvider } from "./types";

export interface OpenAiCompatConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const trimSlash = (u: string) => u.replace(/\/+$/, "");

async function call(config: OpenAiCompatConfig, path: string, init: RequestInit): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(trimSlash(config.baseUrl) + path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}) },
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw new LlmError("Cancelled.", "aborted");
    throw new LlmError(
      "Couldn't reach the AI service. Check the address and your internet. If both are right, this service may not allow requests from a web page (a browser rule called CORS).",
      "network",
    );
  }
  if (res.status === 401 || res.status === 403) throw new LlmError("The service rejected the key. Check that it is copied completely.", "auth");
  if (res.status === 429) throw new LlmError("You've hit the service's free limit for now. Wait a minute, or use another provider.", "rate-limit");
  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    throw new LlmError(`The AI service returned an error (${res.status}). ${detail}`.trim(), "server");
  }
  try {
    return await res.json();
  } catch {
    throw new LlmError("The AI service sent something that isn't JSON. Is the address the API address?", "server");
  }
}

export function openAiCompatProvider(config: OpenAiCompatConfig): LlmProvider {
  return {
    id: "openai-compat",
    label: new URL(config.baseUrl, "http://x").host,
    async complete(messages: ChatMessage[], opts: CompleteOptions = {}) {
      const data = (await call(config, "/chat/completions", {
        method: "POST",
        signal: opts.signal,
        body: JSON.stringify({ model: config.model, messages, temperature: opts.temperature ?? 0.4 }),
      })) as { choices?: { message?: { content?: string } }[] };
      const text = data.choices?.[0]?.message?.content;
      if (typeof text !== "string" || text.trim() === "") throw new LlmError("The AI answered with nothing. Try again or pick another model.", "bad-output");
      return text;
    },
    async listModels(opts = {}) {
      const data = (await call(config, "/models", { method: "GET", signal: opts.signal })) as { data?: { id?: string }[] };
      return (data.data ?? []).map((m) => m.id).filter((id): id is string => typeof id === "string").sort();
    },
  };
}
