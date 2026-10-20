import { useState } from "react";
import { formatName } from "../ai/formats";
import { useStore } from "../store/useStore";
import { AiSettings } from "./AiSettings";
import { useBrain } from "./brainStore";
import { useUi } from "./uiStore";

const SCORE_LABEL: Record<string, string> = {
  hook: "Hook",
  clarity: "Clarity",
  feasibility: "Doable with free tools",
  novelty: "Fresh",
};
const tone = (n: number) => (n >= 70 ? "ok" : n >= 50 ? "warn" : "bad");

/** Introcut's honest take on the idea (B1-B3): scores with reasons, at most 3 questions, the chosen story format. */
export function VerdictScreen() {
  const project = useStore((s) => s.project);
  const { readiness, format } = project;
  const brain = useBrain();
  const { go, openSheet } = useUi.getState();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAi, setShowAi] = useState(false);

  const missing = readiness?.missing ?? [];
  const busy = brain.status !== "idle";
  const answered = missing.filter((m) => (answers[m.ask] ?? "").trim() !== "");
  const weak = readiness?.overall !== undefined && readiness.overall < 60;
  const language = project.settings.language;

  const recheck = () => {
    const known = project.brief.qa.filter((x) => !answered.some((m) => m.ask === x.q));
    useStore.getState().dispatch({ type: "setQa", qa: [...known, ...answered.map((m) => ({ q: m.ask, a: answers[m.ask].trim() }))] });
    setAnswers({});
    void brain.assess();
  };
  const next = () => {
    if (weak || missing.length > 0) useStore.getState().dispatch({ type: "proceedAnyway" });
    void brain.writeScript();
  };

  return (
    <div className="page">
      <div className="verdict">
        <p className="mute">Introcut's take{brain.brainLabel ? ` · ${brain.brainLabel}` : ""}</p>

        {brain.status === "assessing" && (
          <>
            <h1>Reading your idea…</h1>
            <p className="mute">This can take a few seconds.</p>
            <button className="text" onClick={brain.cancel}>
              Cancel
            </button>
          </>
        )}
        {brain.status === "planning" && (
          <>
            <h1>Writing the script and shot list…</h1>
            <p className="mute">About 10–30 seconds with a free AI.</p>
            <button className="text" onClick={brain.cancel}>
              Cancel
            </button>
          </>
        )}

        {!busy && (
          <>
            <h1>{readiness?.reasons.summary || (readiness ? "Here's where the idea stands." : "Ready to check your idea.")}</h1>
            <div className="vcard">
              <div className="lab">Your idea</div>
              <p className="serif idea-quote">{project.brief.idea || "(nothing written yet)"}</p>
            </div>

            {brain.error && (
              <div className="callout bad verdict-block" role="alert">
                <b>{brain.error}</b>
                <div className="row sheet-row">
                  <button onClick={() => void (readiness ? brain.writeScript() : brain.assess())}>Try again</button>
                  <button className="text" onClick={() => setShowAi(true)}>
                    AI settings
                  </button>
                </div>
              </div>
            )}

            {readiness?.scores ? (
              <div className="vcard verdict-block">
                <div className="lab">How it looks</div>
                {(["hook", "clarity", "feasibility", "novelty"] as const).map((k) => {
                  const n = readiness.scores![k];
                  return (
                    <div key={k} className="score">
                      <div className="score-head">
                        <span>{SCORE_LABEL[k]}</span>
                        <b className={`s-${tone(n)}`}>{n}</b>
                      </div>
                      <div className="bar">
                        <span className={`s-${tone(n)}`} style={{ width: `${n}%` }} />
                      </div>
                      {readiness.reasons[k] && <p className="mute small">{readiness.reasons[k]}</p>}
                    </div>
                  );
                })}
                <p className="mute small">These are the AI's opinion, not a measurement. Scores can be wrong.</p>
              </div>
            ) : (
              readiness && (
                <div className="callout verdict-block">
                  <b>Basic mode can't judge the idea,</b> so there are no scores. Connect your own AI to get an honest check and a written script.
                  <div className="row sheet-row">
                    <button onClick={() => setShowAi(true)}>Connect an AI</button>
                  </div>
                </div>
              )
            )}

            {missing.length > 0 && (
              <div className="vcard verdict-block">
                <div className="lab">It would help to know</div>
                {missing.map((m) => (
                  <label key={m.ask} className="ask-q">
                    <span>{m.ask}</span>
                    <input value={answers[m.ask] ?? ""} onChange={(e) => setAnswers({ ...answers, [m.ask]: e.target.value })} placeholder={m.fixHint} />
                  </label>
                ))}
                <div className="row">
                  <button onClick={recheck} disabled={answered.length === 0}>
                    Check again with my answers
                  </button>
                  <span className="mute small">Or skip: you can continue anyway.</span>
                </div>
              </div>
            )}

            {format && (
              <div className="vcard verdict-block">
                <div className="lab">Story format</div>
                <div className="row between">
                  <b className="serif format-name">{formatName(format.id)}</b>
                  <button className="text sm" onClick={() => void brain.tryAnotherFormat()}>
                    Try another approach
                  </button>
                </div>
                {format.why && <p className="mute">{format.why}</p>}
                {format.beats.length > 0 && (
                  <p className="beats">
                    {format.beats.map((b) => (
                      <span key={b.id} className="pill">
                        {b.kind.replace(/-/g, " ")} · {(b.targetMs / 1000).toFixed(0)} s
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}

            {language !== "en" && (
              <p className="mute small verdict-block">
                {language === "ne" ? "Nepali" : "Hindi"} scripts depend on the AI you connect. Introcut hasn't verified how good they are yet, so read every line before you use it.
              </p>
            )}

            {(showAi || (!readiness && !brain.error)) && (
              <div className="vcard verdict-block">
                <AiSettings />
              </div>
            )}

            <div className="row verdict-actions">
              <button className="text" onClick={() => go("start")}>
                ← Edit the idea
              </button>
              <button className="text" onClick={() => openSheet("settings")}>
                AI settings
              </button>
              <span className="sp" />
              {!readiness ? (
                <button className="go" onClick={() => void brain.assess()} disabled={project.brief.idea.trim() === ""}>
                  Check my idea →
                </button>
              ) : (
                <button className="go" onClick={next}>
                  {weak || missing.length > 0 ? "Continue anyway →" : "Write the script →"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
