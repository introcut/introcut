import { useEffect, useRef, useState } from "react";
import { startRecording, type ActiveRecording, type RecordKind } from "../media/record";
import type { MediaOrigin } from "../model/types";
import { useStore } from "../store/useStore";

const ORIGIN: Record<RecordKind, MediaOrigin> = { screen: "screen", selfie: "selfie", voice: "camera" };
const LABEL: Record<RecordKind, string> = { screen: "Record screen", selfie: "Record selfie", voice: "Record voice" };

export function RecorderPanel() {
  const addFiles = useStore((s) => s.addFiles);
  const [active, setActive] = useState<{ kind: RecordKind; rec: ActiveRecording } | null>(null);
  const [mic, setMic] = useState(true);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const monitor = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) return;
    setSecs(0);
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (monitor.current) monitor.current.srcObject = active?.rec.stream ?? null;
  }, [active]);

  async function start(kind: RecordKind) {
    setError(null);
    try {
      const rec = await startRecording(kind, { mic });
      setActive({ kind, rec });
      rec.result
        .then(({ file, durationMs }) => addFiles([file], ORIGIN[kind], durationMs))
        .catch((e) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setActive(null));
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError"
          ? "Permission was denied. Allow access in the browser's address bar and try again."
          : name === "NotFoundError"
            ? "No camera or microphone was found."
            : e instanceof Error
              ? e.message
              : String(e),
      );
    }
  }

  return (
    <div className="panel">
      <h3>Record</h3>
      {active ? (
        <div className="recording">
          {active.kind !== "voice" && <video ref={monitor} autoPlay muted playsInline className="monitor" />}
          <div className="row">
            <span className="rec-dot" /> Recording {active.kind}… {secs}s
            <button className="danger" onClick={() => active.rec.stop()}>
              Stop
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="row wrap">
            {(Object.keys(LABEL) as RecordKind[]).map((k) => (
              <button key={k} onClick={() => start(k)}>
                {LABEL[k]}
              </button>
            ))}
          </div>
          <label className="check">
            <input type="checkbox" checked={mic} onChange={(e) => setMic(e.target.checked)} /> Add microphone to screen recordings
          </label>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
