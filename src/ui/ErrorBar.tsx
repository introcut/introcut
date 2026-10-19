import { useStore } from "../store/useStore";

/** Problems worth knowing about (unreadable file, storage full…), shown on every screen until dismissed. */
export function ErrorBar() {
  const errors = useStore((s) => s.errors);
  const save = useStore((s) => s.save);
  const lines = [...errors, ...(save.message ? [save.message] : [])];
  if (lines.length === 0) return null;
  return (
    <div className="error" role="alert">
      <div>
        {lines.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </div>
      {errors.length > 0 && (
        <button className="sm" onClick={useStore.getState().dismissErrors}>
          Dismiss
        </button>
      )}
    </div>
  );
}
