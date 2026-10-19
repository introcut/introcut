import { useRef } from "react";
import { useStore } from "../store/useStore";

export function Toolbar() {
  const name = useStore((s) => s.project.name);
  const canUndo = useStore((s) => s.history.past.length > 0);
  const canRedo = useStore((s) => s.history.future.length > 0);
  const { undo, redo, dispatch, newProject, importProjectFile, exportProject, clearAllData } = useStore.getState();
  const fileInput = useRef<HTMLInputElement>(null);

  const confirmThen = (message: string, action: () => void | Promise<void>) => () => {
    if (window.confirm(message)) void action();
  };

  return (
    <header className="page-head">
      <div>
        <h1>Editor</h1>
        <p>Arrange, trim and preview your 9:16 short.</p>
      </div>
      <div className="head-tools">
        <input
          className="project-name"
          aria-label="Project name"
          value={name}
          onChange={(e) => dispatch({ type: "renameProject", name: e.target.value }, { coalesce: "rename" })}
        />
        <div className="row">
          <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            ↶ Undo
          </button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            ↷ Redo
          </button>
        </div>
        <div className="row">
          <button onClick={confirmThen("Start a new project? The current one is removed from this browser. Export it first if you want to keep it.", newProject)}>New</button>
          <button
            onClick={() => {
              if (window.confirm("Importing replaces the current project in this browser. Continue?")) fileInput.current?.click();
            }}
          >
            Import
          </button>
          <button onClick={exportProject}>Export</button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importProjectFile(f);
              e.target.value = "";
            }}
          />
        </div>
        <button
          title="Delete the project and all media stored in this browser"
          onClick={confirmThen("Delete the project and ALL media stored in this browser? This cannot be undone.", clearAllData)}
        >
          Clear data
        </button>
      </div>
    </header>
  );
}
