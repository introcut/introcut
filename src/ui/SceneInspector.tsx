import { LOCK_KEYS, type LockKey, type Scene } from "../model/types";
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
  script: "script line",
};

const sec = (ms: number) => (ms / 1000).toFixed(2);


type Props = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Edit the words and look of a built-in card (what is shown on screen). */
function CardFields({ scene }: { scene: Scene }) {
  const { dispatch } = useStore.getState();
  const card = scene.card;
  if (!card) return null;
  const props = card.props as Props;
  const set = (patch: Props) => dispatch({ type: "setSceneCard", sceneId: scene.id, card: { template: card.template, props: { ...props, ...patch } } }, { coalesce: "card:" + scene.id });
  const tone = (
    <label className="field">
      Colour
      <select value={str(props.tone) || "ink"} onChange={(e) => set({ tone: e.target.value })}>
        <option value="ink">Dark</option>
        <option value="paper">Light</option>
        <option value="accent">Orange</option>
      </select>
    </label>
  );
  return (
    <>
      {card.template === "hook-text" && (
        <label className="field">
          On the card (one line per row, up to 4)
          <textarea value={Array.isArray(props.lines) ? (props.lines as string[]).join("\n") : ""} onChange={(e) => set({ lines: e.target.value.split("\n").slice(0, 4) })} />
        </label>
      )}
      {card.template === "text-card" && (
        <label className="field">
          On the card
          <textarea value={str(props.text)} onChange={(e) => set({ text: e.target.value.slice(0, 160) })} />
        </label>
      )}
      {card.template === "big-number" && (
        <>
          <label className="field">
            Big number or short phrase
            <input value={str(props.value)} onChange={(e) => set({ value: e.target.value.slice(0, 24) })} />
          </label>
          <label className="field">
            Under it
            <textarea value={str(props.label)} onChange={(e) => set({ label: e.target.value.slice(0, 140) })} />
          </label>
        </>
      )}
      {card.template === "end-card" && (
        <>
          <label className="field">
            Closing line
            <textarea value={str(props.headline)} onChange={(e) => set({ headline: e.target.value.slice(0, 120) })} />
          </label>
          <label className="field">
            Small line under it (optional)
            <input value={str(props.sub)} onChange={(e) => set({ sub: e.target.value.slice(0, 140) || undefined })} />
          </label>
        </>
      )}
      {tone}
    </>
  );
}

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

      <CardFields scene={scene} />
      <label className="field">
        What this shot shows
        <textarea
          value={scene.intent}
          placeholder="Describe the picture for this beat"
          onChange={(e) => dispatch({ type: "setSceneText", sceneId: scene.id, field: "intent", text: e.target.value }, { coalesce: `intent:${scene.id}` })}
        />
      </label>
      <label className="field">
        What is said
        <textarea
          value={project.script.lines.find((l) => l.sceneId === scene.id)?.text ?? ""}
          placeholder="One short line, or leave empty for a silent shot"
          onChange={(e) => dispatch({ type: "setSceneText", sceneId: scene.id, field: "line", text: e.target.value }, { coalesce: `line:${scene.id}` })}
        />
      </label>

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
