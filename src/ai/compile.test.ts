import { describe, expect, it } from "vitest";
import { directArt } from "./art";
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
    expect(numberCard("He left 10 cm between every clove")?.value).toBe("10 cm");
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
    expect(scenes.map((s) => s.card?.template)).toEqual(["art-scene", "art-scene", "big-number", "art-scene", "art-scene"]);
    expect(lines.map((l) => l.sceneId)).toEqual(scenes.map((s) => s.id));
    expect((scenes[0].card?.props as { big: boolean }).big).toBe(true);
    // every picture scene carries its words and at least one drawn item
    for (const s of [scenes[0], scenes[1], scenes[3]]) {
      const p = s.card!.props as { text: string; items: unknown[] };
      expect(p.text.length).toBeGreaterThan(0);
      expect(p.items.length).toBeGreaterThan(0);
    }
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

describe("directArt", () => {
  it("draws what the words mention: monkey and garlic in a sunny field", () => {
    const a = directArt("The monkey planted garlic in the field", 0);
    expect(a.items.map((i) => i.kind).sort()).toEqual(["garlic", "monkey"]);
    expect(a.backdrop).toBe("day");
  });
  it("understands Nepali words too", () => {
    const a = directArt("बाँदरले लसुन रोप्यो", 1);
    expect(a.items.map((i) => i.kind)).toContain("monkey");
    expect(a.items.map((i) => i.kind)).toContain("garlic");
  });
  it("night and rain change the backdrop, and a rainy or night scene has no sun", () => {
    expect(directArt("That night he walked home", 0).backdrop).toBe("night");
    const rain = directArt("The rain fell on the sunny field", 0);
    expect(rain.backdrop).toBe("rain");
    expect(rain.items.map((i) => i.kind)).not.toContain("sun");
    expect(rain.items.map((i) => i.kind)).toContain("cloud");
  });
  it("a line with no matching word still gets a picture (colour shapes and a star), never a blank card", () => {
    const a = directArt("Some things are simply hard to explain", 3);
    expect(a.backdrop).toBe("abstract");
    expect(a.items.map((i) => i.kind)).toEqual(["star"]);
  });
  it("places at most 4 items, characters on the ground and sky items in the sky", () => {
    const a = directArt("A monkey and a farmer and a cat under the sun, a cloud and the moon with garlic", 0);
    expect(a.items.length).toBeLessThanOrEqual(3);
    for (const it of a.items) expect(it.y).toBeGreaterThan(0);
  });
  it("keeps the same character and setting when the next line says he or they and mentions nothing else", () => {
    const first = directArt("The monkey planted garlic in the field", 0);
    const next = directArt("Then he covered them with straw and waited", 1, { backdrop: first.backdrop, character: first.character });
    expect(next.items.map((i) => i.kind)).toContain("monkey");
    expect(next.backdrop).toBe("day");
  });
  it("a number in a story with pictures becomes a badge on the picture, not a text-only card", () => {
    const { scenes } = compileShots([
      { beat: "h", role: "hook", line: "The monkey said he would grow garlic" },
      { beat: "b", role: "body", line: "He left 10 cm between every clove" },
      { beat: "e", role: "cta", line: "Now everyone asks him how" },
    ]);
    expect(scenes[1].card?.template).toBe("art-scene");
    expect((scenes[1].card?.props as { badge?: string }).badge).toBe("10 cm");
  });
  it("matches whole words only: 'clove' does not mean love, 'room to grow' is not a room", () => {
    const a = directArt("He left 10 cm between every clove, so each one had room to grow", 0);
    expect(a.items.map((i) => i.kind)).not.toContain("heart");
    expect(a.backdrop).not.toBe("room");
    expect(directArt("They planted it", 0).items.map((i) => i.kind)).toContain("seedling");
  });
});
