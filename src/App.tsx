import { JsonPanel } from "./ui/JsonPanel";
import { MediaBin } from "./ui/MediaBin";
import { Preview } from "./ui/Preview";
import { Timeline } from "./ui/Timeline";

export default function App() {
  return (
    <div className="app">
      <header>
        <strong>Introcut</strong>
        <span className="muted">Milestone 1 · editor shell · no AI yet</span>
      </header>
      <MediaBin />
      <main>
        <Preview />
        <JsonPanel />
      </main>
      <Timeline />
    </div>
  );
}
