import { useRef, useState } from "react";
import { useStore } from "../store/useStore";
import { useUi } from "./uiStore";

export function StartScreen() {
  const project = useStore((s) => s.project);
  const [idea, setIdea] = useState(project.brief.idea);
  const fileInput = useRef<HTMLInputElement>(null);
  const { dispatch, importProjectFile } = useStore.getState();
  const { go, openSheet } = useUi.getState();

  const check = () => {
    dispatch({ type: "setIdea", idea: idea.trim() });
    go("verdict");
  };
  const bringMaterial = () => {
    dispatch({ type: "setIdea", idea: idea.trim() });
    go("board");
    openSheet("media");
  };
  const hasWork = project.scenes.length > 0 || project.media.length > 0 || project.brief.idea !== "";

  return (
    <div className="page">
      <div className="start">
        <span className="logo">
          <span className="slate" />
          Introcut
        </span>
        <h1>What's your short about?</h1>
        <div className="ask">
          <textarea
            aria-label="Your idea"
            placeholder="A monkey teaches how to plant garlic in a paddy field, funny, 30 seconds…"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <div className="ask-row">
            <span className="mute">Vertical 9:16 · about 30 seconds</span>
            <button className="go" onClick={check} disabled={idea.trim() === ""}>
              Check my idea →
            </button>
          </div>
        </div>
        <p className="alt">
          Already have something?
          <button className="link" onClick={bringMaterial}>my clips</button>
          <button className="link" onClick={bringMaterial}>a screen recording</button>
          <button className="link" onClick={bringMaterial}>photos and screenshots</button>
        </p>
        <p className="alt alt-file">
          <button className="link" onClick={() => fileInput.current?.click()}>
            Open a saved project file
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              await importProjectFile(f);
              const p = useStore.getState().project;
              if (p.scenes.length > 0 || p.media.length > 0) go("board");
            }}
          />
        </p>
        {hasWork && (
          <div className="recent-list">
            <button className="recent" onClick={() => go("board")}>
              <b>{project.name}</b>
              <span className="pill">
                {project.scenes.length} scene{project.scenes.length === 1 ? "" : "s"}
              </span>
              <span className="sp" />
              <span className="mute">open →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
