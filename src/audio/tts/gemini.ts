// Google's Gemini text-to-speech, called straight from the browser with the user's own key. The text of the line is sent to Google.
// Untested against the live service in this repo (needs a real key): see the milestone notes. The reply is base64 16-bit PCM at 24 kHz.
import { LlmError } from "../../ai/llm/types";
import { pcm16ToWavFile } from "../wav";
import type { TtsConfig } from "./config";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export async function geminiSpeak(apiKey: string, cfg: TtsConfig, text: string, fileName: string, signal?: AbortSignal): Promise<File> {
  const model = cfg.model.replace(/^models\//, "");
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: cfg.voice || "Kore" } } },
        },
      }),
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw new LlmError("Cancelled.", "aborted");
    throw new LlmError("Couldn't reach Google's voice service. Check your internet connection.", "network");
  }
  if (res.status === 401 || res.status === 403) throw new LlmError("Google rejected the key for voices. Check the key and that it may use this voice model.", "auth");
  if (res.status === 429) throw new LlmError("You've hit Google's free limit for voices. Wait a minute and try again.", "rate-limit");
  if (!res.ok) throw new LlmError(`Google's voice service returned an error (${res.status}). ${(await res.text().catch(() => "")).slice(0, 160)}`.trim(), "server");
  const data = (await res.json().catch(() => null)) as { candidates?: { content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] } }[] } | null;
  const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part?.inlineData?.data) throw new LlmError("Google sent no audio. This voice model may not support the text or language.", "bad-output");
  const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType ?? "")?.[1] ?? 24000);
  const bytes = Uint8Array.from(atob(part.inlineData.data), (c) => c.charCodeAt(0));
  return pcm16ToWavFile(bytes, rate, fileName);
}
