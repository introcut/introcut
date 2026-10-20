import type { Project } from "../../model/types";
import { loadLlmConfig, isConfigured } from "../llm/config";
import { openAiCompatProvider } from "../llm/openaiCompat";
import { llmBrain } from "./llm";
import { rulesBrain } from "./rules";
import type { Brain, BrainInput } from "./types";

/** The brain for this project's setting. "local" (in-browser model) isn't built, so it falls back to basic mode. */
export function getBrain(mode: Project["settings"]["llm"]): Brain {
  if (mode === "user-key") {
    const config = loadLlmConfig();
    if (isConfigured(config)) return llmBrain(openAiCompatProvider(config));
  }
  return rulesBrain;
}

export function inputFromProject(p: Project, avoidFormatIds?: string[]): BrainInput {
  return {
    idea: p.brief.idea,
    language: p.settings.language,
    targetSec: p.settings.targetDurationSec,
    qa: p.brief.qa,
    media: p.media.map((m) => ({ id: m.id, name: m.name, kind: m.kind, origin: m.origin, durationMs: m.probe.durationMs })),
    avoidFormatIds,
  };
}
