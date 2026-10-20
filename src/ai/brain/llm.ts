// The AI brain: asks a language model to judge the idea (B1-B3) and to write the script and shot list (C1-C2).
// Every answer is checked against a schema; if it doesn't fit, the model gets one chance to fix it. Nothing unchecked reaches the project.
import { z } from "zod";
import { CUSTOM_FORMAT_ID, FORMATS, getFormat } from "../formats";
import { extractJson } from "../llm/json";
import { LlmError, type ChatMessage, type LlmProvider } from "../llm/types";
import { makeScene } from "../../model/types";
import type { Assessment, Brain, BrainInput, FormatPick, Language, PlanDraft } from "./types";

const score = z.coerce.number().transform((n) => Math.min(100, Math.max(0, Math.round(n))));
const pick = z.object({ id: z.string(), why: z.string().default("") });

const AssessmentSchema = z.object({
  summary: z.string().default(""),
  scores: z.object({ hook: score, clarity: score, feasibility: score, novelty: score }),
  reasons: z.object({ hook: z.string().default(""), clarity: z.string().default(""), feasibility: z.string().default(""), novelty: z.string().default("") }),
  missing: z.array(z.object({ ask: z.string(), fixHint: z.string().default("") })).default([]),
  format: pick,
  alternatives: z.array(pick).default([]),
});

const PlanSchema = z.object({
  shots: z
    .array(
      z.object({
        beat: z.string().default(""),
        role: z.enum(["hook", "body", "cta"]).default("body"),
        type: z.enum(["generated", "user-media", "card", "filler", "avatar"]).default("generated"),
        intent: z.string(),
        seconds: z.coerce.number().default(5),
        line: z.string().default(""),
        roman: z.string().optional(),
        media: z.string().optional(),
      }),
    )
    .min(2),
});

const LANGUAGE_NAME: Record<Language, string> = { en: "English", hi: "Hindi (Devanagari script)", ne: "Nepali (Devanagari script)" };

const FORMAT_LIST = FORMATS.map((f) => `- ${f.id}: ${f.name}, good for ${f.goodFor}. Beats: ${f.beats.map((b) => b.kind).join(" > ")}`).join("\n");

const REALITY = `Reality of free AI video generators (Google Flow/Veo, Kling, Wan and similar), which you must account for:
- Each clip is short, about 5-8 seconds. A 30-second video is 4-6 clips.
- They are weak at: readable text, hands doing precise actions, counting, the same character across clips, long continuous actions.
- They are good at: one subject, one simple action, clear lighting, camera moves, mood, animals and objects.
- Real screen recordings and photos from the user are better than generated clips for anything about software, products or real places.`;

const mediaLines = (input: BrainInput) =>
  input.media.length === 0
    ? "(none)"
    : input.media.map((m) => `- "${m.name}": ${m.kind}, ${m.origin}${m.durationMs ? `, ${(m.durationMs / 1000).toFixed(1)} s` : ""}`).join("\n");

const qaLines = (input: BrainInput) => (input.qa.filter((x) => x.a.trim()).length ? input.qa.filter((x) => x.a.trim()).map((x) => `Q: ${x.q}\nA: ${x.a}`).join("\n") : "(none)");

function assessPrompt(input: BrainInput): ChatMessage[] {
  const avoid = input.avoidFormatIds?.length ? `\nDo NOT pick these formats (the user rejected them): ${input.avoidFormatIds.join(", ")}.` : "";
  return [
    {
      role: "system",
      content: `You are a short-video producer. You judge an idea honestly and kindly, in plain words, for a ${input.targetSec}-second vertical (9:16) video.
${REALITY}

Score four things from 0 to 100, each with a one-sentence reason a beginner understands:
- hook: would the first 2 seconds make someone stop scrolling?
- clarity: is it obvious what the video is about and what happens?
- feasibility: can this be made with free generators and the user's own material? Be strict about the weaknesses listed above.
- novelty: is it fresh, or the same as thousands of videos?
Do not inflate scores. Most ideas score 50-80. Give a low score when the reason is real.

If something important is missing, list AT MOST 3 questions in "missing", each with a "fixHint" (an example answer). If nothing is missing, use an empty list.
Choose the best story format from this list, or "${CUSTOM_FORMAT_ID}" if none fits, and say why in one sentence. Also give up to 2 runner-up formats.${avoid}
${FORMAT_LIST}

Write the summary, reasons and questions in English, even if the idea is in another language. Reply with ONE JSON object and nothing else:
{"summary": string, "scores": {"hook": number, "clarity": number, "feasibility": number, "novelty": number}, "reasons": {"hook": string, "clarity": string, "feasibility": string, "novelty": string}, "missing": [{"ask": string, "fixHint": string}], "format": {"id": string, "why": string}, "alternatives": [{"id": string, "why": string}]}`,
    },
    {
      role: "user",
      content: `Idea: ${input.idea}\nLanguage of the video: ${LANGUAGE_NAME[input.language]}\nAnswers so far:\n${qaLines(input)}\nFiles the user already has:\n${mediaLines(input)}`,
    },
  ];
}

