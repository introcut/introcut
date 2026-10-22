// Pictures drawn by code: flat-style backdrops and small characters/props with idle animation. Everything is a pure function of time
// (no randomness that changes between frames), so the preview and the exported video match. Design space is 1080 x 1920.
// All art here was drawn for Introcut (MIT); nothing is copied from anywhere.
const W = 1080;
const H = 1920;
const TAU = Math.PI * 2;
export const GROUND_Y = 1380;

export const BACKDROPS = ["day", "dusk", "night", "rain", "river", "village", "city", "room", "mountain", "abstract"] as const;
export type Backdrop = (typeof BACKDROPS)[number];

export const ITEM_KINDS = ["monkey", "farmer", "cat", "garlic", "seedling", "tree", "house", "bucket", "phone", "coin", "heart", "book", "bulb", "sun", "cloud", "moon", "star"] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export const ITEM_LABEL: Record<ItemKind, string> = {
  monkey: "Monkey", farmer: "Farmer", cat: "Cat", garlic: "Garlic", seedling: "Seedling", tree: "Tree", house: "House", bucket: "Bucket", phone: "Phone",
  coin: "Coin", heart: "Heart", book: "Book", bulb: "Idea bulb", sun: "Sun", cloud: "Cloud", moon: "Moon", star: "Star",
};
export const BACKDROP_LABEL: Record<Backdrop, string> = {
  day: "Sunny field", dusk: "Evening", night: "Night", rain: "Rain", river: "River", village: "Village", city: "City", room: "Room", mountain: "Mountains", abstract: "Colour shapes",
};

/** Items that float in the sky instead of standing on the ground. */
export const SKY_ITEMS: ItemKind[] = ["sun", "cloud", "moon", "star", "bulb"];

export interface PlacedItem {
  kind: ItemKind;
  x: number;
  y: number;
  s: number;
  flip?: boolean;
}

/** Where up to four items stand, so the AI/user only chooses WHICH items, never pixel positions. */
export function layoutItems(kinds: ItemKind[]): PlacedItem[] {
  const list = kinds.slice(0, 4);
  const ground = list.filter((k) => !SKY_ITEMS.includes(k));
  const sky = list.filter((k) => SKY_ITEMS.includes(k));
  const gx = ground.length === 1 ? [540] : ground.length === 2 ? [360, 740] : ground.length === 3 ? [250, 560, 850] : [200, 420, 660, 880];
  const gs = ground.length === 1 ? [1.55] : ground.length === 2 ? [1.4, 1.1] : ground.length === 3 ? [1.2, 1.3, 1.0] : [1.0, 1.0, 0.95, 0.9];
  const placed: PlacedItem[] = ground.map((kind, i) => ({ kind, x: gx[i], y: GROUND_Y, s: gs[i], flip: i % 2 === 1 }));
  const sx = sky.length === 1 ? [820] : [250, 830];
  sky.forEach((kind, i) => placed.push({ kind, x: sx[i] ?? 540, y: 1010, s: kind === "cloud" ? 1.1 : 0.9 }));
  return placed;
}

