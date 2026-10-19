import { JsonPanel } from "./ui/JsonPanel";
import { MediaBin } from "./ui/MediaBin";
import { Preview } from "./ui/Preview";
import { SceneInspector } from "./ui/SceneInspector";
import { Timeline } from "./ui/Timeline";
import { Toolbar } from "./ui/Toolbar";
import { useShortcuts } from "./ui/useShortcuts";

export default function App() {
  useShortcuts();
  return (
    <div className="app">
      <Toolbar />
      <MediaBin />
      <main>
        <Preview />
        <SceneInspector />
        <JsonPanel />
      </main>
      <Timeline />
    </div>
  );
}
