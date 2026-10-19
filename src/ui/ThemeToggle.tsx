import { useEffect, useState } from "react";
import { effectiveTheme, setTheme } from "./theme";

export function ThemeToggle() {
  const [theme, set] = useState(effectiveTheme);

  // While no choice is saved the page follows the OS, so keep the label in step with it.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => set(effectiveTheme());
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="theme-toggle"
      onClick={() => {
        setTheme(next);
        set(next);
      }}
    >
      {next === "light" ? "☀ Light theme" : "☾ Dark theme"}
    </button>
  );
}
