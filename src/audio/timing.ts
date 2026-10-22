import type { Scene } from "../model/types";

type Word = Scene["captions"]["words"][number];

/**
 * Spread a line's words over `durationMs` in proportion to their length. This is an ESTIMATE: real voices speed up and slow down.
 * Later milestones replace it with measured timings (aligning the known text to the audio).
 */
export function estimateWords(text: string, durationMs: number, leadMs = 120, tailMs = 200): Word[] {
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 0 || durationMs <= leadMs + tailMs) return [];
  const span = durationMs - leadMs - tailMs;
  const weights = parts.map((w) => Math.max(2, [...w].length) + 1); // +1: a tiny pause after every word
  const total = weights.reduce((a, b) => a + b, 0);
  let t = leadMs;
  return parts.map((w, i) => {
    const len = (weights[i] / total) * span;
    const word = { text: w, startMs: Math.round(t), endMs: Math.round(t + len * 0.92) };
    t += len;
    return word;
  });
}
