import { describe, expect, it } from "vitest";
import { estimateWords } from "../audio/timing";
import { captionChunks } from "../render/renderFrame";
import { parseCardProps } from "../render/templates";
import { applyOp } from "./ops";
import { emptyProject, makeScene, type MediaItem, type Project } from "./schema";

const audio = (id: string): MediaItem => ({ id, kind: "audio", name: `${id}.wav`, origin: "ai-generated", watermark: "unknown", probe: { width: 0, height: 0, durationMs: 2000, sizeBytes: 1, mime: "audio/wav" } });
const video = (id: string): MediaItem => ({ ...audio(id), kind: "video", name: `${id}.mp4` });

function withCardScene(): { p: Project; id: string } {
  const scene = makeScene({ card: { template: "hook-text", props: { lines: ["Hi"] } }, type: "card", slot: { targetMs: 3000, status: "filled", flags: [] } });
  const p = applyOp(emptyProject(), { type: "addScene", scene }, "ai").project;
  return { p, id: scene.id };
}

describe("scene cards", () => {
  it("sets a card, and a user's edit locks it against the AI", () => {
    const { p, id } = withCardScene();
    const user = applyOp(p, { type: "setSceneCard", sceneId: id, card: { template: "big-number", props: { value: "3" } } }, "user");
    expect(user.project.scenes[0].card?.template).toBe("big-number");
    expect(user.project.scenes[0].locks.overlays).toBe(true);
    const ai = applyOp(user.project, { type: "setSceneCard", sceneId: id, card: { template: "end-card", props: { headline: "x" } } }, "ai");
    expect(ai.changed).toBe(false);
    expect(ai.reason).toMatch(/locked/);
  });
  it("only a scene without a clip has a slot length", () => {
    const { p, id } = withCardScene();
    expect(applyOp(p, { type: "setSlotMs", sceneId: id, ms: 4200 }, "ai").project.scenes[0].slot.targetMs).toBe(4200);
    expect(applyOp(p, { type: "setSlotMs", sceneId: id, ms: 3000 }, "ai").changed).toBe(false);
    let q = applyOp(p, { type: "addMedia", item: video("v") }).project;
    q = applyOp(q, { type: "replaceSceneMedia", sceneId: id, mediaId: "v" }).project;
    expect(applyOp(q, { type: "setSlotMs", sceneId: id, ms: 1000 }).reason).toMatch(/trim/);
  });
  it("template props are checked and defaulted, never trusted", () => {
    expect(parseCardProps({ template: "hook-text", props: { lines: ["a", "b"] } })).toMatchObject({ lines: ["a", "b"], tone: "ink" });
    expect(parseCardProps({ template: "hook-text", props: { lines: [] } })).toBeNull();
    expect(parseCardProps({ template: "hook-text", props: { lines: [1, 2] } })).toBeNull();
    expect(parseCardProps({ template: "end-card", props: { headline: "x".repeat(500) } })).toBeNull();
  });
});

describe("voice and captions", () => {
  it("attaches an audio file to a scene's line, refuses non-audio, and detaches", () => {
    const { p, id } = withCardScene();
    let q = applyOp(p, { type: "addMedia", item: audio("a1") }).project;
    q = applyOp(q, { type: "addMedia", item: video("v1") }).project;
    expect(applyOp(q, { type: "setLineAudio", sceneId: id, mediaId: "v1" }).changed).toBe(false);
    q = applyOp(q, { type: "setLineAudio", sceneId: id, mediaId: "a1" }, "ai").project;
    expect(q.script.lines[0]).toMatchObject({ sceneId: id, audioMediaId: "a1", voice: "tts" });
    expect(applyOp(q, { type: "setLineAudio", sceneId: id, mediaId: "a1" }, "ai").changed).toBe(false);
    q = applyOp(q, { type: "setLineAudio", sceneId: id, mediaId: null }, "ai").project;
    expect(q.script.lines[0].audioMediaId).toBeUndefined();
  });
  it("captions drop empty or backwards words and respect the captions lock", () => {
    const { p, id } = withCardScene();
    const words = [
      { text: "Hello", startMs: 0, endMs: 300 },
      { text: " ", startMs: 300, endMs: 400 },
      { text: "back", startMs: 600, endMs: 500 },
    ];
    const q = applyOp(p, { type: "setCaptions", sceneId: id, enabled: true, words }, "user").project;
    expect(q.scenes[0].captions.words).toHaveLength(1);
    expect(q.scenes[0].locks.captions).toBe(true);
    expect(applyOp(q, { type: "setCaptions", sceneId: id, enabled: false, words: [] }, "ai").changed).toBe(false);
  });
  it("estimated word timings stay inside the line and in order", () => {
    const w = estimateWords("Every farmer in the valley knew the rain was late.", 3600);
    expect(w).toHaveLength(10);
    expect(w[0].startMs).toBeGreaterThanOrEqual(100);
    expect(w[w.length - 1].endMs).toBeLessThanOrEqual(3600 - 150);
    for (let i = 1; i < w.length; i++) expect(w[i].startMs).toBeGreaterThanOrEqual(w[i - 1].endMs);
    expect(estimateWords("", 3000)).toEqual([]);
    expect(estimateWords("hi", 200)).toEqual([]);
  });
  it("captions are grouped in at most 4 words and break after punctuation", () => {
    const words = "One two three four five six, seven.".split(" ").map((text, i) => ({ text, startMs: i * 100, endMs: i * 100 + 90 }));
    expect(captionChunks(words).map((c) => c.map((w) => w.text).join(" "))).toEqual(["One two three four", "five six,", "seven."]);
  });
});
