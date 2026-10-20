import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { fmtBytes } from "./format";
import { AiSettings } from "./AiSettings";
import { JsonPanel } from "./JsonPanel";
import { MediaBin } from "./MediaBin";
import { SceneInspector } from "./SceneInspector";
import { useUi, type SheetName } from "./uiStore";

const TITLES: Record<SheetName, string> = { scene: "Scene", media: "Media", export: "Export", settings: "Settings" };

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
  const fileInput = useRef<HTMLInputElement>(null);
  const { exportProject, importProjectFile } = useStore.getState();
  return (
    <>
      <SheetHead title="Export" />
      <div className="callout">
        <b>Video export isn't built yet.</b> Soon you'll get a ready-to-post 1080×1920 MP4 here, with a title, hashtags and the "AI-generated" reminder.
      </div>
      <div>
        <div className="lab">Project file</div>
        <p className="mute">Save a copy of your project (without the media files), or open one you saved earlier.</p>
        <div className="row sheet-row">
          <button className="primary" onClick={exportProject}>
            Export project file
          </button>
          <button
            onClick={() => {
              if (window.confirm("Opening a project file replaces the current project in this browser. Continue?")) fileInput.current?.click();
            }}
          >
            Open a project file
          </button>
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
      </div>
    </>
  );
}

function SettingsSheet() {
  const usage = useStore((s) => s.storageInfo.usage);
  const quota = useStore((s) => s.storageInfo.quota);
  const store = useStore.getState();
  const startOver = (action: () => Promise<void>) => async () => {
    await action();
    useUi.getState().go("start");
  };
  const { newProject, clearAllData } = { newProject: startOver(store.newProject), clearAllData: startOver(store.clearAllData) };
  const confirmThen = (message: string, action: () => void | Promise<void>) => () => {
    if (window.confirm(message)) void action();
  };
  return (
    <>
      <SheetHead title="Settings" />
      <AiSettings />
      <div>
        <div className="lab">Privacy</div>
        <p className="mute">Your videos, photos and audio stay on this device. Only if you connect your own AI, your idea text and file names go to that service.</p>
        {usage !== undefined && (
          <p className="mute sheet-row">
            Stored in this browser: {fmtBytes(usage)}
            {quota ? ` of about ${fmtBytes(quota)} available` : ""}.
          </p>
        )}
      </div>
      <div>
        <div className="lab">Project</div>
        <div className="row">
          <button
            onClick={confirmThen("Start a new project? The current one is removed from this browser. Export it first if you want to keep it.", newProject)}
          >
            New project
          </button>
          <button
            className="danger"
            title="Delete the project and all media stored in this browser"
            onClick={confirmThen("Delete the project and ALL media stored in this browser? This cannot be undone.", clearAllData)}
          >
            Clear data
          </button>
        </div>
      </div>
      <JsonPanel />
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
        {sheet === "media" && (
          <>
            <SheetHead title="Media" />
            <MediaBin />
          </>
        )}
        {sheet === "export" && <ExportSheet />}
        {sheet === "settings" && <SettingsSheet />}
      </aside>
    </>
  );
}
