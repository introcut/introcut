export type Theme = "light" | "dark";

const KEY = "introcut-theme";
const root = () => document.documentElement;

/** The theme the person picked last time, if any. Storage can be blocked, so this never throws. */
export function savedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Without a saved choice the CSS follows the operating system's light/dark setting. */
export function applyTheme(theme: Theme | null) {
  if (theme) root().dataset.theme = theme;
  else delete root().dataset.theme;
}

export function effectiveTheme(): Theme {
  const forced = root().dataset.theme;
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Not remembered next time; that's fine.
  }
}
