import { describe, expect, it } from "vitest";
import { applyOp, sceneFromMedia } from "./ops";
import { emptyProject, type MediaItem } from "./schema";
import { repairProject } from "./validate";

const video = (id: string): MediaItem => ({
  id,
  kind: "video",
  name: `${id}.mp4`,
  origin: "unknown",
  watermark: "unknown",
  probe: { width: 1, height: 1, durationMs: 5000, sizeBytes: 1, mime: "video/mp4" },
});

describe("repairProject", () => {
  it("leaves a healthy project untouched (same object)", () => {
    const p = emptyProject();
    expect(repairProject(p).project).toBe(p);
  });

  it("drops scenes that point at media missing from the file, and says so", () => {
    let p = applyOp(emptyProject(), { type: "addMedia", item: video("a") }).project;
    p = applyOp(p, { type: "addScene", scene: sceneFromMedia(video("a"), true)! }).project;
    const broken = { ...p, media: [] }; // someone edited the JSON by hand
    const r = repairProject(broken);
    expect(r.project.scenes).toHaveLength(0);
    expect(r.notes.length).toBeGreaterThan(0);
  });
});
