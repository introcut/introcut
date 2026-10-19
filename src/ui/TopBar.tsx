import { useStore } from "../store/useStore";
import { Icon } from "./Icon";
import { useUi } from "./uiStore";

/** Shown on the Board and Timeline screens: project name, the two views, undo/redo, Export. */
export function TopBar() {
  const name = useStore((s) => s.project.name);
  const canUndo = useStore((s) => s.history.past.length > 0);
  const canRedo = useStore((s) => s.history.future.length > 0);
  const view = useUi((s) => s.view);
  const { undo, redo, dispatch } = useStore.getState();
  const { go, openSheet } = useUi.getState();

  return (
    <header className="topbar">
      <input
        className="project-name"
        aria-label="Project name"
        value={name}
        onChange={(e) => dispatch({ type: "renameProject", name: e.target.value }, { coalesce: "rename" })}
      />
      <span className="seg" role="tablist" aria-label="View">
        <button role="tab" aria-selected={view === "board"} className={view === "board" ? "on" : ""} onClick={() => go("board")}>
          Board
        </button>
        <button role="tab" aria-selected={view === "timeline"} className={view === "timeline" ? "on" : ""} onClick={() => go("timeline")}>
          Timeline
        </button>
      </span>
      <span className="sp" />
      <button className="icon-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" aria-label="Undo">
        <Icon name="undo" />
      </button>
      <button className="icon-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" aria-label="Redo">
        <Icon name="redo" />
      </button>
      <button className="primary sm" onClick={() => openSheet("export")}>
        Export
      </button>
    </header>
  );
}
