import { create } from "zustand";
import { applyOp, sceneFromMedia, type Actor, type ApplyResult, type Op } from "../model/ops";
import { emptyProject, ProjectSchema, type MediaOrigin, type Project } from "../model/types";
import { repairProject } from "../model/validate";
import { ingestFile } from "../media/ingest";
import { makeDemoFiles } from "../media/demo";
import * as storage from "../storage/opfs";
import { emptyHistory, record, redo as redoHistory, undo as undoHistory, type History } from "./history";

/** Browser-only things that can't live in the JSON: the actual file, its object URL and thumbnail. */
export interface Asset {
  url: string;
  thumb?: string;
  file: File;
}

export type SaveStatus = "loading" | "saved" | "saving" | "error" | "unavailable";

interface DispatchOptions {
  actor?: Actor;
  /** Edits with the same key close together (e.g. dragging a slider) become one undo step. */
  coalesce?: string;
}

interface State {
  project: Project;
  assets: Record<string, Asset>;
  history: History;
  selectedSceneId: string | null;
  playheadMs: number;
  playing: boolean;
  busy: number;
  errors: string[];
  ready: boolean;
  save: { status: SaveStatus; message?: string };
  storageInfo: { usage?: number; quota?: number };

  init: () => Promise<void>;
  dispatch: (op: Op, opts?: DispatchOptions) => ApplyResult;
  dispatchMany: (ops: Op[], opts?: DispatchOptions) => void;
  undo: () => void;
  redo: () => void;

  addFiles: (files: File[], origin?: MediaOrigin, durationHintMs?: number) => Promise<void>;
  addSceneFromMedia: (mediaId: string) => void;
  addAllToTimeline: () => void;
  loadDemo: () => Promise<void>;

  newProject: () => Promise<void>;
  importProjectFile: (file: File) => Promise<void>;
  exportProject: () => void;
  clearAllData: () => Promise<void>;
  refreshStorage: () => Promise<void>;

  selectScene: (id: string | null) => void;
  setPlayhead: (ms: number) => void;
  setPlaying: (p: boolean) => void;
  dismissErrors: () => void;
}

const messageOf = (e: unknown) => (e instanceof Error ? e.message : String(e));

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function revokeAll(assets: Record<string, Asset>) {
  for (const a of Object.values(assets)) URL.revokeObjectURL(a.url);
}

/** Pull media files (and thumbnails) back out of browser storage for every media item in the project. */
async function loadAssetsFor(project: Project): Promise<Record<string, Asset>> {
  const out: Record<string, Asset> = {};
  if (!storage.storageAvailable()) return out;
  for (const m of project.media) {
    try {
      const file = await storage.loadMediaFile(m.id, m.name, m.probe.mime);
      if (!file) continue; // missing: the bin offers to re-link it
      const url = URL.createObjectURL(file);
      const thumb = m.kind === "photo" ? url : m.kind === "video" ? await storage.loadThumb(m.id) : undefined;
      out[m.id] = { url, thumb, file };
    } catch {
      /* treat as missing */
    }
  }
  return out;
}

let initPromise: Promise<void> | null = null;

