// Browser storage in the Origin Private File System (OPFS): a private folder on the user's disk that only this site can see.
// Layout:  introcut-v1/project.json · media/<id> · thumbs/<id>.txt
// Nothing here ever leaves the device.

const ROOT = "introcut-v1";

export const storageAvailable = () => typeof navigator !== "undefined" && typeof navigator.storage?.getDirectory === "function";

async function dir(...path: string[]): Promise<FileSystemDirectoryHandle> {
  let d = await navigator.storage.getDirectory();
  for (const p of [ROOT, ...path]) d = await d.getDirectoryHandle(p, { create: true });
  return d;
}

async function write(d: FileSystemDirectoryHandle, name: string, data: Blob | string) {
  const handle = await d.getFileHandle(name, { create: true });
  const w = await handle.createWritable();
  try {
    await w.write(data);
  } finally {
    await w.close();
  }
}

async function readFile(d: FileSystemDirectoryHandle, name: string): Promise<File | null> {
  try {
    return await (await d.getFileHandle(name)).getFile();
  } catch {
    return null; // not found
  }
}

export async function saveProjectJson(json: string) {
  await write(await dir(), "project.json", json);
}

export async function loadProjectJson(): Promise<string | null> {
  return (await readFile(await dir(), "project.json"))?.text() ?? null;
}

/** Keep a copy of a project file we couldn't read, instead of silently overwriting it. */
export async function backupBrokenProject(json: string) {
  await write(await dir(), `project.broken-${Date.now()}.json`, json);
}

export async function saveMediaFile(id: string, file: File) {
  await write(await dir("media"), id, file);
}

export async function loadMediaFile(id: string, name: string, type: string): Promise<File | null> {
  const f = await readFile(await dir("media"), id);
  return f ? new File([f], name, { type }) : null;
}

export async function saveThumb(id: string, dataUrl: string) {
  await write(await dir("thumbs"), `${id}.txt`, dataUrl);
}

export async function loadThumb(id: string): Promise<string | undefined> {
  return (await readFile(await dir("thumbs"), `${id}.txt`))?.text();
}

/** Delete stored media and thumbnails that no project media item refers to any more. */
export async function collectGarbage(keepIds: string[]) {
  const keep = new Set(keepIds);
  for (const [sub, idOf] of [
    ["media", (n: string) => n],
    ["thumbs", (n: string) => n.replace(/\.txt$/, "")],
  ] as const) {
    const d = await dir(sub);
    const names: string[] = [];
    // `keys()` isn't in every TypeScript DOM lib yet.
    for await (const name of (d as unknown as { keys(): AsyncIterable<string> }).keys()) names.push(name);
    for (const n of names) if (!keep.has(idOf(n))) await d.removeEntry(n).catch(() => undefined);
  }
}

export async function clearAll() {
  const root = await navigator.storage.getDirectory();
  await root.removeEntry(ROOT, { recursive: true }).catch(() => undefined);
}

export async function estimate(): Promise<{ usage?: number; quota?: number }> {
  try {
    return await navigator.storage.estimate();
  } catch {
    return {};
  }
}

/** Ask the browser not to evict our data when disk space runs low. Harmless if refused. */
export async function requestPersistence() {
  try {
    await navigator.storage.persist?.();
  } catch {
    /* ignore */
  }
}
