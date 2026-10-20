import { useEffect } from "react";
import { useAuth } from "./auth/session";
import { useStore } from "./store/useStore";
import { BoardScreen } from "./ui/BoardScreen";
import { ErrorBar } from "./ui/ErrorBar";
import { HomeScreen } from "./ui/HomeScreen";
import { LandingScreen } from "./ui/LandingScreen";
import { OverviewScreen } from "./ui/OverviewScreen";
import { Rail } from "./ui/Rail";
import { Sheets } from "./ui/Sheets";
import { SignInScreen } from "./ui/SignInScreen";
import { TimelineScreen } from "./ui/TimelineScreen";
import { useUi } from "./ui/uiStore";
import { useShortcuts } from "./ui/useShortcuts";
import { VerdictScreen } from "./ui/VerdictScreen";

export default function App() {
  useShortcuts();
  const view = useUi((s) => s.view);
  const railOpen = useUi((s) => s.railOpen);
  const ready = useStore((s) => s.ready);
  const user = useAuth((s) => s.user);

  // A signed-in person gets their own folder of projects loaded; signed out, only the public pages are reachable.
  useEffect(() => {
    if (!ready) return;
    const { go, view: v } = useUi.getState();
    if (user) {
      void useStore.getState().enterUser(user.key);
      if (v === "signin" || v === "landing") go("home");
    } else if (v !== "landing" && v !== "signin") {
      go("landing");
    }
  }, [ready, user]);

  if (!user || view === "landing" || view === "signin") {
    return (
      <>
        {view === "signin" && !user ? <SignInScreen /> : <LandingScreen />}
        <ErrorBar />
      </>
    );
  }

  return (
    <div className={`app ${railOpen ? "rail-open" : ""}`}>
      <Rail />
      <main>
        {view === "home" && <HomeScreen />}
        {view === "overview" && <OverviewScreen />}
        {view === "verdict" && <VerdictScreen />}
        {view === "board" && <BoardScreen />}
        {view === "timeline" && <TimelineScreen />}
      </main>
      <ErrorBar />
      <Sheets />
    </div>
  );
}
