import { create } from "zustand";
import { downloadBlob, exportProblems, exportVideo, type ExportProgress, type ExportResult } from "../export/exportVideo";
import { useStore } from "../store/useStore";

/** Progress of making the video file. The file itself is kept in memory only until you leave the project or make another. */
interface ExportState {
  status: "idle" | "running" | "done" | "error";
  projectId: string | null;
  progress: ExportProgress | null;
  result: ExportResult | null;
  error: string | null;
  run: () => Promise<void>;
  cancel: () => void;
  download: () => void;
  reset: () => void;
}

let controller: AbortController | null = null;

const slug = (name: string) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "introcut";

export const useExport = create<ExportState>()((set, get) => ({
  status: "idle",
  projectId: null,
  progress: null,
  result: null,
  error: null,

  async run() {
    if (get().status === "running") return;
    const { project, assets, currentId } = useStore.getState();
    const files = Object.fromEntries(Object.entries(assets).map(([id, a]) => [id, a.file]));
    const problems = exportProblems(project, files);
    if (problems.length) return set({ status: "error", error: problems.join(" "), projectId: currentId, result: null });
    controller = new AbortController();
    set({ status: "running", projectId: currentId, progress: null, result: null, error: null });
    try {
      const result = await exportVideo(project, files, { signal: controller.signal, onProgress: (progress) => set({ progress }) });
      set({ status: "done", result });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") set({ status: "idle", progress: null });
      else set({ status: "error", error: e instanceof Error ? e.message : "The video could not be made." });
    } finally {
      controller = null;
    }
  },

  cancel() {
    controller?.abort();
  },

  download() {
    const { result } = get();
    if (result) downloadBlob(result.blob, `${slug(useStore.getState().project.name)}.mp4`);
  },

  reset: () => set({ status: "idle", progress: null, result: null, error: null, projectId: null }),
}));
