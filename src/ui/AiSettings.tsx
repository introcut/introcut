import { useState } from "react";
import { emptyConfig, isConfigured, loadLlmConfig, PRESETS, saveLlmConfig } from "../ai/llm/config";
import { openAiCompatProvider, type OpenAiCompatConfig } from "../ai/llm/openaiCompat";
import { useStore } from "../store/useStore";

/** Choose who thinks: basic rules (no AI) or the user's own AI service. The key stays in this browser, never in the project file. */
export function AiSettings() {
  const mode = useStore((s) => s.project.settings.llm);
  const [config, setConfig] = useState<OpenAiCompatConfig>(() => loadLlmConfig());
  const [models, setModels] = useState<string[]>([]);
  const [test, setTest] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const { dispatch } = useStore.getState();

  const update = (patch: Partial<OpenAiCompatConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    saveLlmConfig(next);
    setTest(null);
  };
  const preset = PRESETS.find((p) => p.baseUrl !== "" && p.baseUrl === config.baseUrl)?.id ?? (config.baseUrl ? "custom" : "");
  const effective = mode === "user-key" ? "user-key" : "rules";

  const runTest = async () => {
    setTesting(true);
    setTest(null);
    try {
      const list = await openAiCompatProvider(config).listModels();
      setModels(list);
      setTest({ ok: true, text: `Connected. ${list.length} model${list.length === 1 ? "" : "s"} available.` });
    } catch (e) {
      setTest({ ok: false, text: e instanceof Error ? e.message : "Couldn't connect." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="ai-settings">
      <div className="lab">Who writes and judges</div>
      <label className="radio">
        <input type="radio" name="llm" checked={effective === "rules"} onChange={() => dispatch({ type: "setSettings", llm: "rules" })} />
        <span>
          <b>Basic mode</b> <span className="mute">No AI. Picks a story format and makes an empty shot list. It can't judge ideas or write lines.</span>
        </span>
      </label>
      <label className="radio">
        <input type="radio" name="llm" checked={effective === "user-key"} onChange={() => dispatch({ type: "setSettings", llm: "user-key" })} />
        <span>
          <b>My own AI</b> <span className="mute">Judges your idea and writes the script. You bring a free account and its key.</span>
        </span>
      </label>
      <label className="radio disabled">
        <input type="radio" name="llm" disabled />
        <span>
          <b>On-device model</b> <span className="mute">Not built yet.</span>
        </span>
      </label>

      {effective === "user-key" && (
        <div className="ai-form">
          <label>
            Service
            <select
              value={preset}
              onChange={(e) => {
                const p = PRESETS.find((x) => x.id === e.target.value);
                if (p) update({ baseUrl: p.baseUrl });
              }}
            >
              <option value="" disabled>
                Choose…
              </option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          {preset && <p className="mute small">{PRESETS.find((p) => p.id === preset)?.note}</p>}
          <label>
            Address
            <input value={config.baseUrl} onChange={(e) => update({ baseUrl: e.target.value.trim() })} placeholder="https://…/v1" spellCheck={false} />
          </label>
          <label>
            Key
            <input type="password" value={config.apiKey} onChange={(e) => update({ apiKey: e.target.value.trim() })} placeholder="paste your key" autoComplete="off" spellCheck={false} />
          </label>
          <label>
            Model
            <input list="llm-models" value={config.model} onChange={(e) => update({ model: e.target.value.trim() })} placeholder="press Test to see the list" spellCheck={false} />
            <datalist id="llm-models">
              {models.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </label>
          <div className="row">
            <button onClick={runTest} disabled={testing || config.baseUrl === ""}>
              {testing ? "Testing…" : "Test connection"}
            </button>
            {test && <span className={test.ok ? "ok-text" : "bad-text"}>{test.text}</span>}
            {!isConfigured(config) && !test && <span className="mute small">Address and model are needed.</span>}
          </div>
          <p className="callout small">
            When you use this, your <b>idea text and the names of your files</b> are sent to this service. Your videos, photos and audio never are. The key is kept in this
            browser only and is not saved in project files. Free limits and terms are set by the service, not by Introcut.
          </p>
          <button className="text sm" onClick={() => { setConfig(emptyConfig()); saveLlmConfig(emptyConfig()); setModels([]); setTest(null); }}>
            Forget this key
          </button>
        </div>
      )}
    </div>
  );
}
