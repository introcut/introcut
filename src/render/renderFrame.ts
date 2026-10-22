// THE one function that turns the project into a picture. The preview and the exported video both call it, so what you
// see is what you get. It only draws; getting the right frame of a clip is the caller's job (the preview asks the
// <video> element, the exporter decodes the exact frame), passed in through `assets`.
import type { Project, Scene } from "../model/types";
import { sceneAt, type PlacedScene } from "../model/timeline";
import { drawCard, H, W, SAFE } from "./templates";
import { drawCentered, easeInOut, fitText, fontFor } from "./text";

export interface RenderMedia {
  source: CanvasImageSource;
  width: number;
  height: number;
}

export interface RenderAssets {
  /** The picture to show for a media item right now, or null if it isn't ready (or the file is missing). */
  media(mediaId: string): RenderMedia | null;
}

const HILITE = "#ffe14d";

/** Fill the 1080x1920 frame with the media ("cover"), with an optional slow push-in or a manual zoom/pan. */
function drawMedia(ctx: CanvasRenderingContext2D, m: RenderMedia, framing: Scene["framing"], progress: number) {
  const cover = Math.max(W / m.width, H / m.height);
  const zoom = framing.mode === "auto-zoom" ? 1 + 0.14 * easeInOut(progress) : framing.mode === "manual" ? Math.max(1, framing.zoom) : 1;
  const s = cover * zoom;
  const dw = m.width * s;
  const dh = m.height * s;
  const fx = framing.mode === "manual" ? framing.x : 0.5;
  const fy = framing.mode === "manual" ? framing.y : 0.5;
  const dx = Math.min(0, Math.max(W - dw, W / 2 - fx * dw));
  const dy = Math.min(0, Math.max(H - dh, H / 2 - fy * dh));
  ctx.drawImage(m.source, dx, dy, dw, dh);
}

function placeholder(ctx: CanvasRenderingContext2D, title: string, detail: string) {
  ctx.fillStyle = "#222226";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 6;
  ctx.setLineDash([28, 22]);
  ctx.strokeRect(70, 190, W - 140, H - 190 - 420);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  drawCentered(ctx, fitText(ctx, title, W - 260, 160, 72, 36), W / 2, H * 0.4);
  if (detail) {
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    drawCentered(ctx, fitText(ctx, detail, W - 260, 520, 46, 28, 700), W / 2, H * 0.55);
  }
}

/** Break the scene's caption words into short groups (at most 4 words, or fewer after punctuation). */
export function captionChunks(words: Scene["captions"]["words"]): Scene["captions"]["words"][] {
  const chunks: Scene["captions"]["words"][] = [];
  let cur: Scene["captions"]["words"] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 4 || /[.!?,;:।]$/.test(w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

/** Word-by-word captions in the lower third: the word being spoken is highlighted ("bold-highlight" preset). */
function drawCaptions(ctx: CanvasRenderingContext2D, words: Scene["captions"]["words"], localMs: number) {
  const chunk = captionChunks(words).find((c) => localMs >= c[0].startMs && localMs < c[c.length - 1].endMs + 250);
  if (!chunk) return;
  const text = chunk.map((w) => w.text).join(" ");
  const fit = fitText(ctx, text, W - SAFE.x * 2, 300, 88, 44);
  ctx.font = fontFor(fit.size);
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(8, fit.size * 0.16);
  ctx.strokeStyle = "rgba(0,0,0,0.9)";
  // Lay the chunk out word by word so one word can be a different color.
  const lines: { text: string; words: typeof chunk }[] = [];
  let line: typeof chunk = [];
  for (const w of chunk) {
    const test = [...line, w].map((x) => x.text).join(" ");
    if (line.length && ctx.measureText(test).width > W - SAFE.x * 2) {
      lines.push({ text: line.map((x) => x.text).join(" "), words: line });
      line = [w];
    } else line.push(w);
  }
  lines.push({ text: line.map((x) => x.text).join(" "), words: line });
  const lh = fit.size * fit.lineHeight;
  let y = H - SAFE.bottom + 70 - ((lines.length - 1) * lh) / 2;
  for (const l of lines) {
    const total = ctx.measureText(l.text).width;
    let x = W / 2 - total / 2;
    ctx.textAlign = "left";
    l.words.forEach((w, i) => {
      const piece = i === 0 ? w.text : ` ${w.text}`;
      ctx.strokeText(piece, x, y);
      ctx.fillStyle = localMs >= w.startMs && localMs < w.endMs ? HILITE : "#ffffff";
      ctx.fillText(piece, x, y);
      x += ctx.measureText(piece).width;
    });
    y += lh;
  }
}

/** Short on-screen text the scene carries (the "overlays" in the project file). */
function drawOverlays(ctx: CanvasRenderingContext2D, scene: Scene, localMs: number) {
  for (const o of scene.overlays) {
    if (localMs < o.startMs || localMs >= o.endMs) continue;
    const y = o.position === "top" ? SAFE.top + 60 : o.position === "center" ? H * 0.45 : H - SAFE.bottom - 80;
    const fit = fitText(ctx, o.text, W - SAFE.x * 2 - 60, 260, 70, 36);
    const widest = Math.max(...fit.lines.map((l) => ctx.measureText(l).width)) + 60;
    const hgt = fit.lines.length * fit.size * fit.lineHeight + 30;
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.beginPath();
    ctx.roundRect(W / 2 - widest / 2, y - hgt / 2, widest, hgt, 28);
    ctx.fill();
    ctx.fillStyle = "#fff";
    drawCentered(ctx, fit, W / 2, y);
  }
}

/** Draw the frame at `tMs` onto `ctx`, whatever its pixel size (everything is laid out in 1080 x 1920 and scaled). */
export function renderFrame(ctx: CanvasRenderingContext2D, project: Project, placed: PlacedScene[], tMs: number, assets: RenderAssets): void {
  const { width: cw, height: ch } = ctx.canvas;
  ctx.save();
  ctx.setTransform(cw / W, 0, 0, ch / H, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "middle";

  const p = sceneAt(placed, tMs);
  if (!p) {
    placeholder(ctx, "Nothing here yet", "Add a clip or photo, or write the script.");
    ctx.restore();
    return;
  }
  const scene = p.scene;
  const localMs = Math.max(0, tMs - p.startMs);
  const durMs = Math.max(1, p.endMs - p.startMs);

  if (scene.card) {
    if (!drawCard(ctx, scene.card, localMs, durMs)) placeholder(ctx, `Shot ${p.index + 1}`, "This card has text the template can't use.");
  } else if (scene.source) {
    const item = project.media.find((m) => m.id === scene.source!.mediaId);
    const media = item ? assets.media(item.id) : null;
    if (media) drawMedia(ctx, media, scene.framing, localMs / durMs);
    else if (item) placeholder(ctx, `Missing file`, item.name);
    else placeholder(ctx, `Shot ${p.index + 1}`, "The file for this shot was removed.");
  } else {
    placeholder(ctx, `Shot ${p.index + 1}: needs a clip`, scene.intent);
  }

  drawOverlays(ctx, scene, localMs);
  if (scene.captions.enabled && scene.captions.words.length) drawCaptions(ctx, scene.captions.words, localMs);
  ctx.restore();
}

