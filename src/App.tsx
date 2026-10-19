import { JsonPanel } from "./ui/JsonPanel";
import { Preview } from "./ui/Preview";
import { SceneInspector } from "./ui/SceneInspector";
import { Sidebar } from "./ui/Sidebar";
import { Timeline } from "./ui/Timeline";
import { Toolbar } from "./ui/Toolbar";
import { useShortcuts } from "./ui/useShortcuts";

export default function App() {
  useShortcuts();
  return (
    <div className="app">
      <Sidebar />
      <div className="page">
        <Toolbar />
        <main className="bento">
          <Preview />
          <div className="stack">
            <SceneInspector />
            <JsonPanel />
          </div>
        </main>
        <Timeline />
      </div>
    </div>
  );
}
