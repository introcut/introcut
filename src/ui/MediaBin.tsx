import { useRef, useState, type DragEvent } from "react";
import { useStore } from "../store/useStore";
import { aspectLabel, fmtBytes, fmtDur, hints } from "./format";
import { RecorderPanel } from "./RecorderPanel";

export function MediaBin() {
  const media = useStore((s) => s.project.media);
  const scenes = useStore((s) => s.project.scenes);
  const assets = useStore((s) => s.assets);
  const busy = useStore((s) => s.busy);
  const errors = useStore((s) => s.errors);
  const { addFiles, addScene, addAllToTimeline, loadDemo, dismissErrors } = useStore.getState();
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void addFiles([...e.dataTransfer.files]);
  };

  return (
    <aside className="bin">
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
          <h3>Media bin ({media.length})</h3>
          <div className="row">
            <button onClick={() => void loadDemo()}>Load demo</button>
            <button onClick={addAllToTimeline} disabled={media.length === 0}>
              Add all
            </button>
          </div>
        </div>
        {busy > 0 && <p className="muted">Reading {busy} file{busy > 1 ? "s" : ""}…</p>}
        {errors.length > 0 && (
          <div className="error">
            {errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
            <button onClick={dismissErrors}>Dismiss</button>
          </div>
        )}
        {media.length === 0 && busy === 0 && <p className="muted">Nothing yet. Drop files, record, or load the demo.</p>}
        <ul className="items">
          {media.map((m) => {
            const p = m.probe;
            const used = scenes.some((s) => s.source.mediaId === m.id);
            const thumb = assets[m.id]?.thumb;
            return (
              <li key={m.id} className="item">
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
                  {hints(m).map((h) => (
                    <div key={h} className="hint">
                      {h}
                    </div>
                  ))}
                </div>
                <button disabled={m.kind === "audio"} onClick={() => addScene(m.id)} title={m.kind === "audio" ? "Audio tracks are used from Milestone 6" : ""}>
                  {used ? "+ Again" : "+ Add"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <details className="panel glossary">
        <summary>What do these numbers mean?</summary>
        <p>
          <b>Aspect ratio</b> is the shape of the picture: width to height. Reels, Shorts and TikTok use <b>9:16</b> (tall). Phone
          landscape video is 16:9 (wide); Introcut crops it to the middle so it fills the tall frame.
        </p>
        <p>
          <b>dB (decibels)</b> measure loudness here relative to the loudest possible digital sound, which is 0. Normal speech is around
          −25 to −15 dB on average. Closer to 0 is louder; −35 or lower is very quiet. A peak near 0 means parts may distort (clip).
          This is an average level, not the broadcast LUFS measure we add later.
        </p>
      </details>
    </aside>
  );
}
