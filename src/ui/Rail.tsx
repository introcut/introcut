import { Icon, type IconName } from "./Icon";
import { SaveStatus } from "./SaveStatus";
import { useUi } from "./uiStore";

function RailButton({ icon, label, on, onClick }: { icon: IconName; label: string; on?: boolean; onClick: () => void }) {
  return (
    <button className={`rail-btn ${on ? "on" : ""}`} onClick={onClick} title={label} aria-label={label}>
      <Icon name={icon} />
      <span className="t">{label}</span>
    </button>
  );
}

/** Collapsed to icons by default; the menu button expands it to show labels. */
export function Rail() {
  const view = useUi((s) => s.view);
  const sheet = useUi((s) => s.sheet);
  const { go, openSheet, toggleRail } = useUi.getState();
  return (
    <nav className="rail" aria-label="Main">
      <RailButton icon="menu" label="Introcut" onClick={toggleRail} />
      <RailButton icon="home" label="Home" on={view === "start"} onClick={() => go("start")} />
      <RailButton icon="media" label="Media" on={sheet === "media"} onClick={() => openSheet("media")} />
      <span className="grow" />
      <RailButton icon="settings" label="Settings" on={sheet === "settings"} onClick={() => openSheet("settings")} />
      <SaveStatus />
    </nav>
  );
}
