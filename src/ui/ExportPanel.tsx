import { exportProblems } from "../export/exportVideo";
import { useStore } from "../store/useStore";
import { useExport } from "./exportStore";
import { fmtBytes } from "./format";

/** Make the video file (MP4), watch the progress, and download it. Used in the project folder and in the Export sheet. */
export function ExportPanel() {
  const project = useStore((s) => s.project);
  const assets = useStore((s) => s.assets);
  const currentId = useStore((s) => s.currentId);
  const ex = useExport();
  const mine = ex.projectId === currentId;
  const files = Object.fromEntries(Object.entries(assets).map(([id, a]) => [id, a.file]));
  const problems = exportProblems(project, files);
  const running = ex.status === "running" && mine;
  const pct = ex.progress && mine ? Math.round(ex.progress.fraction * 100) : 0;

  return (
    <div className="export-panel">
      {problems.length > 0 && (
        <ul className="problems">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      {!running && (
        <button className="go" onClick={() => void ex.run()} disabled={problems.length > 0 || ex.status === "running"}>
          {ex.status === "done" && mine ? "Make it again" : "Make the video"}
        </button>
      )}

      {running && (
        <div className="progress" role="status">
          <div className="bar">
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="row">
            <span className="mute small">
              {ex.progress?.phase === "video"
                ? `Drawing frame ${ex.progress.frame} of ${ex.progress.totalFrames} (${pct}%)`
                : ex.progress?.phase === "finishing"
                  ? "Finishing the file…"
                  : ex.progress?.phase === "audio"
                    ? "Mixing the sound…"
                    : "Getting ready…"}
            </span>
            <span className="sp" />
            <button className="text sm" onClick={ex.cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {ex.status === "error" && mine && (
        <p className="bad-text" role="alert">
          {ex.error}
        </p>
      )}

      {ex.status === "done" && ex.result && mine && (
        <div className="done">
          <p>
            <b>Your video is ready.</b> 1080×1920, 30 fps, {(ex.result.durationMs / 1000).toFixed(1)} s, {fmtBytes(ex.result.bytes)},{" "}
            {ex.result.videoCodec === "avc" ? "H.264" : "VP9"} video{ex.result.hasAudio ? ` with ${ex.result.audioCodec === "aac" ? "AAC" : "Opus"} sound` : ", no sound"}.
          </p>
          <p className="mute small">
            Made in {ex.result.seconds.toFixed(0)} s on this computer ({ex.result.encodeFps.toFixed(0)} frames per second).
          </p>
          <div className="row">
            <button className="primary" onClick={ex.download}>
              Download MP4
            </button>
          </div>
          {ex.result.warnings.length > 0 && (
            <ul className="problems">
              {ex.result.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
          <p className="callout small">
            <b>Before you post:</b> if your video has AI-made pictures, clips or voices that look or sound real, turn on the platform's "AI-generated" label (YouTube's
            "altered or synthetic content", TikTok's AI label, Instagram's "AI info"). Introcut never removes watermarks.
          </p>
        </div>
      )}
    </div>
  );
}
