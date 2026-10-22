// Basic mode: no AI. It can't judge or write, so it doesn't pretend to. It picks a format by keywords, asks what's obviously
// missing, and then builds the video from the person's OWN words (it cannot write for them).
import { CUSTOM_FORMAT_ID, FORMATS } from "../formats";
import { compileShots, shotsFromYourWords, type ShotInput } from "../compile";
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
      summary: "Basic mode can't judge whether free video tools can pull this off. Connect your own AI (account menu, bottom left) to get honest scores.",
    };
  },

  async plan(input: BrainInput): Promise<PlanDraft> {
    // Basic mode can't write a script, so it uses the person's own words: the idea plus any answers they gave.
    const texts = [input.idea, ...input.qa.map((x) => x.a).filter((x) => x.trim())];
    let shots: ShotInput[] = shotsFromYourWords(texts);
    // Their photos (not clips) go under the middle lines, in order; the first and last lines stay cards.
    const photos = input.media.filter((m) => m.kind === "photo");
    let next = 0;
    shots = shots.map((s, i) => (i > 0 && i < shots.length - 1 && next < photos.length ? { ...s, media: { id: photos[next++].id, kind: "photo" as const } } : s));
    const { scenes, lines } = compileShots(shots);
    return {
      language: input.language,
      scenes,
      lines,
      note:
        shots.length < 3
          ? "Basic mode used your own words, and there were only a few, so the video is short. Write more of your story, or connect your own AI (account menu, bottom left) to have it written for you."
          : "Basic mode used your own words: each sentence became a card. Connect your own AI (account menu, bottom left) to have the script written for you.",
    };
  },
};
