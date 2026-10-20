import { create } from "zustand";
import { applyOp, sceneFromMedia, type Actor, type ApplyResult, type Op } from "../model/ops";
import { emptyProject, ProjectSchema, type MediaOrigin, type Project } from "../model/types";
import { repairProject } from "../model/validate";
import { ingestFile } from "../media/ingest";
import { makeDemoFiles } from "../media/demo";
import * as storage from "../storage/opfs";
import { flushPending } from "../storage/pending";
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
  /** Whose projects these are (Google account or "guest"), and which one is open. */
  userKey: string | null;
  currentId: string | null;
  projects: ProjectSummary[];

  enterUser: (userKey: string) => Promise<void>;
  leaveUser: () => Promise<void>;
  createProject: () => Promise<string>;
  openProject: (id: string) => Promise<void>;
  /** Leave the open project (an empty one is discarded). */
  closeProject: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  noteSaved: (project: Project) => void;

  init: () => Promise<void>;
  dispatch: (op: Op, opts?: DispatchOptions) => ApplyResult;
  dispatchMany: (ops: Op[], opts?: DispatchOptions) => void;
  undo: () => void;
  redo: () => void;

  addFiles: (files: File[], origin?: MediaOrigin, durationHintMs?: number) => Promise<void>;
  addSceneFromMedia: (mediaId: string) => void;
  addAllToTimeline: () => void;
  loadDemo: () => Promise<void>;

  importProjectFile: (file: File) => Promise<boolean>;
  exportProject: () => void;
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
async function loadAssetsFor(userKey: string, project: Project): Promise<Record<string, Asset>> {
  const out: Record<string, Asset> = {};
  if (!storage.storageAvailable()) return out;
  for (const m of project.media) {
    try {
      const file = await storage.loadMediaFile(userKey, project.id, m.id, m.name, m.probe.mime);
      if (!file) continue; // missing: the bin offers to re-link it
      const url = URL.createObjectURL(file);
      const thumb = m.kind === "photo" ? url : m.kind === "video" ? await storage.loadThumb(userKey, project.id, m.id) : undefined;
      out[m.id] = { url, thumb, file };
    } catch {
      /* treat as missing */
    }
  }
  return out;
}

/** What the Projects list needs to know about a project, without loading its media. */
export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  idea: string;
  media: number;
  /** Planned or placed scenes (shots). */
  shots: number;
  /** Shots that already have a clip. */
  filled: number;
  scriptLines: number;
  checked: boolean;
  formatId?: string;
}

export function summarize(p: Project): ProjectSummary {
  return {
    id: p.id,
    name: p.name,
    updatedAt: p.updatedAt,
    idea: p.brief.idea,
    media: p.media.length,
    shots: p.scenes.length,
    filled: p.scenes.filter((x) => x.source).length,
    scriptLines: p.script.lines.filter((l) => l.text.trim() !== "").length,
    checked: !!p.readiness,
    formatId: p.format?.id,
  };
}

const isEmptyProject = (p: Project) => p.brief.idea.trim() === "" && p.media.length === 0 && p.scenes.length === 0;

let initPromise: Promise<void> | null = null;

