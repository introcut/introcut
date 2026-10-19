import { describe, expect, it } from "vitest";
import { applyOp, MIN_SCENE_MS, sceneFromMedia, type Op } from "./ops";
import { emptyProject, ProjectSchema, type MediaItem, type Project } from "./schema";
import { layout } from "./timeline";

const video = (id: string, durationMs = 10_000): MediaItem => ({
  id,
  kind: "video",
  name: `${id}.mp4`,
  origin: "unknown",
  watermark: "unknown",
  probe: { width: 1080, height: 1920, durationMs, sizeBytes: 1, mime: "video/mp4" },
});
const photo = (id: string): MediaItem => ({ ...video(id), kind: "photo", name: `${id}.png`, probe: { width: 10, height: 10, sizeBytes: 1, mime: "image/png" } });

/** A project with media a, b, c (videos, 10 s) and one scene each. */
function setup(): Project {
  let p = emptyProject();
  for (const id of ["a", "b", "c"]) {
    p = applyOp(p, { type: "addMedia", item: video(id) }).project;
    p = applyOp(p, { type: "addScene", scene: sceneFromMedia(video(id), p.scenes.length === 0)! }).project;
  }
  return p;
}
const ids = (p: Project) => p.scenes.map((s) => s.source!.mediaId);
const first = (p: Project) => p.scenes[0];

describe("schema", () => {
  it("a fresh project is valid and survives a JSON round trip", () => {
    const p = setup();
    expect(ProjectSchema.parse(JSON.parse(JSON.stringify(p)))).toEqual(p);
  });
  it("rejects garbage", () => {
    expect(ProjectSchema.safeParse({ version: 1 }).success).toBe(false);
    expect(ProjectSchema.safeParse({ hello: "world" }).success).toBe(false);
  });
});

describe("media and scenes", () => {
  it("audio is not a scene", () => {
    expect(sceneFromMedia({ ...video("x"), kind: "audio" }, false)).toBeNull();
  });
  it("photos get 3 s, videos their full length; first scene is the hook", () => {
    const p = applyOp(emptyProject(), { type: "addMedia", item: photo("p") }).project;
    const s = sceneFromMedia(p.media[0], true)!;
    expect(s.source).toEqual({ mediaId: "p", inMs: 0, outMs: 3000 });
    expect(s.role).toBe("hook");
    expect(sceneFromMedia(video("v", 7000), false)!.source!.outMs).toBe(7000);
  });
  it("refuses a scene whose media is unknown", () => {
    const r = applyOp(emptyProject(), { type: "addScene", scene: sceneFromMedia(video("zzz"), true)! });
    expect(r.changed).toBe(false);
  });
  it("removing media removes its scenes", () => {
    const p = applyOp(setup(), { type: "removeMedia", mediaId: "b" }).project;
    expect(ids(p)).toEqual(["a", "c"]);
    expect(p.media.map((m) => m.id)).toEqual(["a", "c"]);
  });
  it("timeline length is the sum of scene lengths", () => {
    expect(layout(setup()).totalMs).toBe(30_000);
  });
});

describe("trim", () => {
  it("trims and locks (user)", () => {
    const p0 = setup();
    const r = applyOp(p0, { type: "trimScene", sceneId: first(p0).id, inMs: 2000, outMs: 6000 });
    expect(r.project.scenes[0].source).toMatchObject({ inMs: 2000, outMs: 6000 });
    expect(r.project.scenes[0].locks.trim).toBe(true);
    expect(r.project.scenes[0].provenance.by).toBe("user");
    expect(layout(r.project).totalMs).toBe(24_000);
  });
  it("clamps to the media and to a minimum length", () => {
    const p0 = setup();
    const id = first(p0).id;
    expect(applyOp(p0, { type: "trimScene", sceneId: id, outMs: 99_999 }).project.scenes[0].source!.outMs).toBe(10_000);
    const tiny = applyOp(p0, { type: "trimScene", sceneId: id, inMs: 9_999 }).project.scenes[0].source!;
    expect(tiny.outMs - tiny.inMs).toBeGreaterThanOrEqual(MIN_SCENE_MS);
  });
  it("moving 'in' never pushes 'out', moving 'out' never pushes 'in'", () => {
    const p0 = applyOp(setup(), { type: "trimScene", sceneId: setup().scenes[0].id, inMs: 0 }).project; // no-op safety
    const id = first(p0).id;
    const a = applyOp(p0, { type: "trimScene", sceneId: id, inMs: 9_000 }).project.scenes[0].source!;
    expect(a.outMs).toBe(10_000);
    const base = applyOp(p0, { type: "trimScene", sceneId: id, inMs: 5000, outMs: 8000 }).project;
    const b = applyOp(base, { type: "trimScene", sceneId: id, outMs: 1000 }).project.scenes[0].source!;
    expect(b.inMs).toBe(5000);
    expect(b.outMs).toBe(5000 + MIN_SCENE_MS);
  });
  it("photos can be shortened or lengthened but always start at 0", () => {
    let p = applyOp(emptyProject(), { type: "addMedia", item: photo("p") }).project;
    p = applyOp(p, { type: "addScene", scene: sceneFromMedia(p.media[0], true)! }).project;
    const r = applyOp(p, { type: "trimScene", sceneId: p.scenes[0].id, inMs: 1500, outMs: 6000 }).project.scenes[0].source!;
    expect(r).toEqual({ mediaId: "p", inMs: 0, outMs: 6000 });
  });
  it("no change is reported as unchanged", () => {
    const p0 = setup();
    expect(applyOp(p0, { type: "trimScene", sceneId: first(p0).id, inMs: 0, outMs: 10_000 }).changed).toBe(false);
  });
});

