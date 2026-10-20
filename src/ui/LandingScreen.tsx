import { useAuth } from "../auth/session";
import { useUi } from "./uiStore";

/** The public front page: what Introcut is, in a few seconds, and one button. */
export function LandingScreen() {
  const user = useAuth((s) => s.user);
  const { go } = useUi.getState();
  const start = () => go(user ? "home" : "signin");

  return (
    <div className="landing">
      <header className="landing-top">
        <span className="logo">
          <span className="slate" />
          Introcut
        </span>
        <button className="primary" onClick={start}>
          {user ? "Open Introcut" : "Get started"}
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">Free · open source · English, हिन्दी, नेपाली</p>
        <h1>
          Turn an idea into a <em>30‑second short.</em>
        </h1>
        <p className="lede">
          Introcut is your AI producer and editor for vertical videos. Tell it your idea and bring your clips. It checks the idea, writes the script and the shot
          list, tells you which free tool can make each shot, and puts the cut together.
        </p>
        <div className="hero-actions">
          <button className="go big" onClick={start}>
            {user ? "Open Introcut" : "Get started"}
          </button>
        </div>
        <p className="mute small">Early version: the idea check and script writing work today. Making the final video file is the next big step.</p>
      </section>

      <section className="steps">
        <div className="step">
          <span className="n">1</span>
          <h3>Say the idea</h3>
          <p>One sentence is enough. Add screenshots, recordings or your voice if you have them.</p>
        </div>
        <div className="step">
          <span className="n">2</span>
          <h3>Get the plan</h3>
          <p>An honest check, a story format, a script and a shot list for about 30 seconds.</p>
        </div>
        <div className="step">
          <span className="n">3</span>
          <h3>Bring the clips</h3>
          <p>Make shots in free tools, drop them in, and Introcut trims and arranges them.</p>
        </div>
      </section>

      <footer className="landing-foot">
        <span>Your videos stay on your device.</span>
        <a href="https://github.com/introcut/introcut" target="_blank" rel="noreferrer">
          Open source on GitHub
        </a>
      </footer>
    </div>
  );
}
