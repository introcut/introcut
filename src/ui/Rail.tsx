import { useAuth } from "../auth/session";
import { useStore } from "../store/useStore";
import { Avatar } from "./Avatar";
import { Icon, type IconName } from "./Icon";
import { useUi } from "./uiStore";

function RailButton({ icon, label, on, onClick }: { icon: IconName; label: string; on?: boolean; onClick: () => void }) {
  return (
    <button className={`rail-btn ${on ? "on" : ""}`} onClick={onClick} title={label} aria-label={label}>
      <Icon name={icon} />
      <span className="t">{label}</span>
    </button>
  );
}

/** Icons only by default; the menu button expands it to show labels and the project list. */
export function Rail() {
  const view = useUi((s) => s.view);
  const sheet = useUi((s) => s.sheet);
  const user = useAuth((s) => s.user);
  const projects = useStore((s) => s.projects);
  const currentId = useStore((s) => s.currentId);
  const { go, openSheet, toggleRail } = useUi.getState();

  const home = async () => {
    await useStore.getState().closeProject();
    go("home");
  };
  const open = async (id: string) => {
    await useStore.getState().openProject(id);
    if (useStore.getState().currentId === id) go("overview");
  };

  return (
    <nav className="rail" aria-label="Main">
      <RailButton icon="menu" label="Introcut" onClick={toggleRail} />
      <RailButton icon="home" label="Home" on={view === "home"} onClick={() => void home()} />

      <div className="rail-projects">
        <div className="lab">Projects</div>
        {projects.length === 0 && <p className="mute small">Nothing yet.</p>}
        {projects.slice(0, 12).map((p) => (
          <button key={p.id} className={`rail-proj ${p.id === currentId ? "on" : ""}`} onClick={() => void open(p.id)} title={p.name}>
            <Icon name="folder" size={16} />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      <span className="grow" />
      {user && (
        <button className={`rail-user ${sheet === "account" ? "on" : ""}`} onClick={() => openSheet("account")} title={user.name} aria-label="Account">
          <Avatar user={user} size={34} />
          <span className="t who">
            <b>{user.name}</b>
            <span className="mute small">{user.email ?? "Guest on this device"}</span>
          </span>
        </button>
      )}
    </nav>
  );
}
