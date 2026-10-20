import { useStore } from "../store/useStore";
import { Icon } from "./Icon";
import { useUi, type View } from "./uiStore";

const TABS: { view: View; label: string }[] = [
  { view: "overview", label: "Overview" },
  { view: "board", label: "Board" },
  { view: "timeline", label: "Timeline" },
];

/** Shown inside a project: back to Projects, the name, the three views, undo/redo, Export. */
export function TopBar() {
  const name = useStore((s) => s.project.name);
  const canUndo = useStore((s) => s.history.past.length > 0);
  const canRedo = useStore((s) => s.history.future.length > 0);
  const view = useUi((s) => s.view);
  const { undo, redo, dispatch } = useStore.getState();
  const { go, openSheet } = useUi.getState();

  return (
    <header className="topbar">
      <button
        className="text sm back"
        onClick={async () => {
          await useStore.getState().closeProject();
          go("home");
        }}
      >
        ← Projects
      </button>
      <input
        className="project-name"
        aria-label="Project name"
        value={name}
        onChange={(e) => dispatch({ type: "renameProject", name: e.target.value }, { coalesce: "rename" })}
      />
      <span className="seg" role="tablist" aria-label="View">
        {TABS.map((t) => (
          <button key={t.view} role="tab" aria-selected={view === t.view} className={view === t.view ? "on" : ""} onClick={() => go(t.view)}>
            {t.label}
          </button>
        ))}
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
