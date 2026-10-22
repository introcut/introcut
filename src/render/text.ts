// Text layout for the canvas: wrap, shrink to fit, draw centered. Works for Latin and Devanagari (we only break at spaces,
// never inside a word, so conjuncts and vowel signs stay joined).
import { VIDEO_FONT } from "./fonts";

export const hasDevanagari = (s: string) => /[ऀ-ॿ]/.test(s);

export const fontFor = (size: number, weight = 800) => `${weight} ${Math.round(size)}px ${VIDEO_FONT}`;

/** Greedy word wrap for the current ctx.font. A single word wider than the box stays on its own line. */
export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (line && ctx.measureText(test).width > maxW) {
        out.push(line);
        line = w;
      } else line = test;
    }
    out.push(line);
  }
  return out;
}

export interface FittedText {
  size: number;
  lines: string[];
  lineHeight: number;
}

/** Largest font size (between minSize and maxSize) at which the text fits inside maxW x maxH. */
export function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxH: number, maxSize: number, minSize = 28, weight = 800): FittedText {
  const lh = hasDevanagari(text) ? 1.4 : 1.18;
  let size = maxSize;
  for (;;) {
    ctx.font = fontFor(size, weight);
    const lines = wrapLines(ctx, text, maxW);
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if ((lines.length * size * lh <= maxH && widest <= maxW) || size <= minSize) return { size, lines, lineHeight: lh };
    size -= 4;
  }
}

export interface FittedParagraphs {
  size: number;
  /** Each paragraph, already wrapped into rows. */
  blocks: string[][];
  lineHeight: number;
  /** Space between paragraphs, in pixels. */
  gap: number;
}

/** Largest font size at which several paragraphs (each possibly wrapping onto more rows) fit one box together. */
export function fitParagraphs(ctx: CanvasRenderingContext2D, paras: string[], maxW: number, maxH: number, maxSize: number, minSize = 40, weight = 800): FittedParagraphs {
  const lh = paras.some(hasDevanagari) ? 1.4 : 1.18;
  let size = maxSize;
  for (;;) {
    ctx.font = fontFor(size, weight);
    const blocks = paras.map((p) => wrapLines(ctx, p, maxW));
    const rows = blocks.reduce((n, b) => n + b.length, 0);
    const widest = Math.max(...blocks.flat().map((l) => ctx.measureText(l).width));
    const gap = size * 0.25 * (paras.length - 1);
    if ((rows * size * lh + gap <= maxH && widest <= maxW) || size <= minSize) return { size, blocks, lineHeight: lh, gap: size * 0.25 };
    size -= 4;
  }
}

/** Draw lines centered on (cx, cy). Call after fitText so ctx.font is set. */
export function drawCentered(ctx: CanvasRenderingContext2D, fit: FittedText, cx: number, cy: number) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const total = fit.lines.length * fit.size * fit.lineHeight;
  let y = cy - total / 2 + (fit.size * fit.lineHeight) / 2;
  for (const line of fit.lines) {
    ctx.fillText(line, cx, y);
    y += fit.size * fit.lineHeight;
  }
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
export const easeOutBack = (t: number) => {
  const c = 1.70158;
  const x = Math.min(1, Math.max(0, t)) - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};
export const easeInOut = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};
