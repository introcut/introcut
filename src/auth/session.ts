// Who is using Introcut. Signing in with Google tells us a name, e-mail and picture; it does NOT sync anything.
// There is no server: the ID token from Google is decoded here only to show who you are, and your projects are kept per person
// in this browser's private storage. (When a server exists, the token must be verified there; here nothing depends on it.)
import { create } from "zustand";

export interface User {
  /** Stable key used to name this person's storage folder. Google's "sub", or "guest". */
  key: string;
  name: string;
  email?: string;
  picture?: string;
  guest?: boolean;
}

const KEY = "introcut.user";

/** Read the profile out of a Google ID token (a JWT). Returns null if it doesn't look like one. */
export function userFromGoogleCredential(jwt: string): User | null {
  try {
    const payload = jwt.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    const p = JSON.parse(json) as { sub?: string; name?: string; email?: string; picture?: string; given_name?: string };
    if (!p.sub) return null;
    return { key: p.sub, name: p.name || p.given_name || p.email || "You", email: p.email, picture: p.picture };
  } catch {
    return null;
  }
}

function load(): User | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const u = JSON.parse(raw) as User;
      if (typeof u.key === "string" && typeof u.name === "string") return u;
    }
  } catch {
    /* blocked or corrupt: treat as signed out */
  }
  return null;
}

function save(u: User | null) {
  try {
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  } catch {
    /* the sign-in just won't be remembered */
  }
}

interface AuthState {
  user: User | null;
  signInWithGoogle: (credential: string) => boolean;
  signInAsGuest: () => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()((set) => ({
  user: load(),
  signInWithGoogle: (credential) => {
    const user = userFromGoogleCredential(credential);
    if (!user) return false;
    save(user);
    set({ user });
    return true;
  },
  signInAsGuest: () => {
    const user: User = { key: "guest", name: "Guest", guest: true };
    save(user);
    set({ user });
  },
  signOut: () => {
    save(null);
    set({ user: null });
  },
}));
