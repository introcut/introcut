import { useStore } from "../store/useStore";
import { fmtBytes } from "./format";

const STATUS_TEXT = { loading: "Loading…", saving: "Saving…", saved: "Saved in this browser", error: "Not saved", unavailable: "Not saving" } as const;

/** Tiny save indicator. The words hide when the side rail is collapsed; the dot stays. */
export function SaveStatus() {
  const save = useStore((s) => s.save);
  const usage = useStore((s) => s.storageInfo.usage);
  return (
    <span className={`save save-${save.status}`} title={save.message ?? STATUS_TEXT[save.status]}>
      <i className="sdot" />
      <span className="stext">
        {STATUS_TEXT[save.status]}
        {usage !== undefined && save.status !== "unavailable" ? ` · ${fmtBytes(usage)}` : ""}
      </span>
    </span>
  );
}
