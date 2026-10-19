import { useMemo, useState } from "react";
import { layout, fmtTime } from "../model/timeline";
import { useStore } from "../store/useStore";
import { seekTo } from "./Preview";

export function Timeline() {
  const project = useStore((s) => s.project);
  const assets = useStore((s) => s.assets);
  const selected = useStore((s) => s.selectedSceneId);
  const playheadMs = useStore((s) => s.playheadMs);
  const selectScene = useStore((s) => s.selectScene);
  const { placed, totalMs } = useMemo(() => layout(project), [project]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  if (placed.length === 0) {
    return (
      <div className="timeline empty">
        <span className="mute">The timeline is empty. Add material on the Board and the scenes appear here, in playing order.</span>
      </div>
    );
  }

  const drop = (targetIndex: number) => {
    if (dragId) useStore.getState().dispatch({ type: "moveScene", sceneId: dragId, toIndex: targetIndex });
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className="timeline">
      <div className="track">
        {placed.map((p) => {
          const item = project.media.find((m) => m.id === p.scene.source?.mediaId);
          const thumb = item ? assets[item.id]?.thumb : undefined;
          const len = p.endMs - p.startMs;
          const locked = Object.keys(p.scene.locks).length > 0;
          return (
            <button
              key={p.scene.id}
              draggable
              className={`scene ${selected === p.scene.id ? "selected" : ""} ${overId === p.scene.id && dragId !== p.scene.id ? "drop-target" : ""} ${dragId === p.scene.id ? "dragging" : ""}`}
              style={{ flexGrow: len, flexBasis: 0, backgroundImage: thumb ? `url(${thumb})` : undefined }}
              onClick={() => {
                selectScene(p.scene.id);
                seekTo(p.startMs);
              }}
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
              title={`${item?.name ?? "scene"} · ${fmtTime(p.startMs)}–${fmtTime(p.endMs)} · drag to reorder`}
            >
              <span className="label">
                {locked && "🔒 "}
                {p.index + 1}. {item?.name ?? "scene"} <small>{(len / 1000).toFixed(1)}s</small>
              </span>
            </button>
          );
        })}
        <div className="playhead" style={{ left: `${(Math.min(playheadMs, totalMs) / Math.max(1, totalMs)) * 100}%` }} />
      </div>
    </div>
  );
}
