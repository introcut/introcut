import { layout, sceneAt, type PlacedScene } from "../model/timeline";
import type { MediaItem, Project } from "../model/types";

interface Source {
  project: Project;
  assets: Record<string, { url: string }>;
}

/** Draw `src` filling the whole canvas, cropping the overflow ("cover"). This is the center crop used to make horizontal footage vertical. */
export function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource, sw: number, sh: number) {
  const { width: cw, height: ch } = ctx.canvas;
  const scale = Math.max(cw / sw, ch / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(src, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

/**
 * Plays the project's scenes back to back onto a canvas.
 * Each frame: find the scene at the playhead, line up its video, draw it center-cropped to 9:16.
 * (Milestone 9 grows this into the shared renderFrame used for export too.)
 */
export class Player {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private t = 0;
  private playing = false;
  private activeVideo: string | null = null;
  private videos = new Map<string, HTMLVideoElement>();
  private images = new Map<string, HTMLImageElement>();

  constructor(
    private canvas: HTMLCanvasElement,
    private getSource: () => Source,
    private onTime: (tMs: number, playing: boolean) => void,
  ) {
    this.ctx = canvas.getContext("2d")!;
  }

  get totalMs() {
    return layout(this.getSource().project).totalMs;
  }

  play() {
    const total = this.totalMs;
    if (total === 0) return;
    if (this.t >= total - 20) this.t = 0;
    this.playing = true;
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.tick);
    this.onTime(this.t, true);
  }

  pause() {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.videos.forEach((v) => v.pause());
    this.renderOnce();
    this.onTime(this.t, false);
  }

  seek(ms: number) {
    this.t = Math.min(Math.max(0, ms), this.totalMs);
    this.renderOnce();
    this.onTime(this.t, this.playing);
  }

  /** Call when the project changed (a scene was added, etc.). */
  refresh() {
    this.renderOnce();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.videos.forEach((v) => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    });
    this.videos.clear();
    this.images.clear();
  }

  private tick = (now: number) => {
    if (!this.playing) return;
    this.t += now - this.last;
    this.last = now;
    const total = this.totalMs;
    if (this.t >= total) {
      this.t = total;
      this.playing = false;
      this.videos.forEach((v) => v.pause());
      this.renderFrame();
      this.onTime(this.t, false);
      return;
    }
    this.renderFrame();
    this.onTime(this.t, true);
    this.raf = requestAnimationFrame(this.tick);
  };

  private renderOnce() {
    this.renderFrame();
  }

  private mediaEl(item: MediaItem): HTMLVideoElement | HTMLImageElement | null {
    const url = this.getSource().assets[item.id]?.url;
    if (!url) return null;
    if (item.kind === "photo") {
      let img = this.images.get(item.id);
      if (!img) {
        img = new Image();
        img.onload = () => this.renderOnce();
        img.src = url;
        this.images.set(item.id, img);
      }
      return img;
    }
    if (item.kind === "video") {
      let v = this.videos.get(item.id);
      if (!v) {
        v = document.createElement("video");
        v.playsInline = true;
        v.preload = "auto";
        v.onseeked = () => this.renderOnce();
        v.onloadeddata = () => this.renderOnce();
        v.src = url;
        this.videos.set(item.id, v);
      }
      return v;
    }
    return null;
  }

  private renderFrame() {
    const { ctx, canvas } = this;
    const { project } = this.getSource();
    const { placed } = layout(project);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const p = sceneAt(placed, this.t);
    if (!p) {
      this.drawHint("Add media, then press \"Add to timeline\"");
      return;
    }
    const item = project.media.find((m) => m.id === p.scene.source.mediaId);
    const el = item ? this.mediaEl(item) : null;
    if (!item || !el) return;

    if (el instanceof HTMLVideoElement) {
      this.syncVideo(el, item.id, p);
      if (el.readyState >= 2) drawCover(ctx, el, el.videoWidth, el.videoHeight);
    } else if (el.complete && el.naturalWidth > 0) {
      this.stopOtherVideo(null);
      drawCover(ctx, el, el.naturalWidth, el.naturalHeight);
    }
  }

  private stopOtherVideo(keepId: string | null) {
    if (this.activeVideo && this.activeVideo !== keepId) this.videos.get(this.activeVideo)?.pause();
    this.activeVideo = keepId;
  }

  /** Keep the <video> element at the right moment of the clip; let it play on its own while playing, to keep sound smooth. */
  private syncVideo(el: HTMLVideoElement, mediaId: string, p: PlacedScene) {
    this.stopOtherVideo(mediaId);
    const target = (p.scene.source.inMs + (this.t - p.startMs)) / 1000;
    const drift = Math.abs(el.currentTime - target);
    if (this.playing) {
      if (drift > 0.3) el.currentTime = target;
      if (el.paused) void el.play().catch(() => undefined);
    } else {
      el.pause();
      if (drift > 0.04) el.currentTime = target;
    }
  }

  private drawHint(text: string) {
    const { ctx, canvas } = this;
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "center";
    ctx.font = `${Math.round(canvas.width / 18)}px system-ui, sans-serif`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width * 0.85);
  }
}
