import { useEffect, useRef, useState } from "react";
import { useGeminiVoiceReady } from "../audio/tts/config";
import { attachVoice, makeGeminiVoice } from "../audio/voiceover";
import { startRecording, type ActiveRecording } from "../media/record";
import { useStore } from "../store/useStore";
import { fmtDur } from "./format";

/** One spoken line of the script: say it yourself, upload a recording, or make a voice with Google (your own key). */
export function VoiceLine({ sceneId, index, beat, text }: { sceneId: string; index: number; beat: string; text: string }) {
  const mediaId = useStore((s) => s.project.script.lines.find((l) => l.sceneId === sceneId)?.audioMediaId);
  const item = useStore((s) => s.project.media.find((m) => m.id === mediaId));
  const url = useStore((s) => (mediaId ? s.assets[mediaId]?.url : undefined));
  const [rec, setRec] = useState<ActiveRecording | null>(null);
  const [secs, setSecs] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upload = useRef<HTMLInputElement>(null);
  const player = useRef<HTMLAudioElement | null>(null);
  const canGenerate = useGeminiVoiceReady();

  useEffect(() => {
    if (!rec) return;
    setSecs(0);
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [rec]);
  useEffect(() => () => player.current?.pause(), []);

  const record = async () => {
    setError(null);
    try {
      const r = await startRecording("voice", { mic: true });
      setRec(r);
      r.result
        .then(async ({ file, durationMs }) => {
          if (!(await attachVoice(sceneId, file, "camera", durationMs))) setError("The recording could not be added.");
        })
        .catch((e) => setError(e instanceof Error ? e.message : String(e)))
        .finally(() => setRec(null));
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(name === "NotAllowedError" ? "Microphone permission was denied. Allow it in the address bar and try again." : name === "NotFoundError" ? "No microphone was found." : String(e));
    }
  };

  const generate = async () => {
    setError(null);
    setBusy(true);
    try {
      await makeGeminiVoice(sceneId);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const play = () => {
    if (!url) return;
    player.current?.pause();
    player.current = new Audio(url);
    void player.current.play();
  };

  return (
    <li className="voice-line">
      <div className="vl-text">
        <span className="mute small">
          {index + 1} · {beat.replace(/-/g, " ") || "shot"}
        </span>
        <span className="serif">“{text}”</span>
      </div>
      <div className="vl-actions">
        {rec ? (
          <button className="go sm" onClick={() => rec.stop()}>
            Stop ({secs}s)
          </button>
        ) : (
          <>
            {item && (
              <button className="text sm" onClick={play} title="Listen">
                ▶ {fmtDur(item.probe.durationMs)}
              </button>
            )}
            <button className="sm" onClick={() => void record()} disabled={busy}>
              {item ? "Re-record" : "Record"}
            </button>
            <button className="sm" onClick={() => upload.current?.click()} disabled={busy}>
              Upload
            </button>
            {canGenerate && (
              <button className="sm" onClick={() => void generate()} disabled={busy}>
                {busy ? "Making…" : "Google voice"}
              </button>
            )}
            <input
              ref={upload}
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void attachVoice(sceneId, f, "unknown").then((id) => !id && setError("That file could not be used as a voice."));
              }}
            />
          </>
        )}
      </div>
      {error && <p className="bad-text small vl-error">{error}</p>}
    </li>
  );
}
