import { formatName } from "../ai/formats";
import { useStore } from "../store/useStore";
import { useBrain } from "./brainStore";
import { ExportPanel } from "./ExportPanel";
import { MediaBin } from "./MediaBin";
import { TopBar } from "./TopBar";
import { VoiceLine } from "./VoiceLine";
import { useUi } from "./uiStore";

const SCORE_LABEL = { hook: "Hook", clarity: "Clarity", feasibility: "Doable", novelty: "Fresh" } as const;

/**
 * A project's folder: a record of what you sent, what Introcut said and wrote, the clips, and the final video.
 * It reads from the project file, so it is always true to what is saved.
 */
export function OverviewScreen() {
  const project = useStore((s) => s.project);
  const assets = useStore((s) => s.assets);
  const brain = useBrain();
  const { dispatch } = useStore.getState();
  const { go } = useUi.getState();
  const { readiness, format } = project;
  const shots = project.scenes;
  const filled = shots.filter((s) => s.source || s.card);
  const lineOf = (sceneId: string) => project.script.lines.find((l) => l.sceneId === sceneId)?.text ?? "";
  const scripted = shots.filter((s) => lineOf(s.id).trim() !== "");

  return (
    <div className="page">
      <TopBar />
      <div className="folder">
        <section className="fsec">
          <h2>What you sent</h2>
          <label className="field">
            Your idea
            <textarea
              value={project.brief.idea}
              placeholder="One or two sentences"
              onChange={(e) => dispatch({ type: "setIdea", idea: e.target.value }, { coalesce: "idea" })}
            />
          </label>
          <div className="row prefs">
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
          </div>
          {project.brief.qa.some((x) => x.a) && (
            <div className="qa">
              {project.brief.qa
                .filter((x) => x.a)
                .map((x) => (
                  <p key={x.q} className="small">
                    <span className="mute">{x.q}</span> {x.a}
                  </p>
                ))}
            </div>
          )}
          <MediaBin />
        </section>

        <section className="fsec">
          <h2>Introcut's check</h2>
          {!readiness ? (
            <>
              <p className="mute">Not checked yet.</p>
              <button className="go sm" disabled={project.brief.idea.trim() === "" || brain.status !== "idle"} onClick={() => { go("verdict"); void brain.assess(); }}>
                Check the idea
              </button>
            </>
          ) : (
            <>
              {readiness.reasons.summary && <p className="serif lead">{readiness.reasons.summary}</p>}
              {readiness.scores ? (
                <div className="pc-pills">
                  {(Object.keys(SCORE_LABEL) as (keyof typeof SCORE_LABEL)[]).map((k) => (
                    <span key={k} className="pill">
                      {SCORE_LABEL[k]} {readiness.scores![k]}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mute small">Checked in basic mode: no scores.</p>
              )}
              {format && (
                <p className="small">
                  <b>{formatName(format.id)}.</b> <span className="mute">{format.why}</span>
                </p>
              )}
              <div className="row">
                <button className="text sm" onClick={() => go("verdict")}>
                  See the full check →
                </button>
                <button className="text sm" disabled={brain.status !== "idle"} onClick={() => { go("verdict"); void brain.assess(); }}>
                  Check again
                </button>
              </div>
            </>
          )}
        </section>

        <section className="fsec">
          <h2>Script</h2>
          {scripted.length === 0 ? (
            <>
              <p className="mute">{shots.length > 0 ? "The shot list has no spoken lines yet." : "No script yet."}</p>
              <button className="go sm" onClick={() => (readiness ? void brain.writeScript() : go("verdict"))} disabled={brain.status !== "idle"}>
                {readiness ? "Write the script" : "Check the idea first"}
              </button>
            </>
          ) : (
            <>
              <ol className="script">
                {shots.map((s, i) =>
                  lineOf(s.id).trim() ? <VoiceLine key={s.id} sceneId={s.id} index={i} beat={s.beat} text={lineOf(s.id)} /> : null,
                )}
              </ol>
              <p className="mute small">
                Say each line yourself, upload a recording, or (with your own Google key and a voice model in Account) let Google read it. The scene is
                resized to fit the voice. Caption timing is estimated from the line, not measured.
              </p>
            </>
          )}
          {shots.length > 0 && (
            <button className="text sm" onClick={() => go("board")}>
              Edit on the board →
            </button>
          )}
        </section>

        <section className="fsec">
          <h2>
            Clips{" "}
            {shots.length > 0 && (
              <span className="mute small">
                {filled.length} of {shots.length} shots filled
              </span>
            )}
          </h2>
          {shots.length === 0 ? (
            <p className="mute">No shots yet. They appear when the script is written or when you add your clips to the board.</p>
          ) : (
            <div className="clip-row">
              {shots.map((s, i) => {
                const thumb = s.source ? assets[s.source.mediaId]?.thumb : undefined;
                return (
                  <button key={s.id} className={`clip ${s.source || s.card ? "" : "empty"}`} style={thumb ? { backgroundImage: `url(${thumb})` } : undefined} onClick={() => go("board")} aria-label={`Shot ${i + 1}`}>
                    <span className="n">{i + 1}</span>
                    {s.card ? <span className="ph">card</span> : !s.source && <span className="ph">needs a clip</span>}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="fsec">
          <h2>Final video</h2>
          <ExportPanel />
        </section>
      </div>
    </div>
  );
}