// ---------------------------------------------------------------------------------------------- small helpers
type C = CanvasRenderingContext2D;
const disc = (c: C, x: number, y: number, r: number, fill: string) => {
  c.fillStyle = fill;
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fill();
};
const oval = (c: C, x: number, y: number, rx: number, ry: number, fill: string, rot = 0) => {
  c.fillStyle = fill;
  c.beginPath();
  c.ellipse(x, y, rx, ry, rot, 0, TAU);
  c.fill();
};
const rrect = (c: C, x: number, y: number, w: number, h: number, r: number, fill: string) => {
  c.fillStyle = fill;
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
};
const shadow = (c: C, rx: number) => oval(c, 0, 4, rx, rx * 0.16, "rgba(0,0,0,0.18)");
const blink = (t: number, phase = 0) => ((t + phase) % 3400 > 3250 ? 0.1 : 1);
const sw = (t: number, period: number, amp: number, phase = 0) => Math.sin(((t + phase) / period) * TAU) * amp;
const easeBack = (x: number) => {
  const k = Math.min(1, Math.max(0, x)) - 1;
  return 1 + 2.70158 * k * k * k + 1.70158 * k * k;
};
/** A tiny seeded random number generator, so "random" decoration is the same in every frame. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function limb(c: C, x: number, y: number, len: number, w: number, angle: number, color: string) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  rrect(c, -w / 2, 0, w, len, w / 2, color);
  c.restore();
}

// ---------------------------------------------------------------------------------------------- items (origin = feet, +y down, about 400 tall)
const ITEMS: Record<ItemKind, (c: C, t: number) => void> = {
  monkey(c, t) {
    const fur = "#8a5a3b";
    const face = "#e7bf94";
    shadow(c, 120);
    c.strokeStyle = fur;
    c.lineWidth = 26;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(70, -110);
    c.bezierCurveTo(200, -90, 230, -230, 150, -300);
    c.stroke();
    const bob = sw(t, 900, 5);
    c.save();
    c.translate(0, bob);
    rrect(c, -78, -90, 56, 92, 26, fur);
    rrect(c, 22, -90, 56, 92, 26, fur);
    oval(c, 0, -170, 100, 118, fur);
    oval(c, 0, -150, 62, 80, face);
    limb(c, 95, -235, 130, 40, 0.45, fur);
    limb(c, -95, -235, 135, 40, -2.5 + sw(t, 700, 0.35), fur); // waving arm
    disc(c, -88, -335, 34, fur);
    disc(c, 88, -335, 34, fur);
    disc(c, -88, -335, 20, face);
    disc(c, 88, -335, 20, face);
    disc(c, 0, -325, 92, fur);
    oval(c, 0, -308, 64, 58, face);
    const b = blink(t);
    oval(c, -27, -332, 10, 11 * b, "#2a1a10");
    oval(c, 27, -332, 10, 11 * b, "#2a1a10");
    disc(c, -9, -306, 4, "#7a4a30");
    disc(c, 9, -306, 4, "#7a4a30");
    c.strokeStyle = "#7a4a30";
    c.lineWidth = 6;
    c.beginPath();
    c.arc(0, -296, 26, 0.25, Math.PI - 0.25);
    c.stroke();
    c.restore();
  },
  farmer(c, t) {
    shadow(c, 100);
    const s = sw(t, 1200, 0.03);
    c.save();
    c.rotate(s);
    rrect(c, -52, -110, 40, 112, 14, "#2f3a4a");
    rrect(c, 12, -110, 40, 112, 14, "#2f3a4a");
    rrect(c, -70, -270, 140, 175, 38, "#3f78b5");
    limb(c, 66, -250, 130, 36, 0.35 + sw(t, 800, 0.1), "#3f78b5");
    limb(c, -66, -250, 130, 36, -0.35, "#3f78b5");
    disc(c, 0, -325, 58, "#d9a16f");
    oval(c, 0, -355, 112, 20, "#e6c15a");
    c.fillStyle = "#e6c15a";
    c.beginPath();
    c.arc(0, -358, 62, Math.PI, 0);
    c.fill();
    const b = blink(t, 900);
    oval(c, -20, -322, 6, 7 * b, "#2a1a10");
    oval(c, 20, -322, 6, 7 * b, "#2a1a10");
    c.strokeStyle = "#8a5a3b";
    c.lineWidth = 5;
    c.beginPath();
    c.arc(0, -305, 20, 0.2, Math.PI - 0.2);
    c.stroke();
    c.restore();
  },
  cat(c, t) {
    const fur = "#e49b45";
    shadow(c, 100);
    c.strokeStyle = fur;
    c.lineWidth = 24;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(70, -60);
    c.bezierCurveTo(170, -50, 170, -170, 120 + sw(t, 1100, 14), -200);
    c.stroke();
    oval(c, 0, -90, 92, 86, fur);
    oval(c, 0, -80, 52, 56, "#f6d9a8");
    disc(c, 0, -215, 74, fur);
    c.fillStyle = fur;
    for (const d of [-1, 1]) {
      c.beginPath();
      c.moveTo(d * 70, -250);
      c.lineTo(d * 40, -320);
      c.lineTo(d * 8, -270);
      c.closePath();
      c.fill();
    }
    const b = blink(t, 500);
    oval(c, -26, -222, 9, 11 * b, "#2a1a10");
    oval(c, 26, -222, 9, 11 * b, "#2a1a10");
    disc(c, 0, -200, 6, "#c8575a");
    c.strokeStyle = "#5a3a20";
    c.lineWidth = 3;
    for (const d of [-1, 1]) for (const dy of [-6, 8]) {
      c.beginPath();
      c.moveTo(d * 18, -196 + dy);
      c.lineTo(d * 62, -196 + dy * 2);
      c.stroke();
    }
  },
  garlic(c, t) {
    shadow(c, 100);
    c.save();
    c.rotate(sw(t, 1600, 0.04));
    c.fillStyle = "#f6efe2";
    c.beginPath();
    c.moveTo(0, -300);
    c.bezierCurveTo(40, -240, 130, -200, 118, -110);
    c.bezierCurveTo(108, -30, 40, 0, 0, 0);
    c.bezierCurveTo(-40, 0, -108, -30, -118, -110);
    c.bezierCurveTo(-130, -200, -40, -240, 0, -300);
    c.fill();
    c.strokeStyle = "#d8cbb4";
    c.lineWidth = 7;
    for (const x of [-58, 0, 58]) {
      c.beginPath();
      c.moveTo(x * 0.3, -250);
      c.quadraticCurveTo(x * 1.5, -140, x * 0.8, -20);
      c.stroke();
    }
    c.strokeStyle = "#a88a62";
    c.lineWidth = 5;
    for (let i = -3; i <= 3; i++) {
      c.beginPath();
      c.moveTo(i * 8, 0);
      c.lineTo(i * 12, 22);
      c.stroke();
    }
    c.restore();
  },
  seedling(c, t) {
    shadow(c, 70);
    oval(c, 0, -6, 70, 22, "#7a5232");
    const grow = 1;
    c.save();
    c.scale(1, grow);
    c.strokeStyle = "#4a9a4a";
    c.lineWidth = 12;
    c.lineCap = "round";
    const lean = sw(t, 1400, 10);
    c.beginPath();
    c.moveTo(0, -10);
    c.quadraticCurveTo(lean * 0.4, -110, lean, -210);
    c.stroke();
    oval(c, lean - 46, -225, 52, 22, "#5fb85f", -0.45);
    oval(c, lean + 46, -245, 52, 22, "#5fb85f", 0.45);
    c.restore();
  },
  tree(c, t) {
    shadow(c, 130);
    rrect(c, -30, -250, 60, 252, 18, "#7a5232");
    const s = sw(t, 1800, 6);
    disc(c, -70 + s, -300, 85, "#3f8f4a");
    disc(c, 70 + s, -300, 85, "#3f8f4a");
    disc(c, 0 + s, -370, 100, "#4aa356");
    disc(c, 0 + s, -280, 90, "#4aa356");
  },
  house(c) {
    shadow(c, 190);
    rrect(c, -150, -190, 300, 192, 8, "#ead9b4");
    c.fillStyle = "#b5523b";
    c.beginPath();
    c.moveTo(-190, -185);
    c.lineTo(0, -320);
    c.lineTo(190, -185);
    c.closePath();
    c.fill();
    rrect(c, -40, -120, 80, 120, 10, "#7a5232");
    rrect(c, -125, -150, 60, 56, 8, "#9ad0f5");
    rrect(c, 65, -150, 60, 56, 8, "#9ad0f5");
  },
  bucket(c, t) {
    shadow(c, 90);
    c.strokeStyle = "#5f6f80";
    c.lineWidth = 9;
    c.beginPath();
    c.arc(0, -150, 80, Math.PI, 0);
    c.stroke();
    c.fillStyle = "#6b7b8c";
    c.beginPath();
    c.moveTo(-90, -150);
    c.lineTo(90, -150);
    c.lineTo(66, 0);
    c.lineTo(-66, 0);
    c.closePath();
    c.fill();
    oval(c, 0, -150, 90, 16, "#4aa3df");
    oval(c, sw(t, 900, 20), -152, 24, 5, "rgba(255,255,255,0.5)");
  },
  phone(c, t) {
    shadow(c, 80);
    c.save();
    c.rotate(sw(t, 1500, 0.03));
    rrect(c, -85, -380, 170, 340, 26, "#1f232b");
    rrect(c, -73, -362, 146, 300, 14, "#9ad0f5");
    rrect(c, -22, -372, 44, 8, 4, "#0d0f14");
    for (let i = 0; i < 6; i++) rrect(c, -56 + (i % 3) * 40, -330 + Math.floor(i / 3) * 44, 30, 30, 8, i % 2 ? "#f2542d" : "#ffffff");
    rrect(c, -56, -230, 112, 14, 7, "#ffffff");
    rrect(c, -56, -204, 76, 14, 7, "rgba(255,255,255,0.7)");
    c.restore();
  },
  coin(c, t) {
    shadow(c, 90);
    const squash = Math.abs(Math.cos((t / 1400) * TAU)) * 0.85 + 0.15;
    c.save();
    c.translate(0, -120);
    c.scale(squash, 1);
    disc(c, 0, 0, 100, "#e6b422");
    disc(c, 0, 0, 80, "#f2cf57");
    c.fillStyle = "#e6b422";
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2;
      const r = i % 2 ? 22 : 48;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath();
    c.fill();
    c.restore();
  },
  heart(c, t) {
    const k = 1 + Math.abs(Math.sin((t / 700) * Math.PI)) * 0.12;
    c.save();
    c.translate(0, -120);
    c.scale(k, k);
    c.fillStyle = "#e0434f";
    c.beginPath();
    c.moveTo(0, 70);
    c.bezierCurveTo(-130, -10, -90, -110, 0, -50);
    c.bezierCurveTo(90, -110, 130, -10, 0, 70);
    c.fill();
    c.restore();
    shadow(c, 70);
  },
  book(c, t) {
    shadow(c, 120);
    c.save();
    c.translate(0, -90 + sw(t, 1300, 6));
    c.fillStyle = "#3b6ea5";
    c.beginPath();
    c.moveTo(-130, -10);
    c.lineTo(0, 10);
    c.lineTo(130, -10);
    c.lineTo(130, 20);
    c.lineTo(0, 40);
    c.lineTo(-130, 20);
    c.closePath();
    c.fill();
    c.fillStyle = "#fffaf0";
    c.beginPath();
    c.moveTo(-122, -14);
    c.lineTo(-2, 2);
    c.lineTo(-2, -120);
    c.lineTo(-122, -134);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(122, -14);
    c.lineTo(2, 2);
    c.lineTo(2, -120);
    c.lineTo(122, -134);
    c.closePath();
    c.fill();
    c.strokeStyle = "#cdbf9f";
    c.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(-100, -40 - i * 22);
      c.lineTo(-26, -24 - i * 22);
      c.moveTo(100, -40 - i * 22);
      c.lineTo(26, -24 - i * 22);
      c.stroke();
    }
    c.restore();
  },
  bulb(c, t) {
    const glow = 0.5 + Math.abs(Math.sin((t / 900) * Math.PI)) * 0.5;
    c.save();
    c.translate(0, -140);
    c.globalAlpha = 0.25 * glow;
    disc(c, 0, 0, 150, "#ffe14d");
    c.globalAlpha = 1;
    c.strokeStyle = "#ffe14d";
    c.lineWidth = 8;
    c.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      c.beginPath();
      c.moveTo(Math.cos(a) * 110, Math.sin(a) * 110);
      c.lineTo(Math.cos(a) * (140 + glow * 14), Math.sin(a) * (140 + glow * 14));
      c.stroke();
    }
    disc(c, 0, -10, 80, "#ffe14d");
    rrect(c, -34, 52, 68, 46, 10, "#9aa3ad");
    rrect(c, -26, 98, 52, 14, 7, "#6c757f");
    c.restore();
  },
  sun(c, t) {
    c.save();
    c.translate(0, -140);
    c.rotate((t / 9000) * TAU);
    c.strokeStyle = "#ffcf3f";
    c.lineWidth = 14;
    c.lineCap = "round";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU;
      c.beginPath();
      c.moveTo(Math.cos(a) * 116, Math.sin(a) * 116);
      c.lineTo(Math.cos(a) * 160, Math.sin(a) * 160);
      c.stroke();
    }
    c.restore();
    disc(c, 0, -140, 92, "#ffd84d");
    disc(c, 0, -140, 74, "#ffe27a");
  },
  cloud(c, t) {
    c.save();
    c.translate(sw(t, 6000, 30), -130);
    c.fillStyle = "rgba(255,255,255,0.95)";
    for (const [x, y, r] of [[-90, 10, 60], [-10, -26, 82], [78, 6, 64], [0, 30, 70]] as const) {
      c.beginPath();
      c.arc(x, y, r, 0, TAU);
      c.fill();
    }
    c.restore();
  },
  moon(c, t) {
    c.save();
    c.translate(0, -150 + sw(t, 3000, 8));
    c.fillStyle = "#f6efc8";
    c.beginPath();
    c.arc(0, 0, 90, 0, TAU);
    c.arc(42, -18, 78, 0, TAU, true);
    c.fill("evenodd");
    c.restore();
  },
  star(c, t) {
    c.save();
    c.translate(0, -140);
    c.rotate((t / 4000) * TAU);
    const k = 1 + Math.abs(Math.sin((t / 800) * Math.PI)) * 0.1;
    c.scale(k, k);
    c.fillStyle = "#ffd84d";
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2;
      const r = i % 2 ? 44 : 100;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath();
    c.fill();
    c.restore();
  },
};

/** Draw one item. (0,0) is where it stands; `s` scales it; items pop in with a little bounce. */
export function drawItem(c: C, item: PlacedItem, tMs: number, delayMs = 0): void {
  const k = easeBack((tMs - delayMs + 200) / 450);
  if (k <= 0) return;
  c.save();
  c.translate(item.x, item.y);
  c.scale((item.flip ? -1 : 1) * item.s * k, item.s * k);
  c.globalAlpha = Math.min(1, k * 1.5);
  ITEMS[item.kind](c, tMs);
  c.restore();
}

