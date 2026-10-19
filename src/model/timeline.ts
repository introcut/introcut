import type { Project, Scene } from "./types";

export interface PlacedScene {
  scene: Scene;
  index: number;
  startMs: number;
  endMs: number;
}

export const sceneLengthMs = (s: Scene) => Math.max(0, s.source.outMs - s.source.inMs);

/** Scenes play back to back (cuts only in M1). Start of each scene = sum of previous lengths. */
export function layout(project: Project): { placed: PlacedScene[]; totalMs: number } {
  let t = 0;
  const placed = project.scenes.map((scene, index) => {
    const startMs = t;
    t += sceneLengthMs(scene);
    return { scene, index, startMs, endMs: t };
  });
  return { placed, totalMs: t };
}

export function sceneAt(placed: PlacedScene[], tMs: number): PlacedScene | undefined {
  // The very end of the timeline still shows the last scene.
  return placed.find((p) => tMs >= p.startMs && tMs < p.endMs) ?? placed[placed.length - 1];
}

export function fmtTime(ms: number): string {
  const s = Math.max(0, ms) / 1000;
  const m = Math.floor(s / 60);
  const r = (s - m * 60).toFixed(1).padStart(4, "0");
  return `${m}:${r}`;
}
