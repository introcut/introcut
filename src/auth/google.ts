// "Sign in with Google" (Google Identity Services). The script is loaded from Google only when the sign-in page opens.
// The client ID is public by design; it is created in Google Cloud Console and put in .env.local as VITE_GOOGLE_CLIENT_ID.

export const GOOGLE_CLIENT_ID: string = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? "";

interface GoogleId {
  initialize(config: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: string }): void;
  renderButton(el: HTMLElement, options: Record<string, unknown>): void;
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  return (loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Couldn't load Google sign-in. Check your internet connection."));
    };
    document.head.appendChild(s);
  }));
}

/** Draw Google's own sign-in button into `el`; `onCredential` gets the ID token when the person signs in. */
export async function renderGoogleButton(el: HTMLElement, onCredential: (credential: string) => void): Promise<void> {
  await loadScript();
  const id = window.google!.accounts.id;
  id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: (r) => onCredential(r.credential) });
  id.renderButton(el, { theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 280 });
}
