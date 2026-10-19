import { useMemo, useState } from "react";
import { layout } from "../model/timeline";
import { useStore } from "../store/useStore";
import { Icon } from "./Icon";
import { TopBar } from "./TopBar";
import { useUi } from "./uiStore";

/** The one best next step, worked out from what is really in the project. */
function useNext() {
  const media = useStore((s) => s.project.media);
  const scenes = useStore((s) => s.project.scenes);
  const assets = useStore((s) => s.assets);
  const { openSheet, go } = useUi.getState();
  const { addAllToTimeline, loadDemo } = useStore.getState();

  if (media.length === 0)
    return { title: "Next: add your first clip or photo.", sub: "Drop files, record your screen, or try the demo.", label: "Add material", run: () => openSheet("media"), alt: { label: "Try the demo", run: () => void loadDemo() } };
  if (scenes.length === 0)
    return { title: "Next: put your material on the board.", sub: "Each clip or photo becomes a scene you can trim and reorder.", label: "Add all to the board", run: addAllToTimeline };
  if (media.some((m) => !assets[m.id]))
    return { title: "Next: a file is missing.", sub: "Drop the original file into Media and it re-links.", label: "Open media", run: () => openSheet("media") };
  return { title: "Next: check the timeline.", sub: "Preview it, trim scenes and fix the order.", label: "Open timeline", run: () => go("timeline") };
}

export function BoardScreen() {
  const project = useStore((s) => s.project);
  const assets = useStore((s) => s.assets);
  const selected = useStore((s) => s.selectedSceneId);
  const { placed } = useMemo(() => layout(project), [project]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const next = useNext();
  const { selectScene } = useStore.getState();
  const { openSheet } = useUi.getState();

  const drop = (toIndex: number) => {
    if (dragId) useStore.getState().dispatch({ type: "moveScene", sceneId: dragId, toIndex });
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className="page">
      <TopBar />
      <div className="board">
        <div className="next">
          <span className="dot" />
          <div>
            <b>{next.title}</b> <span className="mute">{next.sub}</span>
          </div>
          <span className="sp" />
          {next.alt && (
            <button className="text sm" onClick={next.alt.run}>
              {next.alt.label}
            </button>
          )}
          <button className="go sm" onClick={next.run}>
            {next.label}
          </button>
        </div>

        <div className="scenes">
          {placed.map((p) => {
            const item = project.media.find((m) => m.id === p.scene.source?.mediaId);
            const thumb = item ? assets[item.id]?.thumb : undefined;
            const locked = Object.keys(p.scene.locks).length > 0;
            const isSel = selected === p.scene.id;
            return (
              <div
                key={p.scene.id}
                className={`scene-card ${isSel ? "sel" : ""} ${dragId === p.scene.id ? "dragging" : ""} ${overId === p.scene.id && dragId !== p.scene.id ? "drop-target" : ""}`}
                draggable
                onDragStart={(e) => {
                  setDragId(p.scene.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", p.scene.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(p.scene.id);
                }}
                onDragLeave={() => setOverId((o) => (o === p.scene.id ? null : o))}
                onDrop={(e) => {
                  e.preventDefault();
                  drop(p.index);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
              >
                <button
                  className="th"
                  style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                  onClick={() => {
                    selectScene(p.scene.id);
                    openSheet("scene");
                  }}
                  title={`${item?.name ?? "scene"} · click to open, drag to reorder`}
                  aria-label={`Open scene ${p.index + 1}`}
                >
                  <span className="n">{p.index + 1}</span>
                  {!thumb && <span className="ph">{item?.kind === "video" ? "video" : "no preview"}</span>}
                </button>
                <div className="meta">
                  <span className="pill">{((p.endMs - p.startMs) / 1000).toFixed(1)} s</span>
                  {locked && (
                    <span className="pill ok" title="You edited this scene, so the AI won't change it">
                      <Icon name="lock" size={12} /> yours
                    </span>
                  )}
                  <div className="cap-name">{item?.name ?? "scene"}</div>
                </div>
              </div>
            );
          })}
          <div className="scene-card add">
            <button className="th" onClick={() => openSheet("media")} aria-label="Add a scene">
              <Icon name="plus" size={22} />
              <span className="ph">scene</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
