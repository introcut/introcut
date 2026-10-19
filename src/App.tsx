import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { BoardScreen } from "./ui/BoardScreen";
import { ErrorBar } from "./ui/ErrorBar";
import { Rail } from "./ui/Rail";
import { Sheets } from "./ui/Sheets";
import { StartScreen } from "./ui/StartScreen";
import { TimelineScreen } from "./ui/TimelineScreen";
import { useUi } from "./ui/uiStore";
import { useShortcuts } from "./ui/useShortcuts";
import { VerdictScreen } from "./ui/VerdictScreen";

export default function App() {
  useShortcuts();
  const view = useUi((s) => s.view);
  const railOpen = useUi((s) => s.railOpen);
  const ready = useStore((s) => s.ready);

  // Once the saved project has loaded, a returning person lands on their board; a new one starts with the question.
  useEffect(() => {
    if (!ready) return;
    const p = useStore.getState().project;
    if (p.scenes.length > 0 || p.media.length > 0) useUi.getState().go("board");
  }, [ready]);

  return (
    <div className={`app ${railOpen ? "rail-open" : ""}`}>
      <Rail />
      <main>
        {view === "start" && <StartScreen />}
        {view === "verdict" && <VerdictScreen />}
        {view === "board" && <BoardScreen />}
        {view === "timeline" && <TimelineScreen />}
      </main>
      <ErrorBar />
      <Sheets />
    </div>
  );
}
