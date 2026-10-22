import { describe, expect, it } from "vitest";
import { compileShots, hookLines, numberCard, sceneMsFor, shotsFromYourWords } from "./compile";

describe("compile", () => {
  it("splits a long hook in two and keeps a short one whole", () => {
    expect(hookLines("Nobody tells you this")).toEqual(["Nobody tells you this"]);
    expect(hookLines("Nobody tells you this, but garlic hates wet feet")).toEqual(["Nobody tells you this,", "but garlic hates wet feet"]);
    expect(hookLines("one two three four five six seven eight")).toEqual(["one two three four", "five six seven eight"]);
  });
  it("finds a number and keeps the rest of the sentence as its label", () => {
    expect(numberCard("Three days was enough")).toBeNull();
    expect(numberCard("It rained for 3 days straight")).toEqual({ value: "3 days", label: "It rained for straight" });
    expect(numberCard("Only 47% survived")).toEqual({ value: "47%", label: "Only survived" });
    expect(numberCard("1,200 farmers signed up")?.value).toBe("1,200");
  });
  it("scene length follows the words, within limits", () => {
    expect(sceneMsFor("hi")).toBe(2400);
    expect(sceneMsFor(Array(60).fill("word").join(" "))).toBe(7000);
    expect(sceneMsFor(Array(12).fill("word").join(" "))).toBe(5700);
  });
  it("first line is a hook card, last an end card, a middle number a big-number, other lines statement cards in varied colours", () => {
    const { scenes, lines } = compileShots([
      { beat: "hook", role: "hook", line: "Rain was late" },
      { beat: "a", role: "body", line: "The field was dry" },
      { beat: "b", role: "body", line: "He waited 3 days" },
      { beat: "c", role: "body", line: "He carried water" },
      { beat: "end", role: "cta", line: "Be patient" },
    ]);
    expect(scenes.map((s) => s.card?.template)).toEqual(["hook-text", "text-card", "big-number", "text-card", "end-card"]);
    expect(lines.map((l) => l.sceneId)).toEqual(scenes.map((s) => s.id));
    const tones = scenes.slice(1, 4).map((s) => (s.card?.props as { tone: string }).tone);
    expect(tones[0]).not.toBe(tones[1]);
  });
  it("uses the person's own sentences, and splits one long sentence so there is more than one scene", () => {
    expect(shotsFromYourWords(["One. Two! Three?"]).map((s) => s.line)).toEqual(["One.", "Two!", "Three?"]);
    const one = shotsFromYourWords(["The farmer waited for the rain all season, but the clouds never came, so he walked to the river"]);
    expect(one.length).toBeGreaterThanOrEqual(3);
    expect(one[0].role).toBe("hook");
    expect(one[one.length - 1].role).toBe("cta");
    expect(shotsFromYourWords(["", "  "])).toEqual([]);
  });
});
