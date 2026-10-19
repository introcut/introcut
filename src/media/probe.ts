import type { MediaKind, MediaProbe } from "../model/types";

// Audio is decoded fully in memory to measure loudness, so very large files are skipped.
const AUDIO_DECODE_LIMIT_BYTES = 300 * 1024 * 1024;

export function kindOf(file: File): MediaKind | null {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "photo";
  if (file.type.startsWith("audio/")) return "audio";
  return null;
}

function timeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([p, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))]);
}

function loadMedia<T extends HTMLVideoElement | HTMLAudioElement>(el: T, url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    el.preload = "metadata";
    el.onloadedmetadata = () => resolve(el);
    el.onerror = () => reject(new Error("The browser can't read this file."));
    el.src = url;
  });
}

/** Move to a time and wait until the browser has actually arrived (or 3 s pass). */
async function seekTo(el: HTMLVideoElement | HTMLAudioElement, sec: number): Promise<void> {
  await timeout(
    new Promise<void>((resolve) => {
      el.onseeked = () => {
        el.onseeked = null;
        resolve();
      };
      el.currentTime = sec;
    }),
    3000,
  );
}

/**
 * Files made by MediaRecorder (our own recordings) are WebM files that don't store their length,
 * so the browser reports Infinity. Seeking to a huge time forces it to scan the file and learn the real length.
 */
async function resolveDurationSec(el: HTMLVideoElement | HTMLAudioElement): Promise<number> {
  if (Number.isFinite(el.duration)) return el.duration;
  await timeout(
    new Promise<void>((resolve) => {
      el.ontimeupdate = () => {
        el.ontimeupdate = null;
        resolve();
      };
      el.currentTime = 1e101;
    }),
    4000,
  );
  const d = el.duration;
  await seekTo(el, 0);
  return d;
}

async function videoThumb(el: HTMLVideoElement): Promise<string | undefined> {
  try {
    await seekTo(el, Math.min(0.1, (Number.isFinite(el.duration) ? el.duration : 1) / 2));
    if (el.readyState < 2) return undefined;
    const w = 160;
    const h = Math.max(1, Math.round((w * el.videoHeight) / el.videoWidth));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(el, 0, 0, w, h);
    return c.toDataURL("image/jpeg", 0.7);
  } catch {
    return undefined;
  }
}

// Decoded audio can overshoot 1.0 a little, so cap at 0 dB.
const toDb = (x: number) => (x <= 1e-5 ? -100 : Math.min(0, 20 * Math.log10(x)));

/** Decode the audio and measure it. Decoding fails for files with no audio track (or an unsupported codec). */
async function measureAudio(file: File) {
  if (file.size > AUDIO_DECODE_LIMIT_BYTES) {
    return { hasAudio: undefined, avgLoudnessDb: null, peakDb: null };
  }
  const ctx = new AudioContext();
  try {
    const buf = await ctx.decodeAudioData(await file.arrayBuffer());
    let sumSq = 0;
    let peak = 0;
    let count = 0;
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        const v = data[i];
        sumSq += v * v;
        const a = Math.abs(v);
        if (a > peak) peak = a;
      }
      count += data.length;
    }
    const rms = Math.sqrt(sumSq / Math.max(1, count));
    return { hasAudio: true, avgLoudnessDb: toDb(rms), peakDb: toDb(peak) };
  } catch {
    return { hasAudio: false, avgLoudnessDb: null, peakDb: null };
  } finally {
    void ctx.close();
  }
}

export interface ProbeResult {
  probe: MediaProbe;
  thumb?: string;
}

export async function probeFile(
  file: File,
  kind: MediaKind,
  url: string,
  durationHintMs?: number,
): Promise<ProbeResult> {
  const base = { sizeBytes: file.size, mime: file.type };

  if (kind === "photo") {
    const bmp = await createImageBitmap(file);
    const probe: MediaProbe = { ...base, width: bmp.width, height: bmp.height };
    bmp.close();
    return { probe, thumb: url };
  }

  if (kind === "audio") {
    const el = await loadMedia(new Audio(), url);
    const sec = await resolveDurationSec(el);
    const a = await measureAudio(file);
    return {
      probe: {
        ...base,
        width: 0,
        height: 0,
        durationMs: Number.isFinite(sec) ? Math.round(sec * 1000) : durationHintMs,
        ...a,
      },
    };
  }

  const el = await loadMedia(document.createElement("video"), url);
  el.muted = true;
  const sec = await resolveDurationSec(el);
  const [a, thumb] = await Promise.all([measureAudio(file), videoThumb(el)]);
  return {
    probe: {
      ...base,
      width: el.videoWidth,
      height: el.videoHeight,
      durationMs: Number.isFinite(sec) ? Math.round(sec * 1000) : durationHintMs,
      ...a,
    },
    thumb,
  };
}
