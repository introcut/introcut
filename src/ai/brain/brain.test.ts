import { describe, expect, it, vi } from "vitest";
import { applyOp } from "../../model/ops";
import { emptyProject } from "../../model/schema";
import { extractJson } from "../llm/json";
import { openAiCompatProvider } from "../llm/openaiCompat";
import { LlmError, type LlmProvider } from "../llm/types";
import { llmBrain } from "./llm";
import { rulesBrain } from "./rules";
import { inputFromProject } from "./index";
import { overallScore } from "./types";

const fake = (...replies: string[]): LlmProvider & { calls: number } => {
  const p = {
    id: "fake",
    label: "fake",
    calls: 0,
    async complete() {
      return replies[Math.min(p.calls++, replies.length - 1)];
    },
    async listModels() {
      return [];
    },
  };
  return p;
};

const ASSESS = JSON.stringify({
  summary: "A fun idea with one hard shot.",
  scores: { hook: 80, clarity: "70", feasibility: 150, novelty: -5 },
  reasons: { hook: "a", clarity: "b", feasibility: "c", novelty: "d" },
  missing: [1, 2, 3, 4].map((n) => ({ ask: `q${n}`, fixHint: "h" })),
  format: { id: "mini-story", why: "has a character" },
  alternatives: [{ id: "how-to", why: "teaches" }, { id: "made-up", why: "?" }, { id: "mini-story", why: "same" }],
});
const PLAN = JSON.stringify({
  shots: [
    { beat: "hook", role: "hook", type: "generated", intent: "a monkey in a paddy", seconds: 4, line: "Namaste", roman: "Namaste" },
    { beat: "demo", role: "body", type: "user-media", intent: "show the app", seconds: 99, line: "", media: "Screen.MP4" },
    { beat: "end", role: "cta", type: "user-media", intent: "follow", seconds: 0.2, line: "Follow" },
  ],
});
const input = () => ({
  ...inputFromProject(emptyProject()),
  idea: "A monkey teaches garlic planting",
  media: [{ id: "m1", name: "screen.mp4", kind: "video" as const, origin: "screen", durationMs: 6000 }],
});

describe("extractJson", () => {
  it("handles fences, chatter and braces inside strings", () => {
    expect(extractJson('Sure!\n```json\n{"a": "x}y"}\n```')).toEqual({ a: "x}y" });
    expect(extractJson('here {"a":{"b":1}} done')).toEqual({ a: { b: 1 } });
  });
  it("rejects text without or with cut-off JSON", () => {
    expect(() => extractJson("no json")).toThrow();
    expect(() => extractJson('{"a": ')).toThrow();
  });
});

describe("llmBrain.assess", () => {
  it("clamps scores, limits questions to 3, drops unknown and repeated formats", async () => {
    const a = await llmBrain(fake(ASSESS)).assess(input());
    expect(a.scores).toEqual({ hook: 80, clarity: 70, feasibility: 100, novelty: 0 });
    expect(overallScore(a.scores!)).toBe(63);
    expect(a.missing).toHaveLength(3);
    expect(a.format.id).toBe("mini-story");
    expect(a.alternatives.map((x) => x.id)).toEqual(["how-to", "custom"]);
  });
  it("won't return a format the user already rejected", async () => {
    const a = await llmBrain(fake(ASSESS)).assess({ ...input(), avoidFormatIds: ["mini-story"] });
    expect(a.format.id).toBe("custom");
  });
  it("asks once more when the first answer is unusable, then gives up with a plain error", async () => {
    const ok = fake("not json at all", ASSESS);
    expect((await llmBrain(ok).assess(input())).scores?.hook).toBe(80);
    expect(ok.calls).toBe(2);
    const bad = fake("nope");
    await expect(llmBrain(bad).assess(input())).rejects.toBeInstanceOf(LlmError);
    expect(bad.calls).toBe(2);
  });
});