function planPrompt(input: BrainInput, format: FormatPick): ChatMessage[] {
  const f = getFormat(format.id);
  const beats = f ? `Use this structure, one shot per beat: ${f.beats.map((b) => `${b.kind} (${b.role}, about ${(b.share * input.targetSec).toFixed(0)} s)`).join(", ")}.` : "Invent a structure of 4-6 beats that fits the idea: first shot is the hook, last is the call to action or payoff.";
  const speaking = input.language === "en" ? "" : ` Write each "line" in ${LANGUAGE_NAME[input.language]} and also give "roman": the same line in Latin letters, how it is pronounced.`;
  return [
    {
      role: "system",
      content: `You are a short-video writer and director. Write the script and shot list for a ${input.targetSec}-second vertical (9:16) video.
${REALITY}
${beats}
Rules:
- Shot "seconds" are 2 to 8 and add up to about ${input.targetSec}.
- "line" is what is said or shown as text during that shot (one short sentence; people speak about 2.5 words per second). Leave "" for a silent shot.${speaking}
- "intent" says what the shot must show, in plain words a beginner can hand to a video generator. One subject, one simple action.
- "type": "generated" for something a generator makes; "user-media" when one of the user's own files fits (then set "media" to that file's exact name); "card" for a text card; "filler" for a simple zoom on a still; "avatar" only if the user asked to present on camera.
- The first shot must be a strong hook. Never promise results the idea can't deliver.
Reply with ONE JSON object and nothing else:
{"shots": [{"beat": string, "role": "hook"|"body"|"cta", "type": string, "intent": string, "seconds": number, "line": string, "roman": string, "media": string}]}`,
    },
    {
      role: "user",
      content: `Idea: ${input.idea}\nStory format: ${format.id} (${format.why})\nAnswers:\n${qaLines(input)}\nFiles the user has:\n${mediaLines(input)}`,
    },
  ];
}

/** Ask, validate, and give the model one chance to fix an answer that doesn't fit. */
async function askJson<T>(provider: LlmProvider, messages: ChatMessage[], schema: z.ZodType<T, z.ZodTypeDef, unknown>, signal?: AbortSignal): Promise<T> {
  let thread = messages;
  let lastProblem = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const reply = await provider.complete(thread, { signal, temperature: attempt === 0 ? 0.4 : 0.1 });
    try {
      return schema.parse(extractJson(reply));
    } catch (e) {
      lastProblem = e instanceof z.ZodError ? e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") : (e as Error).message;
      thread = [...messages, { role: "assistant", content: reply }, { role: "user", content: `That reply was not usable (${lastProblem}). Reply again with ONLY the JSON object, exactly in the format asked.` }];
    }
  }
  throw new LlmError(`The AI didn't answer in a form I can use (${lastProblem}). Try again, or pick a stronger model in your account menu (bottom left).`, "bad-output");
}

const knownFormat = (p: FormatPick): FormatPick => (p.id === CUSTOM_FORMAT_ID || getFormat(p.id) ? p : { id: CUSTOM_FORMAT_ID, why: p.why });

export function llmBrain(provider: LlmProvider): Brain {
  return {
    id: "llm",
    label: `AI via ${provider.label}`,

    async assess(input, signal): Promise<Assessment> {
      const r = await askJson(provider, assessPrompt(input), AssessmentSchema, signal);
      const avoid = new Set(input.avoidFormatIds ?? []);
      const format = knownFormat(r.format);
      return {
        scores: r.scores,
        reasons: r.reasons,
        summary: r.summary,
        missing: r.missing.slice(0, 3),
        format: avoid.has(format.id) ? { id: CUSTOM_FORMAT_ID, why: format.why } : format,
        alternatives: r.alternatives.map(knownFormat).filter((a) => a.id !== format.id && !avoid.has(a.id)).slice(0, 2),
      };
    },

    async plan(input, format, signal): Promise<PlanDraft> {
      const r = await askJson(provider, planPrompt(input, format), PlanSchema, signal);
      const byName = new Map(input.media.filter((m) => m.kind !== "audio").map((m) => [m.name.toLowerCase(), m]));
      const scenes = r.shots.slice(0, 12).map((s) => {
        const file = s.media ? byName.get(s.media.toLowerCase()) : undefined;
        const ms = Math.round(Math.min(8, Math.max(1.5, s.seconds)) * 1000);
        const outMs = file ? Math.min(ms, file.durationMs ?? ms) : 0;
        return makeScene({
          beat: s.beat,
          role: s.role,
          type: file ? "user-media" : s.type === "user-media" ? "generated" : s.type,
          intent: s.intent,
          slot: { targetMs: ms, status: file ? "filled" : "empty", flags: [] },
          source: file ? { mediaId: file.id, inMs: 0, outMs: Math.max(outMs, 500) } : undefined,
          provenance: { by: "ai", reason: "written by the AI from your idea" },
        });
      });
      return {
        language: input.language,
        scenes,
        lines: scenes.map((sc, i) => ({ id: crypto.randomUUID(), sceneId: sc.id, text: r.shots[i].line, roman: r.shots[i].roman || undefined, voice: "none" as const })),
      };
    },
  };
}
