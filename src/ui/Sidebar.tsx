import { MediaBin } from "./MediaBin";
import { SaveCard } from "./SaveCard";
import { ThemeToggle } from "./ThemeToggle";

// The steps of the pipeline in docs/PLAN.md that are not built yet; shown so the shape of the app is visible.
const COMING = ["Brief", "Direction", "Analyze"];

export function Sidebar() {
  return (
    <aside className="side">
      <div className="brand-row">
        <span className="logo" aria-hidden="true">
          I
        </span>
        <span className="brand">Introcut</span>
      </div>

      <div className="nav-label">Workspace</div>
      <nav aria-label="Workspace">
        <button className="on" aria-current="page">
          Editor
        </button>
      </nav>

      <div className="nav-label coming">Coming next</div>
      <nav className="coming" aria-label="Coming next">
        {COMING.map((name) => (
          <button key={name} disabled title="Not built yet">
            {name}
            <span className="soon">soon</span>
          </button>
        ))}
      </nav>

      <div className="nav-label">Media</div>
      <MediaBin />

      <div className="side-foot">
        <ThemeToggle />
        <SaveCard />
      </div>
    </aside>
  );
}
