// Export: draw every frame with the SAME renderFrame the preview uses, encode with the browser's WebCodecs, and write an MP4
// with Mediabunny (MPL-2.0, used unmodified). Everything happens on this computer; nothing is uploaded.
//
// Video concepts, briefly: a video is a list of still pictures (frames), 30 of them per second here. An "encoder" squeezes
// those frames into a small file (H.264 is the codec nearly every phone and platform plays). Audio is squeezed the same way (AAC).
import {
  BlobSource,
  BufferTarget,
  CanvasSink,
  CanvasSource,
  AudioBufferSource,
  Input,
  Mp4OutputFormat,
  Output,
  ALL_FORMATS,
  QUALITY_HIGH,
  getFirstEncodableAudioCodec,
  getFirstEncodableVideoCodec,
  type AudioCodec,
  type VideoCodec,
} from "mediabunny";
import { mixProjectAudio, SAMPLE_RATE } from "../audio/mix";
import { layout, sceneAt } from "../model/timeline";
import type { Project } from "../model/types";
import { ensureFonts } from "../render/fonts";
import { renderFrame, type RenderAssets, type RenderMedia } from "../render/renderFrame";

export const EXPORT_W = 1080;
export const EXPORT_H = 1920;
export const EXPORT_FPS = 30;
/** A photo larger than this on its long side is shrunk once when loaded, to keep memory down. */
const MAX_STILL_PX = 2600;

export interface ExportProgress {
  phase: "preparing" | "audio" | "video" | "finishing";
  /** 0..1 */
  fraction: number;
  frame: number;
  totalFrames: number;
}

export interface ExportResult {
  blob: Blob;
  bytes: number;
  seconds: number;
  /** Frames drawn and encoded per second of wall-clock time. */
  encodeFps: number;
  frames: number;
  durationMs: number;
  videoCodec: VideoCodec;
  audioCodec: AudioCodec | null;
  hasAudio: boolean;
  warnings: string[];
}

/** Why this project can't be exported yet, in plain words. Empty means it can. */
export function exportProblems(project: Project, files: Record<string, File>): string[] {
  const { placed, totalMs } = layout(project);
  const out: string[] = [];
  if (placed.length === 0 || totalMs <= 0) return ["There is nothing to export yet. Add a clip, a photo or a card."];
  for (const p of placed) {
    const s = p.scene;
    if (s.card || s.source) {
      const id = s.source?.mediaId;
      if (id && !files[id]) out.push(`Shot ${p.index + 1}: the file is missing. Add it again under "What you sent".`);
    } else out.push(`Shot ${p.index + 1} has no clip yet.`);
  }
  return out;
}

const yieldToBrowser = () =>
  new Promise<void>((resolve) => {
    const c = new MessageChannel();
    c.port1.onmessage = () => resolve();
    c.port2.postMessage(0);
  });

/** Load every picture and clip a project needs, ready to be drawn frame by frame. Returns the assets and a cleanup function. */
async function prepareMedia(project: Project, files: Record<string, File>, warnings: string[]) {
  const stills = new Map<string, RenderMedia>();
  const videos = new Map<string, { sink: CanvasSink; input: Input; frame: RenderMedia | null }>();
  const used = new Set(project.scenes.map((s) => s.source?.mediaId).filter((x): x is string => !!x));
  for (const id of used) {
    const item = project.media.find((m) => m.id === id);
    const file = files[id];
    if (!item || !file) continue;
    try {
      if (item.kind === "photo") {
        const long = Math.max(item.probe.width, item.probe.height);
        const opts = long > MAX_STILL_PX ? ({ resizeWidth: Math.round((item.probe.width * MAX_STILL_PX) / long), resizeQuality: "high" } as const) : undefined;
        const bmp = await createImageBitmap(file, opts);
        stills.set(id, { source: bmp, width: bmp.width, height: bmp.height });
      } else if (item.kind === "video") {
        const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
        const track = await input.getPrimaryVideoTrack();
        if (!track) throw new Error("no video track");
        videos.set(id, { input, sink: new CanvasSink(track, { width: EXPORT_W, height: EXPORT_H, fit: "cover" }), frame: null });
      }
    } catch (e) {
      warnings.push(`"${item.name}" could not be read for export (${e instanceof Error ? e.message : "unknown error"}).`);
    }
  }
  const assets: RenderAssets = {
    media: (id) => stills.get(id) ?? videos.get(id)?.frame ?? null,
  };
  return {
    assets,
    /** Decode the exact frame of a clip at `seconds` and make it available to renderFrame. */
    async seekVideo(id: string, seconds: number) {
      const v = videos.get(id);
      if (!v) return;
      const w = await v.sink.getCanvas(Math.max(0, seconds));
      if (w) v.frame = { source: w.canvas, width: EXPORT_W, height: EXPORT_H };
    },
    close() {
      for (const s of stills.values()) (s.source as ImageBitmap).close();
      for (const v of videos.values()) v.input.dispose();
    },
  };
}

