import { useEffect } from "react";
import { useAuth } from "../auth/session";
import { useStore } from "../store/useStore";
import { AiSettings } from "./AiSettings";
import { Avatar } from "./Avatar";
import { fmtBytes } from "./format";
import { SceneInspector } from "./SceneInspector";
import { useUi, type SheetName } from "./uiStore";

const TITLES: Record<SheetName, string> = { scene: "Scene", export: "Export", account: "Account" };

function SheetHead({ title }: { title: string }) {
  const close = useUi.getState().closeSheet;
  return (
    <div className="sheet-head">
      {title ? <h2>{title}</h2> : <span />}
      <button className="text" onClick={close} aria-label="Close">
        Close
      </button>
    </div>
  );
}

function ExportSheet() {
  const { exportProject } = useStore.getState();
  return (
    <>
      <SheetHead title="Export" />
      <div className="callout">
        <b>Video export isn't built yet.</b> Soon you'll get a ready-to-post 1080×1920 MP4 here, with a title, hashtags and the "AI-generated" reminder.
      </div>
      <div>
        <div className="lab">Project file</div>
        <p className="mute">Save a copy of this project (without the media files). You can open it again from Home.</p>
        <div className="row sheet-row">
          <button className="primary" onClick={exportProject}>
            Export project file
          </button>
        </div>
      </div>
    </>
  );
}

/** Who you are, how Introcut thinks (your own AI or basic mode), and sign out. */
function AccountSheet() {
  const user = useAuth((s) => s.user);
  const usage = useStore((s) => s.storageInfo.usage);
  const quota = useStore((s) => s.storageInfo.quota);
  if (!user) return null;
  const signOut = async () => {
    await useStore.getState().leaveUser();
    useAuth.getState().signOut();
    useUi.getState().go("landing");
  };
  return (
    <>
      <SheetHead title="Account" />
      <div className="who-card">
        <Avatar user={user} size={48} />
        <div>
          <b>{user.name}</b>
          <div className="mute small">{user.email ?? "Guest: projects stay on this device only"}</div>
        </div>
      </div>
      <AiSettings />
      <div>
        <div className="lab">Privacy</div>
        <p className="mute">
          Your videos, photos and audio stay on this device. Only if you connect your own AI, your idea text and file names go to that service.
        </p>
        {usage !== undefined && (
          <p className="mute sheet-row">
            Stored in this browser: {fmtBytes(usage)}
            {quota ? ` of about ${fmtBytes(quota)} available` : ""}.
          </p>
        )}
      </div>
      <div>
        <button onClick={() => void signOut()}>Sign out</button>
        <p className="mute small sheet-row">Signing out keeps your projects on this device. They are there when you sign in again.</p>
      </div>
    </>
  );
}

/** One side sheet for everything secondary. Esc or the dim area closes it. */
export function Sheets() {
  const sheet = useUi((s) => s.sheet);
  const { closeSheet } = useUi.getState();

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, closeSheet]);

  return (
    <>
      <div className={`scrim ${sheet ? "on" : ""}`} onClick={closeSheet} />
      <aside className={`sheet ${sheet ? "on" : ""}`} role="dialog" aria-modal="true" aria-label={sheet ? TITLES[sheet] : undefined} aria-hidden={!sheet}>
        {sheet === "scene" && (
          <>
            <SheetHead title="" />
            <SceneInspector />
          </>
        )}
        {sheet === "export" && <ExportSheet />}
        {sheet === "account" && <AccountSheet />}
      </aside>
    </>
  );
}
