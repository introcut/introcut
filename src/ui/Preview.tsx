import { useEffect, useMemo, useRef } from "react";
import { layout, fmtTime } from "../model/timeline";
import { Player } from "../render/Player";
import { useStore } from "../store/useStore";

// The preview is drawn at half the final size (540×960); export will use the full 1080×1920.
const W = 540;
const H = 960;

/** The single Player instance, shared with the timeline so a click there can seek. */
let player: Player | null = null;
export const seekTo = (ms: number) => player?.seek(ms);

export function Preview() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const project = useStore((s) => s.project);
  const playheadMs = useStore((s) => s.playheadMs);
  const playing = useStore((s) => s.playing);
  const totalMs = useMemo(() => layout(project).totalMs, [project]);

  useEffect(() => {
    const p = new Player(
      canvas.current!,
      () => useStore.getState(),
      (t, isPlaying) => {
        const st = useStore.getState();
        st.setPlayhead(t);
        if (st.playing !== isPlaying) st.setPlaying(isPlaying);
      },
    );
    player = p;
    p.refresh();
    return () => {
      p.destroy();
      if (player === p) player = null;
    };
  }, []);

  // Redraw when scenes or media change.
  useEffect(() => {
    player?.refresh();
  }, [project]);

  const toggle = () => (playing ? player?.pause() : player?.play());

  return (
    <section className="preview">
      <div className="phone">
        <canvas ref={canvas} width={W} height={H} />
      </div>
      <div className="controls">
        <button onClick={toggle} disabled={totalMs === 0}>
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(1, totalMs)}
          step={10}
          value={Math.min(playheadMs, totalMs)}
          disabled={totalMs === 0}
          onChange={(e) => player?.seek(Number(e.target.value))}
        />
        <span className="time">
          {fmtTime(playheadMs)} / {fmtTime(totalMs)}
        </span>
      </div>
    </section>
  );
}
