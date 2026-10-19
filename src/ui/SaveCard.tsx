import { useStore } from "../store/useStore";
import { fmtBytes } from "./format";

const STATUS_TEXT = { loading: "Loading…", saving: "Saving…", saved: "Saved in this browser", error: "Not saved", unavailable: "Not saving" } as const;

export function SaveCard() {
  const save = useStore((s) => s.save);
  const usage = useStore((s) => s.storageInfo.usage);
  return (
    <div className="save-card">
      <span className={`save save-${save.status}`} title={save.message}>
        ● {STATUS_TEXT[save.status]}
        {usage !== undefined && save.status !== "unavailable" ? ` · ${fmtBytes(usage)}` : ""}
      </span>
      {save.message && <span className="error small">{save.message}</span>}
    </div>
  );
}
