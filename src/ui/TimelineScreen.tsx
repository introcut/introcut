import { Preview } from "./Preview";
import { SceneInspector } from "./SceneInspector";
import { Timeline } from "./Timeline";
import { TopBar } from "./TopBar";

export function TimelineScreen() {
  return (
    <div className="page">
      <TopBar />
      <div className="edit">
        <div className="stagebox">
          <Preview />
        </div>
        <div className="inspector-card">
          <SceneInspector />
        </div>
        <Timeline />
      </div>
    </div>
  );
}
