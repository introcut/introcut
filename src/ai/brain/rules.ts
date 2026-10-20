// Basic mode: no AI. It can't judge or write, so it doesn't pretend to. It picks a format by keywords, asks what's obviously
// missing, and lays out an empty shot list from the format's beats for the user to fill in.
import { CUSTOM_FORMAT_ID, FORMATS, getFormat } from "../formats";
import { makeScene } from "../../model/types";
import type { Assessment, Brain, BrainInput, FormatPick, PlanDraft } from "./types";

function rank(idea: string, avoid: string[]): FormatPick[] {
  const text = idea.toLowerCase();
  const scored = FORMATS.filter((f) => !avoid.includes(f.id))
    .map((f) => ({ f, n: f.hints.filter((h) => text.includes(h)).length }))
    .sort((a, b) => b.n - a.n);
  return scored.map(({ f, n }) => ({
    id: f.id,
    why:
      n > 0
        ? `Your idea mentions words that fit "${f.name}" (${f.goodFor}).`
        : `"${f.name}" works for ${f.goodFor}. It's a default, since basic mode can't read the idea deeply.`,
  }));
}

export const rulesBrain: Brain = {
  id: "rules",
  label: "Basic mode (no AI)",

  async assess(input: BrainInput): Promise<Assessment> {
    const picks = rank(input.idea, input.avoidFormatIds ?? []);
    const missing: Assessment["missing"] = [];
    const words = input.idea.trim().split(/\s+/).filter(Boolean).length;
    const answered = (q: string) => input.qa.some((x) => x.q === q && x.a.trim() !== "");
    if (words < 6 && !answered("What happens in the video?"))
      missing.push({ ask: "What happens in the video?", fixHint: "Say who or what we see, and what they do, in one or two sentences." });
    if (!answered("Who is it for?")) missing.push({ ask: "Who is it for?", fixHint: "For example: Nepali farmers, new coders, anyone who loves cats." });
    return {
      reasons: {},
      missing: missing.slice(0, 3),
      format: picks[0] ?? { id: CUSTOM_FORMAT_ID, why: "No other format left to try." },
      alternatives: picks.slice(1, 3),
      summary: "Basic mode can't judge whether free video tools can pull this off. Connect an AI in Settings to get honest scores.",
    };
  },

  async plan(input: BrainInput, format: FormatPick): Promise<PlanDraft> {
    const f = getFormat(format.id) ?? FORMATS[0];
    const totalMs = input.targetSec * 1000;
    const scenes = f.beats.map((b, i) =>
      makeScene({
        beat: b.kind,
        role: b.role,
        type: "generated",
        intent: `Beat ${i + 1}: ${b.kind.replace(/-/g, " ")}. Describe what we should see here.`,
        slot: { targetMs: Math.round(b.share * totalMs), status: "empty", flags: [] },
        provenance: { by: "ai", reason: "basic-mode skeleton" },
      }),
    );
    // Matching your files to beats needs the AI (or Milestone 5), so basic mode leaves that to you.
    return {
      language: input.language,
      scenes,
      lines: scenes.map((s) => ({ id: crypto.randomUUID(), sceneId: s.id, text: "", voice: "none" as const })),
      note: "Basic mode made an empty shot list from the format. Write each line yourself, or connect an AI in Settings and run this again.",
    };
  },
};
