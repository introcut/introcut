// The story formats Introcut can pick from (feature B3). Each is a list of beats; shares add up to 1.
// "custom" is used when nothing fits: the AI then invents its own beats.
export interface FormatBeat {
  kind: string;
  role: "hook" | "body" | "cta";
  share: number;
}

export interface StoryFormat {
  id: string;
  name: string;
  /** Plain-language "good for". */
  goodFor: string;
  /** Words in an idea that hint at this format (rules mode only; the AI doesn't use these). */
  hints: string[];
  beats: FormatBeat[];
}

export const FORMATS: StoryFormat[] = [
  {
    id: "mini-story",
    name: "Mini story",
    goodFor: "a character, a small problem and a surprising turn",
    hints: ["story", "monkey", "cat", "dog", "boy", "girl", "man", "woman", "once", "adventure", "funny", "kahani"],
    beats: [
      { kind: "hook", role: "hook", share: 0.15 },
      { kind: "setup", role: "body", share: 0.25 },
      { kind: "problem", role: "body", share: 0.25 },
      { kind: "twist", role: "body", share: 0.2 },
      { kind: "payoff", role: "cta", share: 0.15 },
    ],
  },
  {
    id: "problem-reveal",
    name: "Problem → reveal",
    goodFor: "showing a pain, then the fix",
    hints: ["problem", "struggle", "mistake", "stop", "tired", "fix", "solution", "secret", "tool", "app"],
    beats: [
      { kind: "pain", role: "hook", share: 0.2 },
      { kind: "worse", role: "body", share: 0.2 },
      { kind: "reveal", role: "body", share: 0.35 },
      { kind: "result", role: "body", share: 0.15 },
      { kind: "cta", role: "cta", share: 0.1 },
    ],
  },
  {
    id: "before-after",
    name: "Before / after",
    goodFor: "a visible change, such as a build, a clean-up or a result",
    hints: ["before", "after", "transform", "makeover", "clean", "build", "grow", "result", "glow"],
    beats: [
      { kind: "before", role: "hook", share: 0.25 },
      { kind: "process", role: "body", share: 0.35 },
      { kind: "after", role: "body", share: 0.3 },
      { kind: "cta", role: "cta", share: 0.1 },
    ],
  },
  {
    id: "three-things",
    name: "3 things",
    goodFor: "tips, facts or a list",
    hints: ["tips", "ways", "things", "reasons", "facts", "mistakes", "list", "top"],
    beats: [
      { kind: "promise", role: "hook", share: 0.15 },
      { kind: "item-1", role: "body", share: 0.22 },
      { kind: "item-2", role: "body", share: 0.22 },
      { kind: "item-3", role: "body", share: 0.22 },
      { kind: "cta", role: "cta", share: 0.19 },
    ],
  },
  {
    id: "pov-cinematic",
    name: "POV / cinematic",
    goodFor: "a mood or a feeling, with little talking",
    hints: ["pov", "cinematic", "mood", "dream", "feel", "night", "rain", "memory", "journey"],
    beats: [
      { kind: "establishing", role: "hook", share: 0.25 },
      { kind: "moment-1", role: "body", share: 0.25 },
      { kind: "moment-2", role: "body", share: 0.3 },
      { kind: "closing", role: "cta", share: 0.2 },
    ],
  },
  {
    id: "how-to",
    name: "How-to demo",
    goodFor: "teaching a skill step by step, including screen recordings",
    hints: ["how to", "how-to", "learn", "teach", "guide", "tutorial", "steps", "plant", "cook", "make", "use", "kasari"],
    beats: [
      { kind: "result-first", role: "hook", share: 0.15 },
      { kind: "step-1", role: "body", share: 0.22 },
      { kind: "step-2", role: "body", share: 0.22 },
      { kind: "step-3", role: "body", share: 0.22 },
      { kind: "cta", role: "cta", share: 0.19 },
    ],
  },
];

export const CUSTOM_FORMAT_ID = "custom";
export const getFormat = (id: string) => FORMATS.find((f) => f.id === id);
export const formatName = (id: string) => (id === CUSTOM_FORMAT_ID ? "Custom structure" : (getFormat(id)?.name ?? id));

/** Beat lengths for a format at a given total length. */
export function beatsFor(formatId: string, totalMs: number): { id: string; kind: string; targetMs: number }[] {
  const f = getFormat(formatId);
  if (!f) return [];
  return f.beats.map((b, i) => ({ id: `${i + 1}-${b.kind}`, kind: b.kind, targetMs: Math.round(b.share * totalMs) }));
}
