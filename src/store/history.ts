import type { Project } from "../model/types";

// Undo/redo as plain data so it is easy to test. Projects are never mutated, so a snapshot is just a reference.
const LIMIT = 100;
const COALESCE_MS = 1000;

export interface History {
  past: Project[];
  future: Project[];
  lastKey?: string;
  lastAt: number;
}

export const emptyHistory = (): History => ({ past: [], future: [], lastAt: 0 });

/**
 * Remember `before` so it can be undone. Edits with the same `key` within a second (e.g. dragging a slider)
 * become one undo step.
 */
export function record(h: History, before: Project, key?: string, now = Date.now()): History {
  const merge = !!key && h.lastKey === key && now - h.lastAt < COALESCE_MS && h.past.length > 0;
  return {
    past: merge ? h.past : [...h.past, before].slice(-LIMIT),
    future: [],
    lastKey: key,
    lastAt: now,
  };
}

export function undo(h: History, current: Project): { history: History; project: Project } | null {
  if (h.past.length === 0) return null;
  const project = h.past[h.past.length - 1];
  return { project, history: { past: h.past.slice(0, -1), future: [current, ...h.future], lastAt: 0 } };
}

export function redo(h: History, current: Project): { history: History; project: Project } | null {
  if (h.future.length === 0) return null;
  const [project, ...rest] = h.future;
  return { project, history: { past: [...h.past, current], future: rest, lastAt: 0 } };
}
