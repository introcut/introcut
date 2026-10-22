// Turns script lines into scene cards by plain rules, so an idea becomes a watchable video with NO AI in the loop.
// The AI (or the user) writes the words; this decides how each line is shown. It never invents facts or numbers: it only
// picks a template for words that already exist.
import { estimateWords } from "../audio/timing";
import { directArt, type ArtContext } from "./art";
import { makeScene, type Scene } from "../model/types";

export interface ShotInput {
  beat: string;
  role: "hook" | "body" | "cta";
  /** The words for this shot (spoken, and shown on a card). */
  line: string;
  /** What the shot should show, when the AI said so. Used only if there are no words. */
  intent?: string;
  /** A photo or clip of the user's to show instead of a card. */
  media?: { id: string; kind: "video" | "photo"; durationMs?: number };
  /** Length the AI asked for, in seconds (optional). */
  seconds?: number;
}

export interface CompiledLine {
  id: string;
  sceneId: string;
  text: string;
  roman?: string;
  voice: "none";
}

const WORDS_PER_SEC = 2.4;
const MIN_MS = 2400;
const MAX_MS = 7000;

const words = (s: string) => s.split(/\s+/).filter(Boolean);
export const sceneMsFor = (text: string) => Math.round(Math.min(MAX_MS, Math.max(MIN_MS, (words(text).length / WORDS_PER_SEC) * 1000 + 700)));

/** Split a hook into two lines at a natural break so the pop-in animation has something to stagger. */
export function hookLines(text: string): string[] {
  const t = text.trim();
  const w = words(t);
  if (w.length < 6) return [t];
  const comma = t.search(/[,;:—–-]\s/);
  if (comma > 8 && comma < t.length - 8) return [t.slice(0, comma + 1).trim(), t.slice(comma + 1).trim()];
  const mid = Math.ceil(w.length / 2);
  return [w.slice(0, mid).join(" "), w.slice(mid).join(" ")];
}

const NUMBER = /(\d[\d,.]*\d|\d)(\s?(?:%|percent|days?|weeks?|months?|years?|hours?|minutes?|seconds?|cm|mm|km|kg|g|m|ml|l|litres?|liters?|feet|inches|x|times|rupees|dollars|सेमी|दिन|हप्ता|महिना|वर्ष|घण्टा))?/i;

/** A big-number card if the line has a number in it: the number is shown large and the rest of the sentence below it. */
export function numberCard(text: string): { value: string; label: string } | null {
  const m = NUMBER.exec(text);
  if (!m) return null;
  const value = m[0].trim().slice(0, 24);
  const label = text.replace(m[0], " ").replace(/\s+/g, " ").replace(/^[\s,.;:-]+|[\s]+$/g, "");
  return { value, label: label.length >= 4 ? label : text };
}

const BODY_TONES = ["paper", "ink", "paper", "accent", "ink"] as const;

/** One scene (and its script line) for one shot. `bodyIndex` rotates colours so neighbouring cards don't look alike. */
export function compileShot(shot: ShotInput, index: number, total: number, bodyIndex: number, before?: ArtContext): { scene: Scene; line: CompiledLine } {
  const text = (shot.line.trim() || shot.intent?.trim().split(/[.!?]/)[0] || "…").slice(0, 160);
  const isFirst = index === 0;
  const isLast = index === total - 1 && total > 1;
  const ms = shot.seconds ? Math.round(Math.min(8, Math.max(1.5, shot.seconds)) * 1000) : sceneMsFor(text);
  const base = { beat: shot.beat, role: shot.role, intent: shot.intent ?? "", provenance: { by: "ai" as const, reason: "built from your script by rules" } };

  let scene: Scene;
  if (shot.media) {
    const out = shot.media.kind === "photo" ? ms : Math.min(ms, shot.media.durationMs ?? ms);
    scene = makeScene({
      ...base,
      type: "user-media",
      source: { mediaId: shot.media.id, inMs: 0, outMs: Math.max(500, out) },
      framing: shot.media.kind === "photo" ? { mode: "auto-zoom", x: 0.5, y: 0.5, zoom: 1 } : { mode: "center", x: 0.5, y: 0.5, zoom: 1 },
      captions: { enabled: text !== "…", words: estimateWords(text, Math.max(500, out)) },
      slot: { targetMs: Math.max(500, out), status: "filled", flags: [] },
    });
  } else if (isFirst || shot.role === "hook") {
    scene = makeScene({ ...base, role: "hook", type: "card", card: { template: "art-scene", props: { text, big: true, ...directArt(text, index, before) } }, slot: { targetMs: ms, status: "filled", flags: [] } });
  } else if (isLast || shot.role === "cta") {
    scene = makeScene({ ...base, role: "cta", type: "card", card: { template: "art-scene", props: { text, big: true, ...directArt(text, index, before) } }, slot: { targetMs: ms, status: "filled", flags: [] } });
  } else {
    const num = numberCard(text);
    const tone = BODY_TONES[bodyIndex % BODY_TONES.length];
    const art = directArt(text, index, before);
    // A number with nothing to draw stays a big-number card; a number in a story that has pictures becomes a badge on the picture.
    const picture = art.items.some((it) => it.kind !== "star");
    scene = makeScene({
      ...base,
      type: "card",
      card:
        num && !picture
          ? { template: "big-number", props: { value: num.value, label: num.label, tone: tone === "accent" ? "paper" : tone } }
          : { template: "art-scene", props: { text, ...(num ? { badge: num.value } : {}), ...art } },
      slot: { targetMs: ms, status: "filled", flags: [] },
    });
  }
  return { scene, line: { id: crypto.randomUUID(), sceneId: scene.id, text: shot.line.trim(), voice: "none" } };
}

export function compileShots(shots: ShotInput[]): { scenes: Scene[]; lines: CompiledLine[] } {
  let body = 0;
  let before: ArtContext | undefined;
  const out = shots.map((s, i) => {
    const r = compileShot(s, i, shots.length, body, before);
    const t = r.scene.card?.template;
    if (!r.scene.card || t === "art-scene" || t === "big-number") body++;
    const p = r.scene.card?.props as { backdrop?: ArtContext["backdrop"]; character?: ArtContext["character"] } | undefined;
    if (p?.backdrop) before = { backdrop: p.backdrop, character: p.character ?? before?.character };
    return r;
  });
  return { scenes: out.map((o) => o.scene), lines: out.map((o) => o.line) };
}

/**
 * Basic mode (no AI): use the person's OWN words. Split what they wrote into sentences; each sentence becomes a shot.
 * Basic mode can't write for them, so a very short idea makes a very short video and says so.
 */
export function shotsFromYourWords(texts: string[]): ShotInput[] {
  const sentences = texts
    .join(" ")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
  let parts = sentences;
  // One long sentence: split at commas / "but" / "and" so there is more than one scene.
  if (parts.length < 3 && parts.length > 0) {
    parts = parts.flatMap((s) => (words(s).length >= 9 ? s.split(/,\s+|;\s+|\s+(?:but|and then|so|because)\s+/i).map((x) => x.trim()).filter((x) => x.length > 1) : [s]));
  }
  parts = parts.slice(0, 8);
  return parts.map((line, i) => ({ beat: i === 0 ? "hook" : i === parts.length - 1 ? "end" : `part-${i}`, role: i === 0 ? "hook" : i === parts.length - 1 && parts.length > 1 ? "cta" : "body", line }));
}
