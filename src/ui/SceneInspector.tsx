import { LOCK_KEYS, type LockKey } from "../model/types";
import { layout } from "../model/timeline";
import { MIN_SCENE_MS, PHOTO_MAX_MS } from "../model/ops";
import { useStore } from "../store/useStore";
import { seekTo } from "./Preview";
import { fmtDur } from "./format";
import { Icon } from "./Icon";

const LOCK_LABEL: Record<LockKey, string> = {
  trim: "trim",
  order: "position",
  captions: "captions",
  overlays: "text",
  transition: "transition",
  framing: "framing",
  prompt: "prompt",
};

const sec = (ms: number) => (ms / 1000).toFixed(2);

export function SceneInspector() {
  const project = useStore((s) => s.project);
  const selectedId = useStore((s) => s.selectedSceneId);
  const { dispatch } = useStore.getState();
  const { placed } = layout(project);
  const p = placed.find((x) => x.scene.id === selectedId);

  if (!p) {
    return <div className="inspector mute">Select a scene to trim, move, replace or delete it.</div>;
  }

  const { scene, index } = p;
  const item = project.media.find((m) => m.id === scene.source?.mediaId);
  const src = scene.source;
  const isPhoto = item?.kind === "photo";
  const maxMs = item ? (isPhoto ? PHOTO_MAX_MS : (item.probe.durationMs ?? 60_000)) : 60_000;
  const coalesce = `trim:${scene.id}`;
  const trim = (patch: { inMs?: number; outMs?: number }) => {
    dispatch({ type: "trimScene", sceneId: scene.id, ...patch }, { coalesce });
    // Show the frame you are adjusting.
    const st = useStore.getState().project;
    const q = layout(st).placed.find((x) => x.scene.id === scene.id);
    if (q) seekTo(patch.outMs !== undefined && patch.inMs === undefined ? Math.max(q.startMs, q.endMs - 150) : q.startMs);
  };
  const lockedKeys = LOCK_KEYS.filter((k) => scene.locks[k]);
  const replaceable = project.media.filter((m) => m.kind !== "audio" && m.id !== item?.id);

  return (
    <div className="inspector">
      <div className="row between">
        <h3>
          Scene {index + 1} of {placed.length} · {item?.name ?? "no media"}
        </h3>
        <span className="tag">{scene.provenance.by === "user" ? "edited by you" : "made by AI"}</span>
      </div>

      {src && item && (
        <div className="trim">
          {isPhoto ? (
            <label>
              Shown for <b>{sec(src.outMs)} s</b>
              <input
                type="range"
                min={MIN_SCENE_MS}
                max={15_000}
                step={100}
                value={Math.min(src.outMs, 15_000)}
                onChange={(e) => trim({ outMs: Number(e.target.value) })}
              />
            </label>
          ) : (
            <>
              <label>
                Start <b>{sec(src.inMs)} s</b>
                <input type="range" min={0} max={maxMs} step={50} value={src.inMs} onChange={(e) => trim({ inMs: Number(e.target.value) })} />
              </label>
              <label>
                End <b>{sec(src.outMs)} s</b>
                <input type="range" min={0} max={maxMs} step={50} value={src.outMs} onChange={(e) => trim({ outMs: Number(e.target.value) })} />
              </label>
              <div className="mute">
                Length {fmtDur(src.outMs - src.inMs)} of {fmtDur(item.probe.durationMs)}
              </div>
            </>
          )}
        </div>
      )}

      <div className="row wrap">
        <button className="sm" disabled={index === 0} onClick={() => dispatch({ type: "moveScene", sceneId: scene.id, toIndex: index - 1 })}>
          ← Earlier
        </button>
        <button className="sm" disabled={index === placed.length - 1} onClick={() => dispatch({ type: "moveScene", sceneId: scene.id, toIndex: index + 1 })}>
          Later →
        </button>
        <select
          aria-label="Replace media"
          value=""
          disabled={replaceable.length === 0}
          onChange={(e) => e.target.value && dispatch({ type: "replaceSceneMedia", sceneId: scene.id, mediaId: e.target.value })}
        >
          <option value="">Replace with…</option>
          {replaceable.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <span className="sp" />
        <button className="sm danger" onClick={() => dispatch({ type: "removeScene", sceneId: scene.id })}>
          Delete scene
        </button>
      </div>

      <div className="locks">
        <span className="mute">Locked against AI changes:</span>
        {lockedKeys.length === 0 && <span className="mute"> nothing yet</span>}
        {lockedKeys.map((k) => (
          <button key={k} className="chip" title="Click to unlock" onClick={() => dispatch({ type: "setLock", sceneId: scene.id, lock: k, value: false })}>
            <Icon name="lock" size={12} /> {LOCK_LABEL[k]} ✕
          </button>
        ))}
      </div>
    </div>
  );
}
