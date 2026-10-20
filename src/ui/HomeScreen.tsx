import { useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { formatName } from "../ai/formats";
import { useStore, type ProjectSummary } from "../store/useStore";
import { useBrain } from "./brainStore";
import { ago } from "./format";
import { Icon } from "./Icon";
import { useUi } from "./uiStore";

/** Home: the one question at the top (like a chat box), and the person's projects below it. */
export function HomeScreen() {
  const project = useStore((s) => s.project);
  const currentId = useStore((s) => s.currentId);
  const projects = useStore((s) => s.projects);
  const busy = useStore((s) => s.busy);
  const [idea, setIdea] = useState("");
  const [menu, setMenu] = useState(false);
  const [over, setOver] = useState(false);
  const files = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const { dispatch, addFiles, createProject, openProject } = useStore.getState();
  const { go } = useUi.getState();

  // Attached files belong to a draft project that is created the moment the first file arrives.
  const draftMedia = currentId ? project.media : [];
  const canSend = idea.trim() !== "";

  const send = async () => {
    if (!canSend) return;
    if (!useStore.getState().currentId) await createProject();
    dispatch({ type: "setIdea", idea: idea.trim() });
    dispatch({ type: "renameProject", name: titleFrom(idea) });
    go("verdict");
    void useBrain.getState().assess();
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void addFiles([...e.dataTransfer.files]);
  };
  const onPaste = (e: ClipboardEvent) => {
    const pasted = [...e.clipboardData.files];
    if (pasted.length > 0) void addFiles(pasted);
  };
  const open = async (id: string) => {
    await openProject(id);
    if (useStore.getState().currentId === id) go("overview");
  };

  return (
    <div className="page">
      <div className="home">
        <h1>What's your short about?</h1>
        <div
          className={`composer ${over ? "over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          {(draftMedia.length > 0 || busy > 0) && (
            <ul className="chips">
              {draftMedia.map((m) => (
                <li key={m.id} className="chip">
                  <span className="tag">{m.kind}</span>
                  <span className="chip-name" title={m.name}>
                    {m.name}
                  </span>
                  <button className="icon-btn chip-x" aria-label={`Remove ${m.name}`} onClick={() => dispatch({ type: "removeMedia", mediaId: m.id })}>
                    <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
              {busy > 0 && (
                <li className="chip mute">
                  Reading {busy} file{busy > 1 ? "s" : ""}…
                </li>
              )}
            </ul>
          )}
          <textarea
            aria-label="Your idea"
            placeholder="A monkey teaches how to plant garlic in a paddy field, funny, 30 seconds…"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onPaste={onPaste}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <div className="composer-row">
            <div className="plus-wrap">
              <button className="icon-btn plus" aria-label="Add files" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
                <Icon name="plus" />
              </button>
              {menu && (
                <>
                  <div className="menu-scrim" onClick={() => setMenu(false)} />
                  <div className="menu" role="menu">
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenu(false);
                        files.current?.click();
                      }}
                    >
                      Add photos, clips or audio
                    </button>
                    <button
                      role="menuitem"
                      onClick={async () => {
                        setMenu(false);
                        if (!useStore.getState().currentId) await createProject();
                        if (idea.trim()) dispatch({ type: "setIdea", idea: idea.trim() });
                        go("overview");
                      }}
                    >
                      Record screen, selfie or voice
                    </button>
                  </div>
                </>
              )}
              <input
                ref={files}
                type="file"
                multiple
                hidden
                accept="video/*,image/*,audio/*"
                onChange={(e) => {
                  void addFiles([...(e.target.files ?? [])]);
                  e.target.value = "";
                }}
              />
            </div>
            <ProjectPrefs />
            <span className="sp" />
            <button className="send" aria-label="Send" onClick={() => void send()} disabled={!canSend}>
              <Icon name="arrowUp" />
            </button>
          </div>
        </div>

        <section className="projects">
          <div className="row between projects-head">
            <h2>Your projects</h2>
            <button className="text sm" onClick={() => importInput.current?.click()}>
              Open a project file
            </button>
            <input
              ref={importInput}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f && (await useStore.getState().importProjectFile(f))) go("overview");
              }}
            />
          </div>
          {projects.length === 0 ? (
            <p className="mute">Nothing here yet. Your first idea will appear here as a project, with everything you sent and everything you got back.</p>
          ) : (
            <div className="project-grid">
              {projects
                .filter((p) => p.id !== currentId || p.idea || p.media || p.shots)
                .map((p) => (
                  <ProjectCard key={p.id} p={p} onOpen={() => void open(p.id)} />
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/** Language and length for the project being started. They apply to the draft project, created on first use. */
function ProjectPrefs() {
  const settings = useStore((s) => s.project.settings);
  const apply = (op: Parameters<ReturnType<typeof useStore.getState>["dispatch"]>[0]) => {
    void (async () => {
      if (!useStore.getState().currentId) await useStore.getState().createProject();
      useStore.getState().dispatch(op);
    })();
  };
  return (
    <>
      <select
        className="mini-select"
        aria-label="Language of the video"
        value={settings.language}
        onChange={(e) => apply({ type: "setSettings", language: e.target.value as "en" | "hi" | "ne" })}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="ne">नेपाली</option>
      </select>
      <select
        className="mini-select"
        aria-label="Length"
        value={settings.targetDurationSec}
        onChange={(e) => apply({ type: "setSettings", targetDurationSec: Number(e.target.value) })}
      >
        {[15, 30, 45, 60].map((n) => (
          <option key={n} value={n}>
            {n} s
          </option>
        ))}
      </select>
      <span className="mute">9:16</span>
    </>
  );
}

/** A short project name taken from the first words of the idea. */
export function titleFrom(idea: string): string {
  const words = idea.trim().replace(/\s+/g, " ").split(" ");
  const t = words.slice(0, 6).join(" ");
  return (words.length > 6 ? t + "…" : t).slice(0, 60) || "Untitled";
}

function ProjectCard({ p, onOpen }: { p: ProjectSummary; onOpen: () => void }) {
  const del = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${p.name}" and everything in it from this browser? This cannot be undone.`)) void useStore.getState().deleteProject(p.id);
  };
  return (
    <div className="project-card" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => e.key === "Enter" && onOpen()} aria-label={`Open ${p.name}`}>
      <div className="row between">
        <b className="serif pc-name">{p.name}</b>
        <button className="icon-btn" aria-label={`Delete ${p.name}`} title="Delete project" onClick={del}>
          <Icon name="close" size={16} />
        </button>
      </div>
      <p className="mute pc-idea">{p.idea || "No idea written yet."}</p>
      <div className="pc-pills">
        <span className={`pill ${p.checked ? "ok" : ""}`}>{p.checked ? "checked" : "not checked"}</span>
        {p.formatId && <span className="pill">{formatName(p.formatId)}</span>}
        <span className={`pill ${p.scriptLines > 0 ? "ok" : ""}`}>{p.scriptLines > 0 ? `script · ${p.scriptLines} lines` : "no script"}</span>
        {p.shots > 0 && (
          <span className={`pill ${p.filled === p.shots ? "ok" : "warn"}`}>
            clips {p.filled}/{p.shots}
          </span>
        )}
        <span className="pill">final video: not made</span>
      </div>
      <span className="mute small">{ago(p.updatedAt)}</span>
    </div>
  );
}
