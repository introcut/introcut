// Subset of the project schema in docs/PLAN.md §5, enough for Milestone 1.
// Milestone 2 replaces this with the full Zod schema and edit operations.

export type MediaKind = "video" | "photo" | "audio";
export type MediaOrigin = "camera" | "screen" | "selfie" | "ai-generated" | "unknown";

/** Facts measured in the browser the moment a file is added (see media/probe.ts). */
export interface MediaProbe {
  durationMs?: number;
  width: number;
  height: number;
  hasAudio?: boolean;
  /** Average loudness in dBFS (0 = digital maximum, quieter is more negative). Not true LUFS. */
  avgLoudnessDb?: number | null;
  /** Loudest single moment in dBFS. */
  peakDb?: number | null;
  sizeBytes: number;
  mime: string;
}

export interface MediaItem {
  id: string;
  kind: MediaKind;
  name: string;
  origin: MediaOrigin;
  probe: MediaProbe;
}

export interface Scene {
  id: string;
  role: "hook" | "body" | "cta";
  type: "user-media";
  source: { mediaId: string; inMs: number; outMs: number };
  provenance: { by: "ai" | "user"; reason?: string };
}

export interface Project {
  version: 2;
  id: string;
  name: string;
  settings: { width: 1080; height: 1920; fps: 30 };
  media: MediaItem[];
  scenes: Scene[];
}

export const PHOTO_DEFAULT_MS = 3000;

export function emptyProject(): Project {
  return {
    version: 2,
    id: crypto.randomUUID(),
    name: "Untitled",
    settings: { width: 1080, height: 1920, fps: 30 },
    media: [],
    scenes: [],
  };
}
