import { create } from "zustand";
import { getBrain, inputFromProject } from "../ai/brain";
import { overallScore, type FormatPick } from "../ai/brain/types";
import { beatsFor, CUSTOM_FORMAT_ID } from "../ai/formats";
import { LlmError } from "../ai/llm/types";
import { useStore } from "../store/useStore";
import { useUi } from "./uiStore";

/** Progress of the AI's work (idea check, script writing). Only the results go into the project; this is just "what is it doing now". */
interface BrainState {
  status: "idle" | "assessing" | "planning";
  error: string | null;
  /** Which brain produced the current result, for the honest label on screen. */
  brainLabel: string;
  /** Runner-up formats from the last check (not saved; "try another approach" re-checks if empty). */
  alternatives: FormatPick[];
  rejectedFormats: string[];
  planNote: string | null;
  assess: (opts?: { avoidCurrentFormat?: boolean }) => Promise<void>;
  tryAnotherFormat: () => Promise<void>;
  writeScript: () => Promise<void>;
  cancel: () => void;
}

let controller: AbortController | null = null;

const messageOf = (e: unknown) => (e instanceof LlmError ? e.message : e instanceof Error ? e.message : "Something went wrong.");

export const useBrain = create<BrainState>()((set, get) => ({
  status: "idle",
  error: null,
  brainLabel: "",
  alternatives: [],
  rejectedFormats: [],
  planNote: null,

  async assess(opts = {}) {
    if (get().status !== "idle") return;
    const { project, dispatchMany } = useStore.getState();
    if (project.brief.idea.trim() === "") return;
    const rejected = opts.avoidCurrentFormat && project.format ? [...get().rejectedFormats, project.format.id] : [];
    const brain = getBrain(project.settings.llm);
    controller = new AbortController();
    set({ status: "assessing", error: null, brainLabel: brain.label, rejectedFormats: rejected });
    try {
      const a = await brain.assess(inputFromProject(project, rejected), controller.signal);
      // The idea may have been edited while the AI was thinking; only keep the result if it still matches.
      if (useStore.getState().project.brief.idea !== project.brief.idea) return;
      const totalMs = project.settings.targetDurationSec * 1000;
      dispatchMany(
        [
        {
          type: "setReadiness",
          readiness: {
            scores: a.scores,
            overall: a.scores ? overallScore(a.scores) : undefined,
            reasons: { ...a.reasons, ...(a.summary ? { summary: a.summary } : {}) },
            missing: a.missing,
            proceededAnyway: false,
          },
        },
        { type: "setFormat", format: { id: a.format.id, why: a.format.why, beats: beatsFor(a.format.id, totalMs) } },
        ],
        { actor: "ai" },
      );
      set({ alternatives: a.alternatives });
    } catch (e) {
      if (!(e instanceof LlmError && e.kind === "aborted")) set({ error: messageOf(e) });
    } finally {
      controller = null;
      set({ status: "idle" });
    }
  },

  async tryAnotherFormat() {
    const { alternatives, status } = get();
    if (status !== "idle") return;
    const { project, dispatch } = useStore.getState();
    const [next, ...rest] = alternatives;
    if (!next) return get().assess({ avoidCurrentFormat: true });
    const current = project.format?.id;
    dispatch({ type: "setFormat", format: { id: next.id, why: next.why, beats: beatsFor(next.id, project.settings.targetDurationSec * 1000) } }, { actor: "ai" });
    set({ alternatives: rest, rejectedFormats: current ? [...get().rejectedFormats, current] : get().rejectedFormats });
  },

  async writeScript() {
    if (get().status !== "idle") return;
    const { project, dispatch } = useStore.getState();
    const brain = getBrain(project.settings.llm);
    const format: FormatPick = project.format ? { id: project.format.id, why: project.format.why } : { id: CUSTOM_FORMAT_ID, why: "" };
    controller = new AbortController();
    set({ status: "planning", error: null, brainLabel: brain.label, planNote: null });
    try {
      const draft = await brain.plan(inputFromProject(project), format, controller.signal);
      const r = dispatch({ type: "setPlan", language: draft.language, scenes: draft.scenes, lines: draft.lines }, { actor: "ai" });
      if (!r.changed) throw new Error(r.reason ?? "The plan couldn't be added.");
      set({ planNote: draft.note ?? null });
      useUi.getState().go("timeline");
    } catch (e) {
      if (!(e instanceof LlmError && e.kind === "aborted")) set({ error: messageOf(e) });
    } finally {
      controller = null;
      set({ status: "idle" });
    }
  },

  cancel() {
    controller?.abort();
  },
}));
