import type { MediaItem, MediaOrigin } from "../model/types";
import { kindOf, probeFile } from "./probe";

export interface Ingested {
  item: MediaItem;
  asset: { url: string; thumb?: string; file: File };
}

/** Turn a File into a MediaItem (the JSON part) plus the browser-only asset (object URL + thumbnail). */
export async function ingestFile(
  file: File,
  origin: MediaOrigin = "unknown",
  durationHintMs?: number,
): Promise<Ingested> {
  const kind = kindOf(file);
  if (!kind) throw new Error(`${file.name}: unsupported file type (${file.type || "unknown"})`);
  const url = URL.createObjectURL(file);
  try {
    const { probe, thumb } = await probeFile(file, kind, url, durationHintMs);
    return {
      item: { id: crypto.randomUUID(), kind, name: file.name, origin, probe },
      asset: { url, thumb, file },
    };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw new Error(`${file.name}: ${e instanceof Error ? e.message : "could not be read"}`);
  }
}
