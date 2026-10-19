import { useEffect } from "react";
import { useStore } from "../store/useStore";

/** Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo, Delete removes the selected scene. Ignored while typing. */
export function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && (el as HTMLInputElement).type !== "range") || el.isContentEditable);
      if (typing) return;
      const st = useStore.getState();
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();
      if (mod && key === "z") {
        e.preventDefault();
        e.shiftKey ? st.redo() : st.undo();
      } else if (mod && key === "y") {
        e.preventDefault();
        st.redo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && st.selectedSceneId) {
        // Sliders and dropdowns keep focus after use, so don't treat Delete there as "delete the scene".
        if (el && (el.tagName === "SELECT" || el.tagName === "INPUT")) return;
        e.preventDefault();
        st.dispatch({ type: "removeScene", sceneId: st.selectedSceneId });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
