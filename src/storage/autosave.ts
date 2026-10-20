import { useStore } from "../store/useStore";
import { saveProjectJson } from "./opfs";
import { setPendingFlusher } from "./pending";

const DELAY_MS = 250;

/** Save the open project to browser storage shortly after every change, and immediately when the tab is hidden or closed. */
export function startAutosave() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let chain: Promise<void> = Promise.resolve();
  /** Who the waiting change belongs to, so a later project switch can never write it into the wrong folder. */
  let target: { userKey: string; projectId: string } | null = null;

  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    const t = target;
    target = null;
    chain = chain.then(async () => {
      if (!t) return;
      const { project, userKey, currentId } = useStore.getState();
      if (currentId !== t.projectId || userKey !== t.userKey) return; // already switched away; the switch flushed it first
      try {
        await saveProjectJson(t.userKey, t.projectId, JSON.stringify(project));
        useStore.setState({ save: { status: "saved" } });
        useStore.getState().noteSaved(project);
        void useStore.getState().refreshStorage();
      } catch (e) {
        useStore.setState({ save: { status: "error", message: `Not saved: ${e instanceof Error ? e.message : String(e)}` } });
      }
    });
    return chain;
  };
  setPendingFlusher(() => flush());

  const unsubscribe = useStore.subscribe((state, prev) => {
    if (!state.ready || state.save.status === "unavailable" || state.project === prev.project) return;
    if (!state.userKey || !state.currentId || state.project.id !== state.currentId) return;
    // Opening a different project replaces the object but is not an edit.
    if (state.currentId !== prev.currentId) return;
    target = { userKey: state.userKey, projectId: state.currentId };
    useStore.setState({ save: { status: "saving" } });
    clearTimeout(timer);
    timer = setTimeout(flush, DELAY_MS);
  });

  const onHide = () => {
    if (timer !== undefined && document.visibilityState === "hidden") void flush();
  };
  document.addEventListener("visibilitychange", onHide);
  const onPageHide = () => timer !== undefined && void flush();
  window.addEventListener("pagehide", onPageHide);

  return () => {
    unsubscribe();
    setPendingFlusher(null);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onPageHide);
  };
}
