// A short made-up story ("The late rain", marked fiction) so the whole pipeline can be tried without any files:
// animated text cards, drawn stills with a slow push-in, captions, and a script line for every scene (ready for a voice).
// The stills are flat illustrations drawn here in code, so nothing is downloaded and nothing is copyrighted.
import { estimateWords } from "../audio/timing";
import { makeScene, type Scene } from "../model/types";

const W = 1080;
const H = 1920;

type Painter = (g: CanvasRenderingContext2D) => void;

function sky(g: CanvasRenderingContext2D, top: string, bottom: string, horizon = 0.55) {
  const grad = g.createLinearGradient(0, 0, 0, H * horizon);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
}

function hills(g: CanvasRenderingContext2D, colors: string[], base: number) {
  colors.forEach((c, i) => {
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(0, H);
    const y0 = H * (base + i * 0.07);
    for (let x = 0; x <= W; x += 20) g.lineTo(x, y0 + Math.sin(x / 150 + i * 2) * 50 + Math.sin(x / 60 + i) * 14);
    g.lineTo(W, H);
    g.closePath();
    g.fill();
  });
}

function rows(g: CanvasRenderingContext2D, color: string, from: number, gap: number) {
  g.strokeStyle = color;
  g.lineWidth = 7;
  for (let y = from, i = 0; y < H; y += gap, i++) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y + (i % 2 ? 6 : -6));
    g.stroke();
  }
}

/** Dry paddy at dusk, cracked ground, a low red sun. */
const dry: Painter = (g) => {
  sky(g, "#2b1b3d", "#f08a4b");
  g.fillStyle = "#ffcf8a";
  g.beginPath();
  g.arc(W * 0.7, H * 0.42, 150, 0, Math.PI * 2);
  g.fill();
  hills(g, ["#5a3a4a", "#7a4a3a"], 0.46);
  g.fillStyle = "#a8743f";
  g.fillRect(0, H * 0.62, W, H);
  g.strokeStyle = "#6b4423";
  g.lineWidth = 6;
  for (let i = 0; i < 38; i++) {
    const x = (i * 211) % W;
    const y = H * 0.64 + ((i * 337) % (H * 0.34));
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 70, y + 40);
    g.lineTo(x + 40, y + 110);
    g.stroke();
  }
  g.fillStyle = "#8a9a4a"; // a few thin, tired seedlings
  for (let i = 0; i < 14; i++) {
    const x = 90 + i * 72;
    const y = H * 0.74 + (i % 3) * 90;
    g.fillRect(x, y, 8, -60 - (i % 4) * 14);
  }
};

/** Night, a farmer-sized figure with a bucket on a path to the river. */
const night: Painter = (g) => {
  sky(g, "#0b1230", "#25396b");
  g.fillStyle = "#e8ecff";
  g.beginPath();
  g.arc(W * 0.25, H * 0.2, 90, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)";
  for (let i = 0; i < 40; i++) g.fillRect((i * 173) % W, (i * 97) % (H * 0.4), 4, 4);
  hills(g, ["#10203f", "#0b1730"], 0.5);
  g.fillStyle = "#15305a"; // the river
  g.beginPath();
  g.moveTo(W * 0.1, H);
  g.bezierCurveTo(W * 0.4, H * 0.8, W * 0.8, H * 0.78, W * 0.95, H * 0.62);
  g.lineTo(W, H * 0.62);
  g.lineTo(W, H);
  g.closePath();
  g.fill();
  g.fillStyle = "#04070f"; // the figure
  g.beginPath();
  g.arc(W * 0.45, H * 0.66, 38, 0, Math.PI * 2);
  g.fill();
  g.fillRect(W * 0.45 - 32, H * 0.66 + 38, 64, 190);
  g.fillRect(W * 0.45 + 40, H * 0.66 + 120, 50, 60);
  g.fillStyle = "#ffd98a"; // a lantern
  g.beginPath();
  g.arc(W * 0.45 - 70, H * 0.66 + 150, 20, 0, Math.PI * 2);
  g.fill();
};

