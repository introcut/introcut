import { useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { useStore } from "../store/useStore";
import { Icon } from "./Icon";
import { useBrain } from "./brainStore";
import { useUi } from "./uiStore";

/** One prompt box, like a chat app: type the idea, attach material with +, send. */
export function StartScreen() {
  const project = useStore((s) => s.project);
  const busy = useStore((s) => s.busy);
  const [idea, setIdea] = useState(project.brief.idea);
  const [menu, setMenu] = useState(false);
  const [over, setOver] = useState(false);
  const files = useRef<HTMLInputElement>(null);
  const { dispatch, addFiles } = useStore.getState();
  const { go, openSheet } = useUi.getState();

  const canSend = idea.trim() !== "";
  const send = () => {
    if (!canSend) return;
    dispatch({ type: "setIdea", idea: idea.trim() });
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
  const hasWork = project.scenes.length > 0 || project.media.length > 0 || project.brief.idea !== "";

  return (
    <div className="page">
      <div className="start">
        <span className="logo">
          <span className="slate" />
          Introcut
        </span>
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
          {(project.media.length > 0 || busy > 0) && (
            <ul className="chips">
              {project.media.map((m) => (
                <li key={m.id} className="chip">
                  <span className="tag">{m.kind}</span>
                  <span className="chip-name" title={m.name}>{m.name}</span>
                  <button
                    className="icon-btn chip-x"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => dispatch({ type: "removeMedia", mediaId: m.id })}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
              {busy > 0 && <li className="chip mute">Reading {busy} file{busy > 1 ? "s" : ""}…</li>}
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
                send();
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
                      onClick={() => {
                        setMenu(false);
                        openSheet("media");
                        go("board");
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
            <select
              className="mini-select"
              aria-label="Language of the video"
              value={project.settings.language}
              onChange={(e) => dispatch({ type: "setSettings", language: e.target.value as "en" | "hi" | "ne" })}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ne">नेपाली</option>
            </select>
            <select
              className="mini-select"
              aria-label="Length"
              value={project.settings.targetDurationSec}
              onChange={(e) => dispatch({ type: "setSettings", targetDurationSec: Number(e.target.value) })}
            >
              {[15, 30, 45, 60].map((n) => (
                <option key={n} value={n}>
                  {n} s
                </option>
              ))}
            </select>
            <span className="mute">9:16</span>
            <span className="sp" />
            <button className="send" aria-label="Send" onClick={send} disabled={!canSend}>
              <Icon name="arrowUp" />
            </button>
          </div>
        </div>
        {hasWork && (
          <div className="recent-list">
            <button className="recent" onClick={() => go("board")}>
              <b>{project.name}</b>
              <span className="pill">
                {project.scenes.length} scene{project.scenes.length === 1 ? "" : "s"}
              </span>
              <span className="sp" />
              <span className="mute">open →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
