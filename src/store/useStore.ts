import { create } from "zustand";
import { emptyProject, PHOTO_DEFAULT_MS, type MediaItem, type MediaOrigin, type Project, type Scene } from "../model/types";
import { ingestFile } from "../media/ingest";
import { makeDemoFiles } from "../media/demo";

/** Browser-only things that can't live in the JSON: the actual file, its object URL and thumbnail. */
export interface Asset {
  url: string;
  thumb?: string;
  file: File;
}

interface State {
  project: Project;
  assets: Record<string, Asset>;
  selectedSceneId: string | null;
  playheadMs: number;
  playing: boolean;
  busy: number;
  errors: string[];

  addFiles: (files: File[], origin?: MediaOrigin, durationHintMs?: number) => Promise<void>;
  addScene: (mediaId: string) => void;
  addAllToTimeline: () => void;
  loadDemo: () => Promise<void>;
  selectScene: (id: string | null) => void;
  setPlayhead: (ms: number) => void;
  setPlaying: (p: boolean) => void;
  dismissErrors: () => void;
}

function sceneFor(item: MediaItem, isFirst: boolean): Scene | null {
  if (item.kind === "audio") return null; // audio tracks (voice, music) arrive in Milestone 6
  const outMs = item.kind === "photo" ? PHOTO_DEFAULT_MS : (item.probe.durationMs ?? 5000);
  return {
    id: crypto.randomUUID(),
    role: isFirst ? "hook" : "body",
    type: "user-media",
    source: { mediaId: item.id, inMs: 0, outMs },
    provenance: { by: "user" },
  };
}

export const useStore = create<State>()((set, get) => ({
  project: emptyProject(),
  assets: {},
  selectedSceneId: null,
  playheadMs: 0,
  playing: false,
  busy: 0,
  errors: [],

  addFiles: async (files, origin = "unknown", durationHintMs) => {
    set((s) => ({ busy: s.busy + files.length }));
    for (const file of files) {
      try {
        const { item, asset } = await ingestFile(file, origin, durationHintMs);
        set((s) => ({
          project: { ...s.project, media: [...s.project.media, item] },
          assets: { ...s.assets, [item.id]: asset },
        }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        set((s) => ({ errors: [...s.errors, msg] }));
      } finally {
        set((s) => ({ busy: s.busy - 1 }));
      }
    }
  },

  addScene: (mediaId) => {
    const { project } = get();
    const item = project.media.find((m) => m.id === mediaId);
    if (!item) return;
    const scene = sceneFor(item, project.scenes.length === 0);
    if (!scene) return;
    set({ project: { ...project, scenes: [...project.scenes, scene] }, selectedSceneId: scene.id });
  },

  addAllToTimeline: () => {
    const { project } = get();
    const added: Scene[] = [];
    for (const item of project.media) {
      if (project.scenes.some((s) => s.source.mediaId === item.id)) continue;
      const scene = sceneFor(item, project.scenes.length + added.length === 0);
      if (scene) added.push(scene);
    }
    if (added.length) set({ project: { ...project, scenes: [...project.scenes, ...added] } });
  },

  loadDemo: async () => {
    await get().addFiles(await makeDemoFiles());
    get().addAllToTimeline();
  },

  selectScene: (id) => set({ selectedSceneId: id }),
  setPlayhead: (ms) => set({ playheadMs: ms }),
  setPlaying: (p) => set({ playing: p }),
  dismissErrors: () => set({ errors: [] }),
}));
