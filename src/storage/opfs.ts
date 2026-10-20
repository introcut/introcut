// Browser storage in the Origin Private File System (OPFS): a private folder on the user's disk that only this site can see.
// Layout:  introcut-v2/u/<userKey>/p/<projectId>/project.json · media/<id> · thumbs/<id>.txt
// Every person (Google account or guest) has their own folder, and every project its own sub-folder.
// Nothing here ever leaves the device.

const ROOT = "introcut-v2";

export const storageAvailable = () => typeof navigator !== "undefined" && typeof navigator.storage?.getDirectory === "function";

/** Folder names must be safe: keep letters, digits, dash and underscore. */
const safe = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "_");

async function dir(userKey: string, projectId: string | null, ...path: string[]): Promise<FileSystemDirectoryHandle> {
  let d = await navigator.storage.getDirectory();
  const parts = projectId === null ? [ROOT, "u", safe(userKey), "p"] : [ROOT, "u", safe(userKey), "p", safe(projectId), ...path];
  for (const p of parts) d = await d.getDirectoryHandle(p, { create: true });
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

// `keys()` isn't in every TypeScript DOM lib yet.
async function names(d: FileSystemDirectoryHandle): Promise<string[]> {
  const out: string[] = [];
  for await (const n of (d as unknown as { keys(): AsyncIterable<string> }).keys()) out.push(n);
  return out;
}

export async function saveProjectJson(userKey: string, projectId: string, json: string) {
  await write(await dir(userKey, projectId), "project.json", json);
}

export async function loadProjectJson(userKey: string, projectId: string): Promise<string | null> {
  return (await readFile(await dir(userKey, projectId), "project.json"))?.text() ?? null;
}

/** Every saved project of this person, as raw JSON text (the store turns it into short summaries). */
export async function listProjectJsons(userKey: string): Promise<{ id: string; json: string }[]> {
  const root = await dir(userKey, null);
  const out: { id: string; json: string }[] = [];
  for (const id of await names(root)) {
    try {
      const sub = await root.getDirectoryHandle(id);
      const f = await readFile(sub, "project.json");
      if (f) out.push({ id, json: await f.text() });
    } catch {
      /* not a project folder */
    }
  }
  return out;
}

export async function deleteProject(userKey: string, projectId: string) {
  const parent = await dir(userKey, null);
  await parent.removeEntry(safe(projectId), { recursive: true }).catch(() => undefined);
}

/** Keep a copy of a project file we couldn't read, instead of silently overwriting it. */
export async function backupBrokenProject(userKey: string, projectId: string, json: string) {
  await write(await dir(userKey, projectId), `project.broken-${Date.now()}.json`, json);
}

export async function saveMediaFile(userKey: string, projectId: string, id: string, file: File) {
  await write(await dir(userKey, projectId, "media"), id, file);
}

export async function loadMediaFile(userKey: string, projectId: string, id: string, name: string, type: string): Promise<File | null> {
  const f = await readFile(await dir(userKey, projectId, "media"), id);
  return f ? new File([f], name, { type }) : null;
}

export async function saveThumb(userKey: string, projectId: string, id: string, dataUrl: string) {
  await write(await dir(userKey, projectId, "thumbs"), `${id}.txt`, dataUrl);
}

export async function loadThumb(userKey: string, projectId: string, id: string): Promise<string | undefined> {
  return (await readFile(await dir(userKey, projectId, "thumbs"), `${id}.txt`))?.text();
}

/** Delete stored media and thumbnails of one project that no media item refers to any more. */
export async function collectGarbage(userKey: string, projectId: string, keepIds: string[]) {
  const keep = new Set(keepIds);
  for (const [sub, idOf] of [
    ["media", (n: string) => n],
    ["thumbs", (n: string) => n.replace(/\.txt$/, "")],
  ] as const) {
    const d = await dir(userKey, projectId, sub);
    for (const n of await names(d)) if (!keep.has(idOf(n))) await d.removeEntry(n).catch(() => undefined);
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
