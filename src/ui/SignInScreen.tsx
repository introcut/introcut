import { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID, renderGoogleButton } from "../auth/google";
import { useAuth } from "../auth/session";
import { useUi } from "./uiStore";

/** Sign in with Google. Without a configured client ID (a fresh copy of the code), a clearly labelled guest option appears instead. */
export function SignInScreen() {
  const slot = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle, signInAsGuest } = useAuth.getState();
  const { go } = useUi.getState();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !slot.current) return;
    renderGoogleButton(slot.current, (credential) => {
      if (signInWithGoogle(credential)) go("home");
      else setError("Google sent something unexpected. Please try again.");
    }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Couldn't load Google sign-in."));
  }, [signInWithGoogle, go]);

  return (
    <div className="landing">
      <header className="landing-top">
        <span className="logo">
          <span className="slate" />
          Introcut
        </span>
        <button className="text" onClick={() => go("landing")}>
          ← Back
        </button>
      </header>
      <div className="signin">
        <h1>Sign in to Introcut</h1>
        <p className="mute">Your projects are saved under your account on this device.</p>

        {GOOGLE_CLIENT_ID ? (
          <div ref={slot} className="gbtn" aria-label="Sign in with Google" />
        ) : (
          <div className="callout">
            <b>Google sign-in isn't set up in this copy yet.</b>
            <p className="small">
              To turn it on, create a Google "OAuth client ID" (type: Web application) and put it in a file named <code>.env.local</code> as{" "}
              <code>VITE_GOOGLE_CLIENT_ID=…</code>, then restart. Until then you can try Introcut as a guest.
            </p>
            <button
              onClick={() => {
                signInAsGuest();
                go("home");
              }}
            >
              Continue as guest
            </button>
          </div>
        )}
        {error && (
          <p className="bad-text" role="alert">
            {error}
          </p>
        )}
        <p className="mute small">
          Signing in with Google shares your name, e-mail and picture with Introcut so it can show who you are. Introcut never sees your password. Your videos,
          photos and audio stay on this device, and for now your projects are not copied to other devices.
        </p>
      </div>
    </div>
  );
}
