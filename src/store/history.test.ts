import { describe, expect, it } from "vitest";
import { applyOp } from "../model/ops";
import { emptyProject } from "../model/schema";
import { emptyHistory, record, redo, undo } from "./history";

const named = (n: string) => applyOp(emptyProject(), { type: "renameProject", name: n }).project;

describe("history", () => {
  it("undo and redo walk back and forth", () => {
    const p0 = emptyProject();
    const p1 = { ...p0, name: "one" };
    const p2 = { ...p0, name: "two" };
    let h = record(emptyHistory(), p0);
    h = record(h, p1);
    const u1 = undo(h, p2)!;
    expect(u1.project.name).toBe("one");
    const u2 = undo(u1.history, u1.project)!;
    expect(u2.project.name).toBe(p0.name);
    expect(undo(u2.history, u2.project)).toBeNull();
    const r1 = redo(u2.history, u2.project)!;
    expect(r1.project.name).toBe("one");
    const r2 = redo(r1.history, r1.project)!;
    expect(r2.project.name).toBe("two");
    expect(redo(r2.history, r2.project)).toBeNull();
  });

  it("a new edit clears redo", () => {
    const p0 = emptyProject();
    let h = record(emptyHistory(), p0);
    const u = undo(h, named("x"))!;
    expect(u.history.future).toHaveLength(1);
    h = record(u.history, u.project);
    expect(h.future).toHaveLength(0);
  });

  it("edits with the same key inside a second become one undo step", () => {
    const p0 = emptyProject();
    let h = record(emptyHistory(), p0, "trim:1", 1000);
    h = record(h, named("mid1"), "trim:1", 1300);
    h = record(h, named("mid2"), "trim:1", 1900);
    expect(h.past).toHaveLength(1); // still just the state before the first drag tick
    h = record(h, named("later"), "trim:1", 5000); // a pause starts a new step
    expect(h.past).toHaveLength(2);
    h = record(h, named("other"), "trim:2", 5100); // different key: new step
    expect(h.past).toHaveLength(3);
  });

  it("keeps at most 100 steps", () => {
    let h = emptyHistory();
    for (let i = 0; i < 150; i++) h = record(h, named(String(i)));
    expect(h.past).toHaveLength(100);
  });
});
