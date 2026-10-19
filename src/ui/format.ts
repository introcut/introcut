import type { MediaItem } from "../model/types";

export function aspectLabel(w: number, h: number): string {
  if (!w || !h) return "–";
  const r = w / h;
  const known: [number, string][] = [
    [9 / 16, "9:16"],
    [16 / 9, "16:9"],
    [1, "1:1"],
    [4 / 5, "4:5"],
    [3 / 4, "3:4"],
    [4 / 3, "4:3"],
  ];
  const hit = known.find(([k]) => Math.abs(r - k) / k < 0.02);
  return hit ? hit[1] : r.toFixed(2);
}

export const isVertical = (w: number, h: number) => !!w && !!h && Math.abs(w / h - 9 / 16) / (9 / 16) < 0.02;

export function fmtBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function fmtDur(ms?: number): string {
  if (ms === undefined) return "?";
  const s = ms / 1000;
  return s < 60 ? `${s.toFixed(1)} s` : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}

/** Plain-language notes shown on each media card. */
export function hints(m: MediaItem): string[] {
  const p = m.probe;
  const out: string[] = [];
  if (m.kind !== "audio" && !isVertical(p.width, p.height)) {
    out.push("Not vertical: it will be center-cropped to 9:16.");
  }
  if (m.kind === "video" && p.hasAudio === false) out.push("No audio found (or an unsupported audio format).");
  if (p.avgLoudnessDb != null && p.avgLoudnessDb < -35) out.push("Very quiet audio.");
  if (p.peakDb != null && p.peakDb > -0.5) out.push("Audio may be clipping (too loud).");
  return out;
}