describe("llmBrain.plan", () => {
  it("builds scenes: cards for the words, the user's file where it fits, keeps every line", async () => {
    const plan = await llmBrain(fake(PLAN)).plan(input(), { id: "how-to", why: "" });
    expect(plan.scenes).toHaveLength(3);
    expect(plan.scenes[0]).toMatchObject({ role: "hook", type: "card", card: { template: "art-scene" }, slot: { targetMs: 4000, status: "filled" } });
    expect(plan.scenes[1]).toMatchObject({ type: "user-media", source: { mediaId: "m1", inMs: 0, outMs: 6000 }, slot: { status: "filled" } });
    expect(plan.scenes[2]).toMatchObject({ role: "cta", type: "card", card: { template: "art-scene" } });
    expect(plan.scenes[2].slot.targetMs).toBe(1500);
    expect(plan.lines.map((l) => l.text)).toEqual(["Namaste", "", "Follow"]);
    expect(plan.lines[0].roman).toBe("Namaste");
    expect(plan.lines.every((l, i) => l.sceneId === plan.scenes[i].id)).toBe(true);
  });
});

describe("rulesBrain", () => {
  it("never invents scores and says it can't judge", async () => {
    const a = await rulesBrain.assess(input());
    expect(a.scores).toBeUndefined();
    expect(a.summary).toMatch(/can't judge/);
  });
  it("picks a format from keywords and respects rejected ones", async () => {
    const a = await rulesBrain.assess({ ...input(), idea: "how to plant garlic, a step by step guide" });
    expect(a.format.id).toBe("how-to");
    const b = await rulesBrain.assess({ ...input(), idea: "how to plant garlic, a step by step guide", avoidFormatIds: ["how-to"] });
    expect(b.format.id).not.toBe("how-to");
  });
  it("asks at most 3 things and stops asking once answered", async () => {
    const short = await rulesBrain.assess({ ...input(), idea: "garlic" });
    expect(short.missing.length).toBeGreaterThan(0);
    expect(short.missing.length).toBeLessThanOrEqual(3);
    const answered = await rulesBrain.assess({ ...input(), idea: "garlic", qa: short.missing.map((m) => ({ q: m.ask, a: "farmers" })) });
    expect(answered.missing).toHaveLength(0);
  });
  it("builds a watchable video from the person's own words, with no AI", async () => {
    const idea = "Every farmer in the valley knew the rain was late. Ram's seedlings stood in dry mud. 3 days was all they could survive. He carried water all night. By morning the first rain fell.";
    const plan = await rulesBrain.plan({ ...input(), idea, media: [] }, { id: "mini-story", why: "" });
    expect(plan.scenes).toHaveLength(5);
    expect(plan.scenes.every((sc) => sc.card && sc.slot.status === "filled")).toBe(true);
    expect(plan.scenes[0].card?.template).toBe("art-scene");
    expect(plan.scenes[2].card?.template).toBe("art-scene");
    expect((plan.scenes[2].card?.props as { badge?: string }).badge).toBe("3 days");
    expect(plan.scenes[4].card?.template).toBe("art-scene");
    expect(plan.lines.map((l) => l.text)[1]).toBe("Ram's seedlings stood in dry mud.");
    expect(plan.note).toMatch(/your own words/);
  });
  it("puts the person's own photos under the middle lines and says when the idea is too short", async () => {
    const idea = "A. B. C. D. E.";
    const media = [{ id: "p1", name: "a.png", kind: "photo" as const, origin: "unknown" }];
    const plan = await rulesBrain.plan({ ...input(), idea, media }, { id: "mini-story", why: "" });
    expect(plan.scenes.filter((sc) => sc.source).map((sc) => sc.source!.mediaId)).toEqual(["p1"]);
    expect(plan.scenes[1].captions.enabled).toBe(true);
    const short = await rulesBrain.plan({ ...input(), idea: "A monkey plants garlic", media: [] }, { id: "mini-story", why: "" });
    expect(short.note).toMatch(/only a few/);
  });
});

describe("openAiCompatProvider", () => {
  const cfg = { baseUrl: "https://example.test/v1/", apiKey: "k", model: "m" };
  const reply = (status: number, body: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status }));
  it("sends the key and model, and returns the text", async () => {
    const f = reply(200, { choices: [{ message: { content: "hi" } }] });
    vi.stubGlobal("fetch", f);
    expect(await openAiCompatProvider(cfg).complete([{ role: "user", content: "x" }])).toBe("hi");
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://example.test/v1/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer k");
    expect(JSON.parse(init.body as string).model).toBe("m");
  });
  it("explains auth, limit and network failures in plain words", async () => {
    vi.stubGlobal("fetch", reply(401, {}));
    await expect(openAiCompatProvider(cfg).complete([])).rejects.toMatchObject({ kind: "auth" });
    vi.stubGlobal("fetch", reply(429, {}));
    await expect(openAiCompatProvider(cfg).complete([])).rejects.toMatchObject({ kind: "rate-limit" });
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("Failed to fetch"))));
    await expect(openAiCompatProvider(cfg).complete([])).rejects.toMatchObject({ kind: "network" });
  });
  it("lists models sorted", async () => {
    vi.stubGlobal("fetch", reply(200, { data: [{ id: "b" }, { id: "a" }] }));
    expect(await openAiCompatProvider(cfg).listModels()).toEqual(["a", "b"]);
  });
});