describe("locks: the AI must respect user edits", () => {
  it("AI cannot trim a scene the user trimmed", () => {
    const p0 = setup();
    const id = first(p0).id;
    const userTrimmed = applyOp(p0, { type: "trimScene", sceneId: id, outMs: 4000 }).project;
    const r = applyOp(userTrimmed, { type: "trimScene", sceneId: id, outMs: 8000 }, "ai");
    expect(r.changed).toBe(false);
    expect(r.reason).toMatch(/locked/);
    expect(r.project.scenes[0].source!.outMs).toBe(4000);
  });
  it("AI can trim an unlocked scene, and it is marked as AI-made without locking it", () => {
    const p0 = setup();
    const r = applyOp(p0, { type: "trimScene", sceneId: first(p0).id, outMs: 4000 }, "ai");
    expect(r.changed).toBe(true);
    expect(r.project.scenes[0].provenance.by).toBe("ai");
    expect(r.project.scenes[0].locks.trim).toBeUndefined();
  });
  it("AI cannot move a scene the user moved, or delete a scene with any lock", () => {
    const p0 = setup();
    const moved = applyOp(p0, { type: "moveScene", sceneId: p0.scenes[2].id, toIndex: 0 }).project;
    expect(ids(moved)).toEqual(["c", "a", "b"]);
    expect(applyOp(moved, { type: "moveScene", sceneId: moved.scenes[0].id, toIndex: 2 }, "ai").changed).toBe(false);
    expect(applyOp(moved, { type: "removeScene", sceneId: moved.scenes[0].id }, "ai").changed).toBe(false);
    expect(applyOp(moved, { type: "removeScene", sceneId: moved.scenes[1].id }, "ai").changed).toBe(true);
  });
  it("AI cannot remove media that a locked scene uses", () => {
    const p0 = setup();
    const locked = applyOp(p0, { type: "trimScene", sceneId: first(p0).id, outMs: 4000 }).project;
    expect(applyOp(locked, { type: "removeMedia", mediaId: "a" }, "ai").changed).toBe(false);
    expect(applyOp(locked, { type: "removeMedia", mediaId: "b" }, "ai").changed).toBe(true);
  });
  it("only the user can change locks; the user can unlock", () => {
    const p0 = setup();
    const id = first(p0).id;
    const trimmed = applyOp(p0, { type: "trimScene", sceneId: id, outMs: 4000 }).project;
    expect(applyOp(trimmed, { type: "setLock", sceneId: id, lock: "trim", value: false }, "ai").changed).toBe(false);
    const unlocked = applyOp(trimmed, { type: "setLock", sceneId: id, lock: "trim", value: false }).project;
    expect(unlocked.scenes[0].locks.trim).toBeUndefined();
    expect(applyOp(unlocked, { type: "trimScene", sceneId: id, outMs: 2000 }, "ai").changed).toBe(true);
  });
});

describe("move, replace, rename", () => {
  it("moves and clamps the target index", () => {
    const p0 = setup();
    expect(ids(applyOp(p0, { type: "moveScene", sceneId: p0.scenes[0].id, toIndex: 99 }).project)).toEqual(["b", "c", "a"]);
    expect(applyOp(p0, { type: "moveScene", sceneId: p0.scenes[0].id, toIndex: 0 }).changed).toBe(false);
  });
  it("replacing media starts untrimmed and clears the trim lock only", () => {
    let p = setup();
    const id = first(p).id;
    p = applyOp(p, { type: "trimScene", sceneId: id, outMs: 4000 }).project;
    p = applyOp(p, { type: "setLock", sceneId: id, lock: "order", value: true }).project;
    p = applyOp(p, { type: "addMedia", item: video("d", 5000) }).project;
    const r = applyOp(p, { type: "replaceSceneMedia", sceneId: id, mediaId: "d" }).project.scenes[0];
    expect(r.source).toEqual({ mediaId: "d", inMs: 0, outMs: 5000 });
    expect(r.locks.trim).toBeUndefined();
    expect(r.locks.order).toBe(true);
  });
  it("won't use audio as a scene", () => {
    let p = setup();
    p = applyOp(p, { type: "addMedia", item: { ...video("m"), kind: "audio" } }).project;
    expect(applyOp(p, { type: "replaceSceneMedia", sceneId: first(p).id, mediaId: "m" }).changed).toBe(false);
  });
  it("renames", () => {
    expect(applyOp(emptyProject(), { type: "renameProject", name: "Garlic" }).project.name).toBe("Garlic");
  });
  it("unknown scene is refused", () => {
    const op: Op = { type: "removeScene", sceneId: "nope" };
    expect(applyOp(setup(), op).changed).toBe(false);
  });
  it("never mutates the input project", () => {
    const p0 = setup();
    const snapshot = JSON.stringify(p0);
    applyOp(p0, { type: "trimScene", sceneId: first(p0).id, outMs: 4000 });
    applyOp(p0, { type: "moveScene", sceneId: first(p0).id, toIndex: 2 });
    expect(JSON.stringify(p0)).toBe(snapshot);
  });
});
