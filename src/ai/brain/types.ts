// What the "brain" takes in and gives back. Two implementations: rules (no AI) and an LLM.
import type { Project, Scene } from "../../model/types";

export type Language = Project["settings"]["language"];

export interface MediaSummary {
  id: string;
  name: string;
  kind: "video" | "photo" | "audio";
  origin: string;
  durationMs?: number;
}

export interface BrainInput {
  idea: string;
  language: Language;
  targetSec: number;
  qa: { q: string; a: string }[];
  media: MediaSummary[];
  /** Formats the user already rejected with "try another approach". */
  avoidFormatIds?: string[];
}

export interface FormatPick {
  id: string;
  why: string;
}

export interface Assessment {
  /** Absent in basic mode: rules can't honestly judge an idea. */
  scores?: { hook: number; clarity: number; feasibility: number; novelty: number };
  reasons: Record<string, string>;
  /** At most 3 (feature B2). */
  missing: { ask: string; fixHint: string }[];
  format: FormatPick;
  /** Runner-ups for "try another approach". */
  alternatives: FormatPick[];
  /** A sentence Introcut says about the idea as a whole. */
  summary: string;
}

export interface PlanDraft {
  language: string;
  scenes: Scene[];
  lines: { id: string; sceneId: string; text: string; roman?: string; voice: "none" }[];
  /** Said to the user, e.g. "Basic mode: write your own lines." */
  note?: string;
}

export interface Brain {
  id: "rules" | "llm";
  label: string;
  assess(input: BrainInput, signal?: AbortSignal): Promise<Assessment>;
  plan(input: BrainInput, format: FormatPick, signal?: AbortSignal): Promise<PlanDraft>;
}

export const overallScore = (s: NonNullable<Assessment["scores"]>) => Math.round((s.hook + s.clarity + s.feasibility + s.novelty) / 4);
