import { useStore } from "../store/useStore";
import { useUi } from "./uiStore";

/** The idea check (readiness, risks, story format) is built in Milestone 3. Until then this screen says so honestly. */
export function VerdictScreen() {
  const idea = useStore((s) => s.project.brief.idea);
  const { go } = useUi.getState();
  return (
    <div className="page">
      <div className="verdict">
        <p className="mute">Introcut's take</p>
        <h1>The idea check isn't built yet.</h1>
        <div className="vcard">
          <div className="lab">Your idea, saved</div>
          <p className="serif idea-quote">{idea || "(nothing written yet)"}</p>
          <p className="mute verdict-note">
            Soon, this page will tell you honestly whether free video tools can pull your idea off. It will name the one biggest risk, suggest a safer plan,
            and pick the story format. Until then, you can go straight to the board and work with your own clips and photos.
          </p>
        </div>
        <div className="row verdict-actions">
          <button className="text" onClick={() => go("start")}>
            ← Edit the idea
          </button>
          <span className="sp" />
          <button className="go" onClick={() => go("board")}>
            Go to the board →
          </button>
        </div>
      </div>
    </div>
  );
}
