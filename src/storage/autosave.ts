import { useStore } from "../store/useStore";
import { saveProjectJson } from "./opfs";

const DELAY_MS = 250;

/** Save the project to browser storage shortly after every change, and immediately when the tab is hidden or closed. */
export function startAutosave() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let chain: Promise<void> = Promise.resolve();

  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    chain = chain.then(async () => {
      try {
        await saveProjectJson(JSON.stringify(useStore.getState().project));
        useStore.setState({ save: { status: "saved" } });
        void useStore.getState().refreshStorage();
      } catch (e) {
        useStore.setState({ save: { status: "error", message: `Not saved: ${e instanceof Error ? e.message : String(e)}` } });
      }
    });
  };

  const unsubscribe = useStore.subscribe((state, prev) => {
    if (!state.ready || state.save.status === "unavailable" || state.project === prev.project) return;
    useStore.setState({ save: { status: "saving" } });
    clearTimeout(timer);
    timer = setTimeout(flush, DELAY_MS);
  });

  const onHide = () => {
    if (timer !== undefined && document.visibilityState === "hidden") flush();
  };
  document.addEventListener("visibilitychange", onHide);
  const onPageHide = () => timer !== undefined && flush();
  window.addEventListener("pagehide", onPageHide);

  return () => {
    unsubscribe();
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onPageHide);
  };
}
