import { useRef, useState, type DragEvent } from "react";
import { useStore } from "../store/useStore";
import { aspectLabel, fmtBytes, fmtDur, hints } from "./format";
import { RecorderPanel } from "./RecorderPanel";

export function MediaBin() {
  const media = useStore((s) => s.project.media);
  const scenes = useStore((s) => s.project.scenes);
  const assets = useStore((s) => s.assets);
  const busy = useStore((s) => s.busy);
  const { addFiles, addSceneFromMedia, addAllToTimeline, loadDemo, dispatch } = useStore.getState();
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void addFiles([...e.dataTransfer.files]);
  };

  return (
    <div className="bin">
      <div
        className={`drop ${over ? "over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        onClick={() => input.current?.click()}
      >
        <strong>Drop photos, clips or audio here</strong>
        <span>or click to choose files</span>
        <input
          ref={input}
          type="file"
          multiple
          hidden
          accept="video/*,image/*,audio/*"
          onChange={(e) => {
            void addFiles([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
      </div>

      <RecorderPanel />

      <div className="panel">
        <div className="row between">
          <h3>Your files ({media.length})</h3>
          <div className="row">
            <button className="sm" onClick={() => void loadDemo()}>Load demo</button>
            <button className="sm" onClick={addAllToTimeline} disabled={media.length === 0}>
              Add all
            </button>
          </div>
        </div>
        {busy > 0 && <p className="muted">Reading {busy} file{busy > 1 ? "s" : ""}…</p>}
        {media.length === 0 && busy === 0 && <p className="muted">Nothing yet. Drop files, record, or load the demo.</p>}
        <ul className="items">
          {media.map((m) => {
            const p = m.probe;
            const used = scenes.some((s) => s.source?.mediaId === m.id);
            const thumb = assets[m.id]?.thumb;
            const missing = !assets[m.id];
            return (
              <li key={m.id} className={`item ${missing ? "missing" : ""}`}>
                <div className="thumb">{thumb ? <img src={thumb} alt="" /> : <span>{m.kind === "audio" ? "♪" : "?"}</span>}</div>
                <div className="info">
                  <div className="name" title={m.name}>
                    {m.name}
                  </div>
                  <div className="facts">
                    <span className="tag">{m.kind}</span>
                    {m.origin !== "unknown" && <span className="tag">{m.origin}</span>}
                    {m.kind !== "photo" && <span>{fmtDur(p.durationMs)}</span>}
                    {m.kind !== "audio" && (
                      <span>
                        {p.width}×{p.height} ({aspectLabel(p.width, p.height)})
                      </span>
                    )}
                    <span>{fmtBytes(p.sizeBytes)}</span>
                  </div>
                  {m.kind !== "photo" && (
                    <div className="facts">
                      {p.hasAudio === undefined ? (
                        <span>audio: not measured (large file)</span>
                      ) : p.hasAudio ? (
                        <span>
                          audio: avg {p.avgLoudnessDb?.toFixed(1)} dB · peak {p.peakDb?.toFixed(1)} dB
                        </span>
                      ) : (
                        <span>audio: none</span>
                      )}
                    </div>
                  )}
                  {missing && <div className="hint">File missing: drop the original file here to re-link it.</div>}
                  {hints(m).map((h) => (
                    <div key={h} className="hint">
                      {h}
                    </div>
                  ))}
                </div>
                <div className="col">
                  <button
                    className="sm"
                    disabled={m.kind === "audio" || missing}
                    onClick={() => addSceneFromMedia(m.id)}
                    title={m.kind === "audio" ? "Audio tracks are used from Milestone 6" : ""}
                  >
                    {used ? "+ Again" : "+ Add"}
                  </button>
                  <button className="text sm" title="Remove from the project (undo brings it back)" onClick={() => dispatch({ type: "removeMedia", mediaId: m.id })}>
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