export const useStore = create<State>()((set, get) => {
  const pushError = (msg: string) => set((s) => ({ errors: [...s.errors, msg] }));

  const validSelection = (project: Project) => {
    const id = get().selectedSceneId;
    return id && project.scenes.some((s) => s.id === id) ? id : null;
  };

  /** Keep a media file (and its thumbnail) in browser storage so it survives a refresh. */
  const persistAsset = async (userKey: string, projectId: string, id: string, file: File, kind: string, thumb?: string) => {
    if (!storage.storageAvailable()) return;
    try {
      await storage.saveMediaFile(userKey, projectId, id, file);
      if (thumb && kind === "video") await storage.saveThumb(userKey, projectId, id, thumb);
      void get().refreshStorage();
    } catch (e) {
      pushError(`"${file.name}" could not be saved in browser storage (${messageOf(e)}). It will be gone after a refresh.`);
    }
  };

  const showProject = async (userKey: string, project: Project) => {
    revokeAll(get().assets);
    const assets = await loadAssetsFor(userKey, project);
    set({ project, currentId: project.id, assets, history: emptyHistory(), selectedSceneId: null, playheadMs: 0, playing: false });
    if (storage.storageAvailable()) void storage.collectGarbage(userKey, project.id, project.media.map((m) => m.id)).then(() => get().refreshStorage());
  };

  const upsertSummary = (project: Project) =>
    set((s) => {
      const sum = summarize(project);
      const rest = s.projects.filter((p) => p.id !== sum.id);
      return { projects: [sum, ...rest].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
    });

  const parseProject = (json: string) => {
    const parsed = ProjectSchema.safeParse(parseJson(json));
    return parsed.success ? repairProject(parsed.data) : null;
  };

  const clearOpen = () => {
    revokeAll(get().assets);
    set({ currentId: null, project: emptyProject(), assets: {}, history: emptyHistory(), selectedSceneId: null, playing: false, playheadMs: 0 });
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
    userKey: null,
    currentId: null,
    projects: [],

    init: () =>
      (initPromise ??= (async () => {
        if (!storage.storageAvailable()) {
          set({ ready: true, save: { status: "unavailable", message: "This browser can't save projects. Export the project to keep your work." } });
          return;
        }
        void storage.requestPersistence();
        set({ ready: true, save: { status: "saved" } });
        void get().refreshStorage();
      })()),

    /** Sign-in happened: load this person's project list (not the projects themselves). */
    enterUser: async (userKey) => {
      if (get().userKey === userKey) return;
      await flushPending();
      clearOpen();
      set({ userKey, projects: [] });
      if (!storage.storageAvailable()) return;
      try {
        const found = await storage.listProjectJsons(userKey);
        const list: ProjectSummary[] = [];
        for (const f of found) {
          const parsed = parseProject(f.json);
          if (parsed) list.push(summarize(parsed.project));
        }
        // Discard blank drafts left behind by an interrupted session.
        const blank = list.filter((p) => p.idea.trim() === "" && p.media === 0 && p.shots === 0);
        for (const b of blank) void storage.deleteProject(userKey, b.id);
        set({ projects: list.filter((p) => !blank.includes(p)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) });
      } catch (e) {
        set({ save: { status: "error", message: `Could not read your projects: ${messageOf(e)}` } });
      }
    },

    leaveUser: async () => {
      await get().closeProject();
      set({ userKey: null, projects: [] });
    },

    createProject: async () => {
      const userKey = get().userKey ?? "guest";
      await flushPending();
      const project = emptyProject();
      set({ userKey });
      await showProject(userKey, project);
      upsertSummary(project);
      return project.id;
    },

    openProject: async (id) => {
      const { userKey } = get();
      if (!userKey || get().currentId === id) return;
      await flushPending();
      try {
        const json = await storage.loadProjectJson(userKey, id);
        const parsed = json ? parseProject(json) : null;
        if (!json || !parsed) {
          if (json) await storage.backupBrokenProject(userKey, id, json);
          return pushError("That project could not be read. A copy was kept in browser storage.");
        }
        await showProject(userKey, parsed.project);
        parsed.notes.forEach(pushError);
      } catch (e) {
        pushError(`Could not open the project: ${messageOf(e)}`);
      }
    },

    closeProject: async () => {
      const { userKey, currentId, project } = get();
      if (!currentId) return;
      await flushPending();
      if (userKey && isEmptyProject(project)) {
        await storage.deleteProject(userKey, currentId).catch(() => undefined);
        set((s) => ({ projects: s.projects.filter((p) => p.id !== currentId) }));
      }
      clearOpen();
    },

    deleteProject: async (id) => {
      const { userKey, currentId } = get();
      if (!userKey) return;
      await flushPending();
      await storage.deleteProject(userKey, id).catch((e) => pushError(`Could not delete: ${messageOf(e)}`));
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
      if (currentId === id) clearOpen();
      void get().refreshStorage();
    },

    noteSaved: (project) => upsertSummary(project),

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
      if (!get().currentId) await get().createProject();
      const userKey = get().userKey ?? "guest";
      const projectId = get().currentId!;
      set((s) => ({ busy: s.busy + files.length }));
      for (const file of files) {
        try {
          const { project, assets } = get();
          if (project.id !== projectId) break; // the person switched projects while files were being read
          // A file dropped again after an import (or a storage loss) re-links to the item it matches by name and size.
          const missing = project.media.find((m) => !assets[m.id] && m.name === file.name && m.probe.sizeBytes === file.size);
          const { item, asset } = await ingestFile(file, origin, durationHintMs);
          if (missing) {
            set((s) => ({ assets: { ...s.assets, [missing.id]: asset } }));
            void persistAsset(userKey, projectId, missing.id, file, missing.kind, asset.thumb);
          } else {
            set((s) => ({ assets: { ...s.assets, [item.id]: asset } }));
            get().dispatch({ type: "addMedia", item });
            void persistAsset(userKey, projectId, item.id, file, item.kind, asset.thumb);
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

    importProjectFile: async (file) => {
      const json = parseJson(await file.text());
      if (json === undefined) {
        pushError(`${file.name} is not valid JSON.`);
        return false;
      }
      const parsed = ProjectSchema.safeParse(json);
      if (!parsed.success) {
        const why = parsed.error.issues.slice(0, 3).map((i) => `${i.path.join(".") || "(top level)"}: ${i.message}`);
        pushError(`${file.name} is not an Introcut project (${why.join("; ")}).`);
        return false;
      }
      const { project: repaired, notes } = repairProject(parsed.data);
      // An imported file always becomes a NEW project, so it can never overwrite one you already have.
      const project: Project = { ...repaired, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
      const userKey = get().userKey ?? "guest";
      await flushPending();
      set({ userKey });
      await showProject(userKey, project);
      upsertSummary(project);
      if (storage.storageAvailable()) await storage.saveProjectJson(userKey, project.id, JSON.stringify(project)).catch(() => undefined);
      notes.forEach(pushError);
      const missing = project.media.filter((m) => !get().assets[m.id]).length;
      if (missing) pushError(`Project imported. ${missing} file${missing > 1 ? "s are" : " is"} missing: add the original files under "What you sent" and they will re-link.`);
      return true;
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

    refreshStorage: async () => set({ storageInfo: await storage.estimate() }),

    selectScene: (id) => set({ selectedSceneId: id }),
    setPlayhead: (ms) => set({ playheadMs: ms }),
    setPlaying: (p) => set({ playing: p }),
    dismissErrors: () => set({ errors: [] }),
  };
});
