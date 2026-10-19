import { useStore } from "../store/useStore";

/** Everything in Introcut is this JSON. The preview, and later the export, are drawn from it. */
export function JsonPanel() {
  const project = useStore((s) => s.project);
  return (
    <details className="json panel">
      <summary>Project JSON (this is the whole edit)</summary>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </details>
  );
}
