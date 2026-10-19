import { useMemo } from "react";
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

  if (placed.length === 0) {
    return (
      <footer className="timeline empty">
        <span className="muted">Timeline is empty. Add media from the bin and the scenes appear here, in playing order.</span>
      </footer>
    );
  }

  return (
    <footer className="timeline">
      <div className="track">
        {placed.map((p) => {
          const item = project.media.find((m) => m.id === p.scene.source.mediaId);
          const thumb = item ? assets[item.id]?.thumb : undefined;
          const len = p.endMs - p.startMs;
          return (
            <button
              key={p.scene.id}
              className={`scene ${selected === p.scene.id ? "selected" : ""}`}
              style={{ flexGrow: len, flexBasis: 0, backgroundImage: thumb ? `url(${thumb})` : undefined }}
              onClick={() => {
                selectScene(p.scene.id);
                seekTo(p.startMs);
              }}
              title={`${item?.name ?? "scene"} · ${fmtTime(p.startMs)}–${fmtTime(p.endMs)}`}
            >
              <span className="label">
                {p.index + 1}. {item?.name ?? "scene"} <small>{(len / 1000).toFixed(1)}s</small>
              </span>
            </button>
          );
        })}
        <div className="playhead" style={{ left: `${(Math.min(playheadMs, totalMs) / Math.max(1, totalMs)) * 100}%` }} />
      </div>
    </footer>
  );
}
