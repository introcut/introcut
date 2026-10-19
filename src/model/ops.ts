// Edit operations: the ONLY way a project changes.
// User edits, AI edits and undo all go through here, so one set of rules (locks!) covers everything.
import { LOCK_KEYS, makeScene, PHOTO_DEFAULT_MS, type LockKey, type MediaItem, type Project, type Scene } from "./types";

export type Actor = "user" | "ai";

export type Op =
  | { type: "addMedia"; item: MediaItem }
  | { type: "removeMedia"; mediaId: string }
  | { type: "addScene"; scene: Scene; index?: number }
  | { type: "removeScene"; sceneId: string }
  | { type: "moveScene"; sceneId: string; toIndex: number }
  | { type: "trimScene"; sceneId: string; inMs?: number; outMs?: number }
  | { type: "replaceSceneMedia"; sceneId: string; mediaId: string }
  | { type: "setLock"; sceneId: string; lock: LockKey; value: boolean }
  | { type: "renameProject"; name: string };

export interface ApplyResult {
  project: Project;
  /** false if the op was refused (see reason) or did nothing */
  changed: boolean;
  reason?: string;
}

export const MIN_SCENE_MS = 200;
export const PHOTO_MAX_MS = 60_000;

const refuse = (project: Project, reason: string): ApplyResult => ({ project, changed: false, reason });
const done = (project: Project): ApplyResult => ({ project: { ...project, updatedAt: new Date().toISOString() }, changed: true });
const hasAnyLock = (s: Scene) => LOCK_KEYS.some((k) => s.locks[k]);
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** The scene a media item makes by default: videos play in full, photos show for 3 s. Audio isn't a scene. */
export function sceneFromMedia(item: MediaItem, isFirst: boolean, by: Actor = "user"): Scene | null {
  if (item.kind === "audio") return null; // voice and music arrive in Milestone 6
  return makeScene({
    role: isFirst ? "hook" : "body",
    source: { mediaId: item.id, inMs: 0, outMs: defaultOutMs(item) },
    provenance: { by },
  });
}

const defaultOutMs = (item: MediaItem) => (item.kind === "photo" ? PHOTO_DEFAULT_MS : (item.probe.durationMs ?? 5000));

/** Largest allowed outMs for a scene's media. */
const maxOutMs = (item: MediaItem) => (item.kind === "photo" ? PHOTO_MAX_MS : (item.probe.durationMs ?? Infinity));

function mapScene(project: Project, sceneId: string, f: (s: Scene) => Scene): Project {
  return { ...project, scenes: project.scenes.map((s) => (s.id === sceneId ? f(s) : s)) };
}

export function applyOp(project: Project, op: Op, actor: Actor = "user"): ApplyResult {
  const scene = "sceneId" in op ? project.scenes.find((s) => s.id === op.sceneId) : undefined;
  if ("sceneId" in op && !scene) return refuse(project, "scene not found");
  const lockedBy = (key: LockKey) => actor === "ai" && scene?.locks[key];

  switch (op.type) {
    case "addMedia": {
      if (project.media.some((m) => m.id === op.item.id)) return refuse(project, "media already exists");
      return done({ ...project, media: [...project.media, op.item] });
    }

    case "removeMedia": {
      if (!project.media.some((m) => m.id === op.mediaId)) return refuse(project, "media not found");
      const users = project.scenes.filter((s) => s.source?.mediaId === op.mediaId);
      if (actor === "ai" && users.some(hasAnyLock)) return refuse(project, "locked: a scene using this media was edited by the user");
      return done({
        ...project,
        media: project.media.filter((m) => m.id !== op.mediaId),
        scenes: project.scenes.filter((s) => s.source?.mediaId !== op.mediaId),
      });
    }

    case "addScene": {
      if (op.scene.source && !project.media.some((m) => m.id === op.scene.source!.mediaId)) return refuse(project, "scene media not found");
      const at = clamp(op.index ?? project.scenes.length, 0, project.scenes.length);
      const scenes = [...project.scenes];
      scenes.splice(at, 0, { ...op.scene, provenance: { ...op.scene.provenance, by: actor } });
      return done({ ...project, scenes });
    }

    case "removeScene": {
      if (actor === "ai" && hasAnyLock(scene!)) return refuse(project, "locked: scene was edited by the user");
      return done({ ...project, scenes: project.scenes.filter((s) => s.id !== op.sceneId) });
    }

    case "moveScene": {
      if (lockedBy("order")) return refuse(project, "locked: order");
      const from = project.scenes.findIndex((s) => s.id === op.sceneId);
      const to = clamp(op.toIndex, 0, project.scenes.length - 1);
      if (from === to) return refuse(project, "already there");
      const scenes = [...project.scenes];
      const [moved] = scenes.splice(from, 1);
      scenes.splice(to, 0, actor === "user" ? { ...moved, locks: { ...moved.locks, order: true }, provenance: { ...moved.provenance, by: "user" } } : moved);
      return done({ ...project, scenes });
    }

    case "trimScene": {
      if (lockedBy("trim")) return refuse(project, "locked: trim");
      if (!scene!.source) return refuse(project, "scene has no media to trim");
      const item = project.media.find((m) => m.id === scene!.source!.mediaId);
      if (!item) return refuse(project, "media not found");
      const max = maxOutMs(item);
      const src = scene!.source;
      let inMs: number;
      let outMs: number;
      if (item.kind === "photo") {
        inMs = 0;
        outMs = clamp(op.outMs ?? src.outMs, MIN_SCENE_MS, max);
      } else if (op.outMs === undefined) {
        // Only "in" moves: it can never push "out".
        outMs = clamp(src.outMs, MIN_SCENE_MS, max);
        inMs = clamp(op.inMs ?? src.inMs, 0, outMs - MIN_SCENE_MS);
      } else {
        // "out" moves (alone or with "in"): it can never push "in" back.
        inMs = clamp(op.inMs ?? src.inMs, 0, Math.max(0, max - MIN_SCENE_MS));
        outMs = clamp(op.outMs, inMs + MIN_SCENE_MS, max);
      }
      if (inMs === src.inMs && outMs === src.outMs) return refuse(project, "no change");
      return done(
        mapScene(project, op.sceneId, (s) => ({
          ...s,
          source: { ...s.source!, inMs, outMs },
          locks: actor === "user" ? { ...s.locks, trim: true } : s.locks,
          provenance: { ...s.provenance, by: actor },
        })),
      );
    }

    case "replaceSceneMedia": {
      if (lockedBy("trim")) return refuse(project, "locked: trim");
      const item = project.media.find((m) => m.id === op.mediaId);
      if (!item || item.kind === "audio") return refuse(project, "media can't be used as a scene");
      return done(
        mapScene(project, op.sceneId, (s) => {
          const { trim: _trim, ...otherLocks } = s.locks; // a new clip starts untrimmed
          return { ...s, source: { mediaId: item.id, inMs: 0, outMs: defaultOutMs(item) }, locks: otherLocks, provenance: { ...s.provenance, by: actor } };
        }),
      );
    }

    case "setLock": {
      if (actor === "ai") return refuse(project, "only the user can change locks");
      const locks = { ...scene!.locks };
      if (op.value) locks[op.lock] = true;
      else delete locks[op.lock];
      return done(mapScene(project, op.sceneId, (s) => ({ ...s, locks })));
    }

    case "renameProject": {
      const name = op.name.slice(0, 120);
      if (name === project.name) return refuse(project, "no change");
      return done({ ...project, name });
    }
  }
}
