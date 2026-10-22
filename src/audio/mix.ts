// Mix everything you hear into ONE stereo audio buffer: each scene's spoken line, and the sound of the user's own video clips.
// Runs faster than real time in an OfflineAudioContext (a Web Audio context that renders to memory instead of the speakers).
import type { Project } from "../model/types";
import { layout } from "../model/timeline";

export const SAMPLE_RATE = 48_000;
/** Decoding a whole video file just to get its sound uses a lot of memory, so very large clips are skipped (and reported). */
const MAX_DECODE_BYTES = 150 * 1024 * 1024;

export interface MixResult {
  buffer: AudioBuffer | null;
  warnings: string[];
}

export async function mixProjectAudio(project: Project, files: Record<string, File>): Promise<MixResult> {
  const { placed, totalMs } = layout(project);
  const warnings: string[] = [];
  const parts: { file: File; atMs: number; offsetMs: number; durMs?: number; gain: number }[] = [];

  for (const p of placed) {
    const line = project.script.lines.find((l) => l.sceneId === p.scene.id);
    const voice = line?.audioMediaId ? files[line.audioMediaId] : undefined;
    if (voice) parts.push({ file: voice, atMs: p.startMs, offsetMs: 0, durMs: p.endMs - p.startMs, gain: 1 });
    else if (line?.audioMediaId) warnings.push(`The voice file for scene ${p.index + 1} is missing, so it is silent.`);

    const src = p.scene.source;
    const item = src && project.media.find((m) => m.id === src.mediaId);
    if (src && item?.kind === "video" && p.scene.audio.useSourceAudio && item.probe.hasAudio !== false) {
      const file = files[item.id];
      if (!file) continue;
      if (file.size > MAX_DECODE_BYTES) warnings.push(`"${item.name}" is too large to mix in the browser, so its sound is left out.`);
      else parts.push({ file, atMs: p.startMs, offsetMs: src.inMs, durMs: src.outMs - src.inMs, gain: p.scene.audio.volume });
    }
  }
  if (parts.length === 0 || totalMs <= 0) return { buffer: null, warnings };

  const length = Math.ceil((totalMs / 1000) * SAMPLE_RATE);
  const ctx = new OfflineAudioContext(2, length, SAMPLE_RATE);
  // Decode each distinct file once.
  const decoded = new Map<File, AudioBuffer | null>();
  for (const part of parts) {
    if (decoded.has(part.file)) continue;
    try {
      decoded.set(part.file, await ctx.decodeAudioData(await part.file.arrayBuffer()));
    } catch {
      decoded.set(part.file, null);
      warnings.push(`"${part.file.name}" has sound this browser can't read, so it is left out.`);
    }
  }
  let used = 0;
  for (const part of parts) {
    const buf = decoded.get(part.file);
    if (!buf) continue;
    const node = ctx.createBufferSource();
    node.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = part.gain;
    node.connect(gain).connect(ctx.destination);
    // Stop at the end of the scene so a long voice line or clip never runs into the next scene.
    node.start(part.atMs / 1000, part.offsetMs / 1000, part.durMs !== undefined ? part.durMs / 1000 : undefined);
    used++;
  }
  if (used === 0) return { buffer: null, warnings };
  return { buffer: await ctx.startRendering(), warnings };
}
