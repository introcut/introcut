export type RecordKind = "screen" | "selfie" | "voice";

export interface RecordingResult {
  file: File;
  durationMs: number;
}

export interface ActiveRecording {
  stop: () => void;
  /** Resolves when recording ends, whether via stop() or the browser's own "Stop sharing" button. */
  result: Promise<RecordingResult>;
  /** Live video (screen or camera) for an on-screen monitor; null for voice-only. */
  stream: MediaStream;
}

function pickMime(withVideo: boolean): string | undefined {
  const candidates = withVideo
    ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"]
    : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m));
}

/** Combine several audio tracks (e.g. screen sound + microphone) into one. */
function mixAudio(streams: MediaStream[]): { track: MediaStreamTrack; close: () => void } | null {
  const sources = streams.filter((s) => s.getAudioTracks().length > 0);
  if (sources.length === 0) return null;
  const ctx = new AudioContext();
  const dest = ctx.createMediaStreamDestination();
  for (const s of sources) ctx.createMediaStreamSource(s).connect(dest);
  return { track: dest.stream.getAudioTracks()[0], close: () => void ctx.close() };
}

export async function startRecording(kind: RecordKind, opts: { mic: boolean }): Promise<ActiveRecording> {
  const sources: MediaStream[] = [];
  let videoTracks: MediaStreamTrack[] = [];

  if (kind === "screen") {
    const display = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true });
    sources.push(display);
    videoTracks = display.getVideoTracks();
    if (opts.mic) {
      try {
        sources.push(await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } }));
      } catch {
        // Microphone refused: still record the screen.
      }
    }
  } else if (kind === "selfie") {
    const cam = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } },
      audio: { echoCancellation: true },
    });
    sources.push(cam);
    videoTracks = cam.getVideoTracks();
  } else {
    sources.push(await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } }));
  }

  const mixed = mixAudio(sources);
  const tracks = [...videoTracks, ...(mixed ? [mixed.track] : [])];
  const stream = new MediaStream(tracks);
  const withVideo = videoTracks.length > 0;
  const mime = pickMime(withVideo);
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  const startedAt = performance.now();

  const result = new Promise<RecordingResult>((resolve, reject) => {
    recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    recorder.onerror = () => reject(new Error("Recording failed."));
    recorder.onstop = () => {
      sources.forEach((s) => s.getTracks().forEach((t) => t.stop()));
      mixed?.close();
      const type = recorder.mimeType || mime || (withVideo ? "video/webm" : "audio/webm");
      const ext = type.includes("mp4") ? "mp4" : "webm";
      const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, "-");
      const file = new File(chunks, `${kind}-${stamp}.${ext}`, { type: type.split(";")[0] });
      resolve({ file, durationMs: Math.round(performance.now() - startedAt) });
    };
  });

  const stop = () => recorder.state !== "inactive" && recorder.stop();
  // The browser's own "Stop sharing" bar ends the screen track: finish the recording cleanly.
  videoTracks.forEach((t) => (t.onended = stop));
  recorder.start(1000);

  return { stop, result, stream };
}
