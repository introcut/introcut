// Built-in animated scene templates. Each is a pure drawing function: (props, time inside the scene) -> pixels.
// The AI (or the user) only fills in the props; it never writes drawing code. Props are checked with Zod, so a bad value
// can't crash the renderer. Design space is 1080 x 1920 (renderFrame scales it to the real canvas).
import { z } from "zod";
import type { Scene, TemplateId } from "../model/types";
import { drawCentered, easeOutBack, easeOutCubic, fitParagraphs, fitText, fontFor } from "./text";

export const W = 1080;
export const H = 1920;
/** Text lives inside this box: clear of the top bar and of the caption/button area of Shorts, Reels and TikTok (my estimate; verify). */
export const SAFE = { x: 90, top: 190, bottom: 520 };

const Tone = z.enum(["ink", "paper", "accent"]).default("ink");
const PALETTE = {
  ink: { bg: "#17171a", fg: "#f6f5f2", accent: "#f2542d" },
  paper: { bg: "#f6f5f2", fg: "#17171a", accent: "#f2542d" },
  accent: { bg: "#f2542d", fg: "#ffffff", accent: "#17171a" },
} as const;

const HookTextProps = z.object({ lines: z.array(z.string().max(120)).min(1).max(4).default(["…"]), tone: Tone });
const BigNumberProps = z.object({ value: z.string().max(24).default("0"), label: z.string().max(140).default(""), tone: Tone });
const TextCardProps = z.object({ text: z.string().max(160).default("…"), tone: Tone });
const EndCardProps = z.object({ headline: z.string().max(120).default(""), sub: z.string().max(140).optional(), tone: Tone });

interface TemplateDef {
  name: string;
  description: string;
  example: Record<string, unknown>;
  schema: z.ZodType<Record<string, unknown>, z.ZodTypeDef, unknown>;
  draw: (ctx: CanvasRenderingContext2D, props: never, localMs: number, durMs: number) => void;
}

function background(ctx: CanvasRenderingContext2D, tone: keyof typeof PALETTE) {
  const p = PALETTE[tone];
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);
  // A soft light in the upper middle gives the flat color some depth.
  const g = ctx.createRadialGradient(W / 2, H * 0.35, 80, W / 2, H * 0.35, H * 0.8);
  g.addColorStop(0, "rgba(255,255,255,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  return p;
}

const boxW = W - SAFE.x * 2;
const boxH = H - SAFE.top - SAFE.bottom;
const boxCy = SAFE.top + boxH / 2;

const hookText: TemplateDef = {
  name: "Hook text",
  description: "One to four big lines that pop in one after another. For the first 3 seconds.",
  example: { lines: ["Nobody tells you this", "about planting garlic."], tone: "ink" },
  schema: HookTextProps,
  draw(ctx, props: z.infer<typeof HookTextProps>, t) {
    const p = background(ctx, props.tone);
    const fit = fitParagraphs(ctx, props.lines, boxW, boxH, 150, 40);
    const rowH = fit.size * fit.lineHeight;
    const totalH = fit.blocks.reduce((n, blk) => n + blk.length * rowH, 0) + fit.gap * (fit.blocks.length - 1);
    let y = boxCy - totalH / 2;
    fit.blocks.forEach((rows, i) => {
      const blockH = rows.length * rowH;
      const k = easeOutBack((t - i * 220) / 420); // each line starts 0.22 s after the one above
      if (k > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, k * 1.4);
        ctx.translate(W / 2, y + blockH / 2 + (1 - k) * 60);
        ctx.scale(0.92 + 0.08 * k, 0.92 + 0.08 * k);
        ctx.font = fontFor(fit.size);
        ctx.fillStyle = i === fit.blocks.length - 1 && fit.blocks.length > 1 ? p.accent : p.fg;
        drawCentered(ctx, { size: fit.size, lines: rows, lineHeight: fit.lineHeight }, 0, 0);
        ctx.restore();
      }
      y += blockH + fit.gap;
    });
  },
};

const NUM_RE = /^(\d+(?:[.,]\d+)?)(.*)$/;