describe("plan ops", () => {
  const withPlan = async () => {
    let p = applyOp(emptyProject(), { type: "addMedia", item: { id: "m1", kind: "video", name: "screen.mp4", origin: "screen", watermark: "unknown", probe: { width: 1, height: 1, durationMs: 6000, sizeBytes: 1, mime: "video/mp4" } } }).project;
    const draft = await llmBrain(fake(PLAN)).plan(inputFromProject(p), { id: "how-to", why: "" });
    p = applyOp(p, { type: "setPlan", language: "en", scenes: draft.scenes, lines: draft.lines }, "ai").project;
    return { p, draft };
  };
  it("adds the scenes and the script lines", async () => {
    const { p } = await withPlan();
    expect(p.scenes).toHaveLength(3);
    expect(p.script.lines).toHaveLength(3);
    expect(p.scenes.every((s) => s.provenance.by === "ai")).toBe(true);
  });
  it("a new plan replaces the old one but never a scene the user locked", async () => {
    const { p } = await withPlan();
    const locked = p.scenes[0].id;
    const p2 = applyOp(p, { type: "setLock", sceneId: locked, lock: "prompt", value: true }, "user").project;
    const again = await llmBrain(fake(PLAN)).plan(inputFromProject(p2), { id: "how-to", why: "" });
    const p3 = applyOp(p2, { type: "setPlan", language: "en", scenes: again.scenes, lines: again.lines }, "ai").project;
    expect(p3.scenes.some((s) => s.id === locked)).toBe(true);
    expect(p3.scenes).toHaveLength(4); // 1 kept + 3 new
    expect(p3.script.lines).toHaveLength(4);
    expect(p3.script.lines.every((l) => p3.scenes.some((s) => s.id === l.sceneId))).toBe(true);
  });
  it("refuses a plan that points at missing media or scenes", async () => {
    const { draft } = await withPlan();
    const base = emptyProject();
    expect(applyOp(base, { type: "setPlan", language: "en", scenes: draft.scenes, lines: draft.lines }, "ai").changed).toBe(false);
    expect(applyOp(base, { type: "setPlan", language: "en", scenes: [], lines: draft.lines }, "ai").reason).toMatch(/missing scene/);
  });
  it("settings, answers, readiness and proceed-anyway", () => {
    let p = applyOp(emptyProject(), { type: "setSettings", language: "ne", targetDurationSec: 500 }).project;
    expect(p.settings).toMatchObject({ language: "ne", targetDurationSec: 60 });
    p = applyOp(p, { type: "setQa", qa: [{ q: "Who?", a: "farmers" }] }).project;
    expect(p.brief.qa).toHaveLength(1);
    expect(applyOp(p, { type: "proceedAnyway" }).changed).toBe(false);
    p = applyOp(p, { type: "setReadiness", readiness: { reasons: {}, missing: [], proceededAnyway: true } }).project;
    expect(p.readiness?.proceededAnyway).toBe(false);
    expect(applyOp(p, { type: "proceedAnyway" }).project.readiness?.proceededAnyway).toBe(true);
  });
});