export const useStore = create<State>()((set, get) => {
  const pushError = (msg: string) => set((s) => ({ errors: [...s.errors, msg] }));

  const validSelection = (project: Project) => {
    const id = get().selectedSceneId;
    return id && project.scenes.some((s) => s.id === id) ? id : null;
  };

  /** Keep a media file (and its thumbnail) in browser storage so it survives a refresh. */
  const persistAsset = async (id: string, file: File, kind: string, thumb?: string) => {
    if (!storage.storageAvailable()) return;
    try {
      await storage.saveMediaFile(id, file);
      if (thumb && kind === "video") await storage.saveThumb(id, thumb);
      void get().refreshStorage();
    } catch (e) {
      pushError(`"${file.name}" could not be saved in browser storage (${messageOf(e)}). It will be gone after a refresh.`);
    }
  };

  const replaceProject = async (project: Project) => {
    revokeAll(get().assets);
    const assets = await loadAssetsFor(project);
    set({ project, assets, history: emptyHistory(), selectedSceneId: null, playheadMs: 0, playing: false });
    if (storage.storageAvailable()) void storage.collectGarbage(project.media.map((m) => m.id)).then(() => get().refreshStorage());
  };

  return {
    project: emptyProject(),
    assets: {},
    history: emptyHistory(),
    selectedSceneId: null,
    playheadMs: 0,
    playing: false,
    busy: 0,
    errors: [],
    ready: false,
    save: { status: "loading" },
    storageInfo: {},

    init: () =>
      (initPromise ??= (async () => {
        if (!storage.storageAvailable()) {
          set({ ready: true, save: { status: "unavailable", message: "This browser can't save projects. Export the project to keep your work." } });
          return;
        }
        void storage.requestPersistence();
        try {
          const json = await storage.loadProjectJson();
          if (json) {
            const parsed = ProjectSchema.safeParse(parseJson(json));
            if (parsed.success) {
              const { project, notes } = repairProject(parsed.data);
              set({ project, assets: await loadAssetsFor(project) });
              notes.forEach(pushError);
              void storage.collectGarbage(project.media.map((m) => m.id));
            } else {
              await storage.backupBrokenProject(json);
              pushError("Your saved project could not be read. A copy was kept in browser storage and a new project was started.");
            }
          }
          set({ save: { status: "saved" } });
        } catch (e) {
          set({ save: { status: "error", message: `Could not read saved project: ${messageOf(e)}` } });
        }
        set({ ready: true });
        void get().refreshStorage();
      })()),

    dispatch: (op, opts = {}) => {
      const { project, history } = get();
      const res = applyOp(project, op, opts.actor ?? "user");
      if (!res.changed) return res;
      set({ project: res.project, history: record(history, project, opts.coalesce) });
      set({ selectedSceneId: validSelection(res.project) });
      return res;
    },

    /** Several ops as ONE undo step. */
    dispatchMany: (ops, opts = {}) => {
      const { project, history } = get();
      let current = project;
      for (const op of ops) current = applyOp(current, op, opts.actor ?? "user").project;
      if (current === project) return;
      set({ project: current, history: record(history, project, opts.coalesce) });
      set({ selectedSceneId: validSelection(current) });
    },

    undo: () => {
      const r = undoHistory(get().history, get().project);
      if (!r) return;
      set({ project: r.project, history: r.history });
      set({ selectedSceneId: validSelection(r.project) });
    },

    redo: () => {
      const r = redoHistory(get().history, get().project);
      if (!r) return;
      set({ project: r.project, history: r.history });
      set({ selectedSceneId: validSelection(r.project) });
    },

    addFiles: async (files, origin = "unknown", durationHintMs) => {
      set((s) => ({ busy: s.busy + files.length }));
      for (const file of files) {
        try {
          const { project, assets } = get();
          // A file dropped again after an import (or a storage loss) re-links to the item it matches by name and size.
          const missing = project.media.find((m) => !assets[m.id] && m.name === file.name && m.probe.sizeBytes === file.size);
          const { item, asset } = await ingestFile(file, origin, durationHintMs);
          if (missing) {
            set((s) => ({ assets: { ...s.assets, [missing.id]: asset } }));
            void persistAsset(missing.id, file, missing.kind, asset.thumb);
          } else {
            set((s) => ({ assets: { ...s.assets, [item.id]: asset } }));
            get().dispatch({ type: "addMedia", item });
            void persistAsset(item.id, file, item.kind, asset.thumb);
          }
        } catch (e) {
          pushError(messageOf(e));
        } finally {
          set((s) => ({ busy: s.busy - 1 }));
        }
      }
    },

    addSceneFromMedia: (mediaId) => {
      const { project } = get();
      const item = project.media.find((m) => m.id === mediaId);
      const scene = item && sceneFromMedia(item, project.scenes.length === 0);
      if (!scene) return;
      get().dispatch({ type: "addScene", scene });
      set({ selectedSceneId: scene.id });
    },

    addAllToTimeline: () => {
      const { project } = get();
      const ops: Op[] = [];
      let count = project.scenes.length;
      for (const item of project.media) {
        if (project.scenes.some((s) => s.source?.mediaId === item.id)) continue;
        const scene = sceneFromMedia(item, count === 0);
        if (scene) {
          ops.push({ type: "addScene", scene });
          count++;
        }
      }
      get().dispatchMany(ops);
    },

    loadDemo: async () => {
      await get().addFiles(await makeDemoFiles());
      get().addAllToTimeline();
    },

    newProject: () => replaceProject(emptyProject()),

    importProjectFile: async (file) => {
      const json = parseJson(await file.text());
      if (json === undefined) return pushError(`${file.name} is not valid JSON.`);
      const parsed = ProjectSchema.safeParse(json);
      if (!parsed.success) {
        const why = parsed.error.issues.slice(0, 3).map((i) => `${i.path.join(".") || "(top level)"}: ${i.message}`);
        return pushError(`${file.name} is not an Introcut project (${why.join("; ")}).`);
      }
      const { project, notes } = repairProject(parsed.data);
      await replaceProject(project);
      notes.forEach(pushError);
      const missing = project.media.filter((m) => !get().assets[m.id]).length;
      if (missing) pushError(`Project imported. ${missing} media file${missing > 1 ? "s are" : " is"} missing: drop the original files into the media bin and they will re-link.`);
    },

    exportProject: () => {
      const { project } = get();
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      const slug = project.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
      a.href = URL.createObjectURL(blob);
      a.download = `${slug}.introcut.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },

    clearAllData: async () => {
      if (storage.storageAvailable()) await storage.clearAll();
      await replaceProject(emptyProject());
    },

    refreshStorage: async () => set({ storageInfo: await storage.estimate() }),

    selectScene: (id) => set({ selectedSceneId: id }),
    setPlayhead: (ms) => set({ playheadMs: ms }),
    setPlaying: (p) => set({ playing: p }),
    dismissErrors: () => set({ errors: [] }),
  };
});