const bigNumber: TemplateDef = {
  name: "Big number",
  description: "A large number that counts up, with one line of explanation. For a surprising fact in the story.",
  example: { value: "3 days", label: "late: the monsoon came after the seedlings were already dry.", tone: "paper" },
  schema: BigNumberProps,
  draw(ctx, props: z.infer<typeof BigNumberProps>, t) {
    const p = background(ctx, props.tone);
    const m = NUM_RE.exec(props.value.trim());
    let shown = props.value;
    if (m) {
      const target = parseFloat(m[1].replace(",", "."));
      const decimals = (m[1].split(/[.,]/)[1] ?? "").length;
      shown = (target * easeOutCubic(t / 900)).toFixed(decimals) + m[2];
    }
    const pop = easeOutBack(t / 450);
    ctx.save();
    ctx.translate(W / 2, SAFE.top + boxH * 0.36);
    ctx.scale(0.85 + 0.15 * pop, 0.85 + 0.15 * pop);
    ctx.fillStyle = p.accent;
    drawCentered(ctx, fitText(ctx, shown, boxW, 360, 320, 90), 0, 0);
    ctx.restore();
    if (props.label) {
      ctx.save();
      ctx.globalAlpha = easeOutCubic((t - 500) / 400);
      ctx.fillStyle = p.fg;
      drawCentered(ctx, fitText(ctx, props.label, boxW, 420, 68, 36, 700), W / 2, SAFE.top + boxH * 0.72);
      ctx.restore();
    }
  },
};

const endCard: TemplateDef = {
  name: "End card",
  description: "A closing line with an optional small line under it. Keep it short and stop.",
  example: { headline: "Plant it deep. Wait for the rain.", sub: "Follow for the next one", tone: "accent" },
  schema: EndCardProps,
  draw(ctx, props: z.infer<typeof EndCardProps>, t) {
    const p = background(ctx, props.tone);
    ctx.save();
    ctx.globalAlpha = easeOutCubic(t / 500);
    ctx.fillStyle = p.fg;
    drawCentered(ctx, fitText(ctx, props.headline, boxW, boxH * 0.6, 120, 44), W / 2, boxCy - 40);
    ctx.restore();
    if (props.sub) {
      ctx.save();
      ctx.globalAlpha = easeOutCubic((t - 450) / 400);
      ctx.fillStyle = p.fg;
      drawCentered(ctx, fitText(ctx, props.sub, boxW, 160, 54, 30, 700), W / 2, boxCy + boxH * 0.32);
      ctx.restore();
    }
  },
};

const textCard: TemplateDef = {
  name: "Statement card",
  description: "One sentence, large and centred. The default card for any line of the story.",
  example: { text: "Ram's seedlings stood in cracked, dry mud.", tone: "paper" },
  schema: TextCardProps,
  draw(ctx, props: z.infer<typeof TextCardProps>, t) {
    const p = background(ctx, props.tone);
    const k = easeOutCubic(t / 450);
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(0, (1 - k) * 50);
    ctx.fillStyle = p.fg;
    drawCentered(ctx, fitText(ctx, props.text, boxW, boxH * 0.8, 112, 44), W / 2, boxCy);
    ctx.restore();
  },
};

export const TEMPLATES: Record<TemplateId, TemplateDef> = { "hook-text": hookText, "big-number": bigNumber, "end-card": endCard, "text-card": textCard };

/** Props with defaults filled in, or null if they don't fit the template. */
export function parseCardProps(card: NonNullable<Scene["card"]>): Record<string, unknown> | null {
  const r = TEMPLATES[card.template]?.schema.safeParse(card.props);
  return r?.success ? r.data : null;
}

/** Draw a card scene. Returns false if the template or its props are unusable (the caller draws a placeholder). */
export function drawCard(ctx: CanvasRenderingContext2D, card: NonNullable<Scene["card"]>, localMs: number, durMs: number): boolean {
  const def = TEMPLATES[card.template];
  const props = def && parseCardProps(card);
  if (!def || !props) return false;
  def.draw(ctx, props as never, localMs, durMs);
  return true;
}