/** Morning, green rows, clouds and the first rain. */
const wet: Painter = (g) => {
  sky(g, "#7fb4c9", "#e9f2ef");
  g.fillStyle = "rgba(255,255,255,0.92)";
  for (const [x, y, r] of [
    [260, 330, 130],
    [420, 300, 160],
    [610, 340, 140],
    [800, 290, 150],
  ]) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = "#6d8794";
  g.fillRect(0, 380, W, 140);
  hills(g, ["#3f7a4a", "#2f6a3c"], 0.5);
  g.fillStyle = "#3e8f4b";
  g.fillRect(0, H * 0.64, W, H);
  rows(g, "#2b7a3c", H * 0.66, 78);
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 4;
  for (let i = 0; i < 90; i++) {
    const x = (i * 131) % W;
    const y = 520 + ((i * 257) % (H - 600));
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - 18, y + 70);
    g.stroke();
  }
};

function paint(p: Painter, name: string): Promise<File> {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  p(c.getContext("2d")!);
  return new Promise((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(new File([b], name, { type: "image/png" })) : reject(new Error("demo picture failed"))), "image/png"),
  );
}

export const STORY_NAME = "The late rain (fiction)";
export const STORY_IDEA = "A made-up short about a farmer, a late monsoon and a night of carrying water. A demo of Introcut's cards, stills, captions and export.";

export async function makeStoryStills(): Promise<File[]> {
  return [await paint(dry, "demo-dry-field.png"), await paint(night, "demo-night-river.png"), await paint(wet, "demo-first-rain.png")];
}

/** The six scenes and their spoken lines. `mediaIds` are the ids of the three stills, in order. */
export function buildStoryScenes(mediaIds: [string, string, string]): { scenes: Scene[]; lines: { id: string; sceneId: string; text: string; voice: "none" }[] } {
  const still = (mediaId: string, ms: number, beat: string, text: string, intent: string) =>
    makeScene({
      beat,
      type: "user-media",
      intent,
      source: { mediaId, inMs: 0, outMs: ms },
      framing: { mode: "auto-zoom", x: 0.5, y: 0.5, zoom: 1 },
      captions: { enabled: true, words: estimateWords(text, ms) },
      provenance: { by: "ai", reason: "demo story" },
    });
  const card = (beat: string, role: "hook" | "body" | "cta", ms: number, card: NonNullable<Scene["card"]>, intent: string) =>
    makeScene({ beat, role, type: "card", intent, card, slot: { targetMs: ms, status: "filled", flags: [] }, provenance: { by: "ai", reason: "demo story" } });

  const parts: { scene: Scene; text: string }[] = [
    {
      text: "Every farmer in the valley knew the rain was late.",
      scene: card("hook", "hook", 3600, { template: "hook-text", props: { lines: ["Every farmer in the valley", "knew the rain was late."], tone: "ink" } }, "Big text on a dark card"),
    },
    { text: "Ram's seedlings stood in cracked, dry mud.", scene: still(mediaIds[0], 4600, "setup", "Ram's seedlings stood in cracked, dry mud.", "A dry paddy field at dusk") },
    {
      text: "Three days was all those seedlings could survive.",
      scene: card("stakes", "body", 4400, { template: "big-number", props: { value: "3 days", label: "was all the seedlings could survive without water", tone: "paper" } }, "A big number with a one-line explanation"),
    },
    { text: "That night, he carried water from the river, bucket by bucket.", scene: still(mediaIds[1], 5400, "escalation", "That night, he carried water from the river, bucket by bucket.", "A farmer with a lantern and a bucket at night") },
    { text: "By morning the clouds arrived, and the first rain fell on the green rows.", scene: still(mediaIds[2], 5600, "payoff", "By morning the clouds arrived, and the first rain fell on the green rows.", "Green rows under rain clouds") },
    {
      text: "Some things are worth waiting for.",
      scene: card("end", "cta", 3600, { template: "end-card", props: { headline: "Some things are worth waiting for.", sub: "Fiction · made with Introcut", tone: "accent" } }, "A closing card"),
    },
  ];
  parts[0].scene.role = "hook";
  parts[parts.length - 1].scene.role = "cta";
  return {
    scenes: parts.map((p) => p.scene),
    lines: parts.map((p) => ({ id: crypto.randomUUID(), sceneId: p.scene.id, text: p.text, voice: "none" as const })),
  };
}