export async function exportVideo(
  project: Project,
  files: Record<string, File>,
  opts: { onProgress?: (p: ExportProgress) => void; signal?: AbortSignal } = {},
): Promise<ExportResult> {
  const started = performance.now();
  const warnings: string[] = [];
  const { placed, totalMs } = layout(project);
  const totalFrames = Math.max(1, Math.round((totalMs / 1000) * EXPORT_FPS));
  const report = (phase: ExportProgress["phase"], frame: number) =>
    opts.onProgress?.({ phase, frame, totalFrames, fraction: phase === "video" ? frame / totalFrames : phase === "finishing" ? 1 : 0 });
  const aborted = () => {
    if (opts.signal?.aborted) throw new DOMException("Export cancelled", "AbortError");
  };

  report("preparing", 0);
  await ensureFonts();

  const videoCodec = await getFirstEncodableVideoCodec(["avc", "vp9"], { width: EXPORT_W, height: EXPORT_H });
  if (!videoCodec) throw new Error("This browser can't encode video. Try Chrome or Edge on a computer.");
  if (videoCodec !== "avc") warnings.push("This browser can't make H.264, so the video uses VP9. Some apps may not accept it; Chrome or Edge on a computer usually can.");

  const media = await prepareMedia(project, files, warnings);
  try {
    report("audio", 0);
    const mix = await mixProjectAudio(project, files);
    warnings.push(...mix.warnings);
    let audioCodec: AudioCodec | null = null;
    if (mix.buffer) {
      audioCodec = await getFirstEncodableAudioCodec(["aac", "opus"], { numberOfChannels: 2, sampleRate: SAMPLE_RATE });
      if (!audioCodec) {
        warnings.push("This browser can't encode audio, so the video has no sound.");
      } else if (audioCodec !== "aac") {
        warnings.push("This browser can't make AAC audio, so the sound is Opus. Some players and apps may not play it.");
      }
    }
    aborted();

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT_W;
    canvas.height = EXPORT_H;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const target = new BufferTarget();
    const output = new Output({ format: new Mp4OutputFormat({ fastStart: "in-memory" }), target });
    const videoSource = new CanvasSource(canvas, { codec: videoCodec, bitrate: QUALITY_HIGH });
    output.addVideoTrack(videoSource, { frameRate: EXPORT_FPS });
    let audioSource: AudioBufferSource | null = null;
    if (mix.buffer && audioCodec) {
      audioSource = new AudioBufferSource({ codec: audioCodec, bitrate: 160_000 });
      output.addAudioTrack(audioSource);
    }
    await output.start();

    if (audioSource && mix.buffer) await audioSource.add(mix.buffer);

    for (let i = 0; i < totalFrames; i++) {
      aborted();
      const tMs = (i * 1000) / EXPORT_FPS;
      const p = sceneAt(placed, tMs);
      const src = p?.scene.source;
      if (p && src && !p.scene.card) await media.seekVideo(src.mediaId, (src.inMs + (tMs - p.startMs)) / 1000);
      renderFrame(ctx, project, placed, tMs, media.assets);
      // Awaiting `add` also slows us down if the encoder falls behind, which keeps memory bounded.
      await videoSource.add(i / EXPORT_FPS, 1 / EXPORT_FPS);
      if (i % 3 === 0) {
        report("video", i + 1);
        await yieldToBrowser(); // let the page update the progress bar and stay clickable
      }
    }

    report("finishing", totalFrames);
    await output.finalize();
    const buffer = target.buffer;
    if (!buffer) throw new Error("The video file could not be finished.");
    const seconds = (performance.now() - started) / 1000;
    return {
      blob: new Blob([buffer], { type: "video/mp4" }),
      bytes: buffer.byteLength,
      seconds,
      encodeFps: totalFrames / seconds,
      frames: totalFrames,
      durationMs: totalMs,
      videoCodec,
      audioCodec: audioSource ? audioCodec : null,
      hasAudio: !!audioSource,
      warnings,
    };
  } finally {
    media.close();
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
