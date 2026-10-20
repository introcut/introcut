// A tiny meeting point so the store can say "finish saving first" before it switches projects,
// without the store and autosave importing each other.
let flusher: (() => Promise<void>) | null = null;

export const setPendingFlusher = (f: (() => Promise<void>) | null) => {
  flusher = f;
};

/** Write any change that is waiting for the autosave timer, and wait until it is on disk. */
export const flushPending = async () => {
  await flusher?.();
};
