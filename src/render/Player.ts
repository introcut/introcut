import { layout, sceneAt, type PlacedScene } from "../model/timeline";
import type { MediaItem, Project } from "../model/types";
import { renderFrame, type RenderAssets } from "./renderFrame";

interface Source {
  project: Project;
  assets: Record<string, { url: string }>;
}

/**
 * Plays the project's scenes back to back onto a canvas.
 * Each frame: find the scene at the playhead, line up its video, then hand the drawing to renderFrame (shared with export).
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
  private voices = new Map<string, HTMLAudioElement>();
  private activeVoice: string | null = null;

  constructor(
    canvas: HTMLCanvasElement,
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
    this.voices.forEach((a) => a.pause());
    this.renderOnce();
    this.onTime(this.t, false);
  }

  seek(ms: number) {
    this.t = Math.min(Math.max(0, ms), this.totalMs);
    this.renderOnce();
    this.onTime(this.t, this.playing);
  }

  /** Call when the project changed (a scene was added, trimmed, deleted…). */
  refresh() {
    const total = this.totalMs;
    if (total === 0 && this.playing) return this.pause();
    if (this.t > total) {
      this.t = total;
      this.onTime(this.t, this.playing);
    }
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
    this.voices.forEach((a) => a.pause());
    this.voices.clear();
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
      this.voices.forEach((a) => a.pause());
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

  private assets: RenderAssets = {
    media: (mediaId) => {
      const item = this.getSource().project.media.find((m) => m.id === mediaId);
      const el = item && this.mediaEl(item);
      if (!el) return null;
      if (el instanceof HTMLVideoElement) return el.readyState >= 2 && el.videoWidth > 0 ? { source: el, width: el.videoWidth, height: el.videoHeight } : null;
      return el.complete && el.naturalWidth > 0 ? { source: el, width: el.naturalWidth, height: el.naturalHeight } : null;
    },
  };

  private renderFrame() {
    const { project } = this.getSource();
    const { placed } = layout(project);
    // Line the current clip's <video> up first, so renderFrame can just draw whatever it shows.
    const p = sceneAt(placed, this.t);
    const item = p && project.media.find((m) => m.id === p.scene.source?.mediaId);
    const el = p && !p.scene.card && item ? this.mediaEl(item) : null;
    if (p && el instanceof HTMLVideoElement) this.syncVideo(el, item!.id, p);
    else this.stopOtherVideo(null);
    this.syncVoice(p);
    renderFrame(this.ctx, project, placed, this.t, this.assets);
  }

  /** Play the current scene's spoken line (if it has one) in step with the playhead. */
  private syncVoice(p: PlacedScene | undefined) {
    const { project, assets } = this.getSource();
    const mediaId = p && project.script.lines.find((l) => l.sceneId === p.scene.id)?.audioMediaId;
    const url = mediaId ? assets[mediaId]?.url : undefined;
    if (this.activeVoice && this.activeVoice !== mediaId) {
      this.voices.get(this.activeVoice)?.pause();
      this.activeVoice = null;
    }
    if (!p || !mediaId || !url) return;
    let a = this.voices.get(mediaId);
    if (!a) {
      a = new Audio(url);
      a.preload = "auto";
      this.voices.set(mediaId, a);
    }
    const target = Math.max(0, (this.t - p.startMs) / 1000);
    if (!this.playing) {
      a.pause();
      return;
    }
    this.activeVoice = mediaId;
    if (Math.abs(a.currentTime - target) > 0.3) a.currentTime = target;
    if (a.paused && target < (a.duration || Infinity)) void a.play().catch(() => undefined);
  }

  private stopOtherVideo(keepId: string | null) {
    if (this.activeVideo && this.activeVideo !== keepId) this.videos.get(this.activeVideo)?.pause();
    this.activeVideo = keepId;
  }

  /** Keep the <video> element at the right moment of the clip; let it play on its own while playing, to keep sound smooth. */
  private syncVideo(el: HTMLVideoElement, mediaId: string, p: PlacedScene) {
    this.stopOtherVideo(mediaId);
    const target = ((p.scene.source?.inMs ?? 0) + (this.t - p.startMs)) / 1000;
    const drift = Math.abs(el.currentTime - target);
    if (this.playing) {
      if (drift > 0.3) el.currentTime = target;
      if (el.paused) void el.play().catch(() => undefined);
    } else {
      el.pause();
      if (drift > 0.04) el.currentTime = target;
    }
  }
}