// ---------------------------------------------------------------------------------------------- backdrops
function skyGradient(c: C, top: string, bottom: string, to = GROUND_Y) {
  const g = c.createLinearGradient(0, 0, 0, to);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
}
function hill(c: C, color: string, base: number, amp: number, phase: number) {
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) c.lineTo(x, base + Math.sin(x / 190 + phase) * amp + Math.sin(x / 70 + phase * 2) * (amp * 0.2));
  c.lineTo(W, H);
  c.closePath();
  c.fill();
}
function rows(c: C, color: string) {
  c.strokeStyle = color;
  c.lineWidth = 8;
  for (let y = GROUND_Y + 40, i = 0; y < H; y += 70 + i * 6, i++) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(W, y + (i % 2 ? 8 : -8));
    c.stroke();
  }
}
function stars(c: C, t: number, n: number, seed: number) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * W;
    const y = r() * 900;
    const a = 0.4 + 0.6 * Math.abs(Math.sin((t / 1200 + r() * 6) * Math.PI));
    c.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
    c.fillRect(x, y, 5, 5);
  }
}

const BACK: Record<Backdrop, (c: C, t: number, seed: number) => void> = {
  day(c) {
    skyGradient(c, "#8fd0ef", "#eaf7f2");
    hill(c, "#7cc47a", 1180, 50, 1);
    hill(c, "#5faa62", 1300, 40, 3);
    c.fillStyle = "#4e9a55";
    c.fillRect(0, GROUND_Y, W, H);
    rows(c, "#3f8647");
  },
  dusk(c) {
    skyGradient(c, "#3a2455", "#f2955a");
    disc(c, 760, 1090, 120, "rgba(255,222,160,0.9)");
    hill(c, "#5a3a5e", 1170, 60, 2);
    hill(c, "#44304e", 1300, 40, 4);
    c.fillStyle = "#34283f";
    c.fillRect(0, GROUND_Y, W, H);
    rows(c, "#2a2034");
  },
  night(c, t, seed) {
    skyGradient(c, "#0b1230", "#25396b");
    stars(c, t, 60, seed);
    hill(c, "#13244a", 1200, 55, 5);
    hill(c, "#0d1a38", 1310, 40, 6);
    c.fillStyle = "#0a1530";
    c.fillRect(0, GROUND_Y, W, H);
  },
  rain(c, t, seed) {
    skyGradient(c, "#56667a", "#9fb0be");
    c.fillStyle = "rgba(60,72,88,0.9)";
    for (const [x, y, r] of [[150, 260, 130], [330, 230, 160], [560, 270, 140], [790, 230, 165], [960, 280, 120]] as const) {
      c.beginPath();
      c.arc(x, y, r, 0, TAU);
      c.fill();
    }
    hill(c, "#5d8f6b", 1220, 45, 1);
    c.fillStyle = "#3f7650";
    c.fillRect(0, GROUND_Y, W, H);
    rows(c, "#2f6240");
    const r = rng(seed + 9);
    c.strokeStyle = "rgba(220,240,255,0.7)";
    c.lineWidth = 5;
    for (let i = 0; i < 70; i++) {
      const x0 = r() * W;
      const speed = 0.5 + r() * 0.7;
      const y = ((t * speed + r() * 2000) % 1500) + 330;
      c.beginPath();
      c.moveTo(x0, y);
      c.lineTo(x0 - 18, y + 62);
      c.stroke();
    }
  },
  river(c, t) {
    skyGradient(c, "#9bd6ee", "#f1f8f4");
    hill(c, "#78bf7b", 1190, 45, 2);
    c.fillStyle = "#4e9a55";
    c.fillRect(0, GROUND_Y, W, H);
    c.fillStyle = "#4aa3df";
    c.beginPath();
    c.moveTo(0, 1500);
    for (let x = 0; x <= W; x += 20) c.lineTo(x, 1500 + Math.sin(x / 120 + t / 600) * 14);
    c.lineTo(W, H);
    c.lineTo(0, H);
    c.closePath();
    c.fill();
    c.strokeStyle = "rgba(255,255,255,0.5)";
    c.lineWidth = 6;
    for (let k = 0; k < 4; k++) {
      c.beginPath();
      for (let x = 0; x <= W; x += 20) c.lineTo(x, 1560 + k * 90 + Math.sin(x / 90 + t / 500 + k) * 10);
      c.stroke();
    }
  },
  village(c) {
    skyGradient(c, "#9fd3ee", "#fbeed8");
    hill(c, "#8cc98a", 1120, 60, 1);
    for (const [x, w] of [[140, 130], [420, 150], [740, 120], [930, 110]] as const) {
      rrect(c, x, 1090, w, 100, 6, "#e6d3ad");
      c.fillStyle = "#b5523b";
      c.beginPath();
      c.moveTo(x - 14, 1096);
      c.lineTo(x + w / 2, 1030);
      c.lineTo(x + w + 14, 1096);
      c.closePath();
      c.fill();
    }
    hill(c, "#6fb273", 1290, 40, 3);
    c.fillStyle = "#5aa060";
    c.fillRect(0, GROUND_Y, W, H);
    rows(c, "#478a4c");
  },
  city(c, _t, seed) {
    skyGradient(c, "#1f2a44", "#6f86b8");
    const r = rng(seed + 3);
    let x = -20;
    while (x < W) {
      const w = 90 + r() * 90;
      const h = 380 + r() * 520;
      rrect(c, x, GROUND_Y - h, w, h + 40, 4, ["#2b3552", "#34406a", "#263049"][Math.floor(r() * 3)]);
      for (let wy = GROUND_Y - h + 30; wy < GROUND_Y - 30; wy += 54) for (let wx = x + 14; wx < x + w - 24; wx += 34) if (r() > 0.45) rrect(c, wx, wy, 18, 26, 3, r() > 0.3 ? "#ffe9a8" : "#5e6f9c");
      x += w + 8;
    }
    c.fillStyle = "#1a2238";
    c.fillRect(0, GROUND_Y, W, H);
    c.fillStyle = "#2b3552";
    c.fillRect(0, GROUND_Y + 130, W, 16);
  },
  room(c) {
    c.fillStyle = "#f0e4cf";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#c9a56f";
    c.fillRect(0, GROUND_Y - 40, W, H);
    rrect(c, 640, 260, 300, 340, 14, "#9ad0f5");
    c.strokeStyle = "#8a6a3e";
    c.lineWidth = 14;
    c.strokeRect(640, 260, 300, 340);
    c.beginPath();
    c.moveTo(790, 260);
    c.lineTo(790, 600);
    c.moveTo(640, 430);
    c.lineTo(940, 430);
    c.stroke();
    rrect(c, 110, 420, 230, 160, 10, "#d9bf91");
    disc(c, 225, 500, 50, "#f2b16c");
  },
  mountain(c) {
    skyGradient(c, "#7fb8e8", "#f4f1e6");
    for (const [x, h, col] of [[200, 700, "#6b7f9c"], [560, 900, "#5b6f8f"], [900, 640, "#6b7f9c"]] as const) {
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(x - 420, GROUND_Y);
      c.lineTo(x, GROUND_Y - h);
      c.lineTo(x + 420, GROUND_Y);
      c.closePath();
      c.fill();
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.moveTo(x - 90, GROUND_Y - h + 125);
      c.lineTo(x, GROUND_Y - h);
      c.lineTo(x + 90, GROUND_Y - h + 125);
      c.lineTo(x + 30, GROUND_Y - h + 100);
      c.lineTo(x - 20, GROUND_Y - h + 140);
      c.closePath();
      c.fill();
    }
    hill(c, "#5fa563", 1260, 40, 2);
    c.fillStyle = "#4f9457";
    c.fillRect(0, GROUND_Y, W, H);
  },
  abstract(c, t, seed) {
    const r = rng(seed + 1);
    const palettes = [["#2b2d42", "#ef476f", "#ffd166"], ["#14213d", "#fca311", "#4ea8de"], ["#1b4332", "#95d5b2", "#ffb703"], ["#3c096c", "#ff6d00", "#9d4edd"]];
    const pal = palettes[seed % palettes.length];
    c.fillStyle = pal[0];
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i++) {
      const x = r() * W;
      const y = 200 + r() * 1500;
      const rad = 90 + r() * 200;
      c.globalAlpha = 0.16 + r() * 0.2;
      disc(c, x + sw(t, 3000 + i * 400, 18, i * 500), y + sw(t, 2600 + i * 300, 22, i * 300), rad, pal[1 + (i % 2)]);
    }
    c.globalAlpha = 1;
    c.fillStyle = "rgba(0,0,0,0.18)";
    c.fillRect(0, GROUND_Y, W, H);
  },
};

export function drawBackdrop(c: C, kind: Backdrop, tMs: number, seed: number): void {
  BACK[kind](c, tMs, seed);
}
